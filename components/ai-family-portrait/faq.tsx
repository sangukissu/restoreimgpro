"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | string[];
}

const FAQS: FAQItem[] = [
  {
    question: "Will the final photo look fake or like a bad photoshop?",
    answer: "No. Our AI's greatest strength is its ability to create consistent lighting, color, and texture across all individuals, blending them into a cohesive and natural-looking portrait."
  },
  {
    question: "Does the AI change what my family members look like?",
    answer: "Absolutely not. The feature is designed to preserve the exact likeness and identity of each person. We do not perform any facial swapping or alteration."
  },
  {
    question: "What are the best photos to upload for this feature?",
    answer: "For the best results, use clear, well-lit, front-facing portraits where the face is not obscured. While our AI is versatile, higher quality input photos will yield a more stunning final portrait."
  },
  {
    question: "Can I combine black-and-white photos with color photos?",
    answer: "Yes. This is one of the most powerful uses of the feature. The AI will intelligently interpret the black-and-white photos and render them in a style that harmonizes beautifully with the color photos in the final portrait."
  },
  {
    question: "How do you combine photos into one picture without it looking fake?",
    answer: "This is the core of our technology. Our AI goes beyond simple 'cut and paste.' It acts like a digital artist by re-rendering the entire scene. It analyzes each person and creates a new, unified lighting and color scheme, so everyone looks like they were in the same room."
  },
  {
    question: "Can the AI fix old, faded, or damaged photos before combining them?",
    answer: "While this tool is focused on composition, we highly recommend using our Old Photo Restoration feature first for any damaged or faded images. Restoring a photo before adding it to your family portrait will yield dramatically better and more lifelike results."
  },
  {
    question: "Can I add a deceased person to a family photo?",
    answer: "Yes. This is one of the most meaningful uses of our tool. You can create a beautiful memorial portrait by combining a photo of a loved one who has passed with a current family picture. The AI will blend them together respectfully."
  },
  {
    question: "Is it possible to create a generational photo with ancestors?",
    answer: "Yes. You can unite generations that never met. Combine a photo of a grandparent in their youth with a photo of a grandchild. Our AI can even harmonize black-and-white photos with color ones."
  },
  {
    question: "What are the best photos to use for an AI family portrait?",
    answer: [
      "Clear, front-facing portraits work best.",
      "Ensure the face is well-lit and not covered by shadows or objects.",
      "Similar head sizes across the photos can help the AI create a more balanced composition.",
      "Simple backgrounds are preferred, as they allow the AI to focus on the people."
    ]
  },
  {
    question: "How many people can I combine into one group photo?",
    answer: "Currently, you can combine up to 4 individual photos into a single family portrait. For groups of 3–4 people, we recommend using a wider aspect ratio (like 4:3 or 16:9) to give the AI enough space for a beautiful composition."
  },
  {
    question: "Can I change the clothes or background in the photos?",
    answer: "This feature is focused on composing the subjects into a new portrait. It does not perform clothing changes. The AI generates a new, simple studio-style background to ensure the final image is cohesive and focuses entirely on your family members."
  },
  {
    question: "How is this different from using Photoshop or hiring an artist?",
    answer: "The primary differences are speed, cost, and accessibility. A manual edit in Photoshop can take a professional artist hours or days and cost $50–$200+. Our AI delivers a comparable, high-quality result in under a minute for a fraction of the cost."
  },
  {
    question: "Is this better than free apps that merge photos?",
    answer: "Yes, in two critical ways: quality and privacy. Free tools often produce low-quality images with inconsistent lighting that look obviously fake. More importantly, they may use your private family photos for data collection. Our service provides a professional-grade, artistic result while guaranteeing the absolute privacy of your cherished memories."
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
          <div className="px-6 pb-8 text-gray-600 font-medium leading-relaxed text-base sm:text-lg max-w-3xl">
            {Array.isArray(item.answer) ? (
              <ul className="list-disc list-inside space-y-2">
                {item.answer.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              item.answer
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FamilyPortraitFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
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
              Everything you need to know about creating a natural, unified portrait from separate photos.
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