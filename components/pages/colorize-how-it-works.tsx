import React from 'react';
import { ImagePlus, Palette, Download, MousePointer2, CheckCircle2, UploadCloud, HardDriveDownload, FileCheck } from 'lucide-react';

const STEPS = [
    {
        id: 1,
        title: "Upload B&W Photo",
        description: "Upload any black and white image (JPEG or PNG). We support high-resolution scans.",
        icon: <ImagePlus size={24} className="text-brand-black" />,
        visual: (
            <div className="w-full h-full relative bg-gray-50 overflow-hidden group/visual">
                {/* Dot Pattern Background */}
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* Upload UI */}
                <div className="absolute inset-5 rounded-2xl border-2 border-dashed border-gray-300 bg-white shadow-sm flex flex-col items-center justify-center gap-3 transition-colors duration-300 group-hover/visual:border-[#FF4D00]/50 group-hover/visual:bg-[#FF4D00]/5">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover/visual:bg-white group-hover/visual:text-[#FF4D00] transition-colors">
                        <UploadCloud size={24} />
                    </div>
                    <div className="space-y-1 text-center">
                        <div className="text-xs font-bold text-gray-400 group-hover/visual:text-[#FF4D00]/80 uppercase tracking-wide">Click to upload</div>
                        <div className="text-[10px] text-gray-300 font-medium">JPG, PNG, WEBP</div>
                    </div>
                </div>

                {/* Animated Cursor & File */}
                <div className="absolute top-1/2 left-1/2 z-20 animate-cursor-drop pointer-events-none">
                    <div className="relative">
                        <MousePointer2 className="w-6 h-6 text-brand-black fill-black absolute -right-1 -bottom-3 z-20 drop-shadow-md" />

                        <div className="w-14 h-16 bg-white rounded-lg shadow-xl border border-gray-100 flex items-center justify-center transform -rotate-6 origin-bottom-right">
                            <div className="w-full h-full p-1.5 flex flex-col gap-1">
                                <div className="w-full h-2/3 bg-gray-100 rounded-md overflow-hidden">
                                    <img src="/childhood-memories-black-and-white.webp" className="w-full h-full object-cover grayscale opacity-80" alt="file" />
                                </div>
                                <div className="space-y-1">
                                    <div className="w-2/3 h-1.5 bg-gray-200 rounded-full"></div>
                                    <div className="w-1/2 h-1.5 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 2,
        title: "AI Colorization",
        description: "Our deep learning model analyzes the scene and intelligently adds realistic colors to every detail.",
        icon: <Palette size={24} className="text-brand-black" />,
        visual: (
            <div className="w-full h-full relative bg-gray-100 overflow-hidden flex items-center justify-center">
                <div className="relative w-full h-full">
                    {/* Base Image (B&W) */}
                    <img
                        src="/childhood-memories-black-and-white.webp"
                        alt="Original"
                        className="absolute inset-0 w-full h-full object-cover grayscale"
                    />

                    {/* Colorized Image (Revealed by clip-path animation) */}
                    <div className="absolute inset-0 w-full h-full animate-[clip-scan_4s_ease-in-out_infinite] overflow-hidden z-10">
                        <img
                            src="/childhood-memories-colorized.webp"
                            alt="Colorized"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>

                    {/* Scanner Line & Glow */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-[#FF4D00] animate-[scan-line_4s_ease-in-out_infinite] z-20 shadow-[0_0_15px_#FF4D00]"></div>
                </div>

                {/* Clean Status Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-sm border border-gray-200 text-[10px] font-bold text-gray-600 px-3 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap z-20">
                    <div className="w-2 h-2 rounded-full border-2 border-[#FF4D00] border-t-transparent animate-spin"></div>
                    Colorizing...
                </div>

                <style>{`
            @keyframes clip-scan {
                0%, 100% { clip-path: inset(0 100% 0 0); }
                50% { clip-path: inset(0 0 0 0); }
            }
            @keyframes scan-line {
                0%, 100% { left: 0%; }
                50% { left: 100%; }
            }
         `}</style>
            </div>
        )
    },
    {
        id: 3,
        title: "Download Result",
        description: "Get your vibrant, studio-quality color photo, ready to print or share.",
        icon: <Download size={24} className="text-brand-black" />,
        visual: (
            <div className="w-full h-full relative bg-[#F9F9F9] overflow-hidden flex items-center justify-center p-6">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                {/* Professional Wide File Card - Cleaner, Less Shadow */}
                <div className="w-full max-w-[320px] bg-white rounded-xl border border-gray-200/80 p-4 flex items-center gap-4 relative z-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">

                    {/* File Icon / Thumb */}
                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 relative overflow-hidden">
                        <img src="/childhood-memories-colorized.webp" className="w-full h-full object-cover" alt="Thumb" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <FileCheck size={16} className="text-white drop-shadow-sm" />
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-800 truncate">colorized_memory.jpg</span>
                            <div className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 flex items-center gap-0.5">
                                <CheckCircle2 size={8} /> Ready
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                            <span>5.2 MB</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                            <span>300 DPI</span>
                        </div>

                        {/* Progress Bar (Full) */}
                        <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                            <div className="w-full h-full bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Floating Action Button (Download) */}
                <div className="absolute bottom-6 right-6 z-20">
                    <div className="w-10 h-10 bg-brand-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                        <HardDriveDownload size={18} />
                    </div>
                </div>

            </div>
        )
    }
];

export default function ColorizeHowItWorks() {
    return (
        <section id="how-it-works" className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 py-24 bg-white">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                <div className="max-w-2xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                        <span className="text-[#FF4D00]">//</span> How It Works <span className="text-[#FF4D00]">//</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
                        Add color <br />
                        <span className="text-gray-400/80">in 3 simple steps.</span>
                    </h2>
                </div>

                {/* Subtitle */}
                <div className="max-w-sm">
                    <p className="text-lg text-gray-600 font-medium leading-relaxed">
                        No complex editing skills required. Our AI handles the colorization process completely automatically.
                    </p>
                </div>
            </div>

            {/* Steps Grid Container - Gray Background */}
            <div className="bg-[#F3F4F6] p-3 rounded-[3rem]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {STEPS.map((step) => (
                        <div
                            key={step.id}
                            className="bg-white rounded-[2.5rem] p-8 min-h-[420px] flex flex-col group hover:shadow-lg transition-all duration-300"
                        >
                            {/* Step Number & Icon */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-[#F2F2F0] flex items-center justify-center transition-colors group-hover:bg-[#FF4D00]/10 group-hover:text-[#FF4D00]">
                                    {step.icon}
                                </div>
                                <span className="text-6xl font-[800] text-gray-100 leading-none select-none font-sans group-hover:text-gray-200 transition-colors">
                                    0{step.id}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="mb-10 relative z-10">
                                <h3 className="text-2xl font-bold text-brand-black mb-3">{step.title}</h3>
                                <p className="text-gray-600 font-medium leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Visual "Mini App" Area */}
                            <div className="mt-auto h-[200px] rounded-3xl overflow-hidden border border-gray-100 relative shadow-inner transform group-hover:translate-y-[-5px] transition-transform duration-300">
                                {step.visual}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};
