import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { SiteBreadcrumb } from "@/components/seo/site-breadcrumb"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Guides — restore, reunite, animate, preserve | BringBack",
  description:
    "Practical guides for family photo projects: scanning safely, restore-only vs colorize, identity drift, and preserving stories in a Memory Book.",
  alternates: { canonical: "/guides" },
}

const CLUSTERS = [
  {
    title: "Restore faithfully",
    links: [
      {
        href: "/guides/scan-family-photos-safely",
        title: "Scan a family photo without damaging it",
        blurb: "Flat scans, phone scans, glass glare, and stuck-to-glass caution.",
      },
      {
        href: "/guides/restore-only-vs-colorize",
        title: "Restore-only vs colorize",
        blurb: "How to choose when the memory is black-and-white or sepia.",
      },
      {
        href: "/guides/why-ai-changes-faces",
        title: "Why AI changes faces",
        blurb: "Identity drift, reconstruction vs recovery, how to reduce risk.",
      },
      {
        href: "/restoration-benchmark",
        title: "Restoration benchmark",
        blurb: "Scoring method and demo cases with limitations shown.",
      },
    ],
  },
  {
    title: "Reunite a family",
    links: [
      {
        href: "/ai-family-portrait",
        title: "Family portrait from separate photos",
        blurb: "Product page — 2 credits, clear face references.",
      },
      {
        href: "/add-person-to-photo",
        title: "Add a loved one to a photo",
        blurb: "Insert into an existing scene — review likeness carefully.",
      },
      {
        href: "/guides/choose-source-photos-for-likeness",
        title: "Choose source photos that preserve likeness",
        blurb: "Lighting, angle, and resolution that help identity.",
      },
    ],
  },
  {
    title: "Add motion respectfully",
    links: [
      {
        href: "/ai-photo-animation",
        title: "Subtle photo animation",
        blurb: "10 credits; restore first when faces are damaged.",
      },
      {
        href: "/guides/subtle-vs-exaggerated-animation",
        title: "Subtle vs exaggerated motion",
        blurb: "When a soft smile works better than a big reaction.",
      },
    ],
  },
  {
    title: "Preserve the story",
    links: [
      {
        href: "/guides/family-photo-metadata-checklist",
        title: "Names, dates, and uncertainty checklist",
        blurb: "Record what you know — and what you don’t.",
      },
      {
        href: "/family-memory-book",
        title: "Family Memory Book",
        blurb: "Private keepsake that keeps originals and restored versions distinct.",
      },
    ],
  },
]

export default function GuidesHubPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-28 pb-20 max-w-[1000px] mx-auto px-4 sm:px-8">
        <SiteBreadcrumb items={[{ name: "Guides" }]} />
        <h1 className="text-4xl sm:text-5xl font-[850] tracking-tight">
          Family photo guides
        </h1>
        <p className="mt-5 text-lg text-gray-600 font-medium max-w-2xl">
          Short, practical pages for real projects — not keyword-variant SEO filler. Each cluster
          links to the tool that actually does the job.
        </p>

        <div className="mt-14 space-y-14">
          {CLUSTERS.map((cluster) => (
            <section key={cluster.title}>
              <h2 className="text-2xl font-extrabold mb-5">{cluster.title}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {cluster.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:border-brand-orange/40 transition-colors group"
                  >
                    <h3 className="font-extrabold text-brand-black group-hover:text-brand-orange flex items-center gap-2">
                      {link.title}
                      <ArrowRight size={16} className="opacity-50" />
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 font-medium">{link.blurb}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
