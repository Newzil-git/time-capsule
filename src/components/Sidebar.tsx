import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, isOpen = true, onClose }) => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState('/');

  useEffect(() => {
    setActiveItem(router.pathname);
  }, [router.pathname]);

  const navItems = [
    { 
      path: '/', 
      label: '首页', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      path: '/memories', 
      label: '浏览回忆', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      path: '/memories/create', 
      label: '创建回忆', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    { 
      path: '/favorites', 
      label: '我的收藏', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    { 
      path: '/about', 
      label: '关于我们', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    },
    closed: { 
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: {
      y: 20,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const renderSidebarContent = () => (
    <>
      {/* Logo Area */}
      <div className="px-6 py-8">
        <Link href="/" className="flex items-center">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            whileHover={{ rotate: -10, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="text-primary-500 mr-3"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
          <h1 className="text-xl font-medium text-[#2A2A2A] dark:text-white">
            时光<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 font-semibold">胶囊</span>
          </h1>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col flex-grow px-4 mt-5 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item) => (
            <motion.div key={item.path} variants={itemVariants}>
              <Link 
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeItem === item.path 
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600' 
                    : 'text-[#4A4A4A] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <div className={`${
                  activeItem === item.path 
                    ? 'text-primary-600' 
                    : 'text-gray-500 group-hover:text-primary-500'
                } transition-colors duration-200`}>
                  {item.icon}
                </div>
                <span className="ml-3 text-base font-medium">{item.label}</span>
                {activeItem === item.path && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Button */}
      <div className="p-4 mt-auto">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            href="/memories/create"
            className="flex items-center justify-center w-full px-4 py-3 text-white rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">创建新回忆</span>
          </Link>
        </motion.div>
      </div>

      {/* Profile Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-300 to-secondary-300 flex items-center justify-center text-white">
            <span className="text-lg font-medium">用</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-[#2A2A2A] dark:text-white">用户名</p>
            <p className="text-xs text-[#8A8A8A] dark:text-gray-400">查看个人资料</p>
          </div>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={onClose}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-64 max-w-[80vw] z-50 bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 z-30">
      {renderSidebarContent()}
    </aside>
  );
};

export default Sidebar; 