import styles from "./memory-book.module.css"

interface BotanicalSvgProps {
  className?: string
}

const smallPetalAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
const largePetalAngles = [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345]

function SmallDaisy({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      {smallPetalAngles.map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="22"
          rx="6"
          ry="18"
          fill="#fcfaf2"
          stroke="#e5dfd3"
          strokeWidth="0.5"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
      <circle cx="-2" cy="-2" r="3" fill="#fef3c7" opacity="0.6" />
    </g>
  )
}

function LargeDaisy() {
  return (
    <g transform="translate(75, 80)">
      {largePetalAngles.map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="24"
          rx="7"
          ry="20"
          fill="#ffffff"
          stroke="#ece6d9"
          strokeWidth="0.5"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="12" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
      <circle cx="-3" cy="-3" r="3.5" fill="#fef9c3" opacity="0.6" />
    </g>
  )
}

export function BotanicalSvg({ className = "" }: BotanicalSvgProps) {
  return (
    <svg className={[styles.botanicalSvg, className].join(" ")} viewBox="0 0 150 250" aria-hidden="true">
      <path d="M55,170 Q75,175 95,170" fill="none" stroke="#a18262" strokeWidth="2.5" />
      <path d="M75,172 C65,155 45,155 55,172 C45,188 65,188 75,172 Z" fill="none" stroke="#a18262" strokeWidth="2" />
      <path d="M75,172 C85,155 105,155 95,172 C105,188 85,188 75,172 Z" fill="none" stroke="#a18262" strokeWidth="2" />
      <path
        d="M75,172 Q60,205 50,225 M75,172 Q90,205 100,225"
        fill="none"
        stroke="#a18262"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M40,110 Q65,150 75,172" fill="none" stroke="#718355" strokeWidth="2" />
      <path d="M75,90 Q75,140 75,172" fill="none" stroke="#718355" strokeWidth="2.5" />
      <path d="M110,110 Q85,150 75,172" fill="none" stroke="#718355" strokeWidth="2" />
      <path d="M45,140 Q30,135 38,125 Q50,132 45,140" fill="#87986a" />
      <path d="M100,145 Q115,140 108,130 Q96,137 100,145" fill="#87986a" />
      <SmallDaisy transform="translate(40, 100) scale(0.8)" />
      <LargeDaisy />
      <SmallDaisy transform="translate(110, 100) scale(0.85)" />
    </svg>
  )
}
