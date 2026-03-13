import type { OnboardingData } from '@/types/onboarding';

export interface AuthenticatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface QuranLastRead {
  chapterId: number;
  verseKey: string;
  verseNumber: number;
  apiPage: number;
  updatedAt: string;
}

export interface QuranLastListened {
  chapterId: number;
  reciterId: number;
  positionSec: number;
  updatedAt: string;
}

export type QuranBookmarkType = 'surah' | 'ayah';

export interface QuranBookmark {
  id: string;
  type: QuranBookmarkType;
  chapterId: number;
  chapterName: string;
  verseKey?: string;
  verseNumber?: number;
  createdAt: string;
}

export interface UserOnboardingProfile {
  completed: boolean;
  completedAt: string | null;
  emotionalState: OnboardingData['emotionalState'];
  goals: OnboardingData['goals'];
  preferredContent: OnboardingData['preferredContent'];
  dailyCommitment: OnboardingData['commitment'];
}

export interface UserQuranProfile {
  lastRead: QuranLastRead | null;
  lastListened: QuranLastListened | null;
}

export interface HushuUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt: string;
  lastActive: string;
  isPremium: boolean;
  onboarding: UserOnboardingProfile | null;
  quran: UserQuranProfile;
}
