"use client"

import React, { useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "How does AI photo colorization actually work?",
    answer:
      "Our AI analyzes the grayscale values, textures, and context in your black and white photo to predict realistic colors. It's trained on millions of historical photos and understands how different objects, clothing, and skin tones should be colored based on the era and visual cues in the image.",
  },
  {
    question: "Are the colors historically accurate?",
    answer:
      "Yes! Our AI is trained on historical data and understands period-appropriate colors for different eras. It recognizes clothing styles, architectural elements, and cultural context to apply colors that would have been authentic to the time period of your photo.",
  },
  {
    question: "What types of black and white photos work best?",
    answer:
      "We can colorize virtually any black and white photo: family portraits, wedding photos, military service pictures, childhood photos, historical images, and vintage postcards. The clearer the original image, the better the colorization results, but we can work with photos of varying quality.",
  },
  {
    question: "How much does photo colorization cost?",
    answer:
      "We offer 5 high-quality photo colorizations for just $2.49 - no subscription required. This one-time payment gives you professional-grade colorization in seconds, compared to traditional hand-colorization services that charge $100-500+ per photo.",
  },
  {
    question: "Can I control or adjust the colors?",
    answer:
      "Our AI automatically applies the most historically accurate and natural-looking colors. While the current version doesn't offer manual color adjustment, our intelligent colorization is designed to produce realistic results that honor the original photo's character and historical context.",
  },
  {
    question: "How long does the colorization process take?",
    answer:
      "Most photos are colorized in under 30 seconds. Simply upload your black and white photo and watch it transform into a vibrant color image in real-time. No waiting weeks like traditional hand-colorization services.",
  },
  {
    question: "Will colorization damage or change my original photo?",
    answer:
      "Not at all! We work with a copy of your photo, and the original black and white image remains completely unchanged. You'll receive a new colorized version while keeping your original exactly as it was.",
  },
  {
    question: "Is my family history safe during processing?",
    answer:
      "Absolutely. Your photos are processed securely and uploaded media automatically deleted from our servers within 30 minutes and the generated media is automatically deleted after 7 days. We never store, share, or use your personal photos for any purpose other than restoration or animation. Your memories remain completely private and belong only to you.",
  },
]

const AccordionItem: React.FC<{
  item: { question: string; answer: string }
  isOpen: boolean
  toggle: () => void
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
            ? "bg-[#FF4D00] text-white"
            : "bg-gray-100 text-brand-black group-hover:bg-gray-200"
            }`}
        >
          {isOpen ? <Minus size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
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
  )
}

export default function ColorizeFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="px-4 sm:px-8 py-24">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Header Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-[#FF4D00]">//</span> FAQs <span className="text-[#FF4D00]">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-tight text-brand-black leading-[0.95] mb-8">
              Common <br />
              <span className="text-gray-400">Questions.</span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-md">
              Here are the real questions people ask about bringing their photos to life with color.
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
  )
}
