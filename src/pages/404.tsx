import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* 404图标 */}
            <div className="relative w-64 h-64 mx-auto mb-8 bg-gray-100 rounded-xl flex items-center justify-center">
              {/* 默认使用SVG图标，以防图片不存在 */}
              <svg 
                className="w-32 h-32 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              
              {/* 尝试加载图片 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/404.png"
                  alt="页面未找到"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    // 如果图片加载失败，隐藏图片元素
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">哎呀，迷路了！</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto elderly-friendly-text">
              很抱歉，您访问的页面似乎不存在或者已被移动。
              这可能是因为链接错误或页面已被删除。
            </p>
            
            <div className="space-y-4 md:space-y-0 md:flex md:justify-center md:space-x-4">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary-enhanced inline-block px-8 py-3"
                >
                  返回首页
                </motion.div>
              </Link>
              
              <Link href="/memories">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline-enhanced inline-block px-8 py-3"
                >
                  浏览回忆
                </motion.div>
              </Link>
            </div>
          </motion.div>
          
          {/* 装饰元素 */}
          <div className="relative mt-16">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-100 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary-100 rounded-full opacity-50 animate-pulse delay-700"></div>
            
            <div className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-4 text-center">您可能想找：</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/">
                  <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">首页</h4>
                      <p className="text-sm text-gray-500">返回应用主页</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/memories">
                  <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">回忆列表</h4>
                      <p className="text-sm text-gray-500">浏览所有回忆</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/memories/create">
                  <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">创建回忆</h4>
                      <p className="text-sm text-gray-500">记录新的珍贵时刻</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/about">
                  <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">关于我们</h4>
                      <p className="text-sm text-gray-500">了解我们的故事</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} 时光胶囊 - 所有权利保留</p>
      </footer>
    </div>
  );
};

export default NotFoundPage; 