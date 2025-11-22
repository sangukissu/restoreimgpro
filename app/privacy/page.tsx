import type { Metadata } from "next"
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: "Privacy Policy - BringBack | AI Photo Restoration",
  description: "Learn how BringBack protects your privacy and handles your personal data during photo restoration.",
  robots: "index, follow",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy - BringBack | AI Old Photo Restoration",
    description: "Learn how BringBack protects your privacy and handles your personal data during photo restoration.",
    type: "website",
    url: "https://bringback.pro/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="  text-4xl lg:text-5xl text-black mb-6">Privacy Policy</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
                <h2 className=" text-2xl font-bold text-black mb-4">Information We Collect</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    When you use BringBack, we collect minimal information necessary to provide our photo restoration
                    service:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Photos:</strong> Images you upload for restoration
                    </li>
                    <li>
                      <strong>Payment Information:</strong> Processed securely through our payment providers
                    </li>
                    <li>
                      <strong>Usage Data:</strong> Basic analytics to improve our service
                    </li>
                    <li>
                      <strong>Contact Information:</strong> Email address for service communications
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className=" text-2xl font-bold text-black mb-4">How We Use Your Information</h2>
                <div className="text-gray-700 space-y-4">
                  <p>We use your information solely to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Process and restore your photos using AI technology</li>
                    <li>Deliver restored images to you</li>
                    <li>Process payments for our services</li>
                    <li>Send service-related communications</li>
                    <li>Improve our restoration algorithms (using anonymized data only)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className=" text-2xl font-bold text-black mb-4">Photo Privacy & Security</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">🔒 Your Photos Are Safe</h3>
                  <p className="text-blue-800">
                    All uploaded photos are automatically deleted from our servers within 30 minutes of processing. Generated media is automatically deleted after 7 days. We
                    never store, share, or use your personal photos for any purpose other than restoration.
                  </p>
                </div>
                <div className="text-gray-700 space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Photos are encrypted during upload and processing</li>
                    <li>Access is restricted to authorized restoration systems only</li>
                    <li>No human employees view your personal photos</li>
                    <li>Automatic deletion of uploaded media within 30 minutes of processing guaranteed</li>
                    <li>Automatic deletion of generated media after 7 days guaranteed</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className=" text-2xl font-bold text-black mb-4">Data Sharing</h2>
                <div className="text-gray-700 space-y-4">
                  <p>We do not sell, rent, or share your personal information with third parties, except:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Payment processors (Stripe, PayPal) for transaction processing</li>
                    <li>Cloud infrastructure providers (with strict data protection agreements)</li>
                    <li>When required by law or to protect our legal rights</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className=" text-2xl font-bold text-black mb-4">Your Rights</h2>
                <div className="text-gray-700 space-y-4">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Request deletion of your data</li>
                    <li>Access information we have about you</li>
                    <li>Correct inaccurate information</li>
                    <li>Opt out of marketing communications</li>
                    <li>Data portability where applicable</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className=" text-2xl font-bold text-black mb-4">Contact Us</h2>
                <div className="text-gray-700">
                  <p>If you have questions about this Privacy Policy or how we handle your data, contact us at:</p>
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
