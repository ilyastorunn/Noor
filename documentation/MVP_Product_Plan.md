# Hushu — MVP Product Plan

## 1. Product Vision

Hushu is a modern Islamic spiritual companion designed to help Muslims feel calmer, more grounded, and closer to their faith in daily life.

It is not a content library or a productivity tool. Hushu guides the user gently, offering just enough structure to support spiritual consistency without pressure or guilt.

Success is defined not by usage metrics, but by how often users return during moments of need.

---

## 2. Core Product Principles

1. **Guidance over choice** — The app should reduce decision fatigue.
2. **Consistency over intensity** — Small daily acts matter more than long sessions.
3. **Calm over completeness** — Fewer features, done quietly well.
4. **Faith-first design** — UI must never compete with the content.
5. **Offline-first mindset** — The app should feel reliable and present.

---

## 3. Navigation Structure (MVP)

**Tab Bar (4 Tabs)**

1. Home
2. Qur'an
3. Discover
4. Profile

No additional tabs. No floating actions.

---

## 4. Screen-by-Screen Breakdown

### 4.1 Home — The Heart of the App

**Purpose**: Provide daily spiritual direction with minimal effort.

**Primary Sections (Vertical Order)**

1. **Daily Verse / Dua (Hero Section)**

   * One daily reading
   * Clear "Read" action
   * Completion contributes to daily streak

2. **Today's Path (Mood-Based Guidance)**

   * Generated from onboarding + weekly mood check-in
   * Shows a simple mini-plan (2–3 actions max)
   * Example: "Read one verse • Make one dua • Reflect quietly"

3. **Prayer Times**

   * Current prayer highlighted
   * Location-based (logic later)

4. **Qibla Direction**

   * Simple compass-style card
   * Placeholder logic in MVP

5. **Listen**

   * Entry point to audio-based content
   * Navigates to Discover

6. **Upcoming Special Day**

   * Ramadan, Eid, Kandil, etc.
   * Informational only

**Out of Scope (MVP)**

* Social features
* Gamification
* Leaderboards

---

### 4.2 Qur'an — Reading Without Distraction

**Purpose**: Allow calm, focused Qur'an reading.

**Default View**

* Daily Reading screen
* Clean typography
* English text only

**Navigation**

* Hamburger menu opens Surah list

**Out of Scope (MVP)**

* Audio playback
* Ayah highlighting
* Bookmarks

---

### 4.3 Discover — Structured Exploration

**Purpose**: Allow users to explore content without overwhelming them.

**Structure**

* Grid of category cards

**Categories (Static)**

* Qur'an
* Duas
* Stories of the Prophets
* Special Days
* Listen
* Calm / Night

**Out of Scope (MVP)**

* Search
* Filters
* Recommendations engine

---

### 4.4 Profile — Personal Space

**Purpose**: Give users control without complexity.

**Sections**

1. **Streak Overview**

   * Daily completion status

2. **Favorites (UI Only)**

   * Placeholder

3. **Downloads (UI Only)**

   * Placeholder

4. **Notification Preferences**

   * Prayer times (on/off)
   * Daily reading reminder (on/off)

5. **Mood History (Basic)**

   * Last recorded mood

---

## 5. Mood System

* Initial mood captured during onboarding
* Weekly check-in (modal)
* Mood stored locally
* Mood affects:

  * Today's Path suggestions
  * Tone of guidance text

No daily mood prompts.

---

## 6. Streak System

* One daily goal: **Complete the daily reading**
* Binary state (done / not done)
* Streak resets if skipped

No gamified rewards.

---

## 7. Data Ownership

**Local Storage**

* Mood
* Streak
* Daily progress
* Bookmarks (future)

**Firebase (Cloud)**

* Authentication
* Onboarding completion
* Notification preferences

---

## 8. Notifications (MVP)

* Prayer time notifications
* Daily reading reminder
* User-configurable in Profile

---

## 9. What Defines MVP Success

The MVP is successful if users:

* Can read Qur'an daily without friction
* Understand what to do spiritually each day
* Feel calmer after opening the app
* Return voluntarily, not out of obligation

---

## 10. Explicit Non-Goals

* Social feeds
* Metrics dashboards
* Competitive elements
* Excessive personalization

Hushu must remain quiet, focused, and human.
