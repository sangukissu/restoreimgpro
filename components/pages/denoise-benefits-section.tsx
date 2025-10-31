"use client"
import { Cover } from "@/components/ui/cover"

export default function DenoiseBenefitsSection() {
  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-gray-500 italic text-lg mb-4">Why Choose Us</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-black mb-6">
            Why trust this <Cover>AI Denoise Tool</Cover>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional-grade noise reduction that cleans up grainy photos while preserving every important detail
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Benefits List */}
          <div className="space-y-12">
            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Smart Noise Detection</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Advanced AI distinguishes between noise and detail, removing grain while keeping textures, faces, and
                important elements crisp.
              </p>
              <div className="text-sm text-gray-500">⚡ Results in under 30 seconds</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Handles All Noise Types</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Color noise, luminance grain, high-ISO artifacts, old digital camera noise. Easily clean up any type of
                grain and bring photos to professional quality.
              </p>
              <div className="text-sm text-gray-500">✨ All noise types supported</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Fair & Simple Pricing</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                One-time payment, not another subscription trap. Just $2.49 for 5 high-quality photo cleanups.
              </p>
              <div className="text-sm text-gray-500">💰 No monthly fees, no hidden costs</div>
            </div>
          </div>

          {/* Right - Pricing Card */}
          <div className="flex justify-center">
            <div className="bg-gray-50 rounded-3xl p-12 border border-gray-200 text-center max-w-sm w-full">
              <div className="mb-8">
                <div className="text-6xl font-bold text-black mb-2">$2.49</div>
                <div className="text-gray-600 text-lg">One-time payment</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Photo cleanups</span>
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
                Clean 5 Photos for $2.49
              </button>
              
              <p className="text-xs text-gray-500 mt-2">
                Only $0.50 per photo
              </p>

              <p className="text-xs text-gray-500 mt-3">No subscription • No hidden fees</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
