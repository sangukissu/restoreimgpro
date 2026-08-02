"use client"

import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useImageCrop } from "@/hooks/use-image-crop"
import { getThemeById } from "@/lib/family-portrait/themes"
import type { ClothingMode } from "@/lib/family-portrait/themes"
import StepProgress from "@/components/family-portrait/step-progress"
import SceneSelector from "@/components/family-portrait/scene-selector"
import UploadStep from "@/components/family-portrait/upload-step"
import QuantitySelector from "@/components/family-portrait/quantity-selector"
import GenerationStep, { AspectRatio } from "@/components/family-portrait/generation-step"

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
])
const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024
const MAX_REFERENCE_PHOTOS = 8

function fileIdentity(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`
}

export default function FamilyPortraitClient({
  userCredits,
  user,
}: {
  userCredits: number
  user: { email: string; id: string }
}) {
  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Step 1: Scene & Theme
  const [themeId, setThemeId] = useState<string>("studio-matte-black")

  // Step 2: Upload Files
  const [files, setFiles] = useState<File[]>([])

  // Step 3: Quantity & Clothing
  const [personCount, setPersonCount] = useState<number>(2)
  const [petCount, setPetCount] = useState<number>(0)
  const [clothingMode, setClothingMode] = useState<ClothingMode>("preserve")

  // Step 4: Generation settings & execution
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4:3")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [familyPortraitId, setFamilyPortraitId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const totalSubjectCount = personCount + petCount

  useEffect(() => {
    if (totalSubjectCount > 6 && aspectRatio !== "16:9") {
      setAspectRatio("16:9")
    }
  }, [aspectRatio, totalSubjectCount])

  const { toast } = useToast()

  // When theme changes, auto-set the clothing mode to the theme's default
  const handleThemeChange = useCallback((newThemeId: string) => {
    setThemeId(newThemeId)
    const theme = getThemeById(newThemeId)
    setClothingMode(theme.defaultClothingMode)
  }, [])

  const appendProcessedFile = useCallback((file: File) => {
    setFiles((prev) => {
      if (prev.length >= MAX_REFERENCE_PHOTOS) return prev

      const existingFiles = new Set(prev.map(fileIdentity))
      if (existingFiles.has(fileIdentity(file))) return prev

      const next = [...prev, file]
      setPersonCount((prevCount) => Math.max(prevCount, next.length))
      return next
    })
  }, [])

  const { startCropping, CropDialog } = useImageCrop({
    onCropped: appendProcessedFile,
    onSkipped: appendProcessedFile,
  })

  const handleAddFiles = useCallback((incoming: File[]) => {
    const availableSlots = Math.max(0, MAX_REFERENCE_PHOTOS - files.length)
    if (availableSlots === 0) {
      toast.error(`You can upload up to ${MAX_REFERENCE_PHOTOS} reference photos.`)
      return
    }

    const knownFiles = new Set(files.map(fileIdentity))
    const validFiles: File[] = []
    const validationErrors: string[] = []

    for (const file of incoming) {
      const identity = fileIdentity(file)
      if (knownFiles.has(identity)) continue

      if (!ACCEPTED_IMAGE_TYPES.has(file.type.toLowerCase())) {
        validationErrors.push(`${file.name}: only JPG, PNG, and WebP images are supported.`)
        continue
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        validationErrors.push(`${file.name}: image must be less than 20MB.`)
        continue
      }

      knownFiles.add(identity)
      validFiles.push(file)
    }

    const filesToCrop = validFiles.slice(0, availableSlots)
    if (validFiles.length > availableSlots) {
      validationErrors.push(
        `Only the first ${availableSlots} image${availableSlots === 1 ? "" : "s"} fit within the ${MAX_REFERENCE_PHOTOS}-photo limit.`
      )
    }

    if (validationErrors.length > 0) {
      const message = validationErrors.join(" ")
      setError(message)
      toast.error(message)
    } else {
      setError(null)
    }

    if (filesToCrop.length > 0) {
      startCropping(filesToCrop)
    }
  }, [files, startCropping, toast])

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index)
      setPersonCount(Math.max(1, next.length))
      return next
    })
  }, [])

  const handleGenerate = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setResultUrl(null)
      setUploadStatus("Validating reference photos...")

      if (files.length === 0) {
        setError("Please upload at least 1 reference photo.")
        setIsLoading(false)
        return
      }

      if (userCredits < 2) {
        const message = "You need 2 credits to generate a family portrait."
        toast.error(message)
        setError(message)
        setIsLoading(false)
        return
      }

      // 1. Upload files to Cloudflare R2 directly using presigned PUT URLs
      const uploadedKeys: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadStatus(`Preparing secure storage for photo ${i + 1} of ${files.length}...`)

        const presignedRes = await fetch("/api/r2/presigned-upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        })

        if (!presignedRes.ok) {
          const errData = await presignedRes.json().catch(() => ({}))
          throw new Error(errData?.error || `Failed to prepare storage for ${file.name}`)
        }

        const { uploadUrl, key } = await presignedRes.json()

        setUploadStatus(`Uploading photo ${i + 1} of ${files.length}...`)

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        })

        if (!uploadRes.ok) {
          throw new Error(`Failed to upload ${file.name} to R2 storage`)
        }

        uploadedKeys.push(key)
      }

      setUploadStatus("Composing your family portrait (this may take 1-2 minutes)...")

      // 2. Trigger AI synthesis with the structured parameters & prompt builder
      const res = await fetch("/api/family-portrait", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId,
          personCount,
          petCount,
          clothingMode,
          aspectRatio,
          images: uploadedKeys,
        }),
      })

      const contentType = res.headers.get("content-type") || ""
      let payload: any = null
      if (contentType.includes("application/json")) {
        try {
          payload = await res.json()
        } catch {
          payload = { error: "Invalid JSON response" }
        }
      } else {
        const text = await res.text()
        payload = { error: text }
      }

      if (!res.ok) {
        if (res.status === 402) {
          const message = payload?.error || "You don't have enough credits."
          toast.error(message)
          throw new Error(message)
        }
        const message = payload?.error || "Failed to generate family portrait"
        toast.error(message)
        throw new Error(message)
      }

      setResultUrl(payload.imageUrl)
      setFamilyPortraitId(payload.familyPortraitId || null)
      toast.success("Family portrait generated!")
    } catch (err: any) {
      const msg = err?.message || "Unexpected error during generation"
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
      setUploadStatus(null)
    }
  }

  const handleDownload = async () => {
    if (!resultUrl) return
    try {
      const response = await fetch(resultUrl, { cache: "no-store" })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      const contentType = response.headers.get("content-type") || "image/png"
      const ext = contentType.split("/")[1]?.split(";")[0] || "png"
      a.href = url
      a.download = `family-portrait-${Date.now()}.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading image:", error)
      alert("Failed to download image")
    }
  }

  const handleReset = () => {
    setResultUrl(null)
    setFamilyPortraitId(null)
    setFiles([])
    setError(null)
    setCurrentStep(1)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <CropDialog />

      {/* Step Indicator Bar */}
      <StepProgress
        currentStep={currentStep}
        onStepClick={(step) => !isLoading && setCurrentStep(step)}
      />

      {/* The active step owns the only scrollable region and keeps its actions visible. */}
      <div className="min-h-0 flex-1">
        {currentStep === 1 && (
          <SceneSelector
          selectedThemeId={themeId}
          onSelectTheme={handleThemeChange}
          onContinue={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <UploadStep
          files={files}
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onContinue={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <QuantitySelector
          personCount={personCount}
          petCount={petCount}
          files={files}
          clothingMode={clothingMode}
          themeId={themeId}
          onChangePersonCount={setPersonCount}
          onChangePetCount={setPetCount}
          onChangeClothingMode={setClothingMode}
          onContinue={() => setCurrentStep(4)}
          onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <GenerationStep
          themeId={themeId}
          personCount={personCount}
          petCount={petCount}
          clothingMode={clothingMode}
          filesCount={files.length}
          aspectRatio={aspectRatio}
          userCredits={userCredits}
          isLoading={isLoading}
          uploadStatus={uploadStatus}
          resultUrl={resultUrl}
          familyPortraitId={familyPortraitId}
          error={error}
          onChangeAspectRatio={setAspectRatio}
          onGenerate={handleGenerate}
          onDownload={handleDownload}
          onReset={handleReset}
          onBack={() => setCurrentStep(3)}
          />
        )}
      </div>
    </div>
  )
}
