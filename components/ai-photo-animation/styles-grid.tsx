"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type StyleItem = {
  name: string
  description: string
  src: string
  photoSrc: string
}

const styles: StyleItem[] = [
  {
    name: "Gentle Smile",
    description:
      "The people in the image develop a warm, natural smile that appears gradually and holds for a moment",
    src: "/videos/gentle-smile.mp4",
    photoSrc: "/gentle-smile.webp",
  },
  {
    name: "Smile + Wave",
    description:
      "The person in the image smiles warmly and waves their hand in a friendly greeting gesture",
    src: "/videos/video-animation1.mp4",
    photoSrc: "/vintage-family-portraits-colorized.webp",
  },
    {
    name: "Subtle Blink + Head Tilt",
    description:
      "The person in the image blinks naturally and tilts their head slightly with a gentle expression",
    src: "/videos/head-tilt.mp4",
    photoSrc: "/head-tilt.webp",
  },
  {
    name: "Smile + Look Around",
    description:
      "The person in the image smiles and looks around curiously, moving their eyes and head naturally",
    src: "/videos/smile-and-look.mp4",
    photoSrc: "/look-around.webp",
  },
  {
    name: "Warm Gaze",
    description:
      "The people in the image maintain steady, warm eye contact with a loving, subtle smile and peaceful expression",
    src: "/videos/warm-gaze.mp4",
    photoSrc: "/torn-restored.webp",
  },
  {
    name: "Soft Nod",
    description:
      "The people in the image give a single, slow, gentle nod of acknowledgment with a peaceful expression",
    src: "/videos/gentle-node.mp4",
    photoSrc: "/after-noise-removal.webp",
  },

  {
    name: "Peaceful Presence",
    description:
      "The people in the image show very subtle, natural micro-movements that suggest life and presence without dramatic changes",
    src: "/videos/peaceful-presence.mp4",
    photoSrc: "/water-damage-restored.webp",
  },
  {
    name: "Loving Recognition",
    description:
      "The people in the image show a moment of gentle recognition, with eyes softening and a hint of a smile",
    src: "/videos/loving.mp4",
    photoSrc: "/historical-wedding-photo-colorized.webp",
  },
  {
    name: "Gentle Talking",
    description:
      "The people in the image maintain a calm, serene expression with minimal natural movement, as if caught in a peaceful moment",
    src: "/videos/speaking.mp4",
    photoSrc: "/fade-restored.webp",
  },
]

function AutoVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
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
      { rootMargin: "200px 0px", threshold: 0.1 }
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
    <div
      ref={containerRef}
      className="relative h-[280px] sm:h-[240px] w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-200 p-3"
    >
      <img
        src={poster}
        alt={`${alt} sample photo`}
        loading="lazy"
        className="absolute top-4 left-4 z-10 w-16 h-12 rounded-md border border-white object-cover"
      />
      <video
        ref={videoRef}
        src={activeSrc ?? undefined}
        poster={poster}
        loop
        muted
        playsInline
        preload="none"
        className="w-full h-full object-cover rounded-xl"
      />
    </div>
  )
}

export default function AnimationStylesGrid() {
  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-6">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Photo Animation
                    </div>
          <h2 className="text-4xl lg:text-5xl text-black mb-4 leading-tight">Explore Our Lifelike AI Animation Styles</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Each animation is carefully designed to be natural, realistic, and respectful, preserving the true character of the person in your photo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-3">
          {styles.map((style) => (
            <Card key={style.name} className="overflow-hidden border-6 border-gray-200 shadow-sm py-1 gap-0">
              <CardHeader className="p-3">
                <CardTitle className="text-xl text-black">{style.name}</CardTitle>
                <CardDescription className="text-gray-700">{style.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-3">
                <AutoVideo src={style.src} poster={style.photoSrc} alt={style.name} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}