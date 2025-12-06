"use client"

import { useEffect, useState } from "react"

// Simple responsive hook to detect mobile viewport
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`) // Tailwind md breakpoint ~768px

    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches)
    }

    // Initialize and subscribe
    onChange(mql)
    mql.addEventListener("change", onChange as (e: MediaQueryListEvent) => void)

    return () => mql.removeEventListener("change", onChange as (e: MediaQueryListEvent) => void)
  }, [breakpoint])

  return isMobile
}

