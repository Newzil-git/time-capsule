# 时光胶囊 (Time Capsule)

![时光胶囊](public/images/hero/hero-banner.jpg)

## 📝 项目介绍

"时光胶囊"是一个专为老年用户设计的记忆保存平台，帮助用户轻松记录、整理和分享生活中的珍贵瞬间。项目注重适老化设计，提供简单直观的用户界面和流畅的交互体验，让老年人也能轻松使用现代科技记录自己的生活故事。

### 🌟 核心理念

- **珍贵记忆永久保存**：安全地存储用户的照片、视频和文字记忆
- **代际沟通桥梁**：促进家庭成员间的情感连接和记忆共享
- **适老化设计**：专为老年用户打造的简单易用界面

## ✨ 主要功能

- **多媒体记忆记录**：支持文字、图片、视频和音频的多种记忆形式
- **时间线浏览**：按时间顺序整理和浏览记忆
- **标签分类**：通过标签轻松归类和查找记忆
- **家庭共享**：与家人安全分享特定记忆
- **记忆提醒**：自动展示"往日回忆"
- **简易创建流程**：引导式界面，三步即可创建新记忆

## 🛠️ 技术栈

- **前端框架**：Next.js 14.2
- **UI组件**：React 18
- **样式解决方案**：TailwindCSS
- **动画效果**：Framer Motion
- **字体处理**：Google Fonts
- **代码质量**：TypeScript, ESLint

## 📦 安装与运行

### 前提条件

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/time-capsule.git
cd time-capsule
```

2. 安装依赖

```bash
npm install
```

3. 运行开发服务器

```bash
npm run dev
```

4. 构建生产版本

```bash
npm run build
```

5. 启动生产服务器

```bash
npm run start
```

## 📁 项目结构

```
time-capsule/
├── public/             # 静态资源
│   └── images/         # 图片资源
├── src/                # 源代码
│   ├── components/     # 可复用组件
│   ├── pages/          # 页面组件
│   ├── styles/         # 全局样式
│   └── utils/          # 工具函数
├── .eslintrc.json      # ESLint配置
├── next.config.js      # Next.js配置
├── package.json        # 项目依赖
├── tailwind.config.js  # Tailwind配置
└── tsconfig.json       # TypeScript配置
```

## 📱 页面与功能

- **首页**：展示最新记忆和功能入口
- **回忆列表页**：浏览和筛选所有记忆
- **回忆详情页**：查看单个记忆的详细内容
- **创建回忆页**：三步式引导创建新记忆
- **关于我们页**：了解项目理念和团队信息

## 🎨 设计特点

- **大字体**：确保老年用户阅读舒适
- **高对比度**：提高内容可见性
- **简化操作**：减少复杂操作，避免多层嵌套菜单
- **友好反馈**：清晰的操作反馈和引导提示
- **优雅动效**：平滑过渡动画增强用户体验
- **响应式设计**：适配各种设备屏幕尺寸

## 🤝 贡献指南

我们欢迎所有形式的贡献，特别是那些能够提升老年用户体验的改进。

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加了某个特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 👥 团队成员

- 魏诩宸
- 刘子阳
- 苑泽楷
- 何璟玥
- 张天宇

## 📋 版本历史

### v3.0 - AI辅助回忆录展示版 (2月19日)

全新的"AI辅助回忆录"功能，虽然当前为展示版（不实际调用AI和语音识别服务），但完整呈现了整个工作流程。

#### 主要更新：

- **五步式创建流程**：上传/录制、语音转录、AI生成回忆录、预览编辑、分享保存
- **上传/录制功能**：支持上传或录制语音/视频，并提供进度反馈
- **语音转录展示**：模拟语音转文字过程，支持识别并区分讲话人（志愿者vs老人）
- **AI生成功能**：展示AI根据对话内容生成回忆录的过程，可重新生成和编辑
- **丰富导出选项**：分享给家人、下载PDF、保存至回忆录等多种选项
- **增强用户体验**：动画过渡、状态提示、成功消息等交互反馈

### v2.0 - UI优化与布局调整 (2月14日)

对用户界面进行全面优化，改善布局结构，提升用户体验。

#### 主要更新：

- **优化侧边栏布局**：调整宽度与样式，改善布局比例
- **固定两侧面板**：保持左右两栏固定，只允许中间内容区域滚动
- **加强创建入口**：改进"创建回忆"按钮的醒目程度
- **响应式优化**：提升在不同屏幕尺寸下的显示效果
- **交互流畅性**：减少页面跳转，增加切换动画
- **移动端适配**：优化手机和平板上的使用体验

### v1.0 - 基础功能版 (2月12日)

首个功能完整的发布版本，实现基本的回忆录创建和管理功能。

#### 主要功能：

- **基础创建流程**：三步式（基本信息、内容详情、预览确认）创建回忆
- **多媒体支持**：文字、图片、视频和音频的基础支持
- **标签管理**：支持添加和删除标签，方便分类
- **时间线浏览**：按时间顺序组织记忆
- **适老化设计**：大字体、高对比度、简化操作流程
- **响应式布局**：基础的移动端和桌面端适配

## 📞 联系我们

- 项目维护者：刘子阳(newzil)
- 邮箱：ziyannn@yeah.net

---

⭐ 如果您喜欢这个项目，请考虑给它一个星标来支持我们！
