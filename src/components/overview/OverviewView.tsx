"use client";

import React, { useState } from "react";
import { ArrowRight, Compass, Hand, Info, Lightbulb, UserCheck, Users, Wrench, Zap } from "lucide-react";
import { MiroBoardView } from "@/components/MiroBoardView";
import { MODE_INFO, TIERS } from "@/components/support/SupportView";
import { AnyTier } from "@/lib/supportModel";

const GAINS = [
  { icon: Lightbulb, title: "You can develop your ideas easily", text: "Describe your idea once. An agent helps fill in the request and proposes the right path." },
  { icon: Users, title: "You can leverage technical employees", text: "Data & AI and AI builders help turn your use case idea into a working solution." },
  { icon: Zap, title: "You can build a POC fast, with low- or no-code tools", text: "Test your value hypothesis first. The deeper viability check comes before scaling, not before trying." },
  { icon: Compass, title: "You know your path in minutes", text: "The agent triage sets your tier and speed. Low-risk ideas under €50k need no committee." },
  { icon: Wrench, title: "Tools and agents help you go faster", text: "New tools and agents are being created to develop use cases faster and more efficiently. You will discover them along the way." },
];

const PRINCIPLES = [
  "Delivery is federated by default through three use-case-driven modes",
  "The roles required will change based on the delivery mode",
  "Three tiers and a self service allowing a faster build of a POC/MVP, while further assessment regarding the use case's viability will be made before scaling",
  "6 gates allowing a prioritization by value, complexity while the governance remains respected",
  "The governance spine reuses and adapts the Butterfly comitology and business cases templates",
  "Process reshape will be reviewed before optimization will be made",
  "AI agents is structurally integrated into the process to sustain and accelerate AI momentum",
];

const PartHeader: React.FC<{ n: number; id: string; title: string; lede: string }> = ({ n, id, title, lede }) => (
  <div id={id} className="flex scroll-mt-24 items-center gap-4 border-t-2 border-opella-forest pt-6">
    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-opella-forest text-lg font-bold text-white">{n}</span>
    <div>
      <h2 className="text-[30px] font-bold tracking-tight text-[#14261D]">{title}</h2>
      <p className="mt-1 text-base text-[#55605A]">{lede}</p>
    </div>
  </div>
);

interface OverviewViewProps {
  onGoToSupport: () => void;
  miroFocus?: string; // detail to open on the Miro board (deep link from the Q&A)
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onGoToSupport, miroFocus }) => {
  const [openInfo, setOpenInfo] = useState<"modes" | "tiers" | null>(null);
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div className="bg-[#F4F3EE] text-[#14261D]">
      <div className="mx-auto flex max-w-[1160px] flex-col gap-16 px-6 pb-10 pt-12">
        <section className="flex flex-col gap-[18px]">
          <p className="text-xs font-semibold uppercase tracking-[.1em] text-opella-forest">The AmplifAI operating model in one page</p>
          <h1 className="max-w-[820px] text-[42px] font-bold leading-[1.12] tracking-tight">One path for every AI idea at Opella, from first idea to measured value</h1>
          <button onClick={() => jump("what")} className="inline-flex w-fit min-h-[44px] items-center gap-2.5 rounded-full border border-[#D9A441] bg-[#FFF1D6] px-[18px] py-2.5 text-sm font-semibold text-[#6B3A00] transition hover:-translate-y-0.5 hover:shadow-md">
            <Hand className="h-[18px] w-[18px]" aria-hidden="true" /> Click any step to deep dive
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <nav aria-label="On this page" className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[["why", "Why an operating model?"], ["how", "How we built it"], ["what", "What it is, at a glance"]].map(([id, label], i) => (
              <button key={id} onClick={() => jump(id)} className="flex min-h-[44px] items-center gap-3 rounded-[14px] border border-opella-border bg-white px-[18px] py-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-opella-forest font-bold text-white">{i + 1}</span>
                <span className="text-base font-bold">{label}</span>
              </button>
            ))}
          </nav>
        </section>

        <section aria-label="Why an operating model" className="flex flex-col gap-7">
          <PartHeader n={1} id="why" title="Why an operating model?" lede="What we found at Opella, and what the new model gives you." />
          <div>
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[22px] font-bold tracking-tight">What you gain</h3>
              <span className="text-sm text-[#55605A]">What you get from using it</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {GAINS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex flex-col gap-3 rounded-2xl border border-opella-border bg-white p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E4EFE7]"><Icon className="h-6 w-6 text-opella-forest" aria-hidden="true" /></span>
                  <h4 className="text-lg font-bold leading-snug">{title}</h4>
                  <p className="text-[15px] leading-relaxed text-[#55605A]">{text}</p>
                </div>
              ))}
              <button onClick={onGoToSupport} className="flex flex-col gap-3 rounded-2xl bg-opella-forest p-6 text-left text-white transition hover:-translate-y-0.5 hover:shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><UserCheck className="h-6 w-6" aria-hidden="true" /></span>
                <span className="text-lg font-bold leading-snug">Not submitting an idea? Your role is explained too</span>
                <span className="text-[15px] leading-relaxed text-[#DDEBE1]">If you support, review or validate use cases, see what you do and when.</span>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold">Go to support roles <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
              </button>
            </div>
          </div>
        </section>

        <section aria-label="How we built it" className="flex flex-col gap-5">
          <PartHeader n={2} id="how" title="How we built it" lede="Four stages with Opella's teams, from diagnosis to a real-life test." />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[22px] font-bold tracking-tight">Guiding principles</h3>
            <span className="text-sm text-[#55605A]">What makes this process different</span>
          </div>
          <ol className="flex flex-col gap-3">
            {PRINCIPLES.map((p, i) => (
              <li key={p} className="flex items-start gap-4 rounded-[14px] border border-opella-border bg-white p-5">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-opella-forest text-sm font-bold text-white">{i + 1}</span>
                <span className="text-base leading-normal">{p}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {([["modes", "Click to see the 3 delivery modes"], ["tiers", "Click to see the tiers and self-serve"]] as const).map(([k, label]) => (
                <button key={k} onClick={() => setOpenInfo(openInfo === k ? null : k)} aria-expanded={openInfo === k}
                  className={`inline-flex min-h-[44px] items-center gap-2.5 rounded-full border px-[18px] py-2.5 text-sm font-semibold transition ${openInfo === k ? "border-opella-forest bg-opella-forest text-white" : "border-[#D9A441] bg-[#FFF1D6] text-[#6B3A00] hover:-translate-y-0.5 hover:shadow-md"}`}>
                  <Info className="h-[18px] w-[18px]" aria-hidden="true" /> {label}
                </button>
              ))}
            </div>
            {openInfo === "modes" && (
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                {MODE_INFO.map((mi) => (
                  <div key={mi.title} className="rounded-xl border border-opella-border bg-white px-4 py-3.5">
                    <p className="mb-1 text-sm font-bold">{mi.title}</p>
                    <p className="text-sm leading-snug text-[#55605A]">{mi.text}</p>
                    {mi.title.includes("Enable me") && <p className="mt-1.5 text-sm leading-snug text-[#55605A]">Self-service sits inside this mode.</p>}
                  </div>
                ))}
              </div>
            )}
            {openInfo === "tiers" && (
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
                {(["T1", "T2", "T3", "SS"] as AnyTier[]).map((k) => (
                  <div key={k} className="flex flex-col gap-2 rounded-xl border border-opella-border bg-white px-4 py-3.5" style={{ borderTop: `4px solid ${TIERS[k].color}` }}>
                    <span className="self-start rounded-md px-2 py-0.5 text-[13px] font-extrabold text-white" style={{ background: TIERS[k].color }}>{TIERS[k].title}</span>
                    <p className="text-sm leading-snug"><strong>When:</strong> {TIERS[k].rule}</p>
                    <p className="text-sm leading-snug text-[#55605A]">{TIERS[k].note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section aria-label="What it is" className="flex flex-col gap-5">
          <PartHeader n={3} id="what" title="What it is, at a glance" lede="Four pillars, then the principles and the lifecycle you can explore." />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[22px] font-bold tracking-tight">The lifecycle in 5 steps</h3>
          </div>
          <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-[#D9A441] bg-[#FFF1D6] px-[18px] py-2.5 text-sm font-semibold text-[#6B3A00]">
            <Hand className="h-[18px] w-[18px]" aria-hidden="true" /> Click any step to deep dive
          </div>
        </section>
      </div>
      <div className="border-y border-opella-border bg-[#f7f5ef]">
        <MiroBoardView initialView={miroFocus === "stream" ? "framing" : undefined} initialDetail={miroFocus} />
      </div>
      <div className="mx-auto max-w-[1160px] px-6 py-6 text-[13px] text-[#55605A]">
        Previous version of the site: <a href="/legacy" className="font-semibold text-opella-forest underline">available on a separate legacy route</a>.
      </div>
    </div>
  );
};
