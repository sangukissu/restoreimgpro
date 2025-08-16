import { Button } from "@/components/ui/button"
import Link  from "next/link"

export default function Footer() {
  return (
    <footer className="bg-transparent ">
      <div className="mx-auto ">
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Logo */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-black mb-2">BringBack</h3>
              <p className="text-gray-600">Bringing your precious memories back to life</p>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
             <Link href="https://x.com/ainotsosmart">

              <Button
                className="hover:bg-gray-100 transition-colors bg-transparent p-3"
              >
               <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 50 50">
<path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
</svg>
                <span className="sr-only">X</span>
              </Button>
          </Link>
            </div>

           
            <nav className="flex flex-wrap justify-center gap-6 leading-tight">
              <a href="/privacy" className="text-gray-600 hover:text-black transition-colors">
                Privacy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-black transition-colors">
                Terms
              </a>
              <a href="/pricing" className="text-gray-600 hover:text-black transition-colors">
                Pricing
              </a>
              <a href="/refunds" className="text-gray-600 hover:text-black transition-colors">
                Refunds
              </a>
              <a href="/blog" className="text-gray-600 hover:text-black transition-colors">
                Blog
              </a>
            </nav>

            {/* Copyright */}
            <div className="text-center pt-4 border-t border-gray-200 w-full">
              <p className="text-sm text-gray-500">© 2025 BringBack.pro. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
