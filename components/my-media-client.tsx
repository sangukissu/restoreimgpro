"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface MyMediaClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  isPaymentSuccess: boolean
  videos: {
    id: string
    video_url: string | null
    preset_name: string
    created_at: string
    status?: string
    type?: string
  }[]
  images?: {
    id: string
    url: string | null
    created_at: string
    status: string
    type: string
    title: string
  }[]
}

export default function MyMediaClient({ user, initialCredits, isPaymentSuccess, videos, images = [] }: MyMediaClientProps) {
  const [credits, setCredits] = useState(initialCredits)

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDeletingAllMedia, setIsDeletingAllMedia] = useState(false)
  const { toast } = useToast()

  // Poll for status updates
  useEffect(() => {
    const pendingVideos = videos.filter(v => v.status === 'generating' || v.status === 'uploading')

    if (pendingVideos.length === 0) return

    const intervalId = setInterval(async () => {
      let hasUpdates = false

      for (const video of pendingVideos) {
        try {
          // Determine which endpoint to call based on video type
          const endpoint = (video as any).type === 'nostalgic-hug'
            ? `/api/nostalgic-hug/status?id=${video.id}`
            : `/api/fal/animate/status?id=${video.id}`

          const response = await fetch(endpoint)
          const data = await response.json()

          if (data.status === 'completed' || data.status === 'failed') {
            hasUpdates = true
          }
        } catch (error) {
          console.error('Error checking status:', error)
        }
      }

      if (hasUpdates) {
        window.location.reload()
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(intervalId)
  }, [videos])



  // Poll for image status updates
  useEffect(() => {
    const pendingImages = images.filter(img => img.status !== 'completed' && img.status !== 'failed')

    if (pendingImages.length === 0) return

    const intervalId = setInterval(() => {
      // Since we don't have a specific status endpoint for images yet, we'll just reload 
      // if there are pending images, assuming the user might be waiting.
      // However, to avoid constant reloads, we might just want to rely on manual refresh 
      // or implement a proper check if endpoints existed.
      // For now, let's stick to the video polling logic which reloads on updates.
      // If we want to support image polling, we'd need endpoints.
      // Given "without touching logic", I won't add complex polling for images if it doesn't exist.
      // But I should probably check if any images are processing.

      // Actually, the user didn't ask for polling for images, just to show them.
      // I'll leave this alone.
    }, 5000)

    return () => clearInterval(intervalId)
  }, [images])


  const handleDeleteAllMedia = async () => {
    setIsDeletingAllMedia(true)

    try {
      const response = await fetch('/api/delete-all-media', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete media')
      }

      const result = await response.json()
      toast.success('All media deleted successfully!')

      // Refresh the page to show updated state
      window.location.reload()

    } catch (error) {
      console.error('Error deleting all media:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete media')
    } finally {
      setIsDeletingAllMedia(false)
      setShowDeleteConfirmation(false)
    }
  }

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab if fetch fails (e.g. due to CORS)
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Dotted Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />
      </div>


      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete All Media</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all your media? This action cannot be undone and will permanently remove all your restored images and generated videos.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isDeletingAllMedia}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllMedia}
                disabled={isDeletingAllMedia}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingAllMedia ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Media</h1>
          {(videos && videos.length > 0 || images && images.length > 0) && (
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              disabled={isDeletingAllMedia}
            >
              Delete All Media
            </button>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Videos</h2>
          {videos && videos.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="break-inside-avoid mb-6 border rounded-lg overflow-hidden bg-white shadow-sm">
                  {video.video_url ? (
                    <video
                      src={`/api/video-proxy?key=${encodeURIComponent(video.video_url)}`}
                      className="w-full h-auto"
                      controls
                      playsInline
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">Video processing...</p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">You haven't generated any videos yet.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Photos</h2>
          {images && images.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
              {images.map((image) => (
                <div key={image.id} className="break-inside-avoid mb-6 border rounded-lg overflow-hidden bg-white shadow-sm group relative">
                  {image.url ? (
                    <div className="relative">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-auto block"
                        loading="lazy"
                      />
                      <button
                        onClick={() => handleDownload(image.url!, `image-${image.id}.jpg`)}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Download image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">Processing...</p>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900">{image.title}</p>
                    <p className="text-xs text-gray-500">{new Date(image.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">You haven't generated any photos yet.</p>
          )}
        </div>
      </main>
    </div>
  )
}