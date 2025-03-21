# Gemini 图像编辑助手 ✨

<div align="center">
  <img src="https://i.imgur.com/XvN2DGl.png" alt="Gemini 图像编辑助手" width="600">
  
  _基于 Gemini AI 的图像生成与编辑工具_
</div>

## 🌟 项目简介

Gemini 图像编辑助手是一个基于 Gemini 2.0 模型的图像生成与编辑网页应用。该工具允许用户通过简单的文本描述生成精美图像，或对已有图片进行创意编辑，为您的创作过程提供 AI 支持。

## ✨ 功能特点

- 🖼️ **文本生成图像**：通过文字描述创建精美图像
- 🎨 **图像编辑**：修改现有图片，添加或更改图像细节
- 🔄 **多种风格选项**：支持不同艺术风格和美学效果
- 💡 **智能提示建议**：AI 提供创意建议，助力灵感激发
- 📱 **响应式设计**：适配各种设备，随时随地进行创作
- ⚡ **快速渲染**：先进算法确保高效生成与编辑

## 🚀 使用方法

1. 打开 `index.html` 文件或访问部署后的网站
2. 在输入框中描述你想要生成的图像或编辑要求
3. 选择合适的风格和效果选项
4. 点击"生成"按钮，等待 AI 完成创作
5. 下载或进一步调整生成的图像

## 💻 技术栈

- **前端**: HTML5, CSS3, JavaScript
- **AI 模型**: Gemini 2.0
- **设计理念**: 极简主义、用户友好、视觉美学

## 📝 待开发功能

- [ ] 历史记录保存与恢复
- [ ] 更多自定义参数控制
- [ ] 批量图像处理
- [ ] 用户账户系统
- [ ] 社区分享功能

## 🔗 相关资源

- [Gemini AI 官方文档](https://ai.google.dev/)
- [图像处理技术博客](https://example.com)

## 📄 许可证

MIT License © 2024 

---

> **注意**: 此项目仅供学习和研究使用，请遵守 AI 内容生成相关法规和道德准则。 

# 橘猫の魔法工坊

这是一个使用Netlify Edge Functions存储和管理API密钥的静态网站项目。

## 功能特点

- 静态网页前端，包含多个小工具
- 使用Netlify Edge Functions作为后端服务
- 安全存储API密钥到Supabase数据库
- 通过前端界面轻松管理API密钥

## 部署指南

### 前置条件

1. 一个[Netlify](https://www.netlify.com/)账户
2. 一个[Supabase](https://supabase.com/)账户 (用于存储API密钥)

### Supabase设置

1. 在Supabase创建一个新项目
2. 创建一个名为`api_keys`的新表，包含以下字段:
   - `id`: UUID, 主键
   - `key_name`: text, 非空
   - `key_value`: text, 非空
   - `updated_at`: timestamp with time zone, 默认: now()
3. 为`key_name`列添加唯一约束

### Netlify设置

1. 将代码推送到GitHub仓库
2. 在Netlify创建一个新站点，从GitHub仓库导入
3. 在站点设置中添加以下环境变量:
   - `SUPABASE_URL`: 你的Supabase项目URL
   - `SUPABASE_SERVICE_KEY`: 你的Supabase服务密钥（从项目设置 > API获取）

### 部署命令

```
# 安装依赖
npm install

# 在本地测试
netlify dev

# 部署到Netlify
git push  # Netlify将自动从GitHub部署
```

## 使用说明

1. 打开网站，前往API密钥管理部分
2. 选择要存储的密钥名称 (如 `gemini_api_key`)
3. 输入密钥值并点击保存
4. 使用网站的功能，它们将自动使用存储的密钥

## 技术栈

- 前端: HTML, CSS, JavaScript
- 后端: Netlify Edge Functions
- 数据存储: Supabase (PostgreSQL)

## 开发者指南

### 项目结构

```
/
├── index.html              # 主页
├── gemini_image.html       # Gemini图像生成页面
├── deepseek_chat.html      # DeepSeek聊天页面
├── api-key-manager.js      # API密钥管理器脚本
├── netlify.toml            # Netlify配置文件
└── netlify/
    └── edge-functions/     # Netlify Edge Functions
        ├── store-key.js    # 存储密钥函数
        └── get-key.js      # 获取密钥函数
```

### 添加新的API密钥类型

1. 在`index.html`中的`ApiKeyManager.initKeyManagerUI`函数中的`keyNames`数组添加新的密钥名称
2. 在需要使用该密钥的页面中使用`ApiKeyManager.getKey("新密钥名")`获取密钥

### 自定义

可以修改`api-key-manager.js`中的样式和交互逻辑，以适应不同的UI需求。 