"use client"

import React from "react"
import { Check, X, Wallet, Clock, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ColorizeProfessionalService() {
  return (
    <section className="px-4 sm:px-8 py-24 bg-brand-surface">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 justify-between items-center">
          
          {/* Left Column: Content */}
          <div className="max-w-2xl w-full">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-[#FF4D00]">//</span> Professional Service vs AI <span className="text-[#FF4D00]">//</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-black leading-[1.05] mb-6">
              Professional Photo Colorization Service <br />
              <span className="text-gray-500">Without the Agency Price.</span>
            </h2>

            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8">
              "How much does it cost to colorize a photo?" If you hire a professional photo colorization service, manual digital artists charge anywhere from $30 to $150+ per image. With BringBack, you get studio-grade, vintage photo colorization services instantly for a fraction of the cost.
            </p>

            <div className="flex flex-col gap-5 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FF4D00]/10 flex items-center justify-center text-[#FF4D00] flex-shrink-0">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-brand-black mb-1">Affordable Pricing</h3>
                  <p className="text-gray-600 text-sm font-medium">Skip the $100 hourly rates. Our AI photo colorization service price is just $2 for 5 high-resolution colorized photos.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FF4D00]/10 flex items-center justify-center text-[#FF4D00] flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-brand-black mb-1">Instant Results</h3>
                  <p className="text-gray-600 text-sm font-medium">Manual colorization takes days or weeks. BringBack colorizes black and white photos automatically in under 10 seconds.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FF4D00]/10 flex items-center justify-center text-[#FF4D00] flex-shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-brand-black mb-1">Professional Quality</h3>
                  <p className="text-gray-600 text-sm font-medium">Get the same vibrant, historically accurate results you'd expect from a top image recoloring service.</p>
                </div>
              </div>
            </div>

            <Link href="/dashboard">
              <Button className="bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-[#FF4D00]/20 transition-all hover:scale-105">
                Colorize Your Photos Now
              </Button>
            </Link>
          </div>

          {/* Right Column: Comparison Table */}
          <div className="w-full max-w-lg bg-white rounded-[2rem] p-8 shadow-xl shadow-black/5 border border-gray-100">
            <h3 className="text-2xl font-bold text-brand-black text-center mb-8">Service Comparison</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-bold text-gray-500">Feature</span>
                <div className="flex gap-8 text-center">
                  <span className="font-bold text-gray-400 w-24">Manual</span>
                  <span className="font-bold text-[#FF4D00] w-24">BringBack AI</span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-bold text-brand-black">Price per Photo</span>
                <div className="flex gap-8 text-center">
                  <span className="font-bold text-gray-500 w-24">$50 - $150</span>
                  <span className="font-bold text-brand-black w-24">$0.40</span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-bold text-brand-black">Turnaround Time</span>
                <div className="flex gap-8 text-center">
                  <span className="font-bold text-gray-500 w-24">3-7 Days</span>
                  <span className="font-bold text-brand-black w-24">10 Seconds</span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-bold text-brand-black">Revisions</span>
                <div className="flex gap-8 text-center">
                  <span className="font-bold text-gray-500 w-24 flex justify-center"><Check size={20} /></span>
                  <span className="font-bold text-brand-black w-24 flex justify-center"><Check size={20} /></span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-bold text-brand-black">Privacy Protection</span>
                <div className="flex gap-8 text-center">
                  <span className="font-bold text-gray-500 w-24 flex justify-center"><X size={20} className="text-gray-300"/></span>
                  <span className="font-bold text-[#FF4D00] w-24 flex justify-center"><Check size={20} /></span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
