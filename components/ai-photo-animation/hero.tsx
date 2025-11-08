"use client"

import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"
import { FramerButton } from "@/components/ui/framer-button"
import { useEffect, useRef, useState } from "react"

function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string
  poster: string
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeSrc, setActiveSrc] = useState<string | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setInView(entry.isIntersecting)
      },
      { rootMargin: "300px 0px", threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (inView) {
      if (!activeSrc) setActiveSrc(src)
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [inView, src, activeSrc])

  return (
    <div ref={containerRef} className={className}>
      <video
        ref={videoRef}
        src={activeSrc ?? undefined}
        poster={poster}
        loop
        muted
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
    </div>
  )
}

export default function AIAnimationHero() {
  return (
    <section className="relative pb-12 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-60 pointer-events-none z-0" />
      <div className="px-4 pt-28 pb-12 max-w-6xl mx-auto text-center">
        <div className="relative z-10 space-y-6">
          <div className="shadow-xl shadow-zinc-500/10 text-black inline-flex items-center px-3 py-1 rounded-full bg-white/50 text-xs font-medium mb-4 backdrop-blur-lg">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Photo Animation
          </div>
          <h1 className="max-w-4xl mx-auto text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-black">
            Turn Your family photos into Respectful Animations
          </h1>
          <p className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto leading-tight">
            Go beyond a still picture. Watch your loved ones smile, nod, and gaze back at you.
            Turn any photo into a beautiful, living memory with our respectful and realistic AI animation.
          </p>
          <div className="flex justify-center">
            <Link href="/dashboard/animate">
              <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden w-full sm:w-auto">
                Animate a Photo Now
              </FramerButton>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border-6 border-gray-200 overflow-hidden ">
          <HeroVideo
            src="/videos/blink-tilt-animation.mp4"
            poster="/video-thumbnail.webp"
            className="aspect-[16/9] w-full"
          />
        </div>
      </div>
    </section>
  )
}