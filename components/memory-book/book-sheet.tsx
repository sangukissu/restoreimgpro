import type { CSSProperties, ReactNode } from "react"
import styles from "./memory-book.module.css"

interface BookSheetProps {
  front: ReactNode
  back: ReactNode
  isTurned: boolean
  canTurnForward: boolean
  canTurnBack: boolean
  isTurning: boolean
  forwardLabel: string
  onBack: () => void
  onForward: () => void
  zIndex: number
}

export function BookSheet({
  front,
  back,
  isTurned,
  canTurnForward,
  canTurnBack,
  isTurning,
  forwardLabel,
  onBack,
  onForward,
  zIndex,
}: BookSheetProps) {
  return (
    <div
      className={[
        styles.bookSheet,
        isTurned ? styles.sheetTurned : "",
        canTurnForward || canTurnBack ? styles.bookSheetInteractive : "",
      ].join(" ")}
      style={{ "--sheet-z": zIndex } as CSSProperties}
    >
      <div className={[styles.sheetFace, styles.sheetFront].join(" ")}>
        {front}
        {canTurnForward ? (
          <button
            type="button"
            className={styles.sheetTurnButton}
            onClick={onForward}
            disabled={isTurning}
            aria-label={forwardLabel}
          />
        ) : null}
      </div>
      <div className={[styles.sheetFace, styles.sheetBack].join(" ")}>
        {back}
        {canTurnBack ? (
          <button
            type="button"
            className={styles.sheetTurnButton}
            onClick={onBack}
            disabled={isTurning}
            aria-label="Turn page back"
          />
        ) : null}
      </div>
    </div>
  )
}
