import { useEffect, useState } from 'react';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { DesignTokens } from '@/constants/theme';
import { isOnboardingCompleted } from '@/services/storage';

// Custom dark theme matching design system
const HushuDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: DesignTokens.accent.gold,
    background: DesignTokens.background.primary,
    card: DesignTokens.background.surface,
    text: DesignTokens.text.heading,
    border: DesignTokens.border.subtle,
  },
};

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inOnboarding = segments[0] === 'onboarding';
    
    if (!hasCompletedOnboarding && !inOnboarding) {
      // Redirect to onboarding if not completed
      router.replace('/onboarding');
    } else if (hasCompletedOnboarding && inOnboarding) {
      // Redirect to main app if onboarding is already completed
      router.replace('/(tabs)');
    }
  }, [isLoading, hasCompletedOnboarding, segments, router]);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await isOnboardingCompleted();
      setHasCompletedOnboarding(completed);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={DesignTokens.accent.gold} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <ThemeProvider value={HushuDarkTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignTokens.background.primary,
  },
});
