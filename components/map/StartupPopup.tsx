"use client";
import { X, ExternalLink, Users, Calendar, TrendingUp } from "lucide-react";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import type { Startup } from "@/types";

interface StartupPopupProps {
  startup: Startup;
  onClose: () => void;
  onSave?: (startup: Startup) => void;
}

export function StartupPopup({ startup, onClose, onSave }: StartupPopupProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-80 animate-slide-up pointer-events-auto">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-glass-xl overflow-hidden">
        {/* Top accent line */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, #3b82f6, #8b5cf6)` }} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">{startup.name}</h3>
              <p className="text-gray-500 text-xs mt-0.5">
                {startup.city}, {startup.country}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-2 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category */}
          <div className="mb-3">
            <CategoryBadge category={startup.category} />
          </div>

          {/* Tagline */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{startup.tagline}</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-50 rounded-2xl p-2.5 text-center">
              <Calendar className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
              <div className="text-xs font-semibold text-gray-800">{startup.founded_year}</div>
              <div className="text-[10px] text-gray-400">Founded</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-2.5 text-center">
              <Users className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
              <div className="text-xs font-semibold text-gray-800">{startup.team_size}</div>
              <div className="text-[10px] text-gray-400">Team</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-2.5 text-center">
              <TrendingUp className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
              <div className="text-xs font-semibold text-gray-800 leading-tight">{startup.funding_stage}</div>
              <div className="text-[10px] text-gray-400">Stage</div>
            </div>
          </div>

          {/* GDPR badge */}
          {startup.gdpr_compliant && (
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-[8px] text-emerald-600 font-bold">✓</span>
              </span>
              <span className="text-xs text-emerald-700 font-medium">GDPR Compliant</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {onSave && (
              <Button variant="secondary" size="sm" onClick={() => onSave(startup)} className="flex-1">
                Save
              </Button>
            )}
            {startup.pitch_deck_url && (
              <Button size="sm" className="flex-1 gap-1.5" onClick={() => window.open(startup.pitch_deck_url!, "_blank")}>
                <ExternalLink className="w-3.5 h-3.5" />
                Pitch Deck
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
