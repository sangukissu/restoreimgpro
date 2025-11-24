"use client";

import React from 'react';
import { Search, Brain, Filter, Sparkles } from 'lucide-react';

const TECH_STEPS = [
    {
        icon: <Search size={32} className="text-white" />,
        title: "Noise Pattern Analysis",
        description: "Our AI first identifies the type of noise in your photo—whether it's high-ISO grain, color noise from low light, or digital artifacts from compression.",
        tags: ["Luminance noise", "Color noise", "Compression artifacts", "Banding"]
    },
    {
        icon: <Brain size={32} className="text-white" />,
        title: "Content Preservation",
        description: "While removing noise, the AI carefully preserves important details like hair texture, fabric patterns, and facial features that could be mistaken for noise.",
        tags: ["Fine details", "Textures", "Sharp edges", "Important patterns"]
    },
    {
        icon: <Filter size={32} className="text-white" />,
        title: "Selective Processing",
        description: "Different areas of your photo get different treatment—smooth backgrounds get heavy denoising while detailed areas like faces get gentle, precise cleaning.",
        tags: ["Adaptive strength", "Content-aware", "Region-specific"]
    },
    {
        icon: <Sparkles size={32} className="text-white" />,
        title: "Quality Verification",
        description: "Before delivering results, our AI checks that no important details were lost and that the noise reduction looks natural and professional.",
        tags: ["Natural results", "Detail retention", "Artifact-free"]
    }
];

export default function DenoiseTechnologySection() {
    return (
        <section className="w-full px-4 sm:px-8 py-24">
            <div className="max-w-[1320px] mx-auto">


                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                            <span className="text-brand-orange">//</span> Technology <span className="text-brand-orange">//</span>
                        </div>
                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
                            How our AI <br />
                            <span className="text-gray-400">understands and removes noise.</span>
                        </h2>
                    </div>
                    <div className="max-w-sm">
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            Advanced signal processing meets machine learning to separate noise from actual image content.
                        </p>
                    </div>
                </div>

                {/* Process Grid */}
                <div className="bg-brand-surface p-3 rounded-[1.8rem]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {TECH_STEPS.map((step, index) => (
                            <div key={index} className="bg-white rounded-[1.5rem] p-8 flex flex-col gap-6 group hover:shadow-lg transition-shadow duration-300">

                                <div className="flex items-start justify-between">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-black flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300">
                                        {step.icon}
                                    </div>
                                    <span className="text-6xl font-[800] text-gray-100 leading-none select-none font-sans">
                                        0{index + 1}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-brand-black mb-3">{step.title}</h3>
                                    <p className="text-gray-600 font-medium leading-relaxed mb-6">
                                        {step.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {step.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
