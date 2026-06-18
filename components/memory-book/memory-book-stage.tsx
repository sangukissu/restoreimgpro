"use client"

import type { ReactNode } from "react"
import { DecorativeScene } from "./decorative-scene"
import {
  MemoryBookAudioDeck,
  type MemoryBookTrack,
} from "./memory-book-audio-deck"
import styles from "./memory-book.module.css"

const LOFI_TRACK: MemoryBookTrack = {
  src: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Local%20Forecast%20-%20Elevator.mp3",
  title: "Local Forecast - Elevator",
  attribution: "Music by Kevin MacLeod, licensed under Creative Commons Attribution 4.0.",
}

interface MemoryBookStageProps {
  children: ReactNode
  isBookOpen: boolean
  className?: string
  track?: MemoryBookTrack | null
}

export function MemoryBookStage({
  children,
  isBookOpen,
  className,
  track = LOFI_TRACK,
}: MemoryBookStageProps) {
  return (
    <main className={[styles.stageShell, className || ""].filter(Boolean).join(" ")}>
      <div className={styles.cardstockNoise} aria-hidden="true" />
      <DecorativeScene isBookOpen={isBookOpen} />

      {track ? <MemoryBookAudioDeck track={track} /> : null}

      <div className={styles.bookMount}>{children}</div>
    </main>
  )
}
