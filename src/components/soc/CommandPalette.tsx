import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Activity, ShieldCheck, Briefcase, Layers, Newspaper, FileText, Mail,
  Github, Linkedin, Twitter, Home, Lock,
} from "lucide-react";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 80);
  };

  const sections = [
    { id: "about", label: "Overview", icon: Home },
    { id: "services", label: "Services", icon: ShieldCheck },
    { id: "skills", label: "Tactical Proficiency", icon: Layers },
    { id: "projects", label: "Deployment History", icon: Briefcase },
    { id: "news", label: "Threat Intel", icon: Newspaper },
    { id: "blog", label: "Briefings", icon: FileText },
    { id: "contact", label: "Open Secure Channel", icon: Mail },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {sections.map((s) => (
            <CommandItem key={s.id} onSelect={() => run(() => scrollTo(s.id))}>
              <s.icon className="mr-2 h-4 w-4" />
              <span>{s.label}</span>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground">/{s.id}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => navigate("/blog"))}>
            <FileText className="mr-2 h-4 w-4" /> Open Blog
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate("/login"))}>
            <Lock className="mr-2 h-4 w-4" /> Admin Login
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.dispatchEvent(new CustomEvent("copilot:open")))}>
            <Activity className="mr-2 h-4 w-4" /> Launch Cyber Co-Pilot
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="External">
          <CommandItem onSelect={() => run(() => window.open("https://github.com/mabiorssd/", "_blank"))}>
            <Github className="mr-2 h-4 w-4" /> GitHub
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open("https://www.linkedin.com/in/mabior-agau-436825210/", "_blank"))}>
            <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open("https://x.com/_CyberMaster", "_blank"))}>
            <Twitter className="mr-2 h-4 w-4" /> X / Twitter
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open("mailto:info@mabioragau.com", "_self"))}>
            <Mail className="mr-2 h-4 w-4" /> Email Mabior
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
