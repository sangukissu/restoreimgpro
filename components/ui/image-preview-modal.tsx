"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { X } from "lucide-react"
import { downloadImage } from "@/lib/utils"
import { toast } from "sonner"

interface ImagePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  prompt: string
}

export function ImagePreviewModal({ isOpen, onClose, imageUrl, prompt }: ImagePreviewModalProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden"
    } else {
      // Restore scrolling when modal is closed
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const filename = `coloring-page-${prompt.slice(0, 20).replace(/[^a-z0-9]/gi, "-")}.png`

    try {
      await downloadImage(imageUrl, filename)
      toast.success("Image downloaded successfully")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download image")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto p-0 overflow-hidden">
        <div className="absolute right-2 top-2 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-secondary backdrop-blur-sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="relative flex flex-col items-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div className="max-h-[80vh] overflow-auto p-1">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={prompt}
              className="max-w-full h-auto object-contain"
              onLoad={() => setLoading(false)}
            />
          </div>
          <div className="w-full flex justify-between items-center p-4 bg-background">
            <p className="text-sm font-medium truncate max-w-[70%]">{prompt}</p>
            <Button size="sm" onClick={handleDownload}>
              <Icons.download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
