import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogPostEditor } from "./BlogPostEditor";
import { BlogPostManager } from "./BlogPostManager";
import { AdminSettings } from "./AdminSettings";
import { ImageLibrary } from "./ImageLibrary";
import { BlogPostStats } from "./BlogPostStats";
import { ContactSubmissions } from "./admin/ContactSubmissions";
import { NewsletterManager } from "./admin/NewsletterManager";

export const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="write" className="space-y-6">
        <TabsList>
          <TabsTrigger value="write">Write New Post</TabsTrigger>
          <TabsTrigger value="manage">Manage Posts</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="images">Image Library</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
          <TabsTrigger value="submissions">Contact Submissions</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        </TabsList>

        <TabsContent value="write">
          <BlogPostEditor />
        </TabsContent>

        <TabsContent value="manage">
          <BlogPostManager />
        </TabsContent>

        <TabsContent value="stats">
          <BlogPostStats />
        </TabsContent>

        <TabsContent value="images">
          <ImageLibrary />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>

        <TabsContent value="submissions">
          <ContactSubmissions />
        </TabsContent>

        <TabsContent value="newsletter">
          <NewsletterManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};