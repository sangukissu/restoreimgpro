"use client"

import { motion } from "framer-motion"
import { BotanicalSvg } from "./botanical-svg"
import { ButterflySvg } from "./butterfly-svg"
import { PencilsSvg } from "./pencils-svg"
import { Polaroid } from "./polaroid"
import styles from "./memory-book.module.css"

interface DecorativeSceneProps {
  isBookOpen: boolean
}

export function DecorativeScene({ isBookOpen }: DecorativeSceneProps) {
  return (
    <div className={styles.decorativeScene} aria-hidden="true">
      <motion.div
        className={[styles.stageFlowers, isBookOpen ? styles.stageFlowersOpen : ""].join(" ")}
        initial={false}
        animate={isBookOpen ? { rotate: -8, y: 18, scale: 1.08 } : { rotate: -3, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.645, 0.045, 0.355, 1] }}
      >
        <BotanicalSvg />
      </motion.div>
      <PencilsSvg className={[styles.stagePencils, isBookOpen ? styles.stagePencilsOpen : ""].join(" ")} />
      <ButterflySvg className={styles.stageButterfly} />

      <div className={styles.topRightPolaroids}>
        <Polaroid src="/old-image3.webp" alt="" rotation={8} compact />
        <Polaroid src="/avatar1.webp" alt="" rotation={-8} compact />
      </div>

      <div className={styles.bottomLeftPolaroids}>
        <Polaroid src="/family-photo2.jpg" alt="" rotation={-7} compact />
        <Polaroid src="/family-photo4.png" alt="" rotation={5} compact />
      </div>
    </div>
  )
}
