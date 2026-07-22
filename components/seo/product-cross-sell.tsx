import React from "react"
import Link from "next/link"
import { ArrowRight, ScanLine, Users, Sparkles, BookOpen, Palette, Volume2, UserPlus, UserMinus } from "lucide-react"

export type CrossSellLink = {
  href: string
  title: string
  description: string
  icon?: React.ReactNode
}

const DEFAULT_LINKS: CrossSellLink[] = [
  {
    href: "/old-photo-restoration",
    title: "Restore Damage",
    description: "Repair scratches, tears, and sepia fading while preserving authentic facial character.",
    icon: <ScanLine size={22} />,
  },
  {
    href: "/ai-family-portrait",
    title: "Reunite Loved Ones",
    description: "Combine separate individual photos into one natural, high-definition family portrait.",
    icon: <Users size={22} />,
  },
  {
    href: "/add-person-to-photo",
    title: "Add Person to Photo",
    description: "Seamlessly insert a missing relative or passed loved one into an existing family snapshot.",
    icon: <UserPlus size={22} />,
  },
  {
    href: "/colorize-photos",
    title: "Colorize Black & White",
    description: "Bring historical black & white photographs to life with historically accurate realistic colors.",
    icon: <Palette size={22} />,
  },
  {
    href: "/denoise-photos",
    title: "Denoise & Grain Cleanup",
    description: "Remove digital noise, high-ISO grain, and compression artifacts while keeping sharp textures.",
    icon: <Volume2 size={22} />,
  },
  {
    href: "/ai-photo-animation",
    title: "Add Subtle Motion",
    description: "Bring faces to life with natural facial movements, gentle blinks, and authentic smiles.",
    icon: <Sparkles size={22} />,
  },
  {
    href: "/remove-person-from-photo",
    title: "Remove Person or Object",
    description: "Cleanly erase unwanted figures or background clutter with AI context-aware background fill.",
    icon: <UserMinus size={22} />,
  },
  {
    href: "/family-memory-book",
    title: "Preserve the Story",
    description: "Create a private digital keepsake for names, captions, and restored family photos.",
    icon: <BookOpen size={22} />,
  },
]

export function ProductCrossSell({
  excludeHref,
  title = "More Tools to Preserve Your Family Memories",
  links = DEFAULT_LINKS,
}: {
  excludeHref?: string
  title?: string
  links?: CrossSellLink[]
}) {
  const items = links.filter((l) => l.href !== excludeHref).slice(0, 4)
  if (items.length === 0) return null

  // Determine grid columns dynamically so 3 or 4 items stretch 100% without orphan gaps!
  const gridColsClass = items.length === 3 
    ? "grid-cols-1 md:grid-cols-3" 
    : items.length === 2 
    ? "grid-cols-1 md:grid-cols-2" 
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

  return (
    <section className="w-full px-4 sm:px-8 py-20 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <span className="text-brand-orange">//</span> Ecosystem <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-brand-black">
              {title}
            </h2>
          </div>
        </div>

        {/* Outer Surface Container */}
        <div className="bg-brand-surface p-2 sm:p-3 rounded-[2.2rem]">
          <div className={`grid ${gridColsClass} gap-3`}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-[1.8rem] p-6 lg:p-8 border border-gray-100 shadow-sm hover:border-gray-200 flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-gray-100 text-brand-black group-hover:text-brand-orange flex items-center justify-center transition-colors shadow-sm">
                      {item.icon || <ScanLine size={22} />}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-orange group-hover:text-white transition-all transform group-hover:translate-x-0.5">
                      <ArrowRight size={16} />
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-brand-black group-hover:text-brand-orange transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-brand-black transition-colors">
                  Explore Tool →
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
