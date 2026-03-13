import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { firebaseConfigErrorMessage, firebaseConfigured } from '@/services/firebase';
import { subscribeToAuthState } from '@/services/auth';
import { ensureUserProfile, subscribeToUserProfile } from '@/services/userProfile';
import type { AuthenticatedUser, HushuUserProfile } from '@/types/user';

interface AuthContextValue {
  user: AuthenticatedUser | null;
  profile: HushuUserProfile | null;
  isGuest: boolean;
  loading: boolean;
  firebaseConfigured: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  isGuest: true,
  loading: true,
  firebaseConfigured,
  authError: firebaseConfigErrorMessage,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [profile, setProfile] = useState<HushuUserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setAuthLoading(false);
      setProfileLoading(false);
      return;
    }

    const unsubscribe = subscribeToAuthState(async (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);

      if (!nextUser) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      await ensureUserProfile(nextUser);
      setProfileLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    const unsubscribe = subscribeToUserProfile(user.uid, (nextProfile) => {
      setProfile(nextProfile);
      setProfileLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isGuest: !user,
      loading: authLoading || profileLoading,
      firebaseConfigured,
      authError: firebaseConfigErrorMessage,
    }),
    [authLoading, profile, profileLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
