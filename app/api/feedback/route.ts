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

    const { rating, feedback_text, action } = await request.json()

    if (action === 'submit') {
      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Invalid rating. Must be between 1 and 5.' },
          { status: 400 }
        )
      }

      // Get current restoration count
      const { data: trackingData } = await supabase
        .from('user_feedback_tracking')
        .select('total_restorations')
        .eq('user_id', user.id)
        .single()

      const restorationCount = trackingData?.total_restorations || 1

      // Insert feedback
      const { error: feedbackError } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          rating,
          feedback_text: feedback_text || null,
          restoration_count: restorationCount
        })

      if (feedbackError) {
        console.error('Error inserting feedback:', feedbackError)
        return NextResponse.json(
          { error: 'Failed to save feedback' },
          { status: 500 }
        )
      }

      // Mark feedback as given
      const { error: markError } = await supabase
        .rpc('mark_feedback_given', { p_user_id: user.id })

      if (markError) {
        console.error('Error marking feedback as given:', markError)
        return NextResponse.json(
          { error: 'Failed to mark feedback as given' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    } 
    
    else if (action === 'skip') {
      // Increment skip count
      const { error: skipError } = await supabase
        .rpc('increment_skip_count', { p_user_id: user.id })

      if (skipError) {
        console.error('Error updating skip count:', skipError)
        return NextResponse.json(
          { error: 'Failed to update skip count' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    // Check if feedback should be shown
    const { data: shouldShow, error: checkError } = await supabase
      .rpc('should_show_feedback', { p_user_id: user.id })

    if (checkError) {
      console.error('Error checking feedback status:', checkError)
      return NextResponse.json(
        { error: 'Failed to check feedback status' },
        { status: 500 }
      )
    }

    // Get tracking data for additional context
    const { data: trackingData } = await supabase
      .from('user_feedback_tracking')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      shouldShow: shouldShow || false,
      tracking: trackingData
    })

  } catch (error) {
    console.error('Feedback status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}