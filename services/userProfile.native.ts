import firestore, {
  type FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { getOnboardingData, isOnboardingCompleted } from '@/services/storage';
import type {
  AuthenticatedUser,
  HushuUserProfile,
  UserOnboardingProfile,
  UserQuranProfile,
} from '@/types/user';

const EMPTY_QURAN_PROFILE: UserQuranProfile = {
  lastRead: null,
  lastListened: null,
};

function normalizeOnboarding(
  data: Awaited<ReturnType<typeof getOnboardingData>>,
  completed: boolean,
): UserOnboardingProfile {
  return {
    completed,
    completedAt: data.completedAt,
    emotionalState: data.emotionalState,
    goals: data.goals,
    preferredContent: data.preferredContent,
    dailyCommitment: data.commitment,
  };
}

function mapUserSnapshot(
  snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
): HushuUserProfile | null {
  const data = snapshot.data();

  if (!data) {
    return null;
  }

  return {
    uid: data.uid ?? snapshot.id,
    email: data.email ?? null,
    displayName: data.displayName ?? null,
    createdAt: data.createdAt ?? new Date().toISOString(),
    lastActive: data.lastActive ?? new Date().toISOString(),
    isPremium: Boolean(data.isPremium),
    onboarding: data.onboarding
      ? {
          completed: Boolean(data.onboarding.completed),
          completedAt: data.onboarding.completedAt ?? null,
          emotionalState: data.onboarding.emotionalState ?? null,
          goals: Array.isArray(data.onboarding.goals) ? data.onboarding.goals : [],
          preferredContent: Array.isArray(data.onboarding.preferredContent)
            ? data.onboarding.preferredContent
            : [],
          dailyCommitment: data.onboarding.dailyCommitment ?? null,
        }
      : null,
    quran: {
      lastRead: data.quran?.lastRead ?? null,
      lastListened: data.quran?.lastListened ?? null,
    },
  };
}

export async function ensureUserProfile(user: AuthenticatedUser): Promise<void> {
  const onboardingData = await getOnboardingData();
  const onboardingCompleted = await isOnboardingCompleted();
  const now = new Date().toISOString();
  const userRef = firestore().collection('users').doc(user.uid);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    await userRef.set({
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      createdAt: now,
      lastActive: now,
      isPremium: false,
      onboarding: normalizeOnboarding(onboardingData, onboardingCompleted),
      quran: EMPTY_QURAN_PROFILE,
    });
    return;
  }

  await userRef.set(
    {
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      lastActive: now,
      onboarding: normalizeOnboarding(onboardingData, onboardingCompleted),
    },
    { merge: true },
  );
}

export async function getUserProfile(uid: string): Promise<HushuUserProfile | null> {
  const snapshot = await firestore().collection('users').doc(uid).get();
  return mapUserSnapshot(snapshot);
}

export function subscribeToUserProfile(
  uid: string,
  onValue: (profile: HushuUserProfile | null) => void,
): () => void {
  return firestore()
    .collection('users')
    .doc(uid)
    .onSnapshot((snapshot) => {
      onValue(mapUserSnapshot(snapshot));
    });
}
