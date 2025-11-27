
"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Can AI restore photos with water damage or mold stains?",
    answer: "Yes. BringBack’s AI is trained to distinguish between the original photo content and surface damage like water stains, ink spills, or mold spots. The tool digitally removes the stain and uses context-aware technology to reconstruct the missing parts of the image underneath."
  },
  {
    question: "My old photos are very blurry. Can you sharpen faces?",
    answer: "Absolutely. We use specialized facial enhancement algorithms. The AI detects facial landmarks (eyes, nose, mouth) even in blurry or out-of-focus images and reconstructs high-definition details, making faces look sharp and clear as if they were taken with a modern camera."
  },
  {
    question: "How do I repair a torn photo or one with scratches and creases?",
    answer: "You don't need manual tools. Once you scan and upload your torn photo, our 'Scratch & Tear Removal' model automatically identifies cracks and white creases. It fills these gaps by analyzing the surrounding pixels, seamlessly stitching the photo back together digitally."
  },
  {
    question: "Can I restore a photo and colorize it at the same time?",
    answer: "Yes. BringBack acts as an all-in-one restoration suite. You can repair the physical damage (scratches/tears) and then use our AI Colorizer to turn black-and-white photos into realistic color images in a single workflow."
  },
  {
    question: "Is it safe to upload my private family photos?",
    answer: "Your privacy is our priority. We use advanced encryption for all uploads. Furthermore, BringBack automatically deletes your images from our servers after a short period (usually 24 hours) to ensure your personal memories remain private and are not used for anything else."
  },
  {
    question: "What is the best resolution to scan old photos for restoration?",
    answer: "For the best AI results, we recommend scanning your photos at 300 DPI to 600 DPI (dots per inch). This ensures the AI has enough pixel data to accurately sharpen details and remove grain. If you don't have a scanner, you can use a high-quality scanning app on your smartphone in a well-lit room."
  },
  {
    question: "Will the restored photo be good enough to print?",
    answer: "Yes. Our restoration process includes AI Upscaling. This increases the resolution of your small wallet-sized photos or old snapshots, allowing you to print them as 4x6, 5x7, or even 8x10 portraits without pixelation or blur."
  },
  {
    question: "Is there a free way to restore old photos online?",
    answer: "BringBack offers a free trial so you can test the power of our AI restoration before committing. You can upload a photo to see the 'Before vs. After' results instantly. Premium plans are available for high-resolution downloads without watermarks."
  },
  {
    question: "How long does the AI restoration process take?",
    answer: "Unlike manual restoration services which can take days or weeks, BringBack restores photos in 5 to 10 seconds. It is an automated, instant process, allowing you to restore entire albums in minutes."
  },
  {
    question: "Can I animate my photo after restoring it?",
    answer: "Yes! We highly recommend restoring your photo first to remove scratches and sharpen the face. Once the photo is clean, you can use our Live Portrait feature to make your ancestors smile, blink, and move realistically."
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
