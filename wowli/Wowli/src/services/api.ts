/**
 * API 服务 - 替换 Gemini，调用本地后端
 */

import { io, Socket } from 'socket.io-client';
import { PhotoMessage, AICoachResponse, User, WowliState } from '../types';

// 开发时使用本地 IP，之后可配置
// 请替换为你 Mac 的实际 IP 地址
const API_BASE = __DEV__
  ? 'http://192.168.1.100:3000'  // ⚠️ 替换为你的 Mac IP
  : 'https://api.wowli.app';

let socket: Socket | null = null;

/**
 * 初始化 Socket 连接
 */
export function initSocket(familyId: string, onMessage: (msg: PhotoMessage) => void) {
  if (socket) {
    socket.disconnect();
  }

  socket = io(API_BASE);

  socket.on('connect', () => {
    console.log('📱 Socket 已连接');
    socket?.emit('join_family', familyId);
  });

  socket.on('message_received', (message: PhotoMessage) => {
    console.log('💌 收到新消息');
    onMessage(message);
  });

  socket.on('disconnect', () => {
    console.log('📴 Socket 已断开');
  });

  return socket;
}

/**
 * 断开 Socket 连接
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * 发送新消息（照片+文字）
 */
export async function sendMessage(
  familyId: string,
  senderId: string,
  caption: string,
  photoBase64?: string
): Promise<{ messageId: string; aiResponse: string; mode: string }> {
  const response = await fetch(`${API_BASE}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      familyId,
      senderId,
      caption,
      photo: photoBase64 ? { base64: photoBase64 } : undefined
    })
  });

  if (!response.ok) {
    throw new Error('发送失败');
  }

  const data = await response.json();

  // 通知其他家庭成员
  if (socket) {
    socket.emit('new_message', { familyId, message: data });
  }

  return data;
}

/**
 * 获取消息列表
 */
export async function getMessages(familyId: string, limit = 20): Promise<PhotoMessage[]> {
  const response = await fetch(`${API_BASE}/api/messages/${familyId}?limit=${limit}`);
  const data = await response.json();
  return data.messages || [];
}

/**
 * 分析照片获取 AI 建议（替代 Gemini）
 */
export async function analyzePhotoForCoaching(
  familyId: string,
  senderId: string,
  imageBase64: string,
  caption: string
): Promise<AICoachResponse> {
  const response = await fetch(`${API_BASE}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      familyId,
      senderId,
      caption,
      photo: { base64: imageBase64 }
    })
  });

  if (!response.ok) {
    // 返回默认回复
    return {
      sentiment: '妈妈似乎想念你了，在分享她的生活点滴。',
      topicSuggestion: '花点时间注意妈妈在分享什么，回复一些温暖的话语吧。',
      samplePhrase: '妈，看到你那边一切都好我就放心了，我也很想你！',
      stickers: ['❤️', '✨'],
      mode: 'pipeline-mock'
    };
  }

  const data = await response.json();

  return {
    sentiment: data.aiResponse,
    topicSuggestion: '',
    samplePhrase: data.aiResponse,
    stickers: ['❤️'],
    mode: data.mode
  };
}

/**
 * 创建用户
 */
export async function createUser(
  name: string,
  role: 'daughter' | 'mother',
  familyId?: string
): Promise<{ userId: string; familyId: string }> {
  const response = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role, familyId })
  });

  if (!response.ok) {
    throw new Error('创建用户失败');
  }

  return response.json();
}

/**
 * 加入家庭
 */
export async function joinFamily(
  familyId: string,
  name: string,
  role: 'daughter' | 'mother'
): Promise<{ userId: string; familyId: string }> {
  const response = await fetch(`${API_BASE}/api/users/families/${familyId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role })
  });

  if (!response.ok) {
    throw new Error('加入家庭失败');
  }

  return response.json();
}

/**
 * 获取 Wowli 状态
 */
export async function getWowliStatus(familyId: string): Promise<WowliState & { message: string }> {
  const response = await fetch(`${API_BASE}/api/wowli/${familyId}`);
  const data = await response.json();

  return {
    hunger: data.wowli?.hunger || 50,
    happiness: data.wowli?.happiness || 50,
    streak: 0,
    level: Math.floor((data.wowli?.happiness || 50) / 10) + 1,
    mood: data.wowli?.mood || 'happy',
    message: data.wowli?.message || 'Wowli 在等你呢~'
  };
}

/**
 * 喂养 Wowli
 */
export async function feedWowli(familyId: string): Promise<WowliState> {
  const response = await fetch(`${API_BASE}/api/wowli/${familyId}/feed`, {
    method: 'POST'
  });
  const data = await response.json();

  return {
    hunger: data.wowli?.hunger || 50,
    happiness: data.wowli?.happiness || 50,
    streak: 0,
    level: Math.floor((data.wowli?.happiness || 50) / 10) + 1,
    mood: data.wowli?.mood || 'happy'
  };
}

/**
 * 提交反馈
 */
export async function submitFeedback(
  messageId: string,
  userId: string,
  rating: number,
  usedSuggestion: boolean
): Promise<void> {
  await fetch(`${API_BASE}/api/messages/${messageId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, rating, usedSuggestion })
  });
}

/**
 * 获取 Widget 数据
 */
export async function getWidgetData(familyId: string, userId: string) {
  const response = await fetch(`${API_BASE}/api/widget/${familyId}/latest?userId=${userId}`);
  return response.json();
}

/**
 * 健康检查
 */
export async function healthCheck(): Promise<{ status: string; mode: string }> {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    return response.json();
  } catch {
    return { status: 'error', mode: 'offline' };
  }
}
