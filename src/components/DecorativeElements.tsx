/** Subtle decorative background elements for visual depth */
export const SectionBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
    <svg className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-[0.03] dark:opacity-[0.05]" viewBox="0 0 500 500" fill="none">
      <circle cx="250" cy="250" r="200" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="250" cy="250" r="140" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="250" cy="250" r="80" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  </div>
);

export const SectionDivider = () => (
  <div className="flex items-center gap-3 my-2" aria-hidden="true">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    <div className="w-1 h-1 rounded-full bg-primary/40" />
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
  </div>
);

export const AccentCorner = () => (
  <svg className="absolute top-0 right-0 w-24 h-24 text-primary/5 dark:text-primary/10" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <path d="M0 100 L100 100 L100 0" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M10 100 L100 100 L100 10" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
  </svg>
);
