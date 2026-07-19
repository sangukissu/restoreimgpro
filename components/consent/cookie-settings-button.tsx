"use client"

import React from "react"

export function CookieSettingsButton({
  className = "font-medium hover:text-brand-orange transition-colors text-left",
}: {
  className?: string
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new Event("bb-open-cookie-settings"))
      }}
    >
      Cookie settings
    </button>
  )
}
