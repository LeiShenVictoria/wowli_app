/**
 * SQLite 数据库初始化和操作
 */
import Database from 'better-sqlite3';
import { DB_PATH } from '../config.js';
import { mkdirSync } from 'fs';

// 确保 db 目录存在
mkdirSync('./db', { recursive: true });

const db = new Database(DB_PATH);

// 初始化表结构
db.exec(`
  -- 用户表
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT CHECK(role IN ('daughter', 'mother')) NOT NULL,
    family_id TEXT NOT NULL,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 家庭表
  CREATE TABLE IF NOT EXISTS families (
    id TEXT PRIMARY KEY,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 照片/消息表
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    image_path TEXT,
    caption TEXT,
    ai_response TEXT,
    ai_mode TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  );

  -- 反馈表（用于 AI 学习）
  CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    used_suggestion INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id)
  );

  -- Wowli 状态表（喂养、心情等）
  CREATE TABLE IF NOT EXISTS wowli_status (
    family_id TEXT PRIMARY KEY,
    happiness INTEGER DEFAULT 50,
    hunger INTEGER DEFAULT 50,
    last_fed DATETIME,
    last_interaction DATETIME,
    FOREIGN KEY (family_id) REFERENCES families(id)
  );
`);

// 数据库操作函数
export const dbOperations = {
  // 用户相关
  createUser: db.prepare(`
    INSERT INTO users (id, name, role, family_id, avatar_url)
    VALUES (?, ?, ?, ?, ?)
  `),

  getUser: db.prepare(`SELECT * FROM users WHERE id = ?`),

  getFamilyMembers: db.prepare(`SELECT * FROM users WHERE family_id = ?`),

  // 家庭相关
  createFamily: db.prepare(`INSERT INTO families (id, name) VALUES (?, ?)`),

  getFamily: db.prepare(`SELECT * FROM families WHERE id = ?`),

  // 消息相关
  createMessage: db.prepare(`
    INSERT INTO messages (id, family_id, sender_id, image_path, caption, ai_response, ai_mode)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  getMessages: db.prepare(`
    SELECT m.*, u.name as sender_name, u.role as sender_role
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.family_id = ?
    ORDER BY m.created_at DESC
    LIMIT ?
  `),

  getMessage: db.prepare(`SELECT * FROM messages WHERE id = ?`),

  // 反馈相关
  createFeedback: db.prepare(`
    INSERT INTO feedback (id, message_id, user_id, rating, used_suggestion)
    VALUES (?, ?, ?, ?, ?)
  `),

  hasNegativeFeedback: db.prepare(`
    SELECT COUNT(*) as count FROM feedback
    WHERE user_id = ? AND rating <= 2
    AND created_at > datetime('now', '-7 days')
  `),

  // Wowli 状态
  getWowliStatus: db.prepare(`SELECT * FROM wowli_status WHERE family_id = ?`),

  updateWowliStatus: db.prepare(`
    INSERT OR REPLACE INTO wowli_status (family_id, happiness, hunger, last_fed, last_interaction)
    VALUES (?, ?, ?, ?, ?)
  `),

  // 用于 Agent 决策的上下文查询
  hasRecentConflict: db.prepare(`
    SELECT COUNT(*) as count FROM messages
    WHERE family_id = ?
    AND ai_mode = 'agent'
    AND created_at > datetime('now', '-24 hours')
  `),

  getConversationDepth: db.prepare(`
    SELECT COUNT(*) as count FROM messages
    WHERE family_id = ?
    AND created_at > datetime('now', '-1 hours')
  `)
};

export default db;
