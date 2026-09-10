/**
 * OpenAnalytics client library wrapper.
 * Provides type-safe event tracking, revenue conversions, and user identification.
 * Docs: https://app.ecompin.com/docs/custom-events
 */

export interface OaApi {
  track: (event: string, properties?: Record<string, string | number | boolean>) => void
  conversion: (name: string, properties: { order_id: string; [key: string]: string | number | boolean }) => void
  identify: (id: string) => void
  consent: (status: "granted" | "denied") => void
}

declare global {
  interface Window {
    oa?: OaApi
  }
}

type EventProperties = Record<string, string | number | boolean | null | undefined>

const RESERVED_PREFIX = "oa_"
const SENSITIVE_KEY_PATTERN = /(token|session|email|password|secret|auth)/i
const MAX_PROPERTIES = 32
const MAX_KEY_LENGTH = 40
const MAX_VAL_LENGTH = 256
const EVENT_NAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,63}$/

/**
 * Sanitizes property bag according to OpenAnalytics rules:
 * - Drops keys starting with oa_ (reserved)
 * - Drops keys indicating secrets (token, password, etc.)
 * - Truncates keys to 40 chars and values to 256 chars
 * - Maximum 32 properties
 */
function sanitizeProperties(props?: EventProperties): Record<string, string | number | boolean> {
  if (!props) return {}

  const sanitized: Record<string, string | number | boolean> = {}
  let count = 0

  for (const [rawKey, rawVal] of Object.entries(props)) {
    if (count >= MAX_PROPERTIES) break
    if (rawVal === undefined || rawVal === null) continue

    const key = rawKey.trim().slice(0, MAX_KEY_LENGTH)
    if (!key || key.startsWith(RESERVED_PREFIX) || SENSITIVE_KEY_PATTERN.test(key)) {
      continue
    }

    if (typeof rawVal === "number" || typeof rawVal === "boolean") {
      sanitized[key] = rawVal
      count++
    } else {
      sanitized[key] = String(rawVal).slice(0, MAX_VAL_LENGTH)
      count++
    }
  }

  return sanitized
}

/**
 * Queue of events fired before the OpenAnalytics script has loaded.
 */
const pendingQueue: Array<() => void> = []
let isFlushing = false

function executeOrQueue(action: (oa: OaApi) => void) {
  if (typeof window === "undefined") return

  if (window.oa && typeof window.oa.track === "function") {
    try {
      action(window.oa)
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[OpenAnalytics] Error executing action:", e)
      }
    }
    return
  }

  pendingQueue.push(() => {
    if (window.oa && typeof window.oa.track === "function") {
      action(window.oa)
    }
  })

  if (!isFlushing) {
    isFlushing = true
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      if (window.oa && typeof window.oa.track === "function") {
        clearInterval(interval)
        while (pendingQueue.length > 0) {
          const fn = pendingQueue.shift()
          try {
            fn?.()
          } catch (e) {
            // ignore
          }
        }
        isFlushing = false
      } else if (attempts > 20) {
        // Stop polling after ~10 seconds
        clearInterval(interval)
        isFlushing = false
      }
    }, 500)
  }
}

/**
 * Track a custom event.
 * Valid names: letters or digits first, then letters, digits, _, ., :, - up to 64 chars.
 */
export function trackEvent(name: string, properties?: EventProperties): void {
  if (!name || !EVENT_NAME_PATTERN.test(name)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[OpenAnalytics] Invalid event name "${name}". Must match ^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,63}$`)
    }
    return
  }

  const cleanProps = sanitizeProperties(properties)
  executeOrQueue((oa) => {
    oa.track(name, cleanProps)
  })
}

/**
 * Track an outcome conversion, tying revenue to the visitor journey.
 * Requires an order_id (e.g. checkout session id, charge id).
 */
export function trackConversion(
  name: string,
  properties: { order_id: string; [key: string]: string | number | boolean | null | undefined }
): void {
  if (!name || !EVENT_NAME_PATTERN.test(name) || !properties.order_id) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[OpenAnalytics] Conversion requires a valid event name and order_id.`)
    }
    return
  }

  const cleanProps = sanitizeProperties(properties) as {
    order_id: string
    [key: string]: string | number | boolean
  }
  cleanProps.order_id = String(properties.order_id).slice(0, MAX_VAL_LENGTH)

  executeOrQueue((oa) => {
    oa.conversion(name, cleanProps)
  })
}

/**
 * Identifies a signed-in user with a pseudonymous database identifier (e.g. Supabase user UUID).
 * Must not contain emails, personal names, or direct PII.
 */
export function identifyUser(userId: string): void {
  if (!userId || typeof userId !== "string") return
  const cleanId = userId.trim()
  if (!cleanId || cleanId.length > 128 || SENSITIVE_KEY_PATTERN.test(cleanId) || cleanId.includes("@")) {
    return
  }

  executeOrQueue((oa) => {
    oa.identify(cleanId)
  })
}

/**
 * Set consent state for OpenAnalytics if consent gating is configured.
 */
export function setOaConsent(status: "granted" | "denied"): void {
  executeOrQueue((oa) => {
    if (typeof oa.consent === "function") {
      oa.consent(status)
    }
  })
}
