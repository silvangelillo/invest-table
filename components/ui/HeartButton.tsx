"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface HeartButtonProps {
  startupId: string;
  initialFavorited?: boolean;
  heartCount?: number;
  onToggle?: (favorited: boolean) => void;
}

export function HeartButton({
  startupId,
  initialFavorited = false,
  heartCount = 0,
  onToggle,
}: HeartButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [count, setCount]         = useState(heartCount);
  const [loading, setLoading]     = useState(false);

  async function handleToggle() {
    setLoading(true);
    // Optimistic update
    const newState = !favorited;
    setFavorited(newState);
    setCount((c) => newState ? c + 1 : Math.max(0, c - 1));

    try {
      // In production: POST /api/favorites with { startupId }
      // Mock for demo:
      await new Promise((r) => setTimeout(r, 300));
      toast.success(newState ? "Added to favorites ❤️" : "Removed from favorites");
      onToggle?.(newState);
    } catch {
      // Rollback on error
      setFavorited(!newState);
      setCount((c) => !newState ? c + 1 : Math.max(0, c - 1));
      toast.error("Failed to update favorites");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
        favorited
          ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
          : "bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400",
        loading && "opacity-50 cursor-not-allowed"
      )}
    >
      <Heart
        className={cn("w-3.5 h-3.5 transition-all", favorited && "fill-red-500 text-red-500")}
      />
      <span>{count > 0 ? count : ""}</span>
    </button>
  );
}
