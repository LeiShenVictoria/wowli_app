/**
 * 每周一问 - 深度问题库
 * 分三个阶段，循序渐进加深母女沟通
 */

export const WEEKLY_QUESTIONS = {
  // 第一阶段：生活碎影（建立互动习惯）
  // 目标：从日常切入，降低开启对话的门槛
  phase1: [
    {
      id: 'p1_01',
      title: '日常味道',
      question: '拍下一样你今天吃过最开心的东西，这让你想起了什么？',
      hint: '美食总能唤起回忆',
      emoji: '🍜'
    },
    {
      id: 'p1_02',
      title: '角落美学',
      question: '拍下家里你最喜欢的一个角落，在那里你通常在想什么？',
      hint: '每个人都有自己的小天地',
      emoji: '🏠'
    },
    {
      id: 'p1_03',
      title: '随身陪伴',
      question: '拍下你包包里一件用了很久的东西，它的故事是什么？',
      hint: '旧物承载着时光',
      emoji: '👜'
    },
    {
      id: 'p1_04',
      title: '今日光影',
      question: '拍下一张窗外的风景，描述你现在的心情颜色。',
      hint: '风景如心情',
      emoji: '🌅'
    },
    {
      id: 'p1_05',
      title: '劳动的手',
      question: '拍下你正在忙碌的手（如做菜、打字），这双手今天辛苦吗？',
      hint: '双手记录生活的痕迹',
      emoji: '🤲'
    },
    {
      id: 'p1_06',
      title: '治愈小物',
      question: '拍下一个看着心情就会变好的小物件。',
      hint: '每个人都有治愈自己的方式',
      emoji: '✨'
    },
    {
      id: 'p1_07',
      title: '睡眠仪式',
      question: '拍下你床头柜上的一样东西。',
      hint: '睡前的小秘密',
      emoji: '🛏️'
    },
    {
      id: 'p1_08',
      title: '天气预报',
      question: '用一张天空的照片，代表你今天的情绪天气。',
      hint: '心情也有晴雨',
      emoji: '🌤️'
    },
    {
      id: 'p1_09',
      title: '超市清单',
      question: '拍下一样你逛超市必买的东西。',
      hint: '小习惯藏着大性格',
      emoji: '🛒'
    },
    {
      id: 'p1_10',
      title: '屏幕定格',
      question: '截图一张你最近常听的歌或看的剧，分享你的快乐。',
      hint: '音乐和故事连接我们',
      emoji: '📱'
    }
  ],

  // 第二阶段：时光足迹（回忆与成长）
  // 目标：通过旧物与象征，了解彼此错过的时光
  phase2: [
    {
      id: 'p2_01',
      title: '旧照重温',
      question: '翻拍一张你最喜欢的我的童年照片，那时你在想什么？',
      hint: '照片是时光的信使',
      emoji: '📷'
    },
    {
      id: 'p2_02',
      title: '传承之物',
      question: '拍下一件外婆留下的东西，它对你有什么意义？',
      hint: '爱在代际间流转',
      emoji: '🧶'
    },
    {
      id: 'p2_03',
      title: '变与不变',
      question: '拍下一件你穿了超过五年的衣服，为什么还留着它？',
      hint: '有些东西值得珍藏',
      emoji: '👗'
    },
    {
      id: 'p2_04',
      title: '荣誉时刻',
      question: '拍下一件让你感到自豪的奖状或作品（不论大小）。',
      hint: '每个人都有闪光的时刻',
      emoji: '🏆'
    },
    {
      id: 'p2_05',
      title: '成长印记',
      question: '拍下家里一个有我成长痕迹的地方（如身高刻度）。',
      hint: '成长的证据藏在角落',
      emoji: '📏'
    },
    {
      id: 'p2_06',
      title: '妈妈的少女时代',
      question: '拍下一样最能代表你"成为母亲前"特质的东西。',
      hint: '妈妈也曾是少女',
      emoji: '🌸'
    },
    {
      id: 'p2_07',
      title: '遗失的美好',
      question: '找一张你觉得最美时期的照片，跟我分享那时的故事。',
      hint: '美丽的不只是容颜',
      emoji: '💫'
    },
    {
      id: 'p2_08',
      title: '相似之处',
      question: '拍下我们长得最像的一个部位（如眼睛、手脚）。',
      hint: '血脉中的相似',
      emoji: '👀'
    },
    {
      id: 'p2_09',
      title: '异地连结',
      question: '如果我们不住在一起，拍下一样让你想起我的东西。',
      hint: '思念有形状',
      emoji: '💕'
    },
    {
      id: 'p2_10',
      title: '当年梦想',
      question: '找一个能代表你小时候梦想的物品。',
      hint: '梦想从未远去',
      emoji: '🌟'
    }
  ],

  // 第三阶段：内心镜像（价值观与自我）
  // 目标：讨论性格、习惯与对生活的看法
  phase3: [
    {
      id: 'p3_01',
      title: '压力出口',
      question: '当你心情不好时，你会躲在哪里？拍下那个空间。',
      hint: '每个人都需要避风港',
      emoji: '🏖️'
    },
    {
      id: 'p3_02',
      title: '疲惫信号',
      question: '拍下你累的时候最想吃或最想做的东西。',
      hint: '疲惫时的渴望最真实',
      emoji: '😴'
    },
    {
      id: 'p3_03',
      title: '独处时光',
      question: '拍下一件你独自一人时才会做的事。',
      hint: '独处见真我',
      emoji: '🧘'
    },
    {
      id: 'p3_04',
      title: '审美偏好',
      question: '拍下一朵你觉得最美的花，这代表你对美的定义吗？',
      hint: '美在每个人眼中不同',
      emoji: '🌺'
    },
    {
      id: 'p3_05',
      title: '生活哲学',
      question: '拍下一句你最近很有感触的话（书里或屏幕上）。',
      hint: '文字触动心灵',
      emoji: '📖'
    },
    {
      id: 'p3_06',
      title: '社交面具',
      question: '拍下一样你出门必带，用来给自己安全感的东西。',
      hint: '每个人都有小依赖',
      emoji: '🎭'
    },
    {
      id: 'p3_07',
      title: '反差萌',
      question: '拍下一样跟我印象中的你很不一样的东西。',
      hint: '认识彼此的另一面',
      emoji: '🎁'
    },
    {
      id: 'p3_08',
      title: '舍不得',
      question: '拍下一样已经坏了但你舍不得丢的东西。',
      hint: '舍不得里藏着故事',
      emoji: '💝'
    },
    {
      id: 'p3_09',
      title: '理想生活',
      question: '拍下一张杂志或网络上你向往的生活画面。',
      hint: '向往是前进的动力',
      emoji: '🏡'
    },
    {
      id: 'p3_10',
      title: '自律与自由',
      question: '拍下你坚持最久的一个习惯。',
      hint: '习惯塑造我们',
      emoji: '⏰'
    }
  ]
};

// 获取所有问题（扁平化）
export function getAllQuestions() {
  return [
    ...WEEKLY_QUESTIONS.phase1,
    ...WEEKLY_QUESTIONS.phase2,
    ...WEEKLY_QUESTIONS.phase3
  ];
}

// 根据周数获取问题（循环使用）
export function getQuestionByWeek(weekNumber) {
  const allQuestions = getAllQuestions();
  const index = (weekNumber - 1) % allQuestions.length;
  return allQuestions[index];
}

// 根据阶段获取问题
export function getQuestionsByPhase(phase) {
  return WEEKLY_QUESTIONS[`phase${phase}`] || [];
}

// 获取当前应该使用的阶段（根据家庭互动周数）
export function getCurrentPhase(weeksActive) {
  if (weeksActive <= 10) return 1;
  if (weeksActive <= 20) return 2;
  return 3;
}

// 获取本周问题（基于日期计算）
export function getThisWeekQuestion(familyCreatedAt) {
  const created = new Date(familyCreatedAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));

  return getQuestionByWeek(diffWeeks);
}
