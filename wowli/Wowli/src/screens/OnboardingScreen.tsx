/**
 * 引导页面 - 选择身份和配对
 * 从 wowliUI/pages/Onboarding.tsx 转换
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { createUser, joinFamily } from '../services/api';
import COLORS from '../theme/colors';
import { SPACING, RADIUS } from '../theme/styles';
import { User, Role } from '../types';

interface Props {
  onComplete: (user: User) => void;
}

const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [role, setRole] = useState<Role>('daughter');
  const [inviteCode, setInviteCode] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'join' | 'create'>('join');

  const handleJoin = async () => {
    if (!inviteCode || !name) return;

    setIsLoading(true);
    try {
      const result = await joinFamily(inviteCode, name, role);
      onComplete({
        id: result.userId,
        role,
        name,
        familyId: result.familyId,
      });
    } catch (error) {
      console.error('加入失败:', error);
    }
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (!name) return;

    setIsLoading(true);
    try {
      const result = await createUser(name, role);
      onComplete({
        id: result.userId,
        role,
        name,
        familyId: result.familyId,
      });
    } catch (error) {
      console.error('创建失败:', error);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Logo 和标题 */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🐾</Text>
          </View>
          <Text style={styles.title}>Wowli Connection</Text>
          <Text style={styles.subtitle}>
            跨越时空与代际，{'\n'}让爱在每一次小小的投喂中传递。
          </Text>
        </View>

        {/* 选择身份 */}
        <View style={styles.roleSection}>
          <Text style={styles.sectionLabel}>你是谁？</Text>
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'daughter' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('daughter')}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'daughter' && styles.roleButtonTextActive,
                ]}
              >
                女儿
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'mother' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('mother')}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'mother' && styles.roleButtonTextActive,
                ]}
              >
                妈妈
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 输入区域 */}
        <View style={styles.inputSection}>
          <View style={styles.inputCard}>
            {/* 名字输入 */}
            <Text style={styles.inputLabel}>你的名字</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="输入你的名字"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
            />

            {/* 模式切换 */}
            <View style={styles.modeSelector}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  mode === 'join' && styles.modeButtonActive,
                ]}
                onPress={() => setMode('join')}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    mode === 'join' && styles.modeButtonTextActive,
                  ]}
                >
                  加入家庭
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  mode === 'create' && styles.modeButtonActive,
                ]}
                onPress={() => setMode('create')}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    mode === 'create' && styles.modeButtonTextActive,
                  ]}
                >
                  创建家庭
                </Text>
              </TouchableOpacity>
            </View>

            {/* 邀请码输入 (仅加入模式) */}
            {mode === 'join' && (
              <>
                <Text style={[styles.inputLabel, styles.inputLabelMargin]}>
                  配对邀请码
                </Text>
                <TextInput
                  value={inviteCode}
                  onChangeText={setInviteCode}
                  placeholder="请输入家庭 ID"
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.input}
                  autoCapitalize="none"
                />
              </>
            )}

            {/* 提交按钮 */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!name || (mode === 'join' && !inviteCode)) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={mode === 'join' ? handleJoin : handleCreate}
              disabled={!name || (mode === 'join' && !inviteCode) || isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? '请稍候...' : '进入 Wowli 世界'}
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'create' && (
            <Text style={styles.hintText}>
              创建后会生成家庭 ID，分享给家人即可配对
            </Text>
          )}
        </View>

        {/* 底部条款 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            点击即代表同意{' '}
            <Text style={styles.footerLink}>服务条款</Text> 与{' '}
            <Text style={styles.footerLink}>隐私政策</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    transform: [{ rotate: '10deg' }],
  },
  logoEmoji: {
    fontSize: 40,
    transform: [{ rotate: '-10deg' }],
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 32,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.warmGray,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  roleSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 16,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.blackAlpha03,
    borderRadius: 16,
    padding: 4,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  roleButtonTextActive: {
    color: COLORS.textPrimary,
  },
  inputSection: {
    flex: 1,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  inputLabelMargin: {
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.blackAlpha03,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modeSelector: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.blackAlpha03,
  },
  modeButtonActive: {
    backgroundColor: `${COLORS.primary}1A`,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  modeButtonTextActive: {
    color: COLORS.primary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textMuted,
    shadowOpacity: 0,
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hintText: {
    fontSize: 11,
    color: COLORS.warmGray,
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  footerLink: {
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen;
