import { createElement, useCallback, useEffect, useRef, useState } from "react"
import { ImageCropDialog } from "@/components/ui/image-crop-dialog"

interface UseImageCropOptions {
  aspectRatio?: number
  onCropped: (file: File) => void
  onSkipped?: (file: File) => void
  onCancel?: () => void
  onAllProcessed?: () => void
}

export function useImageCrop({
  aspectRatio,
  onCropped,
  onSkipped,
  onCancel,
  onAllProcessed,
}: UseImageCropOptions) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const open = pendingFiles.length > 0
  const callbacksRef = useRef({ onCropped, onSkipped, onCancel, onAllProcessed })

  useEffect(() => {
    callbacksRef.current = { onCropped, onSkipped, onCancel, onAllProcessed }
  }, [onCropped, onSkipped, onCancel, onAllProcessed])

  const startCropping = useCallback((files: File[] | FileList) => {
    const nextFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
    setPendingFiles(nextFiles)
  }, [])

  const close = useCallback(() => {
    setPendingFiles([])
  }, [])

  const handleConfirm = useCallback((file: File) => {
    callbacksRef.current.onCropped(file)
  }, [])

  const handleSkip = useCallback((file: File) => {
    const skippedHandler = callbacksRef.current.onSkipped || callbacksRef.current.onCropped
    skippedHandler(file)
  }, [])

  const handleCancel = useCallback(() => {
    close()
    callbacksRef.current.onCancel?.()
  }, [close])

  const handleAllProcessed = useCallback(() => {
    close()
    callbacksRef.current.onAllProcessed?.()
  }, [close])

  const CropDialog = useCallback(
    () =>
      createElement(ImageCropDialog, {
        files: pendingFiles,
        open,
        aspectRatio,
        onConfirm: handleConfirm,
        onSkip: handleSkip,
        onCancel: handleCancel,
        onAllProcessed: handleAllProcessed,
      }),
    [aspectRatio, handleAllProcessed, handleCancel, handleConfirm, handleSkip, open, pendingFiles],
  )

  return {
    pendingFiles,
    open,
    startCropping,
    CropDialog,
  }
}