import Link from "next/link"
import { SITE_URL } from "@/lib/pricing"

export type Crumb = { name: string; href?: string }

/**
 * Visible breadcrumbs + matching BreadcrumbList JSON-LD.
 */
export function SiteBreadcrumb({ items }: { items: Crumb[] }) {
  const withHome: Crumb[] = [{ name: "Home", href: "/" }, ...items]
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: withHome.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.href
        ? { item: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href === "/" ? "" : item.href}` }
        : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 font-medium">
          {withHome.map((item, i) => {
            const last = i === withHome.length - 1
            return (
              <li key={`${item.name}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300" aria-hidden>/</span>}
                {last || !item.href ? (
                  <span className={last ? "text-brand-black font-semibold" : undefined}>{item.name}</span>
                ) : (
                  <Link href={item.href} className="hover:text-brand-orange transition-colors">
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
