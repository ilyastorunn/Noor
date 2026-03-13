import firestore from '@react-native-firebase/firestore';

import type { QuranBookmark } from '@/types/user';

function sortBookmarks(bookmarks: QuranBookmark[]): QuranBookmark[] {
  return [...bookmarks].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function getSurahBookmarkId(chapterId: number): string {
  return `surah:${chapterId}`;
}

export function getAyahBookmarkId(verseKey: string): string {
  return `ayah:${verseKey}`;
}

export async function getQuranBookmarks(uid: string): Promise<QuranBookmark[]> {
  const snapshot = await firestore().collection('users').doc(uid).collection('bookmarks').get();
  return sortBookmarks(snapshot.docs.map((item) => item.data() as QuranBookmark));
}

export async function toggleQuranBookmark(
  uid: string,
  bookmark: QuranBookmark,
  isSaved: boolean,
): Promise<{ bookmarks: QuranBookmark[]; saved: boolean }> {
  const bookmarkRef = firestore()
    .collection('users')
    .doc(uid)
    .collection('bookmarks')
    .doc(bookmark.id);

  if (isSaved) {
    await bookmarkRef.delete();
  } else {
    await bookmarkRef.set(bookmark, { merge: true });
  }

  return {
    bookmarks: await getQuranBookmarks(uid),
    saved: !isSaved,
  };
}
