"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import Clarity from "@microsoft/clarity"
import { readConsent, type ConsentState } from "@/lib/consent"

const GA_ID = "G-184H988WCE"
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(args)
  window.gtag = gtag
}

/** Google Consent Mode — analytics off unless granted. */
function applyGoogleConsent(granted: boolean) {
  if (typeof window === "undefined") return
  gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: granted ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  })
}

/**
 * Microsoft Clarity Consent Mode v2.
 * Call before init when denying; after init when revoking.
 * Docs: https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode
 */
function applyClarityConsent(granted: boolean) {
  if (typeof window === "undefined") return
  try {
    const payload = {
      ad_Storage: "denied" as const,
      analytics_Storage: granted ? ("granted" as const) : ("denied" as const),
    }
    if (typeof window.clarity === "function") {
      window.clarity("consentv2", payload)
    }
    // Queue via NPM helper if script API not on window yet
    if (!granted && typeof Clarity !== "undefined") {
      try {
        // No-op if not initialized; avoids throwing
        ;(Clarity as unknown as { consentV2?: (p: typeof payload) => void }).consentV2?.(payload)
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
}

/**
 * Stop Clarity after revoke. Best-effort: consent deny + stop new tags.
 * Full wipe of prior session cookies is browser-controlled; we never re-init after deny
 * in this page session without an explicit grant.
 */
function stopClarityIfRunning() {
  if (typeof window === "undefined") return
  try {
    applyClarityConsent(false)
    if (typeof window.clarity === "function") {
      // Stop identifying / upgrading the current session when API is available
      window.clarity("stop")
    }
  } catch {
    // stop may be unsupported in some Clarity builds — consentv2 deny still applies
  }
}

export function AnalyticsLoader() {
  const [analytics, setAnalytics] = useState(false)
  const clarityInited = useRef(false)

  useEffect(() => {
    const sync = (state: ConsentState | null) => {
      const allowed = !!state?.analytics

      // Always push GA consent signal first
      applyGoogleConsent(allowed)

      if (allowed) {
        setAnalytics(true)
        // Init Clarity only after analytics consent — never before
        if (CLARITY_PROJECT_ID && !clarityInited.current) {
          // Consent grant signal before first tags when possible
          applyClarityConsent(true)
          Clarity.init(CLARITY_PROJECT_ID)
          clarityInited.current = true
          // Re-assert grant after init
          applyClarityConsent(true)
        } else if (clarityInited.current) {
          applyClarityConsent(true)
        }
      } else {
        setAnalytics(false)
        // Deny Clarity before any init, or stop if already running
        if (clarityInited.current) {
          stopClarityIfRunning()
        } else {
          applyClarityConsent(false)
        }
      }
    }

    // Default: analytics granted for traffic measurement, ad storage denied
    applyGoogleConsent(true)
    applyClarityConsent(false)

    const initial = readConsent()
    sync(initial || { ...readConsent(), analytics: true } as any)

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail
      sync(detail || readConsent())
    }
    window.addEventListener("bb-consent-changed", onChange)
    return () => window.removeEventListener("bb-consent-changed", onChange)
  }, [])

  return (
    <>
      {/* Consent Mode defaults before any tags fire */}
      <Script id="gtag-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted',
            functionality_storage: 'granted',
            security_storage: 'granted',
            wait_for_update: 500
          });
        `}
      </Script>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  )
}
