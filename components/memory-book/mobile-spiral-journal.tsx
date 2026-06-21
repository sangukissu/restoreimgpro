"use client"

import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion"
import type { MemoryBookDocumentV1 } from "@/lib/memory-book/types"
import type { MemoryBookAssetSource } from "./family-heritage-viewer"
import {
  MobileBackCoverSurface,
  MobileCoverSurface,
  MobileNotebookFrame,
  MobileStorySurface,
} from "./mobile-memory-book-page"
import styles from "./memory-book.module.css"
interface MobileSpiralJournalProps {
  document: MemoryBookDocumentV1
  sourceMap: Map<string, MemoryBookAssetSource>
  pageIndex: number
  direction: number
  isTurning: boolean
  titleLines: string[]
  periodLines: string[]
  onBack: () => void
  onForward: () => void
  onAssetOpen: (assetId: string) => void
}


export function MobileSpiralJournal({
  document,
  sourceMap,
  pageIndex,
  direction,
  isTurning,
  titleLines,
  periodLines,
  onBack,
  onForward,
  onAssetOpen,
}: MobileSpiralJournalProps) {
  const reduceMotion = useReducedMotion()
  const totalPages = document.spreads.length + 1
  const spread =
    pageIndex > 0 && pageIndex <= document.spreads.length
      ? document.spreads[pageIndex - 1]
      : null
  const isBackCover = pageIndex === totalPages
  const canGoBack = pageIndex > 0
  const canGoForward = pageIndex < totalPages
  const transition = reduceMotion
    ? { duration: 0.16 }
    : { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isTurning) {
      return
    }

    if (info.offset.x < -55 && canGoForward) {
      onForward()
    }

    if (info.offset.x > 55 && canGoBack) {
      onBack()
    }
  }

  return (
    <section className={styles.mobileJournal} aria-label="Family heritage spiral journal">
      <div className={styles.mobileJournalGlow} aria-hidden="true" />
      <MobileNotebookFrame>
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.article
            key={pageIndex}
            className={[
              styles.mobileSheet,
              pageIndex === 0
                ? styles.mobileCoverSheet
                : isBackCover
                  ? styles.mobileBackCoverSheet
                  : styles.mobileStorySheet,
            ].join(" ")}
            custom={direction}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    rotateX: direction > 0 ? -32 : 24,
                    y: direction > 0 ? -18 : 12,
                  }
            }
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    rotateX: direction > 0 ? 68 : -34,
                    y: direction > 0 ? -30 : 16,
                  }
            }
            transition={transition}
            drag={isTurning ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
          >
            {pageIndex === 0 ? (
              <MobileCoverSurface titleLines={titleLines} periodLines={periodLines} />
            ) : spread ? (
              <MobileStorySurface
                page={{ id: spread.id, ...spread.right }}
                sourceMap={sourceMap}
                textureId={`mobile-${document.bookId}-${spread.id}`}
                onAssetOpen={onAssetOpen}
              />
            ) : isBackCover ? (
              <MobileBackCoverSurface message={document.dedication} />
            ) : null}

            {canGoBack ? (
              <button
                type="button"
                className={[styles.mobileEdgeTurn, styles.mobileEdgeTurnBack].join(" ")}
                onClick={onBack}
                disabled={isTurning}
                aria-label="Previous journal page"
              />
            ) : null}
            {canGoForward ? (
              <button
                type="button"
                className={[styles.mobileEdgeTurn, styles.mobileEdgeTurnForward].join(" ")}
                onClick={onForward}
                disabled={isTurning}
                aria-label={pageIndex === 0 ? "Open journal" : "Next journal page"}
              />
            ) : null}
          </motion.article>
        </AnimatePresence>
      </MobileNotebookFrame>

      <div className={styles.mobileJournalFooter}>
        <span className={styles.mobilePageCounter}>
          {pageIndex === 0 ? "Cover" : isBackCover ? "Back cover" : `${pageIndex} / ${document.spreads.length}`}
        </span>
        {pageIndex === 0 ? (
          <span className={styles.mobileSwipeHint}>Swipe or tap the edge</span>
        ) : null}
      </div>
    </section>
  )
}
