/**
 * Screen 2: Emotional Check-in (The Hook)
 * 2x2 Grid of visual cards for emotional state selection
 */

import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Cloud, Star, Sun, Moon } from 'lucide-react-native';
import { DesignTokens, BorderRadius, Spacing } from '@/constants/theme';
import { saveOnboardingData } from '@/services/storage';
import type { EmotionalState } from '@/types/onboarding';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - Spacing.lg * 3) / 2;

interface EmotionalCard {
  id: EmotionalState;
  label: string;
  sublabel: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  gradientColors: [string, string];
}

const emotionalCards: EmotionalCard[] = [
  {
    id: 'anxious',
    label: 'Anxious',
    sublabel: 'Overwhelmed',
    Icon: Cloud,
    gradientColors: ['#1E3A5F', '#0F172A'],
  },
  {
    id: 'seeking',
    label: 'Seeking',
    sublabel: 'Lost / Empty',
    Icon: Star,
    gradientColors: ['#2D1B4E', '#0F172A'],
  },
  {
    id: 'grateful',
    label: 'Grateful',
    sublabel: 'Peaceful',
    Icon: Sun,
    gradientColors: ['#2D3A1E', '#0F172A'],
  },
  {
    id: 'weary',
    label: 'Weary',
    sublabel: 'Tired / Exhausted',
    Icon: Moon,
    gradientColors: ['#1E293B', '#0F172A'],
  },
];

export default function EmotionalCheckinScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSelect = async (state: EmotionalState) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveOnboardingData({ emotionalState: state });

    // Smooth transition
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/goals');
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
            <Text style={styles.title}>How does your soul feel right now?</Text>
            <Text style={styles.subtitle}>Select the card that resonates with you.</Text>
          </View>

          {/* Cards Grid */}
          <View style={styles.grid}>
            {emotionalCards.map((card) => (
              <Pressable
                key={card.id}
                onPress={() => handleSelect(card.id)}
                style={({ pressed }) => [
                  styles.cardPressable,
                  pressed && styles.cardPressed,
                ]}
              >
                <LinearGradient
                  colors={card.gradientColors}
                  style={styles.card}
                >
                  <card.Icon
                    size={40}
                    color={DesignTokens.text.heading}
                    strokeWidth={1.5}
                  />
                  <Text style={styles.cardLabel}>{card.label}</Text>
                  <Text style={styles.cardSublabel}>{card.sublabel}</Text>
                </LinearGradient>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  cardPressable: {
    marginBottom: Spacing.lg,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: DesignTokens.text.heading,
    marginTop: Spacing.md,
  },
  cardSublabel: {
    fontSize: 14,
    color: DesignTokens.text.body,
    marginTop: Spacing.xs,
  },
});
