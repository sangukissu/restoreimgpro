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
import LetterGlitch from "@/components/ui/letter-glitch"
import { analyzeRestoredImage, rerestoreImage, type AnalyzeImageResponse } from "@/lib/api-client"

type AppState = "upload" | "loading" | "comparison" | "error"

type FeatureType = "restore"

interface RestorationData {
  originalFile: File
  originalUrl: string
  restoredUrl: string
  initialRestoredUrl: string
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
  
  // New analysis and re-restoration states
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalyzeImageResponse | null>(null)
  const [isRerestoring, setIsRerestoring] = useState(false)
  const [hasUsedSecondPass, setHasUsedSecondPass] = useState(false)

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
        
        const newData: RestorationData = {
          originalFile: selectedFile,
          originalUrl: selectedImageUrl!,
          restoredUrl: response.restoredImageUrl,
          initialRestoredUrl: response.restoredImageUrl,
          featureType: selectedFeature!,
        }
        setRestorationData(newData)
        setHasUsedSecondPass(false)
        setAppState("comparison")
        
        // Trigger post-restore analysis (non-blocking)
        setIsAnalyzing(true)
        analyzeRestoredImage(newData.originalUrl, newData.restoredUrl, newData.initialRestoredUrl)
          .then((res) => {
            setAnalysis(res)
          })
          .catch((e) => {
            console.error("Analyze failed", e)
          })
          .finally(() => setIsAnalyzing(false))
        
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
    setAnalysis(null)
    setHasUsedSecondPass(false)
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
          <div className="text-center max-w-2xl mx-auto mb-4">
            <h1 className="font-inter font-bold text-3xl text-black">
              Revive Your Photo
            </h1>
            <p className="text-lg text-gray-600 leading-tight">
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
            <div className="bg-black border border-gray-800 rounded-2xl p-16 text-center relative overflow-hidden aspect-video flex items-center justify-center">
              <div className="absolute inset-0 w-full h-full">
                <LetterGlitch glitchSpeed={1} />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="font-inter font-semibold text-2xl text-white mb-2">
                  {isRerestoring ? "Making one more improvement..." : "Giving one more life to your past..."}
                </h3>
                <p className="text-gray-100">
                  {isRerestoring
                    ? "We’re refining your photo to preserve identity and reduce artifacts. This can take up to a minute."
                    : "Our AI is carefully restoring your image. This can take up to a minute."}
                </p>
              </div>
              
            </div>
          </div>
        )}

        {/* Comparison State */}
        {appState === "comparison" && restorationData && (
          <>
            {/* Analysis status strip (reserved space) above comparison */}
            <div className="mb-4 w-full max-w-4xl mx-auto min-h-16">
              {isAnalyzing && (
                <div
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 transition-colors"
                  role="status"
                  aria-live="polite"
                >
                  Analyzing restored image for remaining issues...
                </div>
              )}
              {!isAnalyzing && analysis && analysis.shouldRerestore && !hasUsedSecondPass && (
                <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 shadow-sm">
                  {/* banner content unchanged */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                          <path d="M12 3l1.5 3.9 3.9 1.5-3.9 1.5-1.5 3.9-1.5-3.9-3.9-1.5 3.9-1.5L12 3z" />
                          <path d="M6 14l.8 2.1 2.1.8-2.1.8L6 20l-.8-2.1-2.1-.8 2.1-.8L6 14z" />
                          <path d="M18 14l.8 2.1 2.1.8-2.1.8L18 20l-.8-2.1-2.1-.8 2.1-.8L18 14z" />
                        </svg>
                      </span>
                      <div>
                        <h4 className="text-amber-900 font-semibold">We found a few issues in the AI restoration</h4>
                        <p className="text-amber-900/80 text-sm">We can refine your photo and reduce artifacts with one more pass. It’s quick and completely free.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded text-sm disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                        disabled={isRerestoring}
                        onClick={async () => {
                          if (!restorationData?.restoredUrl || !analysis?.analysis?.recommended_second_pass_prompt) return
                          try {
                            setIsRerestoring(true)
                            setAnalysis(null)
                            setIsAnalyzing(false)
                            setAppState("loading")
                            const res = await rerestoreImage(restorationData.restoredUrl, analysis.analysis.recommended_second_pass_prompt, restorationData.initialRestoredUrl)
                            if (res.success && res.imageUrl) {
                              const updatedData = { ...restorationData, restoredUrl: res.imageUrl }
                              setRestorationData(updatedData)
                              setHasUsedSecondPass(true)
                              toast.success("We improved your photo — enjoy the enhanced result!")
                              // re-analyze the new result
                              setIsAnalyzing(true)
                              analyzeRestoredImage(updatedData.originalUrl, updatedData.restoredUrl, updatedData.initialRestoredUrl)
                                .then((res) => {
                                  setAnalysis(res)
                                })
                                .catch((e) => {
                                  console.error("Analyze failed", e)
                                })
                                .finally(() => setIsAnalyzing(false))
                              setAppState("comparison")
                            } else {
                              toast.error(res.error || "Failed to apply the free improvement.")
                              setAppState("comparison")
                            }
                          } catch (e) {
                            toast.error("Failed to apply the free improvement.")
                            setAppState("comparison")
                          } finally {
                            setIsRerestoring(false)
                          }
                        }}
                      >
                        {isRerestoring ? "Improving..." : "Fix my photo (free)"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!isAnalyzing && analysis && !analysis.shouldRerestore && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                  Looks good — no second pass needed.
                </div>
              )}
              {!isAnalyzing && !analysis && (
                <div className="h-0" aria-hidden />
              )}
            </div>

            <ImageComparison
              originalUrl={restorationData.originalUrl}
              restoredUrl={restorationData.restoredUrl}
              onStartOver={handleStartOver}
              onDownload={handleDownload}
            />
          </>
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