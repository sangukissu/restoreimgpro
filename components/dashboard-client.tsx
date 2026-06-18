"use client"

import { useState, useEffect, useRef } from "react"
import ImageUpload from "@/components/image-upload"
import ImageComparison from "@/components/image-comparison"
import FeedbackModal from "@/components/feedback-modal"
import { restoreImage, type RestoreImageResponse } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { useFeedback } from "@/hooks/use-feedback"
import { OrbitSepiaDust } from "@/components/ui/orbit-sepia-dust"
import { DemoVideoModal } from "./demo-video-modal"
import { createClient as createSupabaseClient } from "@/utils/supabase/client"

type AppState = "upload" | "loading" | "comparison" | "error"

type FeatureType = "restore"

interface RestorationData {
  id: string
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
}

export default function DashboardClient({ user, initialCredits }: DashboardClientProps) {
  const [appState, setAppState] = useState<AppState>("upload")
  const [selectedFeature, setSelectedFeature] = useState<FeatureType | null>("restore")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [restorationData, setRestorationData] = useState<RestorationData | null>(null)
  const [pendingRestorationId, setPendingRestorationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState(initialCredits)
  const { toast } = useToast()
  
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

  // Cleanup on unmount
  useEffect(() => {
    // Component lifecycle tracking
    return () => {
      // Component cleanup
      isRestoringRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!pendingRestorationId || !selectedFile || !selectedImageUrl || !selectedFeature) {
      return
    }

    const supabase = createSupabaseClient()
    let isResolved = false

    const applyRestorationResult = async (restoration: {
      id?: string
      status: string
      restored_image_url?: string | null
      error_message?: string | null
    }) => {
      if (isResolved) {
        return true
      }

      if (restoration.status === "completed" && restoration.restored_image_url) {
        let displayUrl = restoration.restored_image_url
        if (displayUrl.startsWith("images/")) {
          displayUrl = `/api/image-proxy?key=${encodeURIComponent(displayUrl)}`
        }

        const newData: RestorationData = {
          id: restoration.id || pendingRestorationId,
          originalFile: selectedFile,
          originalUrl: selectedImageUrl,
          restoredUrl: displayUrl,
          initialRestoredUrl: displayUrl,
          featureType: selectedFeature,
        }

        isResolved = true
        setRestorationData(newData)
        setPendingRestorationId(null)
        setAppState("comparison")

        try {
          const signature = `${selectedFile.name}:${selectedFile.size}:${selectedFile.lastModified}`
          sessionStorage.setItem(`restore_signature:${signature}`, "completed")
        } catch {}

        await trackRestoration()
        toast.success(`Image Restored Successfully! ${userCredits} credits remaining.`)
        return true
      }

      if (restoration.status === "failed") {
        isResolved = true
        setPendingRestorationId(null)
        setError(restoration.error_message || "Failed to restore image")
        setAppState("error")
        toast.error(restoration.error_message || "Failed to restore image")
        return true
      }

      return false
    }

    const syncRestorationStatus = async () => {
      const { data, error } = await supabase
        .from("image_restorations")
        .select("status, restored_image_url, error_message")
        .eq("id", pendingRestorationId)
        .single()

      if (error || !data) {
        return
      }

      await applyRestorationResult(data)
    }

    const channel = supabase
      .channel(`image-restoration-${pendingRestorationId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "image_restorations",
          filter: `id=eq.${pendingRestorationId}`,
        },
        async (payload) => {
          const restoration = payload.new as {
            status: string
            restored_image_url?: string | null
            error_message?: string | null
          }
          await applyRestorationResult(restoration)
        }
      )
      .subscribe()

    syncRestorationStatus()
    const intervalId = window.setInterval(() => {
      syncRestorationStatus()
    }, 4000)

    return () => {
      window.clearInterval(intervalId)
      supabase.removeChannel(channel)
    }
  }, [pendingRestorationId, selectedFile, selectedImageUrl, selectedFeature, toast, trackRestoration, userCredits])

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

    // Idempotency: prevent re-restoring the exact same file unless explicitly retried
    try {
      const signature = `${selectedFile.name}:${selectedFile.size}:${selectedFile.lastModified}`
      const existing = typeof window !== 'undefined' ? sessionStorage.getItem(`restore_signature:${signature}`) : null
      // If we've already completed a restore for this signature in this session, skip
      if (existing && appState !== 'error') {
        // Avoid accidental duplicate calls on tab revisit
        toast.info('Already restored this image. Skipping duplicate request.')
        return
      }
    } catch { /* ignore storage access errors */ }

    // Set restoring flag
    isRestoringRef.current = true

    // Start image restoration
    setAppState("loading")
    setError(null)

    let finalCredits = userCredits
    
    try {
      const response: RestoreImageResponse = await restoreImage(selectedFile)
      
      if (response.success && response.restorationId) {
        const newCredits = response.creditsRemaining ?? Math.max(0, userCredits - 1)
        finalCredits = newCredits
        setUserCredits(newCredits)
        setPendingRestorationId(response.restorationId)
        toast.success(`Restoration started. 1 credit deducted. ${newCredits} credits remaining.`)
      } else {
        setError(response.error || "Failed to restore image")
        setAppState("error")
      }
    } catch (e) {
      setError("An unexpected error occurred. Please try again.")
      setAppState("error")
    } finally {
      setUserCredits(finalCredits)
      // Reset ref after completion
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
    setPendingRestorationId(null)
    setError(null)
  }
  
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


      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 sm:px-8 py-6">


        {/* Upload State Header */}
        {(appState === "upload" || appState === "loading" || appState === "comparison" || appState === "error") && (
          <div className="text-center max-w-2xl mx-auto mb-4">
            <h1 className="  font-inter font-bold text-3xl text-black">
              Revive Your Photo
            </h1>
            <p className="text-lg text-gray-600 leading-tight mb-4">
              Upload your old, damaged, or low-quality photos and let our AI bring back your memories to life.
            </p>
            <div className="flex justify-center">
               <DemoVideoModal videoSrc="/videos/tear-torn-restoration.mp4" triggerText="See Restoration in Action" />
            </div>
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
          />
        )}

        {/* Loading State */}
        {appState === "loading" && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-black border border-gray-800 rounded-2xl p-16 text-center relative overflow-hidden aspect-video flex items-center justify-center">
              <div className="absolute inset-0 w-full h-full">
                <OrbitSepiaDust />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="font-inter font-semibold text-2xl text-white mb-2">
                  Giving one more life to your past...
                </h3>
                <p className="text-gray-100">
                  Our AI is carefully restoring your image. This can take up to a minute.
                </p>
              </div>
              
            </div>
          </div>
        )}

        {/* Comparison State */}
        {appState === "comparison" && restorationData && (
          <>
            <ImageComparison
              originalUrl={restorationData.originalUrl}
              restoredUrl={restorationData.restoredUrl}
              onStartOver={handleStartOver}
              onDownload={handleDownload}
            />
            <div className="mx-auto mt-4 flex max-w-5xl justify-center">
              <a
                href={`/dashboard/memory-book?sourceType=restoration&sourceId=${restorationData.id}`}
                className="inline-flex items-center rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
              >
                Add to Family Heritage keepsake
              </a>
            </div>
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
