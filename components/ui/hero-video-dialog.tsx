"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface HeroVideoDialogProps {
  className?: string
  animationStyle?: "from-center" | "top-in-bottom-out"
  videoSrc: string
  thumbnailSrc: string
  thumbnailAlt?: string
  /** Preload the thumbnail image for LCP-critical heroes */
  priority?: boolean
}

// Function to convert YouTube URL to embed format
function getYouTubeEmbedUrl(url: string): string {
  // Handle youtu.be format
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0]
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
  }
  
  // Handle youtube.com/watch format
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0]
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
  }
  
  // If already embed format, return as is
  if (url.includes('youtube.com/embed/')) {
    return url.includes('autoplay=1') ? url : `${url}?autoplay=1&rel=0&modestbranding=1`
  }
  
  return url
}

export function HeroVideoDialog({
  className,
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  priority = false
}: HeroVideoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const videoRef = useRef<HTMLIFrameElement>(null)
  const embedUrl = getYouTubeEmbedUrl(videoSrc)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    // Reset video when closing
    if (videoRef.current) {
      const iframe = videoRef.current
      const src = iframe.src
      iframe.src = ""
      iframe.src = src
    }
  }

  const getAnimationVariants = () => {
    if (animationStyle === "top-in-bottom-out") {
      return {
        initial: { y: "-100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0 }
      }
    }
    // from-center
    return {
      initial: { scale: 0.5, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.5, opacity: 0 }
    }
  }

  const variants = getAnimationVariants()

  if (!isClient) {
    return (
      <div className={cn("relative cursor-pointer group", className)}>
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={thumbnailSrc}
            alt={thumbnailAlt}
            width={1920}
            height={1080}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1080px"
            className="w-full h-auto"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors cursor-pointer">
            <div 
              className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full cursor-pointer"
              style={{
                background: 'radial-gradient(circle at center, rgba(120, 120, 120, 0.9) 0%, rgba(60, 60, 60, 0.8) 40%, rgba(20, 20, 20, 0.7) 100%)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <Play className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-white ml-1" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn("relative cursor-pointer group", className)}
        onClick={handleOpen}
        role="button"
        aria-label="Play video"
      >
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={thumbnailSrc}
            alt={thumbnailAlt}
            width={1920}
            height={1080}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1080px"
            className="w-full h-auto"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors cursor-pointer">
            <motion.div
              className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full cursor-pointer"
              style={{
                background: 'radial-gradient(circle at center, rgba(120, 120, 120, 0.9) 0%, rgba(60, 60, 60, 0.8) 40%, rgba(20, 20, 20, 0.7) 100%)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-white ml-1" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="relative w-full max-w-7xl aspect-video bg-black rounded-2xl overflow-hidden"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                aria-label="Close video"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <iframe
                ref={videoRef}
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="BringBack video demo"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default HeroVideoDialog