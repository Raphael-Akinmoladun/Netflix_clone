'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getProgress, saveProgress } from '@/lib/progress';
import { TMDB_POSTER_W500, type ClassicDetails, type MovieDetails } from '@/lib/constants';
import VideoPlayer from './VideoPlayer';
import Spinner from './Spinner';

export type WatchKind = 'movie' | 'classic';

interface Playback {
  src: string;
  title: string;
  posterUrl: string | null;
  notice?: string;
  startAt: number;
}

const DEMO_NOTICE = 'Demo video — this title isn’t licensed for full streaming. Its trailer is on the info page.';

// TMDB titles play the free demo film; classics play the real public-domain movie
async function loadPlayback(kind: WatchKind, id: string, key: string): Promise<Playback> {
  const startAt = getProgress(key)?.position ?? 0;

  if (kind === 'classic') {
    const classic = await api.get<ClassicDetails>(`/classics/${encodeURIComponent(id)}`);
    return { src: classic.videoUrl, title: classic.title, posterUrl: classic.posterUrl, startAt };
  }

  const [movie, demo] = await Promise.all([
    api.get<MovieDetails>(`/movies/${encodeURIComponent(id)}`),
    api.get<ClassicDetails>('/classics/demo'),
  ]);
  return {
    src: demo.videoUrl,
    title: movie.title,
    posterUrl: movie.poster_path ? `${TMDB_POSTER_W500}${movie.poster_path}` : null,
    notice: DEMO_NOTICE,
    startAt,
  };
}

export default function WatchScreen({ kind, id }: { kind: WatchKind; id: string }) {
  const router = useRouter();
  const key = `${kind}-${id}`;
  const [playback, setPlayback] = useState<Playback | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    loadPlayback(kind, id, key)
      .then((result) => !cancelled && setPlayback(result))
      .catch((err: Error) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [kind, id, key]);

  const handleProgress = useCallback(
    (position: number, duration: number) => {
      if (!playback) return;
      saveProgress({
        key,
        href: `/watch/${kind}/${id}`,
        title: playback.title,
        posterUrl: playback.posterUrl,
        position,
        duration,
      });
    },
    [playback, key, kind, id],
  );

  const goBack = useCallback(() => {
    if (window.history.length > 1) router.back();
    else router.push('/browse');
  }, [router]);

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-black px-4 text-center">
        <p className="text-lg">Couldn&apos;t start playback: {error}</p>
        <button onClick={goBack} className="rounded bg-white px-6 py-2 font-semibold text-black">
          Go back
        </button>
      </div>
    );
  }

  if (!playback) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <Spinner />
      </div>
    );
  }

  return (
    <VideoPlayer
      src={playback.src}
      title={playback.title}
      notice={playback.notice}
      startAt={playback.startAt}
      onProgress={handleProgress}
      onBack={goBack}
    />
  );
}
