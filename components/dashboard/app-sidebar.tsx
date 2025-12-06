"use client"

import * as React from "react"
import {
  Send,
  SquareTerminal,
  Coins,
  Sparkles,
  Image as ImageIcon,
  Upload,
  Sparkles as SparklesIcon,
  FolderOpen,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useCredits } from "@/hooks/use-credits"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const navSecondary = [
  {
    title: "Support",
    url: "mailto:support@drawgle.com",
    icon: Send,
  },
]

// Credits Card Component
function CreditsCard({ initialCreditBalance }: { initialCreditBalance?: number }) {
  const { credits, loading } = useCredits(initialCreditBalance)
  
  if (loading) {
    return (
      <Card className="mb-4 py-2">
        <CardContent className="p-3">
          <div className="text-sm font-medium mb-1">Plan Usage</div>
          <div className="text-xs text-muted-foreground mb-3 justify-between">Loading...</div>
          <div className="w-full h-8 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="py-2">
      <CardContent className="gap-1 flex flex-col px-3">
        <div className="text-sm font-medium mb-1">Plan Usage</div>
        <div className="text-xs text-muted-foreground mb-3 flex justify-between">
          <span className="flex items-center gap-2"><Coins className="h-3 w-3" />Credits</span> <span className="text-amber-600"> {Number(credits || 0).toLocaleString()}</span>
        </div>
        <Button
          size="sm"
          className="w-full bg-black hover:bg-black/90 text-white border-0"
          asChild
        >
          <Link href="/pricing">
            <Sparkles className="h-3 w-3 mr-2" /> Get Credits
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function AppSidebar({ 
  user,
  initialCreditBalance,
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string
    email: string
    avatar: string
    id?: string
  }
  initialCreditBalance?: number
}) {
  const userData = user || {
    name: "User",
    email: "user@example.com",
    avatar: "/placeholder-user.jpg",
  }

  const navItems = React.useMemo(() => [
    { title: "Dashboard", url: "/dashboard", icon: SquareTerminal },
    { title: "Restore", url: "/dashboard/restore", icon: SparklesIcon },
    { title: "Animate", url: "/dashboard/animate", icon: Sparkles },
    { title: "Family Portrait", url: "/dashboard/family-portrait", icon: ImageIcon },
    { title: "Nostalgic Hug", url: "/dashboard/nostalgic-hug", icon: ImageIcon },
    { title: "My Media", url: "/dashboard/my-media", icon: Upload },
    { title: "Referrals", url: "/dashboard/referrals", icon: FolderOpen },
  ], [])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
               <Link href="/">
<div className="flex items-center justify-center border-brand-black/10 border rounded-lg bg-brand-surface text-white">
                  <Image src="/bringback-logo.webp" alt="BringBack Logo" width={40} height={40} />
                </div>                
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">BringBack AI</span>
                  <span className="truncate text-xs">Old Photo Restoration</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <CreditsCard initialCreditBalance={initialCreditBalance} />
          <NavUser user={userData} />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
