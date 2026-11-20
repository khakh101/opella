"use client";

import React, { useState } from "react";
import { CornerUpLeft, Lightbulb } from "lucide-react";
import { BuildMode } from "@/lib/miroBuild";
import { ExampleCase, MODES, PATHS } from "@/lib/miroLifecycle";
import { RUN_QUESTIONS, RunItemId } from "@/lib/miroRun";
import { GateDiamond, MiroCard, Sticky } from "./MiroPrimitives";
import { RunStepPanel } from "./RunStepPanel";

interface RunCanvasProps {
  example: ExampleCase;
  onOpenDetail: (id: string) => void;
  onBackToFramingT2: () => void;
}

// Fixed Miro-like canvas: absolute positions + one SVG layer for connectors.
const W = 1400;
const H = 700;
const T2 = PATHS.T2.color;
const GREY = "#6b7280";
const GREEN = "#059669";
const RED = "#dc2626";

// Step 2 frame and its two rows (question, assessment, G6, outcomes)
const FRAME = { x: 260, y: 0, w: 880, h: 520 };
const ROW_A = 125; // centre y of row 2.1
const ROW_B = 355; // centre y of row 2.2
const X_Q = 284;
const X_ASSESS = 520;
const X_G6 = 765;
const X_OUT = 915;
const STEP1 = { x: 0, y: 190, w: 190, h: 150 };
const STEP3 = { x: 1190, y: 190, w: 210, h: 150 };

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
};

const MARKERS = [
  { id: "grey", c: GREY },
  { id: "green", c: GREEN },
  { id: "red", c: RED },
];

const Label: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string; w?: number }> = ({ x, y, children, color = GREY, w }) => (
  <div className="absolute text-[10px] font-bold leading-tight" style={{ left: x, top: y, width: w, color }}>
    {children}
  </div>
);

const QuestionCard: React.FC<{ n: string; text: string; y: number }> = ({ n, text, y }) => (
  <div
    className="absolute rounded-xl border-2 border-amber-300 bg-amber-50 p-3 shadow-md"
    style={{ left: X_Q, top: y - 45, width: 180, height: 90 }}
  >
    <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">Question {n}</div>
    <div className="mt-0.5 text-[14px] font-black leading-tight text-gray-900">{text}</div>
  </div>
);

const Outcome: React.FC<{ kind: "solve" | "remove"; text: string; y: number }> = ({ kind, text, y }) => (
  <div
    className="absolute flex items-center rounded-lg border-2 px-3 text-[12px] font-bold leading-tight shadow-sm"
    style={{
      left: X_OUT,
      top: y,
      width: 200,
      height: 52,
      background: kind === "solve" ? "#ecfdf5" : "#fef2f2",
      borderColor: kind === "solve" ? "#34d399" : "#fca5a5",
      color: kind === "solve" ? "#064e3b" : "#7f1d1d",
    }}
  >
    {text}
  </div>
);

export const RunCanvas: React.FC<RunCanvasProps> = ({ example, onOpenDetail, onBackToFramingT2 }) => {
  const [panel, setPanel] = useState<{ item: RunItemId; mode: BuildMode } | null>(null);
  const open = (item: RunItemId) => setPanel({ item, mode: example.mode });
  const g6Note = example.notes.g6;

  const rows = [
    { y: ROW_A, key: "pipeline" as const, n: "2.1", item: "pipeline" as RunItemId, assess: "Assessment 2.1", title: "Broken pipeline", text: "Quick fix, or a value × complexity assessment if many resources are required." },
    { y: ROW_B, key: "feature" as const, n: "2.2", item: "feature" as RunItemId, assess: "Assessment 2.2", title: "New feature", text: "Quick feature, prioritised and developed, or back to the T2 framing." },
  ];

  return (
    <div style={{ width: W }}>
      {/* Intro */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="text-sm text-gray-800">
          <span className="font-black">One flow, whatever the build mode.</span> The mode changes who does each part: double-click a card to compare the four modes.
        </div>
        <span className="flex items-center gap-1 rounded-full border border-amber-300 bg-[#fff59d] px-2.5 py-1 text-[11px] font-bold text-amber-950 shadow-sm">
          <Lightbulb className="h-3 w-3" /> Example: {example.short} · {MODES[example.mode].label}
        </span>
      </div>

      <div className="relative" style={{ width: W, height: H }}>
        {/* Step 2 frame, in a board frame like the gates of Framing */}
        <div className="absolute rounded-xl border-2 border-gray-700 bg-white/90 shadow-md" style={{ left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h }}>
          <div className="flex items-center justify-between rounded-t-[10px] bg-gray-700 px-3 py-1.5 text-[11px] font-black text-white">
            <span>Step 2 · A problem arises</span>
            <span className="text-[10px] font-semibold opacity-80">Reviewed at the portfolio board · G6</span>
          </div>
          <div className="absolute text-[10px] font-semibold text-gray-500" style={{ left: X_Q - FRAME.x, top: 44 }}>
            Two questions, asked in this order
          </div>
        </div>

        {/* Connectors */}
        <svg className="pointer-events-none absolute inset-0" width={W} height={H}>
          <defs>
            {MARKERS.map((m) => (
              <marker key={m.id} id={`run-${m.id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} />
              </marker>
            ))}
          </defs>

          {/* Step 1 to question 2.1 */}
          <path d={curve(STEP1.x + STEP1.w, STEP1.y + 60, X_Q - 4, ROW_A)} stroke={GREY} strokeWidth={3} fill="none" markerEnd="url(#run-grey)" />
          {/* Question 2.1, "no", question 2.2 */}
          <path d={`M ${X_Q + 90} ${ROW_A + 47} L ${X_Q + 90} ${ROW_B - 49}`} stroke={GREY} strokeWidth={3} fill="none" markerEnd="url(#run-grey)" />

          {rows.map((r) => (
            <g key={r.key}>
              {/* question to assessment to G6 */}
              <path d={`M ${X_Q + 180} ${r.y} L ${X_ASSESS - 4} ${r.y}`} stroke={GREY} strokeWidth={3} markerEnd="url(#run-grey)" />
              <path d={`M ${X_ASSESS + 210} ${r.y} L ${X_G6 + 6} ${r.y}`} stroke={GREY} strokeWidth={3} markerEnd="url(#run-grey)" />
              {/* G6 to the two outcomes */}
              <path d={curve(X_G6 + 90, r.y, X_OUT - 4, r.y - 29)} stroke={GREEN} strokeWidth={3} fill="none" markerEnd="url(#run-green)" />
              <path d={curve(X_G6 + 90, r.y, X_OUT - 4, r.y + 33)} stroke={RED} strokeWidth={3} fill="none" markerEnd="url(#run-red)" />
              {/* solved goes to step 3 */}
              <path d={curve(X_OUT + 200, r.y - 29, STEP3.x - 4, r.y === ROW_A ? STEP3.y + 55 : STEP3.y + 95)} stroke={GREEN} strokeWidth={3} fill="none" markerEnd="url(#run-green)" />
            </g>
          ))}

          {/* Back to running */}
          <path
            d={`M ${STEP3.x + STEP3.w / 2} ${STEP3.y + STEP3.h + 2} V 540 Q ${STEP3.x + STEP3.w / 2} 560 ${STEP3.x + STEP3.w / 2 - 20} 560 H ${STEP1.x + STEP1.w / 2 + 20} Q ${STEP1.x + STEP1.w / 2} 560 ${STEP1.x + STEP1.w / 2} 540 V ${STEP1.y + STEP1.h + 6}`}
            stroke={GREY}
            strokeWidth={2.5}
            strokeDasharray="7 5"
            fill="none"
            markerEnd="url(#run-grey)"
          />
        </svg>

        <Label x={STEP1.x + STEP1.w + 6} y={STEP1.y + 72} w={60}>A problem arises</Label>
        <Label x={X_Q + 98} y={(ROW_A + ROW_B) / 2 - 4}>No</Label>
        <Label x={X_Q + 184} y={ROW_A - 18}>Yes</Label>
        <Label x={X_Q + 184} y={ROW_B - 18}>Yes</Label>
        <Label x={1146} y={STEP3.y + 68} color={GREEN} w={44}>Solved</Label>
        <div
          className="absolute rounded-full border border-gray-300 bg-white px-3 py-1 text-[11px] font-bold text-gray-600 shadow-sm"
          style={{ left: 480, top: 548 }}
        >
          Back to step 1: the app runs again
        </div>

        {/* Step 1 */}
        <MiroCard
          kicker="Step 1"
          title="Running well"
          accent="#5b7a64"
          onOpen={() => open("run")}
          className="absolute"
          style={{ left: STEP1.x, top: STEP1.y, width: STEP1.w, minHeight: STEP1.h }}
        >
          The app is running and everything is going well.
        </MiroCard>

        {/* Step 2 rows */}
        {rows.map((r) => (
          <React.Fragment key={r.key}>
            <QuestionCard n={r.n} text={RUN_QUESTIONS[r.key].question} y={r.y} />
            <MiroCard
              kicker={r.assess}
              title={r.title}
              accent="#d97706"
              onOpen={() => open(r.item)}
              className="absolute"
              style={{ left: X_ASSESS, top: r.y - 60, width: 210, minHeight: 120 }}
            >
              {r.text}
            </MiroCard>
            <div className="absolute" style={{ left: X_G6, top: r.y - 55 }}>
              <GateDiamond id="G6" type="human" size={46} label="Maintain validation" caption="Portfolio board" onOpen={() => onOpenDetail("g6")} />
            </div>
            <Outcome kind="solve" text={RUN_QUESTIONS[r.key].solve} y={r.y - 55} />
            <Outcome kind="remove" text={RUN_QUESTIONS[r.key].remove} y={r.y + 7} />
          </React.Fragment>
        ))}

        {/* Larger feature: back to the T2 framing */}
        <button
          type="button"
          onClick={onBackToFramingT2}
          title="Click to go back to the T2 assessment in Framing"
          className="absolute flex items-center gap-2 rounded-xl px-3 text-left text-white shadow-lg transition-transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-sky-200"
          style={{ left: X_ASSESS, top: ROW_B + 80, width: 210, height: 46, background: T2 }}
        >
          <CornerUpLeft className="h-5 w-5 shrink-0" />
          <span className="text-[11px] font-black leading-tight">Larger feature: back to T2 framing</span>
        </button>

        {/* Step 3 */}
        <MiroCard
          kicker="Step 3"
          title="Ensure a good adoption"
          accent="#5b7a64"
          onOpen={() => open("adoption")}
          className="absolute"
          style={{ left: STEP3.x, top: STEP3.y, width: STEP3.w, minHeight: STEP3.h }}
        >
          People keep using it. Double-click to see how the adoption is ensured.
        </MiroCard>

        {/* Example and reading hint */}
        {g6Note && (
          <div className="absolute" style={{ left: FRAME.x, top: 610, width: 440 }}>
            <Sticky color="yellow" tilt={-1}>
              <div className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
                <Lightbulb className="h-3 w-3" /> Example
              </div>
              <div className="text-[11px] font-bold">
                {example.short} · {PATHS[example.path].label} · {MODES[example.mode].label}
              </div>
              <p className="mt-1">{g6Note}</p>
            </Sticky>
          </div>
        )}
        <div className="absolute text-[11px] leading-snug text-gray-500" style={{ left: FRAME.x + 470, top: 618, width: 400 }}>
          G6 appears after each assessment: it is the same gate, held at the portfolio board. Double-click it, or an assessment, for the details.
        </div>
      </div>

      {panel && (
        <RunStepPanel
          item={panel.item}
          mode={panel.mode}
          onClose={() => setPanel(null)}
          onChange={(item, mode) => setPanel({ item, mode })}
          onBackToFraming={() => {
            setPanel(null);
            onBackToFramingT2();
          }}
          onOpenG6={() => onOpenDetail("g6")}
        />
      )}
    </div>
  );
};
