# iOS WIDGET ARCHITECTURE

**Purpose:** Provide home screen widgets for quick access to Islamic content.

**Platform:** iOS 14+ (WidgetKit)

---

## WIDGETS OVERVIEW

| Widget | Sizes | Free/Premium | Update Frequency |
|--------|-------|--------------|------------------|
| Prayer Times | Small ❌, Medium ✅, Large ❌ | Medium free | 5×/day (each prayer) |
| Daily Verse | Small ✅, Medium ❌, Large ❌ | Small free | Daily (midnight) |
| Qibla Compass | Small ✅ | Free | Static |
| Daily Dua | All ❌ | All premium | Daily (midnight) |
| Streak Counter | Small ❌, Medium ❌ | All premium | Daily |

**Total Widgets:** 5 types, 11 size variants

---

## WIDGETKIT BASICS

### Widget Extension Setup

1. **In Xcode:**
   - File → New → Target → Widget Extension
   - Name: `HushuWidget`
   - Language: Swift
   - Include Configuration Intent: ✅ (for customization)

2. **App Groups (for data sharing):**
   - Add capability "App Groups" to:
     - Main app target
     - Widget extension target
   - Group ID: `group.com.yourcompany.hushu`

3. **Bundle Identifier:**
   - Widget: `com.yourcompany.hushu.widget`

---

## DATA SHARING (App ↔ Widget)

### Shared UserDefaults

**Write from React Native (Main App):**

```typescript
// services/widgetBridge.ts
import SharedGroupPreferences from 'react-native-shared-group-preferences';

const APP_GROUP = 'group.com.yourcompany.hushu';

export const updateWidgetData = async (widgetType: string, data: any) => {
  await SharedGroupPreferences.setItem(
    `widget_${widgetType}`,
    data,
    APP_GROUP
  );
};

// Example: Update prayer times for widget
await updateWidgetData('prayerTimes', {
  nextPrayer: 'Dhuhr',
  nextPrayerTime: '13:15',
  location: 'Istanbul, Turkey',
  prayers: {
    fajr: '05:30',
    sunrise: '07:00',
    dhuhr: '13:15',
    asr: '16:30',
    maghrib: '19:00',
    isha: '20:30',
  },
});
```

**Read from Swift (Widget):**

```swift
// HushuWidget/HushuWidget.swift
import WidgetKit
import SwiftUI

let appGroup = "group.com.yourcompany.hushu"

func getPrayerTimesData() -> [String: Any]? {
    let defaults = UserDefaults(suiteName: appGroup)
    guard let data = defaults?.data(forKey: "widget_prayerTimes") else {
        return nil
    }
    return try? JSONSerialization.jsonObject(with: data) as? [String: Any]
}
```

---

## WIDGET 1: PRAYER TIMES

### Medium Size (Free)

**Display:**
```
┌────────────────────────────────┐
│  🕌 Prayer Times               │
│  Istanbul, Turkey              │
├────────────────────────────────┤
│  Fajr     05:30                │
│  Sunrise  07:00                │
│  Dhuhr    13:15  ← Next in 2h  │
│  Asr      16:30                │
│  Maghrib  19:00                │
│  Isha     20:30                │
└────────────────────────────────┘
```

**Timeline:**
- Updates 5× per day (at each prayer time)
- Shows countdown to next prayer

**Swift Code (Simplified):**

```swift
struct PrayerTimesWidget: Widget {
    let kind: String = "PrayerTimesWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            PrayerTimesView(entry: entry)
        }
        .configurationDisplayName("Prayer Times")
        .description("View today's prayer schedule")
        .supportedFamilies([.systemMedium])  // Medium size only (free)
    }
}

struct PrayerTimesView: View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .leading) {
            Text("🕌 Prayer Times")
                .font(.headline)
            Text(entry.location)
                .font(.caption)
                .foregroundColor(.gray)

            Divider()

            ForEach(entry.prayers, id: \.name) { prayer in
                HStack {
                    Text(prayer.name)
                    Spacer()
                    Text(prayer.time)
                    if prayer.isNext {
                        Text("← Next")
                            .foregroundColor(.green)
                    }
                }
            }
        }
        .padding()
    }
}
```

---

## WIDGET 2: DAILY VERSE

### Small Size (Free)

**Display:**
```
┌──────────────────┐
│  📖 Daily Verse  │
│                  │
│  "So which of    │
│   the favors     │
│   of your Lord   │
│   would you      │
│   deny?"         │
│                  │
│  Ar-Rahman 55:13 │
└──────────────────┘
```

**Timeline:**
- Updates daily at midnight (user timezone)

---

## WIDGET 3: QIBLA COMPASS

### Small Size (Free)

**Display:**
```
┌──────────────────┐
│    🧭 Qibla      │
│                  │
│      ↗ NE        │
│    (45°)         │
│                  │
│  Mecca 2,150 km  │
└──────────────────┘
```

**Logic:**
- Static (no updates needed)
- Calculates bearing on widget load
- Uses last known location (from app)

---

## WIDGET 4: DAILY DUA (Premium)

### Small, Medium, Large (All Premium)

**Display (Small):**
```
┌──────────────────┐
│   🤲 Daily Dua   │
│                  │
│  Morning         │
│  Protection      │
│                  │
│  Tap to listen   │
└──────────────────┘
```

---

## WIDGET 5: STREAK COUNTER (Premium)

### Small, Medium

**Display (Small):**
```
┌──────────────────┐
│  🔥 Streak       │
│                  │
│      14          │
│     days         │
│                  │
│  Keep it going!  │
└──────────────────┘
```

---

## PREMIUM GATING

### Check Premium Status in Widget

```swift
func isPremium() -> Bool {
    let defaults = UserDefaults(suiteName: appGroup)
    return defaults?.bool(forKey: "isPremium") ?? false
}

// In widget view
if !isPremium() {
    // Show "Upgrade to Premium" placeholder
    Text("🔒 Premium Feature")
    Text("Tap to upgrade")
        .font(.caption)
}
```

**Note:** Widgets can't handle purchases. Deep link to app's paywall.

---

## DEEP LINKING

### Open App from Widget

```swift
.widgetURL(URL(string: "hushu://prayerTimes"))
```

**In React Native (Linking API):**

```typescript
import { Linking } from 'react-native';

Linking.addEventListener('url', (event) => {
  const url = event.url;

  if (url === 'hushu://prayerTimes') {
    // Navigate to Prayer Times screen
    router.push('/prayerTimes');
  }
});
```

---

## TIMELINE UPDATES

### Prayer Times Widget

```swift
struct Provider: TimelineProvider {
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let prayerData = getPrayerTimesData()
        let prayers = parsePrayers(prayerData)

        // Create timeline entries for each prayer
        var entries: [SimpleEntry] = []

        for prayer in prayers {
            let entry = SimpleEntry(date: prayer.time, prayers: prayers)
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}
```

**Result:** Widget updates automatically at each prayer time.

---

## TESTING WIDGETS

### 1. Run Widget Extension
- Select widget scheme in Xcode
- Run on simulator/device
- Add widget to home screen

### 2. Update Data from App
- Modify shared UserDefaults
- Widget should update within ~15 minutes (iOS limitation)
- Force update: Remove and re-add widget

### 3. Timeline Debugging
- Use `WidgetCenter.shared.reloadAllTimelines()` in app
- Check Console logs in Xcode

---

## DEPENDENCIES

```bash
npm install react-native-shared-group-preferences
```

**iOS Native (Xcode):**
- Add WidgetKit framework
- Enable App Groups capability
- Configure Info.plist for widget

---

## WIDGET ASSETS

### Icons
- Use SF Symbols (built-in iOS icons)
- Custom icons: Add to Assets.xcassets

### Colors
- Match app theme (dark mode)
- Use `Color("BackgroundPrimary")` (from asset catalog)

---

## LIMITATIONS

1. **No User Interaction:** Widgets are read-only (tap opens app)
2. **Size Limit:** Max 3 widget sizes per widget type
3. **Update Frequency:** iOS controls refresh rate (not instant)
4. **Data Sharing:** Limited to UserDefaults (App Groups)
5. **Premium Check:** Widget can't validate subscription directly (rely on app)

---

## ROADMAP

**Phase 3:**
- [ ] Create 5 widget types
- [ ] Implement data bridge (React Native → Swift)
- [ ] Test timeline updates
- [ ] Add premium gating
- [ ] Submit to App Store (widgets included in main app)

**Post-Launch:**
- [ ] Configurable widgets (user selects prayer calculation method, etc.)
- [ ] Interactive widgets (iOS 17+)
- [ ] Lock screen widgets (iOS 16+)

---

## NEXT STEPS

1. Set up Widget Extension in Xcode
2. Implement data bridge (`react-native-shared-group-preferences`)
3. Create Prayer Times widget (Medium size, free)
4. Test update frequency
5. Expand to other widgets
