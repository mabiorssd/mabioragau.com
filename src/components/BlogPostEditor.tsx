import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { RichTextEditor } from "./RichTextEditor";
import { Card } from "@/components/ui/card";

export const BlogPostEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const { toast } = useToast();

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('blog-images')
      .upload(filePath, imageFile);

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

  const handleCreatePost = async () => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await handleImageUpload();
    }

    const { error } = await supabase.from("blog_posts").insert([
      {
        title,
        content,
        slug,
        author_id: user.id,
        image_url: imageUrl,
        image_alt: imageAlt,
      },
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error creating post",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      setTitle("");
      setContent("");
      setImageFile(null);
      setImageAlt("");
    }
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
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="flex gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="flex-1"
            />
            {imageFile && (
              <Input
                placeholder="Image alt text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="flex-1"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <RichTextEditor value={content} onChange={setContent} />
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
          data-save-button
        >
          Create Post
        </Button>
      </div>
    </Card>
  );
};