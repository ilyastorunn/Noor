/**
 * Home Screen - The Heart of the App
 * As per MVP Product Plan Section 4.1
 * 
 * Purpose: Provide daily spiritual direction with minimal effort
 * 
 * Primary Sections (Vertical Order):
 * 1. Daily Verse / Dua (Hero Section)
 * 2. Today's Path (Mood-Based Guidance)
 * 3. Prayer Times
 * 4. Qibla Direction
 * 5. Listen
 * 6. Upcoming Special Day
 * 
 * OUT OF SCOPE (MVP):
 * - Social features
 * - Gamification
 * - Leaderboards
 */

import {
  commitmentLabels,
  contentLabels,
  emotionalStateContent,
  formatLabelList,
  goalLabels,
} from '@/constants/onboarding';
import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';
import { getOnboardingData } from '@/services/storage';
import type { OnboardingData } from '@/types/onboarding';
import { useRouter } from 'expo-router';
import {
    BookOpen,
    Calendar,
    ChevronRight,
    Compass,
    Headphones,
    MapPin,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for MVP
const DAILY_VERSE = {
  text: '"Verily, in the remembrance of Allah do hearts find rest."',
  source: 'Surah Ar-Ra\'d 13:28',
  isCompleted: false,
};

// Prayer times (placeholder - location-based logic later)
const PRAYER_TIMES = [
  { name: 'Fajr', time: '06:15', isPast: true },
  { name: 'Sunrise', time: '07:45', isPast: true },
  { name: 'Dhuhr', time: '12:30', isPast: false, isCurrent: true },
  { name: 'Asr', time: '15:00', isPast: false },
  { name: 'Maghrib', time: '17:30', isPast: false },
  { name: 'Isha', time: '19:00', isPast: false },
];

// Upcoming special day
const UPCOMING_SPECIAL_DAY = {
  name: 'Ramadan',
  daysUntil: 45,
  description: 'The blessed month of fasting',
};

export default function HomeScreen() {
  const router = useRouter();
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

  const currentPrayer = PRAYER_TIMES.find((prayer) => prayer.isCurrent);
  const emotionalState = onboardingData?.emotionalState ?? 'seeking';
  const emotionalStateDetails = emotionalStateContent[emotionalState];
  const primaryGoal = onboardingData?.goals[0];
  const primaryContent = onboardingData?.preferredContent[0];
  const personalizedPath = [
    emotionalStateDetails.pathActions[0],
    primaryGoal
      ? `Lean into ${goalLabels[primaryGoal]}.`
      : emotionalStateDetails.pathActions[1],
    onboardingData?.commitment
      ? `Protect your ${commitmentLabels[onboardingData.commitment].toLowerCase()}.`
      : primaryContent
        ? `Spend a few minutes with ${contentLabels[primaryContent]}.`
        : emotionalStateDetails.pathActions[2],
  ];
  const preferenceSummary = formatLabelList(
    onboardingData?.preferredContent ?? [],
    contentLabels,
    'Your selections will shape the guidance shown here.',
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
            <Text style={styles.greeting}>Assalamu Alaikum</Text>
            <Text style={styles.subtitle}>May peace be upon you</Text>
          </View>

          <View style={styles.moodCard}>
            <Text style={styles.moodLabel}>Current State</Text>
            <Text style={styles.moodValue}>{emotionalStateDetails.label}</Text>
            <Text style={styles.moodSupport}>{emotionalStateDetails.support}</Text>
          </View>

          {/* 1. Daily Verse / Dua (Hero Section) */}
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>Today&apos;s Reading</Text>
            <Text style={styles.heroText}>{DAILY_VERSE.text}</Text>
            <Text style={styles.heroSource}>{DAILY_VERSE.source}</Text>
            <Pressable 
              style={styles.heroButton}
              onPress={() => router.push('/(tabs)/quran')}
            >
              <BookOpen size={18} color={DesignTokens.text.onPrimary} />
              <Text style={styles.heroButtonText}>Read</Text>
            </Pressable>
          </View>

          {/* 2. Today's Path (Mood-Based Guidance) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today&apos;s Path</Text>
            <View style={styles.pathCard}>
              <Text style={styles.pathIntro}>{preferenceSummary}</Text>
              {personalizedPath.map((action, index) => (
                <View key={index} style={styles.pathItem}>
                  <View style={styles.pathDot} />
                  <Text style={styles.pathText}>{action}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 3. Prayer Times */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prayer Times</Text>
            <View style={styles.prayerCard}>
              <View style={styles.prayerHeader}>
                <View style={styles.prayerHeaderCopy}>
                  <MapPin size={16} color={DesignTokens.text.muted} />
                  <Text style={styles.prayerLocation}>Your Location</Text>
                </View>
                {currentPrayer ? (
                  <Text style={styles.prayerCurrent}>
                    {currentPrayer.name} • {currentPrayer.time}
                  </Text>
                ) : null}
              </View>
              <View style={styles.prayerGrid}>
                {PRAYER_TIMES.map((prayer) => (
                  <View 
                    key={prayer.name} 
                    style={[
                      styles.prayerItem,
                      prayer.isCurrent && styles.prayerItemCurrent,
                    ]}
                  >
                    <Text style={[
                      styles.prayerName,
                      prayer.isPast && styles.prayerPast,
                      prayer.isCurrent && styles.prayerNameCurrent,
                    ]}>
                      {prayer.name}
                    </Text>
                    <Text style={[
                      styles.prayerTime,
                      prayer.isPast && styles.prayerPast,
                      prayer.isCurrent && styles.prayerTimeCurrent,
                    ]}>
                      {prayer.time}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 4. Qibla Direction */}
          <View style={styles.section}>
            <View style={styles.qiblaCard}>
              <View style={styles.qiblaContent}>
                <Compass size={28} color={DesignTokens.accent.primary} />
                <View style={styles.qiblaText}>
                  <Text style={styles.qiblaTitle}>Qibla Direction</Text>
                  <Text style={styles.qiblaSubtitle}>Find your direction to Mecca</Text>
                </View>
              </View>
              <ChevronRight size={20} color={DesignTokens.text.muted} />
            </View>
          </View>

          {/* 5. Listen */}
          <View style={styles.section}>
            <Pressable 
              style={styles.listenCard}
              onPress={() => router.push('/(tabs)/listen')}
            >
              <View style={styles.listenIcon}>
                <Headphones size={24} color={DesignTokens.accent.primary} />
              </View>
              <View style={styles.listenContent}>
                <Text style={styles.listenTitle}>Listen</Text>
                <Text style={styles.listenSubtitle}>
                  Recitations, talks, and peaceful content
                </Text>
              </View>
              <ChevronRight size={20} color={DesignTokens.text.muted} />
            </Pressable>
          </View>

          {/* 6. Upcoming Special Day */}
          <View style={styles.section}>
            <View style={styles.specialDayCard}>
              <View style={styles.specialDayIcon}>
                <Calendar size={24} color={DesignTokens.accent.primary} />
              </View>
              <View style={styles.specialDayContent}>
                <Text style={styles.specialDayLabel}>Coming Up</Text>
                <Text style={styles.specialDayName}>
                  {UPCOMING_SPECIAL_DAY.name}
                </Text>
                <Text style={styles.specialDayInfo}>
                  {UPCOMING_SPECIAL_DAY.daysUntil} days • {UPCOMING_SPECIAL_DAY.description}
                </Text>
              </View>
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
  // Header
  header: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300',
    color: DesignTokens.text.heading,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 14,
    color: DesignTokens.text.body,
    marginTop: Spacing.xs,
  },
  moodCard: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
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
    fontSize: 22,
    fontWeight: '600',
    color: DesignTokens.text.heading,
    marginTop: Spacing.sm,
  },
  moodSupport: {
    fontSize: 14,
    color: DesignTokens.text.body,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  // Hero Card (Daily Verse)
  heroCard: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.accent.emerald,
  },
  heroLabel: {
    fontSize: 12,
    color: DesignTokens.accent.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  heroText: {
    fontSize: 20,
    color: DesignTokens.text.heading,
    fontStyle: 'italic',
    lineHeight: 30,
    fontFamily: 'serif',
  },
  heroSource: {
    fontSize: 14,
    color: DesignTokens.text.body,
    marginTop: Spacing.md,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.accent.primary,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignTokens.text.onPrimary,
  },
  // Sections
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DesignTokens.text.heading,
    marginBottom: Spacing.md,
  },
  // Today's Path
  pathCard: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  pathIntro: {
    fontSize: 14,
    color: DesignTokens.text.body,
    marginBottom: Spacing.md,
  },
  pathItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  pathDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DesignTokens.accent.primary,
    marginRight: Spacing.md,
  },
  pathText: {
    fontSize: 16,
    color: DesignTokens.text.heading,
  },
  // Prayer Times
  prayerCard: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  prayerHeaderCopy: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerLocation: {
    fontSize: 12,
    color: DesignTokens.text.muted,
    marginLeft: Spacing.xs,
  },
  prayerCurrent: {
    fontSize: 12,
    color: DesignTokens.accent.primary,
  },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  prayerItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  prayerItemCurrent: {
    backgroundColor: DesignTokens.accent.emerald,
    borderRadius: BorderRadius.md,
  },
  prayerName: {
    fontSize: 12,
    color: DesignTokens.text.body,
    marginBottom: Spacing.xs,
  },
  prayerNameCurrent: {
    color: DesignTokens.accent.primary,
    fontWeight: '600',
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignTokens.text.heading,
  },
  prayerTimeCurrent: {
    color: DesignTokens.accent.primary,
  },
  prayerPast: {
    opacity: 0.5,
  },
  // Qibla
  qiblaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  qiblaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qiblaText: {
    marginLeft: Spacing.md,
  },
  qiblaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignTokens.text.heading,
  },
  qiblaSubtitle: {
    fontSize: 13,
    color: DesignTokens.text.body,
    marginTop: 2,
  },
  // Listen
  listenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  listenIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: DesignTokens.accent.emerald,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listenContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  listenTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignTokens.text.heading,
  },
  listenSubtitle: {
    fontSize: 13,
    color: DesignTokens.text.body,
    marginTop: 2,
  },
  // Special Day
  specialDayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  specialDayIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: DesignTokens.accent.emerald,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialDayContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  specialDayLabel: {
    fontSize: 11,
    color: DesignTokens.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  specialDayName: {
    fontSize: 18,
    fontWeight: '600',
    color: DesignTokens.accent.primary,
    marginTop: 2,
  },
  specialDayInfo: {
    fontSize: 13,
    color: DesignTokens.text.body,
    marginTop: 2,
  },
});
