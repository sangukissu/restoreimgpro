"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FloatingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-black">Restore.me</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-700 hover:text-black">
                Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-black text-white hover:bg-gray-800">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
