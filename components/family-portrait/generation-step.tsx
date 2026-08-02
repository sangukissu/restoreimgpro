"use client"

import { Button } from "@/components/ui/button"
import { Coins, Loader2, Download, BookOpen, ExternalLink, RefreshCw } from "lucide-react"
import { getThemeById } from "@/lib/family-portrait/themes"
import type { ClothingMode } from "@/lib/family-portrait/themes"

export type AspectRatio = "1:1" | "3:4" | "4:3" | "16:9"

interface GenerationStepProps {
  themeId: string
  personCount: number
  petCount: number
  clothingMode: ClothingMode
  filesCount: number
  aspectRatio: AspectRatio
  userCredits: number
  isLoading: boolean
  uploadStatus: string | null
  resultUrl: string | null
  familyPortraitId: string | null
  error: string | null
  onChangeAspectRatio: (ratio: AspectRatio) => void
  onGenerate: () => void
  onDownload: () => void
  onReset: () => void
  onBack: () => void
}

export default function GenerationStep({
  themeId,
  personCount,
  petCount,
  clothingMode,
  filesCount,
  aspectRatio,
  userCredits,
  isLoading,
  uploadStatus,
  resultUrl,
  familyPortraitId,
  error,
  onChangeAspectRatio,
  onGenerate,
  onDownload,
  onReset,
  onBack,
}: GenerationStepProps) {
  const theme = getThemeById(themeId)
  const totalSubjectCount = personCount + petCount
  const isWideCanvasRequired = totalSubjectCount > 6
  const isNarrowDisabled = personCount >= 3

  return (
    <div className="flex h-full min-h-0 flex-col animate-in fade-in duration-300">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
      {/* Result Display State */}
      {resultUrl ? (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-2xl flex items-center justify-between">
            <span className="font-bold text-sm">Family Portrait Generated!</span>
            <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-bold">
              Success
            </span>
          </div>

          {/* Generated Image Container — Clean thin border, no heavy shadow */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-black/5 max-w-4xl mx-auto">
            <img
              src={resultUrl}
              alt="Generated Family Portrait"
              className="w-full h-auto object-contain max-h-[700px] mx-auto"
            />
          </div>

        </div>
      ) : isLoading ? (
        /* Loading State */
        <div className="border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-12 text-center space-y-4 my-6 min-h-[320px] flex flex-col items-center justify-center">
          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
            <Loader2 className="w-7 h-7 text-[#FF4D00] animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">
              {uploadStatus || "Composing your family portrait..."}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Our AI engine is matching 1-to-1 facial identity features, wardrobe, and lighting harmonization. This takes ~1 minute.
            </p>
          </div>
        </div>
      ) : (
        /* Configuration & Synthesis Launcher */
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Summary & Aspect Ratio */}
          <div className="space-y-6">
            {/* Selected Summary Card */}
            <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Configuration Summary
              </h4>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-gray-500">Selected Theme</p>
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {theme.name}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-gray-500">Family Members</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {personCount} Person(s) {petCount > 0 ? `+ ${petCount} Pet(s)` : ""}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-gray-500">Clothing</p>
                  <p className={`font-bold text-sm ${clothingMode === "preserve" ? "text-emerald-700" : "text-violet-700"}`}>
                    {clothingMode === "preserve" ? "Preserve Original" : "Restyle"}
                  </p>
                </div>
              </div>

            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900">
                Choose Canvas Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["1:1", "3:4", "4:3", "16:9"] as AspectRatio[]).map((ratio) => {
                  const disabled = isWideCanvasRequired
                    ? ratio !== "16:9"
                    : (ratio === "1:1" || ratio === "3:4") && isNarrowDisabled
                  const selected = aspectRatio === ratio
                  return (
                    <button
                      key={ratio}
                      type="button"
                      disabled={disabled}
                      onClick={() => onChangeAspectRatio(ratio)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${selected
                        ? "border-[#FF4D00] bg-orange-50/40 text-[#FF4D00] ring-1 ring-[#FF4D00]/30"
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      {ratio}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-gray-500">
                {isWideCanvasRequired
                  ? `16:9 is required for ${totalSubjectCount} people and pets so the group has enough horizontal space.`
                  : isNarrowDisabled
                  ? "For 3 or more people, wider ratios (4:3 or 16:9) provide optimal group composition."
                  : "Square (1:1) and Portrait (3:4) work best for 1–2 individuals."}
              </p>
            </div>
          </div>

          {/* Right Column: Execution CTA */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-white space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-gray-900">Ready to Synthesize</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Clicking generate will synthesize your reference photos into a single unified family portrait.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between text-xs border border-gray-100">
              <span className="text-gray-600 font-medium">Generation Cost:</span>
              <span className="font-extrabold text-gray-900 text-sm">2 Credits</span>
            </div>

            <p className="text-xs text-gray-500">
              Review these settings, then use the always-visible action below when you are ready.
            </p>
          </div>
        </div>
      )}
      </div>

      {/* Navigation Footer */}
      {!isLoading && (
        <div className="relative z-10 -mx-3 shrink-0 border-t border-gray-200 bg-white px-3 pt-3 sm:-mx-5 sm:px-5">
          {error && !resultUrl ? (
            <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-center text-xs font-medium text-rose-700">
              {error}
            </div>
          ) : null}

          {resultUrl ? (
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
              <Button
                type="button"
                onClick={onDownload}
                className="min-h-11 border-0 bg-black text-xs font-bold text-white hover:bg-black/90 sm:px-6 sm:text-sm"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>

              {familyPortraitId ? (
                <a
                  href={`/dashboard/memory-book?sourceType=family_portrait&sourceId=${familyPortraitId}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-50 sm:px-5 sm:text-sm"
                >
                  <BookOpen className="h-4 w-4 text-[#FF4D00]" />
                  Keepsake
                </a>
              ) : null}

              <a
                href={resultUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-50 sm:px-5 sm:text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Open original
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                className="min-h-11 border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-gray-50 sm:px-5 sm:text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Create another
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="min-h-11 border border-gray-200 bg-white text-black shadow-none"
              >
                &larr; Back
              </Button>

              {userCredits < 2 ? (
                <Button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("open-payment-modal"))}
                  className="min-h-11 flex-1 border-0 bg-[#FF4D00] text-white hover:bg-[#e64500] sm:flex-none"
                >
                  <Coins className="h-4 w-4" />
                  <span className="sm:hidden">Buy credits</span>
                  <span className="hidden sm:inline">Buy Credits to Generate</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={onGenerate}
                  disabled={filesCount === 0}
                  className="min-h-11 flex-1 border-0 bg-black text-white hover:bg-black/90 disabled:opacity-40 sm:flex-none"
                >
                  <span className="sm:hidden">Generate (2 credits)</span>
                  <span className="hidden sm:inline">Generate Family Portrait (2 Credits)</span>
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
