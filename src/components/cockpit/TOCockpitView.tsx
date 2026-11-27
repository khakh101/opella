"use client";

import React, { useMemo, useState } from "react";
import { MousePointerClick, RotateCcw } from "lucide-react";
import { BACKLOG, COCKPIT_STEPS, COCKPIT_WEEK_START, PIPELINE, PipelineUseCase } from "@/lib/toCockpitData";
import { MEETINGS } from "@/lib/supportModel";

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

const CHEVRON_FIRST = "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)";
const CHEVRON = "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 8% 50%)";
const GATE_ORDER = ["G1", "G2", "G3", "G4", "G5", "G6"];

// Committee overview: built from the operating model meetings; only the origin and the decision-makers are added here
const COMMITTEE_INFO: Record<string, { name: string; origin: "butterfly" | "existing" | "new" | "none"; who: string }> = {
  offline: { name: "No meeting", origin: "none", who: "G1: the agent, then the Transformation Office. G2: each support function validates its part (Value officer, P&C, Adoption lead, LEX, Data & AI)." },
  board: { name: "Portfolio board", origin: "butterfly", who: "Transformation Office and Data & AI office, supported by the other functions" },
  steerco: { name: "SteerCo", origin: "butterfly", who: "Validates T1 use cases, their funding and their scale" },
  stream: { name: "Stream meetings", origin: "butterfly", who: "Stream lead with the Transformation Office: pre-approve the scale case, review value" },
  da: { name: "Design Authority", origin: "existing", who: "Data & AI: scale architecture sign-off" },
  cross: { name: "AmplifAI cross stream meeting", origin: "new", who: "Optional, for T1 bets across several streams: Program Sponsors (CDO and CFO), C-level bet sponsors" },
};
const ORIGIN = {
  butterfly: { label: "Butterfly, existing", cls: "border-[#9FC3AC] bg-[#E4EFE7] text-opella-forest" },
  existing: { label: "Existing", cls: "border-[#B9BDB5] bg-[#F4F3EE] text-[#33403A]" },
  new: { label: "New, the only one (optional)", cls: "border-[#D9A441] bg-[#FFF1D6] text-[#6B3A00]" },
  none: { label: "No committee", cls: "border-dashed border-[#B9BDB5] bg-white text-[#55605A]" },
};
const COMMITTEE_ORDER = ["offline", "board", "steerco", "stream", "da", "cross"];

type SortKey = "rank" | "title" | "fn" | "status" | "owner";
const normStatus = (x: string) => ((x || "").toLowerCase() === "in progress" ? "In progress" : x || "(empty)");

export const TOCockpitView: React.FC = () => {
  const [filter, setFilter] = useState<Filter>({ type: "gate", key: "G2" });
  const [sel, setSel] = useState<string | null>("UC-CLAIM");
  const [bsel, setBsel] = useState<string>(BACKLOG[0]?.id ?? "");
  const [q, setQ] = useState({ title: "", fn: "", status: "", owner: "" });
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "rank", dir: 1 });
  const pick = (f: Filter) => { setFilter(f); setSel(null); };

  let rows: PipelineUseCase[]; let title: string;
  if (filter.type === "kpi") { const k = KPIS.find((x) => x.key === filter.key)!; rows = PIPELINE.filter(k.test); title = k.label; }
  else if (filter.type === "step") { rows = PIPELINE.filter((u) => u.step === filter.key); title = "Step: " + stepName(filter.key); }
  else { rows = PIPELINE.filter((u) => u.gate === filter.key); title = "Waiting for " + filter.key; }
  const order: Record<string, number> = { r: 0, a: 1, g: 2 };
  rows = [...rows].sort((a, b) => order[a.h] - order[b.h] || b.days - a.days);
  const U = PIPELINE.find((u) => u.id === sel);
  const B = BACKLOG.find((b) => b.id === bsel) ?? BACKLOG[0];

  // Backlog: filters and sort
  const ranked = useMemo(() => BACKLOG.map((b, i) => ({ ...b, rank: i + 1, statusN: normStatus(b.status) })), []);
  const fns = useMemo(() => Array.from(new Set(ranked.map((b) => b.fn))).sort(), [ranked]);
  const statuses = useMemo(() => Array.from(new Set(ranked.map((b) => b.statusN))).sort(), [ranked]);
  const lc = (x?: string) => (x || "").toLowerCase();
  const sortVal = (b: (typeof ranked)[number]): string | number =>
    sort.key === "rank" ? b.rank : sort.key === "title" ? lc(b.title) : sort.key === "fn" ? lc(b.fn) : sort.key === "status" ? lc(b.statusN) : lc(b.owner);
  const backlog = ranked
    .filter((b) => (!q.title || lc(b.title).includes(lc(q.title))) && (!q.fn || b.fn === q.fn) && (!q.status || b.statusN === q.status) && (!q.owner || lc(b.owner).includes(lc(q.owner))))
    .sort((a, b) => { const x = sortVal(a), y = sortVal(b); return (x > y ? 1 : x < y ? -1 : 0) * sort.dir || a.rank - b.rank; });
  const sortBy = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  const COLS: [SortKey, string][] = [["rank", "#"], ["title", "Initiative"], ["fn", "Function"], ["status", "Status"], ["owner", "Owner"]];
  const GRID = "grid-cols-[64px_minmax(0,1fr)_150px_150px_210px]";
  const inputCls = "min-h-[36px] w-full rounded-lg border border-[#B9BDB5] bg-white px-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-opella-forest";

  const committees = COMMITTEE_ORDER.map((id) => {
    const m = MEETINGS.find((x) => x.id === id)!;
    const gates = GATE_ORDER.filter((g) => (id === "offline" ? ["G1", "G2"].includes(g) : !!m.cells[g]));
    return { id, info: COMMITTEE_INFO[id], cadence: id === "offline" ? "Reviews done between meetings" : m.cadence.replace(" (proposal, new)", " (proposal)"), tiers: id === "offline" ? "All tiers" : id === "steerco" ? "T1 (T2 informed)" : m.tiers.split(" ").join(", "), gates };
  });

  const sectionTitle = "text-lg font-black tracking-tight text-opella-forest";

  return (
    <div className="min-h-full bg-[#F4F3EE] text-[#14261D]">
      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-4 py-8 sm:px-6 lg:px-10">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-opella-forest">TO cockpit</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
              <MousePointerClick className="h-4 w-4 shrink-0" aria-hidden="true" />
              Where every use case stands, what it waits for, and what blocks it. Click a figure, a step or a gate.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[13px] text-[#55605A]">Week of 23 Nov 2026</span>
            <span className="rounded-full border border-[#D9A441] bg-[#FFF1D6] px-3 py-1 text-[11px] font-black tracking-[.06em] text-[#6B3A00]">PIPELINE: EXAMPLE DATA · BACKLOG: REAL INVENTORY</span>
          </div>
        </section>

        {/* 1. Key figures */}
        <section aria-label="Key figures">
          <h3 className={`mb-3 ${sectionTitle}`}>1. Key figures</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {KPIS.map((k) => {
              const on = filter.type === "kpi" && filter.key === k.key;
              const alert = k.key === "blocked";
              return (
                <button key={k.key} onClick={() => pick({ type: "kpi", key: k.key })} aria-pressed={on}
                  className={`flex min-h-[124px] flex-col items-start gap-2 rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    on ? "border-opella-forest bg-opella-forest text-white" : alert ? "border-[#F3C4C4] bg-white" : "border-gray-200 bg-white"}`}>
                  <span className={`text-[32px] font-black leading-none tracking-tight ${on ? "text-white" : alert ? "text-[#B91C1C]" : "text-opella-forest"}`}>{PIPELINE.filter(k.test).length}</span>
                  <span className="text-sm font-bold leading-tight">{k.label}</span>
                  <span className="text-xs leading-snug opacity-80">{k.sub}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Pipeline: same template as the 5 lifecycle steps (Tab 1) and the 4 intake steps (Tab 2) */}
        <section aria-label="Pipeline by step and gate">
          <h3 className={`mb-3 ${sectionTitle}`}>2. Pipeline by step and gate</h3>
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[1100px]">
              <div className="grid grid-cols-5 gap-4">
                {COCKPIT_STEPS.map((s, i) => {
                  const inStep = PIPELINE.filter((u) => u.step === s.id);
                  const on = filter.type === "step" && filter.key === s.id;
                  const count = (h: string) => inStep.filter((u) => u.h === h).length;
                  return (
                    <button key={s.id} type="button" onClick={() => pick({ type: "step", key: s.id })} aria-pressed={on}
                      className="group flex flex-col rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-opella-forest">
                      <div className={`relative flex h-14 items-center justify-center gap-2 px-6 text-base font-black text-white transition-colors ${on ? "bg-opella-forest" : "bg-[#5b7a64] group-hover:bg-opella-forest"}`}
                        style={{ clipPath: i === 0 ? CHEVRON_FIRST : CHEVRON }}>
                        {s.numeral} · {s.name}
                      </div>
                      <div className={`mt-3 flex min-h-[150px] flex-1 flex-col rounded-xl border bg-white p-4 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-lg ${on ? "border-2 border-opella-forest" : "border-gray-200 group-hover:border-opella-forest"}`}>
                        <span className="flex items-baseline gap-1.5"><span className="text-[30px] font-black leading-none text-opella-forest">{inStep.length}</span><span className="text-sm text-gray-600">use cases</span></span>
                        <span className="mt-3 flex min-h-[14px] flex-wrap gap-1.5">{inStep.map((u) => <span key={u.id} title={u.title} className="h-3.5 w-3.5 rounded-full ring-2 ring-white" style={{ background: HC[u.h], boxShadow: "0 0 0 1px rgba(0,0,0,.15)" }} />)}</span>
                        <span className="mt-auto flex flex-col gap-0.5 pt-3 text-xs">
                          {(["g", "a", "r"] as const).map((h) => (
                            <span key={h} className="flex items-center gap-1.5" style={{ color: count(h) ? HC[h] : "#9CA3AF" }}>
                              <span className="font-black">{count(h)}</span> {HL[h].toLowerCase()}
                            </span>
                          ))}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Gates under each step */}
              <div className="mt-5 grid grid-cols-5 gap-4">
                {COCKPIT_STEPS.map((s) => (
                  <div key={s.id} className="flex min-h-[90px] items-start justify-center gap-1">
                    {s.gates.length === 0 ? (
                      <div className="pt-6 text-center text-[11px] italic text-gray-400">No gate in this step</div>
                    ) : (
                      s.gates.map(([g, label]) => {
                        const n = PIPELINE.filter((u) => u.gate === g).length;
                        const gon = filter.type === "gate" && filter.key === g;
                        const agent = g === "G1";
                        return (
                          <button key={g} type="button" onClick={() => pick({ type: "gate", key: g })} aria-pressed={gon} aria-label={`${g} ${label}: ${n} use cases`}
                            className="group flex w-[64px] flex-col items-center focus:outline-none">
                            <span className="relative flex h-[46px] w-[46px] items-center justify-center">
                              <span className={`absolute h-[34px] w-[34px] rotate-45 rounded-md shadow-md transition-transform group-hover:scale-110 ${agent ? "border-[3px] border-dashed border-violet-500 bg-violet-50" : "border-2 border-pink-600 bg-pink-500"} ${gon ? "ring-[3px] ring-opella-forest ring-offset-2" : ""}`} />
                              <span className={`relative text-xs font-black ${agent ? "text-violet-800" : "text-white"}`}>{g}</span>
                              <span className={`absolute -right-2 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-[#F4F3EE] px-1 text-[11px] font-black ${n ? "bg-opella-forest text-white" : "bg-[#E4E1D8] text-[#55605A]"}`}>{n}</span>
                            </span>
                            <span className="mt-1 text-center text-[10px] font-bold leading-tight text-gray-800">{label}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-1 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
                {(["g", "a", "r"] as const).map((h) => (
                  <span key={h} className="flex items-center gap-2 font-semibold text-gray-800">
                    <span className="h-3.5 w-3.5 rounded-full" style={{ background: HC[h], boxShadow: "0 0 0 1px rgba(0,0,0,.15)" }} /> {HL[h]}
                  </span>
                ))}
                <span className="flex items-center gap-2"><span className="inline-block h-3.5 w-3.5 rotate-45 border-2 border-dashed border-violet-500 bg-violet-50" /> Automatic gate: agent, then the Transformation Office</span>
                <span className="flex items-center gap-2"><span className="inline-block h-3.5 w-3.5 rotate-45 bg-pink-500" /> Manual gate: validated by people</span>
                <span className="text-gray-500">Number on a gate: use cases waiting for it</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-start gap-4">
            <div className="min-w-0 flex-[1_1_440px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-200 px-5 py-4">
                <h4 className="text-base font-black">{title}</h4>
                <span className="text-[13px] text-[#55605A]">{rows.length} {rows.length === 1 ? "use case" : "use cases"}</span>
              </div>
              {rows.length === 0 && <p className="p-5 text-sm text-[#55605A]">No use case here this week.</p>}
              <ul>
                {rows.map((u) => (
                  <li key={u.id}>
                    <button onClick={() => setSel(u.id)} aria-pressed={sel === u.id}
                      className={`flex min-h-[56px] w-full items-center gap-3 border-b border-[#EFEDE6] px-5 py-2.5 text-left ${sel === u.id ? "bg-[#E4EFE7]" : "bg-white hover:bg-[#FAF9F5]"}`}>
                      <span className="h-3.5 w-3.5 flex-none rounded-full" style={{ background: HC[u.h], boxShadow: "0 0 0 1px rgba(0,0,0,.15)" }} />
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
            <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-3.5 rounded-xl border border-gray-200 bg-white p-[22px] shadow-sm">
              {!U ? <p className="text-sm text-[#55605A]">Click a use case to see its status.</p> : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-2.5">
                    <div className="min-w-0 flex-[1_1_260px]">
                      <p className="mb-1 text-xs font-bold tracking-[.08em] text-[#55605A]">{U.id} · {U.fn}</p>
                      <h4 className="text-xl font-black leading-tight">{U.title}</h4>
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
                    <div><h5 className="mb-2 text-xs font-bold uppercase tracking-[.08em] text-[#15803D]">Done</h5><DoneList items={U.done} /></div>
                    <div><h5 className="mb-2 text-xs font-bold uppercase tracking-[.08em] text-opella-forest">To do</h5><TodoList items={U.next} /></div>
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
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className={sectionTitle}>3. Backlog of ideas</h3>
            <span className="text-[13px] text-[#55605A]">The 25 most-mentioned initiatives of the 217 inventory, not yet in the new lifecycle. Fields copied from the inventory.</span>
          </div>
          <div className="flex flex-wrap items-start gap-4">
            <div className="min-w-0 flex-[2_1_600px] overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="min-w-[760px]">
                <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-gray-200 px-4 py-3">
                  <span className="text-[13px] text-[#33403A]"><strong>{backlog.length}</strong> of {BACKLOG.length} initiatives</span>
                  <button type="button" onClick={() => { setQ({ title: "", fn: "", status: "", owner: "" }); setSort({ key: "rank", dir: 1 }); }}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[#B9BDB5] bg-white px-3 text-[13px] font-semibold text-opella-forest hover:bg-[#F4F3EE]">
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Clear filters
                  </button>
                </div>
                <div className={`grid ${GRID} bg-[#F4F3EE] text-xs font-black uppercase tracking-[.06em] text-[#4B5563]`}>
                  {COLS.map(([k, label]) => (
                    <button key={k} type="button" onClick={() => sortBy(k)} aria-label={`Sort by ${label}`}
                      className="flex items-center gap-1 px-4 pb-1.5 pt-3 text-left uppercase hover:text-opella-forest">
                      {label}<span className="text-[10px] text-opella-forest">{sort.key === k ? (sort.dir === 1 ? "▲" : "▼") : ""}</span>
                    </button>
                  ))}
                </div>
                <div className={`grid ${GRID} border-b border-gray-200 bg-[#F4F3EE] pb-2.5`}>
                  <span className="self-center px-4 text-[11px] text-gray-500">Sort</span>
                  <span className="px-2"><input aria-label="Filter by initiative" placeholder="Search initiative" value={q.title} onChange={(e) => setQ({ ...q, title: e.target.value })} className={inputCls} /></span>
                  <span className="px-2"><select aria-label="Filter by function" value={q.fn} onChange={(e) => setQ({ ...q, fn: e.target.value })} className={inputCls}>
                    <option value="">All functions</option>{fns.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select></span>
                  <span className="px-2"><select aria-label="Filter by status" value={q.status} onChange={(e) => setQ({ ...q, status: e.target.value })} className={inputCls}>
                    <option value="">All statuses</option>{statuses.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select></span>
                  <span className="px-2 pr-4"><input aria-label="Filter by owner" placeholder="Search owner" value={q.owner} onChange={(e) => setQ({ ...q, owner: e.target.value })} className={inputCls} /></span>
                </div>
                <div className="max-h-[640px] overflow-y-auto">
                  {backlog.length === 0 && <p className="px-4 py-5 text-sm text-[#55605A]">No initiative matches these filters.</p>}
                  {backlog.map((b) => {
                    const c = statusColor(b.status);
                    return (
                      <button key={b.id} onClick={() => setBsel(b.id)} aria-pressed={bsel === b.id}
                        className={`grid min-h-[48px] w-full ${GRID} items-center border-t border-[#EFEDE6] text-left ${bsel === b.id ? "bg-[#E4EFE7]" : "bg-white hover:bg-[#FAF9F5]"}`}>
                        <span className="py-3 pl-4 text-[13px] text-[#55605A]">{b.rank}</span>
                        <span className="px-4 py-3 text-sm font-semibold leading-tight">{b.title}</span>
                        <span className="px-4 py-3 text-[13px] text-[#55605A]">{b.fn}</span>
                        <span className="px-4 py-3"><span className="inline-block rounded-full border px-2.5 py-1 text-xs font-bold" style={{ borderColor: c, color: c }}>{b.status || "(empty)"}</span></span>
                        <span className="px-4 py-3 text-[13px] leading-tight text-[#55605A]">{b.owner || "(empty)"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {B && (
              <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-3 rounded-xl border border-gray-200 bg-white p-[22px] shadow-sm">
                <p className="text-xs font-bold tracking-[.08em] text-[#55605A]">{B.id} · {B.fn}{B.sub ? " · " + B.sub : ""}</p>
                <h4 className="text-[19px] font-black leading-tight">{B.title}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Fact k="Inventory status" v={empty(B.status)} />
                  <Fact k="Owner" v={empty(B.owner)} />
                  <Fact k="Benefits est. (annual)" v={empty(B.benefits)} />
                  <Fact k="Build cost est." v={empty(B.cost)} />
                  <Fact k="Target horizon" v={empty(B.horizon)} />
                  <Fact k="In Butterfly?" v={empty(B.butterfly)} />
                </div>
                <div><h5 className="mb-1.5 text-xs font-bold uppercase tracking-[.08em] text-[#15803D]">Done</h5><DoneList items={["Listed in the AI inventory (217 initiatives)", "Inventory status: " + (B.status || "(empty)")]} /></div>
                <div><h5 className="mb-1.5 text-xs font-bold uppercase tracking-[.08em] text-opella-forest">To do</h5><TodoList items={["Enter the new lifecycle with a preliminary project charter (G1)"]} /></div>
                <div className="rounded-[10px] bg-[#F4F3EE] px-3.5 py-3 text-sm leading-snug text-[#55605A]"><strong>Potential blocker:</strong> Not documented in the inventory: to capture in the charter.</div>
                <div>
                  <h5 className="mb-1.5 text-xs font-bold uppercase tracking-[.08em] text-[#55605A]">Notes from the AmplifAI review (copied)</h5>
                  <p className="max-h-[180px] overflow-y-auto whitespace-pre-line text-[13px] leading-normal text-[#33403A]">{B.notes || "(empty in the inventory)"}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4. Committees */}
        <section id="committees" aria-label="Committees" className="scroll-mt-20">
          <h3 className={sectionTitle}>4. Committees: we reuse Butterfly&apos;s</h3>
          <p className="mb-3 mt-1 text-sm text-[#33403A]">No new governance layer: use cases go through the committees that already run. AmplifAI adds only one optional meeting, for bets across several streams.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[960px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#F4F3EE] text-left text-xs font-black uppercase tracking-[.06em] text-[#4B5563]">
                  <th scope="col" className="px-4 py-3">Committee</th>
                  <th scope="col" className="px-4 py-3">Origin</th>
                  <th scope="col" className="px-4 py-3">Cadence</th>
                  <th scope="col" className="px-4 py-3">Tiers</th>
                  <th scope="col" className="px-4 py-3">Gates</th>
                  <th scope="col" className="px-4 py-3">Who decides</th>
                </tr>
              </thead>
              <tbody>
                {committees.map((c) => (
                  <tr key={c.id} className="border-t border-[#EFEDE6] align-top">
                    <th scope="row" className="px-4 py-3.5 text-left font-bold">{c.info.name}</th>
                    <td className="px-4 py-3.5"><span className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold ${ORIGIN[c.info.origin].cls}`}>{ORIGIN[c.info.origin].label}</span></td>
                    <td className="px-4 py-3.5 text-[#33403A]">{c.cadence}</td>
                    <td className="px-4 py-3.5 text-[#33403A]">{c.tiers}</td>
                    <td className="px-4 py-3.5">
                      <span className="flex flex-wrap gap-1.5">
                        {c.gates.map((g) => (
                          <span key={g} className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-black ${g === "G1" ? "border-2 border-dashed border-violet-500 bg-violet-50 text-violet-800" : "border border-pink-600 text-pink-700"}`}>
                            <span className={`h-1.5 w-1.5 rotate-45 ${g === "G1" ? "bg-violet-500" : "bg-pink-500"}`} />{g}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 leading-snug text-[#33403A]">{c.info.who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
