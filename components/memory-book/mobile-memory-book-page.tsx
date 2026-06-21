"use client"

import { useId, type CSSProperties, type ReactNode } from "react"
import { CircleAlert, Loader2, Play } from "lucide-react"
import { BookCover } from "./book-cover"
import type { MemoryBookAssetSource } from "./family-heritage-viewer"
import {
  MemoryBookBackCoverPage,
  type MemoryBookStoryPageData,
} from "./memory-book-page"
import { PaperTexture } from "./paper-texture"
import styles from "./memory-book.module.css"

const SPIRAL_RINGS = Array.from({ length: 9 }, (_, index) => index)

export function MobileNotebookFrame({
  children,
  compact = false,
}: {
  children: ReactNode
  compact?: boolean
}) {
  return (
    <div
      className={[
        styles.mobileNotebook,
        compact ? styles.mobileNotebookCompact : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.mobileNotebookBase} aria-hidden="true" />
      <MobileSpiralRail />
      {children}
    </div>
  )
}

export function MobileNotebookSheet({
  variant,
  children,
  compact = false,
}: {
  variant: "cover" | "story" | "back-cover"
  children: ReactNode
  compact?: boolean
}) {
  return (
    <article
      className={[
        styles.mobileSheet,
        variant === "cover"
          ? styles.mobileCoverSheet
          : variant === "back-cover"
            ? styles.mobileBackCoverSheet
            : styles.mobileStorySheet,
        compact ? styles.mobileSheetCompact : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </article>
  )
}

export function MobileCoverSurface({
  titleLines,
  periodLines,
}: {
  titleLines: string[]
  periodLines: string[]
}) {
  return (
    <BookCover
      titleLines={titleLines}
      periodLines={periodLines}
      className={styles.mobileCoverContent}
    />
  )
}

export function MobileStorySurface({
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
    <div className={styles.mobileStoryContent}>
      <PaperTexture textureId={textureId} />
      <img
        className={styles.mobilePressedFlower}
        src="/icons/rose.webp"
        alt=""
        draggable={false}
      />
      <div className={styles.mobileStoryCopy}>
        <h2>{page.heading || "Untitled page"}</h2>
        <p>{page.body || "Your story will appear here."}</p>
      </div>

      <div className={styles.mobilePhotoGrid}>
        {page.assets.map((asset, index) => {
          const source = sourceMap.get(asset.id)
          const status = asset.status || source?.previewStatus || "ready"
          const previewSrc =
            source?.poster ||
            source?.thumbnail ||
            (status === "ready" && source?.mediaType === "image"
              ? source.src
              : "")
          const interactive = Boolean(onAssetOpen && previewSrc)

          return (
            <button
              type="button"
              className={styles.mobilePhoto}
              style={
                {
                  "--mobile-photo-rotate": index === 0 ? "-2.5deg" : "2.8deg",
                } as CSSProperties
              }
              key={asset.id}
              onClick={() => interactive && onAssetOpen?.(asset.id)}
              onPointerDown={(event) => event.stopPropagation()}
              data-memory-book-interactive="true"
              aria-label={interactive ? `Open ${asset.alt}` : asset.alt}
              disabled={!interactive}
            >
              <span className={styles.mobilePhotoTape} aria-hidden="true" />
              {previewSrc ? (
                <img src={previewSrc} alt={asset.alt} draggable={false} />
              ) : (
                <span className={styles.mobilePhotoPlaceholder}>
                  {status === "failed" ? (
                    <CircleAlert size={22} />
                  ) : (
                    <Loader2 className={styles.mobilePhotoSpinner} size={22} />
                  )}
                </span>
              )}
              {asset.mediaType === "video" && previewSrc ? (
                <span className={styles.mobileVideoBadge} aria-hidden="true">
                  <Play size={16} fill="currentColor" />
                </span>
              ) : null}
              {asset.caption ? (
                <span className={styles.mobilePhotoCaption}>{asset.caption}</span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function MobileBackCoverSurface({ message }: { message: string }) {
  return (
    <MemoryBookBackCoverPage
      message={message}
      className={styles.mobileBackCoverContent}
    />
  )
}

function MobileSpiralRail() {
  const instanceId = useId().replace(/:/g, "")

  return (
    <div className={styles.mobileSpiralRail} aria-hidden="true">
      {SPIRAL_RINGS.map((ring) => {
        const gradientId = `wire-metal-${instanceId}-${ring}`
        const filterId = `wire-shadow-${instanceId}-${ring}`
        return (
          <span className={styles.mobileSpiralRing} key={ring}>
            <svg
              width="24"
              height="48"
              viewBox="0 0 24 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4a4641" />
                  <stop offset="25%" stopColor="#a8a39d" />
                  <stop offset="45%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#807b75" />
                  <stop offset="100%" stopColor="#3c3834" />
                </linearGradient>
                <filter
                  id={filterId}
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.15 0 0 0 0 0.12 0 0 0 0 0.09 0 0 0 0.35 0"
                  />
                </filter>
              </defs>
              <path
                d="M 11,20 C 11,4 17,4 17,39.5"
                fill="none"
                stroke="black"
                strokeWidth="3.2"
                filter={`url(#${filterId})`}
              />
              <path
                d="M 9,20 C 9,2 15,2 15,39.5"
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )
      })}
    </div>
  )
}
