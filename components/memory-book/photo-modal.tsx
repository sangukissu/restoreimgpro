"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import styles from "./memory-book.module.css"

export interface MemoryPhoto {
  src: string
  alt: string
  caption: string
}

interface PhotoModalProps {
  photo: MemoryPhoto | null
  onClose: () => void
}

export function PhotoModal({ photo, onClose }: PhotoModalProps) {
  useEffect(() => {
    if (!photo) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, photo])

  return (
    <AnimatePresence>
      {photo ? (
        <motion.div
          className={styles.photoModalBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          onPointerUp={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
        >
          <motion.div
            className={styles.photoModal}
            initial={{ opacity: 0, scale: 0.92, y: 24, rotateX: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            onPointerUp={(event) => event.stopPropagation()}
          >
            <button type="button" className={styles.photoModalClose} onClick={onClose} aria-label="Close photo">
              <X size={18} strokeWidth={2} />
            </button>

            <div className={styles.photoModalImageWrap}>
              <img src={photo.src} alt={photo.alt} draggable={false} />
            </div>

            <div className={styles.photoModalCaption}>
              <span>Memory print</span>
              <p>{photo.caption}</p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
