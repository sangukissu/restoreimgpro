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
    <div className="flex h-full min-h-full w-full items-center justify-center bg-[#f7f5f1] text-gray-400">
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="space-y-4 sm:space-y-5">
          {/* Header/Info */}
          <div className="text-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {activeHeadline(item?.status)}
            </p>
          </div>

          {/* Image Display */}
          <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[400px] lg:h-[480px] rounded-xl overflow-hidden border border-gray-200/50 bg-[#f7f5f1] shadow-inner flex justify-center">
            {preview ? (
              <img
                src={preview}
                alt={item?.fileName || "Selected photo"}
                className="absolute inset-0 h-full w-full object-contain p-2 sm:p-3"
              />
            ) : (
              <PhotoPlaceholder />
            )}

            {/* Gradient Overlay & Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-gray-900 shadow-sm">
              <StatusIcon status={item?.status || "selected"} />
              {statusLabel(item?.status || "selected")}
            </div>

            {!failed && (
              <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/85 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                {submitted ? "Safe to leave" : "Submitting"}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center mx-auto max-w-md">
            <p className="truncate text-sm font-semibold text-gray-800">
              {item?.fileName || "Photo restore"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {activeMessage(item?.status)}
            </p>
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
        className={`w-24 shrink-0 rounded-xl p-1.5 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
          isActive 
            ? "border border-brand-black ring-1 ring-brand-black bg-white shadow-sm" 
            : "border border-gray-200/80 bg-white/50 hover:border-gray-300 hover:bg-white/80 hover:shadow-xs"
        }`}
      >
        <div className="relative aspect-square overflow-hidden rounded-lg bg-[#f7f5f1]">
          {preview ? (
            <img src={preview} alt={item.fileName} className="h-full w-full object-cover" />
          ) : (
            <PhotoPlaceholder compact />
          )}
          <span className="absolute bottom-1 left-1 rounded-full bg-white/95 p-0.5 shadow-sm">
            <StatusIcon status={item.status} />
          </span>
        </div>
        <p className={`mt-1.5 truncate text-[11px] ${isActive ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}>
          {item.fileName}
        </p>
        <p className="text-[10px] text-gray-500 font-medium">{statusLabel(item.status)}</p>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
        isActive 
          ? "border border-brand-black ring-1 ring-brand-black bg-white shadow-sm" 
          : "border border-gray-200/80 bg-white/50 hover:border-gray-300 hover:bg-white/80 hover:shadow-xs"
      }`}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f7f5f1]">
        {preview ? (
          <img src={preview} alt={item.fileName} className="h-full w-full object-cover" />
        ) : (
          <PhotoPlaceholder compact />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm ${isActive ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
          {item.fileName}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <StatusIcon status={item.status} />
          <span>{statusLabel(item.status)}</span>
        </div>
        {item.error && <p className="mt-1 line-clamp-2 text-[11px] text-red-600 font-medium">{item.error}</p>}
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
  const activeReady = activeItem?.status === "completed" && activeItem.originalUrl && activeItem.restoredUrl

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        {/* Main active item area */}
        <div className="flex flex-col gap-4 min-w-0">
          
          {/* Comparison or processing surface */}
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
            ) : (
              <ActiveProcessingSurface item={activeItem} />
            )}
          </div>

          {/* Mobile View: Horizontal queue of images below the compare area */}
          <div className="lg:hidden mt-2 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-4 shadow-xs">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <span className="text-sm font-bold text-gray-900">Photo queue</span>
                <span className="ml-2 text-[11px] font-medium text-gray-500">
                  {completedCount}/{items.length} ready
                </span>
              </div>
              <Button
                onClick={onStartOver}
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-full text-xs font-bold border-gray-200 hover:bg-gray-50"
              >
                + Restore more
              </Button>
            </div>
            
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-thin">
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

        {/* Desktop View: Sidebar on the right */}
        <aside className="hidden rounded-2xl border border-gray-200/80 bg-white/80 p-4 shadow-xs backdrop-blur-sm lg:block">
          <div className="mb-4 flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Photo queue</h3>
              <p className="text-[11px] font-medium text-gray-500">
                {completedCount} of {items.length} ready
              </p>
            </div>
            <Button 
              onClick={onStartOver} 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 rounded-full text-xs font-bold border-gray-200 bg-white hover:bg-gray-50 shadow-xs"
            >
              + Restore
            </Button>
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