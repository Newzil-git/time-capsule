import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { cn } from '@/utils/cn';

// 回忆类型
type MemoryType = 'text' | 'image' | 'video' | 'audio';

// 回忆数据接口
interface Memory {
  id: string;
  title: string;
  content: string;
  date: string;
  type: MemoryType;
  tags: string[];
  imageUrl?: string;
}

const Home: React.FC = () => {
  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // 示例数据 - 最新回忆
  const latestMemories: Memory[] = [
    {
      id: '1',
      title: '第一次见到孙子',
      content: '今天是个特别的日子，我的第一个孙子出生了...',
      date: '2023-12-01',
      type: 'image',
      tags: ['家庭', '新生命'],
      imageUrl: '/images/memories/grandson/1.jpg'
    },
    {
      id: '2',
      title: '金婚纪念日',
      content: '和老伴一起度过了50年...',
      date: '2023-10-15',
      type: 'video',
      tags: ['婚姻', '纪念日'],
      imageUrl: '/images/memories/golden-wedding/golden-wedding.jpg'
    },
    {
      id: '3',
      title: '春游公园',
      content: '今天和老朋友们一起去公园赏花，感觉特别开心...',
      date: '2023-09-20',
      type: 'image',
      tags: ['朋友', '户外'],
      imageUrl: '/images/memories/park/park.jpg'
    }
  ];

  // 右侧面板内容
  const rightPanelContent = (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary-50/70 to-secondary-50/70 p-6 rounded-2xl backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-[#2A2A2A] mb-2">今日提示</h3>
        <p className="text-[#4A4A4A]">周末是整理和记录一周回忆的好时机。别忘了添加照片让回忆更生动！</p>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#2A2A2A]">回忆动态</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-500 text-lg">张</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#2A2A2A]">张爷爷分享了新回忆</p>
              <p className="text-sm text-[#4A4A4A]">《退休后的第一次旅行》</p>
              <p className="text-xs text-[#8A8A8A] mt-1">2小时前</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-500 text-lg">李</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#2A2A2A]">李阿姨点赞了您的回忆</p>
              <p className="text-sm text-[#4A4A4A]">《金婚纪念日》</p>
              <p className="text-xs text-[#8A8A8A] mt-1">5小时前</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout rightPanelContent={rightPanelContent}>
      <div className="space-y-8">
        {/* 页面标题和搜索栏 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#2A2A2A]">欢迎回来</h1>
            <p className="text-[#4A4A4A]">继续记录您的珍贵回忆</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="搜索回忆..." 
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* 欢迎卡片 */}
        <motion.div 
          className="relative w-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 背景装饰 */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute top-0 left-0 w-[40%] h-[60%] rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-[35%] h-[50%] rounded-full bg-white blur-3xl"></div>
          </div>
          
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1 text-white">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">给你一颗时光胶囊</h2>
              <p className="text-white/90 text-lg mb-6 max-w-xl">珍藏您的回忆，让美好时光永远保存。我们帮助您整理、美化和分享生命中最珍贵的记忆片段。</p>
              <div className="flex flex-wrap gap-4">
                <motion.a 
                  href="/memories/create" 
                  className="px-6 py-3 bg-white text-primary-600 rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  创建回忆
                </motion.a>
                <motion.a 
                  href="/memories" 
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl font-medium hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  浏览回忆
                </motion.a>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <motion.img 
                src="/images/hero/elderly-warm.jpg" 
                alt="温馨的老人回忆" 
                className="w-full max-w-[280px] h-auto rounded-2xl shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
        
        {/* 最新回忆 */}
        <div className="mt-10">
          <motion.div 
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-[#2A2A2A]">最新回忆</h2>
            <a href="/memories" className="text-primary-600 font-medium hover:underline">查看全部</a>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestMemories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  {memory.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={memory.imageUrl}
                        alt={memory.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-full">
                        {memory.type === 'video' ? (
                          <svg className="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-[#2A2A2A] line-clamp-1">{memory.title}</h3>
                      <span className="text-xs text-[#8A8A8A] flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(memory.date).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    
                    <p className="text-[#4A4A4A] mb-4 line-clamp-2">{memory.content}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {memory.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex space-x-3">
                        <button className="text-gray-400 hover:text-primary-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-primary-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      </div>
                      <a 
                        href={`/memories/${memory.id}`} 
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        查看详情
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* 功能区块 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#2A2A2A] mb-2">整理收藏</h3>
            <p className="text-[#4A4A4A] mb-4">将您的照片、视频和故事整理成精美的回忆集，方便您随时回顾。</p>
            <a href="/collections" className="text-primary-600 font-medium hover:underline">查看收藏</a>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-600 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#2A2A2A] mb-2">家人共享</h3>
            <p className="text-[#4A4A4A] mb-4">邀请家人一起参与，共同创建和分享珍贵的家庭回忆。</p>
            <a href="/family" className="text-secondary-600 font-medium hover:underline">添加成员</a>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#2A2A2A] mb-2">照片修复</h3>
            <p className="text-[#4A4A4A] mb-4">对老照片进行修复和数字化处理，保存珍贵的历史瞬间。</p>
            <a href="/restore" className="text-purple-600 font-medium hover:underline">开始修复</a>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

// 用户故事 - 保留但不在新布局中使用
const userStories = [
  {
    name: '王奶奶',
    age: 78,
    image: '/images/user-stories/user-story-1.jpg',
    quote: '时光胶囊帮我整理了和孙子们的照片和故事，现在我每周都会添加新内容，孩子们特别喜欢看我年轻时的故事。',
    date: '2023年10月'
  },
  {
    name: '张爷爷',
    age: 82,
    image: '/images/user-stories/user-story-2.jpg',
    quote: '我从来不会用电脑，但是时光胶囊很简单，我现在能独立记录我的人生故事，为子孙留下宝贵的精神财富。',
    date: '2023年9月'
  },
  {
    name: '李大爷',
    age: 75,
    image: '/images/user-stories/user-story-3.jpg',
    quote: '我把一生中的重要时刻都放进了时光胶囊，孩子们说这是我送给他们最珍贵的礼物。操作很简单，界面也很清晰。',
    date: '2023年11月'
  }
];

export default Home; 