"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip } from "lucide-react"

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
      if (!response.ok) throw new Error("Failed to fetch sample image")
      const blob = await response.blob()
      const filename = imageSrc.split("/").pop() || "sample-image.png"
      const file = new File([blob], filename, { type: blob.type })
      onImageSelect(file)
    } catch (error) {
      console.error("Error loading sample image:", error)
      alert("Failed to load sample image")
    }
  }

  if (selectedFile instanceof File && typeof selectedImageUrl === "string" && selectedImageUrl) {
    return (
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="bg-white border rounded-xl p-6">
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

    {/* Modern Upload Interface */}
    <div className="space-y-6">
      {/* Upload Icon with Animation */}
      <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 group">
        <div
          className={`absolute inset-0 rounded-full bg-gray-100 opacity-50 transition-all duration-300 ${
            dragActive ? "opacity-75 scale-110" : "group-hover:opacity-75 group-hover:scale-105"
          }`}
        ></div>
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
      </div>

      {/* Text and Button Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {dragActive ? "Drop your image here!" : "Upload your image"}
        </h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          Drag and drop an image, paste with Ctrl + V, or click below to browse files.
        </p>
        <Button
          onClick={handleButtonClick}
          className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 h-12 px-8 text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Choose Image
        </Button>
      </div>

      {/* Supported Formats */}
      <div className="mt-4">
        <p className="text-xs text-gray-400">
          Supported formats: JPG, PNG, GIF (Max size: 10MB)
        </p>
      </div>
    </div>
  </div>
</div>
  
  )
}
