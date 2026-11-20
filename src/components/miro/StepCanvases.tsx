"use client";

import React from "react";
import { Bot, Lightbulb } from "lucide-react";
import { ExampleCase, ExampleNoteKey, MODES, PATHS, PATH_ORDER } from "@/lib/miroLifecycle";
import { FlowArrow, GateDiamond, MiroCard, MiroFrame, Sticky } from "./MiroPrimitives";

interface StepCanvasProps {
  example: ExampleCase;
  onOpenDetail: (id: string) => void;
}

const ExampleSticky: React.FC<{ example: ExampleCase; noteKey: ExampleNoteKey; width?: number }> = ({
  example,
  noteKey,
  width = 260,
}) => {
  const note = example.notes[noteKey];
  if (!note) return null;
  return (
    <Sticky color="yellow" tilt={1.5} style={{ width }}>
      <div className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
        <Lightbulb className="h-3 w-3" /> Example
      </div>
      <div className="text-[11px] font-bold">
        {example.short} · {PATHS[example.path].label} · {MODES[example.mode].label}
      </div>
      <p className="mt-1">{note}</p>
    </Sticky>
  );
};

const AgentChip: React.FC<{ name: string; does: string }> = ({ name, does }) => (
  <div className="flex items-start gap-2 rounded-lg border border-violet-300 bg-violet-50 p-2 text-[11px] text-violet-950">
    <Bot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-700" />
    <div>
      <div className="font-bold">{name}</div>
      <div className="text-violet-800">{does}</div>
    </div>
  </div>
);

// ---------------------------------------------------------------------
// IV · Scale: one line, the same path for all tiers
// ---------------------------------------------------------------------

export const ScaleCanvas: React.FC<StepCanvasProps> = () => (
  <div style={{ width: 1400 }}>
    {/* One path for every tier */}
    <div className="mb-6 flex items-center justify-center gap-3 text-xs font-bold text-gray-700">
      <span className="font-black">Same path for all tiers</span>
      {PATH_ORDER.map((p) => (
        <span key={p} className="rounded px-2 py-1 text-[11px] font-black text-white" style={{ background: PATHS[p].color }}>
          {PATHS[p].label}
        </span>
      ))}
      <span className="font-normal text-gray-500">T3 and self-service arrive as T2</span>
    </div>

    <div className="flex items-center justify-center gap-4">
      <div className="rounded-lg bg-pink-600 px-3 py-2 text-center text-xs font-black text-white shadow-md">G5 passed</div>
      <FlowArrow width={40} />

      <MiroFrame title="Deploy" className="w-[420px]">
        <div className="grid grid-cols-2 gap-4">
          <Sticky color="orange" tilt={-1} title="Train the users">
            The target users are trained before they start.
          </Sticky>
          <Sticky color="green" tilt={1} title="Deploy in production">
            The elements go live in production.
          </Sticky>
        </div>
      </MiroFrame>

      <FlowArrow width={40} />

      <MiroFrame title="Roll out" className="w-[420px]">
        <div className="grid grid-cols-2 gap-4">
          <Sticky color="blue" tilt={1} title="Other geographies">
            Extend to another geography.
          </Sticky>
          <Sticky color="blue" tilt={-1} title="New market">
            Extend to a new market.
          </Sticky>
        </div>
      </MiroFrame>

      <FlowArrow width={40} />
      <MiroCard kicker="Next" title="V · Run" accent="#0d3824" style={{ width: 150 }}>
        Value tracked quarterly at G6.
      </MiroCard>
    </div>
  </div>
);

// ---------------------------------------------------------------------
// V · Run
// ---------------------------------------------------------------------

export const RunCanvas: React.FC<StepCanvasProps> = ({ example, onOpenDetail }) => (
  <div className="flex items-center justify-center gap-4" style={{ width: 1400 }}>
    <MiroFrame title="Track, every quarter" className="w-[520px]">
      <div className="grid grid-cols-2 gap-4">
        <Sticky color="green" tilt={-1} title="Value">
          Realised value and financial ROI vs baseline.
        </Sticky>
        <Sticky color="orange" tilt={1} title="Adoption">
          Active usage against role-based targets.
        </Sticky>
        <Sticky color="blue" tilt={1} title="Improve">
          Optimisation, model tuning, upgrades.
        </Sticky>
        <Sticky color="blue" tilt={-1} title="Run cost">
          Support, tokens and model drift.
        </Sticky>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <AgentChip name="Token control agent" does="Alerts, throttles or blocks over budget" />
        <AgentChip name="Performance monitoring" does="Value, cost and adoption tracking" />
      </div>
    </MiroFrame>

    <FlowArrow width={56} />

    <div className="flex flex-col items-center">
      <GateDiamond
        id="G6"
        type="human"
        size={70}
        label="Maintain validation"
        caption="Quarterly · Finance sign-off at +6 / +12 months"
        onOpen={() => onOpenDetail("g6")}
      />
    </div>

    <FlowArrow width={56} />

    <div className="flex flex-col gap-4">
      <Sticky color="green" tilt={-1} title="Continue or scale" style={{ width: 230 }}>
        Value delivered: keep running, extend to new scope.
      </Sticky>
      <Sticky color="red" tilt={1} title="Stop triggers" style={{ width: 230 }}>
        Terminate or pivot if adoption lags, run cost exceeds value or tech risks fail.
      </Sticky>
      <ExampleSticky example={example} noteKey="g6" width={260} />
    </div>
  </div>
);
