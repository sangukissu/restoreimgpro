"use client"
import { useState, useEffect } from "react"
import { X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rating: number, feedback: string) => void
  onSkip: () => void
}

const EMOJI_RATINGS = [
  { value: 1, emoji: "😞", label: "Poor" },
  { value: 2, emoji: "😐", label: "Fair" },
  { value: 3, emoji: "🙂", label: "Good" },
  { value: 4, emoji: "😊", label: "Great" },
  { value: 5, emoji: "🤩", label: "Amazing" },
]

const FEEDBACK_SUGGESTIONS = [
  "Easy to use",
  "Great results",
  "Fast processing",
  "Love the quality",
  "Exceeded expectations",
  "Simple interface",
  "Amazing restoration",
  "Perfect for old photos",
]

export default function FeedbackModal({ isOpen, onClose, onSubmit, onSkip }: FeedbackModalProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRating(null)
      setFeedbackText("")
      setIsSubmitting(false)
      setShowThankYou(false)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!selectedRating) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(selectedRating, feedbackText)
      setShowThankYou(true)
      
      // Auto close after showing thank you
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      setIsSubmitting(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (feedbackText.includes(suggestion)) {
      setFeedbackText(feedbackText.replace(suggestion, "").replace(/,\s*,/g, ",").replace(/^,\s*|,\s*$/g, ""))
    } else {
      setFeedbackText(prev => prev ? `${prev}, ${suggestion}` : suggestion)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
        <div 
          className={`
            relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl
            transform transition-all duration-500 ease-out
            ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-95'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {showThankYou ? (
            // Thank You State
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600 fill-current" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
              <p className="text-gray-600">Your feedback helps us improve BringBack for everyone.</p>
            </div>
          ) : (
            // Feedback Form
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">How was your experience?</h3>
                  <p className="text-sm text-gray-500 mt-1">Help us improve BringBack</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Rating Section */}
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">Rate your experience</p>
                  <div className="flex justify-center space-x-2">
                    {EMOJI_RATINGS.map((rating) => (
                      <button
                        key={rating.value}
                        onClick={() => setSelectedRating(rating.value)}
                        className={`
                          p-3 rounded-xl transition-all duration-200 hover:scale-110
                          ${selectedRating === rating.value 
                            ? 'bg-blue-50 ring-2 ring-blue-500 scale-110' 
                            : 'hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="text-2xl">{rating.emoji}</div>
                        <div className="text-xs text-gray-600 mt-1">{rating.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Text */}
                {selectedRating && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">What did you like most?</p>
                    
                    {/* Quick suggestions */}
                    <div className="flex flex-wrap gap-2">
                      {FEEDBACK_SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`
                            px-3 py-1.5 text-xs rounded-full border transition-all
                            ${feedbackText.includes(suggestion)
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            }
                          `}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                    
                    {/* Text area */}
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Tell us more about your experience... (optional)"
                      className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      maxLength={500}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={onSkip}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Skip
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedRating || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}