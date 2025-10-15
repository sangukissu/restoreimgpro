export type FrameStyleKey =
  | "classic"
  | "modern"
  | "vintage"
  | "woodgrain"
  | "ornateGold"
  | "blackGallery"
  | "silverBrushed"
  | "mahogany"
  | "polaroid"
  | "heirloomOrnate"
  | "formalMahogany"
  | "vintagePewter"
  | "archivistBlack"

export const FRAME_STYLE_OPTIONS: Array<{ value: FrameStyleKey; label: string }> = [
  { value: "classic", label: "Classic Gold" },
  { value: "modern", label: "Modern Minimal" },
  { value: "vintage", label: "Vintage Brown" },
  { value: "woodgrain", label: "Woodgrain Warm" },
  { value: "ornateGold", label: "Ornate Gold (Nostalgic)" },
  { value: "blackGallery", label: "Black Gallery" },
  { value: "silverBrushed", label: "Silver Brushed" },
  { value: "mahogany", label: "Mahogany" },
  { value: "polaroid", label: "Polaroid White" },
  { value: "heirloomOrnate", label: "Heirloom Ornate (Rich Gold)" },
  { value: "formalMahogany", label: "Formal Mahogany" },
  { value: "vintagePewter", label: "Vintage Pewter (Aged Metal)" },
  { value: "archivistBlack", label: "Archivist Black (Wide Mat)" },
]

export interface CaptionOptions {
  enabled: boolean
  text: string
  font: "oldstyle" | "typewriter" | "engraved" | "serif" | "sans"
  size: number // in px before export scaling
  align: "left" | "center" | "right"
  style: "mat" | "brass"
}

export interface RenderOptions {
  image: ImageBitmap
  styleKey: FrameStyleKey
  thicknessFactor: number // relative to min(imgW, imgH)
  mat: "none" | "light" | "charcoal" | "ivory" | "ash" | "brightWhite" | "warmCream" | "museum"
  exportScale: number // 1..3
  caption?: CaptionOptions
  showFrame?: boolean
}

export async function renderFramedComposite(opts: RenderOptions): Promise<string> {
  const { image, thicknessFactor, mat, exportScale, caption, styleKey, showFrame = true } = opts

  // Ensure fonts are ready where supported for more accurate text metrics
  if (typeof document !== "undefined" && (document as any).fonts?.ready) {
    try {
      await (document as any).fonts.ready
    } catch {}
  }

  const imgW = image.width
  const imgH = image.height
  const minDim = Math.min(imgW, imgH)

  const frameThicknessBase = Math.max(8, Math.round(minDim * thicknessFactor))
  const baseFactor =
    mat === "none"
      ? 0
      : mat === "light" || mat === "ivory" || mat === "brightWhite" || mat === "warmCream" || mat === "museum"
        ? 0.8
        : 0.6
  const styleBoost = styleKey === "archivistBlack" && mat !== "none" ? 1.4 : 1.0
  const matThickness = Math.round(frameThicknessBase * baseFactor * styleBoost)

  const hasCaption = !!(caption && caption.enabled && caption.text?.trim())
  const baseCaptionSize = caption?.size ?? 18
  const extraBottom = hasCaption ? Math.max(24, Math.round(baseCaptionSize * 1.8)) : 0

  const frameT = showFrame ? frameThicknessBase : 0

  // Face-aware padding removed. Always 0.
  const canvasW = (imgW + 2 * (frameT + matThickness)) * exportScale
  const canvasH = (imgH + 2 * (frameT + matThickness) + extraBottom) * exportScale

  const canvas = document.createElement("canvas")
  canvas.width = canvasW
  canvas.height = canvasH
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D not supported")

  ctx.scale(exportScale, exportScale)

  // Background wash (behind frame)
  ctx.fillStyle = mat === "charcoal" ? "#1d1d1f" : "#f4f4f4"
  ctx.fillRect(0, 0, canvasW / exportScale, canvasH / exportScale)

  if (showFrame) {
    drawFrame(ctx, opts, frameT, matThickness, imgW, imgH, extraBottom)
  }

  // Mat area
  if (matThickness > 0 || hasCaption) {
    const x = frameT
    const y = frameT
    const w = imgW + 2 * matThickness
    const h = imgH + 2 * matThickness + extraBottom
    ctx.fillStyle = getMatColor(mat)
    ctx.fillRect(x, y, w, h)
  }

  // Photo area
  const photoX = frameT + matThickness
  const photoY = frameT + matThickness
  ctx.drawImage(image, photoX, photoY)

  // Caption
  if (hasCaption && caption) {
    const areaX = frameT
    const areaY = frameT + matThickness + imgH + 8 // Add 8px gap between image and caption
    const areaW = imgW + 2 * matThickness
    const areaH = extraBottom - 8 // Reduce caption height by the gap amount
    drawCaption(ctx, caption, areaX, areaY, areaW, areaH, mat)
  }

  return canvas.toDataURL("image/png", 1.0)
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  { styleKey }: RenderOptions,
  frameThickness: number,
  matThickness: number,
  imgW: number,
  imgH: number,
  extraBottom: number,
) {
  const outerW = imgW + 2 * (frameThickness + matThickness)
  const outerH = imgH + 2 * (frameThickness + matThickness) + extraBottom

  switch (styleKey) {
    case "classic":
      drawClassicGold(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "modern":
      drawModernMinimal(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "vintage":
      drawVintageBrown(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "woodgrain":
      drawWoodgrainWarm(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "ornateGold":
      drawOrnateGold(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "blackGallery":
      drawBlackGallery(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "silverBrushed":
      drawSilverBrushed(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "mahogany":
      drawMahogany(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "polaroid":
      drawPolaroidWhite(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "heirloomOrnate":
      drawHeirloomOrnate(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "formalMahogany":
      drawFormalMahogany(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "vintagePewter":
      drawVintagePewter(ctx, 0, 0, outerW, outerH, frameThickness)
      break
    case "archivistBlack":
      drawArchivistBlack(ctx, 0, 0, outerW, outerH, frameThickness)
      break
  }
}

function getMatColor(mat: RenderOptions["mat"]): string {
  switch (mat) {
    case "none":
      return "#ffffff"
    case "light":
      return "#f7f7f2"
    case "ivory":
      return "#f0ead2"
    case "ash":
      return "#e8e8e8"
    case "charcoal":
      return "#2a2a2a"
    case "brightWhite":
      return "#ffffff"
    case "warmCream":
      return "#efe7d6"
    case "museum":
      return "#fcfbf7"
  }
}

function drawCaption(
  ctx: CanvasRenderingContext2D,
  cap: CaptionOptions,
  x: number,
  y: number,
  w: number,
  h: number,
  mat: RenderOptions["mat"],
) {
  const paddingX = 16
  const plateW = Math.round(w * 0.6)
  const plateH = Math.max(22, Math.round(h * 0.6))
  const plateX = Math.round(x + (w - plateW) / 2)
  const plateY = Math.round(y + (h - plateH) / 2)

  if (cap.style === "brass") {
    roundRect(ctx, plateX, plateY, plateW, plateH, 6, "#b08d57")
    ctx.strokeStyle = "#7a633e"
    ctx.lineWidth = 1
    ctx.strokeRect(plateX + 0.5, plateY + 0.5, plateW - 1, plateH - 1)
  }

  const isDarkMat = mat === "charcoal"
  const baseColor = cap.style === "brass" ? "#222222" : isDarkMat ? "#f6f6f6" : "#1f2937"

  let fontFamily = "serif"
  switch (cap.font) {
    case "oldstyle":
      fontFamily = '"EB Garamond", Garamond, "Baskervville", serif'
      break
    case "typewriter":
      fontFamily = '"Special Elite", "Courier New", Courier, monospace'
      break
    case "engraved":
      fontFamily = 'Cinzel, "Times New Roman", serif'
      break
    case "sans":
      fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
      break
    case "serif":
    default:
      fontFamily = '"EB Garamond", serif'
  }

  let fontSize = Math.max(10, cap.size)
  const targetW = cap.style === "brass" ? plateW - paddingX * 2 : w - paddingX * 2
  ctx.font = `${fontSize}px ${fontFamily}`
  let metrics = ctx.measureText(cap.text)
  while (metrics.width > targetW && fontSize > 10) {
    fontSize -= 1
    ctx.font = `${fontSize}px ${fontFamily}`
    metrics = ctx.measureText(cap.text)
  }

  ctx.fillStyle = baseColor
  ctx.textBaseline = "middle"
  let tx = x + w / 2
  if (cap.style === "brass") {
    tx = plateX + plateW / 2
    ctx.textAlign = "center"
  } else {
    switch (cap.align) {
      case "left":
        tx = x + paddingX
        ctx.textAlign = "left"
        break
      case "center":
        tx = x + w / 2
        ctx.textAlign = "center"
        break
      case "right":
        tx = x + w - paddingX
        ctx.textAlign = "right"
        break
    }
  }
  const ty = y + h / 2
  ctx.fillText(cap.text, tx, ty)
}

function drawClassicGold(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, thickness: number) {
  const rings = [
    { fill: "#6e5b2b", frac: 0.38 },
    { fill: "#8c7431", frac: 0.28 },
    { fill: "#c9a94f", frac: 0.22 },
    { fill: "#e4c870", frac: 0.12 },
  ]
  let offset = 0
  for (const ring of rings) {
    const t = Math.max(2, Math.round(thickness * ring.frac))
    ctx.fillStyle = ring.fill
    ctx.fillRect(x + offset, y + offset, w - 2 * offset, t) // top
    ctx.fillRect(x + offset, y + h - offset - t, w - 2 * offset, t) // bottom
    ctx.fillRect(x + offset, y + offset, t, h - 2 * offset) // left
    ctx.fillRect(x + w - offset - t, y + offset, t, h - 2 * offset) // right
    offset += t
  }
}

function drawModernMinimal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  thickness: number,
) {
  const t = Math.max(2, Math.round(thickness * 0.65))
  ctx.strokeStyle = "#1f2937"
  ctx.lineWidth = t
  ctx.strokeRect(x + t / 2, y + t / 2, w - t, h - t)
  ctx.strokeStyle = "#9aa3af"
  ctx.lineWidth = Math.max(1, Math.round(t * 0.2))
  ctx.strokeRect(x + t, y + t, w - 2 * t, h - 2 * t)
}

function drawVintageBrown(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  thickness: number,
) {
  const band1 = Math.max(2, Math.round(thickness * 0.5))
  const band2 = Math.max(2, Math.round(thickness * 0.3))
  const band3 = Math.max(2, Math.round(thickness * 0.2))
  insetRectFill(ctx, x, y, w, h, 0, band1, "#6b4f2a")
  insetRectFill(ctx, x, y, w, h, band1, band2, "#4a351a")
  insetRectFill(ctx, x, y, w, h, band1 + band2, band3, "#b4936b")
}

function drawWoodgrainWarm(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  thickness: number,
) {
  const band = Math.max(2, Math.round(thickness * 0.8))
  insetRectFill(ctx, x, y, w, h, 0, band, "#8b5a2b")
  ctx.save()
  ctx.globalAlpha = 0.15
  ctx.strokeStyle = "#533516"
  ctx.lineWidth = 1
  const steps = Math.max(8, Math.round(band * 0.8))
  for (let i = 0; i < steps; i++) {
    const inset = Math.round((i / steps) * band)
    ctx.strokeRect(x + inset + 0.5, y + inset + 0.5, w - 2 * inset - 1, h - 2 * inset - 1)
  }
  ctx.restore()

  ctx.strokeStyle = "#d2a679"
  ctx.lineWidth = Math.max(1, Math.round(thickness * 0.1))
  ctx.strokeRect(x + band, y + band, w - 2 * band, h - 2 * band)
}

function drawOrnateGold(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, thickness: number) {
  const bands = [
    { color: "#5e4a1f", f: 0.18 },
    { color: "#8a6b2b", f: 0.22 },
    { color: "#c3a14e", f: 0.3 },
    { color: "#ead079", f: 0.3 },
  ]
  let inset = 0
  for (const b of bands) {
    const t = Math.max(2, Math.round(thickness * b.f))
    insetRectFill(ctx, x, y, w, h, inset, t, b.color)
    inset += t
  }
  ctx.save()
  ctx.globalAlpha = 0.25
  ctx.strokeStyle = "#fff4b0"
  for (let i = 1; i <= 3; i++) {
    const off = Math.round((i / 6) * inset)
    ctx.strokeRect(x + off + 0.5, y + off + 0.5, w - 2 * off - 1, h - 2 * off - 1)
  }
  ctx.restore()
}

function drawBlackGallery(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  thickness: number,
) {
  const t = Math.max(2, Math.round(thickness * 0.8))
  insetRectFill(ctx, x, y, w, h, 0, t, "#212121")
  ctx.strokeStyle = "#3a3a3a"
  ctx.lineWidth = Math.max(1, Math.round(t * 0.15))
  ctx.strokeRect(x + t, y + t, w - 2 * t, h - 2 * t)
}

function drawSilverBrushed(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  thickness: number,
) {
  const t = Math.max(2, Math.round(thickness * 0.7))
  insetRectFill(ctx, x, y, w, h, 0, t, "#9aa3ad")
  ctx.save()
  ctx.globalAlpha = 0.2
  ctx.strokeStyle = "#c7cdd4"
  const lines = Math.max(6, Math.round(t * 0.8))
  for (let i = 0; i < lines; i++) {
    const inset = Math.round((i / lines) * t)
    ctx.strokeRect(x + inset + 0.5, y + inset + 0.5, w - 2 * inset - 1, h - 2 * inset - 1)
  }
  ctx.restore()
}

function drawMahogany(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, thickness: number) {
  const tOuter = Math.max(2, Math.round(thickness * 0.55))
  const tInner = Math.max(2, Math.round(thickness * 0.35))
  insetRectFill(ctx, x, y, w, h, 0, tOuter, "#5b2e1a")
  insetRectFill(ctx, x, y, w, h, tOuter, tInner, "#7a3a21")
  ctx.strokeStyle = "#c29b7a"
  ctx.lineWidth = Math.max(1, Math.round(thickness * 0.08))
  ctx.strokeRect(x + tOuter + tInner, y + tOuter + tInner, w - 2 * (tOuter + tInner), h - 2 * (tOuter + tInner))
}

function drawPolaroidWhite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  thickness: number,
) {
  const t = Math.max(2, Math.round(thickness * 0.25))
  insetRectFill(ctx, x, y, w, h, 0, t, "#eaeaea")
}

function drawHeirloomOrnate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  thickness: number,
) {
  const rings = [
    { c: "#4f3e17", f: 0.12 },
    { c: "#6e561e", f: 0.16 },
    { c: "#8f6d24", f: 0.18 },
    { c: "#b89134", f: 0.22 },
    { c: "#d9b85a", f: 0.18 },
    { c: "#f1d989", f: 0.14 },
  ]
  let inset = 0
  for (const r of rings) {
    const t = Math.max(2, Math.round(thickness * r.f))
    insetRectFill(ctx, x, y, w, h, inset, t, r.c)
    inset += t
  }
  ctx.save()
  ctx.globalAlpha = 0.25
  ctx.strokeStyle = "#fff3b4"
  const ridges = 4
  for (let i = 1; i <= ridges; i++) {
    const off = Math.round((i / (ridges + 2)) * inset)
    ctx.strokeRect(x + off + 0.5, y + off + 0.5, w - 2 * off - 1, h - 2 * off - 1)
  }
  ctx.restore()
}

function drawFormalMahogany(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  thickness: number,
) {
  const outer = Math.max(2, Math.round(thickness * 0.6))
  const inner = Math.max(2, Math.round(thickness * 0.3))
  insetRectFill(ctx, x, y, w, h, 0, outer, "#3e1d12")
  insetRectFill(ctx, x, y, w, h, outer, inner, "#5a2a19")
  ctx.strokeStyle = "#c3a38a"
  ctx.lineWidth = Math.max(1, Math.round(thickness * 0.08))
  ctx.strokeRect(x + outer + inner, y + outer + inner, w - 2 * (outer + inner), h - 2 * (outer + inner))
  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.strokeStyle = "#e9d6c7"
  ctx.lineWidth = 2
  ctx.strokeRect(x + Math.round(outer * 0.5), y + Math.round(outer * 0.5), w - outer, h - outer)
  ctx.restore()
}

function drawVintagePewter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  thickness: number,
) {
  const t = Math.max(2, Math.round(thickness * 0.4))
  insetRectFill(ctx, x, y, w, h, 0, t, "#8e8d89")
  ctx.save()
  ctx.globalAlpha = 0.25
  ctx.strokeStyle = "#b5b4b1"
  ctx.lineWidth = 1
  const passes = Math.max(4, Math.round(t * 0.7))
  for (let i = 0; i < passes; i++) {
    const inset = Math.round((i / passes) * t)
    ctx.strokeRect(x + inset + 0.5, y + inset + 0.5, w - 2 * inset - 1, h - 2 * inset - 1)
  }
  ctx.restore()
  ctx.strokeStyle = "#6d6c69"
  ctx.lineWidth = Math.max(1, Math.round(thickness * 0.15))
  ctx.strokeRect(x + t, y + t, w - 2 * t, h - 2 * t)
}

function drawArchivistBlack(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  thickness: number,
) {
  const t = Math.max(2, Math.round(thickness * 0.95))
  insetRectFill(ctx, x, y, w, h, 0, t, "#181818")
  ctx.save()
  ctx.globalAlpha = 0.6
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = Math.max(1, Math.round(thickness * 0.06))
  ctx.strokeRect(x + t, y + t, w - 2 * t, h - 2 * t)
  ctx.globalAlpha = 1
  ctx.restore()
}

function insetRectFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  insetStart: number,
  thickness: number,
  color: string,
) {
  ctx.fillStyle = color
  ctx.fillRect(x + insetStart, y + insetStart, w - 2 * insetStart, thickness) // top
  ctx.fillRect(x + insetStart, y + h - insetStart - thickness, w - 2 * insetStart, thickness) // bottom
  ctx.fillRect(x + insetStart, y + insetStart, thickness, h - 2 * insetStart) // left
  ctx.fillRect(x + w - insetStart - thickness, y + insetStart, thickness, h - 2 * insetStart) // right
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  const r2 = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + r2, y)
  ctx.arcTo(x + w, y, x + w, y + h, r2)
  ctx.arcTo(x + w, y + h, x, y + h, r2)
  ctx.arcTo(x, y + h, x, y, r2)
  ctx.arcTo(x, y, x + w, y, r2)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
}
