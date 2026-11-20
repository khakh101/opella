"use client";

import React, { useState } from "react";
import { ChevronRight, CornerUpLeft, Lightbulb, LogOut } from "lucide-react";
import { BUILD_MODES, BUILD_MODE_ORDER, BuildMode, SELF_SERVICE_EXITS, SELF_SERVICE_EXIT_RESULT } from "@/lib/miroBuild";
import { ExampleCase, MODES, PATHS } from "@/lib/miroLifecycle";
import { G6_BY_MODE, G6_REVIEWED, RUN_MODES, RUN_STEPS } from "@/lib/miroRun";
import { GateDiamond, Sticky, cx } from "./MiroPrimitives";
import { OriginLegend, WhoChip } from "./BuildShared";
import { RunStepPanel } from "./RunStepPanel";

interface RunCanvasProps {
  example: ExampleCase;
  onOpenDetail: (id: string) => void;
  onBackToFraming: () => void;
}

type StepNo = 1 | 2 | 3 | 4;

const GRID = { gridTemplateColumns: "250px repeat(4, minmax(0, 1fr))", columnGap: 20 } as const;

export const RunCanvas: React.FC<RunCanvasProps> = ({ example, onOpenDetail, onBackToFraming }) => {
  const [step, setStep] = useState<{ mode: BuildMode; n: StepNo } | null>(null);
  const g6Note = example.notes.g6;

  return (
    <div style={{ width: 1400 }}>
      {/* Intro */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="text-sm text-gray-800">
          <span className="font-black">Four steps in every mode.</span> The steps are the same; who delivers them depends on the build mode. Every quarter, G6 validates the run.
        </div>
        <span className="rounded-md border border-amber-200 bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
          Double-click a step to open it
        </span>
      </div>

      {/* Step header */}
      <div className="mb-3 grid" style={GRID}>
        <div className="flex items-end pb-1 text-[11px] font-black uppercase tracking-wider text-gray-400">After scale</div>
        {RUN_STEPS.map((s) => (
          <div
            key={s.n}
            className="relative flex h-14 items-center gap-3 bg-[#5b7a64] pl-5 pr-8 text-white"
            style={{ clipPath: "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 6% 50%)" }}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#2f4a37]">{s.n}</span>
            <div className="leading-tight">
              <div className="text-sm font-black">{s.name}</div>
              <div className="text-[10px] opacity-85">{s.oneLiner}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Lanes */}
      <div className="space-y-5">
        {BUILD_MODE_ORDER.map((id) => {
          const m = BUILD_MODES[id];
          const run = RUN_MODES[id];
          const isExample = example.mode === id;
          const isSelf = id === "self-service";
          return (
            <div
              key={id}
              className={cx("rounded-2xl border-2 bg-white/80 p-4 shadow-sm", isExample && "shadow-lg ring-4 ring-amber-200")}
              style={{ borderColor: m.color }}
            >
              <div className="grid items-stretch" style={GRID}>
                <div className="flex flex-col rounded-xl p-3 text-white" style={{ background: m.color }}>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Mode</div>
                  <div className="text-lg font-black leading-tight">{m.label}</div>
                  <div className="text-xs font-semibold opacity-90">{run.rule}</div>
                  <div className="mt-2 flex flex-1 flex-col gap-1">
                    <div className="text-[9px] font-black uppercase tracking-wider opacity-80">Core team</div>
                    {run.core.map((b) => (
                      <div key={b.label} className="rounded bg-white/25 px-2 py-1 text-[11px] font-bold leading-tight ring-1 ring-white/60">
                        {b.label}
                      </div>
                    ))}
                    <div className="mt-1.5 text-[9px] font-black uppercase tracking-wider opacity-80">Support team</div>
                    {run.support.map((b) => (
                      <div key={b.label} className="rounded border border-dashed border-white/50 px-2 py-1 text-[10px] font-semibold leading-tight opacity-90">
                        {b.label}
                      </div>
                    ))}
                  </div>
                </div>

                {RUN_STEPS.map((s) => {
                  const cell = run.steps[s.n];
                  return (
                    <div key={s.n} className="relative">
                      <div
                        role="button"
                        tabIndex={0}
                        onDoubleClick={() => setStep({ mode: id, n: s.n })}
                        onKeyDown={(e) => e.key === "Enter" && setStep({ mode: id, n: s.n })}
                        title="Double-click for details"
                        className="flex h-full cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ background: m.color }}>
                            {s.n}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{s.name}</span>
                        </div>
                        <div className="mt-1.5 text-[13px] font-bold leading-snug text-gray-900">{cell.short}</div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {cell.who.map((c) => (
                            <WhoChip key={c.label} chip={c} />
                          ))}
                        </div>
                        <button
                          onClick={() => setStep({ mode: id, n: s.n })}
                          className="mt-auto self-start pt-2 text-[10px] font-semibold text-gray-400 hover:text-gray-700"
                        >
                          Details
                        </button>
                      </div>
                      {s.n < 4 && <ChevronRight className="absolute -right-[17px] top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />}
                    </div>
                  );
                })}
              </div>

              {isSelf && (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border-2 border-dashed border-red-300 bg-red-50 px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-red-900">
                    <LogOut className="h-4 w-4" /> The user can leave this mode at any time
                  </div>
                  <div className="flex flex-1 flex-wrap gap-2">
                    {SELF_SERVICE_EXITS.map((e) => (
                      <span key={e.title} className="rounded-full border border-red-200 bg-white px-3 py-1 text-[11px] font-semibold text-gray-800">
                        {e.title}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={onBackToFraming}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-red-800"
                  >
                    <CornerUpLeft className="h-3.5 w-3.5" /> {SELF_SERVICE_EXIT_RESULT}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* G6, shown like the Framing gates */}
      <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-400 bg-white/70 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-black text-gray-700">
          <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-white">EVERY QUARTER</span>
          All four steps feed the maintain validation, whatever the mode
        </div>
        <div className="grid items-start gap-5" style={{ gridTemplateColumns: "390px 1fr 300px" }}>
          <div className="overflow-hidden rounded-xl border-2 border-gray-700 bg-white shadow-md">
            <div className="flex items-center justify-between bg-gray-700 px-3 py-1 text-[11px] font-black text-white">
              <span>Use Case monitoring · quarterly</span>
              <span className="text-[10px] font-semibold opacity-80">Double-click the gate</span>
            </div>
            <div className="flex items-center gap-4 px-4 py-3">
              <GateDiamond id="G6" type="human" size={48} label="Maintain validation" onOpen={() => onOpenDetail("g6")} />
              <div>
                <div className="mb-1 text-[10px] font-black uppercase tracking-wider text-gray-500">Reviewed</div>
                <div className="flex flex-wrap gap-1">
                  {G6_REVIEWED.map((r) => (
                    <span key={r} className="rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-800">
                      {r}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-[11px] font-bold text-gray-800">Decides: continue, scale, re-scope or stop</div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1.5 text-[11px] font-black uppercase tracking-wider text-gray-500">At G6, what changes by mode</div>
            <div className="grid grid-cols-2 gap-2">
              {BUILD_MODE_ORDER.map((id) => (
                <div key={id} className="rounded-lg border bg-white p-2 text-[11px] leading-snug text-gray-800" style={{ borderColor: BUILD_MODES[id].color }}>
                  <div className="font-black" style={{ color: BUILD_MODES[id].color }}>
                    {BUILD_MODES[id].label}
                  </div>
                  {G6_BY_MODE[id]}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Sticky color="red" tilt={1} title="Stop triggers">
              Terminate or pivot if adoption lags, run cost exceeds value or tech risks fail.
            </Sticky>
            {g6Note && (
              <Sticky color="yellow" tilt={-1}>
                <div className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
                  <Lightbulb className="h-3 w-3" /> Example
                </div>
                <div className="text-[11px] font-bold">
                  {example.short} · {PATHS[example.path].label} · {MODES[example.mode].label}
                </div>
                <p className="mt-1">{g6Note}</p>
              </Sticky>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm">
        <div className="font-semibold text-gray-800">A new feature goes through the use case request review, then is delivered in the mode.</div>
        <OriginLegend origins={["function", "to", "dai", "external", "agent"]} />
      </div>

      {step && <RunStepPanel mode={step.mode} step={step.n} onClose={() => setStep(null)} onChange={(mode, n) => setStep({ mode, n })} />}
    </div>
  );
};
