/**
 * Quran API Service
 * Source: Quran.com API v4
 * Strategy: API-first with AsyncStorage cache fallback
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Chapter,
  ChapterAudioFile,
  ChapterRecitationResponse,
  ChaptersResponse,
  CleanVerse,
  Pagination,
  VersesResponse,
} from '@/types/quran';

const BASE_URL = 'https://api.qurancdn.com/api/v4';

// Sahih International (English)
const TRANSLATION_ID = 20;
export const VERSES_PER_PAGE = 50;
const REQUEST_TIMEOUT_MS = 10_000;

// ── Helpers ──────────────────────────────────────────────────

/** Strip HTML tags (e.g. <sup foot_note=...>1</sup>) from translation text */
export function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

/** Fetch with timeout */
async function fetchWithTimeout(
  url: string,
  timeoutMs = REQUEST_TIMEOUT_MS,
  signal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  const abortRelay = () => controller.abort();

  signal?.addEventListener('abort', abortRelay);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  } finally {
    signal?.removeEventListener('abort', abortRelay);
  }
}

// ── Chapters ─────────────────────────────────────────────────

const CHAPTERS_CACHE_KEY = 'quran:chapters';

/** Fetch all 114 chapters. Cached indefinitely. */
export async function getChapters(): Promise<Chapter[]> {
  // Try cache first
  try {
    const cached = await AsyncStorage.getItem(CHAPTERS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as Chapter[];
    }
  } catch {
    // cache read failed, continue to network
  }

  // Fetch from API
  const response = await fetchWithTimeout(`${BASE_URL}/chapters`);
  if (!response.ok) {
    throw new Error(`Failed to fetch chapters: ${response.status}`);
  }

  const data: ChaptersResponse = await response.json();
  const chapters = data.chapters;

  // Cache
  try {
    await AsyncStorage.setItem(CHAPTERS_CACHE_KEY, JSON.stringify(chapters));
  } catch {
    // cache write failed, non-critical
  }

  return chapters;
}

// ── Verses ───────────────────────────────────────────────────

export function versesCacheKey(chapterId: number, page: number): string {
  return `quran:verses:${chapterId}:${page}`;
}

export interface GetVersesResult {
  verses: CleanVerse[];
  pagination: Pagination;
}

export async function readCachedChapterVersesPage(
  chapterId: number,
  page: number,
): Promise<GetVersesResult | null> {
  try {
    const cached = await AsyncStorage.getItem(versesCacheKey(chapterId, page));
    if (!cached) {
      return null;
    }

    return JSON.parse(cached) as GetVersesResult;
  } catch {
    return null;
  }
}

/** Fetch verses for a chapter page. Cached per chapter+page. */
export async function getChapterVerses(
  chapterId: number,
  page: number = 1,
  options: {
    forceRefresh?: boolean;
    signal?: AbortSignal;
  } = {},
): Promise<GetVersesResult> {
  const cacheKey = versesCacheKey(chapterId, page);

  // Try cache first
  if (!options.forceRefresh) {
    const cached = await readCachedChapterVersesPage(chapterId, page);
    if (cached) {
      return cached;
    }
  }

  // Fetch from API
  const url =
    `${BASE_URL}/verses/by_chapter/${chapterId}` +
    `?translations=${TRANSLATION_ID}` +
    `&per_page=${VERSES_PER_PAGE}` +
    `&page=${page}`;

  const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS, options.signal);
  if (!response.ok) {
    throw new Error(`Failed to fetch verses: ${response.status}`);
  }

  const data: VersesResponse = await response.json();

  // Clean verses — strip HTML from translations
  const verses: CleanVerse[] = data.verses.map((v) => ({
    verseNumber: v.verse_number,
    verseKey: v.verse_key,
    translation:
      v.translations && v.translations.length > 0
        ? stripHtmlTags(v.translations[0].text)
        : '',
    apiPage: page,
  }));

  const result: GetVersesResult = {
    verses,
    pagination: data.pagination,
  };

  // Cache
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {
    // cache write failed, non-critical
  }

  return result;
}

// ── Safe wrappers (cache fallback on network failure) ────────

/** Get chapters — returns cached data on network failure, throws only if no cache exists. */
export async function getChaptersSafe(): Promise<Chapter[]> {
  try {
    return await getChapters();
  } catch {
    // Network failed — try cache
    const cached = await AsyncStorage.getItem(CHAPTERS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as Chapter[];
    }
    throw new Error('No internet connection and no cached chapters available.');
  }
}

/** Get verses — returns cached data on network failure, throws only if no cache exists. */
export async function getChapterVersesSafe(
  chapterId: number,
  page: number = 1,
  options: {
    forceRefresh?: boolean;
    signal?: AbortSignal;
  } = {},
): Promise<GetVersesResult> {
  try {
    return await getChapterVerses(chapterId, page, options);
  } catch {
    // Network failed — try cache
    const cached = await readCachedChapterVersesPage(chapterId, page);
    if (cached) {
      return cached;
    }
    throw new Error('No internet connection and no cached verses available.');
  }
}

export async function removeChapterVerseCache(
  chapterId: number,
  pageCount: number,
): Promise<void> {
  const keys = Array.from({ length: pageCount }, (_, index) =>
    versesCacheKey(chapterId, index + 1),
  );

  if (keys.length === 0) {
    return;
  }

  await AsyncStorage.multiRemove(keys);
}

export async function getChapterRecitationAudio(
  reciterId: number,
  chapterId: number,
): Promise<ChapterAudioFile> {
  const response = await fetchWithTimeout(
    `${BASE_URL}/recitations/${reciterId}/by_chapter/${chapterId}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch recitation audio: ${response.status}`);
  }

  const data: ChapterRecitationResponse = await response.json();
  if (!data.audio_file?.audio_url) {
    throw new Error('No recitation audio available for this chapter.');
  }

  return data.audio_file;
}
