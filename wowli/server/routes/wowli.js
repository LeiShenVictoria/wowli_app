/**
 * Wowli 宠物状态相关 API
 */
import { Router } from 'express';
import { dbOperations } from '../db/database.js';

const router = Router();

/**
 * GET /api/wowli/:familyId
 * 获取 Wowli 状态
 */
router.get('/:familyId', (req, res) => {
  try {
    const { familyId } = req.params;

    let status = dbOperations.getWowliStatus.get(familyId);

    // 如果不存在，创建默认状态
    if (!status) {
      dbOperations.updateWowliStatus.run(
        familyId,
        50,
        50,
        null,
        new Date().toISOString()
      );
      status = {
        family_id: familyId,
        happiness: 50,
        hunger: 50,
        last_fed: null,
        last_interaction: new Date().toISOString()
      };
    }

    // 计算 Wowli 的心情
    const mood = calculateMood(status);

    res.json({
      success: true,
      wowli: {
        ...status,
        mood,
        message: getWowliGreeting(mood, status)
      }
    });

  } catch (error) {
    console.error('❌ 获取 Wowli 状态失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/wowli/:familyId/feed
 * 喂养 Wowli
 */
router.post('/:familyId/feed', (req, res) => {
  try {
    const { familyId } = req.params;

    let status = dbOperations.getWowliStatus.get(familyId);

    if (!status) {
      return res.status(404).json({ error: 'Wowli 不存在' });
    }

    // 更新状态
    const newHunger = Math.max(0, status.hunger - 30);
    const newHappiness = Math.min(100, status.happiness + 10);
    const now = new Date().toISOString();

    dbOperations.updateWowliStatus.run(
      familyId,
      newHappiness,
      newHunger,
      now,
      now
    );

    res.json({
      success: true,
      wowli: {
        happiness: newHappiness,
        hunger: newHunger,
        mood: calculateMood({ happiness: newHappiness, hunger: newHunger }),
        message: "谢谢你喂我呀～Wowli 好开心！🌸"
      }
    });

  } catch (error) {
    console.error('❌ 喂养失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/wowli/:familyId/interact
 * 与 Wowli 互动（更新最后互动时间）
 */
router.post('/:familyId/interact', (req, res) => {
  try {
    const { familyId } = req.params;

    let status = dbOperations.getWowliStatus.get(familyId);

    if (!status) {
      return res.status(404).json({ error: 'Wowli 不存在' });
    }

    // 互动增加快乐度
    const newHappiness = Math.min(100, status.happiness + 5);
    const now = new Date().toISOString();

    dbOperations.updateWowliStatus.run(
      familyId,
      newHappiness,
      status.hunger,
      status.last_fed,
      now
    );

    res.json({
      success: true,
      happiness: newHappiness
    });

  } catch (error) {
    console.error('❌ 互动失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 计算 Wowli 心情
 */
function calculateMood(status) {
  const { happiness, hunger } = status;

  if (happiness >= 80 && hunger <= 30) {
    return 'very_happy';
  }
  if (happiness >= 60) {
    return 'happy';
  }
  if (hunger >= 70) {
    return 'hungry';
  }
  if (happiness <= 30) {
    return 'sad';
  }
  return 'normal';
}

/**
 * 获取 Wowli 问候语
 */
function getWowliGreeting(mood, status) {
  const greetings = {
    very_happy: [
      "今天好开心呀～有没有什么想分享的？",
      "Wowli 元气满满！一起来聊聊吧～",
      "感觉好幸福呢，谢谢你的陪伴！"
    ],
    happy: [
      "你来啦～Wowli 好高兴！",
      "今天过得怎么样呀？",
      "有什么新鲜事想告诉家人吗？"
    ],
    normal: [
      "你好呀～",
      "Wowli 在这里等你呢",
      "想聊点什么吗？"
    ],
    hungry: [
      "Wowli 的肚子咕咕叫了...",
      "好饿呀～可以喂喂我吗？",
      "如果能吃点东西就好了呢..."
    ],
    sad: [
      "Wowli 有点想你们了...",
      "好久没有互动了呢...",
      "能陪我说说话吗？"
    ]
  };

  const options = greetings[mood] || greetings.normal;
  return options[Math.floor(Math.random() * options.length)];
}

export default router;
