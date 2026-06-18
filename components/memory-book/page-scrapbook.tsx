import { PaperTexture } from "./paper-texture"
import { Polaroid } from "./polaroid"
import type { MemoryPhoto } from "./photo-modal"
import styles from "./memory-book.module.css"

interface PageScrapbookProps {
  variant: "anniversary" | "keepsake"
  onPhotoOpen?: (photo: MemoryPhoto) => void
}

interface ScrapbookPhoto {
  photo: MemoryPhoto
  rotation: number
  compact?: boolean
}

const scrapbookPhotos: Record<PageScrapbookProps["variant"], ScrapbookPhoto[]> = {
  anniversary: [
    {
      photo: {
        src: "/family-photo2.jpg",
        alt: "Vintage family moment",
        caption: "A small scene with the warmth of an old print.",
      },
      rotation: -4,
    },
    {
      photo: {
        src: "/grandma.png",
        alt: "Restored portrait memory",
        caption: "A face held gently by paper, light, and memory.",
      },
      rotation: 5,
    },
  ],
  keepsake: [
    {
      photo: {
        src: "/old-image1.webp",
        alt: "Restored old portrait",
        caption: "A quiet portrait, softened by time and brought back into focus.",
      },
      rotation: -5,
      compact: true,
    },
    {
      photo: {
        src: "/family-photo3.png",
        alt: "Family memory",
        caption: "The kind of frame that keeps a whole afternoon inside it.",
      },
      rotation: 4,
      compact: true,
    },
  ],
}

export function PageScrapbook({ variant, onPhotoOpen }: PageScrapbookProps) {
  const photos = scrapbookPhotos[variant]

  if (variant === "keepsake") {
    return (
      <article className={[styles.innerPage, styles.scrapbookPage, styles.keepsakePage].join(" ")}>
        <PaperTexture textureId="keepsake-page" />
        <img className={styles.pageFlowerGhost} src="/icons/rose.webp" alt="" draggable={false} />

        <div className={styles.keepsakeCopy}>
          <p className={styles.inkHeading}>The tiny archive</p>
          <p>
            Pressed petals, borrowed light, and a few photographs that decided to stay.
          </p>
        </div>

        <div className={styles.keepsakeGrid}>
          {photos.map(({ photo, rotation, compact }) => (
            <Polaroid
              key={photo.src}
              photo={photo}
              rotation={rotation}
              compact={compact}
              onPhotoOpen={onPhotoOpen}
            />
          ))}
        </div>
      </article>
    )
  }

  return (
    <article className={[styles.innerPage, styles.scrapbookPage].join(" ")}>
      <PaperTexture textureId="anniversary-page" />
      <img className={styles.pageFlowerGhost} src="/icons/rose.webp" alt="" draggable={false} />

      <div className={styles.dateBadge}>
        <svg viewBox="0 0 118 82" aria-hidden="true">
          <path d="M14 39C12 18 43 8 71 12c25 4 38 19 33 36-5 18-30 25-58 18-20-5-31-15-32-27Z" />
          <path d="M19 36C25 19 54 12 80 18c22 5 30 20 21 34-9 13-38 16-59 9-17-5-27-14-23-25Z" />
        </svg>
        <span>15th</span>
        <span>April</span>
        <span>2023</span>
      </div>

      <div className={styles.inkCopy}>
        <p>
          It started with words <strong>"Happy Birthday Bambii!"</strong> It was your special day, but
          looking back, I am the one who got the ultimate gift. You replied, the plot kicked off, and we
          never looked back.
        </p>
      </div>

      <div className={styles.scrapPhotoStack}>
        {photos.map(({ photo, rotation, compact }) => (
          <Polaroid
            key={photo.src}
            photo={photo}
            rotation={rotation}
            compact={compact}
            onPhotoOpen={onPhotoOpen}
          />
        ))}
      </div>
    </article>
  )
}
