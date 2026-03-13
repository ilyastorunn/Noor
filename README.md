# Hushu

Hushu is a premium Islamic mindfulness app built with React Native, Expo Router, and TypeScript. The current codebase includes:

- a complete onboarding flow persisted with AsyncStorage
- a 5-tab app shell
- a Qur'an reader backed by the Quran.com API with local caching
- a central design token system built around the "Midnight Sanctuary" theme

## Development

```bash
npm install
npm start
```

Platform shortcuts:

```bash
npm run ios
npm run android
npm run web
```

Quality checks:

```bash
npm run lint
npx tsc --noEmit
```

## Project Structure

```text
app/                Expo Router routes
app/onboarding/     onboarding flow
app/(tabs)/         main tab screens
assets/             icons and onboarding illustrations
components/         reusable UI building blocks
constants/          design tokens and static mappings
documentation/      product, architecture, and phase docs
services/           storage and API integrations
types/              TypeScript models
```

## Current Priorities

- finish wiring onboarding choices into the main app experience
- replace remaining placeholder content in Home, Listen, Explore, and Profile
- add Firebase auth and sync
- align documentation with the current route structure and product naming
