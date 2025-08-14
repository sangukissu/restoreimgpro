import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Calendar, Clock, Share2, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// This would typically come from a CMS or database
const getBlogPost = (slug: string) => {
  const posts = {
    "ai-revolutionizing-photo-restoration": {
      title: "How AI is Revolutionizing Photo Restoration",
      excerpt:
        "Discover how artificial intelligence is making professional photo restoration accessible to everyone, transforming damaged memories in seconds.",
      content: `
        <p>For decades, photo restoration was an art form reserved for skilled professionals with steady hands and endless patience. A single damaged photograph could take weeks to restore, costing hundreds of dollars and requiring specialized expertise that few possessed.</p>

        <p>Today, artificial intelligence is changing everything.</p>

        <h2>The Traditional Challenge</h2>
        <p>Traditional photo restoration required painstaking manual work. Restorers would spend hours carefully painting over scratches, reconstructing missing pieces, and color-correcting faded areas. The process was:</p>
        <ul>
          <li>Extremely time-consuming (weeks per photo)</li>
          <li>Expensive ($50-200+ per restoration)</li>
          <li>Limited by human skill and availability</li>
          <li>Inconsistent in quality and approach</li>
        </ul>

        <h2>Enter Artificial Intelligence</h2>
        <p>Modern AI photo restoration uses deep learning algorithms trained on millions of photographs to understand how images degrade over time and how to reverse that damage. These systems can:</p>

        <blockquote>
          <p>"Analyze patterns in damaged photos and intelligently reconstruct missing information based on surrounding context and learned patterns from thousands of similar images."</p>
        </blockquote>

        <h2>The BringBack Approach</h2>
        <p>At BringBack, we've developed proprietary AI models specifically trained for photo restoration. Our system:</p>
        <ul>
          <li>Processes photos in under 30 seconds</li>
          <li>Maintains the authentic character of original photos</li>
          <li>Handles multiple types of damage simultaneously</li>
          <li>Preserves facial features and important details</li>
        </ul>

        <h2>Real Results, Real Stories</h2>
        <p>We've restored over 100,000 photos, from faded wedding albums to torn family portraits. Each restoration preserves not just the image, but the memory itself.</p>

        <p>The future of photo restoration is here, and it's accessible to everyone. Your precious memories deserve to be preserved with the same care and quality that was once reserved for museums and archives.</p>

        <h2>Getting Started</h2>
        <p>Ready to see what AI can do for your old photos? Upload your damaged images and watch decades of wear disappear in seconds. Your memories are waiting to be brought back to life.</p>
      `,
      publishedAt: "January 15, 2025",
      readTime: "5 min read",
      category: "Technology",
      author: "Sarah Chen",
      authorRole: "AI Research Lead",
      image: "/placeholder.svg?height=400&width=800&text=AI+Photo+Restoration+Hero",
    },
  }

  return posts[slug as keyof typeof posts] || null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Article Not Found - BringBack Blog",
      description: "The requested article could not be found.",
    }
  }

  return {
    title: `${post.title} - BringBack Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6">
              <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">{post.category}</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {post.publishedAt}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.readTime}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {post.author}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Share Button */}
            <div className="flex justify-between items-center py-4 border-y border-gray-200">
              <div className="flex items-center space-x-4">
                <img
                  src="/placeholder.svg?height=40&width=40&text=Author"
                  alt={post.author}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-black">{post.author}</div>
                  <div className="text-sm text-gray-600">{post.authorRole}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Article Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-black mb-4">Ready to restore your photos?</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Transform your damaged memories into vibrant photos in seconds with AI-powered restoration.
              </p>
              <Button className="bg-black text-white hover:bg-gray-800">Start Restoring Now</Button>
            </div>
          </div>

          {/* Related Articles */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-black mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/preserving-old-family-photos" className="group">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Family+Photos"
                    alt="Preserving Family Photos"
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-black group-hover:text-gray-700 transition-colors">
                      5 Tips for Preserving Old Family Photos
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">4 min read</p>
                  </div>
                </div>
              </Link>

              <Link href="/blog/science-behind-photo-fading" className="group">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Photo+Science"
                    alt="Photo Fading Science"
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-black group-hover:text-gray-700 transition-colors">
                      The Science Behind Photo Fading
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">6 min read</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
