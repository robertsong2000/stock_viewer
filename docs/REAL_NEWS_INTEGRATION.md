# 股票新闻真实数据源集成指南

## 概述

本指南详细介绍如何将股票查看器从模拟新闻数据切换到真实新闻数据源。项目支持多种新闻API，并提供灵活的配置选项。

## 当前实现

目前项目使用 `src/services/mockData.js` 中的模拟数据：
- **预定义新闻**：为特定股票准备的静态新闻
- **动态生成新闻**：通过模板为其他股票生成的通用新闻

## 新增功能

### 1. 多数据源支持

新增的 `EnhancedNewsService.js` 支持三种模式：

#### Mock模式（默认）
```javascript
REACT_APP_NEWS_MODE=mock
```
使用原有的模拟数据，适合开发和测试。

#### Real模式
```javascript
REACT_APP_NEWS_MODE=real
```
仅使用真实新闻API，如果API失败则回退到模拟数据。

#### Hybrid模式
```javascript
REACT_APP_NEWS_MODE=hybrid
```
优先使用真实新闻，不足时补充模拟新闻。

### 2. 支持的新闻API

#### NewsAPI (推荐)
- **官网**: https://newsapi.org/
- **特点**: 高质量新闻源，支持中文
- **限制**: 免费版每天1000次请求
- **配置**: 
  ```bash
  REACT_APP_NEWS_API_KEY=your_newsapi_key
  ```

#### 聚合数据API
- **官网**: https://www.juhe.cn/
- **特点**: 专门的股票新闻接口
- **限制**: 需要付费，有免费试用
- **配置**:
  ```bash
  REACT_APP_JUHE_API_KEY=your_juhe_key
  ```

#### 东方财富网API
- **特点**: 免费，无需API Key
- **限制**: 可能不稳定，有反爬限制
- **优势**: 专业的股票新闻

## 快速开始

### 1. 复制环境配置
```bash
cp .env.example .env
```

### 2. 配置API密钥
编辑 `.env` 文件：
```bash
# 选择模式
REACT_APP_NEWS_MODE=hybrid

# 配置NewsAPI密钥
REACT_APP_NEWS_API_KEY=your_actual_api_key
```

### 3. 更新NewsService导入
在需要使用增强功能的地方，更新导入：

```javascript
// 原来的导入
import NewsService from './services/NewsService.js';

// 更新为增强版本
import NewsService from './services/EnhancedNewsService.js';
```

### 4. 启动应用
```bash
npm run dev
```

## API申请指南

### NewsAPI申请步骤

1. **注册账户**
   - 访问 https://newsapi.org/
   - 点击 "Get API Key"
   - 填写注册信息

2. **获取API Key**
   - 登录后访问Dashboard
   - 复制API Key

3. **测试API**
   ```bash
   curl "https://newsapi.org/v2/everything?q=平安银行&language=zh&apiKey=YOUR_API_KEY"
   ```

### 聚合数据API申请

1. **注册账户**
   - 访问 https://www.juhe.cn/
   - 注册开发者账户

2. **申请接口**
   - 搜索"股票新闻"接口
   - 申请免费试用

3. **获取AppKey**
   - 在控制台查看已申请接口的AppKey

## 使用示例

### 基本用法
```javascript
import NewsService from './services/EnhancedNewsService.js';

// 获取股票新闻
const newsResult = await NewsService.getStockNews('000001', 10);
console.log('数据源:', newsResult.source); // 'real_newsapi', 'mock', 'hybrid'等
console.log('新闻数据:', newsResult.data);
```

### 缓存管理
```javascript
// 查看缓存状态
const cacheStatus = NewsService.getCacheStatus();
console.log('缓存大小:', cacheStatus.size);

// 清除缓存
NewsService.clearCache();
```

## 高级配置

### 自定义API优先级
编辑 `EnhancedNewsService.js` 中的配置：
```javascript
const NEWS_CONFIG = {
  // 调整API优先级
  realApiPriority: ['newsapi', 'eastmoney', 'juhe'],
  
  // 调整缓存时间
  cacheTime: 10 * 60 * 1000, // 10分钟
};
```

### 添加新的API源
1. 在 `RealNewsService.js` 中添加新方法
2. 在 `EnhancedNewsService.js` 中注册新API
3. 更新配置优先级

## 故障排除

### 常见问题

#### 1. API密钥无效
```
错误: API key is invalid
解决: 检查.env文件中的API密钥是否正确
```

#### 2. 跨域问题
```
错误: CORS error
解决: 某些API需要后端代理，建议使用NewsAPI
```

#### 3. 请求频率限制
```
错误: Rate limit exceeded
解决: 检查API调用频率，考虑增加缓存时间
```

### 调试模式
启用调试模式查看详细日志：
```bash
REACT_APP_DEBUG_MODE=true
```

## 性能优化

### 1. 缓存策略
- 默认缓存5分钟，减少API调用
- 可根据需要调整缓存时间
- 支持手动清除缓存

### 2. 回退机制
- Real模式失败时自动回退到Mock数据
- Hybrid模式智能混合真实和模拟数据
- 确保用户始终能看到内容

### 3. 请求优化
- 支持多个API源，自动切换
- 智能重试机制
- 合理的超时设置

## 部署注意事项

### 生产环境配置
1. 使用生产级API密钥
2. 设置适当的请求频率限制
3. 配置CDN加速
4. 启用日志监控

### 环境变量管理
```bash
# 开发环境
REACT_APP_NEWS_MODE=hybrid
REACT_APP_NEWS_API_KEY=dev_api_key

# 生产环境
REACT_APP_NEWS_MODE=real
REACT_APP_NEWS_API_KEY=prod_api_key
```

## 下一步计划

1. **增加更多新闻源**
   - 腾讯财经API
   - 百度新闻API
   - RSS源聚合

2. **智能推荐**
   - 基于用户行为的新闻推荐
   - 相关股票新闻推荐

3. **数据分析**
   - 新闻情感分析
   - 股价与新闻关联分析

## 技术支持

如有问题，请检查：
1. 环境变量配置是否正确
2. API密钥是否有效
3. 网络连接是否正常
4. 查看浏览器控制台错误信息

更多技术细节请参考源码注释和项目文档。