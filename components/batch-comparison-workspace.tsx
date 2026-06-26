"use client"

import { AlertCircle, CheckCircle2, ImageIcon, Loader2, XCircle } from "lucide-react"
import ImageComparison from "@/components/image-comparison"
import { Button } from "@/components/ui/button"

export type BatchComparisonItem = {
  clientId: string
  fileName: string
  localPreviewUrl?: string
  originalUrl?: string
  restoredUrl?: string
  restorationId?: string
  status: "selected" | "uploading" | "processing" | "completed" | "failed"
  error?: string
}

interface BatchComparisonWorkspaceProps {
  items: BatchComparisonItem[]
  activeItemId: string | null
  onActiveItemChange: (clientId: string) => void
  onStartOver: () => void
  onDownload: (restoredUrl: string) => void
}

function statusLabel(status: BatchComparisonItem["status"]) {
  if (status === "uploading") return "Uploading"
  if (status === "processing") return "Restoring"
  if (status === "completed") return "Ready"
  if (status === "failed") return "Failed"
  return "Queued"
}

function StatusIcon({ status }: { status: BatchComparisonItem["status"] }) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-green-600" />
  if (status === "failed") return <XCircle className="h-4 w-4 text-red-600" />
  if (status === "uploading" || status === "processing") return <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
  return <AlertCircle className="h-4 w-4 text-gray-400" />
}

function activeHeadline(status?: BatchComparisonItem["status"]) {
  if (status === "uploading") return "Uploading this photo"
  if (status === "processing") return "Restoring this photo"
  if (status === "failed") return "This photo could not be restored"
  return "Queued for restoration"
}

function activeMessage(status?: BatchComparisonItem["status"]) {
  if (status === "failed") return "Pick another photo from the queue while this one stays marked failed."
  if (status === "uploading") return "Once the upload is accepted, restoration starts automatically."
  return "The finished before and after view will replace this preview automatically."
}

function PhotoPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full min-h-full w-full items-center justify-center bg-gray-100 text-gray-400">
      <div className="text-center">
        <ImageIcon className={`${compact ? "h-4 w-4" : "h-8 w-8"} mx-auto mb-2`} />
        {!compact && <p className="text-sm">Preview preparing</p>}
      </div>
    </div>
  )
}

function ActiveProcessingSurface({ item }: { item?: BatchComparisonItem }) {
  const preview = item?.originalUrl || item?.localPreviewUrl
  const failed = item?.status === "failed"
  const submitted = Boolean(item?.restorationId)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="relative min-h-[360px] bg-[#f7f5f1] sm:min-h-[440px] lg:min-h-[520px]">
        {preview ? (
          <img
            src={preview}
            alt={item?.fileName || "Selected photo"}
            className="absolute inset-0 h-full w-full object-contain p-3 sm:p-4"
          />
        ) : (
          <PhotoPlaceholder />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm sm:left-4 sm:top-4">
          <StatusIcon status={item?.status || "selected"} />
          {statusLabel(item?.status || "selected")}
        </div>

        {!failed && (
          <div className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/70 px-3 py-1.5 text-xs font-medium text-white shadow-sm sm:right-4 sm:top-4">
            {submitted ? "Safe to leave" : "Submitting"}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
          <div className="max-w-xl">
            <p className="mb-2 truncate text-xs font-medium uppercase text-white/70">
              {item?.fileName || "Photo restore"}
            </p>
            <h3 className="font-inter text-2xl font-semibold sm:text-3xl">{activeHeadline(item?.status)}</h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/85">{activeMessage(item?.status)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function RailItem({
  item,
  isActive,
  compact = false,
  onClick,
}: {
  item: BatchComparisonItem
  isActive: boolean
  compact?: boolean
  onClick: () => void
}) {
  const preview = item.originalUrl || item.localPreviewUrl

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-24 shrink-0 rounded-lg border bg-white p-1.5 text-left transition ${
          isActive ? "border-black shadow-sm" : "border-gray-200"
        }`}
      >
        <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
          {preview ? (
            <img src={preview} alt={item.fileName} className="h-full w-full object-cover" />
          ) : (
            <PhotoPlaceholder compact />
          )}
          <span className="absolute bottom-1 left-1 rounded-full bg-white/95 p-1 shadow-sm">
            <StatusIcon status={item.status} />
          </span>
        </div>
        <p className="mt-1 truncate text-[11px] font-semibold text-gray-900">{item.fileName}</p>
        <p className="text-[11px] text-gray-500">{statusLabel(item.status)}</p>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition ${
        isActive ? "border-black bg-white shadow-sm" : "border-gray-200 bg-white/70 hover:border-gray-400"
      }`}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
        {preview ? (
          <img src={preview} alt={item.fileName} className="h-full w-full object-cover" />
        ) : (
          <PhotoPlaceholder compact />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">{item.fileName}</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
          <StatusIcon status={item.status} />
          <span>{statusLabel(item.status)}</span>
        </div>
        {item.error && <p className="mt-1 line-clamp-2 text-xs text-red-600">{item.error}</p>}
      </div>
    </button>
  )
}

export default function BatchComparisonWorkspace({
  items,
  activeItemId,
  onActiveItemChange,
  onStartOver,
  onDownload,
}: BatchComparisonWorkspaceProps) {
  const activeItem =
    items.find((item) => item.clientId === activeItemId) ||
    items.find((item) => item.status === "completed") ||
    items[0]
  const completedCount = items.filter((item) => item.status === "completed").length
  const failedCount = items.filter((item) => item.status === "failed").length
  const inFlightCount = items.filter((item) => item.status === "uploading" || item.status === "processing").length
  const activeReady = activeItem?.status === "completed" && activeItem.originalUrl && activeItem.restoredUrl
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Batch restoration</p>
            <h2 className="font-inter text-2xl font-semibold text-black">
              {completedCount > 0 ? `${completedCount} of ${items.length} photos ready` : `Restoring ${items.length} photos`}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              You can leave this page after submission. Finished photos are saved to My Media.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
              <span className="font-semibold text-black">{inFlightCount}</span> active
              {failedCount > 0 && <span className="ml-2 text-red-600">{failedCount} failed</span>}
            </div>
            <Button onClick={onStartOver} variant="outline" className="rounded-md bg-white">
              Restore more
            </Button>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-black transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-4 lg:hidden">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {items.map((item) => (
              <RailItem
                key={item.clientId}
                item={item}
                isActive={item.clientId === activeItem?.clientId}
                compact
                onClick={() => onActiveItemChange(item.clientId)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="min-w-0">
          {activeReady ? (
            <>
              <ImageComparison
                originalUrl={activeItem.originalUrl!}
                restoredUrl={activeItem.restoredUrl!}
                onStartOver={onStartOver}
                onDownload={onDownload}
                showStartOver={false}
              />
              {activeItem.restorationId && (
                <div className="mx-auto mt-3 flex max-w-4xl justify-center">
                  <a
                    href={`/dashboard/memory-book?sourceType=restoration&sourceId=${activeItem.restorationId}`}
                    className="inline-flex items-center rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
                  >
                    Add to Family Heritage keepsake
                  </a>
                </div>
              )}
            </>
          ) : (
            <ActiveProcessingSurface item={activeItem} />
          )}
        </div>

        <aside className="hidden rounded-xl border border-gray-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm lg:block">
          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-gray-900">Photo queue</h3>
            <span className="text-xs text-gray-500">
              {completedCount}/{items.length}
            </span>
          </div>
          <div className="space-y-2">
            {items.map((item) => (
              <RailItem
                key={item.clientId}
                item={item}
                isActive={item.clientId === activeItem?.clientId}
                onClick={() => onActiveItemChange(item.clientId)}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}