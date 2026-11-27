// Butterfly streams and the proposed lead stream per big bet.
// Source: Opella deck, slide 43 "Big bets plug into the existing Butterfly streams, since the comitology
// is organised by stream" (illustrative, to decide with Opella). Abbreviations kept as on the slide;
// CxA, CEX, RGM, IBP and ERP are not spelled out there.

import type { BigBetId } from "@/types";

export const BUTTERFLY_STREAMS: { id: string; label: string }[] = [
  { id: "CxA", label: "CxA" },
  { id: "CEX", label: "CEX" },
  { id: "E-com", label: "E-com" },
  { id: "RGM", label: "RGM" },
  { id: "IBP", label: "IBP" },
  { id: "Proc.", label: "Procurement" },
  { id: "M&Q", label: "Manufacturing & Quality" },
  { id: "Science", label: "Science" },
  { id: "Finance", label: "Finance" },
  { id: "Treas.", label: "Treasury" },
  { id: "P&C", label: "P&C" },
  { id: "D&AI", label: "Data & AI" },
  { id: "Tech & Cyber", label: "Technology, Architecture & Cyber" },
  { id: "ERP", label: "ERP" },
];

export interface BetStream {
  bet: string;
  lead: string;
  confidence: string;
  note: string;
}

export const BET_STREAMS: Record<BigBetId, BetStream> = {
  BET_1: { bet: "Win the Consumer Journey", lead: "CxA + E-com", confidence: "65%", note: "CxA overlaps all 6 use cases." },
  BET_2: { bet: "Win the Innovation", lead: "Science (proposal)", confidence: "55%", note: "Not in the mapping yet; claims, formulation and dossiers are R&D and regulatory work." },
  BET_3: { bet: "Win the Trade", lead: "CEX + RGM", confidence: "55%", note: "CEX overlaps 4 of 5 use cases; the TPM agent overlaps RGM programs." },
  BET_4: { bet: "Forecast to planning", lead: "IBP", confidence: "85%", note: "IBP overlaps 9 of 12 use cases; CxA also 4 (forecasting)." },
  BET_5: { bet: "Augmented plants", lead: "M&Q", confidence: "85%", note: "M&Q links to 6 of 7 use cases; ERP and IBP contribute." },
  BET_6: { bet: "Business partner function process reshapes", lead: "Proc. + Finance + D&AI", confidence: "50%", note: "P2P and legal: Procurement; R2R: Finance; GBS agents: D&AI." },
};

// Stream proposed for a use case outside the big bets, from the function in the charter.
const BY_FUNCTION: Record<string, string> = {
  Procurement: "Proc.",
  "Supply Chain": "IBP",
  Science: "Science",
  Manufacturing: "M&Q",
  Finance: "Finance",
  "P&C": "P&C",
  "M&S": "CxA, CEX or E-com (to confirm with the TO)",
  "Cross-Functional": "Several streams: lead stream to agree, cross stream meeting optional",
};

export function proposeStream(bet: BigBetId | undefined, functionName: string): { stream: string; why: string } {
  if (bet) {
    const b = BET_STREAMS[bet];
    return { stream: b.lead, why: `Lead stream of the big bet "${b.bet}" (indicative, ${b.confidence} confidence).` };
  }
  return { stream: BY_FUNCTION[functionName] ?? "To agree with the TO", why: `Not part of a big bet: the stream of your function (${functionName}).` };
}
