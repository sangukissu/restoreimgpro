import Link from "next/link"
import FloatingHeader from "@/components/floating-header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <FloatingHeader />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
              Restore Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Memories
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Transform your old, damaged photos into stunning restored images with our advanced AI technology. 
              Preserve precious memories for generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-lg transition-colors duration-200"
              >
                View Examples
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Why Choose Restore.me?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Restoration</h3>
                <p className="text-gray-600">Advanced machine learning algorithms that understand photo damage patterns and restore images intelligently.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">Your photos are processed securely and never shared. We respect your privacy completely.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">High Quality Results</h3>
                <p className="text-gray-600">Get professional-grade restored photos that maintain the original character while removing damage.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Restore Your Photos?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who have already restored their precious memories with Restore.me
            </p>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Start Restoring Now
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
