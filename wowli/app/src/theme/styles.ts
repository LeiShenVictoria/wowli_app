/**
 * Wowli 通用样式
 */

import { StyleSheet } from 'react-native';
import COLORS from './colors';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  title: 28,
};

// 通用样式
export const commonStyles = StyleSheet.create({
  // 容器
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  containerDark: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },

  // 居中
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 行
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // 卡片
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  // 按钮
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: COLORS.whiteAlpha10,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },

  // 圆形按钮
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.whiteAlpha10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 输入框
  input: {
    backgroundColor: COLORS.blackAlpha03,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },

  // 文字
  textTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  textSubtitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  textBody: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  textCaption: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.warmGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textMuted: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
});

export default commonStyles;
