'use client'

import { createClient } from '@/utils/supabase/client'

// Credit update event types
type CreditUpdateEvent = {
  userId: string
  newBalance: number
  change: number
  operation: 'add' | 'deduct' | 'set'
  timestamp: number
}

// Global credit manager class
class CreditManager {
  private static instance: CreditManager
  private supabase = createClient()
  private listeners: Set<(event: CreditUpdateEvent) => void> = new Set()
  private userCredits: Map<string, number> = new Map()
  private subscriptions: Map<string, any> = new Map()

  private constructor() {
    // Singleton pattern
  }

  static getInstance(): CreditManager {
    if (!CreditManager.instance) {
      CreditManager.instance = new CreditManager()
    }
    return CreditManager.instance
  }

  // Initialize credit tracking for a user
  async initializeUser(userId: string): Promise<number> {
    try {
      // Fetch current balance
      const { data, error } = await this.supabase
        .from('credits')
        .select('credits')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching credits:', error)
        return 0
      }

      const balance = data?.credits || 0
      this.userCredits.set(userId, balance)

      // Set up real-time subscription if not already exists
      if (!this.subscriptions.has(userId)) {
        this.setupRealtimeSubscription(userId)
      }

      return balance
    } catch (error) {
      console.error('Error initializing user credits:', error)
      return 0
    }
  }

  // Set up real-time subscription for credit changes
  private setupRealtimeSubscription(userId: string) {
    const channel = this.supabase
      .channel(`credits-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'credits',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'credits' in payload.new) {
            const newBalance = payload.new.credits as number
            const oldBalance = this.userCredits.get(userId) || 0
            const change = newBalance - oldBalance
            
            this.userCredits.set(userId, newBalance)
            
            // Emit credit update event
            this.emitCreditUpdate({
              userId,
              newBalance,
              change,
              operation: change > 0 ? 'add' : change < 0 ? 'deduct' : 'set',
              timestamp: Date.now()
            })
          }
        }
      )
      .subscribe()

    this.subscriptions.set(userId, channel)
  }

  // Get current credit balance for a user
  getCurrentBalance(userId: string): number {
    return this.userCredits.get(userId) || 0
  }

  // Update credits locally and emit event (for immediate UI updates)
  updateCreditsLocally(userId: string, newBalance: number, operation: 'add' | 'deduct' | 'set' = 'set') {
    const oldBalance = this.userCredits.get(userId) || 0
    const change = newBalance - oldBalance
    
    this.userCredits.set(userId, newBalance)
    
    this.emitCreditUpdate({
      userId,
      newBalance,
      change,
      operation,
      timestamp: Date.now()
    })
  }

  // Add event listener for credit updates
  onCreditUpdate(callback: (event: CreditUpdateEvent) => void): () => void {
    this.listeners.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback)
    }
  }

  // Emit credit update event to all listeners
  private emitCreditUpdate(event: CreditUpdateEvent) {
    this.listeners.forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        console.error('Error in credit update listener:', error)
      }
    })

    // Also emit as custom DOM event for non-React components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('creditUpdate', { detail: event }))
    }
  }

  // Cleanup subscriptions for a user
  cleanup(userId: string) {
    const channel = this.subscriptions.get(userId)
    if (channel) {
      this.supabase.removeChannel(channel)
      this.subscriptions.delete(userId)
    }
    this.userCredits.delete(userId)
  }

  // Cleanup all subscriptions
  cleanupAll() {
    this.subscriptions.forEach(channel => {
      this.supabase.removeChannel(channel)
    })
    this.subscriptions.clear()
    this.userCredits.clear()
    this.listeners.clear()
  }
}

// Export singleton instance
export const creditManager = CreditManager.getInstance()

// React hook for using credit manager
export function useCreditManager(userId: string | null) {
  const [balance, setBalance] = React.useState<number>(0)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!userId) {
      setBalance(0)
      setLoading(false)
      return
    }

    // Initialize user and get current balance
    creditManager.initializeUser(userId).then(initialBalance => {
      setBalance(initialBalance)
      setLoading(false)
    })

    // Listen for credit updates
    const unsubscribe = creditManager.onCreditUpdate((event) => {
      if (event.userId === userId) {
        setBalance(event.newBalance)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [userId])

  return {
    balance,
    loading,
    updateCredits: (newBalance: number, operation: 'add' | 'deduct' | 'set' = 'set') => {
      if (userId) {
        creditManager.updateCreditsLocally(userId, newBalance, operation)
      }
    }
  }
}

// Utility function for API routes to update credits and notify clients
export function notifyCreditUpdate(userId: string, newBalance: number, operation: 'add' | 'deduct' | 'set' = 'set') {
  // This will be handled by the real-time subscription automatically
  // But we can also emit a local event for immediate feedback
  creditManager.updateCreditsLocally(userId, newBalance, operation)
}

// Enhanced API helper that automatically updates credit display
export async function makeApiCallWithCreditUpdate<T>(
  apiCall: () => Promise<Response>,
  userId: string
): Promise<T> {
  const response = await apiCall()
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`)
  }
  
  const data = await response.json()
  
  // If the response includes a new balance, update it locally for immediate UI feedback
  if (data.newBalance !== undefined) {
    creditManager.updateCreditsLocally(userId, data.newBalance)
  }
  
  return data
}

// Import React for the hook
import React from 'react'