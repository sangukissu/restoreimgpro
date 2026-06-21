"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Map of routes to display names
const routeDisplayNames: Record<string, string> = {
  dashboard: "Dashboard",
  "memory-book": "Memory Book",
  "demo-tool": "Demo Tool",
  reports: "Reports",
  settings: "Settings",
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  // Split pathname and filter out empty strings
  const rawSegments = pathname.split("/").filter(Boolean)
  const isMemoryBookEditor =
    rawSegments[0] === "dashboard" &&
    rawSegments[1] === "memory-book" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      rawSegments[2] || ""
    )
  const pathSegments = isMemoryBookEditor
    ? rawSegments.slice(0, 2)
    : rawSegments
  
  // If we're at root or just "/", show home
  if (pathSegments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
  
  // Build breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const isLast = index === pathSegments.length - 1
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const displayName = routeDisplayNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    
    return {
      segment,
      displayName,
      href,
      isLast
    }
  })
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home link */}
        <BreadcrumbItem className="hidden md:block text-xs md:text-sm">
          <BreadcrumbLink href="/dashboard">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbItems.length > 0 && (
          <BreadcrumbSeparator className="hidden md:block text-xs md:text-sm" />
        )}
        
        {/* Dynamic breadcrumb items */}
        {breadcrumbItems.map((item, index) => (
          <div key={item.segment} className="flex items-center">
            <BreadcrumbItem className="text-xs md:text-sm">
              {item.isLast ? (
                <BreadcrumbPage>{item.displayName}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>
                  {item.displayName}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator className="text-xs md:text-sm" />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
