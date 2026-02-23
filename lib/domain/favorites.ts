import { supabase } from "@/lib/supabase";
import type { Favorite } from "@/types";

// ─── Toggle heart on a startup ────────────────────────────────────────────────
export async function toggleFavorite(
  investorUserId: string,
  startupId: string
): Promise<{ favorited: boolean; error?: string }> {
  // Check existing
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("investor_user_id", investorUserId)
    .eq("startup_id", startupId)
    .single();

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);
    if (error) return { favorited: false, error: error.message };
    return { favorited: false };
  } else {
    // Add favorite
    const { error } = await supabase
      .from("favorites")
      .insert({ investor_user_id: investorUserId, startup_id: startupId });
    if (error) return { favorited: true, error: error.message };
    return { favorited: true };
  }
}

// ─── Get all favorites for an investor ───────────────────────────────────────
export async function getInvestorFavorites(
  investorUserId: string
): Promise<string[]> {
  const { data } = await supabase
    .from("favorites")
    .select("startup_id")
    .eq("investor_user_id", investorUserId);
  return (data ?? []).map((f: any) => f.startup_id);
}

// ─── Get heart count for a startup ───────────────────────────────────────────
export async function getHeartCount(startupId: string): Promise<number> {
  const { count } = await supabase
    .from("favorites")
    .select("id", { count: "exact" })
    .eq("startup_id", startupId);
  return count ?? 0;
}

// ─── Check if investor has favorited a startup ───────────────────────────────
export async function isFavorited(
  investorUserId: string,
  startupId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("investor_user_id", investorUserId)
    .eq("startup_id", startupId)
    .single();
  return !!data;
}
