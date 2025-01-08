import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsletterEditor } from "./newsletter/NewsletterEditor";
import { SubscriberList } from "./newsletter/SubscriberList";

export const NewsletterManager = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose">Compose Newsletter</TabsTrigger>
          <TabsTrigger value="subscribers">Manage Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <NewsletterEditor />
        </TabsContent>

        <TabsContent value="subscribers">
          <SubscriberList />
        </TabsContent>
      </Tabs>
    </div>
  );
};