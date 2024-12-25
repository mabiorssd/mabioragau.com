import { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ImageToolbarProps {
  editor: Editor | null;
}

export const ImageToolbar = ({ editor }: ImageToolbarProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);

  const addImage = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
  };

  const resizeImage = (direction: 'width' | 'height', change: number) => {
    if (!selectedImage) return;

    if (direction === 'width') {
      selectedImage.style.width = `${selectedImage.offsetWidth + change}px`;
    } else {
      selectedImage.style.height = `${selectedImage.offsetHeight + change}px`;
    }
  };

  // Add click event listener to track selected image
  if (editor) {
    editor.on('click', ({ event }) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'IMG') {
        setSelectedImage(target as HTMLImageElement);
      } else {
        setSelectedImage(null);
      }
    });
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-1 items-center">
        <Input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="h-8 w-48"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={addImage}
          className="p-2"
        >
          <Image className="h-4 w-4" />
        </Button>
      </div>

      {selectedImage && (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => resizeImage('width', -10)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => resizeImage('width', 10)}
            className="p-2"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => resizeImage('height', -10)}
            className="p-2"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => resizeImage('height', 10)}
            className="p-2"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};