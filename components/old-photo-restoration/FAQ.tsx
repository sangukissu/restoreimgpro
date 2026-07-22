
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
    answer: "Photos are processed securely for restoration. Generated files stay in your account until you delete them from My Media. We do not use your family photos to train general-purpose AI models. See our Privacy Policy for processors and retention."
  },
  {
    question: "Can I restore without colorizing?",
    answer: "Yes. Use restore-only to keep the original black-and-white, sepia, or color character. Colorize only when you explicitly want color — AI color is an interpretation, not historical proof of original dyes."
  },
  {
    question: "Will AI change the face of someone I remember?",
    answer: "When facial detail is missing, damaged, or very low resolution, AI may reconstruct plausible features rather than recover the exact original face. Always compare side-by-side before you download or print."
  },
  {
    question: "How much does one restoration cost?",
    answer: "One restoration uses 1 credit. The Restoration Starter pack is $4.99 for 4 credits. Credits never expire. Failed generations that the system can detect may be refunded automatically."
  },
  {
    question: "What is the best way to scan old photos?",
    answer: "A flat scan or a well-lit phone scan on a dark surface works well. Avoid glare from glass frames when you can. Higher detail helps, but we do not require a specific DPI claim — upload the clearest file you have."
  },
  {
    question: "Will the restored photo be good enough to print?",
    answer: "Many restorations print well at common sizes (for example 4×6 or 5×7). Output quality depends on the input resolution and damage. Check the downloaded pixel dimensions before ordering large prints."
  },
  {
    question: "Can I animate my photo after restoring it?",
    answer: "Yes. Restoring first usually improves faces for animation. Animation costs 10 credits (not covered by the 4-credit Starter pack alone)."
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
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black mb-8">
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
            <div className="bg-brand-surface p-2 rounded-[1.8rem]">
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
