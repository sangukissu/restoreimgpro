"use client"

import { useState } from "react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import PaymentModal from "@/components/payment-modal"
import PaymentSuccessModal from "@/components/payment-success-modal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Users, Video, ChevronRight, Frame } from "lucide-react"

interface MainDashboardClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  isPaymentSuccess: boolean
}

export default function MainDashboardClient({ user, initialCredits, isPaymentSuccess }: MainDashboardClientProps) {
  const [credits, setCredits] = useState(initialCredits)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(isPaymentSuccess)

  const handlePaymentSkip = () => {
    setShowPaymentModal(false)
  }

  const handlePaymentSuccess = (newCredits: number) => {
    setCredits(newCredits)
    setShowPaymentModal(false)
    setIsProcessingPayment(false)
    setShowPaymentSuccess(true)
    setTimeout(() => setShowPaymentSuccess(false), 5000)
  }

  const handlePaymentError = (error: string) => {
    setIsProcessingPayment(false)
    setShowPaymentModal(false)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
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
      <DashboardHeader 
        user={user} 
        credits={credits} 
        onBuyCredits={() => setShowPaymentModal(true)} 
      />

      <main className="mx-auto max-w-6xl pt-24 pb-16 relative">
    
        {/* Hero */}
        <section className="mb-4 px-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Choose a feature to get started</p>
              </div>
          
        </section>

        {/* Feature Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
            {/* Restore Photo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-700" />
                  Restore Photo
                </CardTitle>
                <CardDescription>Fix old or damaged photos with AI restoration.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border">
                  <img src="/dashboard-compare.png" alt="Restore preview" className="w-full h-56 sm:h-40 object-cover" />
              </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div className="text-sm text-gray-600">1 credit per restoration</div>
                <Link href="/dashboard/restore" className="inline-flex items-center">
                  <Button size="sm" className="inline-flex items-center gap-1">
                    Open
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Animate Photo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-gray-700" />
                  Animate Photo
                </CardTitle>
                <CardDescription>Bring portraits to life with subtle, natural motion.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border">
                  <video
                    src="/videos/blink-tilt-animation.mp4"
                    className="w-full h-56 sm:h-40 object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div className="text-sm text-gray-600">10 credits per video</div>
                <Link href="/dashboard/animate" className="inline-flex items-center">
                  <Button size="sm" className="inline-flex items-center gap-1">
                    Open
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Family Portrait */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-700" />
                  Family Portrait
                </CardTitle>
                <CardDescription>Combine up to 4 portraits into one cohesive photo.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border">
                  <img src="/family-portrait.png" alt="Family portrait preview" className="w-full h-56 sm:h-40 object-cover" />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div className="text-sm text-gray-600">1 credit per composite</div>
                <Link href="/dashboard/family-portrait" className="inline-flex items-center">
                  <Button size="sm" className="inline-flex items-center gap-1">
                    Open
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Digital Frame / Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Frame className="w-5 h-5 text-gray-700" />
                  Digital Frame
                </CardTitle>
                <CardDescription>Design and apply elegant frames to your photos.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border">
                  <img src="/digital-frame.webp" alt="Digital frame preview" className="w-full h-56 sm:h-40 object-cover" />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div className="text-sm text-gray-600">Free tool</div>
                <Link href="/dashboard/editor" className="inline-flex items-center">
                  <Button size="sm" className="inline-flex items-center gap-1">
                    Open
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSkip={handlePaymentSkip}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        isProcessing={isProcessingPayment}
        setIsProcessing={setIsProcessingPayment}
      />

      {/* Success Toast Modal */}
      <PaymentSuccessModal 
        isOpen={showPaymentSuccess} 
        onClose={() => setShowPaymentSuccess(false)} 
        userCredits={credits}
      />
    </div>
  )
}