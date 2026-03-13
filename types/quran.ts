/**
 * Quran API Types
 * Source: Quran.com API v4 (https://api.qurancdn.com/api/v4)
 */

// ── Chapter (Surah) ──────────────────────────────────────────

export interface ChapterTranslatedName {
  language_name: string;
  name: string;
}

export interface Chapter {
  id: number;
  revelation_place: 'makkah' | 'madinah';
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: [number, number];
  translated_name: ChapterTranslatedName;
}

export interface ChaptersResponse {
  chapters: Chapter[];
}

// ── Verse (Ayah) ─────────────────────────────────────────────

export interface VerseTranslation {
  id: number;
  resource_id: number;
  text: string; // may contain <sup foot_note=...> tags
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string; // e.g. "1:1", "2:255"
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  text_uthmani?: string; // Arabic text (only when fields=text_uthmani)
  page_number: number;
  juz_number: number;
  translations?: VerseTranslation[];
}

export interface Pagination {
  per_page: number;
  current_page: number;
  next_page: number | null;
  total_pages: number;
  total_records: number;
}

export interface VersesResponse {
  verses: Verse[];
  pagination: Pagination;
}

export interface ChapterAudioFile {
  id: number;
  chapter_id: number;
  file_size: number | null;
  format: string | null;
  audio_url: string;
  duration: number | null;
}

export interface ChapterRecitationResponse {
  audio_file: ChapterAudioFile;
 }

// ── App-level types (cleaned, ready for UI) ──────────────────

/** Cleaned verse for display — HTML tags stripped from translation */
export interface CleanVerse {
  verseNumber: number;
  verseKey: string;
  translation: string;
  apiPage: number;
}
