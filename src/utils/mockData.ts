export interface MemoryItem {
  id: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  tags?: string[];
}

export const memories: MemoryItem[] = [
  {
    id: 1,
    title: '第一次骑自行车',
    date: '1960-05-15',
    summary: '那天父亲教我骑自行车的场景，至今难忘。',
    content: '记得那是一个阳光明媚的春日，父亲扶着自行车后座，一步步教我保持平衡...',
    type: 'image',
    mediaUrl: '/老人温暖.jpg',
    tags: ['童年', '家人', '技能']
  },
  {
    id: 2,
    title: '第一天上学',
    date: '1962-09-01',
    summary: '背着新书包，满怀期待地走进校园。',
    content: '穿着新衣服，背着崭新的书包，妈妈牵着我的手走进了学校...',
    type: 'text',
    tags: ['学校', '童年']
  },
  {
    id: 3,
    title: '结婚纪念',
    date: '1985-10-01',
    summary: '和一生挚爱的相遇、相知到相守。',
    content: '那天，我穿着红色的新娘装，他穿着笔挺的西装...',
    type: 'image',
    mediaUrl: '/时光胶囊漫画图.jpg',
    tags: ['婚礼', '家人', '爱情']
  },
  {
    id: 4,
    title: '孩子出生',
    date: '1986-06-15',
    summary: '迎接新生命的到来，成为父母的喜悦。',
    content: '听到孩子的第一声啼哭，那一刻的幸福无法用言语形容...',
    type: 'image',
    mediaUrl: '/老人温暖.jpg',
    tags: ['家人', '新生']
  },
  {
    id: 5,
    title: '全家旅行',
    date: '1990-08-01',
    summary: '第一次带着全家人去旅行，欢乐的回忆。',
    content: '我们选择了一个风景优美的海滨城市，孩子们第一次看到大海...',
    type: 'image',
    mediaUrl: '/时光胶囊漫画图.jpg',
    tags: ['旅行', '家人', '假期']
  },
  {
    id: 6,
    title: '退休生活开始',
    date: '2010-12-30',
    summary: '开启人生新的篇章。',
    content: '收拾好办公室的物品，同事们为我举办了温馨的欢送会...',
    type: 'text',
    tags: ['工作', '人生转折']
  },
  {
    id: 7,
    title: '学习使用智能手机',
    date: '2015-03-20',
    summary: '与时俱进，学习新技术。',
    content: '孙子教我如何使用微信，让我能够随时与家人联系...',
    type: 'text',
    tags: ['学习', '科技', '家人']
  },
  {
    id: 8,
    title: '金婚纪念日',
    date: '2020-10-01',
    summary: '五十年相守，感恩有你。',
    content: '孩子们为我们举办了一场温馨的金婚庆典...',
    type: 'text',
    tags: ['婚姻', '家人', '纪念']
  },
  {
    id: 9,
    title: '童年的回忆',
    date: '2025-03-26',
    summary: '在农村度过的美好童年时光，丰收节的欢乐记忆。',
    content: '童年的回忆：\n\n我小时候住在农村，那里的生活很简单，但充满了快乐。记得村里每年都会举办丰收节，那是我们孩子最期待的日子。家家户户都会拿出自己种的粮食和蔬菜，大家一起分享食物，载歌载舞。我和小伙伴们会在田野里奔跑，捉迷藏，感受大自然的美好。\n\n特别记得有一次丰收节，我们全村人聚在一起，每家每户都拿出自己最好的农作物。大人们忙着准备食物，而我们孩子则在稻田边玩耍。晚上，村里还举行了篝火晚会，大家围着火堆，唱歌跳舞，非常热闹。\n\n那时候没有电视，没有手机，但我们从不觉得无聊。晚上，大人们会讲故事给我们听，有神话传说，也有家族历史。就是在这样的环境中，我学会了尊重自然，珍惜粮食，也懂得了人与人之间的真诚相处。\n\n这些简单而珍贵的记忆，至今想起来仍然温暖人心。',
    type: 'image',
    mediaUrl: '/images/memories/childhood/childhood-memory.jpg',
    tags: ['童年', '农村生活', '回忆', '快乐']
  }
]; 