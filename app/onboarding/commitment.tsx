/**
 * Screen 5: Commitment (The Promise)
 * 3 Large Cards for time commitment selection
 */

import React, { useRef } from 'react';
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
import { Clock, Sparkles, Flame } from 'lucide-react-native';
import { DesignTokens, BorderRadius, Spacing } from '@/constants/theme';
import { saveOnboardingData } from '@/services/storage';
import type { Commitment } from '@/types/onboarding';

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
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveOnboardingData({ commitment });

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/loading');
    });
  };

  return (
    <LinearGradient
      colors={[DesignTokens.background.primary, DesignTokens.background.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>How much time can you set aside daily?</Text>
            <Text style={styles.subtitle}>Consistency is key, even if it's small.</Text>
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
                  <option.Icon
                    size={32}
                    color={option.isRecommended ? DesignTokens.accent.gold : DesignTokens.text.heading}
                    strokeWidth={1.5}
                  />
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
  },
  subtitle: {
    fontSize: 16,
    color: DesignTokens.text.body,
    textAlign: 'center',
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
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  card: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
    position: 'relative',
  },
  cardRecommended: {
    borderColor: DesignTokens.accent.gold,
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: DesignTokens.accent.gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignTokens.background.primary,
  },
  duration: {
    fontSize: 32,
    fontWeight: '600',
    color: DesignTokens.text.heading,
    marginTop: Spacing.md,
  },
  durationRecommended: {
    color: DesignTokens.accent.gold,
  },
  label: {
    fontSize: 14,
    color: DesignTokens.text.body,
    marginTop: Spacing.xs,
  },
});
