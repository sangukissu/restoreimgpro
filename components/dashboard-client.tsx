"use client"

import { useState, useEffect, useRef } from "react"
import ImageUpload from "@/components/image-upload"
import ImageComparison from "@/components/image-comparison"
import PaymentModal from "@/components/payment-modal"
import PaymentSuccessModal from "@/components/payment-success-modal"
import DashboardHeader from "@/components/dashboard-header"
import { restoreImage, type RestoreImageResponse } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

type AppState = "feature-selection" | "upload" | "loading" | "comparison" | "error"

type FeatureType = "restore" | "denoise" | "deblur" | "colorize"

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
  const [appState, setAppState] = useState<AppState>("feature-selection")
  const [selectedFeature, setSelectedFeature] = useState<FeatureType | null>(null)
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

    setAppState("feature-selection")
    setSelectedFeature(null)
    setSelectedFile(null)
    setSelectedImageUrl(null)
    setRestorationData(null)
    setError(null)
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

  const handleFeatureSelect = (feature: FeatureType) => {
    setSelectedFeature(feature)
    setAppState("upload")
  }

  const handleBackToFeatures = () => {
    setAppState("feature-selection")
    setSelectedFeature(null)
    setSelectedFile(null)
    setSelectedImageUrl(null)
    setError(null)
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
        {/* Feature Selection State */}
        {appState === "feature-selection" && (
          <>
            <div className="text-center mb-16">
              <h1 className="font-inter font-bold text-4xl sm:text-5xl text-black mb-4">Choose Your Enhancement</h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
                Select the type of AI enhancement you'd like to apply to your photos
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
              {/* Restore Feature */}
                <div
                onClick={() => handleFeatureSelect("restore")}
                className="bg-white sm:mt-8 rounded-3xl sm:rounded-2xl p-6 sm:p-8 border-6 borer-gray-200 sm:border-4 sm:border-gray-200 backdrop-blur sm:transform sm:-rotate-2 sm:hover:rotate-0 transition-all duration-300 cursor-pointer hover:border-gray-400 sm:hover:border-black group relative z-10 active:scale-95 sm:active:scale-100"
              >
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-black mb-3 tracking-tight">Restore</h3>
                      <p className="text-gray-700 leading-relaxed text-base font-medium">
                        Fix damaged, torn, or faded photos with AI precision.
                      </p>
                    
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4">Restore</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Fix damaged, torn, or faded photos. Repair scratches, water damage, and bring back original colors.
                  </p>
                </div>
              </div>

              {/* Denoise Feature */}
              <div
                onClick={() => handleFeatureSelect("denoise")}
                className="bg-white rounded-3xl sm:rounded-2xl p-6 sm:p-8 border-6 border-gray-200 sm:border-4 sm:border-gray-200 backdrop-blur sm:transform sm:rotate-2 sm:hover:rotate-0 transition-all duration-300 cursor-pointer hover:border-gray-400 sm:hover:border-black group relative z-10 active:scale-95 sm:active:scale-100"
              >
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-black mb-3 tracking-tight">Denoise</h3>
                      <p className="text-gray-700 leading-relaxed text-base font-medium">
                        Remove grain, noise, and digital artifacts from photos.
                      </p>
                     
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4">Denoise</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Remove grain, noise, and digital artifacts from photos. Perfect for low-light or high-ISO images.
                  </p>
                </div>
              </div>

              {/* Deblur Feature */}
              <div
                onClick={() => handleFeatureSelect("deblur")}
                className="bg-white sm:mt-8 rounded-3xl sm:rounded-2xl p-6 sm:p-8 border-6 border-gray-200 sm:border-4 sm:border-gray-200 backdrop-blur sm:transform sm:-rotate-2 sm:hover:rotate-0 transition-all duration-300 cursor-pointer hover:border-gray-400 sm:hover:border-black group relative z-10 active:scale-95 sm:active:scale-100"
              >
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-black mb-3 tracking-tight">Deblur</h3>
                      <p className="text-gray-700 leading-relaxed text-base font-medium">
                        Sharpen blurry photos and bring back crisp details.
                      </p>
                    
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4">Deblur</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Sharpen blurry photos caused by camera shake or motion. Bring back crisp details and clarity.
                  </p>
                </div>
              </div>

              {/* Colorize Feature */}
              <div
                onClick={() => handleFeatureSelect("colorize")}
                className="bg-white rounded-3xl sm:rounded-2xl p-6 sm:p-8 border-6 border-gray-200 sm:border-4 sm:border-gray-200 backdrop-blur sm:transform sm:rotate-2 sm:hover:rotate-0 transition-all duration-300 cursor-pointer hover:border-gray-400 sm:hover:border-black group relative z-10 active:scale-95 sm:active:scale-100"
              >
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2V3z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3h2a2 2 0 012 2v12a4 4 0 01-4 4h-2V3z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21a4 4 0 004-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-black mb-3 tracking-tight">Colorize</h3>
                      <p className="text-gray-700 leading-relaxed text-base font-medium">
                        Add vibrant colors to black and white photos.
                      </p>
                    
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2V3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3h2a2 2 0 012 2v12a4 4 0 01-4 4h-2V3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21a4 4 0 004-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4">Colorize</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Transform black and white photos into vibrant colored images using AI technology.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Upload State Header */}
        {(appState === "upload" || appState === "loading" || appState === "comparison" || appState === "error") && (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={handleBackToFeatures}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Features
              </button>
              <div className="w-px h-6 bg-gray-300" />
              <span className="text-sm text-gray-500 capitalize">{selectedFeature} Mode</span>
            </div>
            <h1 className="font-inter font-bold text-3xl text-black mb-4">
              {selectedFeature === "restore" && "Restore Your Images"}
              {selectedFeature === "denoise" && "Denoise Your Images"}
              {selectedFeature === "deblur" && "Deblur Your Images"}
              {selectedFeature === "colorize" && "Colorize Your Images"}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {selectedFeature === "restore" && "Upload your old, damaged, or low-quality photos and watch our AI transform them into stunning restored images."}
              {selectedFeature === "denoise" && "Upload your noisy or grainy photos and let our AI remove unwanted noise while preserving important details."}
              {selectedFeature === "deblur" && "Upload your blurry photos and watch our AI sharpen them to crystal clear quality."}
              {selectedFeature === "colorize" && "Upload your black and white photos and watch our AI add vibrant, realistic colors to bring them to life."}
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
                    {selectedFeature === "restore" && "Giving one more life to your past..."}
                    {selectedFeature === "denoise" && "Cleaning up your image..."}
                    {selectedFeature === "deblur" && "Sharpening your image..."}
                    {selectedFeature === "colorize" && "Adding colors to your memories..."}
                  </h3>
                  <p className="text-gray-600">
                    {selectedFeature === "restore" && "Our AI is carefully restoring your image"}
                    {selectedFeature === "denoise" && "Our AI is removing noise and artifacts"}
                    {selectedFeature === "deblur" && "Our AI is enhancing clarity and sharpness"}
                    {selectedFeature === "colorize" && "Our AI is adding realistic colors to your photo"}
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
    </div>
  )
}