import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterByYear: (year: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onFilterByYear }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // 生成年份选项，从1950年到当前年份
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => (currentYear - i).toString());
  
  // 处理点击外部关闭筛选器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    
    // 添加搜索动画效果
    if (searchInputRef.current) {
      searchInputRef.current.blur();
      const animation = searchInputRef.current.animate(
        [
          { transform: 'scale(0.98)', boxShadow: '0 0 0 3px rgba(var(--primary-rgb), 0.1)' },
          { transform: 'scale(1)', boxShadow: '0 0 0 6px rgba(var(--primary-rgb), 0.2)' },
          { transform: 'scale(1)', boxShadow: '0 0 0 3px rgba(var(--primary-rgb), 0)' }
        ],
        {
          duration: 600,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
        }
      );
      
      animation.onfinish = () => {
        if (searchInputRef.current) {
          searchInputRef.current.style.boxShadow = '';
        }
      };
    }
  };
  
  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    onFilterByYear(year);
    setIsFilterOpen(false);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };
  
  // 动画变体
  const filterItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.03,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };
  
  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-soft p-6 mb-8 border border-neutral-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <motion.input
              ref={searchInputRef}
              type="text"
              placeholder="搜索回忆..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "input w-full pl-12 pr-10 transition-all duration-300",
                "focus:ring-primary-500 focus:border-primary-500",
                "bg-neutral-50 border-neutral-200",
                isSearchFocused ? "shadow-lg" : "shadow-sm"
              )}
              aria-label="搜索回忆"
              whileFocus={{ scale: 1.01 }}
            />
            <motion.div 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400"
              animate={{ 
                scale: isSearchFocused ? 1.1 : 1,
                color: isSearchFocused ? '#0a95e9' : '#94a3b8'
              }}
              transition={{ duration: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label="清除搜索"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            type="submit"
            className="mt-2 md:hidden w-full btn btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            搜索
          </motion.button>
        </form>
        
        {/* 年份筛选 */}
        <div className="relative" ref={filterRef}>
          <motion.button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "btn btn-outline flex items-center justify-center w-full md:w-auto",
              "border-neutral-200 hover:border-primary-500 transition-all duration-300",
              isFilterOpen ? "bg-primary-50 border-primary-300 text-primary-600" : ""
            )}
            aria-expanded={isFilterOpen}
            aria-haspopup="true"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {selectedYear === 'all' ? '按年份筛选' : `${selectedYear}年`}
            <motion.svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2"
              animate={{ rotate: isFilterOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          </motion.button>
          
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto border border-neutral-100"
                style={{ 
                  maxHeight: '300px',
                  overflowY: 'auto',
                  scrollbarWidth: 'thin'
                }}
              >
                <div className="p-2 space-y-1">
                  <motion.button
                    variants={filterItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={0}
                    onClick={() => handleYearSelect('all')}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-lg transition-all duration-200",
                      selectedYear === 'all' 
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-md" 
                        : "text-neutral-700 hover:bg-primary-50"
                    )}
                    whileHover={{ x: 4 }}
                  >
                    全部年份
                  </motion.button>
                  
                  {years.map((year, index) => (
                    <motion.button
                      key={year}
                      variants={filterItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={index + 1}
                      onClick={() => handleYearSelect(year)}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-lg transition-all duration-200",
                        selectedYear === year 
                          ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-md" 
                          : "text-neutral-700 hover:bg-primary-50"
                      )}
                      whileHover={{ x: 4 }}
                    >
                      {year}年
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* 当前筛选条件提示 */}
      <AnimatePresence>
        {(searchQuery || selectedYear !== 'all') && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-2"
          >
            <span className="text-sm text-neutral-500">当前筛选条件:</span>
            
            <AnimatePresence>
              {searchQuery && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm border border-primary-100"
                >
                  关键词: {searchQuery}
                  <motion.button 
                    onClick={handleClearSearch}
                    className="ml-1 text-primary-400 hover:text-primary-600"
                    aria-label="清除关键词筛选"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                </motion.span>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {selectedYear !== 'all' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-50 text-secondary-600 text-sm border border-secondary-100"
                >
                  年份: {selectedYear}年
                  <motion.button 
                    onClick={() => handleYearSelect('all')}
                    className="ml-1 text-secondary-400 hover:text-secondary-600"
                    aria-label="清除年份筛选"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                </motion.span>
              )}
            </AnimatePresence>
            
            <motion.button 
              onClick={() => {
                setSearchQuery('');
                setSelectedYear('all');
                onSearch('');
                onFilterByYear('all');
              }}
              className="ml-auto text-sm text-primary-500 hover:text-primary-700 transition-colors flex items-center"
              whileHover={{ scale: 1.05, x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              清除所有筛选
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchFilter; 