import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: settings, error } = await supabase
      .from('referral_settings')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching referral settings:', error)
      return NextResponse.json({ error: 'Failed to fetch referral settings' }, { status: 500 })
    }

    return NextResponse.json(settings)

  } catch (error) {
    console.error('Error in referral settings API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}