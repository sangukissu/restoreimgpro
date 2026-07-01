"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Brush, Coins, Eraser, Loader2, Sparkles, Trash2, Upload, Wand2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ImageComparison from "@/components/image-comparison"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

type Tool = "brush" | "eraser"

const acceptTypes = "image/jpeg,image/jpg,image/png,image/webp"
const maxSizeBytes = 20 * 1024 * 1024
const overlayColor = "#ff0000"
const overlayOpacity = 0.25
const maxUndoSteps = 12

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result)
      else reject(new Error("Unable to read image"))
    }
    reader.onerror = () => reject(new Error("Unable to read image"))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Unable to load image"))
    image.src = src
  })
}

function drawGuidanceOverlay(
  ctx: CanvasRenderingContext2D,
  maskCanvas: HTMLCanvasElement,
  width: number,
  height: number,
) {
  const overlayCanvas = document.createElement("canvas")
  overlayCanvas.width = Math.max(1, Math.round(width))
  overlayCanvas.height = Math.max(1, Math.round(height))
  const overlayCtx = overlayCanvas.getContext("2d")
  if (!overlayCtx) return

  overlayCtx.fillStyle = overlayColor
  overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height)
  overlayCtx.globalCompositeOperation = "destination-in"
  overlayCtx.drawImage(maskCanvas, 0, 0, overlayCanvas.width, overlayCanvas.height)

  ctx.save()
  ctx.globalAlpha = overlayOpacity
  ctx.drawImage(overlayCanvas, 0, 0, width, height)
  ctx.restore()
}
function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png", quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("Unable to export image"))
    }, type, quality)
  })
}

export default function RemovePersonClient({
  userCredits,
  user,
}: {
  userCredits: number
  user: { email: string; id: string }
}) {
  const [credits, setCredits] = useState(userCredits)
  const [file, setFile] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState("")
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null)
  const [brushSize, setBrushSize] = useState(46)
  const [tool, setTool] = useState<Tool>("brush")
  const [instruction, setInstruction] = useState("")
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasMask, setHasMask] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sourceImageRef = useRef<HTMLImageElement | null>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const { toast } = useToast()

  const validateFile = useCallback((nextFile: File) => {
    if (!acceptTypes.split(",").includes(nextFile.type)) {
      throw new Error("Only JPG, PNG and WebP images are supported")
    }
    if (nextFile.size > maxSizeBytes) {
      throw new Error("Image must be less than 20MB")
    }
  }, [])

  const renderCanvas = useCallback(() => {
    const canvas = displayCanvasRef.current
    const image = sourceImageRef.current
    const maskCanvas = maskCanvasRef.current
    if (!canvas || !image || !naturalSize || displaySize.width <= 0 || displaySize.height <= 0) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(displaySize.width * dpr)
    canvas.height = Math.round(displaySize.height * dpr)
    canvas.style.width = `${displaySize.width}px`
    canvas.style.height = `${displaySize.height}px`

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, displaySize.width, displaySize.height)
    ctx.drawImage(image, 0, 0, displaySize.width, displaySize.height)

    if (maskCanvas) {
      drawGuidanceOverlay(ctx, maskCanvas, displaySize.width, displaySize.height)
    }
  }, [displaySize.height, displaySize.width, naturalSize])

  useEffect(() => {
    renderCanvas()
  }, [renderCanvas, hasMask])

  useEffect(() => {
    if (!imageSrc || !naturalSize || !containerRef.current) return

    const updateSize = () => {
      const container = containerRef.current
      if (!container || !naturalSize) return
      const maxWidth = Math.max(260, container.clientWidth)
      const maxHeight = Math.min(620, Math.max(360, window.innerHeight * 0.58))
      const imageAspect = naturalSize.width / naturalSize.height
      let width = maxWidth
      let height = width / imageAspect
      if (height > maxHeight) {
        height = maxHeight
        width = height * imageAspect
      }
      setDisplaySize({ width: Math.round(width), height: Math.round(height) })
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(containerRef.current)
    window.addEventListener("resize", updateSize)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateSize)
    }
  }, [imageSrc, naturalSize])

  const resetEditor = useCallback(() => {
    setFile(null)
    setImageSrc("")
    setNaturalSize(null)
    setHasMask(false)
    setUndoStack([])
    setRedoStack([])
    setInstruction("")
    sourceImageRef.current = null
    maskCanvasRef.current = null
  }, [])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0]
    event.target.value = ""
    if (!nextFile) return

    try {
      validateFile(nextFile)
      setError(null)
      setResultUrl(null)
      setGenerationId(null)
      const src = await readFileAsDataUrl(nextFile)
      const image = await loadImage(src)
      const width = image.naturalWidth || image.width
      const height = image.naturalHeight || image.height
      const maskCanvas = document.createElement("canvas")
      maskCanvas.width = width
      maskCanvas.height = height

      setFile(nextFile)
      setImageSrc(src)
      setNaturalSize({ width, height })
      setHasMask(false)
      setUndoStack([])
      setRedoStack([])
      sourceImageRef.current = image
      maskCanvasRef.current = maskCanvas
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid file"
      setError(message)
      toast.error(message)
    }
  }

  const saveUndoSnapshot = useCallback(() => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return
    const snapshot = maskCanvas.toDataURL("image/png")
    setUndoStack((prev) => [...prev.slice(-(maxUndoSteps - 1)), snapshot])
    setRedoStack([])
  }, [])

  const getNaturalPoint = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = displayCanvasRef.current
    if (!canvas || !naturalSize || displaySize.width <= 0 || displaySize.height <= 0) return null
    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * naturalSize.width
    const y = ((event.clientY - rect.top) / rect.height) * naturalSize.height
    return { x, y }
  }, [displaySize.height, displaySize.width, naturalSize])

  const drawSegment = useCallback((from: { x: number; y: number }, to: { x: number; y: number }) => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas || !naturalSize) return
    const ctx = maskCanvas.getContext("2d")
    if (!ctx) return

    const scaledBrush = brushSize * (naturalSize.width / Math.max(1, displaySize.width))
    ctx.save()
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = Math.max(4, scaledBrush)

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
      ctx.strokeStyle = "rgba(0,0,0,1)"
    } else {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = "rgba(0,0,0,1)"
    }

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.restore()
    setHasMask(true)
    renderCanvas()
  }, [brushSize, displaySize.width, naturalSize, renderCanvas, tool])

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!file || isLoading) return
    const point = getNaturalPoint(event)
    if (!point) return
    event.currentTarget.setPointerCapture(event.pointerId)
    saveUndoSnapshot()
    setIsDrawing(true)
    lastPointRef.current = point
    drawSegment(point, point)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const point = getNaturalPoint(event)
    const lastPoint = lastPointRef.current
    if (!point || !lastPoint) return
    drawSegment(lastPoint, point)
    lastPointRef.current = point
  }

  const finishDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {}
    setIsDrawing(false)
    lastPointRef.current = null
  }

  const restoreMaskSnapshot = useCallback(async (snapshot: string) => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return
    const ctx = maskCanvas.getContext("2d")
    if (!ctx) return
    const image = await loadImage(snapshot)
    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
    ctx.drawImage(image, 0, 0)
    setHasMask(true)
    renderCanvas()
  }, [renderCanvas])

  const handleUndo = async () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas || undoStack.length === 0) return
    const current = maskCanvas.toDataURL("image/png")
    const previous = undoStack[undoStack.length - 1]
    setUndoStack((prev) => prev.slice(0, -1))
    setRedoStack((prev) => [...prev, current])
    await restoreMaskSnapshot(previous)
  }

  const handleRedo = async () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas || redoStack.length === 0) return
    const current = maskCanvas.toDataURL("image/png")
    const next = redoStack[redoStack.length - 1]
    setRedoStack((prev) => prev.slice(0, -1))
    setUndoStack((prev) => [...prev, current])
    await restoreMaskSnapshot(next)
  }

  const clearMask = () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return
    saveUndoSnapshot()
    const ctx = maskCanvas.getContext("2d")
    ctx?.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
    setHasMask(false)
    renderCanvas()
  }

  const exportMarkedFile = async () => {
    if (!file || !naturalSize || !sourceImageRef.current || !maskCanvasRef.current) {
      throw new Error("Upload and mark an image first")
    }

    const outputCanvas = document.createElement("canvas")
    outputCanvas.width = naturalSize.width
    outputCanvas.height = naturalSize.height
    const ctx = outputCanvas.getContext("2d")
    if (!ctx) throw new Error("Canvas is not available in this browser")

    ctx.drawImage(sourceImageRef.current, 0, 0, naturalSize.width, naturalSize.height)
    drawGuidanceOverlay(ctx, maskCanvasRef.current, naturalSize.width, naturalSize.height)
    const blob = await canvasToBlob(outputCanvas, "image/png")
    const baseName = file.name.replace(/\.[^.]+$/, "") || "marked-image"
    return new File([blob], `${baseName}-remove-marked.png`, { type: "image/png", lastModified: Date.now() })
  }

  const uploadToR2 = async (uploadFile: File) => {
    setUploadStatus("Preparing marked image upload...")
    const presignedRes = await fetch("/api/r2/presigned-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: uploadFile.name, contentType: uploadFile.type, folder: "remove-person" }),
    })

    if (!presignedRes.ok) {
      const payload = await presignedRes.json().catch(() => ({}))
      throw new Error(payload?.error || "Failed to prepare upload")
    }

    const { uploadUrl, key } = await presignedRes.json()
    setUploadStatus("Uploading marked image...")
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": uploadFile.type },
      body: uploadFile,
    })

    if (!uploadRes.ok) throw new Error("Failed to upload marked image")
    return key as string
  }

  const handleGenerate = async () => {
    if (!file) return
    if (!hasMask) {
      const message = "Brush over the person or object you want removed."
      setError(message)
      toast.error(message)
      return
    }
    if (credits < 2) {
      const message = "You need 2 credits to remove an object from a photo."
      setError(message)
      toast.error(message)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setResultUrl(null)
      setGenerationId(null)
      const markedFile = await exportMarkedFile()
      const markedKey = await uploadToR2(markedFile)

      setUploadStatus("Removing the marked area...")
      const response = await fetch("/api/remove-person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marked_photo: markedKey,
          instruction,
          aspect_ratio: "auto",
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        const message = payload?.error || "Failed to remove marked area"
        toast.error(message)
        throw new Error(message)
      }

      setResultUrl(payload.imageUrl)
      setGenerationId(payload.generationId || null)
      if (typeof payload.creditsRemaining === "number") setCredits(payload.creditsRemaining)
      toast.success("Marked area removed!")
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
      a.download = `remove-person-${Date.now()}.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error("Failed to download image")
    }
  }

  return (
    <div className="space-y-8">
      {resultUrl ? (
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <ImageComparison
            originalUrl={imageSrc}
            restoredUrl={resultUrl}
            onStartOver={() => { resetEditor(); setResultUrl(null); setGenerationId(null); setError(null) }}
            onDownload={handleDownload}
            showGenerateVideo={false}
            beforeLabel="Original"
            afterLabel="Removed"
            compareHint="Drag the slider to compare before and after removal"
            startOverLabel="Create Another"
          />
          {generationId ? (
            <a
              href={`/dashboard/memory-book?sourceType=remove_person&sourceId=${generationId}`}
              className="inline-flex h-10 items-center justify-center rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 shadow-xs transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            >
              Add to keepsake
            </a>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            {!file ? (
              <div
                role="button"
                tabIndex={isLoading ? -1 : 0}
                onClick={() => !isLoading && fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (isLoading) return
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    fileInputRef.current?.click()
                  }
                }}
                className={`flex min-h-[420px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 text-center transition hover:border-gray-400 ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
              >
                <input ref={fileInputRef} type="file" accept={acceptTypes} onChange={handleFileChange} className="hidden" disabled={isLoading} />
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Upload className="h-8 w-8 text-gray-600" />
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-gray-950">Upload photo</p>
                  <p className="text-sm text-gray-500">JPG, PNG, WebP up to 20MB</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-950">Brush the area to remove</h3>
                    <p className="text-sm text-gray-500">The fixed-opacity red guide stays faint even if users brush the same area repeatedly.</p>
                  </div>
                  <Button type="button" variant="outline" onClick={resetEditor} disabled={isLoading}>
                    <X className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </div>
                <div ref={containerRef} className="flex w-full justify-center rounded-xl bg-gray-950 p-3">
                  <canvas
                    ref={displayCanvasRef}
                    className="max-w-full touch-none rounded-lg shadow-sm"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={finishDrawing}
                    onPointerCancel={finishDrawing}
                    onPointerLeave={finishDrawing}
                    style={{ cursor: tool === "eraser" ? "cell" : "crosshair" }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-black">Tool</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTool("brush")}
                  className={`rounded-lg border-2 p-3 text-sm font-semibold transition ${tool === "brush" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <Brush className="mx-auto mb-1 h-5 w-5" />
                  Brush
                </button>
                <button
                  type="button"
                  onClick={() => setTool("eraser")}
                  className={`rounded-lg border-2 p-3 text-sm font-semibold transition ${tool === "eraser" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <Eraser className="mx-auto mb-1 h-5 w-5" />
                  Erase
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-800">Brush size</label>
                <span className="text-xs text-gray-500">{brushSize}px</span>
              </div>
              <input
                type="range"
                min={8}
                max={140}
                step={1}
                value={brushSize}
                onChange={(event) => setBrushSize(Number(event.target.value))}
                className="w-full accent-black"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button type="button" variant="outline" onClick={handleUndo} disabled={undoStack.length === 0 || isLoading}>
                Undo
              </Button>
              <Button type="button" variant="outline" onClick={handleRedo} disabled={redoStack.length === 0 || isLoading}>
                Redo
              </Button>
              <Button type="button" variant="outline" onClick={clearMask} disabled={!file || !hasMask || isLoading}>
                <Trash2 className="mr-1 h-4 w-4" />
                Clear
              </Button>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-black">Instruction</label>
              <Textarea
                value={instruction}
                onChange={(event) => setInstruction(event.target.value.slice(0, 240))}
                placeholder="Optional: remove the person under the faint red guide, remove the chair, clean up the background..."
                className="min-h-28 resize-none"
                maxLength={240}
              />
              <p className="text-xs text-gray-500">{instruction.length}/240</p>
            </div>

            {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

            <Button
              onClick={credits < 2 ? () => window.dispatchEvent(new Event("open-payment-modal")) : handleGenerate}
              disabled={isLoading || !file || !hasMask}
              className={`h-12 w-full text-sm font-semibold ${credits < 2 ? "bg-[#FF4D00] hover:bg-[#e64500]" : "bg-black hover:bg-gray-800"}`}
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
                  <Wand2 className="mr-2 h-5 w-5" />
                  Remove Marked Area - 2 Credits
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}