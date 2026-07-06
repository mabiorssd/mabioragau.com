import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RichTextEditor } from "./RichTextEditor";
import { ImageSelector } from "./ImageSelector";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, ExternalLink, ImageIcon } from "lucide-react";

export const BlogPostManager = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageAlt, setEditImageAlt] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, content, image_url, image_alt, published, created_at, updated_at, view_count")
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
      toast({
        variant: "destructive",
        title: "Error",
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

  const handleDeletePost = async (postId: string) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting post",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      fetchPosts();
    }
    setIsUpdating(false);
  };

  const handleEditPost = async () => {
    if (!selectedPost) return;
    setIsUpdating(true);

    try {
      // Handle image upload if a new file was selected
      let finalImageUrl = editImageUrl;

      if (editImageFile) {
        const fileExt = editImageFile.name.split(".").pop();
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `blog-${timestamp}-${randomString}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, editImageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: uploadError.message,
          });
          setIsUpdating(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("blog-images")
          .getPublicUrl(fileName);

        finalImageUrl = publicUrl;
      }

      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: editTitle,
          slug: editSlug,
          content: editContent,
          image_url: finalImageUrl || null,
          image_alt: editImageAlt || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedPost.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      setSelectedPost(null);
      fetchPosts();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating post",
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditDialog = (post: any) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditSlug(post.slug);
    setEditImageUrl(post.image_url || "");
    setEditImageAlt(post.image_alt || "");
    setEditImageFile(null);
  };

  const handleImageSelect = (url: string, alt: string) => {
    setEditImageUrl(url);
    setEditImageAlt(alt);
    setEditImageFile(null);
  };

  const handleImageClear = () => {
    setEditImageUrl("");
    setEditImageAlt("");
    setEditImageFile(null);
  };

  return (
    <div className="space-y-4">
      {posts.length === 0 && (
        <p className="text-muted-foreground text-sm py-8 text-center">No posts yet. Write one in the Write tab.</p>
      )}
      {posts.map((post) => (
        <Card key={post.id} className="p-4 hover:border-primary/20 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{post.title}</h3>
                {post.published ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 shrink-0">
                    Published
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shrink-0">
                    Draft
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span>{post.view_count || 0} views</span>
                <span>/blog/{post.slug}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                title="View post"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                    <DialogDescription>
                      Update title, content, featured image, and slug for this post.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 py-4">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Post title"
                        className="text-lg"
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-slug">URL Slug</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground shrink-0">/blog/</span>
                        <Input
                          id="edit-slug"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))}
                          placeholder="post-url-slug"
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="space-y-3">
                      <Label>Featured Image</Label>
                      {editImageUrl && (
                        <div className="relative rounded-xl overflow-hidden border border-border mb-3">
                          <img
                            src={editImageUrl}
                            alt={editImageAlt}
                            className="w-full max-h-48 object-contain bg-muted/30"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleImageClear}
                            className="absolute top-2 right-2 bg-background/80 hover:bg-background text-destructive h-7"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                      <ImageSelector onSelect={handleImageSelect} />
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">or upload</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            setEditImageFile(e.target.files?.[0] || null);
                            if (e.target.files?.[0]) setEditImageUrl("");
                          }}
                          className="flex-1"
                        />
                        <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                      {(editImageUrl || editImageFile) && (
                        <Input
                          placeholder="Image alt text (for accessibility)"
                          value={editImageAlt}
                          onChange={(e) => setEditImageAlt(e.target.value)}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <RichTextEditor value={editContent} onChange={setEditContent} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleEditPost}
                      className="w-full"
                      disabled={isUpdating || !editTitle.trim()}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{post.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeletePost(post.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                variant={post.published ? "outline" : "default"}
                size="sm"
                onClick={() => handleTogglePublish(post)}
                disabled={isUpdating}
              >
                {post.published ? "Unpublish" : "Publish"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
