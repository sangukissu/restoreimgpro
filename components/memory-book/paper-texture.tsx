import styles from "./memory-book.module.css"

interface PaperTextureProps {
  textureId: string
}

export function PaperTexture({ textureId }: PaperTextureProps) {
  const gradientId = `paperCanvas-${textureId}`
  const filterId = `embossedPaper-${textureId}`
  const patternId = `organicFibers-${textureId}`

  return (
    <svg
      className={styles.paperNoise}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#fefcf7" />
          <stop offset="70%" stopColor="#f6f0e2" />
          <stop offset="100%" stopColor="#e6dbbe" />
        </radialGradient>

        <filter id={filterId} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#ffffff" surfaceScale="1.2" result="light">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
          <feBlend mode="multiply" in="SourceGraphic" in2="light" result="blend" />
        </filter>

        <pattern id={patternId} width="300" height="300" patternUnits="userSpaceOnUse">
          <g fill="none" opacity="0.35">
            <path d="M20,40 Q35,35 40,55" stroke="#635243" strokeWidth="0.4" />
            <path d="M150,20 Q140,45 160,55" stroke="#7a6857" strokeWidth="0.3" />
            <path d="M80,120 Q65,135 85,150" stroke="#524336" strokeWidth="0.5" />
            <path d="M220,70 Q240,65 235,90" stroke="#635243" strokeWidth="0.4" />
            <path d="M270,180 Q255,200 280,210" stroke="#7a6857" strokeWidth="0.3" />
            <path d="M40,240 Q60,250 50,270" stroke="#524336" strokeWidth="0.4" />
            <path d="M130,220 Q115,200 125,180" stroke="#635243" strokeWidth="0.3" />
            <path d="M190,260 Q215,275 200,290" stroke="#7a6857" strokeWidth="0.5" />
            <path d="M90,45 C100,40 105,55 115,50" stroke="#635243" strokeWidth="0.3" />
            <path d="M200,140 C190,155 210,165 200,180" stroke="#524336" strokeWidth="0.4" />
            <path d="M250,20 C270,15 265,35 285,30" stroke="#7a6857" strokeWidth="0.3" />
            <path d="M110,100 C125,95 120,115 135,110" stroke="#635243" strokeWidth="0.4" />
            <path d="M60,80 Q70,95 85,90" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />
            <path d="M170,100 Q160,120 180,115" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
            <path d="M240,240 Q260,230 250,260" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />
            <path d="M100,160 Q90,180 110,195" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
          </g>

          <g fill="#423529" opacity="0.4">
            <circle cx="45" cy="110" r="0.4" />
            <circle cx="180" cy="45" r="0.6" />
            <circle cx="260" cy="135" r="0.3" />
            <circle cx="120" cy="270" r="0.5" />
            <circle cx="30" cy="210" r="0.4" />
            <circle cx="215" cy="225" r="0.6" />
          </g>
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      <rect className={styles.paperEmbossLayer} width="100%" height="100%" fill={`url(#${gradientId})`} filter={`url(#${filterId})`} />
    </svg>
  )
}
