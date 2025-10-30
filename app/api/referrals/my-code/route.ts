import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's referral code
    let { data: referralCode, error } = await supabase
      .from('referral_codes')
      .select('code, created_at, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    // If no referral code exists, create one
    if (error && error.code === 'PGRST116') {
      // Generate a new referral code
      const { data: newCode, error: generateError } = await supabase
        .rpc('generate_referral_code', {})

      if (generateError || !newCode) {
        console.error('Error generating referral code:', generateError)
        return NextResponse.json({ error: 'Failed to generate referral code' }, { status: 500 })
      }

      // Insert the new referral code
      const { data: insertedCode, error: insertError } = await supabase
        .from('referral_codes')
        .insert({
          user_id: user.id,
          code: newCode,
          is_active: true
        })
        .select('code, created_at, is_active')
        .single()

      if (insertError) {
        console.error('Error inserting referral code:', insertError)
        return NextResponse.json({ error: 'Failed to create referral code' }, { status: 500 })
      }

      referralCode = insertedCode
    } else if (error) {
      console.error('Error fetching referral code:', error)
      return NextResponse.json({ error: 'Failed to fetch referral code' }, { status: 500 })
    }

    // Get referral statistics
    const { data: stats, error: statsError } = await supabase
      .from('referrals')
      .select('status, referrer_credits_earned, created_at')
      .eq('referrer_user_id', user.id)

    if (statsError) {
      console.error('Error fetching referral stats:', statsError)
      return NextResponse.json({ error: 'Failed to fetch referral statistics' }, { status: 500 })
    }

    const totalReferrals = stats?.length || 0
    const completedReferrals = stats?.filter(r => r.status === 'credited').length || 0
    const totalCreditsEarned = stats?.reduce((sum, r) => sum + (r.referrer_credits_earned || 0), 0) || 0
    const pendingReferrals = stats?.filter(r => r.status === 'pending').length || 0

    return NextResponse.json({
      code: referralCode?.code,
      statistics: {
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        totalCreditsEarned
      }
    })

  } catch (error) {
    console.error('Error in referral code API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}