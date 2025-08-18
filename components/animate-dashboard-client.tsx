"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, Play, Download, Loader2, ArrowLeft, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DashboardHeader from "@/components/dashboard-header"
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
    id: 'smile-wave',
    name: 'Smile + Wave',
    description: 'Natural smile with gentle wave gesture',
    prompt: 'Revive this image to life. Make the person smile and gently wave if hands are visible. Keep gestures natural and smooth.'
  },
  {
    id: 'blink-tilt',
    name: 'Subtle Blink + Head Tilt',
    description: 'Soft blinking with slight head movement',
    prompt: 'Animate this photo so the person softly blinks and tilts their head slightly, keeping a natural expression.'
  },
  {
    id: 'smile-look',
    name: 'Smile + Look Around',
    description: 'Light smile with curious gaze movement',
    prompt: 'Bring this image to life with the person smiling lightly and shifting gaze side to side as if noticing surroundings.'
  }
]



export default function AnimateDashboardClient({ user, initialCredits }: AnimateDashboardClientProps) {
  const [appState, setAppState] = useState<AppState>("upload")
  const [credits, setCredits] = useState(initialCredits)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<AnimationPreset>(ANIMATION_PRESETS[0])

  const [isProcessing, setIsProcessing] = useState(false)
  const [currentGeneration, setCurrentGeneration] = useState<VideoGeneration | null>(null)
  const [generations, setGenerations] = useState<VideoGeneration[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Check for preloaded image from sessionStorage on mount
  useEffect(() => {
    const preloadedImageUrl = sessionStorage.getItem('preloadedImageUrl')
    if (preloadedImageUrl) {
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
    }
  }, [])

  // Cleanup polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
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

    return data.id
  }

  const pollVideoStatus = async (generationId: string): Promise<VideoGeneration> => {
    const response = await fetch(`/api/fal/animate/status?id=${generationId}`)
    
    if (!response.ok) {
      const errorData = await response.json()
      // Handle new error response format
      const errorMessage = errorData.error?.message || errorData.error || 'Failed to check video status'
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return {
      id: data.id,
      video_id: data.id,
      status: data.status,
      originalImageUrl: selectedImageUrl || '',
      videoUrl: data.videoUrl,
      preset_id: selectedPreset.id,
      preset_name: data.preset || selectedPreset.name,
      created_at: data.createdAt || new Date().toISOString()
    }
  }

  const handleGenerate = async () => {
    if (!selectedFile) {
      toast.error('Please select an image')
      return
    }

    if (credits < 1) {
      toast.error('Insufficient credits. Please purchase more credits.')
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
      
      // Deduct credits immediately after successful submission
      setCredits(prev => prev - 1)
      
      // Start polling for status updates after a short delay to ensure DB record is created
      setTimeout(() => {
        let pollAttempts = 0
        const maxPollAttempts = 200 // 10 minutes at 3-second intervals
        
        pollIntervalRef.current = setInterval(async () => {
          try {
            pollAttempts++
            const updatedGeneration = await pollVideoStatus(generationId)
            
            setCurrentGeneration(updatedGeneration)
            setGenerations(prev => prev.map(gen => 
              gen.id === generationId ? updatedGeneration : gen
            ))
            
            // Stop polling if completed or failed
            if (updatedGeneration.status === 'completed' || updatedGeneration.status === 'failed') {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current)
                pollIntervalRef.current = null
              }
              setIsProcessing(false)
              
              if (updatedGeneration.status === 'completed') {
                toast.success('Video generated successfully!')
                setAppState('results')
              } else {
                toast.error('Video generation failed')
                setError('Video generation failed. Please try again.')
              }
            }
            
            // Stop polling after max attempts
            if (pollAttempts >= maxPollAttempts) {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current)
                pollIntervalRef.current = null
              }
              setIsProcessing(false)
              setError('Video generation timed out. Please try again.')
              toast.error('Generation timed out')
            }
          } catch (pollError) {
            console.error('Polling error:', pollError)
            // For the first few attempts, ignore "Generation not found" errors
            // as the database record might still be creating
            if (pollAttempts <= 3) {
              console.log('Ignoring early polling error, DB record may still be creating...')
              return
            }
            
            // After initial attempts, stop polling on persistent errors
            if (pollError instanceof Error && pollError.message.includes('Generation not found')) {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current)
                pollIntervalRef.current = null
              }
              setIsProcessing(false)
              setError('Generation not found. Please try again.')
              toast.error('Generation not found')
            }
          }
        }, 3000) // Poll every 3 seconds
      }, 2000) // Wait 2 seconds before starting polling
      
    } catch (error) {
      setIsProcessing(false)
      
      // Extract error message from new error format
      let errorMessage = 'Generation failed'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message)
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
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

  const handleBuyCredits = () => {
    // This would open the payment modal - implement based on existing payment system
    toast.info('Payment system integration needed')
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
      
      {/* Main Content */}
      <main className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 sm:px-8 py-12 pt-24">


        {/* Upload Interface */}
        {appState === "upload" && (
          <div className="max-w-xl py-4 sm:py-12 mx-auto">
            <div className="mb-8 text-center">
              <h1 className="font-inter font-bold text-3xl sm:text-4xl text-black mb-2">
                Photo Animation
              </h1>
              <p className="text-lg text-gray-600">Bring your photos to life with AI-powered animations</p>
            </div>

            <div className="bg-white rounded-3xl sm:rounded-2xl p-6 sm:p-8 border-4 border-gray-200">
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                    <label className="block text-lg font-semibold text-black mb-4">
                      Upload Image
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-gray-400 transition-colors group"
                    >
                      {selectedImageUrl ? (
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

                {/* Animation Preset Selection */}
                {selectedFile && (
                  <div>
                    <label className="block text-lg font-semibold text-black mb-4">
                      Choose Animation Style
                    </label>
                    <div className="grid gap-4">
                      {ANIMATION_PRESETS.map((preset) => (
                        <div
                          key={preset.id}
                          onClick={() => setSelectedPreset(preset)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedPreset.id === preset.id
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                              selectedPreset.id === preset.id
                                ? 'border-black bg-black'
                                : 'border-gray-300'
                            }`}>
                              {selectedPreset.id === preset.id && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-gray-600" />
                                <h3 className="font-semibold text-black">{preset.name}</h3>
                              </div>
                              <p className="text-sm text-gray-600">{preset.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={
                    !selectedFile ||
                    isProcessing ||
                    credits < 1
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
                      Generate Video (4 credits)
                    </>
                  )}
                </Button>
              </div>
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
                                  {currentGeneration.status === "uploading" ? "Uploading your image..." : "Creating your video..."}
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

        {/* Previous Generations */}
        {generations.length > 1 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous Generations</h2>
            <div className="grid gap-6">
              {generations.slice(1).map((generation) => (
                <div key={generation.id} className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Image 
                        src={generation.originalImageUrl} 
                        alt="Original image" 
                        width={80}
                        height={80}
                        className="rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Old Photo Revival</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(generation.created_at).toLocaleDateString()}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          generation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          generation.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {generation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Display */}
                  {generation.status === 'completed' && generation.videoUrl && (
                    <div className="space-y-4">
                      <video 
                        src={generation.videoUrl} 
                        controls 
                        className="w-full max-w-md rounded-xl border-2 border-gray-200"
                        poster={generation.originalImageUrl}
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleDownloadVideo(generation.videoUrl!)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentGeneration(generation)
                            setAppState('results')
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Processing State */}
                  {(generation.status === 'generating' || generation.status === 'uploading') && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  )}
                  
                  {/* Failed State */}
                  {generation.status === 'failed' && (
                    <div className="text-red-600 text-sm">
                      Generation failed. Please try again.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}