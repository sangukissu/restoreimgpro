"use client"

import { useCallback, useEffect, useState } from "react"
import type { MemoryBookDocumentV1 } from "@/lib/memory-book/types"
import {
  FamilyHeritageViewer,
  type MemoryBookAssetSource,
} from "./family-heritage-viewer"
import type { MarginaliaNote } from "./marginalia"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function PublicMemoryBook({
  document,
  assetSources,
  shareId,
}: {
  document: MemoryBookDocumentV1
  assetSources: MemoryBookAssetSource[]
  shareId: string
}) {
  const [notes, setNotes] = useState<MarginaliaNote[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [note, setNote] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [justSent, setJustSent] = useState(false)

  // Load all visible margin notes for this keepsake.
  useEffect(() => {
    let cancelled = false
    fetch(`/api/memory-books/share/${shareId}/reactions`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { notes: [] }))
      .then((data: { notes?: MarginaliaNote[] }) => {
        if (!cancelled && Array.isArray(data.notes)) setNotes(data.notes)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [shareId])

  const bookComplete = pageIndex >= maxIndex && maxIndex > 1

  const openModal = useCallback(() => {
    setError("")
    setNote("")
    setModalOpen(true)
  }, [])

  const submitNote = useCallback(async () => {
    setSending(true)
    setError("")
    try {
      const response = await fetch(
        `/api/memory-books/share/${shareId}/reactions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reaction: "love",
            displayName,
            note,
            pageIndex: null,
          }),
        }
      )
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Unable to save note")
      }
      if (result.note) {
        setNotes((prev) => [...prev, result.note as MarginaliaNote])
      }
      setModalOpen(false)
      setJustSent(true)
      setTimeout(() => setJustSent(false), 3000)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to save note"
      )
    } finally {
      setSending(false)
    }
  }, [displayName, note, shareId])

  return (
    <main className="bg-[#f8f5ef] w-full h-svh overflow-hidden relative">
      <FamilyHeritageViewer
        className="publicViewer"
        document={document}
        assetSources={assetSources}
        notes={notes}
        onPageChange={(index, max) => {
          setPageIndex(index)
          setMaxIndex(max)
        }}
      />

      {/* Hairline text button appears only when the book is fully closed. */}
      {bookComplete && !modalOpen ? (
        <button
          type="button"
          onClick={openModal}
          className="absolute bottom-6 right-6 z-30 font-manrope text-[12px] tracking-[0.12em] uppercase text-black/45 hover:text-black/80 transition-colors bg-[#f8f5ef]/60 backdrop-blur-sm px-3 py-1.5 rounded-full cursor-pointer"
        >
          + leave a note
        </button>
      ) : null}

      {justSent ? (
        <p className="absolute bottom-6 right-6 z-30 font-serif italic text-[14px] text-[#315d55] pointer-events-none">
          your note is in the book.
        </p>
      ) : null}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          showCloseButton
          className="bg-[#faf8f3] border-black/8 sm:max-w-md rounded-lg"
        >
          <DialogTitle className="font-serif italic text-[20px] text-[#2b2826]">
            Leave a note in the book
          </DialogTitle>
          <DialogDescription className="text-[13px] text-black/45">
            Your note will appear as a handwritten page at the end of this
            keepsake, for your family to read.
          </DialogDescription>

          <div className="mt-2 grid gap-3">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={60}
              placeholder="Your name"
              className="w-full bg-transparent border-b border-black/15 outline-none font-serif italic text-[16px] text-[#2b2826] py-2 placeholder:text-black/30 focus:border-[#315d55] transition-colors"
            />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={160}
              rows={4}
              placeholder="Write something for the family…"
              className="w-full resize-none bg-transparent border-b border-black/15 outline-none font-serif italic text-[16px] text-[#2b2826] py-2 placeholder:text-black/30 focus:border-[#315d55] transition-colors leading-snug"
            />
            <p className="text-[10px] text-black/30 text-right font-manrope">
              {note.length}/160
            </p>
          </div>

          {error ? (
            <p className="mt-1 text-xs text-red-700">{error}</p>
          ) : null}

          <div className="mt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="font-manrope text-[12px] tracking-wide text-black/40 hover:text-black/70 transition-colors cursor-pointer"
            >
              cancel
            </button>
            <button
              type="button"
              onClick={submitNote}
              disabled={sending}
              className="font-manrope text-[12px] font-semibold tracking-wide text-[#315d55] hover:text-black transition-colors disabled:opacity-50 cursor-pointer"
            >
              {sending ? "Writing…" : "Add to the book →"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}