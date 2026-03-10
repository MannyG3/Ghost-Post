import * as React from "react";
import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  glow?: boolean;
};

export function Button({ className, glow, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition",
        "bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-400 hover:to-indigo-300",
        "disabled:cursor-not-allowed disabled:opacity-50",
        glow && "animate-pulseGlow shadow-glow",
        className
      )}
      {...props}
    />
  );
}
