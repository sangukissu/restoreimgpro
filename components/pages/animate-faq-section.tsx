"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function AnimateFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What types of photos work best for animation?",
      answer: "Photos with clear subjects, good lighting, and minimal motion blur work best. Vintage family photos, portraits, and group photos are ideal candidates for our Old Photo Revival effect."
    },
    {
      question: "How long does it take to generate an animated video?",
      answer: "Most videos are generated within 2-5 minutes, depending on the complexity of the image and current server load. You'll receive real-time updates on the generation progress."
    },
    {
      question: "What video formats and quality options are available?",
      answer: "We offer videos in 540p, 720p, and 1080p quality. Videos are provided in MP4 format, which is compatible with all modern devices and social media platforms."
    },
    {
      question: "How many credits does it cost to animate a photo?",
      answer: "Each photo animation costs 1 credit. You can purchase credits through our pricing plans or buy them individually as needed."
    },
    {
      question: "Can I use the Old Photo Revival template for modern photos?",
      answer: "While the template is optimized for vintage photos, it can be applied to modern photos as well. However, the best results are achieved with older, vintage-style photographs."
    },
    {
      question: "What is the maximum file size for uploaded photos?",
      answer: "You can upload images up to 20MB in size. Supported formats include JPG, PNG, and WebP. For best results, we recommend images with at least 1024×1024 pixel resolution."
    },
    {
      question: "Are my photos stored on your servers?",
      answer: "No, your photos are processed securely and are not permanently stored on our servers. They are automatically deleted after processing is complete."
    },
    {
      question: "Can I download the animated videos?",
      answer: "Yes, once generation is complete, you can download your animated videos directly. The download links remain active for 30 days."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about photo animation
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Have more questions?{" "}
            <a href="mailto:support@bringback.pro" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}