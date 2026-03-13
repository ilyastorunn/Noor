import firestore from '@react-native-firebase/firestore';

import type { QuranLastListened, QuranLastRead } from '@/types/user';

export async function getQuranLastRead(uid: string): Promise<QuranLastRead | null> {
  const snapshot = await firestore().collection('users').doc(uid).get();
  return (snapshot.data()?.quran?.lastRead as QuranLastRead | null) ?? null;
}

export async function saveQuranLastRead(uid: string, payload: QuranLastRead): Promise<void> {
  await firestore()
    .collection('users')
    .doc(uid)
    .set(
      {
        quran: {
          lastRead: payload,
        },
      },
      { merge: true },
    );
}

export async function getQuranLastListened(uid: string): Promise<QuranLastListened | null> {
  const snapshot = await firestore().collection('users').doc(uid).get();
  return (snapshot.data()?.quran?.lastListened as QuranLastListened | null) ?? null;
}

export async function saveQuranLastListened(
  uid: string,
  payload: QuranLastListened,
): Promise<void> {
  await firestore()
    .collection('users')
    .doc(uid)
    .set(
      {
        quran: {
          lastListened: payload,
        },
      },
      { merge: true },
    );
}
