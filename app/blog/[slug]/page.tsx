import type { Metadata } from "next"
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import BlogContentRenderer from "@/components/blog-content-renderer"
import ShareButton from "@/components/share-button"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getPostBySlug, getAllPostSlugs, formatDate, calculateReadingTime, type WordPressPost } from "@/lib/wordpress"
import { notFound } from "next/navigation"
import Image from "next/image"
import { CTA } from '@/components/landing/CTA';

// Generate static paths for all blog posts
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const slugs = await getAllPostSlugs()
    return slugs.map((slug) => ({
      slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await getPostBySlug(slug)

    if (!post) {
      return {
        title: "Post Not Found - BringBack Blog",
        description: "The requested blog post could not be found.",
      }
    }

    const seoTitle = post.title
    const seoDescription = post.excerpt || "Read this article on BringBack Blog"
    const ogImage = post.featuredImage?.node?.sourceUrl || "/placeholder.svg"

    return {
      title: `${seoTitle} - BringBack Blog`,
      description: seoDescription,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        type: "article",
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: [post.author.node.name],
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.featuredImage?.node?.altText || post.title,
        }],
        url: `https://bringback.pro/blog/${post.slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: [ogImage],
      },
      alternates: {
        canonical: `https://bringback.pro/blog/${post.slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: "Blog Post - BringBack",
      description: "Read the latest articles about photo restoration and preservation.",
    }
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const post = await getPostBySlug(slug)

    if (!post) {
      notFound()
    }

    return <BlogPostContent post={post} />
  } catch (error) {
    console.error('Error fetching blog post:', error)
    notFound()
  }
}

function BlogPostContent({ post }: { post: WordPressPost }) {
  const readTime = calculateReadingTime(post.content)
  const publishedDate = formatDate(post.date)
  const category = post.categories.nodes[0]?.name || "General"

  const blogPostJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://bringback.pro/blog/${post.slug}`,
    headline: post.title,
    description: post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '') : post.title,
    image: post.featuredImage?.node?.sourceUrl || 'https://bringback.pro/placeholder.svg',
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      '@type': 'Organization',
      name: 'BringBack Team',
      url: 'https://bringback.pro'
    },
    publisher: {
      '@type': 'Organization',
      name: 'BringBack',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bringback.pro/bringback-logo.webp'
      }
    },
    // Use URL string for mainEntityOfPage to avoid emitting a WebPage entity
    mainEntityOfPage: `https://bringback.pro/blog/${post.slug}`,
    articleSection: category,
    wordCount: post.content.split(' ').length,
    timeRequired: `PT${readTime}M`,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'Blog',
      '@id': 'https://bringback.pro/blog',
      name: 'BringBack Blog'
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
      />
      <Navbar />
      <main className="py-12">

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">

          {/* Back Link */}
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-brand-black transition-colors uppercase tracking-wide">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>

          {/* Article Container */}
          <div className="bg-brand-surface p-3 rounded-[2.5rem]">

            {/* Inner White Paper */}
            <div className="bg-white rounded-[2rem] overflow-hidden">

              {/* Hero Section */}
              <div className="relative pt-12 pb-12 px-6 sm:px-12 lg:px-20 border-b border-gray-100">
                <div className="max-w-4xl mx-auto">

                  {/* Meta Tags */}
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-500 mb-8 uppercase tracking-wide">
                    <span className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full border border-brand-orange/20">{category}</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{publishedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-[850] text-brand-black leading-[1.05] tracking-tight mb-8">
                    {post.title}
                  </h1>

                  {/* Author & Share */}
                  <div className="flex sm:items-center justify-between gap-6 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      {post.author.node.avatar?.url ? (
                        <Image
                          src={post.author.node.avatar.url}
                          alt={post.author.node.name}
                          width={48}
                          height={48}
                          className="rounded-full border-2 border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-brand-black text-lg leading-none">{post.author.node.name}</p>
                        <p className="text-sm text-gray-500 font-medium mt-1">Author</p>
                      </div>
                    </div>

                    <ShareButton
                      title={post.title}
                      url={`https://bringback.pro/blog/${post.slug}`}
                      text={post.excerpt || `Check out this article: ${post.title}`}
                    />
                  </div>

                </div>
              </div>

              {/* Featured Image */}
              {post.featuredImage?.node?.sourceUrl && (
                <div className="w-full flex justify-center px-4 sm:px-8">
                  <div className="relative w-full max-w-[1200px] bg-gray-100 rounded-[1.5rem] overflow-hidden">
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      width={1200}
                      height={800}
                      className="w-full h-auto object-cover"
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="px-6 sm:px-12 lg:px-20 py-16">
                <div className="max-w-3xl mx-auto">
                  {post.excerpt && (
                    <div className="text-xl sm:text-2xl text-gray-600 font-medium leading-relaxed mb-12 italic border-l-4 border-brand-orange pl-6" dangerouslySetInnerHTML={{ __html: post.excerpt }} suppressHydrationWarning />
                  )}

                  <BlogContentRenderer content={post.content} className="prose-lg prose-headings:font-bold prose-headings:text-brand-black prose-p:text-gray-600 prose-a:text-brand-orange prose-img:rounded-2xl" />
                </div>
              </div>

            </div>
          </div>

        </div>

        <CTA />
      </main>
      <Footer />
    </div>
  )
}
