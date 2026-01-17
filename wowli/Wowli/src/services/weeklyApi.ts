/**
 * 每周一问 API 服务
 */

const API_BASE = __DEV__
  ? 'http://192.168.1.100:3000'  // ⚠️ 替换为你的 Mac IP
  : 'https://api.wowli.app';

export interface WeeklyQuestion {
  id: string;
  title: string;
  question: string;
  hint: string;
  emoji: string;
  expiresAt: string;
}

export interface WeeklyAnswer {
  id: string;
  userId: string;
  role: 'daughter' | 'mother';
  caption: string;
  imageUrl?: string;
  createdAt: string;
}

export interface WeeklyData {
  weekNumber: number;
  phase: number;
  question: WeeklyQuestion;
  answers: {
    daughter: WeeklyAnswer | null;
    mother: WeeklyAnswer | null;
  };
  bothAnswered: boolean;
}

/**
 * 获取本周问题
 */
export async function getWeeklyQuestion(familyId: string): Promise<WeeklyData> {
  const response = await fetch(`${API_BASE}/api/weekly/${familyId}/current`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || '获取失败');
  }

  return data;
}

/**
 * 提交每周一问回答
 */
export async function submitWeeklyAnswer(
  familyId: string,
  userId: string,
  questionId: string,
  caption: string,
  imageBase64?: string
): Promise<{ answerId: string; bothAnswered: boolean; aiBridge?: string }> {
  const response = await fetch(`${API_BASE}/api/weekly/${familyId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      questionId,
      caption,
      imageBase64,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || '提交失败');
  }

  return data;
}

/**
 * 获取历史每周一问
 */
export async function getWeeklyHistory(
  familyId: string,
  limit = 10
): Promise<{ history: any[] }> {
  const response = await fetch(
    `${API_BASE}/api/weekly/${familyId}/history?limit=${limit}`
  );
  return response.json();
}
