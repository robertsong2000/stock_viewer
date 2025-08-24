import React, { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import StockSelector from './components/StockSelector.jsx';
import NewsList from './components/NewsList.jsx';
import useStockData from './hooks/useStockData.js';
import useNewsData from './hooks/useNewsData.js';

function App() {
  // 使用自定义Hooks管理状态
  const {
    selectedStock,
    selectStock,
    clearSelection
  } = useStockData();

  const {
    newsList,
    loading: newsLoading,
    error: newsError,
    fetchNews,
    clearError: clearNewsError
  } = useNewsData();

  // 当选择股票时，自动获取相关新闻
  useEffect(() => {
    if (selectedStock) {
      console.log('📰 获取', selectedStock.name, '新闻');
      fetchNews(selectedStock.code, 10);
    }
  }, [selectedStock, fetchNews]);

  // 处理股票选择
  const handleStockSelect = (stock) => {
    selectStock(stock);
    clearNewsError();
  };

  // 处理刷新新闻
  const handleRefreshNews = () => {
    if (selectedStock) {
      fetchNews(selectedStock.code, 10);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 页面头部 */}
      <Header />
      
      {/* 主要内容区域 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 股票选择器 */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                选择股票
              </h2>
              <StockSelector 
                onStockSelect={handleStockSelect}
                selectedStock={selectedStock}
              />
            </div>
          </div>
          
          {/* 新闻列表 */}
          <div>
            <NewsList 
              news={newsList}
              loading={newsLoading}
              error={newsError}
              stockName={selectedStock?.name}
              onRetry={handleRefreshNews}
            />
          </div>
        </div>
      </main>
      
      {/* 页面底部 */}
      <Footer />
    </div>
  );
}

export default App;
