import { NextRequest, NextResponse } from "next/server";
import { rankStartups, computeRankingScore } from "@/lib/ranking/engine";
import { MOCK_STARTUPS } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const startupId = req.nextUrl.searchParams.get("startup_id");

  if (startupId) {
    const startup = MOCK_STARTUPS.find((s) => s.id === startupId);
    if (!startup) return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    const score = computeRankingScore(startup);
    return NextResponse.json({ score });
  }

  const ranked = rankStartups(MOCK_STARTUPS);
  return NextResponse.json({
    startups: ranked.map((s) => ({
      id:            s.id,
      name:          s.name,
      ranking_score: s.ranking_score,
      pricing_tier:  s.pricing_tier,
    })),
  });
}
