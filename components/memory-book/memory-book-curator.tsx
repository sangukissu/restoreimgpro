"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  CircleAlert,
  Copy,
  ExternalLink,
  ImagePlus,
  Loader2,
  LockKeyhole,
  Music2,
  Play,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  WifiOff,
} from "lucide-react"
import posthog from "posthog-js"
import { createClient as createSupabaseClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { buildMemoryBookDocument, SPREAD_HEADINGS, SPREAD_BODIES } from "@/lib/memory-book/document"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type {
  CuratorMediaOption,
  MemoryBookAssetRecord,
  MemoryBookDocumentV1,
  MemoryBookRecord,
} from "@/lib/memory-book/types"
import {
  FamilyHeritageViewer,
  type MemoryBookAssetSource,
} from "./family-heritage-viewer"

type BookPatch = Partial<{
  title: string
  honoree: string
  periodLabel: string
  dedication: string
  notes: string
  preservationConsent: boolean
  downloadsEnabled: boolean
  musicEnabled: boolean
}>

type Reaction = {
  id: string
  reaction: string
  display_name: string
  note: string
  created_at: string
}

type SaveStatus = "saved" | "saving" | "offline" | "attention"

export function MemoryBookCurator({
  initialBook,
  initialAssets,
  initialAssetSources,
  mediaLibrary,
  reactions,
  entitlement,
  initialShareUrl,
}: {
  initialBook: MemoryBookRecord
  initialAssets: MemoryBookAssetRecord[]
  initialAssetSources: MemoryBookAssetSource[]
  mediaLibrary: CuratorMediaOption[]
  reactions: Reaction[]
  entitlement: { live_book_id: string | null; source: string; granted_at: string } | null
  initialShareUrl: string | null
}) {
  const router = useRouter()
  const [book, setBook] = useState(initialBook)
  const [assets, setAssets] = useState(initialAssets)
  const [step, setStep] = useState<"memories" | "story" | "review">(
    initialAssets.filter((asset) => asset.status === "ready" && !asset.is_hidden)
      .length >= 6
      ? "story"
      : "memories"
  )
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved")
  const [workingId, setWorkingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState(initialShareUrl)
  const [copied, setCopied] = useState(false)
  const [pin, setPin] = useState("")
  const [error, setError] = useState<string | null>(null)

  const bookRef = useRef(book)
  const pendingPatchRef = useRef<BookPatch>({})
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savingRef = useRef(false)
  const outboxKey = `memory-book-outbox:${book.id}`

  useEffect(() => {
    bookRef.current = book
  }, [book])

  const applyPatchLocally = useCallback((patch: BookPatch) => {
    setBook((current) => ({
      ...current,
      title: patch.title ?? current.title,
      honoree: patch.honoree ?? current.honoree,
      period_label: patch.periodLabel ?? current.period_label,
      dedication: patch.dedication ?? current.dedication,
      notes: patch.notes ?? current.notes,
      preservation_consent:
        patch.preservationConsent ?? current.preservation_consent,
      downloads_enabled: patch.downloadsEnabled ?? current.downloads_enabled,
      music_enabled: patch.musicEnabled ?? current.music_enabled,
    }))
  }, [])

  const flushBookPatch = useCallback(
    async (keepalive = false) => {
      if (savingRef.current) return
      const patch = pendingPatchRef.current
      if (!Object.keys(patch).length) return

      pendingPatchRef.current = {}
      savingRef.current = true
      setSaveStatus(navigator.onLine ? "saving" : "offline")
      localStorage.setItem(outboxKey, JSON.stringify(patch))

      try {
        const response = await fetch(`/api/memory-books/${book.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          keepalive,
          body: JSON.stringify({
            expectedVersion: bookRef.current.draft_version,
            ...patch,
          }),
        })
        const result = await response.json()
        if (response.status === 409) {
          const latestResponse = await fetch(`/api/memory-books/${book.id}`)
          const latest = await latestResponse.json()
          if (latest.book) {
            setBook(latest.book)
            bookRef.current = latest.book
            applyPatchLocally(patch)
            pendingPatchRef.current = {
              ...patch,
              ...pendingPatchRef.current,
            }
            setTimeout(() => void flushBookPatch(), 0)
            return
          }
        }
        if (!response.ok) throw new Error(result.error || "Unable to save draft")

        setBook(result.book)
        bookRef.current = result.book
        localStorage.removeItem(outboxKey)
        setSaveStatus("saved")
      } catch {
        pendingPatchRef.current = {
          ...patch,
          ...pendingPatchRef.current,
        }
        setSaveStatus(navigator.onLine ? "attention" : "offline")
      } finally {
        savingRef.current = false
      }
    },
    [applyPatchLocally, book.id, outboxKey]
  )

  const queueBookPatch = useCallback(
    (patch: BookPatch) => {
      applyPatchLocally(patch)
      pendingPatchRef.current = {
        ...pendingPatchRef.current,
        ...patch,
      }
      localStorage.setItem(outboxKey, JSON.stringify(pendingPatchRef.current))
      setSaveStatus(navigator.onLine ? "saving" : "offline")
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => void flushBookPatch(), 700)
    },
    [applyPatchLocally, flushBookPatch, outboxKey]
  )

  const refreshBook = useCallback(async () => {
    const response = await fetch(`/api/memory-books/${book.id}`)
    if (!response.ok) return
    const result = await response.json()
    setBook(result.book)
    bookRef.current = result.book
    setAssets(result.assets)
  }, [book.id])

  useEffect(() => {
    const stored = localStorage.getItem(outboxKey)
    if (stored) {
      try {
        const patch = JSON.parse(stored) as BookPatch
        pendingPatchRef.current = patch
        applyPatchLocally(patch)
        void flushBookPatch()
      } catch {
        localStorage.removeItem(outboxKey)
      }
    }

    const handleOnline = () => void flushBookPatch()
    const handleOffline = () => setSaveStatus("offline")
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") void flushBookPatch(true)
    }
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    document.addEventListener("visibilitychange", handleVisibility)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      document.removeEventListener("visibilitychange", handleVisibility)
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [applyPatchLocally, flushBookPatch, outboxKey])

  useEffect(() => {
    const supabase = createSupabaseClient()
    const channel = supabase
      .channel(`memory-book-${book.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "memory_book_assets",
          filter: `book_id=eq.${book.id}`,
        },
        () => void refreshBook()
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "memory_books",
          filter: `id=eq.${book.id}`,
        },
        () => {
          if (!Object.keys(pendingPatchRef.current).length) void refreshBook()
        }
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [book.id, refreshBook])

  const readyAssets = useMemo(
    () =>
      assets
        .filter((asset) => asset.status === "ready" && !asset.is_hidden)
        .sort((a, b) => a.position - b.position),
    [assets]
  )
  const selectedSourceKeys = useMemo(
    () =>
      new Set(
        assets
          .filter((asset) => asset.source_id)
          .map((asset) => `${asset.source_type}:${asset.source_id}`)
      ),
    [assets]
  )
  const previewDocument = useMemo<MemoryBookDocumentV1 | null>(() => {
    try {
      return buildMemoryBookDocument(book, assets)
    } catch {
      return null
    }
  }, [assets, book])
  const assetSources = useMemo(
    () => buildOwnerAssetSources(assets, initialAssetSources),
    [assets, initialAssetSources]
  )

  const toggleLibraryAsset = async (option: CuratorMediaOption) => {
    setError(null)
    await flushBookPatch()
    const existing = assets.find(
      (asset) =>
        asset.source_type === option.sourceType && asset.source_id === option.id
    )
    setWorkingId(option.id)
    try {
      const response = await fetch(
        existing
          ? `/api/memory-books/${book.id}/assets/${existing.id}`
          : `/api/memory-books/${book.id}/assets`,
        {
          method: existing ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: existing
            ? undefined
            : JSON.stringify({
                sourceType: option.sourceType,
                sourceId: option.id,
              }),
        }
      )
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to update memories")
      await refreshBook()
      posthog.capture("memory_book_asset_selection_changed", {
        action: existing ? "removed" : "added",
        source_type: option.sourceType,
        media_type: option.mediaType,
      })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update memories")
    } finally {
      setWorkingId(null)
    }
  }

  const uploadPhotos = async (files: FileList | null) => {
    if (!files?.length) return
    await flushBookPatch()
    setUploading(true)
    setError(null)
    try {
      for (const file of Array.from(files)) {
        const createResponse = await fetch(
          `/api/memory-books/${book.id}/uploads`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
              size: file.size,
            }),
          }
        )
        const upload = await createResponse.json()
        if (!createResponse.ok) throw new Error(upload.error || "Upload failed")

        const putResponse = await fetch(upload.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        })
        if (!putResponse.ok) throw new Error(`Upload failed for ${file.name}`)

        const completeResponse = await fetch(
          `/api/memory-books/${book.id}/uploads/complete`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assetId: upload.assetId, key: upload.key }),
          }
        )
        const complete = await completeResponse.json()
        if (!completeResponse.ok) {
          throw new Error(complete.error || "Unable to finish upload")
        }
      }
      await refreshBook()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to upload photos")
    } finally {
      setUploading(false)
    }
  }

  const updateAsset = async (
    asset: MemoryBookAssetRecord,
    patch: {
      caption?: string
      featured?: boolean
      hidden?: boolean
      heading?: string
      body?: string
    }
  ) => {
    await flushBookPatch()
    const response = await fetch(
      `/api/memory-books/${book.id}/assets/${asset.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedVersion: bookRef.current.draft_version,
          ...patch,
        }),
      }
    )
    const result = await response.json()
    if (!response.ok) {
      setError(result.error || "Unable to update memory")
      await refreshBook()
      return
    }
    setBook(result.book)
    bookRef.current = result.book
    setAssets((current) =>
      current.map((item) => (item.id === result.asset.id ? result.asset : item))
    )
  }

  const moveAsset = async (assetId: string, direction: -1 | 1) => {
    await flushBookPatch()
    const ordered = [...assets].sort((a, b) => a.position - b.position)
    const index = ordered.findIndex((asset) => asset.id === assetId)
    const target = index + direction
    if (index < 0 || target < 0 || target >= ordered.length) return
    ;[ordered[index], ordered[target]] = [ordered[target], ordered[index]]

    const response = await fetch(
      `/api/memory-books/${book.id}/assets/reorder`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedVersion: bookRef.current.draft_version,
          assetIds: ordered.map((asset) => asset.id),
        }),
      }
    )
    const result = await response.json()
    if (!response.ok) {
      setError(result.error || "Unable to reorder memories")
      await refreshBook()
      return
    }
    setBook(result.book)
    bookRef.current = result.book
    setAssets(result.assets)
  }



  const publishBook = async () => {
    await flushBookPatch()
    setPublishing(true)
    setError(null)
    try {
      const response = await fetch(`/api/memory-books/${book.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedVersion: bookRef.current.draft_version,
          preservationConsent: true,
          downloadsEnabled: bookRef.current.downloads_enabled,
          musicEnabled: bookRef.current.music_enabled,
          pin,
        }),
      })
      const result = await response.json()
      if (response.status === 402) {
        window.dispatchEvent(new CustomEvent("open-payment-modal"))
        throw new Error("A completed BringBack purchase is required to publish")
      }
      if (!response.ok) throw new Error(result.error || "Unable to publish")

      setShareUrl(result.shareUrl)
      setPublishOpen(false)
      posthog.capture("memory_book_published", {
        revision_number: result.revisionNumber,
        asset_count: readyAssets.length,
        pin_enabled: Boolean(pin),
      })
      await refreshBook()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to publish")
    } finally {
      setPublishing(false)
    }
  }

  const unpublishBook = async () => {
    const response = await fetch(`/api/memory-books/${book.id}/unpublish`, {
      method: "POST",
    })
    if (response.ok) {
      setShareUrl(null)
      await refreshBook()
    }
  }

  const regenerateLink = async () => {
    const response = await fetch(`/api/memory-books/${book.id}/share-link`, {
      method: "POST",
    })
    const result = await response.json()
    if (response.ok) setShareUrl(result.shareUrl)
    else setError(result.error || "Unable to regenerate link")
  }

  const steps = [
    { id: "memories" as const, label: "1. Memories" },
    { id: "story" as const, label: "2. Story" },
    { id: "review" as const, label: "3. Review" },
  ]

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#f7f7f5]">
      <header className="sticky top-0 z-30 border-b border-black/8 bg-white/94 px-4 py-3 backdrop-blur-xl md:px-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/memory-book")}>
              <ArrowLeft />
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{book.title}</p>
              <SaveIndicator status={saveStatus} />
            </div>
          </div>
          <div className="hidden rounded-md border border-black/8 bg-[#f1f2ef] p-1 sm:flex">
            {steps.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStep(item.id)}
                className={[
                  "rounded px-3 py-1.5 text-xs font-semibold transition-colors",
                  step === item.id
                    ? "bg-white text-black shadow-sm"
                    : "text-black/52 hover:text-black",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Button
            onClick={() => setPublishOpen(true)}
            disabled={!previewDocument || readyAssets.length < 6}
            className="bg-[#1f2c27] text-white hover:bg-[#304139]"
          >
            {book.status === "published" ? "Republish" : "Publish"}
            <ArrowRight />
          </Button>
        </div>
      </header>

      {error ? (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-800">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <CircleAlert className="size-4 shrink-0" />
            {error}
            <button className="ml-auto font-semibold" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      {step === "memories" ? (
        <MemorySelectionStep
          book={book}
          assets={assets}
          mediaLibrary={mediaLibrary}
          selectedSourceKeys={selectedSourceKeys}
          workingId={workingId}
          uploading={uploading}
          onToggle={toggleLibraryAsset}
          onUpload={uploadPhotos}
          onContinue={() => setStep("story")}
        />
      ) : null}

      {step === "story" ? (
        <StoryStep
          book={book}
          assets={assets}
          assetSources={assetSources}
          onPatch={queueBookPatch}
          onAssetUpdate={updateAsset}
          onMove={moveAsset}
          onBack={() => setStep("memories")}
          onContinue={() => setStep("review")}
        />
      ) : null}

      {step === "review" ? (
        <ReviewStep
          book={book}
          document={previewDocument}
          assetSources={assetSources}
          shareUrl={shareUrl}
          copied={copied}
          reactions={reactions}
          onCopy={async () => {
            if (!shareUrl) return
            await navigator.clipboard.writeText(
              new URL(shareUrl, window.location.origin).toString()
            )
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
          }}
          onRegenerate={regenerateLink}
          onUnpublish={unpublishBook}
          onBack={() => setStep("story")}
          onPublish={() => setPublishOpen(true)}
        />
      ) : null}

      <PublishDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        book={book}
        entitlement={entitlement}
        readyCount={readyAssets.length}
        pin={pin}
        publishing={publishing}
        onPinChange={setPin}
        onPatch={queueBookPatch}
        onPublish={publishBook}
      />
    </main>
  )
}

function MemorySelectionStep({
  book,
  assets,
  mediaLibrary,
  selectedSourceKeys,
  workingId,
  uploading,
  onToggle,
  onUpload,
  onContinue,
}: {
  book: MemoryBookRecord
  assets: MemoryBookAssetRecord[]
  mediaLibrary: CuratorMediaOption[]
  selectedSourceKeys: Set<string>
  workingId: string | null
  uploading: boolean
  onToggle: (option: CuratorMediaOption) => void
  onUpload: (files: FileList | null) => void
  onContinue: () => void
}) {
  const selectedCount = assets.filter((asset) => !asset.is_hidden).length
  const readyCount = assets.filter(
    (asset) => asset.status === "ready" && !asset.is_hidden
  ).length

  return (
    <section className="mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-10">
      <div className="flex flex-col gap-4 border-b border-black/8 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#47736c]">Choose 6–12 memories</p>
          <h1 className="mt-1 text-2xl font-bold">Curate what belongs together.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
            BringBack will preserve selected media inside this book. Removing the
            original later will not break the keepsake.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">
            {readyCount} prepared <span className="text-black/35">/ {selectedCount} selected</span>
          </span>
          <Button
            onClick={onContinue}
            disabled={readyCount < 6 || readyCount > 12}
            className="bg-[#1f2c27] text-white"
          >
            Add the story
            <ArrowRight />
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {mediaLibrary.map((option) => {
          const selected = selectedSourceKeys.has(
            `${option.sourceType}:${option.id}`
          )
          return (
            <button
              key={`${option.sourceType}:${option.id}`}
              type="button"
              onClick={() => onToggle(option)}
              disabled={workingId === option.id || (!selected && selectedCount >= 12)}
              className={[
                "group relative aspect-[4/5] overflow-hidden rounded-md border bg-white text-left shadow-sm outline-none transition",
                selected
                  ? "border-[#47736c] ring-2 ring-[#47736c]/25"
                  : "border-black/8 hover:border-black/20",
              ].join(" ")}
            >
              {option.posterUrl || option.mediaType === "image" ? (
                <img
                  src={option.posterUrl || option.previewUrl}
                  alt={option.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={option.previewUrl}
                  className="h-full w-full object-cover"
                  muted
                  preload="metadata"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 to-transparent px-3 pb-3 pt-10 text-white">
                <span className="block truncate text-sm font-semibold">{option.title}</span>
                <span className="mt-0.5 block text-[11px] text-white/72">
                  {new Date(option.createdAt).toLocaleDateString()}
                </span>
              </span>
              <span
                className={[
                  "absolute right-2 top-2 grid size-7 place-items-center rounded-full border",
                  selected
                    ? "border-[#47736c] bg-[#47736c] text-white"
                    : "border-white/70 bg-black/18 text-white",
                ].join(" ")}
              >
                {workingId === option.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : selected ? (
                  <Check className="size-4" />
                ) : (
                  <ImagePlus className="size-4" />
                )}
              </span>
              {option.mediaType === "video" ? (
                <span className="absolute left-2 top-2 grid size-7 place-items-center rounded-full bg-black/55 text-white">
                  <Play className="size-3.5" fill="currentColor" />
                </span>
              ) : null}
            </button>
          )
        })}

        <label className="grid aspect-[4/5] cursor-pointer place-items-center rounded-md border border-dashed border-black/20 bg-white text-center transition hover:border-[#47736c] hover:bg-[#f7faf8]">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            disabled={uploading || selectedCount >= 12}
            onChange={(event) => {
              void onUpload(event.target.files)
              event.target.value = ""
            }}
          />
          <span className="px-4">
            {uploading ? (
              <Loader2 className="mx-auto size-6 animate-spin text-[#47736c]" />
            ) : (
              <Upload className="mx-auto size-6 text-[#47736c]" />
            )}
            <span className="mt-3 block text-sm font-semibold">Add family photos</span>
            <span className="mt-1 block text-xs leading-5 text-black/45">
              JPG, PNG, or WebP up to 12MB
            </span>
          </span>
        </label>
      </div>

      {!mediaLibrary.length && !assets.length ? (
        <div className="mt-8 border-y border-black/8 bg-white px-6 py-12 text-center">
          <ImagePlus className="mx-auto size-8 text-[#47736c]" />
          <p className="mt-3 font-semibold">Upload the photographs you want to preserve.</p>
          <p className="mt-1 text-sm text-black/50">
            Restored BringBack media will appear here automatically.
          </p>
        </div>
      ) : null}

      <p className="sr-only">Editing {book.title}</p>
    </section>
  )
}

function getWordCount(text: string): number {
  if (!text) return 0
  const clean = text.trim()
  if (!clean) return 0
  return clean.split(/\s+/).filter(Boolean).length
}

function limitWordsForEditing(text: string, maxWords: number): string {
  if (!text) return ""
  const tokens = text.split(/(\s+)/)
  let wordCount = 0
  let result = ""
  for (const token of tokens) {
    if (token === "") continue
    const isWhitespace = /^\s+$/.test(token)
    if (!isWhitespace) {
      if (wordCount >= maxWords) {
        break
      }
      wordCount++
    }
    result += token
  }
  return result
}

function WordLimitedTextarea({
  defaultValue,
  maxWords,
  placeholder,
  className = "",
  onSave,
}: {
  defaultValue: string
  maxWords: number
  placeholder?: string
  className?: string
  onSave: (value: string) => void
}) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const wordCount = getWordCount(value)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    const limited = limitWordsForEditing(val, maxWords)
    setValue(limited)
  }

  const handleBlur = () => {
    if (value !== defaultValue) {
      onSave(value)
    }
  }

  return (
    <Field
      label="Page story / note"
      hint={
        <span className={wordCount > maxWords ? "text-red-500 font-bold" : ""}>
          {wordCount}/{maxWords} words
        </span>
      }
    >
      <Textarea
        value={value}
        maxLength={420}
        placeholder={placeholder}
        className={`${className} min-h-20 ${
          wordCount > maxWords
            ? "border-red-500 focus-visible:ring-red-500 bg-red-50/20"
            : ""
        }`}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </Field>
  )
}

function WordLimitedInput({
  defaultValue,
  maxWords,
  placeholder,
  className = "",
  onSave,
  originalLabel,
}: {
  defaultValue: string
  maxWords: number
  placeholder?: string
  className?: string
  onSave: (value: string) => void
  originalLabel: string
}) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const wordCount = getWordCount(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const limited = limitWordsForEditing(val, maxWords)
    setValue(limited)
  }

  const handleBlur = () => {
    if (value !== defaultValue) {
      onSave(value)
    }
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <p className="truncate text-sm font-semibold">{originalLabel}</p>
        <span className={`text-[10px] ${wordCount > maxWords ? "text-red-500 font-bold" : "text-black/38"}`}>
          {wordCount}/{maxWords} words
        </span>
      </div>
      <Input
        value={value}
        maxLength={280}
        className={`${className} ${
          wordCount > maxWords ? "border-red-500 focus-visible:ring-red-500 bg-red-50/20" : ""
        }`}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  )
}


function StoryStep({
  book,
  assets,
  assetSources,
  onPatch,
  onAssetUpdate,
  onMove,
  onBack,
  onContinue,
}: {
  book: MemoryBookRecord
  assets: MemoryBookAssetRecord[]
  assetSources: MemoryBookAssetSource[]
  onPatch: (patch: BookPatch) => void
  onAssetUpdate: (
    asset: MemoryBookAssetRecord,
    patch: { caption?: string; featured?: boolean; hidden?: boolean; heading?: string; body?: string }
  ) => Promise<void>
  onMove: (assetId: string, direction: -1 | 1) => Promise<void>
  onBack: () => void
  onContinue: () => void
}) {
  const sourceMap = new Map(assetSources.map((source) => [source.id, source]))
  const ordered = [...assets].sort((a, b) => a.position - b.position)
  const visibleAssets = assets
    .filter((asset) => asset.status === "ready" && !asset.is_hidden)
    .sort((a, b) => a.position - b.position)
    .slice(0, 12)
  const numSpreads = Math.ceil(visibleAssets.length / 2)

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-5 py-7 md:px-8 md:py-10 lg:grid-cols-[minmax(0,420px)_1fr]">
      <div>
        <p className="text-sm font-semibold text-[#47736c]">Give it meaning</p>
        <h1 className="mt-1 text-2xl font-bold">A little context goes a long way.</h1>
        <p className="mt-2 text-sm leading-6 text-black/55">
          Write naturally. BringBack uses your words without inventing family facts.
        </p>

        <Accordion type="single" collapsible defaultValue="basic-details" className="mt-6 border-y border-black/8 divide-y divide-black/8">
          <AccordionItem value="basic-details" className="border-none py-1">
            <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#47736c] hover:no-underline [&[data-state=open]]:pb-2">
              Book Cover & Dedication Details
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pt-3 pb-6">
              <Field label="Book title" hint={`${book.title.length}/90`}>
                <Input
                  value={book.title}
                  maxLength={90}
                  onChange={(event) => onPatch({ title: event.target.value })}
                />
              </Field>
              <Field label="Who is this for?">
                <Input
                  value={book.honoree}
                  maxLength={100}
                  placeholder="The Sharma family, Grandma Rose…"
                  onChange={(event) => onPatch({ honoree: event.target.value })}
                />
              </Field>
              <Field label="Cover bottom text">
                <Input
                  value={book.period_label}
                  maxLength={80}
                  placeholder="Leave blank to hide. Examples: 1980–present, A family archive..."
                  onChange={(event) => onPatch({ periodLabel: event.target.value })}
                />
              </Field>
              <Field label="Dedication" hint={`${book.dedication.length}/600`}>
                <Textarea
                  value={book.dedication}
                  maxLength={600}
                  className="min-h-28"
                  placeholder="For the people who gave us our beginning…"
                  onChange={(event) => onPatch({ dedication: event.target.value })}
                />
              </Field>
              <Field
                label="A note for the opening spread"
                hint={
                  <span>
                    {getWordCount(book.notes)}/40 words
                  </span>
                }
              >
                <Textarea
                  value={book.notes}
                  maxLength={420}
                  className="min-h-24"
                  placeholder="Share only what you know. This remains editable."
                  onChange={(event) => {
                    const val = event.target.value
                    const limited = limitWordsForEditing(val, 40)
                    onPatch({ notes: limited })
                  }}
                />
              </Field>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="custom-pages" className="border-none py-1">
            <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#47736c] hover:no-underline [&[data-state=open]]:pb-2">
              Customize Page Titles & Stories
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-3 pb-6">
              <p className="text-xs text-black/45">
                Customize the titles and descriptions printed on the pages of your keepsake.
              </p>
              <div className="divide-y divide-black/8 mt-4">
                {Array.from({ length: numSpreads }).map((_, idx) => {
                  const firstAsset = visibleAssets[idx * 2]
                  if (!firstAsset) return null

                  const customHeading = (firstAsset.metadata?.customHeading as string) || ""
                  const customBody = (firstAsset.metadata?.customBody as string) || ""
                  const photosLabel = [
                    firstAsset.original_label,
                    visibleAssets[idx * 2 + 1]?.original_label,
                  ]
                    .filter(Boolean)
                    .join(", ")

                  const headingCount = customHeading.length

                  return (
                    <div
                      key={idx}
                      className="py-5 first:pt-2 last:pb-2 space-y-4"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#47736c] uppercase tracking-wide">
                          Page {idx * 2 + 1} & {idx * 2 + 2}
                        </span>
                        <span className="text-[10px] text-black/40 truncate max-w-[220px]">
                          ({photosLabel})
                        </span>
                      </div>

                      <Field label="Page title" hint={`${headingCount}/80`}>
                        <Input
                          key={`${firstAsset.id}:heading:${customHeading}`}
                          defaultValue={customHeading}
                          placeholder={`Family memory ${idx + 1}`}
                          maxLength={80}
                          onBlur={(event) => {
                            if (event.target.value !== customHeading) {
                              void onAssetUpdate(firstAsset, { heading: event.target.value })
                            }
                          }}
                        />
                      </Field>

                      {idx > 0 ? (
                        <WordLimitedTextarea
                          key={`${firstAsset.id}:body`}
                          defaultValue={customBody}
                          maxWords={40}
                          onSave={(val) => {
                            void onAssetUpdate(firstAsset, { body: val })
                          }}
                        />
                      ) : (
                        <p className="text-[11px] text-black/45 leading-relaxed bg-[#f2f2ef] p-2.5 rounded-sm">
                          ℹ️ The story body for this first page is set via the **"A note for the opening spread"** field inside the cover details section.
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <div className="flex items-end justify-between border-b border-black/8 pb-4">
          <div>
            <p className="text-sm font-semibold">Memory order</p>
            <p className="mt-1 text-xs text-black/48">
              BringBack pairs consecutive memories into each right-hand page.
            </p>
          </div>
          <span className="text-xs font-semibold text-black/45">{ordered.length} memories</span>
        </div>

        <div className="mt-4 space-y-3">
          {ordered.map((asset, index) => {
            const source = sourceMap.get(asset.id)
            const captionCount = getWordCount(asset.caption)
            return (
              <article
                key={asset.id}
                className="flex items-start gap-4 rounded-lg border border-black/5 bg-white p-3 shadow-sm"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded bg-[#f4f1ea] border border-black/5">
                  {source?.poster || (source?.mediaType === "image" && source.src) ? (
                    <img
                      src={source.poster || source.src}
                      alt={asset.alt_text}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-[#47736c]">
                      <Play fill="currentColor" />
                    </div>
                  )}
                  {asset.status !== "ready" ? (
                    <span className="absolute inset-0 grid place-items-center bg-white/78">
                      {asset.status === "failed" ? (
                        <CircleAlert className="text-red-600" />
                      ) : (
                        <Loader2 className="animate-spin text-[#47736c]" />
                      )}
                    </span>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <WordLimitedInput
                    key={`${asset.id}:${asset.caption}`}
                    defaultValue={asset.caption}
                    maxWords={15}
                    placeholder="Add a short caption"
                    originalLabel={asset.original_label}
                    onSave={(val) => {
                      void onAssetUpdate(asset, { caption: val })
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={index === 0}
                    title="Move earlier"
                    onClick={() => onMove(asset.id, -1)}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={index === ordered.length - 1}
                    title="Move later"
                    onClick={() => onMove(asset.id, 1)}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Remove from book"
                    onClick={() => void onAssetUpdate(asset, { hidden: true })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-7 flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft />
            Memories
          </Button>
          <Button onClick={onContinue} className="bg-[#1f2c27] text-white">
            Review book
            <BookOpen />
          </Button>
        </div>
      </div>
    </section>
  )
}

function ReviewStep({
  book,
  document,
  assetSources,
  shareUrl,
  copied,
  reactions,
  onCopy,
  onRegenerate,
  onUnpublish,
  onBack,
  onPublish,
}: {
  book: MemoryBookRecord
  document: MemoryBookDocumentV1 | null
  assetSources: MemoryBookAssetSource[]
  shareUrl: string | null
  copied: boolean
  reactions: Reaction[]
  onCopy: () => void
  onRegenerate: () => void
  onUnpublish: () => void
  onBack: () => void
  onPublish: () => void
}) {
  return (
    <section>
      {document ? (
        <FamilyHeritageViewer
          document={document}
          assetSources={assetSources}
          onCompleted={() => posthog.capture("memory_book_preview_completed")}
        />
      ) : (
        <div className="grid min-h-[560px] place-items-center px-6 text-center">
          <div>
            <CircleAlert className="mx-auto size-8 text-amber-600" />
            <h2 className="mt-4 text-xl font-bold">The book needs 6 prepared memories.</h2>
            <Button className="mt-5" onClick={onBack}>
              Return to curation
            </Button>
          </div>
        </div>
      )}

      <div className="border-t border-black/8 bg-white px-5 py-7 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-bold">
                {shareUrl ? "Your private keepsake is live." : "Ready when it feels right."}
              </p>
              <p className="mt-1 text-sm text-black/50">
                Published guests see the last complete revision, never unfinished edits.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft />
                Edit story
              </Button>
              {shareUrl ? (
                <>
                  <Button variant="outline" onClick={onCopy}>
                    {copied ? <Check /> : <Copy />}
                    {copied ? "Copied" : "Copy link"}
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={shareUrl} target="_blank" rel="noreferrer">
                      <ExternalLink />
                      Open
                    </a>
                  </Button>
                  <Button variant="outline" onClick={onRegenerate}>
                    <RefreshCw />
                    New link
                  </Button>
                  <Button variant="outline" onClick={onUnpublish}>
                    Unpublish
                  </Button>
                </>
              ) : (
                <Button onClick={onPublish} className="bg-[#1f2c27] text-white">
                  <ShieldCheck />
                  Publish privately
                </Button>
              )}
            </div>
          </div>

          {reactions.length ? (
            <div className="mt-8 border-t border-black/8 pt-6">
              <h2 className="text-sm font-bold">Private reactions</h2>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {reactions.map((reaction) => (
                  <div key={reaction.id} className="rounded-md bg-[#f5f5f2] px-4 py-3">
                    <p className="text-sm font-semibold">
                      {reaction.display_name || "Someone you shared it with"} ·{" "}
                      {reaction.reaction.replace("_", " ")}
                    </p>
                    {reaction.note ? (
                      <p className="mt-1 text-sm leading-5 text-black/58">{reaction.note}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <p className="sr-only">{book.title}</p>
    </section>
  )
}

function PublishDialog({
  open,
  onOpenChange,
  book,
  entitlement,
  readyCount,
  pin,
  publishing,
  onPinChange,
  onPatch,
  onPublish,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  book: MemoryBookRecord
  entitlement: { live_book_id: string | null } | null
  readyCount: number
  pin: string
  publishing: boolean
  onPinChange: (value: string) => void
  onPatch: (patch: BookPatch) => void
  onPublish: () => void
}) {
  const entitlementAvailable =
    Boolean(entitlement) &&
    (!entitlement?.live_book_id || entitlement.live_book_id === book.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0">
        <DialogHeader className="border-b border-black/8 px-6 py-5">
          <DialogTitle>Publish this private keepsake</DialogTitle>
          <DialogDescription>
            Review how this book is preserved and shared before creating the link.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 px-6 py-5">
          <SettingRow
            icon={<ShieldCheck />}
            title="Preserve selected memories"
            description="Keep book-owned copies until you delete the keepsake or close your account."
          >
            <Switch
              checked={book.preservation_consent}
              onCheckedChange={(checked) =>
                onPatch({ preservationConsent: checked })
              }
            />
          </SettingRow>
          <SettingRow
            icon={<Music2 />}
            title="Optional nostalgic music"
            description="Recipients choose whether to play it. Music never autoplays."
          >
            <Switch
              checked={book.music_enabled}
              onCheckedChange={(checked) => onPatch({ musicEnabled: checked })}
            />
          </SettingRow>
          <SettingRow
            icon={<ImagePlus />}
            title="Recipient downloads"
            description="Off by default. You can always download your own preserved media."
          >
            <Switch
              checked={book.downloads_enabled}
              onCheckedChange={(checked) =>
                onPatch({ downloadsEnabled: checked })
              }
            />
          </SettingRow>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <LockKeyhole className="size-4 text-[#47736c]" />
              Optional 4–8 digit PIN
            </label>
            <Input
              value={pin}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              className="mt-2"
              placeholder="Leave empty for link-only access"
              onChange={(event) =>
                onPinChange(event.target.value.replace(/\D/g, "").slice(0, 8))
              }
            />
          </div>
          <div
            className={[
              "rounded-md border px-4 py-3 text-sm",
              entitlementAvailable
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800",
            ].join(" ")}
          >
            {entitlementAvailable
              ? "Publishing is included with your BringBack purchase."
              : entitlement?.live_book_id
                ? "Another keepsake is currently live. Unpublish it before publishing this one."
                : "You can preview the complete book. Any BringBack purchase unlocks publishing."}
          </div>
        </div>
        <DialogFooter className="border-t border-black/8 px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep editing
          </Button>
          <Button
            onClick={onPublish}
            disabled={
              publishing ||
              readyCount < 6 ||
              readyCount > 12 ||
              !book.preservation_consent ||
              (pin.length > 0 && pin.length < 4) ||
              Boolean(entitlement?.live_book_id && entitlement.live_book_id !== book.id)
            }
            className="bg-[#1f2c27] text-white"
          >
            {publishing ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
            {entitlement ? "Publish private link" : "Unlock publishing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SettingRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#47736c] [&>svg]:size-4">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-black/48">{description}</p>
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-sm font-semibold">
        {label}
        {hint ? <span className="text-xs font-normal text-black/38">{hint}</span> : null}
      </span>
      {children}
    </label>
  )
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  const content = {
    saved: { icon: <Save />, label: "Saved" },
    saving: { icon: <Loader2 className="animate-spin" />, label: "Saving" },
    offline: { icon: <WifiOff />, label: "Offline · changes queued" },
    attention: { icon: <CircleAlert />, label: "Needs attention" },
  }[status]

  return (
    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-black/45 [&>svg]:size-3">
      {content.icon}
      {content.label}
    </span>
  )
}

function buildOwnerAssetSources(
  assets: MemoryBookAssetRecord[],
  initial: MemoryBookAssetSource[]
) {
  const initialMap = new Map(initial.map((source) => [source.id, source]))
  return assets.map((asset) => {
    const fallback = initialMap.get(asset.id)
    const locator = asset.preserved_key || asset.source_locator || ""
    const src = ownerLocatorUrl(locator, asset.media_type)
    const poster =
      asset.poster_key
        ? ownerLocatorUrl(asset.poster_key, "image")
        : typeof asset.metadata.posterLocator === "string"
          ? asset.metadata.posterLocator
          : fallback?.poster

    return {
      id: asset.id,
      mediaType: asset.media_type,
      src: src || fallback?.src || "",
      poster,
      downloadUrl: asset.preserved_key
        ? ownerLocatorUrl(asset.preserved_key, asset.media_type)
        : fallback?.downloadUrl,
    }
  })
}

function ownerLocatorUrl(locator: string, mediaType: "image" | "video") {
  if (!locator) return ""
  if (
    locator.startsWith("images/") ||
    (locator.startsWith("memory-books/") && mediaType === "image")
  ) {
    return `/api/image-proxy?key=${encodeURIComponent(locator)}`
  }
  if (
    locator.startsWith("videos/") ||
    (locator.startsWith("memory-books/") && mediaType === "video")
  ) {
    return `/api/video-proxy?key=${encodeURIComponent(locator)}`
  }
  return locator
}
