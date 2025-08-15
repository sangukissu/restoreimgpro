"use client"
import { Cover } from "@/components/ui/cover"


export default function BenefitsSection() {
  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-gray-500 italic text-lg mb-4">Why Choose Us</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">Why trust this <Cover>AI Photo Restorer</Cover>
</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
            Professional photo restoration that brings damaged photos back to life without losing their original charm
          </p>
        </div>

        {/* Split Layout - Left Content, Right Visual */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Benefits List */}
          <div className="space-y-12">
            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Lightning Fast Results</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Fast turnaround without killing the original charm. Restore faded photos and repair damaged images in
                seconds, not days.
              </p>
              <div className="text-sm text-gray-500">⚡ Results in under 30 seconds</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Works on Everything</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Torn, faded, damaged, old photos - even black and white vintage images. Easily restore them to the next
                level of realism.
              </p>
              <div className="text-sm text-gray-500">✨ All photo types supported</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Fair & Simple Pricing</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                One-time payment, not another subscription trap. Just $2 for 5 high-quality photo restorations.
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
                  <span className="text-gray-600">Photo restorations</span>
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
                Restore 5 Photos for $2
              </button>

              <p className="text-xs text-gray-500 mt-3">No subscription • No hidden fees</p>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
       
      </div>
    </section>
  )
}
