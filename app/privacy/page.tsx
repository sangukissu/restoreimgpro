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
                    BringBack (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides AI-assisted family photo restoration and
                    related preservation tools at{" "}
                    <a href="https://bringback.pro" className="underline">
                      bringback.pro
                    </a>{" "}
                    (the &quot;Web App&quot;) and through our official mobile application on the Google Play Store (the &quot;Android App&quot;, package: <code>pro.bringback.app</code>). Contact:{" "}
                    <a href="mailto:support@bringback.pro" className="underline">
                      support@bringback.pro
                    </a>
                    .
                  </p>
                </section>

                {/* DEDICATED SECTION: ANDROID MOBILE APPLICATION */}
                <section id="android" className="border border-purple-100 bg-purple-50/40 rounded-3xl p-8 my-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-black text-white text-xs font-bold mb-4">
                    <span>📱</span> BringBack AI — Android App (pro.bringback.app)
                  </div>
                  <h2 className="text-2xl font-bold text-brand-black mb-3">
                    Android Mobile Application Privacy &amp; Data Safety
                  </h2>
                  <p className="text-gray-600 mb-6 text-base">
                    This dedicated section describes the specific data collection, permissions, and security practices of our Android application published on Google Play.
                  </p>

                  <div className="space-y-6 text-gray-700 text-base">
                    <div>
                      <h3 className="font-bold text-brand-black text-lg mb-2">1. Information Collected by the Android App</h3>
                      <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>
                          <strong>Google Account Details:</strong> When you sign in with Google, we receive your Google ID, email address, name, and profile picture avatar for account authentication and wallet management.
                        </li>
                        <li>
                          <strong>User-Selected Photos:</strong> Only photographs that you explicitly select from your device via the Android Photo Picker or gallery to restore, enhance, upscale, or animate.
                        </li>
                        <li>
                          <strong>In-App Purchases:</strong> We record purchase tokens, order IDs, and credit balances delivered by Google Play In-App Billing. We do not receive, process, or store full credit card numbers.
                        </li>
                        <li>
                          <strong>Diagnostics:</strong> Device model, OS version, and crash logs collected strictly for app stability and bug fixing.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-brand-black text-lg mb-2">2. What the Android App Does NOT Collect or Use</h3>
                      <div className="bg-white border border-purple-100 rounded-2xl p-6">
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                          <li><strong>No Cookies or Advertising IDs:</strong> The Android app does not use cookies, advertising trackers, or ad-targeting SDKs.</li>
                          <li><strong>No Session Replay Software:</strong> Web analytics tools like Microsoft Clarity or web tracking scripts are <em>not</em> included or run in the mobile app.</li>
                          <li><strong>No Background Photo Scanning:</strong> The app has zero background access to your photo library. It only receives the single file(s) you deliberately pick.</li>
                          <li><strong>No Location, Contacts, or Microphone Access:</strong> The app never requests or accesses your location, contacts, or audio hardware.</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-brand-black text-lg mb-2">3. Processors Used by the Android App</h3>
                      <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>
                          <strong>Google Play Services:</strong> Account authentication (Google Sign-In) and purchase fulfillment (Google Play In-App Billing).
                        </li>
                        <li>
                          <strong>Cloudflare (API &amp; R2 Storage):</strong> Secure server API and encrypted storage for user photos, accessed strictly via time-limited, signed HMAC URLs.
                        </li>
                        <li>
                          <strong>fal.ai:</strong> GPU inference infrastructure used solely to execute the requested AI restoration, upscale, and animation models. Images are not used to train public generative AI models.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-brand-black text-lg mb-2">4. Android Account &amp; Data Deletion</h3>
                      <p className="text-gray-600">
                        In compliance with Google Play Data Safety policies, you have complete control to delete your data:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-2">
                        <li><strong>In-App Deletion:</strong> Tap <em>Account &rarr; Delete Account</em> inside the app to instantly delete your profile and purge all uploaded/restored media from our servers.</li>
                        <li><strong>Web Deletion Portal:</strong> If you uninstalled the app, you can request full account and photo deletion through our web form at <a href="https://api.bringback.pro/delete-account" className="underline font-semibold text-brand-black" target="_blank" rel="noopener noreferrer">api.bringback.pro/delete-account</a>.</li>
                        <li><strong>Email Request:</strong> Email us anytime at <a href="mailto:support@bringback.pro" className="underline font-semibold text-brand-black">support@bringback.pro</a> to request manual account erasure.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* WEB APPLICATION SPECIFIC DISCLOSURES */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Web Application Policies (bringback.pro)</h2>
                  <p className="text-gray-600 mb-4">
                    The following sections specifically apply when you use the BringBack website at bringback.pro:
                  </p>

                  <h3 className="font-bold text-brand-black text-lg mb-2">Web Information We Collect</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                    <li>
                      <strong>Account:</strong> email and authentication data via Supabase Auth
                    </li>
                    <li>
                      <strong>Photos &amp; generated media:</strong> images/videos you upload or create on the website
                    </li>
                    <li>
                      <strong>Payment metadata:</strong> plan, amount, and transaction status via Dodo Payments (we do not store full card numbers)
                    </li>
                    <li>
                      <strong>Usage &amp; diagnostics:</strong> website feature usage, errors, and (if you allow) analytics
                    </li>
                    <li>
                      <strong>Support messages:</strong> if you contact us via email or web chat
                    </li>
                    <li>
                      <strong>Memory Book content:</strong> captions, names, dates, and structure you save into a web keepsake
                    </li>
                  </ul>

                  <h3 className="font-bold text-brand-black text-lg mb-2">Web Processors</h3>
                  <p className="text-gray-600 mb-4">
                    Service providers that power our website include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                      <strong>Supabase</strong> — web authentication, database, and application data
                    </li>
                    <li>
                      <strong>Cloudflare R2</strong> — object storage for uploads and generated media
                    </li>
                    <li>
                      <strong>fal</strong> — AI model inference for restoration and related features
                    </li>
                    <li>
                      <strong>Dodo Payments</strong> — web checkout and payment processing
                    </li>
                    <li>
                      <strong>Resend</strong> — transactional email
                    </li>
                    <li>
                      <strong>Google Analytics</strong> — site analytics (only with cookie banner consent)
                    </li>
                    <li>
                      <strong>Microsoft Clarity</strong> — session analytics (only with cookie banner consent)
                    </li>
                    <li>
                      <strong>Crisp</strong> — optional website support chat (only with consent)
                    </li>
                    <li>
                      <strong>YouTube</strong> — demo videos load only after you press play
                      (click-to-load)
                    </li>
                  </ul>
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
                      <strong>Account &amp; Data Deletion:</strong> You can permanently delete your account and all associated photographs at any time directly within the Android mobile app (under <em>Account &rarr; Delete Account</em>), through our online web deletion portal at{" "}
                      <a href="https://api.bringback.pro/delete-account" className="underline font-medium text-brand-black" target="_blank" rel="noopener noreferrer">
                        api.bringback.pro/delete-account
                      </a>
                      , or by emailing{" "}
                      <a href="mailto:support@bringback.pro" className="underline font-medium text-brand-black">
                        support@bringback.pro
                      </a>
                      . Upon deletion, your images and personal records are permanently erased from our active database and object storage.
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
