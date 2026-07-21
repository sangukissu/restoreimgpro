/**
 * Cookie / analytics consent categories and storage helpers.
 * Default: non-essential denied until the visitor chooses.
 */

export const CONSENT_STORAGE_KEY = "bb_consent_v1"
export const CONSENT_POLICY_VERSION = "2026-07-19"

export type ConsentCategory = "necessary" | "analytics" | "support" | "media"

export interface ConsentState {
  version: string
  updatedAt: string
  necessary: true
  analytics: boolean
  support: boolean
  media: boolean
}

export const DEFAULT_CONSENT: ConsentState = {
  version: CONSENT_POLICY_VERSION,
  updatedAt: "",
  necessary: true,
  analytics: true,
  support: false,
  media: false,
}

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentState
    if (!parsed || parsed.version !== CONSENT_POLICY_VERSION) return null
    return {
      ...DEFAULT_CONSENT,
      ...parsed,
      necessary: true,
    }
  } catch {
    return null
  }
}

export function writeConsent(
  partial: Pick<ConsentState, "analytics" | "support" | "media">
): ConsentState {
  const next: ConsentState = {
    version: CONSENT_POLICY_VERSION,
    updatedAt: new Date().toISOString(),
    necessary: true,
    analytics: !!partial.analytics,
    support: !!partial.support,
    media: !!partial.media,
  }
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent("bb-consent-changed", { detail: next }))
  } catch {
    // ignore quota / private mode
  }
  return next
}

export function acceptAllConsent(): ConsentState {
  return writeConsent({ analytics: true, support: true, media: true })
}

export function rejectNonEssentialConsent(): ConsentState {
  return writeConsent({ analytics: false, support: false, media: false })
}
