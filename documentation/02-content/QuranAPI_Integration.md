# QUR'AN API INTEGRATION

**API:** Quran.com API (https://api.qurancdn.com/)

**Purpose:** Fetch Qur'an text (Arabic, English, Turkish) with hybrid offline strategy.

---

## API OVERVIEW

### Base URL
```
https://api.qurancdn.com/api/v4/
```

### Key Endpoints

| Endpoint | Purpose | Example |
|----------|---------|---------|
| `/chapters` | List all 114 chapters (Surahs) | `GET /chapters` |
| `/chapters/{id}` | Get chapter details | `GET /chapters/1` (Al-Fatiha) |
| `/verses/by_chapter/{id}` | Get all verses in a chapter | `GET /verses/by_chapter/1` |
| `/verses/by_key/{key}` | Get specific verse | `GET /verses/by_key/2:255` (Ayat al-Kursi) |
| `/recitations` | List available reciters | `GET /recitations` |
| `/recitations/{id}/by_chapter/{chapter}` | Get audio for chapter | `GET /recitations/7/by_chapter/1` |

### Authentication
- ❌ **No API key required** (public API)
- ✅ Free tier is sufficient for MVP

---

## HYBRID OFFLINE STRATEGY

### Problem
- Bundling all Qur'an text (3 languages) = ~5-8 MB
- Downloading on-demand risks slow internet issues

### Solution: Hybrid Approach

**1. Bundle Cüz 30 (Amme Cüzü) in App**
- Surahs 78-114 (37 surahs)
- Short, frequently read surahs
- Embedded as static JSON in app bundle
- ~500 KB total

**2. Download on Demand + Cache**
- User opens Surah 1-77 → Fetch from API
- Cache in AsyncStorage (or SQLite)
- Subsequent opens load from cache
- Network check: If offline, serve cache

**3. Slow Internet Optimization**
- Show cached data immediately (if available)
- Fetch in background
- Update UI when fresh data arrives
- Timeout: 10 seconds → fallback to cache or error

---

## API SERVICE

### File: `services/quranApi.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.qurancdn.com/api/v4';

// Translation IDs
const TRANSLATIONS = {
  en: 131, // Sahih International
  tr: 77,  // Diyanet (Turkish)
  ar: 'ar-quran-simple', // Arabic text (Uthmani)
};

// Fetch chapters (Surahs)
export const getChapters = async () => {
  const cacheKey = 'quran:chapters';
  const cached = await AsyncStorage.getItem(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const response = await fetch(`${BASE_URL}/chapters`);
  const data = await response.json();

  await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

// Fetch verses for a chapter (with caching)
export const getChapterVerses = async (
  chapterId: number,
  language: 'en' | 'tr' | 'ar' = 'en'
) => {
  const translationId = TRANSLATIONS[language];
  const cacheKey = `quran:chapter:${chapterId}:${language}`;

  // Check cache first
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch from API
  const url = `${BASE_URL}/verses/by_chapter/${chapterId}?translations=${translationId}&language=${language}`;
  const response = await fetch(url, { timeout: 10000 }); // 10s timeout
  const data = await response.json();

  // Cache the result
  await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

// Check if chapter is bundled (Cüz 30)
export const isChapterBundled = (chapterId: number): boolean => {
  return chapterId >= 78 && chapterId <= 114;
};

// Get bundled chapter (from local JSON)
export const getBundledChapter = async (chapterId: number, language: 'en' | 'tr' | 'ar') => {
  // Import from static JSON file
  const bundledData = require(`@/assets/quran/cuz30_${language}.json`);
  return bundledData.chapters.find((ch: any) => ch.id === chapterId);
};
```

---

## BUNDLED DATA STRUCTURE

### File: `/assets/quran/cuz30_en.json`

```json
{
  "version": "1.0",
  "language": "en",
  "translation": "Sahih International",
  "chapters": [
    {
      "id": 78,
      "name": "An-Naba",
      "transliteration": "The Tidings",
      "verses": [
        {
          "number": 1,
          "arabic": "عَمَّ يَتَسَاءَلُونَ",
          "translation": "About what are they asking one another?"
        },
        {
          "number": 2,
          "arabic": "عَنِ النَّبَإِ الْعَظِيمِ",
          "translation": "About the great news"
        }
        // ... rest of verses
      ]
    }
    // ... surahs 79-114
  ]
}
```

**TODO:** Generate this JSON from Quran.com API (one-time script).

---

## AUDIO RECITATION

### Reciters (Popular)

| ID | Name | Style |
|----|------|-------|
| 7 | Mishary Rashid Alafasy | Clear, modern |
| 2 | Abdul Basit Abdul Samad | Classical |
| 12 | Mahmoud Khalil Al-Hussary | Scholarly |

### Audio URL Pattern

```
https://verses.quran.com/recitation/{reciter_id}/{surah}_{verse}.mp3
```

Example:
```
https://verses.quran.com/recitation/7/1_1.mp3
// Reciter 7 (Alafasy), Surah 1, Verse 1
```

### Implementation

```typescript
export const getVerseAudioURL = (
  reciterId: number,
  surahNumber: number,
  verseNumber: number
): string => {
  return `https://verses.quran.com/recitation/${reciterId}/${surahNumber}_${verseNumber}.mp3`;
};

// Get full chapter audio
export const getChapterAudioURL = async (reciterId: number, chapterId: number) => {
  const url = `${BASE_URL}/recitations/${reciterId}/by_chapter/${chapterId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.audio_file; // Returns audio file object
};
```

---

## DOWNLOAD FOR OFFLINE (PREMIUM)

### Strategy
- User taps "Download" on Surah screen
- Download verses JSON + audio files
- Store in local file system (React Native FS)
- Mark as downloaded in AsyncStorage

### Implementation (Phase 3)

```typescript
import RNFS from 'react-native-fs';

export const downloadChapter = async (chapterId: number, language: 'en' | 'tr' | 'ar') => {
  // 1. Download verses JSON
  const verses = await getChapterVerses(chapterId, language);

  // 2. Download audio files (if user wants audio)
  const audioURLs = verses.verses.map((v: any) =>
    getVerseAudioURL(7, chapterId, v.verse_number)
  );

  for (const url of audioURLs) {
    const filename = url.split('/').pop();
    const destPath = `${RNFS.DocumentDirectoryPath}/quran/audio/${filename}`;
    await RNFS.downloadFile({ fromUrl: url, toFile: destPath }).promise;
  }

  // 3. Mark as downloaded
  await AsyncStorage.setItem(`downloaded:chapter:${chapterId}`, 'true');
};
```

---

## NETWORK ERROR HANDLING

```typescript
export const getChapterVersesSafe = async (chapterId: number, language: 'en' | 'tr' | 'ar') => {
  try {
    // Try API first
    return await getChapterVerses(chapterId, language);
  } catch (error) {
    // Fallback to cache
    const cacheKey = `quran:chapter:${chapterId}:${language}`;
    const cached = await AsyncStorage.getItem(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // No cache, throw error
    throw new Error('No internet and no cached data available');
  }
};
```

---

## SEARCH (FUTURE FEATURE)

Quran.com API supports search:

```
GET /search?q={query}&language={language}
```

Example:
```
https://api.qurancdn.com/api/v4/search?q=patience&language=en
```

**Defer to Post-MVP** (not in Phase 1-3).

---

## DATA USAGE OPTIMIZATION

### Caching Strategy
- Cache chapters list indefinitely (rarely changes)
- Cache verses for 30 days
- Clear cache if storage > 50 MB (user prompt)

### Bundle Size
- Cüz 30 (3 languages): ~1.5 MB (acceptable)
- Rest downloaded on-demand

---

## TESTING CHECKLIST

- [ ] Fetch chapters list works
- [ ] Fetch verses for Surah 1 (Al-Fatiha) works
- [ ] Arabic + English + Turkish texts display correctly
- [ ] Bundled chapters (78-114) load instantly
- [ ] Downloaded chapters (1-77) cache properly
- [ ] Offline mode serves cached data
- [ ] Slow internet fallback works
- [ ] Audio URLs generate correctly
- [ ] Recitation playback works (see `/documentation/03-audio/`)

---

## DEPENDENCIES

```bash
npm install @react-native-async-storage/async-storage
npm install react-native-fs  # For file downloads (Phase 3)
```

---

## NEXT STEPS

1. Create bundled JSON files (`cuz30_en.json`, `cuz30_tr.json`, `cuz30_ar.json`)
2. Implement `quranApi.ts` service
3. Test API calls with real data
4. Integrate into Qur'an Screen UI
