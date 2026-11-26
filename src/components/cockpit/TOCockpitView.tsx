"use client";

import React, { useState } from "react";
import { BACKLOG, COCKPIT_STEPS, COCKPIT_WEEK_START, PIPELINE, PipelineUseCase } from "@/lib/toCockpitData";

const HC: Record<string, string> = { g: "#15803D", a: "#D97706", r: "#B91C1C" };
const HL: Record<string, string> = { g: "On track", a: "Action needed", r: "Blocked" };
const SC: Record<string, string> = { live: "#15803D", "in progress": "#0369A1", "under study": "#55605A", parked: "#B45309" };
const statusColor = (x: string) => SC[(x || "").toLowerCase()] || "#55605A";
const empty = (x?: string) => (x && x.trim() ? x : "(empty in the inventory)");
const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (d: string) => { const p = d.split("-"); return `${p[2]} ${MONTHS[+p[1]]}`; };
const stepName = (id: string) => COCKPIT_STEPS.find((s) => s.id === id)?.name ?? id;

type Filter = { type: "kpi" | "step" | "gate"; key: string };

const KPIS: { key: string; label: string; sub: string; test: (u: PipelineUseCase) => boolean }[] = [
  { key: "new", label: "New this week", sub: "Charters received since Monday", test: (u) => u.entered >= COCKPIT_WEEK_START },
  { key: "framing", label: "In framing", sub: "Between G1 and G4", test: (u) => u.step === "framing" },
  { key: "build", label: "In build", sub: "MVP in progress", test: (u) => u.step === "build" },
  { key: "waiting", label: "Waiting for a gate", sub: "G1 to G5 decision pending", test: (u) => !!u.gate && u.gate !== "G6" },
  { key: "blocked", label: "Blocked", sub: "Need a decision or a resource", test: (u) => u.h === "r" },
  { key: "live", label: "Live", sub: "Scaling or in run", test: (u) => u.step === "scale" || u.step === "run" },
];

const Fact: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="rounded-[10px] bg-[#F4F3EE] px-3 py-2.5">
    <p className="mb-0.5 text-[11px] font-bold uppercase tracking-[.08em] text-[#55605A]">{k}</p>
    <p className="text-sm leading-snug">{v}</p>
  </div>
);
const DoneList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="flex flex-col gap-1.5 text-sm leading-snug">{items.map((t) => <li key={t} className="flex gap-2"><span className="flex-none font-bold text-[#15803D]">✓</span>{t}</li>)}</ul>
);
const TodoList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="flex flex-col gap-1.5 text-sm leading-snug">{items.map((t) => <li key={t} className="flex gap-2"><span className="mt-[5px] h-2 w-2 flex-none rounded-sm border-2 border-opella-forest" />{t}</li>)}</ul>
);

export const TOCockpitView: React.FC = () => {
  const [filter, setFilter] = useState<Filter>({ type: "gate", key: "G2" });
  const [sel, setSel] = useState<string | null>("UC-CLAIM");
  const [bsel, setBsel] = useState<string>(BACKLOG[0]?.id ?? "");
  const pick = (f: Filter) => { setFilter(f); setSel(null); };

  let rows: PipelineUseCase[]; let title: string;
  if (filter.type === "kpi") { const k = KPIS.find((x) => x.key === filter.key)!; rows = PIPELINE.filter(k.test); title = k.label; }
  else if (filter.type === "step") { rows = PIPELINE.filter((u) => u.step === filter.key); title = "Step: " + stepName(filter.key); }
  else { rows = PIPELINE.filter((u) => u.gate === filter.key); title = "Waiting for " + filter.key + (filter.key === "G1" ? " (agent triage, instant)" : ""); }
  const order: Record<string, number> = { r: 0, a: 1, g: 2 };
  rows = [...rows].sort((a, b) => order[a.h] - order[b.h] || b.days - a.days);
  const U = PIPELINE.find((u) => u.id === sel);
  const B = BACKLOG.find((b) => b.id === bsel) ?? BACKLOG[0];

  return (
    <div className="min-h-full bg-[#F4F3EE] text-[#14261D]">
      <main className="mx-auto flex max-w-[1160px] flex-col gap-10 px-6 pb-16 pt-9">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-[1_1_560px]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[.1em] text-opella-forest">Transformation Office · cockpit</p>
            <h1 className="mb-2 text-[34px] font-bold leading-tight tracking-tight">The whole AI pipeline, at a glance</h1>
            <p className="max-w-[640px] text-base leading-normal text-[#55605A]">Where every use case stands, what it waits for, and what blocks it.</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[13px] text-[#55605A]">Week of 23 Nov 2026</span>
            <span className="rounded-full border border-[#D9A441] bg-[#FFF1D6] px-3 py-1 text-xs font-bold tracking-[.06em] text-[#6B3A00]">PIPELINE: EXAMPLE DATA · BACKLOG: REAL INVENTORY</span>
          </div>
        </section>

        {/* 1. Key figures */}
        <section aria-label="Key figures">
          <h2 className="mb-3.5 text-xl font-bold tracking-tight">1. Key figures</h2>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-6">
            {KPIS.map((k) => {
              const on = filter.type === "kpi" && filter.key === k.key;
              return (
                <button key={k.key} onClick={() => pick({ type: "kpi", key: k.key })} aria-pressed={on}
                  className={`flex min-h-[130px] flex-col items-start gap-2 rounded-[14px] border-2 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                    on ? "border-opella-forest bg-opella-forest text-white" : k.key === "blocked" ? "border-[#F3C4C4] bg-white text-[#B91C1C]" : "border-opella-border bg-white"}`}>
                  <span className="text-[34px] font-bold leading-none tracking-tight">{PIPELINE.filter(k.test).length}</span>
                  <span className="text-sm font-semibold leading-tight">{k.label}</span>
                  <span className="text-xs leading-snug opacity-80">{k.sub}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 text-[13px] text-[#55605A]">Click a figure to list the use cases behind it.</p>
        </section>

        {/* 2. Pipeline */}
        <section aria-label="Pipeline by step and gate">
          <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight">2. Pipeline by step and gate</h2>
            <span className="flex flex-wrap gap-3.5 text-[13px] text-[#55605A]">
              {(["g", "a", "r"] as const).map((h) => <span key={h} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: HC[h] }} />{HL[h]}</span>)}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-5">
            {COCKPIT_STEPS.map((s) => {
              const inStep = PIPELINE.filter((u) => u.step === s.id);
              const on = filter.type === "step" && filter.key === s.id;
              return (
                <div key={s.id} className="flex flex-col gap-2.5">
                  <button onClick={() => pick({ type: "step", key: s.id })} aria-pressed={on}
                    className={`flex min-h-[150px] flex-col items-start gap-1.5 px-4 py-3.5 text-left text-white transition hover:-translate-y-0.5 ${on ? "bg-opella-forest" : "bg-[#5E7A66]"}`}
                    style={{ clipPath: "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)" }}>
                    <span className="text-xs font-bold tracking-[.1em] opacity-85">STEP {s.numeral}</span>
                    <span className="text-lg font-bold">{s.name}</span>
                    <span className="flex items-baseline gap-1.5"><span className="text-[28px] font-bold leading-none">{inStep.length}</span><span className="text-[13px] opacity-85">use cases</span></span>
                    <span className="flex min-h-[10px] gap-1">{inStep.map((u) => <span key={u.id} className="h-2.5 w-2.5 rounded-full" style={{ background: HC[u.h] }} />)}</span>
                  </button>
                  <div className="flex min-h-[48px] flex-wrap gap-1.5">
                    {s.gates.map(([g, label]) => {
                      const n = PIPELINE.filter((u) => u.gate === g).length;
                      const gon = filter.type === "gate" && filter.key === g;
                      const agent = g === "G1";
                      return (
                        <button key={g} onClick={() => pick({ type: "gate", key: g })} aria-pressed={gon}
                          className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-[10px] px-2.5 ${gon ? "border-2 border-opella-forest bg-opella-forest text-white" : agent ? "border-2 border-dashed border-[#6D28D9] bg-[#EDE9FE]" : "border-2 border-[#BE185D] bg-white"}`}>
                          <span className="h-[9px] w-[9px] rotate-45" style={{ background: agent ? "#6D28D9" : "#BE185D" }} />
                          <span className="text-[13px] font-bold">{g}</span>
                          <span className="text-xs">{label}</span>
                          <span className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-xs font-bold ${gon ? "bg-white text-opella-forest" : n ? "bg-opella-forest text-white" : "bg-[#E4E1D8] text-[#55605A]"}`}>{n}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3.5 flex flex-wrap items-start gap-3.5">
            <div className="min-w-0 flex-[1_1_440px] overflow-hidden rounded-2xl border border-opella-border bg-white">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-opella-border px-5 py-4">
                <h3 className="text-base font-bold">{title}</h3>
                <span className="text-[13px] text-[#55605A]">{rows.length} {rows.length === 1 ? "use case" : "use cases"}</span>
              </div>
              {rows.length === 0 && <p className="p-5 text-sm text-[#55605A]">No use case here this week.</p>}
              <ul>
                {rows.map((u) => (
                  <li key={u.id}>
                    <button onClick={() => setSel(u.id)} aria-pressed={sel === u.id}
                      className={`flex min-h-[56px] w-full items-center gap-3 border-b border-[#EFEDE6] px-5 py-2.5 text-left ${sel === u.id ? "bg-[#E4EFE7]" : "bg-white"}`}>
                      <span className="h-3 w-3 flex-none rounded-full" style={{ background: HC[u.h] }} />
                      <span className="flex min-w-0 flex-auto flex-col gap-0.5">
                        <span className="text-sm font-bold leading-tight">{u.title}</span>
                        <span className="text-xs text-[#55605A]">{u.fn} · {u.tier} · {u.mode} · {u.owner}</span>
                      </span>
                      <span className="flex-none text-right text-xs font-semibold text-[#55605A]">{u.gate ?? stepName(u.step)} · {u.days} days</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-3.5 rounded-2xl border border-opella-border bg-white p-[22px]">
              {!U ? <p className="text-sm text-[#55605A]">Click a use case to see its status.</p> : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-2.5">
                    <div className="min-w-0 flex-[1_1_260px]">
                      <p className="mb-1 text-xs font-bold tracking-[.08em] text-[#55605A]">{U.id} · {U.fn}</p>
                      <h3 className="text-xl font-bold leading-tight">{U.title}</h3>
                    </div>
                    <span className="flex-none rounded-full px-3 py-1.5 text-[13px] font-bold text-white" style={{ background: HC[U.h] }}>{HL[U.h]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Fact k="Where" v={stepName(U.step) + (U.gate ? " · waiting for " + U.gate : "")} />
                    <Fact k="Owner" v={U.owner} />
                    <Fact k="Tier and mode" v={`${U.tier} · ${U.mode}`} />
                    <Fact k="Next decision" v={U.waiting} />
                    <Fact k="Days at this step" v={String(U.days)} />
                    <Fact k="Entered" v={fmt(U.entered)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><h4 className="mb-2 text-xs font-bold uppercase tracking-[.08em] text-[#15803D]">Done</h4><DoneList items={U.done} /></div>
                    <div><h4 className="mb-2 text-xs font-bold uppercase tracking-[.08em] text-opella-forest">To do</h4><TodoList items={U.next} /></div>
                  </div>
                  <div className={`rounded-[10px] px-3.5 py-3 text-sm leading-snug ${U.h === "r" ? "bg-[#FDECEC] text-[#7F1D1D]" : U.h === "a" ? "bg-[#FFF1D6] text-[#6B3A00]" : "bg-[#F4F3EE] text-[#55605A]"}`}>
                    <strong>Potential blocker:</strong> {U.blocker}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 3. Backlog */}
        <section aria-label="Backlog of ideas">
          <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight">3. Backlog of ideas</h2>
            <span className="text-[13px] text-[#55605A]">The 25 most-mentioned initiatives of the 217 inventory, not yet in the new lifecycle. Fields copied from the inventory.</span>
          </div>
          <div className="flex flex-wrap items-start gap-3.5">
            <div className="min-w-0 flex-[2_1_560px] overflow-x-auto rounded-2xl border border-opella-border bg-white">
              <div className="max-h-[760px] min-w-[680px] overflow-y-auto">
                <div className="sticky top-0 grid grid-cols-[44px_minmax(0,1fr)_120px_120px_190px] bg-[#F4F3EE] text-xs font-bold uppercase tracking-[.08em] text-[#55605A]">
                  <span className="py-3 pl-4">#</span><span className="px-4 py-3">Initiative</span><span className="px-4 py-3">Function</span><span className="px-4 py-3">Status</span><span className="px-4 py-3">Owner</span>
                </div>
                {BACKLOG.map((b, i) => {
                  const c = statusColor(b.status);
                  return (
                    <button key={b.id} onClick={() => setBsel(b.id)} aria-pressed={bsel === b.id}
                      className={`grid min-h-[48px] w-full grid-cols-[44px_minmax(0,1fr)_120px_120px_190px] items-center border-t border-[#EFEDE6] text-left ${bsel === b.id ? "bg-[#E4EFE7]" : "bg-white"}`}>
                      <span className="py-3 pl-4 text-[13px] text-[#55605A]">{i + 1}</span>
                      <span className="px-4 py-3 text-sm font-semibold leading-tight">{b.title}</span>
                      <span className="px-4 py-3 text-[13px] text-[#55605A]">{b.fn}</span>
                      <span className="px-4 py-3"><span className="inline-block rounded-full border px-2.5 py-1 text-xs font-bold" style={{ borderColor: c, color: c }}>{b.status || "(empty)"}</span></span>
                      <span className="px-4 py-3 text-[13px] leading-tight text-[#55605A]">{b.owner || "(empty)"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {B && (
              <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3 rounded-2xl border border-opella-border bg-white p-[22px]">
                <p className="text-xs font-bold tracking-[.08em] text-[#55605A]">{B.id} · {B.fn}{B.sub ? " · " + B.sub : ""}</p>
                <h3 className="text-[19px] font-bold leading-tight">{B.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Fact k="Inventory status" v={empty(B.status)} />
                  <Fact k="Owner" v={empty(B.owner)} />
                  <Fact k="Benefits est. (annual)" v={empty(B.benefits)} />
                  <Fact k="Build cost est." v={empty(B.cost)} />
                  <Fact k="Target horizon" v={empty(B.horizon)} />
                  <Fact k="In Butterfly?" v={empty(B.butterfly)} />
                </div>
                <div><h4 className="mb-1.5 text-xs font-bold uppercase tracking-[.08em] text-[#15803D]">Done</h4><DoneList items={["Listed in the AI inventory (217 initiatives)", "Inventory status: " + (B.status || "(empty)")]} /></div>
                <div><h4 className="mb-1.5 text-xs font-bold uppercase tracking-[.08em] text-opella-forest">To do</h4><TodoList items={["Enter the new lifecycle with a preliminary project charter (G1)"]} /></div>
                <div className="rounded-[10px] bg-[#F4F3EE] px-3.5 py-3 text-sm leading-snug text-[#55605A]"><strong>Potential blocker:</strong> Not documented in the inventory: to capture in the charter.</div>
                <div>
                  <h4 className="mb-1.5 text-xs font-bold uppercase tracking-[.08em] text-[#55605A]">Notes from the AmplifAI review (copied)</h4>
                  <p className="max-h-[180px] overflow-y-auto whitespace-pre-line text-[13px] leading-normal text-[#33403A]">{B.notes || "(empty in the inventory)"}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
