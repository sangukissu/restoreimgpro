"use client"

import { useState } from "react"
import { FAMILY_PORTRAIT_THEMES, ThemeCategory } from "@/lib/family-portrait/themes"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface SceneSelectorProps {
  selectedThemeId: string
  onSelectTheme: (themeId: string) => void
  onContinue: () => void
}

const CATEGORIES: ThemeCategory[] = [
  "All",
  "Studio",
  "Formal",
  "Cozy",
  "Outdoor",
  "Lifestyle",
  "Retro",
  "Holiday",
  "Royal",
  "Fine Art",
]

export default function SceneSelector({
  selectedThemeId,
  onSelectTheme,
  onContinue,
}: SceneSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>("All")

  const filteredThemes = FAMILY_PORTRAIT_THEMES.filter((theme) => {
    if (activeCategory === "All") return true
    return theme.category === activeCategory
  })

  return (
    <div className="flex h-full min-h-0 flex-col animate-in fade-in duration-300">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        <div className="space-y-6 pb-5">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border-0 ${isActive
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {cat}
            </button>
          )
        })}
          </div>

      {/* Grid of Theme Cards — Clean thin borders, zero filthy shadows */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredThemes.map((theme) => {
          const isSelected = selectedThemeId === theme.id

          return (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className={`group relative border rounded-2xl p-5 transition-all flex flex-col justify-between overflow-hidden bg-white shadow-none ${isSelected
                ? "border-[#FF4D00] ring-1 ring-[#FF4D00]/30"
                : "border-gray-200 hover:border-gray-300"
                }`}
            >
              {/* Header Badge & Icon */}
              <div className="flex items-start justify-between mb-3 z-10 cursor-pointer">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.previewColor} text-white flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform`}
                >
                  {theme.name.charAt(0)}
                </div>
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-[#FF4D00] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : theme.badge ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-800 border border-orange-200">
                    {theme.badge}
                  </span>
                ) : null}
              </div>

              {/* Body */}
              <div className="space-y-1.5 z-10 cursor-pointer">
                <h3 className="font-bold text-gray-900 text-base group-hover:text-[#FF4D00] transition-colors">
                  {theme.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {theme.description}
                </p>
              </div>

              {/* Decorative Subtle Background Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${theme.previewColor} opacity-5 group-hover:opacity-10 transition-opacity`}
              />
            </div>
          )
        })}
          </div>

        </div>
      </div>

      {/* Action Footer */}
      <div className="relative z-10 -mx-3 flex shrink-0 justify-end border-t border-gray-200 bg-white px-3 pt-3 sm:-mx-5 sm:px-5">
        <Button
          type="button"
          onClick={onContinue}
          className="min-h-11 w-full border-0 bg-black text-white hover:bg-black/90 sm:w-auto"
        >
          <span className="sm:hidden">Continue</span>
          <span className="hidden sm:inline">Continue to Upload Photos &rarr;</span>
        </Button>
      </div>
    </div>
  )
}
