"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Turnstile } from "@marsidev/react-turnstile"
import { BookHeart, Loader2, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function MemoryBookPinGate({ shareId }: { shareId: string }) {
  const router = useRouter()
  const [pin, setPin] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [challengeRequired, setChallengeRequired] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [retryAfter, setRetryAfter] = useState(0)
  const [challengeKey, setChallengeKey] = useState(0)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""

  useEffect(() => {
    if (retryAfter <= 0) return
    const timer = window.setInterval(() => {
      setRetryAfter((current) => Math.max(0, current - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [retryAfter])

  const unlock = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await fetch(
        `/api/memory-books/share/${encodeURIComponent(shareId)}/unlock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin, turnstileToken }),
        }
      )
      const result = await response.json()
      if (!response.ok) {
        setChallengeRequired(result.challengeRequired === true)
        setRetryAfter(Number(result.retryAfterSeconds || 0))
        setTurnstileToken("")
        setChallengeKey((current) => current + 1)
        throw new Error(result.error || "That PIN could not open this keepsake.")
      }
      router.refresh()
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "That PIN could not open this keepsake."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-svh place-items-center bg-[#f6f2ea] px-5">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#5d83aa] text-white shadow-lg">
          <BookHeart className="size-6" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-[#252924]">
          A private Family Heritage keepsake
        </h1>
        <p className="mt-2 text-sm leading-6 text-black/52">
          Enter the six-digit PIN shared with you by the book&apos;s creator.
        </p>
        <form onSubmit={unlock} className="mt-7">
          <label className="block text-left text-sm font-semibold">
            Keepsake PIN
            <span className="relative mt-2 block">
              <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35" />
              <Input
                value={pin}
                required
                autoFocus
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                minLength={6}
                maxLength={6}
                className="h-11 bg-white pl-9 text-center text-lg tracking-[.35em]"
                onChange={(event) =>
                  setPin(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </span>
          </label>

          {challengeRequired && siteKey ? (
            <div className="mt-4 flex justify-center">
              <Turnstile
                key={challengeKey}
                siteKey={siteKey}
                onSuccess={setTurnstileToken}
                onExpire={() => setTurnstileToken("")}
                onError={() => setTurnstileToken("")}
              />
            </div>
          ) : null}

          {error ? (
            <p className="mt-3 text-sm text-red-700">
              {error}
              {retryAfter > 0
                ? ` Try again in about ${Math.max(1, Math.ceil(retryAfter / 60))} minute${retryAfter > 60 ? "s" : ""}.`
                : ""}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={
              loading ||
              pin.length !== 6 ||
              retryAfter > 0 ||
              (challengeRequired && Boolean(siteKey) && !turnstileToken)
            }
            className="mt-5 h-11 w-full bg-[#1f2c27] text-white"
          >
            {loading ? <Loader2 className="animate-spin" /> : <LockKeyhole />}
            Open keepsake
          </Button>
        </form>
      </div>
    </main>
  )
}