"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const liquidGlassCardVariants = cva("relative overflow-hidden transition-all duration-300", {
  variants: {
    glassSize: {
      sm: "p-4",
      default: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    glassSize: "default",
  },
});

export type LiquidGlassCardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof liquidGlassCardVariants> & {
    /** Adds the inset glass highlight and subtle glow */
    glassEffect?: boolean;
  };

export function LiquidGlassCard({
  className,
  glassSize,
  glassEffect = true,
  children,
  ...props
}: LiquidGlassCardProps) {
  return (
    <Card
      className={cn(
        liquidGlassCardVariants({ glassSize }),
        "border border-white/[0.08] bg-[#161618]/85 text-foreground backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)]",
        glassEffect && "hover:border-[#50C878]/40 hover:shadow-[0_0_30px_rgba(80,200,120,0.12)]",
        className
      )}
      {...props}
    >
      {glassEffect && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_0_20px_rgba(255,255,255,0.01)]"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">{children}</div>
    </Card>
  );
}

export default LiquidGlassCard;
