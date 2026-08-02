"use client"

import FamilyPortraitClient from "@/components/family-portrait-client"
import { useState } from "react"

interface Props {
  user: { email: string; id: string }
  initialCredits: number
  isPaymentSuccess: boolean
}

export default function FamilyPortraitDashboardClient({ user, initialCredits }: Props) {
  const [userCredits] = useState(initialCredits)

  return (
    <div className="relative h-[calc(100dvh-4rem)] min-h-0 overflow-hidden bg-slate-50/50">
      {/* Dotted Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-3 py-3 sm:px-6 sm:py-5 lg:px-8">
        <div className="flex min-h-0 flex-1 flex-col gap-4 sm:gap-6">
          {/* Page Header */}
          <div className="mx-auto shrink-0 space-y-1.5 text-center sm:max-w-3xl sm:space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#FF4D00] text-xs font-bold uppercase tracking-wider">
              ✨ Advanced AI Studio Synthesis
            </div>
            <h1 className="font-inter text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              AI Family Portrait Studio
            </h1>
            <p className="text-sm text-gray-600 sm:text-base md:text-lg">
              Combine separate individual photos of family members and pets into cohesive, thematic group portraits with harmonized lighting and wardrobe styling.
            </p>
          </div>

          {/* Main Wizard Container */}
          <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 sm:p-5">
            <FamilyPortraitClient userCredits={userCredits} user={user} />
          </div>


        </div>
      </main>
    </div>
  )
}
