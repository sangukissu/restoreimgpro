"use client"

import { useState } from "react"
import { Check, Heart } from "lucide-react"
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
  { id: "love", label: "Love this", emoji: "❤️" },
  { id: "moved", label: "So moving", emoji: "🥺" },
  { id: "remember", label: "I remember", emoji: "💭" },
  { id: "thank_you", label: "Thank you", emoji: "🙏" },
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
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const [hasReachedEnd, setHasReachedEnd] = useState(false)
  const [showReactionsSection, setShowReactionsSection] = useState(false)

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
    <main
      className={[
        "bg-[#f8f5ef] w-full transition-all duration-500",
        showReactionsSection ? "min-h-svh overflow-y-auto" : "h-svh overflow-hidden",
      ].join(" ")}
    >
      <div className="relative w-full h-full">
        <FamilyHeritageViewer
          className="publicViewer"
          document={document}
          assetSources={assetSources}
          onCompleted={() => {
            posthog.capture("memory_book_recipient_completed")
            setHasReachedEnd(true)
          }}
          onPageChange={(index, max) => {
            if (index === max) {
              setHasReachedEnd(true)
            }
          }}
        />

        {hasReachedEnd && !showReactionsSection && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={() => {
                setShowReactionsSection(true)
                setTimeout(() => {
                  const target = document.getElementById("reaction-section")
                  target?.scrollIntoView({ behavior: "smooth" })
                }, 100)
              }}
              className="font-manrope text-sm font-bold text-black/60 hover:text-black/90 transition-all flex items-center gap-1.5 animate-pulse bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-full shadow-md border border-black/5 hover:scale-105 cursor-pointer"
            >
              <span>Appreciate & write private note</span>
              <span className="text-xs">↓</span>
            </button>
          </div>
        )}
      </div>

      {showReactionsSection && (
        <>
          <section
            id="reaction-section"
            className="border-t border-black/8 bg-white px-5 py-16 scroll-mt-4"
          >
            <div className="mx-auto max-w-2xl text-center">
              {document.dedication ? (
                <blockquote className="font-hand text-2xl leading-tight text-black/72 md:text-3xl">
                  “{document.dedication}”
                </blockquote>
              ) : null}

              <div className="mt-12 border-t border-black/8 pt-8">
                {sent ? (
                  <div className="py-8">
                    <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                      <Check className="size-6" />
                    </span>
                    <p className="mt-4 font-semibold text-lg">
                      Your private reaction was sent.
                    </p>
                    <p className="mt-1 text-sm text-black/48">
                      Only the keepsake owner can see it.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold font-manrope">
                      Send a little love back
                    </h2>
                    <p className="mt-1.5 text-sm text-black/48">
                      Your response is private and visible only to the person who
                      shared this book.
                    </p>

                    {/* Emoji Reaction Selector (No button borders/backgrounds) */}
                    <div className="mt-8 flex justify-center items-center gap-8 md:gap-12 flex-wrap">
                      {REACTIONS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setReaction(item.id)}
                          className="flex flex-col items-center gap-1.5 group focus:outline-none cursor-pointer"
                        >
                          <span
                            className={[
                              "text-4xl md:text-5xl transition-all duration-300",
                              reaction === item.id
                                ? "scale-125 filter drop-shadow-[0_4px_12px_rgba(49,93,85,0.25)]"
                                : "opacity-50 hover:opacity-100 hover:scale-110",
                            ].join(" ")}
                          >
                            {item.emoji}
                          </span>
                          <span
                            className={[
                              "text-[10px] font-bold tracking-wider uppercase transition-colors duration-300 mt-1",
                              reaction === item.id
                                ? "text-[#315d55]"
                                : "text-black/40 group-hover:text-black/60",
                            ].join(" ")}
                          >
                            {item.label}
                          </span>
                          <span
                            className={[
                              "h-1 w-4 rounded-full bg-[#315d55] transition-all duration-300",
                              reaction === item.id
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-50",
                            ].join(" ")}
                          />
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 grid gap-4 text-left sm:grid-cols-[180px_1fr]">
                      <Input
                        value={displayName}
                        maxLength={60}
                        placeholder="Your name (optional)"
                        className="bg-[#faf9f6] border-black/10 focus-visible:ring-[#315d55]"
                        onChange={(event) => setDisplayName(event.target.value)}
                      />
                      <Textarea
                        value={note}
                        maxLength={280}
                        placeholder="Add a short private note (optional)"
                        className="bg-[#faf9f6] border-black/10 focus-visible:ring-[#315d55]"
                        onChange={(event) => setNote(event.target.value)}
                      />
                    </div>

                    {error ? (
                      <p className="mt-4 text-sm text-red-700">{error}</p>
                    ) : null}

                    <Button
                      onClick={sendReaction}
                      disabled={sending}
                      className="mt-6 bg-[#1f2c27] hover:bg-[#2c3d36] text-white transition-colors px-6 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <Heart className="size-4 fill-current" />
                      Send privately
                    </Button>
                  </>
                )}
              </div>
            </div>
          </section>

          <footer className="border-t border-black/8 bg-[#f2f2ef] px-5 py-6 text-center text-xs text-black/44">
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
        </>
      )}
    </main>
  )
}
