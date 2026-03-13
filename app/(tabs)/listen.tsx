/**
 * Listen Screen - Audio Content Hub
 * As per MVP Product Plan Section 4.3
 * 
 * Purpose: Central hub for audio content
 * 
 * Sections:
 * - Prophet Stories (episodes)
 * - Duas (audio recitations)
 * 
 * OUT OF SCOPE (MVP):
 * - Streaming playback
 * - Offline downloads
 * - Background audio
 */

import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';
import {
    BookOpen,
    HandHeart,
    Headphones,
    Lock,
    Play,
} from 'lucide-react-native';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder story data
const PROPHET_STORIES = [
  {
    id: 'nuh',
    name: 'Prophet Nuh',
    subtitle: 'Patience in Hardship',
    episodes: 5,
    freeEpisodes: 2,
  },
  {
    id: 'ibrahim',
    name: 'Prophet Ibrahim',
    subtitle: 'Journey to Faith',
    episodes: 5,
    freeEpisodes: 2,
  },
  {
    id: 'musa',
    name: 'Prophet Musa',
    subtitle: 'Courage & Trust',
    episodes: 5,
    freeEpisodes: 2,
  },
  {
    id: 'yusuf',
    name: 'Prophet Yusuf',
    subtitle: 'Beauty Through Patience',
    episodes: 5,
    freeEpisodes: 2,
  },
  {
    id: 'isa',
    name: 'Prophet Isa',
    subtitle: 'Mercy & Miracles',
    episodes: 5,
    freeEpisodes: 2,
  },
];

// Placeholder dua data
const DUAS = [
  { id: 'morning', name: 'Morning Duas', count: 3 },
  { id: 'evening', name: 'Evening Duas', count: 3 },
  { id: 'sleep', name: 'Sleep Duas', count: 2 },
  { id: 'meal', name: 'Meal Duas', count: 2 },
];

export default function ListenScreen() {
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
            <Text style={styles.title}>Listen</Text>
            <Text style={styles.subtitle}>
              Stories, duas, and peaceful recitations
            </Text>
          </View>

          {/* Prophet Stories Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={18} color={DesignTokens.text.muted} strokeWidth={1.5} />
              <Text style={styles.sectionTitle}>Stories of the Prophets</Text>
            </View>

            {PROPHET_STORIES.map((story) => (
              <Pressable key={story.id} style={styles.storyCard}>
                <View style={styles.storyIcon}>
                  <Headphones size={22} color={DesignTokens.accent.primary} strokeWidth={1.5} />
                </View>
                <View style={styles.storyContent}>
                  <Text style={styles.storyName}>{story.name}</Text>
                  <Text style={styles.storySubtitle}>{story.subtitle}</Text>
                  <Text style={styles.storyEpisodes}>
                    {story.freeEpisodes} free / {story.episodes} episodes
                  </Text>
                </View>
                <Play size={20} color={DesignTokens.text.muted} strokeWidth={1.5} />
              </Pressable>
            ))}
          </View>

          {/* Duas Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HandHeart size={18} color={DesignTokens.text.muted} strokeWidth={1.5} />
              <Text style={styles.sectionTitle}>Duas</Text>
            </View>

            <View style={styles.duaGrid}>
              {DUAS.map((dua) => (
                <Pressable key={dua.id} style={styles.duaCard}>
                  <Text style={styles.duaName}>{dua.name}</Text>
                  <Text style={styles.duaCount}>{dua.count} duas</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Premium Teaser */}
          <View style={styles.premiumCard}>
            <Lock size={20} color={DesignTokens.accent.primary} strokeWidth={1.5} />
            <View style={styles.premiumContent}>
              <Text style={styles.premiumTitle}>Unlock All Stories</Text>
              <Text style={styles.premiumSubtitle}>
                Get full access to all episodes and offline listening
              </Text>
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
  subtitle: {
    fontSize: 16,
    color: DesignTokens.text.body,
    marginTop: Spacing.sm,
  },
  // Sections
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DesignTokens.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: Spacing.sm,
  },
  // Story Cards
  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  storyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: DesignTokens.accent.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  storyContent: {
    flex: 1,
  },
  storyName: {
    fontSize: 16,
    fontWeight: '500',
    color: DesignTokens.text.heading,
  },
  storySubtitle: {
    fontSize: 13,
    color: DesignTokens.text.body,
    marginTop: 2,
  },
  storyEpisodes: {
    fontSize: 11,
    color: DesignTokens.text.muted,
    marginTop: 4,
  },
  // Dua Grid
  duaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  duaCard: {
    width: '48%',
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  duaName: {
    fontSize: 15,
    fontWeight: '500',
    color: DesignTokens.text.heading,
    marginBottom: Spacing.xs,
  },
  duaCount: {
    fontSize: 12,
    color: DesignTokens.text.muted,
  },
  // Premium Card
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.accent.emerald,
    marginBottom: Spacing.lg,
  },
  premiumContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignTokens.accent.primary,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: DesignTokens.text.body,
    marginTop: 2,
  },
});
