// import axios from 'axios';
import { mockStocks } from './mockData.js';

// 创建axios实例（已注释，当前未使用）
// const api = axios.create({
//   baseURL: '/api',
//   timeout: 10000,
// });

class StockService {
  /**
   * 搜索股票
   * @param {string} searchTerm 搜索关键词
   * @returns {Promise<{data: Stock[], total: number}>}
   */
  static async searchStocks(searchTerm) {
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      if (!searchTerm || searchTerm.trim() === '') {
        return {
          data: mockStocks.slice(0, 10),
          total: mockStocks.length
        };
      }
      
      const filteredStocks = mockStocks.filter(stock => 
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.code.includes(searchTerm) ||
        stock.name.includes(searchTerm)
      );
      
      return {
        data: filteredStocks,
        total: filteredStocks.length
      };
    } catch (error) {
      console.error('搜索股票失败:', error);
      throw new Error('股票搜索服务暂时不可用，请稍后重试');
    }
  }

  /**
   * 获取股票详细信息
   * @param {string} stockCode 股票代码
   * @returns {Promise<Stock>}
   */
  static async getStockInfo(stockCode) {
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      
      const stock = mockStocks.find(s => s.code === stockCode);
      
      if (!stock) {
        throw new Error(`未找到股票代码为 ${stockCode} 的股票信息`);
      }
      
      return {
        data: stock,
        total: 1
      };
    } catch (error) {
      console.error('获取股票信息失败:', error);
      throw new Error('获取股票信息失败，请稍后重试');
    }
  }

  /**
   * 获取热门股票列表
   * @param {number} limit 返回数量限制
   * @returns {Promise<{data: Stock[], total: number}>}
   */
  static async getHotStocks(limit = 10) {
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 250));
      
      // 随机排序，模拟热门股票
      const shuffledStocks = [...mockStocks].sort(() => Math.random() - 0.5);
      
      return {
        data: shuffledStocks.slice(0, limit),
        total: shuffledStocks.length
      };
    } catch (error) {
      console.error('获取热门股票失败:', error);
      throw new Error('获取热门股票失败，请稍后重试');
    }
  }
}

export default StockService;