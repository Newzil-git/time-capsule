import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// 记忆类型
type MemoryType = 'text' | 'image' | 'video' | 'audio';
// 说话人类型
type SpeakerType = 'volunteer' | 'elderly';

// 对话内容接口
interface DialogItem {
  id: string;
  content: string;
  speaker: SpeakerType;
}

// 表单数据接口
interface MemoryFormData {
  title: string;
  date: string;
  content: string;
  dialogItems: DialogItem[];
  tags: string[];
  files: File[];
}

const CreateMemory: React.FC = () => {
  // 当前步骤
  const [currentStep, setCurrentStep] = useState(1);
  // 表单数据
  const [formData, setFormData] = useState<MemoryFormData>({
    title: '童年的回忆',
    date: new Date().toISOString().slice(0, 10),
    content: '',
    dialogItems: [
      { id: '1', content: '今天你想和我们聊什么？', speaker: 'volunteer' },
      { id: '2', content: '我想讲讲年轻时候的事情，我小时候住在农村，那时候的生活很简单。', speaker: 'elderly' },
      { id: '3', content: '听起来很有意思，你还记得有什么特别的事情吗？', speaker: 'volunteer' },
      { id: '4', content: '当然记得！我记得有一次我们村里举办了丰收节，家家户户都拿出自己种的粮食和蔬菜，大家一起分享食物，载歌载舞...', speaker: 'elderly' }
    ],
    tags: ['童年', '农村生活', '回忆'],
    files: []
  });

  // 处理状态
  const [loading, setLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'record' | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // 生成的回忆内容
  const [generatedContent, setGeneratedContent] = useState('');

  // 步骤配置
  const steps = [
    { number: 1, title: '上传/录制', description: '上传或录制语音/视频' },
    { number: 2, title: '语音转录', description: '查看和编辑语音转录结果' },
    { number: 3, title: 'AI生成回忆录', description: 'AI智能生成回忆内容' },
    { number: 4, title: '预览编辑', description: '预览并编辑回忆内容' },
    { number: 5, title: '分享保存', description: '分享或保存您的回忆' }
  ];

  // 示例回忆录内容
  const sampleMemoryContent = `童年的回忆：

我小时候住在一个美丽的农村，那里的四季分明，春天有花，夏天有绿荫，秋天有金黄的稻田，冬天有白雪皑皑的景色。

生活虽然简单，但充满了快乐。记得村里每年都会举办丰收节，那是我们孩子最期待的日子。家家户户都会拿出自己种的粮食和蔬菜，大家一起分享食物，载歌载舞。我和小伙伴们会在田野里奔跑，捉迷藏，感受大自然的美好。

那时候没有电视，没有手机，但我们从不觉得无聊。晚上，大人们会讲故事给我们听，有神话传说，也有家族历史。就是在这样的环境中，我学会了尊重自然，珍惜粮食，也懂得了人与人之间的真诚相处。

这些简单而珍贵的记忆，至今想起来仍然温暖人心。`;

  // 动画变体
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // 模拟进度函数
  const simulateProgress = (duration: number, onComplete: () => void) => {
    setLoading(true);
    setProgressValue(0);
    
    const interval = 50; // 更新间隔(ms)
    const steps = duration / interval;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep += 1;
      const newProgress = Math.min(100, Math.round((currentStep / steps) * 100));
      setProgressValue(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setLoading(false);
          onComplete();
        }, 500);
      }
    }, interval);
    
    return () => clearInterval(timer);
  };

  // 处理上传/录制选择
  const handleUploadMethod = (method: 'upload' | 'record') => {
    setUploadMethod(method);
    
    // 模拟上传或录制过程
    const duration = method === 'upload' ? 5000 : 10000; // 上传5秒，录制10秒
    
    simulateProgress(duration, () => {
      setSuccessMessage(method === 'upload' ? '上传成功！' : '录制成功！');
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setCurrentStep(2);
      }, 1500);
    });
  };

  // 处理语音转录完成
  const handleTranscriptionComplete = () => {
    setCurrentStep(3);
  };

  // 处理AI生成完成
  const handleGenerationComplete = () => {
    setGeneratedContent(sampleMemoryContent);
    setFormData(prev => ({
      ...prev,
      content: sampleMemoryContent
    }));
  };

  // 处理重新生成
  const handleRegenerate = () => {
    setLoading(true);
    setProgressValue(0);
    
    simulateProgress(8000, () => {
      handleGenerationComplete();
      setSuccessMessage('已重新生成回忆录！');
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    });
  };

  // 处理添加标签
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

  // 处理分享/导出功能
  const handleShareAction = (action: 'share' | 'pdf' | 'save') => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      
      switch (action) {
        case 'share':
          setSuccessMessage('已成功分享给家人！');
          break;
        case 'pdf':
          setSuccessMessage('已保存为PDF文件！');
          break;
        case 'save':
          setSuccessMessage('回忆已成功保存！');
          break;
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 1500);
  };

  // 处理语音转录
  useEffect(() => {
    if (currentStep === 2 && !loading) {
      setLoading(true);
      simulateProgress(10000, handleTranscriptionComplete);
    }
  }, [currentStep]);

  // 处理AI生成
  useEffect(() => {
    if (currentStep === 3 && !loading && !generatedContent) {
      setLoading(true);
      simulateProgress(8000, handleGenerationComplete);
    }
  }, [currentStep, generatedContent]);

  // 更新对话内容
  const updateDialogContent = (id: string, content: string) => {
    setFormData(prev => ({
      ...prev,
      dialogItems: prev.dialogItems.map(item => 
        item.id === id ? { ...item, content } : item
      )
    }));
  };

  // 更新对话说话人
  const updateDialogSpeaker = (id: string, speaker: SpeakerType) => {
    setFormData(prev => ({
      ...prev,
      dialogItems: prev.dialogItems.map(item => 
        item.id === id ? { ...item, speaker } : item
      )
    }));
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
                AI辅助回忆录
              </h1>
              <p className="text-xl text-neutral-600 elderly-friendly-text">
                用AI帮助记录您的珍贵回忆，更简单，更生动
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
                
                {steps.map((step) => (
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
              <form>
                <AnimatePresence mode="wait">
                  {/* 步骤1: 上传/录制 */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-medium text-neutral-800 mb-3">上传或录制您的回忆</h2>
                        <p className="text-neutral-600">您可以上传语音/视频文件，或直接录制您的回忆故事</p>
                      </div>
                      
                      {!uploadMethod ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <button
                            type="button"
                            onClick={() => handleUploadMethod('upload')}
                            className="p-8 border-2 border-dashed border-primary-300 rounded-2xl text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
                          >
                            <div className="text-6xl mb-4">📁</div>
                            <p className="text-xl font-medium text-neutral-800 mb-2">上传文件</p>
                            <p className="text-neutral-600">选择您的语音或视频文件</p>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleUploadMethod('record')}
                            className="p-8 border-2 border-dashed border-primary-300 rounded-2xl text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
                          >
                            <div className="text-6xl mb-4">🎙️</div>
                            <p className="text-xl font-medium text-neutral-800 mb-2">录制回忆</p>
                            <p className="text-neutral-600">直接开始录制您的回忆</p>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center p-6 border-2 border-primary-100 rounded-2xl bg-primary-50">
                          <div className="text-5xl mb-4">
                            {uploadMethod === 'upload' ? '📁' : '🎙️'}
                          </div>
                          <p className="text-xl font-medium text-neutral-800 mb-6">
                            {uploadMethod === 'upload' ? '正在上传...' : '正在录制...'}
                          </p>
                          
                          <div className="w-full bg-white rounded-full h-4 mb-6">
                            <div 
                              className="bg-primary-500 h-4 rounded-full transition-all duration-300"
                              style={{ width: `${progressValue}%` }}
                            ></div>
                          </div>
                          
                          <p className="text-neutral-600">
                            {uploadMethod === 'upload' 
                              ? '请稍候，正在上传您的文件...' 
                              : '请对着麦克风讲述您的回忆...'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* 步骤2: 语音转录 */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-medium text-neutral-800 mb-3">语音转录</h2>
                        <p className="text-neutral-600">我们正在将您的语音转换为文字并识别讲话人</p>
                      </div>
                      
                      {loading ? (
                        <div className="text-center p-8">
                          <div className="inline-block w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-6"></div>
                          <p className="text-lg text-neutral-700">语音转录中...</p>
                          
                          <div className="w-full bg-white rounded-full h-4 mt-6 border border-gray-200">
                            <div 
                              className="bg-primary-500 h-4 rounded-full transition-all duration-300"
                              style={{ width: `${progressValue}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="p-4 bg-primary-50 rounded-xl">
                            <p className="text-neutral-700 mb-2 font-medium">转录结果（请检查并编辑）：</p>
                          </div>
                          
                          <div className="space-y-4">
                            {formData.dialogItems.map((dialog) => (
                              <div 
                                key={dialog.id}
                                className={`flex ${dialog.speaker === 'volunteer' ? 'justify-start' : 'justify-end'}`}
                              >
                                <div className={`max-w-[80%] p-4 rounded-2xl ${
                                  dialog.speaker === 'volunteer' 
                                    ? 'bg-gray-100 text-gray-800' 
                                    : 'bg-primary-100 text-primary-800'
                                }`}>
                                  <div className="flex items-center mb-2 text-sm text-gray-500">
                                    <span>讲话人：</span>
                                    <select
                                      value={dialog.speaker}
                                      onChange={e => updateDialogSpeaker(dialog.id, e.target.value as SpeakerType)}
                                      className="ml-2 px-2 py-1 rounded border border-gray-300"
                                    >
                                      <option value="volunteer">志愿者</option>
                                      <option value="elderly">老人</option>
                                    </select>
                                  </div>
                                  <textarea
                                    value={dialog.content}
                                    onChange={e => updateDialogContent(dialog.id, e.target.value)}
                                    className="w-full bg-transparent border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-primary-300"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                          >
                            确认转录内容
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* 步骤3: AI生成回忆录 */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-medium text-neutral-800 mb-3">AI生成回忆录</h2>
                        <p className="text-neutral-600">AI正在根据您的对话内容，生成精美的回忆录文章</p>
                      </div>
                      
                      {loading ? (
                        <div className="text-center p-8">
                          <div className="inline-block w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-6"></div>
                          <p className="text-lg text-neutral-700">AI生成中...</p>
                          
                          <div className="w-full bg-white rounded-full h-4 mt-6 border border-gray-200">
                            <div 
                              className="bg-primary-500 h-4 rounded-full transition-all duration-300"
                              style={{ width: `${progressValue}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="p-6 border border-gray-200 rounded-xl">
                            <h3 className="text-xl font-medium text-neutral-800 mb-4">AI生成的回忆录</h3>
                            <textarea
                              value={formData.content}
                              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                              className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:border-primary-300 focus:outline-none"
                            />
                          </div>
                          
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={handleRegenerate}
                              className="px-6 py-3 border border-primary-500 text-primary-600 rounded-xl font-medium hover:bg-primary-50 transition-colors"
                            >
                              重新生成
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => setCurrentStep(4)}
                              className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                            >
                              确认并继续
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* 步骤4: 预览编辑 */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-medium text-neutral-800 mb-3">预览与编辑</h2>
                        <p className="text-neutral-600">您可以对回忆录进行最后的编辑并添加媒体内容</p>
                      </div>
                      
                      <div className="space-y-6">
                        {/* 标题输入 */}
                        <div>
                          <label htmlFor="title" className="block text-lg font-medium text-neutral-700 mb-2">
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
                          <label htmlFor="date" className="block text-lg font-medium text-neutral-700 mb-2">
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
                        
                        {/* 回忆内容编辑 */}
                        <div>
                          <label htmlFor="content" className="block text-lg font-medium text-neutral-700 mb-2">
                            回忆内容
                          </label>
                          <textarea
                            id="content"
                            value={formData.content}
                            onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="form-textarea-enhanced w-full h-64 text-lg"
                            placeholder="记录下这个美好的时刻..."
                          />
                        </div>

                        {/* 媒体上传 */}
                        <div>
                          <label className="block text-lg font-medium text-neutral-700 mb-4">
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
                          <label className="block text-lg font-medium text-neutral-700 mb-2">
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
                        
                        <button
                          type="button"
                          onClick={() => setCurrentStep(5)}
                          className="w-full py-3 mt-4 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                        >
                          预览完成，继续下一步
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* 步骤5: 分享保存 */}
                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-medium text-neutral-800 mb-3">分享与保存</h2>
                        <p className="text-neutral-600">恭喜！您的回忆录已完成，您可以分享或保存它</p>
                      </div>
                      
                      {/* 预览区域 */}
                      <div className="bg-neutral-50 rounded-xl p-6 mb-8">
                        <h3 className="text-2xl font-serif font-medium text-neutral-800 mb-4">
                          {formData.title || '未命名回忆'}
                        </h3>
                        <p className="text-neutral-500 mb-6">
                          {new Date(formData.date).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <div className="prose prose-lg max-w-none mb-6 whitespace-pre-line">
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
                      
                      {/* 操作按钮 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          type="button"
                          onClick={() => handleShareAction('share')}
                          className="flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          分享给家人
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleShareAction('pdf')}
                          className="flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          下载PDF
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleShareAction('save')}
                          className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          保存至回忆录
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 导航按钮 */}
                <div className="flex justify-between mt-12">
                  {currentStep > 1 && !loading && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="btn-enhanced btn-outline-enhanced"
                    >
                      上一步
                    </button>
                  )}
                  
                  {currentStep < steps.length && !loading && currentStep !== 1 && currentStep !== 4 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="btn-enhanced btn-primary-enhanced ml-auto"
                    >
                      下一步
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* 成功消息提示 */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg"
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateMemory; 