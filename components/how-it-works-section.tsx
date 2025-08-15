"use client"
import { Cover } from "@/components/ui/cover"

export default function HowItWorksSection() {
  return (
    <section className="px-4 py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gray-500 italic text-lg mb-4">Our Process, Explained</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-black">Here's how it             <Cover>works</Cover>
</h2>
        </div>

        {/* Process Cards */}
        <div className="relative">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Step 1 */}
            <div className="bg-white lg:mt-8 rounded-2xl p-8 shadow-sm border-6 border-gray-200 bg-transparent backdrop-blur transform -rotate-2 sm:-rotate-5 relative z-10">
              <div className="mb-6">
                <span className="text-6xl font-bold text-black">1</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Upload</h3>
              <p className="text-gray-600 leading-relaxed">
                Drop in your old photos — torn edges, faded colors, scratches and all. We handle any condition.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-6 border-gray-200 bg-transparent backdrop-blur transform rotate-2 sm:rotate-5  relative z-10">
              <div className="mb-6">
                <span className="text-6xl font-bold text-black">2</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Restore</h3>
              <p className="text-gray-600 leading-relaxed">
                In seconds, our AI restores damaged photos, repairs faded colors, and smooths out years of wear without
                losing the original look.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-6 border-gray-200 bg-transparent backdrop-blur transform -rotate-2 sm:-rotate-5 relative z-10">
              <div className="mb-6">
                <span className="text-6xl font-bold text-black">3</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Get Your Memories</h3>
              <p className="text-gray-600 leading-relaxed">
                You get back a version that feels like it was taken yesterday, ready to print, frame, or share.
              </p>
            </div>
          </div>

          {/* Connection Line 1 to 2 - Made shorter */}
          <div className="absolute top-0 sm:-rotate-45 left-1/4 w-1/6 h-32 hidden lg:block z-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 247 69">
              <path
                d="M 10.716 56.236 C 10.716 56.236 38.876 9.087 88.573 3.406 C 138.271 -2.276 172.885 11.384 233.016 57.669 M 10.586 50.115 C 14.483 50.115 17.643 53.285 17.643 57.197 C 17.643 61.108 14.483 64.279 10.586 64.279 C 6.688 64.279 3.529 61.108 3.529 57.197 C 3.529 53.285 6.688 50.115 10.586 50.115 Z M 232.886 50.115 C 236.783 50.115 239.943 53.285 239.943 57.197 C 239.943 61.108 236.783 64.279 232.886 64.279 C 228.988 64.279 225.829 61.108 225.829 57.197 C 225.829 53.285 228.988 50.115 232.886 50.115 Z"
                stroke="rgb(255, 55, 0)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="transparent"
                opacity="1"
                pathLength="1"
                strokeDashoffset="0px"
                strokeDasharray="1px 1px"
                will-change="auto"
              ></path>
            </svg>
          </div>

          {/* Connection Line 2 to 3 */}
          <div className="absolute top-20 right-1/5 w-1/4 h-40 sm:-rotate-60 hidden lg:block z-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 106 179">
              <path
                d="M 95.993 11.704 C 43.708 8.765 57.558 98.411 77.749 93.631 C 97.94 88.852 48.295 23.589 19.858 39.508 C -8.579 55.425 10.736 95.485 15.297 103.641 C 19.859 111.796 46.874 150.721 92.134 170.369 M 92.468 163.464 C 96.205 163.464 99.234 166.488 99.234 170.219 C 99.234 173.949 96.205 176.974 92.468 176.974 C 88.731 176.974 85.702 173.949 85.702 170.219 C 85.702 166.488 88.731 163.464 92.468 163.464 Z M 95.851 4.728 C 99.588 4.728 102.617 7.752 102.617 11.483 C 102.617 15.214 99.588 18.238 95.851 18.238 C 92.114 18.238 89.085 15.214 89.085 11.483 C 89.085 7.752 92.114 4.728 95.851 4.728 Z"
                stroke="rgb(255, 55, 0)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="transparent"
                opacity="1"
                pathLength="1"
                strokeDashoffset="0px"
                strokeDasharray="1px 1px"
                will-change="auto"
              ></path>
            </svg>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-16">
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
            No complicated settings, no waiting around. Just upload your old photos and watch decades of damage
            disappear in seconds.
          </p>
        </div>
      </div>
    </section>
  )
}
