import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Underline as UnderlineIcon, List, 
  ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Quote, Highlighter, Palette,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface EditorToolbarProps {
  editor: Editor | null;
  textColor: string;
  setTextColor: (color: string) => void;
}

export const EditorToolbar = ({ editor, textColor, setTextColor }: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <div className="border-b bg-muted p-2 flex flex-wrap gap-2">
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 ${editor.isActive('bold') ? 'bg-accent' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 ${editor.isActive('italic') ? 'bg-accent' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 ${editor.isActive('underline') ? 'bg-accent' : ''}`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 ${editor.isActive('highlight') ? 'bg-accent' : ''}`}
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 ${editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}`}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 ${editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}`}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 ${editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}`}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 ${editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}`}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 ${editor.isActive('blockquote') ? 'bg-accent' : ''}`}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Palette className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <Input
            type="color"
            value={textColor}
            onChange={(e) => {
              setTextColor(e.target.value);
              editor.chain().focus().setColor(e.target.value).run();
            }}
            className="w-32 h-8"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};