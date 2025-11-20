
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Smile, Hand, Eye, MessageCircle, Play, Sparkles } from 'lucide-react';

interface AnimationStyle {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  videoUrl: string;
}

const ANIMATION_STYLES: AnimationStyle[] = [
  {
    id: 'talking',
    title: 'Gentle Talking',
    description: 'Calm, serene expression with minimal natural movement, as if caught in a peaceful moment.',
    icon: <MessageCircle size={24} />,
    videoUrl: '/videos/speaking.mp4'
  },
  {
    id: 'wave',
    title: 'Smile + Wave',
    description: 'The person in the image smiles warmly and waves their hand in a friendly greeting gesture.',
    icon: <Hand size={24} />,
    videoUrl: '/videos/video-animation1.mp4'
  },
  {
    id: 'look-around',
    title: 'Smile + Look Around',
    description: 'Curious movements, looking around naturally with eyes and head turning gently.',
    icon: <Eye size={24} />,
    videoUrl: '/videos/smile-and-look.mp4'
  },
  {
    id: 'warm-gaze',
    title: 'Warm Gaze',
    description: 'Steady, warm eye contact with a loving, subtle smile and peaceful expression.',
    icon: <Smile size={24} />,
    videoUrl: '/videos/warm-gaze.mp4'
  }
];

export const PhotoAnimation: React.FC = () => {
  const [activeId, setActiveId] = useState(ANIMATION_STYLES[0].id);
  const activeStyle = ANIMATION_STYLES.find(s => s.id === activeId) || ANIMATION_STYLES[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video switch
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
    }
  }, [activeId]);

  return (
    <section id="photo-animation" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Live Portrait <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Bring photos <br />
              <span className="text-gray-400">to life with AI.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Transform static portraits into realistic videos. Choose from a variety of emotional expressions and gestures.
            </p>
          </div>
        </div>

        {/* Main Layout: Gray Surface Container */}
        <div className="bg-brand-surface p-3 rounded-[1.8rem]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-auto lg:h-[600px]">

            {/* Left Column: Video Player (8 cols) - Inverted from Showcase */}
            <div className="lg:col-span-8 h-[400px] lg:h-auto bg-black rounded-[1.5rem] overflow-hidden relative group shadow-inner">

              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
                autoPlay
                loop
                muted
                playsInline
                poster="/dashboard-compare.png"
              >
                <source src={activeStyle.videoUrl} type="video/mp4" />
              </video>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

              {/* Playback Status / UI */}
              <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Live Preview
                </div>
              </div>

              {/* Active Style Label on Video */}
              <div className="absolute bottom-8 left-8 z-20">
                <h3 className="text-white text-3xl font-bold mb-2">{activeStyle.title}</h3>
                <p className="text-white/70 text-sm max-w-md backdrop-blur-sm">
                  AI generated motion based on a single still image.
                </p>
              </div>

              {/* Play Button overlay (decorative) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-90 group-hover:scale-100">
                <Play size={32} className="fill-white text-white ml-1" />
              </div>

            </div>

            {/* Right Column: Selection Menu (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-3 h-full">
              {ANIMATION_STYLES.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveId(item.id)}
                    className={`flex-1 text-left p-6 rounded-[1.5rem] transition-all duration-300 group relative overflow-hidden flex flex-col justify-center border-2
                    ${isActive
                        ? 'bg-brand-black text-white shadow-xl border-brand-black'
                        : 'bg-white text-brand-black hover:bg-gray-50 border-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${isActive ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {item.icon}
                      </div>
                      <span className="text-lg sm:text-xl font-bold tracking-tight leading-none">{item.title}</span>
                    </div>
                    <p className={`text-xs sm:text-sm font-medium ml-14 max-w-[90%] leading-relaxed ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.description}
                    </p>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-100 animate-in slide-in-from-right-2">
                        <Sparkles size={20} className="text-brand-orange" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
