"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  Coins,
  CreditCard,
  Home,
  LogOut,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useCredits } from "@/hooks/use-credits"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { credits, loading } = useCredits()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm cursor-pointer">
                <Avatar className="h-8 w-8 rounded-lg ">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs">
                  <Coins className="h-3 w-3 text-amber-600" />
                  <span className="font-medium">{loading ? "…" : Number(credits || 0).toLocaleString()}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/pricing" className="flex items-center w-full">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Buy Credits
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
             <DropdownMenuGroup>
           <DropdownMenuItem className="cursor-pointer">
            <Home className="mr-2 h-4 w-4" />
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <BadgeCheck className="mr-2 h-4 w-4" />
            <Link href="/account">Account</Link>  
          </DropdownMenuItem>
        </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                try {
                  const response = await fetch('/api/auth/signout', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  })

                  if (response.ok) {
                    window.location.href = '/login'
                  }
                } catch (error) {
                  // no-op: keep UX simple for signout failures
                }
              }}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4 text-red-600" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
