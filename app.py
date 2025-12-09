"""
基金净值走势可视化工具
用于获取基金历史净值数据并生成可视化图表
"""

import requests
import os
import re
import json
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
from datetime import datetime
from pyecharts import options as opts
from pyecharts.charts import Line
from pyecharts.globals import ThemeType


class FundDataFetcher:
	"""基金数据获取器"""

	# 配置常量
	BASE_URL = "http://api.fund.eastmoney.com/f10/lsjz"
	DEFAULT_HEADERS = {
		'Referer': 'http://fundf10.eastmoney.com/',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
	}
	DEFAULT_PAGE_SIZE = 60  # 默认获取60条数据，约3个月

	@classmethod
	def _generate_callback_string(cls) -> str:
		"""生成回调函数字符串，模拟浏览器请求"""
		timestamp = int(datetime.now().timestamp() * 1000)
		return f"jQuery_{timestamp}_{timestamp + 1000}"

	@classmethod
	def get_fund_nav_data(cls, code: str, page_size: int = DEFAULT_PAGE_SIZE) -> Optional[List[Dict]]:
		"""  
		获取基金净值数据  
  
		Args:         code: 基金代码  
		   page_size: 获取数据条数，默认60条  
  
		Returns:         基金净值数据列表，获取失败返回None  
		"""  # 构造请求参数
		params = {
			'callback': cls._generate_callback_string(),
			'fundCode': code,
			'pageIndex': 1,
			'pageSize': page_size,
			'startDate': '',
			'endDate': '',
			'_': int(datetime.now().timestamp() * 1000)
		}

		try:
			# 发送请求
			response = requests.get(
				cls.BASE_URL,
				params=params,
				headers=cls.DEFAULT_HEADERS,
				timeout=10  # 添加超时设置
			)
			response.raise_for_status()  # 检查HTTP错误

			# 提取JSON数据
			json_str = re.search(r'\((.*?)\)', response.text)
			if not json_str:
				print(f"警告: 无法解析基金 {code} 的返回数据")
				return None

			data = json.loads(json_str.group(1))

			# 检查返回状态
			if data.get("ErrCode") != 0:
				print(f"警告: 获取基金 {code} 数据失败: {data.get('ErrMsg', '未知错误')}")
				return None

			# 返回净值列表
			return data.get("Data", {}).get("LSJZList", [])

		except requests.RequestException as e:
			print(f"网络请求失败 (基金{code}): {str(e)}")
			return None
		except (json.JSONDecodeError, KeyError) as e:
			print(f"数据解析失败 (基金{code}): {str(e)}")
			return None
		except Exception as e:
			print(f"未知错误 (基金{code}): {str(e)}")
			return None


class FundDataProcessor:
	"""基金数据处理器"""

	@staticmethod
	def fetch_multiple_funds_data(fund_codes: List[str]) -> Tuple[Dict[int, str], Dict[str, Dict[int, float]]]:
		"""  
		批量获取多个基金数据并整理格式  
  
		Args:         fund_codes: 基金代码列表  
  
		Returns:         (日期字典, 基金净值字典)  
		   日期字典: {索引: 日期字符串}  
		   基金净值字典: {基金代码: {索引: 净值}}  
		"""
		date_mapping = {}
		fund_data = {code: {} for code in fund_codes}

		for code in fund_codes:
			print(f"正在获取基金 {code} 的数据...")
			data = FundDataFetcher.get_fund_nav_data(code)

			if not data:
				print(f"跳过基金 {code}，数据获取失败")
				continue

			# 反转数据，使时间从早到晚
			for index, item in enumerate(reversed(data)):
				date_str = item.get('FSRQ', '')
				nav_value = item.get('DWJZ', '0')

				# 只记录一次日期（所有基金共享相同的日期索引）
				if index not in date_mapping:
					date_mapping[index] = date_str

				try:
					fund_data[code][index] = float(nav_value)
				except ValueError:
					fund_data[code][index] = 0.0
					print(f"警告: 基金 {code} 第 {index} 天净值格式错误: {nav_value}")

		return date_mapping, fund_data

	@staticmethod
	def calculate_yaxis_range(data_series: pd.Series, margin_ratio: float = 0.08) -> Tuple[float, float]:
		"""  
		计算Y轴显示范围，留出适当边距  
  
		Args:         data_series: 数据序列  
		   margin_ratio: 边距比例，默认8%  
  
		Returns:         (y_max, y_min): Y轴最大值和最小值  
		"""
		if data_series.empty:
			return 1.0, 0.0

		y_max = data_series.max() * (1 + margin_ratio)
		y_min = data_series.min() * (1 - margin_ratio)

		# 确保最小值不为负（对于净值数据）
		y_min = max(y_min, 0)

		return round(y_max, 4), round(y_min, 4)


class FundChartGenerator:
	"""基金图表生成器"""

	# 基金配置：名称与代码的对应关系
	FUND_CONFIG = {
		'沪深300': '510310',
		'中证500': '510500',
		'中证红利': '515180',
		'中证国防': '512670',
		'中证军工': '512660',
		'芯片': '159995',
		'机器人': '562500',
		'人工智能': '515980',
		'5G': '515050',
		'云计算': '516510',
		'恒生指数': '159920',
		'标普500': '513500'
	}

	# 备选基金配置（如果需要切换）
	ALTERNATIVE_FUND_CONFIG = {
		'沪深300': '007339',
		'中证500': '070039',
		'中证红利': '100032',
		'中证国防': '012041',
		'中证军工': '002199',
		'芯片': '008887',
		'机器人': '014881',
		'人工智能': '008082',
		'5G': '008086',
		'云计算': '017854',
		'恒生指数': '164705',
		'标普500': '050025'
	}

	def __init__(self, use_alternative: bool = True):
		"""  
		初始化图表生成器  
  
		Args:         use_alternative: 是否使用备选基金代码  
		"""
		self.fund_config = self.ALTERNATIVE_FUND_CONFIG if use_alternative else self.FUND_CONFIG
		self.fund_names = list(self.fund_config.keys())
		self.fund_codes = list(self.fund_config.values())

	def prepare_chart_data(self) -> Optional[pd.DataFrame]:
		"""  
		准备图表数据  
  
		Returns:         DataFrame格式的基金数据，包含日期和各基金净值  
		"""
		print("正在获取基金数据...")
		date_mapping, fund_data = FundDataProcessor.fetch_multiple_funds_data(self.fund_codes)

		if not date_mapping or not any(fund_data.values()):
			print("错误: 无法获取有效的基金数据")
			return None

		# 转换为DataFrame
		nav_dict = {'日期': date_mapping}

		for name, code in self.fund_config.items():
			if code in fund_data and fund_data[code]:
				nav_dict[name] = fund_data[code]
			else:
				print(f"警告: 基金 {name}({code}) 数据为空，将用0填充")
				nav_dict[name] = {i: 0.0 for i in range(len(date_mapping))}

		nav_df = pd.DataFrame(nav_dict)

		# 检查数据质量
		print(f"获取到 {len(nav_df)} 天的数据")
		print(f"包含 {len(self.fund_names)} 个基金")

		return nav_df

	def generate_chart(self, nav_data: pd.DataFrame) -> Line:
		"""  
		生成基金净值走势图  
  
		Args:         nav_data: 基金净值数据  
  
		Returns:         pyecharts Line图表对象  
		"""
		print("正在生成图表...")

		# 创建折线图
		line_chart = Line(
			init_opts=opts.InitOpts(
				theme=ThemeType.LIGHT,
				width="1400px",
				height="700px",
				page_title="基金净值走势图"
			)
		)

		# 添加X轴数据（日期）
		dates = nav_data['日期'].tolist()
		line_chart.add_xaxis(dates)

		# 准备Y轴范围计算
		y_axis_ranges = []

		# 添加每个基金的数据系列
		for fund_name in self.fund_names:
			if fund_name not in nav_data.columns:
				continue

			fund_data = nav_data[fund_name].tolist()

			# 计算Y轴范围
			y_max, y_min = FundDataProcessor.calculate_yaxis_range(nav_data[fund_name])
			y_axis_ranges.append((y_max, y_min))

			# 添加数据系列
			line_chart.add_yaxis(
				series_name=fund_name,
				y_axis=fund_data,
				is_smooth=True,  # 平滑曲线
				is_symbol_show=True,
				label_opts=opts.LabelOpts(is_show=False),  # 不显示数据标签，避免拥挤
				markpoint_opts=opts.MarkPointOpts(
					data=[
						opts.MarkPointItem(type_="min", name="最低"),
						opts.MarkPointItem(type_="max", name="最高")
					]
				),
				markline_opts=opts.MarkLineOpts(
					data=[opts.MarkLineItem(type_="average", name="均值")]
				)
			)

		# 设置全局选项
		line_chart.set_global_opts(
			title_opts=opts.TitleOpts(
				title="基金净值走势图",
				subtitle=f"数据更新至: {dates[-1] if dates else '未知'} | 共{len(dates)}个交易日",
				title_textstyle_opts=opts.TextStyleOpts(font_size=24),
				subtitle_textstyle_opts=opts.TextStyleOpts(font_size=12, color="gray")
			),
			tooltip_opts=opts.TooltipOpts(
				trigger="axis",
				axis_pointer_type="cross",
				background_color="rgba(255,255,255,0.9)"
			),
			legend_opts=opts.LegendOpts(
				type_="scroll",  # 滚动图例，避免过多基金时重叠
				pos_top="5%",
				pos_left="center"
			),
			datazoom_opts=[
				opts.DataZoomOpts(
					range_start=0,
					range_end=100,
					type_="inside"  # 内置型数据区域缩放
				),
				opts.DataZoomOpts(
					is_show=True,
					type_="slider",
					pos_bottom="5%"
				)
			],
			yaxis_opts=opts.AxisOpts(
				name="单位净值",
				name_location="end",
				max_=max([r[0] for r in y_axis_ranges]) if y_axis_ranges else None,
				min_=min([r[1] for r in y_axis_ranges]) if y_axis_ranges else None,
				axislabel_opts=opts.LabelOpts(formatter="{value}"),
				splitline_opts=opts.SplitLineOpts(is_show=True)
			),
			xaxis_opts=opts.AxisOpts(
				name="日期",
				name_location="end",
				axislabel_opts=opts.LabelOpts(rotate=45),  # 日期旋转45度，避免重叠
				splitline_opts=opts.SplitLineOpts(is_show=True)
			),
			toolbox_opts=opts.ToolboxOpts(
				is_show=True,
				feature={
					"saveAsImage": {"title": "保存图片"},
					"dataView": {"title": "数据视图", "lang": ["数据视图", "关闭", "刷新"]},
					"restore": {"title": "还原"},
					"dataZoom": {"title": "区域缩放"}
				}
			)
		)

		return line_chart

	def save_chart_to_html(self, chart: Line, output_dir: str = "docs") -> str:
		"""  
		将图表保存为HTML文件  
  
		Args:         chart: 图表对象  
		   output_dir: 输出目录  
  
		Returns:         保存的文件路径  
		"""  # 确保输出目录存在
		os.makedirs(output_dir, exist_ok=True)

		# 生成输出路径
		output_path = os.path.join(output_dir, "index.html")

		# 保存图表
		chart.render(output_path)

		return output_path


def main():
	"""  
	主函数：执行基金数据获取、图表生成和保存的完整流程  
	"""
	print("=" * 50)
	print("基金净值走势可视化工具")
	print("=" * 50)

	try:
		# 初始化图表生成器
		print("初始化图表生成器...")
		chart_generator = FundChartGenerator(use_alternative=True)

		# 准备数据
		nav_data = chart_generator.prepare_chart_data()

		if nav_data is None:
			print("程序终止: 无法获取有效的基金数据")
			return

		# 生成图表
		chart = chart_generator.generate_chart(nav_data)

		# 保存图表
		output_path = chart_generator.save_chart_to_html(chart)

		print("\n" + "=" * 50)
		print("程序执行完成！")
		print(f"图表已保存至: {output_path}")
		print(f"请在浏览器中打开该文件查看图表")
		print("=" * 50)

		# 显示数据摘要
		print("\n数据摘要:")
		print(f"时间范围: {nav_data['日期'].iloc[0]} 至 {nav_data['日期'].iloc[-1]}")
		print(f"包含基金: {', '.join(chart_generator.fund_names)}")

	except Exception as e:
		print(f"\n程序执行出错: {str(e)}")
		import traceback
		traceback.print_exc()


if __name__ == '__main__':
	main()
