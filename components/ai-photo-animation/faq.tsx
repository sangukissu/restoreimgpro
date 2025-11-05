"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

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
]

export default function AIAnimationFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="px-4 py-20 bg-[#fff6f0de]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 mb-6">
            <HelpCircle className="w-4 h-4 mr-2" />
            Your Questions, Answered

          </div>
          <h2 className="text-4xl lg:text-5xl text-black mb-4 leading-tight"> Questions About AI Photo Animation? We Have Answers.
</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Here are the real questions people ask about bringing their photos to life.</p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden transition-all duration-200">
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