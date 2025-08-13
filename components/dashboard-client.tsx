"use client"

import { useState, useEffect } from "react"
import ImageUpload from "@/components/image-upload"
import ImageComparison from "@/components/image-comparison"
import PaymentModal from "@/components/payment-modal"
import DashboardHeader from "@/components/dashboard-header"
import { restoreImage, type RestoreImageResponse } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

type AppState = "upload" | "loading" | "comparison" | "error"

interface RestorationData {
  originalFile: File
  originalUrl: string
  restoredUrl: string
}

interface DashboardClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  isPaymentSuccess: boolean
}

export default function DashboardClient({ user, initialCredits, isPaymentSuccess }: DashboardClientProps) {
  const [appState, setAppState] = useState<AppState>("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [restorationData, setRestorationData] = useState<RestorationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState(initialCredits)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(isPaymentSuccess)
  const { toast } = useToast()

  // Show payment modal immediately if user has no credits
  useEffect(() => {
    if (userCredits <= 0) {
      setShowPaymentModal(true)
    }
  }, [userCredits])

  // Show success message if payment was successful
  useEffect(() => {
    if (isPaymentSuccess && userCredits > 0) {
      setShowPaymentSuccess(true)
      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => setShowPaymentSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isPaymentSuccess, userCredits])

  const handleImageSelect = (file: File) => {
    setSelectedFile(file)
    const imageUrl = URL.createObjectURL(file)
    setSelectedImageUrl(imageUrl)
    setError(null)
  }

  const handleRestore = async () => {
    if (!selectedFile) return

    setAppState("loading")
    setError(null)

    try {
      const response: RestoreImageResponse = await restoreImage(selectedFile)

      if (response.success && response.restoredImageUrl) {
        // Deduct credit after successful restoration
        const newCredits = userCredits - 1
        setUserCredits(newCredits)
        
        setRestorationData({
          originalFile: selectedFile,
          originalUrl: selectedImageUrl!,
          restoredUrl: response.restoredImageUrl,
        })
        setAppState("comparison")
        
        // Show success toast
        toast.success(`Image Restored Successfully! 1 credit deducted. ${newCredits} credits remaining.`)
      } else {
        setError(response.error || "Failed to restore image")
        setAppState("error")
      }
    } catch (error) {
      console.error("Error restoring image:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to restore image"
      setError(errorMessage)
      setAppState("error")
    }
  }

  const handleStartOver = () => {
    // Clean up URLs
    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl)
    }

    setAppState("upload")
    setSelectedFile(null)
    setSelectedImageUrl(null)
    setRestorationData(null)
    setError(null)
  }

  const handleRetry = () => {
    if (selectedFile) {
      handleRestore()
    }
  }

  // Handle payment modal actions
  const handlePaymentSkip = () => {
    setShowPaymentModal(false)
  }

  const handlePaymentSuccess = (newCredits: number) => {
    setUserCredits(newCredits)
    setShowPaymentModal(false)
    setIsProcessingPayment(false)
    
    toast.success(`Credits Added Successfully! You now have ${newCredits} credits to restore images.`)
  }

  const handlePaymentError = (error: string) => {
    setIsProcessingPayment(false)
    toast.error(`Payment Failed: ${error}`)
  }

  const handleBuyCredits = () => {
    setShowPaymentModal(true)
  }

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Redirect to login page
        window.location.href = '/login'
      } else {
        toast.error('Failed to sign out. Please try again.')
      }
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out. Please try again.')
    }
  }

  // If user has no credits, show payment modal and block dashboard
  if (userCredits <= 0) {
    return (
      <div className="min-h-screen bg-white relative">
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

        {/* Payment Success Banner */}
        {showPaymentSuccess && (
          <div className="relative z-10 bg-green-50 border-b border-green-200 mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-800 font-medium">Payment Successful!</span>
                  <span className="text-green-700">Your credits will be added shortly. Please refresh the page.</span>
                </div>
                <button
                  onClick={() => setShowPaymentSuccess(false)}
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Blocked State */}
        <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-24">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="font-inter font-bold text-3xl text-black mb-4">Get Credits to Start</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              You need credits to restore images. Purchase our premium plan to get started with AI-powered image restoration.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleBuyCredits}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors text-lg"
              >
                Get Credits Now
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors text-lg"
              >
                Refresh Page
              </button>
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

  // Normal dashboard when user has credits
  return (
    <div className="min-h-screen bg-white relative">
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

      {/* Payment Success Banner */}
      {showPaymentSuccess && (
        <div className="relative z-10 bg-green-50 border-b border-green-200 mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 font-medium">Payment Successful!</span>
                <span className="text-green-700">You now have {userCredits} credits to restore images.</span>
              </div>
              <button
                onClick={() => setShowPaymentSuccess(false)}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-24">
        <div className="text-center mb-12">
          <h1 className="font-inter font-bold text-3xl text-black mb-4">Restore Your Images</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your old, damaged, or low-quality photos and watch our AI transform them into stunning restored
            images.
          </p>
        </div>

        {/* Upload State */}
        {appState === "upload" && (
          <ImageUpload
            onImageSelect={handleImageSelect}
            onRestore={handleRestore}
            selectedFile={selectedFile}
            selectedImageUrl={selectedImageUrl}
          />
        )}

        {/* Loading State */}
        {appState === "loading" && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
              <div className="space-y-6">
                {/* Animated restoration icon */}
                <div className="w-20 h-20 mx-auto relative">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <h3 className="font-inter font-semibold text-xl text-black mb-2">
                    Giving one more life to your past...
                  </h3>
                  <p className="text-gray-600">Our AI is carefully restoring your image</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison State */}
        {appState === "comparison" && restorationData && (
          <ImageComparison
            originalUrl={restorationData.originalUrl}
            restoredUrl={restorationData.restoredUrl}
            onStartOver={handleStartOver}
          />
        )}

        {/* Error State */}
        {appState === "error" && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-red-50/60 backdrop-blur-sm border border-red-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="space-y-6">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="font-inter font-semibold text-xl text-red-900 mb-2">Restoration Failed</h3>
                  <p className="text-red-700 mb-6">{error}</p>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleRetry}
                      className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded font-medium transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleStartOver}
                      className="bg-gray-600 text-white hover:bg-gray-700 px-6 py-2 rounded font-medium transition-colors"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
