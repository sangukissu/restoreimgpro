"use client"

import { useEffect, useState } from 'react'
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react'
import { useNetworkStatus } from '@/hooks/use-network-status'

export default function NetworkStatus() {
  const { isOnline, isOffline } = useNetworkStatus()

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>You are currently offline. Some features may not work properly.</span>
      </div>
    </div>
  )
}

// Offline banner component for pages
export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 text-orange-500 mr-3" />
        <div>
          <p className="text-orange-700 font-medium">
            You're currently offline
          </p>
          <p className="text-orange-600 text-sm">
            Some content may be outdated. Please check your internet connection.
          </p>
        </div>
      </div>
    </div>
  )
}