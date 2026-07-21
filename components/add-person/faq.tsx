"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { ADD_PERSON_FAQS } from "@/lib/feature-faqs"

export function AddPersonFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section className="py-20 px-4 sm:px-8 bg-brand-bg">
      <div className="max-w-[960px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
            <span className="text-brand-orange">//</span> Common Questions <span className="text-brand-orange">//</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-brand-black tracking-tight leading-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Everything you need to know about adding relatives to photos with AI.
          </p>
        </div>

        <div className="bg-brand-surface p-3 sm:p-4 rounded-[2.2rem]">
          <div className="space-y-3">
            {ADD_PERSON_FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx
              return (
                <div
                  key={idx}
                  className="bg-white rounded-[1.6rem] border border-gray-100 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full px-6 sm:px-8 py-6 text-left flex items-center justify-between gap-4 font-bold text-lg text-brand-black hover:text-brand-orange transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-brand-orange" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 sm:px-8 pb-6 text-gray-600 font-medium leading-relaxed border-t border-gray-50 pt-4 text-base">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
