import { PaperTexture } from "./paper-texture"
import styles from "./memory-book.module.css"

interface InnerPageProps {
  variant: "botanical" | "letter"
}

export function InnerPage({ variant }: InnerPageProps) {
  if (variant === "letter") {
    return (
      <article className={[styles.innerPage, styles.letterPage].join(" ")}>
        <PaperTexture textureId="letter-page" />
        <div className={styles.letterCopy}>
          <p className={styles.letterKicker}>A small note</p>
          <p>
            Some memories are quiet until a picture gives them a room again. This one kept its warmth,
            even when the edges started to fade.
          </p>
          <p>
            Keep the imperfect parts. They are where the day still breathes.
          </p>
        </div>
        <div className={styles.tinyPressedBloom} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </article>
    )
  }

  return (
    <article className={[styles.innerPage, styles.botanicalPage].join(" ")}>
      <PaperTexture textureId="botanical-page" />
      <img className={styles.absorbedDaisy} src="/icons/daisy.webp" alt="" draggable={false} />
    </article>
  )
}
