"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { SparklesCore } from "@/components/ui/sparkles"
import { AnimatePresence, motion } from "framer-motion"
import { IconDotsVertical } from "@tabler/icons-react"

interface EnhancedImageComparisonProps {
  restoredUrl: string
  enhancedUrl: string
  onStartOver: () => void
  onDownload?: (enhancedUrl: string) => void
}

export default function EnhancedImageComparison({ restoredUrl, enhancedUrl, onStartOver, onDownload }: EnhancedImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const rafRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)

  const updateSliderPosition = useCallback((percentage: number) => {
    const now = Date.now()
    if (now - lastUpdateRef.current < 16) return
    lastUpdateRef.current = now
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
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

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleDownload = async () => {
    if (onDownload) {
      onDownload(enhancedUrl)
      return
    }
    try {
      const response = await fetch(enhancedUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `enhanced-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading image:", error)
      alert("Failed to download enhanced image")
    }
  }

  const handleGenerateVideo = () => {
    sessionStorage.setItem("preloadedImageUrl", enhancedUrl)
    window.location.href = "/dashboard/animate"
  }

  const clipPathStyle = useMemo(() => ({
    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
  }), [sliderPosition])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6">
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="font-medium text-xl text-gray-900 mb-1">Enhancement Complete</h3>
            <p className="text-gray-500 text-sm">Drag the slider to compare restored vs enhanced</p>
          </div>

          <div className="flex justify-center">
            <div
              ref={containerRef}
              className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden cursor-col-resize select-none border-4 border-gray-200 shadow-sm"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{ touchAction: "none" }}
            >
              {/* Enhanced Image (Background) */}
              <img
                src={enhancedUrl || "/placeholder.svg"}
                alt="Enhanced image"
                className="w-full h-full object-contain"
                draggable={false}
                loading="lazy"
              />

              {/* Restored Image (Clipped Overlay) */}
              <div className="absolute inset-0 overflow-hidden" style={clipPathStyle}>
                <img
                  src={restoredUrl || "/placeholder.svg"}
                  alt="Restored image"
                  className="w-full h-full object-contain"
                  draggable={false}
                  loading="lazy"
                />
              </div>

              <AnimatePresence initial={false}>
                <motion.div
                  className="h-full w-px absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent from-[5%] to-[95%] via-indigo-500 to-transparent"
                  style={{ left: `${sliderPosition}%`, top: "0", zIndex: 40 }}
                  transition={{ duration: 0 }}
                >
                  <div className="w-36 h-full [mask-image:radial-gradient(100px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-indigo-400 via-transparent to-transparent z-20 opacity-50" />
                  <div className="w-10 h-1/2 [mask-image:radial-gradient(50px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-cyan-400 via-transparent to-transparent z-10 opacity-100" />
                  <div className="w-10 h-3/4 top-1/2 -translate-y-1/2 absolute -right-10 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
                    <SparklesCore background="transparent" minSize={0.4} maxSize={1} particleDensity={600} className="w-full h-full" particleColor="#FFFFFF" />
                  </div>
                  <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-white z-30 -right-2.5 absolute flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
                    <IconDotsVertical className="h-4 w-4 text-black" />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Labels */}
              <div className="absolute top-3 left-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">Restored</div>
              <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">Enhanced</div>
            </div>
          </div>

          <div className="text-center mt-6 mb-4">
            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mx-auto">
              Your photo has been enhanced. Sharpened details, improved clarity, and natural face upscaling were applied.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <Button onClick={handleDownload} className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2 min-w-[140px] justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Enhanced
            </Button>

            <Button onClick={handleGenerateVideo} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2 min-w-[140px] justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.26a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Generate Video
            </Button>

            <Button onClick={onStartOver} variant="outline" className="px-4 py-2 text-sm font-medium rounded-md min-w-[140px] justify-center">
              Restore Another
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}