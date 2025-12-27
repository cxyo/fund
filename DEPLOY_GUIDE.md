# 基金温度表网站部署教程

本教程将指导你如何使用Git和GitHub托管这个静态网站。

## 目录
- [准备工作](#准备工作)
- [安装Git](#安装git)
- [创建GitHub仓库](#创建github仓库)
- [部署代码](#部署代码)
- [后续更新](#后续更新)
- [常见问题](#常见问题)
- [项目结构说明](#项目结构说明)

---

## 准备工作

### 1. 注册GitHub账号
- 访问 https://github.com 注册账号（如果已有账号可直接登录）

### 2. 准备文件
确保你有 `jjwd` 文件夹，包含以下内容：
```
jjwd/
├── index.html
├── css/style.css
├── js/app.js
├── images/qrcode.png
├── data.csv
└── old_data.csv
```

---

## 安装Git

### Windows安装步骤

1. **下载Git**
   - 访问：https://git-scm.com/download/win
   - 点击 **Download for Windows** 自动下载

2. **运行安装程序**
   - 双击下载的 `.exe` 文件
   - **重要：安装时勾选以下选项**：
     - ✅ "Git Bash Here" - 在右键菜单添加Git Bash
     - ✅ "Git GUI Here" - 在右键菜单添加Git GUI
     - ✅ "Use the OpenSSL library" - 使用OpenSSL
     - ✅ "Checkout Windows-style, commit Unix-style line endings" - 跨平台换行符
   - 点击 **Next** 直到 **Install**

3. **验证安装**
   - 打开新的终端（PowerShell或CMD）
   - 运行：`git --version`
   - 如果显示版本号（如 `git version 2.52.0`），表示安装成功

---

## 创建GitHub仓库

### 步骤1：创建Personal Access Token

GitHub需要token来验证身份，而不是直接用密码。

1. 打开 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 填写信息：
   - **Note**: `Git Push`（任意描述）
   - **Expiration**: 选择 `No expiration`（永不过期）
4. **勾选权限**：在 **repo** 区域，勾选全部选项
5. 点击页面底部的 **Generate token**
6. **立即复制并保存token**（形如：`ghp_xxxxxxxxxxxxxxxxxxxx`）
   - ⚠️ 关闭页面后无法再次查看！

### 步骤2：创建仓库

1. 登录GitHub后，点击右上角 **+** 号，选择 **New repository**
2. 填写仓库信息：
   - **Repository name**: `jjwd`
   - **Description**: 基金温度表查询网站
   - 选择 **Public**（公开仓库）
   - **不要**勾选 "Add a README file"
3. 点击 **Create repository**
4. 复制仓库地址（形如：`https://github.com/你的用户名/jjwd.git`）

---

## 部署代码

### 步骤1：初始化Git仓库

在本地打开终端（PowerShell或CMD），进入jjwd目录：

```bash
# 进入项目目录
cd D:\AI_CODE_project\DEMO\jjwd

# 初始化Git仓库
git init
```

### 步骤2：配置用户信息

```bash
# 设置用户名（替换为你的GitHub用户名）
git config --global user.name "你的GitHub用户名"

# 设置邮箱（替换为你的邮箱）
git config --global user.email "你的邮箱@example.com"
```

### 步骤3：添加并提交文件

```bash
# 添加所有文件到暂存区
git add .

# 提交代码
git commit -m "Initial commit: 基金温度表网站"
```

### 步骤4：关联远程仓库

```bash
# 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/jjwd.git
```

### 步骤5：推送到GitHub

```bash
# 推送到GitHub
git push -u origin master
```

**首次推送需要验证**：
1. 输入用户名：你的GitHub用户名
2. 输入密码：粘贴你的 **Personal Access Token**（不是GitHub登录密码！）
3. 如果看到 `Branch 'master' set up to track remote branch`，表示成功！

---

## 后续更新

每次修改代码后，执行以下命令更新到GitHub：

```bash
# 进入项目目录
cd D:\AI_CODE_project\DEMO\jjwd

# 添加修改的文件
git add .

# 提交修改说明
git commit -m "描述你的修改内容"

# 推送到GitHub
git push
```

GitHub Pages会自动更新，通常 **1-2分钟后生效**。

---

## 启用GitHub Pages（让网站可访问）

1. 进入你的GitHub仓库页面
2. 点击顶部的 **Settings** 标签
3. 在左侧菜单中找到 **Pages** 选项
4. 在 **Build and deployment** 部分：
   - **Branch**: 选择 **master**（或main）
   - **Folder**: 选择 **/ (root)**
5. 点击 **Save**
6. **等待1-2分钟** 让GitHub部署完成

### 访问你的网站

部署完成后，访问地址为：
```
https://你的用户名.github.io/jjwd/
```

---

## 常见问题

### Q1: Git安装后命令不可用？

确保**重启终端**（关闭当前终端重新打开）后再运行git命令。

### Q2: 推送时提示输入密码？

GitHub已于2021年不再支持密码验证。需要使用 **Personal Access Token** 作为密码。

1. 打开 https://github.com/settings/tokens
2. 如果之前创建过token，直接使用
3. 如果没有，点击 **Generate new token** 创建
4. 在终端输入密码时，粘贴你的token

### Q3: 提示 "fatal: not a git repository"？

确保在正确的目录下执行命令：

```bash
cd D:\AI_CODE_project\DEMO\jjwd
git status
```

### Q4: 提示 "Everything up-to-date" 但文件没更新？

可能是没有add或commit：

```bash
git add .
git commit -m "更新说明"
git push
```

### Q5: CSV数据加载失败？

确保 `data.csv` 文件位于仓库根目录，且文件名正确。GitHub Pages对大小写敏感。

### Q6: 图片不显示？

检查 `images/qrcode.png` 路径是否正确。引用路径应使用相对路径，如 `images/qrcode.png`。

### Q7: 想更新网站内容？

每次修改后：

```bash
cd D:\AI_CODE_project\DEMO\jjwd
git add .
git commit -m "更新说明"
git push
```

GitHub Pages会自动更新，通常1-2分钟后生效。

### Q8: 推送失败，提示权限错误？

1. 检查用户名是否正确
2. 确认使用的是 **Personal Access Token** 而不是GitHub登录密码
3. 检查token是否有 **repo** 权限

### Q9: 如何查看提交历史？

```bash
# 查看提交历史
git log

# 简洁显示
git log --oneline
```

### Q10: 想撤销最近的提交？

```bash
# 撤销最近一次提交（保留文件修改）
git reset --soft HEAD~1

# 完全撤销（包括文件修改）
git reset --hard HEAD~1
```

---

## 自定义域名（可选）

如果你有自己的域名，可以：

1. 在 **Settings → Pages** 中找到 **Custom domain**
2. 输入你的域名
3. 在域名服务商处添加CNAME记录指向 `你的用户名.github.io`
4. 勾选 **Enforce HTTPS**

## 项目结构说明

```
jjwd/
├── index.html        # 主页面（包含HTML结构和表格）
├── DEPLOY_GUIDE.md   # 部署教程（本文档）
├── css/
│   └── style.css     # 样式文件
├── js/
│   └── app.js        # 核心逻辑（数据加载、搜索、表格操作）
├── images/
│   └── qrcode.png    # 二维码图片
├── data.csv          # 基金数据（主数据源）
├── old_data.csv      # 历史数据
└── code.json         # 指数代码配置（自动读取显示）
```

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **JavaScript (ES6+)** - 交互逻辑
- **Papa Parse** - CSV解析库
- **Font Awesome** - 图标库

---

**恭喜！你的基金温度表网站已经上线了！** 🎉

如有问题，请检查GitHub仓库的Actions标签页查看部署日志。
