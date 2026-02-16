# TAB BAR NAVIGATION

**Framework:** Expo Router v6 (file-based routing)

**Structure:** 5 tabs in bottom navigation

---

## TAB CONFIGURATION

### Tab Bar Layout

```
┌─────────────────────────────────────────┐
│                                         │
│           (Screen Content)              │
│                                         │
├─────────────────────────────────────────┤
│  🏠    📖    🎧    🧭    👤            │
│ Home  Qur'an Listen Explore Profile    │
└─────────────────────────────────────────┘
```

### Tab Details

| Tab # | Label | Icon | Route | Purpose |
|-------|-------|------|-------|---------|
| 1 | Home | Home | `/(tabs)/index` | Daily verse, mood, prayer times, special days |
| 2 | Qur'an | BookOpen | `/(tabs)/quran` | Read/Listen to Qur'an |
| 3 | Listen | Headphones | `/(tabs)/listen` | Prophet stories + Duas (audio) |
| 4 | Explore | Compass | `/(tabs)/explore` | Categorized content discovery |
| 5 | Profile | User | `/(tabs)/profile` | Settings, streak, bookmarks |

---

## FILE STRUCTURE

```
app/
├── (tabs)/
│   ├── _layout.tsx          # Tab bar configuration
│   ├── index.tsx            # Home tab
│   ├── quran.tsx            # Qur'an tab
│   ├── listen.tsx           # Listen tab
│   ├── explore.tsx          # Explore tab (renamed from discover)
│   └── profile.tsx          # Profile tab
```

---

## IMPLEMENTATION

### File: `app/(tabs)/_layout.tsx`

```typescript
import { Tabs } from 'expo-router';
import { Home, BookOpen, Headphones, Compass, User } from 'lucide-react-native';
import { DesignTokens } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: DesignTokens.accent.primary, // Khaki
        tabBarInactiveTintColor: DesignTokens.text.muted,
        tabBarStyle: {
          backgroundColor: DesignTokens.background.primary, // Slate 950
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.04)',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter', // or your chosen sans-serif
        },
        headerShown: false, // Hide default header (use custom per screen)
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: 'Qur\'an',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="listen"
        options={{
          title: 'Listen',
          tabBarIcon: ({ color, size }) => <Headphones size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

---

## DESIGN SPECS

### Colors
- **Active Tab:** `#F8D794` (Creased Khaki)
- **Inactive Tab:** `#64748B` (Slate 500)
- **Background:** `#020617` (Slate 950)
- **Border:** `rgba(255,255,255,0.04)` (subtle)

### Typography
- **Font:** Inter (sans-serif)
- **Size:** 12px
- **Weight:** Regular

### Icons
- **Library:** Lucide React Native
- **Size:** 24px (default)
- **Stroke Width:** 2px

### Spacing
- **Tab Bar Height:** 60px
- **Padding Bottom:** 8px (for safe area)

---

## NAVIGATION BEHAVIOR

### Initial Route
- On app launch (after onboarding): **Home tab**
- Deep link handling: Can navigate to specific tab

### Tab State Persistence
- ✅ Each tab maintains its own navigation stack
- ✅ Returning to a tab preserves scroll position
- ✅ Tab bar always visible (no hiding on scroll)

### Gestures
- ✅ Swipe between tabs: **Disabled** (use tabs only, cleaner UX)
- ✅ Tap tab: Navigate to tab
- ✅ Double-tap active tab: **Scroll to top** (optional, add later)

---

## ACCESSIBILITY

### VoiceOver Support
- Each tab has clear label (e.g., "Home tab, 1 of 5")
- Active tab announced as "Selected"

### Large Text Support
- Tab labels scale with system font size
- Icons remain fixed size

---

## TESTING CHECKLIST

- [ ] All 5 tabs render correctly
- [ ] Active tab highlighted with Khaki color
- [ ] Inactive tabs use muted color
- [ ] Icons display correctly (no missing icons)
- [ ] Tab bar border visible but subtle
- [ ] Tab labels readable in dark mode
- [ ] Navigation between tabs smooth (no lag)
- [ ] Tab state persists (scroll position, etc.)
- [ ] Safe area respected (no overlap with home indicator)

---

## FUTURE ENHANCEMENTS (Post-MVP)

- [ ] Badge notifications (e.g., unread content count)
- [ ] Long-press tab for quick actions
- [ ] Haptic feedback on tab selection
- [ ] Animated tab transitions
- [ ] Dark/Light mode toggle affects tab bar colors

---

## MIGRATION FROM OLD STRUCTURE

**Old (4 tabs):**
- Home, Qur'an, Discover, Profile

**New (5 tabs):**
- Home, Qur'an, **Listen** (new!), **Explore** (renamed), Profile

**Changes Needed:**
1. Rename `app/(tabs)/discover.tsx` → `app/(tabs)/explore.tsx`
2. Create `app/(tabs)/listen.tsx`
3. Update `_layout.tsx` to include 5 tabs
4. Update icon imports (Headphones for Listen, Compass for Explore)

---

## NEXT STEPS

1. Update `app/(tabs)/_layout.tsx` with new 5-tab configuration
2. Rename Discover → Explore
3. Create Listen screen (basic structure)
4. Test navigation on simulator
5. Verify design matches specifications
