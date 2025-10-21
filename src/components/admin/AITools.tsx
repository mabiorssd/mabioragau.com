import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, FileText, Image, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { BlogInsights } from "./BlogInsights";
import { SeoAnalyzer } from "./SeoAnalyzer";

export const AITools = () => {
  const { toast } = useToast();
  const [contentTopic, setContentTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [emailContext, setEmailContext] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const generateBlogContent = async () => {
    if (!contentTopic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive"
      });
      return;
    }

    setLoading("content");
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: { 
          type: 'blog',
          topic: contentTopic 
        }
      });

      if (error) throw error;
      
      setGeneratedContent(data.content);
      toast({
        title: "Success",
        description: "Blog content generated successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate content",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const generateEmailResponse = async () => {
    if (!emailContext.trim()) {
      toast({
        title: "Error",
        description: "Please enter email context",
        variant: "destructive"
      });
      return;
    }

    setLoading("email");
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: { 
          type: 'email',
          context: emailContext 
        }
      });

      if (error) throw error;
      
      setGeneratedEmail(data.content);
      toast({
        title: "Success",
        description: "Email response generated successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate email",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image description",
        variant: "destructive"
      });
      return;
    }

    setLoading("image");
    try {
      const { data, error } = await supabase.functions.invoke('ai-image-generator', {
        body: { 
          prompt: imagePrompt 
        }
      });

      if (error) throw error;
      
      setGeneratedImage(data.imageUrl);
      toast({
        title: "Success",
        description: "Image generated successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-500" />
            AI Content Tools
          </CardTitle>
          <CardDescription>
            Use AI to generate content, respond to emails, and create images
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Blog Content Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Blog Content Generator
          </CardTitle>
          <CardDescription>
            Generate SEO-optimized blog content on any security topic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic or Keywords</Label>
            <Input
              id="topic"
              placeholder="e.g., 'Zero-day vulnerabilities in IoT devices'"
              value={contentTopic}
              onChange={(e) => setContentTopic(e.target.value)}
            />
          </div>
          <Button 
            onClick={generateBlogContent} 
            disabled={loading === "content"}
            className="w-full"
          >
            {loading === "content" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Content"
            )}
          </Button>
          {generatedContent && (
            <div>
              <Label>Generated Content</Label>
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="min-h-[200px] mt-2"
                placeholder="Generated content will appear here..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Response Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Response Generator
          </CardTitle>
          <CardDescription>
            Generate professional responses to client inquiries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email-context">Client Message or Context</Label>
            <Textarea
              id="email-context"
              placeholder="Paste the client's message or describe the context..."
              value={emailContext}
              onChange={(e) => setEmailContext(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button 
            onClick={generateEmailResponse} 
            disabled={loading === "email"}
            className="w-full"
          >
            {loading === "email" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Response"
            )}
          </Button>
          {generatedEmail && (
            <div>
              <Label>Generated Response</Label>
              <Textarea
                value={generatedEmail}
                onChange={(e) => setGeneratedEmail(e.target.value)}
                className="min-h-[200px] mt-2"
                placeholder="Generated email will appear here..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image className="h-5 w-5" />
            Blog Image Generator
          </CardTitle>
          <CardDescription>
            Generate custom images for your blog posts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="image-prompt">Image Description</Label>
            <Input
              id="image-prompt"
              placeholder="e.g., 'A futuristic cybersecurity command center'"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <Button 
            onClick={generateImage} 
            disabled={loading === "image"}
            className="w-full"
          >
            {loading === "image" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Image"
            )}
          </Button>
          {generatedImage && (
            <div className="mt-4">
              <Label>Generated Image</Label>
              <img 
                src={generatedImage} 
                alt="Generated content" 
                className="w-full mt-2 rounded-lg border"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blog Insights */}
      <BlogInsights />

      {/* SEO Analyzer */}
      <SeoAnalyzer />
    </div>
  );
};