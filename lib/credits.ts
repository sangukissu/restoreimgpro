import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'

type Credits = Database['public']['Tables']['credits']['Row']
type CreditsInsert = Database['public']['Tables']['credits']['Insert']
type CreditsUpdate = Database['public']['Tables']['credits']['Update']

export class CreditService {
  private async getClient() {
    return await createClient()
  }

  /**
   * Get user's current credit balance
   */
  async getUserCredits(userId: string): Promise<{ balance: number; error?: string }> {
    try {
      if (!userId) {
        return { balance: 0, error: 'Invalid user ID' }
      }

      const supabase = await this.getClient()
      const { data, error } = await supabase
        .from('credits')
        .select('credits')
        .eq('user_id', userId)
        .single() as { data: Credits | null; error: any }

      if (error && error.code !== 'PGRST116') {
        return { balance: 0, error: 'Failed to fetch credits' }
      }

      if (!data) {
        await this.initializeUserCredits(userId)
        return { balance: 0 }
      }

      return { balance: data.credits || 0 }
    } catch (error) {
      return { balance: 0, error: 'Error fetching credits' }
    }
  }

  /**
   * Add credits to user's account
   */
  async addCredits(
    userId: string,
    amount: number,
    description: string = 'Credits added'
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    try {
      if (!userId || amount <= 0) {
        return { success: false, error: 'Invalid parameters' }
      }

      const { balance: currentBalance } = await this.getUserCredits(userId)
      const newBalance = currentBalance + amount

      const supabase = await this.getClient()
      const creditData: CreditsInsert = {
        user_id: userId,
        credits: newBalance
      }
      const { error } = await supabase
        .from('credits')
        .upsert(creditData, {
          onConflict: 'user_id'
        })

      if (error) {
        return { success: false, error: 'Failed to add credits' }
      }

      return { success: true, newBalance }
    } catch (error) {
      return { success: false, error: 'Error adding credits' }
    }
  }

  /**
   * Deduct credits from user's account
   */
  async deductCredits(
    userId: string,
    amount: number,
    description: string = 'Credits used'
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    try {
      if (!userId || amount <= 0) {
        return { success: false, error: 'Invalid parameters' }
      }

      const { balance: currentBalance } = await this.getUserCredits(userId)
      
      if (currentBalance < amount) {
        return { success: false, error: 'Insufficient credits' }
      }

      const newBalance = currentBalance - amount

      const supabase = await this.getClient()
      const updateData: CreditsUpdate = { credits: newBalance }
      const { error } = await supabase
        .from('credits')
        .update(updateData)
        .eq('user_id', userId)

      if (error) {
        return { success: false, error: 'Failed to deduct credits' }
      }

      return { success: true, newBalance }
    } catch (error) {
      return { success: false, error: 'Error deducting credits' }
    }
  }

  /**
   * Check if user has sufficient credits
   */
  async hasCredits(userId: string, requiredAmount: number): Promise<{ hasCredits: boolean; currentBalance: number }> {
    const { balance } = await this.getUserCredits(userId)
    return {
      hasCredits: balance >= requiredAmount,
      currentBalance: balance
    }
  }

  /**
   * Initialize credits for a new user
   */
  async initializeUserCredits(
    userId: string,
    initialCredits: number = 0
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await this.getClient()
      const creditData: CreditsInsert = {
        user_id: userId,
        credits: initialCredits
      }
      const { error } = await supabase
        .from('credits')
        .insert(creditData)

      if (error && error.code !== '23505') {
        return { success: false, error: 'Failed to initialize credits' }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error initializing credits' }
    }
  }
}

// Export a singleton instance
export const creditService = new CreditService()

// Helper functions
export async function getUserCredits(userId: string) {
  return creditService.getUserCredits(userId)
}

export async function addCredits(userId: string, amount: number, description?: string) {
  return creditService.addCredits(userId, amount, description)
}

export async function deductCredits(userId: string, amount: number, description?: string) {
  return creditService.deductCredits(userId, amount, description)
}

export async function hasCredits(userId: string, requiredAmount: number) {
  return creditService.hasCredits(userId, requiredAmount)
}