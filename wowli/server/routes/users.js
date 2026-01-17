/**
 * 用户和家庭相关 API 路由
 */
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from '../db/database.js';

const router = Router();

/**
 * POST /api/users
 * 创建新用户
 */
router.post('/', (req, res) => {
  try {
    const { name, role, familyId } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        error: '缺少必要参数: name, role'
      });
    }

    if (!['daughter', 'mother'].includes(role)) {
      return res.status(400).json({
        error: 'role 必须是 daughter 或 mother'
      });
    }

    const userId = uuidv4();
    let actualFamilyId = familyId;

    // 如果没有指定 familyId，创建新家庭
    if (!actualFamilyId) {
      actualFamilyId = uuidv4();
      dbOperations.createFamily.run(actualFamilyId, `${name}的家庭`);

      // 初始化 Wowli 状态
      dbOperations.updateWowliStatus.run(
        actualFamilyId,
        50, // happiness
        50, // hunger
        null, // last_fed
        new Date().toISOString() // last_interaction
      );
    }

    dbOperations.createUser.run(
      userId,
      name,
      role,
      actualFamilyId,
      null // avatar_url
    );

    res.json({
      success: true,
      userId,
      familyId: actualFamilyId
    });

  } catch (error) {
    console.error('❌ 创建用户失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * GET /api/users/:userId
 * 获取用户信息
 */
router.get('/:userId', (req, res) => {
  try {
    const user = dbOperations.getUser.get(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ success: true, user });

  } catch (error) {
    console.error('❌ 获取用户失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * GET /api/families/:familyId/members
 * 获取家庭成员列表
 */
router.get('/families/:familyId/members', (req, res) => {
  try {
    const members = dbOperations.getFamilyMembers.all(req.params.familyId);

    res.json({
      success: true,
      members
    });

  } catch (error) {
    console.error('❌ 获取家庭成员失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/families/:familyId/join
 * 加入家庭（通过邀请码）
 */
router.post('/families/:familyId/join', (req, res) => {
  try {
    const { familyId } = req.params;
    const { name, role } = req.body;

    // 检查家庭是否存在
    const family = dbOperations.getFamily.get(familyId);
    if (!family) {
      return res.status(404).json({ error: '家庭不存在' });
    }

    // 创建用户
    const userId = uuidv4();
    dbOperations.createUser.run(userId, name, role, familyId, null);

    res.json({
      success: true,
      userId,
      familyId,
      familyName: family.name
    });

  } catch (error) {
    console.error('❌ 加入家庭失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
