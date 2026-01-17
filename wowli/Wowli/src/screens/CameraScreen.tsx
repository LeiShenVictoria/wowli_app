/**
 * 相机/拍照页面
 * 从 wowliUI/pages/Camera.tsx 转换
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';

import COLORS from '../theme/colors';
import { SPACING, RADIUS } from '../theme/styles';
import { RootStackParamList } from '../types';

interface Props {
  onPost: (imageBase64: string, caption: string) => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CameraScreen: React.FC<Props> = ({ onPost }) => {
  const navigation = useNavigation<NavigationProp>();
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  // 打开相机
  const openCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
      });

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          setPreview(`data:image/jpeg;base64,${asset.base64}`);
        } else if (asset.uri) {
          setPreview(asset.uri);
        }
      }
    } catch (error) {
      console.error('相机错误:', error);
      Alert.alert('错误', '无法打开相机');
    }
  };

  // 打开相册
  const openLibrary = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
      });

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          setPreview(`data:image/jpeg;base64,${asset.base64}`);
        } else if (asset.uri) {
          setPreview(asset.uri);
        }
      }
    } catch (error) {
      console.error('相册错误:', error);
      Alert.alert('错误', '无法打开相册');
    }
  };

  // 提交
  const handleSubmit = () => {
    if (preview) {
      onPost(preview, caption || '看看我的今日瞬间');
      navigation.goBack();
    }
  };

  // 重拍
  const handleRetake = () => {
    setPreview(null);
    setCaption('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 顶部栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Wowli Camera</Text>
        </View>

        <TouchableOpacity style={styles.libraryButton} onPress={openLibrary}>
          <Text style={styles.libraryIcon}>🖼️</Text>
        </TouchableOpacity>
      </View>

      {/* 取景器/预览区域 */}
      <View style={styles.viewfinder}>
        <View style={styles.viewfinderFrame}>
          {preview ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: preview }} style={styles.previewImage} />

              {/* 渐变遮罩和输入框 */}
              <LinearGradient
                colors={['transparent', COLORS.blackAlpha60]}
                style={styles.captionGradient}
              >
                <TextInput
                  value={caption}
                  onChangeText={setCaption}
                  placeholder="说点什么吧..."
                  placeholderTextColor={COLORS.whiteAlpha50}
                  style={styles.captionInput}
                  autoFocus
                />
              </LinearGradient>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.cameraPlaceholderText}>点击下方按钮拍照</Text>
              <Text style={styles.cameraPlaceholderSubtext}>
                或选择相册中的照片
              </Text>
            </View>
          )}

          {/* 网格线 */}
          <View style={styles.gridOverlay}>
            <View style={[styles.gridLine, styles.gridLineV1]} />
            <View style={[styles.gridLine, styles.gridLineV2]} />
            <View style={[styles.gridLine, styles.gridLineH1]} />
            <View style={[styles.gridLine, styles.gridLineH2]} />
          </View>
        </View>
      </View>

      {/* 底部控制区 */}
      <View style={styles.footer}>
        {preview ? (
          // 预览模式：放弃/确认
          <View style={styles.previewControls}>
            <TouchableOpacity
              style={styles.discardButton}
              onPress={handleRetake}
            >
              <Text style={styles.discardText}>放弃</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmGradient}
              >
                <Text style={styles.confirmText}>确认投喂</Text>
                <Text style={styles.confirmIcon}>📤</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          // 拍照模式
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.flashButton}>
              <Text style={styles.flashIcon}>⚡️</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shutterOuter} onPress={openCamera}>
              <View style={styles.shutterButton}>
                <View style={styles.shutterInner}>
                  <View style={styles.shutterDot} />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.flipButton}>
              <Text style={styles.flipIcon}>🔄</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.whiteAlpha10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  headerTitle: {
    backgroundColor: `${COLORS.primary}33`,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${COLORS.primary}4D`,
  },
  headerTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  libraryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.whiteAlpha10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  libraryIcon: {
    fontSize: 18,
  },
  viewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  viewfinderFrame: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 360,
    borderRadius: 40,
    backgroundColor: '#27272A',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: COLORS.whiteAlpha20,
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  captionGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    paddingTop: 60,
  },
  captionInput: {
    backgroundColor: COLORS.whiteAlpha10,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: COLORS.whiteAlpha20,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.whiteAlpha50,
  },
  cameraPlaceholderSubtext: {
    fontSize: 12,
    color: COLORS.whiteAlpha20,
    marginTop: 8,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  gridLineV1: {
    left: '33.33%',
    top: 0,
    bottom: 0,
    width: 1,
  },
  gridLineV2: {
    left: '66.66%',
    top: 0,
    bottom: 0,
    width: 1,
  },
  gridLineH1: {
    top: '33.33%',
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineH2: {
    top: '66.66%',
    left: 0,
    right: 0,
    height: 1,
  },
  footer: {
    paddingBottom: 64,
    alignItems: 'center',
  },
  previewControls: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: SPACING.lg,
    gap: 16,
  },
  discardButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.whiteAlpha10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.whiteAlpha10,
  },
  discardText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  confirmButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  confirmIcon: {
    fontSize: 14,
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  flashButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.whiteAlpha10,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
  },
  flashIcon: {
    fontSize: 20,
  },
  shutterOuter: {
    padding: 12,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.whiteAlpha20,
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 6,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${COLORS.primary}0D`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.whiteAlpha10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipIcon: {
    fontSize: 20,
  },
});

export default CameraScreen;
