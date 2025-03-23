# 橘猫の魔法工坊 ✨

<div align="center">
  <img src="https://i.imgur.com/XvN2DGl.png" alt="橘猫の魔法工坊" width="600">
  
  _基于多种AI模型的创意工具箱_
</div>

## 🌟 项目简介

橘猫の魔法工坊是一个集成了多种AI创意工具的静态网站项目。目前包含Gemini图像生成与DeepSeek聊天功能，通过Netlify Edge Functions安全代理API调用，确保API密钥完全存储在后端，提高应用安全性。

## ✨ 功能特点

### 🏠 首页功能
- 💫 **响应式设计**: 适配各种设备尺寸
- 🔖 **喵喵导航**: 快速访问常用网站
- 🎨 **精美UI**: 橘猫主题的可爱界面设计
- 🧩 **工具卡片**: 卡片式布局展示各种工具

### 🖼️ Gemini 魔法图像工坊
- 🎭 **文本生成图像**: 通过文字描述创建精美图像
- 🎨 **图像编辑**: 修改现有图片，添加或更改图像细节
- 🔄 **多种风格选项**: 支持不同艺术风格和美学效果
- 💡 **智能提示建议**: AI提供创意建议，助力灵感激发
- 🌈 **使用最新Gemini 2.0 Flash模型**: 高质量图像生成

### 💬 DeepSeek 智能对话
- 🧠 **先进AI模型**: 使用DeepSeek强大的语言模型
- 📝 **多功能对话**: 解答问题、创作内容、激发灵感
- 📱 **响应式界面**: 在各种设备上流畅使用
- 💾 **对话保存**: 重要对话内容可保存备份

## 🚀 部署指南

### 前置条件

1. 一个[Netlify](https://www.netlify.com/)账户

### API密钥设置

在Netlify中设置以下环境变量：

1. `GEMINI_API_KEY`: 你的Google Gemini API密钥
2. `DEEPSEEK_API_KEY`: 你的DeepSeek API密钥 
3. 如需添加其他API密钥，请在Netlify环境变量中设置

> 注意：所有API密钥完全存储在Netlify环境变量中，前端不再能够直接访问这些密钥。

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

## 📝 待开发功能

- [ ] 历史记录保存与恢复系统
- [ ] 图像生成结果分享功能
- [ ] 用户偏好设置与自定义主题
- [ ] 更多AI模型的集成
- [ ] 批量图像处理功能
- [ ] 社区分享与展示平台

## 💻 技术栈

- **前端**: HTML5, CSS3, JavaScript
- **后端**: Netlify Edge Functions
- **AI 模型**: 
  - Gemini 2.0 Flash (图像生成)
  - DeepSeek (智能对话)
- **设计理念**: 极简主义、用户友好、视觉美学

## 🔧 项目结构

```
/
├── index.html              # 主页，包含导航和工具卡片
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
4. 在首页添加新的工具卡片，链接到新创建的页面

## 📄 许可证

MIT License © 2024 

---

> **注意**: 此项目仅供学习和研究使用，请遵守 AI 内容生成相关法规和道德准则。 