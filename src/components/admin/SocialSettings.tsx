import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialLinks {
  twitter: string;
  linkedin: string;
  github: string;
}

interface SocialSettingsProps {
  socialLinks: SocialLinks;
  onSocialLinksChange: (links: SocialLinks) => void;
}

export const SocialSettings = ({
  socialLinks,
  onSocialLinksChange,
}: SocialSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="twitter">Twitter / X URL</Label>
        <Input
          id="twitter"
          type="url"
          value={socialLinks.twitter}
          onChange={(e) =>
            onSocialLinksChange({ ...socialLinks, twitter: e.target.value })
          }
          placeholder="https://x.com/username"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn URL</Label>
        <Input
          id="linkedin"
          type="url"
          value={socialLinks.linkedin}
          onChange={(e) =>
            onSocialLinksChange({ ...socialLinks, linkedin: e.target.value })
          }
          placeholder="https://linkedin.com/in/username"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="github">GitHub URL</Label>
        <Input
          id="github"
          type="url"
          value={socialLinks.github}
          onChange={(e) =>
            onSocialLinksChange({ ...socialLinks, github: e.target.value })
          }
          placeholder="https://github.com/username"
          className="w-full"
        />
      </div>
    </div>
  );
};
