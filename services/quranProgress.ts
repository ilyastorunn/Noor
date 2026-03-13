import type { QuranLastListened, QuranLastRead } from '@/types/user';

export async function getQuranLastRead(uid: string): Promise<QuranLastRead | null> {
  void uid;
  return null;
}

export async function saveQuranLastRead(uid: string, payload: QuranLastRead): Promise<void> {
  void uid;
  void payload;
}

export async function getQuranLastListened(uid: string): Promise<QuranLastListened | null> {
  void uid;
  return null;
}

export async function saveQuranLastListened(
  uid: string,
  payload: QuranLastListened,
): Promise<void> {
  void uid;
  void payload;
}
