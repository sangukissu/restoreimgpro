"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash)
    setVisible(false)
  }

  async function submit() {
    if (!reason || pending) return
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

  return (
    <Dialog open={visible} onOpenChange={(open) => { if (!open && !pending) dismiss() }}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl p-5 sm:max-w-xl sm:p-7" showCloseButton={false}>
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold text-gray-900">What stopped you today?</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            One quick answer helps us improve checkout. This is optional.
          </DialogDescription>
        </DialogHeader>

        <fieldset className="grid gap-2 sm:grid-cols-2" disabled={pending}>
          <legend className="sr-only">Choose why you left checkout</legend>
          {reasons.map(([value, label]) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="checkout-reason"
                value={value}
                checked={reason === value}
                onChange={() => setReason(value)}
                className="peer sr-only"
              />
              <span className="flex min-h-11 items-center rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-900">
                {label}
              </span>
            </label>
          ))}
        </fieldset>

        {reason && (
          <label className="grid gap-2 text-sm font-medium text-gray-900">
            <span>Anything else? <span className="font-normal text-gray-500">(optional)</span></span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
              rows={3}
              disabled={pending}
              placeholder="Tell us a little more"
              className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm font-normal outline-none focus:border-gray-900"
            />
          </label>
        )}

        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={dismiss} disabled={pending} className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
            Skip
          </button>
          <button type="button" onClick={submit} disabled={!reason || pending} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
            {pending ? "Sending…" : "Send feedback"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
