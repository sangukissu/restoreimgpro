import React from 'react';
import { ArrowRight, PlayCircle, Sparkles, Smile } from 'lucide-react';

export const PhotoAnimation: React.FC = () => {
  return (
    <section id="photo-animation" className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 py-24 bg-brand-bg">

      {/* Container echoing WhyUs structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Visual Media (Video of animation) */}
        <div className="lg:col-span-5 relative h-[500px] lg:h-auto rounded-[2.5rem] overflow-hidden shadow-2xl group bg-black">
          <video
            className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
            autoPlay
            loop
            muted
            playsInline
            src="/videos/video-animation1.mp4"
          />

          {/* Overlay Content on Video */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          <div className="absolute bottom-8 left-8 right-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Smile size={14} />
              Five-Second Silent Video
            </div>
            <p className="text-white/80 text-sm font-medium leading-relaxed">
              Choose a subtle motion preset and review the generated face against the restored portrait.
            </p>
          </div>
        </div>

        {/* Right Column: Content / Upsell */}
        <div className="lg:col-span-7 bg-brand-surface p-2 rounded-[3rem] flex flex-col">
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 lg:p-14 h-full flex flex-col justify-center items-start text-left relative overflow-hidden">

            {/* Decorative Background Icon */}
            <div className="absolute -right-10 -top-10 text-gray-50 opacity-50 transform rotate-12 pointer-events-none">
              <Sparkles size={300} strokeWidth={0.5} />
            </div>

            <div className="relative z-10">
              {/* Bridge Badge */}
              <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                <span className="text-brand-orange">//</span> Optional Next Step <span className="text-brand-orange">//</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-[850] text-brand-black tracking-tight leading-[0.98] mb-6">
                After Restoration: <br />
                <span className="text-gray-400">Bring Faces to Life.</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed mb-8 max-w-xl">
                A clearer restored face can give the animation model a better reference. Photo Animation costs 10 credits and generates a short interpretation of movement, so check likeness and expression before sharing.
              </p>

              <a
                href="/ai-photo-animation"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 bg-brand-black text-white pl-8 pr-2 py-3 rounded-full hover:scale-105 transition-transform duration-300 shadow-xl"
              >
                <span className="font-bold text-base sm:text-lg">Explore Photo Animation</span>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-black group-hover:bg-brand-orange group-hover:text-white transition-colors">
                  <ArrowRight size={20} strokeWidth={2.5} />
                </div>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
