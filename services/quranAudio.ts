import { setAudioModeAsync } from 'expo-audio';

import { getChapterRecitationAudio } from '@/services/quranApi';

export const DEFAULT_QURAN_RECITER = {
  id: 7,
  label: 'Mishary Rashid Alafasy',
  source: 'Quran.com',
} as const;

export interface QuranAudioSource {
  chapterId: number;
  reciterId: number;
  durationSec: number | null;
  url: string;
}

export interface QuranAudioProvider {
  getChapterAudioSource(chapterId: number, reciterId: number): Promise<QuranAudioSource>;
}

class QuranComAudioProvider implements QuranAudioProvider {
  async getChapterAudioSource(
    chapterId: number,
    reciterId: number,
  ): Promise<QuranAudioSource> {
    const audioFile = await getChapterRecitationAudio(reciterId, chapterId);

    return {
      chapterId,
      reciterId,
      durationSec: audioFile.duration,
      url: audioFile.audio_url,
    };
  }
}

const audioProvider = new QuranComAudioProvider();
let audioModeReady = false;

export async function ensureQuranAudioMode(): Promise<void> {
  if (audioModeReady) {
    return;
  }

  await setAudioModeAsync({
    allowsRecording: false,
    interruptionMode: 'mixWithOthers',
    playsInSilentMode: true,
    shouldPlayInBackground: false,
    shouldRouteThroughEarpiece: false,
  });

  audioModeReady = true;
}

export async function getQuranAudioSource(
  chapterId: number,
  reciterId: number = DEFAULT_QURAN_RECITER.id,
): Promise<QuranAudioSource> {
  return audioProvider.getChapterAudioSource(chapterId, reciterId);
}

export function formatPlaybackTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '0:00';
  }

  const seconds = Math.floor(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}
