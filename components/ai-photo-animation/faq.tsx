"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { PRIVACY_COPY } from "@/lib/site-copy";

const faqs = [
  {
    question: "Will it look weird or create the 'uncanny valley' effect?",
    answer:
      "AI motion can sometimes change eyes, teeth, face shape, or expression. Choosing a subtle preset and a clear source photo usually reduces those changes, but you should always preview the face closely before sharing the video.",
  },
  {
    question: "What file types and image quality work best for AI photo animation?",
    answer:
      "You can upload JPG, PNG, and WEBP photos. Clear portraits with visible facial details produce the most realistic animations. If your image is blurry, torn, or faded, run it through restoration first to improve facial landmarks before animation.",
  },
  {
    question: "Which animation styles can I choose from?",
    answer:
      "You can choose from Gentle Smile, Smile + Wave, Subtle Blink + Head Tilt, Smile + Look Around, Warm Gaze, Soft Nod, Peaceful Presence, Loving Recognition, and Gentle Talking. Each style is designed for subtle, respectful, natural movement.",
  },
  {
    question: "Can I animate a photo with multiple people in it?",
    answer:
      "You can upload a group photo, but the result is less predictable than a portrait with one clear primary face. People may move differently or facial details may change, so review every visible person in the generated clip.",
  },
  {
    question: "What happens to my photos after I upload them? Is my data used for AI training?",
    answer:
      PRIVACY_COPY.faq,
  },
  {
    question: "Can I animate low-quality, blurry, or very old photos?",
    answer:
      "The model needs visible facial features to guide movement. If scratches, blur, fading, or a very small face obscure those features, restore or crop the image first. Restoration can provide a clearer reference, but it cannot guarantee an exact animation.",
  },
  {
    question: "Can I choose which person in a group photo gets animated?",
    answer:
      "Currently, our AI automatically detects the most suitable face for animation in a photo. We recommend cropping the photo to focus on the individual you'd like to animate before uploading to ensure the best result.",
  },
  {
    question: "Can I use the animated videos for commercial purposes?",
    answer:
      "BringBack's standard Terms cover personal, non-commercial use unless otherwise agreed. Only upload photos you own or have permission to use, and contact support before using an animation commercially.",
  },
  {
    question: "How many credits does animation cost?",
    answer:
      "Each animation uses 10 credits. The Restoration Starter pack ($4.99 / 4 credits) is not enough for animation. Use the Value Pack ($9.99 / 20 credits) or Family Pack ($21.99 / 60 credits).",
  },
  {
    question: "What's the difference between your service and free animation apps?",
    answer:
      "BringBack offers nine selectable motion presets, pay-once credits, and a My Media account where generated videos remain available until you delete them. Compare output quality, pricing, and each provider's privacy policy before choosing a tool.",
  },
  {
    question: "Will the animation add sound to my photo?",
    answer:
      "No. Photo Animation creates a silent five-second video. The Gentle Talking preset adds speech-like facial movement but does not generate or recreate a voice.",
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
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black mb-8">
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
            <div className="bg-brand-surface p-2 rounded-[1.8rem]">
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
