import React, { useState, useEffect } from 'react';
import NewsService from '../services/NewsService.js';

const NewsSourceIndicator = ({ className = '' }) => {
  const [sourceInfo, setSourceInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 检查是否有缓存状态方法
    if (typeof NewsService.getCacheStatus === 'function') {
      try {
        const cacheStatus = NewsService.getCacheStatus();
        setSourceInfo(cacheStatus);
        setIsVisible(true);
      } catch (error) {
        console.debug('无法获取新闻源状态:', error);
      }
    }
  }, []);

  // 获取新闻模式的中文描述
  const getModeDescription = (mode) => {
    switch (mode) {
      case 'real':
        return { text: '真实新闻', color: 'text-green-600', bg: 'bg-green-100' };
      case 'hybrid':
        return { text: '混合模式', color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'mock':
      default:
        return { text: '模拟数据', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  if (!isVisible || !sourceInfo) {
    return null;
  }

  const mode = sourceInfo.config?.mode || 'mock';
  const modeInfo = getModeDescription(mode);

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <div className={`px-2 py-1 rounded-full ${modeInfo.bg} ${modeInfo.color} font-medium`}>
        📰 {modeInfo.text}
      </div>
      
      {sourceInfo.size > 0 && (
        <div className="text-gray-500 text-xs">
          缓存: {sourceInfo.size} 项
        </div>
      )}
      
      {/* 调试信息（仅在开发环境显示） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400">
          {sourceInfo.config?.realApiPriority?.join(', ')}
        </div>
      )}
    </div>
  );
};

export default NewsSourceIndicator;