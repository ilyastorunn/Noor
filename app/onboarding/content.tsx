/**
 * Screen 4: Preferred Content (Methods)
 * Midnight Sanctuary Theme - Calm, restrained, sacred
 * Selection feels like acknowledgment, not activation
 * Cards emerge gently from the darkness
 */

import { OnboardingImages } from '@/assets/images';
import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';
import { saveOnboardingData } from '@/services/storage';
import type { ContentType } from '@/types/onboarding';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
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

interface ContentOption {
  id: ContentType;
  label: string;
  sublabel: string;
  image: ImageSourcePropType;
}

const contentOptions: ContentOption[] = [
  {
    id: 'meditations',
    label: 'Meditations',
    sublabel: 'Tafakkur & Breathwork',
    image: OnboardingImages.methods.meditations,
  },
  {
    id: 'sleep-stories',
    label: 'Sleep Stories',
    sublabel: 'Prophetic Tales',
    image: OnboardingImages.methods.stories,
  },
  {
    id: 'dhikr-dua',
    label: 'Dhikr & Dua',
    sublabel: 'Daily Remembrances',
    image: OnboardingImages.methods.dhikrDua,
  },
  {
    id: 'quran',
    label: 'Quran',
    sublabel: 'Recitation & Reflection',
    image: OnboardingImages.methods.quran,
  },
];

export default function ContentScreen() {
  const router = useRouter();
  const [selectedContent, setSelectedContent] = useState<ContentType[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const toggleContent = async (contentId: ContentType) => {
    // Light haptic for selection
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setSelectedContent((prev) => {
      if (prev.includes(contentId)) {
        return prev.filter((id) => id !== contentId);
      }
      return [...prev, contentId];
    });
  };

  const handleContinue = async () => {
    if (selectedContent.length === 0) return;
    
    // Medium haptic for commitment
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveOnboardingData({ preferredContent: selectedContent });

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/commitment');
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header - Gentle, guiding tone */}
          <View style={styles.header}>
            <Text style={styles.title}>How would you like to connect?</Text>
            <Text style={styles.subtitle}>Select your preferred content types.</Text>
          </View>

          {/* Content Grid */}
          <View style={styles.grid}>
            {contentOptions.map((option) => {
              const isSelected = selectedContent.includes(option.id);
              return (
                <Pressable
                  key={option.id}
                  onPress={() => toggleContent(option.id)}
                  style={({ pressed }) => [
                    styles.cardPressable,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.card,
                      isSelected && styles.cardSelected,
                    ]}
                  >
                    {/* Check badge */}
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Check size={12} color={DesignTokens.text.onPrimary} strokeWidth={3} />
                      </View>
                    )}
                    
                    {/* Illustration */}
                    <View style={styles.imageContainer}>
                      <Image
                        source={option.image}
                        style={styles.cardImage}
                        resizeMode="cover"
                      />
                    </View>
                    
                    {/* Labels */}
                    <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                      {option.label}
                    </Text>
                    <Text style={styles.cardSublabel}>{option.sublabel}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Continue Button - Only when user commits */}
          {selectedContent.length > 0 && (
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={handleContinue}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </Pressable>
            </View>
          )}
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
    opacity: 0.9,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE + 20,
    borderRadius: BorderRadius.lg,
    backgroundColor: DesignTokens.background.surface,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
    overflow: 'hidden',
    position: 'relative',
  },
  cardSelected: {
    borderColor: DesignTokens.accent.emerald,
    borderWidth: 1.5,
  },
  checkBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DesignTokens.accent.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
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
    fontSize: 14,
    fontWeight: '500',
    color: DesignTokens.text.heading,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  cardLabelSelected: {
    color: DesignTokens.text.heading,
  },
  cardSublabel: {
    fontSize: 10,
    color: DesignTokens.text.muted,
    marginTop: 2,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingVertical: Spacing.lg,
  },
  button: {
    backgroundColor: DesignTokens.accent.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: DesignTokens.text.onPrimary,
  },
});
