-- Fix Storage Bucket and Policies for Photo Restoration
-- Run this in your Supabase SQL Editor

-- 1. Create the restored_photos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'restored_photos',
    'restored_photos',
    true, -- Public bucket (restored photos can be viewed)
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload their own restored photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own restored photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own restored photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own restored photos" ON storage.objects;

-- 3. Create simple, permissive policies for the restored_photos bucket
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload restored photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'restored_photos' AND 
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow public viewing of restored photos (since bucket is public)
CREATE POLICY "Anyone can view restored photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'restored_photos');

-- Allow users to update their own restored photos
CREATE POLICY "Users can update their own restored photos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'restored_photos' AND 
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow users to delete their own restored photos
CREATE POLICY "Users can delete their own restored photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'restored_photos' AND 
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- 4. Verify the bucket was created
SELECT 
    id, 
    name, 
    public, 
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'restored_photos';

-- 5. Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%restored%';
