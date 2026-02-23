import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  elevated?: boolean;
}

export function Card({ glass, elevated, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/60 transition-all duration-200",
        glass
          ? "bg-white/70 backdrop-blur-xl shadow-glass"
          : "bg-white shadow-glass",
        elevated && "shadow-glass-xl hover:shadow-glass-lg hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pt-6 pb-4 border-b border-gray-100", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-5", className)} {...props}>
      {children}
    </div>
  );
}
