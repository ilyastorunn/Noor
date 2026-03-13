import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { DesignTokens } from '@/constants/theme';
import { completeOnboarding as completeOnboardingStorage, isOnboardingCompleted } from '@/services/storage';

// ============================================================
// DEV MODE - Set to true to skip onboarding and go directly to Home
// ============================================================
const DEV_MODE_SKIP_ONBOARDING = false;

// Custom dark theme matching design system
const HushuDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: DesignTokens.accent.primary,
    background: DesignTokens.background.primary,
    card: DesignTokens.background.surface,
    text: DesignTokens.text.heading,
    border: DesignTokens.border.subtle,
  },
};

// Context so child screens (e.g. loading.tsx) can mark onboarding complete
// and have the root layout react immediately without an AsyncStorage re-read.
interface OnboardingContextType {
  markOnboardingComplete: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType>({
  markOnboardingComplete: async () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);

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
    const inTabs = segments[0] === '(tabs)';
    const inDevTools = segments[0] === 'dev';
    const inAuth = String(segments[0] ?? '') === 'auth';

    if (!hasCompletedOnboarding && !inOnboarding && !inDevTools && !inAuth) {
      // Not onboarded yet — go to onboarding
      router.replace('/onboarding');
    } else if (hasCompletedOnboarding && !inTabs && !inDevTools && !inAuth) {
      // Onboarded but not in tabs (e.g. stuck on index or still in onboarding) — go to tabs
      router.replace('/(tabs)');
    }
  }, [isLoading, hasCompletedOnboarding, segments, router]);

  const checkOnboardingStatus = async () => {
    try {
      if (DEV_MODE_SKIP_ONBOARDING) {
        await completeOnboardingStorage();
        setHasCompletedOnboarding(true);
        setIsLoading(false);
        return;
      }
      
      const completed = await isOnboardingCompleted();
      setHasCompletedOnboarding(completed);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Called by loading.tsx — writes to AsyncStorage AND updates React state
  const markOnboardingComplete = useCallback(async () => {
    await completeOnboardingStorage();
    setHasCompletedOnboarding(true);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={DesignTokens.accent.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <OnboardingContext.Provider value={{ markOnboardingComplete }}>
        <ThemeProvider value={HushuDarkTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="auth"
              options={{
                presentation: 'modal',
              }}
            />
            <Stack.Screen name="dev" />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </OnboardingContext.Provider>
    </AuthProvider>
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
