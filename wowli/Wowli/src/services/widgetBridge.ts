/**
 * Widget 数据桥接
 * 用于 React Native 与 iOS Widget 共享数据
 * 支持每周一问功能
 */

import SharedGroupPreferences from 'react-native-shared-group-preferences';

const APP_GROUP = 'group.com.wowli.shared';

interface WidgetData {
  // 最新消息
  senderName: string;
  caption: string;
  hasNewMessage: boolean;

  // 每周一问
  weeklyQuestion?: string;
  weeklyTitle?: string;
  weeklyEmoji?: string;
  weeklyHint?: string;
  hasAnswered?: boolean;
  partnerHasAnswered?: boolean;

  // Wowli 状态
  wowliMessage: string;
  wowliMood: string;

  timestamp?: number;
}

/**
 * 更新 Widget 显示的数据
 */
export async function updateWidgetData(data: WidgetData): Promise<void> {
  try {
    await SharedGroupPreferences.setItem(
      'widgetData',
      {
        ...data,
        timestamp: Date.now(),
      },
      APP_GROUP
    );

    console.log('✅ Widget 数据已更新');
  } catch (error) {
    console.error('❌ Widget 更新失败:', error);
  }
}

/**
 * 更新每周一问数据到 Widget
 */
export async function updateWeeklyQuestionWidget(data: {
  question: string;
  title: string;
  emoji: string;
  hint: string;
  hasAnswered: boolean;
  partnerHasAnswered: boolean;
}): Promise<void> {
  try {
    const current = await SharedGroupPreferences.getItem('widgetData', APP_GROUP) || {};

    let wowliMessage = '本周话题等你来答~';
    if (data.hasAnswered && data.partnerHasAnswered) {
      wowliMessage = '太棒了！双方都回答啦 💕';
    } else if (data.hasAnswered) {
      wowliMessage = '等待对方的回答~';
    } else if (data.partnerHasAnswered) {
      wowliMessage = '对方已回答，快来看看吧！';
    }

    await SharedGroupPreferences.setItem(
      'widgetData',
      {
        ...current,
        weeklyQuestion: data.question,
        weeklyTitle: data.title,
        weeklyEmoji: data.emoji,
        weeklyHint: data.hint,
        hasAnswered: data.hasAnswered,
        partnerHasAnswered: data.partnerHasAnswered,
        wowliMessage,
        wowliMood: data.hasAnswered && data.partnerHasAnswered ? 'very_happy' : 'happy',
        timestamp: Date.now(),
      },
      APP_GROUP
    );

    console.log('✅ 每周一问 Widget 数据已更新');
  } catch (error) {
    console.error('❌ 每周一问 Widget 更新失败:', error);
  }
}

/**
 * 清除 Widget 新消息提示
 */
export async function clearWidgetNewMessage(): Promise<void> {
  try {
    const current = await SharedGroupPreferences.getItem('widgetData', APP_GROUP);
    if (current) {
      await SharedGroupPreferences.setItem(
        'widgetData',
        {
          ...current,
          hasNewMessage: false,
        },
        APP_GROUP
      );
    }
  } catch (error) {
    console.error('❌ 清除新消息标记失败:', error);
  }
}

/**
 * 获取当前 Widget 数据（用于调试）
 */
export async function getWidgetData(): Promise<WidgetData | null> {
  try {
    const data = await SharedGroupPreferences.getItem('widgetData', APP_GROUP);
    return data as WidgetData;
  } catch (error) {
    console.error('❌ 获取 Widget 数据失败:', error);
    return null;
  }
}
