import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2, Copy } from "lucide-react";

export const ImageLibrary = () => {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data: files } = await supabase.storage
      .from('blog-images')
      .list();

    if (files) {
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('blog-images')
            .getPublicUrl(file.name);
          return {
            name: file.name,
            url: publicUrl,
          };
        })
      );
      setImages(imageUrls);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;

    setUploading(true);
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: uploadError.message,
        });
      } else {
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
        fetchImages();
      }
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
      setImageFile(null);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Image URL copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="flex-1"
          />
          <Button 
            onClick={handleUpload}
            disabled={!imageFile || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.name} className="p-4 space-y-2">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm truncate flex-1">{image.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyUrl(image.url)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};