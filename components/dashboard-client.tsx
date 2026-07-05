"use client"

import { ImageIcon, Loader2 } from "lucide-react"
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
import { DemoVideoModal } from "./demo-video-modal"
import { createClient as createSupabaseClient } from "@/utils/supabase/client"

type AppState = "upload" | "loading" | "comparison" | "batch" | "error"
type RestoreStatus = "selected" | "uploading" | "processing" | "completed" | "failed"

interface RestoreItem extends BatchComparisonItem {
  file?: File
  size?: number
  initialRestoredUrl?: string
  preserveOriginalColors?: boolean
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
  const lastReconcileAt = useRef(0)

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
          preserveOriginalColors: item.preserveOriginalColors,
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
      if (!parsed?.items?.length) {
        sessionStorage.removeItem(RESTORE_SESSION_KEY)
        return
      }

      // Only restore items that are still mid-flight ("processing" / "uploading").
      // Anything that was already "failed" or "completed" is dropped from the
      // session — failed jobs are auto-refunded server-side, completed jobs live
      // in /my-media. The user should never re-land on a stuck or stale screen.
      const recoverable = parsed.items.filter(
        (item) => item.status === "processing" || item.status === "uploading",
      )

      if (recoverable.length === 0) {
        sessionStorage.removeItem(RESTORE_SESSION_KEY)
        return
      }

      setBatchId(parsed.batchId || null)
      setItems(recoverable)
      setActiveItemId(parsed.activeItemId || recoverable[0]?.clientId || null)
      setAppState("loading")
    } catch {
      try {
        sessionStorage.removeItem(RESTORE_SESSION_KEY)
      } catch {}
    }
  }, [])

  useEffect(() => {
    const submittedItems = items.filter((item) => item.restorationId)
    if (submittedItems.length === 0) {
      // Nothing to persist — make sure no stale payload from a prior job is
      // left sitting in sessionStorage.
      try {
        sessionStorage.removeItem(RESTORE_SESSION_KEY)
      } catch {}
      return
    }

    const payload: StoredRestoreSession = {
      batchId,
      activeItemId,
      items: submittedItems.map(({ file, ...item }) => item),
    }

    try {
      sessionStorage.setItem(RESTORE_SESSION_KEY, JSON.stringify(payload))
    } catch {}
  }, [activeItemId, batchId, items])

  // Re-fetch the user's credit balance from the server. Used after a failure
  // to make sure the client reflects the auto-refund without the user having
  // to refresh the page.
  const resyncCredits = useCallback(async () => {
    try {
      const supabase = createSupabaseClient()
      const {
        data: { user: authedUser },
      } = await supabase.auth.getUser()
      if (!authedUser) return
      const { data } = await supabase
        .from("user_profiles")
        .select("credits")
        .eq("user_id", authedUser.id)
        .single()
      if (data && typeof data.credits === "number") {
        setUserCredits(data.credits)
      }
    } catch {}
  }, [])

  // Auto-recover from a single-item failure: silently drop the failed item from
  // local state, clear the session payload, and return the user to the upload
  // screen. A toast explains what happened and confirms the credit was refunded
  // — the user never has to interact with a "failed" item.
  const recoverFromSingleItemFailure = useCallback(
    (failedClientId: string, message: string) => {
      const failedItem = items.find((item) => item.clientId === failedClientId)
      if (failedItem?.localPreviewUrl) revokeLocalPreview(failedItem.localPreviewUrl)

      setItems((current) => current.filter((item) => item.clientId !== failedClientId))
      setActiveItemId(null)
      setError(null)
      setAppState("upload")
      isRestoringRef.current = false

      try {
        sessionStorage.removeItem(RESTORE_SESSION_KEY)
      } catch {}

      void resyncCredits()

      toast.error(
        `${message} Your credit has not been charged — you can try again with a new photo.`,
        { duration: 7000 },
      )
    },
    [items, toast, resyncCredits],
  )

  const applyRestorationRecord = useCallback(
    async (record: {
      id: string
      status: string
      restored_image_url?: string | null
      original_image_url?: string | null
      error_message?: string | null
    }) => {
      const matchedItem = items.find((item) => item.restorationId === record.id)
      const completedClientId =
        matchedItem && record.status === "completed" && record.restored_image_url
          ? matchedItem.clientId
          : null
      const failedClientId =
        matchedItem && record.status === "failed" ? matchedItem.clientId : null
      const failedMessage =
        matchedItem && record.status === "failed"
          ? record.error_message || "Failed to restore image"
          : null

      if (completedClientId && matchedItem?.file) {
        try {
          sessionStorage.setItem(restoreSignatureKey(matchedItem.file), "completed")
        } catch {}
      }

      if (failedClientId) {
        // Failed job: drop it from local state, never show it to the user.
        // For a single-item failure we return to the upload screen so the user
        // can immediately try again with a new file.
        if (items.length <= 1) {
          recoverFromSingleItemFailure(
            failedClientId,
            failedMessage || "We couldn’t process this photo.",
          )
          return
        }

        // In a batch, just remove the failed item from local state and let the
        // other items keep going. The toast below tells the user what happened.
        setItems((current) => current.filter((item) => item.clientId !== failedClientId))
        void resyncCredits()
        toast.error(
          `${failedMessage || "One photo in this batch couldn’t be restored."} Your credit for that photo has been refunded.`,
          { duration: 7000 },
        )
        return
      }

      setItems((current) =>
        current.map((item) => {
          if (item.restorationId !== record.id) return item

          if (record.status === "completed" && record.restored_image_url) {
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

          return item
        }),
      )

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
    },
    [items, toast, trackRestoration, recoverFromSingleItemFailure, resyncCredits],
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
      if (Date.now() - lastReconcileAt.current > 15000) {
        lastReconcileAt.current = Date.now()
        try {
          const response = await fetch("/api/restore/reconcile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: trackedRestorationIds }),
          })

          if (response.ok) {
            const payload = await response.json().catch(() => ({}))
            if (Array.isArray(payload.restorations)) {
              for (const restoration of payload.restorations) {
                await applyRestorationRecord(restoration)
              }
            }
          }
        } catch (error) {
          console.warn("[restore] Unable to reconcile Fal status", error)
        }
      }

      const { data } = await supabase
        .from("image_restorations")
        .select("id, status, restored_image_url, original_image_url, error_message")
        .in("id", trackedRestorationIds)

      if (Array.isArray(data)) {
        for (const restoration of data) {
          await applyRestorationRecord(restoration)
        }

        // If a tracked DB row is missing (e.g. user deleted it manually or the
        // job was cleared by another process), we don't want to keep the user
        // staring at the spinner. The matching item gets dropped from local
        // state immediately, the same way a real "failed" record is handled.
        const foundIds = new Set(data.map((row) => row.id))
        const missingIds = trackedRestorationIds.filter((id) => !foundIds.has(id))
        if (missingIds.length > 0) {
          setItems((current) => {
            const stillThere = current.filter(
              (item) => !(item.restorationId && missingIds.includes(item.restorationId)),
            )

            // If this empties out the dashboard, send the user back to upload.
            if (stillThere.length === 0) {
              setActiveItemId(null)
              setAppState("upload")
              try {
                sessionStorage.removeItem(RESTORE_SESSION_KEY)
              } catch {}
            }
            return stillThere
          })

          void resyncCredits()

          toast.error(
            "This restoration was lost and could not be recovered. Your credit has not been charged — please try again with a new photo.",
            { duration: 7000 },
          )
        }
      }
    }

    syncRestorationStatus()
    const intervalId = window.setInterval(syncRestorationStatus, 4000)

    return () => {
      window.clearInterval(intervalId)
      supabase.removeChannel(channel)
    }
  }, [applyRestorationRecord, batchId, trackedRestorationIds, resyncCredits])

  const handleImagesSelect = (files: File[]) => {
    const newItems = files.map((file) => ({
      clientId: createClientId(),
      file,
      fileName: file.name,
      size: file.size,
      localPreviewUrl: URL.createObjectURL(file),
      preserveOriginalColors: false,
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

  const handlePreserveOriginalColorsChange = (clientId: string, preserve: boolean) => {
    setItems((current) =>
      current.map((item) => (item.clientId === clientId ? { ...item, preserveOriginalColors: preserve } : item)),
    )
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
    setActiveItemId(freshSelectedItems[0]?.clientId || null)
    setAppState(freshSelectedItems.length > 1 ? "batch" : "loading")
    setItems((current) =>
      current.map((item) =>
        freshSelectedItems.some((selected) => selected.clientId === item.clientId)
          ? { ...item, status: "uploading" as RestoreStatus, error: undefined }
          : item,
      ),
    )

    // Captured across single + batch paths so the catch block can resync
    // the user's credit balance with whatever the server says after a refund.
    let lastResponseCredits: number | undefined

    try {
      if (freshSelectedItems.length === 1) {
        const item = freshSelectedItems[0]
        const response: RestoreImageResponse = await restoreImage(item.file!, {
          preserveOriginalColors: item.preserveOriginalColors === true,
        })

        if (response.success && response.restorationId) {
          const newCredits = response.creditsRemaining ?? Math.max(0, userCredits - 1)
          lastResponseCredits = newCredits
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
          // Capture the refunded balance before throwing so the catch block
          // can resync the user's credit count in one place.
          lastResponseCredits =
            typeof response.creditsRemaining === "number" ? response.creditsRemaining : undefined
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
          preserveOriginalColors: item.preserveOriginalColors === true,
        })),
      )

      if (!response.success || !response.restorations) {
        lastResponseCredits =
          typeof response.creditsRemaining === "number" ? response.creditsRemaining : undefined
        throw new Error(response.error || "Failed to start batch restoration")
      }

      if (typeof response.creditsRemaining === "number") {
        setUserCredits(response.creditsRemaining)
        lastResponseCredits = response.creditsRemaining
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
      const message =
        restoreError instanceof Error
          ? restoreError.message
          : "An unexpected error occurred. Please try again."
      const failedClientIds = new Set(freshSelectedItems.map((item) => item.clientId))

      // Resync the user's credit balance with whatever the server says it is
      // (the credit was reserved on entry and refunded on failure).
      if (typeof lastResponseCredits === "number" && lastResponseCredits >= 0) {
        setUserCredits(lastResponseCredits)
      }

      // Drop the failed item(s) from local state so the user never sees a
      // "failed" badge in the UI. For a single item we return to the upload
      // screen; for a batch the surviving items keep going.
      setItems((current) => current.filter((item) => !failedClientIds.has(item.clientId)))

      const survivingItems = items.filter((item) => !failedClientIds.has(item.clientId))
      const isSingleFailure = freshSelectedItems.length <= 1 && survivingItems.length === 0

      if (isSingleFailure) {
        setActiveItemId(null)
        setError(null)
        setAppState("upload")
        isRestoringRef.current = false
        try {
          sessionStorage.removeItem(RESTORE_SESSION_KEY)
        } catch {}
      }

      // Best-effort resync of the credit balance so the header counter is
      // honest after a refund (no page refresh required).
      void resyncCredits()

      toast.error(
        `${message} Your credit has not been charged — you can try again with a new photo.`,
        { duration: 7000 },
      )
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
            onPreserveOriginalColorsChange={handlePreserveOriginalColorsChange}
            selectedItems={selectedUploadItems}
            userCredits={userCredits}
          />
        )}

        {appState === "loading" && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="space-y-4 sm:space-y-5">
                {/* Header/Info */}
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Restoring this photo
                  </p>
                </div>

                {/* Image Display */}
                <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[400px] lg:h-[480px] rounded-xl overflow-hidden border border-gray-200/50 bg-[#f7f5f1] shadow-inner flex justify-center">
                  {activeItem?.originalUrl || activeItem?.localPreviewUrl ? (
                    <img
                      src={activeItem.originalUrl || activeItem.localPreviewUrl}
                      alt={activeItem?.fileName || "Selected photo"}
                      className="absolute inset-0 h-full w-full object-contain p-2 sm:p-3"
                    />
                  ) : (
                    <div className="flex h-full min-h-full w-full items-center justify-center bg-[#f7f5f1] text-gray-400">
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Preview preparing</p>
                      </div>
                    </div>
                  )}

                  {/* Gradient Overlay & Badge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-gray-900 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    Restoring
                  </div>

                  <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/85 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                    {activeItem?.restorationId ? "Safe to leave" : "Submitting"}
                  </div>
                </div>

                {/* Info Box */}
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center mx-auto max-w-md">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {activeItem?.fileName || "Photo restore"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    The finished before and after view will replace this preview automatically.
                  </p>
                </div>
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
              <div className="mx-auto mt-4 flex max-w-4xl justify-center">
                <a
                  href={`/dashboard/memory-book?sourceType=restoration&sourceId=${activeItem.restorationId}`}
                  className="inline-flex items-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold shadow-xs hover:bg-gray-50 transition-colors"
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
