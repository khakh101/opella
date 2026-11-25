"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Details } from "@/components/ui/Details";
import {
  AnyTier, COCKPIT_GATES, GENTIANE_QUESTIONS, MEETINGS, MeetingCode, NavTarget, RoleId, SUPPORT_ROLES, TierId,
} from "@/lib/supportModel";

const TIER_TABS: [AnyTier, string][] = [["T1", "T1 · Transform"], ["T2", "T2 · Scale"], ["T3", "T3 · Fast lane"], ["SS", "Self-serve"]];
const GCOLS = ["G1", "G2", "G3", "G4", "G5", "G6"];
const WHO: Record<string, string> = { v: "Validates", w: "Does the work", c: "Consulted", i: "Informed" };
const CODE: Record<MeetingCode, { tag: string; cls: string }> = {
  D: { tag: "Decides", cls: "bg-opella-forest text-white" },
  P: { tag: "Presents", cls: "bg-[#FCE7F3] text-[#14261D] shadow-[inset_0_0_0_2px_#BE185D]" },
  A: { tag: "Attends", cls: "bg-[#E4EFE7] text-[#14261D]" },
  W: { tag: "Works on", cls: "bg-[#FFF1D6] text-[#14261D] shadow-[inset_0_0_0_2px_#D9A441]" },
  I: { tag: "Informed", cls: "bg-white text-[#14261D] shadow-[inset_0_0_0_2px_#B9BDB5]" },
};
const DOT: Record<string, string> = { a: "bg-opella-forest", p: "bg-[#D9A441]", o: "border-2 border-[#B91C1C]" };
const STATUS: Record<string, string> = { a: "Answered", p: "Partly answered", o: "Open" };
const GRID = "grid grid-cols-[230px_repeat(6,minmax(120px,1fr))]";

interface CockpitViewProps {
  initialGate?: string;
  initialAnchor?: string;
  onNavigate: (target: NavTarget) => void;
  simulator: React.ReactNode;
  simulatorOpen?: boolean;
}

export const CockpitView: React.FC<CockpitViewProps> = ({ initialGate, initialAnchor, onNavigate, simulator, simulatorOpen }) => {
  const [gate, setGate] = useState(Math.max(0, COCKPIT_GATES.findIndex((g) => g.id === (initialGate ?? "G2"))));
  const [tier, setTier] = useState<AnyTier>("T1");
  const [openCat, setOpenCat] = useState(0);
  const tk: TierId = tier === "SS" ? "T1" : tier;

  const scrollTo = (id: string) => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  useEffect(() => {
    if (initialGate) scrollTo("gates");
    else if (initialAnchor) scrollTo(initialAnchor);
  }, [initialGate, initialAnchor]);

  const go = (t: NavTarget) => {
    if (t.tab === "cockpit") {
      if (t.gate) { setGate(COCKPIT_GATES.findIndex((g) => g.id === t.gate)); scrollTo("gates"); }
      else if (t.anchor) scrollTo(t.anchor);
    } else onNavigate(t);
  };

  const sg = COCKPIT_GATES[gate];
  const who = SUPPORT_ROLES.filter((r) => r.stages[sg.id as keyof typeof r.stages][tk][0] !== "n");
  const tierLabel = TIER_TABS.find((t) => t[0] === tk)![1];
  const all = GENTIANE_QUESTIONS.flatMap((c) => c.qs);
  const count = (s: string) => all.filter((q) => q.s === s).length;

  return (
    <div className="min-h-full bg-[#F4F3EE] text-[#14261D]">
      <main className="mx-auto flex max-w-[1160px] flex-col gap-12 px-6 pb-16 pt-10">
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.1em] text-opella-forest">TO experience · validation cockpit</p>
          <h1 className="mb-2.5 text-[34px] font-bold leading-tight tracking-tight">Six gates, who decides, and in which forum</h1>
          <p className="max-w-[700px] text-base leading-relaxed text-[#55605A]">Start with the gates. Click one to see who decides, in which committee and against which criteria. Everything deeper is one click further.</p>
        </section>

        {/* 1. Gates */}
        <section id="gates" aria-label="The six gates" className="scroll-mt-20">
          <h2 className="mb-1.5 text-[22px] font-bold tracking-tight">1. The six gates</h2>
          <p className="mb-4 text-sm text-[#55605A]">Select a gate.</p>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-6">
            {COCKPIT_GATES.map((g, i) => {
              const active = i === gate;
              return (
                <button key={g.id} onClick={() => setGate(i)} aria-pressed={active}
                  className={`flex min-h-[170px] flex-col items-start gap-2 rounded-[14px] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                    active ? "border-2 border-opella-forest bg-opella-forest text-white" : g.human ? "border-2 border-[#BE185D] bg-white" : "border-2 border-dashed border-[#6D28D9] bg-[#EDE9FE]"}`}>
                  <span className="flex w-full items-center justify-between">
                    <span className="text-xl font-bold">{g.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${g.human ? "bg-[#FCE7F3] text-[#9D174D]" : "bg-white text-[#5B21B6]"}`}>{g.type}</span>
                  </span>
                  <span className="text-[15px] font-bold leading-tight">{g.name}</span>
                  <span className="text-xs opacity-90">{g.phase}</span>
                  <span className="mt-auto text-xs font-semibold">{g.forum.split(".")[0].split(",")[0]}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3.5 flex flex-col gap-5 rounded-[20px] border border-opella-border bg-white p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-2xl font-bold tracking-tight">{sg.id} · {sg.name}</h3>
              <span className="text-sm text-[#55605A]">{sg.phase}</span>
            </div>
            <p className="text-[17px] leading-normal">{sg.decision}</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[["Approver", sg.approver], ["Forum", sg.forum], ["Timing", sg.sla]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#F4F3EE] p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-[.08em] text-[#55605A]">{k}</p>
                  <p className="text-[15px] leading-snug">{v}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-[14px] border border-opella-border p-[18px]">
                <h4 className="mb-2.5 text-[13px] font-bold uppercase tracking-[.08em] text-opella-forest">What is reviewed</h4>
                <ul className="flex flex-col gap-2.5 text-sm leading-snug">
                  {sg.criteria.map(([k, v]) => <li key={k}><strong>{k}:</strong> <span className="text-[#55605A]">{v}</span></li>)}
                </ul>
              </div>
              <div className="rounded-[14px] border border-opella-border p-[18px]">
                <h4 className="mb-2.5 text-[13px] font-bold uppercase tracking-[.08em] text-[#6B3A00]">Who interacts · {tierLabel}</h4>
                <ul className="flex flex-col gap-2.5 text-sm leading-snug">
                  {who.map((r) => {
                    const [k, what] = r.stages[sg.id as keyof typeof r.stages][tk];
                    return <li key={r.id}><strong>{r.name} · {WHO[k]}:</strong> <span className="text-[#55605A]">{what}</span></li>;
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Committees */}
        <section id="committees" aria-label="Committees" className="scroll-mt-20">
          <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[22px] font-bold tracking-tight">2. Which committee interacts when, and who is in the room</h2>
            <span className="text-[13px] text-[#55605A]">First version: committee slide 38 plus the role pages of tab 3.</span>
          </div>
          <div role="group" aria-label="Tier" className="my-3 mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-bold text-[#55605A]">Tier</span>
            {TIER_TABS.map(([id, label]) => (
              <button key={id} onClick={() => setTier(id)} aria-pressed={tier === id}
                className={`min-h-[44px] rounded-full px-[18px] text-sm font-semibold ${tier === id ? "border border-opella-forest bg-opella-forest text-white" : "border border-[#B9BDB5] bg-white"}`}>{label}</button>
            ))}
          </div>

          {tier === "SS" ? (
            <div className="rounded-2xl border border-[#C4B5FD] bg-[#EDE9FE] p-6 text-base leading-relaxed text-[#3B1F8A]">
              Self-serve: no committee at any level. Agents screen and monitor each request. What remains: one registry line, guardrail checks and a quarterly value pulse. The function head approves; the Design Authority only checks a new tool. The TO confirms the routing at G1.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-opella-border bg-white">
                <div className="min-w-[1000px]">
                  <div className={`${GRID} border-b border-opella-border bg-[#F4F3EE]`}>
                    <span className="p-3 text-xs font-bold uppercase tracking-[.08em] text-[#55605A]">Meeting · persona</span>
                    {GCOLS.map((g) => <span key={g} className="border-l border-opella-border p-3 text-sm font-bold">{g}</span>)}
                  </div>
                  {MEETINGS.map((m) => {
                    const active = m.tiers.split(" ").includes(tk);
                    const present = SUPPORT_ROLES.filter((r) => GCOLS.some((g) => m.cells[g]?.[tk]?.[r.id as RoleId]));
                    const absent = SUPPORT_ROLES.filter((r) => !present.includes(r)).map((r) => r.name);
                    const chipLabel = m.status === "New" ? "NEW · PROPOSAL" : m.status === "Exists" ? "EXISTS" : "NO MEETING";
                    return (
                      <div key={m.id} className="border-t-4 border-[#F4F3EE]">
                        <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1.5 px-4 py-3.5 ${active ? "bg-opella-forest text-white" : "bg-[#FAF9F5] text-[#55605A]"}`}>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold tracking-[.08em] ${active ? "bg-white text-opella-forest" : "border border-[#B9BDB5]"}`}>{chipLabel}</span>
                          <span className="text-[15px] font-bold">{m.name} · {m.cadence}</span>
                          <span className={`basis-full text-[13px] leading-snug ${active ? "text-[#DDEBE1]" : ""}`}>
                            {active ? <>Also in the room: {m.others}. {m.note}{absent.length > 0 && <> Not in this meeting: {absent.join(", ")}.</>}</> : <>No meeting in this tier. {m.note}</>}
                          </span>
                        </div>
                        {active && present.length > 0 && (
                          <div className={GRID} style={{ gridTemplateRows: `repeat(${present.length}, minmax(52px, auto))` }}>
                            {present.map((r, ri) => (
                              <span key={r.id} className="flex items-center border-b border-opella-border px-4 py-2.5 text-sm font-semibold" style={{ gridColumn: 1, gridRow: ri + 1 }}>{r.name}</span>
                            ))}
                            {GCOLS.map((g, gi) => {
                              const sits = !!m.cells[g]?.[tk];
                              if (!sits) {
                                return (
                                  <span key={g} className="flex items-center justify-center border-b border-l border-opella-border bg-[repeating-linear-gradient(135deg,#FAF9F5_0,#FAF9F5_8px,#F1EFE8_8px,#F1EFE8_16px)] px-2 text-center text-xs text-[#55605A]"
                                    style={{ gridColumn: gi + 2, gridRow: `1 / span ${present.length}` }}>
                                    No session at {g}
                                  </span>
                                );
                              }
                              return present.map((r, ri) => {
                                const c = m.cells[g]?.[tk]?.[r.id as RoleId];
                                return (
                                  <span key={g + r.id} className={`flex flex-col gap-0.5 border-b border-l border-opella-border px-2.5 py-2 ${c ? CODE[c[0]].cls : ""}`} style={{ gridColumn: gi + 2, gridRow: ri + 1 }}>
                                    {c && <><span className="text-[10px] font-bold uppercase tracking-[.06em] opacity-85">{CODE[c[0]].tag}</span><span className="text-xs leading-snug">{c[1]}</span></>}
                                  </span>
                                );
                              });
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-[18px] text-[13px] text-[#55605A]">
                {(Object.keys(CODE) as MeetingCode[]).map((k) => (
                  <span key={k} className="inline-flex items-center gap-2"><span className={`h-3.5 w-3.5 rounded ${CODE[k].cls}`} />{CODE[k].tag}</span>
                ))}
                <span className="inline-flex items-center gap-2"><span className="h-3.5 w-3.5 rounded bg-[repeating-linear-gradient(135deg,#FAF9F5_0,#FAF9F5_3px,#E4E1D8_3px,#E4E1D8_6px)]" />The meeting does not sit at this gate</span>
              </div>
            </>
          )}
        </section>

        {/* 3. Gentiane's questions */}
        <section id="questions" aria-label="Questions from Gentiane" className="scroll-mt-20">
          <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[22px] font-bold tracking-tight">3. Gentiane&apos;s questions: where each one is answered</h2>
            <span className="text-[13px] text-[#55605A]">{all.length} questions: {count("a")} answered, {count("p")} partly, {count("o")} open</span>
          </div>
          <div className="mb-4 mt-2 flex flex-wrap gap-[18px] text-[13px] text-[#55605A]">
            {["a", "p", "o"].map((s) => <span key={s} className="inline-flex items-center gap-2"><span className={`h-3 w-3 rounded-full ${DOT[s]}`} />{s === "o" ? "Open: not answered yet" : STATUS[s]}</span>)}
          </div>
          <div className="flex flex-col gap-2">
            {GENTIANE_QUESTIONS.map((c, i) => {
              const open = openCat === i;
              return (
                <div key={c.title} className="overflow-hidden rounded-[14px] border border-opella-border bg-white">
                  <button onClick={() => setOpenCat(open ? -1 : i)} aria-expanded={open} className="flex min-h-[60px] w-full flex-wrap items-center gap-3.5 px-5 py-3 text-left">
                    <span className="min-w-0 flex-[1_1_380px] text-base font-bold">{i + 1}. {c.title}</span>
                    <span className="inline-flex items-center gap-1.5">{c.qs.map((q, j) => <span key={j} className={`h-3 w-3 rounded-full ${DOT[q.s]}`} />)}</span>
                    <span className="text-[13px] text-[#55605A]">{c.qs.length} {c.qs.length > 1 ? "questions" : "question"}</span>
                    <ChevronDown className={`h-[18px] w-[18px] flex-none transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {open && (
                    <ol className="flex flex-col gap-2.5 px-5 pb-4">
                      {c.qs.map((q) => (
                        <li key={q.text} className="flex flex-wrap items-start gap-4 rounded-xl border border-opella-border p-4">
                          <span className={`mt-1 h-3.5 w-3.5 flex-none rounded-full ${DOT[q.s]}`} />
                          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-1.5">
                            <p className="text-[15px] font-semibold leading-normal">{q.text}</p>
                            <p className="text-sm leading-normal text-[#55605A]"><strong className="text-[#14261D]">{STATUS[q.s]}.</strong> {q.answer}</p>
                          </div>
                          {q.target ? (
                            <button onClick={() => go(q.target!)} className="inline-flex min-h-[44px] flex-none items-center gap-2 rounded-[10px] bg-opella-forest px-4 text-sm font-semibold text-white">
                              Go to {q.where} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          ) : (
                            <span className="inline-flex min-h-[44px] flex-none items-center rounded-[10px] border border-dashed border-[#B91C1C] px-4 text-sm font-semibold text-[#B91C1C]">Not on the site yet</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Previous tab 3, kept in full but collapsed */}
        <section id="simulator" aria-label="Detailed simulator" className="scroll-mt-20">
          <Details title="Detailed lifecycle simulator and gate journeys (previous tab 3)" defaultOpen={simulatorOpen}>
            {simulator}
          </Details>
        </section>
      </main>
    </div>
  );
};
