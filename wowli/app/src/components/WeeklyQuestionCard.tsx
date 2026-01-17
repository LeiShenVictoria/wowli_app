/**
 * 每周一问卡片组件
 * 显示在首页和小组件中
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import COLORS from '../theme/colors';
import { SPACING, RADIUS } from '../theme/styles';
import { WeeklyQuestion, WeeklyAnswer } from '../services/weeklyApi';

interface Props {
  question: WeeklyQuestion;
  myAnswer: WeeklyAnswer | null;
  partnerAnswer: WeeklyAnswer | null;
  onAnswer: () => void;
  onViewAnswers: () => void;
}

const WeeklyQuestionCard: React.FC<Props> = ({
  question,
  myAnswer,
  partnerAnswer,
  onAnswer,
  onViewAnswers,
}) => {
  const bothAnswered = myAnswer && partnerAnswer;
  const iAnswered = !!myAnswer;

  // 计算剩余时间
  const getTimeRemaining = () => {
    const expires = new Date(question.expiresAt);
    const now = new Date();
    const diffHours = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffHours <= 0) return '已结束';
    if (diffHours < 24) return `${diffHours}小时后截止`;
    const days = Math.ceil(diffHours / 24);
    return `${days}天后截止`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5F0', '#FFF0F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* 标题区 */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>每周一问</Text>
          </View>
          <Text style={styles.timeRemaining}>{getTimeRemaining()}</Text>
        </View>

        {/* 问题内容 */}
        <View style={styles.questionArea}>
          <Text style={styles.emoji}>{question.emoji}</Text>
          <Text style={styles.title}>{question.title}</Text>
          <Text style={styles.question}>{question.question}</Text>
          <Text style={styles.hint}>{question.hint}</Text>
        </View>

        {/* 回答状态 */}
        <View style={styles.statusArea}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, myAnswer && styles.statusDotActive]}>
              <Text style={styles.statusEmoji}>{myAnswer ? '✓' : '?'}</Text>
            </View>
            <Text style={styles.statusLabel}>
              {myAnswer ? '你已回答' : '等待你的回答'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, partnerAnswer && styles.statusDotActive]}>
              <Text style={styles.statusEmoji}>{partnerAnswer ? '✓' : '?'}</Text>
            </View>
            <Text style={styles.statusLabel}>
              {partnerAnswer ? '对方已回答' : '等待对方回答'}
            </Text>
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionArea}>
          {bothAnswered ? (
            <TouchableOpacity style={styles.viewButton} onPress={onViewAnswers}>
              <Text style={styles.viewButtonText}>查看双方答案 💕</Text>
            </TouchableOpacity>
          ) : iAnswered ? (
            <View style={styles.waitingBubble}>
              <Text style={styles.waitingText}>等待对方回答中...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.answerButton} onPress={onAnswer}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.answerButtonGradient}
              >
                <Text style={styles.answerButtonText}>📸 拍照回答</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  timeRemaining: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.warmGray,
  },
  questionArea: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  question: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  hint: {
    fontSize: 12,
    color: COLORS.warmGray,
    marginTop: 8,
    fontStyle: 'italic',
  },
  statusArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.blackAlpha05,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.blackAlpha10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDotActive: {
    backgroundColor: COLORS.sage,
  },
  statusEmoji: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.warmGray,
    fontWeight: '500',
  },
  actionArea: {
    marginTop: 20,
    alignItems: 'center',
  },
  answerButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  answerButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  answerButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  viewButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  waitingBubble: {
    backgroundColor: COLORS.whiteAlpha80,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  waitingText: {
    fontSize: 13,
    color: COLORS.warmGray,
    fontWeight: '500',
  },
});

export default WeeklyQuestionCard;
