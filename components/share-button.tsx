"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface ShareButtonProps {
  title: string
  url: string
  text?: string
}

export default function ShareButton({ title, url, text }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleShare = async () => {
    if (!isClient) return
    
    setIsSharing(true)
    
    try {
      // Check if the Web Share API is supported
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title,
          text: text || title,
          url,
        })
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(url)
        
        // Show a temporary notification
        const notification = document.createElement('div')
        notification.textContent = 'Link copied to clipboard!'
        notification.className = 'fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity'
        document.body.appendChild(notification)
        
        setTimeout(() => {
          notification.style.opacity = '0'
          setTimeout(() => {
            document.body.removeChild(notification)
          }, 300)
        }, 2000)
      }
    } catch (error) {
      console.error('Error sharing:', error)
      
      // Fallback: Try to copy to clipboard
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url)
          
          const notification = document.createElement('div')
          notification.textContent = 'Link copied to clipboard!'
          notification.className = 'fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity'
          document.body.appendChild(notification)
          
          setTimeout(() => {
            notification.style.opacity = '0'
            setTimeout(() => {
              document.body.removeChild(notification)
            }, 300)
          }, 2000)
        } catch (clipboardError) {
          console.error('Error copying to clipboard:', clipboardError)
        }
      }
    } finally {
      setIsSharing(false)
    }
  }

  // Prevent hydration mismatch by ensuring consistent initial render
  if (!isClient) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2" 
        disabled
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2" 
      onClick={handleShare}
      disabled={isSharing}
    >
      <Share2 className="w-4 h-4" />
      {isSharing ? 'Sharing...' : 'Share'}
    </Button>
  )
}