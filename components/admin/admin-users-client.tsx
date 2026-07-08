"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Search,
  RefreshCcw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type SortKey = "email" | "name" | "credits" | "created_at"
type SortDir = "asc" | "desc"

interface AdminUser {
  user_id: string
  email: string
  name: string | null
  credits: number | null
  created_at: string | null
  is_admin: boolean
}

type Op = "set" | "add" | "remove"

export default function AdminUsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("created_at")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [editing, setEditing] = useState<AdminUser | null>(null)

  const fetchUsers = async (q: string) => {
    setLoading(true)
    try {
      const url = new URL("/api/admin/users", window.location.origin)
      if (q.trim()) url.searchParams.set("q", q.trim())
      const res = await fetch(url.toString(), { method: "GET" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `Request failed (${res.status})`)
      }
      const json = (await res.json()) as { users: AdminUser[] }
      setUsers(json.users ?? [])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      toast.error("Failed to load users", { description: message })
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Initial load + reload whenever the search query changes (debounced).
  useEffect(() => {
    const handle = window.setTimeout(() => {
      void fetchUsers(query)
    }, 250)
    return () => window.clearTimeout(handle)
  }, [query])

  const sorted = useMemo(() => {
    const copy = [...users]
    copy.sort((a, b) => {
      const av = a[sortKey] ?? ""
      const bv = b[sortKey] ?? ""
      let cmp = 0
      if (typeof av === "number" && typeof bv === "number") {
        cmp = av - bv
      } else {
        cmp = String(av).localeCompare(String(bv))
      }
      return sortDir === "asc" ? cmp : -cmp
    })
    return copy
  }, [users, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "credits" || key === "created_at" ? "desc" : "asc")
    }
  }

  const sortIcon = (key: SortKey) => {
    if (key !== sortKey) return <ArrowUpDown className="size-3.5 opacity-50" />
    return sortDir === "asc" ? (
      <ArrowUp className="size-3.5" />
    ) : (
      <ArrowDown className="size-3.5" />
    )
  }

  const totalUsers = users.length
  const totalCredits = useMemo(
    () => users.reduce((sum, u) => sum + (u.credits ?? 0), 0),
    [users]
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Badge variant="secondary">{totalUsers} users</Badge>
          <Badge variant="secondary">
            {totalCredits.toLocaleString()} credits
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchUsers(query)}
            disabled={loading}
          >
            <RefreshCcw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead
                label="Email"
                active={sortKey === "email"}
                onClick={() => toggleSort("email")}
                icon={sortIcon("email")}
              />
              <SortableHead
                label="Name"
                active={sortKey === "name"}
                onClick={() => toggleSort("name")}
                icon={sortIcon("name")}
              />
              <SortableHead
                label="Credits"
                active={sortKey === "credits"}
                onClick={() => toggleSort("credits")}
                icon={sortIcon("credits")}
                alignRight
              />
              <SortableHead
                label="Joined"
                active={sortKey === "created_at"}
                onClick={() => toggleSort("created_at")}
                icon={sortIcon("created_at")}
              />
              <TableHead className="w-24">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && users.length === 0 ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : sorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-sm text-gray-500 py-10"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((u) => (
                <TableRow key={u.user_id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{u.email}</span>
                      {u.is_admin && (
                        <Badge
                          variant="default"
                          className="w-fit mt-1 text-[10px]"
                        >
                          Admin
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {u.name ?? <span className="text-gray-400">—</span>}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">
                    {(u.credits ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {formatDate(u.created_at)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(u)}
                    >
                      Edit credits
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditCreditsDialog
        user={editing}
        onClose={() => setEditing(null)}
        onSaved={(updated) => {
          setUsers((prev) =>
            prev.map((u) =>
              u.user_id === updated.userId
                ? { ...u, credits: updated.newCredits }
                : u
            )
          )
        }}
      />
    </div>
  )
}

function SortableHead({
  label,
  active,
  onClick,
  icon,
  alignRight,
}: {
  label: string
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  alignRight?: boolean
}) {
  return (
    <TableHead className={alignRight ? "text-right" : undefined}>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wide font-semibold ${
          active ? "text-brand-black" : "text-gray-500"
        } ${alignRight ? "ml-auto" : ""}`}
      >
        {label}
        {icon}
      </button>
    </TableHead>
  )
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function EditCreditsDialog({
  user,
  onClose,
  onSaved,
}: {
  user: AdminUser | null
  onClose: () => void
  onSaved: (result: {
    userId: string
    newCredits: number
  }) => void
}) {
  const [operation, setOperation] = useState<Op>("add")
  const [amount, setAmount] = useState<string>("10")
  const [reason, setReason] = useState<string>("")
  const [pending, startTransition] = useTransition()

  // Reset the form whenever the dialog re-opens for a new user.
  useEffect(() => {
    if (user) {
      setOperation("add")
      setAmount("10")
      setReason("")
    }
  }, [user])

  if (!user) return null

  const numericAmount = Number(amount)
  const valid =
    Number.isFinite(numericAmount) &&
    numericAmount >= 0 &&
    (operation !== "set" || numericAmount <= 1_000_000)

  const submit = () => {
    if (!valid) {
      toast.error("Enter a valid non-negative amount")
      return
    }
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/admin/users/${user.user_id}/credits`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operation,
              amount: numericAmount,
              reason: reason.trim() || undefined,
            }),
          }
        )
        const body = (await res.json().catch(() => ({}))) as {
          success?: boolean
          newCredits?: number
          userId?: string
          error?: string
        }
        if (!res.ok || !body.success) {
          throw new Error(body.error ?? `Request failed (${res.status})`)
        }
        toast.success(
          `Credits updated — ${user.email} now has ${body.newCredits}`
        )
        if (body.userId && typeof body.newCredits === "number") {
          onSaved({ userId: body.userId, newCredits: body.newCredits })
        }
        onClose()
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        toast.error("Failed to update credits", { description: message })
      }
    })
  }

  const opLabel: Record<Op, string> = {
    set: "Set credits to",
    add: "Add to current",
    remove: "Remove from current",
  }

  const previewNext = (() => {
    if (!Number.isFinite(numericAmount)) return null
    if (operation === "set") return Math.min(1_000_000, Math.floor(numericAmount))
    if (operation === "add")
      return Math.min(1_000_000, (user.credits ?? 0) + Math.floor(numericAmount))
    return Math.max(0, (user.credits ?? 0) - Math.floor(numericAmount))
  })()

  return (
    <Dialog open={!!user} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit credits</DialogTitle>
          <DialogDescription>
            {user.email}
            {" · "}
            <span className="font-semibold text-brand-black">
              {(user.credits ?? 0).toLocaleString()} credits
            </span>{" "}
            currently
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Operation
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["add", "remove", "set"] as Op[]).map((op) => {
                const active = op === operation
                return (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setOperation(op)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                      active
                        ? "border-brand-orange bg-brand-orange/10 text-brand-black"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {op}
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-xs text-gray-500">{opLabel[operation]}</p>
          </div>

          <div>
            <label
              htmlFor="credits-amount"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Amount
            </label>
            <Input
              id="credits-amount"
              type="number"
              min={0}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label
              htmlFor="credits-reason"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Reason (optional, logged)
            </label>
            <Input
              id="credits-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Goodwill credit for support ticket #1234"
              className="mt-2"
              maxLength={500}
            />
          </div>

          {previewNext !== null && valid && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm">
              New balance:{" "}
              <span className="font-semibold">
                {previewNext.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending || !valid}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
