"use client"

import { useState } from "react"
import Link from "next/link"
import { Image as ImageIcon, Users, Video, ChevronRight, Frame, Sparkles, UserPlus, Eraser } from "lucide-react"

interface MainDashboardClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  isPaymentSuccess: boolean
}

export default function MainDashboardClient({ user, initialCredits, isPaymentSuccess }: MainDashboardClientProps) {
  const [credits, setCredits] = useState(initialCredits)



  return (
    <main className="mx-auto w-full px-4 sm:px-8 relative">

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-4 sm:mb-6">
        <div className="max-w-4xl">

          <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-[#111111] leading-8 sm:leading-[4rem]">
            Bring Your Memories <br />
            <span className="text-gray-400">Back to Life.</span>
          </h1>
        </div>
        <div className="max-w-sm">
          <p className="text-lg text-gray-600 font-medium leading-normal">
            Select a tool below to start transforming your photos with our advanced AI technology.
          </p>
        </div>
      </div>

      {/* Feature Bento Grid - Gray Surface Container */}
      <section className="bg-[#E6E6E6] p-4 rounded-[2rem]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Restore Photo - Large Card (Span 2) - Side by Side Layout */}
          <Link href="/dashboard/restore" className="group md:col-span-2 bg-white rounded-[1.5rem] p-5 flex flex-col sm:flex-row gap-6 relative hover:scale-[1.01] transition-transform duration-300 items-center">
            {/* Content (Left) */}
            <div className="flex flex-col gap-4 flex-1 h-full justify-between py-2">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#E6E6E6] flex items-center justify-center text-[#111111]">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold text-[#111111] leading-tight">Restore Photo</h2>
                </div>
                <p className="text-gray-500 font-medium leading-relaxed text-sm sm:text-base">
                  Bring old memories back to life. Fix damage, scratches, and blur with professional AI restoration.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[#FF4D00] font-bold text-sm mt-auto group-hover:translate-x-1 transition-transform">
                Start Restoration <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Visual Area (Right) - 4:3 Aspect Ratio */}
            <div className="w-full sm:w-[50%] aspect-[4/3] rounded-[1.2rem] overflow-hidden border border-gray-100 shadow-inner relative bg-gray-900 shrink-0">
              <img
                src="/dashboard-compare.png"
                alt="Restore preview"
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse"></div>
                  1 CREDIT
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                  <img src="/icons/pro-icon.svg" alt="Pro" className="w-3 h-3" />
                  PRO
                </div>
              </div>
            </div>
          </Link>

          {/* Animate Photo - Standard Card (Span 1) */}
          <Link href="/dashboard/animate" className="group bg-white rounded-[1.5rem] p-5 flex flex-col gap-5 relative hover:scale-[1.01] transition-transform duration-300">
            {/* Visual Area - 4:3 Aspect Ratio */}
            <div className="w-full aspect-[4/3] rounded-[1.2rem] overflow-hidden border border-gray-100 shadow-inner relative bg-gray-900">
              <video
                src="/videos/blink-tilt-animation.mp4"
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                  10 CREDITS
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                  <img src="/icons/pro-icon.svg" alt="Pro" className="w-3 h-3" />
                  PRO
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#111111] leading-tight">Animate Photo</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#FF4D00] group-hover:border-[#FF4D00] transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed text-xs">
                Turn static portraits into living moments.
              </p>
            </div>
          </Link>

          {/* Family Portrait */}
          <Link href="/dashboard/family-portrait" className="group bg-white rounded-[1.5rem] p-5 flex flex-col gap-5 relative hover:scale-[1.01] transition-transform duration-300">
            {/* Visual Area - 4:3 Aspect Ratio */}
            <div className="w-full aspect-[4/3] rounded-[1.2rem] overflow-hidden border border-gray-100 shadow-inner relative bg-gray-50">
              <img src="/family-portrait.png" alt="Family portrait" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  2 CREDITS
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                  <img src="/icons/pro-icon.svg" alt="Pro" className="w-3 h-3" />
                  PRO
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#111111] leading-tight">Family Portrait</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#FF4D00] group-hover:border-[#FF4D00] transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed text-xs">
                Combine photos into a cohesive group portrait.
              </p>
            </div>
          </Link>

          {/* Add Person */}
          <Link href="/dashboard/add-person" className="group bg-white rounded-[1.5rem] p-5 flex flex-col gap-5 relative hover:scale-[1.01] transition-transform duration-300">
            <div className="w-full aspect-[4/3] rounded-[1.2rem] overflow-hidden border border-gray-100 shadow-inner relative bg-gray-50">
              <img src="/family-portrait.png" alt="Add person preview" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
              <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#111111] shadow-sm">
                <UserPlus className="h-5 w-5" />
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse"></div>
                  2 CREDITS
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                  <img src="/icons/pro-icon.svg" alt="Pro" className="w-3 h-3" />
                  PRO
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#111111] leading-tight">Add Person</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#FF4D00] group-hover:border-[#FF4D00] transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed text-xs">
                Seamlessly insert someone into an existing photo.
              </p>
            </div>
          </Link>
          {/* Remove Person */}
          <Link href="/dashboard/remove-person" className="group bg-white rounded-[1.5rem] p-5 flex flex-col gap-5 relative hover:scale-[1.01] transition-transform duration-300">
            <div className="w-full aspect-[4/3] rounded-[1.2rem] overflow-hidden border border-gray-100 shadow-inner relative bg-gray-50">
              <img src="/dashboard-compare.png" alt="Remove person preview" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute left-1/2 top-1/2 h-20 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#FF4D00] bg-[#FF4D00]/25" />
              <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#111111] shadow-sm">
                <Eraser className="h-5 w-5" />
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse"></div>
                  2 CREDITS
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                  <img src="/icons/pro-icon.svg" alt="Pro" className="w-3 h-3" />
                  PRO
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#111111] leading-tight">Remove Person</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#FF4D00] group-hover:border-[#FF4D00] transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed text-xs">
                Brush over distractions and remove them cleanly.
              </p>
            </div>
          </Link>
          {/* Digital Frame */}
          <Link href="/dashboard/editor" className="group bg-white rounded-[1.5rem] p-5 flex flex-col gap-5 relative hover:scale-[1.01] transition-transform duration-300">
            {/* Visual Area - 4:3 Aspect Ratio */}
            <div className="w-full aspect-[4/3] rounded-[1.2rem] overflow-hidden border border-gray-100 shadow-inner relative bg-gray-50">
              <img src="/digital-frame.webp" alt="Digital frame" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                FREE
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#111111] leading-tight">Digital Frame</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#FF4D00] group-hover:border-[#FF4D00] transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed text-xs">
                Add elegant frames and borders to your photos.
              </p>
            </div>
          </Link>

          {/* Nostalgic Hug */}
          <Link href="/dashboard/nostalgic-hug" className="group bg-white rounded-[1.5rem] p-5 flex flex-col gap-5 relative hover:scale-[1.01] transition-transform duration-300">
            {/* Visual Area - 4:3 Aspect Ratio */}
            <div className="w-full aspect-[4/3] rounded-[1.2rem] overflow-hidden border border-gray-100 shadow-inner relative bg-gray-900">
              <iframe
                src="https://www.youtube.com/embed/Y0rdFdDdd10?autoplay=1&mute=1&loop=1&playlist=Y0rdFdDdd10&controls=0&modestbranding=1&rel=0&iv_load_policy=3"
                className="absolute inset-0 w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                allow="autoplay; encrypted-media"
                title="Nostalgic Hug"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></div>
                  20 CREDITS
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                  <img src="/icons/pro-icon.svg" alt="Pro" className="w-3 h-3" />
                  PRO
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#111111] leading-tight">Nostalgic Hug</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#FF4D00] group-hover:border-[#FF4D00] transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed text-xs">
                Create a heartwarming video hug across time.
              </p>
            </div>
          </Link>

        </div>
      </section>
    </main>
  )
}