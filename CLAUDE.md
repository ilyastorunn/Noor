# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Hushu** (also referred to as "Noor" in package.json) is a premium Islamic mindfulness mobile app built with React Native and Expo. The app provides guided meditations, sleep stories, dhikr/dua, and Quran content to help users grow spiritually and find peace.

## Development Commands

### Running the App
```bash
# Start Expo development server
npm start
# or
npx expo start

# Platform-specific
npm run android    # Start on Android emulator
npm run ios       # Start on iOS simulator
npm run web       # Start in web browser
```

### Code Quality
```bash
npm run lint      # Run ESLint (expo lint)
```

### Project Reset
```bash
npm run reset-project  # Move starter code to app-example/ and create blank app/
```

## Architecture

### Routing & Navigation
- Uses **Expo Router v6** with file-based routing (experimental typed routes enabled)
- React Compiler is enabled (experimental feature)
- Main routing structure:
  - `/app/index.tsx` - Entry point (redirects to onboarding)
  - `/app/onboarding/*` - Multi-step onboarding flow
  - `/app/(tabs)/*` - Main app with bottom tab navigation
  - `/app/modal.tsx` - Modal screens

### Onboarding Flow Architecture
The app has a complete onboarding system that gates access to the main app:

1. **Welcome Screen** (`/onboarding/index.tsx`) - Splash with "Bismillah/Begin" CTA
2. **Emotional Check-in** (`/onboarding/emotional-checkin.tsx`) - User selects current emotional state
3. **Goals Selection** (`/onboarding/goals.tsx`) - Multi-select grid of spiritual goals
4. **Content Preferences** (`/onboarding/content.tsx`) - Choose preferred content types
5. **Commitment** (`/onboarding/commitment.tsx`) - Daily time commitment selection
6. **Loading** (`/onboarding/loading.tsx`) - Final transition screen

**Onboarding State Management:**
- Uses AsyncStorage (`@react-native-async-storage/async-storage`) for persistence
- Storage service: `/services/storage.ts`
- Types: `/types/onboarding.ts`
- Root layout (`/app/_layout.tsx`) checks onboarding status and redirects accordingly

**IMPORTANT:** `app/_layout.tsx:51` currently has a temporary line `await clearOnboardingData()` that clears onboarding on every app start for testing. Remove this in production.

### Path Aliases
- `@/*` maps to project root (configured in tsconfig.json)
- Example: `import { DesignTokens } from '@/constants/theme'`

### Directory Structure
```
/app/              - Expo Router screens (file-based routing)
  /onboarding/     - Onboarding flow screens
  /(tabs)/         - Main app tab navigation
/components/       - Reusable React components
  /ui/             - UI component library
/constants/        - App constants (theme, etc.)
/services/         - Business logic & API services
/types/            - TypeScript type definitions
/assets/           - Images, fonts, and other static assets
/documentation/    - Design system documentation
```

## Design System ("Glowup" Theme)

The app follows a strict design system documented in `/documentation/DesignRules.md`. **Read this file before making UI changes.**

### Critical Design Rules

1. **Background Colors:**
   - **NEVER use gradients for screen backgrounds** - they look muddy
   - Screen backgrounds must be SOLID: `#0F172A` (Slate 900) or `#020617` (Slate 950)
   - Only use Green/Emerald colors for UI elements (cards, borders, buttons)

2. **Design Tokens** (`/constants/theme.ts`):
   - `DesignTokens.background.primary` - `#0F172A` (main screen background)
   - `DesignTokens.accent.primary` - `#F8D794` (Creased Khaki - primary buttons)
   - `DesignTokens.accent.emerald` - `#284139` (selected states/borders)
   - `DesignTokens.text.heading` - `#F8FAFC` (headings)
   - `DesignTokens.text.body` - `#94A3B8` (body text)
   - `DesignTokens.text.onPrimary` - `#111A19` (text on Khaki buttons - MUST be dark)

3. **Button Styling:**
   - Standard buttons: Khaki background with **dark text** (not white)
   - Ghost buttons: Wasabi border and text

4. **Selection Cards:**
   - ALL selection screens (moods, goals, content) use **2-column grid card layouts**
   - Unselected: Dark background (`#162021`), white icon/text
   - Selected: Emerald border (2px), Khaki icon/text tint, subtle glow

5. **Typography:**
   - Headings: Serif font (Playfair Display, Lora, or fallback to Georgia)
   - Body: Sans-serif (Inter, Nunito, or system default)

6. **Spacing & Radius:**
   - Use `Spacing` constants: `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px), `xxl` (48px)
   - Use `BorderRadius` constants: `sm` (8px), `md` (16px), `lg` (24px), `full` (9999px)

7. **Faceless Minimalism:**
   - Use abstract silhouettes, hands, nature elements (moon, olive trees, desert), or Islamic geometry
   - NO realistic faces in illustrations

### Design Philosophy
- **Atmosphere:** "Natural & Divine" - Deep, atmospheric, grounded
- **Move away from tech blue towards nature at night**
- **Prioritize grid/card layouts over simple text lists**
- **Visuals are primary**

## State Management

Currently using **local state + AsyncStorage** for onboarding data. No global state management library (Redux/Zustand) is implemented yet.

Firebase is installed (`firebase@^12.6.0`) but not yet configured in the codebase.

## Key Technologies

- **React Native:** 0.81.5
- **React:** 19.1.0
- **Expo SDK:** ~54.0
- **Expo Router:** ~6.0 (file-based routing)
- **TypeScript:** ~5.9.2
- **Navigation:** React Navigation (via Expo Router)
- **Animations:** react-native-reanimated ~4.1.1
- **Icons:** lucide-react-native, @expo/vector-icons
- **Storage:** @react-native-async-storage/async-storage
- **Images:** expo-image
- **Haptics:** expo-haptics
- **Gradients:** expo-linear-gradient

## Platform Support

- **iOS:** Supports iPad
- **Android:** Edge-to-edge enabled, adaptive icons configured
- **Web:** Static output configured

## Important Notes

1. **New Architecture Enabled:** The app uses React Native's new architecture (`"newArchEnabled": true` in app.json)
2. **Typed Routes:** Expo Router typed routes are experimental but enabled
3. **Safe Area:** Always use `SafeAreaView` from `react-native-safe-area-context` for proper spacing
4. **Haptic Feedback:** Use `expo-haptics` for tactile feedback on interactions
5. **Theme:** App uses a custom dark theme (`HushuDarkTheme`) defined in `app/_layout.tsx`
