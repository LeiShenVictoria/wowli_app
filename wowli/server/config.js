/**
 * Wowli 服务器配置
 */

// Mock 模式：true = 使用假数据，false = 调用真实 OpenAI API
export const USE_MOCK = true;

// 服务器配置
export const SERVER_PORT = 3000;

// 数据库路径
export const DB_PATH = './db/wowli.sqlite';

// 上传文件路径
export const UPLOAD_PATH = './uploads';

// OpenAI API 配置（Mock 模式下不需要）
export const OPENAI_CONFIG = {
  model: 'gpt-4o',
  maxTokens: 500
};
