"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does AI photo denoising actually work?",
    answer: "Our AI analyzes the patterns of noise in your photo and distinguishes between unwanted grain and important image details. It uses advanced algorithms trained on millions of images to selectively remove noise while preserving textures, edges, and fine details that matter to your photo's quality."
  },
  {
    question: "What types of noise can BringBack remove?",
    answer: "We can remove virtually any type of digital noise: high-ISO grain, color noise, luminance noise, digital artifacts from old cameras, compression artifacts, and low-light noise. Our AI handles both uniform noise patterns and complex, irregular noise with equal effectiveness."
  },
  {
    question: "Will denoising make my photos look plastic or fake?",
    answer: "No! Our AI is specifically designed to maintain natural texture and detail while removing noise. Unlike basic noise reduction tools that can make photos look over-smoothed or artificial, our system preserves skin texture, fabric details, and other important elements."
  },
  {
    question: "How much does photo denoising cost?",
    answer: "We offer 5 high-quality photo denoising cleanups for just $2.49 - no subscription required. This one-time payment gives you professional-grade noise removal in seconds, compared to traditional photo editing services that charge $30-100+ per photo."
  },
  {
    question: "Can you clean very grainy or noisy photos?",
    answer: "Yes! Our AI excels at removing even heavy noise from challenging photos like high-ISO night shots or old digital camera images. While results depend on the original photo, we can often make severely noisy images look clean and professional."
  },
  {
    question: "How long does the denoising process take?",
    answer: "Most photos are processed and cleaned in under 30 seconds. Simply upload your noisy photo and watch the grain disappear in real-time. No waiting hours or days like traditional photo editing services."
  },
  {
    question: "Is my data safe during processing?",
    answer: "Absolutely. Your photos are processed securely and uploaded media automatically deleted from our servers within 30 minutes and the generated media is auotmatically deleted after 7 days. We never store, share, or use your personal photos for any purpose other than restoration or animation. Your memories remain completely private and belong only to you."
  },
  {
    question: "What if the results aren't what I expected?",
    answer: "We offer a 30-day money-back guarantee. If you're not satisfied with the denoising results, we'll refund your purchase - no questions asked. We're confident in our AI's ability to clean your photos, but we stand behind every enhancement."
  },
  {
    question: "What does denoising a photo mean?",
    answer: "Denoising removes unwanted grain or noise from photos—especially from low-light or high-ISO images—while preserving fine details."
  },
  {
    question: "How does AI denoising work on BringBack?",
    answer: "BringBack's AI denoising uses advanced deep learning models to differentiate noise from real detail, delivering clean, sharp images quickly via our cloud-based engine."
  },
  {
    question: "Do I need to denoise before editing?",
    answer: "Yes—denoising first is recommended. Applying noise reduction before adding contrast or sharpening helps avoid amplifying noise."
  },
  {
    question: "How long does denoising take?",
    answer: "Most images are denoised in under a minute, depending on size and resolution. Larger RAW files may take slightly longer."
  },
  {
    question: "Is my uploaded photo secure?",
    answer: "Absolutely—photos are processed securely in the cloud and can be deleted from our servers after download to ensure privacy."
  },
  {
    question: "Does BringBack preserve fine details when denoising?",
    answer: "Yes. Our AI is trained to remove noise while intelligently retaining key details like textures and edges, avoiding oversmoothing."
  },
  {
    question: "Can I batch denoise multiple photos?",
    answer: "Yes—with a paid plan, you can upload and denoise multiple photos in a single batch for faster workflow."
  },
  {
    question: "What image formats are supported?",
    answer: "BringBack supports JPEG, PNG, and RAW formats for denoising to accommodate various user needs."
  },
  {
    question: "Will denoising affect image quality?",
    answer: "No—instead of degrading quality, denoising enhances clarity and usability, especially for noisy, underexposed, or high ISO shots."
  },
  {
    question: "Is the web app mobile-friendly?",
    answer: "Yes—you can upload and denoise photos directly from your phone using our responsive web interface."
  },
  {
    question: "Can I use BringBack for commercial photos?",
    answer: "Yes—denoised photos can be used for editorial, commercial, or personal projects, with full usage rights included."
  },
  {
    question: "Do I lose color or dynamic range during denoising?",
    answer: "No—our AI preserves color fidelity and dynamic range while effectively reducing noise."
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
      <div className="p-6 flex justify-between items-center gap-4">
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
          <p className="px-6 pb-8 text-gray-600 font-medium leading-relaxed text-base sm:text-lg max-w-3xl">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function DenoiseFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="w-full px-4 sm:px-8 py-24">
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
              Everything you need to know about AI photo denoising and how BringBack works.
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
}
