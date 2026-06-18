"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookHeart, Loader2, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function MemoryBookPinGate({
  shareId,
  signature,
}: {
  shareId: string
  signature: string
}) {
  const router = useRouter()
  const [pin, setPin] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const unlock = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await fetch(
        `/api/memory-books/share/${shareId}/unlock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signature, pin }),
        }
      )
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to unlock keepsake")
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to unlock keepsake")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-svh place-items-center bg-[#f6f2ea] px-5">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#5d83aa] text-white shadow-lg">
          <BookHeart className="size-6" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-[#252924]">
          A private Family Heritage keepsake
        </h1>
        <p className="mt-2 text-sm leading-6 text-black/52">
          The person who shared this book protected it with a PIN.
        </p>
        <form onSubmit={unlock} className="mt-7">
          <label className="block text-left text-sm font-semibold">
            Keepsake PIN
            <span className="relative mt-2 block">
              <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35" />
              <Input
                value={pin}
                required
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
                minLength={4}
                maxLength={8}
                className="h-11 bg-white pl-9 text-center text-lg tracking-[.35em]"
                onChange={(event) =>
                  setPin(event.target.value.replace(/\D/g, "").slice(0, 8))
                }
              />
            </span>
          </label>
          {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
          <Button
            type="submit"
            disabled={loading || pin.length < 4}
            className="mt-5 h-11 w-full bg-[#1f2c27] text-white"
          >
            {loading ? <Loader2 className="animate-spin" /> : <LockKeyhole />}
            Open keepsake
          </Button>
        </form>
      </div>
    </main>
  )
}
