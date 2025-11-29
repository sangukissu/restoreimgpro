"use client"

import { Snowflake, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

interface HolidayModeToggleProps {
    isHolidayMode: boolean
    onToggle: (value: boolean) => void
}

export function HolidayModeToggle({ isHolidayMode, onToggle }: HolidayModeToggleProps) {
    return (
        <div className="flex items-center justify-center w-full mb-8">
            <div className="relative bg-gray-100 p-1 rounded-full flex items-center cursor-pointer shadow-inner border border-gray-200">
                {/* Sliding Background */}
                <div
                    className={cn(
                        "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-out shadow-sm",
                        isHolidayMode
                            ? "left-[50%] bg-gradient-to-r from-red-600 to-green-700"
                            : "left-1 bg-white"
                    )}
                />

                {/* Standard Option */}
                <button
                    onClick={() => onToggle(false)}
                    className={cn(
                        "relative z-10 flex items-center gap-2 px-6 py-2 rounded-full transition-colors duration-300",
                        !isHolidayMode ? "text-black font-semibold" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Camera className="w-4 h-4" />
                    <span className="text-sm">Studio</span>
                </button>

                {/* Holiday Option */}
                <button
                    onClick={() => onToggle(true)}
                    className={cn(
                        "relative z-10 flex items-center gap-2 px-6 py-2 rounded-full transition-colors duration-300",
                        isHolidayMode ? "text-white font-bold" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <span className="text-sm">Holiday Magic</span>
                </button>
            </div>
        </div>
    )
}
