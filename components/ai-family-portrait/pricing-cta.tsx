"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { FramerButton } from "@/components/ui/framer-button"

export default function AIAnimationPricingCTA() {
  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl text-black mb-4 leading-tight">Ready to Create Your Family Portrait?</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Generate a unified portrait from up to 4 photos. High-resolution download included. Your memories are private and secure.
        </p>
        <div className="mt-8">
          <Link href="/dashboard/family-portrait">
            <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden sm:w-auto">
              Create Your Family Portrait
            </FramerButton>
          </Link>
        </div>
        <p className="text-sm text-gray-600 mt-3">Includes our 30-Day Money-Back Guarantee.</p>
      </div>
    </section>
  )
}