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

// 后端响应接口
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// 上传响应接口
interface UploadResponse {
  fileId: string;
  url: string;
  fileName: string;
  fileType: string;
  blobData?: Blob; // 添加Blob数据用于缓存
}

// 转录响应接口
interface TranscriptionResponse {
  transcriptionId: string;
  dialogItems: DialogItem[];
}

// AI生成响应接口
interface GenerationResponse {
  generationId: string;
  content: string;
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
      { id: '4', content: '当然记得！我记得有一次我们村里举办了丰收节，家家户户都拿出自己种的粮食和蔬菜，大家一起分享食物，载歌载舞...', speaker: 'elderly' },
      { id: '5', content: '丰收节听起来非常热闹！大家都做些什么活动呢？', speaker: 'volunteer' },
      { id: '6', content: '大人们忙着准备食物，而我和其他孩子们就在稻田边玩耍。晚上还有篝火晚会，大家围着火堆唱歌跳舞，非常热闹。那时没有现在这些电子设备，但我们一点也不觉得无聊。', speaker: 'elderly' },
      { id: '7', content: '这些回忆真美好。除了丰收节，您童年还有其他印象深刻的记忆吗？', speaker: 'volunteer' },
      { id: '8', content: '晚上大人们经常给我们讲故事，有神话传说，也有家族历史。在那样的环境中，我学会了尊重自然，珍惜粮食，也懂得了人与人之间真诚相处的重要性。', speaker: 'elderly' }
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
  
  // 工作流模式 - 默认为监督型
  const [workflowMode, setWorkflowMode] = useState<'auto' | 'supervised'>('supervised');

  // 文件操作数据与状态
  const [uploadedFiles, setUploadedFiles] = useState<UploadResponse[]>([]);
  const [transcriptionData, setTranscriptionData] = useState<TranscriptionResponse | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [finalRecordingTime, setFinalRecordingTime] = useState(0); // 新增：存储最终录音时长
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [processingStep, setProcessingStep] = useState(false); // 新增：步骤处理状态
  
  // 媒体缓存区 (新增)
  const [mediaCache, setMediaCache] = useState<{[key: string]: Blob}>({});
  
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

我小时候住在农村，那里的生活很简单，但充满了快乐。记得村里每年都会举办丰收节，那是我们孩子最期待的日子。家家户户都会拿出自己种的粮食和蔬菜，大家一起分享食物，载歌载舞。我和小伙伴们会在田野里奔跑，捉迷藏，感受大自然的美好。

特别记得有一次丰收节，我们全村人聚在一起，每家每户都拿出自己最好的农作物。大人们忙着准备食物，而我们孩子则在稻田边玩耍。晚上，村里还举行了篝火晚会，大家围着火堆，唱歌跳舞，非常热闹。

那时候没有电视，没有手机，但我们从不觉得无聊。晚上，大人们会讲故事给我们听，有神话传说，也有家族历史。就是在这样的环境中，我学会了尊重自然，珍惜粮食，也懂得了人与人之间的真诚相处。

这些简单而珍贵的记忆，至今想起来仍然温暖人心。`;

  // 动画变体
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // 修改：处理步骤跳转函数，立即跳转不添加延迟
  const handleStepChange = (nextStep: number) => {
    // 立即跳转到下一步
    setCurrentStep(nextStep);
  };

  // 与后端通信的模拟函数 (新增)
  const mockApiCall = <T,>(endpoint: string, data: any, duration: number = 3000): Promise<ApiResponse<T>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 这里可以替换为实际的API调用
        console.log(`调用API: ${endpoint}`, data);
        
        // 根据不同的endpoint返回不同的模拟数据
        let responseData: any;
        
        switch(endpoint) {
          case '/api/upload':
            responseData = {
              fileId: `file-${Date.now()}`,
              url: URL.createObjectURL(data.file),
              fileName: data.file.name,
              fileType: data.file.type
            };
            break;
          case '/api/transcribe':
            responseData = {
              transcriptionId: `transcription-${Date.now()}`,
              dialogItems: formData.dialogItems
            };
            break;
          case '/api/generate':
            responseData = {
              generationId: `generation-${Date.now()}`,
              content: sampleMemoryContent
            };
            break;
          default:
            responseData = {};
        }
        
        resolve({
          success: true,
          message: '操作成功',
          data: responseData as T
        });
      }, duration);
    });
  };

  // 处理上传/录制选择
  const handleUploadMethod = (method: 'upload' | 'record') => {
    if (method === 'upload') {
      // 直接触发文件选择对话框，不设置上传方法状态
      const fileInput = document.getElementById('file-upload-step1');
      if (fileInput) {
        (fileInput as HTMLInputElement).value = '';  // 清空之前的选择
        (fileInput as HTMLInputElement).click();
      }
    } else {
      // 请求麦克风权限并开始录制
      startRecording();
    }
  };

  // 开始录音
  const startRecording = async () => {
    try {
      // 请求音频流权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 创建MediaRecorder实例
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      // 初始化计时器
      setRecordingTime(0);
      setFinalRecordingTime(0);
      
      // 开始录制
      recorder.start();
      setIsRecording(true);
      
      // 直接保存开始时间到ref，避免闭包问题
      const startTime = Date.now();
      let currentDuration = 0;
      
      // 启动计时器
      const timer = setInterval(() => {
        currentDuration = Math.floor((Date.now() - startTime) / 1000);
        setRecordingTime(currentDuration);
        setFinalRecordingTime(currentDuration); // 实时更新最终时长
      }, 1000);
      
      // 保存计时器ID以便清除
      recorder.onstart = () => console.log('录制开始');
      
      // 当录制停止时
      recorder.onstop = () => {
        console.log('录制结束');
        clearInterval(timer);
        
        // 停止所有音轨
        stream.getTracks().forEach(track => track.stop());
        
        // 确保使用最后记录的时长，确保准确性
        const actualDuration = Math.max(currentDuration, 1);
        console.log("录制实际时长:", actualDuration, "秒");
        
        // 创建模拟的录音文件
        const timestamp = new Date().getTime();
        const fakeFile = {
          fileId: `recording-${timestamp}`,
          fileName: `录制的音频-${actualDuration}秒-${timestamp}.mp3`,
          fileType: "audio/mpeg",
          url: `data:audio/mpeg;base64,ZmFrZUF1ZGlvRGF0YQ==`
        };
        
        // 添加到上传文件列表
        setUploadedFiles(prev => [...prev, fakeFile]);
        
        // 重置录音状态
        setIsRecording(false);
        
        // 显示成功消息
        setSuccessMessage(`录制成功 (${actualDuration}秒)`);
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 1000);
      };
      
    } catch (error) {
      console.error("无法访问麦克风:", error);
      setSuccessMessage('无法访问麦克风，请确保已授予权限');
      setShowSuccess(true);
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  // 超简化的文件上传处理函数 - 加入2秒暂停和美化的进度条
  const handleFileUploadStep1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // 检查是否选择了文件
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      // 获取选中的文件
      const file = event.target.files[0];
      console.log("选择的文件:", file.name, file.type, file.size);
      
      // 显示上传状态
      setUploadingFile(true);
      setProgressValue(0);
      
      // 模拟上传过程 - 2秒
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5; // 更平滑的进度
        setProgressValue(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // 创建文件URL
          const fileURL = URL.createObjectURL(file);
          const timestamp = new Date().getTime();
          
          // 创建文件对象
          const uploadedFile = {
            fileId: `file-${timestamp}`,
            fileName: file.name,
            fileType: file.type,
            url: fileURL
          };
          
          // 上传完成后更新状态
          setTimeout(() => {
            setUploadingFile(false);
            setUploadedFiles(prev => [...prev, uploadedFile]);
            
            // 显示成功消息
            setSuccessMessage('上传成功');
            setShowSuccess(true);
            
            setTimeout(() => {
              setShowSuccess(false);
            }, 1000);
          }, 500);
        }
      }, 100); // 每100毫秒更新一次，更平滑
      
    } catch (error) {
      console.error("文件上传出错:", error);
      setUploadingFile(false);
      setSuccessMessage('上传失败，请重试');
      setShowSuccess(true);
    }
  };

  // 处理语音转录 - 修改：进入页面后再展示处理过程
  const handleTranscription = () => {
    if (uploadedFiles.length === 0) {
      setSuccessMessage('请先上传文件');
      setShowSuccess(true);
      return;
    }
    
    // 显示处理状态
    setProcessingStep(true);
    setSuccessMessage('正在转录，请稍候...');
    setShowSuccess(true);
    
    // 添加2-3秒延迟
    setTimeout(() => {
      // 直接创建转录结果
      const result = {
        transcriptionId: `trans-${Date.now()}`,
        dialogItems: formData.dialogItems
      };
      
      // 更新状态
      setTranscriptionData(result);
      setProcessingStep(false);
      setSuccessMessage('转录完成');
      setShowSuccess(true);
      
      // 自动模式下直接进入下一步
      setTimeout(() => {
        setShowSuccess(false);
        if (workflowMode === 'auto') {
          setCurrentStep(3);
        }
      }, 1000);
    }, 2000 + Math.random() * 1000);
  };

  // 处理AI生成 - 极简化版本，立即返回结果
  const handleGeneration = () => {
    if (!transcriptionData) {
      setSuccessMessage('请先完成语音转录！');
      setShowSuccess(true);
      return;
    }
    
    // 显示处理状态
    setProcessingStep(true);
    setSuccessMessage('AI正在生成回忆录，请稍候...');
    setShowSuccess(true);
    
    // 添加3-4秒延迟
    setTimeout(() => {
      // 直接使用示例内容
      const generationResult = {
        generationId: `generation-${Date.now()}`,
        content: sampleMemoryContent
      };
      
      // 更新状态
      setGeneratedContent(generationResult.content);
      setFormData(prev => ({
        ...prev,
        content: generationResult.content
      }));
      
      setProcessingStep(false);
      setSuccessMessage('回忆录生成成功！');
      setShowSuccess(true);
      
      // 自动模式下直接进入下一步
      setTimeout(() => {
        setShowSuccess(false);
        if (workflowMode === 'auto') {
          handleStepChange(4);
        }
      }, 1000);
    }, 3000 + Math.random() * 1000);
  };

  // 处理重新生成 (更新)
  const handleRegenerate = () => {
    handleGeneration();
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
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const files = Array.from(e.target.files);
    
    // 直接将文件添加到formData状态而不处理内容
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
    
    // 添加成功消息
    setSuccessMessage(`已添加 ${files.length} 个文件`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  // 处理分享/导出功能
  const handleShareAction = (action: 'share' | 'pdf' | 'save') => {
    setProcessingStep(true);
    
    const actionMessages = {
      'share': '正在分享给家人...',
      'pdf': '正在生成PDF文件...',
      'save': '正在保存回忆...'
    };
    
    setSuccessMessage(actionMessages[action]);
    setShowSuccess(true);
    
    setTimeout(() => {
      setProcessingStep(false);
      
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
    }, 2500 + Math.random() * 1500);
  };

  // 新增：页面加载后自动处理的逻辑，添加动态进度条
  useEffect(() => {
    // 当进入转录步骤时
    if (currentStep === 2 && !transcriptionData) {
      // 显示处理状态
      setProcessingStep(true);
      setSuccessMessage('正在转录音频...');
      setShowSuccess(true);
      
      // 模拟进度 - 使用不同的阶段和速度
      let progress = 0;
      
      // 第一阶段：音频分析 (0-30%) - 较快
      const stage1 = setInterval(() => {
        progress += 2;
        setProgressValue(progress);
        if (progress >= 30) {
          clearInterval(stage1);
          
          // 第二阶段：语音识别 (30-60%) - 中速
          const stage2 = setInterval(() => {
            progress += 1;
            setProgressValue(progress);
            if (progress >= 60) {
              clearInterval(stage2);
              
              // 第三阶段：说话人识别 (60-90%) - 较慢
              const stage3 = setInterval(() => {
                progress += 0.5;
                setProgressValue(progress);
                if (progress >= 90) {
                  clearInterval(stage3);
                  
                  // 最终阶段：完成 (90-100%) - 快速
                  const finalStage = setInterval(() => {
                    progress += 2;
                    setProgressValue(Math.min(progress, 100));
                    if (progress >= 100) {
                      clearInterval(finalStage);
                      
                      // 转录完成
                      setTimeout(() => {
                        const result = {
                          transcriptionId: `trans-${Date.now()}`,
                          dialogItems: formData.dialogItems
                        };
                        setTranscriptionData(result);
                        setProcessingStep(false);
                        setShowSuccess(false);
                      }, 500);
                    }
                  }, 100);
                }
              }, 200);
            }
          }, 150);
        }
      }, 100);
    }
    
    // 当进入AI生成步骤时
    if (currentStep === 3 && !generatedContent) {
      // 显示处理状态
      setProcessingStep(true);
      setSuccessMessage('AI正在创建回忆录...');
      setShowSuccess(true);
      
      // 模拟进度 - 分为多个阶段
      let progress = 0;
      
      // 第一阶段：分析对话 (0-25%)
      const stage1 = setInterval(() => {
        progress += 1;
        setProgressValue(progress);
        if (progress >= 25) {
          clearInterval(stage1);
          setSuccessMessage('AI正在构建文章结构...');
          
          // 第二阶段：构建结构 (25-50%)
          const stage2 = setInterval(() => {
            progress += 0.8;
            setProgressValue(progress);
            if (progress >= 50) {
              clearInterval(stage2);
              setSuccessMessage('AI正在撰写内容...');
              
              // 第三阶段：撰写内容 (50-85%)
              const stage3 = setInterval(() => {
                progress += 0.6;
                setProgressValue(progress);
                if (progress >= 85) {
                  clearInterval(stage3);
                  setSuccessMessage('AI正在润色文章...');
                  
                  // 最终阶段：润色完成 (85-100%)
                  const finalStage = setInterval(() => {
                    progress += 1;
                    setProgressValue(Math.min(progress, 100));
                    if (progress >= 100) {
                      clearInterval(finalStage);
                      
                      // 生成完成
                      setTimeout(() => {
                        setGeneratedContent(sampleMemoryContent);
                        setFormData(prev => ({
                          ...prev,
                          content: sampleMemoryContent
                        }));
                        setProcessingStep(false);
                        setSuccessMessage('回忆录生成成功！');
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 1500);
                      }, 500);
                    }
                  }, 100);
                }
              }, 180);
            }
          }, 150);
        }
      }, 120);
    }
  }, [currentStep]);

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
                      
                      {/* 上传区域 - 根据状态显示不同内容 */}
                      {!uploadingFile && !isRecording ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <button
                            type="button"
                            onClick={() => handleUploadMethod('upload')}
                            className="p-8 border-2 border-dashed border-primary-300 rounded-2xl text-center hover:border-primary-500 hover:bg-primary-50 transition-colors relative"
                          >
                            <div className="text-6xl mb-4">📁</div>
                            <p className="text-xl font-medium text-neutral-800 mb-2">上传文件</p>
                            <p className="text-neutral-600">选择您的语音或视频文件</p>
                            <input
                              type="file"
                              id="file-upload-step1"
                              accept="audio/*,video/*"
                              onChange={handleFileUploadStep1}
                              className="hidden"
                            />
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
                      ) : uploadingFile ? (
                        // 美化的上传文件状态
                        <div className="text-center p-8 border-2 border-primary-100 rounded-2xl bg-primary-50">
                          <div className="text-5xl mb-4 animate-bounce">📁</div>
                          <p className="text-xl font-medium text-neutral-800 mb-6">正在上传...</p>
                          
                          {/* 美化的进度条 */}
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-6 mb-2 text-xs flex rounded-xl bg-white shadow-inner">
                              <div 
                                style={{ width: `${progressValue}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-300 rounded-xl"
                              >
                                <span className="font-semibold">{progressValue}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-neutral-600 mt-4">请稍候，正在处理您的文件...</p>
                        </div>
                      ) : (
                        // 美化的录音状态
                        <div className="text-center p-8 border-2 border-primary-100 rounded-2xl bg-primary-50">
                          <div className="text-5xl mb-4 animate-pulse">🎙️</div>
                          <p className="text-xl font-medium text-neutral-800 mb-6">
                            正在录制... <span className="text-primary-600 font-bold">{recordingTime}秒</span>
                          </p>
                          
                          {/* 漂亮的音频波形动画 */}
                          <div className="flex justify-center items-center h-16 mb-6 bg-white/50 rounded-xl px-4">
                            {[...Array(12)].map((_, i) => (
                              <div
                                key={i}
                                className="bg-gradient-to-t from-primary-500 to-primary-300 w-2 mx-1 rounded-full"
                                style={{
                                  height: `${20 + Math.sin((i + recordingTime) * 0.5) * 20}px`,
                                  animationDelay: `${i * 0.1}s`,
                                  transition: 'height 0.2s ease'
                                }}
                              ></div>
                            ))}
                          </div>
                          
                          <p className="text-neutral-600 mt-4">正在录制您的声音，请对着麦克风讲话...</p>
                          
                          {/* 美化的停止录制按钮 */}
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="mt-6 py-3 px-8 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                          >
                            <div className="flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                              </svg>
                              停止录制
                            </div>
                          </button>
                        </div>
                      )}
                      
                      {/* 显示上传的文件列表 */}
                      {uploadedFiles.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-lg font-medium text-neutral-700 mb-2">已上传的文件</h3>
                          <div className="bg-neutral-50 rounded-lg p-4">
                            {uploadedFiles.map((file, index) => (
                              <div key={file.fileId} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white transition-colors">
                                <div className="flex items-center">
                                  <span className="text-2xl mr-3">
                                    {file.fileType.startsWith('audio/') ? '🔊' : '🎥'}
                                  </span>
                                  <span className="text-neutral-700">{file.fileName}</span>
                                </div>
                                <span className="flex items-center text-green-500 bg-green-50 px-2 py-1 rounded-full">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  已上传
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          {/* 显示继续按钮 */}
                          <div className="mt-5 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleStepChange(2)}
                              disabled={processingStep}
                              className={`py-2.5 px-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm hover:shadow-md ${processingStep ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              {processingStep ? '处理中...' : '继续下一步'}
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* 步骤2: 语音转录 - 微信风格聊天界面 */}
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
                        <p className="text-neutral-600">您的语音已转换为文字并识别讲话人</p>
                      </div>
                      
                      {processingStep ? (
                        // 处理中状态 - 美化的进度UI
                        <div className="py-10 px-6">
                          <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                              <svg className="w-8 h-8 text-primary-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-medium text-neutral-800 mb-2">正在转录您的音频</h3>
                            <p className="text-neutral-600">{progressValue < 30 ? '分析音频内容...' : progressValue < 60 ? '识别语音文字...' : progressValue < 90 ? '区分讲话人...' : '完成转录...'}</p>
                          </div>
                          
                          {/* 优美的进度条 - 动态进度 */}
                          <div className="max-w-md mx-auto">
                            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-400 to-primary-500 rounded-full transition-all duration-300" 
                                style={{ width: `${progressValue}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-neutral-500">
                              <span className={progressValue >= 30 ? "text-primary-600 font-medium" : ""}>分析音频</span>
                              <span className={progressValue >= 60 ? "text-primary-600 font-medium" : ""}>识别文字</span>
                              <span className={progressValue >= 90 ? "text-primary-600 font-medium" : ""}>识别讲话人</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* 文件信息卡片 */}
                          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex items-center p-4 border-b border-gray-100 bg-gray-50">
                              <div className="text-2xl mr-3 bg-primary-100 w-10 h-10 flex items-center justify-center rounded-full">
                                {uploadedFiles[0]?.fileType.startsWith('audio/') ? '🔊' : '🎥'}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-neutral-800">{uploadedFiles[0]?.fileName}</h3>
                                <p className="text-sm text-neutral-500">已完成转录</p>
                              </div>
                              <div className="flex items-center text-green-500 bg-green-50 px-3 py-1 rounded-full text-sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                转录成功
                              </div>
                            </div>
                          </div>
                          
                          {/* 微信风格的聊天界面 */}
                          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-neutral-50">
                              <h3 className="font-medium text-lg text-neutral-800 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                对话内容
                              </h3>
                              <button 
                                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                                onClick={handleTranscription}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                重新转录
                              </button>
                            </div>
                            
                            {/* 微信风格聊天内容区域 - 优化视觉与交互 */}
                            <div 
                              className="p-4 overflow-visible"
                              style={{ 
                                backgroundColor: '#F5F5F5',
                                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(245,245,245,0.8))',
                                fontFamily: 'Noto Sans, system-ui, -apple-system, sans-serif',
                                minHeight: 'auto',
                                padding: '20px'
                              }}
                            >
                              <div className="space-y-5">
                                {formData.dialogItems.map((dialog) => {
                                  const isVolunteer = dialog.speaker === 'volunteer';
                                  const contentLength = dialog.content.length;
                                  // 根据身份设置不同的气泡宽度
                                  const bubbleWidth = isVolunteer 
                                    ? "max-w-[50%]" 
                                    : "max-w-[80%]";
                                  
                                  return (
                                    <div 
                                      key={dialog.id}
                                      className={`flex ${isVolunteer ? 'justify-start pl-0.5' : 'justify-end pr-0.5'} items-start`}
                                    >
                                      {/* 志愿者头像 */}
                                      {isVolunteer && (
                                        <div className="flex flex-col items-center mr-2">
                                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                                            V
                                          </div>
                                          <span className="text-xs text-gray-500 mt-1">志愿者</span>
                                        </div>
                                      )}
                                      
                                      <div 
                                        className={isVolunteer ? bubbleWidth : ""}
                                        style={!isVolunteer ? { width: '47%', maxWidth: '47%' } : {}}
                                      >
                                        {/* 聊天气泡 */}
                                        <div 
                                          className={`relative p-3.5 mb-1 ${
                                            isVolunteer 
                                              ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-blue-100 rounded-[16px] rounded-tl-sm shadow-sm hover:border-blue-200' 
                                              : 'bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-[16px] rounded-tr-sm shadow-md hover:shadow-lg'
                                          }`}
                                          style={{ fontSize: '15px', lineHeight: '1.6' }}
                                        >
                                          {/* 气泡尖角 - 修改为箭头形状 */}
                                          {isVolunteer ? (
                                            <div className="absolute left-[-8px] top-[8px] w-0 h-0" style={{
                                              borderTop: '6px solid transparent',
                                              borderRight: '8px solid #e8eeff',
                                              borderBottom: '6px solid transparent'
                                            }}></div>
                                          ) : (
                                            <div className="absolute right-[-8px] top-[8px] w-0 h-0" style={{
                                              borderTop: '6px solid transparent',
                                              borderLeft: '8px solid #4299e1',
                                              borderBottom: '6px solid transparent'
                                            }}></div>
                                          )}
                                          
                                          {/* 文本编辑区域 - 自适应高度更新设计 */}
                                          <div className="relative group">
                                            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-opacity duration-200 ${
                                              isVolunteer ? 'bg-blue-100 text-blue-600' : 'bg-blue-600 text-white'
                                            } opacity-0 group-hover:opacity-100`}>
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                              </svg>
                                            </div>
                                            
                                            <textarea
                                              value={dialog.content}
                                              onChange={(e) => updateDialogContent(dialog.id, e.target.value)}
                                              className={`w-full bg-transparent border-0 p-0 outline-none resize-none ${
                                                isVolunteer ? 'text-gray-800' : 'text-white placeholder-white/80'
                                              }`}
                                              style={{ 
                                                minHeight: '1.5rem',
                                                fontFamily: 'inherit',
                                                fontSize: 'inherit',
                                                lineHeight: '1.6',
                                                overflow: 'hidden',
                                                height: 'auto'
                                              }}
                                              onInput={(e) => {
                                                // 自动调整高度
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = '';
                                                target.style.height = `${target.scrollHeight}px`;
                                              }}
                                              ref={(textarea) => {
                                                // 初始化时设置正确高度
                                                if (textarea) {
                                                  textarea.style.height = '';
                                                  textarea.style.height = `${textarea.scrollHeight}px`;
                                                }
                                              }}
                                              placeholder="点击编辑对话内容..."
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* 老人头像 */}
                                      {!isVolunteer && (
                                        <div className="flex flex-col items-center ml-2">
                                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                                            E
                                          </div>
                                          <span className="text-xs text-gray-500 mt-1">老人</span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* 底部操作栏 - 悬浮固定在底部 */}
                            <div className="border-t border-gray-200 p-4 bg-gradient-to-b from-white to-gray-50">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleStepChange(3)}
                                  disabled={processingStep}
                                  className="py-2.5 px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md flex items-center"
                                >
                                  <span>生成回忆录</span>
                                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* 步骤3: AI生成回忆录 - 改进进度条显示 */}
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
                        <p className="text-neutral-600">AI正在根据您的对话内容生成精美的回忆录文章</p>
                      </div>
                      
                      {processingStep ? (
                        // AI生成处理中状态 - 动态进度条
                        <div className="py-10 px-6">
                          <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-medium text-neutral-800 mb-2">AI正在创作您的回忆录</h3>
                            <p className="text-neutral-600">{
                              progressValue < 25 ? '分析对话内容...' : 
                              progressValue < 50 ? '构建文章结构...' : 
                              progressValue < 85 ? '撰写内容...' : 
                              '润色文章...'
                            }</p>
                          </div>
                          
                          {/* AI处理动画 */}
                          <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 p-4 mb-6">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium text-neutral-800">AI创作中</h4>
                                <p className="text-xs text-neutral-500">使用先进的语言模型</p>
                              </div>
                            </div>
                            
                            <div className="h-32 bg-gray-50 rounded-lg border border-gray-100 p-3 overflow-hidden relative">
                              <div className="animate-pulse">
                                <div className="h-2 bg-gray-200 rounded mb-2 w-2/3"></div>
                                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                                <div className="h-2 bg-gray-200 rounded mb-2 w-5/6"></div>
                                <div className="h-2 bg-gray-200 rounded mb-2 w-3/4"></div>
                                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                                <div className="h-2 bg-gray-200 rounded mb-2 w-4/5"></div>
                              </div>
                              
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
                              <div className="absolute bottom-3 left-3 right-3 flex">
                                <div className="w-4 h-4 bg-primary-500 rounded-full animate-ping mr-1"></div>
                                <div className="w-4 h-4 bg-primary-500 rounded-full animate-ping mr-1" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-4 h-4 bg-primary-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* 进度百分比 - 动态更新 */}
                          <div className="max-w-md mx-auto">
                            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-400 to-primary-500 rounded-full transition-all duration-300" 
                                style={{ width: `${progressValue}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-neutral-500">
                              <span className={progressValue >= 25 ? "text-primary-600 font-medium" : ""}>分析对话</span>
                              <span className={progressValue >= 50 ? "text-primary-600 font-medium" : ""}>创建结构</span>
                              <span className={progressValue >= 85 ? "text-primary-600 font-medium" : ""}>生成内容</span>
                              <span className={progressValue >= 100 ? "text-primary-600 font-medium" : ""}>润色文章</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="p-6 bg-primary-50 rounded-xl border border-primary-100">
                            <div className="bg-white p-4 rounded-lg mb-4">
                              <div className="flex items-center text-green-600 mb-2">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-medium">生成完成</span>
                              </div>
                              <p className="text-neutral-600 text-sm">
                                AI已根据对话内容生成了精美的回忆录文章。您可以查看并编辑以下内容。
                              </p>
                            </div>
                          </div>
                          
                          <div className="p-6 border border-neutral-200 bg-white rounded-xl shadow-sm">
                            <h3 className="text-xl font-medium text-neutral-800 mb-4">AI生成的回忆录</h3>
                            
                            {workflowMode === 'supervised' ? (
                              <textarea
                                value={formData.content}
                                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:border-primary-300 focus:outline-none"
                              />
                            ) : (
                              <div className="prose prose-lg max-w-none mb-6 whitespace-pre-line p-4 border border-gray-100 rounded-lg bg-gray-50">
                                {formData.content}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-end space-x-4 mt-8">
                            <button
                              type="button"
                              onClick={handleRegenerate}
                              disabled={processingStep}
                              className={`py-3 px-6 bg-neutral-200 text-neutral-700 rounded-xl font-medium hover:bg-neutral-300 transition-colors ${processingStep ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              {processingStep ? '处理中...' : '重新生成'}
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleStepChange(4)}
                              disabled={processingStep}
                              className={`py-3 px-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-colors shadow-sm hover:shadow-md ${processingStep ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              编辑与预览
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
                              onChange={handleMediaUpload}
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
                          
                          {/* 已上传文件状态栏 */}
                          {formData.files.length > 0 && (
                            <div className="mt-4 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                              <div className="p-3 bg-gray-100 border-b border-gray-200">
                                <h4 className="font-medium text-gray-700 flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  已添加 {formData.files.length} 个文件
                                </h4>
                              </div>
                              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                {formData.files.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 hover:bg-white transition-colors border-b border-gray-100 last:border-0">
                                    <div className="flex items-center">
                                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 mr-3">
                                        {file.type.startsWith('image/') ? (
                                          <img 
                                            src={URL.createObjectURL(file)} 
                                            alt="" 
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <span className="text-2xl">🎥</span>
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
                                          {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        setFormData(prev => ({
                                          ...prev,
                                          files: prev.files.filter((_, i) => i !== index)
                                        }));
                                        setSuccessMessage('文件已移除');
                                        setShowSuccess(true);
                                        setTimeout(() => setShowSuccess(false), 1000);
                                      }}
                                      className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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
                          onClick={() => handleStepChange(5)}
                          disabled={processingStep}
                          className={`w-full py-3 mt-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-colors shadow-sm hover:shadow-md ${processingStep ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {processingStep ? '处理中...' : '预览完成，继续下一步'}
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
                          disabled={processingStep}
                          className={`flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-colors shadow-sm hover:shadow-md ${processingStep ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          {processingStep ? '处理中...' : '分享给家人'}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleShareAction('pdf')}
                          disabled={processingStep}
                          className={`flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-colors shadow-sm hover:shadow-md ${processingStep ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          {processingStep ? '处理中...' : '下载PDF'}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleShareAction('save')}
                          disabled={processingStep}
                          className={`flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-colors shadow-sm hover:shadow-md ${processingStep ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {processingStep ? '处理中...' : '保存至回忆录'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 导航按钮 */}
                <div className="flex justify-between mt-12">
                  {currentStep > 1 && !loading && !processingStep && (
                    <button
                      type="button"
                      onClick={() => handleStepChange(currentStep - 1)}
                      className="btn-enhanced btn-outline-enhanced"
                    >
                      上一步
                    </button>
                  )}
                  
                  {/* 移除通用的"下一步"按钮，因为各步骤有专用按钮 */}
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
                  className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        /* 自定义滚动条样式 */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default CreateMemory; 