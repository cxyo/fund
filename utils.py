# utils.py
import re
import os
from datetime import datetime

def extract_date_from_filename(filename):
    """从文件名提取日期，支持yyyy-mm-dd和yyyymmdd两种格式"""
    # 先尝试匹配 yyyy-mm-dd 格式
    date_pattern1 = r'(\d{4}-\d{2}-\d{2})'
    match = re.search(date_pattern1, filename)
    if match:
        date_str = match.group(1)
        try:
            datetime.strptime(date_str, '%Y-%m-%d')
            return date_str
        except ValueError:
            pass
    
    # 再尝试匹配 yyyymmdd 格式
    date_pattern2 = r'(\d{4})(\d{2})(\d{2})'
    match = re.search(date_pattern2, filename)
    if match:
        year, month, day = match.groups()
        date_str = f"{year}-{month}-{day}"
        try:
            datetime.strptime(date_str, '%Y-%m-%d')
            return date_str
        except ValueError:
            pass
    
    return None

def get_latest_data_date():
    """获取最新数据的日期"""
    latest_file = 'data/latest_data.csv'
    if os.path.exists(latest_file):
        timestamp = os.path.getmtime(latest_file)
        return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
    
    processed_dir = 'data/processed'
    if os.path.exists(processed_dir):
        csv_files = [f for f in os.listdir(processed_dir) if f.endswith('.csv')]
        if csv_files:
            csv_files.sort(reverse=True)
            latest = csv_files[0]
            date = extract_date_from_filename(latest)
            if date:
                return date
    
    return "未知日期"

def check_password(input_pwd):
    """检查密码（简单版本，可以后续加强）"""
    # 密码设为 admin，你可以修改
    correct_pwd = "admin"
    return input_pwd == correct_pwd