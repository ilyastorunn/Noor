/**
 * Screen 3: Goals Selection
 * Midnight Sanctuary Theme - Calm, restrained, sacred
 * Selection feels like acknowledgment, not activation
 * Selected cards: thin emerald border, very subtle glow
 */

import { OnboardingImages } from '@/assets/images';
import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';
import { saveOnboardingData } from '@/services/storage';
import type { Goal } from '@/types/onboarding';
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
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - Spacing.lg * 3) / 2;

interface GoalOption {
  id: Goal;
  label: string;
  sublabel: string;
  image: ImageSourcePropType;
}

const goalOptions: GoalOption[] = [
  { 
    id: 'grow-closer', 
    label: 'Grow Closer',
    sublabel: 'To Allah',
    image: OnboardingImages.goals.growCloser,
  },
  { 
    id: 'find-peace', 
    label: 'Find Peace',
    sublabel: 'Sabr & Patience',
    image: OnboardingImages.goals.findPeace,
  },
  { 
    id: 'sleep-better', 
    label: 'Sleep Better',
    sublabel: 'Sunnah Routine',
    image: OnboardingImages.goals.sleepBetter,
  },
  { 
    id: 'focus-prayer', 
    label: 'Focus in Prayer',
    sublabel: 'Khushu',
    image: OnboardingImages.goals.focusPrayer,
  },
  { 
    id: 'connect-quran', 
    label: 'Connect',
    sublabel: 'With the Quran',
    image: OnboardingImages.goals.connectQuran,
  },
];

export default function GoalsScreen() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const toggleGoal = async (goalId: Goal) => {
    // Light haptic for selection - confirmation only
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setSelectedGoals((prev) => {
      if (prev.includes(goalId)) {
        return prev.filter((id) => id !== goalId);
      }
      return [...prev, goalId];
    });
  };

  const handleContinue = async () => {
    if (selectedGoals.length === 0) return;
    
    // Medium haptic for commitment action
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveOnboardingData({ goals: selectedGoals });

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/content');
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header - Gentle, guiding tone */}
          <View style={styles.header}>
            <Text style={styles.title}>What brings you here today?</Text>
            <Text style={styles.subtitle}>Choose as many as you like.</Text>
          </View>

          {/* Goals Grid */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.grid}>
              {goalOptions.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <Pressable
                    key={goal.id}
                    onPress={() => toggleGoal(goal.id)}
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
                      {/* Check badge - only when selected */}
                      {isSelected && (
                        <View style={styles.checkBadge}>
                          <Check size={12} color={DesignTokens.text.onPrimary} strokeWidth={3} />
                        </View>
                      )}
                      
                      {/* Illustration */}
                      <View style={styles.imageContainer}>
                        <Image
                          source={goal.image}
                          style={styles.cardImage}
                          resizeMode="cover"
                        />
                      </View>
                      
                      {/* Labels */}
                      <Text style={[
                        styles.cardLabel,
                        isSelected && styles.cardLabelSelected,
                      ]}>
                        {goal.label}
                      </Text>
                      <Text style={styles.cardSublabel}>
                        {goal.sublabel}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Continue Button - Only when user commits */}
          {selectedGoals.length > 0 && (
            <Animated.View style={styles.buttonContainer}>
              <Pressable
                onPress={handleContinue}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </Pressable>
            </Animated.View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    borderColor: DesignTokens.border.subtle, // Barely visible
    overflow: 'hidden',
    position: 'relative',
  },
  cardSelected: {
    // Thin emerald border - acknowledgment, not activation
    borderColor: DesignTokens.accent.emerald,
    borderWidth: 1.5,
    // Very subtle glow - no loud shadows
  },
  checkBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DesignTokens.accent.emerald, // Emerald for selected state
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
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  cardLabelSelected: {
    color: DesignTokens.text.heading, // Same color - subtle
  },
  cardSublabel: {
    fontSize: 11,
    color: DesignTokens.text.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  buttonContainer: {
    paddingVertical: Spacing.lg,
  },
  button: {
    backgroundColor: DesignTokens.accent.primary, // Khaki - ritual use
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    // No heavy shadows - calm design
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
