"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  BookHeart,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react"
import posthog from "posthog-js"
import { Button } from "@/components/ui/button"
import type { MemoryBookSummary } from "@/lib/memory-book/types"

type LibraryBook = MemoryBookSummary & { shareUrl: string | null }

const HERITAGE_SCRIPT_CLASS = "font-[var(--font-great-vibes)]"
const HERITAGE_HAND_CLASS = "font-[var(--font-patrick-hand)]"

export function MemoryBookLibrary({
  books,
  entitlement,
  suggestedSource,
}: {
  books: LibraryBook[]
  entitlement: { live_book_id: string | null; source: string; granted_at: string } | null
  suggestedSource: {
    sourceId: string
    sourceType: "restoration" | "family_portrait" | "add_person" | "remove_person" | "animation" | "nostalgic_hug"
  } | null
}) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const liveBookId = entitlement?.live_book_id ?? null
  const hasLiveBook = Boolean(liveBookId)
  const liveBook = hasLiveBook
    ? books.find((book) => book.id === liveBookId) ?? null
    : null

  const createBook = async () => {
    if (hasLiveBook) return
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

  const isEmpty = books.length === 0

  return (
    <main className="bg-[#FAFAF7]">
      {/* HERO — full-viewport when empty, compact intro when not */}
      <section
        className={[
          "relative overflow-hidden border-b border-black/[0.06]",
          "bg-gradient-to-b from-[#FAF6EE] via-[#F6F0E2] to-[#FAFAF7]",
        ].join(" ")}
      >
        {/* Warm atmospheric glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(255,140,80,0.18), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-[-8%] h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(120,90,60,0.10), transparent 70%)" }}
        />

        {/* EMPTY STATE LAYOUT — one full viewport, hero IS the empty state */}
        {isEmpty ? (
          <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-6xl gap-12 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="relative">
              <div className="mb-5 flex items-center gap-2">
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#1f2421]/10 bg-white/70 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1f2421] backdrop-blur-sm">
                  <BookHeart className="size-3.5" />
                  Family Heritage
                </span>
                {entitlement ? (
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    <span className="relative flex size-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                      <span className="relative size-1.5 rounded-full bg-emerald-600" />
                    </span>
                    Family Plan active
                  </span>
                ) : (
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                    <Sparkles className="size-3" />
                    Family Plan to publish
                  </span>
                )}
              </div>

              <h1 className="text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#1f2421] md:text-[64px] md:leading-[1.02]">
                A private book <br className="hidden md:block" />
                for the people <br className="hidden md:block" />
                <span className="text-[#8a7a64]">who made you.</span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-relaxed text-[#1f2421]/60 md:text-lg">
                You will never face an empty canvas. Choose the memories you love
                and the book assembles itself — pages, animations, and a private
                link to share with the people who matter.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  onClick={createBook}
                  disabled={creating}
                  size="lg"
                  className="h-12 rounded-full bg-[#FF4D00] px-7 text-[15px] font-semibold text-white shadow-[0_8px_24px_-12px_rgba(255,77,0,0.55)] hover:bg-[#e64500]"
                >
                  {creating ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 size-4" />
                  )}
                  Compose your first book
                </Button>
                <span className="text-sm text-[#1f2421]/55">Drafts are free</span>
              </div>
            </div>

            <HeroComposition />
          </div>
        ) : (
          // LIBRARY HERO — compact, the books themselves are the focal point
          <div className="relative mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#1f2421]/10 bg-white/70 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1f2421] backdrop-blur-sm">
                    <BookHeart className="size-3.5" />
                    Family Heritage
                  </span>
                  {entitlement ? (
                    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      <span className="relative flex size-1.5">
                        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                        <span className="relative size-1.5 rounded-full bg-emerald-600" />
                      </span>
                      Family Plan active
                    </span>
                  ) : (
                    <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                      <Sparkles className="size-3" />
                      Family Plan to publish
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] text-[#1f2421] md:text-5xl">
                  {hasLiveBook ? "Your keepsakes" : "Your library"}
                </h1>
                <p className="mt-2 text-sm text-[#1f2421]/55 md:text-base">
                  {books.length} {books.length === 1 ? "keepsake" : "keepsakes"}
                  {hasLiveBook ? " · 1 live" : ""}
                  {hasLiveBook ? " · Unpublish to compose a new one" : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {hasLiveBook && liveBook ? (
                  <Button
                    onClick={() => router.push(`/dashboard/memory-book/${liveBook.id}`)}
                    size="lg"
                    className="h-11 rounded-full bg-[#1f2421] px-6 text-sm font-semibold text-white hover:bg-[#2d352f]"
                  >
                    Open your live keepsake
                    <ArrowUpRight className="ml-1.5 size-4" />
                  </Button>
                ) : null}
                {!hasLiveBook ? (
                  <Button
                    onClick={createBook}
                    disabled={creating}
                    size="lg"
                    className="h-11 rounded-full bg-[#FF4D00] px-6 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(255,77,0,0.55)] hover:bg-[#e64500]"
                  >
                    {creating ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 size-4" />
                    )}
                    Compose another keepsake
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* LIBRARY — editorial grid (only when not empty) */}
      {!isEmpty ? (
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-2 md:px-8 md:pb-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
              const readyCount = book.memory_book_assets.filter(
                (asset) => asset.status === "ready" && !asset.is_hidden
              ).length
              const isLive = book.id === liveBookId
              return (
                <BookCard
                  key={book.id}
                  book={book}
                  readyCount={readyCount}
                  isLive={isLive}
                  hasLiveBook={hasLiveBook}
                  copied={copiedId === book.id}
                  onCopy={async () => {
                    if (!book.shareUrl) return
                    await navigator.clipboard.writeText(
                      new URL(book.shareUrl, window.location.origin).toString()
                    )
                    setCopiedId(book.id)
                    setTimeout(() => setCopiedId(null), 1800)
                  }}
                  onOpen={() => router.push(`/dashboard/memory-book/${book.id}`)}
                />
              )
            })}
          </div>
        </section>
      ) : null}

   
    </main>
  )
}

/* ---------- Hero composition: stacked tilted photo frames ---------- */
function HeroComposition() {
  return (
    <div className="relative mx-auto h-[340px] w-full max-w-[460px] md:h-[420px]">
      {/* Soft warm stage */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[2rem]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(255,200,140,0.35), transparent 60%)",
        }}
      />

      {/* Back card — large portrait frame, tilted left */}
      <div
        className="absolute left-[2%] top-[8%] h-[78%] w-[58%] rounded-[1.1rem] border border-white/40 bg-gradient-to-br from-[#f3e6d2] to-[#d9c5a4] shadow-[0_30px_60px_-30px_rgba(60,40,20,0.35)] ring-1 ring-black/5"
        style={{ transform: "rotate(-5deg)" }}
      >
        <div className="absolute inset-3 rounded-[0.7rem] bg-gradient-to-br from-[#c9b48c] via-[#a98e6a] to-[#7d6346]" />
        <div className="absolute inset-3 rounded-[0.7rem] ring-1 ring-white/20" />
        {/* fake photo silhouette */}
        <div className="absolute inset-6 grid place-items-center">
          <div className="space-y-2 opacity-90">
            <div className="h-3 w-20 rounded-sm bg-white/40" />
            <div className="h-2 w-28 rounded-sm bg-white/25" />
            <div className="h-2 w-24 rounded-sm bg-white/25" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Chapter 02
        </div>
      </div>

      {/* Middle card — slightly tilted right */}
      <div
        className="absolute right-[2%] top-[18%] h-[68%] w-[52%] rounded-[1.1rem] border border-white/40 bg-gradient-to-br from-[#fbf3e6] to-[#e9d8b6] shadow-[0_30px_60px_-25px_rgba(60,40,20,0.4)] ring-1 ring-black/5"
        style={{ transform: "rotate(4deg)" }}
      >
        <div className="absolute inset-3 rounded-[0.7rem] bg-gradient-to-br from-[#3b2f24] via-[#5a4632] to-[#2a2218]" />
        <div className="absolute inset-3 rounded-[0.7rem] ring-1 ring-white/10" />
        <div className="absolute inset-6 grid place-items-center">
          <BookHeart className="size-12 text-white/30" />
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          1958
        </div>
      </div>

      {/* Front small card — title chip */}
      <div
        className="absolute bottom-[2%] left-[20%] w-[58%] rounded-[0.9rem] border border-white/60 bg-white/85 px-4 py-3 shadow-[0_20px_40px_-20px_rgba(60,40,20,0.4)] backdrop-blur"
        style={{ transform: "rotate(-2deg)" }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7a64]">
          Our Family
        </p>
        <p className={`mt-1 text-base text-[#1f2421] ${HERITAGE_SCRIPT_CLASS} text-[20px] leading-tight`}>
          Heritage, vol. 01
        </p>
      </div>

      {/* Sparkle accents */}
      <Sparkles
        className="absolute right-[6%] top-[2%] size-5 text-[#FF4D00]/70"
        strokeWidth={1.5}
      />
      <Sparkles
        className="absolute left-[4%] bottom-[6%] size-4 text-[#8a7a64]/70"
        strokeWidth={1.5}
      />
    </div>
  )
}

/* ---------- Book card: rich cover + meta + quiet actions ---------- */
function BookCard({
  book,
  readyCount,
  isLive,
  hasLiveBook,
  copied,
  onCopy,
  onOpen,
}: {
  book: LibraryBook
  readyCount: number
  isLive: boolean
  hasLiveBook: boolean
  copied: boolean
  onCopy: () => void
  onOpen: () => void
}) {
  return (
    <article className="group relative flex flex-col">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/40 focus:ring-offset-2 focus:ring-offset-[#FAFAF7] rounded-2xl"
      >
        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-black/[0.06] shadow-[0_24px_48px_-24px_rgba(60,40,20,0.35)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_36px_64px_-28px_rgba(60,40,20,0.45)]">
          {/* Cream cover base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5ebd7] via-[#ead8b6] to-[#c8a87a]" />

          {/* Subtle paper texture via noise gradient */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-40 mix-blend-multiply"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(120,80,40,0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(60,40,20,0.12), transparent 55%)",
            }}
          />

          {/* Spine accent */}
          <div className="absolute left-0 top-0 h-full w-[6px] bg-gradient-to-b from-[#8a6a44]/40 via-[#5a4226]/30 to-[#8a6a44]/40" />

          {/* Top status pill */}
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF4D00] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_4px_12px_-4px_rgba(255,77,0,0.6)]">
                <span className="relative flex size-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
                  <span className="relative size-1.5 rounded-full bg-white" />
                </span>
                Live
              </span>
            ) : book.status === "published" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f2421]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                Published
              </span>
            ) : book.status === "needs_attention" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                Needs attention
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f2421]/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                Draft
              </span>
            )}
          </div>

          {/* Center title — serif */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#5a4226]/70">
              Family Heritage
            </p>
            <p
              className={`mt-3 line-clamp-3 text-3xl font-normal leading-[1.1] text-[#3b2a18] md:text-4xl ${HERITAGE_SCRIPT_CLASS}`}
            >
              {book.title}
            </p>
            <div className="mt-4 h-px w-10 bg-[#5a4226]/30" />
            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#5a4226]/55">
              {readyCount} of 6–20 memories
            </p>
          </div>

          {/* Bottom date */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5a4226]/60">
            <span>Heritage v1</span>
            <span>
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(book.last_activity_at))}
            </span>
          </div>
        </div>
      </button>

      {/* Meta + actions */}
      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-[#1f2421]">
            {book.title}
          </h3>
          <p className="mt-0.5 text-xs text-[#1f2421]/50">
            {readyCount} prepared · Updated{" "}
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(book.last_activity_at))}
          </p>
          {hasLiveBook && !isLive ? (
            <p className="mt-1 text-[11px] font-medium text-amber-700">
              Awaiting unpublish of live book
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {book.shareUrl ? (
            <>
              <button
                type="button"
                onClick={onCopy}
                title="Copy private link"
                className="grid size-9 place-items-center rounded-full border border-black/[0.08] bg-white text-[#1f2421]/60 transition-colors hover:border-[#1f2421] hover:text-[#1f2421]"
              >
                {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
              </button>
              <a
                href={book.shareUrl}
                target="_blank"
                rel="noreferrer"
                title="Open published keepsake"
                className="grid size-9 place-items-center rounded-full border border-black/[0.08] bg-white text-[#1f2421]/60 transition-colors hover:border-[#1f2421] hover:text-[#1f2421]"
              >
                <ExternalLink className="size-4" />
              </a>
            </>
          ) : null}
          <button
            type="button"
            onClick={onOpen}
            className="ml-1 grid size-9 place-items-center rounded-full bg-[#1f2421] text-white transition-colors hover:bg-[#2d352f]"
            title="Open keepsake"
          >
            <ArrowUpRight className="size-4" />
          </button>
        </div>
      </div>
    </article>
  )
}
