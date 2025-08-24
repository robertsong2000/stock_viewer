import React from 'react';

const NewsItem = ({ news }) => {
  // 格式化时间显示
  const formatTime = (publishTime) => {
    const date = new Date(publishTime);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return '刚刚';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    } else if (diffInMinutes < 1440) { // 24小时
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}小时前`;
    } else if (diffInMinutes < 10080) { // 7天
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // 处理新闻链接点击
  const handleNewsClick = () => {
    if (news.url) {
      window.open(news.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* 新闻标题 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
          <button
            onClick={handleNewsClick}
            className="text-left hover:text-primary transition-colors focus:outline-none focus:text-primary"
            title="点击查看新闻详情"
          >
            {news.title}
          </button>
        </h3>
        
        {/* 新闻摘要 */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {news.summary}
        </p>
        
        {/* 新闻元信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {/* 新闻来源 */}
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
              </svg>
              <span>{news.source}</span>
            </div>
            
            {/* 发布时间 */}
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{formatTime(news.publishTime)}</span>
            </div>
          </div>
          
          {/* 外部链接图标 */}
          {news.url && (
            <button
              onClick={handleNewsClick}
              className="flex items-center space-x-1 text-primary hover:text-primary-hover transition-colors focus:outline-none"
              title="访问原文"
            >
              <span className="text-xs">查看详情</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default NewsItem;