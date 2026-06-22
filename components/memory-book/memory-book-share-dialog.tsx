"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Loader2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Unplug,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  memoryBookShareSlugSchema,
  normalizeMemoryBookShareSlug,
} from "@/lib/memory-book/share-slug"
import type { MemoryBookRecord } from "@/lib/memory-book/types"

type ShareUpdate = {
  shareSlug: string
  displayUrl: string
  shareUrl: string
}

type ConfirmAction = "rename" | "reset" | "unpublish" | null

export function MemoryBookShareDialog({
  open,
  onOpenChange,
  book,
  shareUrl,
  onShareUpdated,
  onUnpublished,
  onError,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  book: MemoryBookRecord
  shareUrl: string | null
  onShareUpdated: (update: ShareUpdate) => void
  onUnpublished: () => Promise<void>
  onError: (message: string) => void
}) {
  const [slug, setSlug] = useState(book.share_slug)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [availability, setAvailability] = useState<
    "idle" | "checking" | "available" | "unavailable" | "invalid"
  >("idle")
  const [availabilityMessage, setAvailabilityMessage] = useState("")
  const [working, setWorking] = useState(false)
  const [copied, setCopied] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")

  const changed = slug !== book.share_slug
  const normalizedShareUrl = useMemo(() => {
    if (!shareUrl || typeof window === "undefined") return shareUrl
    return new URL(shareUrl, window.location.origin).toString()
  }, [shareUrl])

  useEffect(() => {
    if (!open) return
    setSlug(book.share_slug)
    setAdvancedOpen(false)
    setNewPin("")
    setConfirmPin("")
    setCopied(false)
    setAvailability("idle")
    setAvailabilityMessage("")
    void fetch(`/api/memory-books/${book.id}/share-slug`)
      .then((response) => response.json())
      .then((result) => setSuggestions(result.suggestions || []))
      .catch(() => setSuggestions([]))
  }, [book.id, book.share_slug, open])

  useEffect(() => {
    if (!open || !changed) {
      setAvailability("idle")
      setAvailabilityMessage("")
      return
    }

    const parsed = memoryBookShareSlugSchema.safeParse(slug)
    if (!parsed.success) {
      setAvailability("invalid")
      setAvailabilityMessage(parsed.error.issues[0]?.message || "Choose another address")
      return
    }

    setAvailability("checking")
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/memory-books/${book.id}/share-slug?slug=${encodeURIComponent(slug)}`,
          { signal: controller.signal }
        )
        const result = await response.json()
        setAvailability(result.available ? "available" : "unavailable")
        setAvailabilityMessage(
          result.available ? "This address is available." : result.message || "That address is already used."
        )
      } catch (cause) {
        if ((cause as Error).name !== "AbortError") {
          setAvailability("idle")
        }
      }
    }, 450)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [book.id, changed, open, slug])

  const updateSlug = async () => {
    setWorking(true)
    try {
      const response = await fetch(`/api/memory-books/${book.id}/share-slug`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to update the address")
      onShareUpdated(result)
      setAvailability("idle")
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Unable to update the address")
    } finally {
      setWorking(false)
      setConfirmAction(null)
    }
  }

  const resetAccess = async () => {
    setWorking(true)
    try {
      const response = await fetch(`/api/memory-books/${book.id}/share-link`, {
        method: "POST",
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to reset access")
      onShareUpdated(result)
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Unable to reset access")
    } finally {
      setWorking(false)
      setConfirmAction(null)
    }
  }

  const changePin = async () => {
    if (newPin.length !== 6 || newPin !== confirmPin) return
    setWorking(true)
    try {
      const response = await fetch(`/api/memory-books/${book.id}/share-pin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: newPin, confirmPin }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to change the PIN")
      onShareUpdated(result)
      setNewPin("")
      setConfirmPin("")
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Unable to change the PIN")
    } finally {
      setWorking(false)
    }
  }

  const unpublish = async () => {
    setWorking(true)
    try {
      await onUnpublished()
      onOpenChange(false)
    } finally {
      setWorking(false)
      setConfirmAction(null)
    }
  }

  const confirmCopy = async () => {
    if (!normalizedShareUrl) return
    await navigator.clipboard.writeText(normalizedShareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[92svh] w-[calc(100vw-1rem)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:w-full">
          <DialogHeader className="shrink-0 border-b border-black/8 px-4 py-4 pr-12 sm:px-6">
            <DialogTitle>Share this keepsake</DialogTitle>
            <DialogDescription>
              Copy the link and send the six-digit PIN separately.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-900">
              <ShieldCheck className="size-5 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold">Protected by your six-digit PIN</p>
                <p className="text-xs text-emerald-800/75">Only people with the link and PIN can open it.</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="memory-book-share-slug">
                Private book link
              </label>
              <div className="mt-2 flex overflow-hidden rounded-md border border-input bg-white focus-within:ring-2 focus-within:ring-ring/50">
                <span className="flex items-center border-r bg-[#f5f5f2] px-3 text-sm text-black/45">
                  /m/
                </span>
                <Input
                  id="memory-book-share-slug"
                  value={slug}
                  className="border-0 shadow-none focus-visible:ring-0"
                  maxLength={60}
                  onChange={(event) =>
                    setSlug(normalizeMemoryBookShareSlug(event.target.value))
                  }
                />
              </div>
              <div className="mt-2 min-h-5 text-xs">
                {availability === "checking" ? (
                  <span className="inline-flex items-center gap-1.5 text-black/50">
                    <Loader2 className="size-3 animate-spin" /> Checking availability
                  </span>
                ) : availability === "available" ? (
                  <span className="text-emerald-700">{availabilityMessage}</span>
                ) : availability === "unavailable" || availability === "invalid" ? (
                  <span className="text-red-700">{availabilityMessage}</span>
                ) : (
                  <span className="text-black/45">Letters, numbers, and hyphens only.</span>
                )}
              </div>
              {suggestions.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestions.slice(0, 2).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[#315d55] hover:border-[#47736c]"
                      onClick={() => setSlug(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}
              {changed ? (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-amber-50 px-3 py-2">
                  <p className="text-xs text-amber-900">
                    Saving a new name stops the previous address from opening.
                  </p>
                  <Button
                    size="sm"
                    disabled={working || availability !== "available"}
                    onClick={() => setConfirmAction("rename")}
                  >
                    Save name
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button onClick={confirmCopy} disabled={!shareUrl} className="bg-[#1f2c27] text-white">
                {copied ? <Check /> : <Copy />}
                {copied ? "Copied" : "Copy link"}
              </Button>
              <Button variant="outline" asChild disabled={!shareUrl}>
                <a href={shareUrl || "#"} target="_blank" rel="noreferrer">
                  <ExternalLink /> Open preview
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[#f5f5f2] px-3 py-2 text-xs text-black/58">
              <LockKeyhole className="size-4 text-[#47736c]" />
              Recipients enter the PIN once on each browser.
            </div>

            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between border-t border-black/8 pt-4 text-sm font-semibold text-black/70"
                >
                  Security & access
                  <ChevronDown
                    className={`size-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <div className="rounded-lg border border-black/8 p-3">
                  <p className="text-sm font-semibold">Change six-digit PIN</p>
                  <p className="mt-1 text-xs text-black/50">Changing it signs out every viewer immediately.</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <Input
                      value={newPin}
                      inputMode="numeric"
                      autoComplete="new-password"
                      maxLength={6}
                      placeholder="New PIN"
                      onChange={(event) => setNewPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                    <Input
                      value={confirmPin}
                      inputMode="numeric"
                      autoComplete="new-password"
                      maxLength={6}
                      placeholder="Confirm PIN"
                      onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    disabled={working || newPin.length !== 6 || newPin !== confirmPin}
                    onClick={() => void changePin()}
                  >
                    <LockKeyhole /> Change PIN
                  </Button>
                </div>
                <div className="flex flex-col gap-3 rounded-lg border border-black/8 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold">Sign out all viewers</p>
                    <p className="text-xs text-black/50">The clean link stays the same; every browser must enter the PIN again.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setConfirmAction("reset")}>
                    <RefreshCw /> Sign out
                  </Button>
                </div>
                <div className="flex flex-col gap-3 rounded-lg border border-red-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-red-800">Unpublish book</p>
                    <p className="text-xs text-red-700/70">Family members will no longer be able to open it.</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-700" onClick={() => setConfirmAction("unpublish")}>
                    <Unplug /> Unpublish
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(confirmAction)} onOpenChange={(value) => !value && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "rename"
                ? "Change this family link?"
                : confirmAction === "reset"
                  ? "Sign out all viewers?"
                  : "Unpublish this keepsake?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "rename"
                ? "The previous friendly address will stop working immediately."
                : confirmAction === "reset"
                  ? "The link stays the same, but every viewer will need to enter the PIN again."
                  : "The book will return to draft status and shared links will no longer open it."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={working}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={working}
              className={confirmAction === "unpublish" ? "bg-red-700 hover:bg-red-800" : ""}
              onClick={(event) => {
                event.preventDefault()
                if (confirmAction === "rename") void updateSlug()
                if (confirmAction === "reset") void resetAccess()
                if (confirmAction === "unpublish") void unpublish()
              }}
            >
              {working ? <Loader2 className="animate-spin" /> : null}
              {confirmAction === "rename"
                ? "Change address"
                : confirmAction === "reset"
                  ? "Sign out viewers"
                  : "Unpublish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
