# Hushu — Technical Architecture (MVP)

> This document defines the app structure and screen breakdown as implemented per the MVP Product Plan.

---

## Step 1: App Structure & Navigation

### Tab Bar Configuration

The app uses **Expo Router** with a file-based routing system. Four tabs are configured:

```
app/
├── (tabs)/
│   ├── _layout.tsx       # Tab navigation configuration
│   ├── index.tsx         # Home (Tab 1)
│   ├── quran.tsx         # Qur'an (Tab 2)
│   ├── discover.tsx      # Discover (Tab 3)
│   └── profile.tsx       # Profile (Tab 4)
├── _layout.tsx           # Root layout with auth/onboarding logic
├── index.tsx             # Entry redirect
├── modal.tsx             # Modal screen
└── onboarding/           # Onboarding flow
```

### Tab Bar Details

| Tab | Route | Icon | Purpose |
|-----|-------|------|---------|
| Home | `/(tabs)/` | Home | Daily spiritual direction |
| Qur'an | `/(tabs)/quran` | BookOpen | Calm, focused reading |
| Discover | `/(tabs)/discover` | Compass | Structured exploration |
| Profile | `/(tabs)/profile` | User | Personal settings |

### Navigation Rules

- ✅ 4 tabs only
- ❌ No floating action buttons
- ❌ No additional navigation elements
- ✅ Minimal tab bar styling (subtle border, solid background)

---

## Step 2: Screen-by-Screen Breakdown

### 2.1 Home — The Heart of the App

**File:** `app/(tabs)/index.tsx`

**Purpose:** Provide daily spiritual direction with minimal effort.

**Components (Vertical Order):**

1. **Daily Verse / Dua (Hero Section)**
   - One daily reading displayed prominently
   - "Read" button navigates to Qur'an tab
   - Completion contributes to daily streak

2. **Today's Path**
   - 2-3 gentle action suggestions
   - Based on mood from onboarding/weekly check-in
   - Example: "Read one verse • Make one dua • Reflect quietly"

3. **Prayer Times**
   - Current prayer highlighted
   - 6-prayer grid (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
   - Placeholder location ("Your Location")

4. **Qibla Direction**
   - Card with compass icon
   - Placeholder functionality in MVP

5. **Listen**
   - Entry point to audio content
   - Navigates to Discover tab

6. **Upcoming Special Day**
   - Ramadan, Eid, Kandil countdown
   - Informational only

**Explicit Omissions:**
- ❌ Social features
- ❌ Gamification
- ❌ Leaderboards
- ❌ Progress metrics beyond streak

---

### 2.2 Qur'an — Reading Without Distraction

**File:** `app/(tabs)/quran.tsx`

**Purpose:** Allow calm, focused Qur'an reading.

**Components:**

1. **Header**
   - Hamburger menu (opens Surah list)
   - "Daily Reading" label
   - Current Surah name

2. **Daily Reading Content**
   - Full Surah displayed
   - Clean, large typography
   - Verse numbers in subtle badges
   - English text only

3. **Surah List Modal**
   - Triggered by hamburger menu
   - List of Surahs with:
     - Number
     - Arabic name (transliterated)
     - English meaning
     - Verse count

4. **Completion Card**
   - "Mark as Read" button
   - Gentle completion message

**Explicit Omissions:**
- ❌ Audio playback
- ❌ Ayah highlighting
- ❌ Bookmarks
- ❌ Arabic text (MVP is English only)

---

### 2.3 Discover — Structured Exploration

**File:** `app/(tabs)/discover.tsx`

**Purpose:** Allow users to explore content without overwhelming them.

**Components:**

1. **Header**
   - "Discover" title (serif)
   - Subtitle: "Explore at your own pace"

2. **Category Grid**
   - 2-column layout
   - 6 static categories:
     - Qur'an
     - Duas
     - Stories of the Prophets
     - Special Days
     - Listen
     - Calm / Night
   - Each card has:
     - Icon
     - Category name
     - Brief description

**Explicit Omissions:**
- ❌ Search
- ❌ Filters
- ❌ Recommendations engine
- ❌ Dynamic content

---

### 2.4 Profile — Personal Space

**File:** `app/(tabs)/profile.tsx`

**Purpose:** Give users control without complexity.

**Components:**

1. **Streak Overview**
   - Current streak count
   - Flame icon
   - Gentle encouragement message

2. **Favorites (UI Only)**
   - Placeholder card
   - "Your saved content"

3. **Downloads (UI Only)**
   - Placeholder card
   - "Available offline"

4. **Notification Preferences**
   - Section header with Bell icon
   - Toggle: Prayer Times (on/off)
   - Toggle: Daily Reading Reminder (on/off)

5. **Mood History**
   - Last recorded mood
   - Date of last check-in

**Explicit Omissions:**
- ❌ Usage analytics
- ❌ Social connections
- ❌ Gamification badges
- ❌ Detailed progress dashboards

---

## Design System Reference

### Colors (from `constants/theme.ts`)

| Token | Value | Usage |
|-------|-------|-------|
| `background.primary` | `#020617` | Screen backgrounds |
| `background.surface` | `#111827` | Cards |
| `accent.primary` | `#F8D794` | CTAs, highlights |
| `accent.emerald` | `#284139` | Selected states, icons bg |
| `text.heading` | `#F8FAFC` | Headings |
| `text.body` | `#94A3B8` | Body text |
| `text.muted` | `#64748B` | Metadata |

### Spacing

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

### Border Radius

- Cards: 16-24px (`BorderRadius.lg`)
- Buttons: Full rounded (`BorderRadius.full`)

---

## Data Model (MVP)

### Local Storage

| Key | Type | Description |
|-----|------|-------------|
| `mood` | string | Current mood state |
| `streak` | number | Days of consecutive completion |
| `dailyProgress` | object | Today's completion status |
| `onboardingCompleted` | boolean | Onboarding status |

### Firebase (Cloud)

| Collection | Purpose |
|------------|---------|
| `users` | Authentication, preferences |
| `notifications` | Notification preferences (prayer times, reminders) |

---

## Implementation Checklist

### Step 1 ✅
- [x] Tab bar with 4 tabs
- [x] Expo Router file structure
- [x] Proper navigation icons (Lucide)
- [x] Dark theme styling

### Step 2 ✅
- [x] Home screen with all 6 sections
- [x] Qur'an screen with daily reading + Surah modal
- [x] Discover screen with 6 category cards
- [x] Profile screen with all 5 sections

### Step 3 (Next)
- [ ] Connect streak to local storage
- [ ] Implement mood check-in modal
- [ ] Connect "Mark as Read" to streak system
- [ ] Add prayer times API integration
- [ ] Implement Qibla compass logic
