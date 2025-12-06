"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Timer } from "lucide-react"

// Custom Christmas Hat Icon
const ChristmasHat = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22v-2" />
    <path d="M16 20a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2" />
    <path d="M12 18a7 7 0 0 1 7-7c0-4-3-6-7-6-4 0-7 2-7 6a7 7 0 0 1 7 7Z" />
    <circle cx="12" cy="3" r="2" />
  </svg>
);

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

  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const promoEndDate = "2025-12-25T23:59:59";

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(promoEndDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
              const isPlus = plan.credits === 20
              const isFamily = plan.credits === 60

              let badge = ""
              let badgeColor = ""

              // Temporarily disabled other badges for Christmas offer
              if (isFamily) {
                badge = "Christmas Offer"
                badgeColor = "bg-gradient-to-r from-red-600 to-green-600 shadow-sm"
              }

              let perks: string[] = []

              if (isStarter) {
                perks = ["Restore 5 Photos"]
              } else if (isPlus) {
                perks = ["Restore 20 Photos or 2 Videos"]
              } else if (isFamily) {
                perks = ["Restore 60 Photos or 6 Videos"]
              } else {
                perks = [`${plan.credits} Credits`]
              }

              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative w-full text-left border rounded-xl p-4 transition-all duration-200 ${selectedPlanId === plan.id
                    ? isFamily
                      ? "border-red-500 bg-red-50/50 ring-1 ring-red-500/20"
                      : "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {/* Conversion Badge */}
                  {badge && (
                    <div className={`absolute -top-2 left-4 px-2 py-1 ${badgeColor} text-white text-xs font-bold rounded-full flex items-center gap-1`}>
                      {isFamily && <ChristmasHat size={12} />}
                      {badge}
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-black mb-1 flex items-center gap-2">
                        {plan.name}
                        {isFamily && timeLeft && (
                          <span className="text-[10px] font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Timer size={10} />
                            {timeLeft.days}d {timeLeft.hours}h left
                          </span>
                        )}
                      </div>

                      {/* Plan Perks */}
                      <div className="space-y-1 mt-2">
                        {perks.map((perk, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-500">
                            <svg className={`w-3 h-3 mr-1 flex-shrink-0 ${isFamily ? 'text-red-500' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {perk}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {isFamily ? (
                        <>
                          <div className="text-xl font-bold text-red-600">$14.99</div>
                          <div className="text-xs text-gray-400 line-through font-medium">$24.99</div>
                        </>
                      ) : (
                        <div className="text-xl font-bold text-black">${(plan.price_cents / 100).toFixed(2)}</div>
                      )}
                    </div>
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

        {/* Purchase Button */}
        <div className="mb-2">
          <Button
            onClick={handlePurchase}
            disabled={isProcessing || !selectedPlanId}
            className={`w-full text-md text-white ${plans.find(p => p.id === selectedPlanId)?.credits === 60
              ? "bg-gradient-to-r from-red-600 to-green-600 hover:shadow-lg hover:shadow-red-500/20"
              : "bg-black hover:bg-gray-800"
              }`}
          >
            {isProcessing ? "Processing..." : "Continue to Checkout"}
          </Button>
        </div>
        <p className="text-xs text-gray-500">Secure payments by dodopayments</p>
      </div>
    </div>
  )
}
