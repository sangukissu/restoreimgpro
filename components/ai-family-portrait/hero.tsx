"use client"

import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"
import { FramerButton } from "@/components/ui/framer-button"
import Image from "next/image"

export default function AIAnimationHero() {
  return (
    <section className="relative pb-12 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-60 pointer-events-none z-0" />
      <div className="px-4 pt-28 pb-12 max-w-6xl mx-auto text-center">
        <div className="relative z-10 space-y-6">
          <div className="shadow-xl shadow-zinc-500/10 text-black inline-flex items-center px-3 py-1 rounded-full bg-white/50 text-xs font-medium mb-4 backdrop-blur-lg">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Family Portrait Generator
          </div>
          <h1 className="max-w-4xl mx-auto text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-black">
            Combine Photos to Create a Family Portrait with AI

          </h1>
          <p className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto leading-tight">
            Our AI Family Portrait Generator intelligently combines individual photos of your loved ones—past and present—into one beautiful, modern family portrait. Create the photo you've always wished you had.
          </p>
          <div className="flex justify-center">
            <Link href="/dashboard/family-portrait">
              <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden w-full sm:w-auto">
                Create Your Family Portrait
              </FramerButton>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border-6 border-gray-200 overflow-hidden ">
          <div className="aspect-[16/9] w-full relative">
            <Image
              src="/family-portrait.png"
              alt="Unified modern family portrait"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}