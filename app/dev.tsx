/**
 * Dev Tools Screen
 * Development-only page for testing and debugging
 * 
 * Access via: expo://localhost:8081/dev
 */

import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';
import {
    clearOnboardingData,
    completeOnboarding,
    getOnboardingData
} from '@/services/storage';
import { useRouter } from 'expo-router';
import {
    AlertTriangle,
    CheckCircle,
    Home,
    RotateCcw,
} from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DevToolsScreen() {
  const router = useRouter();

  const handleSkipToHome = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleResetOnboarding = async () => {
    await clearOnboardingData();
    Alert.alert('Reset Complete', 'Onboarding data has been cleared. Restart the app to see onboarding again.');
  };

  const handleViewOnboardingData = async () => {
    const data = await getOnboardingData();
    Alert.alert('Onboarding Data', JSON.stringify(data, null, 2));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <AlertTriangle size={32} color={DesignTokens.accent.earth} />
            <Text style={styles.title}>Dev Tools</Text>
            <Text style={styles.subtitle}>
              Development-only navigation helpers
            </Text>
          </View>

          {/* Warning */}
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              ⚠️ This page is for development only.{'\n'}
              Remove or hide before production.
            </Text>
          </View>

          {/* Navigation Actions */}
          <Text style={styles.sectionTitle}>Quick Navigation</Text>

          <Pressable 
            style={styles.actionButton}
            onPress={handleSkipToHome}
          >
            <View style={styles.actionIcon}>
              <Home size={24} color={DesignTokens.accent.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Skip to Home</Text>
              <Text style={styles.actionSubtitle}>
                Complete onboarding and go to main app
              </Text>
            </View>
          </Pressable>

          <Pressable 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)')}
          >
            <View style={styles.actionIcon}>
              <CheckCircle size={24} color={DesignTokens.accent.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Go to Tabs (Direct)</Text>
              <Text style={styles.actionSubtitle}>
                Navigate without marking onboarding complete
              </Text>
            </View>
          </Pressable>

          {/* Data Actions */}
          <Text style={styles.sectionTitle}>Data Management</Text>

          <Pressable 
            style={styles.actionButton}
            onPress={handleResetOnboarding}
          >
            <View style={[styles.actionIcon, styles.destructiveIcon]}>
              <RotateCcw size={24} color={DesignTokens.accent.earth} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Reset Onboarding</Text>
              <Text style={styles.actionSubtitle}>
                Clear all onboarding data and start fresh
              </Text>
            </View>
          </Pressable>

          <Pressable 
            style={styles.actionButton}
            onPress={handleViewOnboardingData}
          >
            <View style={styles.actionIcon}>
              <AlertTriangle size={24} color={DesignTokens.text.muted} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Onboarding Data</Text>
              <Text style={styles.actionSubtitle}>
                Show stored onboarding selections
              </Text>
            </View>
          </Pressable>

          {/* Screen Links */}
          <Text style={styles.sectionTitle}>Individual Screens</Text>

          <View style={styles.screenGrid}>
            <Pressable 
              style={styles.screenButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.screenButtonText}>Home</Text>
            </Pressable>
            <Pressable 
              style={styles.screenButton}
              onPress={() => router.push('/(tabs)/quran')}
            >
              <Text style={styles.screenButtonText}>Qur&apos;an</Text>
            </Pressable>
            <Pressable 
              style={styles.screenButton}
              onPress={() => router.push('/(tabs)/listen')}
            >
              <Text style={styles.screenButtonText}>Listen</Text>
            </Pressable>
            <Pressable 
              style={styles.screenButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Text style={styles.screenButtonText}>Explore</Text>
            </Pressable>
            <Pressable 
              style={styles.screenButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text style={styles.screenButtonText}>Profile</Text>
            </Pressable>
          </View>

          {/* Onboarding Screens */}
          <Text style={styles.sectionTitle}>Onboarding Screens</Text>

          <View style={styles.screenGrid}>
            <Pressable 
              style={styles.screenButton}
              onPress={() => router.push('/onboarding')}
            >
              <Text style={styles.screenButtonText}>Welcome</Text>
            </Pressable>
            <Pressable 
              style={styles.screenButton}
              onPress={() => router.push('/onboarding/goals')}
            >
              <Text style={styles.screenButtonText}>Goals</Text>
            </Pressable>
            <Pressable 
              style={styles.screenButton}
              onPress={() => router.push('/onboarding/emotional-checkin')}
            >
              <Text style={styles.screenButtonText}>Mood</Text>
            </Pressable>
            <Pressable 
              style={styles.screenButton}
              onPress={() => router.push('/onboarding/content')}
            >
              <Text style={styles.screenButtonText}>Content</Text>
            </Pressable>
            <Pressable 
              style={styles.screenButton}
              onPress={() => router.push('/onboarding/commitment')}
            >
              <Text style={styles.screenButtonText}>Commit</Text>
            </Pressable>
            <Pressable 
              style={styles.screenButton}
              onPress={() => router.push('/onboarding/loading')}
            >
              <Text style={styles.screenButtonText}>Loading</Text>
            </Pressable>
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
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: DesignTokens.text.heading,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: DesignTokens.text.muted,
    marginTop: Spacing.xs,
  },
  warningCard: {
    backgroundColor: 'rgba(187, 104, 48, 0.15)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: DesignTokens.accent.earth,
  },
  warningText: {
    fontSize: 14,
    color: DesignTokens.accent.earth,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DesignTokens.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: DesignTokens.accent.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  destructiveIcon: {
    backgroundColor: 'rgba(187, 104, 48, 0.2)',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignTokens.text.heading,
  },
  actionSubtitle: {
    fontSize: 13,
    color: DesignTokens.text.muted,
    marginTop: 2,
  },
  screenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  screenButton: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  screenButtonText: {
    fontSize: 14,
    color: DesignTokens.text.heading,
    fontWeight: '500',
  },
});
