# PHASE 3: WIDGETS, PREMIUM & POLISH

**Goal:** Implement iOS widgets, premium subscription system, offline downloads, and final polish for App Store launch.

**Target:** Production-ready app with monetization and advanced features.

---

## ✅ CHECKLIST

### 1. iOS WIDGETS
**See:** `/documentation/05-widgets/`

#### 1.1 Widget Extension Setup
- [ ] Create Widget Extension in Xcode
- [ ] Configure App Groups (for data sharing)
- [ ] Shared UserDefaults/App Group container
- [ ] Widget bundle identifier

#### 1.2 Prayer Times Widget
**See:** `/documentation/05-widgets/PrayerTimes_Widget.md`

- [ ] **Small (2x2):** Premium
- [ ] **Medium (4x2):** Free
- [ ] **Large (4x4):** Premium
- [ ] Display next prayer + countdown
- [ ] Timeline updates (5 times/day)
- [ ] Deep link to app

#### 1.3 Daily Verse Widget
**See:** `/documentation/05-widgets/DailyVerse_Widget.md`

- [ ] **Small (2x2):** Free
- [ ] **Medium (4x2):** Premium
- [ ] **Large (4x4):** Premium
- [ ] Display daily verse (from thematic strategy)
- [ ] Timeline updates (midnight refresh)
- [ ] Deep link to Qur'an screen

#### 1.4 Qibla Widget
**See:** `/documentation/05-widgets/Qibla_Widget.md`

- [ ] **Small (2x2) ONLY:** Free
- [ ] Static compass arrow
- [ ] Calculated Qibla direction
- [ ] Location-based (last known location)

#### 1.5 Daily Dua Widget
- [ ] **Small (2x2):** Premium
- [ ] **Medium (4x2):** Premium
- [ ] **Large (4x4):** Premium
- [ ] Rotates daily duas
- [ ] Timeline updates (midnight refresh)

#### 1.6 Streak Widget
- [ ] **Small (2x2):** Premium
- [ ] **Medium (4x2):** Premium
- [ ] Display current streak
- [ ] Flame icon
- [ ] Timeline updates (daily)

#### 1.7 Widget Configuration
- [ ] WidgetKit timeline provider
- [ ] Widget preview snapshots
- [ ] Widget descriptions
- [ ] Widget families (Small, Medium, Large)

### 2. PREMIUM SUBSCRIPTION
**See:** `/documentation/07-premium/`

#### 2.1 In-App Purchase Setup
**See:** `/documentation/07-premium/RevenueCat_Integration.md` or `/documentation/07-premium/StoreKit_Integration.md`

**Option A: RevenueCat (Recommended)**
- [ ] Create RevenueCat account
- [ ] Configure products (monthly, yearly)
- [ ] Install SDK (`npm install react-native-purchases`)
- [ ] iOS configuration
- [ ] Entitlements setup

**Option B: StoreKit (Native)**
- [ ] Configure products in App Store Connect
- [ ] Install react-native-iap
- [ ] Purchase flow implementation
- [ ] Receipt validation

#### 2.2 Premium Products
- [ ] **Monthly Subscription:** $4.99/month
- [ ] **Yearly Subscription:** $39.99/year (save 33%)
- [ ] Product IDs in App Store Connect
- [ ] Pricing tiers

#### 2.3 Premium Gating Logic
**See:** `/documentation/07-premium/Premium_Features.md`

- [ ] Premium status check (Firestore + local cache)
- [ ] Lock UI for premium features:
  - [ ] Prophet stories (Episode 3+)
  - [ ] Premium widgets
  - [ ] Offline downloads
- [ ] Paywall screen design
- [ ] "Upgrade to Premium" CTA buttons

#### 2.4 Restore Purchases
- [ ] Restore purchases button (Profile screen)
- [ ] Cross-device subscription sync
- [ ] Handle expired subscriptions

### 3. OFFLINE DOWNLOADS
**See:** `/documentation/06-features/DownloadSystem.md`

#### 3.1 Qur'an Downloads
- [ ] Download button on Surah screen
- [ ] Download progress indicator
- [ ] Store in local file system (AsyncStorage/SQLite for metadata)
- [ ] Manage storage (delete downloads)
- [ ] Downloaded surahs list (Profile screen)

#### 3.2 Story Downloads
- [ ] Download button on Story episode screen (Premium only)
- [ ] Download progress indicator
- [ ] Store audio files locally
- [ ] Offline playback (react-native-track-player)
- [ ] Downloaded stories list (Profile screen)

#### 3.3 Download Manager
- [ ] Queue system (download multiple files)
- [ ] Pause/Resume downloads
- [ ] Storage usage display
- [ ] Clear cache option

### 4. NOTIFICATIONS
**See:** `/documentation/06-features/Notifications.md`

#### 4.1 Local Notifications Setup
- [ ] Install `@react-native-firebase/messaging` or `expo-notifications`
- [ ] iOS notification permissions
- [ ] Notification channel setup

#### 4.2 Prayer Time Notifications
- [ ] Schedule 5 daily notifications (before each prayer)
- [ ] Customizable time offset (5min, 10min, 15min before)
- [ ] Toggle in Profile screen
- [ ] Update schedule when location changes

#### 4.3 Daily Reading Reminder
- [ ] User-selectable time (e.g., 8:00 AM)
- [ ] "Don't forget your daily verse" notification
- [ ] Toggle in Profile screen

#### 4.4 Mood Check-in Reminder
- [ ] Weekly reminder (every Monday)
- [ ] "How are you feeling this week?" notification

### 5. LIGHT MODE
**See:** `/documentation/01-core-app/LightMode_Design.md`

- [ ] Light theme tokens (`constants/theme.ts`)
- [ ] System theme detection
- [ ] Theme toggle in Profile screen
- [ ] Update all screens for light mode
- [ ] Test illustrations/images in light mode

### 6. SEARCH (EXPLORE SCREEN)
**See:** `/documentation/01-core-app/ExploreScreen.md`

- [ ] Search bar at top of Explore
- [ ] Search logic:
  - [ ] Qur'an (surah names, keywords)
  - [ ] Duas (keywords)
  - [ ] Stories (prophet names)
- [ ] Search results screen
- [ ] Recent searches (local storage)

### 7. POLISH & UX IMPROVEMENTS

#### 7.1 Onboarding Final Polish
- [ ] Replace placeholder images with Nano Banana visuals
- [ ] Smooth transitions
- [ ] Haptic feedback on selections
- [ ] Loading animation improvements

#### 7.2 Animations
- [ ] Tab transition animations
- [ ] Card hover/press states
- [ ] Skeleton loaders for content
- [ ] Pull-to-refresh on Home screen

#### 7.3 Error Handling
- [ ] Network error states (retry UI)
- [ ] Empty states (no bookmarks, no downloads)
- [ ] Permission denied states (location, notifications)
- [ ] API failure fallbacks

#### 7.4 Performance Optimization
- [ ] Image optimization (Nano Banana exports)
- [ ] Lazy loading for lists
- [ ] Memoization for heavy components
- [ ] Bundle size optimization

### 8. APP STORE PREPARATION

#### 8.1 App Store Assets
- [ ] App icon (1024x1024)
- [ ] Screenshots (6.5", 5.5" iPhone sizes)
- [ ] App preview video (optional but recommended)
- [ ] App Store description (English, Turkish)
- [ ] Keywords optimization
- [ ] Privacy policy URL
- [ ] Terms of service URL

#### 8.2 App Store Connect Setup
- [ ] Create app in App Store Connect
- [ ] Bundle identifier
- [ ] App name availability check
- [ ] Category selection (Lifestyle / Health & Fitness)
- [ ] Age rating (4+)
- [ ] In-App Purchases configuration

#### 8.3 TestFlight Beta
- [ ] Internal testing (10-20 users)
- [ ] Beta feedback collection
- [ ] Bug fixes from beta
- [ ] Performance monitoring (Crashlytics)

#### 8.4 Launch Preparation
- [ ] App Store review guidelines compliance
- [ ] Privacy nutrition label
- [ ] Final QA testing
- [ ] Submit for review

### 9. ANALYTICS & MONITORING

#### 9.1 Firebase Analytics
- [ ] Track key events:
  - [ ] Onboarding completion
  - [ ] Daily verse read
  - [ ] Story played
  - [ ] Dua viewed
  - [ ] Prayer times viewed
  - [ ] Premium conversion
- [ ] Screen view tracking
- [ ] User properties (mood, streak, premium status)

#### 9.2 Crashlytics
- [ ] Install Firebase Crashlytics
- [ ] Error reporting
- [ ] Non-fatal error logging

#### 9.3 Performance Monitoring
- [ ] Firebase Performance Monitoring
- [ ] Track slow API calls
- [ ] Track app startup time

### 10. LEGAL & COMPLIANCE

- [ ] Privacy Policy (GDPR, CCPA compliant)
- [ ] Terms of Service
- [ ] Data deletion request flow (GDPR)
- [ ] In-app privacy settings
- [ ] Cookie consent (if using web analytics)

---

## 🎯 SUCCESS CRITERIA

- ✅ All widgets functional (5+ widgets)
- ✅ Premium subscription working (monthly + yearly)
- ✅ Offline downloads working
- ✅ Notifications working (prayer times + daily reminder)
- ✅ Light mode implemented
- ✅ Search functional
- ✅ App Store ready (screenshots, description, etc.)
- ✅ Beta tested (10-20 users, no critical bugs)
- ✅ Performance optimized (smooth scrolling, fast load times)
- ✅ Analytics tracking all key events

---

## 🚧 POST-LAUNCH (Out of Scope for MVP)

- ❌ Social features (sharing, friends)
- ❌ Advanced statistics dashboard
- ❌ Custom theme colors (user-selectable)
- ❌ Custom dua lists
- ❌ Kids mode (simplified UI, child-appropriate stories)
- ❌ Accessibility features (VoiceOver optimization, font scaling)
- ❌ iPad-specific layout
- ❌ Android version

---

## 📦 DEPENDENCIES

**NPM Packages:**
```bash
npm install react-native-purchases  # RevenueCat
npm install @react-native-firebase/messaging
npm install @react-native-firebase/analytics
npm install @react-native-firebase/crashlytics
npm install @react-native-firebase/perf
```

**iOS Configuration:**
- WidgetKit extension
- App Groups capability
- Push Notifications capability
- In-App Purchases capability

**App Store Connect:**
- App created
- In-App Purchases configured
- TestFlight beta enabled

---

## 🎉 LAUNCH READY!

After Phase 3 completion → **Submit to App Store** 🚀
