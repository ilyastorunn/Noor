# HUSHU - COMPLETE PRODUCT ROADMAP

> **Last Updated:** February 16, 2025
> **Status:** Pre-Development
> **Target Platform:** iOS (React Native + Expo)

---

## 🎯 VISION

Hushu is a modern Islamic spiritual companion app designed to help Muslims find peace, consistency, and deeper connection with their faith through:
- Daily Qur'an readings
- Mood-based spiritual guidance
- Prophet stories
- Duas (supplications)
- Prayer times & Qibla
- iOS widgets

**NOT:** A productivity tracker, social app, or gamified habit tool.

**Core Philosophy:** Calm, restrained, sacred. The UI disappears, allowing spiritual content to guide.

---

## 📊 DEVELOPMENT STRATEGY

### 3-Phase Approach

| Phase | Focus | Duration | Outcome |
|-------|-------|----------|---------|
| **Phase 1** | Core App & Foundation | TBD | Functional app with navigation, auth, basic screens |
| **Phase 2** | Content & Audio | TBD | Real content (Qur'an, Stories, Duas), audio playback, features |
| **Phase 3** | Widgets, Premium, Polish | TBD | Production-ready app with monetization |

**See:** `/documentation/08-phases/` for detailed checklists.

---

## 🏗️ ARCHITECTURE OVERVIEW

### Tech Stack

- **Framework:** React Native (Expo SDK ~54)
- **Language:** TypeScript
- **Routing:** Expo Router v6 (file-based)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Local Storage:** AsyncStorage
- **Audio:** react-native-track-player
- **Widgets:** iOS WidgetKit
- **Payments:** RevenueCat (In-App Subscriptions)

### Navigation Structure (5 Tabs)

1. **Home** - Daily verse, mood-based path, prayer times, special days
2. **Qur'an** - Read/Listen to Qur'an (3 languages: AR, EN, TR)
3. **Listen** - Prophet stories + Duas (audio content)
4. **Explore** - Categorized content discovery
5. **Profile** - Streak, settings, bookmarks, downloads

---

## 🎨 DESIGN SYSTEM

**See:** `/documentation/DesignRules.md`

**Key Principles:**
- **Midnight Sanctuary** - Dark, calm, reverent
- **NO gradients** on backgrounds (solid colors only)
- **Faceless minimalism** - Abstract imagery, no realistic faces
- **Restraint over expressiveness**

**Color Palette:**
- Background: `#020617` (Slate 950) / `#0F172A` (Slate 900)
- Accent: `#F8D794` (Creased Khaki - CTAs)
- Emerald: `#284139` (Selected states)
- Text: `#F8FAFC` (Headings), `#94A3B8` (Body)

---

## 📱 CORE FEATURES BREAKDOWN

### 1. ONBOARDING FLOW
**Status:** ✅ Implemented (6 screens)

- Welcome → Emotional Check-in → Goals → Content Preferences → Commitment → Loading
- Saves to AsyncStorage → Syncs to Firestore after auth
- **Polish Needed:** Replace placeholders with Nano Banana images

### 2. AUTHENTICATION
**Status:** 🚧 Phase 1

- Guest mode (limited features)
- Email/Password
- Google Sign-In
- Apple Sign-In
- Offline-first with cloud sync

### 3. QUR'AN
**Status:** 🚧 Phase 2

**Read Mode:**
- 114 Surahs (Arabic, English, Turkish)
- Hybrid offline strategy (bundle Cüz 30 + download on demand)
- Quran.com API
- Mark as Read → Contributes to streak

**Listen Mode:**
- Reciter selection (Mishary, Sudais, etc.)
- Streaming + offline download (premium)
- Background playback

### 4. DAILY VERSES
**Status:** 🚧 Phase 2

**Strategy:** Thematic weekly rotation
- 52 themes (Sabr, Shukr, Iman, Tawakkul, etc.)
- 7 verses per theme = 364 verses/year
- Rotates daily at midnight (user timezone)
- Displayed on Home screen

### 5. PROPHET STORIES
**Status:** 🚧 Phase 2

**Content:**
- 5 Prophets (Nuh, Ibrahim, Musa, Yusuf, Isa)
- Each story: 5 episodes (~5-8 min each)
- Episodes 1-2: Free
- Episodes 3-5: Premium

**Production:**
- Custom-written from Qur'anic narratives
- ElevenLabs TTS (male + female voices)
- Theological review by advisors
- Stored in Firebase Storage

### 6. DUAS (SUPPLICATIONS)
**Status:** 🚧 Phase 2

**Content:**
- 10 Essential Duas (Morning, Evening, Meal, Travel, Sleep, etc.)
- Arabic + English + Turkish text
- Audio (royalty-free recitations, NOT AI)
- Category-based organization

### 7. MOOD SYSTEM
**Status:** 🚧 Phase 1-2

**Moods:** Anxious, Seeking, Grateful, Weary

**Flow:**
- Initial mood selected in onboarding
- Weekly check-in modal (every Monday)
- Manual change anytime (tap mood on Home)
- Affects **Today's Path** suggestions

**See:** `/documentation/06-features/TodaysPath_Mapping.md`

### 8. TODAY'S PATH (MOOD-BASED GUIDANCE)
**Status:** 🚧 Phase 2

**Components:**
- Daily Verse (mood-appropriate)
- Suggested Dua (mood-based)
- Recommended Story (mood-based)

**Example (Anxious):**
- Verse: Surah Ash-Sharh (Relief after hardship)
- Dua: Evening Protection
- Story: Prophet Nuh (Patience in hardship)

### 9. PRAYER TIMES
**Status:** 🚧 Phase 2

- Aladhan API
- Location-based (GPS permission)
- 6 prayers (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
- Countdown to next prayer
- Displayed on Home screen + Widget

### 10. QIBLA COMPASS
**Status:** 🚧 Phase 2

- react-native-sensors (magnetometer)
- Bearing calculation (user location → Kaaba)
- Compass UI on Home screen
- Free widget (Small size)

### 11. SPECIAL DAYS
**Status:** 🚧 Phase 2

- IslamicFinder API (Islamic calendar)
- Events: Ramadan, Eid, Laylat al-Qadr, Ashura, Mawlid, 3 Holy Months
- Countdown display on Home screen

### 12. STREAK SYSTEM
**Status:** 🚧 Phase 2

**Logic:**
- Increments when user completes daily verse reading
- Resets if skipped for 24 hours
- Local (AsyncStorage) + Cloud (Firestore) sync
- Displayed on Profile screen

### 13. BOOKMARKS
**Status:** 🚧 Phase 2

**Bookmarkable Content:**
- Qur'an verses
- Duas
- Stories

**Storage:** Firestore
**UI:** Bookmarks list in Profile screen

### 14. OFFLINE DOWNLOADS
**Status:** 🚧 Phase 3 (Premium Feature)

**Downloadable:**
- Qur'an Surahs
- Prophet Stories (episodes)

**Storage:** Local file system + metadata (AsyncStorage/SQLite)
**UI:** Downloads list in Profile screen

---

## 📱 iOS WIDGETS

**Status:** 🚧 Phase 3

**See:** `/documentation/05-widgets/`

| Widget | Sizes | Free/Premium | Updates |
|--------|-------|--------------|---------|
| Prayer Times | Small ❌, Medium ✅, Large ❌ | Medium free, others premium | 5x/day (each prayer) |
| Daily Verse | Small ✅, Medium ❌, Large ❌ | Small free, others premium | Daily (midnight) |
| Qibla | Small ✅ | Free | Static |
| Daily Dua | All sizes ❌ | Premium | Daily (midnight) |
| Streak | Small ❌, Medium ❌ | Premium | Daily |

**Total Widgets:** 5 types, 11 variants (size + premium combinations)

---

## 💎 MONETIZATION

### Free Features
- ✅ Daily verses (unlimited)
- ✅ Qur'an reading/listening (unlimited)
- ✅ Prophet stories (Episodes 1-2 per story)
- ✅ All Duas (text + audio)
- ✅ Prayer times, Qibla, Special days
- ✅ Basic widgets (3 variants)
- ✅ Bookmarks

### Premium Features (Subscription)
- 💎 Prophet stories (Episodes 3-5)
- 💎 Offline downloads (Qur'an + Stories)
- 💎 Advanced widgets (8 variants)
- 💎 Ad-free experience (no ads in app anyway, but messaging)

### Pricing
- **Monthly:** $4.99/month
- **Yearly:** $39.99/year (save 33%)

**Platform:** RevenueCat (or native StoreKit)

---

## 📊 CONTENT PRODUCTION PLAN

**See:** `/documentation/02-content/`

### Qur'an
- Source: Quran.com API
- Languages: Arabic, English (Sahih International), Turkish
- Strategy: Bundle Cüz 30, download rest on demand

### Daily Verses
- 52 themes × 7 verses = 364 verses
- Curated weekly rotation
- Stored as static JSON + API references

### Prophet Stories
- 5 Prophets × 5 Episodes = 25 stories
- Text: Custom-written (5-8 min read)
- Audio: ElevenLabs TTS (2 voices = 50 audio files)
- Review: Theological advisors

### Duas
- 10 Essential Duas
- Text: Hisnul Muslim (authentic source)
- Audio: Royalty-free recitations (Freesound, IslamicFinder)

### Special Days
- API-driven (IslamicFinder)
- No manual content creation

---

## 🧪 TESTING & LAUNCH

### Beta Testing (Phase 3)
- **Platform:** TestFlight
- **Users:** 10-20 close circle
- **Duration:** 2-4 weeks
- **Metrics:**
  - Daily active users
  - Average session time
  - Streak retention (7-day, 30-day)
  - Crash reports
  - Premium conversion (if available)

### App Store Preparation
- [ ] App icon (1024×1024)
- [ ] Screenshots (6.5", 5.5" iPhone)
- [ ] App preview video (optional)
- [ ] Description (English, Turkish)
- [ ] Keywords
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] Age rating: 4+
- [ ] Category: Lifestyle / Health & Fitness

### Launch Strategy
1. **Internal Beta** (Week 1-2)
2. **Bug Fixes** (Week 3)
3. **Public Beta** (optional, Week 4)
4. **App Store Submission** (Week 5)
5. **Soft Launch** (Turkey first)
6. **Full Launch** (Global)

---

## 📈 POST-LAUNCH ROADMAP (Not MVP)

### Future Features
- [ ] Android version
- [ ] Kids mode (simplified UI, age-appropriate content)
- [ ] Social features (share verses, prayer reminders)
- [ ] Advanced analytics dashboard
- [ ] Custom theme colors
- [ ] Custom dua lists
- [ ] iPad-specific layout
- [ ] Accessibility (VoiceOver, Dynamic Type)
- [ ] More Prophet stories (20+ prophets)
- [ ] Tafsir (Qur'an commentary)
- [ ] Hadith of the day

### Additional Languages
- [ ] Arabic interface
- [ ] Urdu
- [ ] French
- [ ] Malay/Indonesian

---

## 🚨 CRITICAL SUCCESS FACTORS

1. **Design Quality** - Must feel sacred, not "app-like"
2. **Content Authenticity** - Theological accuracy is non-negotiable
3. **Performance** - Smooth, fast, no jank (60fps)
4. **Offline Experience** - Core features work without internet
5. **Widget Polish** - Widgets must be beautiful and reliable
6. **Audio Quality** - ElevenLabs voices must sound natural
7. **Privacy** - No data selling, transparent privacy policy

---

## 📂 DOCUMENTATION STRUCTURE

```
/documentation/
├── ROADMAP.md (this file)
├── DesignRules.md
├── MVP_Product_Plan.md
├── OnboardingSpec.md
├── TechStack.md
├── Technical_Architecture.md
│
├── /01-core-app/
│   ├── TabNavigation.md
│   ├── HomeScreen.md
│   ├── QuranScreen.md
│   ├── ListenScreen.md
│   ├── ExploreScreen.md
│   └── ProfileScreen.md
│
├── /02-content/
│   ├── QuranAPI_Integration.md
│   ├── DailyVerses_Strategy.md
│   ├── ProphetStories_ContentPlan.md
│   ├── Duas_ContentPlan.md
│   └── SpecialDays_Data.md
│
├── /03-audio/
│   ├── AudioPlayer_Architecture.md
│   ├── TrackPlayer_Setup.md
│   ├── QuranRecitation_Integration.md
│   └── ElevenLabs_Workflow.md
│
├── /04-firebase/
│   ├── Authentication_Flow.md
│   ├── Firestore_Schema.md
│   ├── Storage_Structure.md
│   └── DataSync_Strategy.md
│
├── /05-widgets/
│   ├── iOS_Widget_Architecture.md
│   ├── PrayerTimes_Widget.md
│   ├── DailyVerse_Widget.md
│   ├── Qibla_Widget.md
│   └── Premium_Widgets.md
│
├── /06-features/
│   ├── PrayerTimes_API.md
│   ├── QiblaCompass_Implementation.md
│   ├── MoodSystem_Logic.md
│   ├── TodaysPath_Mapping.md
│   ├── Streak_System.md
│   └── Premium_Gating.md
│
├── /07-premium/
│   ├── Subscription_Model.md
│   ├── RevenueCat_Integration.md
│   └── Premium_Features.md
│
└── /08-phases/
    ├── Phase1_Checklist.md
    ├── Phase2_Checklist.md
    └── Phase3_Checklist.md
```

---

## ✅ NEXT STEPS

1. **Review this roadmap** - Confirm all details align with vision
2. **Begin Phase 1** - Start with tab navigation updates
3. **Firebase setup** - Create project, configure
4. **Authentication implementation** - Guest + Email + Google + Apple
5. **Track progress** - Use `/documentation/08-phases/Phase1_Checklist.md`

---

**Let's build Hushu.** 🌙
