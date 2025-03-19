import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showRightPanel?: boolean;
  rightPanelContent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showRightPanel = true,
  rightPanelContent
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测设备宽度
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC]">
      {/* 移动端导航栏 */}
      {isMobile && (
        <div className="sticky top-0 z-40">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </div>
      )}

      <div className="flex flex-1 fixed inset-0 top-0">
        {/* 桌面端侧边栏 - 固定 */}
        <div className="hidden md:block w-64 flex-shrink-0 h-full">
          <div className="h-full overflow-hidden">
            <Sidebar isMobile={isMobile} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
        
        {/* 主要内容区域 - 可滚动 */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 md:px-8 lg:px-12 min-h-full">
            {children}
          </div>
        </main>
        
        {/* 右侧面板 - 固定，只在桌面且右侧面板内容存在时显示 */}
        {showRightPanel && !isMobile && (
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 320 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 hidden lg:block flex-shrink-0 bg-white/80 backdrop-blur-md border-l border-gray-200 dark:border-gray-800 h-full"
          >
            <div className="h-full overflow-y-auto p-6">
              {rightPanelContent || (
                <div className="space-y-6">
                  {/* 默认右侧面板内容 */}
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">每日提示</h3>
                    <p className="text-gray-600">定期记录回忆可以帮助您保持记忆力，并为后代留下宝贵的精神财富。</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">活动通知</h3>
                    
                    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <p className="text-sm text-gray-500 mb-1">5月12日</p>
                      <h4 className="font-medium text-gray-800">回忆分享会</h4>
                      <p className="text-sm text-gray-600">线上活动，与其他用户交流您的珍贵记忆</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <p className="text-sm text-gray-500 mb-1">5月20日</p>
                      <h4 className="font-medium text-gray-800">如何整理家庭照片</h4>
                      <p className="text-sm text-gray-600">专业摄影师教您如何整理和修复老照片</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">回忆统计</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">总回忆数</p>
                        <p className="text-2xl font-bold text-primary-600">38</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">本月新增</p>
                        <p className="text-2xl font-bold text-secondary-500">12</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">已分享</p>
                        <p className="text-2xl font-bold text-green-500">15</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">收藏数</p>
                        <p className="text-2xl font-bold text-purple-500">24</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* 移动设备底部导航 */}
      {isMobile && (
        <div className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-30">
          <div className="flex justify-around py-2">
            {[
              { path: '/', label: '首页', icon: 'home' },
              { path: '/memories', label: '浏览', icon: 'view' },
              { path: '/memories/create', label: '创建', icon: 'create' },
              { path: '/profile', label: '我的', icon: 'profile' }
            ].map((item) => (
              <a 
                key={item.path} 
                href={item.path}
                className="flex flex-col items-center justify-center p-2"
              >
                <MobileIcon type={item.icon} />
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 移动导航图标组件
const MobileIcon = ({ type }: { type: string }) => {
  switch(type) {
    case 'home':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case 'view':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'create':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      );
    case 'profile':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    default:
      return null;
  }
};

export default Layout; 