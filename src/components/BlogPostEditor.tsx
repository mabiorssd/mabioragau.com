import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { RichTextEditor } from "./RichTextEditor";
import { Card } from "@/components/ui/card";
import { ImageSelector } from "./ImageSelector";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
});

export const BlogPostEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('blog-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Error uploading image",
        description: uploadError.message,
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const generateShortCode = () => {
    // Generate a random 6-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortCode = '';
    for (let i = 0; i < 6; i++) {
      shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shortCode;
  };

  const validateForm = () => {
    try {
      blogPostSchema.parse({
        title,
        content,
        imageUrl: imageUrl || undefined,
        imageAlt: imageAlt || undefined,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleCreatePost = async () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please sign in to create a post",
        });
        return;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await handleImageUpload() || "";
      }

      const { error } = await supabase.from("blog_posts").insert({
        title,
        content,
        slug,
        author_id: user.id,
        image_url: finalImageUrl,
        image_alt: imageAlt,
        short_code: generateShortCode(),
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Post created successfully",
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setImageFile(null);
      setImageUrl("");
      setImageAlt("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating post",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (url: string, alt: string) => {
    setImageUrl(url);
    setImageAlt(alt);
    setImageFile(null); // Clear any uploaded file
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your post title"
            className={`text-lg ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.title}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="space-y-4">
            <ImageSelector onSelect={handleImageSelect} />
            <div className="text-center text-sm text-muted-foreground">or</div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImageFile(e.target.files?.[0] || null);
                setImageUrl(""); // Clear any selected library image
              }}
              className="flex-1"
            />
            {(imageUrl || imageFile) && (
              <Input
                placeholder="Image alt text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="flex-1"
              />
            )}
            {imageUrl && (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="max-h-48 object-contain mx-auto"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <RichTextEditor value={content} onChange={setContent} />
          {errors.content && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.content}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          <div 
            className="prose max-w-none p-4 border rounded-md bg-muted/50"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <Button 
          onClick={handleCreatePost} 
          className="w-full"
          disabled={isSubmitting}
          data-save-button
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Post...
            </>
          ) : (
            'Create Post'
          )}
        </Button>
      </div>
    </Card>
  );
};