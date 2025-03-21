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

这是一个使用Netlify Edge Functions安全代理API调用的静态网站项目。

## 功能特点

- 静态网页前端，包含多个AI创意工具
- 使用Netlify Edge Functions作为安全的后端代理
- API密钥完全存储在后端，前端无法直接访问
- 通过环境变量安全管理所有API密钥

## 部署指南

### 前置条件

1. 一个[Netlify](https://www.netlify.com/)账户

### API密钥设置

在Netlify中设置以下环境变量：

1. `GEMINI_API_KEY`: 你的Google Gemini API密钥
2. `DEEPSEEK_API_KEY`: 你的DeepSeek API密钥 
3. 如需添加其他API密钥，请在Netlify环境变量中设置

> 注意：所有API密钥现在完全存储在Netlify环境变量中，前端不再能够直接访问这些密钥。

### Netlify设置

1. 将代码推送到GitHub仓库
2. 在Netlify创建一个新站点，从GitHub仓库导入
3. 在站点设置中添加API密钥环境变量

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

1. 打开网站，选择你想要使用的工具
2. 使用功能时，所有API调用都会通过后端安全代理处理
3. API密钥完全由后端管理，前端代码不会暴露任何敏感信息

## 技术栈

- 前端: HTML, CSS, JavaScript
- 后端: Netlify Edge Functions
- API集成: Gemini AI、DeepSeek

## 开发者指南

### 项目结构

```
/
├── index.html              # 主页
├── gemini_image.html       # Gemini图像生成页面
├── deepseek_chat.html      # DeepSeek聊天页面
├── api-key-manager.js      # 已弃用的API密钥管理器（保留兼容性）
├── netlify.toml            # Netlify配置文件
└── netlify/
    └── edge-functions/     # Netlify Edge Functions
        ├── gemini-image.js  # Gemini图像生成代理函数
        ├── deepseek-chat.js # DeepSeek聊天代理函数
        └── get-key.js       # 已弃用的获取密钥函数（为兼容性保留）
```

### 添加新的服务

要添加新的API服务，请按照以下步骤操作：

1. 在`netlify/edge-functions/`目录下创建新的代理函数
2. 在`netlify.toml`中添加新的路由配置
3. 在前端页面中使用`fetch('/api/你的服务名')`调用后端代理

### 安全注意事项

所有API密钥现在完全存储在后端，不再暴露给前端。这极大地提高了应用的安全性。任何新功能开发也应该遵循这种模式，避免在前端代码中包含敏感信息。 