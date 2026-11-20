"use client";

import React from "react";
import { Bot, Lightbulb } from "lucide-react";
import { ExampleCase, ExampleNoteKey, MODES, PATHS } from "@/lib/miroLifecycle";
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
// III · Pre-scale
// ---------------------------------------------------------------------

export const PreScaleCanvas: React.FC<StepCanvasProps> = ({ example, onOpenDetail }) => (
  <div className="flex items-center justify-center gap-4" style={{ width: 1400 }}>
    <MiroFrame title="Prepare the scale gate" className="w-[640px]">
      <div className="grid grid-cols-2 gap-4">
        <Sticky color="green" tilt={-1} title="Value">
          Review the value: baseline vs validated MVP results; update the business case.
        </Sticky>
        <Sticky color="blue" tilt={1} title="Tech and data readiness">
          Data, architecture, scalability; run owner and actual cost.
        </Sticky>
        <Sticky color="violet" tilt={1} title="Secondary OR.AI review">
          Risk and ethical review before real scale.
        </Sticky>
        <Sticky color="orange" tilt={-1} title="Adoption and HR">
          Adoption plan, full change impact assessment, workforce impact.
        </Sticky>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <AgentChip name="Token control agent" does="Quota and consumption vs budget" />
        <AgentChip name="Performance monitoring" does="ROI vs baseline, run spend, usage" />
      </div>
    </MiroFrame>

    <FlowArrow width={56} />

    <div className="flex flex-col items-center">
      <GateDiamond id="G5" type="human" size={70} label="Scale validation" caption="Scale committee" onOpen={() => onOpenDetail("g5")} />
    </div>

    <FlowArrow width={56} label="Go" />

    <div className="flex flex-col gap-4">
      <MiroCard kicker="Next" title="IV · Scale" accent="#0d3824" style={{ width: 200 }}>
        Roll-out to another market, geography or new features.
      </MiroCard>
      <Sticky color="red" tilt={-1} title="If no-go" style={{ width: 200 }}>
        Fix and retest, or stop.
      </Sticky>
      <ExampleSticky example={example} noteKey="g5" width={260} />
    </div>
  </div>
);

// ---------------------------------------------------------------------
// IV · Scale
// ---------------------------------------------------------------------

export const ScaleCanvas: React.FC<StepCanvasProps> = () => (
  <div className="flex items-center justify-center gap-4" style={{ width: 1400 }}>
    <div className="flex flex-col items-center">
      <div className="rounded-lg bg-pink-600 px-3 py-2 text-center text-xs font-black text-white shadow-md">
        G5 passed
      </div>
    </div>
    <FlowArrow width={40} />

    <MiroFrame title="Roll out" className="w-[480px]">
      <div className="grid grid-cols-2 gap-4">
        <Sticky color="green" tilt={-1} title="Roll out">
          To the target users and scope, market by market.
        </Sticky>
        <Sticky color="orange" tilt={1} title="Adoption plan">
          Executed with role-based targets and training.
        </Sticky>
        <Sticky color="blue" tilt={1} title="Handover">
          To the function where the mode requires it (Enable me).
        </Sticky>
        <Sticky color="green" tilt={-1} title="Run owner">
          Named run owner and SLA support in place.
        </Sticky>
      </div>
    </MiroFrame>

    <FlowArrow width={40} />

    <MiroFrame title="Enterprise discipline" className="w-[420px]">
      <div className="grid grid-cols-2 gap-4">
        <Sticky color="yellow" tilt={1} title="Tranche funding">
          Released by tranche, not upfront.
        </Sticky>
        <Sticky color="yellow" tilt={-1} title="Planisware">
          Portfolio roll-up for T1 and T2.
        </Sticky>
        <Sticky color="yellow" tilt={-1} title="Change Board">
          Market roll-out approved.
        </Sticky>
        <Sticky color="yellow" tilt={1} title="Live tracking">
          Risk, cost and adoption.
        </Sticky>
      </div>
    </MiroFrame>

    <FlowArrow width={40} />
    <div>
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
