# FIRESTORE DATABASE SCHEMA

**Purpose:** Define data structure for cloud storage and sync.

---

## COLLECTIONS OVERVIEW

```
/users/{userId}
  - onboarding: object
  - mood: object
  - streak: object
  - preferences: object
  - bookmarks: subcollection

/content
  /verses/{verseId}
  /duas/{duaId}
  /stories/{storyId}
  /special-days/{dayId}
```

---

## USER DATA (`/users/{userId}`)

### Document Structure

```typescript
{
  // User metadata
  uid: string,
  email: string | null,
  displayName: string | null,
  createdAt: timestamp,
  lastActive: timestamp,
  isPremium: boolean,
  premiumExpiresAt: timestamp | null,

  // Onboarding data
  onboarding: {
    completed: boolean,
    completedAt: timestamp | null,
    emotionalState: 'anxious' | 'seeking' | 'grateful' | 'weary',
    goals: string[], // ['grow-closer', 'find-peace', ...]
    preferredContent: string[], // ['meditations', 'sleep-stories', ...]
    dailyCommitment: '5min' | '15min' | '30min+',
  },

  // Mood tracking
  mood: {
    current: 'anxious' | 'seeking' | 'grateful' | 'weary',
    lastUpdated: timestamp,
    history: [
      { mood: string, date: timestamp },
      ...
    ],
  },

  // Streak system
  streak: {
    current: number, // days
    longest: number,
    lastCompletedDate: string, // 'YYYY-MM-DD'
    totalDaysCompleted: number,
  },

  // User preferences
  preferences: {
    notifications: {
      prayerTimes: boolean,
      dailyReading: boolean,
      moodCheckIn: boolean,
    },
    theme: 'dark' | 'light' | 'system',
    language: 'en' | 'tr' | 'ar',
    reciter: 'alafasy' | 'sudais' | 'husary', // For Qur'an audio
    storyVoice: 'male' | 'female',
  },
}
```

---

## BOOKMARKS SUBCOLLECTION

**Path:** `/users/{userId}/bookmarks/{bookmarkId}`

```typescript
{
  type: 'verse' | 'dua' | 'story',
  contentId: string, // Reference to content ID
  createdAt: timestamp,

  // Metadata (varies by type)
  metadata: {
    // For 'verse'
    surahName?: string,
    verseNumber?: number,

    // For 'dua'
    duaTitle?: string,

    // For 'story'
    prophetName?: string,
    episodeNumber?: number,
  },
}
```

---

## CONTENT COLLECTIONS (Read-Only for Users)

### `/content/verses/{verseId}`

```typescript
{
  id: string, // e.g., '2:255' (Surah:Verse)
  surahNumber: number,
  surahName: string,
  verseNumber: number,
  arabicText: string,
  translationEN: string,
  translationTR: string,
  theme: string, // e.g., 'patience', 'gratitude'
  moodTags: string[], // ['anxious', 'seeking']
}
```

### `/content/duas/{duaId}`

```typescript
{
  id: string,
  title: string,
  category: 'morning' | 'evening' | 'meal' | 'travel' | 'sleep' | 'mosque' | 'wudu' | 'prayer',
  arabicText: string,
  transliterationEN: string,
  translationEN: string,
  translationTR: string,
  audioURL: string, // Firebase Storage URL
  moodTags: string[],
}
```

### `/content/stories/{storyId}`

```typescript
{
  id: string,
  prophetName: string, // 'Nuh', 'Ibrahim', 'Musa', 'Yusuf', 'Isa'
  episodes: [
    {
      episodeNumber: number,
      title: string,
      textContent: string, // Full story text
      audioURL: {
        male: string, // Firebase Storage URL
        female: string,
      },
      duration: number, // seconds
      isPremium: boolean, // true if episode >= 3
      theme: string,
      moodTags: string[],
    },
  ],
}
```

### `/content/special-days/{dayId}`

```typescript
{
  id: string,
  name: string, // 'Ramadan', 'Eid al-Fitr'
  nameAR: string,
  date: timestamp, // Islamic calendar date (from API)
  description: string,
  significance: string,
}
```

---

## FIRESTORE SECURITY RULES

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      // Users can read/write their own data
      allow read, write: if isOwner(userId);

      // Bookmarks subcollection
      match /bookmarks/{bookmarkId} {
        allow read, write: if isOwner(userId);
      }
    }

    // Content collections (read-only for all users)
    match /content/{contentType}/{contentId} {
      allow read: if true;
      allow write: if false; // Only admins via Firebase Console
    }
  }
}
```

---

## DATA SEEDING (Admin Task)

**Initial content upload:**

1. **Verses:** Use script to populate from Quran.com API
2. **Duas:** Manual entry (10 duas)
3. **Stories:** Upload after ElevenLabs generation
4. **Special Days:** API-driven, no seeding needed

**Script:** `/scripts/seedFirestore.ts` (create later)

---

## INDEXING

**Composite Indexes Needed:**

1. **Verses by Mood Tags:**
   - Collection: `content/verses`
   - Fields: `moodTags` (Array), `surahNumber` (Ascending)

2. **Stories by Premium Status:**
   - Collection: `content/stories`
   - Fields: `isPremium` (Ascending), `prophetName` (Ascending)

**Create in Firebase Console → Firestore → Indexes**

---

## OFFLINE PERSISTENCE

Enable Firestore offline persistence (caches documents locally):

```typescript
// services/firebase.ts
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
```

**Benefits:**
- Faster reads from cache
- Works offline (returns cached data)
- Automatic sync when online

---

## QUERIES (EXAMPLES)

### Get User Data

```typescript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';

const getUserData = async (userId: string) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};
```

### Get Today's Verse (Mood-Based)

```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';

const getVersesByMood = async (mood: string) => {
  const q = query(
    collection(db, 'content/verses'),
    where('moodTags', 'array-contains', mood)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};
```

### Add Bookmark

```typescript
import { collection, addDoc } from 'firebase/firestore';

const addBookmark = async (userId: string, bookmarkData: any) => {
  const bookmarksRef = collection(db, `users/${userId}/bookmarks`);
  await addDoc(bookmarksRef, bookmarkData);
};
```

### Update Streak

```typescript
import { doc, updateDoc } from 'firebase/firestore';

const updateStreak = async (userId: string, newStreak: number) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    'streak.current': newStreak,
    'streak.lastCompletedDate': new Date().toISOString().split('T')[0],
  });
};
```

---

## MIGRATION FROM ASYNCSTORAGE

**See:** `/documentation/04-firebase/DataSync_Strategy.md`

When user signs in (guest → authenticated), migrate local data:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';

export const syncLocalDataToFirestore = async (userId: string) => {
  // Get local data
  const onboardingData = await AsyncStorage.getItem('onboarding');
  const moodData = await AsyncStorage.getItem('mood');
  const streakData = await AsyncStorage.getItem('streak');

  // Parse
  const onboarding = JSON.parse(onboardingData || '{}');
  const mood = JSON.parse(moodData || '{}');
  const streak = JSON.parse(streakData || '{}');

  // Write to Firestore
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    uid: userId,
    createdAt: new Date(),
    onboarding,
    mood,
    streak,
    // ... other fields
  }, { merge: true }); // Merge to avoid overwriting existing data
};
```

---

## TESTING CHECKLIST

- [ ] User document created on signup
- [ ] Onboarding data synced to Firestore
- [ ] Mood updates persist to Firestore
- [ ] Streak increments correctly
- [ ] Bookmarks CRUD works
- [ ] Content queries return correct data
- [ ] Security rules prevent unauthorized access
- [ ] Offline persistence works (test in airplane mode)

---

## NEXT STEPS

1. Seed content collections with initial data
2. Test Firestore queries in app
3. Implement data sync service (see `DataSync_Strategy.md`)
