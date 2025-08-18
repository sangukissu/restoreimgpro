-- Create video_generations table for FAL API video animations
CREATE TABLE IF NOT EXISTS public.video_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    original_image_url TEXT NOT NULL,
    video_url TEXT,
    fal_video_id TEXT,
    status TEXT DEFAULT 'uploading' CHECK (status IN ('uploading', 'generating', 'completed', 'failed')) NOT NULL,
    preset_id TEXT NOT NULL,
    preset_name TEXT NOT NULL,
    prompt TEXT NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on video_generations table
ALTER TABLE public.video_generations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for video_generations table
CREATE POLICY "Users can view their own video generations" ON public.video_generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video generations" ON public.video_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video generations" ON public.video_generations
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_generations_user_id ON public.video_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_video_generations_status ON public.video_generations(status);
CREATE INDEX IF NOT EXISTS idx_video_generations_created_at ON public.video_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_generations_fal_video_id ON public.video_generations(fal_video_id);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER update_video_generations_updated_at
    BEFORE UPDATE ON public.video_generations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.video_generations TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Note: Videos will be stored in Vercel Blob storage
-- The video_url column will store the Vercel Blob URL directly
-- No Supabase storage bucket needed for videos