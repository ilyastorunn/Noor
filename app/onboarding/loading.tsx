/**
 * Screen 6: The Magic Loading (Processing)
 * Midnight Sanctuary Theme - Motion should reassure, not delight
 * Gentle, calming animation - no bouncy or playful elements
 */

import { useOnboarding } from '@/app/_layout';
import { DesignTokens, Spacing } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const loadingMessages = [
  'Analyzing your goals...',
  'Curating your daily sanctuary...',
  'Welcome to Hushu.',
];

export default function LoadingScreen() {
  const { markOnboardingComplete } = useOnboarding();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle fade in - reassuring, not delightful
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Slow, calming rotation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 12000, // Very slow rotation
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    // Gentle pulse - not bouncy
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Text transition - gentle fades
    const textInterval = setInterval(() => {
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentMessageIndex((prev) => {
          const next = prev + 1;
          if (next >= loadingMessages.length) {
            return prev;
          }
          return next;
        });
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 1800);

    // Navigation after processing
    const navigationTimeout = setTimeout(async () => {
      // Mark complete in both AsyncStorage AND React state (via context)
      // The root layout guard will handle the redirect to /(tabs)
      await markOnboardingComplete();
    }, 5500);

    return () => {
      clearInterval(textInterval);
      clearTimeout(navigationTimeout);
      rotateAnimation.stop();
      pulseAnimation.stop();
    };
  }, [rotateAnim, opacityAnim, textOpacity, pulseAnim, markOnboardingComplete]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.content,
            { opacity: opacityAnim },
          ]}
        >
          {/* Animated Element - Minimal, geometric */}
          <View style={styles.animationContainer}>
            {/* Outer subtle ring */}
            <Animated.View
              style={[
                styles.outerRing,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [0.15, 0.05],
                  }),
                },
              ]}
            />
            
            {/* Rotating geometric lines */}
            <Animated.View
              style={[
                styles.rotatingElement,
                { transform: [{ rotate: spin }] },
              ]}
            >
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.geometricLine,
                    { transform: [{ rotate: `${i * 45}deg` }] },
                  ]}
                />
              ))}
            </Animated.View>

            {/* Center dot - subtle */}
            <View style={styles.centerDot} />
          </View>

          {/* Loading Text - Gentle, guiding */}
          <Animated.Text
            style={[
              styles.loadingText,
              { opacity: textOpacity },
            ]}
          >
            {loadingMessages[currentMessageIndex]}
          </Animated.Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.background.primary, // #020617 - Near-black
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  animationContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  outerRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: DesignTokens.text.muted, // Subtle, not accent
  },
  rotatingElement: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  geometricLine: {
    position: 'absolute',
    width: 120,
    height: 1,
    backgroundColor: DesignTokens.text.muted, // Muted, not prominent
    opacity: 0.3,
  },
  centerDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: DesignTokens.text.muted, // Subtle center point
    opacity: 0.5,
  },
  loadingText: {
    fontSize: 18,
    color: DesignTokens.text.body,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
  },
});
