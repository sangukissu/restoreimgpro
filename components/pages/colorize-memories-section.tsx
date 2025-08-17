"use client"

import { Cover } from "@/components/ui/cover"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ColorizeMemoriesSection() {
  return (
    <section className="px-6 py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Main Message */}
        <div className="space-y-8 relative">
          {/* Floating text */}
          <div className="absolute -top-4 left-0 transform -rotate-12">
            <span className="text-sm font-medium text-gray-400 italic">In Living Color</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Because history
            <br />
            <Cover>deserves to be seen in color</Cover>
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-gray-600">
              Every black and white family portrait, every vintage wedding photo, every piece of history trapped in
              grayscale—they all have stories that deserve to be told in full color.
            </p>

            <p className="text-lg text-gray-600">
              BringBack doesn't just add color to photos. It brings the past to life. Because when you see your
              great-grandmother's wedding dress in ivory, her bouquet in soft pink, and her smile in warm, natural
              tones, history becomes personal.
            </p>

            <p className="text-lg text-gray-600">
              Don't let another generation pass without seeing their heritage in living color.
            </p>
         
          </div>
              <Link href="/login">
          <Button className="px-8 py-6 group relative overflow-hidden w-auto" size="lg" asChild>
            <div>
              <span className="mr-10 transition-opacity duration-500 group-hover:opacity-0">Colorize Your Photos</span>
              <i className="absolute right-1.5 top-1.5 bottom-1.5 rounded-sm z-10 grid w-1/5 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </i>
            </div>
          </Button>
            </Link>
        </div>
      </div>
    </section>
  )
}
