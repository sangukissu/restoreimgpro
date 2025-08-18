"use client"

import type React from "react"
import { Upload, Sparkles, Download } from "lucide-react"

export default function AnimateHowItWorksSection() {
  return (
    <section className="px-4 py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            How It Works
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Bring photos to life in 3 simple steps
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your static vintage photos into captivating animated videos with our AI-powered old photo revival effect
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-20">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-6 border-gray-200 bg-transparent backdrop-blur transform rotate-2 sm:rotate-3 relative z-10">
              <div className="mb-6">
                <span className="text-6xl font-bold text-black">1</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Upload Your Photo</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload any static photo - vintage family portraits, old memories, or historical images. Our AI works best with clear subjects and good composition.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-6 border-gray-200 bg-transparent backdrop-blur transform -rotate-1 sm:-rotate-2 relative z-10">
              <div className="mb-6">
                <span className="text-6xl font-bold text-black">2</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">AI Animation</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes your photo and applies the old photo revival effect, adding realistic motion, atmospheric effects, and vintage-appropriate animation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-6 border-gray-200 bg-transparent backdrop-blur transform rotate-2 sm:rotate-5 relative z-10">
              <div className="mb-6">
                <span className="text-6xl font-bold text-black">3</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Download Your Video</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your animated video in high quality, ready to share on social media, display in digital frames, or preserve as a living memory.
              </p>
            </div>
          </div>

          {/* Connection Lines */}
          <div className="absolute top-0 sm:-rotate-45 left-1/4 w-1/6 h-32 hidden lg:block z-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 247 69">
              <path
                d="M12.5 56.5C12.5 56.5 78.5 56.5 78.5 56.5C78.5 56.5 78.5 12.5 78.5 12.5C78.5 12.5 234.5 12.5 234.5 12.5"
                stroke="#E5E7EB"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 8"
                fill="none"
              />
            </svg>
          </div>
          <div className="absolute top-0 sm:rotate-45 right-1/4 w-1/6 h-32 hidden lg:block z-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 247 69">
              <path
                d="M234.5 56.5C234.5 56.5 168.5 56.5 168.5 56.5C168.5 56.5 168.5 12.5 168.5 12.5C168.5 12.5 12.5 12.5 12.5 12.5"
                stroke="#E5E7EB"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 8"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}