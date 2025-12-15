/**
 * Screen 1: Welcome (Splash)
 * Minimalist centered logo with slogan and subtle animated gradient
 */

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { DesignTokens, BorderRadius, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const handleBegin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Fade out animation before navigating
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/emotional-checkin');
    });
  };

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
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo Area */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>H</Text>
            </View>
            <Text style={styles.appName}>Hushu</Text>
          </View>

          {/* Slogan */}
          <Text style={styles.slogan}>Sanctuary for the Modern Soul</Text>

          {/* Decorative Element */}
          <View style={styles.decorativeLine} />
        </Animated.View>

        {/* CTA Button */}
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
          <Pressable
            onPress={handleBegin}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Bismillah / Begin</Text>
          </Pressable>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: DesignTokens.background.surface,
    borderWidth: 2,
    borderColor: DesignTokens.accent.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '300',
    color: DesignTokens.accent.gold,
    fontFamily: 'serif',
  },
  appName: {
    fontSize: 36,
    fontWeight: '300',
    color: DesignTokens.text.heading,
    fontFamily: 'serif',
    letterSpacing: 4,
  },
  slogan: {
    fontSize: 16,
    color: DesignTokens.text.body,
    textAlign: 'center',
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
  decorativeLine: {
    width: 60,
    height: 1,
    backgroundColor: DesignTokens.accent.gold,
    marginTop: Spacing.xl,
    opacity: 0.5,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.md,
  },
  button: {
    backgroundColor: DesignTokens.accent.gold,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: DesignTokens.background.primary,
  },
});
