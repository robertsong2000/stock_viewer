import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">A股新闻浏览器</h1>
              <p className="text-sm text-gray-500">实时获取A股市场最新资讯</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                首页
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                热门股票
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                市场分析
              </a>
            </nav>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </div>
              <div className="text-xs text-gray-400">
                数据更新时间: {new Date().toLocaleTimeString('zh-CN')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;