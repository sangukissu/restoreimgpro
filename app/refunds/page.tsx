import type { Metadata } from "next"
import Script from "next/script"
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, CreditCard } from "lucide-react"
import { CTA } from '@/components/landing/CTA';

export const metadata: Metadata = {
  title: "Refund Policy - BringBack | AI Photo Restoration",
  description:
    "Learn about BringBack's 30-day money-back guarantee and refund process for photo restoration services.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Refund Policy - BringBack | AI Photo Restoration",
    description:
      "Learn about BringBack's 30-day money-back guarantee and refund process for photo restoration services.",
    type: "website",
    siteName: "BringBack",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BringBack AI Photo Restoration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy - BringBack | AI Photo Restoration",
    description:
      "Learn about BringBack's 30-day money-back guarantee and refund process for photo restoration services.",
    images: ["/og-image.png"],
  },
}

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <Script
            id="refunds-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "MerchantReturnPolicy",
                name: "BringBack Refund Policy",
                merchantReturnDays: 30,
                returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                refundType: "https://schema.org/Refund",
                returnFees: "https://schema.org/FreeReturn",
                inStoreReturnsOffered: false,
                applicableCountry: "US",
                additionalProperty: [
                  { "@type": "PropertyValue", name: "Guarantee", value: "30-day money-back" },
                ],
                seller: { "@type": "Organization", name: "BringBack" },
              }),
            }}
          />
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 border border-green-200 text-sm font-medium text-green-700 mb-6">
              <CheckCircle className="w-4 h-4 mr-2" />
              30-Day Money-Back Guarantee
            </div>
            <h1 className="text-4xl lg:text-5xl font-[850] text-brand-black tracking-tight mb-6">Refund Policy</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We stand behind our photo restoration service. If you're not completely satisfied, we'll make it right.
            </p>
          </div>

          {/* Quick Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-xl text-brand-black mb-2">30 Days</h3>
              <p className="text-gray-600">Full refund window from purchase date</p>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-bold text-xl text-brand-black mb-2">No Questions</h3>
              <p className="text-gray-600">Simple refund process, no hassle</p>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="font-bold text-xl text-brand-black mb-2">Full Refund</h3>
              <p className="text-gray-600">100% money back guarantee</p>
            </div>
          </div>

          {/* Content Container */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-sm max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-brand-black prose-p:text-gray-600 prose-li:text-gray-600">
              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Our Guarantee</h2>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-6">
                    <p className="text-blue-800 font-medium text-lg">
                      We're confident you'll love your restored photos. If you're not completely satisfied with the
                      results, we'll refund your purchase within 30 days - no questions asked.
                    </p>
                  </div>
                  <div className="text-gray-600 space-y-4">
                    <p>
                      At BringBack, we believe in the quality of our AI photo restoration service. Every photo restoration
                      is backed by our 30-day money-back guarantee.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Refund Eligibility</h2>
                  <div className="text-gray-600 space-y-4">
                    <p>You're eligible for a full refund if:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>You request a refund within 30 days of purchase</li>
                      <li>You're unsatisfied with the restoration quality</li>
                      <li>Technical issues prevented you from using the service</li>
                      <li>The service didn't meet your expectations</li>
                    </ul>
                    <p className="mt-4 font-medium text-brand-black">
                      No conditions required. We trust our customers and want you to be happy with your
                      restored memories.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">How to Request a Refund</h2>
                  <div className="text-gray-600 space-y-4">
                    <p>Getting a refund is simple:</p>
                    <div className="bg-gray-50 rounded-2xl p-8 space-y-6 border border-gray-100">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-brand-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          1
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-black text-lg mb-1">Contact Us</h4>
                          <p className="text-gray-600">Email us at refunds@bringback.pro with your order details</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-brand-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          2
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-black text-lg mb-1">We Process</h4>
                          <p className="text-gray-600">We'll process your refund within 24 hours</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-brand-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          3
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-black text-lg mb-1">Money Back</h4>
                          <p className="text-gray-600">Refund appears in your account within 3-5 business days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Refund Timeline</h2>
                  <div className="text-gray-600 space-y-4">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Request Processing:</strong> Within 24 hours
                      </li>
                      <li>
                        <strong>Credit Card Refunds:</strong> 3-5 business days
                      </li>
                      <li>
                        <strong>PayPal Refunds:</strong> 1-2 business days
                      </li>
                      <li>
                        <strong>Bank Transfer Refunds:</strong> 5-7 business days
                      </li>
                    </ul>
                    <p>
                      Refund timing depends on your payment method and bank processing times. We initiate all refunds
                      immediately upon approval.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Partial Refunds</h2>
                  <div className="text-gray-600 space-y-4">
                    <p>If you've used some of your photo restoration credits, we can offer:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Full refund if you're unsatisfied with any restoration</li>
                      <li>Partial refund for unused credits</li>
                      <li>Additional free restorations to make things right</li>
                    </ul>
                    <p>We're flexible and want to find a solution that works for you.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">Contact for Refunds</h2>
                  <div className="text-gray-600">
                    <p>Ready to request a refund or have questions about our policy?</p>
                    <div className="mt-6 p-8 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="space-y-3 mb-8">
                        <p>
                          <strong>Email:</strong> support@bringback.pro
                        </p>
                        <p>
                          <strong>Response Time:</strong> Within 24 hours
                        </p>

                      </div>
                      <div>
                        <a
                          href="mailto:support@bringback.pro?subject=Refund%20Request%20-%20BringBack&body=I%20would%20like%20to%20request%20a%20refund%20for%20my%20recent%20purchase.%20My%20order%20details%20are%3A%0A%0A%5BYour%20Order%20Number%2FEmail%5D%0A%5BReason%20for%20Refund%5D%0A%5BProof%20of%20Issues%20(e.g.%2C%20screenshots%2C%20detailed%20description)%5D"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="bg-brand-black text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-xl">Request Refund</Button>
                        </a>
                      </div>
                    </div>
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
