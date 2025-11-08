"use client"

import Image from "next/image"
import Link from "next/link"
import { SunMedium, Palette, LayoutList, Wand2 } from "lucide-react"

function InputMosaic() {
  return (
    <div className="bg-white rounded-2xl border p-6 h-full flex flex-col min-h-[420px] md:min-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-black">Input References</h3>
        <span className="text-xs text-gray-500">4 separate photos</span>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {[
          { src: "/family-photo1.png", label: "Photo 1" },
          { src: "/family-photo2.jpg", label: "Photo 2" },
          { src: "/family-photo3.png", label: "Photo 3" },
          { src: "/family-photo4.png", label: "Photo 4" },
        ].map((item, idx) => (
          <figure key={idx} className="relative aspect-square rounded-xl overflow-hidden border">
            <Image src={item.src} alt={item.label} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 480px" />
            <figcaption className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full bg-white/85 border text-gray-700">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">We harmonize lighting, style, and composition — no face-swaps.</p>
    </div>
  )
}

function ProcessStrip() {
  const items = [
    { icon: <SunMedium className="w-4 h-4" />, title: "Match Lighting", desc: "Balance exposure and tone across photos" },
    { icon: <Palette className="w-4 h-4" />, title: "Unify Style", desc: "Align color and art style tastefully" },
    { icon: <LayoutList className="w-4 h-4" />, title: "Compose Naturally", desc: "Respectful arrangement that feels real" },
  ]
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="text-base font-semibold text-black mb-4">How We Harmonize</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border p-4">
            <div className="flex items-center gap-2 text-gray-800 mb-1">
              {item.icon}
              <span className="text-sm font-medium">{item.title}</span>
            </div>
            <p className="text-xs text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResultPanel() {
  return (
    <div className="bg-white rounded-2xl border p-6 h-full flex flex-col min-h-[420px] md:min-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-black">Final Composite</h3>
        <span className="text-xs text-gray-500">One unified portrait</span>
      </div>
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border">
        <Image src="/family-portrait.png" alt="Unified family portrait result" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 600px" />
        <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-white/85 border text-gray-700">Subtle re‑lighting</span>
        <span className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full bg-white/85 border text-gray-700">Color harmonized</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">Print‑ready, respectful composite — created in minutes.</p>
        <Link href="/dashboard/family-portrait" className="text-sm font-medium text-black underline underline-offset-4">Create yours</Link>
      </div>
    </div>
  )
}

export default function FamilyPortraitShowcase() {
  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-6">
            <Wand2 className="w-4 h-4 mr-2" />
            The Magic
          </div>
          <h2 className="max-w-3xl mx-auto text-4xl lg:text-5xl text-black mb-3 leading-tight">From Separate Photos to one Cherished Family Portrait</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Upload up to four references. We harmonize lighting, color, and composition to create a realistic family photo — no gimmicks.</p>
        </div>

        {/* Split: Inputs and Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-6">
          <div className="h-full">
            <InputMosaic />
          </div>
          <div className="h-full">
            <ResultPanel />
          </div>
        </div>

        {/* Process */}
        <ProcessStrip />
      </div>
    </section>
  )
}