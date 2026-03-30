"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Download } from "lucide-react"
import { createClient as createSupabaseClient } from "@/utils/supabase/client"

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

export default function MyMediaClient({ user, initialCredits, videos, images = [] }: MyMediaClientProps) {
  const [credits, setCredits] = useState(initialCredits)
  const [mediaVideos, setMediaVideos] = useState(videos)
  const [mediaImages, setMediaImages] = useState(images)

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDeletingAllMedia, setIsDeletingAllMedia] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMediaVideos(videos)
  }, [videos])

  useEffect(() => {
    setMediaImages(images)
  }, [images])

  useEffect(() => {
    const supabase = createSupabaseClient()

    const mergeVideo = (video: {
      id: string
      video_url: string | null
      preset_name: string
      created_at: string
      status?: string
      type?: string
    }) => {
      setMediaVideos((current) => {
        const next = current.filter((item) => !(item.id === video.id && item.type === video.type))
        return [video, ...next].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      })
    }

    const mergeImage = (image: {
      id: string
      url: string | null
      created_at: string
      status: string
      type: string
      title: string
    }) => {
      setMediaImages((current) => {
        const next = current.filter((item) => !(item.id === image.id && item.type === image.type))
        return [image, ...next].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      })
    }

    const channel = supabase
      .channel(`my-media-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_generations',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const record = payload.new as {
            id: string
            video_url: string | null
            preset_name: string
            created_at: string
            status?: string
          }

          if (!record?.id) {
            return
          }

          mergeVideo({
            id: record.id,
            video_url: record.video_url,
            preset_name: record.preset_name,
            created_at: record.created_at,
            status: record.status,
            type: 'animation',
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nostalgic_hug_generations',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const record = payload.new as {
            id: string
            video_url: string | null
            created_at: string
            status?: string
          }

          if (!record?.id) {
            return
          }

          mergeVideo({
            id: record.id,
            video_url: record.video_url,
            preset_name: 'Nostalgic Hug',
            created_at: record.created_at,
            status: record.status,
            type: 'nostalgic-hug',
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'image_restorations',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const record = payload.new as {
            id: string
            restored_image_url: string | null
            created_at: string
            status: string
          }

          if (!record?.id) {
            return
          }

          mergeImage({
            id: record.id,
            url: record.restored_image_url,
            created_at: record.created_at,
            status: record.status || 'processing',
            type: 'restoration',
            title: 'Restored Photo',
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user.id])


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
          {(mediaVideos && mediaVideos.length > 0 || mediaImages && mediaImages.length > 0) && (
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
          {mediaVideos && mediaVideos.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
              {mediaVideos.map((video) => (
                <div key={video.id} className="break-inside-avoid mb-6 border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
                  {video.video_url ? (
                    <>
                      <video
                        src={`/api/video-proxy?key=${encodeURIComponent(video.video_url)}`}
                        className="w-full h-auto"
                        controls
                        playsInline
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                      <div className="p-3 flex justify-between items-center bg-gray-50 border-t">
                        <div className="text-sm text-gray-500">
                          {new Date(video.created_at).toLocaleDateString()}
                        </div>
                        <button
                          onClick={() => handleDownload(`/api/video-proxy?key=${encodeURIComponent(video.video_url!)}`, `video-${video.id}.mp4`)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </>
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
          {mediaImages && mediaImages.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
              {mediaImages.map((image) => (
                <div key={image.id} className="break-inside-avoid mb-6 border rounded-lg overflow-hidden bg-white shadow-sm group relative flex flex-col">
                  {image.url ? (
                    <div className="relative">
                      <img
                        src={image.url.startsWith("images/") ? `/api/image-proxy?key=${encodeURIComponent(image.url)}` : image.url}
                        alt={image.title}
                        className="w-full h-auto block"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">Processing...</p>
                    </div>
                  )}
                  <div className="p-3 flex justify-between items-center bg-gray-50 border-t">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{image.title}</p>
                      <p className="text-xs text-gray-500">{new Date(image.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(image.url!.startsWith("images/") ? `/api/image-proxy?key=${encodeURIComponent(image.url!)}` : image.url!, `image-${image.id}.jpg`)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
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
