"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Coins, Paperclip, Trash2, UploadCloud } from "lucide-react"

export interface SelectedRestoreFile {
  clientId: string
  file: File
  localPreviewUrl: string
  error?: string
}

interface ImageUploadProps {
  onImagesSelect: (files: File[]) => void
  onRemoveImage: (clientId: string) => void
  onClearImages: () => void
  onRestore: () => void
  selectedItems: SelectedRestoreFile[]
  userCredits: number
}

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_DIMENSIONS = 7680
const MIN_DIMENSIONS = 100
const MAX_BATCH_SIZE = 5

export default function ImageUpload({
  onImagesSelect,
  onRemoveImage,
  onClearImages,
  onRestore,
  selectedItems,
  userCredits,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadAttempts = useRef(0)
  const lastUploadTime = useRef(0)

  const checkSpamProtection = () => {
    const now = Date.now()
    const timeSinceLastUpload = now - lastUploadTime.current

    if (uploadAttempts.current >= 5 && timeSinceLastUpload < 60000) {
      throw new Error("Too many upload attempts. Please wait a moment before trying again.")
    }

    if (timeSinceLastUpload < 2000) {
      throw new Error("Please wait a moment before uploading another image.")
    }
  }

  const validateFile = async (file: File): Promise<void> => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`${file.name}: file size must be less than ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`)
    }

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      throw new Error(`${file.name}: only JPG, PNG, and WebP images are supported`)
    }

    const extension = file.name.split(".").pop()?.toLowerCase()
    if (!["jpg", "jpeg", "png", "webp"].includes(extension || "")) {
      throw new Error(`${file.name}: invalid file extension`)
    }

    await new Promise<void>((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)

        if (img.width > MAX_DIMENSIONS || img.height > MAX_DIMENSIONS) {
          reject(new Error(`${file.name}: dimensions must be less than ${MAX_DIMENSIONS}x${MAX_DIMENSIONS}px`))
          return
        }

        if (img.width < MIN_DIMENSIONS || img.height < MIN_DIMENSIONS) {
          reject(new Error(`${file.name}: dimensions must be at least ${MIN_DIMENSIONS}x${MIN_DIMENSIONS}px`))
          return
        }

        resolve()
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error(`${file.name}: invalid image file`))
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
        checkSpamProtection()

        const incomingFiles = Array.from(files)
        if (selectedItems.length + incomingFiles.length > MAX_BATCH_SIZE) {
          throw new Error(`You can restore up to ${MAX_BATCH_SIZE} photos at once.`)
        }

        const validFiles: File[] = []
        const errors: string[] = []

        for (const file of incomingFiles) {
          try {
            await validateFile(file)
            validFiles.push(file)
          } catch (error) {
            errors.push(error instanceof Error ? error.message : `${file.name}: upload failed`)
          }
        }

        if (validFiles.length > 0) {
          uploadAttempts.current++
          lastUploadTime.current = Date.now()
          onImagesSelect(validFiles)
        }

        if (errors.length > 0) {
          setUploadError(errors.join("\n"))
        }
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Upload failed. Please try again.")
      } finally {
        setIsProcessing(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    },
    [onImagesSelect, selectedItems.length],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    if (e.type === "dragleave") setDragActive(false)
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

  const handleRestoreClick = () => {
    if (isRestoring || selectedItems.length === 0) return
    setIsRestoring(true)
    onRestore()
    setTimeout(() => setIsRestoring(false), 5000)
  }

  if (selectedItems.length > 0) {
    const requiredCredits = selectedItems.length
    const hasEnoughCredits = userCredits >= requiredCredits
    const restoreLabel = `Restore ${requiredCredits} photo${requiredCredits === 1 ? "" : "s"} - ${requiredCredits} credit${requiredCredits === 1 ? "" : "s"}`
    const hiddenInput = (
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleChange}
        className="hidden"
        disabled={isProcessing}
      />
    )

    if (selectedItems.length === 1) {
      const item = selectedItems[0]

      return (
        <div className="w-full max-w-lg mx-auto px-4">
          <div className="bg-white/60 backdrop-blur-sm border rounded-xl p-6">
            {hiddenInput}
            <div className="space-y-6">
              <div className="w-full aspect-square max-w-xs mx-auto overflow-hidden rounded-lg border border-gray-100">
                <img
                  src={item.localPreviewUrl || "/placeholder.svg"}
                  alt="Selected image"
                  className="w-full h-full object-cover"
                  width={512}
                  height={512}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Paperclip className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-black">
                      {item.file.name || "Unknown File"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveImage(item.clientId)}
                  className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                  aria-label={`Remove ${item.file.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {uploadError && (
                <div className="whitespace-pre-line rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {uploadError}
                </div>
              )}

              <div className="flex gap-3">
                {hasEnoughCredits ? (
                  <Button
                    onClick={handleRestoreClick}
                    disabled={isRestoring || isProcessing}
                    className="flex-1 bg-black text-white hover:bg-gray-800 h-11 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRestoring ? "Starting..." : restoreLabel}
                  </Button>
                ) : (
                  <Button
                    onClick={() => window.dispatchEvent(new Event("open-payment-modal"))}
                    className="flex-1 bg-[#FF4D00] hover:bg-[#e64500] text-white h-11 text-sm font-semibold rounded-lg transition-colors"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Buy Credits
                  </Button>
                )}
                <Button
                  onClick={onClearImages}
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
      <div className="w-full max-w-xl mx-auto px-4">
        <div className="bg-white/60 backdrop-blur-sm border rounded-xl p-4 sm:p-5">
          {hiddenInput}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">{selectedItems.length} photos selected</h3>
              <p className="text-sm text-gray-500">Small thumbnails, one batch.</p>
            </div>
            <p className="shrink-0 text-xs font-medium text-gray-500">Max 5</p>
          </div>

          <div className="rounded-xl border border-dashed border-gray-200 bg-white/70 p-3">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {selectedItems.map((item) => (
                <div key={item.clientId} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={item.localPreviewUrl}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(item.clientId)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm ring-1 ring-black/10 hover:text-red-600"
                    aria-label={`Remove ${item.file.name}`}
                  >
                    <span className="text-base leading-none">x</span>
                  </button>
                </div>
              ))}

              {selectedItems.length < MAX_BATCH_SIZE && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="aspect-square rounded-lg border border-dashed border-gray-200 bg-gray-50 text-gray-500 transition hover:border-gray-300 hover:bg-white disabled:opacity-60"
                  aria-label="Add more photos"
                >
                  <div className="flex h-full flex-col items-center justify-center gap-2">
                    <UploadCloud className="h-5 w-5" />
                    <span className="text-xs font-medium">Add</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {uploadError && (
            <div className="mt-4 whitespace-pre-line rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {uploadError}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {hasEnoughCredits ? (
              <Button
                onClick={handleRestoreClick}
                disabled={isRestoring || isProcessing}
                className="h-11 flex-1 rounded-lg bg-black text-sm font-medium text-white hover:bg-gray-800"
              >
                {isRestoring ? "Starting..." : restoreLabel}
              </Button>
            ) : (
              <Button
                onClick={() => window.dispatchEvent(new Event("open-payment-modal"))}
                className="h-11 flex-1 rounded-lg bg-[#FF4D00] text-sm font-semibold text-white hover:bg-[#e64500]"
              >
                <Coins className="mr-2 h-4 w-4" />
                Buy Credits
              </Button>
            )}
            <Button onClick={onClearImages} variant="outline" className="h-11 flex-1 rounded-lg">
              Choose different
            </Button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="mx-auto w-full max-w-lg px-4">
      {uploadError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div className="flex-1 whitespace-pre-line text-sm text-red-700">{uploadError}</div>
          </div>
        </div>
      )}

      <div
        className={`relative rounded-xl border-2 border-dashed bg-white p-8 text-center shadow-sm transition sm:p-12 ${
          dragActive ? "border-gray-400 bg-gray-50" : "border-gray-300 hover:border-gray-400"
        } ${isProcessing ? "pointer-events-none opacity-75" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 sm:h-24 sm:w-24">
            {isProcessing ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
            ) : (
              <UploadCloud className="h-10 w-10 text-gray-700" />
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isProcessing ? "Processing..." : dragActive ? "Drop your photos here" : "Upload up to 5 old photos"}
            </h3>
            <p className="mx-auto max-w-xs text-sm text-gray-500">
              {isProcessing ? "Please wait while we validate your images..." : "Drag and drop images, or click below to browse files."}
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="h-12 w-full rounded-lg bg-black px-8 text-sm font-medium text-white shadow-md hover:bg-gray-800 sm:w-auto"
            >
              {isProcessing ? "Processing..." : "Click to Upload"}
            </Button>
          </div>

          <p className="text-xs text-gray-400">Supported: JPG, PNG, WebP - Max: 10MB each</p>
        </div>
      </div>

      <p className="mt-4 text-center text-xs leading-tight text-gray-500">
        Our AI model strives to restore your images, but results may vary. The restoration quality depends on the original image condition and AI interpretation. Please review results carefully.
      </p>
    </div>
  )
}