import * as React from "react";
import { cn } from "../../lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text backdrop-blur-sm",
        "placeholder:text-muted outline-none focus:border-accent",
        className
      )}
      {...props}
    />
  );
}
