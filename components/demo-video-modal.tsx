"use client"

import { useState, forwardRef } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DemoVideoModalProps {
  videoSrc: string
  triggerText?: string
}

const ShinyButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
  const { className, children, ...rest } = props
  
  return (
    <button
      ref={ref}
      className={cn(
        "group relative overflow-hidden inline-flex items-center justify-center rounded-full p-[1.5px] transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:ring-offset-2",
        className
      )}
      {...rest}
    >
      {/* Animated Gradient Background (The Border) - Slow, smooth rotation with softer gradient */}
      <div className="absolute inset-[-100%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E5E7EB_0%,#FF8C42_50%,#E5E7EB_100%)] opacity-100" />
      
      {/* Button Content Container */}
      <div className="relative inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors group-hover:text-black">
        {children}
      </div>
    </button>
  )
})
ShinyButton.displayName = "ShinyButton"

export function DemoVideoModal({ videoSrc, triggerText = "See how it works" }: DemoVideoModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ShinyButton>
          <PlayCircle size={18} className="text-brand-orange fill-brand-orange/10 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-semibold tracking-tight">{triggerText}</span>
        </ShinyButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-gray-800 shadow-2xl">
        <DialogTitle className="sr-only">Demo Video Showcase</DialogTitle>
        <DialogDescription className="sr-only">
          A video demonstrating the features of our tool.
        </DialogDescription>
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
           <video
             src={videoSrc}
             className="w-full h-full object-contain"
             controls
             autoPlay
             playsInline
           />
        </div>
      </DialogContent>
    </Dialog>
  )
}
