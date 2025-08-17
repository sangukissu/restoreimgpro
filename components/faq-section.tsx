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
      question: "What types of photo damage can BringBack fix?",
      answer:
        "We can restore virtually any type of damage: tears, scratches, water stains, fading, yellowing, blur, darkness, cracks, and missing pieces. Our AI handles both physical damage (like tears) and quality issues (like blur or low resolution). If you can see some of the original photo, we can likely restore it.",
    },
    {
      question: "How much does photo restoration cost?",
      answer:
        "We offer 5 high-quality photo restorations for just $2 - no subscription required. This one-time payment gives you professional-grade results in seconds. Compare that to traditional photo restoration services that charge $50-200 per photo and take weeks to complete.",
    },
    {
      question: "Is my personal data and photos safe?",
      answer:
        "Absolutely. Your photos are processed securely and automatically deleted from our servers within 30 minutes. We never store, share, or use your personal photos for any purpose other than restoration. Your memories remain completely private and belong only to you.",
    },
    {
      question: "How long does the restoration process take?",
      answer:
        "Most photos are restored in under 30 seconds. Upload your photo, and watch the transformation happen in real-time. No waiting days or weeks like traditional restoration services - you get professional results instantly.",
    },
    {
      question: "What if I'm not satisfied with the results?",
      answer:
        "We're confident you'll love the results, but if you're not completely satisfied, we offer a full refund within 30 days. Our AI produces consistently high-quality results, but we stand behind every restoration with our satisfaction guarantee.",
    },
    {
      question: "Can I use restored photos commercially?",
      answer:
        "Yes! Once restored, the photos are yours to use however you'd like - personal use, commercial projects, printing, sharing, or selling. We don't retain any rights to your restored images. They're your memories, enhanced and returned to you.",
    },
    {
      question: "What file formats do you support?",
      answer:
        "We support all common image formats including JPG, PNG, TIFF, and BMP. You can upload photos up to 50MB in size. The restored photo will be delivered in high-resolution PNG format, perfect for printing or digital use.",
    },
    {
      question: "How does this compare to manual photo restoration?",
      answer:
        "Traditional restoration can take weeks and cost $50-200 per photo. Our AI delivers comparable or better results in seconds for a fraction of the cost. While manual restoration has its place for extremely rare or historically significant photos, our AI is perfect for family photos and personal memories.",
    },
    {
      question: "Can you restore very old or severely damaged photos?",
      answer:
        "Yes! Our AI excels at restoring even severely damaged photos from decades ago. The more of the original photo that's visible, the better the results. Even if large portions are missing or damaged, our AI can often reconstruct them based on surrounding context and learned patterns.",
    },
    {
      question: "What is old photo restoration?",
      answer:
        "Old photo restoration uses AI to automatically repair faded, torn, scratched, or discolored photographs—returning them to vibrant, clear versions.",
    },
    {
      question: "How much does it cost to restore an old photo using BringBack?",
      answer:
        "BringBack offers a free trial to restore your first photo. Paid plans for higher resolution or batch processing are available through our pricing page.",
    },
    {
      question: "Can BringBack repair water-damaged or sun-faded photos?",
      answer:
        "Yes, our AI module is trained to handle common damage like water stains, fading, scratches, and sun-exposure effects.",
    },
    {
      question: "Is the restoration fully automatic?",
      answer:
        "Absolutely. Upload your image, and our AI automatically restores color, sharpness, and detail—no manual intervention needed.",
    },
    {
      question: "How long does it take to restore a photo?",
      answer:
        "Most photos are fully restored in under 60 seconds, depending on image size and server load.",
    },
    {
      question: "Can BringBack restore scratched or torn old photos?",
      answer:
        "Yes. Our AI handles structured defects like scratches and tears and recovers details while maintaining realism.",
    },
    {
      question: "Is the restoration quality better than manual editing?",
      answer:
        "AI restoration is faster and highly effective for most photos. It automates complex tasks—yet keeps sentimental accuracy—often in seconds rather than hours.",
    },
    {
      question: "Are my uploaded photos kept private?",
      answer:
        "Yes. Photos are processed securely, and you may choose to delete them from our servers after download for privacy.",
    },
    {
      question: "What image formats does BringBack support?",
      answer:
        "We support common formats like JPEG, PNG, and TIFF to ensure compatibility with scanned or digital old photographs.",
    },
    {
      question: "Can I restore multiple old photos at once?",
      answer:
        "Yes, with a paid plan, batch restoration is available so you can process multiple images together.",
    },
    {
      question: "Can I print or enlarge restored photos?",
      answer:
        "Definitely. Restored images maintain high resolution and quality, ideal for printing or enlargements.",
    },
    {
      question: "Are restored photos usable for commercial purposes?",
      answer:
        "Yes. You retain full rights to restored images and may use them for personal, editorial, or commercial purposes.",
    },
  ]

  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 mb-6">
            <HelpCircle className="w-4 h-4 mr-2" />
            Got Questions?
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">Frequently asked questions</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about AI photo restoration and how BringBack works.
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
