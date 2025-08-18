"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Coins, ChevronDown, LogOut,Image as ImageIcon, Video, UserIcon } from "lucide-react"

import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface DashboardHeaderProps {
  user: {
    email?: string
    id: string
  }
  credits: number
  onBuyCredits: () => void
}

export default function DashboardHeader({ user, credits, onBuyCredits }: DashboardHeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const { toast } = useToast()

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Redirect to login page
        window.location.href = '/login'
      } else {
        toast.error('Failed to sign out. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to sign out. Please try again.')
    }
  }

  return (
    <motion.div className="fixed inset-x-0 top-0 z-40 w-full pt-2">
      <motion.div className="relative z-[60] mx-auto w-[70%] max-w-6xl flex items-center justify-between rounded-lg bg-white/95 border border-gray-200 px-6 py-3 hidden backdrop-blur-lg lg:flex">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <Image 
              src="/header-logo.webp" 
              alt="BringBack Logo" 
             width={80} 
              height={32} 
              className="w-36 h-8"
              style={{ width: 'auto' }}
            />
          </a>
        </div>

        {/* Credits Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Coins className={`w-5 h-5 ${credits === 0 ? 'text-red-500' : 'text-gray-600'}`} />
            <span className={`font-medium ${credits === 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {credits} credits
            </span>
          </div>
          <button
            onClick={onBuyCredits}
            className="text-xs px-3 py-1.5 rounded font-medium transition-colors bg-black text-white hover:bg-gray-800"
          >
            Buy More
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative profile-dropdown-container">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
          
          {showProfileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                </div>
              </div>
                  <Link href="/dashboard">

                <button
                 
                  className="w-full text-left px-3 py-2 text-sm  transition-colors flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    Dashboard
                  </span>
                </button>
              </Link>
              <Link href="/dashboard/animate">
                <button
                 
                  className="w-full text-left px-3 py-2 text-sm  transition-colors flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Animate
                </button>
              </Link>
         
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile Header */}
      <motion.div className="relative z-50 mx-auto flex w-[95%] max-w-[calc(100vw-1rem)] items-center justify-between bg-white/95 border border-gray-200 rounded-lg backdrop-blur-lg py-3 px-4 lg:hidden">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <Image 
              src="/header-logo.webp" 
              alt="BringBack Logo" 
              width={28} 
              height={28} 
              className="w-7 h-7"
              style={{ width: 'auto' }}
            />
          </a>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mobile Credits Display */}
          <div className="flex items-center gap-2 text-sm">
            <Coins className={`w-4 h-4 ${credits === 0 ? 'text-red-500' : 'text-gray-600'}`} />
            <span className={`font-medium ${credits === 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {credits}
            </span>
          </div>
          
          {/* Mobile Buy Credits Button */}
          <button
            onClick={onBuyCredits}
            className="text-xs px-3 py-1.5 rounded font-medium transition-colors bg-black text-white hover:bg-gray-800"
          >
            Buy
          </button>
          
          {/* Mobile Profile Button */}
          <div className="relative profile-dropdown-container">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}