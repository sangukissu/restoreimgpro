"use client"

import Image from "next/image"
import { Loader2, LogIn, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

const RETRY_WINDOW_MS = 30_000

export default function SessionCheckClient({
  nextPath,
}: {
  nextPath: string
}) {
  const [autoRetrying, setAutoRetrying] = useState(true)

  useEffect(() => {
    const retryKey = `bringback-auth-retry:${nextPath}`
    const previousAttempt = Number(sessionStorage.getItem(retryKey) || 0)
    const shouldRetry =
      !Number.isFinite(previousAttempt) ||
      Date.now() - previousAttempt > RETRY_WINDOW_MS

    if (typeof window.clarity === "function") {
      window.clarity("event", "auth_session_retry")
    }

    if (!shouldRetry) {
      setAutoRetrying(false)
      return
    }

    sessionStorage.setItem(retryKey, String(Date.now()))
    const timer = window.setTimeout(() => window.location.reload(), 800)
    return () => window.clearTimeout(timer)
  }, [nextPath])

  const retry = () => {
    sessionStorage.removeItem(`bringback-auth-retry:${nextPath}`)
    window.location.reload()
  }

  const signIn = () => {
    const query = new URLSearchParams({ next: nextPath })
    window.location.assign(`/login?${query.toString()}`)
  }

  return (
    <main className="min-h-screen bg-brand-bg px-4 py-12 flex items-center justify-center">
      <section className="w-full max-w-lg rounded-[2rem] border border-black/5 bg-white p-8 text-center shadow-[0_30px_80px_-35px_rgba(0,0,0,0.28)] sm:p-12">
        <div className="mx-auto mb-7 flex w-fit items-center gap-3">
          <span className="flex items-center justify-center rounded-xl border border-black/10 bg-brand-surface">
            <Image
              src="/bringback-logo.webp"
              alt="BringBack"
              width={48}
              height={48}
            />
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            BringBack
          </span>
        </div>

        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
          <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-brand-black">
          Checking your session
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-600">
          We could not verify your account for a moment. Your dashboard data is
          still protected, and no work has been lost.
        </p>

        {autoRetrying ? (
          <p className="mt-7 text-sm font-semibold text-gray-500">
            Reconnecting automatically…
          </p>
        ) : (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-black px-6 py-3 font-bold text-white transition hover:scale-[1.02]"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
            <button
              type="button"
              onClick={signIn}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 font-bold text-brand-black transition hover:bg-gray-50"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Sign in again
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
