
import React from 'react';
import { Sparkles, Frame, Wrench, Smile, Palette, Heart, Lock, ScanLine, CheckCircle2, Play } from 'lucide-react';

// --- Visual Components for Each Card ---

const VisualRestore = () => {
  // Grid configuration
  const rows = 2;
  const cols = 3;
  const totalCells = rows * cols;

  return (
    <div className="w-full h-full relative overflow-hidden rounded-[1.5rem] bg-gray-900 group">
      {/* Base Layer: Damaged/Old Image */}
      <img
        src="/water-damaged.webp"
        className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 filter blur-[1px]"
        alt="Original"
      />

      {/* Grid Overlay Layer */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
        {Array.from({ length: totalCells }).map((_, i) => (
          <div key={i} className="relative overflow-hidden border-[0.5px] border-white/10">
            {/* Restored Image Segment */}
            <div
              className="absolute inset-0 w-[300%] h-[200%] opacity-0 animate-[restore-cell_4s_infinite]"
              style={{
                backgroundImage: 'url(/water-damage-restored.webp)',
                backgroundSize: '100% 100%',
                left: `-${(i % cols) * 100}%`,
                top: `-${Math.floor(i / cols) * 100}%`,
                animationDelay: `${i * 0.4}s`
              }}
            ></div>

            <div
              className="absolute inset-0 bg-brand-orange/20 animate-[scan-flash_4s_infinite]"
              style={{ animationDelay: `${i * 0.4}s` }}
            ></div>
          </div>
        ))}
      </div>

      {/* UI Overlay */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></div>
          AI RESTORING
        </div>
        <div className="text-white/80 text-[10px] font-mono animate-[pulse_4s_infinite]">
          Processing...
        </div>
      </div>

      <style>{`
        @keyframes restore-cell {
          0% { opacity: 0; }
          10% { opacity: 1; } /* Quick fade in */
          85% { opacity: 1; } /* Stay visible */
          95% { opacity: 0; } /* Fade out for reset */
          100% { opacity: 0; }
        }
        @keyframes scan-flash {
          0% { opacity: 0; }
          5% { opacity: 1; }
          15% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const VisualFrames = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-[1.5rem]">
    <div className="relative w-3/4 h-3/4 transition-all duration-1000 ease-in-out animate-[frame-cycle_8s_infinite]">
      <img
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop"
        className="w-full h-full object-cover"
        alt="Framed"
      />
    </div>
    <style>{`
      @keyframes frame-cycle {
        0%, 100% { border: 8px solid #111; border-radius: 0px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); transform: scale(0.9); } /* Modern Black */
        33% { border: 12px solid #D4AF37; border-radius: 4px; box-shadow: 0 15px 30px rgba(212,175,55,0.3); transform: scale(0.85); } /* Gold */
        66% { border: 0px solid transparent; border-radius: 24px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transform: scale(0.95); } /* Minimal/None */
      }
    `}</style>
  </div>
);

const VisualDamage = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[1.3rem] bg-gray-900 group">
    {/* Base Image */}
    <img
      src="/scratched.webp"
      className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale"
      alt="Damaged"
    />

    {/* Damage Overlays - Cycling */}
    <div className="absolute inset-0 animate-[cycle-damage_8s_infinite]">
      {/* Scratches */}
      <div className="absolute inset-0 opacity-0 animate-[show-layer_8s_infinite_0s]">
        <svg className="w-full h-full opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M10,10 Q30,40 50,20 T90,90" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M80,10 Q60,50 20,30" stroke="white" strokeWidth="0.8" fill="none" />
        </svg>
      </div>
      {/* Tears */}
      <div className="absolute inset-0 opacity-0 animate-[show-layer_8s_infinite_2s]">
        <svg className="w-full h-full opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L30,30 L10,50 L40,80 L0,100 Z" fill="white" fillOpacity="0.2" />
          <path d="M100,0 L70,20 L90,60 L60,100 L100,100 Z" fill="white" fillOpacity="0.2" />
        </svg>
      </div>
      {/* Stains */}
      <div className="absolute inset-0 opacity-0 animate-[show-layer_8s_infinite_4s]">
        <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-amber-900/40 blur-xl rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-amber-900/30 blur-lg rounded-full"></div>
      </div>
    </div>

    {/* Dynamic Label */}
    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-lg p-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
          <Wrench size={14} className="text-red-500 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Detected</span>
          <div className="h-4 overflow-hidden relative w-24">
            <div className="absolute top-0 left-0 flex flex-col animate-[scroll-text_8s_infinite]">
              <span className="text-xs font-bold text-white h-4">Scratches</span>
              <span className="text-xs font-bold text-white h-4">Tears</span>
              <span className="text-xs font-bold text-white h-4">Stains</span>
              <span className="text-xs font-bold text-brand-orange h-4">Restored</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes show-layer {
        0%, 20% { opacity: 1; }
        25%, 100% { opacity: 0; }
      }
      @keyframes scroll-text {
        0%, 20% { transform: translateY(0); }
        25%, 45% { transform: translateY(-1rem); }
        50%, 70% { transform: translateY(-2rem); }
        75%, 95% { transform: translateY(-3rem); }
        100% { transform: translateY(0); }
      }
    `}</style>
  </div>
);

const VisualFaceMesh = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[1.3rem] bg-black group">
    {/* The Image Layer */}
    <div className="absolute inset-0 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
        className="w-full h-full object-cover animate-[video-motion_8s_infinite]"
        alt="Portrait"
      />
    </div>

    {/* UI Layer: Play Button (Visible initially, then hides) */}
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 animate-[ui-fade-out_8s_infinite]">
      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-lg">
        <Sparkles size={20} className="text-white fill-white" />
      </div>
    </div>

    {/* UI Layer: Video Controls (Hidden initially, then shows) */}
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 animate-[ui-fade-in_8s_infinite]">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
          <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
        </div>
        <span className="text-[10px] font-medium text-white/80">Enhancing Details...</span>
      </div>
      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-brand-orange rounded-full animate-[progress-bar_4s_linear_infinite_2s]"></div>
      </div>
    </div>

    <style>{`
      @keyframes video-motion {
        0%, 25% { transform: scale(1); filter: grayscale(100%) blur(4px); } /* Blurry B&W */
        30%, 90% { transform: scale(1.05); filter: grayscale(0%) blur(0px); } /* Sharp Color */
        100% { transform: scale(1); filter: grayscale(100%) blur(4px); } /* Reset */
      }
      @keyframes ui-fade-out {
        0%, 20% { opacity: 1; }
        25%, 90% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes ui-fade-in {
        0%, 25% { opacity: 0; }
        30%, 90% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes progress-bar {
        0% { width: 0%; }
        100% { width: 100%; }
      }
    `}</style>
  </div>
);

const VisualColor = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[1.3rem] bg-gray-200">
    {/* B&W Background */}
    <img
      src="/vintage-family-portraits.webp"
      className="absolute inset-0 w-full h-full object-cover grayscale"
      alt="BW"
    />
    {/* Color Overlay controlled by animation */}
    <div className="absolute inset-0 w-full h-full overflow-hidden animate-[color-wipe_4s_linear_infinite]">
      <img
        src="/vintage-family-portraits-colorized.webp"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Color"
      />
    </div>
    {/* Slider UI */}
    <div className="absolute bottom-3 left-3 right-3 h-1.5 bg-white/30 rounded-full backdrop-blur">
      <div className="h-full bg-brand-orange rounded-full animate-[width-full_4s_linear_infinite]"></div>
    </div>
    <style>{`
      @keyframes color-wipe {
        0% { clip-path: inset(0 100% 0 0); }
        50% { clip-path: inset(0 0 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
      @keyframes width-full {
        0% { width: 0%; }
        50% { width: 100%; }
        100% { width: 100%; }
      }
    `}</style>
  </div>
);

const VisualEmotion = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[1.3rem] bg-gray-100">
    <img
      src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=400&auto=format&fit=crop"
      className="absolute inset-0 w-full h-full object-cover"
      alt="Emotion"
    />
    {/* Floating Tag */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-lg border border-brand-orange/20 flex items-center gap-2 animate-bounce-slow">
      <div className="w-5 h-5 bg-brand-orange/10 rounded-full flex items-center justify-center">
        <CheckCircle2 size={14} className="text-brand-orange" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-bold text-gray-400 uppercase">Facial Likeness</span>
        <span className="text-sm font-bold text-brand-black">100% Preserved</span>
      </div>
    </div>
    <style>{`
        @keyframes bounce-slow {
            0%, 100% { transform: translate(-50%, -50%); }
            50% { transform: translate(-50%, -55%); }
        }
    `}</style>
  </div>
);

const VisualPrivacy = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[1.3rem] bg-gray-50 flex items-center justify-center">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

    <div className="relative w-16 h-16 bg-brand-black rounded-2xl flex items-center justify-center text-white shadow-xl z-10">
      <Lock size={24} />
      <div className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
        <CheckCircle2 size={14} className="text-white" />
      </div>
    </div>

    {/* Vanishing Photos Animation */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-12 h-16 bg-gray-200 rounded border border-gray-300 absolute animate-[file-vanish_3s_infinite] opacity-0"></div>
      <div className="w-12 h-16 bg-gray-200 rounded border border-gray-300 absolute animate-[file-vanish_3s_infinite_0.5s] opacity-0"></div>
    </div>

    <style>{`
        @keyframes file-vanish {
            0% { transform: translate(40px, 40px) scale(1) rotate(10deg); opacity: 1; }
            100% { transform: translate(0, 0) scale(0.2) rotate(0deg); opacity: 0; }
        }
     `}</style>
  </div>
);

const VisualDamageCheck = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[1.3rem] bg-gray-900">
    <img
      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop"
      className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
      alt="Scan"
    />
    {/* Radar Overlay */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[150%] h-[150%] border-2 border-brand-orange/30 rounded-full animate-[spin_4s_linear_infinite] border-t-brand-orange relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/20 to-transparent rounded-full"></div>
      </div>
    </div>
    {/* Detected Points */}
    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
    <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-red-500 rounded-full animate-ping delay-700"></div>
  </div>
);

// --- Main Component Data ---

const BENEFITS = [
  {
    icon: <Sparkles size={24} />,
    title: 'Repair in Your Browser',
    description: 'Upload a scan, generate a repaired version, and compare it with the original before downloading.',
    visual: <VisualRestore />
  },
  {
    icon: <Frame size={24} />,
    title: 'Keep the Vintage Character',
    description: 'Choose restore-only when you want to retain the familiar black-and-white, sepia, or existing color treatment.',
    visual: <VisualFrames />
  },
  {
    icon: <Wrench size={24} />,
    title: 'Address Common Damage',
    description: 'Reduce visible scratches, tears, fading, stains, and creases when enough surrounding detail remains.',
    visual: <VisualDamage />
  },
  {
    icon: <Smile size={24} />,
    title: 'Facial Detail Enhancement',
    description: "The model may reconstruct soft or missing facial details. Compare the result closely because those details may not be historically exact.",
    visual: <VisualFaceMesh />
  },
  {
    icon: <Palette size={24} />,
    title: 'Optional AI Colorization',
    description: 'Add interpreted color only when you want it; colorization is not evidence of the original historical colors.',
    visual: <VisualColor />
  },
  {
    icon: <Heart size={24} />,
    title: 'Compare with the Original',
    description: 'Use the before-and-after view to check faces, expressions, clothing, and reconstructed areas before sharing or printing.',
    visual: <VisualEmotion />
  },
  {
    icon: <Lock size={24} />,
    title: 'Private Account Storage',
    description: 'Generated media stays in My Media until you delete it, and family photos are not used to train general-purpose AI models.',
    visual: <VisualPrivacy />
  },
  {
    icon: <ScanLine size={24} />,
    title: 'Results Depend on the Source',
    description: "A clearer scan usually provides more usable detail. Very large missing areas or destroyed faces may require a manual restoration specialist.",
    visual: <VisualDamageCheck />
  }
];

export const Benefits: React.FC = () => {
  return (
    <section id="benefits" className="w-full   px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Features <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              Advanced AI <br />
              <span className="text-gray-400">Restoration Features.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              The restoration workflow combines practical repair options with clear limits, so you can choose the treatment and judge the result for yourself.
            </p>
          </div>
        </div>

        {/* Benefits Grid Container - Gray Background */}
        <div className="bg-brand-surface p-2 rounded-[1.8rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {BENEFITS.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[1.5rem] p-5 flex flex-col gap-6 relative group h-full"
              >

                {/* Visual Micro App Area (Top) */}
                <div className="h-40 w-full rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-inner relative">
                  {item.visual}
                </div>

                {/* Content (Bottom) */}
                <div className="flex flex-col gap-3 px-2 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-black">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-brand-black leading-tight">{item.title}</h3>
                  </div>

                  <p className="text-gray-500 font-medium leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
