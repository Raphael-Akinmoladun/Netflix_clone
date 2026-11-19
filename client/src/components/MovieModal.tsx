'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { TMDB_BACKDROP_W1280, TMDB_POSTER_W500, type MovieDetails } from '@/lib/constants';
import Spinner from './Spinner';

interface MovieModalProps {
  movieId: number;
  onClose: () => void;
}

export default function MovieModal({ movieId, onClose }: MovieModalProps) {
  // The modal is keyed by movieId, so it remounts when a different movie is opened.
  // currentId only changes when clicking a "More Like This" title inside the modal.
  const [currentId, setCurrentId] = useState(movieId);
  const [loaded, setLoaded] = useState<{ id: number; movie?: MovieDetails; error?: string } | null>(null);
  const [listStatus, setListStatus] = useState<{ id: number; inList: boolean } | null>(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let cancelled = false;

    api.get<MovieDetails>(`/movies/${currentId}`)
      .then((movie) => !cancelled && setLoaded({ id: currentId, movie }))
      .catch((err: Error) => !cancelled && setLoaded({ id: currentId, error: err.message }));

    api.get<{ inWatchlist: boolean }>(`/watchlist/check/${currentId}`)
      .then((data) => !cancelled && setListStatus({ id: currentId, inList: data.inWatchlist }))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [currentId]);

  // Ignore results that belong to a previously shown movie
  const movie = loaded?.id === currentId ? loaded.movie : undefined;
  const error = (loaded?.id === currentId ? loaded.error : undefined) ?? actionError;
  const inList = listStatus?.id === currentId && listStatus.inList;
  const setInList = (value: boolean) => setListStatus({ id: currentId, inList: value });

  // Close on Escape and lock background scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const toggleList = async () => {
    if (!movie) return;
    try {
      if (inList) {
        await api.delete(`/watchlist/${movie.id}`);
        setInList(false);
      } else {
        await api.post(`/watchlist/${movie.id}`, {
          title: movie.title,
          overview: movie.overview,
          posterPath: movie.poster_path ?? undefined,
          backdropPath: movie.backdrop_path ?? undefined,
          releaseDate: movie.release_date || undefined,
          genres: movie.genres.map((g) => g.id),
        });
        setInList(true);
      }
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  const trailer =
    movie?.videos.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ??
    movie?.videos.results.find((v) => v.site === 'YouTube');

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 md:py-10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden bg-netflix-dark-lighter md:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-netflix-dark text-xl"
        >
          ✕
        </button>

        {!movie && !error && <Spinner />}
        {error && <p className="p-10 text-center text-netflix-red">{error}</p>}

        {movie && (
          <>
            <div className="relative aspect-video w-full bg-black">
              {trailer ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
                  title={trailer.name}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                movie.backdrop_path && (
                  <Image
                    src={`${TMDB_BACKDROP_W1280}${movie.backdrop_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 896px) 100vw, 896px"
                    className="object-cover"
                  />
                )
              )}
            </div>

            <div className="space-y-4 p-6 md:p-10">
              <h2 className="text-2xl font-bold md:text-4xl">{movie.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="font-semibold text-green-500">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                <span>{movie.release_date?.slice(0, 4)}</span>
                {movie.runtime > 0 && (
                  <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                )}
              </div>

              <button
                onClick={toggleList}
                className="rounded border border-white/60 px-4 py-2 text-sm font-semibold hover:border-white"
              >
                {inList ? '✓ In My List' : '+ My List'}
              </button>

              <p className="text-sm leading-relaxed md:text-base">{movie.overview}</p>
              <p className="text-sm text-netflix-gray">
                Genres: <span className="text-foreground">{movie.genres.map((g) => g.name).join(', ')}</span>
              </p>

              {movie.similar.results.length > 0 && (
                <div className="pt-4">
                  <h3 className="mb-3 text-xl font-semibold">More Like This</h3>
                  <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                    {movie.similar.results.slice(0, 8).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setActionError('');
                          setCurrentId(m.id);
                        }}
                        className="relative aspect-[2/3] overflow-hidden rounded bg-netflix-dark-card"
                        aria-label={m.title}
                      >
                        {m.poster_path ? (
                          <Image
                            src={`${TMDB_POSTER_W500}${m.poster_path}`}
                            alt={m.title}
                            fill
                            sizes="200px"
                            className="object-cover transition-transform hover:scale-105"
                          />
                        ) : (
                          <span className="p-2 text-xs">{m.title}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
