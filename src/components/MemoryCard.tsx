import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { MemoryItem } from '@/utils/mockData';
import { cn } from '@/utils/cn';

interface MemoryCardProps {
  memory: MemoryItem;
  index: number;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  
  // 格式化日期
  const formattedDate = memory.date.replace(/-/g, '年').replace(/-/g, '月') + '日';

  // 根据记忆类型选择图标
  const getTypeIcon = () => {
    switch (memory.type) {
      case 'text':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'image':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'video':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H14C15.1046 19 16 18.1046 16 17V7C16 5.89543 15.1046 5 14 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'audio':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.07 5.93C20.9447 7.80528 21.9979 10.3447 21.9979 13C21.9979 15.6553 20.9447 18.1947 19.07 20.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  // 根据记忆类型获取样式
  const getTypeStyles = () => {
    switch (memory.type) {
      case 'text':
        return {
          borderColor: 'border-primary-500',
          bgColor: 'bg-primary-50',
          textColor: 'text-primary-500',
          gradientFrom: 'from-primary-500',
          gradientTo: 'to-primary-600'
        };
      case 'image':
        return {
          borderColor: 'border-secondary-500',
          bgColor: 'bg-secondary-50',
          textColor: 'text-secondary-500',
          gradientFrom: 'from-secondary-500',
          gradientTo: 'to-secondary-600'
        };
      case 'video':
        return {
          borderColor: 'border-purple-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-500',
          gradientFrom: 'from-purple-500',
          gradientTo: 'to-purple-600'
        };
      case 'audio':
        return {
          borderColor: 'border-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-500',
          gradientFrom: 'from-green-500',
          gradientTo: 'to-green-600'
        };
      default:
        return {
          borderColor: 'border-neutral-500',
          bgColor: 'bg-neutral-50',
          textColor: 'text-neutral-500',
          gradientFrom: 'from-neutral-500',
          gradientTo: 'to-neutral-600'
        };
    }
  };

  const styles = getTypeStyles();
  
  // 卡片动画变体
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };
  
  // 内容动画变体
  const contentVariants = {
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
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="timeline-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 时间轴线 */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-primary-200 ml-6 z-0"></div>
      
      {/* 时间节点 */}
      <motion.div 
        className={cn("timeline-dot", styles.bgColor, styles.borderColor)}
        initial={{ scale: 1 }}
        animate={{ 
          scale: isHovered ? 1.2 : 1, 
          boxShadow: isHovered ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : 'none',
          background: isHovered ? 
            memory.type === 'text' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' :
            memory.type === 'image' ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' :
            memory.type === 'video' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' :
            'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
            : ''
        }}
        transition={{ duration: 0.3 }}
        style={{ top: '1.5rem' }}
      />
      
      {/* 卡片内容 */}
      <motion.div 
        className={cn(
          "memory-card backdrop-blur-sm",
          isHovered ? "shadow-xl" : "shadow-md",
          styles.borderColor
        )}
        whileHover={{ 
          y: -8,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="flex items-center mb-3">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full mr-3",
              styles.bgColor, styles.textColor
            )}>
              {getTypeIcon()}
            </div>
            <time className="text-neutral-500 text-lg font-medium">{formattedDate}</time>
            
            <motion.div 
              className={cn(
                "ml-auto px-2 py-1 rounded-full text-xs font-medium",
                styles.bgColor, styles.textColor
              )}
              whileHover={{ scale: 1.05 }}
            >
              {memory.type === 'text' ? '文本' : 
               memory.type === 'image' ? '图片' : 
               memory.type === 'video' ? '视频' : '音频'}
            </motion.div>
          </motion.div>
          
          <motion.h3 
            variants={itemVariants}
            className="text-2xl font-medium text-neutral-800 mb-2 hover:text-primary-600 transition-colors duration-300"
          >
            {memory.title}
          </motion.h3>
          
          <motion.p 
            variants={itemVariants}
            className="text-neutral-600 mb-4"
          >
            {memory.summary}
          </motion.p>
          
          {memory.type === 'image' && memory.mediaUrl && (
            <motion.div 
              variants={itemVariants}
              className="memory-card-image rounded-xl overflow-hidden mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={memory.mediaUrl} 
                alt={memory.title} 
                className="w-full h-48 md:h-64 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          )}
          
          {memory.tags && memory.tags.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-2 mb-4"
            >
              {memory.tags.map((tag, i) => (
                <motion.span 
                  key={i} 
                  className={cn("tag", styles.bgColor, styles.textColor)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            variants={itemVariants}
            className="mt-4 text-right"
          >
            <motion.a 
              href={`/memories/${memory.id}`} 
              className={cn(
                "inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300",
                `bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo} text-white`
              )}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(var(--primary-rgb), 0.25)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              查看详情
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1"
              >
                <path 
                  d="M5 12H19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 5L19 12L12 19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MemoryCard; 