"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Crop, Maximize2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ImageCropDialogProps {
  files: File[]
  open: boolean
  aspectRatio?: number
  onConfirm: (file: File) => void
  onSkip?: (file: File) => void
  onCancel: () => void
  onAllProcessed?: () => void
}

type Size = { width: number; height: number }
type DisplayRect = Size & { left: number; top: number }
type CropRect = { x: number; y: number; width: number; height: number }
type DragMode = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"

type DragState = {
  mode: DragMode
  startX: number
  startY: number
  startRect: CropRect
}

const aspectOptions = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
]

const MIN_CROP_SIZE = 56

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function extensionForMime(type: string) {
  if (type === "image/jpeg" || type === "image/jpg") return "jpg"
  if (type === "image/webp") return "webp"
  return "png"
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Unable to load image for cropping"))
    image.src = src
  })
}

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

function getDisplayRect(container: Size, natural: Size): DisplayRect {
  const imageAspect = natural.width / natural.height
  const containerAspect = container.width / container.height

  if (imageAspect > containerAspect) {
    const width = container.width
    const height = width / imageAspect
    return { width, height, left: 0, top: (container.height - height) / 2 }
  }

  const height = container.height
  const width = height * imageAspect
  return { width, height, left: (container.width - width) / 2, top: 0 }
}

function centeredCrop(display: DisplayRect, aspect?: number): CropRect {
  let width = display.width * 0.78
  let height = display.height * 0.78

  if (aspect) {
    if (width / height > aspect) {
      width = height * aspect
    } else {
      height = width / aspect
    }
  }

  width = Math.max(MIN_CROP_SIZE, Math.min(width, display.width))
  height = Math.max(MIN_CROP_SIZE, Math.min(height, display.height))

  return {
    x: (display.width - width) / 2,
    y: (display.height - height) / 2,
    width,
    height,
  }
}

function fullImageCrop(display: DisplayRect, aspect?: number): CropRect {
  if (!aspect) {
    return { x: 0, y: 0, width: display.width, height: display.height }
  }

  let width = display.width
  let height = width / aspect
  if (height > display.height) {
    height = display.height
    width = height * aspect
  }

  return {
    x: (display.width - width) / 2,
    y: (display.height - height) / 2,
    width,
    height,
  }
}

function moveCrop(start: CropRect, dx: number, dy: number, display: DisplayRect): CropRect {
  return {
    ...start,
    x: clamp(start.x + dx, 0, display.width - start.width),
    y: clamp(start.y + dy, 0, display.height - start.height),
  }
}

function resizeFreeCrop(mode: DragMode, start: CropRect, dx: number, dy: number, display: DisplayRect): CropRect {
  let left = start.x
  let right = start.x + start.width
  let top = start.y
  let bottom = start.y + start.height

  if (mode.includes("e")) right = clamp(right + dx, left + MIN_CROP_SIZE, display.width)
  if (mode.includes("w")) left = clamp(left + dx, 0, right - MIN_CROP_SIZE)
  if (mode.includes("s")) bottom = clamp(bottom + dy, top + MIN_CROP_SIZE, display.height)
  if (mode.includes("n")) top = clamp(top + dy, 0, bottom - MIN_CROP_SIZE)

  return { x: left, y: top, width: right - left, height: bottom - top }
}

function resizeAspectCrop(mode: DragMode, start: CropRect, dx: number, dy: number, display: DisplayRect, aspect: number): CropRect {
  const signX = mode.includes("w") ? -1 : 1
  const signY = mode.includes("n") ? -1 : 1
  let width = start.width
  let height = start.height

  if ((mode.includes("e") || mode.includes("w")) && (mode.includes("n") || mode.includes("s"))) {
    if (Math.abs(dx) >= Math.abs(dy)) {
      width = start.width + signX * dx
      height = width / aspect
    } else {
      height = start.height + signY * dy
      width = height * aspect
    }
  } else if (mode.includes("e") || mode.includes("w")) {
    width = start.width + signX * dx
    height = width / aspect
  } else {
    height = start.height + signY * dy
    width = height * aspect
  }

  width = Math.max(MIN_CROP_SIZE, width)
  height = Math.max(MIN_CROP_SIZE, height)

  const anchorRight = mode.includes("w")
  const anchorBottom = mode.includes("n")
  const centerX = start.x + start.width / 2
  const centerY = start.y + start.height / 2

  let maxWidth = display.width
  let maxHeight = display.height
  if (mode.includes("e")) maxWidth = display.width - start.x
  if (mode.includes("w")) maxWidth = start.x + start.width
  if (mode.includes("s")) maxHeight = display.height - start.y
  if (mode.includes("n")) maxHeight = start.y + start.height

  if (width > maxWidth) {
    width = maxWidth
    height = width / aspect
  }
  if (height > maxHeight) {
    height = maxHeight
    width = height * aspect
  }

  let x = mode.includes("e") ? start.x : anchorRight ? start.x + start.width - width : centerX - width / 2
  let y = mode.includes("s") ? start.y : anchorBottom ? start.y + start.height - height : centerY - height / 2

  x = clamp(x, 0, display.width - width)
  y = clamp(y, 0, display.height - height)

  return { x, y, width, height }
}

function updateCropFromDrag(drag: DragState, clientX: number, clientY: number, display: DisplayRect, aspect?: number) {
  const dx = clientX - drag.startX
  const dy = clientY - drag.startY

  if (drag.mode === "move") {
    return moveCrop(drag.startRect, dx, dy, display)
  }

  return aspect
    ? resizeAspectCrop(drag.mode, drag.startRect, dx, dy, display, aspect)
    : resizeFreeCrop(drag.mode, drag.startRect, dx, dy, display)
}

async function cropFile(file: File, imageSrc: string, cropRect: CropRect, display: DisplayRect, natural: Size) {
  const image = await loadImage(imageSrc)
  const scaleX = natural.width / display.width
  const scaleY = natural.height / display.height
  const sourceX = Math.round(cropRect.x * scaleX)
  const sourceY = Math.round(cropRect.y * scaleY)
  const sourceWidth = Math.max(1, Math.round(cropRect.width * scaleX))
  const sourceHeight = Math.max(1, Math.round(cropRect.height * scaleY))

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available in this browser")

  canvas.width = sourceWidth
  canvas.height = sourceHeight
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight)

  const outputType = file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/webp"
    ? file.type
    : "image/png"

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result)
        else reject(new Error("Unable to export cropped image"))
      },
      outputType,
      outputType === "image/png" ? undefined : 1,
    )
  })

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image"
  return new File([blob], `${baseName}-cropped.${extensionForMime(outputType)}`, {
    type: outputType,
    lastModified: Date.now(),
  })
}

const handles: { mode: DragMode; className: string; mark: "corner" | "horizontal" | "vertical" }[] = [
  { mode: "nw", className: "-left-3 -top-3 cursor-nwse-resize", mark: "corner" },
  { mode: "n", className: "left-1/2 -top-3 -translate-x-1/2 cursor-ns-resize", mark: "vertical" },
  { mode: "ne", className: "-right-3 -top-3 cursor-nesw-resize", mark: "corner" },
  { mode: "e", className: "-right-3 top-1/2 -translate-y-1/2 cursor-ew-resize", mark: "horizontal" },
  { mode: "se", className: "-bottom-3 -right-3 cursor-nwse-resize", mark: "corner" },
  { mode: "s", className: "-bottom-3 left-1/2 -translate-x-1/2 cursor-ns-resize", mark: "vertical" },
  { mode: "sw", className: "-bottom-3 -left-3 cursor-nesw-resize", mark: "corner" },
  { mode: "w", className: "-left-3 top-1/2 -translate-y-1/2 cursor-ew-resize", mark: "horizontal" },
]


function HandleMark({ type }: { type: "corner" | "horizontal" | "vertical" }) {
  if (type === "horizontal") {
    return (
      <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden="true">
        <path d="M3 9h12M6 6 3 9l3 3M12 6l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === "vertical") {
    return (
      <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden="true">
        <path d="M9 3v12M6 6l3-3 3 3M6 12l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden="true">
      <path d="M5 13 13 5M8 5h5v5M10 13H5V8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MoveMark() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
      <path d="M10 2v16M2 10h16M7 5l3-3 3 3M7 15l3 3 3-3M5 7l-3 3 3 3M15 7l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function ImageCropDialog({
  files,
  open,
  aspectRatio,
  onConfirm,
  onSkip,
  onCancel,
  onAllProcessed,
}: ImageCropDialogProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [index, setIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState("")
  const [naturalSize, setNaturalSize] = useState<Size | null>(null)
  const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 })
  const [cropRect, setCropRect] = useState<CropRect | null>(null)
  const [selectedAspect, setSelectedAspect] = useState<number | undefined>(undefined)
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [drag, setDrag] = useState<DragState | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const currentFile = files[index]
  const isMultiple = files.length > 1
  const activeAspect = aspectRatio ?? selectedAspect

  const display = useMemo(() => {
    if (!naturalSize || containerSize.width <= 0 || containerSize.height <= 0) return null
    return getDisplayRect(containerSize, naturalSize)
  }, [containerSize, naturalSize])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    setIndex(0)
    setSelectedAspect(undefined)
    setError(null)
  }, [open, files])

  useEffect(() => {
    if (!open || !currentFile) {
      setImageSrc("")
      setNaturalSize(null)
      setCropRect(null)
      return
    }

    let cancelled = false
    setImageSrc("")
    setNaturalSize(null)
    setCropRect(null)
    setError(null)

    readFileAsDataUrl(currentFile)
      .then(async (src) => {
        const image = await loadImage(src)
        if (cancelled) return
        setImageSrc(src)
        setNaturalSize({ width: image.naturalWidth || image.width, height: image.naturalHeight || image.height })
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load image")
      })

    return () => {
      cancelled = true
    }
  }, [currentFile, open])

  useEffect(() => {
    if (!isMounted) return
    document.body.style.overflow = open ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMounted, open])

  useEffect(() => {
    if (!open || !stageRef.current) return

    const updateSize = () => {
      const rect = stageRef.current?.getBoundingClientRect()
      if (!rect) return
      setContainerSize({ width: rect.width, height: rect.height })
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [open, imageSrc])

  useEffect(() => {
    if (!display) return
    setCropRect(centeredCrop(display, activeAspect))
  }, [display, activeAspect, currentFile])

  useEffect(() => {
    if (!drag || !display) return

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault()
      setCropRect(updateCropFromDrag(drag, event.clientX, event.clientY, display, activeAspect))
    }

    const handlePointerUp = () => setDrag(null)

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
    window.addEventListener("pointercancel", handlePointerUp)
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("pointercancel", handlePointerUp)
    }
  }, [activeAspect, display, drag])

  const beginDrag = useCallback((mode: DragMode, event: React.PointerEvent) => {
    if (!cropRect) return
    event.preventDefault()
    event.stopPropagation()
    setDrag({ mode, startX: event.clientX, startY: event.clientY, startRect: cropRect })
  }, [cropRect])

  const advance = useCallback(() => {
    const nextIndex = index + 1
    if (nextIndex >= files.length) {
      onAllProcessed?.()
      return
    }

    setIndex(nextIndex)
    setCropRect(null)
    setError(null)
  }, [files.length, index, onAllProcessed])

  const handleApply = useCallback(async () => {
    if (!currentFile || !imageSrc || !cropRect || !display || !naturalSize) return

    try {
      setIsApplying(true)
      setError(null)
      const cropped = await cropFile(currentFile, imageSrc, cropRect, display, naturalSize)
      onConfirm(cropped)
      advance()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to crop image")
    } finally {
      setIsApplying(false)
    }
  }, [advance, cropRect, currentFile, display, imageSrc, naturalSize, onConfirm])

  const handleSkip = useCallback(() => {
    if (!currentFile) return
    if (onSkip) {
      onSkip(currentFile)
    } else {
      onConfirm(currentFile)
    }
    advance()
  }, [advance, currentFile, onConfirm, onSkip])

  const resetCrop = useCallback(() => {
    if (display) setCropRect(centeredCrop(display, activeAspect))
  }, [activeAspect, display])

  const useFullImage = useCallback(() => {
    if (display) setCropRect(fullImageCrop(display, activeAspect))
  }, [activeAspect, display])

  if (!isMounted || !open || !currentFile) return null

  const cropBoxStyle = cropRect && display
    ? {
        left: display.left + cropRect.x,
        top: display.top + cropRect.y,
        width: cropRect.width,
        height: cropRect.height,
      }
    : undefined

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-[#faf9f6] shadow-2xl ring-1 ring-black/10">
        <div className="flex flex-col gap-3 border-b border-black/10 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-950">Crop Image</h2>
            <p className="mt-1 truncate text-sm text-gray-600">
              {isMultiple ? `${index + 1} of ${files.length} - ${currentFile.name}` : currentFile.name}
            </p>
          </div>
          {!aspectRatio ? (
            <div className="grid w-full grid-cols-3 rounded-lg border border-gray-200 bg-white p-1 text-xs font-semibold sm:w-auto">
              {aspectOptions.map((option) => {
                const selected = option.value === selectedAspect
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedAspect(option.value)}
                    className={`rounded-md px-4 py-2 transition ${
                      selected ? "bg-black text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-800">Crop Area</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetCrop}
                  disabled={!display || isApplying}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={useFullImage}
                  disabled={!display || isApplying}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  Full
                </button>
              </div>
            </div>

            <div ref={stageRef} className="relative h-[54vh] min-h-[340px] overflow-hidden rounded-md bg-black lg:h-[58vh]">
              {imageSrc && display ? (
                <>
                  <img
                    src={imageSrc}
                    alt="Crop preview"
                    draggable={false}
                    className="absolute select-none"
                    style={{
                      left: display.left,
                      top: display.top,
                      width: display.width,
                      height: display.height,
                    }}
                  />
                  {cropRect && cropBoxStyle ? (
                    <div
                      role="presentation"
                      onPointerDown={(event) => beginDrag("move", event)}
                      className="absolute touch-none cursor-move border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.52)] active:cursor-grabbing"
                      style={cropBoxStyle}
                    >
                      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm ring-1 ring-black/10">
                        <MoveMark />
                      </div>
                      <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
                        {Array.from({ length: 9 }).map((_, cellIndex) => (
                          <div key={cellIndex} className="border border-white/30" />
                        ))}
                      </div>
                      {handles.map((handle) => (
                        <span
                          key={handle.mode}
                          aria-hidden="true"
                          onPointerDown={(event) => beginDrag(handle.mode, event)}
                          className={`absolute z-20 flex h-6 w-6 items-center justify-center rounded-sm border border-black/20 bg-white text-gray-800 shadow-md ring-1 ring-white/70 ${handle.className}`}
                        >
                          <HandleMark type={handle.mark} />
                        </span>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
                  Loading image...
                </div>
              )}
            </div>
          </div>

          <aside className="hidden space-y-3 lg:block">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Crop className="h-4 w-4" />
              Reference Example
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-gray-200">
              <img src="/family-portrait.png" alt="Reference crop example" className="h-full w-full object-cover opacity-80" />
              <div className="absolute inset-x-[25%] inset-y-[14%] border-2 border-[#8b5cf6] shadow-[0_0_0_9999px_rgba(255,255,255,0.34)]">
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, cellIndex) => (
                    <div key={cellIndex} className="border border-[#8b5cf6]/35" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm leading-5 text-gray-600">
              Keep the useful subject area inside the crop. The exported file uses the original image pixels, not the preview size.
            </p>
          </aside>
        </div>

        <div className="border-t border-black/10 bg-white px-4 py-4 sm:px-5">
          {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-3">
            {isMultiple ? (
              <Button type="button" variant="outline" onClick={handleSkip} disabled={isApplying}>
                Skip
              </Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isApplying}>
                  Cancel
                </Button>
                <Button type="button" variant="outline" onClick={handleSkip} disabled={isApplying}>
                  Skip Crop
                </Button>
              </>
            )}
            <Button type="button" onClick={handleApply} disabled={isApplying || !cropRect || !display || !imageSrc} className="bg-black text-white hover:bg-gray-800">
              <Crop className="mr-2 h-4 w-4" />
              {isApplying ? "Applying..." : "Apply Crop"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}