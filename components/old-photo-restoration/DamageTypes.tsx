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
          Our AI photo restoration model acts as a digital conservator. It automatically identifies these non-natural artifacts—differentiating between a scratch and a physical feature like hair or clothing patterns.
        </p>
        <p>
          Instead of simply blurring the scratch, the AI analyzes the surrounding pixels to seamlessly stitch the photo back together. This reconstruction restores the original clarity without making the image look artificially smoothed or painted.
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
          A ripped photograph doesn't mean the memory is lost forever. Whether a photo has a torn corner, a clean rip down the middle, or is missing small pieces along the edges, digital restoration can bridge those gaps.
        </p>
        <p className="mb-4">
          BringBack's "Tear Removal" AI maps the geometry of the tear and the missing data. It then uses context-aware synthesis to hallucinate and fill in the exact texture, grain, and content that belongs in that empty space.
        </p>
        <p>
          For best results, scan the torn pieces as close together as possible. The AI will handle the rest, aligning the edges and eliminating the white paper fibers that usually show through a physical tear.
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
          Water damage, humidity, mold spots, and ink spills create complex stains that sit on top of the original photographic image. These stains often have uneven edges and varying opacities that make manual editing extremely difficult.
        </p>
        <p className="mb-4">
          Our AI is trained to separate the underlying photographic subject from the surface stain. It digitally lifts the discoloration, whether it's a dark mold spot or a faded water ring, while preserving the facial details underneath.
        </p>
        <p>
          This process also neutralizes uneven contrast caused by water warping the photographic paper, resulting in a clean, flat-looking digital image ready for printing.
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
          The restoration engine performs deep tonal recovery. It redistributes the light and dark values (the histogram) to pull out hidden details from the faded areas, neutralizing the yellowing effect.
        </p>
        <p>
          You can choose to keep the final image in high-contrast black-and-white, retain a rich sepia tone for historical character, or use our Colorizer to completely modernize the fading memory into vibrant color.
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
          Our specialized facial enhancement algorithms excel at unblurring old photos. By detecting facial landmarks (eyes, nose, mouth), the AI can reconstruct high-definition details even from a very soft original image.
        </p>
        <p>
          This upscaling process not only sharpens the face but also removes the heavy film grain, allowing you to take a small, blurry wallet-sized print and enlarge it for an 8x10 wall frame.
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
              Every Type of Photo Damage. <br />
              <span className="text-gray-400">Fixed Automatically.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              From deep scratches to severe water damage, our AI models are trained to handle specific types of degradation while preserving original facial likeness.
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
