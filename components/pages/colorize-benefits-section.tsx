"use client"
import { Cover } from "@/components/ui/cover"

export default function ColorizeBenefitsSection() {
  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-gray-500 italic text-lg mb-4">Why Choose Us</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Why trust this <Cover>AI Colorization Tool</Cover>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional-grade colorization that brings vintage photos to life with historically accurate, natural
            colors
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Benefits List */}
          <div className="space-y-12">
            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Historically Accurate Colors</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                AI trained on historical data applies period-appropriate colors. Skin tones, clothing, and backgrounds
                look authentic to the era.
              </p>
              <div className="text-sm text-gray-500">⚡ Results in under 30 seconds</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Works on Any Vintage Photo</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Family portraits, wedding photos, historical images, old postcards. Easily colorize any black and white
                photo from any era.
              </p>
              <div className="text-sm text-gray-500">✨ All photo types supported</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Fair & Simple Pricing</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                One-time payment, not another subscription trap. Just $2 for 5 high-quality photo colorizations.
              </p>
              <div className="text-sm text-gray-500">💰 No monthly fees, no hidden costs</div>
            </div>
          </div>

          {/* Right - Pricing Card */}
          <div className="flex justify-center">
            <div className="bg-gray-50 rounded-3xl p-12 border border-gray-200 text-center max-w-sm w-full">
              <div className="mb-8">
                <div className="text-6xl font-bold text-black mb-2">$2</div>
                <div className="text-gray-600 text-lg">One-time payment</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Photo colorizations</span>
                  <span className="font-semibold text-black">5 images</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Processing time</span>
                  <span className="font-semibold text-black">30 seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monthly fees</span>
                  <span className="font-semibold text-black">$0</span>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200">
                Colorize 5 Photos for $2
              </button>
              
              <p className="text-xs text-gray-500 mt-2">
                Only $0.40 per photo
              </p>

              <p className="text-xs text-gray-500 mt-3">No subscription • No hidden fees</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
