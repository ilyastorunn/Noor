import type { AuthenticatedUser, HushuUserProfile } from '@/types/user';

export async function ensureUserProfile(user: AuthenticatedUser): Promise<void> {
  void user;
}

export async function getUserProfile(uid: string): Promise<HushuUserProfile | null> {
  void uid;
  return null;
}

export function subscribeToUserProfile(
  uid: string,
  onValue: (profile: HushuUserProfile | null) => void,
): () => void {
  void uid;
  onValue(null);
  return () => {};
}
