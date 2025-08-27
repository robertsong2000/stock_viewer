# 股票新闻查看器

一个基于 React + Vite 构建的现代化股票新闻聚合应用，提供实时股票数据和新闻资讯。

## 项目简介

这是一个股票新闻查看器应用，整合了股票数据展示和新闻资讯功能。用户可以选择不同的股票代码查看相关的实时新闻和市场动态。

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **HTTP客户端**: Axios
- **图标库**: Lucide React
- **代码规范**: ESLint + Prettier

## 功能特性

- 📈 实时股票数据展示
- 📰 多源新闻聚合
- 🔍 股票代码搜索和选择
- 📱 响应式设计，支持移动端
- ⚡ 快速加载和实时更新
- 🎯 智能新闻分类和标签

## 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖

```bash
npm install
```

### 开发环境启动

```bash
npm run dev
```

启动后，应用将在 http://localhost:5173 运行。

### 生产环境构建

```bash
npm run build
```

构建后的文件将输出到 `dist` 目录。

## 环境配置

项目使用环境变量进行配置。请复制 `.env.example` 文件为 `.env` 并填写相关配置：

```bash
cp .env.example .env
```

需要配置以下环境变量：
- `VITE_API_BASE_URL`: API基础地址
- `VITE_NEWS_API_KEY`: 新闻API密钥
- `VITE_STOCK_API_KEY`: 股票数据API密钥

## 项目结构

```
src/
├── components/          # React组件
│   ├── Header.jsx    # 页面头部
│   ├── StockSelector.jsx  # 股票选择器
│   ├── NewsList.jsx  # 新闻列表
│   └── ...
├── hooks/            # 自定义React Hooks
│   ├── useStockData.js  # 股票数据Hook
│   └── useNewsData.js   # 新闻数据Hook
├── services/         # API服务
│   ├── StockService.js  # 股票数据服务
│   ├── NewsService.js   # 新闻服务
│   └── RealNewsService.js # 实时新闻服务
├── utils/            # 工具函数
└── types/            # TypeScript类型定义
```

## API集成

### 股票数据

- **源**: 多个金融数据提供商
- **更新频率**: 实时
- **包含数据**: 股价、涨跌幅、成交量等

### 新闻数据

- **源**: 综合新闻聚合
- **分类**: 按股票代码、行业、市场动态
- **更新频率**: 实时推送

## 开发指南

### 代码规范

项目使用 ESLint 进行代码检查，确保代码质量：

```bash
npm run lint
```

### 测试

运行测试脚本：

```bash
npm run test
```

或测试新闻API：

```bash
node scripts/test-news-api.js
```

## 部署

### 静态部署

构建后的 `dist` 目录可以部署到任何静态文件服务器：

- Netlify
- Vercel
- GitHub Pages
- 阿里云OSS
- 腾讯云COS

### Docker部署

```bash
docker build -t stock-viewer .
docker run -p 80:80 stock-viewer
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 支持与联系

如有问题或建议，请通过以下方式联系：
- 提交 [Issue](https://github.com/your-username/stock-viewer/issues)
- 发送邮件到: your-email@example.com

## 更新日志

### v1.0.0 (2024-01)
- 🎉 初始版本发布
- ✨ 基础股票查看功能
- 📰 新闻聚合展示
- 📱 响应式设计

### v1.1.0 (2024-02)
- ⚡ 性能优化
- 🎯 新增实时新闻推送
- 🔍 改进搜索功能
- 🎨 UI界面优化
