"use client"

import { useState, useEffect, useRef } from "react"
import ImageUpload from "@/components/image-upload"
import ImageComparison from "@/components/image-comparison"
import PaymentModal from "@/components/payment-modal"
import PaymentSuccessModal from "@/components/payment-success-modal"
import DashboardHeader from "@/components/dashboard-header"
import FeedbackModal from "@/components/feedback-modal"
import { restoreImage, type RestoreImageResponse } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { useFeedback } from "@/hooks/use-feedback"

type AppState = "upload" | "loading" | "comparison" | "error"

type FeatureType = "restore"

interface RestorationData {
  originalFile: File
  originalUrl: string
  restoredUrl: string
  featureType: FeatureType
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
  const [selectedFeature, setSelectedFeature] = useState<FeatureType | null>("restore")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [restorationData, setRestorationData] = useState<RestorationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState(initialCredits)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(isPaymentSuccess)
  const { toast } = useToast()
  
  // Add ref to track current restoration request
  const isRestoringRef = useRef(false)
  
  // Feedback system integration
  const {
    shouldShowFeedback,
    isModalOpen: isFeedbackModalOpen,
    showFeedbackModal,
    hideFeedbackModal,
    submitFeedback,
    skipFeedback,
    trackRestoration,
    trackFirstDownload
  } = useFeedback()

  // Removed automatic payment modal trigger - users should manually buy credits

  // Show success message if payment was successful
  useEffect(() => {
    if (isPaymentSuccess && userCredits > 0) {
      setShowPaymentSuccess(true)
      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => setShowPaymentSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isPaymentSuccess, userCredits])

  // Cleanup on unmount
  useEffect(() => {
    // Component lifecycle tracking
    return () => {
      // Component cleanup
      isRestoringRef.current = false
    }
  }, [])

  const handleImageSelect = (file: File) => {
    setSelectedFile(file)
    const imageUrl = URL.createObjectURL(file)
    setSelectedImageUrl(imageUrl)
    setError(null)
  }

  const handleRestore = async () => {
    if (!selectedFile) return

    // Handle restore request

    // Prevent duplicate API calls
    if (appState === "loading" || isRestoringRef.current) {
      return
    }

    // Set restoring flag
    isRestoringRef.current = true

    // Start image restoration
    setAppState("loading")
    setError(null)

    let finalCredits = userCredits
    
    try {
      // Make API call to restore image
      const response: RestoreImageResponse = await restoreImage(selectedFile)
      
      if (response.success && response.restoredImageUrl) {
        // Deduct credit after successful restoration
        const newCredits = userCredits - 1
        finalCredits = newCredits
        setUserCredits(newCredits)
        
        setRestorationData({
          originalFile: selectedFile,
          originalUrl: selectedImageUrl!,
          restoredUrl: response.restoredImageUrl,
          featureType: selectedFeature!,
        })
        setAppState("comparison")
        
        // Track restoration completion for feedback system
        await trackRestoration()
        
        // Show success toast
        toast.success(`Image Restored Successfully! 1 credit deducted. ${newCredits} credits remaining.`)
      } else {
        setError(response.error || "Failed to restore image")
        setAppState("error")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to restore image"
      setError(errorMessage)
      setAppState("error")
    } finally {
      // Clean up the restoring flag
      isRestoringRef.current = false
    }
  }

  const handleStartOver = () => {
    // Clean up URLs
    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl)
    }

    // Reset restoring flag
    isRestoringRef.current = false

    setAppState("upload")
    setSelectedFeature("restore")
    setSelectedFile(null)
    setSelectedImageUrl(null)
    setRestorationData(null)
    setError(null)
  }
  
  // Handle download with feedback tracking
  const handleDownload = async (restoredUrl: string) => {
    try {
      const response = await fetch(restoredUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `restored-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      // Track first download for feedback system
      await trackFirstDownload()
      
      // Check feedback status after tracking and show modal if needed
      const response2 = await fetch('/api/feedback')
      if (response2.ok) {
        const data = await response2.json()
        if (data.shouldShow) {
          setTimeout(() => {
            showFeedbackModal()
          }, 1500) // 1.5 seconds delay
        }
      }
    } catch (error) {
      console.error("Error downloading image:", error)
      toast.error("Failed to download image")
    }
  }
  
  // Handle feedback submission
  const handleFeedbackSubmit = async (rating: number, feedback: string) => {
    try {
      await submitFeedback(rating, feedback)
      hideFeedbackModal()
      toast.success("Thank you for your feedback!")
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.")
    }
  }
  
  // Handle feedback skip
  const handleFeedbackSkip = async () => {
    try {
      await skipFeedback()
      hideFeedbackModal()
    } catch (error) {
      toast.error("Failed to skip feedback. Please try again.")
    }
  }

  const handleRetry = () => {
    if (selectedFile) {
      // Reset restoring flag before retry
      isRestoringRef.current = false
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
      // Sign out error occurred
      toast.error('Failed to sign out. Please try again.')
    }
  }

  // Normal dashboard for all users
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
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 sm:px-8 py-12 pt-24">


        {/* Upload State Header */}
        {(appState === "upload" || appState === "loading" || appState === "comparison" || appState === "error") && (
          <div className="text-center mb-12">
            <h1 className="font-inter font-bold text-3xl text-black mb-4">
              Revive Your Photo
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your old, damaged, or low-quality photos and let our AI bring back your memories to life.
            </p>
          </div>
        )}

        {/* Upload State */}
        {appState === "upload" && (
          <ImageUpload
            key={`image-upload-${appState}-${selectedFile?.name || 'no-file'}`}
            onImageSelect={handleImageSelect}
            onRestore={handleRestore}
            selectedFile={selectedFile}
            selectedImageUrl={selectedImageUrl}
            userCredits={userCredits}
            onBuyCredits={handleBuyCredits}
          />
        )}

        {/* Loading State */}
        {appState === "loading" && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-16 text-center">
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
                  <p className="text-gray-600">
                    Our AI is carefully restoring your image
                  </p>
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
            onDownload={handleDownload}
          />
        )}

        {/* Error State */}
        {appState === "error" && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-red-50/60 backdrop-blur-sm border border-red-200 rounded-2xl p-6 text-center">
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
      
      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={hideFeedbackModal}
        onSubmit={handleFeedbackSubmit}
        onSkip={handleFeedbackSkip}
      />
    </div>
  )
}