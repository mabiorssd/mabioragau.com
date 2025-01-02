import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, Check } from "lucide-react";

export const ContactSubmissions = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: submissions, isLoading, refetch } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      console.log("Fetching contact submissions...");
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching submissions:", error);
        throw error;
      }
      return data;
    },
  });

  const markAsRead = async (id: string) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from("contact_submissions")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      console.error("Error updating submission:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark submission as read",
      });
    } else {
      toast({
        title: "Success",
        description: "Submission marked as read",
      });
      refetch();
    }
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contact Submissions</h2>
        <Badge variant="outline">
          {submissions?.filter((s) => !s.read).length || 0} unread
        </Badge>
      </div>
      
      {submissions?.map((submission) => (
        <Card key={submission.id} className={`${!submission.read ? 'border-blue-500' : ''}`}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{submission.name}</h3>
                  {!submission.read && (
                    <Badge variant="secondary">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{submission.email}</p>
                <p className="mt-2 text-sm">{submission.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(submission.created_at).toLocaleString()}
                </p>
              </div>
              {!submission.read && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAsRead(submission.id)}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span className="ml-2">Mark as read</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {submissions?.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          <Mail className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No contact submissions yet</p>
        </div>
      )}
    </div>
  );
};