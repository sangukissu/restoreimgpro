import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { SiteBreadcrumb } from "@/components/seo/site-breadcrumb"
import { ArrowRight, BookOpen, Sparkles, ScanLine, Users, Heart, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Guides — restore, reunite, animate, preserve",
  description:
    "Practical guides for family photo projects: scanning safely, restore-only vs colorize, identity drift, and preserving stories in a Memory Book.",
  alternates: { canonical: "/guides" },
}

const CLUSTERS = [
  {
    title: "Restore Faithfully",
    icon: <ScanLine className="text-brand-orange" size={22} />,
    links: [
      {
        href: "/guides/scan-family-photos-safely",
        title: "Scan a Family Photo Without Damaging It",
        blurb: "Flatbed scans, smartphone macro captures, glass glare prevention, and stuck-photo handling.",
      },
      {
        href: "/guides/restore-only-vs-colorize",
        title: "Restore-Only vs. AI Colorize",
        blurb: "How to choose when preserving black-and-white chemical character vs modern color synthesis.",
      },
      {
        href: "/guides/why-ai-changes-faces",
        title: "Why AI Changes Faces & Identity Drift",
        blurb: "Facial reconstruction vs true recovery, landmark loss functions, and identity protection tips.",
      },
      {
        href: "/restoration-benchmark",
        title: "Restoration Benchmark & Methodology",
        blurb: "Empirical scoring methodology and real test case benchmarks with limitations shown.",
      },
    ],
  },
  {
    title: "Reunite Loved Ones",
    icon: <Users className="text-brand-orange" size={22} />,
    links: [
      {
        href: "/ai-family-portrait",
        title: "AI Family Portrait Generator",
        blurb: "Combine separate individual portraits into one cohesive, studio-quality group photo.",
      },
      {
        href: "/add-person-to-photo",
        title: "Add Deceased Loved One to Photo AI",
        blurb: "Seamlessly insert a missing relative or passed loved one into a family snapshot.",
      },
      {
        href: "/guides/choose-source-photos-for-likeness",
        title: "Choose Source Photos That Preserve Likeness",
        blurb: "Lighting, resolution thresholds, and facial angles that help neural models capture identity.",
      },
    ],
  },
  {
    title: "Add Respectful Motion",
    icon: <Sparkles className="text-brand-orange" size={22} />,
    links: [
      {
        href: "/ai-photo-animation",
        title: "Subtle Photo Animation Generator",
        blurb: "Bring ancestors to life with natural facial movements, gentle blinks, and warm smiles.",
      },
      {
        href: "/guides/subtle-vs-exaggerated-animation",
        title: "Subtle vs. Exaggerated Motion",
        blurb: "Why soft micro-expressions preserve dignity while theatrical motion causes uncanny artifacts.",
      },
    ],
  },
  {
    title: "Preserve the Story",
    icon: <BookOpen className="text-brand-orange" size={22} />,
    links: [
      {
        href: "/guides/family-photo-metadata-checklist",
        title: "Archival Metadata & Naming Checklist",
        blurb: "Document full names, dates, locations, provenance, and back-of-photo inscriptions.",
      },
      {
        href: "/family-memory-book",
        title: "Family Memory Book Keepsake",
        blurb: "Private digital album keeping raw scans, restored versions, and family stories together.",
      },
    ],
  },
]

export default function GuidesHubPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-black font-sans selection:bg-brand-orange selection:text-white">
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Navbar />
      </header>

      <main className="pt-28 sm:pt-36 pb-24 max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="mb-6">
          <SiteBreadcrumb items={[{ name: "Guides" }]} />
        </div>

        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <span className="text-brand-orange">//</span> Knowledge Center <span className="text-brand-orange">//</span>
          </div>

          <h1 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] font-[850] tracking-tighter leading-[1.05] text-brand-black mb-6">
            Family Photo Preservation Guides
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed">
            In-depth technical guides for family historians, archivists, and memory preservers. Learn how to scan, restore, reunite, and digitize your family heritage safely.
          </p>
        </div>

        {/* Cluster Grid */}
        <div className="space-y-12">
          {CLUSTERS.map((cluster) => (
            <section key={cluster.title} className="bg-brand-surface rounded-[2.2rem] p-6 sm:p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  {cluster.icon}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">{cluster.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cluster.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group bg-white rounded-[1.6rem] p-6 sm:p-8 border border-gray-100 shadow-sm hover:border-gray-200 flex flex-col justify-between transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <h3 className="text-xl font-extrabold text-brand-black group-hover:text-brand-orange transition-colors">
                          {link.title}
                        </h3>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-orange group-hover:text-white transition-all transform group-hover:translate-x-0.5 shrink-0">
                          <ArrowRight size={16} />
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 font-medium leading-relaxed">
                        {link.blurb}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-brand-black transition-colors">
                      Read Guide →
                    </div>
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
