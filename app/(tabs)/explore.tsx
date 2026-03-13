/**
 * Explore Screen - Structured Exploration
 * As per MVP Product Plan Section 4.3
 *
 * Purpose: Allow users to explore content without overwhelming them
 */

import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';
import {
  BookOpen,
  Calendar,
  HandHeart,
  Headphones,
  Moon,
  Users,
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

const CATEGORIES = [
  {
    id: 'quran',
    name: "Qur'an",
    description: 'Daily readings and reflections',
    icon: BookOpen,
  },
  {
    id: 'duas',
    name: 'Duas',
    description: 'Prayers for every moment',
    icon: HandHeart,
  },
  {
    id: 'prophets',
    name: 'Stories of the Prophets',
    description: 'Wisdom from their journeys',
    icon: Users,
  },
  {
    id: 'special-days',
    name: 'Special Days',
    description: 'Ramadan, Eid, and more',
    icon: Calendar,
  },
  {
    id: 'listen',
    name: 'Listen',
    description: 'Audio recitations and talks',
    icon: Headphones,
  },
  {
    id: 'calm',
    name: 'Calm / Night',
    description: 'Peaceful content for reflection',
    icon: Moon,
  },
];

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Explore</Text>
            <Text style={styles.subtitle}>Explore at your own pace</Text>
          </View>

          <View style={styles.grid}>
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <Pressable key={category.id} style={styles.categoryCard}>
                  <View style={styles.iconContainer}>
                    <IconComponent
                      size={28}
                      color={DesignTokens.accent.primary}
                      strokeWidth={1.5}
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </Pressable>
              );
            })}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: DesignTokens.accent.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignTokens.text.heading,
    marginBottom: Spacing.xs,
  },
  categoryDescription: {
    fontSize: 13,
    color: DesignTokens.text.body,
    lineHeight: 18,
  },
});
