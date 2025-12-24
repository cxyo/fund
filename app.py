# app.py
from flask import Flask, render_template, request, redirect, url_for, flash, session
import pandas as pd
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from data_processor import process_lixingren_csv, save_processed_data
from utils import extract_date_from_filename, get_latest_data_date, check_password
from index_categories import get_index_category, is_industry_index

# 应用启动时记录工作目录
print("=== 应用启动 ===")
print(f"当前工作目录: {os.getcwd()}")
print(f"脚本文件目录: {os.path.dirname(os.path.abspath(__file__))}")

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this'  # 重要：部署时要修改！
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'uploaded')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB限制
app.config['ALLOWED_EXTENSIONS'] = {'csv'}

# 创建必要目录
for dir_path in [app.config['UPLOAD_FOLDER'], 'data/processed']:
    os.makedirs(dir_path, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def login_required(f):
    """装饰器：需要登录才能访问"""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            flash('请先登录')
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

# ========== 公开页面 ==========
@app.route('/')
def index():
    """首页：公开访问，显示最新温度数据"""
    # 使用绝对路径
    data_file = os.path.join(os.path.dirname(__file__), 'data', 'latest_data.csv')
    data_date = get_latest_data_date()
    
    # 检查文件是否存在且不为空
    print(f"=== index路由开始 ===")
    print(f"当前工作目录：{os.getcwd()}")
    print(f"数据文件路径：{data_file}")
    print(f"数据文件存在：{os.path.exists(data_file)}")
    print(f"数据文件大小：{os.path.getsize(data_file) if os.path.exists(data_file) else 0} 字节")
    
    if not os.path.exists(data_file) or os.path.getsize(data_file) == 0:
        print(f"检查到数据文件不存在或为空：{data_file}")
        # 尝试从uploaded目录找到最新的CSV文件并处理
        uploaded_dir = app.config['UPLOAD_FOLDER']
        print(f"上传目录：{uploaded_dir}")
        print(f"上传目录绝对路径：{os.path.abspath(uploaded_dir)}")
        
        if os.path.exists(uploaded_dir):
            csv_files = [f for f in os.listdir(uploaded_dir) if f.endswith('.csv')]
            print(f"找到的CSV文件：{csv_files}")
            
            if csv_files:
                # 按文件名排序，最新的日期排在前面
                csv_files.sort(reverse=True)
                latest_csv = os.path.join(uploaded_dir, csv_files[0])
                print(f"最新的CSV文件：{latest_csv}")
                
                # 处理数据
                try:
                    print(f"开始处理文件：{latest_csv}")
                    result_df = process_lixingren_csv(latest_csv)
                    if result_df is not None:
                        print(f"处理成功，结果数据：{result_df}")
                        # 保存处理后的数据
                        result_df.to_csv(data_file, index=False, encoding='utf-8-sig')
                        print(f"自动处理并更新了数据：{latest_csv}")
                    else:
                        print("处理失败，result_df为空")
                except Exception as e:
                    print(f"自动处理数据失败：{str(e)}")
                    import traceback
                    traceback.print_exc()
        else:
            print(f"上传目录不存在：{uploaded_dir}")
    
    # 再次检查文件
    print(f"=== 再次检查文件 ===")
    print(f"数据文件路径：{data_file}")
    print(f"数据文件存在：{os.path.exists(data_file)}")
    print(f"数据文件大小：{os.path.getsize(data_file) if os.path.exists(data_file) else 0} 字节")
    
    if not os.path.exists(data_file) or os.path.getsize(data_file) == 0:
        data_html = """
        <div class="alert alert-warning">
            <h4>📊 基金温度看板</h4>
            <p>数据正在初始化中...</p>
            <p>欢迎访问！本页面展示主要指数的估值温度。</p>
        </div>
        """
        update_time = "等待数据更新"
    else:
        try:
            df = pd.read_csv(data_file, encoding='utf-8-sig')
            
            # 检查并统一分位点列名
            if 'PE-TTM(分位点%)' in df.columns and 'PB(分位点%)' in df.columns:
                df = df.rename(columns={'PE-TTM(分位点%)': 'PE分位点', 'PB(分位点%)': 'PB分位点'})
            elif 'PE-TTM(分位点%)' in df.columns:
                df = df.rename(columns={'PE-TTM(分位点%)': 'PE分位点'})
            elif 'PB(分位点%)' in df.columns:
                df = df.rename(columns={'PB(分位点%)': 'PB分位点'})
            
            # 重新计算基金温度，根据指数类型区分处理
            if 'PE分位点' in df.columns and 'PB分位点' in df.columns:
                # 计算PE分位点和PB分位点的数值（将百分比转换为小数）
                def process_quantile(quantile):
                    if pd.isna(quantile) or quantile == '-' or quantile == '':
                        return 0
                    elif isinstance(quantile, str):
                        # 处理前面带等号的情况（如=0.8210）
                        if quantile.startswith('='):
                            quantile = quantile[1:]
                        # 处理百分比的情况（如82.10%）
                        if '%' in quantile:
                            return float(quantile.replace('%', '')) / 100
                        # 处理普通数值字符串
                        try:
                            return float(quantile)
                        except ValueError:
                            return 0
                    elif isinstance(quantile, (int, float)):
                        return quantile / 100 if quantile > 1 else quantile
                    else:
                        return 0
                
                df['PE分位点数值'] = df['PE分位点'].apply(process_quantile)
                df['PB分位点数值'] = df['PB分位点'].apply(process_quantile)
                
                # 应用基金温度计算公式
                df['基金温度'] = df.apply(lambda row: 
                    row['PB分位点数值'] * 100 if is_industry_index(row['指数名称']) 
                    else (row['PE分位点数值'] + row['PB分位点数值']) / 2 * 100, axis=1)
            
            # 美化温度显示
            def format_temperature(temp):
                if temp < 30:
                    color = "success"
                    icon = "❄️"
                elif temp < 50:
                    color = "info"
                    icon = "🌤️"
                elif temp < 70:
                    color = "warning"
                    icon = "🔥"
                else:
                    color = "danger"
                    icon = "☀️"
                
                return f'<span class="badge bg-{color}">{icon} {temp:.1f}°C</span>'
            
            if '基金温度' in df.columns:
                df['基金温度'] = df['基金温度'].round(1)  # 保留一位小数
                df['基金温度'] = df['基金温度'].apply(format_temperature)
            
            # 添加类别字段
            if '指数名称' in df.columns:
                df['类别'] = df['指数名称'].apply(get_index_category)
            
            # 确保所需字段存在（如果数据中没有，添加默认值）
            if '今年以来涨跌幅' not in df.columns:
                df['今年以来涨跌幅'] = '-'  # 默认为'-'
            if '涨跌幅' not in df.columns:
                df['涨跌幅'] = '-'  # 默认为'-'
            if '关注度' not in df.columns:
                df['关注度'] = '-'  # 默认为'-'
            
            # 提前重命名列名，避免后续使用新列名时出错
            df = df.rename(columns={'今年以来涨跌幅': '今年涨跌', '涨跌幅': '昨涨跌'})
            
            # 清理值中的等号
            def clean_value(value):
                if isinstance(value, str):
                    # 移除开头的等号
                    if value.startswith('='):
                        return value[1:]
                    # 移除所有等号
                    return value.replace('=', '')
                return value
            
            # 应用清理函数到相关列
            for col in ['今年涨跌', '昨涨跌', '关注度']:
                if col in df.columns:
                    df[col] = df[col].apply(clean_value)
            
            # 将涨跌幅转换为百分比显示
            def to_percentage(value):
                if value == '-' or pd.isna(value):
                    return '-'
                try:
                    # 尝试转换为浮点数
                    if isinstance(value, str):
                        # 处理已经是百分比格式的情况
                        if '%' in value:
                            return value
                        # 处理字符串数字
                        num = float(value)
                    else:
                        num = float(value)
                    
                    # 如果数值大于1，可能已经是百分比形式（如10.15）
                    if num > 1:
                        return f"{num:.2f}%"
                    # 否则转换为百分比（如0.1015 -> 10.15%）
                    else:
                        return f"{(num * 100):.2f}%"
                except:
                    # 如果转换失败，返回原值
                    return value
            
            # 应用百分比转换函数到涨跌幅列
            for col in ['今年涨跌', '昨涨跌']:
                if col in df.columns:
                    df[col] = df[col].apply(to_percentage)
            
            # 删除没有数据的行
            # 1. 删除今年涨跌、昨涨跌、关注度中没有数据的行
            valid_rows = (df['今年涨跌'] != '-') & (df['昨涨跌'] != '-') & (df['关注度'] != '-')
            df = df[valid_rows]
            
            # 2. 删除PE分位点和PB分位点没有数据的行
            if 'PE分位点' in df.columns and 'PB分位点' in df.columns:
                # 排除PE分位点或PB分位点为空、为'-'或为0的行
                valid_quantiles = (df['PE分位点'] != '-') & (df['PB分位点'] != '-')
                valid_quantiles &= ~pd.isna(df['PE分位点']) & ~pd.isna(df['PB分位点'])
                
                # 排除'0'或'0%'值
                valid_quantiles &= (df['PE分位点'] != '0') & (df['PE分位点'] != '0%')
                valid_quantiles &= (df['PB分位点'] != '0') & (df['PB分位点'] != '0%')
                
                # 检查是否为数值类型，如果是，排除0值
                if pd.api.types.is_numeric_dtype(df['PE分位点']) and pd.api.types.is_numeric_dtype(df['PB分位点']):
                    valid_quantiles &= (df['PE分位点'] != 0) & (df['PB分位点'] != 0)
                
                df = df[valid_quantiles]
            
            # 3. 清除计算报错的行（基金温度为0或为空的行）
            if '基金温度' in df.columns:
                # 检查是否为数值类型
                if pd.api.types.is_numeric_dtype(df['基金温度']):
                    # 排除0值和空值
                    df = df[(df['基金温度'] != 0) & ~pd.isna(df['基金温度'])]
                elif pd.api.types.is_string_dtype(df['基金温度']):
                    # 如果是字符串类型（已经格式化），检查是否包含'0.0°C'或为空
                    df = df[(df['基金温度'] != '<span class="badge bg-success">❄️ 0.0°C</span>') & (df['基金温度'] != '-')]
            
            # 获取搜索关键词
            search_keyword = request.args.get('search', '').strip()
            
            # 如果有搜索关键词，过滤数据
            if search_keyword:
                # 筛选指数名称中包含搜索关键词的行
                filtered_df = df[df['指数名称'].str.contains(search_keyword, case=False, na=False)]
                # 如果没有结果，设置提示消息
                if filtered_df.empty:
                    data_html = f'<div class="alert alert-info">未找到包含 "{search_keyword}" 的指数。</div>'
                    return render_template('index.html', 
                                        data_table=data_html, 
                                        last_updated=update_time,
                                        data_date=data_date,
                                        search_keyword=search_keyword)
                df = filtered_df
            
            # 处理关注度为数值类型以便排序
            df['关注度数值'] = df['关注度'].apply(lambda x: float(x.replace(',', '')) if isinstance(x, str) and x != '-' else 0)
            
            # 定义类别排序顺序
            category_order = ['大盘', '小盘', '策略', '行业', '主题', '海外', '其他']
            df['类别排序'] = df['类别'].map({cat: idx for idx, cat in enumerate(category_order)})
            
            # 排序：先按关注度降序，再按类别排序，最后按基金温度降序
            df = df.sort_values(by=['关注度数值', '类别排序', '基金温度'], ascending=[False, True, False])
            
            # 添加行号列
            df['序号'] = range(1, len(df) + 1)
            
            # 重新命名和选择需要的列
            columns_to_keep = ['序号', '类别', '指数名称', '基金温度', '今年涨跌', '昨涨跌', '关注度', '投资建议']
            
            # 确保只选择数据框中存在的列
            columns_to_keep = [col for col in columns_to_keep if col in df.columns]
            df_filtered = df[columns_to_keep]
            
            # 转换为HTML
            data_html = df_filtered.to_html(
                classes='table table-striped table-hover table-bordered',
                index=False,
                escape=False,
                na_rep='-'
            )
            
            # 自定义表格生成函数，添加条件样式
            def generate_custom_html_table(df):
                # 创建表格开始标签
                html = '<table class="table table-striped table-hover table-bordered">'
                
                # 列名映射字典，用于显示更友好的列名
                column_mapping = {
                    '今年以来涨跌幅': '今年涨跌',
                    '涨跌幅': '昨涨跌'
                }
                
                # 添加表头
                html += '<thead><tr>'
                for col in df.columns:
                    display_name = column_mapping.get(col, col)
                    html += f'<th>{display_name}</th>'
                html += '</tr></thead>'
                
                # 添加表格内容
                html += '<tbody>'
                for _, row in df.iterrows():
                    html += '<tr>'
                    for col in df.columns:
                        value = row[col]
                        
                        if col in ['今年涨跌', '昨涨跌'] and isinstance(value, str) and value != '-':
                            # 处理涨跌幅列，添加颜色样式
                            try:
                                # 提取数字部分
                                num_str = value.replace('%', '')
                                num = float(num_str)
                                if num < 0:
                                    # 负数用绿色
                                    html += f'<td style="color: green;">{value}</td>'
                                else:
                                    # 正数用红色
                                    html += f'<td style="color: red;">{value}</td>'
                            except:
                                # 如果转换失败，使用默认样式
                                html += f'<td>{value}</td>'
                        elif col == '关注度' and value != '-':
                            # 处理关注度列
                            try:
                                # 提取数字部分
                                if isinstance(value, str):
                                    num = float(value.replace(',', ''))
                                else:
                                    num = float(value)
                                if num > 10000:
                                    # 大于10000用红色
                                    html += f'<td style="color: red;">{value}</td>'
                                else:
                                    html += f'<td>{value}</td>'
                            except:
                                html += f'<td>{value}</td>'
                        elif col == '投资建议' and value != '-':
                            # 处理投资建议列，添加颜色样式
                            if '低估' in value:
                                html += f'<td style="color: #28a745;">{value}</td>'  # 绿色
                            elif '正常偏低' in value:
                                html += f'<td style="color: #17a2b8;">{value}</td>'  # 蓝色
                            elif '正常偏高' in value:
                                html += f'<td style="color: #ffc107;">{value}</td>'  # 黄色
                            elif '高估' in value:
                                html += f'<td style="color: #dc3545;">{value}</td>'  # 红色
                            else:
                                html += f'<td>{value}</td>'
                        else:
                            # 其他列保持默认样式
                            html += f'<td>{value}</td>'
                    html += '</tr>'
                html += '</tbody></table>'
                
                return html
            
            # 生成自定义HTML表格
            data_html = generate_custom_html_table(df_filtered)
            
            # 获取更新时间
            timestamp = os.path.getmtime(data_file)
            update_time = f"{data_date} {datetime.fromtimestamp(timestamp).strftime('%H:%M:%S')}"
        except Exception as e:
            data_html = f'<div class="alert alert-danger">读取数据出错: {str(e)}</div>'
            update_time = "数据错误"
    
    # 获取搜索关键词
    search_keyword = request.args.get('search', '').strip()
    
    return render_template('index.html', 
                         data_table=data_html, 
                         last_updated=update_time,
                         data_date=data_date,
                         search_keyword=search_keyword)

# ========== 登录相关 ==========
@app.route('/login', methods=['GET', 'POST'])
def login():
    """登录页面"""
    if request.method == 'POST':
        password = request.form.get('password', '')
        
        if check_password(password):
            session['logged_in'] = True
            flash('登录成功！')
            
            # 跳转到上传页面或请求的页面
            next_page = request.args.get('next')
            if next_page:
                return redirect(next_page)
            return redirect(url_for('upload'))
        else:
            flash('密码错误，请重试')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """退出登录"""
    session.pop('logged_in', None)
    flash('已退出登录')
    return redirect(url_for('index'))

# ========== 需要登录的页面 ==========
@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload():
    """上传页面：需要密码才能访问"""
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('没有选择文件')
            return redirect(request.url)
        
        file = request.files['file']
        
        if file.filename == '':
            flash('没有选择文件')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            # 获取文件名中的日期
            original_filename = secure_filename(file.filename)
            file_date = extract_date_from_filename(original_filename)
            
            if file_date:
                # 重命名文件为 yyyy-mm-dd.csv 格式
                new_filename = f"{file_date}.csv"
                flash(f'已从文件名中提取日期，文件将保存为: {new_filename}')
            else:
                # 如果文件名没有日期，使用当天日期
                file_date = datetime.now().strftime('%Y-%m-%d')
                new_filename = f"{file_date}.csv"
                flash(f'文件名无日期，已重命名为: {new_filename}')
            
            # 检查是否已有该日期的文件
            existing_file = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
            if os.path.exists(existing_file):
                flash(f'该日期已有文件，将覆盖已有文件: {new_filename}')
            
            # 保存文件
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
            file.save(file_path)
            
            flash(f'文件保存成功: {new_filename}')
            
            # 处理数据
            result_df = process_lixingren_csv(file_path)
            
            if result_df is not None:
                # 保存处理后的数据
                processed_filename = f"processed_{file_date}.csv"
                save_processed_data(result_df, processed_filename)
                
                # 更新最新数据
                latest_path = 'data/latest_data.csv'
                result_df.to_csv(latest_path, index=False, encoding='utf-8-sig')
                
                flash('✅ 数据处理完成！网站数据已更新。')
                return redirect(url_for('index'))
            else:
                flash('❌ 数据处理失败，请检查CSV格式')
                return redirect(request.url)
        else:
            flash('只允许上传CSV文件')
            return redirect(request.url)
    
    return render_template('upload.html')

@app.route('/history')
@login_required
def history():
    """历史数据页面：需要登录"""
    uploaded_dir = 'data/uploaded'
    processed_dir = 'data/processed'
    
    uploaded_files = []
    processed_files = []
    
    # 获取上传的文件
    if os.path.exists(uploaded_dir):
        csv_files = [f for f in os.listdir(uploaded_dir) if f.endswith('.csv')]
        csv_files.sort(reverse=True)
        
        for file in csv_files[:15]:
            file_path = os.path.join(uploaded_dir, file)
            file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
            
            uploaded_files.append({
                'name': file,
                'time': file_time.strftime('%Y-%m-%d %H:%M'),
                'size': f"{os.path.getsize(file_path) / 1024:.1f} KB"
            })
    
    # 获取处理后的文件
    if os.path.exists(processed_dir):
        csv_files = [f for f in os.listdir(processed_dir) if f.endswith('.csv')]
        csv_files.sort(reverse=True)
        
        for file in csv_files[:15]:
            file_path = os.path.join(processed_dir, file)
            file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
            
            processed_files.append({
                'name': file,
                'time': file_time.strftime('%Y-%m-%d %H:%M'),
                'size': f"{os.path.getsize(file_path) / 1024:.1f} KB"
            })
    
    return render_template('history.html', 
                         uploaded_files=uploaded_files,
                         processed_files=processed_files)

# if __name__ == '__main__':

#     app.run(debug=True, host='0.0.0.0', port=5000)

# 在文件末尾添加或修改这部分代码
if __name__ == '__main__':
    import os
    # 从环境变量获取端口，如果不存在则使用5000
    port = int(os.environ.get('PORT', 5000))
    # 必须监听 0.0.0.0 才能对外提供服务
    app.run(host='0.0.0.0', port=port, debug=False)  # 生产环境要设置 debug=False
