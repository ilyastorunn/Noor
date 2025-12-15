/**
 * Screen 6: The Magic Loading (Processing)
 * Beautiful calming animation with rotating text
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { DesignTokens, Spacing } from '@/constants/theme';
import { completeOnboarding } from '@/services/storage';

const loadingMessages = [
  'Analyzing your goals...',
  'Curating your daily sanctuary...',
  'Welcome to Hushu.',
];

export default function LoadingScreen() {
  const router = useRouter();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const haloScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    // Pulsing halo animation
    const haloAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(haloScale, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(haloScale, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    haloAnimation.start();

    // Text rotation
    const textInterval = setInterval(() => {
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 200,
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
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }, 1500);

    // Navigate to main app after ~4 seconds
    const navigationTimeout = setTimeout(async () => {
      await completeOnboarding();
      
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/(tabs)');
      });
    }, 4500);

    return () => {
      clearInterval(textInterval);
      clearTimeout(navigationTimeout);
      rotateAnimation.stop();
      haloAnimation.stop();
    };
  }, [rotateAnim, opacityAnim, scaleAnim, textOpacity, haloScale, router]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={[DesignTokens.background.primary, DesignTokens.background.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Animated Halo */}
          <View style={styles.animationContainer}>
            {/* Outer pulsing halo */}
            <Animated.View
              style={[
                styles.haloOuter,
                {
                  transform: [{ scale: haloScale }],
                  opacity: haloScale.interpolate({
                    inputRange: [1, 1.2],
                    outputRange: [0.3, 0.1],
                  }),
                },
              ]}
            />
            
            {/* Rotating geometric pattern */}
            <Animated.View
              style={[
                styles.rotatingElement,
                { transform: [{ rotate: spin }] },
              ]}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.geometricLine,
                    { transform: [{ rotate: `${i * 30}deg` }] },
                  ]}
                />
              ))}
            </Animated.View>

            {/* Center element */}
            <View style={styles.centerDot} />
          </View>

          {/* Loading Text */}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  haloOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: DesignTokens.accent.gold,
  },
  rotatingElement: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  geometricLine: {
    position: 'absolute',
    width: 150,
    height: 1,
    backgroundColor: DesignTokens.accent.gold,
    opacity: 0.4,
  },
  centerDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DesignTokens.accent.gold,
  },
  loadingText: {
    fontSize: 18,
    color: DesignTokens.text.body,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
