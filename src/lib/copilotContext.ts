/**
 * Lightweight pub/sub for the AI Co-Pilot to know what the user is currently
 * looking at (blog post, project case study, etc) so it can summarize on demand.
 */
type ContextItem = {
  kind: "blog" | "project" | "section";
  title: string;
  body: string;
  url?: string;
};

let current: ContextItem | null = null;
const listeners = new Set<(c: ContextItem | null) => void>();

export const setCopilotContext = (ctx: ContextItem | null) => {
  current = ctx;
  listeners.forEach((l) => l(ctx));
};

export const getCopilotContext = () => current;

export const subscribeCopilotContext = (fn: (c: ContextItem | null) => void) => {
  listeners.add(fn);
  fn(current);
  return () => listeners.delete(fn);
};
