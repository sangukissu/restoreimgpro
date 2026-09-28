"use client";

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const VIDEO_SRC = "/videos/bringback-film-preview.mp4";
const POSTER_SRC = "/bringback-film-poster.webp";
const DURATION_LABEL = "0:57";

const formatTime = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

function canAutoplayPreview() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return false;
  return true;
}

export interface HeroFilmHandle {
  openFilm: () => void;
  unmute: () => void;
  toggleMute: () => void;
}

export const HeroFilm = React.forwardRef<
  HeroFilmHandle,
  { className?: string }
>(({ className }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [chrome, setChrome] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const wake = useCallback(() => {
    setChrome(true);
    if (typeof window !== "undefined") {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => {
        if (!videoRef.current?.paused) {
          setChrome(false);
        }
      }, 2500);
    }
  }, []);

  const handleUnmute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    if (v.paused) {
      v.play().catch(() => {});
    }
    wake();
    trackEvent("hero_film_unmute", { section: "hero_in_place" });
  }, [wake]);

  const toggleMute = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const v = videoRef.current;
      if (!v) return;
      const nextMuted = !v.muted;
      v.muted = nextMuted;
      setMuted(nextMuted);
      if (!nextMuted && v.paused) {
        v.play().catch(() => {});
      }
      wake();
      trackEvent("hero_film_toggle_mute", { muted: nextMuted });
    },
    [wake]
  );

  const togglePlay = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
      wake();
    },
    [wake]
  );

  const handleVideoClick = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted) {
      handleUnmute();
    } else {
      togglePlay();
    }
  }, [handleUnmute, togglePlay]);

  const seekTo = useCallback((clientX: number) => {
    const v = videoRef.current;
    const bar = barRef.current;
    if (!v || !bar || !v.duration) return;
    const r = bar.getBoundingClientRect();
    v.currentTime = Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * v.duration;
  }, []);

  const handleFullscreen = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!wrapRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      wrapRef.current.requestFullscreen().catch(() => {});
    }
  }, []);

  useImperativeHandle(ref, () => ({
    openFilm: () => {
      wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      handleUnmute();
    },
    unmute: handleUnmute,
    toggleMute,
  }));

  // Autoplay video muted on initial load when visible
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !canAutoplayPreview()) return;
    let io: IntersectionObserver | undefined;

    const start = () => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!v.getAttribute("src")) {
              v.src = VIDEO_SRC;
              v.load();
            }
            v.play().catch(() => {});
          } else {
            if (!v.paused) v.pause();
          }
        },
        { threshold: 0.25 }
      );
      io.observe(v);
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      io?.disconnect();
      window.removeEventListener("load", start);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      onMouseMove={wake}
      onMouseEnter={wake}
      onMouseLeave={() => {
        if (!videoRef.current?.paused) setChrome(false);
      }}
      onTouchStart={wake}
      className={`group/film relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-[#0c0c0b] text-left isolate select-none ${
        chrome ? "" : "cursor-default"
      } ${className || ""}`}
    >
      {/* Poster Image while loading */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={POSTER_SRC}
        alt="BringBack film"
        width={1280}
        height={720}
        fetchPriority="high"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${
          previewReady ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Main Video Element */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        muted={muted}
        loop
        playsInline
        preload="auto"
        onClick={handleVideoClick}
        onPlay={() => {
          setPlaying(true);
        }}
        onPause={() => {
          setPlaying(false);
          setChrome(true);
        }}
        onPlaying={() => setPreviewReady(true)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onProgress={(e) => {
          const v = e.currentTarget;
          if (v.buffered.length && v.duration) {
            setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
          }
        }}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
      />

      {/* Subtle bottom shadow overlay only visible on hover / when controls show */}
      <div
        className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none transition-opacity duration-300 ${
          chrome ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Minimal corner sound toggle (visible on hover) */}
      <div
        className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 transition-opacity duration-300 ${
          chrome ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/10"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Minimal In-Place Controls Bar (visible on hover) */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 px-3 sm:px-5 pb-3 sm:pb-4 pt-8 transition-opacity duration-300 ${
          chrome ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress / Scrub Bar */}
        <div
          ref={barRef}
          className="group/bar relative h-4 flex items-center cursor-pointer mb-1.5"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            seekTo(e.clientX);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) seekTo(e.clientX);
          }}
        >
          <div className="relative w-full h-[3px] group-hover/bar:h-[5px] transition-all rounded-full bg-white/20 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-white/25"
              style={{ width: `${buffered}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 bg-[#FF4D00]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            className="absolute w-3 h-3 -ml-[6px] rounded-full bg-white shadow scale-0 group-hover/bar:scale-100 transition-transform"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-2 sm:gap-3 text-white pr-12">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="w-8 h-8 -ml-1 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors cursor-pointer"
          >
            {playing ? (
              <Pause size={16} className="fill-white" />
            ) : (
              <Play size={16} className="fill-white ml-0.5" />
            )}
          </button>

          {/* Time */}
          <span className="text-xs font-semibold tabular-nums text-white/80">
            {formatTime(time)}{" "}
            <span className="text-white/40">/ {duration ? formatTime(duration) : DURATION_LABEL}</span>
          </span>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={handleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors cursor-pointer"
          >
            <Maximize size={15} />
          </button>
        </div>
      </div>
    </div>
  );
});

HeroFilm.displayName = "HeroFilm";
