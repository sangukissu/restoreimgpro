"use client"

import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react"
import ImageComparison from "@/components/image-comparison"
import { Button } from "@/components/ui/button"
import { OrbitSepiaDust } from "@/components/ui/orbit-sepia-dust"

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

export default function BatchComparisonWorkspace({
  items,
  activeItemId,
  onActiveItemChange,
  onStartOver,
  onDownload,
}: BatchComparisonWorkspaceProps) {
  const activeItem = items.find((item) => item.clientId === activeItemId)
  const completedCount = items.filter((item) => item.status === "completed").length
  const activeReady = activeItem?.status === "completed" && activeItem.originalUrl && activeItem.restoredUrl

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <p className="text-sm font-medium text-gray-500">Batch restoration</p>
          <h2 className="text-xl font-semibold text-black">
            {completedCount} of {items.length} photos ready
          </h2>
        </div>
        <Button onClick={onStartOver} variant="outline" className="rounded-md">
          Restore more
        </Button>
      </div>

      {activeReady ? (
        <>
          <ImageComparison
            originalUrl={activeItem.originalUrl!}
            restoredUrl={activeItem.restoredUrl!}
            onStartOver={onStartOver}
            onDownload={onDownload}
          />
          {activeItem.restorationId && (
            <div className="mx-auto flex max-w-5xl justify-center">
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
        <div className="mx-auto w-full max-w-2xl">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-gray-800 bg-black p-10 text-center">
            <div className="absolute inset-0">
              <OrbitSepiaDust />
            </div>
            <div className="relative z-10 space-y-3">
              <h3 className="font-inter text-2xl font-semibold text-white">
                Giving one more life to your past...
              </h3>
              <p className="text-sm text-gray-100">
                Your photos are restoring. The first finished result will appear here automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white/70 p-3 backdrop-blur-sm">
        <div className="flex min-w-max gap-3">
          {items.map((item) => {
            const preview = item.originalUrl || item.localPreviewUrl
            const isActive = item.clientId === activeItemId
            const isSelectable = item.status === "completed"

            return (
              <button
                key={item.clientId}
                type="button"
                onClick={() => isSelectable && onActiveItemChange(item.clientId)}
                disabled={!isSelectable}
                className={`w-40 shrink-0 rounded-lg border p-2 text-left transition ${
                  isActive ? "border-black bg-white shadow-sm" : "border-gray-200 bg-white/70"
                } ${isSelectable ? "hover:border-gray-500" : "cursor-default opacity-80"}`}
              >
                <div className="mb-2 aspect-square overflow-hidden rounded-md bg-gray-100">
                  {preview ? (
                    <img src={preview} alt={item.fileName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No preview</div>
                  )}
                </div>
                <p className="truncate text-xs font-semibold text-gray-900">{item.fileName}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <StatusIcon status={item.status} />
                  <span>{statusLabel(item.status)}</span>
                </div>
                {item.error && <p className="mt-1 line-clamp-2 text-xs text-red-600">{item.error}</p>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
