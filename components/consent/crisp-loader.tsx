"use client"

import { useEffect } from "react"
import { readConsent, type ConsentState } from "@/lib/consent"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $crisp: any[]
    CRISP_WEBSITE_ID: string
  }
}

const CRISP_WEBSITE_ID = "d7df0d90-5eac-476b-be14-3a674c0ea3d4"

export function CrispLoader() {
  useEffect(() => {
    let loaded = false

    const loadCrisp = () => {
      if (loaded || typeof window === "undefined") return
      if (window.$crisp) {
        loaded = true
        return
      }
      loaded = true
      window.$crisp = []
      window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID
      const s = document.createElement("script")
      s.src = "https://client.crisp.chat/l.js"
      s.async = true
      document.head.appendChild(s)
    }

    const maybeLoad = (state: ConsentState | null) => {
      if (state?.support) loadCrisp()
    }

    maybeLoad(readConsent())

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail
      maybeLoad(detail || readConsent())
    }
    window.addEventListener("bb-consent-changed", onChange)
    return () => window.removeEventListener("bb-consent-changed", onChange)
  }, [])

  return null
}
