import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-white text-zinc-950 shadow hover:bg-zinc-200 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-900 dark:text-white dark:hover:bg-red-800",
        outline:
          "border border-white/15 bg-transparent shadow-sm hover:bg-white/10 hover:text-white text-zinc-300",
        secondary:
          "bg-surface-secondary text-white shadow-sm hover:bg-surface-elevated border border-white/5",
        ghost: "hover:bg-white/10 text-zinc-300 hover:text-white",
        link: "text-accent underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-[#50C878] to-[#0B6E4F] text-[#013220] font-bold shadow-[0_0_20px_rgba(80,200,120,0.25)] hover:shadow-[0_0_25px_rgba(80,200,120,0.4)] hover:brightness-105",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-7 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
