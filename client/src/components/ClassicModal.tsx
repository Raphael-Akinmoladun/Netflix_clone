'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { ClassicDetails } from '@/lib/constants';
import Spinner from './Spinner';

interface ClassicModalProps {
  classicId: string;
  onClose: () => void;
}

export default function ClassicModal({ classicId, onClose }: ClassicModalProps) {
  const router = useRouter();
  const [classic, setClassic] = useState<ClassicDetails | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .get<ClassicDetails>(`/classics/${encodeURIComponent(classicId)}`)
      .then((data) => !cancelled && setClassic(data))
      .catch((err: Error) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [classicId]);

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

  const play = () => {
    onClose();
    router.push(`/watch/classic/${encodeURIComponent(classicId)}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 md:py-10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden bg-netflix-dark-lighter md:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-netflix-dark text-xl"
        >
          ✕
        </button>

        {!classic && !error && <Spinner />}
        {error && <p className="p-10 text-center text-netflix-red">{error}</p>}

        {classic && (
          <div className="flex flex-col gap-6 p-6 sm:flex-row md:p-10">
            <div className="relative mx-auto aspect-[2/3] w-40 shrink-0 overflow-hidden rounded bg-netflix-dark-card sm:mx-0 sm:w-48">
              <Image src={classic.posterUrl} alt={classic.title} fill sizes="200px" className="object-cover" />
            </div>
            <div className="space-y-4">
              <h2 className="pr-10 text-2xl font-bold md:text-3xl">{classic.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded border border-green-500 px-1.5 text-xs font-semibold text-green-500">
                  FREE · FULL MOVIE
                </span>
                {classic.year && <span>{classic.year}</span>}
                {classic.runtimeMinutes && (
                  <span>
                    {Math.floor(classic.runtimeMinutes / 60) > 0 && `${Math.floor(classic.runtimeMinutes / 60)}h `}
                    {classic.runtimeMinutes % 60}m
                  </span>
                )}
              </div>
              <button
                onClick={play}
                className="flex items-center gap-2 rounded bg-white px-8 py-2 font-semibold text-black hover:bg-white/75"
              >
                ▶ Play
              </button>
              {classic.overview && (
                <p className="line-clamp-[8] text-sm leading-relaxed md:text-base">{classic.overview}</p>
              )}
              <p className="text-xs text-netflix-gray">Public-domain film from the Internet Archive.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
