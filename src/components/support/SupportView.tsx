"use client";

import React, { useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { AnyTier, FORUM, Kind, RoleId, StageId, SUPPORT_ROLES, TierId } from "@/lib/supportModel";

const STAGES: [StageId, string, string][] = [
  ["G1", "Agent triage", "G1 · Need validated"], ["G2", "Feasible", "G2 · Feasible"], ["G3", "Priority", "G3 · Priority"],
  ["G4", "Mode", "G4 · Mode and budget"], ["Build", "MVP", "Build (MVP)"], ["G5", "Scale gate", "G5 · Scale validation"],
  ["Scale", "Roll out", "Scale"], ["G6", "Run", "G6 · Maintain validation"],
];

const KIND: Record<Kind, { label: string; bg: string; fg: string; bd: string; dash: boolean }> = {
  v: { label: "You validate", bg: "#0D3824", fg: "#FFFFFF", bd: "#0D3824", dash: false },
  w: { label: "You do the work", bg: "#FFF1D6", fg: "#6B3A00", bd: "#D9A441", dash: false },
  c: { label: "You are consulted", bg: "#E4EFE7", fg: "#0D3824", bd: "#B7D3C0", dash: false },
  i: { label: "You are informed", bg: "#FFFFFF", fg: "#14261D", bd: "#B9BDB5", dash: false },
  n: { label: "Not involved", bg: "transparent", fg: "#55605A", bd: "#B9BDB5", dash: true },
};

const TIERS: Record<AnyTier, { title: string; short: string; color: string; rule: string; note: string }> = {
  T1: { title: "T1 · Transform", short: "T1", color: "#0D3824", rule: "Big bet, Butterfly core platforms or scope, or more than €1m.", note: "Full business case. Butterfly governance applies: stream meeting, Portfolio board and SteerCo." },
  T2: { title: "T2 · Scale", short: "T2", color: "#0369A1", rule: "Value proven in a pilot, and it needs reach (2+ functions or regions, 500+ users), hub capacity or €200k to €1m.", note: "Light business case at the scale gate. The AI Portfolio Board advises; Program Sponsors (CDO and CFO) approve." },
  T3: { title: "T3 · Fast lane", short: "T3", color: "#B45309", rule: "A new idea or build with a value hypothesis to test.", note: "One-page canvas, 6 to 8 week MVP, then the scale gate. The AI Portfolio Board is the only forum." },
  SS: { title: "Self-serve · register and go", short: "Self-serve", color: "#7C3AED", rule: "Only approved tools and data, configured rather than built, for under €50k.", note: "The function owns it. One registry line. Guardrails apply." },
};

const QUESTIONS = [
  { key: "q1", text: "Is it part of an AmplifAI big bet, does it change Butterfly core platforms or scope, or cost more than €1m?", yesTo: "T1 · Transform" },
  { key: "q2", text: "Does it only use approved tools and data, configured rather than built, for under €50k?", yesTo: "Self-serve · register and go" },
  { key: "q3", text: "Is value proven in a pilot, and does it need reach (2+ functions or regions, 500+ users), hub capacity, or €200k to €1m?", yesTo: "T2 · Scale (otherwise T3 · Fast lane)" },
] as const;

const MODES = ["Mode 1 · Do it for me", "Mode 2 · Do it with me", "Mode 3 · Enable me"];
const MODE_INFO = [
  { title: "Mode 1 · Do it for me", text: "Nothing to build on the business side. The hub builds and runs it." },
  { title: "Mode 2 · Do it with me", text: "Some work: a shared build between the function and the hub." },
  { title: "Mode 3 · Enable me", text: "Most of the work: the function builds, with the hub's platform, standards and coaching." },
];

type Answer = boolean | null;
export interface SupportPreset { screen?: "role" | "tier" | "sheet"; role?: RoleId; tier?: AnyTier }

const chip = (k: (typeof KIND)[Kind]): React.CSSProperties => ({
  background: k.bg, color: k.fg, border: `1px ${k.dash ? "dashed" : "solid"} ${k.bd}`,
});

export const SupportView: React.FC<{ preset?: SupportPreset }> = ({ preset }) => {
  const roleIndex = preset?.role ? Math.max(0, SUPPORT_ROLES.findIndex((r) => r.id === preset.role)) : 0;
  const [screen, setScreen] = useState<"role" | "tier" | "sheet">(preset?.screen ?? "role");
  const [role, setRole] = useState(roleIndex);
  const [ans, setAns] = useState<{ q1: Answer; q2: Answer; q3: Answer }>({ q1: null, q2: null, q3: null });
  const [forcedTier, setForcedTier] = useState<AnyTier | null>(preset?.tier ?? null);
  const [mode, setMode] = useState(1);
  const [info, setInfo] = useState(false);

  let tier: AnyTier | null = forcedTier;
  if (!tier) {
    if (ans.q1 === true) tier = "T1";
    else if (ans.q1 === false && ans.q2 === true) tier = "SS";
    else if (ans.q1 === false && ans.q2 === false && ans.q3 === true) tier = "T2";
    else if (ans.q1 === false && ans.q2 === false && ans.q3 === false) tier = "T3";
  }
  const T = TIERS[tier ?? "T1"];
  const tk: TierId = tier && tier !== "SS" ? tier : "T1";
  const R = SUPPORT_ROLES[role];

  const answer = (i: number, v: boolean) => {
    setForcedTier(null);
    setAns((a) => (i === 0 ? { q1: v, q2: null, q3: null } : i === 1 ? { ...a, q2: v, q3: null } : { ...a, q3: v }));
  };
  const visible = [true, ans.q1 === false, ans.q1 === false && ans.q2 === false];

  const kinds = STAGES.map(([s]) => R.stages[s][tk][0]);
  const hasV = kinds.includes("v"), hasW = kinds.includes("w");
  const ssK = KIND[R.ss[0]];
  const badge = tier === "SS" ? ssK.label : hasV && hasW ? "You validate and do the work" : hasV ? "You validate" : hasW ? "You do the work" : "You are consulted";

  const btnBase = "min-h-[44px] rounded-[10px] px-5 text-[15px] font-bold";
  const on = "border border-opella-forest bg-opella-forest text-white";
  const off = "border border-[#B9BDB5] bg-white text-[#14261D]";
  const steps: ["role" | "tier" | "sheet", string][] = [["role", "Your role"], ["tier", "The tier"], ["sheet", "Your one-pager"]];

  return (
    <div className="min-h-full bg-[#F4F3EE] text-[#14261D]">
      <main className="mx-auto flex max-w-[1160px] flex-col gap-7 px-6 pb-16 pt-10">
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.1em] text-opella-forest">Support employee experience</p>
          <h1 className="mb-2.5 text-[34px] font-bold leading-tight tracking-tight">What do you need to do, and when?</h1>
          <p className="max-w-[680px] text-base leading-relaxed text-[#55605A]">Answer two questions to get your one-pager: your role, then the tier of the use case.</p>
        </section>

        <ol aria-label="Progress" className="flex flex-wrap gap-2">
          {steps.map(([id, label], i) => {
            const active = id === screen;
            const reach = i === 0 || (i === 1 && screen !== "role") || (i === 2 && !!tier && screen !== "role");
            return (
              <li key={id}>
                <button onClick={() => reach && setScreen(id)} className={`inline-flex min-h-[44px] items-center gap-2.5 rounded-full px-4 text-sm font-semibold ${active ? on : off}`}>
                  <span className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-xs font-bold ${active ? "bg-white text-opella-forest" : "bg-[#E4EFE7] text-opella-forest"}`}>{i + 1}</span>
                  {label}
                </button>
              </li>
            );
          })}
        </ol>

        {screen === "role" && (
          <section aria-label="Choose your role">
            <h2 className="mb-4 text-[22px] font-bold tracking-tight">1. Which role do you play?</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {SUPPORT_ROLES.map((r, i) => (
                <button key={r.id} onClick={() => { setRole(i); setScreen("tier"); }}
                  className="flex min-h-[150px] flex-col items-start gap-2.5 rounded-2xl border-2 border-opella-border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="text-[19px] font-bold leading-tight">{r.name}</span>
                  <span className="text-sm leading-normal text-[#55605A]">{r.blurb}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-bold text-opella-forest">Select <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === "tier" && (
          <section aria-label="Find the tier" className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[22px] font-bold tracking-tight">2. What is the tier of the use case?</h2>
              <span className="text-sm text-[#55605A]">Role: <strong className="text-[#14261D]">{R.name}</strong></span>
            </div>
            <div className="flex flex-col gap-3">
              {QUESTIONS.map((q, i) => visible[i] && (
                <div key={q.key} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-opella-border bg-white px-6 py-[22px]">
                  <div className="min-w-0 flex-[1_1_560px]">
                    <p className="mb-1 text-xs font-bold tracking-[.1em] text-[#55605A]">QUESTION {i + 1}</p>
                    <p className="text-[17px] leading-normal">{q.text}</p>
                    <p className="mt-1.5 text-[13px] text-[#55605A]">Yes leads to: <strong className="text-[#14261D]">{q.yesTo}</strong></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => answer(i, true)} className={`${btnBase} min-w-[84px] ${ans[q.key] === true ? on : off}`}>Yes</button>
                    <button onClick={() => answer(i, false)} className={`${btnBase} min-w-[84px] ${ans[q.key] === false ? on : off}`}>No</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-[#C4B5FD] bg-[#EDE9FE] px-[18px] py-3.5 text-sm leading-normal text-[#3B1F8A]">
              <strong>In parallel, for every idea:</strong> the risk self-assessment sets the OR.AI tier. Low: standard guardrails. Medium: light review within 5 days. High: full review before any real data.
            </div>
            {tier && (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl px-7 py-6 text-white" style={{ background: T.color }}>
                <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-1.5">
                  <p className="text-xs font-bold tracking-[.1em] opacity-85">YOUR TIER</p>
                  <p className="text-[26px] font-bold tracking-tight">{T.title}</p>
                  <p className="text-[15px] leading-normal opacity-90">{T.rule}</p>
                </div>
                <button onClick={() => setScreen("sheet")} className="inline-flex min-h-[48px] items-center gap-2 rounded-[10px] bg-white px-6 text-[15px] font-bold text-[#14261D]">
                  Show my one-pager <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2.5 text-sm text-[#55605A]">
              <span>I already know the tier:</span>
              {(["T1", "T2", "T3", "SS"] as AnyTier[]).map((k) => (
                <button key={k} onClick={() => { setForcedTier(k); setScreen("sheet"); }} className="min-h-[40px] rounded-full border border-[#B9BDB5] bg-white px-4 text-sm font-semibold text-[#14261D]">
                  {TIERS[k].title}
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === "sheet" && (
          <section aria-label="Your one-pager" className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 rounded-[20px] border border-opella-border bg-white p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-[1_1_520px]">
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-[.1em] text-[#55605A]">Your one-pager</p>
                  <h2 className="mb-2 text-[32px] font-bold leading-tight tracking-tight">{R.full}</h2>
                  <p className="max-w-[640px] text-base leading-normal text-[#55605A]">{R.mission}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="rounded-full border border-[#B7D3C0] bg-[#E4EFE7] px-3.5 py-1.5 text-[13px] font-bold text-opella-forest">{badge}</span>
                  <span className="rounded-full px-3.5 py-1.5 text-[13px] font-bold text-white" style={{ background: T.color }}>{T.title}</span>
                  <span className="flex gap-3.5 text-[13px]">
                    <button onClick={() => setScreen("role")} className="py-1.5 font-semibold text-opella-forest underline">Change role</button>
                    <button onClick={() => setScreen("tier")} className="py-1.5 font-semibold text-opella-forest underline">Change tier</button>
                  </span>
                </div>
              </div>
              <p className="rounded-[10px] bg-[#F4F3EE] px-4 py-3 text-sm leading-normal"><strong>{T.short}:</strong> {T.note}</p>
              {tier !== "SS" && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[13px] font-bold text-[#55605A]">Delivery mode</span>
                    <div role="group" aria-label="Delivery mode" className="flex flex-wrap gap-1.5">
                      {MODES.map((m, i) => (
                        <button key={m} onClick={() => setMode(i)} aria-pressed={i === mode} className={`min-h-[44px] rounded-[10px] px-4 text-sm font-semibold ${i === mode ? on : off}`}>{m}</button>
                      ))}
                    </div>
                    <button onClick={() => setInfo(!info)} aria-label="Explain the three modes" aria-expanded={info}
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${info ? on : "border border-[#B9BDB5] bg-white text-opella-forest"}`}>
                      <Info className="h-[18px] w-[18px]" aria-hidden="true" />
                    </button>
                  </div>
                  {info && (
                    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                      {MODE_INFO.map((mi) => (
                        <div key={mi.title} className="rounded-xl border border-opella-border bg-[#FAF9F5] px-4 py-3.5">
                          <p className="mb-1 text-sm font-bold">{mi.title}</p>
                          <p className="text-sm leading-snug text-[#55605A]">{mi.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm leading-normal"><strong>In {MODES[mode]}:</strong> {R.modes[mode]}</p>
                </div>
              )}
            </div>

            {tier !== "SS" ? (
              <>
                <div className="flex flex-col gap-5 rounded-[20px] border border-opella-border bg-white p-7">
                  <h3 className="text-lg font-bold">When you interact</h3>
                  <ol aria-label="Lifecycle stages" className="grid grid-cols-4 gap-2 md:grid-cols-8">
                    {STAGES.map(([s, sub]) => {
                      const k = KIND[R.stages[s][tk][0]];
                      return (
                        <li key={s} className="flex min-h-[112px] flex-col gap-1 rounded-xl p-3" style={{ background: k.bg, color: k.fg, border: `2px ${k.dash ? "dashed" : "solid"} ${k.bd}` }}>
                          <span className="text-[15px] font-bold">{s}</span>
                          <span className="text-xs opacity-90">{sub}</span>
                          <span className="mt-auto text-xs font-bold">{k.label}</span>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="flex flex-wrap gap-[18px] text-[13px] text-[#55605A]">
                    {(["v", "w", "c", "i", "n"] as Kind[]).map((k) => (
                      <span key={k} className="inline-flex items-center gap-2">
                        <span className="h-3.5 w-3.5 rounded" style={{ background: KIND[k].bg, border: `2px ${KIND[k].dash ? "dashed" : "solid"} ${KIND[k].bd}` }} />
                        {KIND[k].label}
                      </span>
                    ))}
                  </div>
                  <div className="overflow-x-auto rounded-[14px] border border-opella-border">
                    <div className="min-w-[980px]">
                      <div className="grid grid-cols-[150px_150px_minmax(0,1fr)_200px_200px] bg-[#F4F3EE] text-xs font-bold uppercase tracking-[.08em] text-[#55605A]">
                        {["Stage", "Your role", "What you do", "With whom", "Where"].map((h) => <span key={h} className="px-4 py-3">{h}</span>)}
                      </div>
                      {STAGES.map(([s, , long]) => {
                        const [k, what, withWhom] = R.stages[s][tk];
                        const K = KIND[k];
                        return (
                          <div key={s} className={`grid grid-cols-[150px_150px_minmax(0,1fr)_200px_200px] border-t border-opella-border ${k === "n" ? "bg-[#FAF9F5] text-[#55605A]" : "bg-white"}`}>
                            <span className="px-4 py-3.5 text-sm font-bold">{long}</span>
                            <span className="px-4 py-3.5"><span className="inline-block rounded-full px-2.5 py-1 text-xs font-bold" style={chip(K)}>{K.label}</span></span>
                            <span className="px-4 py-3.5 text-sm leading-normal">{k === "n" ? "Not involved." : what}</span>
                            <span className="px-4 py-3.5 text-sm leading-normal text-[#55605A]">{withWhom}</span>
                            <span className="px-4 py-3.5 text-sm leading-normal text-[#55605A]">{k === "n" ? "" : FORUM[s][tk]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-opella-border bg-white p-[22px]">
                    <h3 className="mb-3 text-[13px] font-bold uppercase tracking-[.08em] text-opella-forest">You decide on</h3>
                    <ul className="flex flex-col gap-2.5 text-[15px] leading-snug">
                      {R.decide.map((t) => <li key={t} className="flex gap-2.5"><span className="mt-[7px] h-2 w-2 flex-none rotate-45 bg-opella-forest" />{t}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-opella-border bg-white p-[22px]">
                    <h3 className="mb-3 text-[13px] font-bold uppercase tracking-[.08em] text-[#6B3A00]">You produce</h3>
                    <ul className="flex flex-col gap-2.5 text-[15px] leading-snug">
                      {R.produce.map((t) => <li key={t} className="flex gap-2.5"><span className="mt-[7px] h-2 w-2 flex-none rounded-full bg-[#D9A441]" />{t}</li>)}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3.5 rounded-[20px] border border-opella-border bg-white p-7">
                <h3 className="text-lg font-bold">When you interact</h3>
                <p className="text-[15px] leading-normal text-[#55605A]">Self-serve has no committee at any level. Agents screen and monitor each request, and the function head approves. What remains: one registry line, guardrail checks and a quarterly value pulse.</p>
                <div className="flex flex-wrap items-center gap-3 rounded-[14px] border border-opella-border px-5 py-4">
                  <span className="inline-block rounded-full px-2.5 py-1 text-xs font-bold" style={chip(ssK)}>{ssK.label}</span>
                  <span className="flex-[1_1_400px] text-[15px] leading-normal">{R.ss[1]}</span>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};
