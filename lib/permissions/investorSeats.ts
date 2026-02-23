import { supabase } from "@/lib/supabase";
import type { InvestorUser, InvestorOrganization, SeatStatus } from "@/types";

// ─── Check if org has capacity for another active seat ────────────────────────
export async function hasAvailableSeat(organizationId: string): Promise<boolean> {
  const [orgRes, activeRes] = await Promise.all([
    supabase
      .from("investor_organizations")
      .select("purchased_seats")
      .eq("id", organizationId)
      .single(),
    supabase
      .from("investor_users")
      .select("id", { count: "exact" })
      .eq("organization_id", organizationId)
      .eq("seat_status", "active"),
  ]);

  if (orgRes.error || activeRes.error) return false;
  const purchased = orgRes.data.purchased_seats ?? 0;
  const active    = activeRes.count ?? 0;
  return active < purchased;
}

// ─── Activate a seat (admin only) ─────────────────────────────────────────────
export async function activateSeat(
  actorId: string,
  targetUserId: string,
  organizationId: string
): Promise<{ success: boolean; error?: string }> {
  // Verify actor is admin
  const { data: actor } = await supabase
    .from("investor_users")
    .select("role, organization_id")
    .eq("id", actorId)
    .single();

  if (!actor || actor.role !== "admin" || actor.organization_id !== organizationId) {
    return { success: false, error: "Unauthorized: only org admins can manage seats" };
  }

  // Check seat capacity BEFORE activating
  const canActivate = await hasAvailableSeat(organizationId);
  if (!canActivate) {
    return { success: false, error: "No available seats. Purchase more seats to activate this user." };
  }

  const { error } = await supabase
    .from("investor_users")
    .update({ seat_status: "active" })
    .eq("id", targetUserId)
    .eq("organization_id", organizationId);

  if (error) return { success: false, error: error.message };

  // Write audit log
  await writeAuditLog(actorId, "seat_activated", targetUserId, { organizationId });

  return { success: true };
}

// ─── Deactivate a seat (admin only) ──────────────────────────────────────────
export async function deactivateSeat(
  actorId: string,
  targetUserId: string,
  organizationId: string
): Promise<{ success: boolean; error?: string }> {
  const { data: actor } = await supabase
    .from("investor_users")
    .select("role, organization_id")
    .eq("id", actorId)
    .single();

  if (!actor || actor.role !== "admin" || actor.organization_id !== organizationId) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("investor_users")
    .update({ seat_status: "inactive", session_token_hash: null })
    .eq("id", targetUserId)
    .eq("organization_id", organizationId);

  if (error) return { success: false, error: error.message };
  await writeAuditLog(actorId, "seat_deactivated", targetUserId, { organizationId });
  return { success: true };
}

// ─── Get seat usage for an org ────────────────────────────────────────────────
export async function getSeatUsage(organizationId: string): Promise<{
  purchased: number;
  active: number;
  available: number;
  users: InvestorUser[];
}> {
  const [orgRes, usersRes] = await Promise.all([
    supabase
      .from("investor_organizations")
      .select("purchased_seats")
      .eq("id", organizationId)
      .single(),
    supabase
      .from("investor_users")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at"),
  ]);

  const purchased = orgRes.data?.purchased_seats ?? 0;
  const users     = (usersRes.data ?? []) as InvestorUser[];
  const active    = users.filter((u) => u.seat_status === "active").length;

  return { purchased, active, available: purchased - active, users };
}

// ─── Audit log helper ─────────────────────────────────────────────────────────
async function writeAuditLog(
  actorId: string,
  action: string,
  targetId: string,
  metadata: Record<string, unknown>
): Promise<void> {
  await supabase.from("audit_logs").insert({
    actor_id:   actorId,
    action,
    target_id:  targetId,
    metadata,
    created_at: new Date().toISOString(),
  });
}
