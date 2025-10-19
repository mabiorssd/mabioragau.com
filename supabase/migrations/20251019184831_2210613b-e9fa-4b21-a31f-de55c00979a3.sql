-- Make blog-images bucket public so images can be displayed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'blog-images';

-- Add RLS policy to allow public read access to blog images
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');