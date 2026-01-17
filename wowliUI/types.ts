
export type Role = 'daughter' | 'mom';

export interface User {
  id: string;
  role: Role;
  name: string;
  partnerId: string;
}

export interface WowliState {
  hunger: number; // 0-100
  streak: number;
  level: number;
  mood: 'happy' | 'neutral' | 'worried' | 'sad' | 'hungry';
}

export interface PhotoMessage {
  id: string;
  senderId: string;
  imageUrl: string;
  caption: string;
  reply?: string;
  timestamp: string;
  stickers: string[];
}

export interface AICoachResponse {
  sentiment: string;
  topicSuggestion: string;
  samplePhrase: string;
  stickers: string[];
}
