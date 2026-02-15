import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-neon-500/15 text-neon-400 border-neon-500/30",
  secondary: "bg-white/10 text-white/80 border-white/10",
  warning: "bg-orange-500/10 text-orange-300 border-orange-400/20"
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
