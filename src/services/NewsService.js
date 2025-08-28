// import axios from 'axios';
import { mockNews, generateMockNews } from './mockData.js';

// 检查是否启用增强新闻服务
const USE_ENHANCED_SERVICE = (typeof import.meta !== 'undefined' ? import.meta.env.REACT_APP_NEWS_MODE : undefined) && (typeof import.meta !== 'undefined' ? import.meta.env.REACT_APP_NEWS_MODE : undefined) !== 'mock';

// 动态导入增强服务
let EnhancedNewsService;
if (USE_ENHANCED_SERVICE) {
  try {
    EnhancedNewsService = await import('./EnhancedNewsService.js').then(module => module.default);
  } catch (error) {
    console.warn('增强新闻服务加载失败，使用默认服务:', error);
  }
}

// 创建axios实例（当前未使用，保留以备后续扩展）
// const api = axios.create({
//   baseURL: '/api',
//   timeout: 10000,
// });

class NewsService {
  /**
   * 获取指定股票的相关新闻
   * @param {string} stockCode 股票代码
   * @param {number} limit 返回新闻数量限制，默认10条
   * @returns {Promise<{data: News[], total: number, source?: string}>}
   */
  static async getStockNews(stockCode, limit = 10) {
    // 如果启用了增强服务，优先使用增强服务
    if (EnhancedNewsService) {
      try {
        return await EnhancedNewsService.getStockNews(stockCode, limit);
      } catch (error) {
        console.warn('增强新闻服务失败，回退到默认服务:', error);
      }
    }
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 250));
      
      if (!stockCode) {
        throw new Error('股票代码不能为空');
      }
      
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
      
      // 限制返回数量
      const limitedNews = newsData.slice(0, limit);
      
      return {
        data: limitedNews,
        total: newsData.length,
        source: 'mock'
      };
    } catch (error) {
      console.error('获取股票新闻失败:', error);
      throw new Error('获取新闻失败，请稍后重试');
    }
  }

  /**
   * 根据股票代码获取股票名称（用于生成新闻）
   * @param {string} stockCode 股票代码
   * @returns {string} 股票名称
   * @private
   */
  static getStockNameByCode(stockCode) {
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
   * @param {string} newsId 新闻ID
   * @returns {Promise<{data: News, total: number, source?: string}>}
   */
  static async getNewsDetail(newsId) {
    // 如果启用了增强服务，优先使用增强服务
    if (EnhancedNewsService) {
      try {
        return await EnhancedNewsService.getNewsDetail(newsId);
      } catch (error) {
        console.warn('增强新闻服务获取详情失败，回退到默认服务:', error);
      }
    }
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      // 在所有新闻中搜索
      for (const stockCode in mockNews) {
        const news = mockNews[stockCode].find(n => n.id === newsId);
        if (news) {
          return {
            data: news,
            total: 1,
            source: 'mock'
          };
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
   * @param {string} keyword 搜索关键词
   * @param {number} limit 返回数量限制
   * @returns {Promise<{data: News[], total: number, source?: string}>}
   */
  static async searchNews(keyword, limit = 20) {
    // 如果启用了增强服务，优先使用增强服务
    if (EnhancedNewsService) {
      try {
        return await EnhancedNewsService.searchNews(keyword, limit);
      } catch (error) {
        console.warn('增强新闻服务搜索失败，回退到默认服务:', error);
      }
    }
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      if (!keyword || keyword.trim() === '') {
        return {
          data: [],
          total: 0,
          source: 'empty'
        };
      }
      
      const allNews = [];
      
      // 收集所有新闻
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
        source: 'mock'
      };
    } catch (error) {
      console.error('搜索新闻失败:', error);
      throw new Error('搜索新闻失败，请稍后重试');
    }
  }
}

export default NewsService;