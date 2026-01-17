/**
 * Wowli 宠物组件
 * 从 wowliUI/components/WowliPet.tsx 转换
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import COLORS from '../theme/colors';

interface Props {
  mood?: 'happy' | 'very_happy' | 'sad' | 'thinking' | 'hungry' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: 64,
  md: 128,
  lg: 224,
};

const WowliPet: React.FC<Props> = ({ mood = 'happy', size = 'md' }) => {
  const dimension = SIZE_MAP[size];
  const floatAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  // 浮动动画
  useEffect(() => {
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    floating.start();
    return () => floating.stop();
  }, []);

  // 眨眼动画
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.delay(2000),
        Animated.timing(blinkAnim, {
          toValue: 0.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, []);

  const eyeSize = dimension * 0.0625; // 相对于尺寸的眼睛大小
  const blushSize = dimension * 0.047;
  const beakWidth = dimension * 0.0625;
  const beakHeight = dimension * 0.047;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          transform: [{ translateY: floatAnim }],
        },
      ]}
    >
      {/* 主体 */}
      <View
        style={[
          styles.body,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
          },
        ]}
      >
        {/* 肚子 */}
        <View
          style={[
            styles.belly,
            {
              width: dimension * 0.8,
              height: dimension * 0.7,
              borderRadius: dimension * 0.4,
              bottom: -dimension * 0.1,
              left: dimension * 0.1,
            },
          ]}
        />

        {/* 眼睛区域 */}
        <View style={[styles.eyesContainer, { top: dimension * 0.35 }]}>
          <Animated.View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: eyeSize,
                borderRadius: eyeSize / 2,
                scaleY: blinkAnim,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: eyeSize,
                borderRadius: eyeSize / 2,
                scaleY: blinkAnim,
              },
            ]}
          />
        </View>

        {/* 腮红 */}
        <View style={[styles.blushContainer, { top: dimension * 0.45 }]}>
          <View
            style={[
              styles.blush,
              {
                width: blushSize,
                height: blushSize * 0.67,
                borderRadius: blushSize / 2,
              },
            ]}
          />
          <View
            style={[
              styles.blush,
              {
                width: blushSize,
                height: blushSize * 0.67,
                borderRadius: blushSize / 2,
              },
            ]}
          />
        </View>

        {/* 嘴巴/喙 */}
        <View
          style={[
            styles.beak,
            {
              width: beakWidth,
              height: beakHeight,
              borderBottomLeftRadius: beakWidth / 2,
              borderBottomRightRadius: beakWidth / 2,
              top: dimension * 0.48,
            },
          ]}
        />

        {/* 思考气泡 (mood === 'thinking') */}
        {mood === 'thinking' && (
          <View style={styles.thinkingBubbles}>
            <View style={[styles.bubble, styles.bubbleLarge]} />
            <View style={[styles.bubble, styles.bubbleSmall]} />
          </View>
        )}

        {/* 饥饿状态 */}
        {mood === 'hungry' && (
          <View style={styles.hungryIndicator}>
            <View style={styles.sweat} />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: COLORS.whiteAlpha20,
  },
  belly: {
    position: 'absolute',
    backgroundColor: COLORS.softPeach,
    opacity: 0.4,
  },
  eyesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: '20%',
  },
  eye: {
    backgroundColor: COLORS.backgroundDark,
  },
  blushContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '8%',
  },
  blush: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  beak: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#FB923C', // orange-400
  },
  thinkingBubbles: {
    position: 'absolute',
    top: -16,
    right: -8,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
  },
  bubbleLarge: {
    width: 8,
    height: 8,
    marginBottom: 4,
  },
  bubbleSmall: {
    width: 4,
    height: 4,
    marginLeft: 12,
    opacity: 0.6,
  },
  hungryIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  sweat: {
    width: 6,
    height: 10,
    backgroundColor: '#60A5FA',
    borderRadius: 3,
    opacity: 0.6,
  },
});

export default WowliPet;
