/**
 * Onboarding Stack Navigator Layout
 * Linear flow through all onboarding screens
 */

import { Stack } from 'expo-router';
import { DesignTokens } from '@/constants/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: DesignTokens.background.primary,
        },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="emotional-checkin" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="content" />
      <Stack.Screen name="commitment" />
      <Stack.Screen name="loading" />
    </Stack>
  );
}
