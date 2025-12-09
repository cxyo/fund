import os
import requests
import re
import json
import pandas as pd
from pyecharts import options as opts
from pyecharts.charts import Line
from pyecharts.globals import ThemeType


# 你原有的 jsjz_api 和 fetch_fund_data 函数保持不变
def jsjz_api(code, pageSize=20):
	url = f'http://api.fund.eastmoney.com/f10/lsjz?callback=jQuery1830041192874394646584_1617938643457&fundCode={code}&pageIndex=1&pageSize={pageSize}&startDate=&endDate=&_=1617939181252'
	headers = {
		'Referer': 'http://fundf10.eastmoney.com/',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'
	}
	try:
		resp = requests.get(url, headers=headers)
		resp.raise_for_status()
		html = resp.text
		res = re.findall(r'\((.*?)\)', html)
		return json.loads(res[0])["Data"]["LSJZList"]
	except requests.RequestException as e:
		return {"错误": f"请求失败: {str(e)}"}
	except Exception as e:
		return {"错误": f"解析数据失败: {str(e)}"}


def fetch_fund_data(codes):
	riqi = {}
	fund_data = {code: {} for code in codes}

	for e in codes:
		data = jsjz_api(e)
		for index, item in enumerate(reversed(data)):
			riqi[index] = item['FSRQ']  # 日期
			fund_data[e][index] = float(item['DWJZ'])  # 净值

	return riqi, fund_data


# 基金代码和名称
names = ['中证500', '芯片', '5G', '云计算', '恒生指数', '人工智能']
cw_codes = ['160119', '008887', '008086', '017854', '164705', '008082']


def set_y_axis(data):
	y_max, y_min = data.max() * 1.08, data.min() * 0.92
	return round(y_max, 4), round(y_min, 4)


def generate_chart():
	# 获取数据
	riqi, cn_data = fetch_fund_data(cw_codes)

	# 将基金数据转换为DataFrame
	nav_dict = {'日期': riqi}
	for code, data in cn_data.items():
		nav_dict[code] = data
	nav_data = pd.DataFrame(nav_dict)

	# 生成图表
	line = Line(init_opts=opts.InitOpts(theme=ThemeType.LIGHT, width="1200px", height="500px"))
	line.add_xaxis(nav_data['日期'].tolist())

	fund_series = []
	for name, code in zip(names, cw_codes):
		y_data = nav_data[code].tolist()
		y_max, y_min = set_y_axis(nav_data[code])
		fund_series.append({
			"name": name,
			"y_data": y_data,
			"y_max": y_max,
			"y_min": y_min,
		})

		line.add_yaxis(
			series_name=name,
			y_axis=y_data,
			is_symbol_show=True,
			markpoint_opts=opts.MarkPointOpts(
				data=[opts.MarkPointItem(type_="min", name="最小值"), opts.MarkPointItem(type_="max", name="最大值")]
			),
			markline_opts=opts.MarkLineOpts(
				data=[opts.MarkLineItem(type_="average", name="平均值")]
			)
		)

	# 设置全局y轴选项
	line.set_global_opts(
		title_opts=opts.TitleOpts(title="净值走势图", subtitle="数据网上获取"),
		datazoom_opts=[opts.DataZoomOpts()],
		yaxis_opts=opts.AxisOpts(
			max_=max([fund["y_max"] for fund in fund_series]),
			min_=min([fund["y_min"] for fund in fund_series]),
			interval=0.02
		)
	)

	return line


def main():
	print("开始生成基金净值走势图...")

	# 确保 docs 目录存在
	docs_dir = "docs"
	if not os.path.exists(docs_dir):
		os.makedirs(docs_dir)
		print(f"已创建目录: {docs_dir}")

	# 生成图表
	chart = generate_chart()

	# 将图表渲染为完整的 HTML 文件，并保存到 docs 目录
	output_path = os.path.join(docs_dir, "index.html")
	chart.render(output_path)
	print(f"网站已成功生成在 {output_path}")

	# 检查文件是否真的创建成功
	if os.path.exists(output_path):
		print("✅ 文件创建成功！")
	else:
		print("❌ 文件创建失败，请检查权限或路径")


if __name__ == '__main__':
	main()
