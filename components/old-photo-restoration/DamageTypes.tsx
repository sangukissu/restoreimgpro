'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ScanLine, Wrench, Droplets, Sun, Focus } from 'lucide-react';

const DAMAGE_TYPES = [
  {
    id: "scratches",
    title: "Fix Scratched & Creased Photos",
    icon: <Wrench size={24} />,
    description: (
      <>
        <p className="mb-4">
          Over decades, physical photographs naturally accumulate surface damage. Fine scratches from sliding against other prints, deep creases from being folded in wallets, and spiderweb cracks across the emulsion layer can obscure the faces of your loved ones.
        </p>
        <p className="mb-4">
          BringBack generates a repaired digital version by interpreting damaged areas in the context of nearby pixels. Fine, isolated marks are usually easier to address than broad scratches crossing a face.
        </p>
        <p>
          Reconstruction can introduce plausible details that were not visible in the scan. Use the comparison slider to check hair, clothing patterns, facial features, and texture against the original.
        </p>
      </>
    ),
    beforeImg: "/scratched.webp",
    afterImg: "/scratched-restored.webp",
    imgAlt: "AI repairing scratched old family photo before and after"
  },
  {
    id: "tears",
    title: "Repair Torn & Ripped Photos",
    icon: <ScanLine size={24} />,
    description: (
      <>
        <p className="mb-4">
          Digital restoration can reduce the appearance of a torn corner, a clean rip, or small missing pieces along an edge when the surrounding image still provides enough context.
        </p>
        <p className="mb-4">
          The model estimates what may belong in a gap from the neighboring shapes, tones, and textures. That estimate is not the exact information that was physically lost.
        </p>
        <p>
          For the best starting point, place torn pieces as close to their original alignment as possible and scan them together on a flat, evenly lit surface.
        </p>
      </>
    ),
    beforeImg: "/ripped.webp",
    afterImg: "/ripped-restored.webp",
    imgAlt: "Restoring torn old photo with AI technology"
  },
  {
    id: "water",
    title: "Fix Water Damaged & Stained Photos",
    icon: <Droplets size={24} />,
    description: (
      <>
        <p className="mb-4">
          Water rings, humidity marks, mold spots, and ink stains can cover both the paper surface and important image detail. Light, localized marks are generally easier to reduce than opaque damage across a face.
        </p>
        <p className="mb-4">
          BringBack uses the visible surroundings to generate a cleaner version of stained areas. Where the original information is hidden, the output may contain reconstructed rather than recovered detail.
        </p>
        <p>
          Compare the result at full size, especially around faces, text, jewelry, and patterned clothing, before deciding whether it is suitable for printing.
        </p>
      </>
    ),
    beforeImg: "/water-damaged.webp",
    afterImg: "/water-damage-restored.webp",
    imgAlt: "AI fixing water damage and mold stains on old photo"
  },
  {
    id: "fading",
    title: "Restore Faded & Yellowed Photos",
    icon: <Sun size={24} />,
    description: (
      <>
        <p className="mb-4">
          Exposure to sunlight and the natural degradation of photographic chemicals cause old photos to lose their contrast and take on a faded, yellow, or reddish tint. Detail is lost in the shadows, and highlights become blown out.
        </p>
        <p className="mb-4">
          Restoration can rebalance contrast and reduce a strong color cast where detail is still present. Completely washed-out highlights and blocked shadows may not contain enough information to recover faithfully.
        </p>
        <p>
          Choose restore-only to keep black-and-white or sepia character, or restore and colorize when you intentionally want interpreted color.
        </p>
      </>
    ),
    beforeImg: "/yellowandfaded.webp",
    afterImg: "/yellowandfaded-restored.webp",
    imgAlt: "Restoring faded and yellowed vintage photograph"
  },
  {
    id: "blur",
    title: "Unblur & Sharpen Old Photos",
    icon: <Focus size={24} />,
    description: (
      <>
        <p className="mb-4">
          Vintage cameras often had slow shutter speeds, resulting in motion blur or slightly out-of-focus subjects. When combined with the natural softness of old film stock, faces can lack the crispness we expect today.
        </p>
        <p className="mb-4">
          AI can add definition to a soft face, but it cannot know details that the camera never captured. Strong blur and very small faces increase the chance of invented eyes, teeth, skin texture, or other features.
        </p>
        <p>
          Use the clearest scan available and inspect the downloaded pixel dimensions and reconstructed facial details before ordering an enlargement.
        </p>
      </>
    ),
    beforeImg: "/blurred.webp",
    afterImg: "/blurred-restored.webp",
    imgAlt: "AI sharpening and unblurring out of focus old photo"
  }
];

const ComparisonSlider: React.FC<{ before: string; after: string; imgAlt: string }> = ({ before, after, imgAlt }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
      className="relative w-full aspect-[3/2] min-h-[300px] overflow-hidden rounded-[2rem] cursor-ew-resize select-none group border-4 border-white shadow-2xl bg-gray-100"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* AFTER Image (Background) */}
      <img
        src={after}
        alt={`Restored - ${imgAlt}`}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* BEFORE Image (Foreground clipped with clip-path to prevent squishing) */}
      <img
        src={before}
        alt={`Damaged - ${imgAlt}`}
        className="absolute inset-0 w-full h-full object-cover grayscale sepia-[0.3] contrast-125 brightness-90 blur-[1px] z-10"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      />

      {/* Slider Handle Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center text-brand-orange transform group-hover:scale-110 transition-transform pointer-events-auto">
          <ScanLine size={18} strokeWidth={2.5} />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase z-20">
        Before
      </div>

      <div className="absolute bottom-4 right-4 bg-brand-orange/90 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase z-20 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
        After
      </div>

      {/* Scanning Effect Animation */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none z-30 bg-white/10 animate-pulse mix-blend-overlay"></div>
      )}
    </div>
  );
};

export const DamageTypes: React.FC = () => {
  return (
    <section id="damage-types" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Capabilities <span className="text-brand-orange">//</span>
            </div>
            
            {/* Title */}
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              Common Old-Photo Damage. <br />
              <span className="text-gray-400">One Reviewable Workflow.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Explore how scratches, tears, stains, fading, and blur can respond differently—and what to check before accepting a generated repair.
            </p>
          </div>
        </div>

        {/* Alternating Rows with Interactive Sliders wrapped in Premium Container */}
        <div className="bg-brand-surface p-2 sm:p-3 rounded-[2rem]">
          <div className="flex flex-col gap-3">
            {DAMAGE_TYPES.map((type, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={type.id} className="bg-white rounded-[1.8rem] p-6 lg:p-12 shadow-sm">
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                
                {/* Content Side */}
                <div className="flex-1 w-full flex flex-col items-start text-left">
                  <div className="w-14 h-14 rounded-2xl bg-brand-surface border border-gray-100 flex items-center justify-center text-brand-orange mb-6 shadow-sm">
                    {type.icon}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-black mb-6 leading-tight">
                    {type.title}
                  </h3>
                  <div className="text-gray-600 font-medium leading-relaxed text-lg text-left w-full">
                    {type.description}
                  </div>
                </div>

                {/* Visual Side: Premium Interactive Slider */}
                <div className="flex-1 w-full">
                  <ComparisonSlider 
                    before={type.beforeImg}
                    after={type.afterImg}
                    imgAlt={type.imgAlt}
                  />
                </div>

                </div>
              </div>
            );
          })}
          </div>
        </div>

      </div>
    </section>
  );
};
