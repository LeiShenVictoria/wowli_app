/**
 * AI 路由选择器
 * 决定使用 Pipeline（快速）还是 Agent（复杂）模式
 */
import { dbOperations } from '../db/database.js';

/**
 * 根据请求上下文选择处理路径
 * @param {Object} request - { caption, userContext }
 * @returns {'pipeline' | 'agent'}
 */
export function selectPath(request) {
  const { caption, userContext } = request;

  // 计算各项指标
  const sensitivityScore = calculateSensitivity(caption);
  const messageType = detectMessageType(caption);
  const hasRecentConflict = checkRecentConflict(userContext.familyId);
  const hasNegativeFeedback = checkNegativeFeedback(userContext.userId);
  const conversationDepth = getConversationDepth(userContext.familyId);

  // 决策逻辑
  const needsAgent =
    sensitivityScore > 0.6 ||           // 高敏感话题
    messageType === 'complaint' ||       // 抱怨类消息
    messageType === 'conflict' ||        // 冲突迹象
    hasRecentConflict ||                 // 最近有冲突记录
    hasNegativeFeedback ||               // 用户对 AI 回复有负面反馈
    conversationDepth > 5;               // 深度对话（可能需要更多上下文）

  console.log(`📊 路径选择分析:`, {
    sensitivityScore,
    messageType,
    hasRecentConflict,
    conversationDepth,
    selected: needsAgent ? 'Agent' : 'Pipeline'
  });

  return needsAgent ? 'agent' : 'pipeline';
}

/**
 * 计算敏感度分数 (0-1)
 */
function calculateSensitivity(text) {
  const sensitivePatterns = [
    { pattern: /钱|工资|借|还钱|贵/, weight: 0.3 },
    { pattern: /结婚|对象|相亲|分手/, weight: 0.4 },
    { pattern: /身体|生病|医院|检查/, weight: 0.4 },
    { pattern: /工作|辞职|老板|加班/, weight: 0.2 },
    { pattern: /胖|瘦|减肥/, weight: 0.3 },
    { pattern: /吵|生气|不想理|烦死/, weight: 0.5 },
  ];

  let score = 0;
  for (const { pattern, weight } of sensitivePatterns) {
    if (pattern.test(text)) {
      score += weight;
    }
  }

  return Math.min(score, 1);
}

/**
 * 检测消息类型
 */
function detectMessageType(text) {
  if (/不想|烦死|累死|受不了|气死/.test(text)) {
    return 'complaint';
  }
  if (/你怎么|为什么|总是|每次都/.test(text)) {
    return 'conflict';
  }
  if (/开心|高兴|太好了|哈哈/.test(text)) {
    return 'positive';
  }
  if (/想你|想念|好久/.test(text)) {
    return 'missing';
  }
  return 'normal';
}

/**
 * 检查是否有近期冲突记录
 */
function checkRecentConflict(familyId) {
  try {
    const result = dbOperations.hasRecentConflict.get(familyId);
    return result?.count > 0;
  } catch {
    return false;
  }
}

/**
 * 检查用户是否有负面反馈历史
 */
function checkNegativeFeedback(userId) {
  try {
    const result = dbOperations.hasNegativeFeedback.get(userId);
    return result?.count > 0;
  } catch {
    return false;
  }
}

/**
 * 获取对话深度（最近1小时内的消息数）
 */
function getConversationDepth(familyId) {
  try {
    const result = dbOperations.getConversationDepth.get(familyId);
    return result?.count || 0;
  } catch {
    return 0;
  }
}
