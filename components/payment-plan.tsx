"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

interface PaymentPlanProps {
  onSuccess: (newCredits: number) => void
  onError: (error: string) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  onClose?: () => void
}

export default function PaymentPlan({ onSuccess, onError, isProcessing, setIsProcessing, onClose }: PaymentPlanProps) {
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
    const loadingToastId = loading("Creating checkout session...")

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
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: selectedPlanId })
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { id: session_id, url } = await response.json()

      // Update localStorage marker with checkout session id for GA attribution
      try {
        const markerStr = localStorage.getItem('buyCheckout')
        if (markerStr) {
          const marker = JSON.parse(markerStr)
          marker.sessionId = session_id
          localStorage.setItem('buyCheckout', JSON.stringify(marker))
        }
      } catch { /* ignore storage errors */ }

      toast.dismiss(loadingToastId)
      window.location.href = url
    } catch (error) {
      toast.dismiss(loadingToastId)
      const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session. Please try again."
      onError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 p-4 sm:p-8 shadow-xs hover:shadow-sm transition-shadow duration-200">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="text-center">
        {/* Persuasive Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Preserve Your Family Legacy
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Don&apos;t let your precious memories fade away. Invest in restoring your history today so future generations can see where they came from.
          </p>
        </div>

        {/* Plan Selector */}
        <div className="mb-2">
          <div className="grid grid-cols-1 gap-4">
            {plans.map((plan) => {
              // Determine badge and perks based on plan
              const isStarter = plan.credits === 5
              const isPlus = plan.credits === 20
              const isFamily = plan.credits === 60

              let perks: Array<{ text: string; available: boolean; highlight?: boolean }> = []

              if (isStarter) {
                perks = [
                  { text: "Restore 5 Photos", available: true, highlight: true },
                  { text: "No Photo Animation (Requires 10 credits)", available: false, highlight: true },
                ]
              } else if (isPlus) {
                perks = [
                  { text: "Restore 20 Photos", available: true },
                  { text: "OR Animate 2 Photos", available: true, highlight: true },
                ]
              } else if (isFamily) {
                perks = [
                  { text: "Restore 60 Photos", available: true },
                  { text: "OR Animate 6 Photos", available: true, highlight: true },
                ]
              } else {
                perks = [{ text: `${plan.credits} Credits`, available: true }]
              }

              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative w-full text-left border rounded-xl p-4 transition-all duration-200 ${selectedPlanId === plan.id ? "border-black bg-gray-50 ring-1 ring-black" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-black mb-1 flex items-center gap-2">
                        {plan.name}
                        {isStarter && <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full border border-gray-200">Starter</span>}
                        {isPlus && <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full border border-blue-100">Popular</span>}
                      </div>

                      {/* Plan Perks */}
                      <div className="space-y-1.5 mt-3">
                        {perks.map((perk, index) => (
                          <div key={index} className={`flex items-center text-xs ${perk.available ? "text-gray-700" : "text-gray-400"} ${perk.highlight ? "font-medium" : ""}`}>
                            {perk.available ? (
                              <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span className={perk.available ? "" : "line-through opacity-75"}>
                              {perk.text.replace(" (Requires 10 credits)", "")}
                            </span>
                            {!perk.available && perk.text.includes("Requires") && (
                                <span className="ml-1 text-red-500 font-medium text-[10px] no-underline opacity-100">
                                  (Needs 10 credits)
                                </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xl font-bold text-black">${(plan.price_cents / 100).toFixed(2)}</div>
                      <div className="text-xs text-gray-500 mt-1">{plan.credits} Credits</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Referral Code Section (Hidden) */}
        {/*
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Have a referral code?</div>
          {!referralApplied ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter referral code"
                className="w-full sm:flex-1 sm:max-w-[70%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={isApplyingReferral}
              />
              <Button
                onClick={handleApplyReferral}
                disabled={isApplyingReferral || !referralCode.trim()}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto px-4 py-2 text-sm"
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
        */}

        {/* Purchase Button */}
        <div className="mb-2">
          <Button
            onClick={handlePurchase}
            disabled={isProcessing || !selectedPlanId}
            className="w-full text-md text-white bg-black hover:bg-gray-800"
          >
            {isProcessing ? "Processing..." : "Continue to Checkout"}
          </Button>
        </div>
        <p className="text-xs text-gray-500">Secure payments by <a href="https://dodopayments.com" target="_blank" rel="noopener noreferrer" className="underline text-green-700">dodopayments</a></p>
      </div>
    </div>
  )
}
