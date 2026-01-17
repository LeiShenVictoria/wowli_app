/**
 * Wowli 类型定义
 * 基于 wowliUI/types.ts 转换
 */

export type Role = 'daughter' | 'mother';

export interface User {
  id: string;
  role: Role;
  name: string;
  familyId: string;
  avatarUrl?: string;
}

export interface WowliState {
  hunger: number; // 0-100
  happiness: number; // 0-100
  streak: number; // 连续互动天数
  level: number;
  mood: 'happy' | 'very_happy' | 'neutral' | 'worried' | 'sad' | 'hungry' | 'thinking';
}

export interface PhotoMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  imageUrl?: string;
  imagePath?: string;
  caption: string;
  reply?: string;
  aiResponse?: string;
  timestamp: string;
  stickers: string[];
}

export interface AICoachResponse {
  sentiment: string;
  topicSuggestion: string;
  samplePhrase: string;
  stickers: string[];
  mode: 'pipeline' | 'agent' | 'pipeline-mock' | 'agent-mock';
}

export interface Family {
  id: string;
  name: string;
  members: User[];
}

// 导航类型
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Camera: undefined;
  Reply: { messageId: string };
  WowliSpace: undefined;
  Settings: undefined;
  WidgetGuide: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Space: undefined;
};
