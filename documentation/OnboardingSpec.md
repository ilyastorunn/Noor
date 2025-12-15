# ONBOARDING FLOW SPECIFICATION

This document outlines the exact flow, logic, and content for the "Huşu" (Working Title) app onboarding process. 
The primary language for the MVP is **English**.

## General Logic
- **Storage:** User responses must be saved in `AsyncStorage` temporarily.
- **Final Action:** Upon completion, data is synced to Firestore (if auth exists) or kept locally until signup.
- **Language Default:** English.

---

## SCREEN 1: Splash & Welcome
- **UI Components:** - **Logo:** Minimalist, centered.
  - **Slogan:** "Sanctuary for the Modern Soul."
  - **Background:** Subtle animated gradient (Midnight Blue/Anthracite).
- **Action:** - **Button:** "Bismillah / Begin"
  - **Effect:** Smooth fade-out to the next screen.

## SCREEN 2: Emotional Check-in (The Hook)
- **Title:** "How does your soul feel right now?"
- **Subtitle:** "Select the card that resonates with you."
- **Layout:** 2x2 Grid of visual cards (Images must be abstract/faceless).
- **Data/Options:**
  1. **Card:** "Anxious" (Overwhelmed) - *Visual: Stormy sea or heavy clouds.*
  2. **Card:** "Seeking" (Lost/Empty) - *Visual: A lone star in a vast desert sky.*
  3. **Card:** "Grateful" (Peaceful) - *Visual: Soft sunlight hitting a textured wall.*
  4. **Card:** "Weary" (Tired/Exhausted) - *Visual: A resting silhouette or a night lamp.*
- **Logic:** Single selection. Auto-advance after selection with a smooth transition.

## SCREEN 3: Goals Selection
- **Title:** "What brings you here today?"
- **Subtitle:** "Choose as many as you like."
- **Layout:** Vertical list of selectable pill-shaped items.
- **Data/Options (Multi-select allowed):**
  - Grow Closer to Allah
  - Find Peace & Patience (Sabr)
  - Sleep Better (Sunnah Routine)
  - Focus in Prayer (Khushu)
  - Connect with the Quran
- **UI Element:** "Continue" button appears at the bottom after at least 1 selection.

## SCREEN 4: Preferred Content
- **Title:** "How would you like to connect?"
- **Layout:** Horizontal scroll or Grid.
- **Data/Options:**
  - **Meditations** (Tafakkur & Breathwork)
  - **Sleep Stories** (Prophetic Tales)
  - **Dhikr & Dua** (Daily Remembrances)
  - **Quran** (Recitation & Reflection)

## SCREEN 5: Commitment (The Promise)
- **Title:** "How much time can you set aside daily?"
- **Subtitle:** "Consistency is key, even if it's small."
- **Layout:** 3 Large Cards.
- **Data/Options:**
  - **5 min** "Start Small"
  - **15 min** "Recommended" (Highlight this option)
  - **30 min+** "Deep Dive"
- **Logic:** Clicking an option saves the preference and moves to the next screen.

## SCREEN 6: The Magic Loading (Processing)
- **UI:** No buttons. Just a beautiful, calming animation (e.g., a halo of light expanding or Islamic geometric pattern assembling).
- **Text Rotator (Changes every 1.5 seconds):**
  - "Analyzing your goals..."
  - "Curating your daily sanctuary..."
  - "Welcome to Hushu."
- **Logic:** Wait approx. 3-4 seconds total, then navigate to `MainApp` (Home Screen).