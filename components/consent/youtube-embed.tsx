"use client"

import React, { useState } from "react"
import { Play } from "lucide-react"

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  className?: string
  /** Autoplay only after the user clicks Load video */
  autoplay?: boolean
}

/**
 * Click-to-load YouTube facade (common SaaS pattern).
 * Thumbnail only until the visitor chooses to play — no separate cookie-banner category.
 */
export function YouTubeEmbed({
  videoId,
  title = "YouTube video",
  className = "",
  autoplay = true,
}: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false)

  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  const src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${
    autoplay ? "&autoplay=1" : ""
  }`

  if (!playing) {
    return (
      <div
        className={`relative w-full aspect-video overflow-hidden rounded-2xl bg-black ${className}`}
      >
        <img
          src={thumb}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35 p-4 text-center hover:bg-black/45 transition-colors"
          aria-label={`Play ${title}`}
        >
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-black shadow-lg">
            <Play size={22} fill="currentColor" className="ml-0.5" />
          </span>
          <span className="text-xs font-semibold text-white/95">Play video</span>
        </button>
      </div>
    )
  }

  return (
    <div className={`relative w-full aspect-video overflow-hidden rounded-2xl ${className}`}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
