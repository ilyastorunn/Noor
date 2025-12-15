/**
 * Onboarding Types
 */

export type EmotionalState = 'anxious' | 'seeking' | 'grateful' | 'weary';

export type Goal =
  | 'grow-closer'
  | 'find-peace'
  | 'sleep-better'
  | 'focus-prayer'
  | 'connect-quran';

export type ContentType = 'meditations' | 'sleep-stories' | 'dhikr-dua' | 'quran';

export type Commitment = '5min' | '15min' | '30min';

export interface OnboardingData {
  emotionalState: EmotionalState | null;
  goals: Goal[];
  preferredContent: ContentType[];
  commitment: Commitment | null;
  completedAt: string | null;
}

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  emotionalState: null,
  goals: [],
  preferredContent: [],
  commitment: null,
  completedAt: null,
};
