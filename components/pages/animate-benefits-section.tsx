"use client"
import { Cover } from "@/components/ui/cover"

export default function AnimateBenefitsSection() {
  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-gray-500 italic text-lg mb-4">Why Choose Us</p>
          <h2 className=" text-4xl lg:text-5xl text-black mb-6">
            Why trust this <Cover>AI Animation Tool</Cover>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional-grade photo animation that brings your vintage memories to life with authentic motion and old photo revival effects
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Benefits List */}
          <div className="space-y-12">
            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Intelligent Motion Analysis</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Advanced AI understands photo composition, depth, and context to create realistic motion that respects the original image's character and historical period.
              </p>
              <div className="text-sm text-gray-500">⚡ Results in 2-5 minutes</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Old Photo Revival Effect</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Specialized template designed for vintage photos, adding period-appropriate motion, atmospheric effects, and subtle movements that make historical images feel alive.
              </p>
              <div className="text-sm text-gray-500">🎬 Vintage-authentic animations</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">High-Quality Video Output</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Generate smooth, professional-quality videos in 540p-1080p resolution, perfect for social media sharing, digital frames, or preserving family memories.
              </p>
              <div className="text-sm text-gray-500">📱 Ready for any platform</div>
            </div>
          </div>

          {/* Right - Stats/Features */}
          <div className="bg-gray-50 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-black mb-8">Animation Features</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Processing Time</span>
                <span className="font-bold text-black">2-5 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Video Duration</span>
                <span className="font-bold text-black">5-8 seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Output Quality</span>
                <span className="font-bold text-black">540p-1080p</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Motion Types</span>
                <span className="font-bold text-black">Vintage Revival</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">File Formats</span>
                <span className="font-bold text-black">MP4, WebM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Privacy</span>
                <span className="font-bold text-black">30min deletion</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-1">346384996936128</div>
                <div className="text-sm text-gray-600">Old Photo Revival Template ID</div>
                <div className="text-xs text-gray-500 mt-2">Specialized for vintage animations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}