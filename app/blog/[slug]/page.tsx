import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogContentRenderer from "@/components/blog-content-renderer"
import ShareButton from "@/components/share-button"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getPostBySlug, getAllPostSlugs, formatDate, calculateReadingTime, type WordPressPost } from "@/lib/wordpress"
import { notFound } from "next/navigation"
import Image from "next/image"

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
        url: 'https://bringback.pro/bringback-logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://bringback.pro/blog/${post.slug}`
    },
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
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
      />
      <Header />
      <main className="pb-20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-8">
              <Link href="/blog" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">

                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{category}</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{publishedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readTime}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">{post.title}</h1>
              
              {post.excerpt && (
                <div className="text-xl text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.excerpt }} suppressHydrationWarning />
              )}
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {post.author.node.avatar?.url ? (
                    <Image
                      src={post.author.node.avatar.url}
                      alt={post.author.node.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{post.author.node.name}</p>
                    <p className="text-sm text-gray-600">Author</p>
                  </div>
                </div>
                
                <div className="ml-auto">
                  <ShareButton 
                    title={post.title}
                    url={`https://bringback.pro/blog/${post.slug}`}
                    text={post.excerpt || `Check out this article: ${post.title}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage?.node?.sourceUrl && (
          <div className="max-w-4xl mx-auto px-4 relative mt-10 z-10">
            <div className="bg-white rounded-lg overflow-hidden">

              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || post.title}
                width={1200}
                height={800}
                className="w-full h-auto aspect-[3/2] object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="bg-white">
            <BlogContentRenderer content={post.content} />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
            <div className="bg-black text-white rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to restore your memories?</h3>
              <p className="text-gray-300 mb-6">
                Join thousands of families who've already brought their precious photos back to life.
              </p>
              <Link href="/login">

              <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 font-medium">
                Get Started for $2
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
