/**
 * Widget 小组件数据 API
 * 为 iOS 小组件提供数据
 */
import { Router } from 'express';
import { dbOperations } from '../db/database.js';

const router = Router();

/**
 * GET /api/widget/:familyId/latest
 * 获取最新消息（供小组件展示）
 */
router.get('/:familyId/latest', (req, res) => {
  try {
    const { familyId } = req.params;
    const { userId } = req.query; // 当前用户，用于过滤显示对方的消息

    // 获取最新消息
    const messages = dbOperations.getMessages.all(familyId, 5);

    // 如果指定了 userId，过滤出其他人发的消息
    let latestFromOther = messages.find(m => m.sender_id !== userId);

    if (!latestFromOther && messages.length > 0) {
      latestFromOther = messages[0];
    }

    // 获取 Wowli 状态
    const wowliStatus = dbOperations.getWowliStatus.get(familyId);

    res.json({
      success: true,
      widget: {
        // 最新消息
        latest: latestFromOther ? {
          senderName: latestFromOther.sender_name,
          senderRole: latestFromOther.sender_role,
          caption: latestFromOther.caption,
          imagePath: latestFromOther.image_path,
          aiResponse: latestFromOther.ai_response,
          createdAt: latestFromOther.created_at
        } : null,

        // Wowli 状态
        wowli: wowliStatus ? {
          happiness: wowliStatus.happiness,
          hunger: wowliStatus.hunger,
          mood: getMoodFromStatus(wowliStatus)
        } : null,

        // 未读消息数
        unreadCount: messages.filter(m => m.sender_id !== userId).length
      }
    });

  } catch (error) {
    console.error('❌ 获取 Widget 数据失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * GET /api/widget/:familyId/summary
 * 获取今日互动摘要（供中等尺寸小组件使用）
 */
router.get('/:familyId/summary', (req, res) => {
  try {
    const { familyId } = req.params;

    const messages = dbOperations.getMessages.all(familyId, 10);

    // 统计今日互动
    const today = new Date().toISOString().split('T')[0];
    const todayMessages = messages.filter(m =>
      m.created_at.startsWith(today)
    );

    res.json({
      success: true,
      summary: {
        todayCount: todayMessages.length,
        totalPhotos: messages.filter(m => m.image_path).length,
        lastInteraction: messages[0]?.created_at || null,
        streak: calculateStreak(messages) // 连续互动天数
      }
    });

  } catch (error) {
    console.error('❌ 获取摘要失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

function getMoodFromStatus(status) {
  if (status.happiness >= 80) return 'very_happy';
  if (status.happiness >= 60) return 'happy';
  if (status.hunger >= 70) return 'hungry';
  if (status.happiness <= 30) return 'sad';
  return 'normal';
}

function calculateStreak(messages) {
  if (messages.length === 0) return 0;

  let streak = 1;
  let currentDate = new Date(messages[0].created_at);
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 1; i < messages.length; i++) {
    const msgDate = new Date(messages[i].created_at);
    msgDate.setHours(0, 0, 0, 0);

    const diffDays = (currentDate - msgDate) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
      currentDate = msgDate;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
}

export default router;
