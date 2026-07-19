import Link from "next/link"
import { ArrowRight } from "lucide-react"

export type CrossSellLink = {
  href: string
  title: string
  description: string
}

const DEFAULT_LINKS: CrossSellLink[] = [
  {
    href: "/old-photo-restoration",
    title: "Restore damage",
    description: "Repair scratches, tears, and fade while keeping original character.",
  },
  {
    href: "/ai-family-portrait",
    title: "Reunite people",
    description: "Combine separate photos into one natural family portrait.",
  },
  {
    href: "/ai-photo-animation",
    title: "Add subtle motion",
    description: "A gentle smile or blink — 10 credits; Starter pack is not enough alone.",
  },
  {
    href: "/family-memory-book",
    title: "Preserve the story",
    description: "Private keepsake for names, captions, and restored photos.",
  },
]

export function ProductCrossSell({
  excludeHref,
  title = "Continue the family project",
  links = DEFAULT_LINKS,
}: {
  excludeHref?: string
  title?: string
  links?: CrossSellLink[]
}) {
  const items = links.filter((l) => l.href !== excludeHref).slice(0, 4)
  if (items.length === 0) return null

  return (
    <section className="w-full px-4 sm:px-8 py-16 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-black mb-8">
          {title}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:border-brand-orange/40 hover:shadow-md transition-all"
            >
              <h3 className="font-extrabold text-brand-black group-hover:text-brand-orange transition-colors flex items-center gap-2">
                {item.title}
                <ArrowRight size={16} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="mt-2 text-sm text-gray-600 font-medium leading-relaxed">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
