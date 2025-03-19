import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MemoryCard from '@/components/MemoryCard';
import SearchFilter from '@/components/SearchFilter';
import { memories, MemoryItem } from '@/utils/mockData';

const Memories: React.FC = () => {
  const [filteredMemories, setFilteredMemories] = useState<MemoryItem[]>(memories);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'timeline' | 'grid'>('timeline');
  
  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // 处理年份筛选
  const handleYearFilter = (year: string) => {
    setYearFilter(year);
  };
  
  // 切换视图
  const toggleView = () => {
    setView(prev => prev === 'timeline' ? 'grid' : 'timeline');
  };
  
  // 根据搜索和筛选条件更新记忆列表
  useEffect(() => {
    setIsLoading(true);
    
    // 模拟加载延迟
    const timer = setTimeout(() => {
      let result = [...memories];
      
      // 应用搜索过滤
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter(memory => 
          memory.title.toLowerCase().includes(lowerQuery) || 
          memory.summary.toLowerCase().includes(lowerQuery) || 
          memory.content.toLowerCase().includes(lowerQuery) ||
          (memory.tags && memory.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
      }
      
      // 应用年份过滤
      if (yearFilter !== 'all') {
        result = result.filter(memory => memory.date.startsWith(yearFilter));
      }
      
      // 按日期排序（从新到旧）
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setFilteredMemories(result);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, yearFilter]);
  
  // 页面变体动画
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };
  
  // 容器动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  // 项目动画变体
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-background-light"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Navbar />
      
      <main className="flex-grow container-custom py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="section-title inline-block mb-6">
            我的<span className="gradient-text">回忆录</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            探索您的珍贵记忆，按时间顺序整理的生命故事。每一段回忆都是您人生旅途中的宝贵财富。
          </p>
          
          <motion.div 
            className="mt-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="/memories/create" 
              className="btn bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md hover:shadow-lg inline-flex items-center px-8 py-4 text-xl rounded-2xl"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path 
                  d="M12 5V19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M5 12H19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              创建新回忆
            </a>
          </motion.div>
        </motion.div>
        
        {/* 搜索和筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="apple-card mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-medium text-neutral-800">回忆列表</h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleView}
                className="icon-btn icon-btn-primary"
                aria-label={view === 'timeline' ? '切换到网格视图' : '切换到时间线视图'}
              >
                {view === 'timeline' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H10V10H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 3H21V10H14V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 14H10V21H3V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 14H21V21H14V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 14H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <div className="badge badge-primary">
                {filteredMemories.length} 条回忆
              </div>
            </div>
          </div>
          
          <SearchFilter 
            onSearch={handleSearch} 
            onFilterByYear={handleYearFilter} 
          />
        </motion.div>
        
        {/* 记忆列表 */}
        <div className="relative">
          {/* 背景装饰 - 仅在时间线视图显示 */}
          {view === 'timeline' && (
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-100 ml-4 z-0 hidden md:block"></div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          ) : filteredMemories.length > 0 ? (
            <AnimatePresence mode="wait">
              {view === 'timeline' ? (
                <motion.div 
                  key="timeline"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-0"
                >
                  {filteredMemories.map((memory, index) => (
                    <motion.div
                      key={memory.id}
                      variants={itemVariants}
                      className="animate-slideInRight"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <MemoryCard 
                        memory={memory} 
                        index={index} 
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredMemories.map((memory, index) => (
                    <motion.div
                      key={memory.id}
                      variants={itemVariants}
                      className="animate-slideInUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="bytedance-card h-full flex flex-col">
                        {memory.type === 'image' && memory.mediaUrl && (
                          <div className="rounded-lg overflow-hidden mb-4 aspect-video">
                            <img 
                              src={memory.mediaUrl} 
                              alt={memory.title} 
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-medium text-neutral-800">{memory.title}</h3>
                            <span className="text-sm text-neutral-500">{memory.date}</span>
                          </div>
                          <p className="text-neutral-600 mb-4 line-clamp-2">{memory.summary}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {memory.tags && memory.tags.map((tag, idx) => (
                              <span key={idx} className="tag">{tag}</span>
                            ))}
                          </div>
                          <div className="mt-auto pt-2">
                            <a 
                              href={`/memories/${memory.id}`}
                              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                            >
                              查看详情
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 glass-card p-8"
            >
              <div className="text-primary-300 mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                  <path d="M10 21H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 13H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-neutral-700 mb-4">未找到回忆</h3>
              <p className="text-neutral-500 max-w-md mx-auto mb-6">
                没有找到符合当前搜索或筛选条件的回忆。请尝试调整您的搜索条件或清除筛选器。
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button 
                  onClick={() => {setSearchQuery(''); setYearFilter('all');}}
                  className="btn btn-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  重置筛选条件
                </motion.button>
                <motion.a 
                  href="/memories/create" 
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  创建新回忆
                </motion.a>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* 底部装饰 */}
        {filteredMemories.length > 0 && (
          <div className="text-center mt-16">
            <div className="inline-block p-4 rounded-full bg-primary-50 text-primary-500 animate-float">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12L12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-neutral-500 mt-4">继续向下滚动，探索更多回忆</p>
          </div>
        )}
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Memories; 