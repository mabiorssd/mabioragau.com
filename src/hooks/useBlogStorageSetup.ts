
import { supabase } from "@/integrations/supabase/client";

export const useBlogStorageSetup = () => {
  const setupBlogStorage = async () => {
    try {
      // Check if the blog-images bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error listing buckets:", listError);
        return false;
      }

      const blogImagesBucket = buckets?.find(bucket => bucket.id === 'blog-images');
      
      if (!blogImagesBucket) {
        // Create the blog-images bucket
        const { error: createError } = await supabase.storage.createBucket('blog-images', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 10485760 // 10MB
        });

        if (createError) {
          console.error("Error creating blog-images bucket:", createError);
          return false;
        }

        console.log("Blog-images bucket created successfully");
      }

      return true;
    } catch (error) {
      console.error("Error setting up blog storage:", error);
      return false;
    }
  };

  return { setupBlogStorage };
};
