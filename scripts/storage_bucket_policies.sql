-- RLS policies for restored_photos bucket
-- Policy 1: Users can only view their own restored photos
CREATE POLICY "Users can view own restored photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'restored_photos' AND 
  (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Policy 2: Users can upload photos to their own folder
CREATE POLICY "Users can upload to own restored photos folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'restored_photos' AND 
  (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Policy 3: Users can update their own restored photos
CREATE POLICY "Users can update own restored photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'restored_photos' AND 
  (storage.foldername(name))[1] = (SELECT auth.uid()::text)
)
WITH CHECK (
  bucket_id = 'restored_photos' AND 
  (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Policy 4: Users can delete their own restored photos
CREATE POLICY "Users can delete own restored photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'restored_photos' AND 
  (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);