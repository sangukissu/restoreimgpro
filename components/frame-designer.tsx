"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { renderFramedComposite, type FrameStyleKey, FRAME_STYLE_OPTIONS } from "@/lib/frame-styles"
import { IconUpload } from "@tabler/icons-react"
import { IconRefresh } from "@tabler/icons-react"

type MatOption = "none" | "light" | "charcoal" | "ivory" | "ash" | "brightWhite" | "warmCream" | "museum"

export default function FrameDesigner() {
  const [imgUrl, setImgUrl] = React.useState<string | null>(null)
  const [imageBitmap, setImageBitmap] = React.useState<ImageBitmap | null>(null)
  const [styleKey, setStyleKey] = React.useState<FrameStyleKey>("classic")
  const [mat, setMat] = React.useState<MatOption>("light")
  const [thicknessFactor, setThicknessFactor] = React.useState<number>(0.04)
  const [exportScale, setExportScale] = React.useState<number>(2)
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

  // Manage resources
  const currentUrlRef = React.useRef<string | null>(null)
  const currentBitmapRef = React.useRef<ImageBitmap | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    return () => {
      if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current)
      if (currentBitmapRef.current && "close" in currentBitmapRef.current) {
        try {
          currentBitmapRef.current.close()
        } catch {}
      }
    }
  }, [])

  const handleSelectFile = React.useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return
    // Cleanup previous
    if (currentUrlRef.current) {
      try {
        URL.revokeObjectURL(currentUrlRef.current)
      } catch {}
    }
    if (currentBitmapRef.current && "close" in currentBitmapRef.current) {
      try {
        currentBitmapRef.current.close()
      } catch {}
    }

    const objectUrl = URL.createObjectURL(file)
    currentUrlRef.current = objectUrl
    setImgUrl(objectUrl)
    setPreviewUrl(null)

    try {
      const bmp = await createImageBitmap(file)
      currentBitmapRef.current = bmp
      setImageBitmap(bmp)
    } catch (e) {
      console.error("[v0] Failed to createImageBitmap from file:", e)
    }
  }, [])

  const clearSelection = React.useCallback(() => {
    if (currentUrlRef.current) {
      try {
        URL.revokeObjectURL(currentUrlRef.current)
      } catch {}
    }
    if (currentBitmapRef.current && "close" in currentBitmapRef.current) {
      try {
        currentBitmapRef.current.close()
      } catch {}
    }
    currentUrlRef.current = null
    currentBitmapRef.current = null
    setImgUrl(null)
    setPreviewUrl(null)
    setImageBitmap(null)
  }, [])

  const doPreview = React.useCallback(async () => {
    if (!imageBitmap) return
    setIsRendering(true)
    try {
      const dataUrl = await renderFramedComposite({
        image: imageBitmap,
        styleKey,
        thicknessFactor,
        mat,
        exportScale: 1, // fast preview
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
    imageBitmap,
    styleKey,
    thicknessFactor,
    mat,
    showFrame,
    captionEnabled,
    captionText,
    captionFont,
    captionSize,
    captionAlign,
    captionStyle,
  ])

  // Debounced preview update for performance
  React.useEffect(() => {
    if (!imageBitmap) return
    
    const timeoutId = setTimeout(() => {
      void doPreview()
    }, 300) // 300ms debounce delay
    
    return () => clearTimeout(timeoutId)
  }, [
    imageBitmap,
    styleKey,
    thicknessFactor,
    mat,
    showFrame,
    captionEnabled,
    captionText,
    captionFont,
    captionSize,
    captionAlign,
    captionStyle,
  ])



  const onExport = async () => {
    if (!imageBitmap) return
    setIsRendering(true)
    try {
      const dataUrl = await renderFramedComposite({
        image: imageBitmap,
        styleKey,
        thicknessFactor,
        mat,
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

  // Drag-and-drop handlers for the left preview area
  const [dragOver, setDragOver] = React.useState(false)
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void handleSelectFile(file)
  }

  return (
    <div className="flex flex-col md:grid md:gap-6 md:grid-cols-5 h-screen md:h-auto">
      {/* Mobile: Image Preview (reduced height) */}
      <section className="md:col-span-3 md:mb-0 mb-4 flex-shrink-0">
        <div
          className={cn(
            "relative w-full rounded-lg border bg-card overflow-hidden p-2",
            dragOver ? "ring-2 ring-primary ring-offset-2" : "",
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          {previewUrl ? (
            <div className="flex w-full items-center justify-center">
              {/* Mobile: Reduced max height to leave space for controls */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Framed preview"
                className="block h-auto max-h-[calc(40vh-4rem)] md:max-h-[calc(100dvh-14rem)] w-full object-contain"
                crossOrigin="anonymous"
              />
              
            </div>
          ) : (
            <div className="flex min-h-40 md:min-h-60 w-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-muted-foreground text-sm">Drag and drop an image here, or choose a file to start.</p>
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                Choose image
              </Button>
            </div>
          )}

          {/* Hidden file input (used for both initial select and change photo) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.currentTarget.files?.[0]
              if (f) void handleSelectFile(f)
              // reset the input so same file can be re-selected
              e.currentTarget.value = ""
            }}
          />
        </div>
        <div className="flex items-center gap-2 md:gap-3 pt-2 text-center justify-center flex-wrap">
          <Button onClick={doPreview} disabled={!imageBitmap || isRendering} variant="secondary" size="sm" className="md:size-default">
            {isRendering ? "Rendering..." : "Refresh Preview"}
          </Button>
          <Button onClick={onExport} disabled={!imageBitmap || isRendering} size="sm" className="md:size-default">
            {isRendering ? "Exporting..." : "Export PNG"}
          </Button>
          <Button
                  size="sm"
                  variant="default"
                  className="pointer-events-auto bg-primary text-primary-foreground"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IconUpload className="h-4 w-4" />                
                  </Button>
                <Button size="sm" variant="outline" className="pointer-events-auto" onClick={clearSelection}>
                  <IconRefresh className="h-4 w-4" />
                  
                </Button>
        </div>
      </section>

      {/* Controls: Below image on mobile, sticky sidebar on desktop */}
      <aside className="md:col-span-2 flex-1 min-h-0">
        <div className="md:sticky md:top-6 space-y-4 h-full">
          <div className="grid gap-4 rounded-lg border bg-card p-4 h-full md:max-h-[calc(100dvh-12rem)] overflow-auto">
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

            <div className="grid grid-cols-2 gap-2">
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

            <div className="grid grid-cols-2 gap-2">
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
                <span className="text-muted-foreground text-xs">Add a name/date plaque under the photo.</span>
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
            <div className="grid grid-cols-3 gap-2">
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
            </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="caption-size">Caption size</Label>
              <div className="flex items-center gap-3">
                <Slider
                  id="caption-size"
                  min={40}
                  max={120}
                  step={1}
                  disabled={!captionEnabled}
                  value={[captionSize]}
                  onValueChange={(v) => setCaptionSize(v[0] ?? 40)}
                  className="flex-1"
                />
                <span className="text-muted-foreground text-sm tabular-nums">{captionSize}px</span>
              </div>
              
            </div>

           
          </div>
        </div>
      </aside>
    </div>
  )
}
