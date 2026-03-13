/**
 * Screen 1: Welcome (Splash)
 * Midnight Sanctuary Theme - Calm, restrained, sacred
 * SOLID background (#020617) - NO gradients
 * Motion should reassure, not delight
 */

import { OnboardingImages } from '@/assets/images';
import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const devTapCount = useRef(0);
  const devTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Gentle fade in - no bouncy animations
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleBegin = async () => {
    // Haptics only for confirmation, never for discovery
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/emotional-checkin');
    });
  };

  // Hidden dev mode access - triple tap on logo
  const handleLogoTap = () => {
    devTapCount.current += 1;
    
    if (devTapTimer.current) {
      clearTimeout(devTapTimer.current);
    }
    
    if (devTapCount.current >= 5) {
      devTapCount.current = 0;
      router.push('/dev');
      return;
    }
    
    devTapTimer.current = setTimeout(() => {
      devTapCount.current = 0;
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Full-screen background image - emerges from darkness */}
      <Animated.Image
        source={OnboardingImages.welcome}
        style={[
          styles.backgroundImage,
          { opacity: fadeAnim },
        ]}
      />

      {/* Content layer */}
      <SafeAreaView style={styles.safeArea}>
        {/* Main Content - Vertical stillness */}
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim },
          ]}
        >
          {/* Logo Area - Minimal, restrained */}
          {/* 5 taps to access dev tools */}
          <Pressable style={styles.logoContainer} onPress={handleLogoTap}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>H</Text>
            </View>
            <Text style={styles.appName}>Hushu</Text>
          </Pressable>

          {/* Slogan - Gentle, guiding tone */}
          <Text style={styles.slogan}>Sanctuary for the Modern Soul</Text>

          {/* Decorative Element - Minimal */}
          <View style={styles.decorativeLine} />
        </Animated.View>

        {/* CTA Button - Acts, not controls */}
        {/* Used only when user commits or begins something meaningful */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.background.primary, // #020617 - Near-black
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: DesignTokens.background.surface, // Emerges gently
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle, // Very subtle border
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    // No heavy shadows - quiet design
  },
  logoText: {
    fontSize: 48,
    fontWeight: '300',
    color: DesignTokens.text.heading,
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
    lineHeight: 24, // Loose line-height for reading
  },
  decorativeLine: {
    width: 60,
    height: 1,
    backgroundColor: DesignTokens.text.muted,
    marginTop: Spacing.xl,
    opacity: 0.3,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  button: {
    backgroundColor: DesignTokens.accent.primary, // Creased Khaki - ritual use
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg, // 24px
    alignItems: 'center',
    // Minimal shadow - calm design
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: DesignTokens.text.onPrimary, // Dark text on khaki
  },
});
