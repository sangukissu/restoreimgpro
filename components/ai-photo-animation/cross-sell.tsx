"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compare } from "@/components/ui/compare";
import { ArrowRight } from "lucide-react";

export function AIAnimationCrossSell() {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-black leading-[1.1]">
                Pro Tip: <span className="text-brand-orange">Restore Before You Animate</span>
              </h2>
              <h3 className="text-xl font-bold text-gray-900">
                Get clearer facial expressions with AI Enhancement
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                AI animation relies on facial landmarks (eyes, nose, mouth). If your old photo is blurry or scratched, the animation might look distorted. For the most realistic results, we recommend using our AI Photo Restorer first to unblur the face and remove scratches. A sharper source image equals a smoother, more lifelike animation.
              </p>
            </div>
            
            <Link href="/old-photo-restoration">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg font-semibold bg-brand-black text-white hover:bg-gray-800 transition-all group">
                Restore & Animate Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Right Content - Comparison */}
          <div className="order-1 lg:order-2 relative h-[400px] sm:h-[500px] w-full rounded-[2rem] overflow-hidden border-4 border-gray-100 shadow-2xl">
             <Compare
                firstImage="/faded.webp" 
                secondImage="/fade-restored.webp"
                firstImageClassName="object-cover w-full h-full"
                secondImageClassname="object-cover w-full h-full"
                className="w-full h-full"
                slideMode="hover"
                showHandlebar={true}
             />
             <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-20 pointer-events-none">
                Blurry Source
             </div>
             <div className="absolute bottom-4 right-4 bg-brand-orange/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-20 pointer-events-none">
                Restored Source
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
