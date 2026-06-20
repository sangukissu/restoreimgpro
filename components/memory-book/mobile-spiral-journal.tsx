"use client"

import type { CSSProperties } from "react"
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion"
import { Play } from "lucide-react"
import type { MemoryBookDocumentV1 } from "@/lib/memory-book/types"
import { ButterflySvg } from "./butterfly-svg"
import type { MemoryBookAssetSource } from "./family-heritage-viewer"
import { PaperTexture } from "./paper-texture"
import { PencilsSvg } from "./pencils-svg"
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

const SPIRAL_RINGS = Array.from({ length: 9 }, (_, index) => index)

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
  const isClosing = pageIndex === totalPages
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
      <div className={styles.mobileNotebook}>
        <div className={styles.mobileNotebookBase} aria-hidden="true" />
        <div className={styles.mobileSpiralRail} aria-hidden="true">
          {SPIRAL_RINGS.map((ring) => (
            <span className={styles.mobileSpiralRing} key={ring}>
              <svg width="24" height="48" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id={`wire-metal-${ring}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4a4641"/>
                    <stop offset="25%" stopColor="#a8a39d"/>
                    <stop offset="45%" stopColor="#ffffff"/>
                    <stop offset="70%" stopColor="#807b75"/>
                    <stop offset="100%" stopColor="#3c3834"/>
                  </linearGradient>
                  <filter id={`wire-shadow-${ring}`} x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="1.5" result="blur"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.15   0 0 0 0 0.12   0 0 0 0 0.09  0 0 0 0.35 0"/>
                  </filter>
                </defs>
                <path d="M 11,20 C 11,4 17,4 17,39.5" fill="none" stroke="black" strokeWidth="3.2" filter={`url(#wire-shadow-${ring})`} />
                <path d="M 9,20 C 9,2 15,2 15,39.5" fill="none" stroke={`url(#wire-metal-${ring})`} strokeWidth="3.2" strokeLinecap="round" />
              </svg>
            </span>
          ))}
        </div>

        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.article
            key={pageIndex}
            className={[
              styles.mobileSheet,
              pageIndex === 0 ? styles.mobileCoverSheet : styles.mobileStorySheet,
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
              <MobileJournalCover titleLines={titleLines} periodLines={periodLines} />
            ) : spread ? (
              <MobileJournalStory
                document={document}
                spread={spread}
                sourceMap={sourceMap}
                onAssetOpen={onAssetOpen}
              />
            ) : isClosing ? (
              <MobileJournalClosing message={document.dedication} />
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
      </div>

      <div className={styles.mobileJournalFooter}>
        <span className={styles.mobilePageCounter}>
          {pageIndex === 0 ? "Cover" : isClosing ? "Closing message" : `${pageIndex} / ${document.spreads.length}`}
        </span>
        {pageIndex === 0 ? (
          <span className={styles.mobileSwipeHint}>Swipe or tap the edge</span>
        ) : null}
      </div>
    </section>
  )
}

function MobileJournalCover({
  titleLines,
  periodLines,
}: {
  titleLines: string[]
  periodLines: string[]
}) {
  return (
    <div className={styles.mobileCoverContent}>
      <div className={styles.mobileCoverWeave} aria-hidden="true" />
      <img className={styles.mobileCoverDaisy} src="/icons/daisy.webp" alt="" draggable={false} />
      <div className={styles.mobileCoverTitle}>
        {titleLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
      {periodLines.length > 0 && (
        <div className={styles.mobileCoverPeriod}>
          {periodLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      )}
      <div className={styles.mobileCoverPencils} aria-hidden="true">
        <PencilsSvg />
      </div>
      <ButterflySvg className={styles.mobileCoverButterfly} />
    </div>
  )
}

function MobileJournalStory({
  document,
  spread,
  sourceMap,
  onAssetOpen,
}: {
  document: MemoryBookDocumentV1
  spread: MemoryBookDocumentV1["spreads"][number]
  sourceMap: Map<string, MemoryBookAssetSource>
  onAssetOpen: (assetId: string) => void
}) {
  return (
    <div className={styles.mobileStoryContent}>
      <PaperTexture textureId={`mobile-${document.bookId}-${spread.id}`} />
      <img className={styles.mobilePressedFlower} src="/icons/rose.webp" alt="" draggable={false} />
      <div className={styles.mobileStoryCopy}>
        <h2>{spread.right.heading}</h2>
        <p>{spread.right.body}</p>
      </div>

      <div className={styles.mobilePhotoGrid}>
        {spread.right.assets.map((asset, index) => {
          const source = sourceMap.get(asset.id)
          const previewSrc =
            source?.poster ||
            (source?.mediaType === "image" ? source.src : "") ||
            "/icons/rose.webp"

          return (
            <button
              type="button"
              className={styles.mobilePhoto}
              style={{ "--mobile-photo-rotate": index === 0 ? "-2.5deg" : "2.8deg" } as CSSProperties}
              key={asset.id}
              onClick={() => onAssetOpen(asset.id)}
              onPointerDown={(event) => event.stopPropagation()}
              data-memory-book-interactive="true"
              aria-label={`Open ${asset.alt}`}
            >
              <span className={styles.mobilePhotoTape} aria-hidden="true" />
              <img src={previewSrc} alt={asset.alt} draggable={false} />
              {asset.mediaType === "video" ? (
                <span className={styles.mobileVideoBadge} aria-hidden="true">
                  <Play size={16} fill="currentColor" />
                </span>
              ) : null}
              {asset.caption ? <span className={styles.mobilePhotoCaption}>{asset.caption}</span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MobileJournalClosing({ message }: { message: string }) {
  return (
    <div className={[styles.mobileStoryContent, styles.mobileClosingContent].join(" ")}>
      <PaperTexture textureId="mobile-closing-message" />
      <img className={styles.mobilePressedFlower} src="/icons/daisy.webp" alt="" draggable={false} />
      <div className={styles.mobileStoryCopy}>
        <h2>A closing message</h2>
        <p>{message || "A final note can live here after the last memory."}</p>
      </div>
    </div>
  )
}