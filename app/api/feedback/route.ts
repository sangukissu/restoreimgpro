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
        .maybeSingle()

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
      const { error: trackingError } = await supabase
        .from('user_feedback_tracking')
        .upsert({
          user_id: user.id,
          feedback_given: true,
          updated_at: new Date().toISOString()
        })

      if (trackingError) {
        console.error('Error updating tracking:', trackingError)
        return NextResponse.json(
          { error: 'Failed to update tracking' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    } 
    
    else if (action === 'skip') {
      // Get current skip count and increment it
      const { data: currentTracking } = await supabase
        .from('user_feedback_tracking')
        .select('feedback_skipped_count')
        .eq('user_id', user.id)
        .maybeSingle()

      const currentSkipCount = currentTracking?.feedback_skipped_count || 0

      // Increment skip count
      const { error: skipError } = await supabase
        .from('user_feedback_tracking')
        .upsert({
          user_id: user.id,
          feedback_skipped_count: currentSkipCount + 1,
          last_feedback_prompt_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

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
      .maybeSingle()

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