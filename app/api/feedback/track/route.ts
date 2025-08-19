import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { event } = await request.json()

    if (event === 'restoration_completed') {
      
      // Increment restoration count
      const { error: incrementError } = await supabase
        .rpc('increment_restoration_count', { p_user_id: user.id })

      if (incrementError) {
        console.error('Error incrementing restoration count:', incrementError)
        return NextResponse.json(
          { error: 'Failed to track restoration' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }
    
    else if (event === 'first_download') {
      // Mark first download as completed
      const { error: downloadError } = await supabase
        .rpc('mark_first_download_completed', { p_user_id: user.id })

      if (downloadError) {
        console.error('Error marking first download:', downloadError)
        return NextResponse.json(
          { error: 'Failed to track download' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid event type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Feedback tracking API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}