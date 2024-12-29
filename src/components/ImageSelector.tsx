import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageSelectorProps {
  onSelect: (imageUrl: string, imageAlt: string) => void;
}

export const ImageSelector = ({ onSelect }: ImageSelectorProps) => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <ImageIcon className="mr-2 h-4 w-4" />
          Select from Library
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Featured Image</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card
                  key={image.name}
                  className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-green-500 transition-all"
                  onClick={() => {
                    onSelect(image.url, image.name);
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-32 object-cover"
                  />
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};