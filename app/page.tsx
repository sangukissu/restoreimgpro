import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PointerHighlight } from "@/components/pointer-highlight"
import { Compare } from "@/components/ui/compare"
import { GridPattern } from "@/components/grid-pattern"
import HowItWorksSection from "@/components/how-it-works-section"
import BenefitsSection from "@/components/benefits-section"
import FeaturesSection from "@/components/features-section"
import ShowcaseSection from "@/components/showcase-section"
import FAQSection from "@/components/faq-section"
import MemoriesSection from "@/components/memories-section"
import TestimonialsSection from "@/components/testimonials-section"

import { cn } from "@/lib/utils"

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="relative  overflow-hidden">
          {/* Grid Pattern Background - positioned at the very top */}
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
            "absolute inset-x-0 top-0 h-full skew-y-12 fill-gray-200/70 stroke-gray-300/70",
          )}
        />
      <div className="px-4 py-20 pt-32 max-w-6xl mx-auto text-center" >
      

        <div className="relative z-10 space-y-6">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </div>
            <h1 className="text-3xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Bring back{" "}
              <PointerHighlight
                rectangleClassName="bg-purple-100 border-purple-300 leading-tight px-2"
                pointerClassName="text-purple-500 h-3 w-3"
                containerClassName="inline-block mx-1"
              >
                <span className="relative z-10">old photos</span>
              </PointerHighlight>
              <br />
              and
              <br />
              <PointerHighlight
                rectangleClassName="bg-blue-100 border-blue-300 leading-tight px-2"
                pointerClassName="text-blue-500 h-3 w-3"
                containerClassName="inline-block mx-1"
              >
                <span className="relative z-10">faded memories</span>
              </PointerHighlight>{" "}
              to life
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
              Restore your old, faded, torn or damaged photos into vibrant memories again. Quick restoration simple
              process and a lifetime of preserved moments.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <Link href="/dashboard">
            <Button className="px-8 py-6 group relative overflow-hidden w-full sm:w-auto" size="lg">
              <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Restore Your Photo</span>
              <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </i>
            </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-md font-medium rounded-lg border-gray-200 hover:bg-gray-50 w-full sm:w-auto bg-transparent"
            >
              Explore Examples
            </Button>
          </div>
          <div className="flex flex-col items-center space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/happy-user-1.png" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/happy-user-2.png" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/happy-user-3.png" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/happy-user-4.png" alt="User" />
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
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
            <p className="text-gray-600 font-medium">Join 50,000+ Builders</p>
          </div>
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
                />
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <HowItWorksSection />
      <BenefitsSection />
      <ShowcaseSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <MemoriesSection />

      {/* Final CTA Section */}
      <section className="px-4 py-20 max-w-6xl mx-auto text-center">
        <div className="text-center mt-16">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-4">Which memories are you ready to bring back?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Don't let time steal the clarity from your most precious moments. Every photo has a story worth preserving
              perfectly.
            </p>
          
            <Button className="px-8 py-6 group relative overflow-hidden w-full sm:w-auto" size="lg">
              <span className="mr-10 transition-opacity duration-500 group-hover:opacity-0">Start Restoring Now</span>
              <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </i>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
