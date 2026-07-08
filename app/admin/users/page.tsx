import { Suspense } from "react"
import AdminUsersClient from "@/components/admin/admin-users-client"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-black">
          Users
        </h1>
        <p className="text-sm text-gray-600">
          All registered accounts. Click a row to edit credits.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <AdminUsersClient />
      </Suspense>
    </div>
  )
}
