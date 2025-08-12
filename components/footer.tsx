import { Button } from "@/components/ui/button"
import { Twitter } from "lucide-react"

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
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-gray-100 transition-colors bg-transparent"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-wrap justify-center gap-6 leading-tight">
              <a href="#features" className="text-gray-600 hover:text-black transition-colors">
                Privacy
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-black transition-colors">
                Terms
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-black transition-colors">
                Pricing
              </a>
              <a href="#examples" className="text-gray-600 hover:text-black transition-colors">
                Contact
              </a>
              <a href="#contact" className="text-gray-600 hover:text-black transition-colors">
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
