"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  acceptAllConsent,
  DEFAULT_CONSENT,
  readConsent,
  rejectNonEssentialConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/consent"

/** Cookie banner is public-only — not on dashboard, login, admin, or auth. */
function isPublicMarketingPath(pathname: string | null): boolean {
  if (!pathname) return false
  if (pathname.startsWith("/dashboard")) return false
  if (pathname.startsWith("/login")) return false
  if (pathname.startsWith("/admin")) return false
  if (pathname.startsWith("/auth")) return false
  if (pathname.startsWith("/api")) return false
  return true
}

export function ConsentBanner() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [manage, setManage] = useState(false)
  const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT)

  const isPublic = isPublicMarketingPath(pathname)

  useEffect(() => {
    setMounted(true)
    const existing = readConsent()
    if (existing) {
      setDraft(existing)
      setOpen(false)
    } else {
      setDraft(DEFAULT_CONSENT)
      setOpen(true)
    }

    const onOpenSettings = () => {
      const current = readConsent() || DEFAULT_CONSENT
      setDraft(current)
      setManage(true)
      setOpen(true)
    }
    window.addEventListener("bb-open-cookie-settings", onOpenSettings)
    return () => window.removeEventListener("bb-open-cookie-settings", onOpenSettings)
  }, [])

  if (!mounted || !isPublic || !open) return null

  const close = () => {
    setOpen(false)
    setManage(false)
  }

  const saveCustom = () => {
    writeConsent({
      analytics: draft.analytics,
      support: draft.support,
      // YouTube is click-to-play, not a banner category
      media: draft.media,
    })
    close()
  }

  return (
    <div
      className="fixed bottom-3 left-3 z-[100] w-[min(100vw-1.5rem,22rem)] pointer-events-none"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="pointer-events-auto rounded-xl border border-black/10 bg-white/95 backdrop-blur-sm shadow-lg px-3 py-2.5">
        <p id="cookie-consent-title" className="text-xs font-bold text-brand-black">
          Cookie preferences
        </p>
        <p id="cookie-consent-desc" className="mt-0.5 text-[11px] leading-snug text-gray-600">
          We use essential cookies for login, security, and checkout. Optional: Google Analytics,
          Microsoft Clarity, and Crisp help chat.{" "}
          <Link href="/privacy" className="underline font-medium text-brand-black">
            Privacy Policy
          </Link>
        </p>

        {manage && (
          <div className="mt-2 space-y-2 border-t border-gray-100 pt-2 text-[11px]">
            <label className="flex items-start gap-2 text-gray-500">
              <input type="checkbox" checked disabled className="mt-0.5 scale-90 shrink-0" />
              <span>
                <span className="font-semibold text-gray-700">Essential</span>
                <span className="block text-gray-500 leading-snug">
                  Sign-in, security, and checkout — always on.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 scale-90 shrink-0"
                checked={draft.analytics}
                onChange={(e) => setDraft((d) => ({ ...d, analytics: e.target.checked }))}
              />
              <span>
                <span className="font-semibold text-brand-black">Analytics</span>
                <span className="block text-gray-500 leading-snug">
                  Google Analytics &amp; Microsoft Clarity. Not loaded unless you accept.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 scale-90 shrink-0"
                checked={draft.support}
                onChange={(e) => setDraft((d) => ({ ...d, support: e.target.checked }))}
              />
              <span>
                <span className="font-semibold text-brand-black">Help chat (Crisp)</span>
                <span className="block text-gray-500 leading-snug">
                  Support chat widget. Not loaded unless you accept.
                </span>
              </span>
            </label>
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              acceptAllConsent()
              close()
            }}
            className="rounded-md bg-brand-black text-white px-2.5 py-1 text-[11px] font-bold hover:bg-black/90"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => {
              rejectNonEssentialConsent()
              close()
            }}
            className="rounded-md border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => (manage ? saveCustom() : setManage(true))}
            className="rounded-md px-2 py-1 text-[11px] font-semibold text-gray-500 hover:text-brand-black"
          >
            {manage ? "Save" : "Customize"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function openCookieSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("bb-open-cookie-settings"))
  }
}
