import { useState, useEffect, useCallback } from 'react';

/**
 * 防抖Hook
 * @param {any} value 需要防抖的值
 * @param {number} delay 延迟时间（毫秒）
 * @returns {any} 防抖后的值
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 防抖回调Hook
 * @param {Function} callback 回调函数
 * @param {number} delay 延迟时间（毫秒）
 * @param {Array} deps 依赖数组
 * @returns {Function} 防抖后的回调函数
 */
function useDebouncedCallback(callback, delay) {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedCallback = useCallback((...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  }, [callback, delay, debounceTimer]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}

export { useDebounce, useDebouncedCallback };