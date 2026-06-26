"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ImageUpload, { type SelectedRestoreFile } from "@/components/image-upload"
import ImageComparison from "@/components/image-comparison"
import FeedbackModal from "@/components/feedback-modal"
import BatchComparisonWorkspace, { type BatchComparisonItem } from "@/components/batch-comparison-workspace"
import {
  restoreImage,
  restoreImageBatch,
  uploadRestoreImageToR2,
  type RestoreImageResponse,
} from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { useFeedback } from "@/hooks/use-feedback"
import { OrbitSepiaDust } from "@/components/ui/orbit-sepia-dust"
import { DemoVideoModal } from "./demo-video-modal"
import { createClient as createSupabaseClient } from "@/utils/supabase/client"

type AppState = "upload" | "loading" | "comparison" | "batch" | "error"
type RestoreStatus = "selected" | "uploading" | "processing" | "completed" | "failed"

interface RestoreItem extends BatchComparisonItem {
  file?: File
  size?: number
  initialRestoredUrl?: string
}

interface StoredRestoreSession {
  batchId: string | null
  activeItemId: string | null
  items: Array<Omit<RestoreItem, "file">>
}

interface DashboardClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
}

const RESTORE_SESSION_KEY = "restore_batch_session_v1"

function createClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function proxiedImageUrl(value?: string | null) {
  if (!value) return undefined
  if (value.startsWith("images/") || value.startsWith("temp/")) {
    return `/api/image-proxy?key=${encodeURIComponent(value)}`
  }
  return value
}

function revokeLocalPreview(url?: string) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url)
  }
}

function fileSignature(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`
}

function restoreSignatureKey(file: File) {
  return `restore_signature:${fileSignature(file)}`
}

export default function DashboardClient({ user, initialCredits }: DashboardClientProps) {
  const [appState, setAppState] = useState<AppState>("upload")
  const [items, setItems] = useState<RestoreItem[]>([])
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [batchId, setBatchId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState(initialCredits)
  const { toast } = useToast()
  const isRestoringRef = useRef(false)
  const trackedCompletionIds = useRef(new Set<string>())

  const {
    isModalOpen: isFeedbackModalOpen,
    showFeedbackModal,
    hideFeedbackModal,
    submitFeedback,
    skipFeedback,
    trackRestoration,
    trackFirstDownload,
  } = useFeedback()

  const selectedUploadItems: SelectedRestoreFile[] = useMemo(
    () =>
      items
        .filter((item): item is RestoreItem & { file: File; localPreviewUrl: string } =>
          item.status === "selected" && item.file instanceof File && typeof item.localPreviewUrl === "string"
        )
        .map((item) => ({
          clientId: item.clientId,
          file: item.file,
          localPreviewUrl: item.localPreviewUrl!,
          error: item.error,
        })),
    [items],
  )

  const activeItem = items.find((item) => item.clientId === activeItemId) || null
  const trackedRestorationIds = useMemo(
    () => items.filter((item) => item.restorationId && item.status === "processing").map((item) => item.restorationId!)
    , [items]
  )

  useEffect(() => {
    return () => {
      items.forEach((item) => revokeLocalPreview(item.localPreviewUrl))
      isRestoringRef.current = false
    }
  }, [])

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(RESTORE_SESSION_KEY)
      if (!stored) return

      const parsed = JSON.parse(stored) as StoredRestoreSession
      if (!parsed?.items?.length) return

      setBatchId(parsed.batchId || null)
      setItems(parsed.items)
      setActiveItemId(parsed.activeItemId || parsed.items.find((item) => item.status === "completed")?.clientId || parsed.items[0]?.clientId || null)
      setAppState(parsed.items.length > 1 ? "batch" : parsed.items[0]?.status === "completed" ? "comparison" : "loading")
    } catch {
      sessionStorage.removeItem(RESTORE_SESSION_KEY)
    }
  }, [])

  useEffect(() => {
    const submittedItems = items.filter((item) => item.restorationId)
    if (submittedItems.length === 0) return

    const payload: StoredRestoreSession = {
      batchId,
      activeItemId,
      items: submittedItems.map(({ file, ...item }) => item),
    }

    try {
      sessionStorage.setItem(RESTORE_SESSION_KEY, JSON.stringify(payload))
    } catch {}
  }, [activeItemId, batchId, items])

  const applyRestorationRecord = useCallback(
    async (record: {
      id: string
      status: string
      restored_image_url?: string | null
      original_image_url?: string | null
      error_message?: string | null
    }) => {
      let completedClientId: string | null = null
      let failedMessage: string | null = null

      setItems((current) => {
        const next = current.map((item) => {
          if (item.restorationId !== record.id) return item

          if (record.status === "completed" && record.restored_image_url) {
            completedClientId = item.clientId
            if (item.file) {
              try {
                sessionStorage.setItem(restoreSignatureKey(item.file), "completed")
              } catch {}
            }
            const restoredUrl = proxiedImageUrl(record.restored_image_url)
            const originalUrl = proxiedImageUrl(record.original_image_url) || item.originalUrl || item.localPreviewUrl
            return {
              ...item,
              status: "completed" as RestoreStatus,
              restoredUrl,
              initialRestoredUrl: restoredUrl,
              originalUrl,
              error: undefined,
            }
          }

          if (record.status === "failed") {
            failedMessage = record.error_message || "Failed to restore image"
            return {
              ...item,
              status: "failed" as RestoreStatus,
              error: failedMessage,
            }
          }

          return item
        })

        return next
      })

      if (completedClientId) {
        setActiveItemId((currentActive) => {
          const current = items.find((item) => item.clientId === currentActive)
          return current?.status === "completed" ? currentActive : completedClientId
        })
        setAppState(items.length > 1 ? "batch" : "comparison")

        if (!trackedCompletionIds.current.has(record.id)) {
          trackedCompletionIds.current.add(record.id)
          await trackRestoration()
          toast.success("Image restored successfully")
        }
      }

      if (failedMessage && items.length <= 1) {
        setError(failedMessage)
        setAppState("error")
        toast.error(failedMessage)
      }
    },
    [items, toast, trackRestoration],
  )

  useEffect(() => {
    if (trackedRestorationIds.length === 0) return

    const supabase = createSupabaseClient()
    const channel = supabase.channel(`image-restoration-batch-${batchId || trackedRestorationIds.join("-")}`)

    trackedRestorationIds.forEach((id) => {
      channel.on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "image_restorations",
          filter: `id=eq.${id}`,
        },
        async (payload) => {
          const restoration = payload.new as {
            id: string
            status: string
            restored_image_url?: string | null
            original_image_url?: string | null
            error_message?: string | null
          }
          await applyRestorationRecord(restoration)
        },
      )
    })

    channel.subscribe()

    const syncRestorationStatus = async () => {
      const { data } = await supabase
        .from("image_restorations")
        .select("id, status, restored_image_url, original_image_url, error_message")
        .in("id", trackedRestorationIds)

      if (Array.isArray(data)) {
        for (const restoration of data) {
          await applyRestorationRecord(restoration)
        }
      }
    }

    syncRestorationStatus()
    const intervalId = window.setInterval(syncRestorationStatus, 4000)

    return () => {
      window.clearInterval(intervalId)
      supabase.removeChannel(channel)
    }
  }, [applyRestorationRecord, batchId, trackedRestorationIds])

  const handleImagesSelect = (files: File[]) => {
    const newItems = files.map((file) => ({
      clientId: createClientId(),
      file,
      fileName: file.name,
      size: file.size,
      localPreviewUrl: URL.createObjectURL(file),
      status: "selected" as RestoreStatus,
    }))

    setError(null)
    setItems((current) => [...current, ...newItems].slice(0, 5))
  }

  const handleRemoveImage = (clientId: string) => {
    setItems((current) => {
      const target = current.find((item) => item.clientId === clientId)
      revokeLocalPreview(target?.localPreviewUrl)
      return current.filter((item) => item.clientId !== clientId)
    })
  }

  const handleClearImages = () => {
    items.forEach((item) => revokeLocalPreview(item.localPreviewUrl))
    setItems([])
    setActiveItemId(null)
    setBatchId(null)
    setError(null)
    setAppState("upload")
    isRestoringRef.current = false
    trackedCompletionIds.current.clear()
    try {
      sessionStorage.removeItem(RESTORE_SESSION_KEY)
    } catch {}
  }

  const handleRestore = async () => {
    const selectedItems = items.filter((item) => item.status === "selected" && item.file)
    if (selectedItems.length === 0) return

    if (appState === "loading" || isRestoringRef.current) return

    const freshSelectedItems = selectedItems.filter((item) => {
      if (!item.file) return false
      try {
        return sessionStorage.getItem(restoreSignatureKey(item.file)) !== "completed"
      } catch {
        return true
      }
    })

    if (freshSelectedItems.length !== selectedItems.length) {
      toast.info("Already restored one or more selected photos in this session. Skipping duplicate request.")
      if (freshSelectedItems.length === 0) return
    }

    if (userCredits < freshSelectedItems.length) {
      toast.error(`You need ${freshSelectedItems.length} credits to restore these photos.`)
      window.dispatchEvent(new Event("open-payment-modal"))
      return
    }

    isRestoringRef.current = true
    setError(null)
    setAppState(freshSelectedItems.length > 1 ? "batch" : "loading")
    setItems((current) =>
      current.map((item) =>
        freshSelectedItems.some((selected) => selected.clientId === item.clientId)
          ? { ...item, status: "uploading" as RestoreStatus, error: undefined }
          : item,
      ),
    )

    try {
      if (freshSelectedItems.length === 1) {
        const item = freshSelectedItems[0]
        const response: RestoreImageResponse = await restoreImage(item.file!)

        if (response.success && response.restorationId) {
          const newCredits = response.creditsRemaining ?? Math.max(0, userCredits - 1)
          setUserCredits(newCredits)
          setItems((current) =>
            current.map((currentItem) =>
              currentItem.clientId === item.clientId
                ? {
                    ...currentItem,
                    status: "processing" as RestoreStatus,
                    restorationId: response.restorationId,
                    originalUrl: response.originalImageUrl || currentItem.localPreviewUrl,
                  }
                : currentItem,
            ),
          )
          setActiveItemId(item.clientId)
          toast.success(`Restoration started. 1 credit deducted. ${newCredits} credits remaining.`)
        } else {
          throw new Error(response.error || "Failed to restore image")
        }

        return
      }

      const uploadResults = await Promise.all(
        freshSelectedItems.map(async (item) => {
          try {
            const key = await uploadRestoreImageToR2(item.file!)
            return { item, key }
          } catch (uploadError) {
            const message = uploadError instanceof Error ? uploadError.message : "Failed to upload image"
            setItems((current) =>
              current.map((currentItem) =>
                currentItem.clientId === item.clientId
                  ? { ...currentItem, status: "failed" as RestoreStatus, error: message }
                  : currentItem,
              ),
            )
            return { item, key: null, error: message }
          }
        }),
      )

      const readyToSubmit = uploadResults.filter((result): result is { item: RestoreItem; key: string } => Boolean(result.key))
      if (readyToSubmit.length === 0) {
        throw new Error("Failed to upload images to storage")
      }

      setItems((current) =>
        current.map((item) =>
          readyToSubmit.some((ready) => ready.item.clientId === item.clientId)
            ? { ...item, status: "processing" as RestoreStatus }
            : item,
        ),
      )

      const response = await restoreImageBatch(
        readyToSubmit.map(({ item, key }) => ({
          clientId: item.clientId,
          key,
          filename: item.fileName,
        })),
      )

      if (!response.success || !response.restorations) {
        throw new Error(response.error || "Failed to start batch restoration")
      }

      if (typeof response.creditsRemaining === "number") {
        setUserCredits(response.creditsRemaining)
      }
      if (response.batchId) {
        setBatchId(response.batchId)
      }

      setItems((current) =>
        current.map((item) => {
          const restoration = response.restorations?.find((entry) => entry.clientId === item.clientId)
          if (!restoration) return item

          return {
            ...item,
            status: restoration.status,
            restorationId: restoration.restorationId || item.restorationId,
            originalUrl: restoration.originalImageUrl || item.localPreviewUrl,
            error: restoration.error,
          }
        }),
      )

      toast.success(`Restoration started. ${readyToSubmit.length} credits deducted.`)
    } catch (restoreError) {
      const message = restoreError instanceof Error ? restoreError.message : "An unexpected error occurred. Please try again."
      setError(message)
      setAppState(freshSelectedItems.length > 1 ? "batch" : "error")
      setItems((current) =>
        current.map((item) =>
          freshSelectedItems.some((selected) => selected.clientId === item.clientId) && item.status !== "failed"
            ? { ...item, status: "failed" as RestoreStatus, error: message }
            : item,
        ),
      )
      toast.error(message)
    } finally {
      isRestoringRef.current = false
    }
  }

  const handleDownload = async (restoredUrl: string) => {
    try {
      const response = await fetch(restoredUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `restored-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      await trackFirstDownload()

      const feedbackResponse = await fetch("/api/feedback")
      if (feedbackResponse.ok) {
        const data = await feedbackResponse.json()
        if (data.shouldShow) {
          setTimeout(() => showFeedbackModal(), 1500)
        }
      }
    } catch (downloadError) {
      console.error("Error downloading image:", downloadError)
      toast.error("Failed to download image")
    }
  }

  const handleFeedbackSubmit = async (rating: number, feedback: string) => {
    try {
      await submitFeedback(rating, feedback)
      hideFeedbackModal()
      toast.success("Thank you for your feedback!")
    } catch {
      toast.error("Failed to submit feedback. Please try again.")
    }
  }

  const handleFeedbackSkip = async () => {
    try {
      await skipFeedback()
      hideFeedbackModal()
    } catch {
      toast.error("Failed to skip feedback. Please try again.")
    }
  }

  return (
    <div className="relative min-h-screen">
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
        {(appState === "upload" || appState === "loading" || appState === "comparison" || appState === "error" || appState === "batch") && (
          <div className="mx-auto mb-4 max-w-2xl text-center">
            <h1 className="font-inter text-3xl font-bold text-black">Revive Your Photo</h1>
            <p className="mb-4 text-lg leading-tight text-gray-600">
              Upload your old, damaged, or low-quality photos and let our AI bring back your memories to life.
            </p>
            <div className="flex justify-center">
              <DemoVideoModal videoSrc="/videos/tear-torn-restoration.mp4" triggerText="See Restoration in Action" />
            </div>
          </div>
        )}

        {appState === "upload" && (
          <ImageUpload
            onImagesSelect={handleImagesSelect}
            onRemoveImage={handleRemoveImage}
            onClearImages={handleClearImages}
            onRestore={handleRestore}
            selectedItems={selectedUploadItems}
            userCredits={userCredits}
          />
        )}

        {appState === "loading" && (
          <div className="mx-auto w-full max-w-2xl">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-gray-800 bg-black p-16 text-center">
              <div className="absolute inset-0 h-full w-full">
                <OrbitSepiaDust />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="font-inter mb-2 text-2xl font-semibold text-white">Giving one more life to your past...</h3>
                <p className="text-gray-100">Our AI is carefully restoring your image. This can take up to a minute.</p>
              </div>
            </div>
          </div>
        )}

        {appState === "comparison" && activeItem?.status === "completed" && activeItem.originalUrl && activeItem.restoredUrl && (
          <>
            <ImageComparison
              originalUrl={activeItem.originalUrl}
              restoredUrl={activeItem.restoredUrl}
              onStartOver={handleClearImages}
              onDownload={handleDownload}
            />
            {activeItem.restorationId && (
              <div className="mx-auto mt-4 flex max-w-5xl justify-center">
                <a
                  href={`/dashboard/memory-book?sourceType=restoration&sourceId=${activeItem.restorationId}`}
                  className="inline-flex items-center rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
                >
                  Add to Family Heritage keepsake
                </a>
              </div>
            )}
          </>
        )}

        {appState === "batch" && (
          <BatchComparisonWorkspace
            items={items}
            activeItemId={activeItemId}
            onActiveItemChange={setActiveItemId}
            onStartOver={handleClearImages}
            onDownload={handleDownload}
          />
        )}

        {appState === "error" && (
          <div className="mx-auto w-full max-w-2xl">
            <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6 text-center backdrop-blur-sm">
              <div className="space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <div>
                  <h3 className="font-inter mb-2 text-xl font-semibold text-red-900">Restoration Failed</h3>
                  <p className="mb-6 text-red-700">{error}</p>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleClearImages}
                      className="rounded bg-gray-600 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-700"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={hideFeedbackModal}
        onSubmit={handleFeedbackSubmit}
        onSkip={handleFeedbackSkip}
      />
    </div>
  )
}