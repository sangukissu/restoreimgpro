'use client'

import React from 'react'

interface CustomVideoPlayerProps {
  url: string
  poster?: string
  className?: string
}

export default function CustomVideoPlayer({ url, poster, className = '' }: CustomVideoPlayerProps) {
  return (
    <div className={`relative bg-black rounded-2xl overflow-hidden ${className}`}>
      <div className="relative aspect-square">
        <video
          src={url}
          poster={poster}
          className="w-full h-full object-cover"
          controls
          playsInline
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}