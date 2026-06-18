"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import type {
  MemoryBookAssetDocument,
  MemoryBookDocumentV1,
} from "@/lib/memory-book/types"
import { BookCover } from "./book-cover"
import { BookFrame, type MemoryBookSheet } from "./book-frame"
import { InnerPage } from "./inner-page"
import { MemoryBookAudioDeck } from "./memory-book-audio-deck"
import { MemoryBookStage } from "./memory-book-stage"
import { MobileSpiralJournal } from "./mobile-spiral-journal"
import { PaperTexture } from "./paper-texture"
import { Polaroid } from "./polaroid"
import styles from "./memory-book.module.css"

export interface MemoryBookAssetSource {
  id: string
  mediaType: "image" | "video"
  src: string
  poster?: string | null
  downloadUrl?: string | null
}

interface FamilyHeritageViewerProps {
  document: MemoryBookDocumentV1
  assetSources: MemoryBookAssetSource[]
  className?: string
  onCompleted?: () => void
  onPageChange?: (index: number, max: number) => void
}

type HeritageSpread = MemoryBookDocumentV1["spreads"][number]

export function FamilyHeritageViewer({
  document,
  assetSources,
  className,
  onCompleted,
  onPageChange,
}: FamilyHeritageViewerProps) {
  const completedRef = useRef(false)
  const turnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const turnLockRef = useRef(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isTurning, setIsTurning] = useState(false)
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null)
  const sourceMap = useMemo(
    () => new Map(assetSources.map((source) => [source.id, source])),
    [assetSources]
  )

  const coverTitleLines = useMemo(
    () => splitCoverTitle(document.cover.title),
    [document.cover.title]
  )
  const coverPeriodLines = useMemo(
    () =>
      [document.cover.subtitle, document.cover.periodLabel]
        .map((line) => line.trim())
        .filter(Boolean),
    [document.cover.periodLabel, document.cover.subtitle]
  )

  const sheets = useMemo<MemoryBookSheet[]>(() => {
    const storySheets = document.spreads.slice(0, -1).map((spread, index) => ({
      id: spread.id,
      front: (
        <HeritageScrapbookPage
          spread={spread}
          sourceMap={sourceMap}
          textureId={`desktop-${document.bookId}-story-${index + 1}`}
          onAssetOpen={setActiveAssetId}
        />
      ),
      back: <InnerPage variant="botanical" />,
    }))

    return [
      {
        id: "cover",
        front: (
          <BookCover
            titleLines={coverTitleLines}
            periodLines={coverPeriodLines}
          />
        ),
        back: <InnerPage variant="botanical" />,
      },
      ...storySheets,
    ]
  }, [coverPeriodLines, coverTitleLines, document.bookId, document.spreads, sourceMap])

  const maxIndex = sheets.length
  const finalSpread = document.spreads.at(-1)

  const turnTo = useCallback(
    (next: number) => {
      if (turnLockRef.current) {
        return
      }

      const resolved = Math.max(0, Math.min(maxIndex, next))

      if (resolved === pageIndex) {
        return
      }

      setDirection(resolved > pageIndex ? 1 : -1)
      turnLockRef.current = true
      setIsTurning(true)
      setPageIndex(resolved)

      if (turnTimerRef.current) {
        clearTimeout(turnTimerRef.current)
      }

      turnTimerRef.current = setTimeout(() => {
        turnLockRef.current = false
        setIsTurning(false)
      }, 920)
    },
    [maxIndex, pageIndex]
  )

  const goForward = useCallback(() => {
    turnTo(pageIndex + 1)
  }, [pageIndex, turnTo])

  const goBack = useCallback(() => {
    turnTo(pageIndex - 1)
  }, [pageIndex, turnTo])

  useEffect(() => {
    if (turnTimerRef.current) {
      clearTimeout(turnTimerRef.current)
    }

    turnLockRef.current = false
    setPageIndex(0)
    setDirection(1)
    setIsTurning(false)
    setActiveAssetId(null)
    completedRef.current = false
  }, [document.bookId])

  useEffect(() => {
    if (pageIndex === maxIndex && !completedRef.current) {
      completedRef.current = true
      onCompleted?.()
    }
  }, [maxIndex, onCompleted, pageIndex])

  useEffect(() => {
    onPageChange?.(pageIndex, maxIndex)
  }, [pageIndex, maxIndex, onPageChange])

  useEffect(
    () => () => {
      if (turnTimerRef.current) {
        clearTimeout(turnTimerRef.current)
      }
    },
    []
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeAssetId) {
        return
      }

      if (event.key === "ArrowRight") {
        goForward()
      }

      if (event.key === "ArrowLeft") {
        goBack()
      }

      if (event.key === "Home") {
        turnTo(0)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeAssetId, goBack, goForward, turnTo])

  const activeDocumentAsset = useMemo(() => {
    if (!activeAssetId) {
      return null
    }

    return (
      document.spreads
        .flatMap((spread) => spread.right.assets)
        .find((asset) => asset.id === activeAssetId) || null
    )
  }, [activeAssetId, document.spreads])
  const activeSource = activeAssetId ? sourceMap.get(activeAssetId) : null

  if (!finalSpread) {
    return null
  }

  return (
    <>
      <div className={[styles.viewerShell, className || ""].filter(Boolean).join(" ")}>
        {document.music.enabled ? (
          <MemoryBookAudioDeck
            track={{
              src: document.music.src,
              title: document.music.title,
              attribution: document.music.attribution,
            }}
          />
        ) : null}

        <div className={styles.desktopPresentation}>
          <MemoryBookStage isBookOpen={pageIndex > 0} track={null}>
            <BookFrame
              sheets={sheets}
              turnedSheets={pageIndex}
              finalRightPage={
                <HeritageScrapbookPage
                  spread={finalSpread}
                  sourceMap={sourceMap}
                  textureId={`desktop-${document.bookId}-final`}
                  onAssetOpen={setActiveAssetId}
                />
              }
              isTurning={isTurning}
              onBack={goBack}
              onForward={goForward}
            />
          </MemoryBookStage>
        </div>

        <div className={styles.mobilePresentation}>
          <MobileSpiralJournal
            document={document}
            sourceMap={sourceMap}
            pageIndex={pageIndex}
            direction={direction}
            isTurning={isTurning}
            titleLines={coverTitleLines}
            periodLines={coverPeriodLines}
            onBack={goBack}
            onForward={goForward}
            onAssetOpen={setActiveAssetId}
          />
        </div>
      </div>

      <MemoryLightbox
        asset={activeDocumentAsset}
        source={activeSource || null}
        open={Boolean(activeDocumentAsset && activeSource)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveAssetId(null)
          }
        }}
      />
    </>
  )
}

function HeritageScrapbookPage({
  spread,
  sourceMap,
  textureId,
  onAssetOpen,
}: {
  spread: HeritageSpread
  sourceMap: Map<string, MemoryBookAssetSource>
  textureId: string
  onAssetOpen: (assetId: string) => void
}) {
  return (
    <article className={[styles.innerPage, styles.scrapbookPage, styles.keepsakePage].join(" ")}>
      <PaperTexture textureId={textureId} />
      <img className={styles.pageFlowerGhost} src="/icons/rose.webp" alt="" draggable={false} />

      <div className={styles.keepsakeCopy}>
        <p className={styles.inkHeading}>{spread.right.heading}</p>
        <p>{spread.right.body}</p>
      </div>

      <div className={styles.keepsakeGrid}>
        {spread.right.assets.map((asset, index) => {
          const source = sourceMap.get(asset.id)
          const previewSrc =
            source?.poster ||
            (source?.mediaType === "image" ? source.src : "") ||
            "/icons/rose.webp"

          return (
            <Polaroid
              key={asset.id}
              photo={{
                src: previewSrc,
                alt: asset.alt,
                caption: asset.caption || "A memory preserved by BringBack.",
              }}
              rotation={index === 0 ? -5 : 4}
              compact
              onPhotoOpen={() => onAssetOpen(asset.id)}
            />
          )
        })}
      </div>
    </article>
  )
}

function splitCoverTitle(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean)

  if (words.length <= 3) {
    return words.length ? words : ["Our", "Family", "Heritage."]
  }

  const wordsPerLine = Math.ceil(words.length / 3)
  const lines: string[] = []

  for (let index = 0; index < words.length; index += wordsPerLine) {
    lines.push(words.slice(index, index + wordsPerLine).join(" "))
  }

  return lines
}

function MemoryLightbox({
  asset,
  source,
  open,
  onOpenChange,
}: {
  asset: MemoryBookAssetDocument | null
  source: MemoryBookAssetSource | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.memoryLightboxContent}>
        <DialogTitle className="sr-only">{asset?.alt || "Family memory"}</DialogTitle>
        <DialogDescription className="sr-only">
          Enlarged family memory
        </DialogDescription>

        <div className={styles.memoryLightboxMedia}>
          {source?.mediaType === "video" ? (
            <video
              src={source.src}
              poster={source.poster || undefined}
              controls
              autoPlay
              playsInline
            />
          ) : source ? (
            <img src={source.src} alt={asset?.alt || "Family memory"} />
          ) : null}
        </div>

        <div className={styles.memoryLightboxCaption}>
          <span>{asset?.caption || "A memory preserved by BringBack."}</span>
          {source?.downloadUrl ? (
            <a
              href={source.downloadUrl}
              className={styles.memoryLightboxDownload}
              data-memory-book-interactive="true"
            >
              <Download size={15} />
              Download
            </a>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
