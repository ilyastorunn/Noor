/**
 * AsyncStorage Service
 * Handles persistence of user data before auth
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingData, INITIAL_ONBOARDING_DATA } from '@/types/onboarding';

const STORAGE_KEYS = {
  ONBOARDING_DATA: '@hushu/onboarding_data',
  ONBOARDING_COMPLETED: '@hushu/onboarding_completed',
};

/**
 * Save onboarding data to AsyncStorage
 */
export async function saveOnboardingData(data: Partial<OnboardingData>): Promise<void> {
  try {
    const existingData = await getOnboardingData();
    const updatedData = { ...existingData, ...data };
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Failed to save onboarding data:', error);
  }
}

/**
 * Get onboarding data from AsyncStorage
 */
export async function getOnboardingData(): Promise<OnboardingData> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
    if (data) {
      return JSON.parse(data);
    }
    return INITIAL_ONBOARDING_DATA;
  } catch (error) {
    console.error('Failed to get onboarding data:', error);
    return INITIAL_ONBOARDING_DATA;
  }
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(): Promise<void> {
  try {
    await saveOnboardingData({ completedAt: new Date().toISOString() });
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  } catch (error) {
    console.error('Failed to complete onboarding:', error);
  }
}

/**
 * Check if onboarding has been completed
 */
export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed === 'true';
  } catch (error) {
    console.error('Failed to check onboarding status:', error);
    return false;
  }
}

/**
 * Clear all onboarding data (for testing/reset)
 */
export async function clearOnboardingData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ONBOARDING_DATA,
      STORAGE_KEYS.ONBOARDING_COMPLETED,
    ]);
  } catch (error) {
    console.error('Failed to clear onboarding data:', error);
  }
}
