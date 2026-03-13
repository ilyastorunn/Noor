import { firebaseConfigErrorMessage } from '@/services/firebase';
import type { AuthenticatedUser } from '@/types/user';

function createConfigError() {
  return new Error(firebaseConfigErrorMessage ?? 'Firebase Auth is not configured.');
}

export function subscribeToAuthState(
  onChange: (user: AuthenticatedUser | null) => void,
): () => void {
  onChange(null);
  return () => {};
}

export async function signUpWithEmail(email: string, password: string): Promise<void> {
  void email;
  void password;
  throw createConfigError();
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  void email;
  void password;
  throw createConfigError();
}

export async function signOutUser(): Promise<void> {
  throw createConfigError();
}

export function formatAuthError(error: unknown): string {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
  }

  const authError = error as { code?: string; message?: string };

  switch (authError.code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/missing-password':
      return 'Enter your password.';
    case 'auth/weak-password':
      return 'Use at least 6 characters for your password.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email or password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return authError.message ?? 'Something went wrong. Please try again.';
  }
}
