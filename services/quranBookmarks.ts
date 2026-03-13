import type { QuranBookmark } from '@/types/user';

export function getSurahBookmarkId(chapterId: number): string {
  return `surah:${chapterId}`;
}

export function getAyahBookmarkId(verseKey: string): string {
  return `ayah:${verseKey}`;
}

export async function getQuranBookmarks(uid: string): Promise<QuranBookmark[]> {
  void uid;
  return [];
}

export async function toggleQuranBookmark(
  uid: string,
  bookmark: QuranBookmark,
  isSaved: boolean,
): Promise<{ bookmarks: QuranBookmark[]; saved: boolean }> {
  void uid;
  void bookmark;
  return { bookmarks: [], saved: !isSaved };
}
