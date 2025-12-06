"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings, LayoutDashboard } from "lucide-react"

export function NavActions() {
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    try {
      setSigningOut(true)
      const res = await fetch("/api/auth/signout", { method: "POST" })
      if (!res.ok) {
        throw new Error("Failed to sign out")
      }
      // Redirect to landing after sign out (adjust as needed)
      window.location.href = "/"
    } catch (err) {
      // In production, surface a toast; keeping minimal here
      console.error("[v0] Sign out failed:", err)
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* You can add quick actions (search, notifications) here later */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open user menu" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/diverse-profile-avatars.png" alt="User avatar" />
              <AvatarFallback className="text-xs">UA</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="truncate">Your Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/dashboard" className="w-full">
            <DropdownMenuItem className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/settings" className="w-full">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-red-600 focus:text-red-600 cursor-pointer"
            disabled={signingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{signingOut ? "Signing out…" : "Sign out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default NavActions
