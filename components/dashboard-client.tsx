"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import ImageUpload from "@/components/image-upload"
import ImageComparison from "@/components/image-comparison"
import PaymentModal from "@/components/payment-modal"
import { restoreImage, type RestoreImageResponse } from "@/lib/api-client"

type AppState = "upload" | "loading" | "comparison" | "error"

interface RestorationData {
  originalFile: File
  originalUrl: string
  restoredUrl: string
}

interface DashboardClientProps {
  user: User
  credits: number
}

export default function DashboardClient({ user, credits }: DashboardClientProps) {
  const [appState, setAppState] = useState<AppState>("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [restorationData, setRestorationData] = useState<RestorationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState(credits)
  // Add payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Show payment modal when user has no credits
  useEffect(() => {
    if (userCredits === 0) {
      setShowPaymentModal(true)
    }
  }, [userCredits])

  const handleImageSelect = (file: File) => {
    setSelectedFile(file)
    const imageUrl = URL.createObjectURL(file)
    setSelectedImageUrl(imageUrl)
    setError(null)
  }

  const handleRestore = async () => {
    if (!selectedFile) return

    if (userCredits <= 0) {
      setShowPaymentModal(true)
      return
    }

    setAppState("loading")
    setError(null)

    try {
      const response: RestoreImageResponse = await restoreImage(selectedFile)

      if (response.success && response.restoredImageUrl) {
        setRestorationData({
          originalFile: selectedFile,
          originalUrl: selectedImageUrl!,
          restoredUrl: response.restoredImageUrl,
        })
        setUserCredits((prev) => prev - 1)
        setAppState("comparison")
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

  const handlePaymentPurchase = () => {
    // For now, just give 5 credits and close modal
    setUserCredits(5)
    setShowPaymentModal(false)
  }

  const handleBuyCredits = () => {
    setShowPaymentModal(true)
  }

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

      {/* Header */}
      <header className="relative z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="font-inter font-bold text-xl text-black">Restore.me</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Enhanced credits display with buy button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className={`w-2 h-2 rounded-full ${userCredits > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span>{userCredits} credits</span>
                </div>
                {userCredits === 0 && (
                  <button
                    onClick={handleBuyCredits}
                    className="text-xs bg-black text-white hover:bg-gray-800 px-2 py-1 rounded transition-colors"
                  >
                    Buy
                  </button>
                )}
              </div>
              <div className="relative group">
                <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm font-medium text-gray-700">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleBuyCredits}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Buy credits
                  </button>
              
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        onPurchase={handlePaymentPurchase}
      />
    </div>
  )
}
