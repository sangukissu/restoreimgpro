import Link from "next/link"
import { cn } from "@/lib/utils"
import { Calendar, Clock, ArrowRight } from "lucide-react"

interface BlogCardProps {
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  readTime: string
  category: string
  image: string
  featured?: boolean
}

export default function BlogCard({
  title,
  excerpt,
  slug,
  publishedAt,
  readTime,
  category,
  image,
  featured = false,
}: BlogCardProps) {
  return (
    <article className="group">
      <Link href={`/blog/${slug}`} className="block">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden ">
          {/* Image */}
          <div className="relative overflow-hidden h-48">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">{category}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{publishedAt}</span>
              <span className="mx-2">•</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{readTime}</span>
            </div>

            <h2 className="font-bold text-black mb-3 group-hover:text-gray-700 transition-colors text-lg leading-tight">
              {title}
            </h2>

            <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{excerpt}</p>

            <div className="flex items-center text-black font-medium group-hover:text-gray-700 transition-colors">
              <span>Read more</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
