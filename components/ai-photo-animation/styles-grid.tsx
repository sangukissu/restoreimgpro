"use client";

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
    description: "A gradual smile with restrained facial movement. Clear, front-facing portraits usually provide the best reference.",
    src: "/videos/gentle-smile.mp4",
    photoSrc: "/gentle-smile.webp",
  },
  {
    name: "Smile + Wave",
    description: "Adds a smile and attempts a short hand wave. Use a photo where the upper body and hands are visible for a more usable result.",
    src: "/videos/video-animation1.mp4",
    photoSrc: "/vintage-family-portraits-colorized.webp",
  },
  {
    name: "Subtle Blink + Head Tilt",
    description: "Adds a blink and small head tilt while keeping the rest of the frame relatively still.",
    src: "/videos/head-tilt.mp4",
    photoSrc: "/head-tilt.webp",
  },
  {
    name: "Smile + Look Around",
    description: "Adds a smile with eye and head movement. Review eye direction and facial details before using the clip.",
    src: "/videos/smile-and-look.mp4",
    photoSrc: "/look-around.webp",
  },
  {
    name: "Warm Gaze",
    description: "Uses restrained eye movement and a slight smile for a quieter portrait animation.",
    src: "/videos/warm-gaze.mp4",
    photoSrc: "/torn-restored.webp",
  },
  {
    name: "Soft Nod",
    description: "Adds a small nod with limited background movement, suited to formal or tightly framed portraits.",
    src: "/videos/gentle-node.mp4",
    photoSrc: "/after-noise-removal.webp",
  },
  {
    name: "Peaceful Presence",
    description: "Uses minimal breathing and facial movement when you want less change from the source image.",
    src: "/videos/peaceful-presence.mp4",
    photoSrc: "/water-damage-restored.webp",
  },
  {
    name: "Loving Recognition",
    description: "Adds soft eye movement and a small smile. Results are most predictable when faces are clear and similarly sized.",
    src: "/videos/loving.mp4",
    photoSrc: "/historical-wedding-photo-colorized.webp",
  },
  {
    name: "Gentle Talking",
    description: "Adds speech-like mouth and facial movement without generating audio. It does not recreate the person's real voice or mannerisms.",
    src: "/videos/speaking.mp4",
    photoSrc: "/fade-restored.webp",
  },
];

function AutoVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
    if (inView && !activeSrc) {
      setActiveSrc(src);
    }
  }, [inView, activeSrc, src]);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch((err) => console.error("Play failed:", err));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[240px] w-full overflow-hidden rounded-2xl bg-gray-100 group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
      onClick={togglePlay}
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
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {/* Play Icon Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black shadow-lg transition-transform duration-300 hover:scale-110">
            <Play size={32} fill="currentColor" className="ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnimationStylesGrid() {
  return (
    <section id="styles" className="px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Styles <span className="text-brand-orange">//</span>
            </div>

            <h2 className="mx-auto max-w-5xl text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              Choose Your Respectful <br />
              <span className="text-gray-400">Animation Style </span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Each preset guides a different kind of movement. Start with the smallest motion that fits the portrait and compare the face with the original.
            </p>
            <p className="text-lg text-gray-600 font-medium leading-relaxed mt-4">
              Clear, restored portraits usually animate more consistently than tiny, blurred, scratched, or heavily compressed faces.
            </p>
          </div>
        </div>

        {/* Grid Container - Gray Background */}
        <div className="bg-brand-surface p-2 rounded-[1.8rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {styles.map((style) => (
              <div key={style.name} className="bg-white p-4 rounded-[1.5rem] transition-all duration-300 group hover:shadow-md">
                <AutoVideo src={style.src} poster={style.photoSrc} alt={style.name} />

                <div className="mt-6 mb-2 px-2">
                  <h3 className="text-xl font-bold text-brand-black tracking-tight">{style.name}</h3>

                  <p className="text-gray-500 font-medium text-sm leading-relaxed">
                    {style.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-16">
          <Link href="/dashboard/animate">
            <button className="group relative flex items-center justify-between gap-6 bg-[#111111] text-white pl-8 pr-2 py-2.5 rounded-full transition-all duration-300">
              <span className="font-bold text-lg tracking-tight">Start Animating</span>
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center group-hover:bg-brand-orange transition-colors duration-300">
                <ArrowRight className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
