
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

// Custom X (Twitter) Logo Component
const XLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export const Footer: React.FC = () => {
    return (
        <footer className="w-full px-4 sm:px-8 pb-8 pt-0 bg-brand-bg">
            {/* Main Dark Card Container */}
            <div className="bg-[#111111] rounded-[1.8rem] px-6 sm:px-12 py-16 text-white overflow-hidden relative">

                {/* Top Section: CTA and Links */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* Left: Brand & CTA */}
                    <div className="lg:col-span-5 flex flex-col justify-between h-full">
                        <div className="mb-12">
                            {/* Logo */}
                            <div className="flex items-center gap-2 mb-8 cursor-pointer select-none">
                                <div className="relative">
                                    <div className="flex items-center justify-center bg-white text-brand-black w-8 h-8 rounded-lg">
                                        <Sparkles size={16} fill="currentColor" />
                                    </div>
                                </div>
                                <span className="text-2xl font-extrabold tracking-tight">BringBack</span>
                            </div>

                            <h2 className="text-5xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight leading-[0.95] mb-8">
                                Ready to restore <br />
                                <span className="text-gray-400">your memories?</span>
                            </h2>

                            <p className="text-gray-400 font-medium text-lg max-w-md mb-8">
                                Join thousands of users bringing their old photos back to life with AI. Secure, fast, and magical.
                            </p>
                        </div>


                    </div>

                    {/* Right: Navigation Links */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:pl-12 mb-8">
                        <div className="flex flex-col gap-6">
                            <h4 className="text-gray-500 font-bold text-sm uppercase tracking-wider">Features</h4>
                            <a href="/denoise-photos" className="font-medium hover:text-brand-orange transition-colors">Denoise Photos</a>
                            <a href="/colorize-photos" className="font-medium hover:text-brand-orange transition-colors">Colorize Photos</a>
                            <a href="/ai-photo-animation" className="font-medium hover:text-brand-orange transition-colors">AI Photo Animation</a>
                            <a href="/ai-family-portrait" className="font-medium hover:text-brand-orange transition-colors">AI Family Portrait</a>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h4 className="text-gray-500 font-bold text-sm uppercase tracking-wider">Product</h4>
                            <a href="/pricing" className="font-medium hover:text-brand-orange transition-colors">Pricing</a>
                            <a href="/examples" className="font-medium hover:text-brand-orange transition-colors">Examples</a>
                            <a href="/blog" className="font-medium hover:text-brand-orange transition-colors">Blog</a>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h4 className="text-gray-500 font-bold text-sm uppercase tracking-wider">Legal</h4>
                            <a href="/privacy" className="font-medium hover:text-brand-orange transition-colors">Privacy Policy</a>
                            <a href="/terms" className="font-medium hover:text-brand-orange transition-colors">Terms of Service</a>
                            <a href="/refunds" className="font-medium hover:text-brand-orange transition-colors">Refund Policy</a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 mb-12"></div>

                {/* Bottom Section: Copyright & Socials */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-gray-500 font-medium text-center md:text-left">
                        © 2025 BringBack AI. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <a href="https://x.com/AINotSoSmart" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group" aria-label="X (Twitter)">
                            <XLogo className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                        </a>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-orange rounded-full blur-[200px] opacity-10 pointer-events-none"></div>
            </div>
        </footer>
    );
};
