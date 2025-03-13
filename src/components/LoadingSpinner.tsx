import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  text = '加载中...',
  fullScreen = false,
}) => {
  // 根据尺寸设置样式
  const sizeStyles = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };
  
  // 根据颜色设置样式
  const colorStyles = {
    primary: 'border-primary-200 border-t-primary-600',
    secondary: 'border-secondary-200 border-t-secondary-600',
    white: 'border-white/30 border-t-white',
  };
  
  // 文本尺寸
  const textSize = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };
  
  // 基础spinner组件
  const Spinner = () => (
    <motion.div className="flex flex-col items-center" variants={container} initial="hidden" animate="show">
      <motion.div 
        variants={item}
        className={`rounded-full animate-spin ${sizeStyles[size]} ${colorStyles[color]}`} 
      />
      
      {text && (
        <motion.p 
          variants={item}
          className={`mt-3 ${textSize[size]} ${color === 'white' ? 'text-white' : 'text-gray-600'}`}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
  
  // 如果是全屏模式
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Spinner />
      </div>
    );
  }
  
  // 正常展示模式
  return <Spinner />;
};

// 加载骨架屏 - 可用于卡片加载
export const MemoryCardSkeleton = () => {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm animate-pulse border border-gray-100">
      {/* 图片区域 */}
      <div className="bg-gray-200 h-48 w-full"></div>
      
      {/* 内容区域 */}
      <div className="p-4 space-y-3">
        {/* 标题 */}
        <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
        
        {/* 日期 */}
        <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
        
        {/* 内容 */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md"></div>
          <div className="h-4 bg-gray-200 rounded-md"></div>
          <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
        </div>
        
        {/* 标签 */}
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );
};

// 页面加载骨架屏
export const PageSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 animate-pulse">
      {/* 头部区域 */}
      <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto"></div>
      <div className="h-6 bg-gray-200 rounded-md w-2/3 mx-auto"></div>
      
      {/* 搜索区域 */}
      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
      
      {/* 内容区域 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <MemoryCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner; 