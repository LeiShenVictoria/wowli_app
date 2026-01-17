/**
 * Wowli App 主入口
 * 融合 wowliUI 设计 + 本地后端架构
 */

import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  HomeScreen,
  CameraScreen,
  ReplyScreen,
  WowliSpaceScreen,
  OnboardingScreen,
  SettingsScreen,
} from './screens';

import {
  initSocket,
  disconnectSocket,
  sendMessage,
  getMessages,
  getWowliStatus,
  feedWowli,
} from './services/api';

import { User, WowliState, PhotoMessage, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Mock 历史数据（开发用）
const MOCK_HISTORY: PhotoMessage[] = [
  {
    id: '1',
    senderId: 'mom_id',
    senderName: '妈妈',
    senderRole: 'mother',
    imageUrl: 'https://picsum.photos/seed/garden/800/800',
    caption: '今天的阳光很好 ☀️，想和你一起散步',
    reply: '妈，我也想你！接你回家 ❤️',
    timestamp: new Date().toISOString(),
    stickers: ['🌸'],
  },
  {
    id: '2',
    senderId: 'mom_id',
    senderName: '妈妈',
    senderRole: 'mother',
    imageUrl: 'https://picsum.photos/seed/flower/800/800',
    caption: '夏日花开，想起了你小时候样子',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    stickers: ['✨'],
  },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wowli, setWowli] = useState<WowliState>({
    hunger: 72,
    happiness: 80,
    streak: 12,
    level: 12,
    mood: 'happy',
  });
  const [history, setHistory] = useState<PhotoMessage[]>(MOCK_HISTORY);

  // 初始化 Socket 连接
  useEffect(() => {
    if (user) {
      initSocket(user.familyId, (newMsg) => {
        setHistory((prev) => [newMsg, ...prev]);
      });

      // 加载历史消息
      loadHistory();
      // 加载 Wowli 状态
      loadWowliStatus();
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  // Wowli 饥饿度随时间下降
  useEffect(() => {
    const timer = setInterval(() => {
      setWowli((prev) => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1),
        mood: prev.hunger <= 20 ? 'hungry' : prev.mood,
      }));
    }, 1000 * 60 * 10); // 每10分钟

    return () => clearInterval(timer);
  }, []);

  const loadHistory = async () => {
    if (!user) return;
    try {
      const messages = await getMessages(user.familyId);
      if (messages.length > 0) {
        setHistory(messages);
      }
    } catch (error) {
      console.error('加载历史失败:', error);
    }
  };

  const loadWowliStatus = async () => {
    if (!user) return;
    try {
      const status = await getWowliStatus(user.familyId);
      setWowli((prev) => ({
        ...prev,
        hunger: status.hunger,
        happiness: status.happiness,
        mood: status.mood,
        level: status.level,
      }));
    } catch (error) {
      console.error('加载 Wowli 状态失败:', error);
    }
  };

  // 发布照片
  const handlePostPhoto = useCallback(
    async (imageBase64: string, caption: string) => {
      if (!user) return;

      try {
        const result = await sendMessage(
          user.familyId,
          user.id,
          caption,
          imageBase64
        );

        const newMsg: PhotoMessage = {
          id: result.messageId,
          senderId: user.id,
          senderName: user.name,
          senderRole: user.role,
          imageUrl: imageBase64,
          caption,
          aiResponse: result.aiResponse,
          timestamp: new Date().toISOString(),
          stickers: [],
        };

        setHistory((prev) => [newMsg, ...prev]);
        setWowli((prev) => ({
          ...prev,
          hunger: Math.min(100, prev.hunger + 30),
          happiness: Math.min(100, prev.happiness + 10),
        }));
      } catch (error) {
        console.error('发送失败:', error);
      }
    },
    [user]
  );

  // 回复消息
  const handleReply = useCallback(
    (msgId: string, replyText: string) => {
      setHistory((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, reply: replyText } : m))
      );
      setWowli((prev) => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 20),
        happiness: Math.min(100, prev.happiness + 5),
      }));
    },
    []
  );

  // 喂养 Wowli
  const handleFeedWowli = useCallback(async () => {
    if (!user) return;
    try {
      const newStatus = await feedWowli(user.familyId);
      setWowli((prev) => ({
        ...prev,
        hunger: newStatus.hunger,
        happiness: newStatus.happiness,
        mood: newStatus.mood,
      }));
    } catch (error) {
      console.error('喂养失败:', error);
    }
  }, [user]);

  // 完成引导
  const handleOnboardingComplete = useCallback((newUser: User) => {
    setUser(newUser);
  }, []);

  // 登出
  const handleLogout = useCallback(() => {
    setUser(null);
    setHistory(MOCK_HISTORY);
    disconnectSocket();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {!user ? (
            // 未登录：显示引导页
            <Stack.Screen name="Onboarding">
              {() => <OnboardingScreen onComplete={handleOnboardingComplete} />}
            </Stack.Screen>
          ) : (
            // 已登录：显示主应用
            <>
              <Stack.Screen name="Main">
                {() => (
                  <HomeScreen user={user} wowli={wowli} history={history} />
                )}
              </Stack.Screen>

              <Stack.Screen name="Camera">
                {() => <CameraScreen onPost={handlePostPhoto} />}
              </Stack.Screen>

              <Stack.Screen name="Reply">
                {() => (
                  <ReplyScreen
                    user={user}
                    history={history}
                    onReply={handleReply}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="WowliSpace">
                {() => (
                  <WowliSpaceScreen wowli={wowli} onFeed={handleFeedWowli} />
                )}
              </Stack.Screen>

              <Stack.Screen name="Settings">
                {() => <SettingsScreen user={user} onLogout={handleLogout} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
