import { Input } from "@/components/ui/input";
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
        <Input
          id="meta-keywords"
          value={metaKeywords}
          onChange={(e) => onMetaKeywordsChange(e.target.value)}
          placeholder="Enter meta keywords (comma-separated)"
          className="w-full"
        />
      </div>
    </div>
  );
};