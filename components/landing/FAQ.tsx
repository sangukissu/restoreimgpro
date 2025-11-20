
"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does AI photo restoration actually work?",
    answer: "Our AI analyzes millions of photo patterns to understand how damage occurs and how to reverse it. It identifies faces, textures, and objects, then intelligently reconstructs missing or damaged areas while preserving the original character of your photo. The process happens in seconds, but the technology behind it represents years of machine learning development."
  },
  {
    question: "How does AI photo animation work?",
    answer: "Our AI animation technology analyzes facial features and expressions in your photos to create natural, lifelike movements. It can generate subtle animations like smiling, waving, blinking, and head tilts while maintaining the original character and authenticity of the person in the photo."
  },
  {
    question: "What types of photo damage can BringBack fix?",
    answer: "We can restore virtually any type of damage: tears, scratches, water stains, fading, yellowing, blur, darkness, cracks, and missing pieces. Our AI handles both physical damage (like tears) and quality issues (like blur or low resolution). If you can see some of the original photo, we can likely restore it."
  },
  {
    question: "What animation styles are available?",
    answer: "We offer three animation presets: Smile + Wave (natural smile with gentle wave gesture), Subtle Blink + Head Tilt (soft blinking with slight head movement), and Smile + Look Around (light smile with curious gaze movement). Each animation is designed to bring your photos to life naturally."
  },
  {
    question: "How much do photo restoration and animation cost?",
    answer: "Photo restoration: We offer 5 high-quality photo restorations for just $2.49 - no subscription required. Photo animation: Each animation costs 10 credits (available through our pricing plans: Plus $4.99). Both services deliver professional-grade results in seconds, compared to traditional services that charge $50-200 per photo and take weeks to complete."
  },
  {
    question: "Is my personal data and photos safe?",
    answer: "Absolutely. Your photos are processed securely and uploaded media automatically deleted from our servers within 30 minutes and the generated media is automatically deleted after 7 days. We never store, share, or use your personal photos for any purpose other than restoration or animation. Your memories remain completely private and belong only to you."
  },
  {
    question: "How long does the restoration and animation process take?",
    answer: "Photo restoration takes under 30 seconds, while photo animation typically takes 30-60 seconds depending on complexity. Both processes happen in real-time with no waiting days or weeks like traditional services."
  }
];

const AccordionItem: React.FC<{
  item: FAQItem;
  isOpen: boolean;
  toggle: () => void
}> = ({ item, isOpen, toggle }) => {
  return (
    <div
      onClick={toggle}
      className={`bg-white rounded-[1.5rem] overflow-hidden transition-all duration-300 cursor-pointer group ${isOpen ? 'shadow-sm' : 'hover:bg-gray-50'}`}
    >
      <div className="p-4 sm:p-6 flex justify-between items-center gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-brand-black leading-tight select-none">
          {item.question}
        </h3>

        {/* Toggle Button */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 cursor-pointer ${isOpen ? 'bg-brand-orange text-white' : 'bg-gray-100 text-brand-black group-hover:bg-gray-200'
          }`}>
          {isOpen ? <Minus size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
        </div>
      </div>

      {/* Content */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
      >
        <div className="overflow-hidden">
          <p className="px-4 sm:px-6 pb-8 text-gray-600 font-medium leading-relaxed text-base sm:text-lg max-w-3xl">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="w-full  px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Header Column */}
          <div className="lg:col-span-5 sticky top-32">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> FAQs <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-tight text-brand-black leading-[0.95] mb-8">
              Questions <br />
              <span className="text-gray-400">& answers.</span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-md">
              Everything you need to know about AI photo restoration and how BringBack works.
            </p>
          </div>

          {/* Questions Column - The Frame */}
          <div className="lg:col-span-7">
            <div className="bg-brand-surface p-3 rounded-[1.8rem]">
              <div className="flex flex-col gap-3">
                {FAQS.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    item={faq}
                    isOpen={openIndex === index}
                    toggle={() => handleToggle(index)}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
