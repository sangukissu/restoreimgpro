import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { referralCode } = await request.json()

    if (!referralCode || typeof referralCode !== 'string') {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 })
    }

    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user already has a referral
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_user_id', user.id)
      .single()

    if (existingReferral) {
      return NextResponse.json({ 
        error: 'You have already been referred by someone else' 
      }, { status: 400 })
    }

    // Validate referral code and create referral
    const { data, error } = await supabase.rpc('create_referral', {
      p_referral_code: referralCode.toUpperCase(),
      p_referred_user_id: user.id
    })

    if (error) {
      console.error('Error creating referral:', error)
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid referral code or referral limit reached' }, { status: 400 })
    }

    // Get referral settings to show user what they'll earn
    const { data: settings } = await supabase
      .from('referral_settings')
      .select('referred_credits_reward')
      .eq('is_active', true)
      .single()

    return NextResponse.json({
      success: true,
      message: `Referral applied! You'll earn ${settings?.referred_credits_reward || 1} credits when you make your first purchase.`
    })

  } catch (error) {
    console.error('Error in apply referral API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}