"use client";

import React from "react";
import { MousePointerClick } from "lucide-react";
import { cx } from "@/components/miro/MiroPrimitives";
import { BUILD_MODES } from "@/lib/miroBuild";
import { ModeId } from "@/lib/miroLifecycle";

export type IntakeStep = 1 | 2 | 3 | 4;

interface HomeGate {
  id: string;
  label: string;
  type: "agent" | "human";
}

interface HomeStep {
  n: IntakeStep;
  emoji: string;
  name: string;
  oneLiner: string;
  bullets: string[];
  noAction?: boolean;
  validation: { label: string; lines: { gate: string; agent?: boolean; where: string; who: string }[] };
  gates: HomeGate[];
  gateNote?: string;
}

interface IntakeHomeProps {
  tier: string;
  onOpenStep: (step: IntakeStep) => void;
  onOpenNextStep: (mode: ModeId) => void;
}

const CHEVRON_FIRST = "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)";
const CHEVRON = "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 8% 50%)";

const NEXT_MODES: { id: ModeId; mode: string }[] = [
  { id: "for-me", mode: "Mode 1" },
  { id: "with-me", mode: "Mode 2" },
  { id: "enable-me", mode: "Mode 3" },
  { id: "self-service", mode: "Self-service" },
];

// Home screen of tab 2: the 4 intake steps, in the same template as the
// 5 lifecycle steps of the Miro board (tab 1). Click a step to zoom in.
export const IntakeHome: React.FC<IntakeHomeProps> = ({ tier, onOpenStep, onOpenNextStep }) => {
  const ss = tier === "Self-Serve";
  const board = `Portfolio board (${tier === "T1" ? "weekly" : "biweekly"})`;
  const steps: HomeStep[] = [
    {
      n: 1,
      emoji: "📝",
      name: "Preliminary project charter",
      oneLiner: "Front door intake and the 4-question assessment",
      bullets: [
        "Collect the 5 mandatory items: title, description, users, 4 questions, ORAI screening",
        "Filled by the business owner with the AI catalyst",
      ],
      validation: { label: "Sent to", lines: [{ gate: "Next", agent: true, where: "Directly to the charter agent (step 2)", who: "No human validation at this step" }] },
      gates: [],
      gateNote: "Charter form before G1",
    },
    {
      n: 2,
      emoji: "🤖",
      name: "Agent triage",
      oneLiner: "Agent automated triage: tier and speed",
      bullets: [
        "Scans the AI Registry for duplicate solutions",
        "Checks budget and scope against Big Bet boundaries",
        "Evaluates the ORAI risk tier",
        "Assigns the tier: T1, T2, T3 or Self-Serve",
      ],
      noAction: true,
      validation: { label: "Validated by · where", lines: [{ gate: "G1", agent: true, where: "No meeting", who: "The agent automatically, then the Transformation Office" }] },
      gates: [{ id: "G1", label: "Need validated", type: "agent" }],
    },
    {
      n: 3,
      emoji: "📊",
      name: "Business case",
      oneLiner: `The business case depends on the tier (current: ${tier})`,
      bullets: [
        "T1: Full Business Case",
        "T2: Light Business Case (1–2 pages)",
        "T3: One-Page Canvas",
        "Self-Serve: Registry Line",
      ],
      validation: ss
        ? { label: "Validated by · where", lines: [{ gate: "–", where: "No meeting", who: "Self-serve: one registry line; guardrails apply" }] }
        : {
            label: "Validated by · where",
            lines: [
              { gate: "G2", where: "No meeting", who: "Each support function validates its part: Value officer, P&C, Adoption lead, LEX, Data & AI" },
              { gate: "G3", where: tier === "T1" ? `${board}, then SteerCo` : board, who: tier === "T1" ? "Transformation Office; SteerCo validates. Cross stream meeting if several streams (optional)" : "Transformation Office" },
            ],
          },
      gates: [
        { id: "G2", label: "Feasible", type: "human" },
        { id: "G3", label: "Priority", type: "human" },
      ],
    },
    {
      n: 4,
      emoji: "🤝",
      name: "Mode selection",
      oneLiner: "Who delivers the use case",
      bullets: [
        "Mode 1 · Do it for me: “We ride for you”",
        "Mode 2 · Do it with me: “We ride together”",
        "Mode 3 · Enable me: “We give you the right bike and the map”",
      ],
      validation: ss
        ? { label: "Validated by · where", lines: [{ gate: "–", where: "No meeting", who: "Self-service: the function configures the tool" }] }
        : { label: "Validated by · where", lines: [{ gate: "G4", where: board, who: "Mainly the Transformation Office and the Data & AI office, supported by the other functions" }] },
      gates: [{ id: "G4", label: "Mode", type: "human" }],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-opella-forest">
          BO experience
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
          <MousePointerClick className="h-4 w-4 shrink-0" aria-hidden="true" />
          Click a step to see what is inside. Each step says who validates it, and where (current tier: {ss ? "Self-serve" : tier}).
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[1100px]">
          {/* Chevrons + cards */}
          <div className="grid grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <button
                key={s.n}
                type="button"
                onClick={() => onOpenStep(s.n)}
                className="group flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-opella-forest rounded-xl"
              >
                <div
                  className={cx(
                    "relative flex h-16 items-center justify-center gap-2 pl-8 pr-9 text-center text-sm font-black leading-tight text-white transition-colors",
                    s.noAction ? "bg-violet-600 group-hover:bg-violet-800" : "bg-pink-600 group-hover:bg-pink-800"
                  )}
                  style={{ clipPath: i === 0 ? CHEVRON_FIRST : CHEVRON }}
                >
                  <span aria-hidden="true">{s.emoji}</span>
                  <span>Step {s.n}: {s.name}</span>
                </div>
                <div
                  className={cx(
                    "mt-2 self-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
                    s.noAction ? "bg-violet-100 text-violet-800" : "bg-pink-100 text-pink-800"
                  )}
                >
                  {s.noAction ? "🤖 Automated process" : "✋ Manual process"}
                </div>

                <div
                  className={cx(
                    "mt-2 flex min-h-[250px] flex-1 flex-col rounded-xl border-2 bg-white p-4 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-lg",
                    s.noAction ? "border-violet-300 group-hover:border-violet-600" : "border-pink-200 group-hover:border-pink-600"
                  )}
                >
                  <div className="text-sm font-black leading-snug text-gray-900">{s.oneLiner}</div>
                  {s.noAction && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border-2 border-dashed border-violet-400 bg-violet-50 px-2.5 py-1.5 text-xs font-bold text-violet-800">
                      <span aria-hidden="true">🤖</span> No action needed from you: the agent does it
                    </div>
                  )}
                  <ul className="mt-3 space-y-1.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-xs leading-snug text-gray-700">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5b7a64]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-4">
                    <div className="space-y-2 rounded-lg border border-opella-border bg-[#F7F5EF] p-2.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-gray-500">{s.validation.label}</div>
                      {s.validation.lines.map((v) => (
                        <div key={v.gate + v.where} className="flex items-start gap-2">
                          <span
                            className={cx(
                              "mt-px inline-flex h-5 min-w-[30px] shrink-0 items-center justify-center rounded px-1 text-[10px] font-black",
                              v.agent ? "border-2 border-dashed border-violet-500 bg-violet-50 text-violet-800" : "bg-pink-600 text-white"
                            )}
                          >
                            {v.gate}
                          </span>
                          <span className="text-[11px] leading-snug">
                            <span className="font-bold text-gray-900">{v.where}</span>
                            <span className="block text-gray-600">{v.who}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pt-3 text-[11px] font-bold text-opella-forest opacity-60 transition-opacity group-hover:opacity-100">
                    <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" /> Open this step
                  </div>
                </div>
              </button>
            ))}

            {/* After step 4: the next step, by mode */}
            <div className="flex flex-col">
              <div
                className="relative flex h-16 items-center justify-center gap-2 px-6 text-sm font-black text-opella-forest bg-emerald-100"
                style={{ clipPath: CHEVRON }}
              >
                <span aria-hidden="true">🚀</span>
                <span>GO BUILD</span>
              </div>
              <div className="mt-[34px] flex min-h-[250px] flex-1 flex-col rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 p-4">
                <div className="text-sm font-black leading-snug text-gray-900">Next step: Build (MVP)</div>
                <div className="mt-1 text-xs font-semibold text-opella-forest">
                  Build and test the MVP in the selected mode
                </div>
                <div className="mt-3 space-y-2">
                  {NEXT_MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onOpenNextStep(m.id)}
                      className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-left text-xs font-bold text-gray-900 hover:border-opella-forest hover:shadow-sm"
                    >
                      <span>
                        <span className="text-gray-500">{m.mode} · </span>
                        {BUILD_MODES[m.id].label}
                      </span>
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: BUILD_MODES[m.id].color }}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-auto pt-3 text-[11px] text-gray-600">One page per mode: what the build means for you, from nothing (Do it for me) to most of the work (Enable me).</div>
              </div>
            </div>
          </div>

          {/* Gates under each step */}
          <div className="mt-6 grid grid-cols-5 gap-4">
            {steps.map((s) => (
              <div key={s.n} className="flex min-h-[90px] items-start justify-center gap-1">
                {s.gates.length === 0 ? (
                  <div className="pt-6 text-center text-[11px] italic text-gray-400">{s.gateNote}</div>
                ) : (
                  s.gates.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => onOpenStep(s.n)}
                      title={`Open step ${s.n}`}
                      className="group flex w-[64px] flex-col items-center focus:outline-none"
                    >
                      <span className="relative flex h-[46px] w-[46px] items-center justify-center">
                        <span
                          className={cx(
                            "absolute h-[34px] w-[34px] rotate-45 rounded-md shadow-md transition-transform group-hover:scale-110",
                            g.type === "agent"
                              ? "border-[3px] border-dashed border-violet-500 bg-violet-50"
                              : "border-2 border-pink-600 bg-pink-500"
                          )}
                        />
                        <span
                          className={cx(
                            "relative text-xs font-black",
                            g.type === "agent" ? "text-violet-800" : "text-white"
                          )}
                        >
                          {g.id}
                        </span>
                      </span>
                      <span className="mt-1 text-center text-[10px] font-bold leading-tight text-gray-800">
                        {g.label}
                      </span>
                    </button>
                  ))
                )}
              </div>
            ))}
            <div className="pt-6 text-center text-[11px] italic text-gray-400">Starts at GO BUILD</div>
          </div>

          {/* Legend */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
            <span className="flex items-center gap-2 font-semibold text-gray-800">
              <span className="inline-block h-3.5 w-6 rounded-sm bg-pink-600" /> Manual process (steps 1, 3, 4)
            </span>
            <span className="flex items-center gap-2 font-semibold text-gray-800">
              <span className="inline-block h-3.5 w-6 rounded-sm bg-violet-600" /> Automated process (step 2)
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 rotate-45 border-2 border-dashed border-violet-500 bg-violet-50" />
              Automatic gate: agent, then the Transformation Office
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 rotate-45 bg-pink-500" />
              Manual gate: validated by people
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
