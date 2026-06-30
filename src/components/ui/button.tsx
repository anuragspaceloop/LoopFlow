import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-140 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(99,102,241,0.15),_inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-primary-hover hover:shadow-[0_4px_12px_rgba(99,102,241,0.22),_inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-0.5 active:translate-y-0",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-hairline bg-surface text-heading shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-canvas-soft hover:border-primary-hover hover:text-primary hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-canvas-soft border border-hairline text-heading hover:bg-primary-soft hover:text-primary hover:border-primary-hover/20 hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-canvas-soft text-secondary-text hover:text-heading",
        link: "text-primary underline-offset-4 hover:underline rounded-none",
        soft: "bg-white border border-violet-border/60 text-heading hover:border-violet-border hover:bg-elevated hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-[38px] px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-[14px]",
        xl: "h-13 px-8 text-base",
        icon: "h-[38px] w-[38px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
