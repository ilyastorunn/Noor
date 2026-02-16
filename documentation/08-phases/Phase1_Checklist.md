# PHASE 1: CORE APP & FOUNDATION

**Goal:** Build the foundational app structure, navigation, and basic screens. Set up Firebase and core data flow.

**Target:** Complete MVP skeleton with working navigation and authentication.

---

## ✅ CHECKLIST

### 1. PROJECT SETUP
- [x] Expo Router v6 configuration
- [x] TypeScript setup
- [x] Design tokens (`constants/theme.ts`)
- [ ] Environment variables (.env setup)
- [ ] Firebase project creation
- [ ] iOS bundle identifier setup
- [ ] Android package name setup

### 2. NAVIGATION STRUCTURE
- [x] Root layout (`app/_layout.tsx`)
- [x] Tab navigation layout (`app/(tabs)/_layout.tsx`)
- [ ] **Update tab bar to 5 tabs:**
  - [ ] Home
  - [ ] Qur'an
  - [ ] Listen
  - [ ] Explore (replaces Discover)
  - [ ] Profile
- [ ] Tab icons (Lucide React Native)
- [ ] Tab bar styling (dark theme)

### 3. FIREBASE INTEGRATION
**See:** `/documentation/04-firebase/`

- [ ] Install Firebase SDK (`npm install firebase`)
- [ ] Firebase config file (`services/firebase.ts`)
- [ ] Firebase Authentication setup
- [ ] Firestore initialization
- [ ] Firebase Storage initialization
- [ ] Auth state listener

### 4. AUTHENTICATION FLOW
**See:** `/documentation/04-firebase/Authentication_Flow.md`

- [ ] Guest mode implementation
- [ ] Email/Password authentication
- [ ] Google Sign-In (iOS)
- [ ] Apple Sign-In (iOS)
- [ ] Auth persistence (AsyncStorage)
- [ ] Login/Signup screens
- [ ] Auth context provider

### 5. DATA LAYER
**See:** `/documentation/04-firebase/DataSync_Strategy.md`

- [ ] AsyncStorage service (`services/storage.ts`) ✅ (already exists)
- [ ] Firestore service (`services/firestore.ts`)
- [ ] Sync service (local → cloud sync)
- [ ] Offline-first data strategy
- [ ] Data models/types (`types/`)

### 6. CORE SCREENS (BASIC STRUCTURE)

#### 6.1 Home Screen
**See:** `/documentation/01-core-app/HomeScreen.md`

- [ ] Mood display (top section)
- [ ] Daily verse section
- [ ] Today's Path section (placeholder)
- [ ] Prayer times section (placeholder)
- [ ] Qibla card (placeholder)
- [ ] Special days card (placeholder)

#### 6.2 Qur'an Screen
**See:** `/documentation/01-core-app/QuranScreen.md`

- [ ] Segmented control (Read / Listen)
- [ ] Read mode:
  - [ ] Surah list modal
  - [ ] Verse display
  - [ ] Basic styling
- [ ] Listen mode (placeholder)

#### 6.3 Listen Screen
**See:** `/documentation/01-core-app/ListenScreen.md`

- [ ] Stories section (placeholder cards)
- [ ] Duas section (placeholder cards)
- [ ] Basic layout

#### 6.4 Explore Screen
**See:** `/documentation/01-core-app/ExploreScreen.md`

- [ ] Category grid (2 columns)
- [ ] 6 category cards:
  - [ ] Qur'an
  - [ ] Duas
  - [ ] Stories of Prophets
  - [ ] Special Days
  - [ ] Listen
  - [ ] Calm / Night

#### 6.5 Profile Screen
**See:** `/documentation/01-core-app/ProfileScreen.md`

- [ ] Streak display
- [ ] Mood history
- [ ] Notification preferences (toggle UI)
- [ ] Account section (login/logout)
- [ ] Premium status indicator

### 7. ONBOARDING IMPROVEMENTS
**See:** `/documentation/OnboardingSpec.md`

- [x] 6-screen flow (already implemented)
- [ ] Save responses to AsyncStorage ✅
- [ ] Sync to Firestore after auth
- [ ] Nano Banana images (final polish - defer to later)

### 8. MOOD SYSTEM (BASIC)
**See:** `/documentation/06-features/MoodSystem_Logic.md`

- [ ] Mood selector component
- [ ] Weekly check-in modal (every Monday)
- [ ] Mood state management (AsyncStorage)
- [ ] Mood display on Home screen
- [ ] Manual mood change from Home

---

## 🎯 SUCCESS CRITERIA

- ✅ User can complete onboarding
- ✅ User can navigate all 5 tabs
- ✅ User can login with Email/Google/Apple
- ✅ Guest mode works
- ✅ Mood is displayed and changeable
- ✅ Basic Firebase sync works
- ✅ App doesn't crash

---

## 🚧 OUT OF SCOPE (Phase 1)

- ❌ Real content (Qur'an API, stories, duas)
- ❌ Audio playback
- ❌ Prayer times API
- ❌ Qibla compass logic
- ❌ Widgets
- ❌ Premium gating
- ❌ Notifications
- ❌ Today's Path logic

---

## 📦 DEPENDENCIES

**NPM Packages to Install:**
```bash
npm install firebase
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage
npm install @react-native-google-signin/google-signin
npm install react-native-track-player
```

**iOS Setup:**
- Configure Firebase in Xcode
- Add Google Sign-In URL scheme
- Add Apple Sign-In capability

---

## ⏭️ NEXT PHASE

After Phase 1 completion → **Phase 2: Content & Audio**
