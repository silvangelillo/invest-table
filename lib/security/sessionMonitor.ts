import { supabase } from "@/lib/supabase";
import { createHash } from "crypto";

// ─── Generate a session token hash ───────────────────────────────────────────
export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ─── Register a new session ───────────────────────────────────────────────────
export async function registerSession(
  userId: string,
  sessionToken: string,
  ipAddress: string
): Promise<{ success: boolean; flagged?: boolean }> {
  const tokenHash = hashSessionToken(sessionToken);

  // Check for existing active session from different IP
  const { data: existing } = await supabase
    .from("investor_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(5);

  const otherIpSessions = (existing ?? []).filter(
    (s: any) => s.ip_address !== ipAddress
  );

  if (otherIpSessions.length >= 2) {
    // Flag concurrent session abuse
    await supabase.from("audit_logs").insert({
      actor_id:   userId,
      action:     "concurrent_session_flagged",
      target_id:  userId,
      metadata:   { ip_address: ipAddress, concurrent_count: otherIpSessions.length },
      created_at: new Date().toISOString(),
    });
    return { success: true, flagged: true };
  }

  // Invalidate old sessions and create new one
  await supabase
    .from("investor_sessions")
    .update({ active: false })
    .eq("user_id", userId);

  await supabase.from("investor_sessions").insert({
    user_id:     userId,
    token_hash:  tokenHash,
    ip_address:  ipAddress,
    active:      true,
    created_at:  new Date().toISOString(),
  });

  // Update last_login_at and session token hash on user
  await supabase
    .from("investor_users")
    .update({
      session_token_hash: tokenHash,
      last_login_at:      new Date().toISOString(),
    })
    .eq("id", userId);

  return { success: true, flagged: false };
}

// ─── Validate active session ──────────────────────────────────────────────────
export async function validateSession(
  userId: string,
  sessionToken: string
): Promise<boolean> {
  const tokenHash = hashSessionToken(sessionToken);
  const { data } = await supabase
    .from("investor_users")
    .select("session_token_hash, seat_status")
    .eq("id", userId)
    .single();

  if (!data) return false;
  if (data.seat_status !== "active") return false;
  return data.session_token_hash === tokenHash;
}

// ─── Invalidate session on logout ─────────────────────────────────────────────
export async function invalidateSession(userId: string): Promise<void> {
  await Promise.all([
    supabase
      .from("investor_sessions")
      .update({ active: false })
      .eq("user_id", userId),
    supabase
      .from("investor_users")
      .update({ session_token_hash: null })
      .eq("id", userId),
  ]);
}
