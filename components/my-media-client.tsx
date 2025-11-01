"use client"

import { useState, useEffect } from "react"
import DashboardHeader from "@/components/dashboard-header"
import PaymentModal from "@/components/payment-modal"
import PaymentSuccessModal from "@/components/payment-success-modal"
import { useToast } from "@/hooks/use-toast"

interface MyMediaClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  isPaymentSuccess: boolean
  videos: {
    id: string
    video_url: string | null
    preset_name: string
    created_at: string
  }[]
}

export default function MyMediaClient({ user, initialCredits, isPaymentSuccess, videos }: MyMediaClientProps) {
  const [credits, setCredits] = useState(initialCredits)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(isPaymentSuccess)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDeletingAllMedia, setIsDeletingAllMedia] = useState(false)
  const { toast } = useToast()

  // Show success message if payment was successful
  useEffect(() => {
    if (isPaymentSuccess && credits > 0) {
      setShowPaymentSuccess(true)
      const timer = setTimeout(() => setShowPaymentSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isPaymentSuccess, credits])

  const handlePaymentSkip = () => {
    setShowPaymentModal(false)
  }

  const handlePaymentSuccess = (newCredits: number) => {
    setCredits(newCredits)
    setShowPaymentModal(false)
    setIsProcessingPayment(false)
    toast.success(`Credits Added Successfully! You now have ${newCredits} credits to use across your dashboard.`)
  }

  const handlePaymentError = (error: string) => {
    setIsProcessingPayment(false)
    toast.error(`Payment Failed: ${error}`)
  }

  const handleBuyCredits = () => {
    setShowPaymentModal(true)
  }

  const handleDeleteAllMedia = async () => {
    setIsDeletingAllMedia(true)
    
    try {
      const response = await fetch('/api/delete-all-media', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete media')
      }

      const result = await response.json()
      toast.success('All media deleted successfully!')
      
      // Refresh the page to show updated state
      window.location.reload()
      
    } catch (error) {
      console.error('Error deleting all media:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete media')
    } finally {
      setIsDeletingAllMedia(false)
      setShowDeleteConfirmation(false)
    }
  }

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
        credits={credits} 
        onBuyCredits={handleBuyCredits} 
      />

      {/* Payment Success Modal */}
      <PaymentSuccessModal 
        isOpen={showPaymentSuccess}
        onClose={() => setShowPaymentSuccess(false)}
        userCredits={credits}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete All Media</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all your media? This action cannot be undone and will permanently remove all your restored images and generated videos.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isDeletingAllMedia}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllMedia}
                disabled={isDeletingAllMedia}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingAllMedia ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-bold">My Media</h1>
          {videos && videos.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              disabled={isDeletingAllMedia}
            >
              Delete All Media
            </button>
          )}
        </div>
        
        {videos && videos.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="break-inside-avoid mb-6 border rounded-lg overflow-hidden">
                {video.video_url ? (
                  <video
                    src={video.video_url}
                    className="w-full h-auto"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Video processing...</p>
                  </div>
                )}
                
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't generated any videos yet.</p>
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