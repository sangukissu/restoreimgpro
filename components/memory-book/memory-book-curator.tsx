"use client"

import dynamic from "next/dynamic"
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
  ImagePlus,
  Loader2,
  LockKeyhole,
  Music2,
  Play,
  RefreshCw,
  RotateCcw,
  Save,
  Share2,
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
import { memoryBookShareSlugSchema, normalizeMemoryBookShareSlug } from "@/lib/memory-book/share-slug"
import { parseMemoryBookDraft, reconcileMemoryBookDraft } from "@/lib/memory-book/draft"
import type {
  CuratorMediaOption,
  MemoryBookAssetRecord,
  MemoryBookDocumentV1,
  MemoryBookDraftDocument,
  MemoryBookRecord,
} from "@/lib/memory-book/types"
import type { MemoryBookAssetSource } from "./family-heritage-viewer"
import { MemoryBookPageComposer } from "./memory-book-page-composer"
import { MemoryBookShareDialog } from "./memory-book-share-dialog"

const FullBookPreview = dynamic(
  () =>
    import("./family-heritage-viewer").then(
      (module) => module.FamilyHeritageViewer
    ),
  { ssr: false }
)

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
  const [previewOpen, setPreviewOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareSlug, setShareSlug] = useState(initialBook.share_slug)
  const [shareUrl, setShareUrl] = useState(initialShareUrl)
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
  const publishBlockers = useMemo(() => {
    const blockers: string[] = []
    const assignedCount = assignedAssetIds.length
    const uniqueCount = new Set(assignedAssetIds).size
    const emptyPageCount = editableDraft.spreads.filter(
      (spread) => spread.assetIds.length === 0
    ).length
    const preparingCount = Math.max(0, assignedCount - assignedReadyCount)

    if (assignedCount < 6) {
      blockers.push(`Add ${6 - assignedCount} more ${6 - assignedCount === 1 ? "memory" : "memories"} to the book.`)
    } else if (assignedCount > 12) {
      blockers.push(`Remove ${assignedCount - 12} ${assignedCount - 12 === 1 ? "memory" : "memories"}; a book supports up to 12.`)
    }
    if (uniqueCount !== assignedCount) {
      blockers.push("A memory is assigned to more than one page.")
    }
    if (emptyPageCount > 0) {
      blockers.push(`${emptyPageCount} ${emptyPageCount === 1 ? "page is" : "pages are"} empty.`)
    }
    if (preparingCount > 0) {
      blockers.push(`${preparingCount} assigned ${preparingCount === 1 ? "memory is" : "memories are"} still preparing.`)
    }

    return blockers
  }, [assignedAssetIds, assignedReadyCount, editableDraft.spreads])
  const canPublishDraft = publishBlockers.length === 0
  const assignedPreparingIds = useMemo(() => {
    const assigned = new Set(assignedAssetIds)
    return assets
      .filter(
        (asset) =>
          assigned.has(asset.id) &&
          !asset.is_hidden &&
          (asset.status === "pending" || asset.status === "processing")
      )
      .map((asset) => asset.id)
      .sort()
  }, [assignedAssetIds, assets])
  const assignedPreparingKey = assignedPreparingIds.join(":")

  useEffect(() => {
    if (!assignedPreparingKey) return

    let cancelled = false
    void fetch(`/api/memory-books/${book.id}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetIds: assignedPreparingKey.split(":") }),
    })

    const poll = window.setInterval(() => {
      if (!cancelled) void refreshBook()
    }, 4000)

    return () => {
      cancelled = true
      window.clearInterval(poll)
    }
  }, [assignedPreparingKey, book.id, refreshBook])

  const previewDocument = useMemo<MemoryBookDocumentV1 | null>(() => {
    try {
      return buildMemoryBookDocument(
        { ...book, draft_document: editableDraft },
        assets,
        { requireReady: false }
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

  const removeUploadedAsset = async (asset: MemoryBookAssetRecord) => {
    setError(null)
    await flushBookPatch()
    setWorkingId(asset.id)
    try {
      const response = await fetch(
        `/api/memory-books/${book.id}/assets/${asset.id}`,
        { method: "DELETE" }
      )
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Unable to remove uploaded photo")
      }
      await refreshBook()
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to remove uploaded photo"
      )
    } finally {
      setWorkingId(null)
    }
  }

  const addLibraryAssetToPage = async (
    option: CuratorMediaOption,
    targetSpreadId: string
  ): Promise<boolean> => {
    setError(null)
    await flushBookPatch()
    setWorkingId(option.id)
    try {
      const response = await fetch(`/api/memory-books/${book.id}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: option.sourceType,
          sourceId: option.id,
          targetSpreadId,
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Unable to add this memory")
      }
      await refreshBook()
      posthog.capture("memory_book_asset_selection_changed", {
        action: "added_from_composer",
        source_type: option.sourceType,
        media_type: option.mediaType,
      })
      return true
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to add this memory")
      return false
    } finally {
      setWorkingId(null)
    }
  }

  const uploadPhotos = async (
    files: FileList | File[] | null,
    targetSpreadId?: string
  ): Promise<boolean> => {
    if (!files?.length) return false
    // FileList is live and becomes empty when the input is reset. Snapshot it
    // before the first await so the selected files survive that reset.
    const pendingFiles = Array.from(files)
    if (!pendingFiles.length) return false
    await flushBookPatch()
    setUploading(true)
    setError(null)
    try {
      const remainingSlots = Math.max(
        0,
        12 - assets.filter((asset) => !asset.is_hidden).length
      )
      if (remainingSlots === 0) {
        throw new Error("This memory book already contains 12 memories")
      }
      const selectedFiles = pendingFiles.slice(0, remainingSlots)

      for (const file of selectedFiles) {
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
            body: JSON.stringify({
              assetId: upload.assetId,
              key: upload.key,
              targetSpreadId,
            }),
          }
        )
        const complete = await completeResponse.json()
        if (!completeResponse.ok) {
          throw new Error(complete.error || "Unable to finish upload")
        }
      }
      await refreshBook()
      return true
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to upload photos")
      return false
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
          shareSlug,
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
      setShareSlug(result.shareSlug)
      setPublishOpen(false)
      posthog.capture("memory_book_published", {
        revision_number: result.revisionNumber,
        asset_count: assignedAssetIds.length,
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
    const result = await response.json()
    if (!response.ok) {
      const message = result.error || "Unable to unpublish this keepsake"
      setError(message)
      throw new Error(message)
    }
    setShareUrl(null)
    await refreshBook()
  }

  const steps = [
    { id: "memories" as const, label: "1. Memories" },
    { id: "story" as const, label: "2. Compose" },
  ]

  return (
    <main className="min-h-[calc(100svh-4rem)]">
      <header className="sticky top-0 z-30 border-b border-black/8 bg-white/94 px-4 py-3 backdrop-blur-xl md:px-7">
        <div className="mx-auto flex items-center justify-between gap-3">
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
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewOpen(true)}
              disabled={!previewDocument}
              title={previewDocument ? "Preview full book" : "Complete every page before previewing the full book"}
            >
              <BookOpen />
              <span className="hidden md:inline">Preview</span>
            </Button>
            {book.status === "published" && shareUrl ? (
              <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
                <Share2 />
                <span className="hidden md:inline">Share</span>
              </Button>
            ) : null}
            <Button
              size="sm"
              onClick={() => setPublishOpen(true)}
              title={
                canPublishDraft
                  ? undefined
                  : "Open to see what is needed before publishing"
              }
              className="bg-[#1f2c27] text-white hover:bg-[#304139]"
            >
              <span className="hidden sm:inline">
                {book.status === "published" ? "Republish" : "Publish"}
              </span>
              <ArrowRight />
            </Button>
          </div>
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
          assetSources={assetSources}
          mediaLibrary={libraryItems}
          selectedSourceKeys={selectedSourceKeys}
          workingId={workingId}
          uploading={uploading}
          onToggle={toggleLibraryAsset}
          onRemoveUploadedAsset={removeUploadedAsset}
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
          reactions={reactions}
          mediaLibrary={libraryItems}
          selectedSourceKeys={selectedSourceKeys}
          workingId={workingId}
          uploading={uploading}
          hasMoreMedia={Boolean(mediaCursor)}
          loadingMoreMedia={loadingMoreMedia}
          onAddGalleryAsset={addLibraryAssetToPage}
          onUploadToPage={uploadPhotos}
          onLoadMoreMedia={loadMoreMedia}
          onDraftChange={(draftDocument) => queueBookPatch({ draftDocument })}
          onAssetUpdate={updateAsset}
          onRetryAsset={retryAsset}
          onMediaError={refreshMediaUrls}
        />
      ) : null}
      <PublishDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        book={book}
        entitlement={entitlement}
        canPublishDraft={canPublishDraft}
        publishBlockers={publishBlockers}
        pin={pin}
        shareSlug={shareSlug}
        publishing={publishing}
        onPinChange={setPin}
        onShareSlugChange={setShareSlug}
        onPatch={queueBookPatch}
        onPublish={publishBook}
      />
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="h-[94svh] w-[96vw] !max-w-[96vw] overflow-auto border-0 bg-[#f8f5ef] p-0 sm:!max-w-[96vw]">
          <DialogTitle className="sr-only">Full memory book preview</DialogTitle>
          <DialogDescription className="sr-only">
            Preview the complete interactive memory book.
          </DialogDescription>
          {previewOpen && previewDocument ? (
            <FullBookPreview document={previewDocument} assetSources={assetSources} />
          ) : null}
        </DialogContent>
      </Dialog>
      <MemoryBookShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        book={book}
        shareUrl={shareUrl}
        onShareUpdated={(update) => {
          setShareUrl(update.shareUrl)
          setShareSlug(update.shareSlug)
          setBook((current) => ({ ...current, share_slug: update.shareSlug }))
          bookRef.current = { ...bookRef.current, share_slug: update.shareSlug }
        }}
        onUnpublished={unpublishBook}
        onError={setError}
      />
    </main>
  )
}

function MemorySelectionStep({
  book,
  assets,
  assetSources,
  mediaLibrary,
  selectedSourceKeys,
  workingId,
  uploading,
  onToggle,
  onRemoveUploadedAsset,
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
  assetSources: MemoryBookAssetSource[]
  mediaLibrary: CuratorMediaOption[]
  selectedSourceKeys: Set<string>
  workingId: string | null
  uploading: boolean
  onToggle: (option: CuratorMediaOption) => void
  onRemoveUploadedAsset: (asset: MemoryBookAssetRecord) => void
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
  const assetSourceMap = new Map(
    assetSources.map((source) => [source.id, source])
  )
  const uploadedAssets = assets
    .filter((asset) => asset.source_type === "upload" && !asset.is_hidden)
    .sort((a, b) => a.position - b.position)

  return (
    <section className="mx-auto px-5 py-6">
      <div className="flex flex-col gap-4 border-b border-black/8 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mt-1 text-2xl font-bold">Curate what belongs together.</h2>
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
        {uploadedAssets.map((asset) => {
          const source = assetSourceMap.get(asset.id)
          const preview = source?.thumbnail || source?.poster || source?.src
          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => onRemoveUploadedAsset(asset)}
              disabled={workingId === asset.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-md border border-[#47736c] bg-white text-left shadow-sm ring-2 ring-[#47736c]/25 disabled:opacity-60"
              title="Remove this uploaded photo from the memory book"
            >
              {preview ? (
                <img
                  src={preview}
                  alt={asset.alt_text}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  onError={onMediaError}
                />
              ) : asset.status === "failed" ? (
                <span className="grid h-full place-items-center bg-red-50 text-red-700">
                  <CircleAlert className="size-7" />
                </span>
              ) : (
                <span className="grid h-full place-items-center bg-[#e9ece8] text-[#47736c]">
                  <Loader2 className="size-7 animate-spin" />
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 to-transparent px-3 pb-3 pt-10 text-white">
                <span className="block truncate text-sm font-semibold">
                  {asset.original_label}
                </span>
                <span className="mt-0.5 block text-[11px] text-white/72">
                  Uploaded photo
                </span>
              </span>
              <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full border border-[#47736c] bg-[#47736c] text-white">
                {workingId === asset.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
              </span>
            </button>
          )
        })}

        {mediaLibrary.map((option) => {
          const selected = selectedSourceKeys.has(
            `${option.sourceType}:${option.id}`
          )
          return (
            <button
              key={`${option.sourceType}:${option.id}`}
              type="button"
              onClick={() => {
                if (
                  option.previewStatus === "failed" &&
                  !option.previewUrl &&
                  !option.posterUrl &&
                  !option.fallbackUrl
                ) {
                  onRetryPreview(option)
                } else {
                  onToggle(option)
                }
              }}
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
<span className="mt-3 inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold">
                      <RotateCcw className="size-3.5" /> Click to retry
                    </span>
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
            <span className="mt-3 block text-sm font-semibold">
              {uploading ? "Uploading photos..." : "Add family photos"}
            </span>
            <span className="mt-1 block text-xs leading-5 text-black/45">
              {uploading
                ? "Please keep this page open"
                : "JPG, PNG, or WebP up to 12MB"}
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
  canPublishDraft,
  publishBlockers,
  pin,
  shareSlug,
  publishing,
  onPinChange,
  onShareSlugChange,
  onPatch,
  onPublish,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  book: MemoryBookRecord
  entitlement: { live_book_id: string | null } | null
  canPublishDraft: boolean
  publishBlockers: string[]
  pin: string
  shareSlug: string
  publishing: boolean
  onPinChange: (value: string) => void
  onShareSlugChange: (value: string) => void
  onPatch: (patch: BookPatch) => void
  onPublish: () => void
}) {
  const shareSlugResult = memoryBookShareSlugSchema.safeParse(shareSlug)
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
          {publishBlockers.length > 0 ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <div className="flex items-start gap-2">
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-semibold">
                    {book.status === "published"
                      ? "This update is not ready to republish yet."
                      : "This book is not ready to publish yet."}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-amber-800">
                    {publishBlockers.map((blocker) => (
                      <li key={blocker}>{blocker}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              All pages and memories are ready.
            </div>
          )}
          <div>
            <label className="text-sm font-semibold" htmlFor="publish-share-slug">
              Family link
            </label>
            {book.status === "published" ? (
              <div className="mt-2 rounded-md bg-[#f5f5f2] px-3 py-2 text-sm text-black/65">
                /m/{book.share_slug}
                <p className="mt-1 text-xs text-black/45">Change this later from Share.</p>
              </div>
            ) : (
              <>
                <div className="mt-2 flex overflow-hidden rounded-md border border-input bg-white">
                  <span className="flex items-center border-r bg-[#f5f5f2] px-3 text-sm text-black/45">/m/</span>
                  <Input
                    id="publish-share-slug"
                    value={shareSlug}
                    maxLength={60}
                    className="border-0 shadow-none focus-visible:ring-0"
                    onChange={(event) =>
                      onShareSlugChange(normalizeMemoryBookShareSlug(event.target.value))
                    }
                  />
                </div>
                <p className={`mt-1 text-xs ${shareSlugResult.success ? "text-black/45" : "text-red-700"}`}>
                  {shareSlugResult.success
                    ? "You can change this name before sharing the book."
                    : shareSlugResult.error.issues[0]?.message}
                </p>
              </>
            )}
          </div>
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
              !canPublishDraft ||
              !shareSlugResult.success ||
              !book.preservation_consent ||
              (pin.length > 0 && pin.length < 4) ||
              Boolean(entitlement?.live_book_id && entitlement.live_book_id !== book.id)
            }
            className="bg-[#1f2c27] text-white"
          >
            {publishing ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
            {entitlement
              ? book.status === "published"
                ? "Republish private link"
                : "Publish private link"
              : "Unlock publishing"}
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
