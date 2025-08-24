import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce.js';
import useStockData from '../hooks/useStockData.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import ErrorMessage from './ErrorMessage.jsx';

const StockSelector = ({ onStockSelect, selectedStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // 使用防抖优化搜索
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // 使用股票数据管理Hook
  const {
    stocks,
    loading,
    error,
    searchStocks,
    getHotStocks,
    clearError
  } = useStockData();

  // 调试：监听 loading 状态变化
  useEffect(() => {
    console.log('🔄 loading 状态变化:', loading);
  }, [loading]);

  // 监听防抖后的搜索词变化
  useEffect(() => {
    console.log('🔄 debouncedSearchTerm 变化:', debouncedSearchTerm, 'isInputFocused:', isInputFocused);
    if (debouncedSearchTerm.trim()) {
      console.log('🔍 执行搜索股票');
      searchStocks(debouncedSearchTerm);
      setIsDropdownOpen(true);
    } else if (isInputFocused) {
      // 输入框获得焦点但没有搜索词时，显示热门股票
      console.log('🔥 输入框焦点但无搜索词，获取热门股票');
      getHotStocks(10);
      setIsDropdownOpen(true);
    }
  }, [debouncedSearchTerm, searchStocks, getHotStocks, isInputFocused]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 处理输入框变化
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    clearError();
    
    if (!value.trim()) {
      setIsDropdownOpen(false);
    }
  };

  // 处理输入框获得焦点
  const handleInputFocus = () => {
    console.log('🎯 输入框获得焦点, searchTerm:', searchTerm);
    setIsInputFocused(true);
    if (!searchTerm.trim()) {
      console.log('🔥 无搜索词，获取热门股票');
      getHotStocks(10);
      setIsDropdownOpen(true);
    } else {
      console.log('🔍 有搜索词，展示下拉菜单');
      setIsDropdownOpen(true);
    }
  };

  // 处理股票选择
  const handleStockSelect = (stock) => {
    setSearchTerm(stock.name);
    setIsDropdownOpen(false);
    setIsInputFocused(false);
    onStockSelect(stock);
    clearError();
    
    // 输入框失去焦点
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // 清空选择
  const handleClearSelection = () => {
    setSearchTerm('');
    setIsDropdownOpen(false);
    setIsInputFocused(false);
    onStockSelect(null);
    clearError();
    
    // 重新聚焦输入框
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // 格式化股票显示
  const formatStockDisplay = (stock) => {
    const changeColor = stock.change >= 0 ? 'text-green-600' : 'text-red-600';
    const changePrefix = stock.change >= 0 ? '+' : '';
    
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{stock.name}</span>
            <span className="text-sm text-gray-500">({stock.code})</span>
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-sm text-gray-600">¥{stock.price}</span>
            <span className={`text-sm font-medium ${changeColor}`}>
              {changePrefix}{(stock.change * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-gray-400">{stock.market}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="搜索股票名称或代码..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        
        {/* 清除按钮 */}
        {(searchTerm || selectedStock) && (
          <button
            onClick={handleClearSelection}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 下拉菜单 */}
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden"
        >
          {/* 错误状态 */}
          {error && (
            <div className="p-3">
              <ErrorMessage.Inline error={error} />
            </div>
          )}
          
          {/* 加载状态 */}
          {loading && (
            <div className="p-6">
              <LoadingSpinner.Inline />
            </div>
          )}
          
          {/* 搜索结果 */}
          {!loading && !error && stocks.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {/* 搜索结果标题 */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-sm text-gray-600">
                  {searchTerm.trim() ? `搜索结果 (${stocks.length})` : `热门股票 (${stocks.length})`}
                </p>
              </div>
              
              {/* 股票列表 */}
              <ul className="divide-y divide-gray-100">
                {stocks.map((stock) => (
                  <li key={stock.code}>
                    <button
                      onClick={() => handleStockSelect(stock)}
                      className="w-full px-3 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                    >
                      {formatStockDisplay(stock)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* 无结果状态 */}
          {!loading && !error && stocks.length === 0 && searchTerm.trim() && (
            <div className="p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">未找到相关股票</p>
              <p className="text-xs text-gray-400 mt-1">请尝试其他关键词</p>
            </div>
          )}
        </div>
      )}
      
      {/* 当前选中的股票显示 */}
      {selectedStock && !isInputFocused && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">已选择股票:</p>
              <p className="text-blue-900 font-semibold mt-1">
                {selectedStock.name} ({selectedStock.code})
              </p>
            </div>
            <button
              onClick={handleClearSelection}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSelector;