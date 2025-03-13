import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  mediaUrls: string[];
  author: {
    name: string;
    avatar: string;
  };
  readingTime?: number;
  likes: number;
  comments: number;
}

const MemoryDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // 状态管理
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNavTitle, setShowNavTitle] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [isReading, setIsReading] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const [showComments, setShowComments] = useState(false);
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  
  // refs
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // 示例数据
  const memory: Memory = {
    id: '1',
    title: '第一次见到孙子',
    content: '今天是个特别的日子，我的第一个孙子出生了。看着他小小的身躯，皱巴巴的小脸，我的心都要融化了。他的到来给我们全家带来了无限的欢乐，让我想起了很多年前第一次见到他父亲时的场景...',
    date: '2024-03-15',
    type: 'image',
    tags: ['家庭', '新生命', '幸福时刻', '第一次'],
    mediaUrls: [
      '/images/memories/grandson/1.jpg'
    ],
    author: {
      name: '王奶奶',
      avatar: '/images/avatars/default.jpg'
    },
    readingTime: 3,
    likes: 128,
    comments: 32
  };

  // 处理滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setShowNavTitle(headerBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 切换字体大小
  const toggleFontSize = () => {
    setFontSize(prev => prev === 'normal' ? 'large' : 'normal');
  };

  // 开始朗读
  const startReading = () => {
    if ('speechSynthesis' in window) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(memory.content);
      utterance.lang = 'zh-CN';
      utterance.rate = readingSpeed;
      utterance.onend = () => setIsReading(false);
      speechSynthesis.speak(utterance);
    }
  };

  // 停止朗读
  const stopReading = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  // 切换简易阅读模式
  const toggleSimpleMode = () => {
    setIsSimpleMode(prev => !prev);
    if (!isSimpleMode) {
      setFontSize('large');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-neutral-800 mb-4">
            加载失败
          </h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="btn-enhanced btn-primary-enhanced"
          >
            返回上一页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isSimpleMode ? 'simple-mode' : ''}`}>
      {/* 导航栏 - 优化设计 */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showNavTitle ? 'bg-white/95 backdrop-blur-lg shadow-sm' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container-custom">
          <div className="h-16 md:h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-3 rounded-full hover:bg-neutral-100 transition-colors elderly-friendly-click"
                aria-label="返回上一页"
              >
                <svg className="w-7 h-7 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <motion.h1 
                className={`text-xl md:text-2xl font-medium text-neutral-800 transition-all duration-300 ${
                  showNavTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
                initial={false}
              >
                {memory.title}
              </motion.h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSimpleMode}
                className={`icon-btn-enhanced ${isSimpleMode ? 'text-primary-600' : ''}`}
                title="简易阅读模式"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={toggleFontSize}
                className="icon-btn-enhanced"
                title="调整字体大小"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              <div className="relative">
                <button
                  onClick={isReading ? stopReading : startReading}
                  className={`icon-btn-enhanced ${isReading ? 'text-primary-600' : ''}`}
                  title={isReading ? '停止朗读' : '开始朗读'}
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0-11V3" />
                  </svg>
                </button>
                {isReading && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-3 min-w-[200px]">
                    <label className="block text-sm text-neutral-600 mb-2">朗读速度</label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      value={readingSpeed}
                      onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`icon-btn-enhanced ${isLiked ? 'text-red-500' : ''}`}
                title={isLiked ? '取消点赞' : '点赞'}
              >
                <svg className="w-7 h-7" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                onClick={() => {/* 实现分享功能 */}}
                className="icon-btn-enhanced"
                title="分享"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="flex-grow pt-16 md:pt-20">
        {/* 头部区域 - 优化设计 */}
        <header
          ref={headerRef}
          className="relative bg-gradient-to-b from-primary-50 via-primary-50/50 to-white py-12 md:py-24"
        >
          {/* 装饰背景 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-primary-100/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-2/3 bg-secondary-100/20 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
          </div>
          
          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-serif font-medium text-neutral-800 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {memory.title}
              </motion.h1>
              <motion.div 
                className="flex flex-wrap items-center justify-center gap-6 text-neutral-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <time className="flex items-center text-lg">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(memory.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span className="flex items-center text-lg">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  阅读时间：约{memory.readingTime}分钟
                </span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <img
                  src={memory.author.avatar}
                  alt={memory.author.name}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                />
                <span className="text-lg font-medium text-neutral-700">
                  {memory.author.name}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </header>

        {/* 媒体展示区域 - 优化设计 */}
        {memory.mediaUrls.length > 0 && (
          <section className="py-12 md:py-16 bg-neutral-50">
            <div className="container-custom">
              <div className="max-w-5xl mx-auto">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
                  <motion.img
                    key={currentMediaIndex}
                    src={memory.mediaUrls[currentMediaIndex]}
                    alt=""
                    className="w-1/2 h-auto mx-auto object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {memory.mediaUrls.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentMediaIndex(prev => (prev - 1 + memory.mediaUrls.length) % memory.mediaUrls.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all elderly-friendly-click"
                        aria-label="上一张图片"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentMediaIndex(prev => (prev + 1) % memory.mediaUrls.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all elderly-friendly-click"
                        aria-label="下一张图片"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                {memory.mediaUrls.length > 1 && (
                  <div className="flex justify-center gap-3 mt-6">
                    {memory.mediaUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          currentMediaIndex === index 
                            ? 'bg-primary-500 w-6' 
                            : 'bg-neutral-300 hover:bg-neutral-400'
                        }`}
                        aria-label={`切换到第${index + 1}张图片`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 内容区域 - 优化设计 */}
        <section className="py-12 md:py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div 
                ref={contentRef}
                className={`prose prose-lg max-w-none ${
                  fontSize === 'large' ? 'text-xl leading-relaxed' : ''
                } ${
                  isSimpleMode ? 'simple-mode-content' : ''
                }`}
              >
                {memory.content}
              </div>

              {/* 标签区域 - 优化设计 */}
              <div className="mt-16">
                <h3 className="text-xl font-medium text-neutral-700 mb-6">
                  相关标签
                </h3>
                <div className="flex flex-wrap gap-3">
                  {memory.tags.map(tag => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors text-lg shadow-sm elderly-friendly-click"
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 互动区域 - 优化设计 */}
              <div className="mt-16 border-t border-b border-neutral-200 py-8">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-8">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex items-center gap-3 text-lg transition-colors elderly-friendly-click ${
                        isLiked ? 'text-red-500' : 'text-neutral-600 hover:text-red-500'
                      }`}
                    >
                      <svg className="w-8 h-8" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-xl">{memory.likes}</span>
                    </button>
                    <button 
                      onClick={() => setShowComments(!showComments)}
                      className="flex items-center gap-3 text-lg text-neutral-600 hover:text-primary-600 transition-colors elderly-friendly-click"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-xl">{memory.comments}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => {/* 实现分享功能 */}}
                    className="flex items-center gap-3 text-lg text-neutral-600 hover:text-primary-600 transition-colors elderly-friendly-click"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-xl">分享</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 相关回忆推荐 - 优化设计 */}
        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-serif font-medium text-neutral-800 mb-8">
                相关回忆
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {/* 这里添加相关回忆卡片组件 */}
              </div>
            </div>
          </div>
        </section>

        {/* 底部导航 - 新增 */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-white/90 backdrop-blur-lg rounded-full shadow-lg px-6 py-3 flex items-center gap-4">
            <button
              onClick={() => {/* 导航到上一个回忆 */}}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors elderly-friendly-click"
              title="上一个回忆"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <a
              href="/memories"
              className="px-4 py-2 text-lg font-medium text-neutral-700 hover:text-primary-600 transition-colors elderly-friendly-click"
            >
              返回列表
            </a>
            <button
              onClick={() => {/* 导航到下一个回忆 */}}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors elderly-friendly-click"
              title="下一个回忆"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* 全局样式 */}
      <style jsx global>{`
        .simple-mode {
          background-color: #f8f9fa;
        }
        
        .simple-mode-content {
          font-size: 1.25rem;
          line-height: 2;
          letter-spacing: 0.025em;
        }
        
        .elderly-friendly-click {
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .icon-btn-enhanced {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          transition: all 0.2s;
        }
        
        .icon-btn-enhanced:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default MemoryDetail; 