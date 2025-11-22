import type { Metadata } from "next"
import Script from "next/script"
import Link from "next/link"

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from "@/components/ui/button"
import { Check, Star, Zap, Shield, Clock, ChevronRight, Film, Sparkles } from "lucide-react"
import { FramerButton } from "@/components/ui/framer-button"

export const metadata: Metadata = {
  title: "Pricing - BringBack.pro | AI Photo Restoration & Animation",
  description:
    "Simple, transparent pricing for AI photo restoration. Starter $2.49 and Plus $4.99 plans, no subscriptions.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing - BringBack.pro | AI Photo Restoration & Animation",
    description:
      "Simple, transparent pricing for AI photo restoration. Starter $2.49 and Plus $4.99 plans, no subscriptions.",
    type: "website",
    url: "https://bringback.pro/pricing",
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
    title: "Pricing - BringBack.pro | AI Photo Restoration & Animation",
    description:
      "Simple, transparent pricing for AI photo restoration. Starter $2.49 and Plus $4.99 plans, no subscriptions.",
    images: ["/og-image.png"],
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <Script
            id="pricing-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "OfferCatalog",
                name: "BringBack Pricing",
                provider: { "@type": "Organization", name: "BringBack" },
                itemListElement: [
                  {
                    "@type": "Offer",
                    price: "2.49",
                    priceCurrency: "USD",
                    itemOffered: { "@type": "Service", name: "AI Photo Restoration" },
                  },
                  {
                    "@type": "Offer",
                    price: "4.99",
                    priceCurrency: "USD",
                    itemOffered: {
                      "@type": "Service",
                      name: "AI Photo Restoration + Animation",
                    },
                  },
                ],
              }),
            }}
          />
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="  text-4xl lg:text-5xl text-black mb-6">Simple, Fair Pricing</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No subscriptions, no hidden fees. Just professional photo restoration at an honest price. Choose the plan that's right for you.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">

            {/* Starter Plan */}
            <div className="bg-gray-50 rounded-3xl p-8 border-2 border-gray-200 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-black">Starter</h3>
              <p className="text-gray-600 mt-1 mb-6">Perfect for high-quality photo restoration.</p>

              <div className="mb-8">
                <span className="text-5xl font-bold text-black">$2.49</span>
                <div className="text-gray-600 text-lg">One-time payment</div>
              </div>

              <div className="flex-grow space-y-4 mb-8 text-left">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><span className="font-semibold text-black">5</span> Photo Restorations</span>
                </div>

                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">High-Resolution Output</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Credits Never Expire</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  <span className="text-red-400">Free Photo Enhance/Upscale</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  <span className="text-red-400">Free Digital Frames</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">30-Day Money-Back Guarantee</span>
                </div>
              </div>

              <Link href="/login">

                <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden w-full">
                  Start Restoring
                </FramerButton>
              </Link>
            </div>

            {/* Restore & Animate Plan (Best Value) */}
            <div className="bg-black text-white rounded-3xl p-8 border-2 border-gray-800 relative h-full flex flex-col">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center border border-gray-300">
                  <Star className="w-4 h-4 mr-2 text-black" />
                  Best Value
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white">Pro</h3>
              <p className="text-gray-400 mt-1 mb-6">Everything in Starter, plus bring photos to life.</p>

              <div className="mb-8">
                <span className="text-5xl font-bold text-white">$4.99</span>
                <div className="text-gray-400 text-lg">One-time payment</div>
              </div>

              <div className="flex-grow space-y-4 mb-8 text-left">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300"><span className="font-semibold text-white">5</span> Photo Restorations</span>
                </div>

                <div className="flex items-center font-bold">
                  <Film className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span><span className="text-white">1</span> High-Quality Video Animation</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">High-Resolution Output</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Credits Never Expire</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  <span className="text-red-400">Free Photo Enhance/Upscale</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  <span className="text-red-400">Free Digital Frames</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">30-Day Money-Back Guarantee</span>
                </div>
              </div>

              <Link href="/login" className="mt-auto">
                <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden w-full bg-white text-black hover:bg-gray-200">
                  Bring Memories to Life
                </FramerButton>
              </Link>
            </div>
          </div>
          <div className="text-center mt-4 max-w-3xl mx-auto">
            <p className="text-md text-gray-500 mt-2">
              Even after restoration, if we detect any damage (tears, stains, scratches) is still present which costed you one credit, <span className="font-bold text-red-500">we automatically offer one free re‑restoration.</span>
            </p>
          </div>


          {/* Value Proposition */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Professional results in under 30 seconds. No waiting weeks like traditional restoration services.
              </p>
            </div>
            <div className="text-center p-6">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">100% Secure</h3>
              <p className="text-gray-600">
                Your photos are encrypted and uploaded media automatically deleted from our servers within 30 minutes. Complete privacy guaranteed.
              </p>
            </div>
            <div className="text-center p-6">
              <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">No Expiration</h3>
              <p className="text-gray-600">
                Your restoration credits never expire. Use them whenever you're ready to restore your memories.
              </p>
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h2 className=" text-3xl font-bold text-black text-center mb-8">How We Compare photo restoration</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-black">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-black">BringBack.pro</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-600">Traditional Service</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Price per photo</td>
                    <td className="py-4 px-4 text-center font-semibold text-green-600">~$0.50</td>
                    <td className="py-4 px-4 text-center text-gray-600">$20-100</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Processing time</td>
                    <td className="py-4 px-4 text-center font-semibold text-green-600">30 seconds</td>
                    <td className="py-4 px-4 text-center text-gray-600">2-4 weeks</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Quality guarantee</td>
                    <td className="py-4 px-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">Varies</td>
                  </tr>

                  {/* New rows */}
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Photo animation</td>
                    <td className="py-4 px-4 text-center font-semibold text-green-600">
                      $2 Only
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">Not available</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">AI family portrait</td>
                    <td className="py-4 px-4 text-center font-semibold text-green-600">
                      $1 Only
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">$100-200</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Free digital photo frame</td>
                    <td className="py-4 px-4 text-center font-semibold text-green-600">Included</td>
                    <td className="py-4 px-4 text-center text-gray-600">Not included</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 text-gray-700">Money-back guarantee</td>
                    <td className="py-4 px-4 text-center font-semibold text-green-600">30 days</td>
                    <td className="py-4 px-4 text-center text-gray-600">Rare</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className=" text-3xl font-bold text-black text-center mb-8">Pricing Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Is this a one-time payment?</h3>
                <p className="text-gray-600">
                  Yes! We believe in simple, honest pricing. Both our plans are a single, one-time purchase with no subscriptions or hidden fees.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-black mb-2">What is the difference between the plans?</h3>
                <p className="text-gray-600">
                  The Starter plan provides 5 photo restorations. The Restore & Animate plan gives you the same 5 restorations, plus 10 credits to create a high-quality, gentle video animation from any one of your restored photos. Both plans include our free AI photo enhancement feature.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Do credits expire?</h3>
                <p className="text-gray-600">
                  Never. Your restoration and animation credits are yours forever. Use them next week or next year - they'll always be available.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">What if I'm not satisfied?</h3>
                <p className="text-gray-600">
                  We offer a 30-day money-back guarantee. If you're not completely happy with your restored photos,
                  we'll refund your purchase - no questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <div className="bg-black text-white rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to restore your memories?</h3>
              <p className="text-gray-300 mb-6">
                Join thousands of families who've already brought their precious photos back to life.
              </p>
              <Link href="/login">
                <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 h-auto font-medium text-base">
                  Start Restoring Now
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-3">
                Simple one-time pricing. Secure payment.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}