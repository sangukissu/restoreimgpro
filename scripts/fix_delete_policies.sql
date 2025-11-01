-- Fix missing DELETE policies for video_generations and image_restorations tables
-- This script adds the missing DELETE policies that allow users to delete their own records

-- Add DELETE policy for video_generations table
CREATE POLICY "Users can delete their own video generations" ON public.video_generations
    FOR DELETE USING (auth.uid() = user_id);

-- Add DELETE policy for image_restorations table  
CREATE POLICY "Users can delete their own restorations" ON public.image_restorations
    FOR DELETE USING (auth.uid() = user_id);

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('video_generations', 'image_restorations')
AND cmd = 'DELETE'
ORDER BY tablename, policyname;