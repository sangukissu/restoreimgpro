"use client";

import React, { useState, useEffect } from 'react';
import { Rocket, Layout, Palette, MousePointer2, PenTool, Layers, Image as ImageIcon, Monitor } from 'lucide-react';

interface ServiceTag {
  icon: React.ReactNode;
  label: string;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  mainIcon: React.ReactNode;
  tags: ServiceTag[];
  images: string[];
}

const SERVICES: ServiceItem[] = [
  {
    id: 'brand-identity',
    title: 'Brand Identity',
    description: 'Elevate your identity: sharp positioning, cohesive visuals, real impact.',
    mainIcon: <Rocket className="text-white" size={20} />,
    tags: [
      { icon: <PenTool size={14} />, label: 'Art Direction' },
      { icon: <Layers size={14} />, label: 'Motion Identity' },
      { icon: <Palette size={14} />, label: 'Logo Design' },
      { icon: <ImageIcon size={14} />, label: 'Color Systems' },
    ],
    images: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop', // Yellow/Bold style
      'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1000&auto=format&fit=crop', // 3D Shape Dark
      'https://images.unsplash.com/photo-1558655146-d09347e0b7a9?q=80&w=1000&auto=format&fit=crop', // Minimalist
    ]
  },
  {
    id: 'web-mobile',
    title: 'Web & Mobile Design',
    description: 'Crafting intuitive, user-centric digital experiences that drive engagement and conversion.',
    mainIcon: <Layout className="text-white" size={20} />,
    tags: [
      { icon: <Monitor size={14} />, label: 'UI/UX Design' },
      { icon: <MousePointer2 size={14} />, label: 'Prototyping' },
      { icon: <Layers size={14} />, label: 'Design Systems' },
      { icon: <Layout size={14} />, label: 'Landing Pages' },
    ],
    images: [
      'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=1000&auto=format&fit=crop', // Phone Mockup
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1000&auto=format&fit=crop', // Clean UI
      'https://images.unsplash.com/photo-1626785774573-4b7993143a2d?q=80&w=1000&auto=format&fit=crop', // 3D Elements
    ]
  }
];

const Carousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full min-h-[350px] lg:min-h-[450px] bg-gray-900 rounded-[2.5rem] overflow-hidden group">
      {/* Images */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          <img src={img} alt="Service Showcase" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
        </div>
      ))}

      {/* Navigation Dots (Glassmorphism Pill) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-1.5 hover:bg-white/80'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export const Services: React.FC = () => {
  return (
    <section id="services" className="relative w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Services <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              How We Grow <br />
              <span className="text-gray-400">Your Business</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              We combine strategy, speed, and skill to deliver exceptional design — every time.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="flex flex-col gap-8">
          {SERVICES.map((service) => (
            /* The Container requested by user: Gray background, Rounded corners, Padding */
            <div key={service.id} className="bg-brand-surface p-3 rounded-[3rem]">

              {/* Inner Grid with Gap matching the padding visually */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-[500px]">

                {/* Text Card */}
                <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-between h-full">
                  <div>
                    {/* Icon */}
                    <div className="w-14 h-14 bg-brand-black rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-black/10">
                      {service.mainIcon}
                    </div>

                    {/* Content */}
                    <h3 className="text-3xl sm:text-[2.5rem] font-[800] text-brand-black mb-4 tracking-tight leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 text-lg leading-relaxed mb-12 font-medium max-w-md">
                      {service.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-3 mt-auto">
                    {service.tags.map((tag, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-[#F9F9F9] text-gray-700 px-5 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-100"
                      >
                        <span className="text-gray-400">{tag.icon}</span>
                        {tag.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Card */}
                <div className="h-full rounded-[2.5rem] overflow-hidden">
                  <Carousel images={service.images} />
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};