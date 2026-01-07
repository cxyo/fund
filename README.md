# 基金温度表应用

一个用于展示基金温度和星级评分的Web应用，支持自动从GitHub获取最新数据。

## 功能特性

- 基金温度实时展示
- 温度星级评分（0-5星）
- 支持历史温度图表查看
- 支持基金净值查询
- 支持搜索和筛选
- 自动从GitHub获取最新数据

## 如何上传到GitHub

### 步骤1：创建GitHub仓库

1. 登录GitHub账号
2. 点击右上角的「+」按钮，选择「New repository」
3. 填写仓库名称（建议使用英文名称，如 `fund-temperature`）
4. 选择「Public」或「Private」（建议选择Public，便于GitHub Pages部署）
5. 点击「Create repository」

### 步骤2：上传项目文件

#### 方法1：使用Git命令行（推荐）

1. 安装Git（如果尚未安装）
2. 在本地项目文件夹中打开命令行
3. 初始化Git仓库：
   ```bash
   git init
   ```
4. 添加远程仓库：
   ```bash
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   ```
5. 添加所有文件：
   ```bash
   git add .
   ```
6. 提交更改：
   ```bash
   git commit -m "Initial commit"
   ```
7. 推送到GitHub：
   ```bash
   git push -u origin main
   ```

#### 方法2：使用GitHub Desktop

1. 下载并安装 [GitHub Desktop](https://desktop.github.com/)
2. 登录GitHub账号
3. 点击「Add an existing repository from your hard drive」
4. 选择本地项目文件夹
5. 点击「Publish repository」
6. 选择要发布的仓库，点击「Publish Repository」

### 步骤3：配置GitHub Pages

1. 进入GitHub仓库页面
2. 点击「Settings」选项卡
3. 在左侧菜单中点击「Pages」
4. 在「Source」部分，选择「main」分支
5. 点击「Save」
6. 稍等片刻，GitHub Pages将部署完成，你将看到访问URL

## 如何配置自动更新

### 步骤1：设置GitHub仓库信息

1. 在浏览器中打开部署好的GitHub Pages页面
2. 打开浏览器开发者工具（按F12）
3. 切换到「Console」选项卡
4. 输入以下命令，将你的GitHub仓库信息保存到浏览器本地存储：
   ```javascript
   localStorage.setItem('githubRepo', '你的用户名/你的仓库名');
   ```
   例如：`localStorage.setItem('githubRepo', 'username/fund-temperature');`
5. 刷新页面，应用将自动从GitHub获取最新数据

### 步骤2：手动上传数据

1. 每天准备好最新的CSV数据文件，命名格式为 `YYYY-MM-DD.csv`（例如：`2025-12-25.csv`）
2. 将CSV文件上传到GitHub仓库根目录
3. GitHub Pages会自动更新
4. 刷新应用页面，即可看到最新数据

## 数据格式要求

### CSV文件格式

CSV文件应包含以下列：
- 指数代码
- 指数名称
- 今日涨跌幅
- 今年涨跌幅
- 上两日涨跌
- PE-TTM(当前值)
- PB
- PE-TTM(分位点%)
- PB(分位点%)
- 关注度

### 示例数据

```csv
指数代码,指数名称,今日涨跌幅,今年涨跌幅,上两日涨跌,PE-TTM(当前值),PB,PE-TTM(分位点%),PB(分位点%),关注度
000001,上证指数,0.5%,10.2%,0.3%,15.2,1.8,65.3,72.1,"10万+"
000300,沪深300,0.8%,12.5%,0.5%,16.8,2.0,70.5,78.3,"20万+"
```

## 如何使用

1. 打开部署好的GitHub Pages页面
2. 查看基金温度表，绿色表示高温，黄色表示正常，红色表示低温
3. 点击任意指数行，查看历史温度图表
4. 点击场内/场外代码，查看基金净值走势
5. 使用搜索框搜索特定指数
6. 温度星级会自动计算并显示在页面顶部

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- ECharts（图表库）
- GitHub Pages（部署）
- jsdelivr（CDN加速）

## 常见问题

### Q: 为什么温度星级显示不正确？
A: 温度星级计算公式为：`(PE分位点 * 0.29 + PB分位点 * 0.71) * 5.34`，请确保CSV数据中的PE-TTM(分位点%)和PB(分位点%)字段格式正确。

### Q: 如何更新基金映射表？
A: 编辑 `js/app.js` 文件中的 `FUND_CODES_MAP` 对象，添加或修改基金代码映射关系。

### Q: 如何添加新的指数类别？
A: 编辑 `js/app.js` 文件中的 `CATEGORIES` 和 `CATEGORY_MAP` 对象，添加新的类别和映射关系。

## 开发说明

### 本地运行

1. 在项目文件夹中启动本地服务器（推荐使用Live Server或http-server）
2. 在浏览器中访问 `http://localhost:端口号`

### 项目结构

```
.
├── index.html          # 主页面
├── css/
│   └── style.css      # 样式文件
├── js/
│   └── app.js         # 主脚本文件
├── code.json          # 指数配置文件
├── README.md          # 项目说明文档
└── YYYY-MM-DD.csv     # 每日数据文件
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题或建议，请通过GitHub Issues与我联系。