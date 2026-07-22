"use client"

import React from "react"
import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { SiteBreadcrumb, type Crumb } from "@/components/seo/site-breadcrumb"
import { SiteBreadcrumbsSchema } from "@/components/seo/site-breadcrumbs-schema"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { Calendar, BookOpen, ArrowUpRight } from "lucide-react"
import type { ReactNode } from "react"

export interface TableOfContentsItem {
  id: string
  title: string
}

export function GuideLayout({
  title,
  description,
  updated,
  crumbs,
  toc = [],
  children,
}: {
  title: string
  description: string
  updated: string
  crumbs: Crumb[]
  toc?: TableOfContentsItem[]
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-black font-sans selection:bg-brand-orange selection:text-white">
      <SiteBreadcrumbsSchema items={[{ name: "Guides", href: "/guides" }, ...crumbs]} />
      
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Navbar />
      </header>

      <main className="pt-28 sm:pt-36 pb-16">
        <div className="max-w-[1240px] mx-auto px-4">
          {/* Breadcrumb Navigation Header */}
          <div className="mb-6">
            <SiteBreadcrumb items={[{ name: "Guides", href: "/guides" }, ...crumbs]} />
          </div>

          {/* Main Title & Lead Header */}
          <div className="max-w-4xl mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span className="text-brand-orange">//</span> Preservation Guide <span className="text-brand-orange">//</span>
            </div>

            <h1 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] font-[850] tracking-tighter leading-[1.05] text-brand-black mb-6">
              {title}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed">
              {description}
            </p>
          </div>

          {/* Split Editorial Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Sticky Editorial Meta & Table of Contents (4 Cols on LG) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
              {/* Author Byline Card — real founder, real E-E-A-T */}
              <div className="bg-white rounded-[1.6rem] p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3.5">
                  {/* Initial avatar — replace with real headshot when available */}
                  <div className="w-11 h-11 rounded-full bg-brand-black text-white flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm">
                    H
                  </div>
                  <div>
                    <Link href="/about" className="text-sm font-extrabold text-brand-black hover:text-brand-orange transition-colors">
                      Harvansh
                    </Link>
                    <p className="text-xs text-gray-500 font-semibold">Founder, BringBack.pro</p>
                  </div>
                </div>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed italic border-l-2 border-brand-orange pl-3">
                  &ldquo;I test every guide with real family photos before publishing.&rdquo;
                </p>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    Updated: {updated}
                  </span>
                  <Link href="/about" className="text-brand-black hover:text-brand-orange underline">
                    About
                  </Link>
                </div>
              </div>

              {/* Table of Contents Box (if TOC items provided) */}
              {toc.length > 0 && (
                <div className="bg-brand-surface rounded-[1.6rem] p-6 border border-gray-100 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <BookOpen size={14} className="text-brand-orange" />
                    Table of Contents
                  </h3>
                  <nav className="flex flex-col gap-2 pt-1">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="text-xs font-bold text-gray-700 hover:text-brand-orange transition-colors py-1 flex items-center justify-between border-b border-gray-100/60 last:border-0"
                      >
                        <span className="truncate">{item.title}</span>
                        <ArrowUpRight size={12} className="shrink-0 text-gray-400" />
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </aside>

            {/* Right Column: Main Deep Editorial Article Content (8 Cols on LG) */}
            <article className="lg:col-span-8 bg-white rounded-[2rem] p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm space-y-10">
              {children}

              {/* Footer Editorial Metadata */}
              <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-bold text-gray-500">
                <span>Category: Archival Photo Preservation</span>
                <div className="flex items-center gap-3">
                  <Link href="/old-photo-restoration" className="hover:text-brand-orange underline">
                    Restoration Tool
                  </Link>
                  <span>·</span>
                  <Link href="/editorial-policy" className="hover:text-brand-orange underline">
                    Editorial Standards
                  </Link>
                </div>
              </div>
            </article>

          </div>
        </div>

        {/* Global Product Ecosystem Cross-Sell */}
        <div className="mt-16">
          <ProductCrossSell />
        </div>
      </main>

      <Footer />
    </div>
  )
}
