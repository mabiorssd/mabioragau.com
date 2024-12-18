import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from "./RichTextEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";

export const AdminDashboard = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching posts",
        description: error.message,
      });
    } else {
      setPosts(data || []);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

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
      fetchPosts();
    }
  };

  const handleTogglePublish = async (post: any) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: !post.published })
      .eq("id", post.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating post",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: `Post ${post.published ? "unpublished" : "published"} successfully`,
      });
      fetchPosts();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="write" className="space-y-6">
        <TabsList>
          <TabsTrigger value="write">Write New Post</TabsTrigger>
          <TabsTrigger value="manage">Manage Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="write">
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

              <Button onClick={handleCreatePost} className="w-full">
                Create Post
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant={post.published ? "outline" : "default"}
                    onClick={() => handleTogglePublish(post)}
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};