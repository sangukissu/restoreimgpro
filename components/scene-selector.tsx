"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export type HolidayStyle = "holiday_hearth" | "winter_morning" | "tree_trimming" | "vintage_1990"

interface SceneSelectorProps {
    selectedStyle: HolidayStyle
    onSelect: (style: HolidayStyle) => void
}

const SCENES: { id: HolidayStyle; title: string; description: string; color: string }[] = [
    {
        id: "holiday_hearth",
        title: "Classic Hearth",
        description: "Warm fire, stockings, and rich red & green tones.",
        color: "bg-[#3E2723]", // Dark brown/warm
    },
    {
        id: "winter_morning",
        title: "Winter Morning",
        description: "Soft natural light, snowy window, minimalist Nordic decor.",
        color: "bg-[#CFD8DC]", // Blue-grey
    },
    {
        id: "tree_trimming",
        title: "Tree Trimming",
        description: "Gathered around a lit Christmas tree. Cozy and intimate.",
        color: "bg-[#1B5E20]", // Forest green
    },
    {
        id: "vintage_1990",
        title: "Vintage 1990",
        description: "Film grain, flash photography, and retro holiday vibes.",
        color: "bg-[#B71C1C]", // Retro red
    },
]

export function SceneSelector({ selectedStyle, onSelect }: SceneSelectorProps) {
    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="block text-lg font-semibold text-black flex items-center gap-2">
                <span>Choose your Holiday Scene</span>
                <span className="text-xs font-normal text-white bg-red-600 px-2 py-0.5 rounded-full">Limited Time</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SCENES.map((scene) => {
                    const isSelected = selectedStyle === scene.id
                    return (
                        <button
                            key={scene.id}
                            onClick={() => onSelect(scene.id)}
                            className={cn(
                                "relative group flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left overflow-hidden",
                                isSelected
                                    ? "border-red-600 bg-red-50 ring-1 ring-red-600 shadow-md"
                                    : "border-gray-200 hover:border-red-200 hover:bg-gray-50"
                            )}
                        >
                            {/* Fake visual preview (color block) - in real app, use an image */}
                            <div className={cn("absolute top-0 right-0 w-16 h-16 opacity-10 rounded-bl-full transition-transform group-hover:scale-110", scene.color)} />

                            <div className="flex justify-between w-full items-start z-10">
                                <span className={cn("font-bold text-base", isSelected ? "text-red-900" : "text-gray-900")}>
                                    {scene.title}
                                </span>
                                {isSelected && (
                                    <div className="bg-red-600 text-white rounded-full p-0.5">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                            </div>

                            <p className={cn("text-xs mt-1 z-10 pr-4", isSelected ? "text-red-800" : "text-gray-500")}>
                                {scene.description}
                            </p>
                        </button>
                    )
                })}
            </div>
            <p className="text-xs text-gray-500 italic">
                *Our AI will automatically adjust lighting and shadows to match the scene.
            </p>
        </div>
    )
}
