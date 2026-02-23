"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, Globe, Heart } from "lucide-react";

// Only show counter when we have at least this many startups
const MIN_STARTUPS_TO_SHOW = 20;

interface Stats {
  startup_count: number;
  country_count: number;
  total_hearts: number;
}

export function PlatformStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("platform_stats")
        .select("*")
        .single();
      if (data && data.startup_count >= MIN_STARTUPS_TO_SHOW) {
        setStats(data);
      }
    }
    load();
  }, []);

  // Don't render anything until threshold is met
  if (!stats) return null;

  return (
    <div className="flex items-center justify-center gap-8 py-6">
      {[
        { icon: TrendingUp, value: stats.startup_count, label: "startups" },
        { icon: Globe,      value: stats.country_count,  label: "EU countries" },
        { icon: Heart,      value: stats.total_hearts,   label: "investor hearts" },
      ].map(({ icon: Icon, value, label }) => (
        <div key={label} className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Icon className="w-4 h-4 text-blue-500" />
            <span className="text-2xl font-black text-gray-900">{value.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
      ))}
    </div>
  );
}
