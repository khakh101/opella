"use client";

import React, { useEffect, useState } from "react";
import { Bot, CornerUpLeft, ShieldCheck, User, ZoomIn } from "lucide-react";
import {
  AgentDef,
  BUILD_MODES,
  BUILD_STEPS,
  BuildMode,
  ORIGIN,
  SELF_SERVICE_AGENTS,
  SELF_SERVICE_EXITS,
  SELF_SERVICE_EXIT_RESULT,
  SELF_SERVICE_GUARDRAILS,
} from "@/lib/miroBuild";
import { CloseButton, ModePills } from "./BuildShared";
import { cx } from "./MiroPrimitives";

interface AgentDeepDiveProps {
  onClose: () => void;
  onChange: (m: BuildMode) => void;
  onBackToFraming: () => void;
  openGuardrails?: boolean; // open straight on the zoom of the audit agent
}

const AgentCard: React.FC<{ a: AgentDef; zoomed?: boolean; onZoom?: () => void }> = ({ a, zoomed, onZoom }) => (
  <div
    className={cx("rounded-xl border-2 bg-white p-4 shadow-sm", zoomed && "ring-4 ring-indigo-200")}
    style={{ borderColor: ORIGIN.agent.color }}
  >
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: ORIGIN.agent.soft }}>
        <Bot className="h-6 w-6" style={{ color: ORIGIN.agent.color }} />
      </div>
      <div className="text-base font-black leading-tight text-gray-900">{a.name}</div>
    </div>
    <p className="mt-2 text-sm leading-snug text-gray-700">{a.does}</p>
    {onZoom && (
      <button
        onClick={onZoom}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white hover:opacity-90"
        style={{ background: ORIGIN.agent.color }}
      >
        <ZoomIn className="h-3.5 w-3.5" /> {zoomed ? "Hide the guardrails" : "Zoom: the guardrails it checks"}
      </button>
    )}
  </div>
);

export const AgentDeepDive: React.FC<AgentDeepDiveProps> = ({ onClose, onChange, onBackToFraming, openGuardrails }) => {
  const [zoom, setZoom] = useState(!!openGuardrails);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const m = BUILD_MODES["self-service"];
  const audit = SELF_SERVICE_AGENTS.find((a) => a.id === "audit")!;
  const token = SELF_SERVICE_AGENTS.find((a) => a.id === "token")!;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-[900px] rounded-2xl bg-white shadow-2xl" style={{ borderTop: `6px solid ${m.color}` }}>
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-gray-400">Deep dive</div>
            <h3 className="text-xl font-black text-gray-900">Self-service AI · the user and two agents</h3>
            <p className="text-sm text-gray-500">The user builds alone; two agents watch the whole build</p>
          </div>
          <div className="flex items-start gap-3">
            <ModePills value="self-service" onChange={onChange} />
            <CloseButton onClick={onClose} />
          </div>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* The user, human */}
          <div className="rounded-xl border-2 p-4" style={{ borderColor: ORIGIN.user.color, background: ORIGIN.user.soft }}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white" style={{ borderColor: ORIGIN.user.color }}>
                <User className="h-6 w-6" style={{ color: ORIGIN.user.color }} />
              </div>
              <div>
                <div className="text-sm font-black text-gray-900">The user, any employee (human)</div>
                <div className="text-xs text-gray-700">Does the 4 steps alone, with an approved tool</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {BUILD_STEPS.map((s) => (
                <div key={s.n} className="rounded-md bg-white px-2 py-1.5 text-[11px] font-bold text-gray-800 shadow-sm">
                  {s.n} · {s.name}
                </div>
              ))}
            </div>
          </div>

          {/* The two agents */}
          <section className="rounded-xl border-2 p-4" style={{ borderColor: ORIGIN.agent.color, background: ORIGIN.agent.soft }}>
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-indigo-900">
              <ShieldCheck className="h-4 w-4" /> Agents, always on from step 1 to step 4
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AgentCard a={audit} zoomed={zoom} onZoom={() => setZoom((z) => !z)} />
              <AgentCard a={token} />
            </div>

            {zoom && (
              <div className="mt-3 rounded-xl border-2 border-dashed border-indigo-400 bg-white p-4">
                <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-indigo-700">Zoom · audit & monitoring agent</div>
                <div className="mb-2 text-sm font-bold text-gray-900">Guardrails it checks</div>
                <ul className="space-y-1.5">
                  {SELF_SERVICE_GUARDRAILS.map((g) => (
                    <li key={g} className="flex gap-2 text-sm text-gray-800">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Exit */}
          <section className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3">
            <div className="text-xs font-black text-red-900">The user can leave at any time:</div>
            <div className="flex flex-1 flex-wrap gap-2">
              {SELF_SERVICE_EXITS.map((e) => (
                <span key={e.title} className="rounded-full border border-red-200 bg-white px-3 py-1 text-[11px] font-semibold text-gray-800">
                  {e.title}
                </span>
              ))}
            </div>
            <button
              onClick={() => {
                onClose();
                onBackToFraming();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-800"
            >
              <CornerUpLeft className="h-3.5 w-3.5" /> {SELF_SERVICE_EXIT_RESULT}
            </button>
          </section>
        </div>

        <div className="border-t border-gray-200 px-6 py-2 text-[10px] text-gray-400">
          Source: Operating model & adoption deck (agent list, sandbox guardrails)
        </div>
      </div>
    </div>
  );
};
