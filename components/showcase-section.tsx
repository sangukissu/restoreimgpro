"use client"
import { useState } from "react"
import { FramerButton } from "@/components/ui/framer-button"
import { ChevronRight, Smile, Eye, Heart, Frame } from "lucide-react"
import Link from "next/link"
import { Compare } from "@/components/ui/compare"
import { Cover } from "@/components/ui/cover"
import Image from "next/image"

const ANIMATION_PRESETS = [
  {
    id: "smile-wave",
    name: "Smile + Wave",
    description: "Natural smile with gentle wave gesture",
    prompt:
      "Revive this image to life. Make the person smile and gently wave if hands are visible. Keep gestures natural and smooth.",
    icon: <Smile className="w-3 h-3" />,
    videoUrl: "/videos/video-animation1.mp4",
  },
  {
    id: "blink-tilt",
    name: "Subtle Blink + Head Tilt",
    description: "Soft blinking with slight head movement",
    prompt:
      "Animate this photo so the person softly blinks and tilts their head slightly, keeping a natural expression.",
    icon: <Eye className="w-3 h-3" />,
    videoUrl: "/videos/blink-tilt-animation.mp4",
  },
  {
    id: "smile-look",
    name: "Smile + Look Around",
    description: "Light smile with curious gaze movement",
    prompt:
      "Bring this image to life with the person smiling lightly and shifting gaze side to side as if noticing surroundings.",
    icon: <Heart className="w-3 h-3" />,
    videoUrl: "/videos/smile-and-look.mp4",
  },
]

  const showcaseItems = [
    {
      title: "Torn & Ripped Photos",
      description: "Seamlessly repair tears and missing pieces",
      beforeImage: "/torn.webp",
      afterImage: "/torn-restored.webp",
      beforeImageAlt: "Before: torn and ripped photo",
      afterImageAlt: "After: torn and ripped photo restored with bringback ai",
    },
    {
      title: "Faded & Yellowed",
      description: "Restore original colors and vibrancy",
      beforeImage: "/faded.webp",
      afterImage: "/fade-restored.webp",
      beforeImageAlt: "Before: faded and yellowed photo",
      afterImageAlt: "After: faded and yellowed photo restored with bringback ai",
    },
    {
      title: "Water Damaged",
      description: "Remove stains and water marks completely",
      beforeImage: "/water-damaged.webp",
      afterImage: "/water-damage-restored.webp",
      beforeImageAlt: "Before: water damaged photo",
      afterImageAlt: "After: water damaged photo restored with bringback ai",
    },
    {
      title: "Scratched & Cracked",
      description: "Eliminate scratches and surface damage",
      beforeImage: "/scratched.webp",
      afterImage: "/scratched-restored.webp",
      beforeImageAlt: "Before: scratched and cracked photo",
      afterImageAlt: "After: scratched and cracked photo restored with bringback ai",
    },
    {
      title: "Blurred & Out of Focus",
      description: "Sharpen details and enhance clarity",
      beforeImage: "/blurred.webp",
      afterImage: "/blurred-restored.webp",
      beforeImageAlt: "Before: blurred and out of focus photo",
      afterImageAlt: "After: blurred and out of focus photo restored with bringback ai",
    },
    {
      title: "Dark & Underexposed",
      description: "Brighten shadows and recover hidden details",
      beforeImage: "/under-exposed.webp",
      afterImage: "/under-exposed-restored.webp",
      beforeImageAlt: "Before: dark and underexposed photo",
      afterImageAlt: "After: dark and underexposed photo restored with bringback ai",
    }
  ]

const FRAME_SHOWCASE_ITEMS = [
  {
    title: "Classic Wood Frame",
    description: "Elegant wooden frame with natural grain",
    image: "/frame-classic-wood.webp",
    alt: "Classic wooden frame showcasing restored family photo"
  },
  {
    title: "Modern Black Frame",
    description: "Sleek black frame for contemporary display",
    image: "/frame-modern-black.webp", 
    alt: "Modern black frame with restored portrait"
  },
  {
    title: "Vintage Gold Frame",
    description: "Ornate gold frame for timeless elegance",
    image: "/frame-vintage-gold.webp",
    alt: "Vintage gold frame displaying restored wedding photo"
  },
  {
    title: "Minimalist White Frame",
    description: "Clean white frame for modern homes",
    image: "/frame-minimalist-white.webp",
    alt: "Minimalist white frame with restored family portrait"
  },
  {
    title: "Rustic Barnwood Frame",
    description: "Weathered wood frame with character",
    image: "/frame-rustic-barnwood.webp",
    alt: "Rustic barnwood frame showcasing restored vintage photo"
  },
  {
    title: "Silver Metal Frame",
    description: "Polished silver frame for sophisticated display",
    image: "/frame-silver-metal.webp",
    alt: "Silver metal frame with restored black and white photo"
  }
]

export default function ShowcaseSection() {
  const [activeStep, setActiveStep] = useState<"restore" | "animate" | "frame">("restore")
  const [selectedPreset, setSelectedPreset] = useState(ANIMATION_PRESETS[0])
  const [activeItem, setActiveItem] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)

  return (
    <section id="examples" className="px-4 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
          <p className="text-gray-500 italic text-lg mb-4">Real Transformations</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Every type of damage,
            <br />
            <span className="text-gray-600">
              <Cover>restored, animated & framed</Cover>
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From torn family portraits to faded wedding photos, see how BringBack handles every type of photo damage
            with precision and care - then brings your loved ones back to life and frames them beautifully.
          </p>
        </div>

        {/* Step Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex border border-gray-200 rounded-lg p-1 bg-white">
            <button
              onClick={() => setActiveStep("restore")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeStep === "restore" ? "bg-black text-white" : "text-gray-600 hover:text-black"
              }`}
            >
              1. Restore
            </button>
            <button
              onClick={() => setActiveStep("animate")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeStep === "animate" ? "bg-black text-white" : "text-gray-600 hover:text-black"
              }`}
            >
              2. Animate
            </button>
            <button
              onClick={() => setActiveStep("frame")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeStep === "frame" ? "bg-black text-white" : "text-gray-600 hover:text-black"
              }`}
            >
              3. Frame
            </button>
          </div>
        </div>

        {/* Restoration Step */}
        {activeStep === "restore" && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-black mb-2">Photo Restoration</h3>
              <p className="text-gray-600">AI repairs damage and enhances quality</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {showcaseItems.map((item, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-black mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>

                    <div className="flex justify-center">
                      <div className="border rounded-xl bg-gray-50 border-gray-200 p-3">
                        <Compare
                          firstImage={item.beforeImage}
                          secondImage={item.afterImage}
                          firstImageClassName="object-cover"
                          secondImageClassname="object-cover"
                          className="sm:h-[220px] sm:w-[300px] h-[190px] w-[280px] rounded-lg"
                          slideMode="hover"
                          showHandlebar={true}
                          firstImageAlt={item.beforeImageAlt}
                          secondImageAlt={item.afterImageAlt}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Frame Step */}
        {activeStep === "frame" && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-black mb-2">Interactive Frame Designer</h3>
              <p className="text-gray-600">Design beautiful frames with our easy-to-use editor</p>
            </div>

            {/* Frame Editor Screenshot */}
            <div className="max-w-5xl mx-auto">
              <div className="relative bg-white rounded-2xl p-4 sm:p-8 border border-gray-200">
                <div className="relative ">
                  <Image
                    src="/digital-frame.webp"
                    alt="Frame designer interface showing restored photo being framed with various customization options"
                    className="w-full border-6 border-gray-200 bg-transparent backdrop-blur-lg rounded-xl" width={500} height={300}
                  />
                  
                  
             
                </div>
                
                
              </div>
            </div>
          </div>
        )}

        {/* Animation Step */}
        {activeStep === "animate" && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-black mb-2">Then watch them 
come to life</h3>
              <p className="text-gray-600">After restoration, choose how your loved ones move again with respectful, gentle animations.</p>
            </div>

            {/* Animation Presets */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ANIMATION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setVideoLoaded(false)
                      setSelectedPreset(preset)
                    }}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedPreset.id === preset.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <h4 className="font-medium text-black mb-1">{preset.name}</h4>
                    <p className="text-sm text-gray-600">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Demo */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl pt-8 border border-gray-200">
              

                <div className="flex justify-center mb-6">
                  <div className="relative border rounded-xl bg-gray-50 border-gray-200 p-3">
                    {/* Placeholder/Loading State */}
                    {!videoLoaded && (
                      <div className="sm:h-[300px] sm:w-[400px] h-[250px] w-[350px] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
                          <p className="text-gray-600 text-sm font-medium">Loading animation...</p>
                          <p className="text-gray-500 text-xs mt-1">{selectedPreset.name}</p>
                        </div>
                      </div>
                    )}
                    
                    <video
                      key={selectedPreset.id}
                      className={`sm:h-[300px] sm:w-[400px] h-[250px] w-[350px] rounded-lg object-cover transition-opacity duration-300 ${
                        videoLoaded ? 'opacity-100' : 'opacity-0 absolute inset-3'
                      }`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      onLoadedData={() => setVideoLoaded(true)}
                      onLoadStart={() => setVideoLoaded(false)}
                    >
                      <source src={selectedPreset.videoUrl} type="video/mp4" />
                      <img
                        src={showcaseItems[activeItem].afterImage || "/placeholder.svg"}
                        alt={showcaseItems[activeItem].afterImageAlt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </video>
                    
                    <div className="absolute -top-2 -right-2 bg-black flex items-center text-white px-2 py-1 rounded text-xs font-medium">
                      {selectedPreset.icon} <span className="ml-1">{selectedPreset.name}</span>
                    </div>
                  </div>
                </div>

                {/* Animation Preset Selector */}
                
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight mb-4">
              Ready to restore your photos, bring your loved ones back to life, and frame them beautifully?
            </p>
           
            
              <Link href="/login">
            
             <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden sm:w-auto">
            Upload & Animate Now
          </FramerButton>
            </Link>
        
          </div>
        </div>
      </div>
    </section>
  )
}
