import type { CSSProperties, ReactNode } from "react"
import styles from "./memory-book.module.css"

interface BookSheetProps {
  front: ReactNode
  back: ReactNode
  isTurned: boolean
  zIndex: number
}

export function BookSheet({
  front,
  back,
  isTurned,
  zIndex,
}: BookSheetProps) {
  return (
    <div
      className={[
        styles.bookSheet,
        isTurned ? styles.sheetTurned : "",
      ].join(" ")}
      style={{ "--sheet-z": zIndex } as CSSProperties}
    >
      <div className={[styles.sheetFace, styles.sheetFront].join(" ")}>{front}</div>
      <div className={[styles.sheetFace, styles.sheetBack].join(" ")}>{back}</div>
    </div>
  )
}
