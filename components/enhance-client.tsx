"use client"

import { useState } from "react"
import EnhancedImageComparison from "@/components/enhanced-image-comparison"
import { useToast } from "@/hooks/use-toast"
import LetterGlitch from "@/components/ui/letter-glitch"

interface EnhanceClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  restoredImageUrl: string
}

export default function EnhanceClient({ user, initialCredits, restoredImageUrl }: EnhanceClientProps) {
  const [userCredits, setUserCredits] = useState(initialCredits)
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()



  const handleEnhance = async () => {
    try {
      setIsEnhancing(true)
      setError(null)
      const response = await fetch("/api/fal/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: restoredImageUrl })
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || data.error || "Enhancement failed")
      }

      const url: string = data.enhancedImageUrl
      setEnhancedImageUrl(url)
      toast.success("Image enhanced successfully!")
    } catch (e) {
      const message = e instanceof Error ? e.message : "Enhancement failed"
      setError(message)
      toast.error(message)
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleDownloadEnhanced = async (url: string) => {
    try {
      if (!url) {
        throw new Error("No enhanced image URL available")
      }
      // Try fetching the image as a blob (works for same-origin/CORS-enabled URLs)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch enhanced image: ${response.status}`)
      }
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = objectUrl
      a.download = `enhanced-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error("Error downloading enhanced image via blob:", error)
      // Fallback: direct link download/open if blob fetch fails due to CORS
      try {
        const a = document.createElement("a")
        a.href = url
        a.download = `enhanced-image-${Date.now()}.png`
        a.rel = "noopener"
        a.target = "_blank"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } catch (fallbackError) {
        console.error("Direct link download failed:", fallbackError)
        toast.error("Failed to download enhanced image")
      }
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Pattern */}
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
        <div className="text-center mb-8">
          <h1 className="  font-inter font-bold text-3xl text-black mb-2">Enhance Your Restored Photo</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Sharpen details, upscale faces, and add clarity without losing natural look.</p>
        </div>

        {/* Restored image preview and enhance button */}
        {!enhancedImageUrl && (
          <div className="w-full max-w-4xl mx-auto bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6">
            <div className="flex flex-col items-center gap-6">
              {isEnhancing ? (
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden border-4 border-gray-200 shadow-sm">
                  <LetterGlitch glitchSpeed={20} smooth outerVignette />
                </div>
              ) : (
                <img src={restoredImageUrl} alt="Restored" className="max-h-[500px] w-auto object-contain rounded-lg border-4 border-gray-200" />
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleEnhance}
                  disabled={isEnhancing}
                  className="bg-black text-white hover:bg-gray-900 disabled:opacity-50 px-6 py-2 rounded font-medium transition-colors"
                >
                  {isEnhancing ? "Enhancing..." : "Enhance Image"}
                </button>
                <button
                  onClick={() => { window.location.href = "/dashboard" }}
                  className="bg-gray-600 text-white hover:bg-gray-700 px-6 py-2 rounded font-medium transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
            </div>
          </div>
        )}

        {/* Comparison once enhanced - use dedicated EnhancedImageComparison */}
        {enhancedImageUrl && (
          <EnhancedImageComparison
            restoredUrl={restoredImageUrl}
            enhancedUrl={enhancedImageUrl}
            onStartOver={() => { setEnhancedImageUrl(null); setError(null) }}
            onDownload={handleDownloadEnhanced}
          />
        )}
      </main>

    </div>
  )
}