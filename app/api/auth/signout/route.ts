import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
