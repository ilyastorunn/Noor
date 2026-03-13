/**
 * Root Index — renders nothing.
 * The root _layout.tsx guard handles all routing:
 *   - Not onboarded → /onboarding
 *   - Onboarded     → /(tabs)
 */

import { View } from 'react-native';

export default function Index() {
  return <View />;
}
