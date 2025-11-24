'use client'

import { useEffect, useRef, useState } from 'react'

interface BlogContentRendererProps {
  content: string
  className?: string
}

export default function BlogContentRenderer({ content, className = '' }: BlogContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!contentRef.current || !isClient) return

    // Process YouTube embeds
    const processYouTubeEmbeds = () => {
      const iframes = contentRef.current?.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]')
      iframes?.forEach((iframe) => {
        const wrapper = document.createElement('div')
        wrapper.className = 'relative w-full mb-6 rounded-lg overflow-hidden'
        wrapper.style.aspectRatio = '16/9'

        iframe.className = 'absolute inset-0 w-full h-full'
        iframe.setAttribute('loading', 'lazy')
        iframe.setAttribute('allowfullscreen', 'true')

        iframe.parentNode?.insertBefore(wrapper, iframe)
        wrapper.appendChild(iframe)
      })
    }

    // Process other video embeds (Vimeo, etc.)
    const processVideoEmbeds = () => {
      const iframes = contentRef.current?.querySelectorAll('iframe[src*="vimeo.com"], iframe[src*="dailymotion.com"]')
      iframes?.forEach((iframe) => {
        const wrapper = document.createElement('div')
        wrapper.className = 'relative w-full mb-6 rounded-lg overflow-hidden'
        wrapper.style.aspectRatio = '16/9'

        iframe.className = 'absolute inset-0 w-full h-full'
        iframe.setAttribute('loading', 'lazy')

        iframe.parentNode?.insertBefore(wrapper, iframe)
        wrapper.appendChild(iframe)
      })
    }

    // Process WordPress gallery blocks
    const processGalleries = () => {
      const galleries = contentRef.current?.querySelectorAll('.wp-block-gallery')
      galleries?.forEach((gallery) => {
        gallery.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'

        const images = gallery.querySelectorAll('img')
        images.forEach((img) => {
          img.className = 'w-full h-auto object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200'
          img.setAttribute('loading', 'lazy')
        })
      })
    }

    // Process WordPress columns
    const processColumns = () => {
      const columns = contentRef.current?.querySelectorAll('.wp-block-columns')
      columns?.forEach((column) => {
        column.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'
      })

      const columnItems = contentRef.current?.querySelectorAll('.wp-block-column')
      columnItems?.forEach((item) => {
        item.className = 'space-y-4'
      })
    }

    // Process images for lazy loading and responsive behavior
    const processImages = () => {
      const images = contentRef.current?.querySelectorAll('img')
      images?.forEach((img) => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy')
        }

        // Add click handler for image lightbox (optional)
        img.style.cursor = 'pointer'
        img.addEventListener('click', () => {
          // You can implement a lightbox here if needed
          window.open(img.src, '_blank')
        })
      })
    }

    // Process tables for responsive behavior
    const processTables = () => {
      const tables = contentRef.current?.querySelectorAll('table')
      tables?.forEach((table) => {
        const wrapper = document.createElement('div')
        wrapper.className = 'overflow-x-auto mb-6'

        table.parentNode?.insertBefore(wrapper, table)
        wrapper.appendChild(table)

        table.className = 'w-full border-collapse border border-gray-300 rounded-lg overflow-hidden'
      })
    }

    // Process code blocks for syntax highlighting
    const processCodeBlocks = () => {
      const preBlocks = contentRef.current?.querySelectorAll('pre')
      preBlocks?.forEach((pre) => {
        pre.className = 'bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto'

        const code = pre.querySelector('code')
        if (code) {
          code.className = 'bg-transparent text-gray-100 p-0 font-mono text-sm'
        }
      })
    }

    // Process WordPress buttons
    const processButtons = () => {
      const buttons = contentRef.current?.querySelectorAll('.wp-block-button__link')
      buttons?.forEach((button) => {
        button.className = 'inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 no-underline'
      })
    }

    // Process native video elements
    const processVideos = () => {
      const videos = contentRef.current?.querySelectorAll('video')
      videos?.forEach((video) => {
        // Save the src to ensure we don't lose it
        const src = video.getAttribute('src')
        const currentSrc = video.currentSrc

        video.className = 'w-full h-auto rounded-lg shadow-sm bg-black'
        video.setAttribute('controls', 'true')
        video.setAttribute('playsinline', 'true')
        video.setAttribute('preload', 'auto')
        video.setAttribute('crossorigin', 'anonymous')

        // If there are source elements, ensure they are processed
        const sources = video.querySelectorAll('source')
        sources.forEach(source => {
          if (!source.getAttribute('type') && source.getAttribute('src')?.endsWith('.mp4')) {
            source.setAttribute('type', 'video/mp4')
          }
        })

        // Force reload to apply changes
        video.load()

        // Ensure parent figure (if exists) has proper spacing
        const parent = video.parentElement
        if (parent?.tagName === 'FIGURE' && parent.classList.contains('wp-block-video')) {
          parent.className = 'mb-6'
        }
      })
    }

    // Process all content
    processYouTubeEmbeds()
    processVideoEmbeds()
    processVideos()
    processGalleries()
    processColumns()
    processImages()
    processTables()
    processCodeBlocks()
    processButtons()

  }, [content, isClient])

  return (
    <div
      ref={contentRef}
      className={`blog-content max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}