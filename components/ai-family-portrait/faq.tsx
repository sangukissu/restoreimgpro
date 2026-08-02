"use client"

import React, { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { FAMILY_PORTRAIT_FAQS, type FAQItem } from "@/lib/feature-faqs"

const AccordionItem: React.FC<{
  item: FAQItem
  isOpen: boolean
  toggle: () => void
}> = ({ item, isOpen, toggle }) => {
  return (
    <div
      className={`group overflow-hidden rounded-[1.5rem] bg-white transition-all duration-300 ${
        isOpen ? "shadow-sm" : "hover:bg-gray-50"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <h3 className="select-none text-lg font-bold leading-tight text-brand-black sm:text-xl">
          {item.question}
        </h3>

        <div
          className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 sm:h-12 sm:w-12 ${
            isOpen
              ? "bg-brand-orange text-white"
              : "bg-gray-100 text-brand-black group-hover:bg-gray-200"
          }`}
        >
          {isOpen ? (
            <Minus size={20} strokeWidth={2.5} />
          ) : (
            <Plus size={20} strokeWidth={2.5} />
          )}
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="max-w-3xl px-6 pb-8 text-base font-medium leading-relaxed text-gray-600 sm:text-lg">
            {Array.isArray(item.answer) ? (
              <ul className="list-inside list-disc space-y-2">
                {item.answer.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              item.answer
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FamilyPortraitFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faqs" className="w-full px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:col-span-5">
            <div className="mb-6 inline-flex items-center gap-1 rounded-full bg-brand-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-black/10 sm:text-sm">
              <span className="text-brand-orange">//</span> FAQs{" "}
              <span className="text-brand-orange">//</span>
            </div>

            <h2 className="mb-8 text-[2.25rem] font-[850] leading-[1.05] tracking-tighter text-brand-black sm:text-[3.25rem] sm:leading-[0.95] lg:text-[3.75rem] xl:text-[4rem]">
              Questions <br />
              <span className="text-gray-400">& answers.</span>
            </h2>

            <p className="max-w-md text-lg font-medium leading-relaxed text-gray-600">
              Practical answers about our{" "}
              <strong className="font-extrabold text-brand-black">AI family photo generator</strong>
              {" "}— how references work, styles, pets, pricing, and privacy.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[1.8rem] bg-brand-surface p-2">
              <div className="flex flex-col gap-3">
                {FAMILY_PORTRAIT_FAQS.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
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
