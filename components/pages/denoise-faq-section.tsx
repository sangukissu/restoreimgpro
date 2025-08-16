"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DenoiseFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How does AI photo denoising actually work?",
      answer:
        "Our AI analyzes the patterns of noise in your photo and distinguishes between unwanted grain and important image details. It uses advanced algorithms trained on millions of images to selectively remove noise while preserving textures, edges, and fine details that matter to your photo's quality.",
    },
    {
      question: "What types of noise can BringBack remove?",
      answer:
        "We can remove virtually any type of digital noise: high-ISO grain, color noise, luminance noise, digital artifacts from old cameras, compression artifacts, and low-light noise. Our AI handles both uniform noise patterns and complex, irregular noise with equal effectiveness.",
    },
    {
      question: "Will denoising make my photos look plastic or fake?",
      answer:
        "No! Our AI is specifically designed to maintain natural texture and detail while removing noise. Unlike basic noise reduction tools that can make photos look over-smoothed or artificial, our system preserves skin texture, fabric details, and other important elements.",
    },
    {
      question: "How much does photo denoising cost?",
      answer:
        "We offer 5 high-quality photo denoising cleanups for just $2 - no subscription required. This one-time payment gives you professional-grade noise removal in seconds, compared to traditional photo editing services that charge $30-100+ per photo.",
    },
    {
      question: "Can you clean very grainy or noisy photos?",
      answer:
        "Yes! Our AI excels at removing even heavy noise from challenging photos like high-ISO night shots or old digital camera images. While results depend on the original photo, we can often make severely noisy images look clean and professional.",
    },
    {
      question: "How long does the denoising process take?",
      answer:
        "Most photos are processed and cleaned in under 30 seconds. Simply upload your noisy photo and watch the grain disappear in real-time. No waiting hours or days like traditional photo editing services.",
    },
    {
      question: "Is my data safe during processing?",
      answer:
        "Absolutely. Your photos are processed securely and automatically deleted from our servers within 30 minutes. We never store, share, or use your personal photos for any purpose other than denoising. Your memories remain completely private.",
    },
    {
      question: "What if the results aren't what I expected?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not satisfied with the denoising results, we'll refund your purchase - no questions asked. We're confident in our AI's ability to clean your photos, but we stand behind every enhancement.",
    },
    {
      question: "What does denoising a photo mean?",
      answer:
        "Denoising removes unwanted grain or noise from photos—especially from low-light or high-ISO images—while preserving fine details.",
    },
    {
      question: "How does AI denoising work on BringBack?",
      answer:
        "BringBack's AI denoising uses advanced deep learning models to differentiate noise from real detail, delivering clean, sharp images quickly via our cloud-based engine.",
    },
    {
      question: "Do I need to denoise before editing?",
      answer:
        "Yes—denoising first is recommended. Applying noise reduction before adding contrast or sharpening helps avoid amplifying noise.",
    },
    {
      question: "How long does denoising take?",
      answer:
        "Most images are denoised in under a minute, depending on size and resolution. Larger RAW files may take slightly longer.",
    },
    {
      question: "Is my uploaded photo secure?",
      answer:
        "Absolutely—photos are processed securely in the cloud and can be deleted from our servers after download to ensure privacy.",
    },
    {
      question: "Does BringBack preserve fine details when denoising?",
      answer:
        "Yes. Our AI is trained to remove noise while intelligently retaining key details like textures and edges, avoiding oversmoothing.",
    },
    {
      question: "Can I batch denoise multiple photos?",
      answer:
        "Yes—with a paid plan, you can upload and denoise multiple photos in a single batch for faster workflow.",
    },
    {
      question: "What image formats are supported?",
      answer:
        "BringBack supports JPEG, PNG, and RAW formats for denoising to accommodate various user needs.",
    },
    {
      question: "Will denoising affect image quality?",
      answer:
        "No—instead of degrading quality, denoising enhances clarity and usability, especially for noisy, underexposed, or high ISO shots.",
    },
    {
      question: "Is the web app mobile-friendly?",
      answer:
        "Yes—you can upload and denoise photos directly from your phone using our responsive web interface.",
    },
    {
      question: "Can I use BringBack for commercial photos?",
      answer:
        "Yes—denoised photos can be used for editorial, commercial, or personal projects, with full usage rights included.",
    },
    {
      question: "Do I lose color or dynamic range during denoising?",
      answer:
        "No—our AI preserves color fidelity and dynamic range while effectively reducing noise.",
    },
  ]

  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Got Questions?
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">Frequently asked questions</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about AI photo denoising and how BringBack works.
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
