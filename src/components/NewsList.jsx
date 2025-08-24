import React from 'react';
import NewsItem from './NewsItem.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import ErrorMessage from './ErrorMessage.jsx';

const NewsList = ({ news, loading, error, stockName, onRetry }) => {
  // 如果没有选择股票，显示提示信息
  if (!stockName && !loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <ErrorMessage.Empty
          title="请选择股票"
          description="选择一只A股股票，即可查看相关的最新新闻资讯"
          icon={
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 新闻列表标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {stockName ? `${stockName} 相关新闻` : '股票新闻'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            为您提供最新、最准确的股票相关资讯
          </p>
        </div>
        
        {/* 刷新按钮 */}
        {stockName && onRetry && !loading && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-primary border border-gray-300 rounded-lg hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>刷新</span>
          </button>
        )}
      </div>

      {/* 错误状态 */}
      {error && (
        <ErrorMessage
          error={error}
          onRetry={onRetry}
          className="mb-6"
        />
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <LoadingSpinner 
            size="large" 
            text="正在获取最新新闻..."
            className="text-center"
          />
        </div>
      )}

      {/* 新闻列表 */}
      {!loading && !error && news.length > 0 && (
        <div className="space-y-4">
          {/* 新闻统计信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500 pb-2 border-b border-gray-100">
            <span>共找到 {news.length} 条相关新闻</span>
            <span>按发布时间排序</span>
          </div>
          
          {/* 新闻项列表 */}
          <div className="grid gap-4">
            {news.map((item, index) => (
              <div key={item.id || index} className="transition-all duration-200">
                <NewsItem news={item} />
              </div>
            ))}
          </div>
          
          {/* 列表底部信息 */}
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">
              已显示最新 {news.length} 条新闻
            </p>
            <p className="text-xs text-gray-400 mt-1">
              新闻内容由第三方提供，仅供参考
            </p>
          </div>
        </div>
      )}

      {/* 无新闻状态 */}
      {!loading && !error && news.length === 0 && stockName && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <ErrorMessage.Empty
            title="暂无相关新闻"
            description={`目前没有找到关于 ${stockName} 的最新新闻，请稍后再试`}
            icon={
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            }
            action={
              onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新获取
                </button>
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export default NewsList;