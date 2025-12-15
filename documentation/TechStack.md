# TECH STACK & CODING STANDARDS

You act as a Senior React Native Engineer. You must strictly adhere to the following technical stack and coding standards for the "Huşu" project.

## 1. Core Framework
- **Framework:** React Native (Expo SDK 50+).
- **Language:** TypeScript (preferred) or JavaScript (ES6+).
- **Project Type:** Bare workflow or Managed workflow (Expo Go compatible).

## 2. Navigation
- **Library:** React Navigation (v6+).
- **Structure:** - `NativeStack` for linear flows (Onboarding).
  - `BottomTabs` for the main app interface.
- **Rule:** Keep navigation logic in `src/navigation/`.

## 3. Styling & UI
- **Method:** `StyleSheet.create` (Native Styling).
- **Libraries:** - `expo-linear-gradient` (For backgrounds/cards).
  - `expo-haptics` (For tactile feedback on interactions).
  - **FORBIDDEN:** Do NOT use heavy UI kits like NativeBase, Tamagui, or Paper. Build custom, lightweight components.
- **Icons:** `Lucide React Native` or `Expo Vector Icons`.

## 4. Backend & Data
- **Service:** Firebase (Web SDK modular style).
- **Auth:** Firebase Auth.
- **Database:** Cloud Firestore.
- **Storage:** Firebase Storage (for audio/images).
- **Local Storage:** `@react-native-async-storage/async-storage` (For persistance of user preferences before auth).

## 5. Coding Principles
- **Clean Architecture:** Separate concerns (`screens/`, `components/`, `services/`, `utils/`).
- **Hooks:** Use functional components with Hooks.
- **Performance:** Memoize heavy components (`React.memo`, `useMemo`).
- **Comments:** Add brief comments for complex logic only.

## 6. AI & Content
- **Audio:** Custom player implementation using `expo-av`.
- **Assets:** All images and audio files will be fetched from remote URLs (Firebase/CDN), avoid bundling large assets.