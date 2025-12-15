/**
 * Screen 4: Preferred Content
 * Grid/horizontal scroll for content type selection
 */

import React, { useState, useRef } from 'react';
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
import { Wind, Moon, Heart, BookOpen, Check } from 'lucide-react-native';
import { DesignTokens, BorderRadius, Spacing } from '@/constants/theme';
import { saveOnboardingData } from '@/services/storage';
import type { ContentType } from '@/types/onboarding';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - Spacing.lg * 3) / 2;

interface ContentOption {
  id: ContentType;
  label: string;
  sublabel: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

const contentOptions: ContentOption[] = [
  {
    id: 'meditations',
    label: 'Meditations',
    sublabel: 'Tafakkur & Breathwork',
    Icon: Wind,
  },
  {
    id: 'sleep-stories',
    label: 'Sleep Stories',
    sublabel: 'Prophetic Tales',
    Icon: Moon,
  },
  {
    id: 'dhikr-dua',
    label: 'Dhikr & Dua',
    sublabel: 'Daily Remembrances',
    Icon: Heart,
  },
  {
    id: 'quran',
    label: 'Quran',
    sublabel: 'Recitation & Reflection',
    Icon: BookOpen,
  },
];

export default function ContentScreen() {
  const router = useRouter();
  const [selectedContent, setSelectedContent] = useState<ContentType[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const toggleContent = async (contentId: ContentType) => {
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
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveOnboardingData({ preferredContent: selectedContent });

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/commitment');
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
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Check size={14} color={DesignTokens.background.primary} />
                      </View>
                    )}
                    <option.Icon
                      size={36}
                      color={isSelected ? DesignTokens.accent.gold : DesignTokens.text.heading}
                      strokeWidth={1.5}
                    />
                    <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                      {option.label}
                    </Text>
                    <Text style={styles.cardSublabel}>{option.sublabel}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Continue Button */}
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
    backgroundColor: DesignTokens.background.surface,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
    position: 'relative',
  },
  cardSelected: {
    borderColor: DesignTokens.accent.gold,
    borderWidth: 2,
  },
  checkBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DesignTokens.accent.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: DesignTokens.text.heading,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  cardLabelSelected: {
    color: DesignTokens.accent.gold,
  },
  cardSublabel: {
    fontSize: 12,
    color: DesignTokens.text.body,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingVertical: Spacing.lg,
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
