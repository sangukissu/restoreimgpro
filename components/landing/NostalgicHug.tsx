
import React from 'react';
import { ArrowRight, Film, Lock, ScanFace, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ShineBorder } from "@/components/ui/shine-border"

export default function NostalgicHug() {
   return (
      <section id="nostalgic-hug" className="w-full max-w-[1320px] mx-auto py-24 bg-brand-bg">


         {/* Header */}
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
               {/* Badge */}
               <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                  <span className="text-brand-orange">//</span> New Feature <span className="text-brand-orange">//</span>
               </div>

               {/* Title */}
               <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
                  AI Nostalgic Hug  <br />
                  <span className="text-gray-400">Video Generator</span>
               </h2>
            </div>

            {/* Subtitle */}
            <div className="max-w-sm">
               <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  We all have moments we wish we could revisit. The Reunion Moment is the world’s first AI that bridges the gap of time.
               </p>
            </div>
         </div>


         <div className="bg-brand-surface p-3 rounded-[1.8rem]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

               {/* 1. Steps Card (Top Left) */}
               <div className="lg:col-span-1 bg-white rounded-[1.5rem] p-4 sm:p-6 flex flex-col justify-center relative overflow-hidden order-2 lg:order-1 h-full">

                  <div className="flex flex-col gap-2">
                     {/* Step 1 */}
                     <div className="flex gap-5 group">
                        <div className="flex flex-col items-center">
                           <div className="w-10 h-10 rounded-full bg-brand-black text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-brand-black/20 z-10 group-hover:scale-110 transition-transform duration-300">1</div>
                           <div className="w-0.5 h-full bg-gray-100 my-2 group-hover:bg-gray-200 transition-colors"></div>
                        </div>
                        <div className="pb-2">
                           <h3 className="text-lg font-bold text-brand-black mb-2">Bring Them Back</h3>
                           <p className="text-gray-500 text-sm leading-relaxed font-medium">
                              Upload a photo of your loved one. A simple headshot is all we need to legally reconstruct their body and bring them to life.                           </p>
                        </div>
                     </div>

                     {/* Step 2 */}
                     <div className="flex gap-5 group">
                        <div className="flex flex-col items-center">
                           <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-100 text-gray-400 flex items-center justify-center font-bold text-sm z-10 group-hover:border-brand-black group-hover:text-brand-black transition-colors duration-300">2</div>
                           <div className="w-0.5 h-full bg-gray-100 my-2 group-hover:bg-gray-200 transition-colors"></div>
                        </div>
                        <div className="pb-2">
                           <h3 className="text-lg font-bold text-brand-black mb-2">Join the Scene</h3>
                           <p className="text-gray-500 text-sm leading-relaxed font-medium">
                              Add a photo of yourself. We match the lighting and perspective so you fit perfectly into their world.                           </p>
                        </div>
                     </div>

                     {/* Step 3 */}
                     <div className="flex gap-5 group">
                        <div className="flex flex-col items-center">
                           <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-100 text-gray-400 flex items-center justify-center font-bold text-sm z-10 group-hover:border-[#ff5e57] group-hover:text-[#ff5e57] transition-colors duration-300">3</div>
                        </div>
                        <div className="pb-2">
                           <h3 className="text-lg font-bold text-brand-black mb-2">Experience the Hug</h3>
                           <p className="text-gray-500 text-sm leading-relaxed font-medium">
                              Receive your "Reunion Moment." A heartwarming, lifelike video where the distance of time disappears.                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-2">

                     <Link href="/dashboard">
                        <button className="group w-full flex items-center justify-between gap-3 bg-brand-black text-white pl-5 pr-2 py-2 rounded-full hover:scale-105 transition-transform duration-200 shadow-lg">
                           <span className="text-sm font-medium">Create Respectful Hug Video</span>
                           <div className="bg-brand-orange rounded-full p-2 text-white group-hover:bg-white group-hover:text-brand-orange transition-colors">
                              <Sparkles size={14} fill="currentColor" />
                           </div>
                        </button>
                     </Link>
                  </div>

               </div>

               {/* 2. Video Card (Top Right - Spans 2 cols) */}
               <div className="lg:col-span-2 bg-black rounded-[1.5rem] overflow-hidden relative min-h-[500px] order-1 lg:order-2 shadow-sm h-full">
                  <iframe
                     className="absolute inset-0 w-full h-full"
                     src="https://www.youtube.com/embed/Y0rdFdDdd10?rel=0&loop=1&playlist=Y0rdFdDdd10&modestbranding=1&controls=0&showinfo=0"
                     title="YouTube video player"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                     allowFullScreen
                  ></iframe>
               </div>

               {/* 3. Feature Card 1 */}
               <div className="bg-white rounded-[1.5rem] p-8 flex flex-col gap-4 hover:shadow-md transition-shadow order-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                     <ScanFace size={24} />
                  </div>
                  <h3 className="text-xl font-[850] text-brand-black">100% Identity Lock</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">
                     Facial features and clothing style are preserved for both individuals throughout the entire 5-second transition, eliminating 'Uncanny Valley' effects                  </p>
               </div>

               {/* 4. Feature Card 2 */}
               <div className="bg-white rounded-[1.5rem] p-8 flex flex-col gap-4 hover:shadow-md transition-shadow order-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                     <Film size={24} />
                  </div>
                  <h3 className="text-xl font-[850] text-brand-black">Face-Only to Full-Body</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">
                     We accurately generate full body structures and appropriate proportions from headshots, ensuring a believable, authentic representation.                  </p>
               </div>

               {/* 5. Feature Card 3 */}
               <div className="bg-white rounded-[1.5rem] p-8 flex flex-col gap-4 hover:shadow-md transition-shadow order-5">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                     <Lock size={24} />
                  </div>
                  <h3 className="text-xl font-[850] text-brand-black">Complex Interaction</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">
                     We use state-of-the-art video interpolation to animate the difficult physics of moving, sitting, and embracing, ensuring arms don't melt and expressions are genuinely loving.                  </p>
               </div>

            </div>
         </div>
      </section>
   );
};

export { NostalgicHug };
