# HUSHU - IMPLEMENTATION GUIDE

> **Last Updated:** February 16, 2025
> **Purpose:** Step-by-step guide to start development immediately

---

## 🚀 GETTING STARTED

### Prerequisites

- **macOS** (for iOS development)
- **Xcode 15+**
- **Node.js 18+**
- **npm or yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Firebase account** (free tier)
- **ElevenLabs account** (for audio generation)

---

## 📋 PHASE 1: IMMEDIATE NEXT STEPS

### Step 1: Update Tab Navigation (30 min)

**File:** `app/(tabs)/_layout.tsx`

1. Add 5th tab (Listen)
2. Update icons (Headphones, Compass)
3. Rename Discover → Explore

**Checklist:**
- [ ] Update `_layout.tsx` with 5 tabs
- [ ] Create `app/(tabs)/listen.tsx` (empty screen for now)
- [ ] Rename `app/(tabs)/discover.tsx` → `app/(tabs)/explore.tsx`
- [ ] Test: All 5 tabs navigate correctly

**Reference:** `/documentation/01-core-app/TabNavigation.md`

---

### Step 2: Firebase Project Setup (1 hour)

#### 2.1 Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Create new project: `hushu-app`
3. Enable Google Analytics (optional)
4. Add iOS app:
   - Bundle ID: `com.yourcompany.hushu` (update in `app.json`)
   - Download `GoogleService-Info.plist`
   - Place in Xcode project root

#### 2.2 Enable Services

**Authentication:**
- Email/Password: ✅ Enable
- Google Sign-In: ✅ Enable (configure OAuth client ID)
- Apple Sign-In: ✅ Enable

**Firestore Database:**
- Create database (start in test mode)
- Location: `us-central1`

**Firebase Storage:**
- Enable for audio/image files

#### 2.3 Install Firebase SDK

```bash
npm install firebase
npm install @react-native-google-signin/google-signin
```

#### 2.4 Create Environment File

Create `.env` in project root:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=hushu-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=hushu-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=hushu-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:ios:abc123
```

**Add to `.gitignore`:**
```
.env
```

#### 2.5 Create Firebase Config File

**File:** `services/firebase.ts`

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

**Checklist:**
- [ ] Firebase project created
- [ ] `GoogleService-Info.plist` added to Xcode
- [ ] Environment variables configured
- [ ] `services/firebase.ts` created
- [ ] Test: Firebase initializes without errors

**Reference:** `/documentation/04-firebase/Authentication_Flow.md`

---

### Step 3: Authentication Implementation (2-3 hours)

#### 3.1 Create Auth Service

**File:** `services/auth.ts`

(See `/documentation/04-firebase/Authentication_Flow.md` for full code)

#### 3.2 Create Auth Context

**File:** `contexts/AuthContext.tsx`

(See `/documentation/04-firebase/Authentication_Flow.md` for full code)

#### 3.3 Wrap App with Auth Provider

**File:** `app/_layout.tsx`

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* ... existing routes */}
      </Stack>
    </AuthProvider>
  );
}
```

#### 3.4 Create Login/Signup Screens

**Files:**
- `app/auth/login.tsx`
- `app/auth/signup.tsx`

(Basic UI for now, polish later)

**Checklist:**
- [ ] `services/auth.ts` created
- [ ] `contexts/AuthContext.tsx` created
- [ ] App wrapped with `AuthProvider`
- [ ] Login/Signup screens created
- [ ] Test: Email/Password signup works
- [ ] Test: Email/Password login works
- [ ] Test: Google Sign-In works (iOS)
- [ ] Test: Apple Sign-In works (iOS)

---

### Step 4: Mood System (Basic) (1 hour)

#### 4.1 Mood Display on Home Screen

**File:** `app/(tabs)/index.tsx`

Add mood display at top:

```typescript
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [mood, setMood] = useState('grateful'); // Default

  useEffect(() => {
    // Load mood from AsyncStorage
    AsyncStorage.getItem('currentMood').then((savedMood) => {
      if (savedMood) setMood(savedMood);
    });
  }, []);

  return (
    <View>
      {/* Mood Display */}
      <TouchableOpacity onPress={() => router.push('/mood-selector')}>
        <View style={styles.moodCard}>
          <Text style={styles.moodEmoji}>😌</Text>
          <Text style={styles.moodText}>Feeling: {mood}</Text>
          <Text style={styles.moodHint}>Tap to change</Text>
        </View>
      </TouchableOpacity>

      {/* Rest of Home screen */}
    </View>
  );
}
```

#### 4.2 Create Mood Selector Modal

**File:** `app/mood-selector.tsx`

(4 mood cards: Anxious, Seeking, Grateful, Weary)

**Checklist:**
- [ ] Mood displayed on Home screen
- [ ] Mood selector modal created
- [ ] Mood saved to AsyncStorage on change
- [ ] Mood persists across app restarts

**Reference:** `/documentation/06-features/MoodSystem_Logic.md`

---

### Step 5: Basic Home Screen Sections (2 hours)

#### 5.1 Daily Verse Section (Placeholder)

```typescript
<View style={styles.dailyVerseSection}>
  <Text style={styles.sectionTitle}>Daily Verse</Text>
  <Text style={styles.verseText}>
    "So which of the favors of your Lord would you deny?"
  </Text>
  <Text style={styles.verseReference}>Ar-Rahman 55:13</Text>
</View>
```

#### 5.2 Today's Path Section (Placeholder)

```typescript
<View style={styles.todaysPathSection}>
  <Text style={styles.sectionTitle}>Today's Path</Text>
  <Text style={styles.pathItem}>📖 Read one verse</Text>
  <Text style={styles.pathItem}>🤲 Make one dua</Text>
  <Text style={styles.pathItem}>📚 Listen to a story</Text>
</View>
```

#### 5.3 Prayer Times Section (Placeholder)

```typescript
<View style={styles.prayerTimesSection}>
  <Text style={styles.sectionTitle}>Prayer Times</Text>
  <Text style={styles.prayerItem}>Fajr: 05:30</Text>
  <Text style={styles.prayerItem}>Dhuhr: 13:15</Text>
  {/* ... other prayers */}
</View>
```

**Checklist:**
- [ ] Daily verse section added (placeholder text)
- [ ] Today's Path section added (placeholder)
- [ ] Prayer times section added (placeholder)
- [ ] Sections styled per design system

---

## 🎯 PHASE 1 COMPLETION CRITERIA

After completing above steps, you should have:

✅ **Navigation:**
- 5-tab layout working
- All tabs navigable

✅ **Authentication:**
- Firebase connected
- Email/Password, Google, Apple Sign-In working
- Guest mode functional

✅ **Home Screen:**
- Mood display
- Daily verse (placeholder)
- Today's Path (placeholder)
- Prayer times (placeholder)

✅ **Data Layer:**
- Firebase initialized
- AsyncStorage working
- Auth context providing user state

---

## 📅 RECOMMENDED SCHEDULE

**Week 1:**
- Day 1: Tab navigation update
- Day 2: Firebase setup
- Day 3-4: Authentication implementation
- Day 5: Mood system + basic Home screen

**Week 2:**
- Day 1-2: Qur'an API integration
- Day 3-4: Qur'an screen (Read mode)
- Day 5: Testing + bug fixes

**Week 3:**
- Day 1-2: Prayer Times API integration
- Day 3: Qibla compass
- Day 4-5: Daily verses strategy implementation

**Week 4:**
- Day 1-3: Prophet stories content creation (write scripts)
- Day 4-5: ElevenLabs audio generation (sample)

---

## 🛠️ DEVELOPMENT WORKFLOW

### Daily Workflow

1. **Start Dev Server:**
   ```bash
   npm start
   ```

2. **Run on iOS Simulator:**
   ```bash
   npm run ios
   ```

3. **Check Linting:**
   ```bash
   npm run lint
   ```

4. **Commit Changes:**
   ```bash
   git add .
   git commit -m "feat: implement X"
   git push
   ```

### Testing Checklist (Daily)

- [ ] App launches without crashes
- [ ] Navigation between tabs works
- [ ] No console errors
- [ ] Design matches specs (colors, spacing)

---

## 📚 KEY DOCUMENTATION REFERENCES

**Before coding any feature, read these:**

1. **Design System:** `/documentation/DesignRules.md`
2. **Phase Checklists:** `/documentation/08-phases/Phase1_Checklist.md`
3. **Firebase Auth:** `/documentation/04-firebase/Authentication_Flow.md`
4. **Firestore Schema:** `/documentation/04-firebase/Firestore_Schema.md`
5. **Qur'an API:** `/documentation/02-content/QuranAPI_Integration.md`
6. **Mood Mapping:** `/documentation/06-features/TodaysPath_Mapping.md`

---

## 🚨 COMMON PITFALLS TO AVOID

1. **Don't skip environment variables setup** → Will cause Firebase crashes
2. **Don't forget App Groups** (iOS) → Needed for widgets later
3. **Don't hardcode colors** → Use `DesignTokens` from `constants/theme.ts`
4. **Don't use gradients on backgrounds** → Solid colors only (design rule)
5. **Don't bundle all Qur'an text** → Use hybrid strategy (Cüz 30 + download)

---

## 🎉 YOU'RE READY TO BUILD!

Start with **Step 1: Update Tab Navigation** and work through sequentially.

**Questions?** Refer to `/documentation/ROADMAP.md` for big picture.

**Let's build Hushu.** 🌙
