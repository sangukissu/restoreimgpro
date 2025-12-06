"use client"

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

const predefinedColors = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-8 h-8 rounded-lg border bg-background border-input shadow-sm hover:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2"
        style={{ backgroundColor: value }}
        type="button"
      />

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-12 left-0 z-20 p-3 bg-white rounded-lg shadow-xs border border-gray-200">
            <div className="grid grid-cols-5 gap-2 mb-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "cursor-pointer w-8 h-8 rounded border-2 transition-transform hover:scale-110",
                    value === color ? "border-blue-500" : "border-gray-300"
                  )}
                  style={{ backgroundColor: color }}
                  type="button"
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                placeholder="#000000"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}