import styles from "./memory-book.module.css"

interface BookCoverProps {
  titleLines?: string[]
  periodLines?: string[]
}

export function BookCover({
  titleLines = ["An", "Anniversary", "Special."],
  periodLines = ["3 Years,", "1,095 Days"],
}: BookCoverProps) {
  const displayTitle = titleLines.at(-1) || "Heritage"
  const scriptTitle = titleLines.slice(0, -1).join(" ")

  return (
    <article className={styles.bookCover}>
      <div className={styles.coverWeave} aria-hidden="true" />
      <div className={styles.coverGoldFrame} aria-hidden="true" />
      <img
        className={styles.coverCornerFlower}
        src="/icons/daisy.webp"
        alt=""
        draggable={false}
        aria-hidden="true"
      />
      <img
        className={styles.coverCornerTree}
        src="/icons/cover-tree.webp"
        alt=""
        draggable={false}
        aria-hidden="true"
      />

      <div className={styles.coverTitle}>
        {scriptTitle ? (
          <span className={styles.coverTitleScript}>{scriptTitle}</span>
        ) : null}
        <span className={styles.coverTitleDisplay}>{displayTitle}</span>
        <span className={styles.coverTitleDivider} aria-hidden="true">
          <i />
        </span>
        {periodLines.length > 0 ? (
          <span className={styles.coverSubtitle}>
            {periodLines.map((line, index) => (
              <span key={`${line}-${index}`}>{line}</span>
            ))}
          </span>
        ) : null}
      </div>
    </article>
  )
}