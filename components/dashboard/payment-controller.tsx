"use client"

import React, { useEffect, useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { HeaderUser } from "@/components/dashboard/header-user"
import { DynamicBreadcrumb } from "@/components/dashboard/dynamic-breadcrumb"
import PaymentModal from "@/components/payment-modal"
import PaymentSuccessModal from "@/components/payment-success-modal"
import { useSearchParams } from "next/navigation"
import { useCredits } from "@/hooks/use-credits"
import { Separator } from "@/components/ui/separator"

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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const searchParams = useSearchParams()

  const { credits } = useCredits(initialCreditBalance)

  useEffect(() => {
    const paymentStatus = searchParams.get("payment")
    if (paymentStatus === "success") {
      const marker = readCheckoutMarker()
      if (marker) {
        const completedKey = marker.sessionId || marker.startedAt || "payment-success"
        const dedupeKey = `ga_payment_completed:${completedKey}`

        try {
          if (!sessionStorage.getItem(dedupeKey)) {
            if (typeof window !== "undefined" && (window as any).gtag) {
              (window as any).gtag("event", "purchase", {
                transaction_id: marker.sessionId || completedKey,
                value: marker.amount,
                currency: marker.currency || "USD",
                items: [
                  {
                    item_id: marker.planId,
                    item_name: marker.planName,
                    price: marker.amount,
                    quantity: 1,
                    credits: marker.credits,
                  }
                ]
              })
            }
            sessionStorage.setItem(dedupeKey, "1")
          }
        } catch (e) {
          // Ignore analytics/storage errors
        }
      }

      clearCheckoutMarker()
      setShowPaymentSuccess(true)
      const timer = setTimeout(() => setShowPaymentSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleBuyCredits = () => {
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
          {children}
        </div>

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
          userCredits={Number(credits || 0)}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
