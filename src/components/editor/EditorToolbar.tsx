import { Editor } from '@tiptap/react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Bold, Italic, Underline, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Quote,
  Highlighter, Palette, Undo, Redo,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
  textColor: string;
  setTextColor: (color: string) => void;
}

export const EditorToolbar = ({ editor, textColor, setTextColor }: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 h-8 w-8"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 h-8 w-8"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 h-8 w-8 ${editor.isActive('bold') ? 'bg-accent' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 h-8 w-8 ${editor.isActive('italic') ? 'bg-accent' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 h-8 w-8 ${editor.isActive('underline') ? 'bg-accent' : ''}`}
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 h-8 w-8 ${editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}`}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 h-8 w-8 ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 h-8 w-8 ${editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}`}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 h-8 w-8 ${editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}`}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 h-8 w-8 ${editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}`}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 h-8 w-8 ${editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}`}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 h-8 w-8 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-accent' : ''}`}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 h-8 w-8 ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 h-8 w-8 ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 h-8 w-8 ${editor.isActive('blockquote') ? 'bg-accent' : ''}`}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 h-8 w-8 ${editor.isActive('highlight') ? 'bg-accent' : ''}`}
        >
          <Highlighter className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
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
    </div>
  );
};