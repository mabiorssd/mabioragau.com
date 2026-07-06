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
  PenTool, Sparkles, FolderKanban, BarChart3,
  Image as ImageIcon, Settings, Inbox, Mail, Users, LogOut,
} from "lucide-react";

const TABS = [
  { value: "write", label: "Write", Icon: PenTool, hint: "Compose a new briefing" },
  { value: "ai-tools", label: "AI Tools", Icon: Sparkles, hint: "Generative assist" },
  { value: "manage", label: "Manage", Icon: FolderKanban, hint: "Edit & publish posts" },
  { value: "stats", label: "Stats", Icon: BarChart3, hint: "Per-post metrics" },
  { value: "analytics", label: "Analytics", Icon: BarChart3, hint: "Visitor insights" },
  { value: "images", label: "Images", Icon: ImageIcon, hint: "Media library" },
  { value: "settings", label: "Settings", Icon: Settings, hint: "Site config" },
  { value: "submissions", label: "Inbox", Icon: Inbox, hint: "Contact forms" },
  { value: "newsletter", label: "Newsletter", Icon: Mail, hint: "Compose & send" },
  { value: "subscribers", label: "Subscribers", Icon: Users, hint: "Manage list" },
];

const SECTION_DESCRIPTIONS: Record<string, string> = {
  write: "Create and format new blog posts with rich text editing.",
  "ai-tools": "Leverage AI for content generation, summarization, and more.",
  manage: "Browse, edit, publish, or unpublish your existing posts.",
  stats: "View performance metrics for each published post.",
  analytics: "Track visitor behavior, page views, and engagement trends.",
  images: "Upload and manage images for your blog posts.",
  settings: "Configure site-wide settings and preferences.",
  submissions: "Review and respond to contact form submissions.",
  newsletter: "Create and send newsletters to your subscribers.",
  subscribers: "Manage your email subscriber list with filtering tools.",
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("write");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const activeMeta = TABS.find((t) => t.value === active) ?? TABS[0];
  const sectionDesc = SECTION_DESCRIPTIONS[active] ?? "";

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
              <span className="text-primary-foreground text-xs font-bold font-display">M</span>
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
                Dashboard
              </div>
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight truncate">
                Mabior Agau
              </h1>
            </div>
          </div>

          {/* Mobile sign out — visible only on small screens */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="min-h-[40px] text-muted-foreground hover:text-destructive lg:hidden"
          >
            <LogOut className="w-4 h-4 mr-1.5" /> Sign out
          </Button>
        </div>
      </header>

      <Tabs
        value={active}
        onValueChange={setActive}
        className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6"
      >
        {/* ── Mobile tab bar: horizontal scrollable row ── */}
        <div className="lg:hidden -mx-4 px-4 pb-4 overflow-x-auto">
          <TabsList className="inline-flex w-auto h-auto p-1 gap-1 bg-muted/50 rounded-xl">
            {TABS.map(({ value, label, Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-lg text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground transition-all"
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ── Desktop grid: sidebar + workspace ── */}
        <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] gap-6">
          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:flex lg:flex-col lg:sticky lg:top-[88px] lg:self-start gap-3">
            <nav className="glass-panel rounded-2xl p-2 flex flex-col gap-0.5">
              {TABS.map(({ value, label, Icon }) => {
                const isActive = value === active;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setActive(value)}
                    className={`
                      relative flex items-center gap-3 w-full pl-3 pr-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                      ${isActive
                        ? "text-primary bg-primary/[0.06]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      }
                    `}
                  >
                    {/* Left accent bar */}
                    <span
                      className={`
                        absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full transition-all duration-200
                        ${isActive ? "bg-primary scale-100 opacity-100" : "scale-50 opacity-0"}
                      `}
                    />
                    <Icon
                      className={`
                        w-4 h-4 shrink-0 transition-colors duration-150
                        ${isActive ? "text-primary" : ""}
                      `}
                    />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Sidebar footer — subtle sign out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </aside>

          {/* ── Workspace ── */}
          <section className="min-w-0 space-y-4">
            {/* Workspace header: active tab name + icon + description */}
            <div className="glass-panel rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center shrink-0 ring-1 ring-primary/20">
                  <activeMeta.Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold truncate">
                    {activeMeta.label}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                    {sectionDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Main content panel */}
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
        </div>
      </Tabs>
    </div>
  );
};
