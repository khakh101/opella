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
  const steps: HomeStep[] = [
    {
      n: 1,
      emoji: "📝",
      name: "The 4 Questions Assessment & Initiative Framing",
      oneLiner: "Front Door Intake & 4-Questions Assessment",
      bullets: [
        "Collect the 5 mandatory items: title, description, users, 4 questions, ORAI screening",
        "Filled by the business owner with the AI catalyst",
      ],
      gates: [],
      gateNote: "Charter form before G1",
    },
    {
      n: 2,
      emoji: "🤖",
      name: "Autonomous Agent Triage (Tier & Speed)",
      oneLiner: "OpellaGPT Charter Agent Automated Triage",
      bullets: [
        "Scans the AI Registry for duplicate solutions",
        "Checks budget and scope against Big Bet boundaries",
        "Evaluates the ORAI risk tier",
        "Assigns the tier: T1, T2, T3 or Self-Serve",
      ],
      noAction: true,
      gates: [{ id: "G1", label: "Need validated", type: "agent" }],
    },
    {
      n: 3,
      emoji: "📊",
      name: `Fill Relevant Business Case (${tier})`,
      oneLiner: "The business case depends on the tier",
      bullets: [
        "T1: Full Business Case",
        "T2: Light Business Case (1–2 pages)",
        "T3: One-Page Canvas",
        "Self-Serve: Registry Line",
      ],
      gates: [
        { id: "G2", label: "Feasible", type: "human" },
        { id: "G3", label: "Priority", type: "human" },
      ],
    },
    {
      n: 4,
      emoji: "🤝",
      name: "Mode Selection (Do it for me / With me / Enable me)",
      oneLiner: "Who delivers the use case",
      bullets: [
        "Mode 1 · Do it for me: “We ride for you”",
        "Mode 2 · Do it with me: “We ride together”",
        "Mode 3 · Enable me: “We give you the right bike and the map”",
      ],
      gates: [{ id: "G4", label: "Mode", type: "human" }],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-opella-forest">
          Intake &amp; Agent Triage
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
          <MousePointerClick className="h-4 w-4 shrink-0" aria-hidden="true" />
          Click a step to see what is inside, or open the next step for your mode.
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
                  className="relative flex h-14 items-center justify-center gap-2 px-6 text-base font-black text-white transition-colors bg-[#5b7a64] group-hover:bg-opella-forest"
                  style={{ clipPath: i === 0 ? CHEVRON_FIRST : CHEVRON }}
                >
                  <span aria-hidden="true">{s.emoji}</span>
                  <span>Step {s.n}</span>
                </div>

                <div className="mt-3 flex min-h-[250px] flex-1 flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all group-hover:-translate-y-1 group-hover:border-opella-forest group-hover:shadow-lg">
                  <div className="text-sm font-black leading-snug text-gray-900">{s.name}</div>
                  <div className="mt-1 text-xs font-semibold text-opella-forest">{s.oneLiner}</div>
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
                  <div className="mt-auto flex items-center gap-1 pt-4 text-[11px] font-bold text-opella-forest opacity-60 transition-opacity group-hover:opacity-100">
                    <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" /> Open this step
                  </div>
                </div>
              </button>
            ))}

            {/* After step 4: the next step, by mode */}
            <div className="flex flex-col">
              <div
                className="relative flex h-14 items-center justify-center gap-2 px-6 text-base font-black text-opella-forest bg-emerald-100"
                style={{ clipPath: CHEVRON }}
              >
                <span aria-hidden="true">🚀</span>
                <span>GO BUILD</span>
              </div>
              <div className="mt-3 flex min-h-[250px] flex-1 flex-col rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 p-4">
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
                <div className="mt-auto pt-3 text-[11px] text-gray-600">One page per mode: who builds and the 4 build steps.</div>
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
            <span className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 rotate-45 border-2 border-dashed border-violet-500 bg-violet-50" />
              Automatic gate: reviewed by an agent
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
