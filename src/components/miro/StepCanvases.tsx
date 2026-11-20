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

export const ScaleCanvas: React.FC<StepCanvasProps> = ({ onOpenDetail }) => (
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

      <div
        onDoubleClick={() => onOpenDetail("rollout")}
        title="Double-click to see what is assessed"
        className="cursor-pointer rounded-xl ring-2 ring-sky-300 ring-offset-2 transition-shadow hover:shadow-lg"
      >
        <MiroFrame title="Roll out" subtitle="Assessed before each roll-out" className="w-[420px]">
          <div className="grid grid-cols-2 gap-4">
            <Sticky color="blue" tilt={1} title="Other geographies">
              Extend to another geography.
            </Sticky>
            <Sticky color="blue" tilt={-1} title="New market">
              Extend to a new market.
            </Sticky>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] font-semibold text-gray-400">
            <span>Double-click to see what is assessed</span>
            <button
              type="button"
              onClick={() => onOpenDetail("rollout")}
              className="rounded-full border border-gray-300 bg-white px-2 py-0.5 font-semibold text-gray-600 shadow-sm hover:border-gray-500 hover:text-gray-900"
            >
              Details
            </button>
          </div>
        </MiroFrame>
      </div>

      <FlowArrow width={40} />
      <MiroCard kicker="Next" title="V · Run" accent="#0d3824" style={{ width: 150 }}>
        A problem arises? Assessed and reviewed at G6.
      </MiroCard>
    </div>
  </div>
);
