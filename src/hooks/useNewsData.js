import { useState, useEffect, useCallback } from 'react';
import NewsService from '../services/NewsService.js';

/**
 * 新闻数据管理Hook
 * @returns {Object} 新闻相关状态和操作方法
 */
function useNewsData() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * 获取指定股票的新闻
   * @param {string} stockCode 股票代码
   * @param {number} limit 返回数量限制
   */
  const fetchNews = useCallback(async (stockCode, limit = 10) => {
    if (!stockCode) {
      setNewsList([]);
      setError(null);
      setLastUpdated(null);
      return;
    }
    
    console.log('📰 获取新闻:', stockCode);
    setLoading(prevLoading => {
      if (prevLoading) return prevLoading;
      return true;
    });
    setError(null);
    
    try {
      const result = await NewsService.getStockNews(stockCode, limit);
      console.log('✅ 新闻获取成功:', result.data.length, '条');
      setNewsList(result.data);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('❌ 新闻获取失败:', err.message);
      setError(err.message || '获取新闻失败，请稍后重试');
      setNewsList([]);
    } finally {
      console.log('🏁 新闻加载完成');
      setLoading(false);
    }
  }, []); // 移除 loading 依赖

  /**
   * 刷新新闻数据
   * @param {string} stockCode 股票代码
   * @param {number} limit 返回数量限制
   */
  const refreshNews = useCallback(async (stockCode, limit = 10) => {
    await fetchNews(stockCode, limit);
  }, [fetchNews]);

  /**
   * 搜索新闻
   * @param {string} keyword 搜索关键词
   * @param {number} limit 返回数量限制
   */
  const searchNews = useCallback(async (keyword, limit = 20) => {
    if (!keyword || keyword.trim() === '') {
      setNewsList([]);
      setError(null);
      setLastUpdated(null);
      return;
    }
    
    console.log('🔍 开始搜索新闻:', keyword);
    setLoading(prevLoading => {
      if (prevLoading) {
        console.log('⚠️ 新闻搜索已在进行中，跳过请求');
        return prevLoading;
      }
      return true;
    });
    setError(null);
    
    try {
      const result = await NewsService.searchNews(keyword, limit);
      console.log('✅ 搜索新闻成功:', result);
      setNewsList(result.data);  
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('❌ 搜索新闻失败:', err);
      setError(err.message || '搜索新闻失败，请稍后重试');
      setNewsList([]);
    } finally {
      console.log('🏁 搜索新闻完成，设置loading为false');
      setLoading(false);
    }
  }, []); // 移除 loading 依赖

  /**
   * 获取新闻详情
   * @param {string} newsId 新闻ID
   */
  const getNewsDetail = useCallback(async (newsId) => {
    if (!newsId) return null;
    
    try {
      const result = await NewsService.getNewsDetail(newsId);
      return result.data;
    } catch (err) {
      console.error('获取新闻详情失败:', err);
      setError(err.message || '获取新闻详情失败，请稍后重试');
      return null;
    }
  }, []);

  /**
   * 清空新闻列表
   */
  const clearNews = useCallback(() => {
    setNewsList([]);
    setError(null);
    setLastUpdated(null);
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
    setNewsList([]);
    setLoading(false);
    setError(null);
    setLastUpdated(null);
  }, []);

  /**
   * 格式化最后更新时间
   */
  const formatLastUpdated = useCallback(() => {
    if (!lastUpdated) return null;
    
    const date = new Date(lastUpdated);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return '刚刚更新';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前更新`;
    } else if (diffInMinutes < 1440) { // 24小时
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}小时前更新`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }, [lastUpdated]);

  return {
    // 状态
    newsList,
    loading,
    error,
    lastUpdated,
    
    // 操作方法
    fetchNews,
    refreshNews,
    searchNews,
    getNewsDetail,
    clearNews,
    clearError,
    reset,
    
    // 辅助方法
    formatLastUpdated,
    
    // 计算属性
    hasNews: newsList.length > 0,
    isEmpty: !loading && newsList.length === 0 && !error
  };
}

export default useNewsData;