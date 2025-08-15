"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageSwiperProps {
  images: string
  cardWidth?: number
  cardHeight?: number
  className?: string
}

export function ImageSwiper({ 
  images, 
  cardWidth = 360, 
  cardHeight = 420, 
  className 
}: ImageSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const imageArray = images.split(',')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [imageArray.length])

  return (
    <div 
      className={cn("relative overflow-hidden rounded-lg shadow-lg", className)}
      style={{ width: cardWidth, height: cardHeight }}
    >
      {imageArray.map((imageUrl, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-transform duration-500 ease-in-out",
            index === currentIndex ? "translate-x-0" : 
            index < currentIndex ? "-translate-x-full" : "translate-x-full"
          )}
        >
          <Image
            src={imageUrl.trim()}
            alt={`Restored photo ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 360px"
          />
        </div>
      ))}
      
      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {imageArray.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors duration-200",
              index === currentIndex ? "bg-white" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  )
}