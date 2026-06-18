"use client"

import { useRef, useState, type ReactNode } from "react"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"
import { DecorativeScene } from "./decorative-scene"
import styles from "./memory-book.module.css"

const LOFI_TRACK = {
  src: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Local%20Forecast%20-%20Elevator.mp3",
  title: "Local Forecast - Elevator",
  attribution: "Music by Kevin MacLeod, licensed under Creative Commons Attribution 4.0.",
}

interface MemoryBookStageProps {
  children: ReactNode
  isBookOpen: boolean
  className?: string
  track?: {
    src: string
    title: string
    attribution: string
  } | null
}

export function MemoryBookStage({
  children,
  isBookOpen,
  className,
  track = LOFI_TRACK,
}: MemoryBookStageProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlayback = async () => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (audio.paused) {
      await audio.play()
      setIsPlaying(true)
      return
    }

    audio.pause()
    setIsPlaying(false)
  }

  const restartTrack = () => {
    const audio = audioRef.current

    if (audio) {
      audio.currentTime = 0
    }
  }

  const skipAhead = () => {
    const audio = audioRef.current

    if (audio) {
      const nextTime = audio.currentTime + 15
      audio.currentTime = Number.isFinite(audio.duration) ? Math.min(audio.duration, nextTime) : nextTime
    }
  }

  return (
    <main className={[styles.stageShell, className || ""].join(" ")}>
      <div className={styles.cardstockNoise} aria-hidden="true" />
      <DecorativeScene isBookOpen={isBookOpen} />

      {track ? (
        <div className={styles.audioDeck} title={track.attribution}>
          <audio
            ref={audioRef}
            src={track.src}
            loop
            preload="metadata"
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
          <span className={styles.deckAvatar} />
          <span className={styles.deckTitle}>{track.title}</span>
          <span className={styles.deckDots}>
            <span />
            <span />
            <span />
          </span>
          <button type="button" onClick={restartTrack} aria-label={`Restart ${track.title}`}>
            <SkipBack size={13} strokeWidth={1.8} />
          </button>
          <button type="button" onClick={togglePlayback} aria-label={isPlaying ? "Pause music" : "Play music"}>
            {isPlaying ? <Pause size={13} strokeWidth={1.8} /> : <Play size={13} strokeWidth={1.8} />}
          </button>
          <button type="button" onClick={skipAhead} aria-label="Skip music ahead">
            <SkipForward size={13} strokeWidth={1.8} />
          </button>
        </div>
      ) : null}

      <div className={styles.bookMount}>{children}</div>
    </main>
  )
}
