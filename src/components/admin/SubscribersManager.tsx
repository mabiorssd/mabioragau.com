import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search, RefreshCw, Download, CheckCircle2, XCircle, Trash2,
  MailCheck, MailX, Users, Loader2,
} from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  created_at: string;
  confirmed: boolean | null;
  subscribed: boolean | null;
  confirmation_token: string | null;
};

type StatusFilter = "all" | "confirmed" | "pending" | "unsubscribed";

const statusOf = (s: Subscriber): Exclude<StatusFilter, "all"> => {
  if (s.subscribed === false) return "unsubscribed";
  return s.confirmed ? "confirmed" : "pending";
};

export const SubscribersManager = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscriptions")
        .select("id, email, created_at, confirmed, subscribed, confirmation_token")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Subscriber[];
    },
  });

  const subscribers = data ?? [];

  const counts = useMemo(() => {
    let confirmed = 0, pending = 0, unsubscribed = 0;
    for (const s of subscribers) {
      const st = statusOf(s);
      if (st === "confirmed") confirmed++;
      else if (st === "pending") pending++;
      else unsubscribed++;
    }
    return { total: subscribers.length, confirmed, pending, unsubscribed };
  }, [subscribers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscribers.filter((s) => {
      if (status !== "all" && statusOf(s) !== status) return false;
      if (q && !s.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [subscribers, search, status]);

  const update = async (
    id: string,
    patch: Partial<Pick<Subscriber, "confirmed" | "subscribed">>,
    okMessage: string,
  ) => {
    setBusyId(id);
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
      toast({ title: okMessage });
      await refetch();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message ?? "Action failed." });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Subscriber deleted" });
      await refetch();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message ?? "Delete failed." });
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    const rows = [
      ["email", "status", "confirmed", "subscribed", "created_at"],
      ...filtered.map((s) => [
        s.email,
        statusOf(s),
        String(!!s.confirmed),
        String(s.subscribed !== false),
        s.created_at,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const StatPill = ({
    label, value, tone,
  }: { label: string; value: number; tone: "primary" | "success" | "warning" | "muted" }) => {
    const tones: Record<string, string> = {
      primary: "border-primary/30 bg-primary/10 text-primary",
      success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
      warning: "border-amber-500/30 bg-amber-500/10 text-amber-500",
      muted: "border-border bg-secondary/40 text-muted-foreground",
    };
    return (
      <div className={`rounded-xl border px-4 py-3 ${tones[tone]}`}>
        <div className="text-[10px] font-mono uppercase tracking-widest opacity-80">{label}</div>
        <div className="text-2xl font-bold mt-0.5">{value}</div>
      </div>
    );
  };

  const StatusBadge = ({ s }: { s: Subscriber }) => {
    const st = statusOf(s);
    if (st === "confirmed")
      return <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border border-emerald-500/30">Confirmed</Badge>;
    if (st === "pending")
      return <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border border-amber-500/30">Pending</Badge>;
    return <Badge className="bg-muted text-muted-foreground border border-border">Unsubscribed</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header + counts */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Subscribers</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!filtered.length}>
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill label="Total" value={counts.total} tone="primary" />
        <StatPill label="Confirmed" value={counts.confirmed} tone="success" />
        <StatPill label="Pending" value={counts.pending} tone="warning" />
        <StatPill label="Unsubscribed" value={counts.unsubscribed} tone="muted" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email…"
            className="pl-10"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead className="hidden sm:table-cell">Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Loading subscribers…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No subscribers match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => {
                const st = statusOf(s);
                const busy = busyId === s.id;
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium break-all">{s.email}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {new Date(s.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell><StatusBadge s={s} /></TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-1.5">
                        {st === "pending" && (
                          <Button
                            size="sm" variant="outline" disabled={busy}
                            onClick={() => update(s.id, { confirmed: true }, "Marked as confirmed")}
                            title="Mark as confirmed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Confirm
                          </Button>
                        )}
                        {st === "confirmed" && (
                          <Button
                            size="sm" variant="outline" disabled={busy}
                            onClick={() => update(s.id, { confirmed: false }, "Marked as pending")}
                            title="Revert to pending"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1 text-amber-500" /> Unconfirm
                          </Button>
                        )}
                        {s.subscribed !== false ? (
                          <Button
                            size="sm" variant="outline" disabled={busy}
                            onClick={() => update(s.id, { subscribed: false }, "Subscriber unsubscribed")}
                            title="Unsubscribe"
                          >
                            <MailX className="w-3.5 h-3.5 mr-1" /> Unsub
                          </Button>
                        ) : (
                          <Button
                            size="sm" variant="outline" disabled={busy}
                            onClick={() => update(s.id, { subscribed: true }, "Subscriber re-subscribed")}
                            title="Re-subscribe"
                          >
                            <MailCheck className="w-3.5 h-3.5 mr-1" /> Re-sub
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" disabled={busy} title="Delete subscriber">
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete subscriber?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes <span className="font-mono">{s.email}</span> from
                                your subscriber list. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove(s.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
