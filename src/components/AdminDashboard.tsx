import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogPostEditor } from "./BlogPostEditor";
import { BlogPostManager } from "./BlogPostManager";
import { AdminSettings } from "./AdminSettings";
import { ImageLibrary } from "./ImageLibrary";
import { BlogPostStats } from "./BlogPostStats";
import { ContactSubmissions } from "./admin/ContactSubmissions";
import { NewsletterManager } from "./admin/NewsletterManager";
import { SubscribersManager } from "./admin/SubscribersManager";
import { VisitorAnalytics } from "./admin/VisitorAnalytics";
import { AITools } from "./admin/AITools";
import {
  PenTool, Sparkles, FolderKanban, BarChart3, LineChart,
  Image as ImageIcon, Settings, Inbox, Mail, Users, Shield, LogOut, Activity,
} from "lucide-react";

const TABS = [
  { value: "write", label: "Write", Icon: PenTool, hint: "Compose a new briefing" },
  { value: "ai-tools", label: "AI Tools", Icon: Sparkles, hint: "Generative assist" },
  { value: "manage", label: "Manage", Icon: FolderKanban, hint: "Edit & publish posts" },
  { value: "stats", label: "Stats", Icon: BarChart3, hint: "Per-post metrics" },
  { value: "analytics", label: "Analytics", Icon: LineChart, hint: "AI insights" },
  { value: "images", label: "Images", Icon: ImageIcon, hint: "Library" },
  { value: "settings", label: "Settings", Icon: Settings, hint: "Site config" },
  { value: "submissions", label: "Inbox", Icon: Inbox, hint: "Contact forms" },
  { value: "newsletter", label: "Newsletter", Icon: Mail, hint: "Compose & send" },
  { value: "subscribers", label: "Subscribers", Icon: Users, hint: "Filter & manage list" },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("write");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const activeMeta = TABS.find((t) => t.value === active) ?? TABS[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Top command bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
              <Shield className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-widest text-primary flex items-center gap-1.5">
                <Activity className="w-3 h-3" /> SOC // ADMIN CONSOLE
              </div>
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight truncate">
                Command Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono uppercase tracking-widest">
              <span className="status-dot" /> ONLINE
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="min-h-[40px]">
              <LogOut className="w-4 h-4 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <Tabs value={active} onValueChange={setActive} className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[240px_minmax(0,1fr)] gap-6">
        {/* Side rail */}
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <div className="glass-panel rounded-2xl p-2">
            <TabsList className="bg-transparent flex lg:flex-col w-full h-auto p-0 gap-1 overflow-x-auto lg:overflow-visible">
              {TABS.map(({ value, label, Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="w-full justify-start gap-2.5 px-3 py-2.5 min-h-[44px] rounded-xl text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow text-muted-foreground hover:text-foreground"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </aside>

        {/* Workspace */}
        <section className="min-w-0 space-y-4">
          <div className="glass-panel rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                /workspace/{active}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <activeMeta.Icon className="w-4 h-4 text-primary" />
                <h2 className="font-display text-lg font-bold truncate">{activeMeta.label}</h2>
              </div>
            </div>
            <div className="hidden sm:block text-xs text-muted-foreground font-mono truncate">
              {activeMeta.hint}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 sm:p-6">
            <TabsContent value="write" className="mt-0"><BlogPostEditor /></TabsContent>
            <TabsContent value="ai-tools" className="mt-0"><AITools /></TabsContent>
            <TabsContent value="manage" className="mt-0"><BlogPostManager /></TabsContent>
            <TabsContent value="stats" className="mt-0"><BlogPostStats /></TabsContent>
            <TabsContent value="analytics" className="mt-0"><VisitorAnalytics /></TabsContent>
            <TabsContent value="images" className="mt-0"><ImageLibrary /></TabsContent>
            <TabsContent value="settings" className="mt-0"><AdminSettings /></TabsContent>
            <TabsContent value="submissions" className="mt-0"><ContactSubmissions /></TabsContent>
            <TabsContent value="newsletter" className="mt-0"><NewsletterManager /></TabsContent>
            <TabsContent value="subscribers" className="mt-0"><SubscribersManager /></TabsContent>
          </div>
        </section>
      </Tabs>
    </div>
  );
};
