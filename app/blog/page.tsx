import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogCard from "@/components/blog-card"
import Link from "next/link"
import { OfflineBanner } from "@/components/network-status"

import { Button } from "@/components/ui/button"
import { getAllPosts, formatDate, calculateReadingTime, extractExcerpt, type WordPressPost } from "@/lib/wordpress"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Blog - BringBack | Photo Restoration Tips & Stories",
  description:
    "Learn about photo restoration, preservation tips, and read inspiring stories of memories brought back to life.",
  robots: "index, follow",
  openGraph: {
    title: "Blog - BringBack | Photo Restoration Tips & Stories",
    description: "Learn about photo restoration, preservation tips, and read inspiring stories of memories brought back to life.",
    type: "website",
    url: "https://bringback.pro/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - BringBack | Photo Restoration Tips & Stories",
    description: "Learn about photo restoration, preservation tips, and read inspiring stories of memories brought back to life.",
  },
}

// Transform WordPress post to blog card format
function transformWordPressPost(post: WordPressPost, index: number) {
  return {
    title: post.title,
    excerpt: post.excerpt ? extractExcerpt(post.excerpt, 160) : extractExcerpt(post.content, 160),
    slug: post.slug,
    publishedAt: formatDate(post.date),
    readTime: calculateReadingTime(post.content),
    category: post.categories.nodes[0]?.name || "General",
    image: post.featuredImage?.node?.sourceUrl || "/placeholder.svg?height=400&width=600&text=Blog+Post",
    featured: index === 0, // First post is featured
    author: post.author.node.name,
  }
}



async function BlogContent() {
  try {
    const { posts } = await getAllPosts(20) // Fetch 20 posts
    const blogPosts = posts.map(transformWordPressPost)
    
    return (
      <BlogPageContent blogPosts={blogPosts} />
    )
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    // Fallback to empty state
    return (
      <BlogPageContent blogPosts={[]} />
    )
  }
}

function BlogPageContent({ blogPosts }: { blogPosts: any[] }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Offline Banner */}
          <OfflineBanner />
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-black mb-4">Blog</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Photo restoration tips and insights.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <BlogCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  slug={post.slug}
                  publishedAt={post.publishedAt}
                  readTime={post.readTime}
                  category={post.category}
                  image={post.image}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No blog posts available at the moment.</p>
                <p className="text-gray-400 text-sm mt-2">Please check your internet connection and try again.</p>
              </div>
            )}
          </div>

          {/* Load More Button - Only show if more than 8 posts */}
          {blogPosts.length > 8 && (
            <div className="text-center mt-12">
              <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-200 font-medium hover:shadow-lg">
                Load More Posts
              </button>
            </div>
          )}
        </div>
        <div className="text-center mt-16 px-4">
            <div className="bg-black text-white rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to restore your memories?</h3>
              <p className="text-gray-300 mb-6">
                Join thousands of families who've already brought their precious photos back to life.
              </p>
              <Link href="/login">

              <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 font-medium">
                Get Started for $2.49
              </Button>
              </Link>
              
              <p className="text-xs text-gray-300 mt-2">
                Only $0.40 per photo
              </p>
            </div>
          </div>
      </main>

      <Footer />
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Photo Restoration Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Loading latest articles...
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <BlogContent />
    </Suspense>
  )
}
