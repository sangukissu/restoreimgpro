"use client"

import { useCallback, useRef, type ReactNode } from "react"
import { BookSheet } from "./book-sheet"
import styles from "./memory-book.module.css"

export interface MemoryBookSheet {
  id: string
  front: ReactNode
  back: ReactNode
}

interface BookFrameProps {
  sheets: MemoryBookSheet[]
  turnedSheets: number
  finalRightPage: ReactNode
  isTurning: boolean
  onBack: () => void
  onForward: () => void
}

export function BookFrame({
  sheets,
  turnedSheets,
  finalRightPage,
  isTurning,
  onBack,
  onForward,
}: BookFrameProps) {
  const frameRef = useRef<HTMLElement>(null)
  const isClosed = turnedSheets === 0
  const canGoBack = turnedSheets > 0
  const canGoForward = turnedSheets < sheets.length

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      /* ── Guard: animation in progress ────────────────────────── */
      if (isTurning) return

      /* ── Guard: click on an interactive child (e.g. Polaroid) ─ */
      const target = event.target as HTMLElement
      if (target.closest('[data-memory-book-interactive="true"]')) return

      /* ── Closed book: any click opens it ──────────────────────── */
      if (isClosed) {
        if (canGoForward) onForward()
        return
      }

      /* ── Open book: left half → back, right half → forward ───── */
      const frame = frameRef.current
      if (!frame) return

      const rect = frame.getBoundingClientRect()
      const midpoint = rect.left + rect.width / 2

      if (event.clientX < midpoint) {
        if (canGoBack) onBack()
      } else {
        if (canGoForward) onForward()
      }
    },
    [isTurning, isClosed, canGoBack, canGoForward, onBack, onForward],
  )

  return (
    <section
      ref={frameRef}
      className={[
        styles.bookFrame,
        isClosed ? styles.bookClosed : styles.bookOpen,
        isTurning ? styles.bookFrameTurning : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Interactive anniversary memory book"
      onClick={handleClick}
    >
      <div
        className={styles.leftBase}
        aria-hidden={turnedSheets < sheets.length}
      />
      <div
        className={[
          styles.rightBase,
          turnedSheets === sheets.length ? styles.rightBaseActive : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {finalRightPage}
      </div>

      {sheets.map((sheet, index) => {
        const isTurned = index < turnedSheets
        const zIndex = isTurned ? index + 3 : sheets.length - index + 10

        return (
          <BookSheet
            key={sheet.id}
            front={sheet.front}
            back={sheet.back}
            isTurned={isTurned}
            zIndex={zIndex}
          />
        )
      })}

      <div className={styles.spineCrease} aria-hidden="true" />
    </section>
  )
}
