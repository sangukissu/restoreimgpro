"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BookHeart,
  Check,
  Clock3,
  Copy,
  ExternalLink,
  Loader2,
  Plus,
  ShieldCheck,
} from "lucide-react"
import posthog from "posthog-js"
import { Button } from "@/components/ui/button"
import type { MemoryBookSummary } from "@/lib/memory-book/types"

type LibraryBook = MemoryBookSummary & { shareUrl: string | null }

export function MemoryBookLibrary({
  books,
  entitlement,
  suggestedSource,
}: {
  books: LibraryBook[]
  entitlement: { live_book_id: string | null; source: string; granted_at: string } | null
  suggestedSource: {
    sourceId: string
    sourceType: "restoration" | "family_portrait" | "add_person" | "animation" | "nostalgic_hug"
  } | null
}) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const createBook = async () => {
    setCreating(true)
    try {
      const response = await fetch("/api/memory-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(suggestedSource || {}),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to create keepsake")

      posthog.capture("memory_book_draft_created", {
        theme: "family_heritage_v1",
        has_suggested_source: Boolean(suggestedSource),
      })

      if (suggestedSource) {
        await fetch(`/api/memory-books/${result.book.id}/assets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(suggestedSource),
        })
      }

      router.push(`/dashboard/memory-book/${result.book.id}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <main className="min-h-[calc(100svh-4rem)]">
      <section className="border-b border-black/8 bg-white px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#3f6f68]">
              <BookHeart className="size-4" />
              Family Heritage
            </div>
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-[#1f2421] md:text-4xl">
              Your restored memories, gathered with care.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-black/58 md:text-base">
              Choose the photographs and animations that matter. BringBack composes
              the book, saves every decision, and gives you one private link for the
              people you love.
            </p>
          </div>
          <Button
            size="lg"
            onClick={createBook}
            disabled={creating}
            className="h-11 bg-[#1e2925] px-5 text-white hover:bg-[#2d3b36]"
          >
            {creating ? <Loader2 className="animate-spin" /> : <Plus />}
            New keepsake
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-7 md:px-8 md:py-10">
        <div className="mb-6 grid gap-px overflow-hidden rounded-lg border border-black/8 bg-black/8 md:grid-cols-3">
          <StatusFact
            icon={<ShieldCheck />}
            label="Private by default"
            value="Clean private link with required PIN"
          />
          <StatusFact
            icon={<Clock3 />}
            label="Always recoverable"
            value="Drafts resume after refresh or device changes"
          />
          <StatusFact
            icon={<Check />}
            label={entitlement ? "Publishing included" : "Full preview included"}
            value={
              entitlement
                ? "Your purchase includes one live keepsake"
                : "Publish after any BringBack purchase"
            }
          />
        </div>

        {books.length ? (
          <div className="space-y-3">
            {books.map((book) => {
              const readyCount = book.memory_book_assets.filter(
                (asset) => asset.status === "ready" && !asset.is_hidden
              ).length
              return (
                <article
                  key={book.id}
                  className="grid gap-4 rounded-lg border border-black/8 bg-white p-4 shadow-[0_10px_30px_-28px_rgba(0,0,0,.45)] md:grid-cols-[92px_1fr_auto] md:items-center"
                >
                  <div className="grid aspect-[.78] w-[78px] place-items-center overflow-hidden rounded-md bg-[#5d83aa] text-white shadow-md">
                    <BookHeart className="size-7 opacity-90" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-bold text-[#202622]">
                        {book.title}
                      </h2>
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[11px] font-bold uppercase",
                          book.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : book.status === "needs_attention"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700",
                        ].join(" ")}
                      >
                        {book.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-black/52">
                      {readyCount} of 6–20 memories prepared
                      <span className="mx-2 text-black/18">•</span>
                      Updated{" "}
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        timeZone: "UTC",
                      }).format(new Date(book.last_activity_at))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {book.shareUrl ? (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Copy private link"
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              new URL(book.shareUrl!, window.location.origin).toString()
                            )
                            setCopiedId(book.id)
                            setTimeout(() => setCopiedId(null), 1800)
                          }}
                        >
                          {copiedId === book.id ? <Check /> : <Copy />}
                        </Button>
                        <Button variant="outline" size="icon" asChild title="Open published keepsake">
                          <a href={book.shareUrl} target="_blank" rel="noreferrer">
                            <ExternalLink />
                          </a>
                        </Button>
                      </>
                    ) : null}
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/memory-book/${book.id}`)
                      }
                      className="bg-[#1e2925] text-white hover:bg-[#2d3b36]"
                    >
                      {book.status === "published" ? "Manage" : "Continue"}
                      <ArrowRight />
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="grid min-h-[310px] place-items-center border-y border-black/8 bg-white px-6 text-center">
            <div className="max-w-md py-12">
              <BookHeart className="mx-auto size-10 text-[#5d83aa]" />
              <h2 className="mt-5 text-xl font-bold">Your first draft is composed, not built.</h2>
              <p className="mt-2 text-sm leading-6 text-black/55">
                Start by choosing memories. You will never face an empty canvas or
                have to arrange individual design elements.
              </p>
              <Button
                onClick={createBook}
                disabled={creating}
                className="mt-6 bg-[#1e2925] text-white hover:bg-[#2d3b36]"
              >
                {creating ? <Loader2 className="animate-spin" /> : <Plus />}
                Create Family Heritage book
              </Button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function StatusFact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3 bg-white px-4 py-4">
      <span className="mt-0.5 text-[#47736c] [&>svg]:size-4">{icon}</span>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-black/52">{value}</p>
      </div>
    </div>
  )
}
