"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    $crisp: any[]
    CRISP_WEBSITE_ID: string
  }
}

export function CrispChat() {
  useEffect(() => {
    // Only load in production or if explicitly enabled
    // You might want to add a check like if (process.env.NODE_ENV === 'development') return;
    
    // Initialize Crisp
    window.$crisp = []
    window.CRISP_WEBSITE_ID = "d7df0d90-5eac-476b-be14-3a674c0ea3d4"

    // Load script
    ;(function () {
      const d = document
      const s = d.createElement("script")
      s.src = "https://client.crisp.chat/l.js"
      s.async = true
      d.getElementsByTagName("head")[0].appendChild(s)
    })()
  }, [])

  return null
}
