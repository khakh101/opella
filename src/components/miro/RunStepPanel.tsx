"use client";

import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { BUILD_MODES, BuildMode } from "@/lib/miroBuild";
import { RUN_MODES, RUN_STEPS } from "@/lib/miroRun";
import { CloseButton, ModePills, WhoChip } from "./BuildShared";
import { cx } from "./MiroPrimitives";

interface RunStepPanelProps {
  mode: BuildMode;
  step: 1 | 2 | 3 | 4;
  onClose: () => void;
  onChange: (mode: BuildMode, step: 1 | 2 | 3 | 4) => void;
}

// Double-click panel of a Run step, for one mode; mode pills compare the same step.
export const RunStepPanel: React.FC<RunStepPanelProps> = ({ mode, step, onClose, onChange }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const m = BUILD_MODES[mode];
  const run = RUN_MODES[mode];
  const s = RUN_STEPS[step - 1];
  const cell = run.steps[step];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl">
        <div className="border-b border-gray-200 px-5 pb-4 pt-5" style={{ borderTop: `4px solid ${m.color}` }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[10px] font-black text-white">RUN · STEP {s.n} OF 4</span>
                <span className="rounded px-1.5 py-0.5 text-[10px] font-black text-white" style={{ background: m.color }}>
                  {m.label}
                </span>
              </div>
              <h3 className="mt-1.5 text-lg font-black leading-tight text-gray-900">{s.name}</h3>
              <p className="text-xs text-gray-500">{s.oneLiner}</p>
            </div>
            <CloseButton onClick={onClose} />
          </div>
          <div className="mt-3">
            <ModePills value={mode} onChange={(nm) => onChange(nm, step)} />
          </div>
          <div className="mt-2 flex gap-1">
            {RUN_STEPS.map((st) => (
              <button
                key={st.n}
                onClick={() => onChange(mode, st.n)}
                className={cx(
                  "flex-1 rounded-md border px-1.5 py-1 text-[10px] font-bold leading-tight",
                  st.n === step ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 text-gray-500 hover:border-gray-400"
                )}
              >
                {st.n} · {st.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
            <span className="font-bold">{m.label}.</span> {run.rule}
          </div>

          <div>
            <div className="mb-1.5 text-[11px] font-black uppercase tracking-wider text-gray-500">Who takes part</div>
            <div className="flex flex-wrap gap-1.5">
              {cell.who.map((c) => (
                <WhoChip key={c.label} chip={c} size="md" />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1.5 text-[11px] font-black uppercase tracking-wider text-gray-500">What happens</div>
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
              Output of this step
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
          Source: Operating model lifecycle (degrees 1 to 4, the four meetings) and role sheets
        </div>
      </aside>
    </div>
  );
};
