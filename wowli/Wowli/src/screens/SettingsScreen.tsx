/**
 * 设置页面
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import COLORS from '../theme/colors';
import { SPACING } from '../theme/styles';
import { RootStackParamList, User } from '../types';

interface Props {
  user: User | null;
  onLogout: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SETTINGS_SECTIONS = [
  {
    title: '家庭',
    items: [
      { icon: '👨‍👩‍👧', label: '家庭成员', action: 'members' },
      { icon: '🔗', label: '分享邀请码', action: 'share' },
    ],
  },
  {
    title: 'Wowli',
    items: [
      { icon: '🐾', label: 'Wowli 空间', action: 'space' },
      { icon: '📱', label: '小组件设置指南', action: 'widget' },
    ],
  },
  {
    title: '通用',
    items: [
      { icon: '🔔', label: '通知设置', action: 'notifications' },
      { icon: '🌙', label: '深色模式', action: 'darkmode' },
      { icon: '❓', label: '帮助与反馈', action: 'help' },
    ],
  },
];

const SettingsScreen: React.FC<Props> = ({ user, onLogout }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleAction = async (action: string) => {
    switch (action) {
      case 'share':
        if (user?.familyId) {
          try {
            await Share.share({
              message: `加入我的 Wowli 家庭！\n\n家庭 ID: ${user.familyId}\n\n下载 Wowli App 后输入此 ID 即可配对 💕`,
            });
          } catch (error) {
            console.error('分享失败:', error);
          }
        }
        break;
      case 'space':
        navigation.navigate('WowliSpace');
        break;
      case 'widget':
        navigation.navigate('WidgetGuide');
        break;
      case 'notifications':
      case 'darkmode':
      case 'help':
      case 'members':
        Alert.alert('提示', '该功能即将上线');
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', style: 'destructive', onPress: onLogout },
    ]);
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
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 用户信息 */}
        {user && (
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userEmoji}>
                {user.role === 'daughter' ? '👧' : '👩'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>
                {user.role === 'daughter' ? '女儿' : '妈妈'}
              </Text>
            </View>
            <View style={styles.familyIdBadge}>
              <Text style={styles.familyIdLabel}>家庭 ID</Text>
              <Text style={styles.familyIdText}>
                {user.familyId.slice(0, 8)}...
              </Text>
            </View>
          </View>
        )}

        {/* 设置列表 */}
        {SETTINGS_SECTIONS.map((section, sectionIdx) => (
          <View key={sectionIdx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity
                  key={itemIdx}
                  style={[
                    styles.settingItem,
                    itemIdx < section.items.length - 1 && styles.settingItemBorder,
                  ]}
                  onPress={() => handleAction(item.action)}
                >
                  <Text style={styles.settingIcon}>{item.icon}</Text>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Text style={styles.settingChevron}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* 退出登录 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        {/* 版本信息 */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Wowli v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with 💕 for families</Text>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.blackAlpha03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.textPrimary,
    marginTop: -2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.softPeach,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userEmoji: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  userRole: {
    fontSize: 12,
    color: COLORS.warmGray,
    marginTop: 2,
  },
  familyIdBadge: {
    alignItems: 'flex-end',
  },
  familyIdLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  familyIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warmGray,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.blackAlpha05,
  },
  settingIcon: {
    fontSize: 20,
    width: 32,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  settingChevron: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  logoutButton: {
    marginTop: 32,
    marginHorizontal: SPACING.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 32,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  bottomPadding: {
    height: 40,
  },
});

export default SettingsScreen;
