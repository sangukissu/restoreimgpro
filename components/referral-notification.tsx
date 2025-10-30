'use client'

import { useState } from 'react'
import { X, Copy, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ReferralNotificationProps {
  referralCode: string
  onClose: () => void
}

export function ReferralNotification({ referralCode, onClose }: ReferralNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { success, error } = useToast()

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      success('Copied!')
    } catch (err) {
      error('Failed to copy')
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-200 ease-out ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
    } max-w-[280px] sm:max-w-sm`}>
      
      {/* Mobile Version - Minimal */}
      <div className="block sm:hidden bg-white border border-gray-200 rounded-lg shadow-sm p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">Referral Code</span>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 rounded-md p-2 mb-2">
          <code className="text-sm font-mono text-gray-800 flex-1">
            {referralCode}
          </code>
          <button
            onClick={handleCopyCode}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
        
        <p className="text-xs text-gray-600">
          Share for free restorations
        </p>
      </div>

      {/* Desktop Version - Detailed */}
      <div className="hidden sm:block bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Share & Earn!</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-sm text-white/90 mb-4">
          Share your referral code with friends and both get free restorations!
        </p>
        
        <div className="bg-white/20 rounded-md p-3 mb-4">
          <div className="flex items-center justify-between">
            <code className="text-white font-mono text-lg font-bold">
              {referralCode}
            </code>
            <button
              onClick={handleCopyCode}
              className="bg-white/20 hover:bg-white/30 rounded-md p-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="text-xs text-white/80 space-y-1">
          <div>• You get: 2 free restorations</div>
          <div>• Friend gets: 1 free restoration</div>
        </div>
      </div>
    </div>
  )
}