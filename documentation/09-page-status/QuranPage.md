# Qur'an Page Status

Last updated: March 13, 2026

## Purpose

Track the implementation status of the Qur'an reading page so product, design, and engineering can quickly see:

- what is already working
- what still needs runtime validation
- what remains before the page is considered finished

## Current Scope Delivered

The Qur'an page now includes:

- chapter list loading from Quran.com
- chapter reading with pagination
- request-staleness protection when switching chapters or loading more verses
- signed-in reading continuity (`lastRead`)
- signed-in bookmark support for both surahs and ayahs
- saved items shown at the top of the surah modal
- chapter-level streaming recitation using Quran.com
- signed-in listening resume (`lastListened`)
- premium-gated offline text downloads
- guest gating for resume, bookmarks, audio, and downloads
- native Firestore-backed persistence for progress and bookmarks

## What Was Implemented

### 1. Auth-aware feature gating

Guests can still browse and read the Qur'an page.

The following actions now require sign-in:

- continue reading
- bookmark surah
- bookmark ayah
- start audio playback
- manage downloads

If Firebase config is missing, the sign-in prompt explains that the feature is unavailable in the current build.

### 2. Reading continuity

Implemented:

- visible verse tracking using `FlatList` viewability callbacks
- persistence of the top visible verse as `quran.lastRead`
- restore flow on page load for signed-in users
- visible "Continue where you left off" card

Persistence layers:

- native: Firestore with RNFirebase offline persistence
- cloud: Firestore sync through the same native store

### 3. Bookmarks

Implemented:

- deterministic bookmark IDs
  - `surah:{chapterId}`
  - `ayah:{verseKey}`
- surah bookmark action in the surah header
- ayah bookmark action on each verse row
- saved items section inside the surah modal

Persistence layers:

- native: Firestore with RNFirebase offline persistence
- cloud: Firestore sync through the same native store

### 4. Audio

Implemented:

- `expo-audio` integration
- chapter-level audio source loading from Quran.com
- curated default reciter: Mishary Rashid Alafasy (`id: 7`)
- play / pause / seek backward / seek forward / replay controls
- persisted last listened position
- automatic source replacement when changing surah while playing

Current scope:

- surah-level playback only
- no ayah-level sync or highlight
- no background playback
- no lock screen controls
- no offline audio

### 5. Offline text downloads

Implemented:

- explicit downloaded-surah manifest
- full chapter text download page by page
- offline open behavior for downloaded chapters
- premium gate for downloads
- remove-download flow

Current storage model:

- chapter text pages cached in AsyncStorage
- chapter manifest stored separately in AsyncStorage

## Main Files Involved

- `app/(tabs)/quran.tsx`
- `services/quranApi.ts`
- `services/quranProgress.ts`
- `services/quranBookmarks.ts`
- `services/quranAudio.ts`
- `services/quranDownloads.ts`
- `services/firebase.ts`
- `services/auth.ts`
- `services/userProfile.ts`
- `contexts/AuthContext.tsx`
- `app/auth.tsx`
- `types/quran.ts`
- `types/user.ts`

## External Dependencies Added

- `expo-audio`
- `expo-network`
- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-firebase/firestore`
- `expo-build-properties`

## Important Technical Notes

### Firebase

The page is now wired for React Native Firebase auth + Firestore.

Runtime requirements:

- the app must run in an iOS development build
- Expo Go is not supported
- the Firebase iOS app bundle identifier and `GoogleService-Info.plist` must match the actual app bundle identifier
- current temporary dev-build bundle identifier: `com.ilyastorun.hushu-innerpeace`
- native iOS build now opens successfully with the temporary dev-build bundle identifier
- a `babel.config.js` with `expo-router/babel` was added after native testing exposed an Expo Router bundling failure (`EXPO_ROUTER_APP_ROOT`)

Without a valid native Firebase build:

- guest reading still works
- auth-required actions show an explanatory gate
- cloud sync is inactive

### Firestore offline behavior

Qur'an continuity and bookmarks now rely on RNFirebase Firestore on native, which provides offline persistence and queued writes without a separate AsyncStorage mirror.

### Audio provider boundary

Audio currently uses Quran.com, but the service layer is separated so another provider can replace it later without rewriting the screen.

## What Still Needs Validation

These items are implemented in code but still need device/runtime validation:

- Firebase sign in flow in a real native build
- first sign-in profile creation in Firestore
- bookmark sync behavior across sessions/devices
- resume restoration after app relaunch
- chapter audio loading and playback on device
- download / remove / reopen flow while offline
- the final `GoogleService-Info.plist` matching `com.ilyastorun.hushu`
- Metro restart after the Expo Router Babel fix, with cache cleared if the old bundle error persists

## Remaining Work

The page is substantially built, but not fully finished.

### Product / UX gaps

- add clearer premium upsell copy for locked downloads
- decide whether saved items should separate surahs vs ayahs visually
- decide whether bookmarks also need to surface in Profile
- refine empty states and loading states

### Technical gaps

- replace the temporary dev-build Firebase pairing (`com.ilyastorun.hushu-innerpeace`) with `com.ilyastorun.hushu` before App Store release
- improve saved-ayah jump logic so it restores exact cached page history without approximation
- add stronger error handling around partial download corruption
- consider debounced cloud writes for progress/bookmark/listen state if write volume becomes noisy
- confirm Quran.com audio response stability and edge cases

### Non-goals still intentionally excluded

- Arabic verse rendering
- multi-language translations
- ayah-timed playback sync
- background audio
- lock screen controls
- offline audio
- full bookmark management screen outside the surah modal

## Risks / Open Questions

- Firebase is integrated structurally, but final auth behavior cannot be trusted until the iOS plist matches the real bundle id and is tested in a dev build.
- Audio is network-dependent; poor connectivity may make playback experience inconsistent.
- Offline download currently covers text only, which matches the current product decision but may need clearer UX labeling.

## Recommended Next Steps

1. Build the app as an iOS development build and run it on simulator/device with the temporary `com.ilyastorun.hushu-innerpeace` bundle id.
2. Restart Metro with cache cleared and verify that the Expo Router bundling error is gone.
3. Validate sign-in, bookmark sync, resume restore, and download/remove flows end-to-end.
4. Tighten the saved-ayah restore behavior if exact page restoration is required.
5. Polish Qur'an-specific UI copy and empty states after runtime validation.
6. Before App Store release, switch Firebase and the iOS bundle id back to `com.ilyastorun.hushu`.

## Completion Snapshot

Estimated status: `implementation-complete, native-firebase-validation-in-progress`

Meaning:

- core feature work is in place
- real environment testing and UX polish are still required before calling the page finished
