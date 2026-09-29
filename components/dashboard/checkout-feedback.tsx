"use client"

import { useState } from "react"

const reasons = [
  ["too_expensive", "Price was too high"],
  ["unsure_results", "Unsure the result would be good"],
  ["trust", "I wasn't confident buying yet"],
  ["payment_issue", "Payment didn't work"],
  ["payment_method", "My payment method wasn't available"],
  ["not_ready", "Just looking / not ready"],
  ["other", "Something else"],
] as const

export function CheckoutFeedback({ attemptId }: { attemptId: string }) {
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [visible, setVisible] = useState(true)

  function dismiss() {
    const url = new URL(window.location.href)
    url.searchParams.delete("checkout")
    url.searchParams.delete("attempt")
    window.history.replaceState(window.history.state, "", url.toString())
    setVisible(false)
  }

  async function submit() {
    if (!reason) return
    setPending(true)
    setError("")
    try {
      const response = await fetch("/api/checkout/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, reason, note }),
      })
      if (!response.ok) throw new Error("Could not save feedback")
      dismiss()
    } catch {
      setError("Couldn't save that. Please try again.")
    } finally {
      setPending(false)
    }
  }

  if (!visible) return null

  return (
    <section className="mx-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:mx-6" aria-label="Checkout feedback">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-gray-900">What stopped you today?</h2>
          <p className="text-sm text-gray-600">One quick answer helps us improve checkout. This is optional.</p>
        </div>
        <button type="button" onClick={dismiss} className="text-sm text-gray-500 hover:text-gray-900" aria-label="Dismiss checkout question">Skip</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {reasons.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setReason(value)}
            aria-pressed={reason === value}
            className={`rounded-full border px-3 py-1.5 text-sm ${reason === value ? "border-black bg-black text-white" : "border-gray-300 text-gray-700 hover:border-gray-500"}`}
          >{label}</button>
        ))}
      </div>
      {reason && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={500}
            placeholder="Anything else? (optional)"
            aria-label="Additional checkout feedback"
            className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button type="button" onClick={submit} disabled={pending} className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {pending ? "Sending…" : "Send feedback"}
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
    </section>
  )
}
