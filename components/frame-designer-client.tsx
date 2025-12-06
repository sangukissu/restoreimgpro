"use client"

import { useState } from "react"
import FrameDesigner from "@/components/frame-designer"

interface FrameDesignerClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  isPaymentSuccess: boolean
}

export default function FrameDesignerClient({ initialCredits }: FrameDesignerClientProps) {
  const [userCredits, setUserCredits] = useState(initialCredits)


  return (
    <div className="min-h-screen relative">
      {/* Dotted Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />
      </div>

 

      {/* Main Content */}
      <main className="relative z-10 min-h-dvh">
        <section className="mx-auto max-w-5xl px-2 py-6">
          <FrameDesigner />
        </section>
      </main>

    
    </div>
  )
}