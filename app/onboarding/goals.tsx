/**
 * Screen 3: Goals Selection
 * Vertical list of selectable pill-shaped items (multi-select)
 */

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { DesignTokens, BorderRadius, Spacing } from '@/constants/theme';
import { saveOnboardingData } from '@/services/storage';
import type { Goal } from '@/types/onboarding';

interface GoalOption {
  id: Goal;
  label: string;
}

const goalOptions: GoalOption[] = [
  { id: 'grow-closer', label: 'Grow Closer to Allah' },
  { id: 'find-peace', label: 'Find Peace & Patience (Sabr)' },
  { id: 'sleep-better', label: 'Sleep Better (Sunnah Routine)' },
  { id: 'focus-prayer', label: 'Focus in Prayer (Khushu)' },
  { id: 'connect-quran', label: 'Connect with the Quran' },
];

export default function GoalsScreen() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const toggleGoal = async (goalId: Goal) => {
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
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveOnboardingData({ goals: selectedGoals });

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/content');
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
            <Text style={styles.title}>What brings you here today?</Text>
            <Text style={styles.subtitle}>Choose as many as you like.</Text>
          </View>

          {/* Goals List */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {goalOptions.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <Pressable
                  key={goal.id}
                  onPress={() => toggleGoal(goal.id)}
                  style={({ pressed }) => [
                    styles.goalPill,
                    isSelected && styles.goalPillSelected,
                    pressed && styles.goalPillPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.goalLabel,
                      isSelected && styles.goalLabelSelected,
                    ]}
                  >
                    {goal.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Check size={18} color={DesignTokens.background.primary} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Continue Button */}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DesignTokens.background.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  goalPillSelected: {
    backgroundColor: DesignTokens.accent.gold,
    borderColor: DesignTokens.accent.gold,
  },
  goalPillPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  goalLabel: {
    fontSize: 16,
    color: DesignTokens.text.heading,
    flex: 1,
  },
  goalLabelSelected: {
    color: DesignTokens.background.primary,
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: Spacing.sm,
  },
  buttonContainer: {
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
