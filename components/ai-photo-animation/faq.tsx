"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Will it look weird or create the 'uncanny valley' effect?",
    answer:
      "This is the most common concern. Our AI is specifically trained to produce gentle, respectful, and natural movements. We focus on subtle smiles, blinks, and head tilts—not exaggerated or unrealistic motion. The goal is a touching moment of recognition, not a deepfake.",
  },
  {
    question: "Can I animate a photo with multiple people in it?",
    answer:
      "Our AI is designed to focus on and animate one primary face in a photograph to ensure the highest quality and most natural result. For group photos, the AI will typically identify and animate the most prominent or clearest face.",
  },
  {
    question: "What happens to my photos after I upload them? Is my data used for AI training?",
    answer:
      "Absolutely not. Your privacy is our top priority. Your uploaded photos are processed securely and automatically deleted from our servers within 30 minutes. The final animated video is deleted after 7 days. We never use your personal photos for AI training or any other purpose. Your memories remain yours alone.",
  },
  {
    question: "Can I animate low-quality, blurry, or very old photos?",
    answer:
      "For the best animation results, the AI needs to clearly identify facial features. We highly recommend using our Photo Restoration tool first to repair any damage, fix blurriness, and enhance clarity. Animating a restored photo yields dramatically more lifelike and beautiful results.",
  },
  {
    question: "Can I choose which person in a group photo gets animated?",
    answer:
      "Currently, our AI automatically detects the most suitable face for animation in a photo. We recommend cropping the photo to focus on the individual you'd like to animate before uploading to ensure the best result.",
  },
  {
    question: "Can I use the animated videos for commercial purposes?",
    answer:
      "Yes. Once you download the animated video, it is yours to use however you wish. This includes personal sharing, social media, and even commercial projects. You retain full ownership of your memories.",
  },
  {
    question: "What's the difference between your service and free animation apps?",
    answer:
      "The difference lies in quality, privacy, and respect for the subject. Free tools often produce lower-quality, unnatural animations and may use your photos to train their AI models. Our service provides subtle, high-definition animations while guaranteeing the complete privacy and security of your cherished photos.",
  },
  {
    question: "Will the animation add sound to my photo?",
    answer:
      "Our service is focused purely on creating a silent, moving portrait. There is no audio added, which we believe creates a more timeless and respectful final video.",
  },
];

const AccordionItem: React.FC<{
  item: { question: string; answer: string };
  isOpen: boolean;
  toggle: () => void;
}> = ({ item, isOpen, toggle }) => {
  return (
    <div
      onClick={toggle}
      className={`bg-white rounded-[1.5rem] overflow-hidden transition-all duration-300 cursor-pointer group ${isOpen ? "shadow-sm" : "hover:bg-gray-50"
        }`}
    >
      <div className="p-6 flex justify-between items-center gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-brand-black leading-tight select-none">
          {item.question}
        </h3>

        {/* Toggle Button */}
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 cursor-pointer ${isOpen
            ? "bg-brand-orange text-white"
            : "bg-gray-100 text-brand-black group-hover:bg-gray-200"
            }`}
        >
          {isOpen ? (
            <Minus size={20} strokeWidth={2.5} />
          ) : (
            <Plus size={20} strokeWidth={2.5} />
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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

export default function AIAnimationFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-4 sm:px-8 py-24">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Header Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> FAQs{" "}
              <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-tight text-brand-black leading-[0.95] mb-8">
              Common <br />
              <span className="text-gray-400">Questions.</span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-md">
              Here are the real questions people ask about bringing their photos to life.
            </p>
          </div>

          {/* Questions Column - The Frame */}
          <div className="lg:col-span-7">
            <div className="bg-brand-surface p-3 rounded-[1.8rem]">
              <div className="flex flex-col gap-3">
                {faqs.map((faq, index) => (
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