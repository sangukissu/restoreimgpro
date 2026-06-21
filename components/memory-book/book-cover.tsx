import styles from "./memory-book.module.css"

interface BookCoverProps {
  titleLines?: string[]
  periodLines?: string[]
}

export function BookCover({
  titleLines = ["An", "Anniversary", "Special."],
  periodLines = ["3 Years,", "1,095 Days"],
}: BookCoverProps) {
  return (
    <article className={styles.bookCover}>
      <div className={styles.coverWeave} aria-hidden="true" />
      <img
        className={styles.coverCornerFlower}
        src="/icons/daisy.webp"
        alt=""
        draggable={false}
        aria-hidden="true"
      />

      <div className={styles.coverTitle}>
        {titleLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>

      {periodLines && periodLines.length > 0 && (
        <div className={styles.coverBadge}>
          <svg viewBox="0 0 118 62" aria-hidden="true">
            <path d="M9 33C7 15 35 6 64 9c30 3 47 17 44 31-3 15-24 17-49 16C29 55 10 48 9 33Z" />
            <path d="M15 29C20 12 47 8 73 13c24 5 38 18 31 31-8 14-39 13-61 9-20-3-31-11-28-24Z" />
          </svg>
          {periodLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      )}
    </article>
  )
}