'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
  notice?: string;
  startAt?: number;
  onProgress: (position: number, duration: number) => void;
  onBack: () => void;
}

const SAVE_INTERVAL_SECONDS = 5;
const HIDE_CONTROLS_MS = 3000;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s}` : `${m}:${s}`;
}

export default function VideoPlayer({ src, title, notice, startAt = 0, onProgress, onBack }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSavedRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Latest position and callback in refs, so the save on unmount works after the <video> is gone
  const positionRef = useRef({ time: 0, duration: 0 });
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState('');

  const saveNow = useCallback(() => {
    const { time, duration } = positionRef.current;
    if (duration > 0) onProgressRef.current(time, duration);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  }, []);

  const seekBy = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(video.currentTime + delta, 0), video.duration || 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void containerRef.current?.requestFullscreen();
  }, []);

  // Show controls on activity, hide them again after a few idle seconds while playing
  const revealControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!videoRef.current?.paused) setControlsVisible(false);
    }, HIDE_CONTROLS_MS);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement && e.target.type !== 'range') return;
      // A focused button already handles Space itself; handling it here too would toggle twice
      if (e.key === ' ' && e.target instanceof HTMLButtonElement) return;
      const actions: Record<string, () => void> = {
        ' ': togglePlay,
        k: togglePlay,
        ArrowLeft: () => seekBy(-10),
        ArrowRight: () => seekBy(10),
        f: toggleFullscreen,
        m: toggleMute,
      };
      const action = actions[e.key];
      if (action) {
        e.preventDefault();
        action();
        revealControls();
      }
    };
    const onFullscreenChange = () => setFullscreen(!!document.fullscreenElement);

    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      clearTimeout(hideTimerRef.current);
    };
  }, [togglePlay, seekBy, toggleFullscreen, toggleMute, revealControls]);

  // Save the position when leaving the page
  useEffect(() => saveNow, [saveNow]);

  const progressPercent = duration > 0 ? (current / duration) * 100 : 0;
  const iconButton = 'flex h-10 w-10 items-center justify-center rounded-full text-2xl hover:bg-white/10';

  return (
    <div
      ref={containerRef}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
      className={`fixed inset-0 z-50 bg-black ${controlsVisible ? '' : 'cursor-none'}`}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        className="h-full w-full"
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          setDuration(video.duration);
          // Resume, unless the saved spot is right at the end
          if (startAt > 0 && startAt < video.duration - 10) video.currentTime = startAt;
        }}
        onTimeUpdate={(e) => {
          const time = e.currentTarget.currentTime;
          positionRef.current = { time, duration: e.currentTarget.duration };
          setCurrent(time);
          if (Math.abs(time - lastSavedRef.current) >= SAVE_INTERVAL_SECONDS) {
            lastSavedRef.current = time;
            saveNow();
          }
        }}
        onPlay={() => {
          setPlaying(true);
          revealControls();
        }}
        onPause={() => {
          setPlaying(false);
          setControlsVisible(true);
          saveNow();
        }}
        onEnded={saveNow}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onVolumeChange={(e) => {
          setVolume(e.currentTarget.volume);
          setMuted(e.currentTarget.muted);
        }}
        onError={() => setError('This video could not be loaded. Please try again later.')}
      />

      {buffering && !error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-netflix-red border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-lg">{error}</p>
          <button onClick={onBack} className="rounded bg-white px-6 py-2 font-semibold text-black">
            Go back
          </button>
        </div>
      )}

      {/* Big play button when paused (also covers browsers that block autoplay) */}
      {!playing && !buffering && !error && (
        <button
          onClick={togglePlay}
          aria-label="Play"
          className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-4xl ring-2 ring-white/70 hover:bg-black/80"
        >
          ▶
        </button>
      )}

      <div className={`transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="absolute inset-x-0 top-0 flex items-start gap-4 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6">
          <button onClick={onBack} aria-label="Back" className={iconButton}>
            ←
          </button>
          <div className="pt-1.5">
            <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
            {notice && <p className="mt-1 text-xs text-netflix-light-gray md:text-sm">{notice}</p>}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-12 md:px-8">
          <div className="flex items-center gap-3 text-sm">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={current}
              onChange={(e) => {
                const video = videoRef.current;
                if (video) video.currentTime = Number(e.target.value);
              }}
              aria-label="Seek"
              className="h-1 flex-1 cursor-pointer accent-netflix-red"
              style={{
                background: `linear-gradient(to right, var(--netflix-red) ${progressPercent}%, rgba(255,255,255,0.3) ${progressPercent}%)`,
              }}
            />
            <span className="w-28 text-right tabular-nums">
              {formatTime(current)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-3">
              <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} className={iconButton}>
                {playing ? '❚❚' : '▶'}
              </button>
              <button onClick={() => seekBy(-10)} aria-label="Back 10 seconds" className={`${iconButton} text-sm font-bold`}>
                ↺10
              </button>
              <button onClick={() => seekBy(10)} aria-label="Forward 10 seconds" className={`${iconButton} text-sm font-bold`}>
                10↻
              </button>
              <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} className={`${iconButton} text-xl`}>
                {muted || volume === 0 ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const video = videoRef.current;
                  if (!video) return;
                  video.volume = Number(e.target.value);
                  video.muted = video.volume === 0;
                }}
                aria-label="Volume"
                className="hidden w-24 cursor-pointer accent-white sm:block"
              />
            </div>
            <button
              onClick={toggleFullscreen}
              aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
              className={`${iconButton} text-xl`}
            >
              {fullscreen ? '⤡' : '⤢'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
