
import { supabase } from "@/integrations/supabase/client";

export const useBlogPostUtils = () => {
  // Helper to get the correct image URL from Supabase storage if needed
  const getImageUrl = (url: string | null) => {
    if (!url) return "/placeholder.svg";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    try {
      const { data } = supabase.storage.from("blog-images").getPublicUrl(url);
      return data?.publicUrl || "/placeholder.svg";
    } catch (error) {
      console.error("Error generating public URL:", error);
      return "/placeholder.svg";
    }
  };

  // Helper to process content and fix any relative image links
  const processContent = (content: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const images = tempDiv.querySelectorAll("img");
    images.forEach((img) => {
      const originalSrc = img.getAttribute("src") || "";
      if (!originalSrc.startsWith("http") && !originalSrc.startsWith("/")) {
        try {
          const { data } = supabase.storage.from("blog-images").getPublicUrl(originalSrc);
          if (data && data.publicUrl) {
            img.setAttribute("src", data.publicUrl);
          }
        } catch (error) {
          console.error("Error processing image URL:", error, originalSrc);
          img.setAttribute("src", "/placeholder.svg");
        }
      }
      img.setAttribute("onerror", "this.onerror=null; this.src='/placeholder.svg';");
    });
    return tempDiv.innerHTML;
  };

  // Helper to extract text excerpt from HTML
  const getExcerpt = (content: string) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    const text = div.textContent || div.innerText || "";
    return text.slice(0, 160) + (text.length > 160 ? "..." : "");
  };

  return { getImageUrl, processContent, getExcerpt };
};
