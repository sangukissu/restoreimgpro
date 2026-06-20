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
  RotateCcw,
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
import { buildMemoryBookDocument } from "@/lib/memory-book/document"
import { parseMemoryBookDraft, reconcileMemoryBookDraft } from "@/lib/memory-book/draft"
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
  MemoryBookDraftDocument,
  MemoryBookRecord,
} from "@/lib/memory-book/types"
import type { MemoryBookAssetSource } from "./family-heritage-viewer"
import { MemoryBookPageComposer } from "./memory-book-page-composer"

type BookPatch = Partial<{
  draftDocument: MemoryBookDraftDocument
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
  initialMediaCursor,
  reactions,
  entitlement,
  initialShareUrl,
}: {
  initialBook: MemoryBookRecord
  initialAssets: MemoryBookAssetRecord[]
  initialAssetSources: MemoryBookAssetSource[]
  mediaLibrary: CuratorMediaOption[]
  initialMediaCursor: string | null
  reactions: Reaction[]
  entitlement: { live_book_id: string | null; source: string; granted_at: string } | null
  initialShareUrl: string | null
}) {
  const router = useRouter()
  const [book, setBook] = useState(initialBook)
  const [assets, setAssets] = useState(initialAssets)
  const [assetSources, setAssetSources] = useState(initialAssetSources)
  const [step, setStep] = useState<"memories" | "story">(
    initialAssets.filter((asset) => !asset.is_hidden).length >= 6
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
  const [libraryItems, setLibraryItems] = useState(mediaLibrary)
  const [mediaCursor, setMediaCursor] = useState(initialMediaCursor)
  const [loadingMoreMedia, setLoadingMoreMedia] = useState(false)

  const bookRef = useRef(book)
  const pendingPatchRef = useRef<BookPatch>({})
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savingRef = useRef(false)
  const mediaRefreshRef = useRef(false)
  const outboxKey = `memory-book-outbox:${book.id}`

  useEffect(() => {
    bookRef.current = book
  }, [book])

  const applyPatchLocally = useCallback((patch: BookPatch) => {
    setBook((current) => ({
      ...current,
      title: patch.draftDocument?.cover.title ?? current.title,
      draft_document: patch.draftDocument ?? current.draft_document,
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
    if (Array.isArray(result.assetSources)) setAssetSources(result.assetSources)
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
  const editableDraft = useMemo(
    () => reconcileMemoryBookDraft(parseMemoryBookDraft(book.draft_document), assets),
    [assets, book.draft_document]
  )
  const assignedAssetIds = useMemo(
    () => editableDraft.spreads.flatMap((spread) => spread.assetIds),
    [editableDraft.spreads]
  )
  const assignedReadyCount = useMemo(() => {
    const assigned = new Set(assignedAssetIds)
    return assets.filter(
      (asset) => assigned.has(asset.id) && asset.status === "ready" && !asset.is_hidden
    ).length
  }, [assignedAssetIds, assets])
  const canPublishDraft =
    assignedAssetIds.length >= 6 &&
    assignedAssetIds.length <= 12 &&
    new Set(assignedAssetIds).size === assignedAssetIds.length &&
    editableDraft.spreads.every((spread) => spread.assetIds.length > 0) &&
    assignedReadyCount === assignedAssetIds.length
  const previewDocument = useMemo<MemoryBookDocumentV1 | null>(() => {
    try {
      return buildMemoryBookDocument(
        { ...book, draft_document: editableDraft },
        assets
      )
    } catch {
      return null
    }
  }, [assets, book, editableDraft])


  const refreshMediaUrls = useCallback(async () => {
    if (mediaRefreshRef.current) return
    mediaRefreshRef.current = true
    try {
      const response = await fetch("/api/memory-books/media-urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetIds: assets.map((asset) => asset.id),
          sources: libraryItems.map((item) => ({
            sourceType: item.sourceType,
            sourceId: item.id,
          })),
        }),
      })
      if (!response.ok) return
      const result = await response.json()
      if (Array.isArray(result.assetSources)) {
        setAssetSources(result.assetSources)
      }
      if (Array.isArray(result.libraryItems)) {
        const refreshed = new Map<string, Partial<CuratorMediaOption> & Pick<CuratorMediaOption, "id" | "sourceType">>(
          result.libraryItems.map((item: Partial<CuratorMediaOption> & Pick<CuratorMediaOption, "id" | "sourceType">) => [
            `${item.sourceType}:${item.id}`,
            item,
          ])
        )
        setLibraryItems((current) =>
          current.map((item) => {
            const update = refreshed.get(`${item.sourceType}:${item.id}`)
            return update ? { ...item, ...update } : item
          })
        )
      }
    } finally {
      mediaRefreshRef.current = false
    }
  }, [assets, libraryItems])

  useEffect(() => {
    const timer = window.setInterval(() => void refreshMediaUrls(), 50 * 60 * 1000)
    return () => window.clearInterval(timer)
  }, [refreshMediaUrls])

  const retryAsset = async (asset: MemoryBookAssetRecord) => {
    const response = await fetch(
      `/api/memory-books/${book.id}/assets/${asset.id}/retry`,
      { method: "POST" }
    )
    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      setError(result.error || "Unable to retry memory preparation")
      return
    }
    await refreshBook()
  }

  const retryLibraryPreview = async (option: CuratorMediaOption) => {
    const response = await fetch("/api/memory-books/media-library/retry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceType: option.sourceType, sourceId: option.id }),
    })
    if (response.ok) {
      setLibraryItems((current) =>
        current.map((item) =>
          item.id === option.id && item.sourceType === option.sourceType
            ? { ...item, previewStatus: "queued", previewUrl: "", posterUrl: undefined }
            : item
        )
      )
    }
  }

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

  const loadMoreMedia = async () => {
    if (!mediaCursor || loadingMoreMedia) return
    setLoadingMoreMedia(true)
    try {
      const response = await fetch(
        `/api/memory-books/media-library?before=${encodeURIComponent(mediaCursor)}`
      )
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Unable to load more memories")
      }
      setLibraryItems((current) => {
        const existing = new Set(
          current.map((item) => `${item.sourceType}:${item.id}`)
        )
        return [
          ...current,
          ...result.items.filter(
            (item: CuratorMediaOption) =>
              !existing.has(`${item.sourceType}:${item.id}`)
          ),
        ]
      })
      setMediaCursor(result.nextCursor)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to load more memories"
      )
    } finally {
      setLoadingMoreMedia(false)
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
    if (Array.isArray(result.assetSources)) setAssetSources(result.assetSources)
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
    { id: "story" as const, label: "2. Compose" },
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
            disabled={!canPublishDraft}
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
          mediaLibrary={libraryItems}
          selectedSourceKeys={selectedSourceKeys}
          workingId={workingId}
          uploading={uploading}
          onToggle={toggleLibraryAsset}
          onRetryPreview={retryLibraryPreview}
          onMediaError={refreshMediaUrls}
          onUpload={uploadPhotos}
          hasMore={Boolean(mediaCursor)}
          loadingMore={loadingMoreMedia}
          onLoadMore={loadMoreMedia}
          onContinue={() => setStep("story")}
        />
      ) : null}

      {step === "story" ? (
        <MemoryBookPageComposer
          draft={editableDraft}
          document={previewDocument}
          assets={assets}
          assetSources={assetSources}
          shareUrl={shareUrl}
          copied={copied}
          reactions={reactions}
          onDraftChange={(draftDocument) => queueBookPatch({ draftDocument })}
          onAssetUpdate={updateAsset}
          onRetryAsset={retryAsset}
          onMediaError={refreshMediaUrls}
          onBack={() => setStep("memories")}
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
  onRetryPreview,
  onMediaError,
  onUpload,
  hasMore,
  loadingMore,
  onLoadMore,
  onContinue,
}: {
  book: MemoryBookRecord
  assets: MemoryBookAssetRecord[]
  mediaLibrary: CuratorMediaOption[]
  selectedSourceKeys: Set<string>
  workingId: string | null
  uploading: boolean
  onToggle: (option: CuratorMediaOption) => void
  onRetryPreview: (option: CuratorMediaOption) => void
  onMediaError: () => void
  onUpload: (files: FileList | null) => void
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
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
            disabled={selectedCount < 6 || selectedCount > 12}
            className="bg-[#1f2c27] text-white"
          >
            Compose pages
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
              {option.posterUrl || option.previewUrl || option.fallbackUrl ? (
                <img
                  src={option.posterUrl || option.previewUrl || option.fallbackUrl}
                  alt={option.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  onError={onMediaError}
                />
              ) : option.previewStatus === "failed" ? (
                <span className="grid h-full place-items-center bg-red-50 px-4 text-center text-red-700">
                  <span>
                    <CircleAlert className="mx-auto size-7" />
                    <span className="mt-2 block text-xs font-semibold">Preview unavailable</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={(event) => {
                        event.stopPropagation()
                        onRetryPreview(option)
                      }}
                    >
                      <RotateCcw className="size-3.5" /> Retry
                    </Button>
                  </span>
                </span>
              ) : (
                <span className="grid h-full place-items-center bg-[#e9ece8] text-[#47736c]">
                  <Loader2 className="size-7 animate-spin" />
                </span>
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

      {hasMore ? (
        <div className="mt-6 text-center">
          <Button variant="outline" disabled={loadingMore} onClick={onLoadMore}>
            {loadingMore ? <Loader2 className="animate-spin" /> : null}
            Load more memories
          </Button>
        </div>
      ) : null}

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
    const thumbnailSmallKey =
      typeof asset.metadata.thumbnailSmallKey === "string"
        ? asset.metadata.thumbnailSmallKey
        : null
    const thumbnailMediumKey =
      typeof asset.metadata.thumbnailMediumKey === "string"
        ? asset.metadata.thumbnailMediumKey
        : null
    const thumbnail = thumbnailSmallKey
      ? ownerLocatorUrl(thumbnailSmallKey, "image")
      : fallback?.thumbnail
    const poster = thumbnailMediumKey
      ? ownerLocatorUrl(thumbnailMediumKey, "image")
      : asset.poster_key
        ? ownerLocatorUrl(asset.poster_key, "image", 640)
        : typeof asset.metadata.posterLocator === "string"
          ? ownerLocatorUrl(asset.metadata.posterLocator, "image", 640)
          : fallback?.poster

    return {
      id: asset.id,
      mediaType: asset.media_type,
      src: src || fallback?.src || "",
      thumbnail,
      poster,
      downloadUrl: asset.preserved_key
        ? ownerLocatorUrl(asset.preserved_key, asset.media_type)
        : fallback?.downloadUrl,
    }
  })
}

function ownerLocatorUrl(
  locator: string,
  mediaType: "image" | "video",
  width?: 320 | 640
) {
  if (!locator) return ""
  if (
    locator.startsWith("images/") ||
    (locator.startsWith("memory-books/") && mediaType === "image")
  ) {
    const resize = width ? `&width=${width}` : ""
    return `/api/image-proxy?key=${encodeURIComponent(locator)}${resize}`
  }
  if (
    locator.startsWith("videos/") ||
    (locator.startsWith("memory-books/") && mediaType === "video")
  ) {
    return `/api/video-proxy?key=${encodeURIComponent(locator)}`
  }
  return locator
}
