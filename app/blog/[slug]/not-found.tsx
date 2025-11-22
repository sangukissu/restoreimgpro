import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileX } from "lucide-react"

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <FileX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="  text-3xl font-bold text-gray-900 mb-2">Article Not Found</h1>
            <p className="text-gray-600">
              The blog post you're looking for doesn't exist or may have been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/blog">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full">
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}