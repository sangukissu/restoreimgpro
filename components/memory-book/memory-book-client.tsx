"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { BookFrame, type MemoryBookSheet } from "./book-frame"
import { BookCover } from "./book-cover"
import { InnerPage } from "./inner-page"
import { MemoryBookStage } from "./memory-book-stage"
import { PageScrapbook } from "./page-scrapbook"
import { PhotoModal, type MemoryPhoto } from "./photo-modal"

export default function MemoryBookClient() {
  const [turnedSheets, setTurnedSheets] = useState(0)
  const [activePhoto, setActivePhoto] = useState<MemoryPhoto | null>(null)

  const sheets = useMemo<MemoryBookSheet[]>(
    () => [
      {
        id: "cover",
        front: <BookCover />,
        back: <InnerPage variant="botanical" />,
      },
      {
        id: "first-story",
        front: <PageScrapbook variant="anniversary" onPhotoOpen={setActivePhoto} />,
        back: <InnerPage variant="botanical" />,
      },
    ],
    []
  )

  const maxSheets = sheets.length

  const goForward = useCallback(() => {
    setTurnedSheets((current) => Math.min(current + 1, maxSheets))
  }, [maxSheets])

  const goBack = useCallback(() => {
    setTurnedSheets((current) => Math.max(current - 1, 0))
  }, [])

  const resetBook = useCallback(() => {
    setTurnedSheets(0)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        goForward()
      }

      if (event.key === "ArrowLeft") {
        goBack()
      }

      if (event.key === "Home") {
        resetBook()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goBack, goForward, resetBook])

  return (
    <>
      <MemoryBookStage isBookOpen={turnedSheets > 0}>
        <BookFrame
          sheets={sheets}
          turnedSheets={turnedSheets}
          finalRightPage={<PageScrapbook variant="keepsake" onPhotoOpen={setActivePhoto} />}
          onBack={goBack}
          onForward={goForward}
        />
      </MemoryBookStage>
      <PhotoModal photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </>
  )
}
