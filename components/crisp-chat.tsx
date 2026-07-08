"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    $crisp: any[]
    CRISP_WEBSITE_ID: string
  }
}

const CRISP_WEBSITE_ID = "d7df0d90-5eac-476b-be14-3a674c0ea3d4"

// User interaction signals used to lazily boot Crisp.
// Deferring the script until a real human interacts keeps crawlers (which
// never fire these events) from loading the widget and indexing its
// greeting/dialogue text as page content.
const INTERACTION_EVENTS = [
  "mousemove",
  "mousedown",
  "touchstart",
  "keydown",
  "scroll",
] as const

export function CrispChat() {
  useEffect(() => {
    // If Crisp was already bootstrapped (e.g. HMR), do nothing.
    if (window.$crisp) return

    let loaded = false

    const loadCrisp = () => {
      if (loaded) return
      loaded = true
      window.$crisp = []
      window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID

      const d = document
      const s = d.createElement("script")
      s.src = "https://client.crisp.chat/l.js"
      s.async = true
      d.getElementsByTagName("head")[0].appendChild(s)

      cleanup()
    }

    const startLoadAfterIdle = () => {
      // Fallback: if no interaction happens within 15s, still load so real
      // users on passive pages aren't left without support. Crawlers won't
      // execute this JS at all, and even if a renderer does, it will have
      // already left the page well within 15s without interacting.
      window.setTimeout(loadCrisp, 15000)
    }

    const cleanups = INTERACTION_EVENTS.map((event) => {
      const handler = () => loadCrisp()
      window.addEventListener(event, handler, { once: true, passive: true })
      return () => window.removeEventListener(event, handler)
    })

    function cleanup() {
      cleanups.forEach((fn) => fn())
    }

    startLoadAfterIdle()

    return cleanup
  }, [])

  return null
}