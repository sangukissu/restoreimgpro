
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
              Live Portrait Technology
            </div>
            <p className="text-white/80 text-sm font-medium leading-relaxed">
              "Seeing my mother smile again was the most emotional moment of my life."
            </p>
          </div>
        </div>

        {/* Right Column: Content / Upsell */}
        <div className="lg:col-span-7 bg-brand-surface p-3 rounded-[3rem] flex flex-col">
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 lg:p-16 h-full flex flex-col justify-center items-start text-left relative overflow-hidden">

            {/* Decorative Background Icon */}
            <div className="absolute -right-10 -top-10 text-gray-50 opacity-50 transform rotate-12 pointer-events-none">
              <Sparkles size={300} strokeWidth={0.5} />
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange mb-8">
                <PlayCircle size={32} />
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[850] text-brand-black tracking-tight leading-[0.95] mb-6">
                First Restore, <br />
                <span className="text-gray-400">Then Relive.</span>
              </h2>

              <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed mb-10 max-w-xl">
                Restoration is just the beginning. Once you have cleaned up your old photos using our restoration tool, use our Animation AI to see your ancestors smile, blink, and move.
              </p>

              <a
                href="/ai-photo-animation"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 bg-brand-black text-white pl-8 pr-2 py-3 rounded-full hover:scale-105 transition-transform duration-300 shadow-xl"
              >
                <span className="font-bold text-lg">Learn About Photo Animation</span>
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
