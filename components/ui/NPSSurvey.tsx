"use client";

import { useState, useEffect } from "react";
import { X, Heart, Send } from "lucide-react";

type Variant = "floating" | "inline";
type Stage   = "idle" | "survey" | "comment" | "done";

const NPS_KEY     = "nps_last_submitted";
const NPS_DISMISS = "nps_last_dismissed";
const SHOW_DELAY_MS   = 45_000;   // show floating widget after 45 s
const RESHOW_DAYS     = 30;        // days before asking again after submit
const DISMISS_DAYS    = 7;         // days before asking again after dismiss

function daysSince(isoDate: string): number {
  return (Date.now() - new Date(isoDate).getTime()) / 86_400_000;
}

function shouldShowNPS(): boolean {
  try {
    const submitted = localStorage.getItem(NPS_KEY);
    if (submitted && daysSince(submitted) < RESHOW_DAYS) return false;
    const dismissed = localStorage.getItem(NPS_DISMISS);
    if (dismissed && daysSince(dismissed) < DISMISS_DAYS) return false;
  } catch { /* SSR / private browsing */ }
  return true;
}

// ─── Score button ─────────────────────────────────────────────────────────────
function ScoreBtn({
  score, selected, onClick,
}: {
  score: number; selected: boolean; onClick: () => void;
}) {
  const isGood    = score >= 9;
  const isNeutral = score >= 7 && score < 9;
  const accent    = isGood ? "#10b981" : isNeutral ? "#f59e0b" : "#ef4444";

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: 10, border: "none",
        fontSize: 13, fontWeight: selected ? 700 : 400,
        cursor: "pointer", fontFamily: "inherit",
        transition: "all 0.15s",
        background: selected ? `${accent}22` : "rgba(255,255,255,0.05)",
        color: selected ? accent : "rgba(255,255,255,0.45)",
        outline: selected ? `1.5px solid ${accent}55` : "none",
        transform: selected ? "scale(1.1)" : "scale(1)",
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}}
    >
      {score}
    </button>
  );
}

// ─── Survey card ──────────────────────────────────────────────────────────────
function SurveyCard({
  variant, onClose,
}: {
  variant: Variant; onClose: () => void;
}) {
  const [stage,   setStage]   = useState<Stage>("survey");
  const [score,   setScore]   = useState<number | null>(null);
  const [comment, setComment] = useState("");

  function handleScore(n: number) {
    setScore(n);
  }

  function handleSubmit() {
    if (score === null) return;
    // In production: POST to /api/nps or a third-party service
    try {
      localStorage.setItem(NPS_KEY, new Date().toISOString());
    } catch { /* */ }
    setStage("done");
    setTimeout(() => { if (variant === "floating") onClose(); }, 3000);
  }

  function handleDismiss() {
    try {
      localStorage.setItem(NPS_DISMISS, new Date().toISOString());
    } catch { /* */ }
    onClose();
  }

  const isInline = variant === "inline";

  const cardStyle: React.CSSProperties = isInline
    ? {
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: "28px 28px 24px",
      }
    : {
        background: "rgba(12,12,16,0.96)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 20,
        padding: "24px 24px 20px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        backdropFilter: "blur(40px) saturate(180%)",
        width: 360,
      };

  // Done state
  if (stage === "done") {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
          }}>
            <Heart size={20} color="#10b981" fill="#10b981" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.88)", marginBottom: 6 }}>
            Thank you!
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 300, lineHeight: 1.6 }}>
            Your feedback helps us build a better platform for investors and founders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, gap: 12 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 4, lineHeight: 1.4 }}>
            How likely are you to recommend InvestTable?
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
            Rate from 0 (not at all) to 10 (extremely likely)
          </p>
        </div>
        {variant === "floating" && (
          <button type="button" onClick={handleDismiss}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.2)", padding: 2, flexShrink: 0,
              transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Score grid */}
      <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
        {Array.from({ length: 11 }, (_, i) => (
          <ScoreBtn key={i} score={i} selected={score === i} onClick={() => handleScore(i)} />
        ))}
      </div>

      {/* Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Not at all</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Extremely likely</span>
      </div>

      {/* Comment (shown when score < 9) */}
      {score !== null && score < 9 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontWeight: 400 }}>
            What could we improve?
          </p>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Tell us more…"
            rows={3}
            maxLength={500}
            style={{
              width: "100%", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12,
              padding: "10px 12px", fontSize: 13, color: "rgba(255,255,255,0.7)",
              fontFamily: "inherit", outline: "none", resize: "vertical",
              lineHeight: 1.5,
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(59,130,246,0.4)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
          />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {variant === "inline" && (
          <button type="button" onClick={handleDismiss}
            style={{
              padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 400,
              background: "none", border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
          >
            Skip
          </button>
        )}
        <button type="button" onClick={handleSubmit} disabled={score === null}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600,
            background: score !== null ? "linear-gradient(135deg,#3b82f6,#2563eb)" : "rgba(255,255,255,0.06)",
            border: "none", color: score !== null ? "#fff" : "rgba(255,255,255,0.25)",
            cursor: score !== null ? "pointer" : "not-allowed",
            fontFamily: "inherit", transition: "all 0.15s",
            boxShadow: score !== null ? "0 4px 16px rgba(59,130,246,0.3)" : "none",
          }}>
          <Send size={12} />
          Submit
        </button>
      </div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
export function NPSSurvey({ variant = "floating" }: { variant?: Variant }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!shouldShowNPS()) return;

    if (variant === "inline") {
      setVisible(true);
      return;
    }

    // Floating: show after delay
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [variant]);

  if (!visible) return null;

  if (variant === "inline") {
    return <SurveyCard variant="inline" onClose={() => setVisible(false)} />;
  }

  // Floating: bottom-right, slides in
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 1000,
      animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
    }}>
      <style>{`@keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <SurveyCard variant="floating" onClose={() => setVisible(false)} />
    </div>
  );
}
