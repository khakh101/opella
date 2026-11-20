"use client";

import React, { useEffect } from "react";
import { AlertTriangle, CornerUpLeft, Users } from "lucide-react";
import { BUILD_MODES, BuildMode } from "@/lib/miroBuild";
import { PATHS } from "@/lib/miroLifecycle";
import {
  ADOPTION_FLOW,
  ADOPTION_SOURCE_NOTE,
  RUN_ITEMS,
  RUN_MODES,
  RUN_QUESTIONS,
  RouteTone,
  RunItemId,
} from "@/lib/miroRun";
import { CloseButton, ModePills, WhoChip } from "./BuildShared";
import { cx } from "./MiroPrimitives";

interface RunStepPanelProps {
  item: RunItemId;
  mode: BuildMode;
  onClose: () => void;
  onChange: (item: RunItemId, mode: BuildMode) => void;
  onBackToFraming: () => void;
  onOpenG6: () => void;
}

const T2 = PATHS.T2.color;

const TONE: Record<RouteTone, { label: string; color: string; soft: string }> = {
  quick: { label: "QUICK", color: "#059669", soft: "#ecfdf5" },
  deep: { label: "BIGGER EFFORT", color: "#d97706", soft: "#fffbeb" },
  back: { label: "LARGER SCOPE", color: T2, soft: "#eff6ff" },
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-1.5 text-[11px] font-black uppercase tracking-wider text-gray-500">{children}</div>
);

// Double-click panel of the Run flow: step 1, assessment 2.1, assessment 2.2, step 3.
// The flow is the same in every mode; the mode pills compare who delivers it.
export const RunStepPanel: React.FC<RunStepPanelProps> = ({ item, mode, onClose, onChange, onBackToFraming, onOpenG6 }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const m = BUILD_MODES[mode];
  const run = RUN_MODES[mode];
  const it = RUN_ITEMS.find((i) => i.id === item)!;
  const cell = run.steps[it.cell];
  const q = item === "pipeline" || item === "feature" ? RUN_QUESTIONS[item] : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-[540px] flex-col bg-white shadow-2xl">
        <div className="border-b border-gray-200 px-5 pb-4 pt-5" style={{ borderTop: `4px solid ${m.color}` }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[10px] font-black text-white">RUN · {it.badge}</span>
                <span className="rounded px-1.5 py-0.5 text-[10px] font-black text-white" style={{ background: m.color }}>
                  {m.label}
                </span>
              </div>
              <h3 className="mt-1.5 text-lg font-black leading-tight text-gray-900">{it.name}</h3>
              <p className="text-xs text-gray-500">{it.oneLiner}</p>
            </div>
            <CloseButton onClick={onClose} />
          </div>
          <div className="mt-3">
            <ModePills value={mode} onChange={(nm) => onChange(item, nm)} />
          </div>
          <div className="mt-2 flex gap-1">
            {RUN_ITEMS.map((st) => (
              <button
                key={st.id}
                onClick={() => onChange(st.id, mode)}
                className={cx(
                  "flex-1 rounded-md border px-1.5 py-1 text-[10px] font-bold leading-tight",
                  st.id === item ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 text-gray-500 hover:border-gray-400"
                )}
              >
                {st.tab} · {st.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Step 2: the question, the two routes of the assessment, the result */}
          {q && (
            <>
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                  Question {item === "pipeline" ? "2.1" : "2.2"}
                </div>
                <div className="text-sm font-black text-gray-900">{q.question}</div>
                {item === "feature" && <div className="mt-0.5 text-[11px] text-amber-900">Asked when it is not a broken pipeline.</div>}
              </div>

              <div>
                <SectionLabel>The assessment, two routes</SectionLabel>
                <div className="space-y-2">
                  {q.routes.map((r) => {
                    const t = TONE[r.tone];
                    return (
                      <div key={r.title} className="rounded-lg border p-3" style={{ borderColor: t.color, background: t.soft }}>
                        <div className="flex items-center gap-2">
                          <span className="rounded px-1.5 py-0.5 text-[9px] font-black text-white" style={{ background: t.color }}>
                            {t.label}
                          </span>
                          <span className="text-sm font-black text-gray-900">{r.title}</span>
                        </div>
                        <p className="mt-1 text-sm leading-snug text-gray-800">{r.text}</p>
                        {r.bullets && (
                          <ul className="mt-1.5 space-y-1">
                            {r.bullets.map((b) => (
                              <li key={b} className="flex gap-2 text-[13px] leading-snug text-gray-800">
                                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: t.color }} />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {r.tone === "back" && (
                          <button
                            type="button"
                            onClick={onBackToFraming}
                            className="mt-2 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black text-white shadow-md transition-transform hover:scale-[1.03]"
                            style={{ background: T2 }}
                          >
                            <CornerUpLeft className="h-4 w-4" />
                            Back to Framing · T2 assessment
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <SectionLabel>Result, reviewed at G6</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-emerald-400 bg-emerald-50 p-2.5 text-xs font-bold text-emerald-950">{q.solve}</div>
                  <div className="rounded-lg border border-red-300 bg-red-50 p-2.5 text-xs font-bold text-red-950">{q.remove}</div>
                </div>
                <button
                  type="button"
                  onClick={onOpenG6}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-pink-300 bg-pink-50 px-2.5 py-1 text-[11px] font-bold text-pink-900 hover:bg-pink-100"
                >
                  <Users className="h-3 w-3" /> G6 · Maintain validation, at the portfolio board
                </button>
              </div>
            </>
          )}

          {/* Step 3: how the adoption is ensured */}
          {item === "adoption" && (
            <div>
              <SectionLabel>How the adoption is ensured</SectionLabel>
              <ol className="space-y-2">
                {ADOPTION_FLOW.map((a, i) => (
                  <li key={a.title} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5b7a64] text-xs font-black text-white">{i + 1}</span>
                    <div>
                      <div className="text-sm font-black text-gray-900">{a.title}</div>
                      <div className="text-[13px] leading-snug text-gray-700">{a.text}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-2 flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{ADOPTION_SOURCE_NOTE}</span>
              </div>
            </div>
          )}

          {/* Who delivers it, in this mode */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
            <span className="font-bold">{m.label}.</span> {run.rule}
          </div>

          <div>
            <SectionLabel>Who takes part in {m.label}</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {cell.who.map((c) => (
                <WhoChip key={c.label} chip={c} size="md" />
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>What happens</SectionLabel>
            <ul className="space-y-1.5">
              {cell.happens.map((h) => (
                <li key={h} className="flex gap-2 text-sm leading-snug text-gray-800">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border p-3" style={{ borderColor: m.color, background: `${m.color}0d` }}>
            <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: m.color }}>
              Output
            </div>
            <div className="mt-0.5 text-sm font-semibold text-gray-900">{cell.output}</div>
          </div>

          {cell.note && (
            <div className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{cell.note}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-5 py-2 text-[10px] text-gray-400">
          Source: briefing of 20/11 for the flow; operating model lifecycle (degrees 1 to 4) and role sheets for who does what
        </div>
      </aside>
    </div>
  );
};
