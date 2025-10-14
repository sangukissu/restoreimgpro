"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { IconRefresh, IconUpload } from "@tabler/icons-react"

type UploadDropzoneProps = {
  onSelected: (file: File, objectUrl: string) => void
  previewUrl?: string | null
  onClear?: () => void
  // New props to reduce clutter in the controls column
  compact?: boolean // tighter padding
  showPreview?: boolean // whether to show the image preview inside the dropzone
  hasSelection?: boolean // parent can tell us a file is selected even if preview is hidden
}

export default function UploadDropzone({
  onSelected,
  previewUrl,
  onClear,
  compact = false,
  showPreview = true,
  hasSelection = false,
}: UploadDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [hover, setHover] = React.useState(false)

  function handleFiles(files: FileList | null) {
    if (!files || !files[0]) return
    const file = files[0]
    if (!file.type.startsWith("image/")) return
    const url = URL.createObjectURL(file)
    onSelected(file, url)
  }

  const selected = hasSelection || Boolean(previewUrl)

  return (
    <div
      role="region"
      aria-label="Upload image"
      className={[
        "rounded-lg border bg-card transition-colors",
        compact ? "p-3" : "p-4",
        hover ? "bg-accent" : "",
      ].join(" ")}
      onDragOver={(e) => {
        e.preventDefault()
        setHover(true)
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault()
        setHover(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      {selected ? (
        <div className="flex flex-col items-center gap-3 text-center">
          {showPreview && previewUrl ? (
            <img
              src={previewUrl || "/placeholder.svg?height=200&width=300&query=uploaded%20image%20preview"}
              alt="Selected image preview"
              className="h-40 w-full rounded-md object-contain"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="text-muted-foreground text-sm">Image selected</div>
          )}
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => inputRef.current?.click()}>
              <IconUpload className="h-4 w-4" />
              Change photo
            </Button>
            {onClear ? (
              <Button variant="ghost" onClick={onClear}>
                <IconRefresh className="h-4 w-4" />
                Remove
              </Button>
            ) : null}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFiles(e.currentTarget.files)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-muted-foreground text-sm">Drag and drop an image here, or choose a file.</p>
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            Choose image
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFiles(e.currentTarget.files)}
          />
        </div>
      )}
    </div>
  )
}
