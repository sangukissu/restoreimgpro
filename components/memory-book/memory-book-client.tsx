"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BookFrame, type MemoryBookSheet } from "./book-frame"
import { BookCover } from "./book-cover"
import { InnerPage } from "./inner-page"
import { MemoryBookStage } from "./memory-book-stage"
import { PageScrapbook } from "./page-scrapbook"
import { PhotoModal, type MemoryPhoto } from "./photo-modal"

export default function MemoryBookClient() {
  const turnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const turnLockRef = useRef(false)
  const [turnedSheets, setTurnedSheets] = useState(0)
  const [isTurning, setIsTurning] = useState(false)
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

  const turnTo = useCallback(
    (next: number) => {
      if (turnLockRef.current) {
        return
      }

      const resolved = Math.max(0, Math.min(maxSheets, next))

      setTurnedSheets((current) => {
        if (current === resolved) {
          return current
        }

        turnLockRef.current = true
        setIsTurning(true)
        turnTimerRef.current = setTimeout(() => {
          turnLockRef.current = false
          setIsTurning(false)
        }, 920)

        return resolved
      })
    },
    [maxSheets]
  )

  const goForward = useCallback(() => {
    turnTo(turnedSheets + 1)
  }, [turnTo, turnedSheets])

  const goBack = useCallback(() => {
    turnTo(turnedSheets - 1)
  }, [turnTo, turnedSheets])

  const resetBook = useCallback(() => {
    turnTo(0)
  }, [turnTo])

  useEffect(
    () => () => {
      if (turnTimerRef.current) {
        clearTimeout(turnTimerRef.current)
      }
    },
    []
  )

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
          isTurning={isTurning}
          onBack={goBack}
          onForward={goForward}
        />
      </MemoryBookStage>
      <PhotoModal photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </>
  )
}
