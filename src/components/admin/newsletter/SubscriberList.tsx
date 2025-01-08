import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  created_at: string;
  confirmed: boolean;
  subscribed: boolean;
};

export const SubscriberList = () => {
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching subscribers:', error);
        throw error;
      }
      return data as Subscriber[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Subscriber List</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Subscription Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subscribed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers?.map((subscriber) => (
            <TableRow key={subscriber.id}>
              <TableCell>{subscriber.email}</TableCell>
              <TableCell>{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  subscriber.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {subscriber.confirmed ? 'Confirmed' : 'Pending'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  subscriber.subscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subscriber.subscribed ? 'Active' : 'Unsubscribed'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};