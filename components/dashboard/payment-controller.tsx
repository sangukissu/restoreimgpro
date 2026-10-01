"use client"

import React, { useEffect, useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { HeaderUser } from "@/components/dashboard/header-user"
import { DynamicBreadcrumb } from "@/components/dashboard/dynamic-breadcrumb"
import PaymentModal from "@/components/payment-modal"
import PaymentSuccessModal from "@/components/payment-success-modal"
import { CheckoutFeedback } from "@/components/dashboard/checkout-feedback"
import { useSearchParams } from "next/navigation"
import { useCredits } from "@/hooks/use-credits"
import { Separator } from "@/components/ui/separator"
import { trackConversion } from "@/lib/analytics"

interface PaymentControllerProps {
  user: {
    name: string
    email: string
    avatar: string
    id: string
  }
  initialCreditBalance: number
  children: React.ReactNode
}

type CheckoutMarker = {
  planId?: string
  planName?: string
  planTier?: string
  credits?: number
  amount?: number
  currency?: string
  startedAt?: string
  sessionId?: string
}

function readCheckoutMarker(): CheckoutMarker | null {
  try {
    const marker = localStorage.getItem("buyCheckout")
    return marker ? JSON.parse(marker) : null
  } catch {
    return null
  }
}

function clearCheckoutMarker() {
  try {
    localStorage.removeItem("buyCheckout")
  } catch {
    // Ignore storage issues after checkout completion.
  }
}

export default function PaymentController({ user, initialCreditBalance, children }: PaymentControllerProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [requestedPlanId, setRequestedPlanId] = useState<string | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState("")
  const searchParams = useSearchParams()
  const cancelledAttemptId = searchParams.get("checkout") === "cancelled" ? searchParams.get("attempt") : null

  const { credits } = useCredits(initialCreditBalance)

  useEffect(() => {
    const planId = searchParams.get("buyPlan")
    if (!planId) return
    setRequestedPlanId(planId)
    setShowPaymentModal(true)
    const url = new URL(window.location.href)
    url.searchParams.delete("buyPlan")
    window.history.replaceState(null, "", url.pathname + url.search + url.hash)
  }, [searchParams])

  useEffect(() => {
    if (searchParams.get("payment") !== "success") return
    const marker = readCheckoutMarker()
    if (!marker?.sessionId) return
    let cancelled = false

    async function verifyPayment() {
      for (let i = 0; i < 5 && !cancelled; i++) {
        try {
          const response = await fetch(`/api/dodopayments/checkout?session_id=${encodeURIComponent(marker!.sessionId!)}`, { cache: "no-store" })
          if (!response.ok) throw new Error("Status unavailable")
          const status = await response.json()
          if (cancelled) return
          if (status.completed || status.payment_status === "succeeded") {
            const dedupeKey = `oa_payment_completed:${marker!.sessionId}`
            try {
              if (!sessionStorage.getItem(dedupeKey)) {
                trackConversion("purchase", {
                  order_id: marker!.sessionId!,
                  plan_id: marker!.planId,
                  plan_name: marker!.planName,
                  plan_tier: marker!.planTier,
                  credits: marker!.credits,
                  amount: marker!.amount,
                  currency: marker!.currency || "USD",
                })
                sessionStorage.setItem(dedupeKey, "1")
              }
            } catch { /* Analytics should never block checkout. */ }
            clearCheckoutMarker()
            setCheckoutMessage("")
            setShowPaymentSuccess(true)
            setTimeout(() => setShowPaymentSuccess(false), 5000)
            return
          }
          if (["failed", "cancelled", "requires_payment_method"].includes(status.payment_status)) {
            setCheckoutMessage("Payment wasn't completed. You can try again or contact support@bringback.pro.")
            return
          }
        } catch { /* Retry while payment status settles. */ }
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
      if (!cancelled) setCheckoutMessage("We're confirming your payment. Your credits will update when it completes.")
    }
    void verifyPayment()
    return () => { cancelled = true }
  }, [searchParams])

  const handleBuyCredits = () => {
    setRequestedPlanId(null)
    setShowPaymentModal(true)
  }

  // Listen for custom event from child components (e.g., animate page)
  useEffect(() => {
    const handler = () => handleBuyCredits()
    window.addEventListener('open-payment-modal', handler)
    return () => window.removeEventListener('open-payment-modal', handler)
  }, [])

  const handlePaymentSkip = () => {
    setShowPaymentModal(false)
  }

  const handlePaymentSuccess = (_newCredits: number) => {
    // Credits are updated via webhook + realtime; just show success toast
    setShowPaymentModal(false)
    setIsProcessingPayment(false)
    setShowPaymentSuccess(true)
    setTimeout(() => setShowPaymentSuccess(false), 5000)
  }

  const handlePaymentError = (_error: string) => {
    setIsProcessingPayment(false)
    setShowPaymentModal(false)
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} initialCreditBalance={initialCreditBalance} onBuyCredits={handleBuyCredits} />
      <SidebarInset>
        {/* Header styled like example-layout.md */}
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <DynamicBreadcrumb />
          </div>
          <div className="px-4">
            <HeaderUser
              user={user}
              initialCreditBalance={initialCreditBalance}
              onBuyCredits={handleBuyCredits}
            />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-0">
          {checkoutMessage && <p className="mx-4 rounded-lg border border-gray-200 bg-white p-3 text-sm sm:mx-6" role="status">{checkoutMessage}</p>}
          {children}
        </div>

        {cancelledAttemptId && <CheckoutFeedback key={cancelledAttemptId} attemptId={cancelledAttemptId} />}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          initialPlanId={requestedPlanId}
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
          userCredits={Number(credits || 0)}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
