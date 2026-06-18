"use client"

import { useRef, useState } from "react"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"
import styles from "./memory-book.module.css"

export interface MemoryBookTrack {
  src: string
  title: string
  attribution: string
}

export function MemoryBookAudioDeck({ track }: { track: MemoryBookTrack }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlayback = async () => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (audio.paused) {
      await audio.play()
      return
    }

    audio.pause()
  }

  const skipAhead = () => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    const nextTime = audio.currentTime + 15
    audio.currentTime = Number.isFinite(audio.duration)
      ? Math.min(audio.duration, nextTime)
      : nextTime
  }

  return (
    <div className={styles.audioDeck} title={track.attribution} data-memory-book-interactive="true">
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
      <span className={styles.deckDots} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <button
        type="button"
        onClick={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0
          }
        }}
        aria-label={`Restart ${track.title}`}
      >
        <SkipBack size={13} strokeWidth={1.8} />
      </button>
      <button type="button" onClick={togglePlayback} aria-label={isPlaying ? "Pause music" : "Play music"}>
        {isPlaying ? <Pause size={13} strokeWidth={1.8} /> : <Play size={13} strokeWidth={1.8} />}
      </button>
      <button type="button" onClick={skipAhead} aria-label="Skip music ahead">
        <SkipForward size={13} strokeWidth={1.8} />
      </button>
    </div>
  )
}
