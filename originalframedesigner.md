"use client"

import React from "react"
import UploadDropzone from "./upload-dropzone"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { renderFramedComposite, type FrameStyleKey, FRAME_STYLE_OPTIONS } from "./frame-styles"
import { detectFacesInImage } from "./face-detect"

type MatOption = "none" | "light" | "charcoal" | "ivory" | "ash" | "brightWhite" | "warmCream" | "museum"

export default function FrameDesigner() {
  const [imgUrl, setImgUrl] = React.useState<string | null>(null)
  const [imageBitmap, setImageBitmap] = React.useState<ImageBitmap | null>(null)
  const [styleKey, setStyleKey] = React.useState<FrameStyleKey>("classic")
  const [mat, setMat] = React.useState<MatOption>("light")
  const [thicknessFactor, setThicknessFactor] = React.useState<number>(0.04) // relative to min(imgW, imgH)
  const [faceAware, setFaceAware] = React.useState<boolean>(true)
  const [exportScale, setExportScale] = React.useState<number>(2) // 1x, 2x, 3x
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [isRendering, setIsRendering] = React.useState<boolean>(false)

  const [showFrame, setShowFrame] = React.useState<boolean>(true)

  // Caption state
  const [captionEnabled, setCaptionEnabled] = React.useState<boolean>(false)
  const [captionText, setCaptionText] = React.useState<string>("")
  const [captionFont, setCaptionFont] = React.useState<"oldstyle" | "typewriter" | "engraved">("oldstyle")
  const [captionStyle, setCaptionStyle] = React.useState<"mat" | "brass">("mat")
  const [captionAlign, setCaptionAlign] = React.useState<"left" | "center" | "right">("center")
  const [captionSize, setCaptionSize] = React.useState<number>(22)

  React.useEffect(() => {
    if (!imgUrl) return
    let revoked = false
    ;(async () => {
      try {
        const res = await fetch(imgUrl, { cache: "no-store" })
        const blob = await res.blob()
        const bmp = await createImageBitmap(blob)
        if (!revoked) setImageBitmap(bmp)
      } catch (e) {
        console.error("[v0] Failed to createImageBitmap:", e)
      }
    })()
    return () => {
      revoked = true
    }
  }, [imgUrl])

  const doPreview = React.useCallback(async () => {
    if (!imageBitmap) return
    setIsRendering(true)
    try {
      const faces = faceAware ? await detectFacesInImage(imageBitmap) : []
      const dataUrl = await renderFramedComposite({
        image: imageBitmap,
        styleKey,
        thicknessFactor,
        mat,
        faces,
        exportScale: 1, // preview at 1x for speed
        showFrame,
        caption: {
          enabled: captionEnabled,
          text: captionText,
          font: captionFont,
          size: captionSize,
          align: captionAlign,
          style: captionStyle,
        },
      })
      setPreviewUrl(dataUrl)
    } finally {
      setIsRendering(false)
    }
  }, [
    captionAlign,
    captionEnabled,
    captionFont,
    captionSize,
    captionStyle,
    faceAware,
    imageBitmap,
    mat,
    styleKey,
    thicknessFactor,
    showFrame,
  ])

  React.useEffect(() => {
    // Auto-generate preview when inputs change
    if (imageBitmap) {
      void doPreview()
    }
  }, [imageBitmap, styleKey, thicknessFactor, mat, faceAware, doPreview])

  const onExport = async () => {
    if (!imageBitmap) return
    setIsRendering(true)
    try {
      const faces = faceAware ? await detectFacesInImage(imageBitmap) : []
      const dataUrl = await renderFramedComposite({
        image: imageBitmap,
        styleKey,
        thicknessFactor,
        mat,
        faces,
        exportScale,
        showFrame,
        caption: {
          enabled: captionEnabled,
          text: captionText,
          font: captionFont,
          size: captionSize,
          align: captionAlign,
          style: captionStyle,
        },
      })

      const a = document.createElement("a")
      a.href = dataUrl
      a.download = `bringback-framed-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } finally {
      setIsRendering(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card">
            <UploadDropzone
              onSelected={(url) => {
                setPreviewUrl(null)
                setImgUrl(url)
              }}
              previewUrl={previewUrl}
              onClear={() => {
                setImgUrl(null)
                setPreviewUrl(null)
                setImageBitmap(null)
              }}
            />
          </div>
          <div className="mt-4 grid gap-4 rounded-lg border bg-card p-4">
            <div className="grid gap-2">
              <Label htmlFor="show-frame">Show frame</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="show-frame"
                  aria-pressed={showFrame}
                  onClick={() => setShowFrame((s) => !s)}
                  className={cn(
                    "inline-flex h-9 items-center rounded-md border px-3 text-sm",
                    showFrame ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {showFrame ? "On" : "Off"}
                </button>
                <span className="text-muted-foreground text-xs">
                  Turn off the decorative frame—mat and caption remain.
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="style">Frame style</Label>
              <Select value={styleKey} onValueChange={(v) => setStyleKey(v as FrameStyleKey)}>
                <SelectTrigger id="style" className="w-full">
                  <SelectValue placeholder="Choose a style" />
                </SelectTrigger>
                <SelectContent>
                  {FRAME_STYLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mat">Mat board</Label>
              <Select value={mat} onValueChange={(v) => setMat(v as MatOption)}>
                <SelectTrigger id="mat" className="w-full">
                  <SelectValue placeholder="Choose mat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="brightWhite">Bright White</SelectItem>
                  <SelectItem value="light">Light (off-white)</SelectItem>
                  <SelectItem value="ivory">Ivory (warm)</SelectItem>
                  <SelectItem value="warmCream">Warm Cream</SelectItem>
                  <SelectItem value="museum">Museum White</SelectItem>
                  <SelectItem value="ash">Ash (cool light gray)</SelectItem>
                  <SelectItem value="charcoal">Charcoal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="thickness">Frame thickness</Label>
              <div className="flex items-center gap-3">
                <Slider
                  id="thickness"
                  min={0.02}
                  max={0.08}
                  step={0.005}
                  value={[thicknessFactor]}
                  onValueChange={(v) => setThicknessFactor(v[0] ?? 0.04)}
                  className="flex-1"
                />
                <span className="text-muted-foreground text-sm tabular-nums">
                  {(thicknessFactor * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                Scales with your image size; exported frame is drawn around the image, never covering it.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="face-aware">Face-aware framing</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="face-aware"
                  aria-pressed={faceAware}
                  onClick={() => setFaceAware((s) => !s)}
                  className={cn(
                    "inline-flex h-9 items-center rounded-md border px-3 text-sm",
                    faceAware ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {faceAware ? "On" : "Off"}
                </button>
                <span className="text-muted-foreground text-xs">
                  Uses built-in FaceDetector when available (falls back gracefully).
                </span>
              </div>
            </div>

            {/* Caption controls */}
            <div className="grid gap-2">
              <Label htmlFor="caption-toggle">Caption (bottom text)</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="caption-toggle"
                  aria-pressed={captionEnabled}
                  onClick={() => setCaptionEnabled((s) => !s)}
                  className={cn(
                    "inline-flex h-9 items-center rounded-md border px-3 text-sm",
                    captionEnabled ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {captionEnabled ? "On" : "Off"}
                </button>
                <span className="text-muted-foreground text-xs">Add a name/date plaque centered under the photo.</span>
              </div>
              <input
                type="text"
                placeholder="e.g., Junior Walter & Senior Walter — 1994"
                disabled={!captionEnabled}
                value={captionText}
                onChange={(e) => setCaptionText(e.currentTarget.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm disabled:opacity-50"
              />
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="caption-font">Font</Label>
                <Select
                  value={captionFont}
                  onValueChange={(v) => setCaptionFont((v as "oldstyle" | "typewriter" | "engraved") || "oldstyle")}
                  disabled={!captionEnabled}
                >
                  <SelectTrigger id="caption-font">
                    <SelectValue placeholder="Choose font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oldstyle">Old Style Serif (Garamond)</SelectItem>
                    <SelectItem value="typewriter">Typewriter (Special Elite)</SelectItem>
                    <SelectItem value="engraved">Engraved Serif (Cinzel)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="caption-style">Plate style</Label>
                <Select
                  value={captionStyle}
                  onValueChange={(v) => setCaptionStyle((v as "mat" | "brass") || "mat")}
                  disabled={!captionEnabled}
                >
                  <SelectTrigger id="caption-style">
                    <SelectValue placeholder="Choose style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mat">On Mat</SelectItem>
                    <SelectItem value="brass">Brass Plate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="caption-align">Alignment</Label>
                <Select
                  value={captionAlign}
                  onValueChange={(v) => setCaptionAlign((v as "left" | "center" | "right") || "center")}
                  disabled={!captionEnabled || captionStyle === "brass"}
                >
                  <SelectTrigger id="caption-align">
                    <SelectValue placeholder="Alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="caption-size">Caption size</Label>
              <div className="flex items-center gap-3">
                <Slider
                  id="caption-size"
                  min={12}
                  max={48}
                  step={1}
                  disabled={!captionEnabled}
                  value={[captionSize]}
                  onValueChange={(v) => setCaptionSize(v[0] ?? 22)}
                  className="flex-1"
                />
                <span className="text-muted-foreground text-sm tabular-nums">{captionSize}px</span>
              </div>
              <p className="text-muted-foreground text-xs">
                Caption sits inside the mat below the photo. It scales with export size automatically.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="export-scale">Export scale</Label>
              <Select value={String(exportScale)} onValueChange={(v) => setExportScale(Number(v))}>
                <SelectTrigger id="export-scale" className="w-full">
                  <SelectValue placeholder="Export scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="3">3x</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">Higher scales produce larger print-ready PNGs.</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={doPreview} disabled={!imageBitmap || isRendering} variant="secondary">
                {isRendering ? "Rendering..." : "Refresh Preview"}
              </Button>
              <Button onClick={onExport} disabled={!imageBitmap || isRendering}>
                {isRendering ? "Exporting..." : "Export PNG"}
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border bg-card">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Framed preview"
                className="h-full w-full object-contain"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="text-muted-foreground p-8 text-center text-sm">
                Upload a photo and choose a frame to see the preview here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
