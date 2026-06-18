"use client"

import type { ReactNode } from "react"
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
  const isClosed = turnedSheets === 0

  return (
    <section
      className={[styles.bookFrame, isClosed ? styles.bookClosed : styles.bookOpen].join(" ")}
      aria-label="Interactive anniversary memory book"
    >
      <div className={styles.leftBase} aria-hidden={turnedSheets < sheets.length} />
      <div className={styles.rightBase}>{finalRightPage}</div>

      {sheets.map((sheet, index) => {
        const isTurned = index < turnedSheets
        const canTurnForward = index === turnedSheets
        const canTurnBack = index === turnedSheets - 1
        const zIndex = isTurned ? index + 3 : sheets.length - index + 10

        return (
          <BookSheet
            key={sheet.id}
            front={sheet.front}
            back={sheet.back}
            isTurned={isTurned}
            canTurnForward={canTurnForward}
            canTurnBack={canTurnBack}
            isTurning={isTurning}
            forwardLabel={index === 0 ? "Open memory book" : "Turn page forward"}
            onBack={onBack}
            onForward={onForward}
            zIndex={zIndex}
          />
        )
      })}

      <div className={styles.spineCrease} aria-hidden="true" />
    </section>
  )
}
