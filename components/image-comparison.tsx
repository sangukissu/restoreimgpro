"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { SparklesCore } from "@/components/ui/sparkles"
import { AnimatePresence, motion } from "framer-motion"
import { IconDotsVertical } from "@tabler/icons-react"

interface ImageComparisonProps {
  originalUrl: string
  restoredUrl: string
  onStartOver: () => void
}

export default function ImageComparison({ originalUrl, restoredUrl, onStartOver }: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Performance optimization refs
  const rafRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)

  // Throttle slider updates to improve performance
  const updateSliderPosition = useCallback((percentage: number) => {
    const now = Date.now()
    if (now - lastUpdateRef.current < 16) return // ~60fps max
    
    lastUpdateRef.current = now
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    
    rafRef.current = requestAnimationFrame(() => {
      setSliderPosition(Math.max(0, Math.min(100, percentage)))
    })
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    updateSliderPosition(percentage)
  }, [isDragging, updateSliderPosition])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    updateSliderPosition(percentage)
  }, [isDragging, updateSliderPosition])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const handleDownload = async () => {
    try {
      const response = await fetch(restoredUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `restored-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading image:", error)
      alert("Failed to download image")
    }
  }

  // Memoize the clip path to prevent unnecessary recalculations
  const clipPathStyle = useMemo(() => ({
    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
  }), [sliderPosition])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h3 className="font-medium text-xl text-gray-900 mb-1">Restoration Complete</h3>
            <p className="text-gray-500 text-sm">Drag the slider to compare before and after</p>
          </div>

          {/* Image Comparison Container */}
          <div className="flex justify-center">
            <div
              ref={containerRef}
              className="relative max-w-full max-h-[600px] rounded-lg overflow-hidden cursor-col-resize select-none border-4 border-gray-200 shadow-sm"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{ touchAction: "none" }} // Prevent default touch behaviors
            >
              {/* Restored Image (Background) */}
              <img
                src={restoredUrl || "/placeholder.svg"}
                alt="Restored image"
                className="block max-w-full max-h-[600px] w-auto h-auto object-contain"
                draggable={false}
                loading="lazy"
              />

              {/* Original Image (Clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={clipPathStyle}
              >
                <img
                  src={originalUrl || "/placeholder.svg"}
                  alt="Original image"
                  className="w-full h-full object-contain"
                  draggable={false}
                  loading="lazy"
                />
              </div>

              <AnimatePresence initial={false}>
                <motion.div
                  className="h-full w-px absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent from-[5%] to-[95%] via-indigo-500 to-transparent"
                  style={{
                    left: `${sliderPosition}%`,
                    top: "0",
                    zIndex: 40,
                  }}
                  transition={{ duration: 0 }}
                >
                  <div className="w-36 h-full [mask-image:radial-gradient(100px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-indigo-400 via-transparent to-transparent z-20 opacity-50" />
                  <div className="w-10 h-1/2 [mask-image:radial-gradient(50px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-cyan-400 via-transparent to-transparent z-10 opacity-100" />
                  <div className="w-10 h-3/4 top-1/2 -translate-y-1/2 absolute -right-10 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
                    <SparklesCore
                      background="transparent"
                      minSize={0.4}
                      maxSize={1}
                      particleDensity={600} // Reduced for mobile performance
                      className="w-full h-full"
                      particleColor="#FFFFFF"
                    />
                  </div>
                  <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-white z-30 -right-2.5 absolute flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
                    <IconDotsVertical className="h-4 w-4 text-black" />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Labels */}
              <div className="absolute top-3 left-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                Original
              </div>
              <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                Restored
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <Button
              onClick={handleDownload}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2 min-w-[140px] justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download
            </Button>

            <Button
              onClick={onStartOver}
              variant="outline"
              className="border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2 min-w-[140px] justify-center bg-transparent"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Restore Another
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}