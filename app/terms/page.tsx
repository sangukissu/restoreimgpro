import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service - BringBack | AI Photo Restoration",
  description: "Read BringBack's terms of service for our AI photo restoration platform.",
  robots: "index, follow",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6">Terms of Service</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using BringBack's photo restoration service.
            </p>
             <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-black mb-4">Acceptance of Terms</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    By accessing and using BringBack ("Service"), you accept and agree to be bound by the terms and
                    provision of this agreement. If you do not agree to abide by the above, please do not use this
                    service.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-4">Service Description</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    BringBack provides AI-powered photo restoration services that enhance, repair, and restore damaged,
                    faded, or low-quality photographs. Our service includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Automated photo restoration using artificial intelligence</li>
                    <li>Damage repair (tears, scratches, water damage)</li>
                    <li>Color restoration and enhancement</li>
                    <li>Quality improvement and sharpening</li>
                    <li>Digital delivery of restored images</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-4">User Responsibilities</h2>
                <div className="text-gray-700 space-y-4">
                  <p>You agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Only upload photos you own or have permission to restore</li>
                    <li>Not upload illegal, offensive, or copyrighted content</li>
                    <li>Use the service for personal, non-commercial purposes unless otherwise agreed</li>
                    <li>Provide accurate payment information</li>
                    <li>Not attempt to reverse engineer or misuse our AI technology</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-4">Payment Terms</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-green-900 mb-2">💳 Simple Pricing</h3>
                  <p className="text-green-800">
                    $2.49 for 5 photo restorations (Starter pack). Plus plan available at $4.99 for additional credits. One-time payments, no subscriptions, no hidden fees.
                  </p>
                </div>
                <div className="text-gray-700 space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All payments are processed securely through third-party providers</li>
                    <li>Prices are subject to change with 30 days notice</li>
                    <li>Credits do not expire</li>
                    <li>Refunds available within 30 days (see Refund Policy)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-4">Intellectual Property</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    <strong>Your Photos:</strong> You retain all rights to your original and restored photos. We claim
                    no ownership over your content.
                  </p>
                  <p>
                    <strong>Our Technology:</strong> The BringBack service, AI algorithms, and website are protected by
                    copyright and other intellectual property laws.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-4">Service Limitations</h2>
                <div className="text-gray-700 space-y-4">
                  <p>While we strive for excellent results, please understand:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>AI restoration results may vary based on photo condition</li>
                    <li>Some severely damaged photos may not be fully restorable</li>
                    <li>Service availability may be interrupted for maintenance</li>
                    <li>We reserve the right to refuse service for inappropriate content</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-4">Limitation of Liability</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    BringBack shall not be liable for any indirect, incidental, special, consequential, or punitive
                    damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
                    losses.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-4">Changes to Terms</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    We reserve the right to modify these terms at any time. We will notify users of significant changes
                    via email or website notice. Continued use of the service constitutes acceptance of modified terms.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-4">Contact Information</h2>
                <div className="text-gray-700">
                  <p>Questions about these Terms of Service? Contact us:</p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p>
                      <strong>Email:</strong> support@bringback.pro
                    </p>
                 
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
