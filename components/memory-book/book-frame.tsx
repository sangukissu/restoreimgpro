"use client"

import { useRef, type PointerEvent, type ReactNode } from "react"
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
  onBack: () => void
  onForward: () => void
}

interface TapStart {
  x: number
  y: number
  pointerId: number
  isInteractive: boolean
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false
  }

  return Boolean(
    target.closest(
      "button, a, input, textarea, select, [role='button'], [data-memory-book-interactive='true']"
    )
  )
}

export function BookFrame({ sheets, turnedSheets, finalRightPage, onBack, onForward }: BookFrameProps) {
  const tapStartRef = useRef<TapStart | null>(null)
  const isClosed = turnedSheets === 0
  const canGoBack = turnedSheets > 0
  const canGoForward = turnedSheets < sheets.length

  const handlePointerDownCapture = (event: PointerEvent<HTMLElement>) => {
    tapStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
      isInteractive: isInteractiveTarget(event.target),
    }
  }

  const handlePointerUpCapture = (event: PointerEvent<HTMLElement>) => {
    const tapStart = tapStartRef.current
    tapStartRef.current = null

    if (!tapStart || tapStart.pointerId !== event.pointerId || tapStart.isInteractive) {
      return
    }

    const movedX = Math.abs(event.clientX - tapStart.x)
    const movedY = Math.abs(event.clientY - tapStart.y)

    if (movedX > 10 || movedY > 10) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const tappedLeftHalf = event.clientX < bounds.left + bounds.width / 2

    if (isClosed && canGoForward) {
      onForward()
      return
    }

    if (tappedLeftHalf && canGoBack) {
      onBack()
      return
    }

    if (!tappedLeftHalf && canGoForward) {
      onForward()
    }
  }

  return (
    <section
      className={[styles.bookFrame, isClosed ? styles.bookClosed : styles.bookOpen].join(" ")}
      aria-label="Interactive anniversary memory book"
      onPointerDownCapture={handlePointerDownCapture}
      onPointerUpCapture={handlePointerUpCapture}
    >
      <div className={styles.leftBase} aria-hidden={turnedSheets < sheets.length} />
      <div className={styles.rightBase}>{finalRightPage}</div>

      {sheets.map((sheet, index) => {
        const isTurned = index < turnedSheets
        const isInteractive = index === turnedSheets
        const zIndex = isTurned ? index + 3 : sheets.length - index + 10

        return (
          <BookSheet
            key={sheet.id}
            front={sheet.front}
            back={sheet.back}
            isTurned={isTurned}
            isInteractive={isInteractive}
            zIndex={zIndex}
          />
        )
      })}

      <div className={styles.spineCrease} aria-hidden="true" />
    </section>
  )
}
