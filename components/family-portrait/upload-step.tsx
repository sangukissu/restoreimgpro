"use client"

import React, { useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import ReferencePhotoGallery from "@/components/family-portrait/reference-photo-gallery"

interface UploadStepProps {
  files: File[]
  onAddFiles: (files: File[]) => void
  onRemoveFile: (index: number) => void
  onContinue: () => void
  onBack: () => void
}

const GOOD_EXAMPLES = [
  { label: "Front-facing & Well-lit", sub: "Clear facial identity" },
  { label: "Single Person", sub: "Uncluttered face view" },
  { label: "High Resolution", sub: "Sharp details" },
  { label: "Pet Photo", sub: "Clear pet features" },
]

const BAD_EXAMPLES = [
  { label: "Blurry / Out of Focus", sub: "AI loses facial detail" },
  { label: "Crowded / Multi-face", sub: "Confuses AI identity" },
  { label: "Face Covered / Sunglasses", sub: "Occluded features" },
  { label: "Extreme Bad Angle", sub: "Distorts portrait" },
]

export default function UploadStep({
  files,
  onAddFiles,
  onRemoveFile,
  onContinue,
  onBack,
}: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(Array.from(e.target.files))
      e.target.value = ""
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (e.dataTransfer?.files?.length) {
        onAddFiles(Array.from(e.dataTransfer.files))
      }
    },
    [onAddFiles]
  )

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true)
    if (e.type === "dragleave") setIsDragging(false)
  }, [])

  return (
    <div className="flex h-full min-h-0 flex-col animate-in fade-in duration-300">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        <div className="space-y-8 pb-5">
      {/* Photo Quality Guide — Clean border, zero shadow */}
      <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span>Photo Quality Guide</span>
          <span className="text-xs font-normal text-gray-500">
            (Upload 1 clear photo per person or pet)
          </span>
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Good Examples */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Good Photos</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GOOD_EXAMPLES.map((ex, idx) => (
                <div
                  key={idx}
                  className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-2 text-center"
                >
                  <p className="text-xs font-semibold text-emerald-950 truncate">
                    {ex.label}
                  </p>
                  <p className="text-[10px] text-emerald-700">{ex.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bad Examples */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Avoid These</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BAD_EXAMPLES.map((ex, idx) => (
                <div
                  key={idx}
                  className="border border-rose-200 bg-rose-50/40 rounded-xl p-2 text-center"
                >
                  <p className="text-xs font-semibold text-rose-950 truncate">
                    {ex.label}
                  </p>
                  <p className="text-[10px] text-rose-700">{ex.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-base font-bold text-gray-900">
            Uploaded Reference Photos ({files.length}/8 max)
          </label>
          <span className="text-xs text-gray-500">JPG, PNG, WebP up to 20MB</span>
        </div>

        <div
          onClick={() => files.length === 0 && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          className={`flex min-h-[200px] flex-col justify-center rounded-2xl border-2 border-dashed bg-white p-6 transition-all ${isDragging
            ? "border-[#FF4D00] bg-orange-50/20"
            : files.length === 0
              ? "cursor-pointer border-gray-300 hover:border-gray-400"
              : "border-gray-300"
            }`}
        >
          {files.length === 0 ? (
            <div className="text-center space-y-3 py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-600">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Click or Drag & Drop Photos Here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Upload individual face portraits for each person or pet you want in the family photo.
                </p>
              </div>
            </div>
          ) : (
            <ReferencePhotoGallery
              files={files}
              onRemove={onRemoveFile}
              previewable={false}
              trailingItem={files.length < 8 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="flex h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-600 transition-colors hover:border-[#FF4D00] hover:bg-orange-50/20 hover:text-[#FF4D00]"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs font-bold">Add Photo</span>
                </button>
              ) : null}
            />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Advisory banner */}
        <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50/80 border border-amber-200 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            If any physical photos are torn or heavily faded, consider restoring them first for maximum facial likeness retention.
          </span>
        </div>
        </div>
      </div>
      </div>

      {/* Navigation Footer */}
      <div className="relative z-10 -mx-3 flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 bg-white px-3 pt-3 sm:-mx-5 sm:px-5">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="min-h-11 border border-gray-200 bg-white text-black shadow-none"
        >
          &larr; Back
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          disabled={files.length === 0}
          className="min-h-11 flex-1 border-0 bg-black text-white hover:bg-black/90 sm:flex-none"
        >
          <span className="sm:hidden">Continue</span>
          <span className="hidden sm:inline">Continue to Select Quantity &rarr;</span>
        </Button>
      </div>
    </div>
  )
}
