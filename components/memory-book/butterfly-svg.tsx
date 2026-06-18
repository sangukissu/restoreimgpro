import styles from "./memory-book.module.css"

interface ButterflySvgProps {
  className?: string
}

export function ButterflySvg({ className = "" }: ButterflySvgProps) {
  return (
    <svg className={[styles.butterflySvg, className].join(" ")} viewBox="0 0 220 170" aria-hidden="true">
      <g className={styles.leftWing}>
        <path d="M104 86C67 18 20 18 13 58c-6 36 28 62 85 52 11-2 14-10 6-24Z" />
        <path d="M99 89C70 51 43 43 26 56" />
        <path d="M92 107C58 103 35 88 23 66" />
      </g>
      <g className={styles.rightWing}>
        <path d="M116 86c37-68 84-68 91-28 6 36-28 62-85 52-11-2-14-10-6-24Z" />
        <path d="M121 89c29-38 56-46 73-33" />
        <path d="M128 107c34-4 57-19 69-41" />
      </g>
      <path className={styles.butterflyBody} d="M108 75c-7 13-7 35 1 49 2 4 8 4 10 0 8-14 8-36 1-49-3-5-9-5-12 0Z" />
      <path className={styles.butterflyAntenna} d="M111 76C99 57 87 49 74 50M117 76c12-19 24-27 37-26" />
    </svg>
  )
}
