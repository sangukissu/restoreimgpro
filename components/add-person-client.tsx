"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { Camera, Coins, Download, Loader2, Plus, RefreshCw, Upload, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useImageCrop } from "@/hooks/use-image-crop"

type Placement = "left" | "center-left" | "center" | "center-right" | "right"
type Slot = "base" | "person"

const acceptTypes = "image/jpeg,image/jpg,image/png,image/webp"
const maxSizeBytes = 20 * 1024 * 1024

const placements: { value: Placement; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "center-left", label: "Center left" },
  { value: "center", label: "Center" },
  { value: "center-right", label: "Center right" },
  { value: "right", label: "Right" },
]

export default function AddPersonClient({
  userCredits,
  user,
}: {
  userCredits: number
  user: { email: string; id: string }
}) {
  const [credits, setCredits] = useState(userCredits)
  const [baseFile, setBaseFile] = useState<File | null>(null)
  const [personFile, setPersonFile] = useState<File | null>(null)
  const [activeSlot, setActiveSlot] = useState<Slot | null>(null)
  const [placement, setPlacement] = useState<Placement>("center")
  const [context, setContext] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const baseInputRef = useRef<HTMLInputElement>(null)
  const personInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const validateFile = useCallback((file: File) => {
    if (!acceptTypes.split(",").includes(file.type)) {
      throw new Error("Only JPG, PNG and WebP images are supported")
    }
    if (file.size > maxSizeBytes) {
      throw new Error("Image must be less than 20MB")
    }
  }, [])

  const setSlotFile = useCallback((file: File) => {
    if (activeSlot === "base") setBaseFile(file)
    if (activeSlot === "person") setPersonFile(file)
  }, [activeSlot])

  const { startCropping, CropDialog } = useImageCrop({
    onCropped: setSlotFile,
    onCancel: () => setActiveSlot(null),
    onAllProcessed: () => setActiveSlot(null),
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, slot: Slot) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    try {
      validateFile(file)
      setError(null)
      setActiveSlot(slot)
      startCropping([file])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid file"
      setError(message)
      toast.error(message)
    }
  }

  const uploadToR2 = async (file: File, label: string) => {
    setUploadStatus(`Preparing ${label} upload...`)
    const presignedRes = await fetch("/api/r2/presigned-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "add-person" }),
    })

    if (!presignedRes.ok) {
      const payload = await presignedRes.json().catch(() => ({}))
      throw new Error(payload?.error || `Failed to prepare ${label}`)
    }

    const { uploadUrl, key } = await presignedRes.json()
    setUploadStatus(`Uploading ${label}...`)

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    })

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload ${label}`)
    }

    return key as string
  }

  const handleGenerate = async () => {
    if (!baseFile || !personFile) return

    if (credits < 2) {
      const message = "You need 2 credits to add a person to a photo."
      setError(message)
      toast.error(message)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setResultUrl(null)
      setGenerationId(null)

      const baseKey = await uploadToR2(baseFile, "base photo")
      const personKey = await uploadToR2(personFile, "person photo")

      setUploadStatus("Adding the person to your photo...")
      const response = await fetch("/api/add-person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base_photo: baseKey,
          person_photo: personKey,
          placement,
          context,
          aspect_ratio: "auto",
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        const message = payload?.error || "Failed to add person to photo"
        toast.error(message)
        throw new Error(message)
      }

      setResultUrl(payload.imageUrl)
      setGenerationId(payload.generationId || null)
      if (typeof payload.creditsRemaining === "number") setCredits(payload.creditsRemaining)
      toast.success("Person added to photo!")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error"
      setError(message)
      toast.error(message)
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
      const ext = response.headers.get("content-type")?.split("/")[1]?.split(";")[0] || "png"
      a.href = url
      a.download = `add-person-${Date.now()}.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error("Failed to download image")
    }
  }

  const reset = () => {
    setBaseFile(null)
    setPersonFile(null)
    setContext("")
    setPlacement("center")
    setResultUrl(null)
    setGenerationId(null)
    setError(null)
  }

  const UploadZone = ({
    slot,
    title,
    description,
    file,
    inputRef,
    icon,
  }: {
    slot: Slot
    title: string
    description: string
    file: File | null
    inputRef: React.RefObject<HTMLInputElement | null>
    icon: React.ReactNode
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-800">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-950">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div
        role="button"
        tabIndex={isLoading ? -1 : 0}
        aria-disabled={isLoading}
        onClick={() => !isLoading && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (isLoading) return
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        className={`relative flex min-h-[260px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 text-center transition hover:border-gray-400 ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptTypes}
          onChange={(event) => handleFileChange(event, slot)}
          className="hidden"
          disabled={isLoading}
        />
        {file ? (
          <>
            <Image src={URL.createObjectURL(file)} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/0 transition hover:bg-black/35" />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                if (slot === "base") setBaseFile(null)
                if (slot === "person") setPersonFile(null)
              }}
              className="absolute right-3 top-3 rounded-full bg-white p-2 text-gray-700 shadow-sm hover:text-red-600"
              aria-label={`Remove ${title}`}
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Upload className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-950">Upload photo</p>
              <p className="text-sm text-gray-500">JPG, PNG, WebP up to 20MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <CropDialog />

      {resultUrl ? (
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="overflow-hidden rounded-xl border bg-white">
            <img src={resultUrl} alt="Add person result" className="h-auto w-full" />
          </div>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Button onClick={handleDownload} className="bg-black text-white hover:bg-gray-800">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            {generationId ? (
              <a
                href={`/dashboard/memory-book?sourceType=add_person&sourceId=${generationId}`}
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50"
              >
                Add to keepsake
              </a>
            ) : null}
            <Button type="button" variant="outline" onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Create Another
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-6 md:grid-cols-2">
            <UploadZone
              slot="base"
              title="Base Photo"
              description="The scene or group photo"
              file={baseFile}
              inputRef={baseInputRef}
              icon={<Camera className="h-5 w-5" />}
            />
            <UploadZone
              slot="person"
              title="Person to Add"
              description="The individual to insert"
              file={personFile}
              inputRef={personInputRef}
              icon={<UserPlus className="h-5 w-5" />}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-black">Placement</label>
              <div className="grid grid-cols-1 gap-2">
                {placements.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPlacement(item.value)}
                    className={`rounded-lg border-2 p-3 text-left text-sm font-semibold transition ${
                      placement === item.value ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-black">Context</label>
              <Textarea
                value={context}
                onChange={(event) => setContext(event.target.value.slice(0, 200))}
                placeholder="Optional: add him beside the woman in black dress, place behind the couple, match the seated group..."
                className="min-h-28 resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-500">{context.length}/200</p>
            </div>

            {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

            <Button
              onClick={credits < 2 ? () => window.dispatchEvent(new Event("open-payment-modal")) : handleGenerate}
              disabled={isLoading || !baseFile || !personFile}
              className={`h-12 w-full text-base font-semibold ${credits < 2 ? "bg-[#FF4D00] hover:bg-[#e64500]" : "bg-black hover:bg-gray-800"}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {uploadStatus || "Generating..."}
                </>
              ) : credits < 2 ? (
                <>
                  <Coins className="mr-2 h-5 w-5" />
                  Buy Credits to Generate
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Add Person - 2 Credits
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}