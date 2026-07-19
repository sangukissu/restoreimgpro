import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { CTA } from "@/components/landing/CTA"
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button"

export const metadata: Metadata = {
  title: "Privacy Policy - BringBack",
  description:
    "How BringBack collects, processes, and retains data for photo restoration, animation, family tools, and Memory Book — including processors and cookie choices.",
  robots: "index, follow",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy - BringBack",
    description:
      "How BringBack handles photos, accounts, payments, analytics, and Memory Book keepsakes.",
    type: "website",
    url: "https://bringback.pro/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-[850] text-brand-black tracking-tight mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This policy explains what we collect, why we process it, who helps us run the
              service, and how long different kinds of media are kept.
            </p>
            <div className="mt-4 text-sm text-gray-500">Last updated: July 19, 2026</div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-sm max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-brand-black prose-p:text-gray-600 prose-li:text-gray-600">
              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Who we are</h2>
                  <p className="text-gray-600">
                    BringBack (&quot;we&quot;) provides AI-assisted family photo restoration and
                    related tools at{" "}
                    <a href="https://bringback.pro" className="underline">
                      bringback.pro
                    </a>
                    . Contact:{" "}
                    <a href="mailto:support@bringback.pro" className="underline">
                      support@bringback.pro
                    </a>
                    .
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Information we collect</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                      <strong>Account:</strong> email and authentication data via Supabase Auth
                    </li>
                    <li>
                      <strong>Photos &amp; generated media:</strong> images/videos you upload or
                      create with our tools
                    </li>
                    <li>
                      <strong>Payment metadata:</strong> plan, amount, and transaction status via
                      Dodo Payments (we do not store full card numbers)
                    </li>
                    <li>
                      <strong>Usage &amp; diagnostics:</strong> feature usage, errors, and (if you
                      allow) analytics
                    </li>
                    <li>
                      <strong>Support messages:</strong> if you contact us via email or chat
                    </li>
                    <li>
                      <strong>Memory Book content:</strong> captions, names, dates, and structure
                      you save into a keepsake
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">How we use information</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Provide restoration, animation, reunite, and related AI features</li>
                    <li>Deliver downloads and optional private keepsakes</li>
                    <li>Process payments and prevent fraud</li>
                    <li>Send service communications (receipts, security, product notices)</li>
                    <li>Improve reliability and fix bugs (including limited diagnostics)</li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    We do <strong>not</strong> use your family photos to train general-purpose AI
                    models for public release.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Processors we use</h2>
                  <p className="text-gray-600 mb-4">
                    We use service providers to operate BringBack. Typical processors include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                      <strong>Supabase</strong> — authentication, database, and application data
                    </li>
                    <li>
                      <strong>Cloudflare R2</strong> — object storage for uploads and generated
                      media
                    </li>
                    <li>
                      <strong>fal (or other inference providers)</strong> — AI model inference for
                      restoration and related features
                    </li>
                    <li>
                      <strong>Dodo Payments</strong> — checkout and payment processing
                    </li>
                    <li>
                      <strong>Resend</strong> — transactional email
                    </li>
                    <li>
                      <strong>Google Analytics</strong> — site analytics (only with consent)
                    </li>
                    <li>
                      <strong>Microsoft Clarity</strong> — session analytics (only with consent)
                    </li>
                    <li>
                      <strong>Crisp</strong> — optional support chat (only with consent)
                    </li>
                    <li>
                      <strong>YouTube</strong> — demo videos load only after you press play
                      (click-to-load); YouTube may set its own cookies once the player runs
                    </li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    Inference providers process media to produce results and may retain technical
                    logs according to their own policies for a limited period.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Retention</h2>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Honest retention (not zero)</h3>
                    <p className="text-blue-800">
                      We do not claim &quot;zero retention&quot; or automatic deletion of all media
                      in 30 minutes. Different parts of the pipeline have different lifecycles.
                    </p>
                  </div>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                      <strong>Generated restorations, animations, and reunions:</strong> stored in
                      your account (My Media) so you can download later; delete anytime
                    </li>
                    <li>
                      <strong>Temporary staging uploads:</strong> cleaned by scheduled jobs when
                      no longer needed for processing
                    </li>
                    <li>
                      <strong>Memory Book:</strong> intentionally persistent while you keep the
                      keepsake or account; unpublished drafts may expire after inactivity as
                      described in-product
                    </li>
                    <li>
                      <strong>Account deletion:</strong> request deletion via account settings or
                      support; associated media is removed subject to backup and legal retention
                      windows
                    </li>
                    <li>
                      <strong>Payments &amp; invoices:</strong> retained as required for accounting
                      and fraud prevention
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Cookies and consent</h2>
                  <p className="text-gray-600 mb-4">
                    Necessary cookies support sign-in, security (including Turnstile where used),
                    and checkout. Analytics, support chat, and external media load only after you
                    allow them in the cookie banner. You can change choices anytime:
                  </p>
                  <CookieSettingsButton className="rounded-full bg-brand-black text-white px-5 py-2.5 text-sm font-bold" />
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Your rights</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Access, correct, or delete personal data where applicable</li>
                    <li>Export or delete media from My Media</li>
                    <li>Revoke Memory Book share links and delete keepsakes</li>
                    <li>Withdraw analytics/support/media consent</li>
                    <li>Contact us about international transfer questions for your region</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Contact</h2>
                  <div className="mt-2 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="font-medium text-brand-black">
                      Email: support@bringback.pro
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        <CTA />
      </main>

      <Footer />
    </div>
  )
}
