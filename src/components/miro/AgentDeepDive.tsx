"use client";

import React, { useEffect } from "react";
import { Bot, CornerUpLeft, ShieldCheck, User } from "lucide-react";
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
  SELF_SERVICE_LEVELS,
} from "@/lib/miroBuild";
import { CloseButton, ModePills } from "./BuildShared";
import { cx } from "./MiroPrimitives";

interface AgentDeepDiveProps {
  onClose: () => void;
  onChange: (m: BuildMode) => void;
  onBackToFraming: () => void;
}

const AgentCard: React.FC<{ a: AgentDef; highlight?: boolean }> = ({ a, highlight }) => (
  <div
    className={cx(
      "rounded-lg border bg-white p-3 shadow-sm",
      a.source === "proposed" ? "border-dashed border-indigo-300" : "border-indigo-400",
      highlight && "ring-2 ring-indigo-300"
    )}
  >
    <div className="flex items-start gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: ORIGIN.agent.soft }}>
        <Bot className="h-4 w-4" style={{ color: ORIGIN.agent.color }} />
      </div>
      <div>
        <div className="text-[12px] font-bold leading-tight text-gray-900">{a.name}</div>
        <span
          className={cx(
            "mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-black",
            a.source === "deck" ? "bg-indigo-600 text-white" : "bg-amber-100 text-amber-900"
          )}
        >
          {a.source === "deck" ? "IN THE DECK" : "PROPOSED"}
        </span>
      </div>
    </div>
    <p className="mt-2 text-[11px] leading-snug text-gray-700">{a.does}</p>
  </div>
);

export const AgentDeepDive: React.FC<AgentDeepDiveProps> = ({ onClose, onChange, onBackToFraming }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const m = BUILD_MODES["self-service"];
  const always = SELF_SERVICE_AGENTS.filter((a) => a.placement === "always");
  const after = SELF_SERVICE_AGENTS.filter((a) => a.placement === "after");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-[1080px] rounded-2xl bg-white shadow-2xl" style={{ borderTop: `6px solid ${m.color}` }}>
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-gray-400">Team deep dive</div>
            <h3 className="text-xl font-black text-gray-900">Self-service AI · the user and the agents</h3>
            <p className="text-sm text-gray-500">The user builds alone; a suite of agents helps at each step and watches in the background</p>
          </div>
          <div className="flex items-start gap-3">
            <ModePills value="self-service" onChange={onChange} />
            <CloseButton onClick={onClose} />
          </div>
        </div>

        <div className="space-y-6 px-6 py-5">
          {/* The user */}
          <div className="flex items-center gap-3 rounded-xl border-2 p-3" style={{ borderColor: ORIGIN.user.color, background: ORIGIN.user.soft }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white" style={{ borderColor: ORIGIN.user.color }}>
              <User className="h-6 w-6" style={{ color: ORIGIN.user.color }} />
            </div>
            <div>
              <div className="text-sm font-black text-gray-900">The user, any employee</div>
              <div className="text-xs text-gray-700">Owns the assistant end to end, builds it with an approved tool, and decides each step. The business owner approves the use case.</div>
            </div>
          </div>

          {/* Steps x agents */}
          <section>
            <h4 className="mb-2 text-sm font-black text-gray-900">Which agent helps at which step</h4>
            <div className="grid grid-cols-4 gap-3">
              {BUILD_STEPS.map((s) => (
                <div key={s.n} className="space-y-2">
                  <div className="rounded-md bg-gray-900 px-2 py-1.5 text-[11px] font-black text-white">
                    {s.n} · {s.name}
                  </div>
                  {SELF_SERVICE_AGENTS.filter((a) => a.placement === s.n).map((a) => (
                    <AgentCard key={a.id} a={a} />
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Always on */}
          <section className="rounded-xl border-2 border-indigo-300 bg-indigo-50/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-black text-indigo-900">
              <ShieldCheck className="h-4 w-4" /> Always on, from step 1 to the end
            </div>
            <div className="grid grid-cols-2 gap-3">
              {always.map((a) => (
                <AgentCard key={a.id} a={a} highlight />
              ))}
            </div>
            {after.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {after.map((a) => (
                  <div key={a.id}>
                    <div className="mb-1 text-[10px] font-black uppercase tracking-wider text-indigo-800">After go-live</div>
                    <AgentCard a={a} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Where + guardrails */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-2 text-sm font-black text-gray-900">Where the user builds</h4>
              <div className="space-y-2">
                {SELF_SERVICE_LEVELS.map((l) => (
                  <div key={l.level} className="rounded-lg border border-violet-200 bg-violet-50 p-3">
                    <div className="text-[10px] font-black uppercase tracking-wider text-violet-700">{l.level}</div>
                    <div className="text-sm font-bold text-gray-900">{l.name}</div>
                    <div className="text-xs text-gray-700">{l.text}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-black text-gray-900">Guardrails at every level</h4>
              <ul className="space-y-1.5 rounded-lg border border-gray-200 bg-gray-50 p-3">
                {SELF_SERVICE_GUARDRAILS.map((g) => (
                  <li key={g} className="flex gap-2 text-xs text-gray-800">
                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Exits */}
          <section className="rounded-xl border-2 border-red-300 bg-red-50 p-4">
            <div className="mb-2 text-sm font-black text-red-900">The user can leave this mode at any time</div>
            <div className="grid grid-cols-3 gap-3">
              {SELF_SERVICE_EXITS.map((e) => (
                <div key={e.title} className="rounded-lg border border-red-200 bg-white p-2.5">
                  <div className="text-xs font-bold text-gray-900">{e.title}</div>
                  <div className="text-[11px] text-gray-600">{e.text}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                onClose();
                onBackToFraming();
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-800"
            >
              <CornerUpLeft className="h-3.5 w-3.5" /> {SELF_SERVICE_EXIT_RESULT}
            </button>
          </section>
        </div>

        <div className="border-t border-gray-200 px-6 py-2 text-[10px] text-gray-400">
          Source: Operating model & adoption deck (agent list, sandbox levels, guardrails). Agents marked "proposed" are not named in the deck.
        </div>
      </div>
    </div>
  );
};
