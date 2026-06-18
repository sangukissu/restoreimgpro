import type { CSSProperties } from "react"
import type { MemoryPhoto } from "./photo-modal"
import styles from "./memory-book.module.css"

interface PolaroidProps {
  photo?: MemoryPhoto
  src?: string
  alt?: string
  rotation: number
  compact?: boolean
  onPhotoOpen?: (photo: MemoryPhoto) => void
}

export function Polaroid({ photo, src, alt, rotation, compact = false, onPhotoOpen }: PolaroidProps) {
  const imageSrc = photo?.src || src || ""
  const imageAlt = photo?.alt || alt || "Memory photo"
  const isInteractive = Boolean(photo && onPhotoOpen)
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
      <img src={imageSrc} alt={imageAlt} draggable={false} />
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
          onPhotoOpen(photo)
        }}
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
