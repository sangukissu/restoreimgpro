import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
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