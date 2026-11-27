"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { BigBetId } from "@/types";
import { proposeStream } from "@/lib/streams";

export type HandoffKind = "g1" | "g2" | "g4";
type AnyTier = "T1" | "T2" | "T3" | "Self-Serve";

interface HandoffScreenProps {
  kind: HandoffKind;
  tier: AnyTier;
  bet?: BigBetId;
  functionName: string;
  modeLabel: string;
  onNext: () => void;
  onBack: () => void;
}

const BC_NAME: Record<AnyTier, string> = {
  T1: "full business case",
  T2: "light business case",
  T3: "one-page canvas",
  "Self-Serve": "registry line",
};

// Who validates G2: each support function, outside meetings
export const G2_VALIDATORS = (tier: AnyTier) =>
  tier === "T3"
    ? "Value officer (value hypothesis), P&C (light impact scan), LEX (OR.AI risk), Data & AI (tech and data readiness)"
    : "Value officer (value, with Finance), P&C (change impact, Butterfly template adjusted for AI), Adoption lead (adoption), LEX (OR.AI risk), Data & AI (tech and data readiness)";

export const BOARD = (tier: AnyTier) => `Portfolio board (${tier === "T1" ? "weekly" : "biweekly"})`;

const Gate: React.FC<{ id: string; agent?: boolean }> = ({ id, agent }) => (
  <span
    className={
      "inline-flex h-6 min-w-[34px] shrink-0 items-center justify-center rounded-md px-1.5 text-[11px] font-black " +
      (agent ? "border-2 border-dashed border-violet-500 bg-violet-50 text-violet-800" : "bg-pink-600 text-white")
    }
  >
    {id}
  </span>
);

const Row: React.FC<{ n: string; title: React.ReactNode; children: React.ReactNode }> = ({ n, title, children }) => (
  <li className="flex items-start gap-4 rounded-xl border border-[#9FC3AC] bg-[#FAF9F5] p-4">
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-opella-forest text-xs font-black text-white">{n}</span>
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2 text-[15px] font-bold text-gray-900">{title}</div>
      <div className="text-sm leading-relaxed text-gray-700">{children}</div>
    </div>
  </li>
);

const Validation: React.FC<{ gate: string; name: string; where: React.ReactNode; who: React.ReactNode }> = ({ gate, name, where, who }) => (
  <div className="space-y-2 rounded-xl border-[1.5px] border-[#2F6B4F] bg-white p-4">
    <div className="flex items-center gap-2">
      <Gate id={gate} />
      <span className="text-[15px] font-bold text-gray-900">{name}</span>
    </div>
    <p className="text-sm leading-relaxed"><span className="text-gray-500">Where: </span><strong className="text-gray-900">{where}</strong></p>
    <p className="text-sm leading-relaxed text-gray-800"><span className="text-gray-500">Who validates: </span>{who}</p>
  </div>
);

// Shown after each submit of the intake: what happens next, which committee, who validates.
// It is not a step of its own: it appears only after a submit.
export const HandoffScreen: React.FC<HandoffScreenProps> = ({ kind, tier, bet, functionName, modeLabel, onNext, onBack }) => {
  const ss = tier === "Self-Serve";
  const tierName = ss ? "Self-serve" : tier;
  const stream = proposeStream(bet, functionName);

  let kicker = "";
  let title = "";
  let badge = { text: "Waiting for validation", cls: "bg-pink-100 text-pink-800" };
  let body: React.ReactNode = null;
  let nextLabel = "";
  let backLabel = "";

  if (kind === "g1") {
    kicker = "Charter triaged by the agent · what happens now";
    title = `The agent proposes ${tierName}. The Transformation Office now validates it.`;
    badge = { text: "Proposal, not yet validated", cls: "bg-violet-100 text-violet-800" };
    nextLabel = `See the next step: ${BC_NAME[tier]}`;
    backLabel = "Back to the triage";
    body = (
      <ol className="space-y-3">
        <Row n="1" title={<><Gate id="G1" agent /> Need validated</>}>
          Validated automatically by the agent, then by the <strong>Transformation Office</strong>. No meeting.
        </Row>
        {ss ? (
          <Row n="2" title="Self-serve: no stream allocation, no meeting">
            You publish one registry line. Guardrails and the cost cap apply.
          </Row>
        ) : (
          <Row n="2" title="Stream allocation · your use case joins a Butterfly stream">
            Proposed stream: <strong>{stream.stream}</strong>. {stream.why} The comitology is organised by stream, so this stream&apos;s
            committees will review your use case. You can correct the stream with the Transformation Office.
          </Row>
        )}
        <Row n="3" title={`Then you build your ${BC_NAME[tier]}`}>
          {ss ? "The next step shows the registry line to fill." : "Each support function helps you with its part and validates it (G2). The next step shows what to fill."}
        </Row>
      </ol>
    );
  } else if (kind === "g2") {
    kicker = `${ss ? "Registry line" : "Business case"} submitted · what happens now`;
    if (ss) {
      title = "Your registry line is submitted. No meeting is needed.";
      badge = { text: "No meeting", cls: "bg-emerald-100 text-emerald-800" };
      body = (
        <p className="rounded-xl border border-[#9FC3AC] bg-[#FAF9F5] p-4 text-sm leading-relaxed text-gray-800">
          Self-serve skips G2 to G4. Guardrails and the cost cap apply; the Transformation Office sees the registry line and the quarterly value pulse.
        </p>
      );
    } else {
      title = `Your ${BC_NAME[tier]} now goes through two validations.`;
      body = (
        <div className="grid gap-3 md:grid-cols-2">
          <Validation gate="G2" name="Feasible" where="No meeting: each support function validates its part" who={G2_VALIDATORS(tier)} />
          <Validation
            gate="G3"
            name="Priority"
            where={
              tier === "T1" ? (
                <>{BOARD(tier)}, then SteerCo (monthly), which validates the use case. If it spans several streams: the AmplifAI cross stream meeting (optional)</>
              ) : (
                BOARD(tier)
              )
            }
            who="Transformation Office, with the Value officer's score and Data & AI's capacity"
          />
        </div>
      );
    }
    nextLabel = "See the next step: mode selection";
    backLabel = ss ? "Back to the registry line" : "Back to the business case";
  } else {
    kicker = "Mode proposal submitted · what happens now";
    if (ss) {
      title = "Self-service: no approval meeting.";
      badge = { text: "No meeting", cls: "bg-emerald-100 text-emerald-800" };
      body = (
        <p className="rounded-xl border border-[#9FC3AC] bg-[#FAF9F5] p-4 text-sm leading-relaxed text-gray-800">
          You can start once the registry line is published. The function configures the tool within the guardrails.
        </p>
      );
    } else {
      title = `Your mode proposal (${modeLabel}) now goes to the Portfolio board.`;
      body = (
        <div className="max-w-2xl">
          <Validation
            gate="G4"
            name="Mode and budget"
            where={BOARD(tier)}
            who="Mainly the Transformation Office and the Data & AI office, supported by the other functions (Value officer, LEX, Adoption lead)"
          />
        </div>
      );
    }
    nextLabel = `See the next step for ${modeLabel}`;
    backLabel = "Back to mode selection";
  }

  return (
    <section aria-label="What happens now" className="space-y-5 rounded-2xl border-2 border-[#2F6B4F] bg-white p-6 shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-opella-forest">{kicker}</p>
          <h2 className="mt-1 text-xl font-black text-opella-forest">{title}</h2>
        </div>
        <span className={"rounded-full px-3 py-1 text-xs font-bold " + badge.cls}>{badge.text}</span>
      </div>
      {body}
      <div className="flex flex-wrap justify-between gap-3 border-t border-opella-border pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {backLabel}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-opella-forest px-6 text-sm font-bold text-white shadow-sm hover:bg-opella-emerald"
        >
          {nextLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
