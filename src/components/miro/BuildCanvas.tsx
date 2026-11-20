"use client";

import React, { useState } from "react";
import { ChevronRight, CornerUpLeft, Lightbulb, LogOut, Users, Bot } from "lucide-react";
import { BUILD_MODES, BUILD_MODE_ORDER, BUILD_STEPS, BuildMode, ORIGIN, SELF_SERVICE_AGENTS, SELF_SERVICE_EXITS, SELF_SERVICE_EXIT_RESULT } from "@/lib/miroBuild";
import { ExampleCase } from "@/lib/miroLifecycle";
import { cx } from "./MiroPrimitives";
import { OriginLegend, WhoChip } from "./BuildShared";
import { BuildStepPanel } from "./BuildStepPanel";
import { TeamDeepDive } from "./TeamDeepDive";
import { AgentDeepDive } from "./AgentDeepDive";

interface BuildCanvasProps {
  example: ExampleCase;
  onBackToFraming: () => void;
}

type StepNo = 1 | 2 | 3 | 4;

const GRID = { gridTemplateColumns: "250px repeat(4, minmax(0, 1fr))", columnGap: 20 } as const;

export const BuildCanvas: React.FC<BuildCanvasProps> = ({ example, onBackToFraming }) => {
  const [step, setStep] = useState<{ mode: BuildMode; n: StepNo } | null>(null);
  const [team, setTeam] = useState<BuildMode | null>(null);
  const [guardrails, setGuardrails] = useState(false);

  const openTeam = (m: BuildMode) => {
    setGuardrails(false);
    setTeam(m);
  };

  return (
    <div style={{ width: 1400 }}>
      {/* Intro */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="text-sm text-gray-800">
          <span className="font-black">Four big steps in every mode.</span> The steps are the same; who delivers them depends on the mode chosen at G4.
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
          <span className="rounded-md border border-amber-200 bg-amber-100 px-2 py-1 text-amber-900">Double-click a step to open it</span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded border-2 border-gray-400 bg-white" /> Human step
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded border-2" style={{ borderColor: ORIGIN.agent.color, background: ORIGIN.agent.soft }} /> Agentic step
          </span>
        </div>
      </div>

      {/* Step header */}
      <div className="mb-3 grid" style={GRID}>
        <div className="flex items-end pb-1 text-[11px] font-black uppercase tracking-wider text-gray-400">GO BUILD (after G4)</div>
        {BUILD_STEPS.map((s) => (
          <div
            key={s.n}
            className="relative flex h-14 items-center gap-3 bg-[#5b7a64] pl-5 pr-8 text-white"
            style={{ clipPath: "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 6% 50%)" }}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#2f4a37]">
              {s.n}
            </span>
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
          const isExample = example.mode === id;
          const isSelf = id === "self-service";
          return (
            <div
              key={id}
              className={cx(
                "rounded-2xl border-2 bg-white/80 p-4 shadow-sm transition-shadow",
                isExample && "shadow-lg ring-4 ring-amber-200"
              )}
              style={{ borderColor: m.color }}
            >
              <div className="grid items-stretch" style={GRID}>
                {/* Lane label */}
                <div className="flex flex-col rounded-xl p-3 text-white" style={{ background: m.color }}>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Mode</div>
                  <div className="text-lg font-black leading-tight">{m.label}</div>
                  <div className="text-xs font-semibold opacity-90">{m.tagline}</div>
                  <div className="mt-2 flex flex-1 flex-col gap-1">
                    <div className="text-[9px] font-black uppercase tracking-wider opacity-80">Core team</div>
                    {m.builders.map((b) => (
                      <div key={b.label} className="rounded bg-white/25 px-2 py-1 text-[11px] font-bold leading-tight ring-1 ring-white/60">
                        {b.label}
                      </div>
                    ))}
                    <div className="mt-1.5 text-[9px] font-black uppercase tracking-wider opacity-80">Support team</div>
                    {m.support.map((b) => (
                      <div key={b.label} className="rounded border border-dashed border-white/50 px-2 py-1 text-[10px] font-semibold leading-tight opacity-90">
                        {b.label}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => openTeam(id)}
                    className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-2 py-1.5 text-xs font-black shadow-sm hover:bg-gray-100"
                    style={{ color: m.color }}
                  >
                    {isSelf ? <Bot className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                    {isSelf ? "View the agents" : "View the team"}
                  </button>
                </div>

                {/* Step cards */}
                {BUILD_STEPS.map((s) => {
                  const cell = m.steps[s.n];
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
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
                            style={{ background: m.color }}
                          >
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
                      {s.n < 4 && (
                        <ChevronRight className="absolute -right-[17px] top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Self-service: agentic row, always on across the 4 steps */}
              {isSelf && (
                <div className="mt-3 grid items-stretch" style={GRID}>
                  <div className="flex items-center rounded-xl border-2 px-3 py-2 text-xs font-black" style={{ borderColor: ORIGIN.agent.color, background: ORIGIN.agent.soft, color: ORIGIN.agent.color }}>
                    <Bot className="mr-1.5 h-4 w-4" /> Agentic: always on
                  </div>
                  <div
                    className="col-span-4 grid grid-cols-2 gap-4 rounded-xl border-2 p-3"
                    style={{ borderColor: ORIGIN.agent.color, background: ORIGIN.agent.soft }}
                  >
                    {SELF_SERVICE_AGENTS.map((a) => (
                      <div
                        key={a.id}
                        role="button"
                        tabIndex={0}
                        onDoubleClick={() => {
                          setGuardrails(a.id === "audit");
                          setTeam("self-service");
                        }}
                        title={a.id === "audit" ? "Double-click for the guardrails" : undefined}
                        className={cx(
                          "rounded-lg border bg-white p-3 shadow-sm",
                          a.id === "audit" && "cursor-pointer hover:shadow-md"
                        )}
                        style={{ borderColor: ORIGIN.agent.color }}
                      >
                        <div className="flex items-center gap-2 text-[13px] font-bold text-gray-900">
                          <Bot className="h-4 w-4" style={{ color: ORIGIN.agent.color }} /> {a.name}
                        </div>
                        <div className="mt-1 text-[11px] leading-snug text-gray-700">{a.does}</div>
                        {a.id === "audit" && <div className="mt-1.5 text-[10px] font-semibold text-gray-400">Double-click: the guardrails</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Example note on the active lane */}
              {isExample && example.notes.build && (
                <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-300 bg-[#fff59d] px-3 py-2 text-xs text-amber-950">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    <span className="font-black">Example: {example.short}.</span> {example.notes.build}
                  </span>
                </div>
              )}

              {/* Self-service: leave the mode at any time */}
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

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm">
        <div className="font-semibold text-gray-800">
          End of the build: a validated MVP goes to Pre-scale, is iterated, or is stopped.
        </div>
        <OriginLegend origins={["function", "to", "dai", "external", "agent"]} />
      </div>

      {/* Panels */}
      {step && (
        <BuildStepPanel
          mode={step.mode}
          step={step.n}
          example={example}
          onClose={() => setStep(null)}
          onChange={(mode, n) => setStep({ mode, n })}
        />
      )}
      {team && team !== "self-service" && (
        <TeamDeepDive mode={team} onClose={() => setTeam(null)} onChange={openTeam} />
      )}
      {team === "self-service" && (
        <AgentDeepDive key={String(guardrails)} onClose={() => setTeam(null)} onChange={openTeam} onBackToFraming={onBackToFraming} openGuardrails={guardrails} />
      )}
    </div>
  );
};
