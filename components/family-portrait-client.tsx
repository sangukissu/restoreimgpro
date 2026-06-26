"use client"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import NextImage from "next/image"
import { Upload, X, Loader2, Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useImageCrop } from "@/hooks/use-image-crop"

type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9"
type BackgroundStyle = "black" | "gray" | "beige" | "gradient" | "brown" | "bokeh"

// Note: Do NOT compress user-uploaded images. Preserve full quality for model fidelity.

export default function FamilyPortraitClient({
  userCredits,
  user,
}: {
  userCredits: number
  user: { email: string; id: string }
}) {
  const [files, setFiles] = useState<File[]>([])
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4:3")
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>("black")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [familyPortraitId, setFamilyPortraitId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const canUseNarrow = files.length <= 2 // For 3–4 people, use wider ratios

  const acceptTypes = "image/jpeg,image/jpg,image/png,image/webp"
  const maxSizeBytes = 20 * 1024 * 1024

  const validateFile = useCallback((file: File) => {
    if (!acceptTypes.split(",").includes(file.type)) {
      throw new Error("Only JPG, PNG and WebP images are supported")
    }
    if (file.size > maxSizeBytes) {
      throw new Error("Image must be less than 20MB")
    }
  }, [])

  const appendFile = useCallback((file: File) => {
    setFiles((prev) => {
      if (prev.length >= 4) return prev
      const existing = new Set(prev.map((f) => `${f.name}:${f.size}:${f.lastModified}`))
      const key = `${file.name}:${file.size}:${file.lastModified}`
      if (existing.has(key)) return prev

      const next = [...prev, file].slice(0, 4)
      if (next.length > 2 && (aspectRatio === "1:1" || aspectRatio === "3:4")) {
        setAspectRatio("4:3")
      }
      return next
    })
  }, [aspectRatio])

  const { startCropping, CropDialog } = useImageCrop({
    onCropped: appendFile,
    onSkipped: appendFile,
  })

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming)
    const validated: File[] = []
    for (const f of arr) {
      try {
        validateFile(f)
        validated.push(f)
      } catch (e: any) {
        setError(e?.message || "Invalid file")
      }
    }

    const availableSlots = Math.max(0, 4 - files.length)
    const toCrop = validated.slice(0, availableSlots)
    if (toCrop.length > 0) {
      startCropping(toCrop)
    }
  }, [files.length, startCropping, validateFile])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files || [])
    e.target.value = ""
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false)
    if (e.dataTransfer?.files?.length) {
      addFiles(e.dataTransfer.files)
    }
  }, [addFiles])

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true)
    if (e.type === "dragleave") setIsDragging(false)
  }, [])

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setResultUrl(null)
      setUploadStatus("Validating photos...")

      if (files.length < 2) {
        setError("Please upload at least 2 individual portrait photos.")
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

      // 1. Upload files to Cloudflare R2 directly from browser using presigned PUT URLs
      const uploadedKeys: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadStatus(`Preparing secure storage for photo ${i + 1} of ${files.length}...`)

        // Request presigned URL from backend
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

        setUploadStatus(`Uploading photo ${i + 1} of ${files.length} Now...`)

        // Direct S3 PUT request to Cloudflare R2 (completely bypassing Vercel limits)
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

      // 2. Trigger AI synthesis with the lightweight R2 keys
      const res = await fetch("/api/family-portrait", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aspectRatio,
          backgroundStyle,
          images: uploadedKeys,
        }),
      })

      const contentType = res.headers.get("content-type") || ""
      let payload: any = null
      if (contentType.includes("application/json")) {
        try {
          payload = await res.json()
        } catch (e) {
          const text = await res.text()
          payload = { error: text }
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
      const msg = err?.message || "Unexpected error"
      setError(msg)
      if (msg) toast.error(msg)
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

  return (
    <div className="space-y-8 rounded-xl">
      <CropDialog />
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Upload & Preview */}
        <div className="space-y-6">
          {/* Dropzone */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-black">Upload photos ({files.length}/4)</label>
            <div
              onClick={() => (!isLoading && !resultUrl && files.length < 4) && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              className={`border-2 border-dashed ${isDragging ? "border-black" : "border-gray-300"} rounded-2xl p-8 text-center transition-colors bg-white ${(!isLoading && !resultUrl) ? "cursor-pointer hover:border-gray-400" : "cursor-default"} min-h-[300px] flex flex-col justify-center`}
            >
              {isLoading ? (
                <div className="space-y-4 py-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                  <p className="text-gray-800 font-semibold text-lg">{uploadStatus || "Combining your family portrait..."}</p>
                  <p className="text-sm text-gray-600">Please don't leave or close the page while we compose the image</p>
                </div>
              ) : resultUrl ? (
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden border">
                    <img src={resultUrl || ""} alt="Family portrait result" className="w-full h-auto" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button onClick={handleDownload} className="text-sm px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800">Download</Button>
                    {familyPortraitId ? (
                      <a
                        href={`/dashboard/memory-book?sourceType=family_portrait&sourceId=${familyPortraitId}`}
                        className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                      >
                        Add to keepsake
                      </a>
                    ) : null}
                    <a href={resultUrl || ""} target="_blank" rel="noreferrer" className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">Open in new tab</a>
                    <button
                      onClick={() => { setResultUrl(null); setFamilyPortraitId(null); setFiles([]); }}
                      className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      Create Another
                    </button>
                  </div>
                </div>
              ) : files.length === 0 ? (
                <div className="space-y-4">
                  <div className="relative mx-auto w-12 h-12 sm:w-20 sm:h-20">
                    <div className="absolute inset-0 rounded-full bg-gray-100" />
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Upload className="w-6 h-6 sm:w-10 sm:h-10 text-gray-700" />
                    </div>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">Drag & drop or click to upload</p>
                    <p className="text-sm text-gray-600">JPG, PNG, WebP up to 20MB each</p>
                    <p className="text-xs text-gray-500 mt-2">Upload 1–4 clear, front-facing photos. For 3–4 people, use wider ratios like 4:3 or 16:9..</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                  {files.map((f, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border">
                      <NextImage
                        src={URL.createObjectURL(f)}
                        alt={`Upload ${idx + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 sm:h-36 object-cover"
                      />
                      <button
                        aria-label="Remove"
                        onClick={(e) => { e.stopPropagation(); removeFile(idx) }}
                        className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {files.length < 4 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                      className="rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors h-32 sm:h-36 flex flex-col items-center justify-center gap-2 bg-gray-50"
                    >
                      <Upload className="w-6 h-6 text-gray-700" />
                      <span className="text-sm font-semibold text-gray-900">Add photo</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept={acceptTypes} multiple onChange={onInputChange} className="hidden" />
          </div>
          <div>
            <p className="text-xs text-red-500 mt-2">Alert: If your photos are old, damaged, or blurry,  we strongly recommend restoring them first before using for this service.</p>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-8">

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-black">Aspect ratio</label>
            <div className="grid grid-cols-4 gap-2">
              {(["1:1", "3:4", "4:3", "16:9"] as AspectRatio[]).map((ratio) => {
                const disabled = (ratio === "1:1" || ratio === "3:4") && !canUseNarrow
                const selected = aspectRatio === ratio
                return (
                  <button
                    key={ratio}
                    disabled={disabled}
                    onClick={() => setAspectRatio(ratio)}
                    className={`p-3 rounded-lg border-2 text-sm font-semibold transition-colors ${selected ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {ratio}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-500">
              {canUseNarrow
                ? "With 1–2 people, square and portrait ratios are enabled."
                : "With 3–4 people, use wider ratios (4:3 or 16:9) for better composition."}
            </p>
          </div>

          {/* Background Style */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-black">Background style</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {([
                { key: "black", label: "Matte Black" },
                { key: "gray", label: "Neutral Gray" },
                { key: "beige", label: "Warm Beige" },
                { key: "gradient", label: "Subtle Gradient" },
                { key: "brown", label: "Dark Brown Vignette" },
                { key: "bokeh", label: "Gentle Bokeh" },
              ] as { key: BackgroundStyle; label: string }[]).map(({ key, label }) => {
                const selected = backgroundStyle === key
                return (
                  <button
                    key={key}
                    onClick={() => setBackgroundStyle(key)}
                    className={`p-3 rounded-lg border-2 text-sm font-semibold transition-colors ${selected ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-500">Studio presets keep lighting consistent and reduce artifacts.</p>
          </div>

          <div className="flex items-center gap-3">
            {userCredits < 2 ? (
              <Button
                onClick={() => window.dispatchEvent(new Event('open-payment-modal'))}
                className="w-full bg-[#FF4D00] hover:bg-[#e64500] text-white px-6 py-4 text-lg h-12 font-semibold transition-colors"
                disabled={isLoading || files.length < 2}
              >
                <Coins className="w-5 h-5 mr-2" />
                Buy Credits to Generate
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={isLoading || files.length < 2}
                className="bg-black hover:bg-gray-800 text-white px-6 py-4 w-full text-lg h-12"
              >
                {isLoading ? "Combining..." : "Generate Family Portrait"}
              </Button>
            )}
            {error && <span className="text-sm text-red-600 w-full text-center mt-2 block">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
