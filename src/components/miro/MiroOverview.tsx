"use client";

import React from "react";
import { MousePointerClick } from "lucide-react";
import { PATHS, PATH_ORDER, STEPS, StepId } from "@/lib/miroLifecycle";
import { GateDiamond, cx } from "./MiroPrimitives";

interface MiroOverviewProps {
  onOpenStep: (id: StepId) => void;
}

// First page: the 5 steps, the gates under each, and nothing else.
export const MiroOverview: React.FC<MiroOverviewProps> = ({ onOpenStep }) => (
  <div style={{ width: 1400 }}>
    {/* Zones */}
    <div className="mb-3 grid grid-cols-5 gap-4 text-[11px] font-bold">
      <div className="col-span-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-center text-emerald-900">
        Agility zone · sandbox, envelope funding, fast sprints, light tracking
      </div>
      <div className="col-span-3 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-center text-slate-800">
        Discipline zone · tranche funding, Planisware, Change Board, value sign-off
      </div>
    </div>

    {/* Chevrons */}
    <div className="grid grid-cols-5 gap-4">
      {STEPS.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onOpenStep(s.id)}
          className="group flex flex-col text-left focus:outline-none"
        >
          <div
            className={cx(
              "relative flex h-14 items-center justify-center px-6 text-base font-black text-white transition-colors",
              "bg-[#5b7a64] group-hover:bg-opella-forest"
            )}
            style={{
              clipPath:
                i === 0
                  ? "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)"
                  : "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 8% 50%)",
            }}
          >
            {s.numeral} · {s.name}
          </div>

          <div className="mt-3 flex min-h-[210px] flex-1 flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all group-hover:-translate-y-1 group-hover:border-opella-forest group-hover:shadow-lg">
            <div className="text-sm font-bold leading-snug text-gray-900">{s.oneLiner}</div>
            <ul className="mt-3 space-y-1.5">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-xs leading-snug text-gray-700">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5b7a64]" />
                  {b}
                </li>
              ))}
            </ul>
            {s.id === "framing" && (
              <div className="mt-3 flex flex-wrap gap-1">
                {PATH_ORDER.map((p) => (
                  <span
                    key={p}
                    className="rounded px-1.5 py-0.5 text-[10px] font-black text-white"
                    style={{ background: PATHS[p].color }}
                  >
                    {PATHS[p].label}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-auto flex items-center gap-1 pt-4 text-[11px] font-bold text-opella-forest opacity-0 transition-opacity group-hover:opacity-100">
              <MousePointerClick className="h-3.5 w-3.5" /> Open this step
            </div>
          </div>
        </button>
      ))}
    </div>

    {/* Gates */}
    <div className="mt-6 grid grid-cols-5 gap-4">
      {STEPS.map((s) => (
        <div key={s.id} className="flex min-h-[120px] items-start justify-center gap-1">
          {s.gates.length === 0 ? (
            <div className="pt-8 text-center text-[11px] italic text-gray-400">
              {s.id === "build" ? "Starts at GO BUILD" : "Roll-out after G5"}
            </div>
          ) : (
            s.gates.map((g) => (
              <GateDiamond
                key={g.id}
                id={g.id}
                type={g.type}
                size={s.gates.length > 2 ? 34 : 46}
                label={g.label}
                showDetailsButton={false}
              />
            ))
          )}
        </div>
      ))}
    </div>

    {/* Legend */}
    <div className="mt-2 flex items-center justify-center gap-6 text-xs text-gray-600">
      <span className="flex items-center gap-2">
        <span className="inline-block h-3.5 w-3.5 rotate-45 border-2 border-dashed border-violet-500 bg-violet-50" />
        Automatic gate: reviewed by an agent
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block h-3.5 w-3.5 rotate-45 bg-pink-500" />
        Manual gate: validated by people
      </span>
      <span className="flex items-center gap-2 font-semibold text-gray-800">
        <MousePointerClick className="h-4 w-4" /> Click a step to see what is inside
      </span>
    </div>
  </div>
);
