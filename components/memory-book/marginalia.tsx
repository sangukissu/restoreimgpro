"use client"

export type MarginaliaNote = {
  id: string
  reaction: string
  display_name: string
  note: string
  page_index: number | null
  ink_color_key: number
  created_at: string
}

const INK_HEX: Record<number, string> = {
  1: "#2b2826", // charcoal
  2: "#7a5a3a", // sepia
  3: "#4f6376", // dusty blue
  4: "#47736c", // soft green (brand)
  5: "#7c4a64", // faded plum
}

export function inkHex(key: number) {
  return INK_HEX[key] || INK_HEX[1]
}

/** Stable, gentle rotation so each note sits asymmetrically on the page. */
export function rotationForId(id: string) {
  let sum = 0
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i)
  return ((sum % 5) - 2) * 0.7
}

/**
 * Lighten a hex ink color by blending it toward white.
 * `amount` is 0–1 (0 = original, 1 = fully white).
 * Used to give the contributor's name a softer tint of their ink.
 */
export function lightenInk(hex: string, amount: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const mix = (c: number) => Math.round(c + (255 - c) * amount)
  const clamp = (c: number) => Math.max(0, Math.min(255, c))
  const toHex = (c: number) => clamp(c).toString(16).padStart(2, "0")
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`
}