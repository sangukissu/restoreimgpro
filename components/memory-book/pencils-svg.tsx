interface PencilsSvgProps {
  className?: string
}

export function PencilsSvg({ className = "" }: PencilsSvgProps) {
  return (
    <svg className={className} viewBox="0 0 50 200" aria-hidden="true">
      <g transform="translate(10, 10) rotate(-4)">
        <rect x="0" y="0" width="8" height="150" fill="#db2777" rx="1" />
        <polygon points="0,0 4,-12 8,0" fill="#edd6bf" />
        <polygon points="3,-9 4,-12 5,-9" fill="#9d174d" />
        <rect x="6" y="0" width="2" height="150" fill="black" opacity="0.1" />
        <rect x="0" y="142" width="8" height="8" fill="#d1d5db" />
        <rect x="0" y="146" width="8" height="4" fill="#f43f5e" />
      </g>
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="8" height="145" fill="#eab308" rx="1" />
        <polygon points="0,0 4,-12 8,0" fill="#edd6bf" />
        <polygon points="3,-9 4,-12 5,-9" fill="#a16207" />
        <rect x="6" y="0" width="2" height="145" fill="black" opacity="0.1" />
        <rect x="0" y="137" width="8" height="8" fill="#d1d5db" />
        <rect x="0" y="141" width="8" height="4" fill="#f43f5e" />
      </g>
      <g transform="translate(30, 15) rotate(6)">
        <rect x="0" y="0" width="8" height="140" fill="#ea580c" rx="1" />
        <polygon points="0,0 4,-12 8,0" fill="#edd6bf" />
        <polygon points="3,-9 4,-12 5,-9" fill="#9a3412" />
        <rect x="6" y="0" width="2" height="140" fill="black" opacity="0.1" />
        <rect x="0" y="132" width="8" height="8" fill="#d1d5db" />
        <rect x="0" y="136" width="8" height="4" fill="#f43f5e" />
      </g>
    </svg>
  )
}
