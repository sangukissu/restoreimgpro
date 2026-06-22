"use client"

import type { MemoryBookAssetSource } from "./family-heritage-viewer"
import { BookCover } from "./book-cover"
import { PaperTexture } from "./paper-texture"
import { Polaroid } from "./polaroid"
import styles from "./memory-book.module.css"

export interface MemoryBookPageAsset {
  id: string
  mediaType: "image" | "video"
  caption: string
  alt: string
  status?: "queued" | "processing" | "ready" | "failed"
}

export interface MemoryBookStoryPageData {
  id: string
  heading: string
  body: string
  assets: MemoryBookPageAsset[]
}

export function MemoryBookCoverPage({
  title,
  periodLabel,
}: {
  title: string
  periodLabel: string
}) {
  return (
    <BookCover
      titleLines={splitCoverTitle(title)}
      periodLines={periodLabel.trim() ? [periodLabel.trim()] : []}
    />
  )
}

export function MemoryBookStoryPage({
  page,
  sourceMap,
  textureId,
  onAssetOpen,
}: {
  page: MemoryBookStoryPageData
  sourceMap: Map<string, MemoryBookAssetSource>
  textureId: string
  onAssetOpen?: (assetId: string) => void
}) {
  return (
    <article className={[styles.innerPage, styles.scrapbookPage, styles.keepsakePage].join(" ")}>
      <PaperTexture textureId={textureId} />
      <img className={styles.pageFlowerGhost} src="/icons/rose.webp" alt="" draggable={false} />

      <div className={styles.keepsakeCopy}>
        <p className={styles.inkHeading}>{page.heading || "Untitled page"}</p>
        <p>{page.body || "Your story will appear here."}</p>
      </div>

      <div className={styles.keepsakeGrid}>
        {page.assets.map((asset, index) => {
          const source = sourceMap.get(asset.id)
          const previewSrc =
            source?.poster ||
            source?.thumbnail ||
            (source?.mediaType === "image" ? source.src : "")
          const photo = {
            src: previewSrc,
            alt: asset.alt,
            caption: asset.caption || "A memory preserved by BringBack.",
          }

          return (
            <Polaroid
              key={asset.id}
              photo={photo}
              rotation={index === 0 ? -5 : 4}
              compact
              mediaType={asset.mediaType}
              status={asset.status || source?.previewStatus || "ready"}
              onPhotoOpen={onAssetOpen ? () => onAssetOpen(asset.id) : undefined}
            />
          )
        })}
      </div>
    </article>
  )
}

export function MemoryBookBackCoverPage({
  message,
  className = "",
}: {
  message: string
  className?: string
}) {
  const resolvedMessage =
    message.trim() || "A final note can live here on the back cover of your book."
  const messageSizeClass =
    resolvedMessage.length > 480
      ? styles.backCoverMessageVeryLong
      : resolvedMessage.length > 320
        ? styles.backCoverMessageLong
        : ""

  return (
    <article
      className={[styles.bookCover, styles.backCover, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.coverWeave} aria-hidden="true" />
      <div className={styles.backCoverVines} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div
        className={[styles.backCoverMessage, messageSizeClass]
          .filter(Boolean)
          .join(" ")}
      >
        <p className={styles.backCoverKicker}>With love, always</p>
        <p>{resolvedMessage}</p>
        <span className={styles.backCoverRule} aria-hidden="true" />
      </div>
      <div className={styles.backCoverBloom} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </article>
  )
}

export function MemoryBookStaticPage({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={[styles.composerExactPreview, className].filter(Boolean).join(" ")}>
      <div className={styles.composerExactPage}>{children}</div>
    </div>
  )
}

export function splitCoverTitle(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 3) return words.length ? words : ["Our", "Family", "Heritage."]

  const wordsPerLine = Math.ceil(words.length / 3)
  const lines: string[] = []
  for (let index = 0; index < words.length; index += wordsPerLine) {
    lines.push(words.slice(index, index + wordsPerLine).join(" "))
  }
  return lines
}