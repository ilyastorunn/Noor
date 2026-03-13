import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';

import {
  getChapterVerses,
  readCachedChapterVersesPage,
  removeChapterVerseCache,
} from '@/services/quranApi';
import type { Chapter } from '@/types/quran';

export interface DownloadedChapterManifest {
  chapterId: number;
  chapterName: string;
  pageCount: number;
  downloadedAt: string;
  schemaVersion: number;
}

const DOWNLOAD_PREFIX = '@hushu/quran/downloads/text:';
const DOWNLOAD_SCHEMA_VERSION = 1;

function manifestKey(chapterId: number) {
  return `${DOWNLOAD_PREFIX}${chapterId}`;
}

async function readManifest(chapterId: number): Promise<DownloadedChapterManifest | null> {
  try {
    const value = await AsyncStorage.getItem(manifestKey(chapterId));
    return value ? (JSON.parse(value) as DownloadedChapterManifest) : null;
  } catch {
    return null;
  }
}

async function writeManifest(chapterId: number, manifest: DownloadedChapterManifest): Promise<void> {
  await AsyncStorage.setItem(manifestKey(chapterId), JSON.stringify(manifest));
}

export async function getDownloadedChapterManifest(
  chapterId: number,
): Promise<DownloadedChapterManifest | null> {
  return readManifest(chapterId);
}

export async function isChapterDownloaded(chapterId: number): Promise<boolean> {
  return (await readManifest(chapterId)) != null;
}

export async function listDownloadedChapters(): Promise<DownloadedChapterManifest[]> {
  const keys = await AsyncStorage.getAllKeys();
  const manifestKeys = keys.filter((key) => key.startsWith(DOWNLOAD_PREFIX));

  if (manifestKeys.length === 0) {
    return [];
  }

  const entries = await AsyncStorage.multiGet(manifestKeys);
  return entries
    .map(([, value]) => {
      if (!value) {
        return null;
      }

      try {
        return JSON.parse(value) as DownloadedChapterManifest;
      } catch {
        return null;
      }
    })
    .filter((item): item is DownloadedChapterManifest => item != null)
    .sort((left, right) => left.chapterId - right.chapterId);
}

export async function downloadChapterText(
  chapter: Chapter,
  onProgress?: (currentPage: number, totalPages: number) => void,
): Promise<DownloadedChapterManifest> {
  const networkState = await Network.getNetworkStateAsync();
  if (!networkState.isConnected || networkState.isInternetReachable === false) {
    throw new Error('Connect to the internet to download this surah.');
  }

  const firstPage = await getChapterVerses(chapter.id, 1, { forceRefresh: true });
  let totalPages = firstPage.pagination.total_pages;

  onProgress?.(1, totalPages);

  for (let page = 2; page <= totalPages; page += 1) {
    await getChapterVerses(chapter.id, page, { forceRefresh: true });
    onProgress?.(page, totalPages);
  }

  const manifest: DownloadedChapterManifest = {
    chapterId: chapter.id,
    chapterName: chapter.name_simple,
    pageCount: totalPages,
    downloadedAt: new Date().toISOString(),
    schemaVersion: DOWNLOAD_SCHEMA_VERSION,
  };

  await writeManifest(chapter.id, manifest);
  return manifest;
}

export async function removeDownloadedChapter(chapterId: number): Promise<void> {
  const manifest = await readManifest(chapterId);

  if (!manifest) {
    return;
  }

  await removeChapterVerseCache(chapterId, manifest.pageCount);
  await AsyncStorage.removeItem(manifestKey(chapterId));
}

export async function getDownloadedChapterPage(
  chapterId: number,
  page: number,
) {
  const cached = await readCachedChapterVersesPage(chapterId, page);

  if (!cached) {
    throw new Error('Downloaded data is incomplete for this surah. Re-download it online.');
  }

  return cached;
}
