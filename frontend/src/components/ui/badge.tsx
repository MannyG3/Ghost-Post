import { cn } from "../../lib/utils";

interface BadgeProps {
  children: string;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/15 px-2.5 py-1 text-xs uppercase tracking-wide text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
