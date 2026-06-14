import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-planetary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-milkyway",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
        {
          "bg-galaxy text-white hover:bg-planetary active:scale-[0.98] shadow-sm":
            variant === "primary",
          "border border-venus bg-white text-galaxy hover:border-universe hover:bg-sky/30 active:scale-[0.98]":
            variant === "secondary",
          "text-universe hover:text-galaxy hover:bg-sky/40":
            variant === "ghost",
          "px-5 py-2.5 text-sm": size === "md",
          "px-3 py-1.5 text-xs": size === "sm",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
