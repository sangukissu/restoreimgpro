"use client"

import FamilyPortraitClient from "@/components/family-portrait-client"
import { useEffect, useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
import PaymentModal from "@/components/payment-modal"
import PaymentSuccessModal from "@/components/payment-success-modal"

interface Props {
  user: { email: string; id: string }
  initialCredits: number
  isPaymentSuccess: boolean
}

export default function FamilyPortraitDashboardClient({ user, initialCredits, isPaymentSuccess }: Props) {
  const [userCredits, setUserCredits] = useState(initialCredits)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(isPaymentSuccess)

  // Optional: auto-hide success toast after redirect success
  useEffect(() => {
    if (isPaymentSuccess) {
      // Hide success modal after a short delay to match other pages
      const timer = setTimeout(() => setShowPaymentSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isPaymentSuccess])

  const handleBuyCredits = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSkip = () => {
    setShowPaymentModal(false)
  }

  const handlePaymentSuccess = (newCredits: number) => {
    setUserCredits(newCredits)
    setShowPaymentModal(false)
    setIsProcessingPayment(false)
    setShowPaymentSuccess(true)
    setTimeout(() => setShowPaymentSuccess(false), 5000)
  }

  const handlePaymentError = (_error: string) => {
    setIsProcessingPayment(false)
    // Errors are already surfaced inside PaymentPlan; keep UX consistent
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
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="space-y-8">
          {/* Page intro */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-inter font-bold text-3xl md:text-4xl text-black mb-2">Family Portrait</h1>
            <p className="text-lg text-gray-600">
              Combine up to 4 individual portraits into a single family photo with consistent lighting and color.
            </p>

            {/* Holiday Banner */}
            <div className="mt-6 bg-gradient-to-r from-red-50 to-green-50 border border-red-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <span className="text-xl">🎄</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">New: Holiday Magic Mode</p>
                  <p className="text-sm text-gray-600">Create the perfect Christmas card from separate photos.</p>
                </div>
              </div>
              <div className="hidden sm:block text-xs font-semibold text-red-600 bg-white px-3 py-1 rounded-full border border-red-100">
                Try it below
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border rounded-2xl p-6 bg-white shadow-sm">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-black">Compose Your Portrait</h2>
                  <p className="text-sm text-gray-600">
                    Upload 1–4 clear, front-facing photos. For 3–4 people, use wider ratios like 4:3 or 16:9.
                  </p>
                </div>
                <div className="mt-6">
                  <FamilyPortraitClient />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="border rounded-2xl p-5 bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-black">Tips for Best Results</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside">
                  <li>Use well-lit, front-facing portraits with minimal occlusions.</li>
                  <li>Upload similar head sizes to simplify composition.</li>
                  <li>Choose 4:3 or 16:9 for 3–4 people to avoid tight cropping.</li>
                  <li>Keep backgrounds simple to maintain a cohesive look.</li>
                </ul>
              </div>
              <div className="border rounded-2xl p-5 bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-black">What You Get</h3>
                <p className="mt-2 text-sm text-gray-700">
                  A high‑quality composite image suitable for printing and sharing. No facial swapping — identities preserved.
                </p>
              </div>
            </aside>
          </div>
        </div>
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