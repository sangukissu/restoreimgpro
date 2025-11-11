'use client';

import Link from 'next/link';
import { FramerButton } from '@/components/ui/framer-button';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function NotFound() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle background */}
        <div className="absolute inset-0 bg-[url('/hero-bg.webp')] bg-cover bg-center opacity-40 pointer-events-none" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          
          {/* Vintage photograph hanging from a pin */}
          <div className="relative mb-12">
            {/* Pin at the top */}
            <div className="relative w-80 h-64 mx-auto mb-8">
              {/* Pin shadow */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-400 rounded-full shadow-lg"></div>
              {/* Pin */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
              
              {/* Photo hanging slightly tilted */}
              <div className="relative w-full h-full transform rotate-1 rounded-lg overflow-hidden shadow-xs shadow-zinc-500/20 bg-[#ffeae1] p-2">
                <div className="w-full h-full relative rounded overflow-hidden">
                  {/* Base sepia-toned vintage photo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 opacity-80"></div>
                  <div className="absolute inset-0 bg-[url('/childhood-memories-black-and-white.webp')] bg-cover bg-center opacity-60 sepia"></div>
                  
                  {/* Restored image overlay - appears on hover */}
                  <div className={`absolute inset-0 bg-[url('/childhood-memories-colorized.webp')] bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                    isHovering ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                  
                  {/* Damage effects - fade out on hover */}
                  <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isHovering ? 'opacity-0' : 'opacity-100'
                  }`}>
                    {/* Water damage stains */}
                    <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-amber-800 rounded-full opacity-40 blur-sm"></div>
                    <div className="absolute bottom-1/4 left-1/6 w-20 h-12 bg-amber-700 rounded-full opacity-35 blur-sm"></div>
                    
                    {/* Age spots and discoloration */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-800/20 via-transparent to-yellow-800/30"></div>
                  </div>
                  
                  {/* 404 text - fades out on hover */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
                    isHovering ? 'opacity-0' : 'opacity-100'
                  }`}>
                    <span className="text-7xl font-bold text-amber-900/80 mix-blend-multiply tracking-wider" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
                      404
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-6 leading-tight">
            Some things are beyond restoration
          </h1>
          
          {/* Body text */}
          <p className="text-lg text-gray-800 mb-10 leading-relaxed max-w-xl mx-auto">
It feels frustrating to look for something and not find it. We get it. That's the same feeling our users have about their faded photos. While this page is gone, we can ensure your memories are not. Let us bring them home.          </p>

          {/* Single CTA button with hover detection */}
          <div 
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="inline-block"
          >
            <Link href="/dashboard">
              <FramerButton 
                variant="primary" 
                icon={<ChevronRight className="w-4 h-4" />} 
                className="text-lg py-6"
              >
                Restore Your Memories
              </FramerButton>
            </Link>
          </div>

          {/* Small tagline */}
          <p className="text-sm text-gray-600 mt-8">
            Some damage is permanent. Your photos don't have to be.
          </p>
        </div>
      </div>
    </div>
  );
}