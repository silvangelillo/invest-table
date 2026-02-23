"use client";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            // Variants
            "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-sm":
              variant === "primary",
            "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 active:scale-[0.98]":
              variant === "secondary",
            "text-gray-600 hover:bg-gray-100 active:scale-[0.98]":
              variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]":
              variant === "danger",
            // Sizes
            "px-3 py-1.5 text-sm gap-1.5": size === "sm",
            "px-5 py-2.5 text-sm gap-2":   size === "md",
            "px-7 py-3.5 text-base gap-2":  size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
