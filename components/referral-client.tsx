"use client"

import { useState, useEffect } from "react"
import ReferralDashboard from "@/components/referral-dashboard"
import PaymentModal from "@/components/payment-modal"
import PaymentSuccessModal from "@/components/payment-success-modal"
import { toast } from "sonner"

interface ReferralClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  isPaymentSuccess: boolean
}

export default function ReferralClient({ user, initialCredits, isPaymentSuccess }: ReferralClientProps) {
  const [credits, setCredits] = useState(initialCredits)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(isPaymentSuccess)

  // Show success message if payment was successful
  useEffect(() => {
    if (isPaymentSuccess && credits > 0) {
      setShowPaymentSuccess(true)
      const timer = setTimeout(() => setShowPaymentSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isPaymentSuccess, credits])

  const handlePaymentSkip = () => {
    setShowPaymentModal(false)
  }

  const handlePaymentSuccess = (newCredits: number) => {
    setCredits(newCredits)
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
    <>
      <ReferralDashboard 
        user={user} 
        initialCredits={credits} 
        onBuyCredits={handleBuyCredits} 
      />

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

      {/* Payment Success Modal */}
      <PaymentSuccessModal 
        isOpen={showPaymentSuccess}
        onClose={() => setShowPaymentSuccess(false)}
        userCredits={credits}
      />
    </>
  )
}