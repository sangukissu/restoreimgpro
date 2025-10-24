"use client"
import { Cover } from "@/components/ui/cover"
import Link from "next/link"
import { FramerButton } from "@/components/ui/framer-button"
import { Check, ChevronRight, Star, Film } from "lucide-react"


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

                {/* Pricing Cards */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">

            {/* Starter Plan */}
            <div className="bg-gray-50 rounded-3xl p-8 border-2 border-gray-200 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-black">Starter</h3>
              <p className="text-gray-600 mt-1 mb-6">Perfect for high-quality photo restoration.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold text-black">$2.49</span>
                <div className="text-gray-600 text-lg">One-time payment</div>
              </div>

              <div className="flex-grow space-y-4 mb-8 text-left">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><span className="font-semibold text-black">5</span> Photo Restorations</span>
                </div>
                
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">High-Resolution Output</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Credits Never Expire</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Free Photo Enhance/Upscale</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Free Digital Frames</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">30-Day Money-Back Guarantee</span>
                </div>
              </div>
              
               <Link href="/login">
            
             <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden w-full">
            Start Restoring
          </FramerButton>
            </Link>
            </div>

            {/* Restore & Animate Plan (Best Value) */}
            <div className="bg-black text-white rounded-3xl p-8 border-2 border-gray-800 relative h-full flex flex-col">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center border border-gray-300">
                  <Star className="w-4 h-4 mr-2 text-black" />
                  Best Value
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white">Restore & Animate</h3>
              <p className="text-gray-400 mt-1 mb-6">Everything in Starter, plus bring photos to life.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">$4.99</span>
                <div className="text-gray-400 text-lg">One-time payment</div>
              </div>

              <div className="flex-grow space-y-4 mb-8 text-left">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300"><span className="font-semibold text-white">5</span> Photo Restorations</span>
                </div>
                
                <div className="flex items-center font-bold">
                  <Film className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span><span className="text-white">1</span> High-Quality Video Animation</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">High-Resolution Output</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Credits Never Expire</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Free Photo Enhance/Upscale</span> 
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Free Digital Frames</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">30-Day Money-Back Guarantee</span>
                </div>
              </div>
              
              <Link href="/login" className="mt-auto">
                <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden w-full bg-white text-black hover:bg-gray-200">
                  Bring Memories to Life
                </FramerButton>
              </Link>
            </div>
          </div>
 <div className="text-center mt-4 max-w-3xl mx-auto"> 
           <p className="text-md text-gray-500 mt-2">
                Even after restoration, if we detect any damage (tears, stains, scratches) is still present which costed you one credit, <span className="font-bold text-red-500">we automatically offer one free re‑restoration.</span>
              </p>
</div>
     
       
      </div>
    </section>
  )
}
