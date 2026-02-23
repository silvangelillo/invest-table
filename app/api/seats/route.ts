import { NextRequest, NextResponse } from "next/server";
import { activateSeat, deactivateSeat, getSeatUsage } from "@/lib/permissions/investorSeats";
import { seatActionSchema } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = seatActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { investor_user_id, action, organization_id } = parsed.data;
    const actorId = req.headers.get("x-actor-id") ?? "";

    let result;
    if (action === "activate") {
      result = await activateSeat(actorId, investor_user_id, organization_id);
    } else {
      result = await deactivateSeat(actorId, investor_user_id, organization_id);
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get("organization_id");
  if (!orgId) return NextResponse.json({ error: "Missing organization_id" }, { status: 400 });
  const usage = await getSeatUsage(orgId);
  return NextResponse.json(usage);
}
