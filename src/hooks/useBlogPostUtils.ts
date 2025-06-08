
import { supabase } from "@/integrations/supabase/client";

export const useBlogPostUtils = () => {
  // Improved helper to get the correct image URL from Supabase storage
  const getImageUrl = (url: string | null): string => {
    if (!url) return "/placeholder.svg";
    
    // If it's already a full URL, return it directly
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    
    // Handle Supabase storage URLs
    try {
      // Remove any leading slashes and blog-images prefix to get clean filename
      let cleanPath = url.replace(/^\/+/, ''); // Remove leading slashes
      
      // If the path already includes blog-images/, extract just the filename
      if (cleanPath.includes("blog-images/")) {
        cleanPath = cleanPath.split("blog-images/")[1] || cleanPath;
      }
      
      // Get the public URL for the file in the blog-images bucket
      const { data } = supabase.storage.from("blog-images").getPublicUrl(cleanPath);
      
      console.log('Original URL:', url, 'Clean path:', cleanPath, 'Generated URL:', data?.publicUrl);
      
      return data?.publicUrl || "/placeholder.svg";
    } catch (error) {
      console.error("Error generating public URL:", error, url);
      return "/placeholder.svg";
    }
  };

  // Enhanced helper to process content and fix any relative image links
  const processContent = (content: string): string => {
    if (!content) return "";
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    
    const images = tempDiv.querySelectorAll("img");
    images.forEach((img) => {
      const originalSrc = img.getAttribute("src") || "";
      
      // Only modify relative URLs that need to be processed
      if (originalSrc && !originalSrc.startsWith("http") && !originalSrc.startsWith("/")) {
        try {
          const processedUrl = getImageUrl(originalSrc);
          img.setAttribute("src", processedUrl);
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

  // Improved excerpt generator with better formatting and enhanced sanitization
  const getExcerpt = (content: string): string => {
    if (!content) return "";
    
    // Ensure content is a string and sanitize it
    const safeContent = String(content);
    
    const div = document.createElement("div");
    div.innerHTML = safeContent;
    
    // Get plain text and remove any potential symbols or special characters
    const text = (div.textContent || div.innerText || "")
      .replace(/[^\w\s.,!?-]/g, ' ') // Remove special characters that might contain symbols
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Get approximately 30 words instead of character count for better readability
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const excerpt = words.slice(0, 30).join(" ");
    
    return excerpt + (words.length > 30 ? "..." : "");
  };

  return { getImageUrl, processContent, getExcerpt };
};
