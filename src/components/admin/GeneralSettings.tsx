import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GeneralSettingsProps {
  siteTitle: string;
  siteDescription: string;
  onSiteTitleChange: (value: string) => void;
  onSiteDescriptionChange: (value: string) => void;
}

export const GeneralSettings = ({
  siteTitle,
  siteDescription,
  onSiteTitleChange,
  onSiteDescriptionChange,
}: GeneralSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="site-title">Site Title</Label>
        <Input
          id="site-title"
          value={siteTitle}
          onChange={(e) => onSiteTitleChange(e.target.value)}
          placeholder="Enter site title"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="site-description">Site Description</Label>
        <Input
          id="site-description"
          value={siteDescription}
          onChange={(e) => onSiteDescriptionChange(e.target.value)}
          placeholder="Enter site description"
          className="w-full"
        />
      </div>
    </div>
  );
};