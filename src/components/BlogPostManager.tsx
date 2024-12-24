import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "./RichTextEditor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export const BlogPostManager = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Error fetching posts",
        description: error.message,
      });
    } else {
      setPosts(data || []);
    }
  };

  const handleTogglePublish = async (post: any) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: !post.published })
      .eq("id", post.id);

    if (error) {
      console.error("Error updating post:", error);
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
    setIsUpdating(false);
  };

  const handleEditPost = async () => {
    if (!selectedPost) return;
    setIsUpdating(true);

    const { error } = await supabase
      .from("blog_posts")
      .update({
        title: editTitle,
        content: editContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedPost.id);

    if (error) {
      console.error("Error updating post:", error);
      toast({
        variant: "destructive",
        title: "Error updating post",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Post updated successfully",
        className: "bg-green-500",
      });
      setSelectedPost(null);
      fetchPosts();
    }
    setIsUpdating(false);
  };

  const openEditDialog = (post: any) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  return (
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
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => openEditDialog(post)}>
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Post title"
                      />
                    </div>
                    <div className="space-y-2">
                      <RichTextEditor value={editContent} onChange={setEditContent} />
                    </div>
                    <Button 
                      onClick={handleEditPost} 
                      className="w-full"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant={post.published ? "outline" : "default"}
                onClick={() => handleTogglePublish(post)}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  post.published ? "Unpublish" : "Publish"
                )}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};