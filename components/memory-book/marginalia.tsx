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

// Bright, distinct name colours. Each contributor gets a consistent colour
// so their notes are easy to spot. Chosen to be readable on aged paper.
const NAME_HEX: Record<number, string> = {
  1: "#c0392b", // crimson
  2: "#2980b9", // royal blue
  3: "#27ae60", // green
  4: "#8e44ad", // purple
  5: "#d35400", // orange
  6: "#16a085", // teal
  7: "#c2185b", // pink
  8: "#2c3e50", // navy
  9: "#7f8c8d", // grey
  10: "#8b4513", // brown
}

export function nameHex(key: number) {
  const normalized = ((Math.abs(Math.floor(key) - 1) % 10) + 1) as keyof typeof NAME_HEX
  return NAME_HEX[normalized] || NAME_HEX[1]
}

/** Stable, gentle rotation so each note sits asymmetrically on the page. */
export function rotationForId(id: string) {
  let sum = 0
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i)
  return ((sum % 5) - 2) * 0.7
}

/**
 * Pick a distinct colour for a contributor based on their display name.
 * Same name always maps to the same colour, so a family member's notes
 * stay visually consistent across every page.
 */
export function nameColorKeyForName(name: string): number {
  let sum = 0
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i) * (i + 7)
  }
  return (sum % 10) + 1
}
