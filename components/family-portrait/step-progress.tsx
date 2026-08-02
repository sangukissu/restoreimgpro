"use client"

import { useEffect, useRef } from "react"

interface StepProgressProps {
  currentStep: number // 1..4
  onStepClick: (step: number) => void
}

const STEPS = [
  { id: 1, label: "Select Scene" },
  { id: 2, label: "Upload Images" },
  { id: 3, label: "Select Quantity" },
  { id: 4, label: "Generate Family Portrait" },
]

export default function StepProgress({ currentStep, onStepClick }: StepProgressProps) {
  const activeStepRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeStepRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  }, [currentStep])

  return (
    <nav className="w-full shrink-0" aria-label="Family portrait creation progress">
      <ol className="flex gap-3 overflow-x-auto px-0.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id
          const isActive = currentStep === step.id
          const canClick = step.id < currentStep

          return (
            <li key={step.id} className="min-w-[8.5rem] flex-1 md:min-w-0">
              <button
                ref={isActive ? activeStepRef : undefined}
                type="button"
                aria-current={isActive ? "step" : undefined}
                disabled={!canClick && !isActive}
                onClick={() => canClick && onStepClick(step.id)}
                className={`group block w-full rounded-sm py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00] focus-visible:ring-offset-2 ${canClick ? "cursor-pointer" : "cursor-default"}`}
              >
                <span
                  className={`block h-1 w-full rounded-full transition-colors ${isActive
                    ? "bg-[#FF4D00]"
                    : isCompleted
                      ? "bg-[#F2B39A] group-hover:bg-[#EA9875]"
                      : "bg-[#EAE7DE]"
                    }`}
                />
                <span
                  className={`mt-2 block truncate text-[11px] font-medium transition-colors sm:text-xs ${isActive
                    ? "font-semibold text-gray-950"
                    : isCompleted
                      ? "text-gray-600 group-hover:text-gray-900"
                      : "text-gray-400"
                    }`}
                >
                  {step.label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
