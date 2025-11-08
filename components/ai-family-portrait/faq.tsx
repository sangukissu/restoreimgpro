"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "Will the final photo look fake or like a bad photoshop?",
    answer:
      "No. Our AI's greatest strength is its ability to create consistent lighting, color, and texture across all individuals, blending them into a cohesive and natural-looking portrait.",
  },
  {
    question: "Does the AI change what my family members look like?",
    answer:
      "Absolutely not. The feature is designed to preserve the exact likeness and identity of each person. We do not perform any facial swapping or alteration.",
  },
  {
    question: "What are the best photos to upload for this feature?",
    answer:
      "For the best results, use clear, well-lit, front-facing portraits where the face is not obscured. While our AI is versatile, higher quality input photos will yield a more stunning final portrait.",
  },
  {
    question: "Can I combine black-and-white photos with color photos?",
    answer:
      "Yes. This is one of the most powerful uses of the feature. The AI will intelligently interpret the black-and-white photos and render them in a style that harmonizes beautifully with the color photos in the final portrait.",
  },
  {
    question: "How do you combine photos into one picture without it looking fake?",
    answer:
      "This is the core of our technology. Our AI goes beyond simple 'cut and paste.' It acts like a digital artist by re-rendering the entire scene. It analyzes each person and creates a new, unified lighting and color scheme, so everyone looks like they were in the same room. It harmonizes textures and shadows to ensure a natural, cohesive final portrait, not a cheap-looking photoshop.",
  },
  {
    question: "Can the AI fix old, faded, or damaged photos before combining them?",
    answer:
      "While this tool is focused on composition, we highly recommend using our Old Photo Restoration feature first for any damaged or faded images. Restoring a photo before adding it to your family portrait will yield dramatically better and more lifelike results. A clear input creates a masterpiece output.",
  },
  {
    question: "Can I add a deceased person to a family photo?",
    answer:
      "Yes. This is one of the most meaningful uses of our tool. You can create a beautiful memorial portrait by combining a photo of a loved one who has passed with a current family picture. The AI will blend them together respectfully, creating a treasured keepsake that honors their memory and keeps them part of the family portrait.",
  },
  {
    question: "Is it possible to create a generational photo with ancestors?",
    answer:
      "Yes. You can unite generations that never met. Combine a photo of a grandparent in their youth with a photo of a grandchild. Our AI can even harmonize black-and-white photos with color ones, creating a powerful image that visualizes your family's legacy through time.",
  },
  {
    question: "What are the best photos to use for an AI family portrait?",
    answer: [
      "Clear, front-facing portraits work best.",
      "Ensure the face is well-lit and not covered by shadows or objects.",
      "Similar head sizes across the photos can help the AI create a more balanced composition.",
      "Simple backgrounds are preferred, as they allow the AI to focus on the people.",
    ],
  },
  {
    question: "How many people can I combine into one group photo?",
    answer:
      "Currently, you can combine up to 4 individual photos into a single family portrait. For groups of 3–4 people, we recommend using a wider aspect ratio (like 4:3 or 16:9) to give the AI enough space for a beautiful composition.",
  },
  {
    question: "Can I change the clothes or background in the photos?",
    answer:
      "This feature is focused on composing the subjects into a new portrait. It does not perform clothing changes. The AI generates a new, simple studio-style background to ensure the final image is cohesive and focuses entirely on your family members.",
  },
  {
    question: "How is this different from using Photoshop or hiring an artist?",
    answer:
      "The primary differences are speed, cost, and accessibility. A manual edit in Photoshop can take a professional artist hours or days and cost $50–$200+. Our AI delivers a comparable, high-quality result in under a minute for a fraction of the cost.",
  },
  {
    question: "Is this better than free apps that merge photos?",
    answer:
      "Yes, in two critical ways: quality and privacy. Free tools often produce low-quality images with inconsistent lighting that look obviously fake. More importantly, they may use your private family photos for data collection. Our service provides a professional-grade, artistic result while guaranteeing the absolute privacy of your cherished memories.",
  },
]

export default function FamilyPortraitFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="px-4 py-20 bg-[#fff6f0de]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 mb-6">
            <HelpCircle className="w-4 h-4 mr-2" />
            Your Questions, Answered

          </div>
          <h2 className="text-4xl lg:text-5xl text-black mb-4 leading-tight">Questions About the AI Family Portrait? We Have Answers.</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Everything you need to know to create a natural, unified portrait from separate photos—with privacy, respect, and quality at the core.</p>
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
                  {Array.isArray(faq.answer) ? (
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      {faq.answer.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}