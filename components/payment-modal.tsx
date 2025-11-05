"use client"

import { useState } from "react"
import PaymentPlan from "./payment-plan"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSkip: () => void
  onSuccess: (newCredits: number) => void
  onError: (error: string) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  onSkip, 
  onSuccess, 
  onError, 
  isProcessing, 
  setIsProcessing 
}: PaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto">
        <div className="p-4">
          

          {/* Payment Plan */}
          <div className="mb-2">
            <PaymentPlan 
              onSuccess={onSuccess}
              onError={onError}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 underline"
              disabled={isProcessing}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}