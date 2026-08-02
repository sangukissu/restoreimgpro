"use client"

import { useEffect, useState, type ReactNode } from "react"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

interface ReferencePhotoGalleryProps {
  files: File[]
  onRemove?: (index: number) => void
  trailingItem?: ReactNode
  compact?: boolean
  previewable?: boolean
  className?: string
}

export default function ReferencePhotoGallery({
  files,
  onRemove,
  trailingItem,
  compact = false,
  previewable = true,
  className,
}: ReferencePhotoGalleryProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    const nextUrls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls(nextUrls)

    return () => nextUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [files])

  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= files.length) {
      setSelectedIndex(files.length > 0 ? files.length - 1 : null)
    }
  }, [files.length, selectedIndex])

  const selectedUrl = selectedIndex === null ? null : previewUrls[selectedIndex]

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-3 sm:grid-cols-4",
          compact && "grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8",
          className
        )}
      >
        {files.map((file, index) => (
          <div
            key={`${file.name}:${file.size}:${file.lastModified}:${index}`}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
          >
            <div
              className={cn(
                "relative block w-full overflow-hidden bg-gray-100 text-left",
                compact ? "aspect-square" : "h-36",
                previewable &&
                  "cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00] focus-visible:ring-inset"
              )}
              {...(previewable
                ? {
                    role: "button",
                    tabIndex: 0,
                    onClick: () => setSelectedIndex(index),
                    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        setSelectedIndex(index)
                      }
                    },
                    "aria-label": `Preview reference photo ${index + 1}`,
                  }
                : {})}
            >
              {previewUrls[index] ? (
                <img
                  src={previewUrls[index]}
                  alt={`Reference photo ${index + 1}`}
                  className={cn(
                    "h-full w-full object-cover",
                    previewable &&
                      "transition-transform duration-200 group-hover:scale-[1.03]"
                  )}
                />
              ) : null}
              {previewable ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20 group-focus-within:bg-black/20">
                  <span className="flex h-9 w-9 scale-90 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100">
                    <ZoomIn className="h-4 w-4" />
                  </span>
                </span>
              ) : null}
              <span className="absolute left-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-black/75 px-1.5 text-[11px] font-bold text-white">
                {index + 1}
              </span>
              <span className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-2 py-1 text-center text-[10px] font-semibold text-white">
                Reference {index + 1}
              </span>
            </div>

            {onRemove ? (
              <button
                type="button"
                aria-label={`Remove reference photo ${index + 1}`}
                onClick={() => onRemove(index)}
                className="absolute right-2 top-2 z-10 rounded-full bg-black/80 p-1 text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        ))}

        {trailingItem}
      </div>

      {previewable ? (
        <Dialog
          open={selectedIndex !== null}
          onOpenChange={(open) => !open && setSelectedIndex(null)}
        >
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-5xl overflow-hidden border-white/10 bg-neutral-950 p-0 text-white shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)]"
        >
          <DialogTitle className="sr-only">
            {selectedIndex === null
              ? "Reference photo preview"
              : `Reference photo ${selectedIndex + 1} preview`}
          </DialogTitle>

          <div className="relative flex min-h-0 items-center justify-center">
            {selectedUrl ? (
              <img
                src={selectedUrl}
                alt={
                  selectedIndex === null
                    ? "Reference photo preview"
                    : `Reference photo ${selectedIndex + 1} enlarged preview`
                }
                className="max-h-[calc(100dvh-4.5rem)] w-full object-contain sm:max-h-[calc(100dvh-5.5rem)]"
              />
            ) : null}

            <DialogClose asChild>
              <button
                type="button"
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/75 text-white backdrop-blur-sm transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close photo preview"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>

            {files.length > 1 && selectedIndex !== null ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIndex((selectedIndex - 1 + files.length) % files.length)
                  }
                  className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition-colors hover:bg-black sm:left-4"
                  aria-label="Preview previous reference photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIndex((selectedIndex + 1) % files.length)}
                  className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition-colors hover:bg-black sm:right-4"
                  aria-label="Preview next reference photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            ) : null}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm text-white/80">
            <span className="truncate pr-4">
              {selectedIndex === null ? "Reference photo" : files[selectedIndex]?.name}
            </span>
            <span className="shrink-0 font-semibold text-white">
              {selectedIndex === null ? 0 : selectedIndex + 1} / {files.length}
            </span>
          </div>
        </DialogContent>
        </Dialog>
      ) : null}
    </>
  )
}
