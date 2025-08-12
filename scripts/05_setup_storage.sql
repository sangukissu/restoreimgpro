-- Storage Setup for Photo Restoration App
-- Run this in your Supabase SQL Editor

-- 1. Create storage bucket for original photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'original-photos',
    'original-photos',
    false, -- Private bucket
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'image/bmp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Create storage bucket for restored photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'restored-photos',
    'restored-photos',
    true, -- Public bucket (restored photos can be viewed)
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 3. Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'user-avatars',
    'user-avatars',
    true, -- Public bucket
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 4. Create storage policies for original-photos bucket
CREATE POLICY "Users can upload their own photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'original-photos' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own photos" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'original-photos' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own photos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'original-photos' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'original-photos' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- 5. Create storage policies for restored-photos bucket
CREATE POLICY "Users can upload their own restored photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'restored-photos' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own restored photos" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'restored-photos' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own restored photos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'restored-photos' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own restored photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'restored-photos' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- 6. Create storage policies for user-avatars bucket
CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'user-avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own avatar" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'user-avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'user-avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'user-avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- 7. Create function to get storage URL with proper folder structure
CREATE OR REPLACE FUNCTION public.get_storage_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN 'https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 8. Create function to generate file path for user uploads
CREATE OR REPLACE FUNCTION public.generate_file_path(user_id UUID, filename TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN user_id::text || '/' || extract(epoch from now())::bigint || '_' || filename;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
