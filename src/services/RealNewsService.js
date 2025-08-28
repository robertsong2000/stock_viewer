import axios from 'axios';

// 真实新闻API服务类
class RealNewsService {
  constructor() {
    this.api = axios.create({
      timeout: 10000,
    });
  }

  /**
   * 方案一：使用NewsAPI（需要API Key）
   * 官网：https://newsapi.org/
   * 免费额度：每天1000次请求
   */
  async getNewsFromNewsAPI(stockCode, stockName) {
    const API_KEY = process.env.REACT_APP_NEWS_API_KEY; // 需要在.env文件中设置
    
    try {
      const response = await this.api.get('https://newsapi.org/v2/everything', {
        params: {
          q: `${stockName} OR ${stockCode}`, // 搜索股票名称或代码
          language: 'zh', // 中文新闻
          sortBy: 'publishedAt',
          pageSize: 20,
          apiKey: API_KEY
        }
      });

      return this.formatNewsAPIResponse(response.data.articles, stockCode);
    } catch (error) {
      console.error('NewsAPI请求失败:', error);
      throw error;
    }
  }

  /**
   * 方案二：使用新浪财经接口（无需API Key，但可能不稳定）
   */
  async getNewsFromSina(stockCode) {
    try {
      // 新浪财经的股票新闻接口
      const response = await this.api.get(`https://finance.sina.com.cn/stock/news/${stockCode}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      // 注意：这需要解析HTML或使用新浪的JSON API
      return this.parseSinaNews(response.data, stockCode);
    } catch (error) {
      console.error('新浪财经接口请求失败:', error);
      throw error;
    }
  }

  /**
   * 方案三：使用聚合数据API
   * 官网：https://www.juhe.cn/
   */
  async getNewsFromJuhe(stockCode) {
    const API_KEY = process.env.REACT_APP_JUHE_API_KEY;
    
    try {
      const response = await this.api.get('http://v.juhe.cn/finance/stock/news', {
        params: {
          gid: stockCode,
          key: API_KEY
        }
      });

      if (response.data.error_code === 0) {
        return this.formatJuheResponse(response.data.result, stockCode);
      } else {
        throw new Error(response.data.reason);
      }
    } catch (error) {
      console.error('聚合数据API请求失败:', error);
      throw error;
    }
  }

  /**
   * 方案四：使用东方财富网接口
   */
  async getNewsFromEastMoney(stockCode) {
    try {
      // 东方财富的股票新闻接口
      const marketPrefix = stockCode.startsWith('6') ? '1' : '0'; // 沪市1，深市0
      const fullCode = `${marketPrefix}.${stockCode}`;
      
      const response = await this.api.get('http://push2.eastmoney.com/api/qt/stock/news', {
        params: {
          ut: 'f57e1bc0c53e4e7e99e1bef0b7c20800',
          fltt: '2',
          secid: fullCode,
          fields: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18',
          invt: '2'
        }
      });

      return this.formatEastMoneyResponse(response.data, stockCode);
    } catch (error) {
      console.error('东方财富接口请求失败:', error);
      throw error;
    }
  }

  // 格式化NewsAPI响应
  formatNewsAPIResponse(articles, stockCode) {
    return articles.map((article, index) => ({
      id: `news_${stockCode}_${index}`,
      title: article.title,
      summary: article.description || article.content?.substring(0, 100) + '...',
      publishTime: article.publishedAt,
      source: article.source.name,
      url: article.url,
      stockCode,
      imageUrl: article.urlToImage
    }));
  }

  // 格式化聚合数据响应
  formatJuheResponse(result, stockCode) {
    return result.map((item, index) => ({
      id: `news_${stockCode}_${index}`,
      title: item.title,
      summary: item.digest,
      publishTime: new Date(item.time * 1000).toISOString(),
      source: item.src,
      url: item.url,
      stockCode
    }));
  }

  // 格式化东方财富响应
  formatEastMoneyResponse(data, stockCode) {
    if (!data.data || !data.data.news) return [];
    
    return data.data.news.map((item, index) => ({
      id: `news_${stockCode}_${index}`,
      title: item.title,
      summary: item.digest,
      publishTime: new Date(item.showtime * 1000).toISOString(),
      source: item.media_name,
      url: item.url,
      stockCode
    }));
  }

  // 解析新浪财经HTML响应（需要根据实际页面结构调整）
  parseSinaNews(htmlContent, stockCode) {
    // 这里需要使用HTML解析库或正则表达式来提取新闻信息
    // 由于跨域问题，建议使用后端代理
    console.warn(`新浪财经接口需要后端代理或HTML解析，股票代码: ${stockCode}`);
    return [];
  }
}

export default RealNewsService;