/**
 * 消息相关 API 路由
 */
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from '../db/database.js';
import { processMessage } from '../ai/index.js';

const router = Router();

/**
 * POST /api/messages
 * 发送新消息（照片+文字）
 */
router.post('/', async (req, res) => {
  try {
    const { familyId, senderId, caption, photo } = req.body;

    if (!familyId || !senderId || !caption) {
      return res.status(400).json({
        error: '缺少必要参数: familyId, senderId, caption'
      });
    }

    // 获取发送者信息
    const sender = dbOperations.getUser.get(senderId);
    if (!sender) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 调用 AI 处理
    const aiResult = await processMessage(
      photo || {},
      caption,
      {
        userId: senderId,
        role: sender.role,
        familyId
      }
    );

    // 保存消息到数据库
    const messageId = uuidv4();
    dbOperations.createMessage.run(
      messageId,
      familyId,
      senderId,
      photo?.path || null,
      caption,
      aiResult.suggestion,
      aiResult.mode
    );

    res.json({
      success: true,
      messageId,
      aiResponse: aiResult.suggestion,
      mode: aiResult.mode,
      duration: aiResult.duration
    });

  } catch (error) {
    console.error('❌ 发送消息失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * GET /api/messages/:familyId
 * 获取家庭消息列表
 */
router.get('/:familyId', (req, res) => {
  try {
    const { familyId } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    const messages = dbOperations.getMessages.all(familyId, limit);

    res.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('❌ 获取消息失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/messages/:messageId/feedback
 * 提交消息反馈（用于 AI 改进）
 */
router.post('/:messageId/feedback', (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId, rating, usedSuggestion } = req.body;

    const feedbackId = uuidv4();
    dbOperations.createFeedback.run(
      feedbackId,
      messageId,
      userId,
      rating,
      usedSuggestion ? 1 : 0
    );

    res.json({ success: true, feedbackId });

  } catch (error) {
    console.error('❌ 提交反馈失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
