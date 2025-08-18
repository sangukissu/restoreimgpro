"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react"

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isOnline, setIsOnline] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Blog page error:', error)
    
    // Check network status
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [error])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    reset()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            {!isOnline ? (
              <WifiOff className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            ) : (
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {!isOnline ? 'You\'re offline' : 'Something went wrong'}
            </h1>
            <p className="text-gray-600">
              {!isOnline 
                ? 'Please check your internet connection and try again.'
                : 'We\'re having trouble loading the blog content. This might be a temporary issue.'
              }
            </p>
            {retryCount > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Retry attempts: {retryCount}
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={handleRetry} 
              className="w-full"
              disabled={!isOnline}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {!isOnline ? 'Waiting for connection...' : 'Try Again'}
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                Go to Homepage
              </Button>
            </Link>
            
            {!isOnline && (
              <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
                <Wifi className="w-4 h-4 mr-2" />
                <span>Waiting for internet connection...</span>
              </div>
            )}
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="font-semibold text-red-800 mb-2">Error Details (Development)</h3>
              <p className="text-sm text-red-700 font-mono">{error.message}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}