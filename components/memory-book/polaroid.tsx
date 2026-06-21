import type { CSSProperties } from "react"
import { CircleAlert, Loader2, Play } from "lucide-react"
import type { MemoryPhoto } from "./photo-modal"
import styles from "./memory-book.module.css"

interface PolaroidProps {
  photo?: MemoryPhoto
  src?: string
  alt?: string
  rotation: number
  compact?: boolean
  mediaType?: "image" | "video"
  status?: "queued" | "processing" | "ready" | "failed"
  onPhotoOpen?: (photo: MemoryPhoto) => void
}

export function Polaroid({
  photo,
  src,
  alt,
  rotation,
  compact = false,
  mediaType = "image",
  status = "ready",
  onPhotoOpen,
}: PolaroidProps) {
  const imageSrc = photo?.src || src || ""
  const imageAlt = photo?.alt || alt || "Memory photo"
  const isInteractive = Boolean(photo && onPhotoOpen && status === "ready")
  const className = [
    styles.polaroid,
    compact ? styles.polaroidCompact : "",
    isInteractive ? styles.polaroidInteractive : "",
  ].join(" ")
  const style = { "--rotate": `${rotation}deg` } as CSSProperties
  const content = (
    <>
      <span className={[styles.tapeStrip, styles.tapeTopLeft].join(" ")} />
      <span className={[styles.tapeStrip, styles.tapeTopRight].join(" ")} />
      <span className={styles.polaroidMedia}>
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt} draggable={false} />
        ) : (
          <span className={styles.polaroidPlaceholder} aria-label="Preparing memory preview">
            {status === "failed" ? (
              <CircleAlert size={24} />
            ) : (
              <Loader2 size={24} className="animate-spin" />
            )}
          </span>
        )}
        {mediaType === "video" ? (
          <span className={styles.polaroidVideoBadge} aria-hidden="true">
            <Play size={15} fill="currentColor" />
          </span>
        ) : null}
      </span>
      {photo?.caption ? (
        <span className={styles.polaroidCaption}>{photo.caption}</span>
      ) : null}
    </>
  )

  if (photo && onPhotoOpen) {
    return (
      <button
        type="button"
        className={className}
        style={style}
        data-memory-book-interactive="true"
        onClick={(event) => {
          event.stopPropagation()
          if (isInteractive) onPhotoOpen(photo)
        }}
        disabled={!isInteractive}
        aria-label={`Open ${imageAlt}`}
      >
        {content}
      </button>
    )
  }

  return (
    <figure className={className} style={style}>
      {content}
    </figure>
  )
}