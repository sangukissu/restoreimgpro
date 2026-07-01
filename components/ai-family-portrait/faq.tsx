"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | string[];
}

const FAQS: FAQItem[] = [
  {
    question: "Can I create a family photo from individual photos?",
    answer: "Yes. Upload separate portraits of 2 to 4 people and BringBack composes them into one realistic studio-quality family photo. It is useful when relatives live far apart, when generations never met, or when you only have one good photo of each person."
  },
  {
    question: "Will the final photo look fake or like a collage?",
    answer: "BringBack is designed to avoid the cut-and-paste look. The AI creates a new studio portrait with consistent lighting, color, scale, texture, and perspective across the people you upload."
  },
  {
    question: "Does the AI change what my family members look like?",
    answer: "The family portrait generator is built to preserve recognizable facial likeness, age, expression, and key details from the uploaded references. Results still depend on photo quality, so clear face photos produce the strongest likeness."
  },
  {
    question: "What are the best photos to upload?",
    answer: [
      "Use JPG, PNG, or WebP images under 20MB each.",
      "Choose clear, well-lit face photos where the person is looking toward the camera.",
      "Avoid heavy shadows, sunglasses, covered faces, or very tiny faces in a large group photo.",
      "For old, torn, faded, or blurry images, run Old Photo Restoration first and upload the restored version."
    ]
  },
  {
    question: "How many people can I combine into one group photo?",
    answer: "You can combine up to 4 individual photos into one family portrait. For 3 to 4 people, wider ratios such as 4:3 or 16:9 usually give the AI more space for a natural arrangement."
  },
  {
    question: "Can I combine black-and-white photos with color photos?",
    answer: "Yes. You can combine black-and-white and color photos in one portrait. If the older photo is damaged, faded, scratched, or blurry, restoring it first gives the generator a much better likeness reference."
  },
  {
    question: "Can I add a deceased person to a family photo?",
    answer: "Yes. Many families use BringBack to create respectful memorial portraits by combining a loved one who has passed with current family members. The goal is a warm keepsake, not a novelty edit."
  },
  {
    question: "Can I create a generational portrait with ancestors?",
    answer: "Yes. You can combine a grandparent or ancestor from an old portrait with children or grandchildren from modern photos. This is one of the most meaningful uses of the tool because it creates a family image that was never physically possible."
  },
  {
    question: "Can I choose the background or aspect ratio?",
    answer: "Yes. BringBack supports 1:1, 3:4, 4:3, and 16:9 canvases, plus studio backdrops such as matte black, neutral gray, warm beige, subtle gradient, dark brown vignette, and gentle bokeh."
  },
  {
    question: "Does this replace Old Photo Restoration?",
    answer: "No. Family Portrait is for composing people into one new image. Old Photo Restoration is for repairing scratches, tears, fading, blur, and damage. If your source image is old or low quality, restore it first, then use it here."
  },
  {
    question: "Is BringBack a free family portrait creator?",
    answer: "BringBack is a premium AI family photo generator. It costs 2 credits because it focuses on realistic likeness, studio composition, high-resolution output, and private account storage rather than quick collage-style merging."
  },
  {
    question: "How is this different from Photoshop or a manual artist?",
    answer: "Manual compositing can take hours or days because the editor has to cut out people, balance lighting, repaint shadows, and match perspective. BringBack automates that workflow and creates a studio-style result in minutes for 2 credits."
  },
  {
    question: "Is this better than free apps that merge photos?",
    answer: "Free merge apps often create flat collages or obvious pasted composites. BringBack is built for family keepsakes, with likeness preservation, studio composition, canvas choices, and a private account workflow."
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

        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 cursor-pointer ${isOpen ? 'bg-brand-orange text-white' : 'bg-gray-100 text-brand-black group-hover:bg-gray-200'
          }`}>
          {isOpen ? <Minus size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
        </div>
      </div>

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
    <section id="faqs" className="w-full px-4 sm:px-8 py-24 ">
      <div className="max-w-[1320px] mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> FAQs <span className="text-brand-orange">//</span>
            </div>

            <h2 className="text-[3.5rem] sm:text-[4rem] font-extrabold tracking-tight text-brand-black leading-[0.95] mb-8">
              Questions <br />
              <span className="text-gray-400">& answers.</span>
            </h2>

            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-md">
              Practical answers for creating a natural AI family portrait from separate photos.
            </p>
          </div>

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
}