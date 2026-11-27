"use client";

import React, { useEffect, useState } from "react";
import { Bot, ClipboardCheck, FileText, Lightbulb, Users, X, AlertTriangle } from "lucide-react";
import {
  DETAILS,
  DetailItem,
  EXAMPLES,
  ExampleCase,
  MODES,
  PATHS,
  businessCaseIdFor,
  gateOutcomesFor,
} from "@/lib/miroLifecycle";
import { cx } from "./MiroPrimitives";

interface DetailPanelProps {
  detailId: string | null;
  example: ExampleCase;
  onClose: () => void;
  onSelectExample: (id: string) => void;
}

const DetailBody: React.FC<{ item: DetailItem }> = ({ item }) => (
  <div className="space-y-4">
    {item.intro && <p className="text-sm leading-relaxed text-gray-700">{item.intro}</p>}

    {item.sections.map((s) => (
      <div key={s.label}>
        <div className="mb-1.5 text-[11px] font-black uppercase tracking-wider text-gray-500">{s.label}</div>
        <ul className="space-y-1">
          {s.items.map((it) => (
            <li key={it} className="flex gap-2 text-sm leading-snug text-gray-800">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}

    {item.meta && (
      <div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs">
        {item.meta.map((m) => (
          <React.Fragment key={m.label}>
            <div className="font-bold text-gray-500">{m.label}</div>
            <div className="text-gray-800">{m.value}</div>
          </React.Fragment>
        ))}
      </div>
    )}

    {item.note && (
      <div className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{item.note}</span>
      </div>
    )}
  </div>
);

export const DetailPanel: React.FC<DetailPanelProps> = ({ detailId, example, onClose, onSelectExample }) => {
  const [tab, setTab] = useState<"gate" | "bc">("gate");
  useEffect(() => setTab("gate"), [detailId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!detailId) return null;
  const gate = DETAILS[detailId];
  if (!gate) return null;

  const bc = gate.businessCaseOf ? DETAILS[businessCaseIdFor(gate.businessCaseOf)] : undefined;
  const shown = tab === "bc" && bc ? bc : gate;
  const path = gate.path ? PATHS[gate.path] : undefined;

  const exampleMatches = !gate.path || gate.path === example.path;
  const exampleNote = shown.exampleKey ? example.notes[shown.exampleKey] : undefined;
  const matchingExamples = gate.path ? EXAMPLES.filter((e) => e.path === gate.path) : [];

  const Icon = gate.kind === "doc" ? FileText : gate.kind === "activity" ? ClipboardCheck : gate.gateType === "agent" ? Bot : Users;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div
          className="border-b border-gray-200 px-5 pb-4 pt-5"
          style={{ borderTop: `4px solid ${path ? path.color : gate.kind === "activity" ? "#0284c7" : gate.gateType === "agent" ? "#7c3aed" : "#db2777"}` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={cx(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  gate.kind === "doc"
                    ? "bg-gray-100 text-gray-700"
                    : gate.kind === "activity"
                    ? "bg-sky-100 text-sky-700"
                    : gate.gateType === "agent"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-pink-100 text-pink-700"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[10px] font-black text-white">
                    {gate.badge}
                  </span>
                  {gate.kind === "gate" && (
                    <span
                      className={cx(
                        "rounded px-1.5 py-0.5 text-[10px] font-black",
                        gate.gateType === "agent" ? "bg-violet-600 text-white" : "bg-pink-600 text-white"
                      )}
                    >
                      {gate.gateType === "agent" ? "AGENT GATE" : "HUMAN GATE"}
                    </span>
                  )}
                  {path && (
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-black text-white"
                      style={{ background: path.color }}
                    >
                      {path.label} · {path.name}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-lg font-black leading-tight text-gray-900">{gate.title}</h3>
                <p className="text-xs text-gray-500">{gate.subtitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-800">
              <X className="h-5 w-5" />
            </button>
          </div>

          {bc && (
            <div className="mt-4 inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs font-bold">
              <button
                onClick={() => setTab("gate")}
                className={cx("rounded-md px-3 py-1", tab === "gate" ? "bg-white shadow-sm" : "text-gray-500")}
              >
                Gate details
              </button>
              <button
                onClick={() => setTab("bc")}
                className={cx("rounded-md px-3 py-1", tab === "bc" ? "bg-white shadow-sm" : "text-gray-500")}
              >
                {bc.title.split(" · ")[0]}
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {tab === "bc" && bc && <p className="text-xs font-semibold text-gray-500">{bc.subtitle}</p>}
          <DetailBody item={shown} />

          {tab === "gate" && gateOutcomesFor(gate.id) && (
            <div>
              <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-gray-500">Possible outcomes, with an example each</div>
              <div className="space-y-2">
                {gateOutcomesFor(gate.id)!.map((o) => (
                  <div key={o.category} className="rounded-lg border-[1.5px] bg-white p-3" style={{ borderColor: o.color }}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded px-1.5 py-0.5 text-xs font-black text-white" style={{ background: o.color }}>
                        {o.category}
                      </span>
                      <span className="text-xs text-gray-600">{o.rule}</span>
                    </div>
                    <div className="mt-2 rounded-md border border-amber-200 bg-[#fffbea] px-2.5 py-1.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">{o.exampleLabel}</div>
                      <div className="text-xs font-bold text-gray-900">{o.example}</div>
                      <div className="text-xs leading-snug text-gray-700">{o.why}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Example (an activity without an example note has none to show) */}
          {!(gate.kind === "activity" && !shown.exampleKey) && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-[#fffbea] p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-800">
              <Lightbulb className="h-3.5 w-3.5" /> Example
            </div>
            {exampleMatches && exampleNote ? (
              <>
                <div className="text-xs font-bold text-gray-900">
                  {example.title}{" "}
                  <span className="font-semibold text-gray-500">
                    · {PATHS[example.path].label} · {MODES[example.mode].label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-800">{exampleNote}</p>
              </>
            ) : (
              <div className="text-xs text-gray-700">
                {exampleMatches
                  ? "No example note for this step."
                  : `The selected example (${example.short}) follows the ${PATHS[example.path].label} path. Switch to:`}
                {!exampleMatches && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {matchingExamples.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => onSelectExample(e.id)}
                        className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[11px] font-semibold hover:border-gray-600"
                      >
                        {e.short} · {MODES[e.mode].label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-5 py-2 text-[10px] text-gray-400">
          Source: Operating model & adoption deck · {shown.source}
        </div>
      </aside>
    </div>
  );
};
