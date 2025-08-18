"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Focus } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DeblurFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How can I Unblur a photo online?",
      answer:
        "You can Unblur a photo online instantly using BringBack. Simply upload your blurry photo, and our AI automatically restores it with improved sharpness and clarity.",
    },
    {
      question: "Is BringBack free to use for photo Unblurring?",
      answer:
        "BringBack offers a free trial to Unblur photos. For higher resolution results and batch processing, you can choose from affordable paid plans.", 
    },
    {
      question: "What types of blurry photos can BringBack fix?",
      answer:
        "BringBack can fix motion blur, out-of-focus images, low-light photos, and old scanned pictures that appear soft or unclear.",
    },
    {
      question: "Do I need to download any software to Unblur photos?",
      answer:
        "No downloads are required. BringBack is a web app that works directly in your browser.",
    },
    {
      question: "Can BringBack Unblur old scanned family photos?",
      answer:
        "Yes. BringBack specializes in restoring and Unblurring old scanned photos, making them look clearer and more detailed.",
    },
    {
      question: "How fast does it take to Unblur a photo?",
      answer:
        "Most photos are processed in under 30 seconds, depending on image size and resolution.",
    },
    {
      question: "Is my uploaded photo safe on BringBack?",
      answer:
        "Yes. Uploaded photos are processed securely and can be deleted after restoration to protect your privacy.",
    },
    {
      question: "Does BringBack work on mobile?",
      answer:
        "Yes. You can upload and deblur photos directly from your phone using BringBack's mobile-friendly web app.",
    },
    {
      question: "Can I Unblur multiple photos at once?",
      answer:
        "Yes. With a paid plan, BringBack supports batch Unblurring so you can restore multiple images in one go.",
    },
    {
      question: "What image formats does BringBack support?",
      answer:
        "BringBack supports JPEG, PNG, and WebP image formats for photo Unblurring and restoration.",
    },
    {
      question: "Will Unblurring reduce the quality of my photo?",
      answer:
        "No. BringBack enhances sharpness and details while preserving the original photo quality.",
    },
    {
      question: "Can BringBack fix both blur and noise in photos?",
      answer:
        "Yes. The AI engine reduces noise while deblurring, giving you a cleaner, sharper final image.",
    },
    {
      question: "Is AI deblurring better than manual editing?",
      answer:
        "For most cases, AI deblurring is faster, easier, and more effective than manual Photoshop edits, especially for everyday photos.",
    },
    {
      question: "Does BringBack support high-resolution photo deblurring?",
      answer:
        "Yes. BringBack can deblur photos up to very high resolutions, making it ideal for prints and professional use.",
    },
    {
      question: "Can I use BringBack to Unblur photos for commercial projects?",
      answer:
        "Yes. You are free to use Unblurred and restored photos from BringBack for both personal and commercial purposes.",
    },
    {
      question: "How does AI photo Unblurring actually work?",
      answer:
        "Our AI analyzes the type and pattern of blur in your photo, then applies sophisticated algorithms to reverse the blurring process. It understands the physics of how motion blur, focus blur, and camera shake affect images, allowing it to reconstruct sharp details from blurry areas while preserving the natural look of your photo.",
    },
    {
      question: "What types of blur can BringBack fix?",
      answer:
        "We can fix virtually any type of blur: motion blur from moving subjects or camera shake, out-of-focus blur from missed autofocus, low-light softness, and general image blur. Our AI handles both uniform blur (like camera shake) and complex blur patterns (like moving subjects) with equal effectiveness.",
    },
    {
      question: "Will my photos look artificial after Unblurring?",
      answer:
        "No! Our AI is specifically trained to enhance sharpness while preserving the natural texture and character of your photos. Unlike basic sharpening filters that can create harsh edges or artifacts, our system intelligently enhances details without making images look over-processed or fake.",
    },
    {
      question: "How much does photo deblurring cost?",
      answer:
        "We offer 5 high-quality photo deblurring enhancements for just $2 - no subscription required. This one-time payment gives you professional-grade results in seconds, compared to traditional photo editing services that charge $50-200+ per photo.",
    },
    {
      question: "Can you fix severely blurry photos?",
      answer:
        "Yes! Our AI excels at recovering details from even heavily blurred images. While the results depend on the original photo quality, we can often restore clarity to photos that seem completely unusable. The more detail visible in the original blur, the better the results.",
    },
    {
      question: "How long does the deblurring process take?",
      answer:
        "Most photos are processed and deblurred in under 30 seconds. Simply upload your blurry photo and watch it transform into a sharp, clear image in real-time. No waiting hours or days like traditional photo editing services.",
    },
    {
      question: "Is my data safe during processing?",
      answer:
        "Absolutely. Your photos are processed securely and automatically deleted from our servers within 30 minutes. We never store, share, or use your personal photos for any purpose other than deblurring. Your memories remain completely private.",
    },
    {
      question: "What if the results aren't perfect?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not satisfied with the deblurring results, we'll refund your purchase - no questions asked. We're confident in our AI's ability to enhance your photos, but we stand behind every enhancement.",
    },
  ]

  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 mb-6">
            <Focus className="w-4 h-4 mr-2" />
            Got Questions?
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">Frequently asked questions</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about AI photo deblurring and how BringBack works.
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
