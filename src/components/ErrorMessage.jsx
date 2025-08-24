import React from 'react';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  type = 'default',
  className = '',
  showIcon = true 
}) => {
  if (!error) return null;

  // 错误类型样式映射
  const typeStyles = {
    default: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-400',
      button: 'bg-red-100 hover:bg-red-200 text-red-800'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-400',
      button: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-400',
      button: 'bg-blue-100 hover:bg-blue-200 text-blue-800'
    }
  };

  const styles = typeStyles[type] || typeStyles.default;

  // 根据错误类型选择图标
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${styles.container} ${className}`}>
      <div className="flex items-start space-x-3">
        {/* 错误图标 */}
        {showIcon && (
          <div className={`flex-shrink-0 ${styles.icon}`}>
            {getIcon()}
          </div>
        )}
        
        {/* 错误内容 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium">
            {type === 'warning' ? '警告' : type === 'info' ? '提示' : '出错了'}
          </h3>
          <p className="mt-1 text-sm opacity-90">
            {typeof error === 'string' ? error : error.message || '发生未知错误'}
          </p>
          
          {/* 重试按钮 */}
          {onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded transition-colors ${styles.button}`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重新尝试
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 简化版内联错误组件
const InlineError = ({ error, className = '' }) => {
  if (!error) return null;
  
  return (
    <div className={`flex items-center space-x-2 text-red-600 text-sm ${className}`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <span>{typeof error === 'string' ? error : error.message || '出错了'}</span>
    </div>
  );
};

// 空状态组件
const EmptyState = ({ 
  title = '暂无数据', 
  description = '当前没有找到相关内容',
  icon,
  action,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {/* 图标 */}
      <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
        {icon || (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      
      {/* 标题和描述 */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">{description}</p>
      
      {/* 操作按钮 */}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

ErrorMessage.Inline = InlineError;
ErrorMessage.Empty = EmptyState;

export default ErrorMessage;