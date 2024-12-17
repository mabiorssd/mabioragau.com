import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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

  const handleCreatePost = async () => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all fields",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const { error } = await supabase.from("blog_posts").insert([
      {
        title,
        content,
        slug,
        author_id: user.id,
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

      <div className="grid gap-6 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Create New Post</h2>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Post content"
              className="w-full min-h-[200px] p-2 border rounded-md"
            />
          </div>
          <Button onClick={handleCreatePost}>Create Post</Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Posts</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-500">
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};