import Link from "next/link"
import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { Pricing } from "@/components/landing/Pricing"
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Image as ImageIcon,
  Coins,
} from "lucide-react"
import { SITE_URL, formatCredits, type CreditFeatureKey, FEATURE_CREDIT_COSTS } from "@/lib/pricing"
import { PRIVACY_COPY } from "@/lib/site-copy"
import { SiteBreadcrumb } from "@/components/seo/site-breadcrumb"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"

export interface ProductFeaturePageProps {
  slug: string
  title: string
  description: string
  h1: string
  subhead: string
  ctaLabel: string
  ctaHref: string
  creditKey: CreditFeatureKey
  starterCanRun: boolean
  inputs: string[]
  outputs: string[]
  timeEstimate: string
  failureCases: string[]
  whatAiMayChange: string[]
  whenNotToUse: string[]
  nextSteps: { label: string; href: string }[]
  faqs: { q: string; a: string }[]
  /** Optional local demo images */
  beforeSrc?: string
  afterSrc?: string
  beforeLabel?: string
  afterLabel?: string
}

export function productMetadata(p: ProductFeaturePageProps): Metadata {
  const url = `${SITE_URL}${p.slug}`
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: p.slug },
    openGraph: {
      title: p.title,
      description: p.description,
      url,
      siteName: "BringBack",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: p.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.description,
      images: ["/og-image.png"],
    },
    robots: { index: true, follow: true },
  }
}

export function ProductFeaturePage(p: ProductFeaturePageProps) {
  const cost = FEATURE_CREDIT_COSTS[p.creditKey]
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}${p.slug}#webpage`,
    url: `${SITE_URL}${p.slug}`,
    name: p.title,
    description: p.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: {
      "@type": "SoftwareApplication",
      name: "BringBack",
      applicationCategory: "PhotoEditingApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "4.99",
        priceCurrency: "USD",
        url: `${SITE_URL}/pricing`,
      },
    },
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: p.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <header className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </header>

      <main className="pt-28 pb-20">
        <section className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <SiteBreadcrumb
            items={[
              { name: "Features", href: "/features" },
              { name: p.h1.length > 48 ? p.title.split("|")[0].trim() : p.h1 },
            ]}
          />
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <p className="text-sm font-bold uppercase tracking-wider text-brand-orange mb-4">
                Family photo tools
              </p>
              <h1 className="text-4xl sm:text-5xl font-[850] tracking-tight leading-[1.05] mb-5">
                {p.h1}
              </h1>
              <p className="text-lg text-gray-600 font-medium leading-relaxed mb-6 max-w-xl">
                {p.subhead}
              </p>

              <div className="flex flex-wrap gap-3 mb-8 text-sm font-semibold">
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-black/5 px-4 py-2">
                  <Coins size={16} className="text-brand-orange" />
                  {cost.credits === 0
                    ? "Free to edit (Family pack)"
                    : formatCredits(cost.credits)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-black/5 px-4 py-2">
                  <Clock size={16} className="text-brand-orange" />
                  {p.timeEstimate}
                </span>
                {!p.starterCanRun && cost.credits > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2">
                    Starter pack may not cover this action
                  </span>
                )}
              </div>

              <Link
                href={p.ctaHref}
                className="inline-flex items-center gap-3 bg-[#FF4D00] text-white pl-6 pr-2 py-2 rounded-full font-bold shadow-lg hover:scale-[1.02] transition-transform"
              >
                {p.ctaLabel}
                <span className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <ArrowRight size={18} className="text-[#FF4D00]" />
                </span>
              </Link>
              <p className="mt-4 text-sm text-gray-500 max-w-md">{PRIVACY_COPY.short}</p>
            </div>

            <div className="lg:col-span-6">
              {p.beforeSrc && p.afterSrc ? (
                <div className="grid grid-cols-2 gap-3">
                  <figure className="rounded-2xl overflow-hidden bg-white p-2 shadow-sm">
                    <img
                      src={p.beforeSrc}
                      alt={p.beforeLabel || "Before"}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <figcaption className="text-center text-xs font-bold uppercase tracking-wide py-2 text-gray-500">
                      {p.beforeLabel || "Input"}
                    </figcaption>
                  </figure>
                  <figure className="rounded-2xl overflow-hidden bg-white p-2 shadow-sm">
                    <img
                      src={p.afterSrc}
                      alt={p.afterLabel || "After"}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <figcaption className="text-center text-xs font-bold uppercase tracking-wide py-2 text-gray-500">
                      {p.afterLabel || "Result"}
                    </figcaption>
                  </figure>
                </div>
              ) : (
                <div className="rounded-[1.8rem] bg-brand-surface p-10 flex flex-col items-center justify-center min-h-[320px] text-center">
                  <ImageIcon size={40} className="text-brand-orange mb-4" />
                  <p className="font-bold text-lg">Use your own family photos</p>
                  <p className="text-gray-600 mt-2 max-w-sm text-sm">
                    Results depend on clear, well-lit source faces. Compare every output to the
                    original before you share or print.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-[1320px] mx-auto px-4 sm:px-8 mt-20 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-black/5">
            <h2 className="text-2xl font-extrabold mb-4">Supported inputs</h2>
            <ul className="space-y-3">
              {p.inputs.map((item) => (
                <li key={item} className="flex gap-3 text-gray-700">
                  <CheckCircle2 className="text-brand-orange shrink-0 mt-0.5" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-black/5">
            <h2 className="text-2xl font-extrabold mb-4">What you get</h2>
            <ul className="space-y-3">
              {p.outputs.map((item) => (
                <li key={item} className="flex gap-3 text-gray-700">
                  <CheckCircle2 className="text-brand-orange shrink-0 mt-0.5" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="max-w-[1320px] mx-auto px-4 sm:px-8 mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
            <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber-600" size={22} />
              What AI may change
            </h2>
            <ul className="space-y-3 text-gray-800">
              {p.whatAiMayChange.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-black/5">
            <h2 className="text-2xl font-extrabold mb-4">When not to use this</h2>
            <ul className="space-y-3 text-gray-700">
              {p.whenNotToUse.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-brand-orange font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="max-w-[1320px] mx-auto px-4 sm:px-8 mt-10">
          <div className="bg-brand-surface rounded-3xl p-8">
            <h2 className="text-2xl font-extrabold mb-4">Known failure cases</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {p.failureCases.map((item) => (
                <li key={item} className="text-gray-700 flex gap-2">
                  <span className="text-brand-orange">–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="max-w-[1320px] mx-auto px-4 sm:px-8 mt-16">
          <h2 className="text-3xl font-extrabold mb-6">Useful next steps</h2>
          <div className="flex flex-wrap gap-3">
            {p.nextSteps.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-full bg-white border border-black/10 px-5 py-2.5 font-bold text-sm hover:border-brand-orange transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-[1320px] mx-auto px-4 sm:px-8 mt-16">
          <h2 className="text-3xl font-extrabold mb-8">FAQ</h2>
          <div className="space-y-4">
            {p.faqs.map((f) => (
              <details
                key={f.q}
                className="group bg-white rounded-2xl border border-black/5 p-6 open:shadow-sm"
              >
                <summary className="font-bold text-lg cursor-pointer list-none flex justify-between gap-4">
                  {f.q}
                  <span className="text-gray-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <ProductCrossSell excludeHref={p.slug} />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
