import Link from "next/link"
import { cn } from "@/lib/utils"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"

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
    <article className="group h-full">
      <Link href={`/blog/${slug}`} className="block h-full">
        <div className="bg-white rounded-[1.5rem] p-4 flex flex-col gap-5 h-full transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-100">

          {/* Image Container */}
          <div className="relative overflow-hidden h-52 w-full rounded-[1.2rem]">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              priority={featured}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
                {category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow px-2 pb-2">
            {/* Meta */}
            <div className="flex items-center text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide gap-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{publishedAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{readTime}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-brand-black mb-3 leading-tight group-hover:text-brand-orange transition-colors">
              {title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3 mb-6 flex-grow">
              {excerpt}
            </p>

            {/* Read More */}
            <div className="flex items-center text-brand-black text-sm font-bold group-hover:translate-x-1 transition-transform duration-300 mt-auto">
              <span>Read Article</span>
              <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
