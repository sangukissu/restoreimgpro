-- User Feedback System Database Schema
-- This table tracks user feedback for restoration experiences

CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  restoration_count INTEGER NOT NULL DEFAULT 1,
  feedback_given_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);

-- User feedback tracking table to manage when to show feedback prompts
CREATE TABLE IF NOT EXISTS user_feedback_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_restorations INTEGER NOT NULL DEFAULT 0,
  feedback_given BOOLEAN NOT NULL DEFAULT FALSE,
  feedback_skipped_count INTEGER NOT NULL DEFAULT 0,
  last_feedback_prompt_at TIMESTAMP WITH TIME ZONE,
  first_download_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_feedback_tracking_user_id ON user_feedback_tracking(user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_feedback_updated_at BEFORE UPDATE ON user_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_feedback_tracking_updated_at BEFORE UPDATE ON user_feedback_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback_tracking ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own feedback
CREATE POLICY "Users can view their own feedback" ON user_feedback
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback" ON user_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" ON user_feedback
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see and modify their own feedback tracking
CREATE POLICY "Users can view their own feedback tracking" ON user_feedback_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback tracking" ON user_feedback_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback tracking" ON user_feedback_tracking
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to initialize user feedback tracking
CREATE OR REPLACE FUNCTION initialize_user_feedback_tracking(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_feedback_tracking (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment restoration count
CREATE OR REPLACE FUNCTION increment_restoration_count(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_feedback_tracking (user_id, total_restorations)
    VALUES (p_user_id, 1)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        total_restorations = user_feedback_tracking.total_restorations + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark first download completed
CREATE OR REPLACE FUNCTION mark_first_download_completed(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_feedback_tracking (user_id, first_download_completed)
    VALUES (p_user_id, TRUE)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        first_download_completed = TRUE,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if feedback should be shown
CREATE OR REPLACE FUNCTION should_show_feedback(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    tracking_record user_feedback_tracking%ROWTYPE;
BEGIN
    SELECT * INTO tracking_record 
    FROM user_feedback_tracking 
    WHERE user_id = p_user_id;
    
    -- If no tracking record exists, don't show feedback yet
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- If feedback already given, never show again
    IF tracking_record.feedback_given THEN
        RETURN FALSE;
    END IF;
    
    -- If first download not completed, don't show
    IF NOT tracking_record.first_download_completed THEN
        RETURN FALSE;
    END IF;
    
    -- Show after first restoration OR after 2 more restorations if skipped
    IF tracking_record.total_restorations = 1 THEN
        RETURN TRUE;
    ELSIF tracking_record.feedback_skipped_count > 0 AND tracking_record.total_restorations >= (tracking_record.feedback_skipped_count * 2 + 1) THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;