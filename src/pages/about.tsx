import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Layout from '@/components/Layout';

const AboutUs = () => {
  // 动画变体
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  // 团队成员数据
  const teamMembers = [
    {
      id: 1,
      name: '张明',
      role: '创始人',
      bio: '拥有20年软件开发经验，曾在多家知名科技公司担任技术领导职位。致力于将技术与人文关怀相结合，让科技更有温度。',
      imageUrl: '/images/avatars/member1.jpg'
    },
    {
      id: 2,
      name: '李华',
      role: '产品经理',
      bio: '资深产品经理，专注于老年用户体验设计。深入研究老年人数字需求，打造简单易用的产品体验。',
      imageUrl: '/images/avatars/member2.jpg'
    },
    {
      id: 3,
      name: '王芳',
      role: 'UI设计师',
      bio: '10年设计经验，专注于适老化界面设计。多次获得设计大奖，相信设计可以改变生活，让科技更有人情味。',
      imageUrl: '/images/avatars/member3.jpg'
    },
    {
      id: 4,
      name: '刘伟',
      role: '技术总监',
      bio: '全栈开发专家，热衷于探索新技术并应用于实际产品。致力于打造高质量、高性能的数字产品。',
      imageUrl: '/images/avatars/member4.jpg'
    }
  ];

  // 里程碑数据
  const milestones = [
    {
      id: 1,
      year: '2020',
      title: '项目启动',
      description: '时光胶囊项目正式启动，我们开始收集用户需求和市场调研。'
    },
    {
      id: 2,
      year: '2021',
      title: '第一版发布',
      description: '时光胶囊1.0版本发布，提供基础的记忆存储和分享功能。'
    },
    {
      id: 3,
      year: '2022',
      title: '功能扩展',
      description: '添加AI智能回忆整理、家庭分享和多媒体支持等功能。'
    },
    {
      id: 4,
      year: '2023',
      title: '全新设计',
      description: '推出全新界面设计，优化用户体验，特别关注老年用户的使用便捷性。'
    }
  ];

  return (
    <Layout 
      rightPanelContent={
        <div className="space-y-6">
          <div className="card-enhanced p-5">
            <h3 className="text-xl font-medium mb-3">联系我们</h3>
            <p className="mb-4 text-gray-600">有任何问题或建议，欢迎随时联系我们</p>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">contact@timecapsule.com</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">400-123-4567</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">北京市海淀区科技园 100号</span>
              </div>
            </div>
          </div>
          
          <div className="card-enhanced p-5">
            <h3 className="text-xl font-medium mb-3">加入我们</h3>
            <p className="text-gray-600 mb-4">我们正在寻找志同道合的伙伴，一起打造更好的产品</p>
            <a href="#" className="btn btn-primary w-full py-2.5">查看招聘职位</a>
          </div>
        </div>
      }
    >
      {/* 头部区域 - 使命和愿景 */}
      <section className="mb-16">
        <div className="relative rounded-3xl overflow-hidden gradient-bg-cool p-8 md:p-12">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute inset-0 bg-primary-100 opacity-50"></div>
            <Image
              src="/images/about/pattern.png"
              alt="Background pattern"
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="relative z-10 max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">关于我们的故事</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              时光胶囊始于一个简单的想法：帮助每个人，尤其是老年朋友们，
              轻松地记录和分享生活中的珍贵瞬间，将记忆安全地保存，
              并在未来的某一天重新发现它们的魅力。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-sm">
                <h3 className="text-xl font-medium text-primary-600 mb-2">我们的使命</h3>
                <p className="text-gray-600">让每一段珍贵回忆都被妥善保存，让每个人都能轻松记录生活</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-sm">
                <h3 className="text-xl font-medium text-secondary-600 mb-2">我们的愿景</h3>
                <p className="text-gray-600">成为连接过去与未来的桥梁，让回忆跨越时间的限制</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 我们的价值观 */}
      <section className="mb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">我们的价值观</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            这些核心价值观引导我们创造有意义的产品和服务，帮助用户保存珍贵记忆
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={fadeInUp} className="card-enhanced p-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-3">安全与隐私</h3>
            <p className="text-gray-600">
              我们将用户的记忆视为珍宝，采用最高标准的安全措施保护每一条数据。
              您的隐私就是我们的责任。
            </p>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="card-enhanced p-6">
            <div className="w-14 h-14 rounded-2xl bg-secondary-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-3">简单易用</h3>
            <p className="text-gray-600">
              我们相信科技应该服务于每一个人，无论年龄大小。
              因此我们致力于打造简单直观的产品体验。
            </p>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="card-enhanced p-6">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-3">情感连接</h3>
            <p className="text-gray-600">
              我们的产品不仅仅是工具，更是情感的载体。
              帮助人们连接过去，珍视当下，憧憬未来。
            </p>
          </motion.div>
        </motion.div>
      </section>
      
      {/* 团队介绍 */}
      <section className="mb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">我们的团队</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            一群热爱创新、专注用户体验的专业人士，致力于为您创造价值
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={fadeInUp}
              className="card-enhanced p-0 overflow-hidden"
            >
              <div className="relative h-64 w-full bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center bg-primary-50">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // 如果图片加载失败，隐藏图片元素
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                <p className="text-primary-500 mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* 发展历程 */}
      <section className="mb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">我们的发展历程</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            从构想到实现，我们一路走来的重要里程碑
          </p>
        </motion.div>
        
        <div className="relative">
          {/* 连接线 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 rounded-full" />
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                variants={fadeInUp}
                className="relative"
              >
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} md:gap-8`}>
                  <div className="hidden md:block w-[45%]" />
                  
                  {/* 年份标记 */}
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {milestone.year}
                    </div>
                  </div>
                  
                  {/* 内容卡片 */}
                  <div className="w-[45%] md:w-[45%] card-enhanced">
                    <h3 className="text-xl font-medium mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* 联系我们 - CTA */}
      <section className="mb-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="rounded-3xl overflow-hidden gradient-bg-warm p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">与我们一起保存珍贵回忆</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            无论是家庭相册、珍贵视频还是文字日记，时光胶囊都能帮您妥善保存。
            开始创建您的第一个回忆吧！
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn btn-primary-enhanced px-8 py-3">
              立即开始
            </button>
            <button className="btn btn-outline-enhanced px-8 py-3">
              了解更多
            </button>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default AboutUs; 