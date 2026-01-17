/**
 * 回复页面 - AI 教练指导
 * 从 wowliUI/pages/Reply.tsx 转换
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

import WowliPet from '../components/WowliPet';
import { analyzePhotoForCoaching } from '../services/api';
import COLORS from '../theme/colors';
import { SPACING, RADIUS } from '../theme/styles';
import { RootStackParamList, PhotoMessage, AICoachResponse, User } from '../types';

interface Props {
  user: User;
  history: PhotoMessage[];
  onReply: (msgId: string, replyText: string) => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ReplyRouteProp = RouteProp<RootStackParamList, 'Reply'>;

const ReplyScreen: React.FC<Props> = ({ user, history, onReply }) => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ReplyRouteProp>();
  const { messageId } = route.params;

  const msg = history.find((m) => m.id === messageId);

  const [replyText, setReplyText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<AICoachResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (msg && !aiAnalysis && !isAnalyzing) {
      const getAI = async () => {
        setIsAnalyzing(true);
        try {
          const result = await analyzePhotoForCoaching(
            user.familyId,
            user.id,
            msg.imageUrl || '',
            msg.caption
          );
          setAiAnalysis(result);
        } catch (error) {
          console.error('AI 分析失败:', error);
          // 使用默认回复
          setAiAnalysis({
            sentiment: '妈妈似乎想念你了，在分享她的生活点滴。',
            topicSuggestion: '花点时间注意妈妈在分享什么，回复一些温暖的话语吧。',
            samplePhrase: '妈，看到你那边一切都好我就放心了，我也很想你！',
            stickers: ['❤️', '✨'],
            mode: 'pipeline-mock',
          });
        }
        setIsAnalyzing(false);
      };
      getAI();
    }
  }, [msg]);

  const handleSubmit = () => {
    if (msg && replyText) {
      onReply(msg.id, replyText);
      navigation.goBack();
    }
  };

  const useSuggestion = () => {
    if (aiAnalysis) {
      setReplyText(aiAnalysis.samplePhrase);
    }
  };

  if (!msg) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>消息未找到</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* 顶部栏 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>回应当下的温暖</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 照片展示 */}
          <View style={styles.photoCard}>
            {msg.imageUrl && (
              <Image source={{ uri: msg.imageUrl }} style={styles.photo} />
            )}
            <LinearGradient
              colors={['transparent', COLORS.blackAlpha60]}
              style={styles.photoGradient}
            >
              <Text style={styles.photoCaption}>{msg.caption}</Text>
            </LinearGradient>
          </View>

          {/* AI 教练区域 */}
          <View style={styles.coachCard}>
            <View style={styles.coachHeader}>
              <View style={styles.coachIcon}>
                <Text style={styles.coachIconText}>✨</Text>
              </View>
              <Text style={styles.coachLabel}>Wowli 教练</Text>
            </View>

            {isAnalyzing ? (
              <View style={styles.loadingContainer}>
                <WowliPet mood="thinking" size="sm" />
                <Text style={styles.loadingText}>正在解读妈妈的心情...</Text>
              </View>
            ) : aiAnalysis ? (
              <View style={styles.analysisContent}>
                {/* 情感分析 */}
                <Text style={styles.sentimentText}>{aiAnalysis.sentiment}</Text>

                {/* 建议回复 */}
                <View style={styles.suggestionBox}>
                  <Text style={styles.suggestionLabel}>尝试这样回复：</Text>
                  <Text style={styles.suggestionText}>
                    "{aiAnalysis.samplePhrase}"
                  </Text>

                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={useSuggestion}
                  >
                    <Text style={styles.copyButtonText}>复制到回复框</Text>
                  </TouchableOpacity>
                </View>

                {/* AI 模式指示 */}
                <View style={styles.modeIndicator}>
                  <Text style={styles.modeText}>
                    {aiAnalysis.mode.includes('agent') ? '🤖 Agent' : '⚡ Pipeline'} 模式
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        {/* 底部输入区 */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={replyText}
              onChangeText={setReplyText}
              placeholder="写下你的回复..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                replyText ? styles.sendButtonActive : null,
              ]}
              onPress={handleSubmit}
              disabled={!replyText}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </TouchableOpacity>
          </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
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
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  photoCard: {
    aspectRatio: 4 / 3,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    paddingTop: 40,
  },
  photoCaption: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  coachCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  coachIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}1A`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coachIconText: {
    fontSize: 12,
  },
  coachLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  loadingText: {
    fontSize: 11,
    color: COLORS.warmGray,
    marginTop: SPACING.md,
    fontWeight: '500',
  },
  analysisContent: {
    gap: 16,
  },
  sentimentText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 21,
  },
  suggestionBox: {
    backgroundColor: `${COLORS.softPeach}80`,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: `${COLORS.primary}0D`,
  },
  suggestionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  copyButton: {
    marginTop: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modeIndicator: {
    alignItems: 'flex-end',
  },
  modeText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  inputBar: {
    backgroundColor: COLORS.whiteAlpha80,
    borderTopWidth: 1,
    borderTopColor: COLORS.blackAlpha03,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blackAlpha03,
    borderRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingVertical: 10,
    maxHeight: 80,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E4E4E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
  sendIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 100,
  },
});

export default ReplyScreen;
