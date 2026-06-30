"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Loader2, ShieldOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const HOLD_SECONDS = 5

export function DeleteAccountClient({ userEmail }: { userEmail: string }) {
  const router = useRouter()
  const [typedEmail, setTypedEmail] = useState("")
  const [holdProgress, setHoldProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const holdStartRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const emailMatches = typedEmail.trim().toLowerCase() === userEmail.toLowerCase()
  const canSubmit = emailMatches && !submitting

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const startHold = () => {
    if (!canSubmit) return
    setIsHolding(true)
    holdStartRef.current = performance.now()
    setHoldProgress(0)
    const tick = (now: number) => {
      if (holdStartRef.current === null) return
      const elapsed = (now - holdStartRef.current) / 1000
      const next = Math.min(1, elapsed / HOLD_SECONDS)
      setHoldProgress(next)
      if (next >= 1) {
        void doSubmit()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const cancelHold = () => {
    setIsHolding(false)
    holdStartRef.current = null
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    setHoldProgress(0)
  }

  const doSubmit = async () => {
    setIsHolding(false)
    holdStartRef.current = null
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail: typedEmail.trim() }),
      })
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(payload.error || "Deletion failed. Please try again.")
      }
      router.replace("/dashboard/account/deleted")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Deletion failed. Please try again.")
      setSubmitting(false)
      setHoldProgress(0)
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <section className="rounded-2xl border border-[#e7d9c1] bg-[#fbf6ec] p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#a14a2b]" />
          <div>
            <h2 className="text-base font-semibold text-[#1f2421]">
              What will be deleted
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm text-[#1f2421]/75">
              <li>• Your profile, account, and login credentials</li>
              <li>• Every restored image, family portrait, animation, and video you created</li>
              <li>• Any memory books, including drafts and assets</li>
              <li>• Your credit balance, referral codes, and feedback history</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#cfd6c8] bg-white p-6">
        <h2 className="text-base font-semibold text-[#1f2421]">What stays</h2>
        <p className="mt-2 text-sm text-[#1f2421]/70">
          We are required to keep certain financial records. Your payment
          history is anonymized — your name and email are removed — but the
          amount, plan, and date of each transaction is retained for tax
          compliance.
        </p>
      </section>

      <section className="rounded-2xl border border-[#e0d6c2] bg-white p-6">
        <label htmlFor="confirm-email" className="block text-sm font-semibold text-[#1f2421]">
          Type your email to confirm
        </label>
        <p className="mt-1 text-xs text-[#1f2421]/60">
          Your email is <span className="font-mono font-medium text-[#1f2421]">{userEmail}</span>
        </p>
        <input
          id="confirm-email"
          type="email"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={typedEmail}
          onChange={(e) => setTypedEmail(e.target.value)}
          disabled={submitting}
          placeholder={userEmail}
          className="mt-3 w-full rounded-lg border border-[#d8cdb6] bg-white px-4 py-3 text-sm text-[#1f2421] outline-none transition focus:border-[#1f2421] focus:ring-2 focus:ring-[#1f2421]/10 disabled:opacity-50"
        />
        {typedEmail.length > 0 && !emailMatches && (
          <p className="mt-2 text-xs text-[#a14a2b]">
            Email does not match. Type it exactly as shown.
          </p>
        )}
      </section>

      <section>
        <Button
          type="button"
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          onTouchCancel={cancelHold}
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
          className="relative h-14 w-full overflow-hidden rounded-full bg-[#1f2421] text-[15px] font-semibold text-white transition-all hover:bg-[#2d352f] disabled:cursor-not-allowed disabled:bg-[#9aa39a]"
          style={{
            background:
              isHolding && emailMatches
                ? `linear-gradient(to right, #1f2421 ${holdProgress * 100}%, #9aa39a ${holdProgress * 100}%)`
                : undefined,
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting your account…
              </>
            ) : isHolding ? (
              <>
                <ShieldOff className="size-4" />
                Keep holding… {Math.max(0, HOLD_SECONDS - Math.ceil(holdProgress * HOLD_SECONDS))}s
              </>
            ) : emailMatches ? (
              <>
                <Trash2 className="size-4" />
                Hold for {HOLD_SECONDS} seconds to delete
              </>
            ) : (
              <>Type your email to enable</>
            )}
          </span>
        </Button>
        {error && (
          <p className="mt-4 rounded-lg border border-[#a14a2b]/30 bg-[#a14a2b]/5 px-4 py-3 text-sm text-[#a14a2b]">
            {error}
          </p>
        )}
        <p className="mt-3 text-center text-xs text-[#1f2421]/50">
          This action is irreversible. We will email a final receipt once it
          completes.
        </p>
      </section>
    </div>
  )
}
