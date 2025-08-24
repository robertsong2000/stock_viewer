import { useState, useCallback } from 'react';
import StockService from '../services/StockService.js';

/**
 * 股票数据管理Hook
 * @returns {Object} 股票相关状态和操作方法
 */
function useStockData() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 搜索股票
   * @param {string} searchTerm 搜索关键词  
   */
  const searchStocks = useCallback(async (searchTerm) => {
    console.log('🔍 搜索股票:', searchTerm);
    setLoading(prevLoading => {
      if (prevLoading) return prevLoading;
      return true;
    });
    setError(null);
    
    try {
      const result = await StockService.searchStocks(searchTerm);
      console.log('✅ 搜索成功:', result.data.length, '只股票');
      setStocks(result.data);
    } catch (err) {
      console.error('❌ 搜索失败:', err.message);
      setError(err.message || '搜索股票失败，请稍后重试');
      setStocks([]);
    } finally {
      console.log('🏁 股票搜索完成');
      setLoading(false);
    }
  }, []); // 移除 loading 依赖

  /**
   * 获取热门股票
   * @param {number} limit 返回数量限制
   */
  const getHotStocks = useCallback(async (limit = 10) => {
    console.log('🔥 获取热门股票');
    setLoading(prevLoading => {
      if (prevLoading) return prevLoading;
      return true;
    });
    setError(null);
    
    try {
      const result = await StockService.getHotStocks(limit);
      console.log('✅ 热门股票获取成功:', result.data.length, '只');
      setStocks(result.data);
    } catch (err) {
      console.error('❌ 热门股票获取失败:', err.message);
      setError(err.message || '获取热门股票失败，请稍后重试');
      setStocks([]);
    } finally {
      console.log('🏁 热门股票加载完成');
      setLoading(false);
    }
  }, []); // 移除 loading 依赖

  /**
   * 获取股票详细信息
   * @param {string} stockCode 股票代码
   */
  const getStockInfo = useCallback(async (stockCode) => {
    if (!stockCode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await StockService.getStockInfo(stockCode);
      return result.data;
    } catch (err) {
      console.error('获取股票信息失败:', err);
      setError(err.message || '获取股票信息失败，请稍后重试');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 选择股票
   * @param {Object} stock 股票对象
   */
  const selectStock = useCallback((stock) => {
    setSelectedStock(stock);
    setError(null);
  }, []);

  /**
   * 清空选择
   */
  const clearSelection = useCallback(() => {
    setSelectedStock(null);
    setError(null);
  }, []);

  /**
   * 清空错误状态
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 重置所有状态
   */
  const reset = useCallback(() => {
    setStocks([]);
    setSelectedStock(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    // 状态
    stocks,
    selectedStock,
    loading,
    error,
    
    // 操作方法
    searchStocks,
    getHotStocks,
    getStockInfo,
    selectStock,
    clearSelection,
    clearError,
    reset,
    
    // 设置方法（用于外部直接设置状态）
    setSelectedStock
  };
}

export default useStockData;