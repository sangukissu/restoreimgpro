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
  const canGoBack = turnedSheets > 0
  const canGoForward = turnedSheets < sheets.length

  return (
    <section
      className={[styles.bookFrame, isClosed ? styles.bookClosed : styles.bookOpen].join(" ")}
      aria-label="Interactive anniversary memory book"
    >
      <div className={styles.leftBase} aria-hidden={turnedSheets < sheets.length} />
      <div
        className={[
          styles.rightBase,
          turnedSheets === sheets.length ? styles.rightBaseActive : "",
        ].filter(Boolean).join(" ")}
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

      <div
        className={[
          styles.bookTurnLayer,
          styles.bookTurnLayerTop,
          isClosed ? styles.bookTurnLayerTopClosed : "",
        ].filter(Boolean).join(" ")}
      >
        {isClosed && canGoForward ? (
          <button
            type="button"
            className={[styles.bookTurnButton, styles.bookTurnClosed].join(" ")}
            onClick={onForward}
            disabled={isTurning}
            aria-label="Open memory book"
          />
        ) : null}
        {!isClosed && canGoBack ? (
          <button
            type="button"
            className={[styles.bookTurnButton, styles.bookTurnBack].join(" ")}
            onClick={onBack}
            disabled={isTurning}
            aria-label="Turn page back"
          />
        ) : null}
        {!isClosed && canGoForward ? (
          <button
            type="button"
            className={[styles.bookTurnButton, styles.bookTurnForward].join(" ")}
            onClick={onForward}
            disabled={isTurning}
            aria-label="Turn page forward"
          />
        ) : null}
      </div>

      {!isClosed ? (
        <div className={[styles.bookTurnLayer, styles.bookTurnLayerBottom].join(" ")} aria-hidden="true">
          {canGoBack ? (
            <button
              type="button"
              className={[styles.bookTurnButton, styles.bookTurnBack].join(" ")}
              onClick={onBack}
              disabled={isTurning}
              tabIndex={-1}
            />
          ) : null}
          {canGoForward ? (
            <button
              type="button"
              className={[styles.bookTurnButton, styles.bookTurnForward].join(" ")}
              onClick={onForward}
              disabled={isTurning}
              tabIndex={-1}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
