# FIREBASE AUTHENTICATION FLOW

**Purpose:** Manage user authentication with multiple providers while supporting guest mode.

---

## AUTHENTICATION PROVIDERS

### 1. Guest Mode (No Auth)
- User can browse app with limited features
- Data stored locally (AsyncStorage)
- No cloud sync
- **Limitations:**
  - No bookmarks
  - No offline downloads
  - No widgets (except free ones)
  - No streak > 7 days (optional limit, TBD)

### 2. Email/Password
- Standard Firebase Email/Password auth
- Email verification optional (for MVP, defer to post-launch)
- Password reset flow

### 3. Google Sign-In
- `@react-native-google-signin/google-signin`
- iOS configuration (URL scheme in Xcode)
- Firebase credential linking

### 4. Apple Sign-In
- Native Sign in with Apple (required for iOS)
- Firebase credential linking
- Handle "Hide My Email" feature

---

## USER FLOW

### First-Time User (Onboarding)

```
┌────────────────────────────────┐
│  Onboarding (6 screens)        │
│  - Stored in AsyncStorage      │
└────────────────┬───────────────┘
                 │
                 v
┌────────────────────────────────┐
│  "Create Account / Sign In"    │
│  Options:                      │
│  - Continue as Guest           │
│  - Sign in with Apple          │
│  - Sign in with Google         │
│  - Email/Password              │
└────────────────┬───────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        v                 v
   ┌─────────┐      ┌──────────┐
   │  Guest  │      │  Auth    │
   │  Mode   │      │  Success │
   └────┬────┘      └────┬─────┘
        │                │
        │                v
        │      ┌──────────────────┐
        │      │ Sync AsyncStorage │
        │      │ data to Firestore │
        │      └────────┬──────────┘
        │               │
        v               v
   ┌───────────────────────────┐
   │  Main App (Home Screen)   │
   └───────────────────────────┘
```

### Returning User

```
┌────────────────────────────────┐
│  App Launch                    │
│  Check auth state              │
└────────────────┬───────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        v                 v
   ┌─────────┐      ┌──────────┐
   │  Guest  │      │ Logged In│
   │  (Local)│      │ (Synced) │
   └────┬────┘      └────┬─────┘
        │                │
        v                v
   ┌───────────────────────────┐
   │  Main App                 │
   └───────────────────────────┘
```

---

## FIREBASE SETUP

### 1. Create Firebase Project
- Project name: `hushu-app`
- Enable Analytics (optional)
- Add iOS app:
  - Bundle ID: `com.yourcompany.hushu` (update as needed)
  - Download `GoogleService-Info.plist`

### 2. Enable Auth Providers
- **Email/Password:** Enable in Firebase Console
- **Google Sign-In:**
  - Enable in Firebase Console
  - Add OAuth client ID (iOS)
  - Configure in Xcode
- **Apple Sign-In:**
  - Enable in Firebase Console
  - Add Sign in with Apple capability in Xcode
  - Configure Service ID

### 3. Firestore Database
- Create database (start in test mode, update security rules later)
- Location: `us-central1` or closest to target users

### 4. Firebase Storage
- Enable for audio/image uploads
- Security rules: Authenticated users can read, admins can write

---

## CODE STRUCTURE

### File: `services/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### File: `services/auth.ts`

```typescript
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Email/Password
export const signUpWithEmail = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Google Sign-In
export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const { idToken } = await GoogleSignin.signIn();
  const googleCredential = GoogleAuthProvider.credential(idToken);
  return await signInWithCredential(auth, googleCredential);
};

// Apple Sign-In
export const signInWithApple = async (identityToken: string) => {
  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({ idToken: identityToken });
  return await signInWithCredential(auth, credential);
};

// Sign Out
export const logout = async () => {
  await signOut(auth);
};
```

### File: `contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { syncLocalDataToFirestore } from '@/services/dataSync';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isGuest: true,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      // If user just signed in, sync local data to Firestore
      if (firebaseUser) {
        await syncLocalDataToFirestore(firebaseUser.uid);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isGuest: !user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## DATA SYNC LOGIC

**See:** `/documentation/04-firebase/DataSync_Strategy.md`

When user signs in (transitions from guest → authenticated):
1. Read onboarding data from AsyncStorage
2. Read mood history from AsyncStorage
3. Read streak from AsyncStorage
4. Write to Firestore under `/users/{uid}/`
5. Continue syncing in background

---

## SECURITY RULES

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public content (Qur'an, Duas, Stories) - read-only for all
    match /content/{document=**} {
      allow read: if true;
      allow write: if false; // Only admins via Firebase Console
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Audio files: Public read
    match /audio/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Only admins
    }

    // User uploads (future): Private
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## UI SCREENS

### Login Screen (`app/auth/login.tsx`)

```
┌─────────────────────────────────┐
│         HUSHU LOGO              │
│   "Sanctuary for the Modern     │
│         Soul"                   │
├─────────────────────────────────┤
│                                 │
│  [Continue with Apple]          │
│  [Continue with Google]         │
│                                 │
│  ──────── OR ────────           │
│                                 │
│  Email: ___________________     │
│  Password: ________________     │
│                                 │
│  [Sign In]                      │
│                                 │
│  Don't have an account?         │
│  [Sign Up]                      │
│                                 │
│  [Continue as Guest]            │
└─────────────────────────────────┘
```

### Sign Up Screen (`app/auth/signup.tsx`)

Similar to Login, but with:
- Name field (optional)
- Confirm Password field
- Terms of Service checkbox

---

## GUEST → AUTH MIGRATION

**Scenario:** User uses app as guest for a week, then decides to sign in.

**Flow:**
1. User taps "Sign In" in Profile screen
2. Completes auth (Email/Google/Apple)
3. `syncLocalDataToFirestore()` triggered
4. Local data (mood, streak, onboarding) moved to Firestore
5. User now authenticated, can use premium features

**Data to Sync:**
- Onboarding responses
- Mood history
- Streak count
- Bookmarks (if any in guest mode - but guest can't bookmark, so N/A)

---

## ENVIRONMENT VARIABLES

Create `.env` file:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=hushu-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=hushu-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=hushu-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:ios:abc123
```

**Add `.env` to `.gitignore`**

---

## TESTING CHECKLIST

- [ ] Email/Password signup works
- [ ] Email/Password login works
- [ ] Google Sign-In works (iOS)
- [ ] Apple Sign-In works (iOS)
- [ ] Guest mode works (no auth)
- [ ] Guest → Auth migration syncs data correctly
- [ ] Logout works
- [ ] Auth state persists on app restart
- [ ] Security rules prevent unauthorized access

---

## DEPENDENCIES

```bash
npm install firebase
npm install @react-native-google-signin/google-signin
```

**iOS Setup:**
- Add `GoogleService-Info.plist` to Xcode project
- Configure URL scheme for Google Sign-In
- Enable Sign in with Apple capability

---

## NEXT STEPS

After auth is working:
1. Implement Firestore data schema (see `/documentation/04-firebase/Firestore_Schema.md`)
2. Build data sync service (see `/documentation/04-firebase/DataSync_Strategy.md`)
3. Test guest → auth flow thoroughly
