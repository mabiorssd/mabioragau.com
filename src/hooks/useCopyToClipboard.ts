import { useState, useCallback } from "react";
import { toast } from "sonner";

export const useCopyToClipboard = (timeout = 1500) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(
    async (value: string, label?: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(value);
        toast.success("Copied!", { description: label ?? value });
        setTimeout(() => setCopied(null), timeout);
      } catch {
        toast.error("Copy failed", { description: "Clipboard access denied." });
      }
    },
    [timeout]
  );

  return { copied, copy };
};
