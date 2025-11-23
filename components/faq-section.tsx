"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How does AI photo restoration actually work?",
      answer:
        "Our AI analyzes millions of photo patterns to understand how damage occurs and how to reverse it. It identifies faces, textures, and objects, then intelligently reconstructs missing or damaged areas while preserving the original character of your photo. The process happens in seconds, but the technology behind it represents years of machine learning development.",
    },
    {
      question: "How does AI photo animation work?",
      answer:
        "Our AI animation technology analyzes facial features and expressions in your photos to create natural, lifelike movements. It can generate subtle animations like smiling, waving, blinking, and head tilts while maintaining the original character and authenticity of the person in the photo.",
    },
    {
      question: "What types of photo damage can BringBack fix?",
      answer:
        "We can restore virtually any type of damage: tears, scratches, water stains, fading, yellowing, blur, darkness, cracks, and missing pieces. Our AI handles both physical damage (like tears) and quality issues (like blur or low resolution). If you can see some of the original photo, we can likely restore it.",
    },
    {
      question: "What animation styles are available?",
      answer:
        "We offer three animation presets: Smile + Wave (natural smile with gentle wave gesture), Subtle Blink + Head Tilt (soft blinking with slight head movement), and Smile + Look Around (light smile with curious gaze movement). Each animation is designed to bring your photos to life naturally.",
    },
    {
      question: "How much do photo restoration and animation cost?",
      answer:
        "Photo restoration: We offer 5 high-quality photo restorations for just $4.99 - no subscription required. Photo animation: Each animation costs 10 credits (available through our pricing plans: Plus $9.99). Both services deliver professional-grade results in seconds, compared to traditional services that charge $50-200 per photo and take weeks to complete.",
    },

    {
      question: "Is my personal data and photos safe?",
      answer:
        "Absolutely. Your photos are processed securely and uploaded media automatically deleted from our servers within 30 minutes and the generated media is automatically deleted after 7 days. We never store, share, or use your personal photos for any purpose other than restoration or animation. Your memories remain completely private and belong only to you.",
    },
    {
      question: "How long does the restoration and animation process take?",
      answer:
        "Photo restoration takes under 30 seconds, while photo animation typically takes 30-60 seconds depending on complexity. Both processes happen in real-time with no waiting days or weeks like traditional services.",
    },
    {
      question: "What if I'm not satisfied with the results?",
      answer:
        "We're confident you'll love the results, but if you're not completely satisfied, we offer a full refund within 30 days. Our AI produces consistently high-quality results for both restoration and animation, but we stand behind every service with our satisfaction guarantee.",
    },
    {
      question: "Can I use restored and animated photos commercially?",
      answer:
        "Yes! Once processed, the photos and videos are yours to use however you'd like - personal use, commercial projects, printing, sharing, or selling. We don't retain any rights to your enhanced content. They're your memories, enhanced and returned to you.",
    },
    {
      question: "What file formats do you support?",
      answer:
        "We support all common image formats including JPG, PNG, and WEBP for both restoration and animation. You can upload photos up to 50MB in size. Restored photos are delivered in high-resolution PNG format, while animations are provided as MP4 videos.",
    },
    {
      question: "Can you animate very old or damaged photos?",
      answer:
        "For best animation results, we recommend restoring damaged photos first, then animating them. Our AI works best with clear facial features and good image quality. However, we can often animate moderately damaged photos with visible faces.",
    },
    {
      question: "How does this compare to manual photo restoration?",
      answer:
        "Traditional restoration can take weeks and cost $50-200 per photo. Our AI delivers comparable or better results in seconds for a fraction of the cost. Animation would be nearly impossible manually, but our AI creates natural movements that bring your memories to life instantly.",
    },
    {
      question: "Can you restore very old or severely damaged photos?",
      answer:
        "Yes! Our AI excels at restoring even severely damaged photos from decades ago. The more of the original photo that's visible, the better the results. Even if large portions are missing or damaged, our AI can often reconstruct them based on surrounding context and learned patterns.",
    },
    {
      question: "What is old photo restoration?",
      answer:
        "Old photo restoration uses AI to automatically repair faded, torn, scratched, or discolored photographs—returning them to vibrant, clear versions that can then be animated to bring your ancestors to life.",
    },
    {
      question: "Are my uploaded photos kept private?",
      answer:
        "Absolutely. Your photos are processed securely and uploaded media automatically deleted from our servers within 30 minutes and the generated media is auotmatically deleted after 7 days. We never store, share, or use your personal photos for any purpose other than restoration or animation. Your memories remain completely private and belong only to you.",
    },

    {
      question: "Can I print or enlarge restored photos?",
      answer:
        "Definitely. Restored images maintain high resolution and quality, ideal for printing or enlargements. Animated videos can be shared digitally or converted to GIFs for various uses.",
    },
  ]

  return (
    <section className="px-4 pt-24 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 mb-6">
            <HelpCircle className="w-4 h-4 mr-2" />
            Got Questions?
          </div>
          <h2 className=" text-4xl lg:text-5xl text-black mb-6 leading-tight">
            Frequently asked questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about AI photo restoration and how BringBack works.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* First Column */}
          <div className="space-y-4">
            {faqs.slice(0, 7).map((faq, index) => (
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

          {/* Second Column */}
          <div className="space-y-4">
            {faqs.slice(7).map((faq, index) => {
              const actualIndex = index + 7;
              return (
                <div
                  key={actualIndex}
                  className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setOpenIndex(openIndex === actualIndex ? null : actualIndex)}
                  >
                    <h3 className="text-lg font-semibold text-black pr-4">{faq.question}</h3>
                    <div className="flex-shrink-0">
                      {openIndex === actualIndex ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      openIndex === actualIndex ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </section>
  )
}
