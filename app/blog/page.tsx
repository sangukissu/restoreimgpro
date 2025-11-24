import type { Metadata } from "next"
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import BlogCard from "@/components/blog-card"
import Link from "next/link"
import { OfflineBanner } from "@/components/network-status"
import { CTA } from '@/components/landing/CTA';

import { Button } from "@/components/ui/button"
import { getAllPosts, formatDate, calculateReadingTime, extractExcerpt, type WordPressPost } from "@/lib/wordpress"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Blog - BringBack | Photo Restoration Tips & Stories",
  description:
    "Learn about photo restoration, preservation tips, and read inspiring stories of memories brought back to life.",
  robots: "index, follow",
  alternates: {
    canonical: "/blog",
  },
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
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          {/* Offline Banner */}
          <OfflineBanner />

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                <span className="text-brand-orange">//</span> Latest <span className="text-brand-orange">//</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
                Stories & <br />
                <span className="text-gray-400">Restoration Tips.</span>
              </h1>
            </div>
            <div className="max-w-sm">
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                Learn about photo restoration, preservation tips, and read inspiring stories of memories brought back to life.
              </p>
            </div>
          </div>

          {/* Blog Grid Container */}
          <div className="bg-brand-surface p-3 rounded-[1.8rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                <div className="col-span-full text-center py-24 bg-white rounded-[1.5rem]">
                  <p className="text-gray-500 text-lg font-medium">No blog posts available at the moment.</p>
                  <p className="text-gray-400 text-sm mt-2">Please check your internet connection and try again.</p>
                </div>
              )}
            </div>
          </div>

          {/* Load More Button - Only show if more than 8 posts */}
          {blogPosts.length > 8 && (
            <div className="text-center mt-12">
              <button className="bg-brand-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-200 font-bold tracking-wide hover:shadow-lg hover:-translate-y-1">
                Load More Posts
              </button>
            </div>
          )}
        </div>

        <CTA />
      </main>

      <Footer />
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="  text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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
