import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  user_id: string
  name?: string
  email?: string
  credits: number
  total_credits_purchased: number
}

export function useCredits(initialCredits?: number) {
  const [credits, setCredits] = useState<number>(initialCredits || 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchCredits = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/user-profile", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch credits")
      }

      const profile: UserProfile = await response.json()
      setCredits(profile.credits)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch credits")
      toast.error("Failed to fetch credit balance")
    } finally {
      setLoading(false)
    }
  }, [toast])

  const updateCredits = useCallback(async (newCredits: number) => {
    setCredits(newCredits) // Optimistic update
  }, [])

  const deductCredits = useCallback(async (amount: number) => {
    if (credits < amount) {
      toast.error("You don't have enough credits for this operation")
      return false
    }

    try {
      setLoading(true)
      
      const response = await fetch("/api/deduct-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        throw new Error("Failed to deduct credits")
      }

      const { remainingCredits } = await response.json()
      setCredits(remainingCredits)
      
      toast.success(`${amount} credits deducted. Remaining: ${remainingCredits}`)
      
      return true
    } catch (err) {
      // Revert optimistic update
      await fetchCredits()
      
      toast.error("Failed to deduct credits")
      
      return false
    } finally {
      setLoading(false)
    }
  }, [credits, fetchCredits, toast])

  // Add back the missing functions that other components use
  const checkCredits = useCallback((required: number = 2): boolean => {
    return credits >= required
  }, [credits])

  const refreshCredits = useCallback(async () => {
    await fetchCredits()
  }, [fetchCredits])

  // Set up real-time subscription for credit updates
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase
      .channel('credits-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
        },
        (payload) => {
          if (payload.new && payload.new.credits !== undefined) {
            setCredits(payload.new.credits)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    credits,
    loading,
    error,
    fetchCredits,
    updateCredits,
    deductCredits,
    checkCredits,
    refreshCredits,
  }
} 