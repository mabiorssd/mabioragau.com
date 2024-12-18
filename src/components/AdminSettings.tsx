import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

export const AdminSettings = () => {
  const { toast } = useToast();
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    linkedin: "",
    github: "",
  });

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    },
    meta: {
      onSuccess: (data) => {
        data?.forEach((setting) => {
          switch (setting.key) {
            case "site_title":
              setSiteTitle(setting.value || "");
              break;
            case "site_description":
              setSiteDescription(setting.value || "");
              break;
            case "meta_keywords":
              setMetaKeywords(setting.value || "");
              break;
            case "social_links":
              try {
                setSocialLinks(JSON.parse(setting.value || "{}"));
              } catch (e) {
                console.error("Error parsing social links:", e);
              }
              break;
          }
        });
      },
    },
  });

  const handleSaveSettings = async () => {
    const updates = [
      { key: "site_title", value: siteTitle },
      { key: "site_description", value: siteDescription },
      { key: "meta_keywords", value: metaKeywords },
      { key: "social_links", value: JSON.stringify(socialLinks) },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: update.key, value: update.value });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error saving settings",
          description: error.message,
        });
        return;
      }
    }

    toast({
      title: "Success",
      description: "Settings saved successfully",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-title">Site Title</Label>
              <Input
                id="site-title"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="Enter site title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Input
                id="site-description"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="Enter site description"
              />
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta-keywords">Meta Keywords</Label>
              <Input
                id="meta-keywords"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="Enter meta keywords (comma-separated)"
              />
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input
                id="twitter"
                value={socialLinks.twitter}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, twitter: e.target.value })
                }
                placeholder="Enter Twitter URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={socialLinks.linkedin}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                }
                placeholder="Enter LinkedIn URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                value={socialLinks.github}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, github: e.target.value })
                }
                placeholder="Enter GitHub URL"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={handleSaveSettings} className="mt-6">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};