/**
 * Agent 模式 - 处理复杂场景（10%的请求）
 * 多轮推理 + 工具调用，更智能但成本更高
 */
import OpenAI from 'openai';
import { USE_MOCK, OPENAI_CONFIG } from '../config.js';
import { WOWLI_PERSONALITY, MOCK_RESPONSES } from './prompts.js';
import { dbOperations } from '../db/database.js';

let openai = null;

function getClient() {
  if (!openai && !USE_MOCK) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
}

// Agent 可用的工具定义（OpenAI 格式）
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'analyze_emotion',
      description: '深度分析文字中的情绪和意图',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: '要分析的文字' }
        },
        required: ['text']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_conversation_history',
      description: '获取最近的对话历史，了解上下文',
      parameters: {
        type: 'object',
        properties: {
          family_id: { type: 'string' },
          limit: { type: 'number', description: '获取条数，默认5' }
        },
        required: ['family_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'check_sensitive_topics',
      description: '检查是否涉及敏感话题',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string' }
        },
        required: ['text']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_user_preferences',
      description: '获取用户的沟通偏好',
      parameters: {
        type: 'object',
        properties: {
          user_id: { type: 'string' }
        },
        required: ['user_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'generate_response',
      description: '基于分析结果，生成最终回复',
      parameters: {
        type: 'object',
        properties: {
          tone: {
            type: 'string',
            enum: ['温暖', '轻松', '认真', '鼓励', '安慰'],
            description: '回复的语气'
          },
          key_points: {
            type: 'array',
            items: { type: 'string' },
            description: '回复要包含的要点'
          },
          avoid_topics: {
            type: 'array',
            items: { type: 'string' },
            description: '需要避免的话题'
          }
        },
        required: ['tone', 'key_points']
      }
    }
  }
];

/**
 * 执行工具调用
 */
async function executeTool(name, input, context) {
  switch (name) {
    case 'analyze_emotion': {
      // 简单的情绪分析（实际项目可接入专门的情感分析API）
      const emotions = detectEmotions(input.text);
      return {
        primary_emotion: emotions.primary,
        secondary_emotion: emotions.secondary,
        intensity: emotions.intensity,
        needs_care: emotions.needsCare
      };
    }

    case 'get_conversation_history': {
      const messages = dbOperations.getMessages.all(
        input.family_id,
        input.limit || 5
      );
      return messages.map(m => ({
        sender: m.sender_role,
        caption: m.caption,
        time: m.created_at
      }));
    }

    case 'check_sensitive_topics': {
      const sensitivePatterns = {
        health: ['身体', '生病', '医院', '检查', '吃药'],
        money: ['钱', '工资', '借', '还', '贵'],
        relationship: ['结婚', '对象', '分手', '相亲', '男朋友', '女朋友'],
        work: ['辞职', '加班', '老板', '压力', '累死']
      };

      const found = {};
      for (const [category, words] of Object.entries(sensitivePatterns)) {
        const matches = words.filter(w => input.text.includes(w));
        if (matches.length > 0) {
          found[category] = matches;
        }
      }

      return {
        hasSensitive: Object.keys(found).length > 0,
        categories: found,
        recommendation: Object.keys(found).length > 0
          ? '建议使用更温和、不带压力的语气'
          : null
      };
    }

    case 'get_user_preferences': {
      // 从用户历史反馈中学习偏好
      // 这里简化处理，实际可以做更复杂的分析
      return {
        preferred_tone: '温暖',
        avoid_directness: true,
        likes_emoji: false,
        response_length: 'short'
      };
    }

    case 'generate_response': {
      // 这个工具标记 Agent 已完成分析，准备生成最终回复
      return {
        ready: true,
        params: input
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

/**
 * 简单的情绪检测
 */
function detectEmotions(text) {
  const patterns = {
    happy: ['开心', '高兴', '太好了', '哈哈', '棒', '爱你'],
    sad: ['难过', '伤心', '哭', '不开心'],
    tired: ['累', '烦', '不想', '好困', '加班'],
    anxious: ['担心', '焦虑', '怎么办', '纠结'],
    angry: ['气死', '烦死', '生气', '不想理'],
    missing: ['想你', '想念', '想家', '好久不见']
  };

  let primary = 'neutral';
  let secondary = null;
  let intensity = 0.3;
  let needsCare = false;

  for (const [emotion, words] of Object.entries(patterns)) {
    const matches = words.filter(w => text.includes(w));
    if (matches.length > 0) {
      if (primary === 'neutral') {
        primary = emotion;
        intensity = Math.min(0.5 + matches.length * 0.2, 1);
      } else {
        secondary = emotion;
      }
    }
  }

  needsCare = ['sad', 'tired', 'anxious', 'angry'].includes(primary);

  return { primary, secondary, intensity, needsCare };
}

/**
 * Agent 模式主函数
 */
export async function runAgent(photo, caption, userContext) {
  // Mock 模式
  if (USE_MOCK) {
    await sleep(500 + Math.random() * 1000); // 模拟更长的处理时间

    // Agent 模式返回更详细的分析
    const emotions = detectEmotions(caption);

    let suggestion;
    if (emotions.needsCare) {
      suggestion = MOCK_RESPONSES.sensitive[
        Math.floor(Math.random() * MOCK_RESPONSES.sensitive.length)
      ];
    } else {
      suggestion = MOCK_RESPONSES.normal[
        Math.floor(Math.random() * MOCK_RESPONSES.normal.length)
      ];
    }

    return {
      suggestion,
      mode: 'agent-mock',
      reasoning: {
        emotion_detected: emotions.primary,
        used_tools: ['analyze_emotion', 'check_sensitive_topics', 'generate_response'],
        iterations: 2
      }
    };
  }

  // 真实 Agent 循环
  const client = getClient();

  const systemPrompt = `${WOWLI_PERSONALITY.base}

你现在处于 Agent 模式，需要处理一个复杂的沟通场景。

请使用提供的工具来：
1. 分析用户的情绪
2. 检查是否有敏感话题
3. 获取对话历史（如需要）
4. 最后生成最合适的回复

用户信息：
- 角色：${userContext.role === 'daughter' ? '女儿' : '妈妈'}
- 家庭 ID：${userContext.familyId}
- 用户 ID：${userContext.userId}`;

  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: `用户说："${caption}"\n\n请分析这个场景并生成合适的回复。`
    }
  ];

  let finalResponse = null;
  let iterations = 0;
  const maxIterations = 5;
  const usedTools = [];

  // Agent 循环
  while (!finalResponse && iterations < maxIterations) {
    iterations++;

    const response = await client.chat.completions.create({
      model: OPENAI_CONFIG.model,
      max_tokens: 1000,
      messages,
      tools: TOOLS,
      tool_choice: 'auto'
    });

    const message = response.choices[0].message;

    // 处理工具调用
    if (message.tool_calls && message.tool_calls.length > 0) {
      // 添加 assistant 消息到历史
      messages.push(message);

      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name;
        const toolInput = JSON.parse(toolCall.function.arguments);

        usedTools.push(toolName);
        console.log(`🔧 Agent 调用工具: ${toolName}`);

        const result = await executeTool(toolName, toolInput, {
          familyId: userContext.familyId,
          userId: userContext.userId
        });

        // 添加工具结果到消息历史
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        });

        // 检查是否是最终生成步骤
        if (toolName === 'generate_response' && result.ready) {
          // 继续让 AI 基于分析生成最终回复
        }
      }
    } else {
      // Agent 给出了最终回复
      finalResponse = message.content;
    }
  }

  return {
    suggestion: finalResponse || '让 Wowli 想想怎么说...',
    mode: 'agent',
    reasoning: {
      iterations,
      used_tools: usedTools
    },
    tokens: iterations * 500 // 估算
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
