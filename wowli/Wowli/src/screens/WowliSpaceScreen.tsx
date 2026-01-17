/**
 * Wowli 空间 - 宠物状态和成就
 * 从 wowliUI/pages/WowliSpace.tsx 转换
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import WowliPet from '../components/WowliPet';
import COLORS from '../theme/colors';
import { SPACING, RADIUS, FONT_SIZE } from '../theme/styles';
import { RootStackParamList, WowliState } from '../types';

interface Props {
  wowli: WowliState;
  onFeed?: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ACHIEVEMENTS = [
  { icon: '📸', label: '分享达人', color: '#FED7AA', textColor: '#FB923C', unlocked: true },
  { icon: '🌙', label: '晚安天使', color: '#BFDBFE', textColor: '#3B82F6', unlocked: true },
  { icon: '❤️', label: '暖心陪伴', color: '#FBCFE8', textColor: '#EC4899', unlocked: true },
  { icon: '🔒', label: '待解锁', color: '#F1F5F9', textColor: '#CBD5E1', unlocked: false },
];

const WowliSpaceScreen: React.FC<Props> = ({ wowli, onFeed }) => {
  const navigation = useNavigation<NavigationProp>();

  const getMoodText = () => {
    if (wowli.hunger > 50) {
      return 'Wowli 感觉很有活力！';
    }
    return 'Wowli 似乎有点饿了...';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wowli 空间</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 成长树指示 */}
        <View style={styles.growthSection}>
          <View style={styles.growthBadge}>
            <Text style={styles.growthBadgeText}>成长树</Text>
          </View>
          <Text style={styles.growthArrow}>↑</Text>
          <View style={styles.levelPill}>
            <Text style={styles.levelText}>亲密度等级：{wowli.level}</Text>
          </View>
        </View>

        {/* Wowli 主体展示 */}
        <View style={styles.petSection}>
          {/* 装饰圆环 */}
          <View style={styles.decorativeRings}>
            <View style={[styles.ring, styles.ringInner]} />
            <View style={[styles.ring, styles.ringOuter]} />
          </View>

          <WowliPet
            size="lg"
            mood={wowli.hunger < 20 ? 'hungry' : 'happy'}
          />

          {/* 状态文字 */}
          <View style={styles.statusBubble}>
            <Text style={styles.statusText}>{getMoodText()}</Text>
          </View>

          {/* 喂养按钮 */}
          {wowli.hunger < 50 && onFeed && (
            <TouchableOpacity style={styles.feedButton} onPress={onFeed}>
              <Text style={styles.feedButtonText}>🍎 喂养 Wowli</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 成就墙 */}
        <View style={styles.achievementSection}>
          <View style={styles.achievementCard}>
            <View style={styles.achievementHeader}>
              <View style={styles.achievementTitleRow}>
                <Text style={styles.achievementIcon}>🏆</Text>
                <Text style={styles.achievementTitle}>成就墙</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>查看全部</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.achievementGrid}>
              {ACHIEVEMENTS.map((item, idx) => (
                <View key={idx} style={styles.achievementItem}>
                  <View
                    style={[
                      styles.achievementBadge,
                      { backgroundColor: item.color },
                    ]}
                  >
                    <Text style={styles.achievementEmoji}>{item.icon}</Text>
                  </View>
                  <Text
                    style={[
                      styles.achievementLabel,
                      !item.unlocked && styles.achievementLabelLocked,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 统计数据 */}
        <View style={styles.statsSection}>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{wowli.streak}</Text>
              <Text style={styles.statLabel}>连续互动天数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{wowli.happiness}%</Text>
              <Text style={styles.statLabel}>快乐指数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{wowli.hunger}%</Text>
              <Text style={styles.statLabel}>饱腹度</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.warmGray,
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  shareIcon: {
    fontSize: 18,
  },
  growthSection: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  growthBadge: {
    backgroundColor: `${COLORS.sage}1A`,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${COLORS.sage}33`,
  },
  growthBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.sage,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  growthArrow: {
    fontSize: 32,
    color: COLORS.sage,
    marginVertical: 8,
  },
  levelPill: {
    backgroundColor: COLORS.whiteAlpha80,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: `${COLORS.primary}1A`,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  petSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    position: 'relative',
  },
  decorativeRings: {
    position: 'absolute',
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: `${COLORS.primary}1A`,
    borderRadius: 200,
  },
  ringInner: {
    width: 256,
    height: 256,
  },
  ringOuter: {
    width: 320,
    height: 320,
    borderWidth: 1,
  },
  statusBubble: {
    marginTop: 48,
    backgroundColor: COLORS.whiteAlpha80,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warmGray,
    textAlign: 'center',
  },
  feedButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  feedButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  achievementSection: {
    paddingHorizontal: SPACING.lg,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    borderWidth: 1,
    borderColor: `${COLORS.warmGray}0D`,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  achievementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 20,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warmGray,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '25%',
    alignItems: 'center',
  },
  achievementBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.warmGray,
    marginTop: 12,
    textAlign: 'center',
  },
  achievementLabelLocked: {
    color: '#CBD5E1',
  },
  statsSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.warmGray,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.blackAlpha05,
  },
  bottomPadding: {
    height: 40,
  },
});

export default WowliSpaceScreen;
