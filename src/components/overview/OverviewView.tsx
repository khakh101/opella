"use client";

import React from "react";
import { ArrowRight, Compass, Hand, Lightbulb, UserCheck, Users, Wrench, Zap } from "lucide-react";
import { MiroBoardView } from "@/components/MiroBoardView";

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
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div className="bg-[#F4F3EE] text-[#14261D]">
      <div className="mx-auto flex max-w-[1160px] flex-col gap-16 px-6 pb-10 pt-12">
        <section className="flex flex-col gap-[18px]">
          <p className="text-xs font-semibold uppercase tracking-[.1em] text-opella-forest">The AmplifAI operating model in one page</p>
          <h1 className="max-w-[820px] text-[42px] font-bold leading-[1.12] tracking-tight">One path for every AI idea at Opella, from first idea to measured value</h1>
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
        </section>

        <section aria-label="What it is" className="flex flex-col gap-5">
          <PartHeader n={3} id="what" title="What it is, at a glance" lede="Four pillars, then the principles and the lifecycle you can explore." />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[22px] font-bold tracking-tight">The lifecycle in 5 steps</h3>
            <span className="text-sm text-[#55605A]">The Miro, step by step</span>
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
