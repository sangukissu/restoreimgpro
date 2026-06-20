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
          const previewSrc = source?.poster || source?.thumbnail || ""
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

export function MemoryBookClosingPage({
  message,
  textureId,
}: {
  message: string
  textureId: string
}) {
  return (
    <article className={[styles.innerPage, styles.letterPage, styles.closingPage].join(" ")}>
      <PaperTexture textureId={textureId} />
      <div className={styles.letterCopy}>
        <p className={styles.letterKicker}>A closing message</p>
        <p>{message || "A final note can live here after the last memory."}</p>
      </div>
      <div className={styles.tinyPressedBloom} aria-hidden="true">
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