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
  const hasAnyBook = books.length > 0
  const draftBook = hasAnyBook && !hasLiveBook ? books[0] : null

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
  const isSingle = books.length === 1

  return (
    <div className="relative min-h-screen">
      {/* Dotted background — standard dashboard sub-page pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:px-8">
        {/* Intro — centered, standard sub-page pattern */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#111111] md:text-4xl">
            {isEmpty ? "Family Heritage" : "Your Keepsakes"}
          </h1>
          <p className="mb-4 mt-1 text-lg leading-tight text-gray-600">
            {isEmpty
              ? "A private book for the people who made you. Choose the memories you love and the book assembles itself."
              : `${books.length} ${books.length === 1 ? "keepsake" : "keepsakes"}${hasLiveBook ? " · 1 live" : ""}`}
          </p>
        </div>

        {isEmpty ? (
          /* EMPTY STATE — a clean tool card inviting the user to create */
          <div className="mx-auto max-w-2xl">
            <div className="rounded-[1.5rem] border-4 border-gray-200 bg-white p-8 sm:p-12">
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6E6E6]">
                  <BookHeart className="size-7 text-[#111111]" />
                </div>
                <h2 className="text-xl font-bold text-[#111111] sm:text-2xl">
                  Compose your first book
                </h2>
                <p className="mt-2 max-w-md text-sm text-gray-500">
                  You will never face an empty canvas. Pick your favourite restored
                  memories and the book builds itself — pages, animations, and a
                  private link to share with the people who matter.
                </p>

                {entitlement ? (
                  <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-green-600">
                    <span className="size-1.5 rounded-full bg-green-500" />
                    Family Plan active
                  </span>
                ) : (
                  <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    <Sparkles className="size-3" />
                    Family Plan to publish
                  </span>
                )}

                <Button
                  onClick={createBook}
                  disabled={creating}
                  size="lg"
                  className="mt-6 h-12 rounded-full bg-[#FF4D00] px-7 text-[15px] font-semibold text-white hover:bg-[#e64500]"
                >
                  {creating ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 size-4" />
                  )}
                  Compose your first book
                </Button>
                <p className="mt-3 text-sm text-gray-500">Drafts are free</p>
              </div>
            </div>
          </div>
        ) : isSingle ? (
          /* SINGLE BOOK — full-width hero card, side-by-side like Restore Photo */
          <SingleBookHero
            book={books[0]}
            isLive={books[0].id === liveBookId}
            copied={copiedId === books[0].id}
            onCopy={async () => {
              if (!books[0].shareUrl) return
              await navigator.clipboard.writeText(
                new URL(books[0].shareUrl!, window.location.origin).toString()
              )
              setCopiedId(books[0].id)
              setTimeout(() => setCopiedId(null), 1800)
            }}
            onOpen={() => router.push(`/dashboard/memory-book/${books[0].id}`)}
          />
        ) : (
          <>
            {/* Actions row */}
            <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
              {hasLiveBook && liveBook ? (
                <Button
                  onClick={() => router.push(`/dashboard/memory-book/${liveBook.id}`)}
                  size="lg"
                  className="h-11 rounded-full bg-[#111111] px-6 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Open your live keepsake
                  <ArrowUpRight className="ml-1.5 size-4" />
                </Button>
              ) : null}
              {draftBook ? (
                <Button
                  onClick={() => router.push(`/dashboard/memory-book/${draftBook.id}`)}
                  size="lg"
                  className="h-11 rounded-full bg-[#FF4D00] px-6 text-sm font-semibold text-white hover:bg-[#e64500]"
                >
                  Continue your draft
                  <ArrowUpRight className="ml-1.5 size-4" />
                </Button>
              ) : null}
            </div>

            {/* LIBRARY — bento tray (standard dashboard pattern) */}
            <section className="bg-[#E6E6E6] p-4 rounded-[2rem]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          </>
        )}
      </main>
    </div>
  )
}

/* ---------- Single book hero — full-width side-by-side, like Restore Photo card ---------- */
function SingleBookHero({
  book,
  isLive,
  copied,
  onCopy,
  onOpen,
}: {
  book: LibraryBook
  isLive: boolean
  copied: boolean
  onCopy: () => void
  onOpen: () => void
}) {
  const readyCount = book.memory_book_assets.filter(
    (asset) => asset.status === "ready" && !asset.is_hidden
  ).length

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full flex-col gap-6 rounded-[1.5rem] bg-white p-5 text-left transition-transform duration-300 hover:scale-[1.01] focus:outline-none sm:flex-row sm:items-center"
    >
      {/* Left — details */}
      <div className="flex flex-1 flex-col gap-4 py-2">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E6E6]">
              <BookHeart className="size-5 text-[#111111]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111] sm:text-3xl">
              {book.title}
            </h2>
          </div>
          <p className="text-sm text-gray-500 sm:text-base">
            {readyCount} prepared memories · Updated{" "}
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(book.last_activity_at))}
          </p>
        </div>

        {/* Status + actions */}
        <div className="flex flex-wrap items-center gap-3">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF4D00] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
                <span className="relative size-1.5 rounded-full bg-white" />
              </span>
              Live
            </span>
          ) : book.status === "published" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              Published
            </span>
          ) : book.status === "needs_attention" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Needs attention
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              Draft
            </span>
          )}

          <div className="flex items-center gap-1.5">
            {book.shareUrl ? (
              <>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onCopy()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation()
                      onCopy()
                    }
                  }}
                  title="Copy private link"
                  className="grid size-9 cursor-pointer place-items-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-[#111111] hover:text-[#111111]"
                >
                  {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                </span>
                <a
                  href={book.shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Open published keepsake"
                  className="grid size-9 place-items-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-[#111111] hover:text-[#111111]"
                >
                  <ExternalLink className="size-4" />
                </a>
              </>
            ) : null}
          </div>

          <span className="flex items-center gap-1 font-bold text-[#FF4D00] group-hover:translate-x-1 transition-transform">
        Edit keepsake <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>

      {/* Right — cover preview */}
      <div className="w-full sm:w-[45%] shrink-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.2rem] border border-gray-100 shadow-inner bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <BookHeart className="size-6 text-gray-400" />
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Family Heritage
            </p>
            <p className="mt-2 line-clamp-3 text-xl font-bold text-[#111111]">
              {book.title}
            </p>
            <div className="mt-3 h-px w-10 bg-gray-200" />
            <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-gray-400">
              {readyCount} of 6–20 memories
            </p>
          </div>
        </div>
      </div>
    </button>
  )
}

/* ---------- Book card — white card on gray tray, standard bento pattern ---------- */
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
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full rounded-[1.5rem] bg-white p-5 text-left transition-transform duration-300 hover:scale-[1.01] focus:outline-none"
    >
      {/* Visual area — a "cover preview" inside a shadow-inner well */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.2rem] border border-gray-100 shadow-inner bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Status pill */}
        <div className="absolute right-3 top-3 z-10">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF4D00] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
                <span className="relative size-1.5 rounded-full bg-white" />
              </span>
              Live
            </span>
          ) : book.status === "published" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              Published
            </span>
          ) : book.status === "needs_attention" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Needs attention
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              Draft
            </span>
          )}
        </div>

        {/* Cover content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <BookHeart className="size-6 text-gray-400" />
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Family Heritage
          </p>
          <p className="mt-2 line-clamp-3 text-xl font-bold text-[#111111]">
            {book.title}
          </p>
          <div className="mt-3 h-px w-10 bg-gray-200" />
          <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-gray-400">
            {readyCount} of 6–20 memories
          </p>
        </div>

        {/* Bottom date footer */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
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

      {/* Meta row */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-[#111111]">
            {book.title}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
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
        <div className="flex shrink-0 items-center gap-1.5">
          {book.shareUrl ? (
            <>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onCopy()
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation()
                    onCopy()
                  }
                }}
                title="Copy private link"
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-[#111111] hover:text-[#111111]"
              >
                {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
              </span>
              <a
                href={book.shareUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Open published keepsake"
                className="grid size-9 place-items-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-[#111111] hover:text-[#111111]"
              >
                <ExternalLink className="size-4" />
              </a>
            </>
          ) : null}
          <span
            className="grid size-9 place-items-center rounded-full bg-[#111111] text-white"
            title="Open keepsake"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </button>
  )
}