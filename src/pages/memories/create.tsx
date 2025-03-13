import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// 回忆类型
type MemoryType = 'text' | 'image' | 'video' | 'audio';

// 表单数据接口
interface MemoryFormData {
  title: string;
  date: string;
  type: MemoryType;
  content: string;
  tags: string[];
  files: File[];
}

const CreateMemory: React.FC = () => {
  // 当前步骤
  const [currentStep, setCurrentStep] = useState(1);
  // 表单数据
  const [formData, setFormData] = useState<MemoryFormData>({
    title: '',
    date: '',
    type: 'text',
    content: '',
    tags: [],
    files: []
  });
  // 自动保存状态
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  // 标签输入
  const [tagInput, setTagInput] = useState('');

  // 步骤配置
  const steps = [
    { number: 1, title: '基本信息', description: '添加回忆的标题、日期和类型' },
    { number: 2, title: '内容详情', description: '记录您的回忆内容和添加媒体文件' },
    { number: 3, title: '预览确认', description: '预览并确认您的回忆' }
  ];

  // 动画变体
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现表单提交逻辑
  };

  // 添加标签
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files!)]
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-warm">
      <Navbar />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="container-custom">
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="max-w-4xl mx-auto"
          >
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-medium text-neutral-800 mb-4">
                创建新回忆
              </h1>
              <p className="text-xl text-neutral-600 elderly-friendly-text">
                记录您的珍贵时刻，让美好永远保存
              </p>
            </div>

            {/* 步骤指示器 */}
            <div className="mb-12">
              <div className="flex items-center justify-between relative">
                {/* 连接线 */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-200 -translate-y-1/2 rounded-full">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  ></div>
                </div>
                
                {steps.map((step, index) => (
                  <div 
                    key={step.number}
                    className="relative flex flex-col items-center"
                  >
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium z-10 transition-all duration-300 ${
                        currentStep >= step.number
                          ? 'bg-primary-500 text-white'
                          : 'bg-white text-neutral-400 border-2 border-neutral-200'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 text-center">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-neutral-800' : 'text-neutral-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 表单区域 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* 标题输入 */}
                      <div>
                        <label htmlFor="title" className="block text-xl font-medium text-neutral-700 mb-2">
                          标题
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={formData.title}
                          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="form-input-enhanced w-full text-lg"
                          placeholder="给这个回忆起个名字"
                        />
                      </div>

                      {/* 日期选择 */}
                      <div>
                        <label htmlFor="date" className="block text-xl font-medium text-neutral-700 mb-2">
                          日期
                        </label>
                        <input
                          type="date"
                          id="date"
                          value={formData.date}
                          onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          className="form-input-enhanced w-full text-lg"
                        />
                      </div>

                      {/* 类型选择 */}
                      <div>
                        <label className="block text-xl font-medium text-neutral-700 mb-4">
                          回忆类型
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { type: 'text', label: '文字', icon: '📝' },
                            { type: 'image', label: '图片', icon: '🖼️' },
                            { type: 'video', label: '视频', icon: '🎥' },
                            { type: 'audio', label: '音频', icon: '🎵' }
                          ].map(({ type, label, icon }) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, type: type as MemoryType }))}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                formData.type === type
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-neutral-200 hover:border-primary-200'
                              }`}
                            >
                              <div className="text-2xl mb-2">{icon}</div>
                              <div className="text-lg font-medium">{label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* 内容输入 */}
                      <div>
                        <label htmlFor="content" className="block text-xl font-medium text-neutral-700 mb-2">
                          回忆内容
                        </label>
                        <textarea
                          id="content"
                          value={formData.content}
                          onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                          className="form-textarea-enhanced w-full h-48 text-lg"
                          placeholder="记录下这个美好的时刻..."
                        />
                      </div>

                      {/* 媒体上传 */}
                      <div>
                        <label className="block text-xl font-medium text-neutral-700 mb-4">
                          添加照片或视频
                        </label>
                        <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center">
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer"
                          >
                            <div className="text-6xl mb-4">📁</div>
                            <p className="text-lg text-neutral-600 mb-2">
                              点击或拖放文件到这里上传
                            </p>
                            <p className="text-sm text-neutral-500">
                              支持图片和视频文件
                            </p>
                          </label>
                        </div>
                      </div>

                      {/* 标签输入 */}
                      <div>
                        <label className="block text-xl font-medium text-neutral-700 mb-2">
                          添加标签
                        </label>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {formData.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-primary-600 hover:text-primary-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                            className="form-input-enhanced flex-grow text-lg"
                            placeholder="输入标签，按回车添加"
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="btn-enhanced btn-primary-enhanced"
                          >
                            添加
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* 预览区域 */}
                      <div className="bg-neutral-50 rounded-xl p-6">
                        <h3 className="text-2xl font-serif font-medium text-neutral-800 mb-4">
                          {formData.title || '未命名回忆'}
                        </h3>
                        <p className="text-neutral-500 mb-4">
                          {new Date(formData.date).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <div className="prose prose-lg max-w-none mb-6">
                          {formData.content}
                        </div>
                        {formData.files.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            {formData.files.map((file, index) => (
                              <div
                                key={index}
                                className="aspect-square rounded-lg overflow-hidden bg-neutral-200"
                              >
                                {file.type.startsWith('image/') ? (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-4xl">🎥</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 导航按钮 */}
                <div className="flex justify-between mt-12">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="btn-enhanced btn-outline-enhanced"
                    >
                      上一步
                    </button>
                  )}
                  {currentStep < steps.length ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="btn-enhanced btn-primary-enhanced ml-auto"
                    >
                      下一步
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn-enhanced btn-primary-enhanced ml-auto"
                    >
                      提交回忆
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateMemory; 