import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SeoSettingsProps {
  metaKeywords: string;
  onMetaKeywordsChange: (value: string) => void;
}

export const SeoSettings = ({
  metaKeywords,
  onMetaKeywordsChange,
}: SeoSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="meta-keywords">Meta Keywords</Label>
        <Textarea
          id="meta-keywords"
          value={metaKeywords}
          onChange={(e) => onMetaKeywordsChange(e.target.value)}
          placeholder="cybersecurity, penetration testing, red team, south sudan"
          className="w-full min-h-[80px]"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated keywords for search engine optimization.
        </p>
      </div>
    </div>
  );
};
