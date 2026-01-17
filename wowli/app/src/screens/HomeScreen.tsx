/**
 * 主页 - 照片流
 * 从 wowliUI/pages/Home.tsx 转换
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

import WowliPet from '../components/WowliPet';
import COLORS from '../theme/colors';
import { SPACING, RADIUS, FONT_SIZE } from '../theme/styles';
import { RootStackParamList, User, WowliState, PhotoMessage } from '../types';

interface Props {
  user: User;
  wowli: WowliState;
  history: PhotoMessage[];
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC<Props> = ({ user, wowli, history }) => {
  const navigation = useNavigation<NavigationProp>();

  // 按日期分组消息
  const groupedHistory = history.reduce((groups: { [key: string]: PhotoMessage[] }, msg) => {
    const date = new Date(msg.timestamp).toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 顶部栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => navigation.navigate('WowliSpace')}
        >
          <View style={styles.avatarWrapper}>
            <WowliPet size="sm" mood={wowli.mood} />
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{wowli.level}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.greeting}>喂，{user.name}</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Wowli 状态 {wowli.hunger}%</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* 顶部互动入口 */}
      <TouchableOpacity
        style={styles.interactionCard}
        onPress={() => navigation.navigate('WowliSpace')}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.interactionGradient}
        >
          <View style={styles.interactionIcon}>
            <Text style={styles.interactionEmoji}>💝</Text>
          </View>
          <View style={styles.interactionInfo}>
            <Text style={styles.interactionLabel}>距离下次进化</Text>
            <Text style={styles.interactionTitle}>还需 3 次互动</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* 照片流 */}
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedHistory).map(([date, messages]) => (
          <View key={date} style={styles.dateGroup}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateText}>{date}</Text>
              <View style={styles.dateLine} />
            </View>

            {messages.map((msg) => (
              <TouchableOpacity
                key={msg.id}
                style={styles.messageCard}
                onPress={() => navigation.navigate('Reply', { messageId: msg.id })}
                activeOpacity={0.95}
              >
                {/* 照片 */}
                <View style={styles.photoWrapper}>
                  {msg.imageUrl && (
                    <Image source={{ uri: msg.imageUrl }} style={styles.photo} />
                  )}
                  <LinearGradient
                    colors={['transparent', COLORS.blackAlpha40]}
                    style={styles.photoOverlay}
                  />
                  <View style={styles.timestamp}>
                    <Text style={styles.timestampText}>
                      {new Date(msg.timestamp).getHours()}:00
                    </Text>
                  </View>
                </View>

                {/* 对话区域 */}
                <View style={styles.chatArea}>
                  {/* 发送者消息 */}
                  <View style={styles.senderMessage}>
                    <View style={styles.senderAvatar}>
                      <Text style={styles.avatarEmoji}>
                        {msg.senderRole === 'mother' ? '👩‍🍳' : '👧'}
                      </Text>
                    </View>
                    <View style={styles.senderBubble}>
                      <Text style={styles.senderText}>{msg.caption}</Text>
                    </View>
                  </View>

                  {/* 回复或等待提示 */}
                  {msg.reply ? (
                    <View style={styles.replyMessage}>
                      <View style={styles.replyBubble}>
                        <Text style={styles.replyText}>{msg.reply}</Text>
                      </View>
                      <View style={styles.replyAvatar}>
                        <Text style={styles.avatarEmoji}>👧</Text>
                      </View>
                    </View>
                  ) : msg.senderId !== user.id ? (
                    <View style={styles.waitingContainer}>
                      <View style={styles.waitingBubble}>
                        <Text style={styles.waitingText}>等待你的投喂</Text>
                        <Text style={styles.waitingHeart}>❤️</Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* 底部留白给导航栏 */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 底部导航栏 */}
      <View style={styles.bottomNav}>
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={[styles.navIcon, styles.navIconActive]}>🏠</Text>
            <View style={styles.navDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.addButtonGradient}
            >
              <Text style={styles.addIcon}>+</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('WowliSpace')}
          >
            <Text style={styles.navIcon}>🐾</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: COLORS.whiteAlpha80,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.blackAlpha03,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  levelBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  levelText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.warmGray,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsButton: {
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
  settingsIcon: {
    fontSize: 20,
  },
  interactionCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  interactionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 35,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  interactionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.whiteAlpha20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interactionEmoji: {
    fontSize: 24,
  },
  interactionInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  interactionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.whiteAlpha80,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  interactionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.whiteAlpha50,
  },
  feed: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  dateGroup: {
    marginBottom: SPACING.xl,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dateText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  dateLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.blackAlpha05,
    marginLeft: SPACING.md,
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 10,
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
  },
  photoWrapper: {
    aspectRatio: 10 / 11,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  timestamp: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.blackAlpha40,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timestampText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  chatArea: {
    padding: 12,
    paddingTop: 20,
  },
  senderMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.softPeach,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 14,
  },
  senderBubble: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 12,
  },
  senderText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  replyMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  replyBubble: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    borderTopRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxWidth: '75%',
  },
  replyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  replyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.blackAlpha05,
  },
  waitingContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
    paddingRight: 8,
  },
  waitingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softPeach,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: `${COLORS.primary}33`,
  },
  waitingText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  waitingHeart: {
    fontSize: 16,
    marginLeft: 8,
  },
  bottomPadding: {
    height: 120,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  navBar: {
    width: '100%',
    maxWidth: 340,
    height: 72,
    backgroundColor: 'rgba(24, 24, 27, 0.9)',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    opacity: 0.4,
  },
  navIconActive: {
    opacity: 1,
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  addButton: {
    marginTop: -40,
    borderWidth: 5,
    borderColor: COLORS.backgroundLight,
    borderRadius: 35,
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default HomeScreen;
