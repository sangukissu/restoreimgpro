"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, Play, Download, Loader2, ArrowLeft, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import PaymentModal from "@/components/payment-modal"
import PaymentSuccessModal from "@/components/payment-success-modal"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import CustomVideoPlayer from './custom-video-player'

type AppState = "upload" | "processing" | "results"

interface AnimateDashboardClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  isPaymentSuccess: boolean
}

interface VideoGeneration {
  id: string
  video_id: string
  status: 'uploading' | 'generating' | 'completed' | 'failed'
  originalImageUrl: string
  videoUrl?: string
  preset_id: string
  preset_name: string
  created_at: string
}

interface AnimationPreset {
  id: string
  name: string
  description: string
  prompt: string
}

const ANIMATION_PRESETS: AnimationPreset[] = [
  {
    id: 'gentle-smile',
    name: 'Gentle Smile',
    description: 'A warm, natural smile that develops gradually',
    prompt: 'The people in the image develop a warm, natural smile that appears gradually and holds for a moment'
  },
  {
    id: 'smile-wave',
    name: 'Smile + Wave',
    description: 'Friendly smile with a gentle wave gesture',
    prompt: 'The person in the image smiles warmly and waves their hand in a friendly greeting gesture'
  },
  {
    id: 'soft-nod',
    name: 'Soft Nod',
    description: 'A single, gentle nod of acknowledgment',
    prompt: 'The people in the image give a single, slow, gentle nod of acknowledgment with a peaceful expression'
  },
  {
    id: 'blink-tilt',
    name: 'Subtle Blink + Head Tilt',
    description: 'Natural blinking with slight head movement',
    prompt: 'The person in the image blinks naturally and tilts their head slightly with a gentle expression'
  },
  {
    id: 'smile-look',
    name: 'Smile + Look Around',
    description: 'Light smile with curious gaze movement',
    prompt: 'The person in the image smiles and looks around curiously, moving their eyes and head naturally'
  },
  {
    id: 'warm-gaze',
    name: 'Warm Gaze',
    description: 'Steady, loving eye contact with warmth',
    prompt: 'The people in the image maintain steady, warm eye contact with a loving, subtle smile and peaceful expression'
  },
  {
    id: 'peaceful-presence',
    name: 'Peaceful Presence',
    description: 'Minimal natural micro-movements',
    prompt: 'The people in the image show very subtle, natural micro-movements that suggest life and presence without dramatic changes'
  },
  {
    id: 'loving-recognition',
    name: 'Loving Recognition',
    description: 'A moment of gentle recognition and warmth',
    prompt: 'The people in the image show a moment of gentle recognition, with eyes softening and a hint of a smile'
  },
  {
    id: 'serene-moment',
    name: 'Gentle Talking',
    description: 'Calm expression with minimal movement while talking',
    prompt: 'The people in the image talks softly with lifelike, minimal movements, and micro-expressions. Keep it realistic and respectful.'
  }
]



export default function AnimateDashboardClient({ user, initialCredits, isPaymentSuccess }: AnimateDashboardClientProps) {
  const [appState, setAppState] = useState<AppState>("upload")
  const [credits, setCredits] = useState(initialCredits)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [isPreloadingImage, setIsPreloadingImage] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<AnimationPreset>(ANIMATION_PRESETS[0])
  const [showAllPresets, setShowAllPresets] = useState(false)

  const [isProcessing, setIsProcessing] = useState(false)
  const [currentGeneration, setCurrentGeneration] = useState<VideoGeneration | null>(null)
  const [generations, setGenerations] = useState<VideoGeneration[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(isPaymentSuccess)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Show success message if payment was successful
  useEffect(() => {
    if (isPaymentSuccess && credits > 0) {
      setShowPaymentSuccess(true)
      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => setShowPaymentSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isPaymentSuccess, credits])

  // Check for preloaded image from sessionStorage on mount
  useEffect(() => {
    const preloadedImageUrl = sessionStorage.getItem('preloadedImageUrl')
    if (preloadedImageUrl) {
      setIsPreloadingImage(true)
      // Convert URL to File object
      fetch(preloadedImageUrl)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'restored-image.png', { type: 'image/png' })
          setSelectedFile(file)
          setSelectedImageUrl(preloadedImageUrl)
          setError(null)
          // Clear the sessionStorage after using it
          sessionStorage.removeItem('preloadedImageUrl')
        })
        .catch(error => {
          console.error('Error loading preloaded image:', error)
        })
        .finally(() => {
          setIsPreloadingImage(false)
        })
  }
}, [])



  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    // Validate file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Image size must be less than 20MB')
      return
    }

    setSelectedFile(file)
    const imageUrl = URL.createObjectURL(file)
    setSelectedImageUrl(imageUrl)
    setError(null)
  }, [toast])

  const generateVideo = async (file: File, preset: AnimationPreset): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('preset_id', preset.id)
    formData.append('preset_name', preset.name)
    formData.append('prompt', preset.prompt)

    const response = await fetch('/api/fal/animate', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      // Handle new error response format
      const errorMessage = errorData.error?.message || errorData.error || 'Failed to start video generation'
      throw new Error(errorMessage)
    }

    const data = await response.json()
    if (!data.success) {
      // Handle new error response format
      const errorMessage = data.error?.message || data.error || 'Generation failed'
      throw new Error(errorMessage)
    }

    // Update credits from server response
    if (typeof data.creditsRemaining === 'number') {
      setCredits(data.creditsRemaining)
    }

    return data.id
  }



  const handleGenerate = async () => {
    if (!selectedFile) {
      toast.error('Please select an image')
      return
    }

    if (credits < 10) {
      toast.error('Insufficient credits. Video generation requires 10 credits.')
      return
    }

    setIsProcessing(true)
    setError(null)
    
    // Create generation object immediately to prevent blank screen
    const tempGeneration: VideoGeneration = {
      id: 'temp-' + Date.now(),
      video_id: 'temp-' + Date.now(),
      status: 'uploading',
      originalImageUrl: selectedImageUrl || '',
      preset_id: selectedPreset.id,
      preset_name: selectedPreset.name,
      created_at: new Date().toISOString()
    }

    setCurrentGeneration(tempGeneration)
    setAppState("processing")
    
    try {
      // Start video generation
      const generationId = await generateVideo(selectedFile, selectedPreset)
      
      const newGeneration: VideoGeneration = {
        id: generationId,
        video_id: generationId,
        status: 'generating',
        originalImageUrl: selectedImageUrl || '',
        preset_id: selectedPreset.id,
        preset_name: selectedPreset.name,
        created_at: new Date().toISOString()
      }

      setCurrentGeneration(newGeneration)
      setGenerations(prev => [newGeneration, ...prev])
      
      // Redirect to my-media page after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard/my-media'
      }, 1000)
    } catch (error: any) {
      setError(error.message)
      toast.error(error.message)
      setAppState("upload")
    } finally {
      setIsProcessing(false)
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
    setCurrentGeneration(null)

    setError(null)
    setIsProcessing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRetry = () => {
    setError(null)
    handleGenerate()
  }

  // Handle payment modal actions
  const handlePaymentSkip = () => {
    setShowPaymentModal(false)
  }

  const handlePaymentSuccess = (newCredits: number) => {
    setCredits(newCredits)
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

  const handleDownloadVideo = (videoUrl: string) => {
    try {
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = videoUrl
      a.download = `animated-video-${Date.now()}.mp4`

      
      // Append to body, click, and remove
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      toast.success('Video downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download video. Please try again.')
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

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">


        {/* Upload Interface */}
        {appState === "upload" && (
          <div className="max-w-6xl py-4 sm:py-12 mx-auto">
            <div className="mb-8 text-center">
              <h1 className="  font-inter font-bold text-3xl sm:text-4xl text-black mb-2">
                Photo Animation
              </h1>
              <p className="text-lg text-gray-600">Bring your photos to life with AI-powered animations</p>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-3xl sm:rounded-2xl p-6 sm:p-8 border-4 border-gray-200">
              {/* Responsive Layout: Stack on mobile, side-by-side on desktop */}
              <div className={`${selectedFile ? 'lg:grid lg:grid-cols-2 lg:gap-8' : ''} space-y-6 lg:space-y-0`}>
                {/* Image Upload Section */}
                <div className="space-y-6">
                  <div>
                      <label className="block text-lg font-semibold text-black mb-4">
                        Upload Image
                      </label>
                      <div 
                        onClick={() => !isPreloadingImage && fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-gray-400 transition-colors group"
                      >
                        {isPreloadingImage ? (
                          <div className="space-y-4 py-6 flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                            <p className="text-gray-700 font-medium">Loading your image from previous step...</p>
                            <p className="text-sm text-gray-500">Please wait while we prepare it for animation</p>
                          </div>
                        ) : selectedImageUrl ? (
                          <div className="space-y-4 ">
                            <Image 
                              src={selectedImageUrl} 
                              alt="Selected image" 
                              width={200}
                              height={200}
                              className="mx-auto rounded-xl object-cover"
                            />
                            <p className="text-sm text-gray-600">Click to change image</p>
                          </div>
                        ) : (
                          <div className="space-y-4 relative">
                            <div className="relative mx-auto w-12 h-12 sm:w-24 sm:h-24 group">
                              <div className="inset-0 absolute rounded-full bg-gray-100 opacity-50 transition-all duration-300 group-hover:opacity-75 group-hover:scale-105"></div>
                              <div className="relative w-full h-full flex items-center justify-center">
                                <Upload className="w-6 h-6 sm:w-12 sm:h-12 text-gray-700" />
                              </div>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-gray-900">Upload your photo</p>
                              <p className="text-gray-600">JPG, PNG, WebP up to 20MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </div>

                {/* Animation Selection - Second Column on Large Screens */}
                {selectedFile && (
                  <div className="space-y-6">
                    <label className="block text-lg font-semibold text-black mb-4">
                      Choose Animation Style
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                      {ANIMATION_PRESETS.slice(0, showAllPresets ? ANIMATION_PRESETS.length : 6).map((preset) => (
                        <div
                          key={preset.id}
                          onClick={() => setSelectedPreset(preset)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedPreset.id === preset.id
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selectedPreset.id === preset.id
                                ? 'border-black bg-black'
                                : 'border-gray-300'
                            }`}>
                              {selectedPreset.id === preset.id && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              )}
                            </div>
                            <Sparkles className="w-3 h-3 text-gray-600" />
                            <h3 className="font-semibold text-sm text-black">{preset.name}</h3>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{preset.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Show More/Less Button */}
                    {ANIMATION_PRESETS.length > 6 && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setShowAllPresets(!showAllPresets)}
                          className="text-sm text-gray-600 hover:text-black transition-colors underline"
                        >
                          {showAllPresets ? 'Show Less' : `Show ${ANIMATION_PRESETS.length - 6} More Options`}
                        </button>
                      </div>
                    )}

                    {/* Generate Button for Desktop */}
                    <Button
                      onClick={handleGenerate}
                      disabled={
                        !selectedFile ||
                        isProcessing ||
                        credits < 10 ||
                        isPreloadingImage
                      }
                      className="hidden lg:flex w-full bg-black hover:bg-gray-800 text-white py-4 text-sm font-semibold rounded-md transition-colors"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Generate Video (10 credits)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Generate Button for mobile when no side-by-side layout */}
              {selectedFile && (
                <div className="lg:hidden mt-6">
                  <Button
                    onClick={handleGenerate}
                    disabled={
                      !selectedFile ||
                      isProcessing ||
                      credits < 10 ||
                      isPreloadingImage
                    }
                    className="w-full bg-black hover:bg-gray-800 text-white py-4 text-sm font-semibold rounded-md transition-colors"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Generate Video (10 credits)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
         )}

        {/* Processing/Results Interface */}
        {(appState === "processing" || appState === "results") && currentGeneration && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <Button
                onClick={handleStartOver}
                variant="outline"
                size="sm"
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>

            <div className="bg-white rounded-3xl sm:rounded-2xl p-4 sm:p-6 border-6 border-gray-200">
              {/* Status Header */}
              <div className="mb-6">
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {currentGeneration.status === "completed" && (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Download className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                    {currentGeneration.status === "failed" && (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-red-600" />
                      </div>
                    )}
                    <h3 className="text-lg sm:text-xl font-semibold text-black">
                      {currentGeneration.status === "uploading" && "Uploading Image..."}
                      {currentGeneration.status === "generating" && "Generating Video..."}
                      {currentGeneration.status === "completed" && "Video Ready!"}
                      {currentGeneration.status === "failed" && "Generation Failed"}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">
                    {currentGeneration.status === "completed" && "Your animated video is ready for download"}
                    {currentGeneration.status === "failed" && "Something went wrong, please try again"}
                  </p>
                </div>
                
                {currentGeneration.status === "failed" && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <p className="text-red-800 mb-4 font-medium">
                      Generation failed. Please try again with a different image.
                    </p>
                    <Button
                      onClick={() => handleRetry()}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retry Generation
                    </Button>
                  </div>
                )}
              </div>

              {/* Video Generation Area */}
              {currentGeneration.originalImageUrl && (
                <div className="space-y-6">
                  {/* Centered Video Display */}
                  <div className="flex justify-center">
                    <div className="space-y-4 w-full max-w-2xl">
                      <h3 className="text-lg font-semibold text-black text-center">
                        {currentGeneration.status === "completed" ? "Your Generated Video" : "Generating Your Video"}
                      </h3>
                      <div className="w-full">
                        {currentGeneration.status === "completed" && currentGeneration.videoUrl ? (
                          <CustomVideoPlayer
                            url={currentGeneration.videoUrl}
                            poster={currentGeneration.originalImageUrl}
                            className="border-2 border-gray-200 rounded-2xl"
                          />
                        ) : (
                          <div className="w-full min-h-[300px] rounded-2xl border-2 border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
                            {(currentGeneration.status === "uploading" || currentGeneration.status === "generating") ? (
                              <>
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                </div>
                                <p className="text-gray-700 text-center px-4 font-medium text-lg mb-2">
                                  {currentGeneration.status === "uploading" ? "Uploading your image..." : "Creating your video... Please do not leave or refresh the page."}
                                </p>
                                <p className="text-sm text-gray-500 text-center px-4">
                                  This usually takes 1-3 minutes
                                </p>
                              </>
                            ) : currentGeneration.status === "failed" ? (
                              <>
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                  <ArrowLeft className="w-8 h-8 text-red-600" />
                                </div>
                                <p className="text-red-600 text-center px-4 font-medium text-lg">
                                  Generation failed
                                </p>
                              </>
                            ) : (
                              <p className="text-gray-500 text-center px-4">
                                Your video will appear here
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {currentGeneration.status === "completed" && currentGeneration.videoUrl && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 text-center justify-center">
                      <Button
                        onClick={() => handleDownloadVideo(currentGeneration.videoUrl!)}
                        className="text-xs px-3 py-1.5 rounded font-medium transition-colors bg-black text-white hover:bg-gray-800"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Video
                      </Button>
                      <Button
                        onClick={handleStartOver}
                        variant="outline"
                        className="text-xs px-3 py-1.5 rounded font-medium transition-colors bg-white"
                      >
                        Create Another
                      </Button>
                    </div>
                  )}
                </div>
              )}

 
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
