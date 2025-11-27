"use client"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import NextImage from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9"
type BackgroundStyle = "black" | "gray" | "beige" | "gradient" | "brown" | "bokeh"

// Note: Do NOT compress user-uploaded images. Preserve full quality for model fidelity.

export default function FamilyPortraitClient() {
  const [files, setFiles] = useState<File[]>([])
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4:3")
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>("black")
  const [isLoading, setIsLoading] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const canUseNarrow = files.length <= 2 // For 3–4 people, use wider ratios

  const acceptTypes = "image/jpeg,image/jpg,image/png,image/webp"
  const maxSizeBytes = 20 * 1024 * 1024

  const validateFile = (file: File) => {
    if (!acceptTypes.split(",").includes(file.type)) {
      throw new Error("Only JPG, PNG and WebP images are supported")
    }
    if (file.size > maxSizeBytes) {
      throw new Error("Image must be less than 20MB")
    }
  }

  const applyFiles = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming).slice(0, 4)
    const validated: File[] = []
    for (const f of arr) {
      try { validateFile(f); validated.push(f) } catch (e: any) { setError(e?.message || "Invalid file") }
    }
    const next = validated.slice(0, 4)
    setFiles(next)
    // Auto-adjust aspect ratio if invalid for count
    if (next.length > 2 && (aspectRatio === "1:1" || aspectRatio === "3:4")) {
      setAspectRatio("4:3")
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFiles(e.target.files || [])
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false)
    if (e.dataTransfer?.files?.length) {
      applyFiles(e.dataTransfer.files)
    }
  }, [applyFiles])

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

      if (files.length === 0) {
        setError("Please upload 1–4 individual portrait photos.")
        setIsLoading(false)
        return
      }

      // Send originals via multipart/form-data to preserve quality
      const form = new FormData()
      form.append("aspectRatio", aspectRatio)
      form.append("backgroundStyle", backgroundStyle)
      for (const f of files) {
        form.append("images", f, f.name)
      }

      const res = await fetch("/api/family-portrait", {
        method: "POST",
        body: form,
      })
      const contentType = res.headers.get("content-type") || ""
      let payload: any = null
      if (contentType.includes("application/json")) {
        try {
          payload = await res.json()
        } catch (e) {
          // Fallback to text if JSON parsing fails
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
        if (res.status === 413 || /entity too large|FUNCTION_PAYLOAD_TOO_LARGE/i.test(payload?.error || "")) {
          const message = "Images are too large to send. Try smaller files."
          toast.error(message)
          throw new Error(message)
        }
        const message = payload?.error || "Failed to generate family portrait"
        toast.error(message)
        throw new Error(message)
      }

      setResultUrl(payload.imageUrl)
      toast.success("Family portrait generated!")
    } catch (err: any) {
      const msg = err?.message || "Unexpected error"
      setError(msg)
      if (msg) toast.error(msg)
    } finally {
      setIsLoading(false)
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
    <div className="space-y-6">
      {/* Dropzone */}
      <div className="space-y-2">
        <label className="block text-lg font-semibold text-black">Upload 1–4 photos</label>
        <div
          onClick={() => (!isLoading && !resultUrl) && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          className={`border-2 border-dashed ${isDragging ? "border-black" : "border-gray-300"} rounded-2xl p-8 text-center transition-colors bg-white ${(!isLoading && !resultUrl) ? "cursor-pointer hover:border-gray-400" : "cursor-default"}`}
        >
          {isLoading ? (
            <div className="space-y-4 py-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
              <p className="text-gray-800 font-semibold text-lg">Combining your family portrait...</p>
              <p className="text-sm text-gray-600">Please wait while we compose the image</p>
            </div>
          ) : resultUrl ? (
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border">
                <img src={resultUrl} alt="Family portrait result" className="w-full h-auto" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button onClick={handleDownload} className="text-sm px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800">Download</Button>
                <a href={resultUrl} target="_blank" rel="noreferrer" className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">Open in new tab</a>
                <button
                  onClick={() => { setResultUrl(null); setFiles([]); }}
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
                <p className="text-sm text-gray-600">JPG, PNG, WebP up to 10MB each</p>
                <p className="text-xs text-gray-500 mt-2">Tip: use clear front-facing portraits for best results.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept={acceptTypes} multiple onChange={onInputChange} className="hidden" />
      </div>
      <div>
        <p className="text-xs text-gray-500 mt-2">Alert: If your photo is old, damaged, or blurry,  we strongly recommend restoring it first before using it for this service.</p>
      </div>
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
        <Button
          onClick={handleGenerate}
          disabled={isLoading || files.length === 0}
          className="bg-black hover:bg-gray-800 text-white px-6 py-4"
        >
          {isLoading ? "Combining..." : "Generate Family Portrait"}
        </Button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {/* Final image is shown inside the upload panel; no separate result section */}
    </div>
  )
}