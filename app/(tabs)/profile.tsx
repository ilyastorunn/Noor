/**
 * Profile Screen - Personal Space
 * As per MVP Product Plan Section 4.4
 * 
 * Purpose: Give users control without complexity
 * 
 * Sections:
 * 1. Streak Overview - Daily completion status
 * 2. Favorites (UI Only) - Placeholder
 * 3. Downloads (UI Only) - Placeholder
 * 4. Notification Preferences - Prayer times (on/off), Daily reading reminder (on/off)
 * 5. Mood History (Basic) - Last recorded mood
 */

import { commitmentLabels, contentLabels, emotionalStateContent, formatLabelList, goalLabels } from '@/constants/onboarding';
import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';
import { getOnboardingData } from '@/services/storage';
import type { OnboardingData } from '@/types/onboarding';
import {
    Bell,
    BookOpen,
    ChevronRight,
    Clock,
    Download,
    Flame,
    Heart,
    Smile,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  // Notification preferences state
  const [prayerNotifications, setPrayerNotifications] = useState(true);
  const [readingReminder, setReadingReminder] = useState(true);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOnboardingData() {
      const data = await getOnboardingData();
      if (isMounted) {
        setOnboardingData(data);
      }
    }

    loadOnboardingData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Mock data for MVP
  const streakDays = 7;
  const lastMood = onboardingData?.emotionalState
    ? emotionalStateContent[onboardingData.emotionalState].label
    : 'Not selected yet';
  const lastMoodDate = onboardingData?.completedAt
    ? new Date(onboardingData.completedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Complete onboarding to personalize this space.';
  const commitmentSummary = onboardingData?.commitment
    ? commitmentLabels[onboardingData.commitment]
    : 'Choose a daily rhythm to guide your practice.';
  const goalSummary = formatLabelList(
    onboardingData?.goals ?? [],
    goalLabels,
    'No goals selected yet.',
  );
  const contentSummary = formatLabelList(
    onboardingData?.preferredContent ?? [],
    contentLabels,
    'No preferred content selected yet.',
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your Space</Text>
          </View>

          {/* Streak Overview */}
          <View style={styles.streakCard}>
            <View style={styles.streakIcon}>
              <Flame size={32} color={DesignTokens.accent.primary} />
            </View>
            <View style={styles.streakContent}>
              <Text style={styles.streakNumber}>{streakDays}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
            <Text style={styles.streakMessage}>
              You&apos;ve been consistent for a week. Keep going.
            </Text>
          </View>

          <View style={styles.profileSummaryCard}>
            <Text style={styles.profileSummaryLabel}>Your Daily Rhythm</Text>
            <Text style={styles.profileSummaryValue}>{commitmentSummary}</Text>
            <Text style={styles.profileSummaryMeta}>{goalSummary}</Text>
            <Text style={styles.profileSummaryMeta}>{contentSummary}</Text>
          </View>

          {/* Favorites - Placeholder */}
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Heart size={22} color={DesignTokens.text.body} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Favorites</Text>
              <Text style={styles.menuItemSubtitle}>Your saved content</Text>
            </View>
            <ChevronRight size={20} color={DesignTokens.text.muted} />
          </Pressable>

          {/* Downloads - Placeholder */}
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Download size={22} color={DesignTokens.text.body} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Downloads</Text>
              <Text style={styles.menuItemSubtitle}>Available offline</Text>
            </View>
            <ChevronRight size={20} color={DesignTokens.text.muted} />
          </Pressable>

          {/* Notification Preferences */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={18} color={DesignTokens.text.muted} />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>

            <View style={styles.toggleItem}>
              <View style={styles.toggleContent}>
                <Clock size={20} color={DesignTokens.text.body} />
                <Text style={styles.toggleLabel}>Prayer Times</Text>
              </View>
              <Switch
                value={prayerNotifications}
                onValueChange={setPrayerNotifications}
                trackColor={{ 
                  false: DesignTokens.border.light, 
                  true: DesignTokens.accent.emerald 
                }}
                thumbColor={prayerNotifications 
                  ? DesignTokens.accent.primary 
                  : DesignTokens.text.muted
                }
              />
            </View>

            <View style={styles.toggleItem}>
              <View style={styles.toggleContent}>
                <BookOpen size={20} color={DesignTokens.text.body} />
                <Text style={styles.toggleLabel}>Daily Reading Reminder</Text>
              </View>
              <Switch
                value={readingReminder}
                onValueChange={setReadingReminder}
                trackColor={{ 
                  false: DesignTokens.border.light, 
                  true: DesignTokens.accent.emerald 
                }}
                thumbColor={readingReminder 
                  ? DesignTokens.accent.primary 
                  : DesignTokens.text.muted
                }
              />
            </View>
          </View>

          {/* Mood History */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Smile size={18} color={DesignTokens.text.muted} />
              <Text style={styles.sectionTitle}>Mood History</Text>
            </View>

            <View style={styles.moodCard}>
              <Text style={styles.moodLabel}>Last recorded</Text>
              <Text style={styles.moodValue}>{lastMood}</Text>
              <Text style={styles.moodDate}>{lastMoodDate}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.background.primary,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: DesignTokens.text.heading,
    fontFamily: 'serif',
  },
  // Streak Card
  streakCard: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DesignTokens.accent.emerald,
  },
  streakIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: DesignTokens.accent.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  streakContent: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '600',
    color: DesignTokens.accent.primary,
  },
  streakLabel: {
    fontSize: 14,
    color: DesignTokens.text.body,
    marginTop: Spacing.xs,
  },
  streakMessage: {
    fontSize: 14,
    color: DesignTokens.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  profileSummaryCard: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  profileSummaryLabel: {
    fontSize: 12,
    color: DesignTokens.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileSummaryValue: {
    fontSize: 22,
    fontWeight: '600',
    color: DesignTokens.text.heading,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  profileSummaryMeta: {
    fontSize: 14,
    color: DesignTokens.text.body,
    lineHeight: 20,
  },
  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: DesignTokens.accent.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: DesignTokens.text.heading,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: DesignTokens.text.muted,
    marginTop: 2,
  },
  // Sections
  section: {
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingLeft: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DesignTokens.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: Spacing.sm,
  },
  // Toggle Items
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    color: DesignTokens.text.heading,
    marginLeft: Spacing.md,
  },
  // Mood Card
  moodCard: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  moodLabel: {
    fontSize: 12,
    color: DesignTokens.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moodValue: {
    fontSize: 24,
    fontWeight: '500',
    color: DesignTokens.accent.primary,
    marginTop: Spacing.sm,
  },
  moodDate: {
    fontSize: 14,
    color: DesignTokens.text.body,
    marginTop: Spacing.xs,
  },
});
