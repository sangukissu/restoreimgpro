"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onRestore: () => void
  selectedFile: File | null
  selectedImageUrl: string | null
}

export default function ImageUpload({ onImageSelect, onRestore, selectedFile, selectedImageUrl }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sampleImages = [
    "/vintage-family-photo.png",
    "/damaged-portrait.png",
    "/placeholder-3w6uc.png",
    "/scratched-childhood-photo.png",
  ]

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const file = files[0]
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      onImageSelect(file)
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
    fileInputRef.current?.click()
  }

  const handleSampleImageClick = async (imageSrc: string) => {
    try {
      const response = await fetch(imageSrc)
      const blob = await response.blob()
      const filename = imageSrc.split("/").pop() || "sample-image.png"
      const file = new File([blob], filename, { type: blob.type })

      onImageSelect(file)
    } catch (error) {
      console.error("Error loading sample image:", error)
      alert("Failed to load sample image")
    }
  }

  if (selectedFile && selectedImageUrl) {
    return (
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
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
            <div className="text-center space-y-1">
              <h3 className="font-inter font-medium text-black text-sm truncate">{selectedFile.name}</h3>
              <p className="text-gray-500 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onRestore}
                className="flex-1 bg-black text-white hover:bg-gray-800 h-11 text-sm font-medium rounded-lg transition-colors"
              >
                Restore Image
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

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Main Upload Area */}
      <div
        className={`relative bg-white border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-200 shadow-sm ${
          dragActive ? "border-gray-400 bg-gray-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />

        {/* Upload Interface */}
        <div className="space-y-6">
          {/* Cloud Upload Icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto">
            <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
              />
            </svg>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleButtonClick}
              className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 h-11 px-8 text-sm font-medium rounded-lg transition-colors"
            >
              Upload image
            </Button>
            <p className="text-gray-500 text-xs sm:text-sm">Drag & drop files here or Ctrl + V to paste image</p>
          </div>
        </div>
      </div>

      {/* Sample Images */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-4 text-xs sm:text-sm">No image? Try one of these</p>
        <div className="flex justify-center gap-2 sm:gap-3">
          {sampleImages.map((src, index) => (
            <button
              key={index}
              onClick={() => handleSampleImageClick(src)}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
            >
              <img src={src || "/placeholder.svg"} alt={`Sample ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
