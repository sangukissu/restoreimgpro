"use client"

import { useState } from "react"
import { Turnstile } from "@marsidev/react-turnstile"
import { Check, Heart, MessageCircleHeart, Sparkles } from "lucide-react"
import posthog from "posthog-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { MemoryBookDocumentV1 } from "@/lib/memory-book/types"
import {
  FamilyHeritageViewer,
  type MemoryBookAssetSource,
} from "./family-heritage-viewer"

const REACTIONS = [
  { id: "love", label: "Love this", icon: Heart },
  { id: "moved", label: "So moving", icon: Sparkles },
  { id: "remember", label: "I remember", icon: MessageCircleHeart },
  { id: "thank_you", label: "Thank you", icon: Check },
] as const

export function PublicMemoryBook({
  document,
  assetSources,
  shareId,
  signature,
}: {
  document: MemoryBookDocumentV1
  assetSources: MemoryBookAssetSource[]
  shareId: string
  signature: string
}) {
  const [reaction, setReaction] = useState<(typeof REACTIONS)[number]["id"]>("love")
  const [displayName, setDisplayName] = useState("")
  const [note, setNote] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""

  const sendReaction = async () => {
    setSending(true)
    setError("")
    try {
      const response = await fetch(
        `/api/memory-books/share/${shareId}/reactions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signature,
            reaction,
            displayName,
            note,
            turnstileToken,
          }),
        }
      )
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to send reaction")
      setSent(true)
      posthog.capture("memory_book_reaction_sent", { reaction })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to send reaction")
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-svh bg-[#f8f5ef]">
      <FamilyHeritageViewer
        document={document}
        assetSources={assetSources}
        onCompleted={() => posthog.capture("memory_book_recipient_completed")}
      />

      <section className="border-t border-black/8 bg-white px-5 py-10">
        <div className="mx-auto max-w-2xl text-center">
          {document.dedication ? (
            <blockquote className="font-hand text-2xl leading-tight text-black/72 md:text-3xl">
              “{document.dedication}”
            </blockquote>
          ) : null}

          <div className="mt-9 border-t border-black/8 pt-8">
            {sent ? (
              <div className="py-5">
                <span className="mx-auto grid size-10 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <Check />
                </span>
                <p className="mt-3 font-semibold">Your private reaction was sent.</p>
                <p className="mt-1 text-sm text-black/48">
                  Only the keepsake owner can see it.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold">Send a little love back</h2>
                <p className="mt-1 text-sm text-black/48">
                  Your response is private and visible only to the person who shared this book.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {REACTIONS.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setReaction(item.id)}
                        className={[
                          "flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-semibold",
                          reaction === item.id
                            ? "border-[#47736c] bg-[#edf4f1] text-[#315d55]"
                            : "border-black/10 hover:bg-black/[.025]",
                        ].join(" ")}
                      >
                        <Icon className="size-4" />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-4 grid gap-3 text-left sm:grid-cols-[180px_1fr]">
                  <Input
                    value={displayName}
                    maxLength={60}
                    placeholder="Your name (optional)"
                    onChange={(event) => setDisplayName(event.target.value)}
                  />
                  <Textarea
                    value={note}
                    maxLength={280}
                    placeholder="Add a short private note (optional)"
                    onChange={(event) => setNote(event.target.value)}
                  />
                </div>
                {siteKey ? (
                  <div className="mt-4 flex justify-center">
                    <Turnstile
                      siteKey={siteKey}
                      onSuccess={setTurnstileToken}
                      onExpire={() => setTurnstileToken("")}
                      onError={() => setTurnstileToken("")}
                    />
                  </div>
                ) : null}
                {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
                <Button
                  onClick={sendReaction}
                  disabled={sending || (Boolean(siteKey) && !turnstileToken)}
                  className="mt-5 bg-[#1f2c27] text-white"
                >
                  <Heart />
                  Send privately
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/8 bg-[#f2f2ef] px-5 py-5 text-center text-xs text-black/44">
        Preserved privately with BringBack
        {document.music.enabled ? (
          <span className="ml-2">
            · Music:{" "}
            <a
              href="https://www.scottbuckley.com.au/library/moonlight/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              “Moonlight” by Scott Buckley, CC BY 4.0
            </a>
          </span>
        ) : null}
      </footer>
    </main>
  )
}
