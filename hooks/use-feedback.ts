import { useState, useEffect, useCallback } from 'react'

interface FeedbackTracking {
  total_restorations: number
  feedback_given: boolean
  feedback_skipped_count: number
  first_download_completed: boolean
}

interface UseFeedbackReturn {
  shouldShowFeedback: boolean
  isLoading: boolean
  showFeedbackModal: () => void
  hideFeedbackModal: () => void
  submitFeedback: (rating: number, feedback: string) => Promise<void>
  skipFeedback: () => Promise<void>
  trackRestoration: () => Promise<void>
  trackFirstDownload: () => Promise<void>
  checkFeedbackStatus: () => Promise<void>
  isModalOpen: boolean
  tracking: FeedbackTracking | null
}

export function useFeedback(): UseFeedbackReturn {
  const [shouldShowFeedback, setShouldShowFeedback] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tracking, setTracking] = useState<FeedbackTracking | null>(null)

  // Check feedback status from server
  const checkFeedbackStatus = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/feedback')
      
      if (response.ok) {
        const data = await response.json()
        setShouldShowFeedback(data.shouldShow)
        setTracking(data.tracking)
      } else {
        console.error('Failed to fetch feedback status:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error checking feedback status:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Track restoration completion
  const trackRestoration = useCallback(async () => {
    try {
      await fetch('/api/feedback/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'restoration_completed' })
      })
      
      // Refresh feedback status after tracking
      await checkFeedbackStatus()
    } catch (error) {
      console.error('Error tracking restoration:', error)
    }
  }, [checkFeedbackStatus])

  // Track first download
  const trackFirstDownload = useCallback(async () => {
    try {
      const response = await fetch('/api/feedback/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'first_download' })
      })
      
      if (response.ok) {
      } else {
        console.error('Failed to track first download:', response.status, response.statusText)
      }
      
      // Refresh feedback status after tracking
      await checkFeedbackStatus()
    } catch (error) {
      console.error('Error tracking first download:', error)
    }
  }, [checkFeedbackStatus])

  // Submit feedback
  const submitFeedback = useCallback(async (rating: number, feedback: string) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'submit',
          rating, 
          feedback_text: feedback 
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      // Update local state
      setShouldShowFeedback(false)
      setTracking(prev => prev ? { ...prev, feedback_given: true } : null)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      throw error
    }
  }, [])

  // Skip feedback
  const skipFeedback = useCallback(async () => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'skip' })
      })

      if (!response.ok) {
        throw new Error('Failed to skip feedback')
      }

      // Update local state
      setShouldShowFeedback(false)
      setTracking(prev => prev ? { 
        ...prev, 
        feedback_skipped_count: prev.feedback_skipped_count + 1 
      } : null)
    } catch (error) {
      console.error('Error skipping feedback:', error)
      throw error
    }
  }, [])

  // Show feedback modal
  const showFeedbackModal = () => {
    setIsModalOpen(true)
    // GA4: track feedback promotion when modal opens
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'view_promotion', {
          promotion_name: 'Feedback Modal',
        })
      }
    } catch {}
  }

  // Hide feedback modal
  const hideFeedbackModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  // Initialize feedback status on mount
  useEffect(() => {
    checkFeedbackStatus()
  }, [])

  return {
    shouldShowFeedback,
    isLoading,
    showFeedbackModal,
    hideFeedbackModal,
    submitFeedback,
    skipFeedback,
    trackRestoration,
    trackFirstDownload,
    checkFeedbackStatus,
    isModalOpen,
    tracking
  }
}