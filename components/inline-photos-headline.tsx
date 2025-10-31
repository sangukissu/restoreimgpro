"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface InlinePhotosHeadlineProps {
  beforeText: string
  imageUrl1: string
  betweenText: string
  accentWord: string
  imageUrl2: string
  afterText: string
}

export default function InlinePhotosHeadline({
  beforeText,
  imageUrl1,
  betweenText,
  accentWord,
  imageUrl2,
  afterText,
}: InlinePhotosHeadlineProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkSize()
    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  // Responsive image sizes
  const imageSize = isMobile ? 40 : isTablet ? 50 : 80

  return (
    <div className="w-full text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-gray-800 leading-tight md:leading-tight lg:leading-tight">
        <span className="inline-flex items-center justify-center flex-wrap gap-1 md:gap-2">
          <span>{beforeText}</span>

          {/* First inline image */}
          <span className="inline-block relative">
            <div className="relative inline-block">
              <Image
                src={imageUrl1 || "/placeholder.svg"}
                alt="Photo 1"
                width={imageSize}
                height={imageSize}
                className="rounded-lg shadow-lg object-cover"
                style={{
                  transform: "rotate(-3deg)",
                  transition: "transform 0.3s ease-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "rotate(-3deg) scale(1.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotate(-3deg)"
                }}
              />
              <div
                className="absolute inset-0 rounded-lg border-2 border-white/50 shadow-md pointer-events-none"
                style={{ transform: "rotate(-3deg)" }}
              />
            </div>
          </span>

          <span>{betweenText}</span>
        </span>

        {/* Force line break and continue with accent word */}
        <span className="block">
          {accentWord && <span className="italic">{accentWord} </span>}

          {/* Second inline image */}
          <span className="inline-block relative mx-1 md:mx-2 mb-1 md:mb-2">
            <div className="relative inline-block">
              <Image
                src={imageUrl2 || "/placeholder.svg"}
                alt="Photo 2"
                width={imageSize}
                height={imageSize}
                className="rounded-lg shadow-lg object-cover"
                style={{
                  transform: "rotate(2deg)",
                  transition: "transform 0.3s ease-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "rotate(2deg) scale(1.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotate(2deg)"
                }}
              />
              <div
                className="absolute inset-0 rounded-lg border-2 border-white/50 shadow-md pointer-events-none"
                style={{ transform: "rotate(2deg)" }}
              />
            </div>
          </span>

          <span>{afterText}</span>
        </span>
      </h1>


    </div>
  )
}
