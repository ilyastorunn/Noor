/**
 * Screen 2: Emotional Check-in (The Hook)
 * Midnight Sanctuary Theme - Calm, restrained, sacred
 * Cards emerge gently from the darkness
 * Selection feels like acknowledgment, not activation
 */

import { OnboardingImages } from '@/assets/images';
import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';
import { saveOnboardingData } from '@/services/storage';
import type { EmotionalState } from '@/types/onboarding';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - Spacing.lg * 3) / 2;

interface EmotionalCard {
  id: EmotionalState;
  label: string;
  sublabel: string;
  image: ImageSourcePropType;
}

const emotionalCards: EmotionalCard[] = [
  {
    id: 'anxious',
    label: 'Anxious',
    sublabel: 'Overwhelmed',
    image: OnboardingImages.moods.anxious,
  },
  {
    id: 'seeking',
    label: 'Seeking',
    sublabel: 'Lost / Empty',
    image: OnboardingImages.moods.seeking,
  },
  {
    id: 'grateful',
    label: 'Grateful',
    sublabel: 'Peaceful',
    image: OnboardingImages.moods.grateful,
  },
  {
    id: 'weary',
    label: 'Weary',
    sublabel: 'Tired / Exhausted',
    image: OnboardingImages.moods.weary,
  },
];

export default function EmotionalCheckinScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSelect = async (state: EmotionalState) => {
    // Haptics only for confirmation
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await saveOnboardingData({ emotionalState: state });

    // Gentle fade transition
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/goals');
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header - Gentle, guiding tone */}
          <View style={styles.header}>
            <Text style={styles.title}>How does your soul feel right now?</Text>
            <Text style={styles.subtitle}>Select the card that resonates with you.</Text>
          </View>

          {/* Cards Grid - Vertical stillness priority */}
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
                <View style={styles.card}>
                  {/* Illustration */}
                  <View style={styles.imageContainer}>
                    <Image
                      source={card.image}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  </View>
                  {/* Labels */}
                  <Text style={styles.cardLabel}>{card.label}</Text>
                  <Text style={styles.cardSublabel}>{card.sublabel}</Text>
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
    lineHeight: 36, // Generous line-height
  },
  subtitle: {
    fontSize: 16,
    color: DesignTokens.text.muted, // More muted for guidance
    textAlign: 'center',
    lineHeight: 24,
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
    opacity: 0.9, // Subtle press feedback
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE + 20,
    borderRadius: BorderRadius.lg, // 24px - soft and heavy
    backgroundColor: DesignTokens.background.surface, // Emerges gently from bg
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle, // rgba(255,255,255,0.04) - barely visible
    overflow: 'hidden',
    // No shadows - quiet design
  },
  imageContainer: {
    width: '100%',
    height: CARD_SIZE - 50,
    overflow: 'hidden',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: DesignTokens.text.heading,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  cardSublabel: {
    fontSize: 12,
    color: DesignTokens.text.muted, // Muted for metadata
    textAlign: 'center',
    marginTop: 2,
  },
});
