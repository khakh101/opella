"use client";

import React from "react";
import { ArrowRight, CornerUpLeft, Lightbulb } from "lucide-react";
import { BUILD_MODES, BUILD_MODE_ORDER } from "@/lib/miroBuild";
import { ExampleCase, ExampleNoteKey, MODES, PATHS } from "@/lib/miroLifecycle";
import { GateDiamond, MiroCard, Sticky, cx } from "./MiroPrimitives";

interface PreScaleCanvasProps {
  example: ExampleCase;
  onOpenDetail: (id: string) => void;
  onBackToFramingT2: () => void;
}

// Fixed Miro-like canvas: absolute positions + one SVG layer for connectors.
const W = 1400;
const H = 800;
const T2 = PATHS.T2.color;

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
};

const ExampleNote: React.FC<{ example: ExampleCase; noteKey: ExampleNoteKey; width: number; style: React.CSSProperties }> = ({
  example,
  noteKey,
  width,
  style,
}) => {
  const note = example.notes[noteKey];
  if (!note) return null;
  return (
    <div className="absolute" style={{ ...style, width }}>
      <Sticky color="yellow" tilt={1.5}>
        <div className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
          <Lightbulb className="h-3 w-3" /> Example
        </div>
        <div className="text-[11px] font-bold">
          {example.short} · {PATHS[example.path].label} · {MODES[example.mode].label}
        </div>
        <p className="mt-1">{note}</p>
      </Sticky>
    </div>
  );
};

export const PreScaleCanvas: React.FC<PreScaleCanvasProps> = ({ example, onOpenDetail, onBackToFramingT2 }) => {
  const mergedActive = example.path === "T3" || example.path === "SS";
  const topColor = (c: string) => (mergedActive ? c : "#9ca3af");
  const bottomColor = (p: "T1" | "T2") => (!mergedActive && example.path === p ? PATHS[p].color : "#9ca3af");

  // y of the lane cards
  const Y_T3 = 120;
  const Y_SS = 225;
  const BTN = { x: 470, y: 150, w: 230, h: 90 };
  const Y_T1 = 490;
  const Y_T2 = 615;
  const BC = { x: 340, y: 445, w: 310, h: 250 };

  return (
    <div className="relative" style={{ width: W, height: H }}>
      {/* ============================================================= */}
      {/* Band A: T3 and self-service, back to Framing */}
      {/* ============================================================= */}
      <div
        className={cx("absolute rounded-xl border border-dashed bg-sky-50/70 transition-opacity", !mergedActive && "opacity-60")}
        style={{ left: 0, top: 0, width: W, height: 355, borderColor: mergedActive ? T2 : "#d1d5db" }}
      >
        <div className="absolute left-3 top-2 flex items-center gap-2">
          <span className="rounded px-1.5 py-0.5 text-[10px] font-black text-white" style={{ background: PATHS.T3.color }}>
            T3
          </span>
          <span className="rounded px-1.5 py-0.5 text-[10px] font-black text-white" style={{ background: PATHS.SS.color }}>
            Self-service
          </span>
          <span className="text-[11px] font-black text-sky-900">Merged flow: back to Framing, no G5 here</span>
        </div>
        {mergedActive && (
          <div className="absolute right-3 top-2 flex items-center gap-1 rounded-full border border-amber-300 bg-[#fff59d] px-2 py-0.5 text-[10px] font-bold text-amber-950 shadow-sm">
            <Lightbulb className="h-3 w-3" /> Example: {example.short} · {MODES[example.mode].label}
          </div>
        )}
      </div>

      {/* Any build mode */}
      <div className="absolute flex items-center gap-1.5" style={{ left: 24, top: 38 }}>
        <span className="text-[11px] font-black text-gray-700">Any build mode:</span>
        {BUILD_MODE_ORDER.map((m) => (
          <span key={m} className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: BUILD_MODES[m].color }}>
            {BUILD_MODES[m].label}
          </span>
        ))}
      </div>

      {/* ============================================================= */}
      {/* Band B: T1 and T2, detailed business case and G5 */}
      {/* ============================================================= */}
      <div
        className={cx("absolute rounded-xl border border-dashed bg-emerald-50/60 transition-opacity", mergedActive && "opacity-60")}
        style={{ left: 0, top: 380, width: W, height: 410, borderColor: !mergedActive ? PATHS[example.path].color : "#d1d5db" }}
      >
        <div className="absolute left-3 top-2 flex items-center gap-2">
          <span className="rounded px-1.5 py-0.5 text-[10px] font-black text-white" style={{ background: PATHS.T1.color }}>
            T1
          </span>
          <span className="rounded px-1.5 py-0.5 text-[10px] font-black text-white" style={{ background: PATHS.T2.color }}>
            T2
          </span>
          <span className="text-[11px] font-black text-emerald-900">Similar gate: detailed business case, then G5</span>
        </div>
        {!mergedActive && (
          <div className="absolute right-3 top-2 flex items-center gap-1 rounded-full border border-amber-300 bg-[#fff59d] px-2 py-0.5 text-[10px] font-bold text-amber-950 shadow-sm">
            <Lightbulb className="h-3 w-3" /> Example: {example.short} · {MODES[example.mode].label}
          </div>
        )}
      </div>

      {/* ============================================================= */}
      {/* Connectors */}
      {/* ============================================================= */}
      <svg className="pointer-events-none absolute inset-0" width={W} height={H}>
        <defs>
          {[
            { id: "t2", c: T2 },
            { id: "t3", c: PATHS.T3.color },
            { id: "ss", c: PATHS.SS.color },
            { id: "t1", c: PATHS.T1.color },
            { id: "grey", c: "#9ca3af" },
            { id: "dark", c: "#374151" },
          ].map((m) => (
            <marker key={m.id} id={`ps-${m.id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} />
            </marker>
          ))}
        </defs>

        {/* two lines into the button */}
        <path d={curve(270, Y_T3 + 40, BTN.x - 4, BTN.y + BTN.h / 2 - 12)} stroke={topColor(PATHS.T3.color)} strokeWidth={mergedActive ? 3 : 2} fill="none" markerEnd={`url(#ps-${mergedActive ? "t3" : "grey"})`} />
        <path d={curve(270, Y_SS + 40, BTN.x - 4, BTN.y + BTN.h / 2 + 12)} stroke={topColor(PATHS.SS.color)} strokeWidth={mergedActive ? 3 : 2} fill="none" markerEnd={`url(#ps-${mergedActive ? "ss" : "grey"})`} />
        {/* button to T2 gates, then Build as T2 */}
        <path d={`M ${BTN.x + BTN.w} ${BTN.y + BTN.h / 2} L 786 ${BTN.y + BTN.h / 2}`} stroke={topColor(T2)} strokeWidth={3} markerEnd={`url(#ps-${mergedActive ? "t2" : "grey"})`} />
        <path d={`M 1196 ${BTN.y + BTN.h / 2} L 1236 ${BTN.y + BTN.h / 2}`} stroke={topColor(T2)} strokeWidth={3} markerEnd={`url(#ps-${mergedActive ? "t2" : "grey"})`} />

        {/* T1 and T2 into the business case */}
        <path d={curve(270, Y_T1 + 40, BC.x - 4, BC.y + 90)} stroke={bottomColor("T1")} strokeWidth={!mergedActive && example.path === "T1" ? 3 : 2} fill="none" markerEnd={`url(#ps-${!mergedActive && example.path === "T1" ? "t1" : "grey"})`} />
        <path d={curve(270, Y_T2 + 40, BC.x - 4, BC.y + 160)} stroke={bottomColor("T2")} strokeWidth={!mergedActive && example.path === "T2" ? 3 : 2} fill="none" markerEnd={`url(#ps-${!mergedActive && example.path === "T2" ? "t2" : "grey"})`} />
        {/* business case to G5 board to Scale */}
        <path d={`M ${BC.x + BC.w} ${BC.y + 125} L 716 ${BC.y + 125}`} stroke="#374151" strokeWidth={3} markerEnd="url(#ps-dark)" />
        <path d={`M 1046 ${BC.y + 125} L 1110 ${BC.y + 125}`} stroke="#374151" strokeWidth={3} markerEnd="url(#ps-dark)" />
      </svg>

      {/* ----------------------------------------------------------- */}
      {/* Band A content */}
      {/* ----------------------------------------------------------- */}
      <MiroCard
        kicker="T3 · Fast lane"
        title="Validated MVP"
        accent={PATHS.T3.color}
        className="absolute"
        style={{ left: 24, top: Y_T3, width: 246 }}
        highlight={example.path === "T3"}
        dimmed={mergedActive && example.path !== "T3"}
      >
        Built in any mode, tested, owner validated.
      </MiroCard>
      <MiroCard
        kicker="Self-service"
        title="Validated assistant"
        accent={PATHS.SS.color}
        className="absolute"
        style={{ left: 24, top: Y_SS, width: 246 }}
        highlight={example.path === "SS"}
        dimmed={mergedActive && example.path !== "SS"}
      >
        Built by the user with the agents watching.
      </MiroCard>

      {/* The button */}
      <button
        type="button"
        onClick={onBackToFramingT2}
        title="Click to go back to the T2 assessment in Framing"
        className="absolute flex items-center gap-3 rounded-2xl px-4 text-left text-white shadow-lg transition-transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-sky-200"
        style={{ left: BTN.x, top: BTN.y, width: BTN.w, height: BTN.h, background: T2 }}
      >
        <CornerUpLeft className="h-6 w-6 shrink-0" />
        <span>
          <span className="block text-sm font-black leading-tight">Back to Framing</span>
          <span className="block text-xs font-semibold leading-tight">T2 assessment</span>
          <span className="mt-1 block text-[10px] opacity-80">Click to open</span>
        </span>
      </button>

      {/* T2 gates in Framing */}
      <div
        className={cx("absolute rounded-xl border-2 bg-white/95 shadow-md", !mergedActive && "opacity-60")}
        style={{ left: 790, top: Y_T3 - 25, width: 406, height: 150, borderColor: T2 }}
      >
        <div className="flex items-center justify-between rounded-t-[10px] px-3 py-1 text-[11px] font-black text-white" style={{ background: T2 }}>
          <span>All the T2 gates, in Framing</span>
          <span className="text-[10px] font-semibold opacity-80">Double-click a gate</span>
        </div>
        <div className="flex items-start justify-around px-2 pt-1">
          <GateDiamond id="G2" type="human" size={40} label="Approval" onOpen={() => onOpenDetail("g2-T2")} />
          <ArrowRight className="mt-11 h-4 w-4 shrink-0 text-gray-400" />
          <GateDiamond id="G3" type="human" size={40} label="Prioritisation" onOpen={() => onOpenDetail("g3-T2")} />
          <ArrowRight className="mt-11 h-4 w-4 shrink-0 text-gray-400" />
          <GateDiamond id="G4" type="human" size={40} label="Mode selection" onOpen={() => onOpenDetail("g4-T2")} />
        </div>
      </div>

      <MiroCard
        kicker="Then"
        title="II · Build as T2"
        accent={T2}
        className="absolute"
        style={{ left: 1240, top: Y_T3 - 5, width: 150 }}
        dimmed={!mergedActive}
      >
        Any build mode.
      </MiroCard>

      <ExampleNote example={example} noteKey="t2" width={400} style={mergedActive ? { left: 790, top: 255 } : { display: "none" }} />

      {/* ----------------------------------------------------------- */}
      {/* Band B content */}
      {/* ----------------------------------------------------------- */}
      <MiroCard
        kicker="T1 · Transform"
        title="Validated MVP"
        accent={PATHS.T1.color}
        className="absolute"
        style={{ left: 24, top: Y_T1, width: 246 }}
        highlight={!mergedActive && example.path === "T1"}
        dimmed={mergedActive || example.path !== "T1"}
      >
        Built in any mode.
      </MiroCard>
      <MiroCard
        kicker="T2 · Scale"
        title="Validated MVP"
        accent={PATHS.T2.color}
        className="absolute"
        style={{ left: 24, top: Y_T2, width: 246 }}
        highlight={!mergedActive && example.path === "T2"}
        dimmed={mergedActive || example.path !== "T2"}
      >
        Built in any mode.
      </MiroCard>

      <MiroCard
        kicker="Business case"
        title="Detailed business case"
        onOpen={() => onOpenDetail("bc-prescale")}
        accent="#374151"
        className="absolute"
        style={{ left: BC.x, top: BC.y, width: BC.w, minHeight: BC.h }}
        dimmed={mergedActive}
      >
        <ul className="mt-1 space-y-2 text-[11px] text-gray-800">
          <li>
            <span className="font-black">Complexity assessment</span>
            <div className="text-gray-600">Data readiness · infrastructure required</div>
          </li>
          <li>
            <span className="font-black">Value assessment</span>
            <div className="text-gray-600">EBITDA · cost required</div>
          </li>
          <li>
            <span className="font-black">Adoption plan</span>
          </li>
          <li>
            <span className="font-black">Governance plan</span>
          </li>
        </ul>
        <div className="mt-3 inline-flex rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-900">
          Reuses the previous assessment
        </div>
      </MiroCard>

      {/* G5, in a board frame like the gates of Framing */}
      <div
        className={cx("absolute rounded-xl border-2 bg-white/95 shadow-md", mergedActive && "opacity-60")}
        style={{ left: 720, top: BC.y + 45, width: 326, height: 170, borderColor: "#374151" }}
      >
        <div className="flex items-center justify-between rounded-t-[10px] bg-gray-700 px-3 py-1 text-[11px] font-black text-white">
          <span>Scale committee · T1: TO SteerCo</span>
          <span className="text-[10px] font-semibold opacity-80">Double-click the gate</span>
        </div>
        <div className="flex justify-center pt-2">
          <GateDiamond id="G5" type="human" size={46} label="Scale validation" caption="Product owner presents" onOpen={() => onOpenDetail("g5")} />
        </div>
      </div>

      <div className="absolute" style={{ left: 1110, top: BC.y + 55 }}>
        <MiroCard kicker="Go" title="IV · Scale" accent="#0d3824" style={{ width: 270 }} dimmed={mergedActive}>
          Roll-out to another market, geography or new features.
        </MiroCard>
      </div>
      <div className="absolute" style={{ left: 1110, top: BC.y + 170 }}>
        <Sticky color="red" tilt={-1} title="If no-go" style={{ width: 200 }}>
          Fix and retest, or stop.
        </Sticky>
      </div>
      <ExampleNote example={example} noteKey="g5" width={326} style={!mergedActive ? { left: 720, top: BC.y + 230 } : { display: "none" }} />

      <div className="absolute" style={{ left: 340, top: BC.y + BC.h + 30 }} />
    </div>
  );
};

export const PRESCALE_SIZE = { W, H };
