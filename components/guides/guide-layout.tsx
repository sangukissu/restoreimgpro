import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { SiteBreadcrumb, type Crumb } from "@/components/seo/site-breadcrumb"
import { SiteBreadcrumbsSchema } from "@/components/seo/site-breadcrumbs-schema"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import type { ReactNode } from "react"

export function GuideLayout({
  title,
  description,
  updated,
  crumbs,
  children,
}: {
  title: string
  description: string
  updated: string
  crumbs: Crumb[]
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-brand-bg">
      <SiteBreadcrumbsSchema items={[{ name: "Guides", href: "/guides" }, ...crumbs]} />
      <Navbar />
      <main className="pt-28 pb-10">
        <article className="max-w-[760px] mx-auto px-4 sm:px-8">
          <SiteBreadcrumb items={[{ name: "Guides", href: "/guides" }, ...crumbs]} />
          <h1 className="text-4xl sm:text-5xl font-[850] tracking-tight leading-[1.05]">
            {title}
          </h1>
          <p className="mt-4 text-sm text-gray-500">Last updated: {updated}</p>
          <p className="mt-6 text-lg text-gray-600 font-medium leading-relaxed">{description}</p>
          <div className="mt-10 prose-like space-y-6 text-gray-700 font-medium leading-relaxed">
            {children}
          </div>
          <p className="mt-12 text-sm text-gray-500">
            Related product:{" "}
            <Link href="/old-photo-restoration" className="underline font-semibold text-brand-black">
              Old photo restoration
            </Link>
            {" · "}
            <Link href="/editorial-policy" className="underline font-semibold text-brand-black">
              Editorial policy
            </Link>
          </p>
        </article>
        <ProductCrossSell />
      </main>
      <Footer />
    </div>
  )
}
