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

  const handlePurchase = async () => {
    setIsProcessing(true)
    const loadingToastId = loading("Creating payment...")

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

      const { payment_link } = await response.json()
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
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs hover:shadow-sm transition-shadow duration-200">
      <div className="text-center">
       

        {/* Plan Selector */}
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-3">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`w-full text-left border rounded-xl p-4 transition-colors ${
                  selectedPlanId === plan.id ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-black">{plan.name}</div>
                    <div className="text-sm text-gray-600">{plan.credits} credits</div>
                  </div>
                  <div className="text-xl font-bold text-black">${(plan.price_cents / 100).toFixed(2)}</div>
                </div>
              </button>
            ))}
          </div>
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
        <p className="text-xs text-gray-500">Credits never expire</p>
      </div>
    </div>
  )
}
