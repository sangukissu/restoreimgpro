import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { PointerHighlight } from "@/components/pointer-highlight"
import { GridPattern } from "@/components/grid-pattern"
import DenoiseHowItWorksSection from "@/components/pages/denoise-how-it-works-section"
import DenoiseBenefitsSection from "@/components/pages/denoise-benefits-section"
import DenoiseShowcaseSection from "@/components/pages/denoise-showcase-section"
import DenoiseFeaturesSection from "@/components/pages/denoise-features-section"
import DenoiseTestimonialsSection from "@/components/pages/denoise-testimonials-section"
import DenoiseFAQSection from "@/components/pages/denoise-faq-section"
import DenoiseMemoriesSection from "@/components/pages/denoise-memories-section"
import { cn } from "@/lib/utils"
import { Compare } from "@/components/ui/compare"
export const metadata: Metadata = {
  title: "AI Photo Denoise - Remove Grain & Noise Instantly | BringBack",
  description:
    "Clean up grainy, noisy photos with AI. Remove digital noise, grain, and artifacts from low-light shots in seconds.",
  keywords: "denoise photo, remove grain, fix grainy photos, AI noise reduction, clean up photos",
  robots: "index, follow",
}

export default function DenoisePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="relative px-4 py-20 pt-32 overflow-hidden">
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
            [15, 10],
            [10, 15],
            [15, 10],
          ]}
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_50%_20%,white,transparent)]",
            "absolute inset-0 w-full h-full skew-y-12 fill-gray-200/70 stroke-gray-300/70",
          )}
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </div>
              <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Clean up{" "}
                <PointerHighlight
                  rectangleClassName="bg-purple-100 border-purple-300 leading-tight px-2"
                  pointerClassName="text-purple-500 h-3 w-3"
                  containerClassName="inline-block mx-1"
                >
                  <span className="relative z-10">grainy photos</span>
                </PointerHighlight>
                <br />
                and rescue
                <br />
                <PointerHighlight
                  rectangleClassName="bg-blue-100 border-blue-300 leading-tight px-2"
                  pointerClassName="text-blue-500 h-3 w-3"
                  containerClassName="inline-block mx-1"
                >
                  <span className="relative z-10">low-light shots</span>
                </PointerHighlight>{" "}
                to perfection
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
                Remove distracting grain and digital noise from your photos to reveal the smooth, clean image
                underneath. Quick processing, simple to use, and a lifetime of clean shots.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                <Link href="/login">

              <Button className="px-8 py-6 group relative overflow-hidden w-full sm:w-auto" size="lg">
                <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Denoise Your Photo</span>
                <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                  <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                </i>
              </Button>
            </Link>
            </div>
            <div className="flex flex-col items-center space-y-2 pt-2">
              <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar1.webp" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar2.webp" alt="User" />  
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar3.webp" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar6.webp" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar5.webp" alt="User" />
                <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">17+</span>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">
                    ★
                  </span>
                ))}
              </div>
            </div>
              <p className="text-gray-600 font-medium">Loved by Everyone Who Shoots at Night</p>
            </div>

            {/* Hero compare Section */}
              <div className="pt-4">
              <div className="flex justify-center">
                <div className="py-4 border rounded-3xl bg-neutral-50 border-neutral-200 px-4">
                  <Compare
                    firstImage="/placeholder-1bjxl.png"
                    secondImage="/restored-family-photo.png"
                    firstImageClassName="object-cover"
                    secondImageClassname="object-cover"
                    className="h-[200px] w-[320px] sm:h-[300px] sm:w-[450px] md:h-[400px] md:w-[600px] lg:h-[500px] lg:w-[800px]" // Responsive sizing
                    slideMode="hover"
                    firstImageAlt="Before: Noisy family photo"
                    secondImageAlt="After: Denoised and restored family photo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DenoiseHowItWorksSection />
      <DenoiseBenefitsSection />
      <DenoiseShowcaseSection />
      <DenoiseFeaturesSection />
      <DenoiseTestimonialsSection />

      {/* Social Proof Section */}
      <section className="px-4 py-16 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Trusted by night photographers worldwide</h2>
            <p className="text-lg text-gray-600">Join thousands who've already cleaned up their grainy shots</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-black">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "My low-light photos from the city at night were so grainy. BringBack cleaned them up perfectly while
                keeping all the important details sharp."
              </p>
              <p className="text-sm font-medium text-black">David K.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-black">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Indoor party photos from my phone looked terrible with all the noise. This AI made them look like they
                were taken with a professional camera!"
              </p>
              <p className="text-sm font-medium text-black">Lisa M.</p>
            </div>
          </div>
        </div>
      </section>

      <DenoiseFAQSection />
      <DenoiseMemoriesSection />

      {/* Final CTA Section */}
      <section className="px-4 py-20 max-w-6xl mx-auto text-center">
        <div className="text-center mt-16">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-4">Ready to clean up your grainy photos?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Don't let noise and grain ruin your precious moments. Every photo deserves to look smooth and
              professional.
            </p>

            <Button className="px-8 py-6 group relative overflow-hidden w-full sm:w-auto" size="lg">
              <span className="mr-10 transition-opacity duration-500 group-hover:opacity-0">Start Denoising Now</span>
              <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </i>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
