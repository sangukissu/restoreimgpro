import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogCard from "@/components/blog-card"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Blog - BringBack | Photo Restoration Tips & Stories",
  description:
    "Learn about photo restoration, preservation tips, and read inspiring stories of memories brought back to life.",
  robots: "index, follow",
}

// Mock blog data - in a real app, this would come from a CMS or database
const blogPosts = [
  {
    title: "How AI is Revolutionizing Photo Restoration",
    excerpt:
      "Discover how artificial intelligence is making professional photo restoration accessible to everyone, transforming damaged memories in seconds.",
    slug: "ai-revolutionizing-photo-restoration",
    publishedAt: "Jan 15, 2025",
    readTime: "5 min read",
    category: "Technology",
    image: "/placeholder.svg?height=400&width=600&text=AI+Photo+Restoration",
    featured: true,
  },
  {
    title: "5 Tips for Preserving Old Family Photos",
    excerpt:
      "Learn the best practices for storing and protecting your precious family photographs to prevent damage over time.",
    slug: "preserving-old-family-photos",
    publishedAt: "Jan 12, 2025",
    readTime: "4 min read",
    category: "Tips",
    image: "/placeholder.svg?height=300&width=400&text=Family+Photos",
  },
  {
    title: "The Science Behind Photo Fading",
    excerpt:
      "Understanding why photos fade over time and how modern restoration techniques can reverse decades of damage.",
    slug: "science-behind-photo-fading",
    publishedAt: "Jan 10, 2025",
    readTime: "6 min read",
    category: "Education",
    image: "/placeholder.svg?height=300&width=400&text=Faded+Photos",
  },
  {
    title: "Restoring Wedding Photos: A Love Story",
    excerpt: "How one couple recovered their water-damaged wedding album and preserved their most precious memories.",
    slug: "restoring-wedding-photos-love-story",
    publishedAt: "Jan 8, 2025",
    readTime: "3 min read",
    category: "Stories",
    image: "/placeholder.svg?height=300&width=400&text=Wedding+Photos",
  },
  {
    title: "Digital vs Physical Photo Storage",
    excerpt: "Comparing the pros and cons of digital and physical photo storage methods for long-term preservation.",
    slug: "digital-vs-physical-photo-storage",
    publishedAt: "Jan 5, 2025",
    readTime: "7 min read",
    category: "Tips",
    image: "/placeholder.svg?height=300&width=400&text=Photo+Storage",
  },
  {
    title: "The History of Photography and Restoration",
    excerpt:
      "A journey through the evolution of photography and how restoration techniques have advanced over the decades.",
    slug: "history-photography-restoration",
    publishedAt: "Jan 3, 2025",
    readTime: "8 min read",
    category: "History",
    image: "/placeholder.svg?height=300&width=400&text=Photography+History",
  },
]

const categories = ["All", "Technology", "Tips", "Stories", "Education", "History"]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6">Stories, Tips & Insights</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Learn about photo restoration, discover preservation tips, and read inspiring stories of memories brought
              back to life.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard key={post.slug} {...post} featured={index === 0} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-gray-100 hover:bg-gray-200 text-black px-8 py-3 rounded-lg font-medium transition-colors">
              Load More Articles
            </button>
          </div>

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
        </div>
      </main>

      <Footer />
    </div>
  )
}
