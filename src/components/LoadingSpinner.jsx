import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = '加载中...', 
  className = '' 
}) => {
  // 尺寸样式映射
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  // 颜色样式映射
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    gray: 'text-gray-500',
    white: 'text-white'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* 旋转动画 */}
      <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
        <svg 
          className="w-full h-full" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      
      {/* 加载文本 */}
      {text && (
        <p className={`text-sm ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

// 简化版内联加载组件
const InlineLoader = ({ size = 'small', className = '' }) => {
  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className={`${size === 'small' ? 'w-4 h-4' : 'w-5 h-5'} text-primary animate-spin`}>
        <svg 
          className="w-full h-full" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <span className="text-sm text-gray-600">加载中...</span>
    </div>
  );
};

// 页面级加载组件
const PageLoader = ({ text = '页面加载中...' }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <LoadingSpinner size="large" text={text} />
      </div>
    </div>
  );
};

// 卡片级加载组件
const CardLoader = ({ height = '200px', text = '内容加载中...' }) => {
  return (
    <div 
      className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200"
      style={{ height }}
    >
      <LoadingSpinner size="medium" text={text} color="gray" />
    </div>
  );
};

LoadingSpinner.Inline = InlineLoader;
LoadingSpinner.Page = PageLoader;
LoadingSpinner.Card = CardLoader;

export default LoadingSpinner;