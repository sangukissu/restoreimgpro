"use client"
import { Cover } from "@/components/ui/cover"
import Link from "next/link"
import { FramerButton } from "@/components/ui/framer-button"
import { ChevronRight } from "lucide-react"


export default function BenefitsSection() {
  return (
    <section id="pricing" className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-gray-500 italic text-lg mb-4">Why Choose Us</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">Why trust <Cover>BringBack AI</Cover>
</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
AI-powered photo restoration and animation that transforms old, damaged photos into living memories.
          </p>
        </div>

        {/* Split Layout - Left Content, Right Visual */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Benefits List */}
          <div className="space-y-12">
            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Restore & Animate in Seconds</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                AI photo restoration that fixes damage, enhances quality, and brings people to life with natural
                movement. Watch your loved ones smile and wave again.
              </p>
              <div className="text-sm text-gray-500">⚡ Restoration + Animation in under 60 seconds</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Works on All Photo Types</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Torn, faded, damaged, or black-and-white vintage photos. Our AI restores quality and animates people
                naturally - bringing family history to life.
              </p>
              <div className="text-sm text-gray-500">✨ All photo types supported + animation</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Choose Your Experience</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Restore multiple photos quickly, or bring one special memory to life with animation. Same price,
                different ways to preserve your precious moments.
              </p>
              <div className="text-sm text-gray-500">💰 One price, multiple options - No subscriptions</div>
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
                <div className="text-center py-2 text-gray-400 text-sm">or</div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Restore + Animate</span>
                  <span className="font-semibold text-black">1 video</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monthly fees</span>
                  <span className="font-semibold text-black">$0</span>
                </div>
              </div>
          
              <Link href="/login">
            
             <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden w-full ">
            Start Restoring for $2
          </FramerButton>
            </Link>
             <p className="text-xs text-gray-500 mt-2">
             No subscription • Choose your option after upload
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
       
      </div>
    </section>
  )
}
