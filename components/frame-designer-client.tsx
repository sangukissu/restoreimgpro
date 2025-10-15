"use client"

import { useState, useEffect } from "react"
import FrameDesigner from "@/components/frame-designer"
import DashboardHeader from "@/components/dashboard-header"
import PaymentModal from "@/components/payment-modal"
import PaymentSuccessModal from "@/components/payment-success-modal"
import { useToast } from "@/hooks/use-toast"

interface FrameDesignerClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  isPaymentSuccess: boolean
}

export default function FrameDesignerClient({ user, initialCredits, isPaymentSuccess }: FrameDesignerClientProps) {
  const [userCredits, setUserCredits] = useState(initialCredits)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(isPaymentSuccess)
  const { toast } = useToast()

  // Show success message if payment was successful
  useEffect(() => {
    if (isPaymentSuccess && userCredits > 0) {
      // GA4: purchase event
      try {
        if (typeof window !== 'undefined') {
          const markerStr = localStorage.getItem('buyCheckout')
          if (markerStr && (window as any).gtag) {
            const marker = JSON.parse(markerStr)
            ;(window as any).gtag('event', 'purchase', {
              transaction_id: marker.paymentId || `${user.id}-${Date.now()}`,
              value: marker.amount || 0,
              currency: 'USD',
              items: [
                {
                  item_id: marker.planId,
                  item_name: marker.planName,
                  price: marker.amount || 0,
                  quantity: 1,
                  credits: marker.credits,
                }
              ]
            })
            // Clear marker after recording purchase
            try { localStorage.removeItem('buyCheckout') } catch {}
          }
        }
      } catch { /* ignore analytics errors */ }

      setShowPaymentSuccess(true)
      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => setShowPaymentSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isPaymentSuccess, userCredits, user.id])

  // Detect checkout abandonment (user returned without success)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const isSuccessParam = new URLSearchParams(window.location.search).get('payment') === 'success'
        const markerStr = localStorage.getItem('buyCheckout')
        if (!isSuccessParam && markerStr && (window as any).gtag) {
          const marker = JSON.parse(markerStr)
          ;(window as any).gtag('event', 'checkout_abandon', {
            value: marker.amount || 0,
            currency: 'USD',
            items: [
              {
                item_id: marker.planId,
                item_name: marker.planName,
                price: marker.amount || 0,
                quantity: 1,
                credits: marker.credits,
              }
            ],
            started_at: marker.startedAt,
          })
          // Clear marker after recording abandon
          try { localStorage.removeItem('buyCheckout') } catch {}
        }
      }
    } catch { /* ignore analytics errors */ }
  }, [])

  // Handle payment modal actions
  const handlePaymentSkip = () => {
    setShowPaymentModal(false)
  }

  const handlePaymentSuccess = (newCredits: number) => {
    setUserCredits(newCredits)
    setShowPaymentModal(false)
    setIsProcessingPayment(false)
    
    toast.success(`Credits Added Successfully! You now have ${newCredits} credits to use across your dashboard.`)
  }

  const handlePaymentError = (error: string) => {
    setIsProcessingPayment(false)
    toast.error(`Payment Failed: ${error}`)
  }

  const handleBuyCredits = () => {
    setShowPaymentModal(true)
  }

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

      {/* Dashboard Header */}
      <DashboardHeader 
        user={user} 
        credits={userCredits} 
        onBuyCredits={handleBuyCredits} 
      />

      {/* Payment Success Modal */}
      <PaymentSuccessModal 
        isOpen={showPaymentSuccess}
        onClose={() => setShowPaymentSuccess(false)}
        userCredits={userCredits}
      />

      {/* Main Content */}
      <main className="relative z-10 min-h-dvh pt-24">
        <section className="mx-auto max-w-5xl px-2 py-10">
          <FrameDesigner />
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
    </div>
  )
}