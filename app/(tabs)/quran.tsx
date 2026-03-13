import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import {
  DEFAULT_QURAN_RECITER,
  ensureQuranAudioMode,
  formatPlaybackTime,
  getQuranAudioSource,
} from '@/services/quranAudio';
import {
  getAyahBookmarkId,
  getQuranBookmarks,
  getSurahBookmarkId,
  toggleQuranBookmark,
} from '@/services/quranBookmarks';
import {
  downloadChapterText,
  getDownloadedChapterPage,
  listDownloadedChapters,
  removeDownloadedChapter,
  type DownloadedChapterManifest,
} from '@/services/quranDownloads';
import { getQuranLastListened, getQuranLastRead, saveQuranLastListened, saveQuranLastRead } from '@/services/quranProgress';
import { getChaptersSafe, getChapterVersesSafe } from '@/services/quranApi';
import type { Chapter, CleanVerse, Pagination } from '@/types/quran';
import type { QuranBookmark, QuranLastListened, QuranLastRead } from '@/types/user';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useNetworkState } from 'expo-network';
import { useRouter } from 'expo-router';
import {
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Download,
  Headphones,
  Loader2,
  LockKeyhole,
  LogIn,
  Menu,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DownloadedChapterMap = Record<number, DownloadedChapterManifest>;

export default function QuranScreen() {
  const router = useRouter();
  const networkState = useNetworkState();
  const { firebaseConfigured, isGuest, loading: authLoading, profile, user } = useAuth();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [chaptersError, setChaptersError] = useState<string | null>(null);

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<CleanVerse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [versesError, setVersesError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [downloadedChapters, setDownloadedChapters] = useState<DownloadedChapterMap>({});
  const [downloadBusyChapterId, setDownloadBusyChapterId] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [lastRead, setLastRead] = useState<QuranLastRead | null>(null);
  const [lastListened, setLastListened] = useState<QuranLastListened | null>(null);
  const [currentAnchorVerseKey, setCurrentAnchorVerseKey] = useState<string | null>(null);

  const [loadingAudioChapterId, setLoadingAudioChapterId] = useState<number | null>(null);
  const [activeAudioChapterId, setActiveAudioChapterId] = useState<number | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<CleanVerse>>(null);
  const paginationRef = useRef<Pagination | null>(null);
  const chapterRequestIdRef = useRef(0);
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const loadingMoreRef = useRef(false);
  const selectedChapterRef = useRef<Chapter | null>(null);
  const downloadedMapRef = useRef<DownloadedChapterMap>({});
  const lastReadRef = useRef<QuranLastRead | null>(null);
  const lastListenedRef = useRef<QuranLastListened | null>(null);
  const currentAnchorVerseKeyRef = useRef<string | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const pendingScrollVerseKeyRef = useRef<string | null>(null);
  const pendingAudioSeekRef = useRef<number | null>(null);
  const pendingAudioPlayRef = useRef(false);
  const lastAudioSyncedPositionRef = useRef<number | null>(null);
  const isOfflineRef = useRef(false);

  const player = useAudioPlayer(null, { updateInterval: 300 });
  const audioStatus = useAudioPlayerStatus(player);

  const isOffline = networkState.isConnected === false || networkState.isInternetReachable === false;
  const isPremium = Boolean(profile?.isPremium);

  useEffect(() => {
    selectedChapterRef.current = selectedChapter;
  }, [selectedChapter]);

  useEffect(() => {
    downloadedMapRef.current = downloadedChapters;
  }, [downloadedChapters]);

  useEffect(() => {
    lastReadRef.current = lastRead;
  }, [lastRead]);

  useEffect(() => {
    lastListenedRef.current = lastListened;
  }, [lastListened]);

  useEffect(() => {
    currentAnchorVerseKeyRef.current = currentAnchorVerseKey;
  }, [currentAnchorVerseKey]);

  useEffect(() => {
    currentUserIdRef.current = user?.uid ?? null;
  }, [user?.uid]);

  useEffect(() => {
    isOfflineRef.current = isOffline;
  }, [isOffline]);

  const promptAuth = useCallback(
    (feature: string) => {
      if (!firebaseConfigured) {
        Alert.alert(
          'Sign-in unavailable',
          'Firebase is not configured yet, so this feature cannot be enabled on this build.',
        );
        return;
      }

      Alert.alert(
        `Sign in for ${feature}`,
        'Reading stays open for guests, but progress sync, bookmarks, audio, and downloads need an account.',
        [
          { text: 'Maybe later', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => router.push('/auth' as never),
          },
        ],
      );
    },
    [firebaseConfigured, router],
  );

  const readChapterPageForDisplay = useCallback(async (chapterId: number, page: number) => {
    const downloaded = downloadedMapRef.current[chapterId];

    if (isOfflineRef.current) {
      if (!downloaded) {
        throw new Error('This surah is not downloaded on this device.');
      }

      return getDownloadedChapterPage(chapterId, page);
    }

    return getChapterVersesSafe(chapterId, page, { forceRefresh: true });
  }, []);

  const scrollToVerse = useCallback((verseKey: string, animated: boolean) => {
    const index = verses.findIndex((verse) => verse.verseKey === verseKey);
    if (index === -1) {
      return;
    }

    requestAnimationFrame(() => {
      flatListRef.current?.scrollToIndex({
        index,
        animated,
        viewOffset: 12,
      });
    });
  }, [verses]);

  const loadChapter = useCallback(
    async (
      chapter: Chapter,
      options: {
        prefetchToPage?: number;
        scrollToVerseKey?: string;
      } = {},
    ) => {
      const requestId = ++chapterRequestIdRef.current;
      const pagesRequested = Math.max(options.prefetchToPage ?? 1, 1);

      setSelectedChapter(chapter);
      setLoadingVerses(true);
      setVersesError(null);
      setVerses([]);
      paginationRef.current = null;
      loadedPagesRef.current = new Set();
      pendingScrollVerseKeyRef.current = options.scrollToVerseKey ?? null;

      try {
        const firstPage = await readChapterPageForDisplay(chapter.id, 1);
        if (requestId !== chapterRequestIdRef.current) {
          return;
        }

        let nextVerses = [...firstPage.verses];
        let latestPagination = firstPage.pagination;
        loadedPagesRef.current.add(1);

        const finalPage = Math.min(pagesRequested, firstPage.pagination.total_pages);
        for (let page = 2; page <= finalPage; page += 1) {
          const result = await readChapterPageForDisplay(chapter.id, page);
          if (requestId !== chapterRequestIdRef.current) {
            return;
          }

          nextVerses = [...nextVerses, ...result.verses];
          latestPagination = result.pagination;
          loadedPagesRef.current.add(page);
        }

        setVerses(nextVerses);
        paginationRef.current = latestPagination;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load verses.';
        setVersesError(message);
      } finally {
        if (requestId === chapterRequestIdRef.current) {
          setLoadingVerses(false);
        }
      }
    },
    [readChapterPageForDisplay],
  );

  const refreshDownloads = useCallback(async () => {
    const manifests = await listDownloadedChapters();
    const manifestMap = Object.fromEntries(
      manifests.map((manifest) => [manifest.chapterId, manifest]),
    ) as DownloadedChapterMap;

    downloadedMapRef.current = manifestMap;
    setDownloadedChapters(manifestMap);
    return manifestMap;
  }, []);

  const bootstrapScreen = useCallback(async () => {
    setLoadingChapters(true);
    setChaptersError(null);

    try {
      const [chapterData, manifests, savedRead, savedListened, savedBookmarks] =
        await Promise.all([
          getChaptersSafe(),
          refreshDownloads(),
          user ? getQuranLastRead(user.uid) : Promise.resolve(null),
          user ? getQuranLastListened(user.uid) : Promise.resolve(null),
          user ? getQuranBookmarks(user.uid) : Promise.resolve<QuranBookmark[]>([]),
        ]);

      setChapters(chapterData);
      setLastRead(savedRead);
      setLastListened(savedListened);
      setBookmarks(savedBookmarks);

      const initialChapter =
        (savedRead
          ? chapterData.find((chapter) => chapter.id === savedRead.chapterId)
          : undefined) ??
        chapterData.find((chapter) => chapter.id === 1) ??
        chapterData[0];

      if (initialChapter) {
        await loadChapter(initialChapter, {
          prefetchToPage:
            savedRead?.chapterId === initialChapter.id ? savedRead.apiPage : 1,
          scrollToVerseKey:
            savedRead?.chapterId === initialChapter.id ? savedRead.verseKey : undefined,
        });
      }

      return manifests;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load the Qur’an.';
      setChaptersError(message);
      return null;
    } finally {
      setLoadingChapters(false);
      setLoadingBookmarks(false);
    }
  }, [loadChapter, refreshDownloads, user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    let cancelled = false;

    (async () => {
      const manifests = await bootstrapScreen();
      if (cancelled || !manifests) {
        return;
      }
    })();

    return () => {
      cancelled = true;
      chapterRequestIdRef.current += 1;
    };
  }, [authLoading, bootstrapScreen, user?.uid]);

  useEffect(() => {
    ensureQuranAudioMode().catch(() => {});
  }, []);

  useEffect(() => {
    if (!pendingScrollVerseKeyRef.current || verses.length === 0) {
      return;
    }

    scrollToVerse(pendingScrollVerseKeyRef.current, false);
    pendingScrollVerseKeyRef.current = null;
  }, [scrollToVerse, verses]);

  useEffect(() => {
    if (!audioStatus.isLoaded) {
      return;
    }

    const seekTo = pendingAudioSeekRef.current;
    const shouldPlay = pendingAudioPlayRef.current;

    if (seekTo == null && !shouldPlay) {
      return;
    }

    pendingAudioSeekRef.current = null;
    pendingAudioPlayRef.current = false;

    const applyPendingPlayback = async () => {
      if (seekTo != null) {
        await player.seekTo(seekTo);
      }

      if (shouldPlay) {
        player.play();
      }
    };

    applyPendingPlayback().catch(() => {});
  }, [audioStatus.isLoaded, player]);

  useEffect(() => {
    if (!user || !activeAudioChapterId || !audioStatus.isLoaded) {
      return;
    }

    const nextPosition = audioStatus.didJustFinish ? 0 : audioStatus.currentTime;
    const shouldPersist =
      audioStatus.didJustFinish ||
      !audioStatus.playing ||
      lastAudioSyncedPositionRef.current == null ||
      Math.abs(nextPosition - lastAudioSyncedPositionRef.current) >= 15;

    if (!shouldPersist) {
      return;
    }

    const payload: QuranLastListened = {
      chapterId: activeAudioChapterId,
      reciterId: DEFAULT_QURAN_RECITER.id,
      positionSec: nextPosition,
      updatedAt: new Date().toISOString(),
    };

    lastAudioSyncedPositionRef.current = nextPosition;
    setLastListened(payload);
    saveQuranLastListened(user.uid, payload).catch(() => {});
  }, [
    activeAudioChapterId,
    audioStatus.currentTime,
    audioStatus.didJustFinish,
    audioStatus.isLoaded,
    audioStatus.playing,
    user,
  ]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<CleanVerse>[] }) => {
      if (pendingScrollVerseKeyRef.current) {
        return;
      }

      const firstVisible = [...viewableItems]
        .filter((item) => item.index != null && item.item)
        .sort((left, right) => (left.index ?? 0) - (right.index ?? 0))[0]?.item;

      if (!firstVisible) {
        return;
      }

      setCurrentAnchorVerseKey(firstVisible.verseKey);

      const userId = currentUserIdRef.current;
      const activeChapter = selectedChapterRef.current;

      if (!userId || !activeChapter) {
        return;
      }

      if (
        lastReadRef.current?.chapterId === activeChapter.id &&
        lastReadRef.current?.verseKey === firstVisible.verseKey
      ) {
        return;
      }

      const payload: QuranLastRead = {
        chapterId: activeChapter.id,
        verseKey: firstVisible.verseKey,
        verseNumber: firstVisible.verseNumber,
        apiPage: firstVisible.apiPage,
        updatedAt: new Date().toISOString(),
      };

      setLastRead(payload);
      saveQuranLastRead(userId, payload).catch(() => {});
    },
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  });

  const bookmarkIds = useMemo(() => new Set(bookmarks.map((bookmark) => bookmark.id)), [bookmarks]);

  const savedItems = useMemo(() => {
    return bookmarks.slice(0, 8);
  }, [bookmarks]);

  const isCurrentChapterDownloaded = selectedChapter
    ? Boolean(downloadedChapters[selectedChapter.id])
    : false;
  const isCurrentChapterBookmarked = selectedChapter
    ? bookmarkIds.has(getSurahBookmarkId(selectedChapter.id))
    : false;
  const hasMorePages = paginationRef.current?.next_page != null;
  const totalVerses = selectedChapter?.verses_count ?? 0;
  const continueCardVisible = Boolean(
    lastRead &&
      (!selectedChapter ||
        lastRead.chapterId !== selectedChapter.id ||
        lastRead.verseKey !== currentAnchorVerseKey),
  );

  const handleSurahSelect = useCallback(
    async (chapter: Chapter, target?: QuranLastRead | QuranBookmark) => {
      setMenuVisible(false);
      await Haptics.selectionAsync();

      const targetPage =
        target && 'apiPage' in target
          ? target.apiPage
          : target?.verseNumber
            ? Math.max(1, Math.ceil(target.verseNumber / 50))
            : 1;
      const targetVerseKey = target && 'verseKey' in target ? target.verseKey : undefined;

      const shouldAutoPlayReplacement =
        activeAudioChapterId != null &&
        audioStatus.playing &&
        activeAudioChapterId !== chapter.id;

      await loadChapter(chapter, {
        prefetchToPage: targetPage,
        scrollToVerseKey: targetVerseKey,
      });

      if (!targetVerseKey) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }

      if (shouldAutoPlayReplacement) {
        const source = await getQuranAudioSource(chapter.id);
        pendingAudioSeekRef.current = 0;
        pendingAudioPlayRef.current = true;
        setActiveAudioChapterId(chapter.id);
        player.replace({ uri: source.url });
      }
    },
    [activeAudioChapterId, audioStatus.playing, loadChapter, player],
  );

  const handleContinueReading = useCallback(async () => {
    if (!lastRead) {
      return;
    }

    if (!user) {
      promptAuth('continue reading');
      return;
    }

    const chapter = chapters.find((item) => item.id === lastRead.chapterId);
    if (!chapter) {
      return;
    }

    await handleSurahSelect(chapter, lastRead);
  }, [chapters, handleSurahSelect, lastRead, promptAuth, user]);

  const handleBookmarkPress = useCallback(
    async (bookmark: QuranBookmark) => {
      if (!user) {
        promptAuth('bookmarks');
        return;
      }

      await Haptics.selectionAsync();
      const result = await toggleQuranBookmark(
        user.uid,
        bookmark,
        bookmarkIds.has(bookmark.id),
      );
      setBookmarks(result.bookmarks);
    },
    [bookmarkIds, promptAuth, user],
  );

  const handleSurahBookmarkToggle = useCallback(() => {
    if (!selectedChapter) {
      return;
    }

    handleBookmarkPress({
      id: getSurahBookmarkId(selectedChapter.id),
      type: 'surah',
      chapterId: selectedChapter.id,
      chapterName: selectedChapter.name_simple,
      createdAt: new Date().toISOString(),
    }).catch(() => {});
  }, [handleBookmarkPress, selectedChapter]);

  const handleAyahBookmarkToggle = useCallback(
    (verse: CleanVerse) => {
      if (!selectedChapter) {
        return;
      }

      handleBookmarkPress({
        id: getAyahBookmarkId(verse.verseKey),
        type: 'ayah',
        chapterId: selectedChapter.id,
        chapterName: selectedChapter.name_simple,
        verseKey: verse.verseKey,
        verseNumber: verse.verseNumber,
        createdAt: new Date().toISOString(),
      }).catch(() => {});
    },
    [handleBookmarkPress, selectedChapter],
  );

  const prepareAudioForChapter = useCallback(
    async (chapter: Chapter, options: { autoPlay?: boolean; resumePosition?: number } = {}) => {
      if (!user) {
        promptAuth('audio');
        return;
      }

      setLoadingAudioChapterId(chapter.id);
      setAudioError(null);

      try {
        const source = await getQuranAudioSource(chapter.id);
        pendingAudioSeekRef.current = options.resumePosition ?? 0;
        pendingAudioPlayRef.current = Boolean(options.autoPlay);
        setActiveAudioChapterId(chapter.id);
        player.replace({ uri: source.url });
      } catch (error) {
        setAudioError(
          error instanceof Error ? error.message : 'Unable to load recitation audio.',
        );
      } finally {
        setLoadingAudioChapterId(null);
      }
    },
    [player, promptAuth, user],
  );

  const handleAudioPrimaryAction = useCallback(async () => {
    if (!selectedChapter) {
      return;
    }

    if (!user) {
      promptAuth('audio');
      return;
    }

    if (activeAudioChapterId !== selectedChapter.id || !audioStatus.isLoaded) {
      const resumePosition =
        lastListened?.chapterId === selectedChapter.id ? lastListened.positionSec : 0;
      await prepareAudioForChapter(selectedChapter, {
        autoPlay: true,
        resumePosition,
      });
      return;
    }

    if (audioStatus.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [
    activeAudioChapterId,
    audioStatus.isLoaded,
    audioStatus.playing,
    lastListened,
    player,
    prepareAudioForChapter,
    promptAuth,
    selectedChapter,
    user,
  ]);

  const handleAudioSeek = useCallback(
    async (deltaSeconds: number) => {
      if (!selectedChapter) {
        return;
      }

      if (!user) {
        promptAuth('audio');
        return;
      }

      if (activeAudioChapterId !== selectedChapter.id || !audioStatus.isLoaded) {
        const resumePosition =
          lastListened?.chapterId === selectedChapter.id ? lastListened.positionSec : 0;
        await prepareAudioForChapter(selectedChapter, {
          autoPlay: true,
          resumePosition,
        });
        return;
      }

      const nextPosition = Math.max(
        0,
        Math.min(audioStatus.duration || 0, audioStatus.currentTime + deltaSeconds),
      );
      await player.seekTo(nextPosition);
    },
    [
      activeAudioChapterId,
      audioStatus.currentTime,
      audioStatus.duration,
      audioStatus.isLoaded,
      lastListened,
      player,
      prepareAudioForChapter,
      promptAuth,
      selectedChapter,
      user,
    ],
  );

  const handleReplay = useCallback(async () => {
    if (!selectedChapter) {
      return;
    }

    if (!user) {
      promptAuth('audio');
      return;
    }

    await prepareAudioForChapter(selectedChapter, { autoPlay: true, resumePosition: 0 });
  }, [prepareAudioForChapter, promptAuth, selectedChapter, user]);

  const handleDownloadAction = useCallback(() => {
    if (!selectedChapter) {
      return;
    }

    if (!user) {
      promptAuth('downloads');
      return;
    }

    if (!isPremium) {
      Alert.alert(
        'Premium required',
        'Offline Qur’an downloads are part of the premium plan for now.',
      );
      return;
    }

    if (isCurrentChapterDownloaded) {
      Alert.alert(
        'Remove download?',
        `Delete ${selectedChapter.name_simple} from device storage?`,
        [
          { text: 'Keep it', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              await removeDownloadedChapter(selectedChapter.id);
              await refreshDownloads();
            },
          },
        ],
      );
      return;
    }

    setDownloadBusyChapterId(selectedChapter.id);
    setDownloadProgress(0);

    downloadChapterText(selectedChapter, (currentPage, totalPages) => {
      setDownloadProgress(currentPage / totalPages);
    })
      .then(async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await refreshDownloads();
      })
      .catch((error) => {
        Alert.alert(
          'Download failed',
          error instanceof Error ? error.message : 'Unable to download this surah.',
        );
      })
      .finally(() => {
        setDownloadBusyChapterId(null);
        setDownloadProgress(0);
      });
  }, [
    isCurrentChapterDownloaded,
    isPremium,
    promptAuth,
    refreshDownloads,
    selectedChapter,
    user,
  ]);

  const loadMoreVerses = useCallback(async () => {
    const chapter = selectedChapterRef.current;
    const nextPage = paginationRef.current?.next_page;

    if (!chapter || !nextPage || loadingMoreRef.current || loadedPagesRef.current.has(nextPage)) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const result = await readChapterPageForDisplay(chapter.id, nextPage);
      if (chapterRequestIdRef.current === 0 || selectedChapterRef.current?.id !== chapter.id) {
        return;
      }

      loadedPagesRef.current.add(nextPage);
      paginationRef.current = result.pagination;
      setVerses((current) => [...current, ...result.verses]);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Unable to continue', error.message);
      }
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [readChapterPageForDisplay]);

  if (loadingChapters) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" color={DesignTokens.accent.primary} />
          <Text style={styles.loadingText}>Loading Qur&apos;an...</Text>
        </SafeAreaView>
      </View>
    );
  }

  if (chaptersError) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.centered}>
          <RefreshCw size={32} color={DesignTokens.text.muted} strokeWidth={1.5} />
          <Text style={styles.errorText}>{chaptersError}</Text>
          <Pressable style={styles.retryButton} onPress={bootstrapScreen}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  const renderVerse = ({ item }: { item: CleanVerse }) => {
    const isAyahSaved = bookmarkIds.has(getAyahBookmarkId(item.verseKey));

    return (
      <View style={styles.verseContainer}>
        <View style={styles.verseNumber}>
          <Text style={styles.verseNumberText}>{item.verseNumber}</Text>
        </View>
        <View style={styles.verseBody}>
          <View style={styles.verseMetaRow}>
            <Text style={styles.verseMetaLabel}>Ayah {item.verseNumber}</Text>
            <Pressable
              hitSlop={12}
              style={styles.verseBookmarkButton}
              onPress={() => handleAyahBookmarkToggle(item)}
            >
              {isAyahSaved ? (
                <BookmarkCheck size={18} color={DesignTokens.accent.primary} />
              ) : (
                <Bookmark size={18} color={DesignTokens.text.muted} />
              )}
            </Pressable>
          </View>
          <Text style={styles.verseText}>{item.translation}</Text>
        </View>
      </View>
    );
  };

  const ListHeader = () => (
    <View>
      {isGuest ? (
        <Pressable style={styles.guestCard} onPress={() => promptAuth('Qur’an features')}>
          <View style={styles.guestCardIcon}>
            <LogIn size={18} color={DesignTokens.text.onPrimary} />
          </View>
          <View style={styles.guestCardContent}>
            <Text style={styles.guestCardTitle}>Reading is open, syncing is not.</Text>
            <Text style={styles.guestCardBody}>
              Sign in to resume your place, save ayahs, stream recitation, and unlock downloads.
            </Text>
          </View>
        </Pressable>
      ) : null}

      {continueCardVisible && lastRead ? (
        <Pressable style={styles.continueCard} onPress={handleContinueReading}>
          <View style={styles.continueCardIcon}>
            <BookmarkCheck size={18} color={DesignTokens.text.onPrimary} />
          </View>
          <View style={styles.continueCardContent}>
            <Text style={styles.continueCardTitle}>Continue where you left off</Text>
            <Text style={styles.continueCardBody}>
              Surah {lastRead.chapterId} · Ayah {lastRead.verseNumber}
            </Text>
          </View>
          <ChevronRight size={18} color={DesignTokens.text.onPrimary} />
        </Pressable>
      ) : null}

      <View style={styles.surahHeader}>
        <View style={styles.surahHeaderTop}>
          <View style={styles.surahHeaderIdentity}>
            <Text style={styles.surahName}>{selectedChapter?.name_simple}</Text>
            <Text style={styles.surahNameArabic}>{selectedChapter?.name_arabic}</Text>
          </View>

          <View style={styles.surahActions}>
            <Pressable
              style={styles.surahActionButton}
              onPress={handleSurahBookmarkToggle}
            >
              {isCurrentChapterBookmarked ? (
                <BookmarkCheck size={18} color={DesignTokens.accent.primary} />
              ) : (
                <Bookmark size={18} color={DesignTokens.text.body} />
              )}
            </Pressable>
            <Pressable style={styles.surahActionButton} onPress={handleDownloadAction}>
              {downloadBusyChapterId === selectedChapter?.id ? (
                <Loader2 size={18} color={DesignTokens.accent.primary} />
              ) : isGuest ? (
                <LockKeyhole size={18} color={DesignTokens.text.body} />
              ) : !isPremium ? (
                <LockKeyhole size={18} color={DesignTokens.text.body} />
              ) : (
                <Download
                  size={18}
                  color={
                    isCurrentChapterDownloaded
                      ? DesignTokens.accent.primary
                      : DesignTokens.text.body
                  }
                />
              )}
            </Pressable>
          </View>
        </View>

        <Text style={styles.surahInfo}>
          Surah {selectedChapter?.id} • {totalVerses} Verses •{' '}
          {selectedChapter?.revelation_place === 'makkah' ? 'Makki' : 'Madani'}
        </Text>

        <View style={styles.utilityGrid}>
          <View style={styles.utilityCard}>
            <Text style={styles.utilityLabel}>Reading Sync</Text>
            <Text style={styles.utilityValue}>
              {lastRead?.chapterId === selectedChapter?.id
                ? `Ayah ${lastRead?.verseNumber ?? 1}`
                : 'Ready'}
            </Text>
            <Text style={styles.utilityMeta}>
              {isGuest ? 'Sign in required' : 'Restores from your latest visible ayah'}
            </Text>
          </View>
          <View style={styles.utilityCard}>
            <Text style={styles.utilityLabel}>Offline</Text>
            <Text style={styles.utilityValue}>
              {downloadBusyChapterId === selectedChapter?.id
                ? `${Math.round(downloadProgress * 100)}%`
                : isCurrentChapterDownloaded
                  ? 'Downloaded'
                  : isPremium
                    ? 'Available'
                    : 'Premium'}
            </Text>
            <Text style={styles.utilityMeta}>
              {isCurrentChapterDownloaded
                ? 'Stored on this device'
                : isGuest
                  ? 'Sign in to manage downloads'
                  : isPremium
                    ? 'Download complete surahs for offline reading'
                    : 'Downloads unlock with premium'}
            </Text>
          </View>
        </View>

        <View style={styles.audioCard}>
          <View style={styles.audioHeader}>
            <View>
              <Text style={styles.audioTitle}>Recitation</Text>
              <Text style={styles.audioSubtitle}>
                {DEFAULT_QURAN_RECITER.label} · {DEFAULT_QURAN_RECITER.source}
              </Text>
            </View>
            <Headphones size={18} color={DesignTokens.accent.primary} />
          </View>

          <Text style={styles.audioTime}>
            {formatPlaybackTime(audioStatus.currentTime)} /{' '}
            {formatPlaybackTime(audioStatus.duration)}
          </Text>

          <View style={styles.audioControls}>
            <Pressable style={styles.audioIconButton} onPress={() => handleAudioSeek(-15)}>
              <SkipBack size={18} color={DesignTokens.text.heading} />
            </Pressable>
            <Pressable
              style={[styles.audioPrimaryButton, loadingAudioChapterId === selectedChapter?.id && styles.audioPrimaryButtonLoading]}
              onPress={handleAudioPrimaryAction}
            >
              {loadingAudioChapterId === selectedChapter?.id ? (
                <ActivityIndicator color={DesignTokens.text.onPrimary} />
              ) : audioStatus.playing && activeAudioChapterId === selectedChapter?.id ? (
                <Pause size={18} color={DesignTokens.text.onPrimary} />
              ) : (
                <Play size={18} color={DesignTokens.text.onPrimary} />
              )}
            </Pressable>
            <Pressable style={styles.audioIconButton} onPress={() => handleAudioSeek(15)}>
              <SkipForward size={18} color={DesignTokens.text.heading} />
            </Pressable>
            <Pressable style={styles.audioIconButton} onPress={handleReplay}>
              <RotateCcw size={18} color={DesignTokens.text.heading} />
            </Pressable>
          </View>

          <Text style={styles.audioMeta}>
            {isGuest
              ? 'Sign in to play surah recitation.'
              : lastListened?.chapterId === selectedChapter?.id
                ? `Last listened at ${formatPlaybackTime(lastListened?.positionSec ?? 0)}`
                : 'Play the full surah with synced resume.'}
          </Text>

          {audioError ? <Text style={styles.audioError}>{audioError}</Text> : null}
        </View>
      </View>
    </View>
  );

  const ListFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={DesignTokens.accent.primary} />
        </View>
      );
    }

    if (hasMorePages) {
      return (
        <Pressable style={styles.loadMoreButton} onPress={loadMoreVerses}>
          <Loader2 size={16} color={DesignTokens.accent.primary} strokeWidth={1.5} />
          <Text style={styles.loadMoreText}>
            Load more ({verses.length} of {totalVerses})
          </Text>
        </Pressable>
      );
    }

    if (verses.length > 0) {
      return (
        <View style={styles.completionCard}>
          <Text style={styles.completionText}>
            May this reading bring you peace and guidance.
          </Text>
        </View>
      );
    }

    return null;
  };

  const ListEmpty = () => {
    if (loadingVerses) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={DesignTokens.accent.primary} />
          <Text style={styles.loadingText}>Loading verses...</Text>
        </View>
      );
    }

    if (versesError) {
      return (
        <View style={styles.centered}>
          <RefreshCw size={28} color={DesignTokens.text.muted} strokeWidth={1.5} />
          <Text style={styles.errorText}>{versesError}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => selectedChapter && loadChapter(selectedChapter)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.menuButton} onPress={() => setMenuVisible(true)}>
            <Menu size={24} color={DesignTokens.text.heading} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Qur&apos;an</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {selectedChapter?.name_simple ?? 'Select a Surah'}
            </Text>
          </View>
          <View style={styles.menuButton} />
        </View>

        <FlatList
          ref={flatListRef}
          data={verses}
          keyExtractor={(item) => item.verseKey}
          renderItem={renderVerse}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreVerses}
          onEndReachedThreshold={0.35}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewabilityConfig.current}
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: false,
            });

            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: false,
                viewOffset: 12,
              });
            }, 120);
          }}
        />
      </SafeAreaView>

      <Modal
        visible={menuVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select Surah</Text>
                <Text style={styles.modalSubtitle}>
                  {isGuest ? 'Reading only' : 'Saved ayahs appear first'}
                </Text>
              </View>
              <Pressable style={styles.closeButton} onPress={() => setMenuVisible(false)}>
                <X size={24} color={DesignTokens.text.heading} />
              </Pressable>
            </View>

            <FlatList
              data={chapters}
              keyExtractor={(item) => String(item.id)}
              style={styles.surahList}
              ListHeaderComponent={
                <View style={styles.savedSection}>
                  <Text style={styles.savedSectionTitle}>Saved</Text>
                  {isGuest ? (
                    <Pressable
                      style={styles.savedPromptCard}
                      onPress={() => promptAuth('bookmarks')}
                    >
                      <LogIn size={16} color={DesignTokens.text.onPrimary} />
                      <Text style={styles.savedPromptText}>
                        Sign in to save surahs and ayahs here.
                      </Text>
                    </Pressable>
                  ) : loadingBookmarks ? (
                    <ActivityIndicator color={DesignTokens.accent.primary} />
                  ) : savedItems.length > 0 ? (
                    savedItems.map((bookmark) => (
                      <Pressable
                        key={bookmark.id}
                        style={styles.savedItem}
                        onPress={async () => {
                          const chapter = chapters.find((item) => item.id === bookmark.chapterId);
                          if (!chapter) {
                            return;
                          }

                          if (bookmark.type === 'ayah' && bookmark.verseKey && bookmark.verseNumber) {
                            await handleSurahSelect(chapter, {
                              chapterId: chapter.id,
                              verseKey: bookmark.verseKey,
                              verseNumber: bookmark.verseNumber,
                              apiPage: Math.max(1, Math.ceil(bookmark.verseNumber / 50)),
                              updatedAt: bookmark.createdAt,
                            });
                            return;
                          }

                          await handleSurahSelect(chapter);
                        }}
                      >
                        <View style={styles.savedItemIcon}>
                          {bookmark.type === 'ayah' ? (
                            <BookmarkCheck size={16} color={DesignTokens.accent.primary} />
                          ) : (
                            <Bookmark size={16} color={DesignTokens.accent.primary} />
                          )}
                        </View>
                        <View style={styles.savedItemContent}>
                          <Text style={styles.savedItemTitle}>{bookmark.chapterName}</Text>
                          <Text style={styles.savedItemSubtitle}>
                            {bookmark.type === 'ayah'
                              ? `Ayah ${bookmark.verseNumber}`
                              : 'Saved surah'}
                          </Text>
                        </View>
                        <ChevronRight size={18} color={DesignTokens.text.muted} />
                      </Pressable>
                    ))
                  ) : (
                    <Text style={styles.savedSectionEmpty}>
                      Bookmark a surah or ayah to pin it here.
                    </Text>
                  )}
                </View>
              }
              renderItem={({ item: chapter }) => {
                const isActive = chapter.id === selectedChapter?.id;
                const isSaved = bookmarkIds.has(getSurahBookmarkId(chapter.id));
                const isDownloaded = Boolean(downloadedChapters[chapter.id]);

                return (
                  <Pressable
                    style={[styles.surahItem, isActive && styles.surahItemActive]}
                    onPress={() => handleSurahSelect(chapter)}
                  >
                    <View
                      style={[
                        styles.surahNumberBadge,
                        isActive && styles.surahNumberBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.surahNumberBadgeText,
                          isActive && styles.surahNumberBadgeTextActive,
                        ]}
                      >
                        {chapter.id}
                      </Text>
                    </View>
                    <View style={styles.surahItemContent}>
                      <View style={styles.surahItemRow}>
                        <Text style={styles.surahItemName}>{chapter.name_simple}</Text>
                        <Text style={styles.surahItemArabic}>{chapter.name_arabic}</Text>
                      </View>
                      <Text style={styles.surahItemMeaning}>
                        {chapter.translated_name.name} • {chapter.verses_count} verses
                      </Text>
                    </View>
                    <View style={styles.surahItemMeta}>
                      {isSaved ? (
                        <BookmarkCheck size={16} color={DesignTokens.accent.primary} />
                      ) : null}
                      {isDownloaded ? (
                        <Download size={16} color={DesignTokens.accent.primary} />
                      ) : null}
                      <ChevronRight size={18} color={DesignTokens.text.muted} />
                    </View>
                  </Pressable>
                );
              }}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.background.primary,
  },
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 12,
    color: DesignTokens.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignTokens.text.heading,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    flexGrow: 1,
  },
  guestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  guestCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DesignTokens.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestCardContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  guestCardTitle: {
    color: DesignTokens.text.heading,
    fontSize: 15,
    fontWeight: '600',
  },
  guestCardBody: {
    color: DesignTokens.text.body,
    lineHeight: 20,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: DesignTokens.accent.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  continueCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(17, 26, 25, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueCardContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  continueCardTitle: {
    color: DesignTokens.text.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  continueCardBody: {
    color: DesignTokens.text.onPrimary,
    opacity: 0.85,
  },
  surahHeader: {
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  surahHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  surahHeaderIdentity: {
    flex: 1,
  },
  surahName: {
    fontSize: 32,
    color: DesignTokens.text.heading,
    fontFamily: 'serif',
    fontWeight: '300',
  },
  surahNameArabic: {
    fontSize: 24,
    color: DesignTokens.text.body,
    marginTop: Spacing.xs,
  },
  surahActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  surahActionButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.background.surface,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  surahInfo: {
    color: DesignTokens.text.body,
    lineHeight: 20,
  },
  utilityGrid: {
    gap: Spacing.md,
  },
  utilityCard: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  utilityLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: DesignTokens.text.muted,
  },
  utilityValue: {
    fontSize: 18,
    color: DesignTokens.text.heading,
    fontWeight: '600',
  },
  utilityMeta: {
    color: DesignTokens.text.body,
    lineHeight: 20,
  },
  audioCard: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioTitle: {
    fontSize: 18,
    color: DesignTokens.text.heading,
    fontWeight: '600',
  },
  audioSubtitle: {
    color: DesignTokens.text.body,
    marginTop: 2,
  },
  audioTime: {
    color: DesignTokens.text.heading,
    fontSize: 22,
    fontWeight: '600',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  audioIconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.background.primary,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  audioPrimaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.accent.primary,
  },
  audioPrimaryButtonLoading: {
    opacity: 0.75,
  },
  audioMeta: {
    color: DesignTokens.text.body,
    lineHeight: 20,
  },
  audioError: {
    color: '#FCA5A5',
    lineHeight: 20,
  },
  verseContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'flex-start',
  },
  verseBody: {
    flex: 1,
    gap: Spacing.sm,
  },
  verseMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verseMetaLabel: {
    color: DesignTokens.text.muted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  verseBookmarkButton: {
    padding: Spacing.xs,
  },
  verseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DesignTokens.accent.emerald,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  verseNumberText: {
    color: DesignTokens.accent.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  verseText: {
    color: DesignTokens.text.heading,
    fontSize: 18,
    lineHeight: 31,
  },
  loadingText: {
    fontSize: 14,
    color: DesignTokens.text.muted,
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: 14,
    color: DesignTokens.text.body,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: DesignTokens.accent.emerald,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DesignTokens.accent.primary,
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  loadMoreText: {
    fontSize: 14,
    color: DesignTokens.accent.primary,
    fontWeight: '500',
  },
  completionCard: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginTop: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
  },
  completionText: {
    fontSize: 16,
    color: DesignTokens.text.body,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: DesignTokens.background.primary,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.border.subtle,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: DesignTokens.text.heading,
  },
  modalSubtitle: {
    color: DesignTokens.text.body,
    marginTop: 2,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  surahList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  savedSection: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  savedSectionTitle: {
    color: DesignTokens.text.heading,
    fontSize: 16,
    fontWeight: '600',
  },
  savedSectionEmpty: {
    color: DesignTokens.text.body,
    lineHeight: 20,
  },
  savedPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: DesignTokens.accent.primary,
    borderRadius: BorderRadius.md,
  },
  savedPromptText: {
    flex: 1,
    color: DesignTokens.text.onPrimary,
    fontWeight: '600',
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  savedItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.background.surface,
  },
  savedItemContent: {
    flex: 1,
  },
  savedItemTitle: {
    color: DesignTokens.text.heading,
    fontSize: 15,
    fontWeight: '600',
  },
  savedItemSubtitle: {
    color: DesignTokens.text.body,
    marginTop: 2,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.border.subtle,
  },
  surahItemActive: {
    backgroundColor: 'rgba(40, 65, 57, 0.18)',
    marginHorizontal: -Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  surahNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: DesignTokens.accent.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  surahNumberBadgeActive: {
    backgroundColor: DesignTokens.accent.primary,
  },
  surahNumberBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: DesignTokens.accent.primary,
  },
  surahNumberBadgeTextActive: {
    color: DesignTokens.text.onPrimary,
  },
  surahItemContent: {
    flex: 1,
  },
  surahItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  surahItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: DesignTokens.text.heading,
  },
  surahItemArabic: {
    fontSize: 16,
    color: DesignTokens.text.body,
  },
  surahItemMeaning: {
    fontSize: 13,
    color: DesignTokens.text.body,
    marginTop: 2,
  },
  surahItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: Spacing.md,
  },
});
