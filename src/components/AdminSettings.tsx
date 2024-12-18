import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { GeneralSettings } from "./admin/GeneralSettings";
import { SeoSettings } from "./admin/SeoSettings";
import { SocialSettings } from "./admin/SocialSettings";

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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings
              siteTitle={siteTitle}
              siteDescription={siteDescription}
              onSiteTitleChange={setSiteTitle}
              onSiteDescriptionChange={setSiteDescription}
            />
          </TabsContent>

          <TabsContent value="seo">
            <SeoSettings
              metaKeywords={metaKeywords}
              onMetaKeywordsChange={setMetaKeywords}
            />
          </TabsContent>

          <TabsContent value="social">
            <SocialSettings
              socialLinks={socialLinks}
              onSocialLinksChange={setSocialLinks}
            />
          </TabsContent>
        </Tabs>

        <Button onClick={handleSaveSettings} className="mt-6">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};