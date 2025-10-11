"use client"

import { memo, useEffect, useRef, useState } from "react"

type SepiaOrbitProps = {
  count?: number
  speed?: number
  vignette?: boolean
  grain?: boolean
  microcopy?: string[]
}

const PALETTE = {
  brown: "#6B4E3D",
  cream: "#EFE4D8",
  charcoal: "#2B2A28",
  gold: "#C8A96B",
}

function OrbitSepiaDustBase({
  count = 140,
  speed = 1,
  vignette = true,
  grain = false,
  microcopy = [],
}: SepiaOrbitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const grainPatternRef = useRef<CanvasPattern | null>(null)
  const vignetteRef = useRef<CanvasGradient | null>(null)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (microcopy.length <= 1) return
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % microcopy.length), 2800)
    return () => clearInterval(id)
  }, [microcopy.length])

  const createGrainPattern = () => {
    const off = document.createElement("canvas")
    const size = 128
    off.width = size
    off.height = size
    const ictx = off.getContext("2d")!
    const img = ictx.createImageData(size, size)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0
      img.data[i] = v
      img.data[i + 1] = v
      img.data[i + 2] = v
      img.data[i + 3] = 255
    }
    ictx.putImageData(img, 0, 0)
    const ctx = canvasRef.current?.getContext("2d")
    return ctx ? ctx.createPattern(off, "repeat") : null
  }

  type Particle = {
    t: number
    layer: number
    radiusBase: number
    radiusJitter: number
    size: number
    speed: number
    color: string
    offset: number
  }

  type Dust = {
    x: number
    y: number
    r: number
    spd: number
    alpha: number
    blur: number
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const parent = canvas.parentElement!
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1))

    let viewW = 0
    let viewH = 0
    let cx = 0
    let cy = 0

    const recomputeVignette = () => {
      if (!vignette) {
        vignetteRef.current = null
        return
      }
      const inner = Math.min(viewW, viewH) * 0.25
      const outer = Math.max(viewW, viewH) * 0.8
      const grad = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer)
      grad.addColorStop(0, "rgba(0,0,0,0)")
      grad.addColorStop(1, "rgba(0,0,0,0.45)")
      vignetteRef.current = grad
    }

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect()
      viewW = width
      viewH = height
      cx = viewW / 2
      cy = viewH / 2
      canvas.width = Math.max(1, width * dpr)
      canvas.height = Math.max(1, height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      recomputeVignette()
    }
    resize()

    if (grain && !grainPatternRef.current) {
      grainPatternRef.current = createGrainPattern()
    }

    const particles: Particle[] = Array.from({ length: count }, () => {
      const t = Math.random() * Math.PI * 2
      const layer = Math.random()
      const minDim = Math.min(parent.clientWidth, parent.clientHeight)
      const base = 0.22 + 0.32 * layer
      const radiusBase = minDim * base
      const radiusJitter = (Math.random() - 0.5) * 14
      const size = Math.max(0.6, 2.2 * (0.3 + layer))
      const huePick = Math.random()
      const color = huePick < 0.65 ? PALETTE.brown : huePick < 0.9 ? PALETTE.gold : PALETTE.cream
      return {
        t,
        layer,
        radiusBase,
        radiusJitter,
        size,
        speed: (0.0018 + 0.004 * layer) * speed,
        color,
        offset: Math.random() * 1000,
      }
    })

    const dustCount = Math.floor(Math.max(12, parent.clientWidth / 48))
    const dust: Dust[] = Array.from({ length: dustCount }, () => ({
      x: Math.random() * parent.clientWidth,
      y: Math.random() * parent.clientHeight,
      r: 0.8 + Math.random() * 2,
      spd: 0.12 + Math.random() * 0.35,
      alpha: 0.08 + Math.random() * 0.12,
      blur: 0,
    }))

    let last = performance.now()

    ctx.fillStyle = PALETTE.charcoal
    ctx.fillRect(0, 0, viewW, viewH)

    const animate = (now: number) => {
      const dt = Math.min(32, now - last)
      last = now

      ctx.globalCompositeOperation = "source-over"
      ctx.fillStyle = "rgba(43,42,40,0.10)"
      ctx.fillRect(0, 0, viewW, viewH)

      const breath = 1 + 0.03 * Math.sin(now * 0.0016 * speed)

      particles.forEach((p) => {
        p.t += p.speed * (dt / 16)
        const r = (p.radiusBase + p.radiusJitter * Math.sin(p.t * 1.6 + p.offset)) * breath
        const wobble = 5 * Math.sin(p.t * 2.7 + p.offset)
        const x = cx + (r + wobble) * Math.cos(p.t)
        const drift = 4 * Math.sin((p.t + p.offset) * 0.25)
        const y = cy + (r - wobble) * Math.sin(p.t) + drift

        const alpha = 0.26 + 0.5 * p.layer
        ctx.globalAlpha = alpha

        ctx.beginPath()
        ctx.fillStyle = p.color
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = alpha * 0.25
        ctx.beginPath()
        ctx.fillStyle = p.color
        ctx.arc(x, y, p.size * (1.6 + 0.9 * p.layer), 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = alpha * 0.3
        ctx.beginPath()
        ctx.fillStyle = PALETTE.cream
        ctx.arc(x - p.size * 0.35, y - p.size * 0.35, p.size * 0.9, 0, Math.PI * 2)
        ctx.fill()
      })

      dust.forEach((d) => {
        d.y -= d.spd * (dt / 16)
        d.x += Math.sin((now * 0.001 + d.y) * 0.5) * 0.15
        if (d.y < -8) {
          d.y = viewH + 8
          d.x = Math.random() * viewW
        }
        ctx.globalAlpha = d.alpha
        ctx.beginPath()
        ctx.fillStyle = Math.random() < 0.2 ? PALETTE.gold : PALETTE.cream
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      })

      if (vignette && vignetteRef.current) {
        ctx.globalAlpha = 1
        ctx.fillStyle = vignetteRef.current
        ctx.fillRect(0, 0, viewW, viewH)
      }

      if (grain && grainPatternRef.current) {
        ctx.globalAlpha = 0.06
        ctx.fillStyle = grainPatternRef.current
        const ox = (now * 0.05) % 64
        const oy = (now * 0.03) % 64
        ctx.save()
        ctx.translate(ox, oy)
        ctx.fillRect(-ox, -oy, viewW + ox, viewH + oy)
        ctx.restore()
      }

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(animate)
    }

    const onResize = () => {
      cancelAnimationFrame(rafRef.current || 0)
      resize()
      last = performance.now()
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", onResize)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current || 0)
      window.removeEventListener("resize", onResize)
    }
  }, [count, grain, speed, vignette])

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}

export const OrbitSepiaDust = memo(OrbitSepiaDustBase)
