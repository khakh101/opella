"use client";

import React from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import { ExampleCase, MODES, PATHS, PATH_ORDER, PathId } from "@/lib/miroLifecycle";
import { GateDiamond, MiroCard, Sticky, cx } from "./MiroPrimitives";

interface FramingCanvasProps {
  example: ExampleCase;
  onOpenDetail: (id: string) => void;
  onGoToBuild: () => void;
  focusPath?: PathId; // set when arriving from Pre-scale: this lane is the one shown as active
}

// Fixed Miro-like canvas: absolute positions + one SVG layer for connectors.
const W = 1560;
const H = 840;
const LANE_Y: Record<PathId, number> = { T1: 115, T2: 330, T3: 545, SS: 755 };
const G1_X = 490;
const G1_Y = 435;
const BC_X = 625;
const BC_W = 190;
const BOARD_X = 865;
const BOARD_W = 440;
const BUILD_X = 1345;
const BUILD_W = 190;

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
};

export const FramingCanvas: React.FC<FramingCanvasProps> = ({ example, onOpenDetail, onGoToBuild, focusPath }) => {
  const active = focusPath ?? example.path;
  const showExample = !focusPath;
  const exColor = PATHS[active].color;
  const lineColor = (p: PathId) => (p === active ? PATHS[p].color : "#9ca3af");
  const lineWidth = (p: PathId) => (p === active ? 3 : 2);
  const markerFor = (p: PathId) => (p === active ? `url(#arrow-${p})` : "url(#arrow-grey)");

  return (
    <div className="relative" style={{ width: W, height: H }}>
      {/* ----------------------------------------------------------- */}
      {/* Lane bands */}
      {/* ----------------------------------------------------------- */}
      {PATH_ORDER.map((p) => {
        const half = p === "SS" ? 66 : 100;
        const def = PATHS[p];
        return (
          <div
            key={p}
            className={cx(
              "absolute rounded-xl border border-dashed transition-opacity",
              def.soft,
              "opacity-100"
            )}
            style={{
              left: 590,
              top: LANE_Y[p] - half,
              width: W - 600,
              height: half * 2,
              borderColor: p === active ? def.color : "#d1d5db",
            }}
          >
            <div className="absolute left-3 top-2 flex items-center gap-2">
              <span className="rounded px-1.5 py-0.5 text-[10px] font-black text-white" style={{ background: def.color }}>
                {def.label}
              </span>
              <span className={cx("text-[11px] font-black", def.text)}>{def.name}</span>
              <span className="text-[10px] text-gray-500">{def.entryRule}</span>
            </div>
            {p === active && showExample && (
              <div className="absolute right-3 top-2 flex items-center gap-1 rounded-full border border-amber-300 bg-[#fff59d] px-2 py-0.5 text-[10px] font-bold text-amber-950 shadow-sm">
                <Lightbulb className="h-3 w-3" /> Example: {example.short} · {MODES[example.mode].label}
              </div>
            )}
          </div>
        );
      })}

      {/* ----------------------------------------------------------- */}
      {/* Connectors */}
      {/* ----------------------------------------------------------- */}
      <svg className="pointer-events-none absolute inset-0" width={W} height={H}>
        <defs>
          {[...PATH_ORDER.map((p) => ({ id: p, c: PATHS[p].color })), { id: "grey", c: "#9ca3af" }].map((m) => (
            <marker
              key={m.id}
              id={`arrow-${m.id}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} />
            </marker>
          ))}
        </defs>

        {/* Common trunk */}
        <path d={`M 172 ${G1_Y} L 198 ${G1_Y}`} stroke={exColor} strokeWidth={3} markerEnd={`url(#arrow-${active})`} fill="none" />
        <path d={`M 402 ${G1_Y} L 440 ${G1_Y}`} stroke={exColor} strokeWidth={3} markerEnd={`url(#arrow-${active})`} fill="none" />

        {/* G1 branches */}
        {PATH_ORDER.map((p) => (
          <path
            key={`b-${p}`}
            d={curve(G1_X + 48, G1_Y, BC_X - 4, LANE_Y[p])}
            stroke={lineColor(p)}
            strokeWidth={lineWidth(p)}
            fill="none"
            markerEnd={markerFor(p)}
          />
        ))}

        {/* Lane segments */}
        {(["T1", "T2", "T3"] as PathId[]).map((p) => (
          <g key={`l-${p}`}>
            <path
              d={`M ${BC_X + BC_W} ${LANE_Y[p]} L ${BOARD_X - 4} ${LANE_Y[p]}`}
              stroke={lineColor(p)}
              strokeWidth={lineWidth(p)}
              markerEnd={markerFor(p)}
            />
            <path
              d={`M ${BOARD_X + BOARD_W} ${LANE_Y[p]} L ${BUILD_X - 4} ${LANE_Y[p]}`}
              stroke={lineColor(p)}
              strokeWidth={lineWidth(p)}
              markerEnd={markerFor(p)}
            />
          </g>
        ))}

        {/* Self-service skip */}
        <path
          d={`M ${BC_X + BC_W} ${LANE_Y.SS} L ${BUILD_X - 4} ${LANE_Y.SS}`}
          stroke={lineColor("SS")}
          strokeWidth={lineWidth("SS")}
          strokeDasharray="8 6"
          markerEnd={markerFor("SS")}
        />
      </svg>

      {/* Route labels on the G1 branches */}
      {PATH_ORDER.map((p) => (
        <div
          key={`rl-${p}`}
          className="absolute whitespace-nowrap rounded bg-white px-1 text-[10px] font-bold shadow-sm"
          style={{
            left: 548,
            top: LANE_Y[p] + (LANE_Y[p] < G1_Y ? 6 : -22),
            color: p === active ? PATHS[p].color : "#6b7280",
          }}
        >
          {PATHS[p].routeLabel}
        </div>
      ))}

      {/* Self-service skip label */}
      <div
        className="absolute rounded-full border border-violet-300 bg-white px-2 py-0.5 text-[11px] font-bold text-violet-800 shadow-sm"
        style={{ left: (BC_X + BC_W + BUILD_X) / 2 - 70, top: LANE_Y.SS - 12 }}
      >
        Skips G2 to G4
      </div>

      {/* ----------------------------------------------------------- */}
      {/* Common part: idea, charter, G1 */}
      {/* ----------------------------------------------------------- */}
      <Sticky color="yellow" title="Business idea" tilt={-2} className="absolute" style={{ left: 10, top: G1_Y - 70, width: 160, height: 140 }}>
        <p>Anyone in a function has a need that AI could solve.</p>
        <p className="mt-2 text-[10px] font-semibold opacity-70">V0 · business need</p>
      </Sticky>

      <MiroCard
        kicker="Preliminary project charter"
        title="Charter form"
        onOpen={() => onOpenDetail("ppc")}
        className="absolute"
        style={{ left: 200, top: G1_Y - 82, width: 200 }}
        accent="#4338ca"
      >
        Need, users, value, tools, 3 routing questions and a risk self-assessment.
        <div className="mt-2 inline-flex items-center gap-1 rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-800">
          Pre-filled by the charter agent
        </div>
      </MiroCard>

      <div className="absolute flex flex-col items-center" style={{ left: G1_X - 65, top: G1_Y - 69, width: 130 }}>
        <GateDiamond
          id="G1"
          type="agent"
          size={64}
          label="Need validation"
          caption="Charter agent + OR.AI screening agent"
          onOpen={() => onOpenDetail("g1")}
        />
      </div>

      {/* ----------------------------------------------------------- */}
      {/* T1, T2, T3 lanes */}
      {/* ----------------------------------------------------------- */}
      {(["T1", "T2", "T3"] as PathId[]).map((p) => {
        const def = PATHS[p];
        const dim = p !== active;
        return (
          <React.Fragment key={p}>
            <MiroCard
              kicker="Business case"
              title={def.businessCaseName}
              onOpen={() => onOpenDetail(`bc-${p}`)}
              className="absolute"
              style={{ left: BC_X, top: LANE_Y[p] - 52, width: BC_W }}
              accent={def.color}
              highlight={!dim}
              dimmed={dim}
            >
              {p === "T1" && "Butterfly depth, built through iterations"}
              {p === "T2" && "1–2 pages, with pilot results"}
              {p === "T3" && "1 page: hypothesis, 3 KPIs, sprint"}
            </MiroCard>

            {/* Portfolio board frame: only the gates are visible */}
            <div
              className={cx(
                "absolute rounded-xl border-2 bg-white/95 shadow-md transition-opacity",
                dim && "opacity-60"
              )}
              style={{ left: BOARD_X, top: LANE_Y[p] - 70, width: BOARD_W, height: 150, borderColor: def.color }}
            >
              <div
                className="flex items-center justify-between rounded-t-[10px] px-3 py-1 text-[11px] font-black text-white"
                style={{ background: def.color }}
              >
                <span>{def.forum}</span>
                <span className="text-[10px] font-semibold opacity-80">Double-click a gate</span>
              </div>
              <div className="flex items-start justify-around px-2 pt-1">
                <GateDiamond id="G2" type="human" size={40} label="Approval" onOpen={() => onOpenDetail(`g2-${p}`)} />
                <ArrowRight className="mt-11 h-4 w-4 shrink-0 text-gray-400" />
                <GateDiamond id="G3" type="human" size={40} label="Prioritisation" onOpen={() => onOpenDetail(`g3-${p}`)} />
                <ArrowRight className="mt-11 h-4 w-4 shrink-0 text-gray-400" />
                <GateDiamond id="G4" type="human" size={40} label={def.g4Label} onOpen={() => onOpenDetail(`g4-${p}`)} />
              </div>
            </div>

            <MiroCard
              kicker="GO BUILD"
              title="Build · mode from G4"
              onOpen={onGoToBuild}
              className="absolute"
              style={{ left: BUILD_X, top: LANE_Y[p] - 46, width: BUILD_W }}
              accent={def.color}
              highlight={!dim}
              dimmed={dim}
            >
              {p === active && showExample ? `Example: ${MODES[example.mode].label}` : "Any build mode"}
            </MiroCard>
          </React.Fragment>
        );
      })}

      {/* ----------------------------------------------------------- */}
      {/* Self-service lane */}
      {/* ----------------------------------------------------------- */}
      <div className={cx("absolute", active !== "SS" && "opacity-60")} style={{ left: BC_X, top: LANE_Y.SS - 34, width: BC_W }}>
        <Sticky color="violet" title="Agent check" onOpen={() => onOpenDetail("ss-check")}>
          Value below €50k, approved tools and data.
          <div className="mt-1 text-[10px] font-semibold opacity-70">Double-click to open</div>
        </Sticky>
      </div>

      <MiroCard
        kicker="Register and go"
        title="Self-service AI"
        onOpen={() => onOpenDetail("ss-register")}
        className="absolute"
        style={{ left: BUILD_X, top: LANE_Y.SS - 52, width: BUILD_W }}
        accent={PATHS.SS.color}
        highlight={active === "SS"}
        dimmed={active !== "SS"}
      >
        One registry line, guardrails, function budget
      </MiroCard>
    </div>
  );
};

export const FRAMING_SIZE = { W, H };
