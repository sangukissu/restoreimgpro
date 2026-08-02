"use client"

import { Button } from "@/components/ui/button"
import { Users, Dog, AlertCircle, Plus, Minus, Shirt, ShieldCheck } from "lucide-react"
import type { ClothingMode } from "@/lib/family-portrait/themes"
import ReferencePhotoGallery from "@/components/family-portrait/reference-photo-gallery"

interface QuantitySelectorProps {
  personCount: number
  petCount: number
  files: File[]
  clothingMode: ClothingMode
  themeId: string
  onChangePersonCount: (count: number) => void
  onChangePetCount: (count: number) => void
  onChangeClothingMode: (mode: ClothingMode) => void
  onContinue: () => void
  onBack: () => void
}

export default function QuantitySelector({
  personCount,
  petCount,
  files,
  clothingMode,
  themeId,
  onChangePersonCount,
  onChangePetCount,
  onChangeClothingMode,
  onContinue,
  onBack,
}: QuantitySelectorProps) {
  const isStudioTheme = themeId.startsWith("studio-")

  return (
    <div className="flex h-full min-h-0 flex-col animate-in fade-in duration-300">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        <div className="space-y-6 pb-5">
      {/* Important Advisory Callout */}
      <div className="border border-amber-200 bg-amber-50/70 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-950 space-y-1">
          <p className="font-bold">Identity Preservation Guide</p>
          <p className="text-xs leading-relaxed text-amber-900">
            Please ensure the accuracy of the number of persons and pets by counting total of them across images, which is very important for the generation results.
          </p>
        </div>
      </div>

      {/* Keep references visible here so people can count subjects without going back. */}
      <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Your reference photos</h3>
            <p className="text-xs text-gray-600">Tap any photo for a larger preview while you count.</p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-900 ring-1 ring-gray-200">
            {files.length} {files.length === 1 ? "photo" : "photos"}
          </span>
        </div>
        <ReferencePhotoGallery files={files} compact />
      </div>

      {/* Quantity Stepper Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Person Count */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4 shadow-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Number of People</h4>
              <p className="text-xs text-gray-500">Total family members to generate</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => onChangePersonCount(Math.max(1, personCount - 1))}
              disabled={personCount <= 1}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-base font-bold transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="text-3xl font-extrabold text-gray-900 font-inter">
              {personCount}
            </span>

            <button
              type="button"
              onClick={() => onChangePersonCount(Math.min(12, personCount + 1))}
              disabled={personCount >= 12}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-base font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pet Count */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4 shadow-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF4D00] flex items-center justify-center">
              <Dog className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Number of Pets</h4>
              <p className="text-xs text-gray-500">Dogs, cats, or other family pets</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => onChangePetCount(Math.max(0, petCount - 1))}
              disabled={petCount <= 0}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-base font-bold transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="text-3xl font-extrabold text-gray-900 font-inter">
              {petCount}
            </span>

            <button
              type="button"
              onClick={() => onChangePetCount(Math.min(5, petCount + 1))}
              disabled={petCount >= 5}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-base font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Clothing Mode Toggle */}
      <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4 shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Shirt className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Clothing & Wardrobe</h4>
            <p className="text-xs text-gray-500">
              Choose whether to keep original outfits or re-dress everyone to match the theme
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Preserve Option */}
          <button
            type="button"
            onClick={() => onChangeClothingMode("preserve")}
            className={`relative text-left p-4 rounded-xl border transition-all ${clothingMode === "preserve"
              ? "border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/30"
              : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className={`w-4 h-4 ${clothingMode === "preserve" ? "text-emerald-600" : "text-gray-400"
                }`} />
              <span className={`text-sm font-bold ${clothingMode === "preserve" ? "text-emerald-900" : "text-gray-800"
                }`}>
                Preserve Original Clothing
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Keep each person&apos;s original outfit from their photo. Recommended for maximum face identity retention.
            </p>
            {clothingMode === "preserve" && (
              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Best Face Match
              </span>
            )}
          </button>

          {/* Restyle Option */}
          <button
            type="button"
            onClick={() => onChangeClothingMode("restyle")}
            className={`relative text-left p-4 rounded-xl border transition-all ${clothingMode === "restyle"
              ? "border-violet-500 bg-violet-50/40 ring-1 ring-violet-500/30"
              : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Shirt className={`w-4 h-4 ${clothingMode === "restyle" ? "text-violet-600" : "text-gray-400"
                }`} />
              <span className={`text-sm font-bold ${clothingMode === "restyle" ? "text-violet-900" : "text-gray-800"
                }`}>
                Restyle to Match Theme
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Re-dress everyone into coordinated outfits matching the selected theme.
            </p>
            {clothingMode === "restyle" && (
              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                Creative Mode
              </span>
            )}
          </button>
        </div>

        {isStudioTheme && clothingMode === "restyle" && (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            Studio backgrounds work best with &ldquo;Preserve Original Clothing&rdquo; for maximum face accuracy.
          </p>
        )}
        </div>
      </div>
      </div>

      {/* Navigation Footer */}
      <div className="relative z-10 -mx-3 flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 bg-white px-3 pt-3 sm:-mx-5 sm:px-5">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="min-h-11 border border-gray-200 bg-white text-black shadow-none"
        >
          &larr; Back
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          className="min-h-11 flex-1 border-0 bg-black text-white hover:bg-black/90 sm:flex-none"
        >
          <span className="sm:hidden">Continue</span>
          <span className="hidden sm:inline">Continue to Final Generation &rarr;</span>
        </Button>
      </div>
    </div>
  )
}
