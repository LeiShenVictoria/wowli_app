/**
 * 每周一问 API 路由
 */
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from '../db/database.js';
import {
  getThisWeekQuestion,
  getQuestionByWeek,
  getAllQuestions,
  getCurrentPhase
} from '../data/weeklyQuestions.js';

const router = Router();

/**
 * GET /api/weekly/:familyId/current
 * 获取本周问题
 */
router.get('/:familyId/current', (req, res) => {
  try {
    const { familyId } = req.params;

    // 获取家庭信息
    const family = dbOperations.getFamily.get(familyId);
    if (!family) {
      return res.status(404).json({ error: '家庭不存在' });
    }

    // 计算当前周数
    const created = new Date(family.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const weekNumber = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)) || 1;

    // 获取本周问题
    const question = getQuestionByWeek(weekNumber);

    // 获取本周回答情况
    const answers = getWeeklyAnswers(familyId, question.id);

    // 计算周日到期时间
    const nextSunday = getNextSunday();

    res.json({
      success: true,
      weekNumber,
      phase: getCurrentPhase(weekNumber),
      question: {
        ...question,
        expiresAt: nextSunday.toISOString()
      },
      answers: {
        daughter: answers.find(a => a.role === 'daughter') || null,
        mother: answers.find(a => a.role === 'mother') || null
      },
      bothAnswered: answers.length >= 2
    });

  } catch (error) {
    console.error('❌ 获取本周问题失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/weekly/:familyId/answer
 * 提交每周一问的回答
 */
router.post('/:familyId/answer', async (req, res) => {
  try {
    const { familyId } = req.params;
    const { userId, questionId, imageBase64, caption } = req.body;

    if (!userId || !questionId || !caption) {
      return res.status(400).json({
        error: '缺少必要参数: userId, questionId, caption'
      });
    }

    // 获取用户信息
    const user = dbOperations.getUser.get(userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 检查是否已回答
    const existingAnswer = getWeeklyAnswer(familyId, questionId, userId);
    if (existingAnswer) {
      return res.status(400).json({ error: '你已经回答过本周问题了' });
    }

    // 保存回答
    const answerId = uuidv4();
    saveWeeklyAnswer({
      id: answerId,
      familyId,
      userId,
      questionId,
      imagePath: imageBase64 ? 'base64_stored' : null,
      caption,
      role: user.role
    });

    // 检查双方是否都已回答
    const allAnswers = getWeeklyAnswers(familyId, questionId);
    const bothAnswered = allAnswers.length >= 2;

    // 如果双方都回答了，生成 AI 情感桥接
    let aiBridge = null;
    if (bothAnswered) {
      aiBridge = generateEmotionalBridge(allAnswers);
    }

    // 通知另一方（通过 Socket.IO）
    const io = req.app.get('io');
    if (io) {
      io.to(familyId).emit('weekly_answer', {
        questionId,
        answerId,
        userId,
        role: user.role,
        bothAnswered,
        aiBridge
      });
    }

    res.json({
      success: true,
      answerId,
      bothAnswered,
      aiBridge
    });

  } catch (error) {
    console.error('❌ 提交回答失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * GET /api/weekly/:familyId/history
 * 获取历史每周一问记录
 */
router.get('/:familyId/history', (req, res) => {
  try {
    const { familyId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const history = getWeeklyHistory(familyId, limit);

    res.json({
      success: true,
      history
    });

  } catch (error) {
    console.error('❌ 获取历史记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * GET /api/weekly/questions
 * 获取所有问题（用于预览/管理）
 */
router.get('/questions', (req, res) => {
  const questions = getAllQuestions();
  res.json({
    success: true,
    total: questions.length,
    questions
  });
});

// ============ 辅助函数 ============

// 获取下一个周日
function getNextSunday() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(0, 0, 0, 0);
  return nextSunday;
}

// 临时存储（实际应该在数据库中）
const weeklyAnswersStore = new Map();

function saveWeeklyAnswer(answer) {
  const key = `${answer.familyId}_${answer.questionId}`;
  if (!weeklyAnswersStore.has(key)) {
    weeklyAnswersStore.set(key, []);
  }
  weeklyAnswersStore.get(key).push({
    ...answer,
    createdAt: new Date().toISOString()
  });
}

function getWeeklyAnswers(familyId, questionId) {
  const key = `${familyId}_${questionId}`;
  return weeklyAnswersStore.get(key) || [];
}

function getWeeklyAnswer(familyId, questionId, userId) {
  const answers = getWeeklyAnswers(familyId, questionId);
  return answers.find(a => a.userId === userId);
}

function getWeeklyHistory(familyId, limit) {
  const history = [];
  for (const [key, answers] of weeklyAnswersStore.entries()) {
    if (key.startsWith(familyId)) {
      const questionId = key.split('_')[1];
      history.push({
        questionId,
        answers,
        completedAt: answers.length >= 2 ? answers[1].createdAt : null
      });
    }
  }
  return history.slice(0, limit);
}

// 生成情感桥接（Mock 版本）
function generateEmotionalBridge(answers) {
  const bridges = [
    "Wowli 发现你们都在用自己的方式表达爱呢～",
    "两份回答里，Wowli 感受到了跨越时空的默契 💕",
    "原来你们的心，一直都是相连的呀～",
    "不同的视角，同样的温暖。这就是家的感觉呢～",
    "Wowli 好感动！你们都在认真回答呢～"
  ];

  return bridges[Math.floor(Math.random() * bridges.length)];
}

export default router;
