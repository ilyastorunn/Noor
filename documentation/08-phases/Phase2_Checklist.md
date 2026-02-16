# PHASE 2: CONTENT & AUDIO INTEGRATION

**Goal:** Integrate real content (Qur'an, Duas, Stories), implement audio playback, and build core features.

**Target:** Functional app with playable content and working features.

---

## ✅ CHECKLIST

### 1. QUR'AN INTEGRATION
**See:** `/documentation/02-content/QuranAPI_Integration.md`

#### 1.1 API Setup
- [ ] Quran.com API research
- [ ] API key setup (if needed)
- [ ] API service file (`services/quranApi.ts`)
- [ ] Error handling & retry logic

#### 1.2 Hybrid Offline Strategy
- [ ] Bundle Fatiha + short surahs (Cüz 30) in app
- [ ] Implement chapter download on demand
- [ ] Cache downloaded chapters (AsyncStorage/SQLite)
- [ ] Network status detection
- [ ] Slow internet optimization (show cached, fetch in background)

#### 1.3 Qur'an Reading Screen
- [ ] Fetch chapter list from API
- [ ] Surah selection modal
- [ ] Verse display (Arabic, English, Turkish)
- [ ] Language toggle
- [ ] Scroll position persistence
- [ ] "Mark as Read" functionality
- [ ] Reading progress tracking

#### 1.4 Qur'an Audio (Listen Mode)
- [ ] Reciter selection (Alafasy, Sudais, etc.)
- [ ] Audio URL fetching from API
- [ ] Streaming playback
- [ ] Download for offline (premium feature)

### 2. DAILY VERSES STRATEGY
**See:** `/documentation/02-content/DailyVerses_Strategy.md`

- [ ] Thematic weekly strategy implementation
  - [ ] 52 themes defined (Sabr, Shukr, Iman, etc.)
  - [ ] 7 verses per theme curated
  - [ ] Total: 364 verses
- [ ] Daily verse rotation logic (midnight reset)
- [ ] Verse display on Home screen
- [ ] Theme metadata (theme name, description)

### 3. PROPHET STORIES
**See:** `/documentation/02-content/ProphetStories_ContentPlan.md`

#### 3.1 Content Creation
- [ ] **5 Prophets selected:**
  1. Prophet Nuh (Noah)
  2. Prophet Ibrahim (Abraham)
  3. Prophet Musa (Moses)
  4. Prophet Yusuf (Joseph)
  5. Prophet Isa (Jesus)
- [ ] Each story divided into **5 episodes**
- [ ] Episodes 1-2: Free
- [ ] Episodes 3-5: Premium
- [ ] Story text written (meditatif tone)
- [ ] Theological review completed

#### 3.2 ElevenLabs Audio Production
**See:** `/documentation/03-audio/ElevenLabs_Workflow.md`

- [ ] ElevenLabs API key setup
- [ ] Voice selection:
  - [ ] Male voice (British/American)
  - [ ] Female voice (British/American)
- [ ] Audio generation (25 episodes × 2 voices = 50 files)
- [ ] Audio file naming convention
- [ ] Upload to Firebase Storage
- [ ] Metadata in Firestore

#### 3.3 Stories UI
- [ ] Story list on Listen tab
- [ ] Episode list per story
- [ ] Premium badge on locked episodes
- [ ] Audio player integration
- [ ] Progress tracking

### 4. DUAS (SUPPLICATIONS)
**See:** `/documentation/02-content/Duas_ContentPlan.md`

#### 4.1 Content Preparation
- [ ] **10 Duas prepared:**
  1. Morning Duas
  2. Evening Duas
  3. Before Meal
  4. After Meal
  5. Travel Dua
  6. Sleep Dua
  7. Waking Up Dua
  8. Entering Mosque
  9. Ablution (Wudu) Dua
  10. After Prayer
- [ ] Arabic text
- [ ] English translation
- [ ] Turkish translation
- [ ] Transliteration

#### 4.2 Dua Audio (Non-AI)
- [ ] Find royalty-free dua recitations
- [ ] Sources:
  - [ ] Freesound.org
  - [ ] IslamicFinder
  - [ ] Creative Commons libraries
- [ ] Upload to Firebase Storage
- [ ] Metadata in Firestore

#### 4.3 Duas UI
- [ ] Category-based listing
- [ ] Text display
- [ ] Audio playback
- [ ] Bookmark functionality

### 5. AUDIO PLAYER
**See:** `/documentation/03-audio/AudioPlayer_Architecture.md`

#### 5.1 react-native-track-player Setup
- [ ] Install library (`npm install react-native-track-player`)
- [ ] iOS configuration
- [ ] Service setup (`services/audioPlayer.ts`)
- [ ] Track queue management

#### 5.2 Player UI Component
- [ ] Play/Pause button
- [ ] Progress bar
- [ ] Time display (current / total)
- [ ] Loading state
- [ ] Error handling

#### 5.3 Background Playback
- [ ] iOS background mode configuration
- [ ] Lock screen controls
- [ ] Notification controls (iOS Control Center)
- [ ] Resume playback on app reopen

#### 5.4 Player Features
- [ ] Streaming from URL
- [ ] Download for offline (premium)
- [ ] Playback state persistence
- [ ] Voice selection (male/female toggle for stories)

### 6. PRAYER TIMES
**See:** `/documentation/06-features/PrayerTimes_API.md`

#### 6.1 Aladhan API Integration
- [ ] API service file (`services/prayerTimes.ts`)
- [ ] Location permission request (iOS)
- [ ] Fetch prayer times by coordinates
- [ ] Fallback: Manual city selection
- [ ] Cache prayer times (valid for 24h)

#### 6.2 Prayer Times UI
- [ ] Display 6 prayers (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
- [ ] Highlight current/next prayer
- [ ] Countdown to next prayer
- [ ] Location display

### 7. QIBLA COMPASS
**See:** `/documentation/06-features/QiblaCompass_Implementation.md`

- [ ] Install react-native-sensors (magnetometer)
- [ ] Location permission
- [ ] Calculate Qibla direction (bearing formula)
- [ ] Compass UI (animated arrow)
- [ ] Calibration instructions

### 8. SPECIAL DAYS
**See:** `/documentation/02-content/SpecialDays_Data.md`

#### 8.1 Islamic Finder API
- [ ] API integration for Islamic calendar
- [ ] Fetch upcoming special days:
  - [ ] Ramadan
  - [ ] Eid al-Fitr
  - [ ] Eid al-Adha
  - [ ] Laylat al-Qadr
  - [ ] Ashura
  - [ ] Mawlid
  - [ ] 3 Holy Months (Rajab, Sha'ban, Ramadan)
- [ ] Countdown logic

#### 8.2 Special Days UI
- [ ] Display on Home screen
- [ ] Countdown timer
- [ ] Special day details screen

### 9. TODAY'S PATH (MOOD-BASED)
**See:** `/documentation/06-features/TodaysPath_Mapping.md`

- [ ] Mood → Content mapping matrix implementation
- [ ] Daily verse suggestion based on mood
- [ ] Dua suggestion based on mood
- [ ] Story suggestion based on mood
- [ ] UI on Home screen

### 10. BOOKMARKS
- [ ] Bookmark data model (Firestore)
- [ ] Bookmark button on:
  - [ ] Qur'an verses
  - [ ] Duas
  - [ ] Stories
- [ ] Bookmarks list (Profile screen)
- [ ] Remove bookmark

### 11. STREAK SYSTEM
**See:** `/documentation/06-features/Streak_System.md`

- [ ] Streak logic (increment on daily verse read)
- [ ] Reset logic (24h timeout)
- [ ] Local storage (AsyncStorage)
- [ ] Firestore sync
- [ ] Display on Profile screen

---

## 🎯 SUCCESS CRITERIA

- ✅ User can read Qur'an (3 languages)
- ✅ User can listen to Qur'an recitation
- ✅ User can listen to Prophet stories (Episodes 1-2 free)
- ✅ User can read/listen to Duas
- ✅ Prayer times display correctly
- ✅ Qibla compass points to Mecca
- ✅ Today's Path shows mood-based suggestions
- ✅ Bookmarks work
- ✅ Streak increments daily

---

## 🚧 OUT OF SCOPE (Phase 2)

- ❌ Widgets
- ❌ Premium gating enforcement (UI ready, logic in Phase 3)
- ❌ Notifications
- ❌ Downloads (UI ready, logic in Phase 3)

---

## 📦 DEPENDENCIES

**NPM Packages:**
```bash
npm install react-native-track-player
npm install react-native-sensors
npm install axios
```

**APIs:**
- Quran.com API
- Aladhan Prayer Times API
- IslamicFinder API
- ElevenLabs API

---

## ⏭️ NEXT PHASE

After Phase 2 completion → **Phase 3: Widgets, Premium, Polish**
