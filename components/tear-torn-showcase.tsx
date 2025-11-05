// components/tear-torn-showcase.tsx
"use client";

import React, { useRef } from "react";

export default function TearTornShowcase() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = () => {
    // Optional: GA event
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore
      window.gtag("event", "video_play", {
        feature: "torn_restoration",
        location: "homepage",
      });
    }
  };

  return (
    <section className="px-4 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 mb-4">
            New • Extreme Damage Restoration
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-black">
            Torn & Teared Photos — Fully Restored with AI
          </h2>
          <p className="max-w-3xl mx-auto mt-3 text-gray-600 leading-relaxed">
            Even when a photo is split into multiple pieces, BringBack reconstructs the missing areas,
            preserves faces, and delivers a final, share‑ready image. Watch the full process below.
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-black">
          <video
            ref={videoRef}
            className="w-full h-auto"
            src="/videos/tear-torn-restoration.mp4"
            controls
            preload="metadata"
            playsInline
            onPlay={handlePlay}
            poster="/video-thumbnail.webp"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/restore"
            className="inline-flex items-center justify-center rounded-md bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-900 transition"
          >
            Restore a Torn Photo Now
          </a>
          <a
            href="/examples"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
          >
            See More Real Examples
          </a>
        </div>
      </div>
    </section>
  );
}