"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip, AlertTriangle, Shield } from "lucide-react"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onRestore: () => void
  selectedFile: File | null
  selectedImageUrl: string | null
  userCredits: number
  onBuyCredits: () => void
}

// Security constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_DIMENSIONS = 4096 // Max width/height in pixels
const MIN_DIMENSIONS = 100 // Min width/height in pixels

export default function ImageUpload({ onImageSelect, onRestore, selectedFile, selectedImageUrl, userCredits, onBuyCredits }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false) // Add state to prevent duplicate restore calls
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadAttempts = useRef(0)
  const lastUploadTime = useRef(0)
  const componentId = useRef(Math.random().toString(36).substring(2, 15))
  const renderCount = useRef(0)
  
  // Increment render count on every render
  renderCount.current += 1

  // Track component instances
  useEffect(() => {
    // Component mounted/rendered
  }, [selectedFile, selectedImageUrl])

  const sampleImages = [
    "/vintage-family-photo.png",
    "/damaged-portrait.png",
    "/placeholder-3w6uc.png",
    "/scratched-childhood-photo.png",
  ]

  // Anti-spam protection
  const checkSpamProtection = () => {
    const now = Date.now()
    const timeSinceLastUpload = now - lastUploadTime.current
    
    // Prevent more than 5 uploads per minute
    if (uploadAttempts.current >= 5 && timeSinceLastUpload < 60000) {
      throw new Error("Too many upload attempts. Please wait a moment before trying again.")
    }
    
    // Prevent uploads faster than 2 seconds apart
    if (timeSinceLastUpload < 2000) {
      throw new Error("Please wait a moment before uploading another image.")
    }
    
    return true
  }

  // File validation
  const validateFile = async (file: File): Promise<boolean> => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`)
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      throw new Error("Only JPG, PNG, and WebP images are supported")
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
      throw new Error("Invalid file extension. Please use JPG, PNG, or WebP files")
    }

    // Validate image dimensions
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      img.onload = () => {
        URL.revokeObjectURL(url)
        
        if (img.width > MAX_DIMENSIONS || img.height > MAX_DIMENSIONS) {
          reject(new Error(`Image dimensions must be less than ${MAX_DIMENSIONS}x${MAX_DIMENSIONS} pixels`))
          return
        }
        
        if (img.width < MIN_DIMENSIONS || img.height < MIN_DIMENSIONS) {
          reject(new Error(`Image dimensions must be at least ${MIN_DIMENSIONS}x${MIN_DIMENSIONS} pixels`))
          return
        }
        
        resolve(true)
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error("Invalid image file. Please check the file and try again"))
      }
      
      img.src = url
    })
  }

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      try {
        setIsProcessing(true)
        setUploadError(null)
        
        // Anti-spam check
        checkSpamProtection()
        
        const file = files[0]
        
        // Validate file
        await validateFile(file)
        
        // Update spam protection
        uploadAttempts.current++
        lastUploadTime.current = Date.now()
        
        // Success - process file
        onImageSelect(file)
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed. Please try again."
        setUploadError(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [onImageSelect],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      handleFiles(e.target.files)
    },
    [handleFiles],
  )

  const handleButtonClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click()
    }
  }

  // Protected restore handler to prevent duplicate calls
  const handleRestoreClick = () => {
    if (isRestoring) {
      return
    }
    
    setIsRestoring(true)
    onRestore()
    
    // Reset the restoring state after a delay to allow the API call to complete
    setTimeout(() => {
      setIsRestoring(false)
    }, 5000) // 5 second protection
  }

  const handleSampleImageClick = async (imageSrc: string) => {
    try {
      setIsProcessing(true)
      setUploadError(null)
      
      // Anti-spam check for sample images too
      checkSpamProtection()
      
      const response = await fetch(imageSrc)
      if (!response.ok) throw new Error("Failed to fetch sample image")
      
      const blob = await response.blob()
      const filename = imageSrc.split("/").pop() || "sample-image.png"
      const file = new File([blob], filename, { type: blob.type })
      
      // Validate sample image
      await validateFile(file)
      
      // Update spam protection
      uploadAttempts.current++
      lastUploadTime.current = Date.now()
      
      onImageSelect(file)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load sample image"
      setUploadError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const clearError = () => {
    setUploadError(null)
  }

  // CRITICAL FIX: Only render ONE UI state at a time
  // When a file is selected, show ONLY the preview state
  if (selectedFile instanceof File && typeof selectedImageUrl === "string" && selectedImageUrl) {
    return (
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="bg-white/60 backdrop-blur-sm border rounded-xl p-6">
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="w-full aspect-square max-w-xs mx-auto overflow-hidden rounded-lg border border-gray-100">
              <img
                src={selectedImageUrl || "/placeholder.svg"}
                alt="Selected image"
                className="w-full h-full object-cover"
              />
            </div>

            {/* File Info */}
            <div className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2">
              <div className="flex items-center gap-3 overflow-hidden">
                <Paperclip className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-black">
                    {selectedFile.name || "Unknown File"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>


            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={userCredits > 0 ? handleRestoreClick : onBuyCredits}
                disabled={isRestoring}
                className="flex-1 bg-black text-white hover:bg-gray-800 h-11 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRestoring ? "Restoring..." : userCredits > 0 ? "Restore Image" : "Buy Credits"}
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-11 text-sm font-medium rounded-lg transition-colors"
              >
                Choose Different
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // When NO file is selected, show ONLY the upload area
  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Error Display */}
      {uploadError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 mb-1">Upload Error</p>
              <p className="text-sm text-red-700 mb-3">{uploadError}</p>
              <button
                onClick={clearError}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Upload Area */}
      <div
        className={`relative bg-white border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-200 shadow-sm ${
          dragActive ? "border-gray-400 bg-gray-50" : "border-gray-300 hover:border-gray-400"
        } ${isProcessing ? "opacity-75 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/jpeg,image/jpg,image/png,image/webp" 
          onChange={handleChange} 
          className="hidden"
          disabled={isProcessing}
        />

        {/* Modern Upload Interface */}
        <div className="space-y-6">
          {/* Upload Icon with Animation */}
          <div className="relative mx-auto w-20 h-20 p-2 sm:w-24 sm:h-24 group">
            <div
              className={`absolute inset-0 rounded-full bg-gray-100 opacity-50 transition-all duration-300 ${
                dragActive ? "opacity-75 scale-110" : "group-hover:opacity-75 group-hover:scale-105"
              }`}
            ></div>
            {isProcessing ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : (
              <svg
                className="relative w-full h-full text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
                />
              </svg>
            )}
          </div>

          {/* Text and Button Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isProcessing ? "Processing..." : dragActive ? "Drop your image here!" : "Upload your image"}
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              {isProcessing 
                ? "Please wait while we validate your image..."
                : "Drag and drop an image, or click below to browse files."
              }
            </p>
            <Button
              onClick={handleButtonClick}
              disabled={isProcessing}
              className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 h-12 px-8 text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Click to Upload"}
            </Button>
          </div>

          {/* Supported Formats and Security Info */}
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-400">
              Supported: JPG, PNG, WebP • Max: 10MB
            </p>
          </div>
        </div>
      </div>

      {/* AI Disclaimer Notice */}
      <p className="text-xs text-center text-gray-500 mt-4 leading-tight">
        Our AI model strives to restore your images, but results may vary. The restoration quality depends on the original image condition and AI interpretation. Please review results carefully.
      </p>
    </div>
  )
}