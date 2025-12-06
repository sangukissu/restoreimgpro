"use client"

import { patterns, type Pattern, getColoredPattern } from "@/lib/patterns"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface PatternPickerProps {
  value: Pattern | null
  onChange: (pattern: Pattern | null) => void
  baseColor: string
  patternScale?: number
}

export function PatternPicker({ value, onChange, baseColor, patternScale = 1.0 }: PatternPickerProps) {
  const handleColorChange = (newColor: string) => {
    if (value) {
      onChange({
        ...value,
        color: newColor
      })
    }
  }

  const PatternButton = ({ pattern }: { pattern: Pattern }) => {
    const isSelected = value?.id === pattern.id
    const patternColor = isSelected ? value.color : pattern.color
    
    // Handle image patterns differently
    if (pattern.type === "image") {
      const handleClick = () => {
        if (isSelected) {
          return
        }
        onChange(pattern)
      }
      
      return (
        <button
          key={pattern.id}
          className={cn(
            "cursor-pointer aspect-square rounded-md border-2 overflow-hidden relative dark-shadow bg-gray-700",
            isSelected ? "border-primary light-shadow" : "border-black hover:border-gray-400",
          )}
          onClick={handleClick}
        >
          <img
            src={pattern.imageUrl}
            alt={pattern.name}
            className="w-full h-full object-cover"
            style={{
              filter: `opacity(0.7)`,
            }}
          />
        </button>
      )
    }
    
    // Handle SVG patterns
    const baseSize = 20
    const scaledSize = Math.max(5, Math.min(100, baseSize * patternScale))
    
    // Generate colored pattern for preview
    const coloredPatternUrl = getColoredPattern(pattern, patternColor)
    
    // Always pass the original pattern object, only update color if needed
    const handleClick = () => {
      if (isSelected) {
        // Already selected, do nothing
        return
      }
      if (value?.color && value?.id === pattern.id) {
        // If color changed, update only color
        onChange({ ...pattern, color: value.color })
      } else {
        onChange(pattern)
      }
    }
    
    return (
      <button
        key={pattern.id}
        className={cn(
          "cursor-pointer aspect-square rounded-md border-2 overflow-hidden relative dark-shadow",
          isSelected ? "border-primary light-shadow" : "border-black hover:border-gray-400",
        )}
        onClick={handleClick}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(\"${coloredPatternUrl}\")`,
            backgroundSize: `${scaledSize}px ${scaledSize}px`,
            filter: `opacity(0.5)`,
          }}
        />
      </button>
    )
  }

  return (
    <div className="space-y-4">
     

      {/* Dynamic Patterns (SVG) */}
      <div>
        <h4 className="font-bold text-xs mb-2">Dynamic Patterns</h4>
        <p className="text-gray-600 text-xs mb-2">Vector-based patterns with customizable colors.</p>
        <div className="grid grid-cols-5 gap-2">
          {patterns.filter(p => p.type !== "image").slice(0, 10).map((pattern) => (
            <PatternButton key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>
  {/* More Dynamic Patterns */}
  {patterns.filter(p => p.type !== "image").length > 10 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="more-dynamic-patterns" className="border-none">
            <AccordionTrigger className="py-2 text-xs font-bold">More Dynamic Patterns</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-5 gap-2 pt-2">
                {patterns.filter(p => p.type !== "image").slice(10).map((pattern) => (
                  <PatternButton key={pattern.id} pattern={pattern} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      {/* Static Patterns (Images) */}
      <div>
        <h4 className="font-bold text-xs mb-2">Static Patterns</h4>
        <p className="text-gray-600 text-xs mb-2">Pre-made image patterns with fixed designs.</p>
        <div className="grid grid-cols-5 gap-2">
          {patterns.filter(p => p.type === "image").slice(0, 10).map((pattern) => (
            <PatternButton key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>

    

      {/* More Static Patterns */}
      {patterns.filter(p => p.type === "image").length > 10 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="more-static-patterns" className="border-none">
            <AccordionTrigger className="py-2 text-xs font-bold">More Static Patterns</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-5 gap-2 pt-2">
                {patterns.filter(p => p.type === "image").slice(10).map((pattern) => (
                  <PatternButton key={pattern.id} pattern={pattern} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {value && value.type !== "image" && (
        <div className="space-y-2">
          <Label htmlFor="patternColor" className="text-xs font-bold">Pattern Color</Label>
          <Input
            id="patternColor"
            type="color"
            value={value.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full dark-shadow border-black border-2 rounded-lg"
          />
        </div>
      )}
    </div>
  )
}