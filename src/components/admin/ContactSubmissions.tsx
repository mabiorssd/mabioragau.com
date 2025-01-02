import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ContactSubmissions = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: submissions, isLoading, refetch } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_submissions'
        },
        () => {
          refetch();
          toast({
            title: "New submission received",
            description: "A new contact form submission has arrived.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const markAsRead = async (id: string) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from("contact_submissions")
      .update({ read: true })
      .eq("id", id);

    if (error) {
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions?.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  {!submission.read && (
                    <Badge variant="secondary">New</Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">{submission.name}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell className="max-w-md truncate">
                  {submission.message}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(submission.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {submissions?.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            <Mail className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No contact submissions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};