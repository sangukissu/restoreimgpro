"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface PaymentPlanProps {
  onSuccess: (newCredits: number) => void
  onError: (error: string) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export default function PaymentPlan({ onSuccess, onError, isProcessing, setIsProcessing }: PaymentPlanProps) {
  const { toast, loading } = useToast()
  const [plans, setPlans] = useState<Array<{ id: string; name: string; price_cents: number; credits: number }>>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [referralCode, setReferralCode] = useState<string>("")
  const [isApplyingReferral, setIsApplyingReferral] = useState(false)
  const [referralApplied, setReferralApplied] = useState(false)

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`/api/payment-plans?t=${Date.now()}`, { cache: "no-store" })
        const data = await res.json()
        setPlans(data || [])
        if (data && data.length > 0) {
          // Prefer selecting the 5-credit Starter plan by default if present
          const starter = data.find((p: any) => p.credits === 5)
          setSelectedPlanId((starter?.id as string) || data[0].id)
        }
      } catch (e) {
        onError("Failed to load plans. Please try again later.")
      }
    }
    fetchPlans()
  }, [onError])

  const handleApplyReferral = async () => {
    if (!referralCode.trim()) {
      toast.error("Please enter a referral code")
      return
    }

    setIsApplyingReferral(true)
    try {
      const response = await fetch("/api/referrals/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ referralCode: referralCode.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        setReferralApplied(true)
        toast.success(data.message || "Referral code applied successfully!")
      } else {
        toast.error(data.error || "Failed to apply referral code")
      }
    } catch (error) {
      toast.error("Failed to apply referral code. Please try again.")
    } finally {
      setIsApplyingReferral(false)
    }
  }

  const handlePurchase = async () => {
    setIsProcessing(true)
    const loadingToastId = loading("Creating payment...")

    // GA4: Track begin_checkout when user clicks Continue to Checkout
    try {
      const selectedPlan = plans.find((p) => p.id === selectedPlanId)
      if (selectedPlan && typeof window !== "undefined") {
        // Persist a local marker to detect checkout return without success
        try {
          localStorage.setItem('buyCheckout', JSON.stringify({
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            credits: selectedPlan.credits,
            amount: Number((selectedPlan.price_cents / 100).toFixed(2)),
            startedAt: new Date().toISOString(),
          }))
        } catch { /* ignore storage errors */ }

        if ((window as any).gtag) {
          (window as any).gtag('event', 'begin_checkout', {
            value: Number((selectedPlan.price_cents / 100).toFixed(2)),
            currency: 'USD',
            items: [
              {
                item_id: selectedPlan.id,
                item_name: selectedPlan.name,
                price: Number((selectedPlan.price_cents / 100).toFixed(2)),
                quantity: 1,
                credits: selectedPlan.credits,
              }
            ]
          })
        }
      }
    } catch { /* ignore analytics errors */ }

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: selectedPlanId })
      })

      if (!response.ok) {
        throw new Error("Failed to create payment")
      }

      const { payment_link, payment_id } = await response.json()

      // Update localStorage marker with payment_id for GA purchase transaction_id
      try {
        const markerStr = localStorage.getItem('buyCheckout')
        if (markerStr) {
          const marker = JSON.parse(markerStr)
          marker.paymentId = payment_id
          localStorage.setItem('buyCheckout', JSON.stringify(marker))
        }
      } catch { /* ignore storage errors */ }

      toast.dismiss(loadingToastId)
      window.location.href = payment_link
    } catch (error) {
      toast.dismiss(loadingToastId)
      const errorMessage = error instanceof Error ? error.message : "Failed to create payment. Please try again."
      onError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-8 shadow-xs hover:shadow-sm transition-shadow duration-200">
      <div className="text-center">
       

        {/* Plan Selector */}
        <div className="mb-2">
          <div className="grid grid-cols-1 gap-4">
            {plans.map((plan) => {
              // Determine badge and perks based on plan
              const isStarter = plan.credits === 5
              const isPlus = plan.credits === 15
              const badge = isPlus ? "BEST VALUE" : isStarter ? "POPULAR" : ""
              const badgeColor = isPlus ? "bg-green-500" : "bg-blue-500"
              
              const perks = isStarter 
                ? ["5 photo restorations"]
                : isPlus 
                ? ["5 photo restorations", "01 HD Video Animation"]
                : [`${plan.credits} photo restorations`]

              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative w-full text-left border rounded-xl p-4 transition-colors ${
                    selectedPlanId === plan.id ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Conversion Badge */}
                  {badge && (
                    <div className={`absolute -top-2 left-4 px-2 py-1 ${badgeColor} text-white text-xs font-bold rounded-full`}>
                      {badge}
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-black mb-1">{plan.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{plan.credits} credits</div>
                      
                      {/* Plan Perks */}
                      <div className="space-y-1">
                        {perks.map((perk, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-500">
                            <svg className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {perk}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-black ml-4">${(plan.price_cents / 100).toFixed(2)}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Have a referral code?</div>
          {!referralApplied ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter referral code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={isApplyingReferral}
              />
              <Button
                onClick={handleApplyReferral}
                disabled={isApplyingReferral || !referralCode.trim()}
                variant="outline"
                size="sm"
                className="px-4 py-2 text-sm"
              >
                {isApplyingReferral ? "Applying..." : "Apply"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Referral code applied successfully!</span>
            </div>
          )}
        </div>

        {/* Purchase Button */}
        <div className="mb-2">
          <Button
            onClick={handlePurchase}
            disabled={isProcessing || !selectedPlanId}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            {isProcessing ? "Processing..." : "Continue to Checkout"}
          </Button>
        </div>
        <p className="text-xs text-gray-500">Secure payments by dodopayments</p>
      </div>
    </div>
  )
}
