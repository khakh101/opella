import { IntakeAnswers, Tier, RiskTier, DeliveryMode } from "@/types";
import { TIER_CONFIG, DELIVERY_MODES_INFO } from "./constants";

export interface DecisionResult {
  tier: Tier;
  mode: DeliveryMode;
  riskTier: RiskTier;
  reasoning: string[];
  riskReasons: string[];
  speedSummary: {
    cadence: string;
    decisionSLA: string;
    approvalForum: string;
    fundingMechanism: string;
    trackingRequired: string;
    sponsorLevel: string;
    gateSequence: string[];
    isFastTrack: boolean;
  };
}

export function evaluateIntake(answers: IntakeAnswers): DecisionResult {
  const reasoning: string[] = [];
  const riskReasons: string[] = [];

  // 1. Evaluate ORAI Risk Tier
  let riskTier: RiskTier = "Low";

  if (answers.risk_personalHealthData) {
    riskTier = "High";
    riskReasons.push("Processes personal, health, patient, or confidential data (EU AI Act High Risk flag).");
  }
  if (answers.risk_autonomousDecisions) {
    riskTier = "High";
    riskReasons.push("Makes autonomous or high-stakes decisions impacting employment, health, or critical ops.");
  }

  if (riskTier !== "High") {
    if (answers.risk_coreProdWriteBack) {
      riskTier = "Medium";
      riskReasons.push("Direct read/write to core production systems requires architecture & cyber vetting.");
    }
    if (answers.risk_externalOutputNoReview) {
      riskTier = "Medium";
      riskReasons.push("Unreviewed external communication presents brand and compliance liability.");
    }
    if (answers.risk_unapprovedSaaSOrCustomModel) {
      riskTier = "Medium";
      riskReasons.push("New external SaaS / unapproved model requires Design Authority fit check.");
    }
  }

  if (riskReasons.length === 0) {
    riskReasons.push("No sensitive data, no production write-backs, and standard approved tools used.");
  }

  // 2. Evaluate Tier (The 4 Questions from Slide 35)
  let tier: Tier = "T3";

  if (answers.q1_bigBetOrOver1m || answers.estimatedCost > 1000000 || answers.mappedBigBet) {
    tier = "T1";
    reasoning.push(
      "Matched Q1: Part of an AmplifAI Big Bet, alters Butterfly core platforms/scope, or budget exceeds €1M."
    );
  } else if (
    answers.q2_approvedToolsUnder50k &&
    answers.estimatedCost <= 50000 &&
    riskTier !== "High" &&
    answers.targetUserCount < 100
  ) {
    tier = "Self-Serve";
    reasoning.push(
      "Matched Q2: Uses only approved tools and data, configured rather than built, under €50k, low/medium risk."
    );
  } else if (
    answers.q3_provenPilotOrReach ||
    answers.estimatedCost >= 200000 ||
    answers.targetUserCount >= 500
  ) {
    tier = "T2";
    reasoning.push(
      "Matched Q3: Enterprise scale with proven pilot, cross-functional reach (2+ functions / 500+ users), or €200k–€1M envelope."
    );
  } else {
    tier = "T3";
    reasoning.push(
      "Matched Q4: Fast Lane exploration or MVP test within one single function and under €200k budget envelope."
    );
  }

  // Edge-case rule from Slide 38: High risk automatically routes out of Fast Lane
  if (tier === "T3" && riskTier === "High") {
    tier = "T1";
    reasoning.push(
      "Governance Override: High ORAI risk rating automatically routes initiative out of Fast Lane into T1 Transform governance."
    );
  }

  // 3. Determine Delivery Mode (Slides 10, 11, 46, 76)
  let mode: DeliveryMode = "Mode 2";

  if (tier === "Self-Serve") {
    mode = "Self-Service AI";
  } else if (answers.fundingSource === "Function Budget" && answers.functionTechCapacity === "High") {
    mode = "Mode 3";
  } else if (answers.functionTechCapacity === "None" || answers.techComplexity === "High") {
    mode = "Mode 1";
  } else {
    // Balanced or co-funded
    mode = "Mode 2";
  }

  // 4. Formulate Speed & Governance Summary
  const config = TIER_CONFIG[tier];
  const isFastTrack = tier === "Self-Serve" || tier === "T3";

  const gateSequence =
    tier === "Self-Serve"
      ? ["G1 (Automatic Check)", "Direct Build", "Quarterly Pulse (G6)"]
      : ["G1 (Need)", "G2 (Feasibility)", "G3 (Priority)", "G4 (Mode/Budget -> GO BUILD)", "G5 (Scale Gate)", "G6 (Run/Maintain)"];

  return {
    tier,
    mode,
    riskTier,
    reasoning,
    riskReasons,
    speedSummary: {
      cadence: config.speedCadence,
      decisionSLA:
        tier === "T3"
          ? "10 working days from canvas"
          : tier === "Self-Serve"
          ? "Immediate / Instant"
          : tier === "T2"
          ? "Biweekly board cycle"
          : "Monthly SteerCo cycle",
      approvalForum: config.approvalForum,
      fundingMechanism: config.fundingMechanism,
      trackingRequired: config.trackingRequired,
      sponsorLevel: config.sponsorLevel,
      gateSequence,
      isFastTrack,
    },
  };
}
