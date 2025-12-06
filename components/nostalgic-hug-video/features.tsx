"use client";

import React from "react";
import { Heart, Shield, Zap, Sparkles } from "lucide-react";

const PRINCIPLES = [
    {
        icon: <Heart size={24} />,
        title: "Deep Emotional Connection",
        description:
            "We go beyond simple animation. Our AI understands the nuance of a hug, creating a moment that feels genuine, warm, and deeply touching.",
    },
    {
        icon: <Shield size={24} />,
        title: "Private & Secure",
        description:
            "Your photos are processed securely and deleted shortly after generation. We respect your memories and your privacy above all else.",
    },
    {
        icon: <Zap size={24} />,
        title: "Instant Creation",
        description:
            "No complex editing software needed. Just upload two photos, and our AI handles the lighting, positioning, and animation automatically.",
    },
    {
        icon: <Sparkles size={24} />,
        title: "Cinematic Quality",
        description:
            "Receive a high-definition video ready to share. Perfect for family group chats, social media, or keeping as a cherished digital keepsake.",
    },
];

export default function NostalgicHugFeatures() {
    return (
        <section id="features" className="px-4 sm:px-8 py-24">
            <div className="max-w-[1320px] mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                            <span className="text-brand-orange">//</span> Features <span className="text-brand-orange">//</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
                            Magic in Every <br />
                            <span className="text-gray-400">Embrace.</span>
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <div className="max-w-md">
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            Designed with love, built with advanced AI. We've made it simple to create the impossible.
                        </p>
                    </div>
                </div>

                {/* Grid Container - Gray Background */}
                <div className="bg-brand-surface p-3 rounded-[1.8rem]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {PRINCIPLES.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[1.5rem] p-6 flex flex-col gap-6 h-full shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-orange">
                                    {item.icon}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-xl font-bold text-brand-black leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 font-medium leading-relaxed text-sm">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
