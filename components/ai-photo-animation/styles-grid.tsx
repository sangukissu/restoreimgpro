"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type StyleItem = {
  name: string;
  description: string;
  src: string;
  photoSrc: string;
};

const styles: StyleItem[] = [
  {
    name: "Gentle Smile",
    description: "A warm, natural smile that appears gradually and holds for a moment.",
    src: "/videos/gentle-smile.mp4",
    photoSrc: "/gentle-smile.webp",
  },
  {
    name: "Smile + Wave",
    description: "Smiles warmly and waves their hand in a friendly greeting gesture.",
    src: "/videos/video-animation1.mp4",
    photoSrc: "/vintage-family-portraits-colorized.webp",
  },
  {
    name: "Subtle Blink + Head Tilt",
    description: "Blinks naturally and tilts their head slightly with a gentle expression.",
    src: "/videos/head-tilt.mp4",
    photoSrc: "/head-tilt.webp",
  },
  {
    name: "Smile + Look Around",
    description: "Smiles and looks around curiously, moving their eyes and head naturally.",
    src: "/videos/smile-and-look.mp4",
    photoSrc: "/look-around.webp",
  },
  {
    name: "Warm Gaze",
    description: "Maintains steady, warm eye contact with a loving, subtle smile.",
    src: "/videos/warm-gaze.mp4",
    photoSrc: "/torn-restored.webp",
  },
  {
    name: "Soft Nod",
    description: "Gives a single, slow, gentle nod of acknowledgment with a peaceful expression.",
    src: "/videos/gentle-node.mp4",
    photoSrc: "/after-noise-removal.webp",
  },
  {
    name: "Peaceful Presence",
    description: "Subtle, natural micro-movements that suggest life and presence.",
    src: "/videos/peaceful-presence.mp4",
    photoSrc: "/water-damage-restored.webp",
  },
  {
    name: "Loving Recognition",
    description: "A moment of gentle recognition, with eyes softening and a hint of a smile.",
    src: "/videos/loving.mp4",
    photoSrc: "/historical-wedding-photo-colorized.webp",
  },
  {
    name: "Gentle Talking",
    description: "Calm, serene expression with minimal natural movement, as if speaking softly.",
    src: "/videos/speaking.mp4",
    photoSrc: "/fade-restored.webp",
  },
];

function AutoVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.isIntersecting);
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      if (!activeSrc) setActiveSrc(src);
      v.play().catch(() => { });
    } else {
      v.pause();
    }
  }, [inView, src, activeSrc]);

  return (
    <div
      ref={containerRef}
      className="relative h-[240px] w-full overflow-hidden rounded-2xl bg-gray-100 group-hover:scale-[1.02] transition-transform duration-500"
    >
      <video
        ref={videoRef}
        src={activeSrc ?? undefined}
        poster={poster}
        loop
        muted
        playsInline
        preload="none"
        className="w-full h-full object-cover"
      />
      {/* Play Icon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors duration-300">
        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100">
          <Play size={20} fill="currentColor" />
        </div>
      </div>
    </div>
  );
}

export default function AnimationStylesGrid() {
  return (
    <section id="styles" className="px-4 sm:px-8 py-24 bg-brand-surface">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
              <span className="text-brand-orange">//</span> Styles <span className="text-brand-orange">//</span>
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Lifelike Motion. <br />
              <span className="text-gray-400">Respectful Results.</span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Each animation is carefully designed to be natural, realistic, and respectful, preserving the true character of the person in your photo.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {styles.map((style) => (
            <div key={style.name} className="bg-white p-4 rounded-[1.8rem] transition-all duration-300 group border border-gray-100">
              <AutoVideo src={style.src} poster={style.photoSrc} alt={style.name} />

              <div className="mt-6 mb-2 px-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-brand-black tracking-tight">{style.name}</h3>
                  <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={14} />
                  </div>
                </div>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                  {style.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-16">
          <Link href="/dashboard/animate">
            <button className="group relative flex items-center justify-between gap-6 bg-[#111111] text-white pl-8 pr-2 py-2.5 rounded-full transition-all duration-300 hover:scale-105">
              <span className="font-bold text-lg tracking-tight">Start Animating</span>
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-brand-orange transition-colors duration-300">
                <ArrowRight className="text-white w-5 h-5" strokeWidth={2.5} />
              </div>
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}