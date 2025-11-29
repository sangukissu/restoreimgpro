"use client"

import React from "react"
import { Image, Zap, Map } from "lucide-react"

export default function ColorizeQualitySection() {
    const factors = [
        {
            title: "Image Quality Matters",
            description: "Sharp, well-exposed photos with clear details produce the most realistic colorization. Blurry or very dark images may have less accurate color predictions.",
            icon: <Image className="h-6 w-6" />,
        },
        {
            title: "Common Objects Work Best",
            description: "The AI performs exceptionally well on familiar subjects like people, nature, buildings, and everyday objects that appear frequently in training data.",
            icon: <Zap className="h-6 w-6" />,
        },
        {
            title: "Context Helps Accuracy",
            description: "Photos with clear context clues - like outdoor settings, recognizable clothing styles, or familiar objects - help the AI make more accurate color choices.",
            icon: <Map className="h-6 w-6" />,
        },
    ]

    return (
        <section className="px-4 sm:px-8 py-24">
            <div className="max-w-[1320px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                            <span className="text-[#FF4D00]">//</span> Quality & Accuracy <span className="text-[#FF4D00]">//</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
                            Understanding <br />
                            <span className="text-gray-400">Realistic Colorization.</span>
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <div className="max-w-md">
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            Understanding what makes AI colorization realistic and when it works best.
                        </p>
                    </div>
                </div>

                {/* Factors Grid */}
                <div className="bg-brand-surface p-3 rounded-[1.8rem]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {factors.map((factor, index) => (
                            <div key={index} className="flex flex-col gap-4 p-6 rounded-[1.5rem] bg-white hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#FF4D00] shadow-sm">
                                    {factor.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-brand-black mb-2">{factor.title}</h3>
                                    <p className="text-gray-600 font-medium leading-relaxed text-sm">
                                        {factor.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
