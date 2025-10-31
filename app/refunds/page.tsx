import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, CreditCard } from "lucide-react"

export const metadata: Metadata = {
  title: "Refund Policy - BringBack | AI Photo Restoration",
  description: "Learn about BringBack's 30-day money-back guarantee and refund process for photo restoration services.",
  robots: "index, follow",
}

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 border border-green-200 text-sm font-medium text-green-700 mb-6">
              <CheckCircle className="w-4 h-4 mr-2" />
              30-Day Money-Back Guarantee
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-black mb-6">Refund Policy</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We stand behind our photo restoration service. If you're not completely satisfied, we'll make it right.
            </p>
          </div>

          {/* Quick Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-black mb-2">30 Days</h3>
              <p className="text-sm text-gray-600">Full refund window from purchase date</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-black mb-2">No Questions</h3>
              <p className="text-sm text-gray-600">Simple refund process, no hassle</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <CreditCard className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-black mb-2">Full Refund</h3>
              <p className="text-sm text-gray-600">100% money back guarantee</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-black mb-4">Our Guarantee</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <p className="text-blue-800 font-medium">
                    We're confident you'll love your restored photos. If you're not completely satisfied with the
                    results, we'll refund your purchase within 30 days - no questions asked.
                  </p>
                </div>
                <div className="text-gray-700 space-y-4">
                  <p>
                    At BringBack, we believe in the quality of our AI photo restoration service. Every photo restoration
                    is backed by our 30-day money-back guarantee.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-4">Refund Eligibility</h2>
                <div className="text-gray-700 space-y-4">
                  <p>You're eligible for a full refund if:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You request a refund within 30 days of purchase</li>
                    <li>You're unsatisfied with the restoration quality</li>
                    <li>Technical issues prevented you from using the service</li>
                    <li>The service didn't meet your expectations</li>
                  </ul>
                  <p className="mt-4">
                    <strong>No conditions required.</strong> We trust our customers and want you to be happy with your
                    restored memories.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-4">How to Request a Refund</h2>
                <div className="text-gray-700 space-y-4">
                  <p>Getting a refund is simple:</p>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">Contact Us</h4>
                        <p className="text-gray-600">Email us at refunds@bringback.pro with your order details</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">We Process</h4>
                        <p className="text-gray-600">We'll process your refund within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">Money Back</h4>
                        <p className="text-gray-600">Refund appears in your account within 3-5 business days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-4">Refund Timeline</h2>
                <div className="text-gray-700 space-y-4">
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
                <h2 className="text-2xl font-bold text-black mb-4">Partial Refunds</h2>
                <div className="text-gray-700 space-y-4">
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
                <h2 className="text-2xl font-bold text-black mb-4">Contact for Refunds</h2>
                <div className="text-gray-700">
                  <p>Ready to request a refund or have questions about our policy?</p>
                  <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                    <div className="space-y-3">
                      <p>
                        <strong>Email:</strong> refunds@bringback.pro
                      </p>
                      <p>
                        <strong>Response Time:</strong> Within 24 hours
                      </p>
                      <p>
                        <strong>Phone:</strong> 1-800-BRINGBACK (for urgent issues)
                      </p>
                    </div>
                    <div className="mt-6">
                      <Button className="bg-black text-white hover:bg-gray-800">Request Refund</Button>
                    </div>
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
