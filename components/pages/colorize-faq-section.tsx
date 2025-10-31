"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ColorizeFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

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
        "Absolutely. Your photos are processed securely and uploaded media automatically deleted from our servers within 30 minutes and the generated media is auotmatically deleted after 7 days. We never store, share, or use your personal photos for any purpose other than restoration or animation. Your memories remain completely private and belong only to you.",
    },
  ]

  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 mb-6">
            <Palette className="w-4 h-4 mr-2" />
            Got Questions?
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-black mb-6">Frequently asked questions</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about AI photo colorization and how BringBack works.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-black pr-4">{faq.question}</h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                )}
              >
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
