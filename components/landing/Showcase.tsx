
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ScanLine, Sparkles, Droplets, Scissors, Eraser, Zap, Image as ImageIcon } from 'lucide-react';

// --- Types & Data ---

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  beforeImage: string;
  afterImage: string;
  tags: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'scratches',
    title: 'Scratches & Dust',
    description: 'Remove thousands of micro-scratches, dust particles, and cracks while preserving the original texture.',
    icon: <Eraser size={24} />,
    beforeImage: '/scratched.webp',
    afterImage: '/scratched-restored.webp',
    tags: ['De-noise', 'Texture Fill']
  },
  {
    id: 'tears',
    title: 'Tears & Rips',
    description: 'Reconstruct missing pieces of the image using generative AI context awareness.',
    icon: <Scissors size={24} />,
    beforeImage: '/torn.webp',
    afterImage: '/torn-restored.webp',
    tags: ['Generative Fill', 'Structure Fix']
  },
  {
    id: 'fading',
    title: 'Color Restoration',
    description: 'Revive faded sepia tones into vibrant, historically accurate colors.',
    icon: <Droplets size={24} />,
    beforeImage: '/childhood-memories-black-and-white.webp',
    afterImage: '/childhood-memories-colorized.webp',
    tags: ['Colorize', 'Tone Mapping']
  },
  {
    id: 'blur',
    title: 'Face Enhancement',
    description: 'Upscale low-resolution faces to HD clarity using facial landmark reconstruction.',
    icon: <ScanLine size={24} />,
    beforeImage: '/blurred-lady.webp',
    afterImage: '/unblurred-lady.webp',
    tags: ['Super Resolution', 'Sharpening']
  }
];

// --- Interactive Slider Component (Reusable) ---

const ComparisonSlider: React.FC<{ before: string; after: string; active: boolean }> = ({ before, after, active }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Reset slider and trigger scan effect when active case changes
  useEffect(() => {
    if (active) {
      setSliderPosition(50);
      setIsScanning(true);
      const timer = setTimeout(() => setIsScanning(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [before, active]);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    let clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const relativeX = clientX - left;
    setSliderPosition(Math.min(Math.max((relativeX / width) * 100, 0), 100));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] lg:min-h-[600px] overflow-hidden rounded-[1.3rem] cursor-ew-resize select-none group"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* AFTER Image (Background) */}
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />

      {/* BEFORE Image (Foreground - Clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden border-r-[3px] border-white bg-gray-900"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={before}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover max-w-none grayscale sepia-[0.3] contrast-125 brightness-90 blur-[1px]"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
        />
        {/* Simulated Damage Overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/scratches.png')] pointer-events-none"></div>

        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase">Before</div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-transparent z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center text-brand-orange transform hover:scale-110 transition-transform">
          <ScanLine size={18} strokeWidth={2.5} />
        </div>
      </div>

      <div className="absolute bottom-6 right-6 bg-brand-orange/90 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase z-10">After</div>

      {/* Scanning Effect Animation (Triggers on switch) */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none z-30 bg-white/10 animate-pulse mix-blend-overlay"></div>
      )}
    </div>
  );
};

// --- Main Showcase Component ---

export const Showcase: React.FC = () => {
  const [activeId, setActiveId] = useState(CASE_STUDIES[0].id);
  const activeCase = CASE_STUDIES.find(c => c.id === activeId) || CASE_STUDIES[0];

  return (
    <section id="showcase" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Showcase <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Restoration <br />
              <span className="text-gray-400">Capabilities</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              From faded family portraits to water-damaged keepsakes, see how our AI handles the toughest challenges.
            </p>
          </div>
        </div>

        {/* Main Layout: Gray Surface Container */}
        <div className="bg-brand-surface p-3 rounded-[1.8rem]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-auto lg:h-[600px]">

            {/* Left Column: Selection Menu (4 cols on desktop) */}
            <div className="lg:col-span-4 flex flex-col gap-3 h-full">
              {CASE_STUDIES.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveId(item.id)}
                    className={`flex-1 text-left p-6 rounded-[1.5rem] transition-all duration-300 group relative overflow-hidden flex flex-col justify-center
                    ${isActive
                        ? 'bg-brand-black text-white shadow-xl'
                        : 'bg-white text-brand-black hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {item.icon}
                      </div>
                      <span className="text-xl font-bold tracking-tight">{item.title}</span>
                    </div>
                    <p className={`text-sm font-medium ml-14 max-w-[90%] ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.description}
                    </p>

                    {/* Active Indicator Arrow */}
                    {isActive && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 lg:opacity-100 animate-in slide-in-from-left-2">
                        <Sparkles size={20} className="text-brand-orange" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Interactive Viewport (8 cols on desktop) */}
            <div className="lg:col-span-8 h-[500px] lg:h-auto bg-white rounded-[1.5rem] p-2 overflow-hidden relative">
              <ComparisonSlider
                before={activeCase.beforeImage}
                after={activeCase.afterImage}
                active={true}
              />

              {/* Floating Tags */}
              <div className="absolute top-6 right-6 flex gap-2 z-20">
                {activeCase.tags.map(tag => (
                  <div key={tag} className="bg-black/50 backdrop-blur border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {tag}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
