import { supabase } from "@/integrations/supabase/client";

export const useBlogPostUtils = () => {
  // Improved helper to get the correct image URL from Supabase storage
  const getImageUrl = (url: string | null) => {
    if (!url) return "/placeholder.svg";
    
    // If it's already a full URL, return it directly
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    
    // Handle Supabase storage URLs
    try {
      // Check if the URL already includes the bucket name
      if (url.includes("blog-images/")) {
        const { data } = supabase.storage.from("blog-images").getPublicUrl(url);
        return data?.publicUrl || "/placeholder.svg";
      } else {
        // Otherwise, assume it's just the filename
        const { data } = supabase.storage.from("blog-images").getPublicUrl(`blog-images/${url}`);
        return data?.publicUrl || "/placeholder.svg";
      }
    } catch (error) {
      console.error("Error generating public URL:", error, url);
      return "/placeholder.svg";
    }
  };

  // Enhanced helper to process content and fix any relative image links
  const processContent = (content: string) => {
    if (!content) return "";
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    
    const images = tempDiv.querySelectorAll("img");
    images.forEach((img) => {
      const originalSrc = img.getAttribute("src") || "";
      
      // Only modify relative URLs that need to be processed
      if (originalSrc && !originalSrc.startsWith("http") && !originalSrc.startsWith("/")) {
        try {
          let bucketPath = originalSrc;
          // Check if the path already includes the bucket name
          if (!bucketPath.includes("blog-images/")) {
            bucketPath = `blog-images/${bucketPath}`;
          }
          
          const { data } = supabase.storage.from("blog-images").getPublicUrl(bucketPath);
          if (data && data.publicUrl) {
            img.setAttribute("src", data.publicUrl);
          }
        } catch (error) {
          console.error("Error processing image URL:", error, originalSrc);
          img.setAttribute("src", "/placeholder.svg");
        }
      }
      
      // Add error handling to all images
      img.setAttribute("onerror", "this.onerror=null; this.src='/placeholder.svg';");
      
      // Add additional styling for better appearance
      img.classList.add("rounded-md", "shadow-md", "my-4");
    });
    
    // Add styling to other elements for a more professional look
    const headings = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach(heading => {
      heading.classList.add("font-bold", "mt-8", "mb-4", "text-green-400");
    });
    
    const paragraphs = tempDiv.querySelectorAll("p");
    paragraphs.forEach(p => {
      p.classList.add("mb-4", "text-green-300", "leading-relaxed");
    });
    
    return tempDiv.innerHTML;
  };

  // Improved excerpt generator with better formatting
  const getExcerpt = (content: string) => {
    if (!content) return "";
    
    const div = document.createElement("div");
    div.innerHTML = content;
    const text = div.textContent || div.innerText || "";
    
    // Get approximately 30 words instead of character count for better readability
    const words = text.split(/\s+/);
    const excerpt = words.slice(0, 30).join(" ");
    
    return excerpt + (words.length > 30 ? "..." : "");
  };

  return { getImageUrl, processContent, getExcerpt };
};
