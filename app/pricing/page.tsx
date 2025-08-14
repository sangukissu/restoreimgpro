import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check, Star, Zap, Shield, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing - BringBack | AI Photo Restoration",
  description: "Simple, transparent pricing for AI photo restoration. $2 for 5 restorations, no subscriptions.",
  robots: "index, follow",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6">Simple, Fair Pricing</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No subscriptions, no hidden fees. Just professional photo restoration at an honest price.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto mb-16">
            <div className="bg-gray-50 rounded-3xl p-8 border-2 border-gray-200 text-center relative">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </div>
              </div>

              <div className="mt-4 mb-8">
                <div className="text-6xl font-bold text-black mb-2">$2</div>
                <div className="text-gray-600 text-lg">One-time payment</div>
                <div className="text-sm text-gray-500 mt-1">No monthly fees ever</div>
              </div>

              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Photo restorations</span>
                  <span className="font-semibold text-black">5 images</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Processing time</span>
                  <span className="font-semibold text-black">30 seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">High resolution output</span>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Commercial usage rights</span>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">30-day money back</span>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Credits never expire</span>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </div>

              <Button className="w-full bg-black text-white py-4 text-lg font-medium hover:bg-gray-800 transition-colors duration-200">
                Restore 5 Photos for $2
              </Button>

              <p className="text-xs text-gray-500 mt-3">Secure payment • Instant access</p>
            </div>
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
                Your photos are encrypted and automatically deleted within 30 minutes. Complete privacy guaranteed.
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
            <h2 className="text-3xl font-bold text-black text-center mb-8">How We Compare</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-black">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-black">BringBack</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-600">Traditional Service</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Price per photo</td>
                    <td className="py-4 px-4 text-center font-semibold text-green-600">$0.40</td>
                    <td className="py-4 px-4 text-center text-gray-600">$50-200</td>
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
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Revisions included</td>
                    <td className="py-4 px-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">Extra cost</td>
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
            <h2 className="text-3xl font-bold text-black text-center mb-8">Pricing Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Why is BringBack so affordable?</h3>
                <p className="text-gray-600">
                  Our AI technology processes thousands of photos simultaneously, eliminating the need for expensive
                  manual labor. We pass these savings directly to you.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Do credits expire?</h3>
                <p className="text-gray-600">
                  Never. Your restoration credits are yours forever. Use them next week or next year - they'll always be
                  available.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Can I buy more credits?</h3>
                <p className="text-gray-600">
                  You can purchase additional restoration credits anytime. Each pack of 5 restorations costs $2.
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
              <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 font-medium">
                Get Started for $2
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
