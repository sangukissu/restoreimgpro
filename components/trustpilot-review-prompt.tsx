"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TrustpilotReviewPrompt({ hasPurchased }: { hasPurchased: boolean }) {
  const [hasReviewed, setHasReviewed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const reviewedFlag = localStorage.getItem("trustpilotReviewCompleted")
    setHasReviewed(reviewedFlag === "true")
  }, [hasPurchased])

  const handleReviewed = () => {
    localStorage.setItem("trustpilotReviewCompleted", "true")
    setHasReviewed(true)
  }

  if (!isHydrated || !hasPurchased || hasReviewed) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
              Enjoying BringBack?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Please rate us on Trustpilot. This helps other people trust us and improves our visibility.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button asChild className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold">
            <Link
              href="https://www.trustpilot.com/review/bringback.pro"
              target="_blank"
              rel="noopener noreferrer"
            >
              Leave Review
            </Link>
          </Button>
          <Button onClick={handleReviewed} variant="outline" className="w-full font-semibold">
            I Reviewed
          </Button>
        </div>
      </div>
    </div>
  )
}
