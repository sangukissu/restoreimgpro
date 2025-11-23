
import React from 'react';
import { Heart, ShieldCheck, Sparkles, Users } from 'lucide-react';

const STATS = [
  {
    value: '130+',
    label: 'Families have trusted us to restore their albums.',
    dots: [true, true, true, false], // Visual progress
    bullet: false,
    icon: <Users size={20} />
  },
  {
    value: 'Simple',
    label: 'No tech skills needed. Just upload and click one button.',
    dots: [true, true, false, false],
    bullet: true,
    icon: <Sparkles size={20} />
  },
  {
    value: '100%',
    label: 'Private & Secure. We never store or share your photos.',
    dots: [true, false, false, false],
    bullet: false,
    icon: <ShieldCheck size={20} />
  },
  {
    value: 'Real',
    label: 'Authentic results that look like your loved ones, not cartoons.',
    dots: [true, true, true, true],
    bullet: false,
    icon: <Heart size={20} />
  }
];

export const WhyUs: React.FC = () => {
  return (
    <section id="why-us" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Why BringBack? <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Keep your family <br />
              <span className="text-gray-400">history alive.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Don't let your precious memories fade away. We make it simple to restore, animate, and share your family legacy.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: The "Emotional" Visual */}
          <div className="lg:col-span-5 relative h-[500px] lg:h-auto rounded-[1.5rem] overflow-hidden shadow-2xl group bg-gray-900">
            {/* Image Layer */}
            <img
              src="/family-history.png"
              alt="Father and Son Restoration"
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 sepia-[.3]"
            />

            {/* Soft Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 w-full p-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-brand-orange text-white p-1.5 rounded-full">
                    <Heart size={16} fill="currentColor" />
                  </div>
                  <span className="text-white font-bold text-lg">Preserve the Moment</span>
                </div>
                <p className="text-gray-200 text-sm font-medium leading-relaxed">
                  "I finally saw my grandfather's smile clearly for the first time. It felt like he was right there with us again."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Stats Grid */}
          <div className="lg:col-span-7 bg-brand-surface p-3 rounded-[1.8rem]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full">
              {STATS.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[1.5rem] p-8 flex flex-col justify-between min-h-[240px] group"
                >
                  {/* Top Row */}
                  <div className="flex justify-between items-start relative z-10">
                    <span className={`font-[800] text-brand-black tracking-tight ${stat.value.length > 4 ? 'text-3xl' : 'text-5xl'}`}>{stat.value}</span>

                    {/* Dots Indicator */}
                    <div className="flex gap-1.5 pt-2">
                      {stat.dots.map((isActive, i) => (
                        <div
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${isActive ? 'bg-brand-orange' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Middle decoration (optional bullet) */}
                  {stat.bullet && (
                    <div className="my-4 relative z-10">
                      <div className="w-12 h-1.5 bg-brand-black rounded-full"></div>
                    </div>
                  )}

                  {/* Label */}
                  <div className="mt-auto relative z-10">
                    <p className={`text-lg font-bold leading-tight text-brand-black/80 max-w-[90%] ${!stat.bullet ? 'mt-auto' : ''}`}>
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
