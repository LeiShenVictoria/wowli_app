/**
 * Pipeline 模式 - 快速处理简单场景（90%的请求）
 * 单次 API 调用，低延迟，低成本
 */
import OpenAI from 'openai';
import { USE_MOCK, OPENAI_CONFIG } from '../config.js';
import { WOWLI_PERSONALITY, selectMockResponse } from './prompts.js';

let openai = null;

// 懒加载 OpenAI 客户端
function getClient() {
  if (!openai && !USE_MOCK) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
}

/**
 * Pipeline 处理流程
 * @param {Object} photo - 照片信息 { base64?, path?, description? }
 * @param {string} caption - 用户附言
 * @param {Object} userContext - 用户上下文 { userId, role, familyId }
 * @returns {Object} { suggestion, mode, tokens? }
 */
export async function runPipeline(photo, caption, userContext) {
  // Mock 模式：直接返回预设回复
  if (USE_MOCK) {
    // 模拟一点延迟，让体验更真实
    await sleep(300 + Math.random() * 500);

    return {
      suggestion: selectMockResponse(caption),
      mode: 'pipeline-mock'
    };
  }

  // 真实 API 调用
  const client = getClient();

  const systemPrompt = `${WOWLI_PERSONALITY.base}

${WOWLI_PERSONALITY.scenarios.newPhoto}

当前用户：${userContext.role === 'daughter' ? '女儿' : '妈妈'}`;

  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: buildUserContent(photo, caption)
    }
  ];

  const response = await client.chat.completions.create({
    model: OPENAI_CONFIG.model,
    max_tokens: OPENAI_CONFIG.maxTokens,
    messages
  });

  return {
    suggestion: response.choices[0].message.content,
    mode: 'pipeline',
    tokens: response.usage?.completion_tokens
  };
}

/**
 * 构建用户消息内容（支持图片）
 */
function buildUserContent(photo, caption) {
  const content = [];

  // 如果有图片 base64，添加图片
  if (photo?.base64) {
    content.push({
      type: 'image_url',
      image_url: {
        url: `data:${photo.mediaType || 'image/jpeg'};base64,${photo.base64}`
      }
    });
  }

  // 添加文字
  content.push({
    type: 'text',
    text: `用户说："${caption}"\n\n请生成一条温暖的回复建议（50字以内）。`
  });

  return content;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
