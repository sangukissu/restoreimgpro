import Link from "next/link"
import FloatingHeader from "@/components/floating-header"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Clock, Shield, Heart } from "lucide-react"
import { PointerHighlight } from "@/components/pointer-highlight" // Added PointerHighlight import
import { Compare } from "@/components/ui/compare" // Added Compare import

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="px-6 py-20 pt-32 max-w-6xl mx-auto text-center">
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </div>
            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Bring back{" "}
              <PointerHighlight
                rectangleClassName="bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 leading-tight px-2"
                pointerClassName="text-purple-500 h-3 w-3"
                containerClassName="inline-block mx-1"
              >
                <span className="relative z-10">old photos</span>
              </PointerHighlight>
              <br />
              and
              <br />
              <PointerHighlight
                rectangleClassName="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 leading-tight px-2"
                pointerClassName="text-blue-500 h-3 w-3"
                containerClassName="inline-block mx-1"
              >
                <span className="relative z-10">faded memories</span>
              </PointerHighlight>{" "}
              to life
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
              Restore your old, faded, torn or damaged photos into vibrant memories again. Quick restoration simple
              process and a lifetime of preserved moments.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-md font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              Restore Your Photo Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-md font-medium rounded-lg border-gray-200 hover:bg-gray-50 bg-transparent w-full sm:w-auto"
            >
              Explore Examples
            </Button>
          </div>
          <div className="flex flex-col items-center space-y-2 pt-8">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/happy-user-1.png" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/happy-user-2.png" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/happy-user-3.png" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/happy-user-4.png" alt="User" />
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-600 font-medium">Join 50,000+ Builders</p>
          </div>
          <div className="pt-12">
            <div className="flex justify-center">
              <div className="p-4 border rounded-3xl bg-neutral-50 border-neutral-200">
                <Compare
                  firstImage="/placeholder-1bjxl.png"
                  secondImage="/restored-family-photo.png"
                  firstImageClassName="object-cover"
                  secondImageClassname="object-cover"
                  className="h-[200px] w-[300px] sm:h-[300px] sm:w-[450px] md:h-[400px] md:w-[600px] lg:h-[500px] lg:w-[800px]" // Responsive sizing
                  slideMode="hover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Problem Section */}
      <section className="px-6 py-16 bg-gray-50/50">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold text-black">
            Your memories deserve better than blurry, damaged photos
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Every faded family photo, every damaged childhood memory, every precious moment trapped in poor quality—they
            all tell a story worth preserving perfectly.
          </p>
        </div>
      </section>
      {/* Features Section */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Why BringBack works like magic</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced AI technology meets human understanding to restore what matters most
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-3">Intelligent Enhancement</h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI doesn't just sharpen—it understands faces, textures, and details to recreate what was always meant
              to be there.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center mb-6">
              <Clock className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-3">Instant Results</h3>
            <p className="text-gray-600 leading-relaxed">
              Upload your photo and watch the transformation happen in real-time. No waiting, no complicated
              settings—just results.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-3">Privacy First</h3>
            <p className="text-gray-600 leading-relaxed">
              Your precious memories stay yours. We process everything securely and never store your personal photos.
            </p>
          </div>
        </div>
      </section>
      {/* Social Proof Section */}
      <section className="px-6 py-16 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Trusted by families worldwide</h2>
            <p className="text-lg text-gray-600">Join thousands who've already brought their memories back to life</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-black">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "I thought my grandmother's wedding photo was lost forever. BringBack didn't just restore it—it brought
                her back to life in that moment. I actually cried."
              </p>
              <p className="text-sm font-medium text-black">Sarah M.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-black">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Incredible results in seconds. My old family photos look like they were taken yesterday. This is the
                future of photo restoration."
              </p>
              <p className="text-sm font-medium text-black">Michael R.</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-black leading-tight">
              Ready to bring back
              <br />
              what matters most?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Don't let another day pass with damaged memories. Start your restoration journey now—it's free and takes
              less than a minute.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 px-12 py-4 text-lg font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Heart className="mr-2 h-5 w-5" />
              Restore My Photo Now
            </Button>
            <p className="text-sm text-gray-500">Join 50,000+ people who've already restored their precious memories</p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl font-bold text-black mb-2">BringBack</p>
          <p className="text-gray-600">Bringing your precious memories back to life</p>
        </div>
      </footer>
    </div>
  )
}
 
