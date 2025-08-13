"use client"

import { useState } from "react"
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

  const handlePurchase = async () => {
    setIsProcessing(true)
    const loadingToastId = loading("Creating payment...")

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to create payment")
      }

      const { payment_link } = await response.json()
      
      // Dismiss loading toast before redirect
      toast.dismiss(loadingToastId)
      
      // Redirect to payment page
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
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="text-center">
        {/* Plan Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan</h3>
          <p className="text-gray-600">Perfect for getting started</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">$2</span>
            <span className="text-gray-500 ml-1">one-time</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <ul className="space-y-3 text-left">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">5 image restorations</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">High-quality AI restoration</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Instant download</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">No monthly fees</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 text-lg font-medium rounded-lg transition-colors duration-200"
        >
          {isProcessing ? "Processing..." : "Get Started - $2"}
        </Button>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 mt-4">
          Secure payment powered by DodoPayments
        </p>
      </div>
    </div>
  )
}
