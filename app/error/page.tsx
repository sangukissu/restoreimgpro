'use client'

import { Button } from "@/components/ui/button"
import { Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Something went wrong</h1>
          <p className="text-lg text-gray-600">
            We encountered an unexpected error. This might be due to an expired or invalid authentication link.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/login">
            <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base font-medium rounded-lg h-12">
              <Home className="mr-2 h-4 w-4" />
              Return to Login
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500">
            If the problem persists, please try requesting a new authentication link.
          </p>
        </div>
      </div>
    </div>
  )
}
