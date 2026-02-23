import { NextRequest, NextResponse } from "next/server";
import { toggleFavorite, getInvestorFavorites } from "@/lib/domain/favorites";

export async function POST(req: NextRequest) {
  try {
    const { investor_user_id, startup_id } = await req.json();
    if (!investor_user_id || !startup_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = await toggleFavorite(investor_user_id, startup_id);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const investorUserId = req.nextUrl.searchParams.get("investor_user_id");
  if (!investorUserId) {
    return NextResponse.json({ error: "Missing investor_user_id" }, { status: 400 });
  }
  const favorites = await getInvestorFavorites(investorUserId);
  return NextResponse.json({ favorites });
}
