/**
 * Screen 5: Commitment (The Promise)
 * Midnight Sanctuary Theme - Calm, restrained, sacred
 * Cards emerge gently from the darkness
 * Recommended state uses emerald accent
 */

import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';
import { saveOnboardingData } from '@/services/storage';
import type { Commitment } from '@/types/onboarding';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Clock, Flame, Sparkles } from 'lucide-react-native';
import React, { useRef } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CommitmentOption {
  id: Commitment;
  duration: string;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  isRecommended?: boolean;
}

const commitmentOptions: CommitmentOption[] = [
  {
    id: '5min',
    duration: '5 min',
    label: 'Start Small',
    Icon: Clock,
  },
  {
    id: '15min',
    duration: '15 min',
    label: 'Recommended',
    Icon: Sparkles,
    isRecommended: true,
  },
  {
    id: '30min',
    duration: '30 min+',
    label: 'Deep Dive',
    Icon: Flame,
  },
];

export default function CommitmentScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSelect = async (commitment: Commitment) => {
    // Haptic for commitment - this is meaningful
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveOnboardingData({ commitment });

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/loading');
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header - Gentle, guiding tone */}
          <View style={styles.header}>
            <Text style={styles.title}>How much time can you set aside daily?</Text>
            <Text style={styles.subtitle}>Consistency is key, even if it&apos;s small.</Text>
          </View>

          {/* Commitment Cards */}
          <View style={styles.cardsContainer}>
            {commitmentOptions.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => handleSelect(option.id)}
                style={({ pressed }) => [
                  styles.cardPressable,
                  pressed && styles.cardPressed,
                ]}
              >
                <View
                  style={[
                    styles.card,
                    option.isRecommended && styles.cardRecommended,
                  ]}
                >
                  {option.isRecommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>Recommended</Text>
                    </View>
                  )}
                  <View style={[
                    styles.iconContainer,
                    option.isRecommended && styles.iconContainerRecommended,
                  ]}>
                    <option.Icon
                      size={24}
                      color={option.isRecommended ? DesignTokens.text.heading : DesignTokens.text.muted}
                      strokeWidth={1.5}
                    />
                  </View>
                  <Text
                    style={[
                      styles.duration,
                      option.isRecommended && styles.durationRecommended,
                    ]}
                  >
                    {option.duration}
                  </Text>
                  <Text style={styles.label}>{option.label}</Text>
                </View>
              </Pressable>
            ))}
          </View>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: DesignTokens.text.heading,
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: DesignTokens.text.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.md,
  },
  cardPressable: {
    marginBottom: Spacing.sm,
  },
  cardPressed: {
    opacity: 0.9,
  },
  card: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: Spacing.md,
  },
  cardRecommended: {
    // Thin emerald border for recommended state
    borderColor: DesignTokens.accent.emerald,
    borderWidth: 1.5,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    left: Spacing.lg,
    backgroundColor: DesignTokens.accent.emerald, // Emerald for structural accent
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '600',
    color: DesignTokens.text.heading,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DesignTokens.background.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerRecommended: {
    backgroundColor: DesignTokens.accent.emerald,
  },
  duration: {
    fontSize: 28,
    fontWeight: '600',
    color: DesignTokens.text.heading,
  },
  durationRecommended: {
    color: DesignTokens.text.heading, // Keep consistent
  },
  label: {
    fontSize: 14,
    color: DesignTokens.text.muted,
    marginLeft: 'auto',
  },
});
