/**
 * AI 处理统一入口
 * 混合模式：自动选择 Pipeline 或 Agent
 */
import { selectPath } from './router.js';
import { runPipeline } from './pipeline.js';
import { runAgent } from './agent.js';

/**
 * 处理用户消息，返回 AI 回复
 *
 * @param {Object} photo - 照片信息 { base64?, path?, description? }
 * @param {string} caption - 用户附言
 * @param {Object} userContext - { userId, role, familyId }
 * @returns {Object} { suggestion, mode, reasoning?, tokens? }
 */
export async function processMessage(photo, caption, userContext) {
  const startTime = Date.now();

  // 1. 选择处理路径
  const path = selectPath({ caption, userContext });

  console.log(`🎯 AI 处理开始 [${path.toUpperCase()}]`);

  // 2. 执行对应模式
  let result;
  if (path === 'pipeline') {
    result = await runPipeline(photo, caption, userContext);
  } else {
    result = await runAgent(photo, caption, userContext);
  }

  const duration = Date.now() - startTime;
  console.log(`✅ AI 处理完成 [${duration}ms]`, result.mode);

  return {
    ...result,
    duration
  };
}

/**
 * 强制使用特定模式（用于测试）
 */
export async function processWithMode(mode, photo, caption, userContext) {
  if (mode === 'pipeline') {
    return await runPipeline(photo, caption, userContext);
  } else {
    return await runAgent(photo, caption, userContext);
  }
}

// 导出子模块供直接使用
export { runPipeline } from './pipeline.js';
export { runAgent } from './agent.js';
export { selectPath } from './router.js';
