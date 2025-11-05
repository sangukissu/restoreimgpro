"use client"
import { FramerButton } from "@/components/ui/framer-button"
import { ChevronRight, Smile, Eye, Heart, Wand2 } from "lucide-react"
import Link from "next/link"
import { Compare } from "@/components/ui/compare"
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
  return (
    <section id="examples" className="px-4 py-20 bg-[#fff6f0de]">
      <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
          <p className="text-gray-500 italic text-lg mb-4"></p>
 <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-6">
            <Wand2 className="w-4 h-4 mr-2" />
            Real Transformations
          </div>
          <h2 className="max-w-3xl mx-auto text-4xl lg:text-5xl text-black mb-6 leading-tight">
            A Complete Solution for Any Type of Photo Damage
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From torn family portraits to faded wedding photos, see how BringBack handles every type of photo damage
            with precision and care — then brings your loved ones back to life and frames them beautifully.
          </p>
        </div>

        {/* Restoration Section (visible, crawlable) */}
        <div className="space-y-8">
         

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {showcaseItems.map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-6 border-6 border-gray-200">
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

        {/* Animation Section (visible, crawlable) */}
        <div className="space-y-6 mt-16">
          <h2 className="max-w-3xl mx-auto text-4xl lg:text-5xl text-black mb-4 leading-tight text-center">
            Bring Your Memories to Life with Photo Animation
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-center">
            Once your photo is restored to perfect clarity, take the magic a step further. Our AI photo animation technology
            analyzes faces and creates subtle, lifelike movements — a gentle smile, a warm blink, or a slight turn of the head.
            It’s a deeply moving way to reconnect with cherished memories and see your ancestors in a whole new light.
          </p>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ANIMATION_PRESETS.map((preset) => (
                <div key={preset.id} className="bg-white rounded-2xl border-6 border-gray-200 p-4">
                  <h3 className="text-lg font-bold text-black mb-1">{preset.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
                  <div className="relative border rounded-xl bg-gray-50 border-gray-200 p-3">
                    <video
                      className="h-[240px] w-full rounded-lg object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    >
                      <source src={preset.videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute -top-2 -right-2 bg-black flex items-center text-white px-2 py-1 rounded text-xs font-medium">
                      {preset.icon} <span className="ml-1">{preset.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Framing Section (visible, crawlable) */}
        <div className="space-y-6 mt-16">
          <h2 className="max-w-3xl mx-auto text-4xl lg:text-5xl text-black mb-4 leading-tight text-center">
            Frame Your Restored Memory Beautifully
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-center">
            The perfect memory deserves the perfect presentation. Choose from our library of beautiful digital photo frames to
            complement your restored and animated pictures. Customize styles, colors, and add captions to create a truly personal
            keepsake — ideal for sharing on social media, displaying on digital devices, or sending as a heartfelt gift.
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="relative bg-white rounded-2xl p-4 sm:p-8 border border-gray-200">
              <div className="relative">
                <Image
                  src="/digital-frame.webp"
                  alt="Digital photo frame showcasing a restored and animated memory"
                  className="w-full border-6 border-gray-200 bg-transparent backdrop-blur-lg rounded-xl"
                  width={1200}
                  height={675}
                />
              </div>
            </div>
          </div>
        </div>

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
