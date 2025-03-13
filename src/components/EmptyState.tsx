import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  imageSrc?: string;
  actionText?: string;
  actionLink?: string;
  secondaryActionText?: string;
  secondaryActionLink?: string;
  onActionClick?: () => void;
  type?: 'default' | 'search' | 'filter' | 'error' | 'custom';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  imageSrc,
  actionText,
  actionLink,
  secondaryActionText,
  secondaryActionLink,
  onActionClick,
  type = 'default',
}) => {
  // 根据类型预设内容
  const getDefaultContent = () => {
    switch (type) {
      case 'search':
        return {
          title: title || '没有找到相关结果',
          description: description || '尝试使用不同的关键词或筛选条件',
          icon: icon || (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
          imageSrc: imageSrc,
        };
      case 'filter':
        return {
          title: title || '没有符合筛选条件的内容',
          description: description || '尝试调整您的筛选条件以查看更多内容',
          icon: icon || (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          ),
          imageSrc: imageSrc,
        };
      case 'error':
        return {
          title: title || '出现了一些问题',
          description: description || '我们无法加载内容，请稍后再试',
          icon: icon || (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          imageSrc: imageSrc,
        };
      default:
        return {
          title: title || '暂无内容',
          description: description || '这里还没有任何内容，开始创建吧',
          icon: icon || (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          ),
          imageSrc: imageSrc,
        };
    }
  };

  const content = getDefaultContent();
  const finalTitle = title || content.title;
  const finalDescription = description || content.description;
  const finalIcon = icon || content.icon;
  const finalImageSrc = imageSrc || content.imageSrc;

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const ActionButton = () => {
    if (!actionText) return null;

    const button = (
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-primary-enhanced px-6 py-2.5"
        onClick={onActionClick}
      >
        {actionText}
      </motion.button>
    );

    if (actionLink) {
      return <Link href={actionLink}>{button}</Link>;
    }

    return button;
  };

  const SecondaryActionButton = () => {
    if (!secondaryActionText) return null;

    const button = (
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-outline-enhanced px-6 py-2.5"
      >
        {secondaryActionText}
      </motion.button>
    );

    if (secondaryActionLink) {
      return <Link href={secondaryActionLink}>{button}</Link>;
    }

    return button;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      {finalImageSrc ? (
        <motion.div variants={itemVariants} className="relative w-48 h-48 mb-6">
          <Image
            src={finalImageSrc}
            alt={finalTitle}
            fill
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.style.backgroundColor = '#f3f4f6';
              
              const iconDiv = document.createElement('div');
              iconDiv.className = 'w-full h-full flex items-center justify-center';
              iconDiv.innerHTML = `
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              `;
              
              target.parentElement?.appendChild(iconDiv);
            }}
          />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="mb-6">
          {finalIcon}
        </motion.div>
      )}

      <motion.h3
        variants={itemVariants}
        className="text-xl font-medium text-gray-800 mb-2"
      >
        {finalTitle}
      </motion.h3>

      <motion.p
        variants={itemVariants}
        className="text-gray-600 mb-8 max-w-md elderly-friendly-text"
      >
        {finalDescription}
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex flex-wrap gap-4 justify-center"
      >
        <ActionButton />
        <SecondaryActionButton />
      </motion.div>
    </motion.div>
  );
};

export default EmptyState; 