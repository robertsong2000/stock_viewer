// // import axios from 'axios';
import { mockNews, generateMockNews } from './mockData.js';
import RealNewsService from './RealNewsService.js';

// 创建axios实例（已注释，当前未使用）
// const api = axios.create({
//   baseURL: '/api',
//   timeout: 10000,
// });

// 新闻服务配置
const NEWS_CONFIG = {
  // 数据源模式：'mock' | 'real' | 'hybrid'
  mode: (typeof process !== 'undefined' ? process.env.REACT_APP_NEWS_MODE : undefined) || (typeof import.meta !== 'undefined' ? import.meta.env.REACT_APP_NEWS_MODE : 'mock'),
  
  // 真实新闻API优先级
  realApiPriority: ['newsapi', 'juhe', 'eastmoney'],
  
  // API密钥配置
  apiKeys: {
    newsapi: (typeof process !== 'undefined' ? process.env.REACT_APP_NEWS_API_KEY : undefined) || (typeof import.meta !== 'undefined' ? import.meta.env.REACT_APP_NEWS_API_KEY : undefined),
    juhe: (typeof process !== 'undefined' ? process.env.REACT_APP_JUHE_API_KEY : undefined) || (typeof import.meta !== 'undefined' ? import.meta.env.REACT_APP_JUHE_API_KEY : undefined),
  },
  
  // 缓存配置
  cacheEnabled: true,
  cacheTime: 5 * 60 * 1000, // 5分钟缓存
};

class EnhancedNewsService {
  constructor() {
    this.realNewsService = new RealNewsService();
    this.cache = new Map();
  }

  /**
   * 获取指定股票的相关新闻（支持真实数据和模拟数据）
   * @param {string} stockCode 股票代码
   * @param {number} limit 返回新闻数量限制，默认10条
   * @returns {Promise<{data: News[], total: number, source: string}>}
   */
  async getStockNews(stockCode, limit = 10) {
    try {
      if (!stockCode) {
        throw new Error('股票代码不能为空');
      }

      // 检查缓存
      const cacheKey = `${stockCode}_${limit}`;
      if (NEWS_CONFIG.cacheEnabled && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < NEWS_CONFIG.cacheTime) {
          return { ...cached.data, source: 'cache' };
        }
      }

      let result;
      
      switch (NEWS_CONFIG.mode) {
        case 'real':
          result = await this.getRealNews(stockCode, limit);
          break;
        case 'hybrid':
          result = await this.getHybridNews(stockCode, limit);
          break;
        case 'mock':
        default:
          result = await this.getMockNews(stockCode, limit);
          break;
      }

      // 缓存结果
      if (NEWS_CONFIG.cacheEnabled) {
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }

      return result;
    } catch (err) {
          console.error('获取股票新闻失败:', err);
      
      // 如果真实API失败，回退到模拟数据
      if (NEWS_CONFIG.mode === 'real' || NEWS_CONFIG.mode === 'hybrid') {
        console.warn('真实新闻API失败，回退到模拟数据');
        return await this.getMockNews(stockCode, limit);
      }
      
      throw new Error('获取新闻失败，请稍后重试');
    }
  }

  /**
   * 获取真实新闻数据
   */
  async getRealNews(stockCode, limit) {
    const stockName = this.getStockNameByCode(stockCode);
    
    // 按优先级尝试不同的API
    for (const apiType of NEWS_CONFIG.realApiPriority) {
      try {
        let newsData = [];
        
        switch (apiType) {
          case 'newsapi':
            if (NEWS_CONFIG.apiKeys.newsapi) {
              newsData = await this.realNewsService.getNewsFromNewsAPI(stockCode, stockName);
            }
            break;
          case 'juhe':
            if (NEWS_CONFIG.apiKeys.juhe) {
              newsData = await this.realNewsService.getNewsFromJuhe(stockCode, stockName);
            }
            break;
          case 'eastmoney':
            newsData = await this.realNewsService.getNewsFromEastMoney(stockCode);
            break;
        }

        if (newsData.length > 0) {
          return {
            data: newsData.slice(0, limit),
            total: newsData.length,
            source: `real_${apiType}`
          };
        }
      } catch (err) {
        console.warn(`${apiType} API失败:`, err.message);
        continue;
      }
    }
    
    throw new Error('所有真实新闻API都失败了');
  }

  /**
   * 获取混合新闻数据（优先真实，回退模拟）
   */
  async getHybridNews(stockCode, limit) {
    try {
      // 先尝试获取真实新闻
      const realNews = await this.getRealNews(stockCode, Math.ceil(limit * 0.7));
      
      if (realNews.data.length >= limit) {
        return realNews;
      }
      
      // 如果真实新闻不够，补充模拟新闻
      const mockNews = await this.getMockNews(stockCode, limit - realNews.data.length);
      
      return {
        data: [...realNews.data, ...mockNews.data],
        total: realNews.total + mockNews.total,
        source: 'hybrid'
      };
    } catch {
      // 如果真实新闻完全失败，使用模拟新闻
      return await this.getMockNews(stockCode, limit);
    }
  }

  /**
   * 获取模拟新闻数据（原有逻辑）
   */
  async getMockNews(stockCode, limit) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 250));
    
    let newsData = [];
    
    // 优先使用预定义的新闻数据
    if (mockNews[stockCode]) {
      newsData = [...mockNews[stockCode]];
    } else {
      // 为其他股票生成模拟新闻
      const stockName = this.getStockNameByCode(stockCode);
      newsData = generateMockNews(stockCode, stockName);
    }
    
    // 按发布时间倒序排列
    newsData.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
    
    return {
      data: newsData.slice(0, limit),
      total: newsData.length,
      source: 'mock'
    };
  }

  /**
   * 根据股票代码获取股票名称
   */
  getStockNameByCode(stockCode) {
    const stockMap = {
      "000001": "平安银行",
      "000002": "万科A", 
      "600000": "浦发银行",
      "600036": "招商银行",
      "000858": "五粮液",
      "600519": "贵州茅台",
      "000166": "申万宏源",
      "600030": "中信证券",
      "300750": "宁德时代",
      "002415": "海康威视"
    };
    
    return stockMap[stockCode] || `股票${stockCode}`;
  }

  /**
   * 获取新闻详情
   */
  async getNewsDetail(newsId) {
    try {
      // 先在缓存中查找
      for (const [, cached] of this.cache.entries()) {
        const found = cached.data.data.find(news => news.id === newsId);
        if (found) {
          return { data: found, total: 1, source: 'cache' };
        }
      }

      // 在模拟数据中查找
      for (const stockCode in mockNews) {
        const news = mockNews[stockCode].find(n => n.id === newsId);
        if (news) {
          return { data: news, total: 1, source: 'mock' };
        }
      }
      
      throw new Error(`未找到ID为 ${newsId} 的新闻`);
    } catch (error) {
      console.error('获取新闻详情失败:', error);
      throw new Error('获取新闻详情失败，请稍后重试');
    }
  }

  /**
   * 搜索新闻
   */
  async searchNews(keyword, limit = 20) {
    try {
      if (!keyword || keyword.trim() === '') {
        return { data: [], total: 0, source: 'empty' };
      }
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      const allNews = [];
      
      // 收集缓存中的真实新闻
      for (const [, cached] of this.cache.entries()) {
        if (cached.data.source && cached.data.source.startsWith('real')) {
          allNews.push(...cached.data.data);
        }
      }
      
      // 收集模拟新闻
      for (const stockCode in mockNews) {
        allNews.push(...mockNews[stockCode]);
      }
      
      // 搜索匹配的新闻
      const filteredNews = allNews.filter(news =>
        news.title.toLowerCase().includes(keyword.toLowerCase()) ||
        news.summary.toLowerCase().includes(keyword.toLowerCase()) ||
        news.source.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // 按发布时间倒序排列
      filteredNews.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
      
      return {
        data: filteredNews.slice(0, limit),
        total: filteredNews.length,
        source: 'search'
      };
    } catch (error) {
      console.error('搜索新闻失败:', error);
      throw new Error('搜索新闻失败，请稍后重试');
    }
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 获取缓存状态
   */
  getCacheStatus() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      config: NEWS_CONFIG
    };
  }
}

// 创建单例实例
const enhancedNewsService = new EnhancedNewsService();

// 导出静态方法以保持向后兼容
class NewsService {
  static async getStockNews(stockCode, limit = 10) {
    return enhancedNewsService.getStockNews(stockCode, limit);
  }

  static async getNewsDetail(newsId) {
    return enhancedNewsService.getNewsDetail(newsId);
  }

  static async searchNews(keyword, limit = 20) {
    return enhancedNewsService.searchNews(keyword, limit);
  }

  static clearCache() {
    return enhancedNewsService.clearCache();
  }

  static getCacheStatus() {
    return enhancedNewsService.getCacheStatus();
  }
}

export default NewsService;