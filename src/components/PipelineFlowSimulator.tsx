"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sliders,
  TrendingUp,
  Zap,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  GitBranch,
  Play,
  Pause,
  FastForward,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";

// --- Types & Interfaces ---
export type ScenarioId = "low" | "medium" | "high" | "custom";

export interface SimulationAssumptions {
  incomingPerWeek: number;
  acceptanceRateG1: number; // % passing G1 (AI Charter intake)
  g4PassRate: number; // % passing G4 to GO BUILD
  postMvpPromotionRate: number; // % of T3 & T4 promoted to T2 Scale AFTER MVP build at Gate G5
  t1Split: number; // % Transform
  t2Split: number; // % Scale
  t3Split: number; // % Fast Lane
  selfServeSplit: number; // % T4 Self-Service (Always sums to 100%!)
  returnFromRunRate: number; // % of run use cases returning for major modification
  activeInRunCount: number;

  // Committee Capacities (review slots per meeting)
  steerCoCapacity: number; // monthly (every 4 weeks)
  portfolioBoardCapacity: number; // fortnightly (every 2 weeks)
  ddaCapacity: number; // weekly (every 1 week)

  // Estimated Days to pass each gate (base assumptions)
  g1LeadDays: number;
  g2T1LeadDays: number;
  g2T2LeadDays: number;
  g3T1LeadDays: number;
  g3T2LeadDays: number;
  g4T1LeadDays: number;
  g4T2LeadDays: number;
  g4T3LeadDays: number;
  mvpBuildWeeks: number;
  g5LeadWeeks: number;
}

// Preset Scenarios (Always normalized to sum exactly to 100%)
const PRESET_SCENARIOS: Record<
  "low" | "medium" | "high",
  {
    name: string;
    description: string;
    badge: string;
    assumptions: SimulationAssumptions;
  }
> = {
  low: {
    name: "Low Volume (Smooth Flow)",
    description: "Conservative intake (~3–4 UC/week). All governance forums review initiatives within 1 meeting cycle with zero comitology delay.",
    badge: "Low · Balanced Flow",
    assumptions: {
      incomingPerWeek: 3.5,
      acceptanceRateG1: 80,
      g4PassRate: 85,
      postMvpPromotionRate: 15,
      t1Split: 15,
      t2Split: 35,
      t3Split: 35,
      selfServeSplit: 15, // 15 + 35 + 35 + 15 = 100%
      returnFromRunRate: 8,
      activeInRunCount: 16,
      steerCoCapacity: 3,
      portfolioBoardCapacity: 6,
      ddaCapacity: 6,
      g1LeadDays: 1,
      g2T1LeadDays: 14,
      g2T2LeadDays: 10,
      g3T1LeadDays: 18,
      g3T2LeadDays: 10,
      g4T1LeadDays: 14,
      g4T2LeadDays: 10,
      g4T3LeadDays: 5,
      mvpBuildWeeks: 8,
      g5LeadWeeks: 3,
    },
  },
  medium: {
    name: "Medium Volume (Opella Baseline)",
    description: "Expected steady-state intake (~8–9 UC/week). Transformation SteerCo experiences agenda pressure, creating a backlog exceeding 1 monthly meeting cycle.",
    badge: "Medium · Baseline",
    assumptions: {
      incomingPerWeek: 8.5,
      acceptanceRateG1: 85,
      g4PassRate: 80,
      postMvpPromotionRate: 20,
      t1Split: 20,
      t2Split: 35,
      t3Split: 30,
      selfServeSplit: 15, // 20 + 35 + 30 + 15 = 100%
      returnFromRunRate: 12,
      activeInRunCount: 24,
      steerCoCapacity: 3,
      portfolioBoardCapacity: 6,
      ddaCapacity: 6,
      g1LeadDays: 1,
      g2T1LeadDays: 21,
      g2T2LeadDays: 14,
      g3T1LeadDays: 28,
      g3T2LeadDays: 14,
      g4T1LeadDays: 21,
      g4T2LeadDays: 14,
      g4T3LeadDays: 7,
      mvpBuildWeeks: 10,
      g5LeadWeeks: 4,
    },
  },
  high: {
    name: "High Volume (Surge Stress Test)",
    description: "Surge intake (16–20 UC/week). SteerCo and Portfolio Board agendas are overwhelmed; wait times stretch across 2+ consecutive meeting cycles (severe bottleneck).",
    badge: "High · Severe Bottleneck",
    assumptions: {
      incomingPerWeek: 18.0,
      acceptanceRateG1: 88,
      g4PassRate: 75,
      postMvpPromotionRate: 25,
      t1Split: 25,
      t2Split: 35,
      t3Split: 25,
      selfServeSplit: 15, // 25 + 35 + 25 + 15 = 100%
      returnFromRunRate: 15,
      activeInRunCount: 32,
      steerCoCapacity: 3,
      portfolioBoardCapacity: 7,
      ddaCapacity: 7,
      g1LeadDays: 2,
      g2T1LeadDays: 35,
      g2T2LeadDays: 21,
      g3T1LeadDays: 42,
      g3T2LeadDays: 21,
      g4T1LeadDays: 35,
      g4T2LeadDays: 21,
      g4T3LeadDays: 10,
      mvpBuildWeeks: 12,
      g5LeadWeeks: 6,
    },
  },
};

// Simulation Particle Definition
interface Particle {
  id: string;
  tier: "T1" | "T2" | "T3" | "T4";
  color: string;
  glowColor: string;
  x: number;
  y: number;
  radius: number;
  passG1: boolean;
  passG4: boolean;
  isPromoted: boolean; // For T3/T4 after MVP
  stage:
    | "SPAWN"
    | "TO_G1"
    | "G1_FILTER"
    | "TO_G2"
    | "WAIT_STEERCO"
    | "WAIT_BOARD"
    | "TO_G4"
    | "G4_FILTER"
    | "TO_BUILD"
    | "IN_BUILD"
    | "TO_G5"
    | "PROMOTED_SCALE"
    | "TO_RUN"
    | "IN_RUN"
    | "RETURN_LOOP"
    | "DROPPED_G1"
    | "DROPPED_G4";
  progress: number; // 0 to 1 in current stage
  speed: number;
  queueIndex?: number;
  alpha: number;
}

export const PipelineFlowSimulator: React.FC = () => {
  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("medium");
  const [assumptions, setAssumptions] = useState<SimulationAssumptions>(
    PRESET_SCENARIOS.medium.assumptions
  );

  // UI accordion toggles
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Simulation controls state
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2>(1); // 1 = 10s per week, 2 = 5s per week
  const [simulatedWeek, setSimulatedWeek] = useState(1);
  const [secondsUntilNextBurst, setSecondsUntilNextBurst] = useState(10.0);

  // Canvas and animation refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const burstTimerRef = useRef<number>(0);

  // Reset particles whenever assumptions or scenario changes
  const resetSimulation = useCallback(() => {
    particlesRef.current = [];
    burstTimerRef.current = 0;
    setSimulatedWeek(1);
    setSecondsUntilNextBurst(10.0);
  }, []);

  // Handle switching scenario preset
  const handleSelectScenario = (sc: ScenarioId) => {
    setSelectedScenario(sc);
    if (sc !== "custom") {
      setAssumptions(PRESET_SCENARIOS[sc].assumptions);
      resetSimulation();
    }
  };

  // Update a single assumption and switch scenario to custom
  const updateAssumption = <K extends keyof SimulationAssumptions>(
    key: K,
    val: SimulationAssumptions[K]
  ) => {
    setAssumptions((prev) => ({
      ...prev,
      [key]: val,
    }));
    setSelectedScenario("custom");
    resetSimulation();
  };

  // Auto-Balancing 4-Tier Slider Handler (Always guarantees exact 100% sum)
  const handleTierSplitChange = (
    changedTier: "t1" | "t2" | "t3" | "t4",
    rawNewValue: number
  ) => {
    // Snap to 5% increments, clamped between 5% and 85%
    const newValue = Math.min(85, Math.max(5, Math.round(rawNewValue / 5) * 5));
    const oldValues = {
      t1: assumptions.t1Split,
      t2: assumptions.t2Split,
      t3: assumptions.t3Split,
      t4: assumptions.selfServeSplit,
    };

    const remaining = 100 - newValue;
    const otherTiers = (["t1", "t2", "t3", "t4"] as const).filter(
      (t) => t !== changedTier
    );
    const otherSum = otherTiers.reduce((acc, t) => acc + oldValues[t], 0);

    let newT1 = oldValues.t1;
    let newT2 = oldValues.t2;
    let newT3 = oldValues.t3;
    let newT4 = oldValues.t4;

    if (otherSum === 0) {
      const each = Math.floor(remaining / 3 / 5) * 5;
      const rem = remaining - each * 3;
      const vals = [each + rem, each, each];
      otherTiers.forEach((t, idx) => {
        if (t === "t1") newT1 = vals[idx];
        if (t === "t2") newT2 = vals[idx];
        if (t === "t3") newT3 = vals[idx];
        if (t === "t4") newT4 = vals[idx];
      });
    } else {
      let distributed = 0;
      const computed: { [key: string]: number } = {};
      otherTiers.forEach((t, idx) => {
        if (idx === otherTiers.length - 1) {
          computed[t] = remaining - distributed;
        } else {
          const share = Math.round(((oldValues[t] / otherSum) * remaining) / 5) * 5;
          const bounded = Math.max(0, Math.min(remaining - distributed, share));
          computed[t] = bounded;
          distributed += bounded;
        }
      });

      const totalOther = otherTiers.reduce((acc, t) => acc + computed[t], 0);
      const diff = remaining - totalOther;
      if (diff !== 0) {
        const maxTier = otherTiers.reduce(
          (max, t) => (computed[t] > computed[max] ? t : max),
          otherTiers[0]
        );
        computed[maxTier] += diff;
      }

      if (changedTier === "t1") newT1 = newValue;
      else newT1 = computed.t1;
      if (changedTier === "t2") newT2 = newValue;
      else newT2 = computed.t2;
      if (changedTier === "t3") newT3 = newValue;
      else newT3 = computed.t3;
      if (changedTier === "t4") newT4 = newValue;
      else newT4 = computed.t4;
    }

    // Safety constraint to guarantee 100%
    const finalSum = newT1 + newT2 + newT3 + newT4;
    if (finalSum !== 100) {
      newT2 += 100 - finalSum;
    }

    setAssumptions((prev) => ({
      ...prev,
      t1Split: newT1,
      t2Split: newT2,
      t3Split: newT3,
      selfServeSplit: newT4,
    }));
    setSelectedScenario("custom");
    resetSimulation();
  };

  // --- MATHEMATICAL FLOW & BOTTLENECK ENGINE ---
  const flowCalculations = useMemo(() => {
    const {
      incomingPerWeek,
      acceptanceRateG1,
      g4PassRate,
      postMvpPromotionRate,
      t1Split,
      t2Split,
      t3Split,
      selfServeSplit,
      returnFromRunRate,
      activeInRunCount,
      steerCoCapacity,
      portfolioBoardCapacity,
      ddaCapacity,
    } = assumptions;

    // Normalizing tier split
    const totalSplit = t1Split + t2Split + t3Split + selfServeSplit || 100;
    const normT1 = t1Split / totalSplit;
    const normT2 = t2Split / totalSplit;
    const normT3 = t3Split / totalSplit;
    const normSS = selfServeSplit / totalSplit;

    // Weekly accepted into Gate G1
    const acceptedAtG1PerWeek = incomingPerWeek * (acceptanceRateG1 / 100);
    const rejectedAtG1PerWeek = incomingPerWeek * (1 - acceptanceRateG1 / 100);

    // Returning from Run for major modification (re-enter at G2/G3)
    const returningFromRunPerWeek =
      (activeInRunCount * (returnFromRunRate / 100)) / 12;

    // Initial weekly flow per tier from G1
    const t1WeeklyInitial =
      acceptedAtG1PerWeek * normT1 + returningFromRunPerWeek * 0.5;
    const t2WeeklyInitial =
      acceptedAtG1PerWeek * normT2 + returningFromRunPerWeek * 0.35;
    const t3WeeklyInitial =
      acceptedAtG1PerWeek * normT3 + returningFromRunPerWeek * 0.15;
    const ssWeeklyTotal = acceptedAtG1PerWeek * normSS;

    // Total reaching Gate G4 across all tiers
    const totalReachingG4PerWeek =
      t1WeeklyInitial + t2WeeklyInitial + t3WeeklyInitial + ssWeeklyTotal;

    // Gate G4 Filter: Pass to GO BUILD vs Shelved / Dropped at G4
    const netThroughputToBuildPerWeek =
      totalReachingG4PerWeek * (g4PassRate / 100);
    const droppedAtG4PerWeek =
      totalReachingG4PerWeek * (1 - g4PassRate / 100);

    // Throughput per tier passing G4 to MVP Build
    const t1BuildWeekly = t1WeeklyInitial * (g4PassRate / 100);
    const t2BuildWeekly = t2WeeklyInitial * (g4PassRate / 100);
    const t3BuildWeekly = t3WeeklyInitial * (g4PassRate / 100);
    const ssBuildWeekly = ssWeeklyTotal * (g4PassRate / 100);

    // AT GATE G5 (PRE-SCALE / POST-MVP DECISION):
    // High-performing T3 Fast Lane and T4 Self-Service that prove enterprise value get PROMOTED to T2 Scale!
    const t3PromotedPerWeek = t3BuildWeekly * (postMvpPromotionRate / 100);
    const ssPromotedPerWeek = ssBuildWeekly * (postMvpPromotionRate / 100);
    const totalPromotedToT2PerWeek = t3PromotedPerWeek + ssPromotedPerWeek;

    // --- Committee Review Cadences (Weeks per meeting cycle) ---
    // Rule: Monthly = 4 weeks, Fortnightly = 2 weeks, Weekly = 1 week
    const steerCoIntervalWeeks = 4; // Monthly
    const portfolioBoardIntervalWeeks = 2; // Fortnightly
    const ddaIntervalWeeks = 1; // Weekly

    // 1. Transformation SteerCo (Monthly, 4 weeks)
    // Reviews T1 at G2 endorsement, G3 Priority (60% Hub pool) & G4 Funding
    const steerCoArrivingPerCycle = t1WeeklyInitial * steerCoIntervalWeeks;
    const steerCoExcessPerCycle = Math.max(
      0,
      steerCoArrivingPerCycle - steerCoCapacity
    );
    const steerCoQueue = Math.round(steerCoExcessPerCycle * 1.5 * 10) / 10;
    const steerCoWaitWeeks =
      steerCoQueue > 0
        ? Math.round(
            (steerCoIntervalWeeks / 2 +
              (steerCoQueue / steerCoCapacity) * steerCoIntervalWeeks) *
              10
          ) / 10
        : Math.round((steerCoIntervalWeeks / 2) * 10) / 10;
    const steerCoCyclesDelay =
      Math.round((steerCoWaitWeeks / steerCoIntervalWeeks) * 10) / 10;
    const steerCoIsBottleneck = steerCoCyclesDelay > 1.0;
    const steerCoIsSevere = steerCoCyclesDelay > 2.0;

    // 2. AI Portfolio Board (Fortnightly, 2 weeks)
    // Reviews T2 at G2/G3/G4 AND T3 at G4 (10-Day SLA)
    const portfolioBoardDemandPerWeek = t2WeeklyInitial + t3WeeklyInitial;
    const portfolioBoardArrivingPerCycle =
      portfolioBoardDemandPerWeek * portfolioBoardIntervalWeeks;
    const portfolioBoardExcessPerCycle = Math.max(
      0,
      portfolioBoardArrivingPerCycle - portfolioBoardCapacity
    );
    const portfolioBoardQueue =
      Math.round(portfolioBoardExcessPerCycle * 1.5 * 10) / 10;
    const portfolioBoardWaitWeeks =
      portfolioBoardQueue > 0
        ? Math.round(
            (portfolioBoardIntervalWeeks / 2 +
              (portfolioBoardQueue / portfolioBoardCapacity) *
                portfolioBoardIntervalWeeks) *
              10
          ) / 10
        : Math.round((portfolioBoardIntervalWeeks / 2) * 10) / 10;
    const portfolioBoardCyclesDelay =
      Math.round(
        (portfolioBoardWaitWeeks / portfolioBoardIntervalWeeks) * 10
      ) / 10;
    const portfolioBoardIsBottleneck = portfolioBoardCyclesDelay > 1.0;
    const portfolioBoardIsSevere = portfolioBoardCyclesDelay > 2.0;

    // 3. Digital Design Authority (DDA, Weekly, 1 week)
    // Reviews ADRs for both T1 & T2 at Gate G2
    const ddaDemandPerWeek = t1WeeklyInitial + t2WeeklyInitial * 0.7;
    const ddaArrivingPerCycle = ddaDemandPerWeek * ddaIntervalWeeks;
    const ddaExcessPerCycle = Math.max(0, ddaArrivingPerCycle - ddaCapacity);
    const ddaQueue = Math.round(ddaExcessPerCycle * 10) / 10;
    const ddaWaitWeeks =
      ddaQueue > 0
        ? Math.round(
            (ddaIntervalWeeks / 2 + (ddaQueue / ddaCapacity) * ddaIntervalWeeks) *
              10
          ) / 10
        : 0.5;
    const ddaCyclesDelay = Math.round((ddaWaitWeeks / ddaIntervalWeeks) * 10) / 10;
    const ddaIsBottleneck = ddaCyclesDelay > 1.0;
    const ddaIsSevere = ddaCyclesDelay > 2.0;

    // Primary Problem Meeting Identification
    let primaryProblemMeeting: {
      name: string;
      interval: string;
      intervalWeeks: number;
      slotCapacity: number;
      arrivingPerCycle: number;
      queue: number;
      waitWeeks: number;
      cyclesDelay: number;
      severity: "NONE" | "BOTTLENECK" | "SEVERE";
    } = {
      name: "All Forums On Track",
      interval: "N/A",
      intervalWeeks: 0,
      slotCapacity: 0,
      arrivingPerCycle: 0,
      queue: 0,
      waitWeeks: 0,
      cyclesDelay: 0,
      severity: "NONE",
    };

    if (steerCoCyclesDelay >= portfolioBoardCyclesDelay && steerCoCyclesDelay > 1.0) {
      primaryProblemMeeting = {
        name: "Transformation SteerCo",
        interval: "Monthly (4 wks)",
        intervalWeeks: steerCoIntervalWeeks,
        slotCapacity: steerCoCapacity,
        arrivingPerCycle: Math.round(steerCoArrivingPerCycle * 10) / 10,
        queue: steerCoQueue,
        waitWeeks: steerCoWaitWeeks,
        cyclesDelay: steerCoCyclesDelay,
        severity: steerCoIsSevere ? "SEVERE" : "BOTTLENECK",
      };
    } else if (portfolioBoardCyclesDelay > 1.0) {
      primaryProblemMeeting = {
        name: "AI Portfolio Board",
        interval: "Fortnightly (2 wks)",
        intervalWeeks: portfolioBoardIntervalWeeks,
        slotCapacity: portfolioBoardCapacity,
        arrivingPerCycle: Math.round(portfolioBoardArrivingPerCycle * 10) / 10,
        queue: portfolioBoardQueue,
        waitWeeks: portfolioBoardWaitWeeks,
        cyclesDelay: portfolioBoardCyclesDelay,
        severity: portfolioBoardIsSevere ? "SEVERE" : "BOTTLENECK",
      };
    } else if (ddaCyclesDelay > 1.0) {
      primaryProblemMeeting = {
        name: "Digital Design Authority (DDA)",
        interval: "Weekly (1 wk)",
        intervalWeeks: ddaIntervalWeeks,
        slotCapacity: ddaCapacity,
        arrivingPerCycle: Math.round(ddaArrivingPerCycle * 10) / 10,
        queue: ddaQueue,
        waitWeeks: ddaWaitWeeks,
        cyclesDelay: ddaCyclesDelay,
        severity: ddaIsSevere ? "SEVERE" : "BOTTLENECK",
      };
    }

    // Pipeline Metrics
    const totalInflowPerMonth = incomingPerWeek * 4.33;
    const netThroughputToBuildPerMonth = netThroughputToBuildPerWeek * 4.33;

    const t1LeadDays =
      assumptions.g1LeadDays +
      assumptions.g2T1LeadDays +
      assumptions.g3T1LeadDays +
      assumptions.g4T1LeadDays +
      Math.round(steerCoWaitWeeks * 7);

    const t2LeadDays =
      assumptions.g1LeadDays +
      assumptions.g2T2LeadDays +
      assumptions.g3T2LeadDays +
      assumptions.g4T2LeadDays +
      Math.round(portfolioBoardWaitWeeks * 7);

    const t3LeadDays =
      assumptions.g1LeadDays + assumptions.g4T3LeadDays + 10; // 10-day SLA directly at G4

    const ssLeadDays = 1; // Instant bypass

    const weightedAvgLeadDays = Math.round(
      t1LeadDays * normT1 +
        t2LeadDays * normT2 +
        t3LeadDays * normT3 +
        ssLeadDays * normSS
    );

    let bottleneckCount = 0;
    if (steerCoIsBottleneck) bottleneckCount++;
    if (portfolioBoardIsBottleneck) bottleneckCount++;
    if (ddaIsBottleneck) bottleneckCount++;

    return {
      totalInflowPerMonth,
      acceptedAtG1PerWeek,
      rejectedAtG1PerWeek,
      returningFromRunPerWeek,
      t1WeeklyInitial,
      t2WeeklyInitial,
      t3WeeklyInitial,
      ssWeeklyTotal,
      totalReachingG4PerWeek,
      netThroughputToBuildPerWeek,
      droppedAtG4PerWeek,
      t3PromotedPerWeek,
      ssPromotedPerWeek,
      totalPromotedToT2PerWeek,
      netThroughputToBuildPerMonth,
      weightedAvgLeadDays,
      bottleneckCount,
      t1LeadDays,
      t2LeadDays,
      t3LeadDays,
      ssLeadDays,
      t1BuildWeekly,
      t2BuildWeekly,
      t3BuildWeekly,
      ssBuildWeekly,
      primaryProblemMeeting,

      steerCo: {
        demandPerWeek: t1WeeklyInitial,
        capacityPerMeeting: steerCoCapacity,
        intervalWeeks: steerCoIntervalWeeks,
        arrivingPerCycle: steerCoArrivingPerCycle,
        queue: steerCoQueue,
        waitWeeks: steerCoWaitWeeks,
        cyclesDelay: steerCoCyclesDelay,
        isBottleneck: steerCoIsBottleneck,
        isSevere: steerCoIsSevere,
      },
      portfolioBoard: {
        demandPerWeek: portfolioBoardDemandPerWeek,
        capacityPerMeeting: portfolioBoardCapacity,
        intervalWeeks: portfolioBoardIntervalWeeks,
        arrivingPerCycle: portfolioBoardArrivingPerCycle,
        queue: portfolioBoardQueue,
        waitWeeks: portfolioBoardWaitWeeks,
        cyclesDelay: portfolioBoardCyclesDelay,
        isBottleneck: portfolioBoardIsBottleneck,
        isSevere: portfolioBoardIsSevere,
      },
      dda: {
        demandPerWeek: ddaDemandPerWeek,
        capacityPerMeeting: ddaCapacity,
        intervalWeeks: ddaIntervalWeeks,
        arrivingPerCycle: ddaArrivingPerCycle,
        queue: ddaQueue,
        waitWeeks: ddaWaitWeeks,
        cyclesDelay: ddaCyclesDelay,
        isBottleneck: ddaIsBottleneck,
        isSevere: ddaIsSevere,
      },
    };
  }, [assumptions]);

  // Spawns a weekly burst of discrete balls exactly matching incomingPerWeek
  const spawnWeeklyBurst = useCallback(() => {
    const count = Math.max(1, Math.round(assumptions.incomingPerWeek));
    const newParticles: Particle[] = [];

    // Distribute the count across the 4 tiers according to percentages
    const t1Count = Math.round((count * assumptions.t1Split) / 100);
    const t2Count = Math.round((count * assumptions.t2Split) / 100);
    const t3Count = Math.round((count * assumptions.t3Split) / 100);
    const t4Count = count - t1Count - t2Count - t3Count;

    const tierList: Array<"T1" | "T2" | "T3" | "T4"> = [];
    for (let i = 0; i < t1Count; i++) tierList.push("T1");
    for (let i = 0; i < t2Count; i++) tierList.push("T2");
    for (let i = 0; i < t3Count; i++) tierList.push("T3");
    for (let i = 0; i < t4Count; i++) tierList.push("T4");

    // Shuffle slightly for organic staggered release
    for (let i = tierList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tierList[i], tierList[j]] = [tierList[j], tierList[i]];
    }

    tierList.forEach((tier, index) => {
      // Determine pass/fail outcomes
      const passG1 = Math.random() * 100 < assumptions.acceptanceRateG1;
      const passG4 = Math.random() * 100 < assumptions.g4PassRate;
      const isPromoted =
        (tier === "T3" || tier === "T4") &&
        Math.random() * 100 < assumptions.postMvpPromotionRate;

      let color = "#10b981"; // T1 Emerald
      let glowColor = "rgba(16, 185, 129, 0.6)";
      if (tier === "T2") {
        color = "#38bdf8"; // Sky blue
        glowColor = "rgba(56, 189, 248, 0.6)";
      } else if (tier === "T3") {
        color = "#f59e0b"; // Amber
        glowColor = "rgba(245, 158, 11, 0.6)";
      } else if (tier === "T4") {
        color = "#c084fc"; // Purple
        glowColor = "rgba(192, 132, 252, 0.6)";
      }

      newParticles.push({
        id: `p-${Date.now()}-${index}-${Math.random()}`,
        tier,
        color,
        glowColor,
        x: 80 - index * 12, // Staggered spawn line behind SOURCE
        y: 290,
        radius: 4.5,
        passG1,
        passG4,
        isPromoted,
        stage: "TO_G1",
        progress: -index * 0.08, // Staggered timing
        speed: 0.18 + Math.random() * 0.04,
        alpha: 1,
      });
    });

    particlesRef.current = [...particlesRef.current, ...newParticles];
  }, [assumptions]);

  // MAIN ANIMATION LOOP (1 Week = 10,000ms / simSpeed)
  useEffect(() => {
    let animationFrameId: number;
    const WEEK_MS = 10000 / simSpeed;

    // Trigger initial burst
    if (particlesRef.current.length === 0) {
      spawnWeeklyBurst();
    }

    const render = (time: number) => {
      const dt = Math.min(100, time - lastTimeRef.current);
      lastTimeRef.current = time;

      if (isPlaying) {
        burstTimerRef.current += dt;
        const remaining = Math.max(
          0,
          (WEEK_MS - burstTimerRef.current) / 1000
        );
        setSecondsUntilNextBurst(Math.round(remaining * 10) / 10);

        // Weekly burst trigger!
        if (burstTimerRef.current >= WEEK_MS) {
          burstTimerRef.current = 0;
          setSimulatedWeek((w) => w + 1);
          spawnWeeklyBurst();
        }
      }

      // --- CANVAS DRAWING ---
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, 1200, 620);

          // Update and draw particles
          const currentParticles = particlesRef.current;
          const updatedParticles: Particle[] = [];

          // Count currently queued particles to visually stack them
          let steerCoQueuedCount = 0;
          let boardQueuedCount = 0;

          for (const p of currentParticles) {
            if (isPlaying) {
              p.progress += (p.speed * dt) / 1000;
            }

            // Waypoint coordinates:
            // SOURCE: (80, 290)
            // G1: (220, 290)
            // T1 Lane: y = 90 (G2: x=400, G3 SteerCo: x=580, G4: x=750)
            // T2 Lane: y = 210 (G2: x=400, G3 Board: x=580, G4: x=750)
            // T3 Lane: y = 350 (Skips G2/3, G4 Canvas: x=750)
            // T4 Lane: y = 470 (Skips G2/3, G4 Registry: x=750)
            // MVP BUILD: (900, 290)
            // G5 PRE-SCALE: (1030, 290)
            // PROMOTED TO SCALE: curves to (1080, 210)
            // RUN (G6): (1140, 290)

            if (p.stage === "TO_G1") {
              if (p.progress < 0) {
                // Not launched yet (staggered delay)
                p.x = 80;
                p.y = 290;
              } else if (p.progress < 1) {
                p.x = 80 + p.progress * (220 - 80);
                p.y = 290;
              } else {
                p.progress = 0;
                if (!p.passG1) {
                  p.stage = "DROPPED_G1";
                } else {
                  p.stage = "TO_G2";
                }
              }
            } else if (p.stage === "DROPPED_G1") {
              p.x = 220;
              p.y = 290 + p.progress * 80;
              p.alpha = Math.max(0, 1 - p.progress);
              if (p.progress >= 1) {
                p.alpha = 0;
              }
            } else if (p.stage === "TO_G2") {
              // Branching into lanes
              let targetY = 90;
              if (p.tier === "T2") targetY = 210;
              if (p.tier === "T3") targetY = 350;
              if (p.tier === "T4") targetY = 470;

              if (p.progress < 1) {
                const u = p.progress;
                // Smooth bezier from G1 (220, 290) to (400, targetY)
                p.x = 220 + u * (400 - 220);
                p.y = 290 + (targetY - 290) * (u * u * (3 - 2 * u));
              } else {
                p.progress = 0;
                if (p.tier === "T1") {
                  // Check SteerCo bottleneck backlog
                  if (
                    flowCalculations.steerCo.isBottleneck &&
                    steerCoQueuedCount < Math.round(flowCalculations.steerCo.queue)
                  ) {
                    p.stage = "WAIT_STEERCO";
                    p.queueIndex = steerCoQueuedCount++;
                  } else {
                    p.stage = "TO_G4";
                  }
                } else if (p.tier === "T2") {
                  if (
                    flowCalculations.portfolioBoard.isBottleneck &&
                    boardQueuedCount <
                      Math.round(flowCalculations.portfolioBoard.queue)
                  ) {
                    p.stage = "WAIT_BOARD";
                    p.queueIndex = boardQueuedCount++;
                  } else {
                    p.stage = "TO_G4";
                  }
                } else {
                  // T3 and T4 skip G2 & G3 directly to G4!
                  p.stage = "TO_G4";
                }
              }
            } else if (p.stage === "WAIT_STEERCO") {
              // Queued in front of SteerCo node (x=580, y=90)
              const qIdx = p.queueIndex || 0;
              p.x = 540 - qIdx * 14;
              p.y = 90 + Math.sin(time / 200 + qIdx) * 1.5;
              // Release from queue as time advances
              if (p.progress > 2.5) {
                p.stage = "TO_G4";
                p.progress = 0;
              }
            } else if (p.stage === "WAIT_BOARD") {
              // Queued in front of Portfolio Board (x=580, y=210)
              const qIdx = p.queueIndex || 0;
              p.x = 540 - qIdx * 14;
              p.y = 210 + Math.sin(time / 200 + qIdx) * 1.5;
              if (p.progress > 2.0) {
                p.stage = "TO_G4";
                p.progress = 0;
              }
            } else if (p.stage === "TO_G4") {
              let currentY = 90;
              if (p.tier === "T2") currentY = 210;
              if (p.tier === "T3") currentY = 350;
              if (p.tier === "T4") currentY = 470;

              if (p.progress < 1) {
                // Moving through G3/G4
                p.x = 400 + p.progress * (750 - 400);
                p.y = currentY;
              } else {
                p.progress = 0;
                if (!p.passG4) {
                  p.stage = "DROPPED_G4";
                } else {
                  p.stage = "TO_BUILD";
                }
              }
            } else if (p.stage === "DROPPED_G4") {
              // Dropping out at G4 into Shelved Bin
              let startY = 90;
              if (p.tier === "T2") startY = 210;
              if (p.tier === "T3") startY = 350;
              if (p.tier === "T4") startY = 470;

              p.x = 750 + p.progress * (830 - 750);
              p.y = startY + p.progress * (570 - startY);
              p.alpha = Math.max(0, 1 - p.progress);
              if (p.progress >= 1) {
                p.alpha = 0;
              }
            } else if (p.stage === "TO_BUILD") {
              let startY = 90;
              if (p.tier === "T2") startY = 210;
              if (p.tier === "T3") startY = 350;
              if (p.tier === "T4") startY = 470;

              if (p.progress < 1) {
                const u = p.progress;
                p.x = 750 + u * (900 - 750);
                p.y = startY + (290 - startY) * (u * u * (3 - 2 * u));
              } else {
                p.progress = 0;
                p.stage = "TO_G5";
              }
            } else if (p.stage === "TO_G5") {
              // All passing initiatives build MVP and reach Gate G5 (1030, 290)
              if (p.progress < 1) {
                p.x = 900 + p.progress * (1030 - 900);
                p.y = 290;
              } else {
                p.progress = 0;
                if (p.isPromoted) {
                  // Promoted to T2 Scale at Gate G5!
                  p.stage = "PROMOTED_SCALE";
                } else {
                  p.stage = "TO_RUN";
                }
              }
            } else if (p.stage === "PROMOTED_SCALE") {
              // Curves UP from G5 (1030, 290) into T2 Scale track!
              if (p.progress < 1) {
                const u = p.progress;
                p.x = 1030 + u * (1140 - 1030);
                p.y = 290 - Math.sin(u * Math.PI) * 80;
                p.color = "#38bdf8"; // Upgraded to Scale color!
                p.glowColor = "rgba(56, 189, 248, 0.9)";
              } else {
                p.progress = 0;
                p.stage = "IN_RUN";
              }
            } else if (p.stage === "TO_RUN") {
              if (p.progress < 1) {
                p.x = 1030 + p.progress * (1140 - 1030);
                p.y = 290;
              } else {
                p.progress = 0;
                p.stage = "IN_RUN";
              }
            } else if (p.stage === "IN_RUN") {
              p.x = 1140;
              p.y = 290;
              p.alpha = Math.max(0, 1 - p.progress * 0.4);
              if (p.progress >= 2.5) {
                p.alpha = 0;
              }
            }

            // Render active particle on canvas
            if (p.alpha > 0.05 && p.progress >= 0) {
              ctx.save();
              ctx.globalAlpha = p.alpha;

              // Outer Glow
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
              ctx.fillStyle = p.glowColor;
              ctx.fill();

              // Solid Ball
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.shadowColor = p.color;
              ctx.shadowBlur = 8;
              ctx.fill();

              // Star or badge for Promoted
              if (p.isPromoted && p.stage === "PROMOTED_SCALE") {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 1.5;
                ctx.stroke();
              }

              ctx.restore();
              updatedParticles.push(p);
            }
          }

          particlesRef.current = updatedParticles;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    animFrameIdRef.current = animationFrameId;

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, simSpeed, spawnWeeklyBurst, flowCalculations]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-gray-900">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#072417] via-[#093c1f] to-[#044c23] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-400 text-gray-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Activity className="w-3.5 h-3.5" />
              Tab 7 · Pipeline Flow &amp; Bottleneck Simulator
            </span>
            <span className="text-xs bg-white/10 px-2.5 py-1 rounded-md text-emerald-300 font-mono border border-white/15">
              1 Week = 10s Discrete Burst Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Use Case Flow &amp; Governance Bottleneck Simulator
          </h1>
          <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
            Simulate incoming weekly bursts of use cases, gate filters, review
            cadences, and post-MVP scaling. Visually pinpoint where initiatives
            get stuck when committee slot capacities are exceeded.
          </p>
        </div>

        {/* SCENARIO SWITCHER BUTTONS */}
        <div className="bg-black/40 border border-white/20 p-2.5 rounded-2xl shrink-0 flex flex-col gap-2">
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider px-2 flex items-center justify-between">
            <span>Scenario Switcher:</span>
            <span className="text-[10px] text-white/60 font-mono">
              {
                PRESET_SCENARIOS[
                  selectedScenario === "custom" ? "medium" : selectedScenario
                ]?.badge
              }
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => handleSelectScenario("low")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedScenario === "low"
                  ? "bg-emerald-500 text-emerald-950 shadow-md font-black"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>Low Volume</span>
              <span className="text-[9px] bg-black/25 px-1 rounded text-white/90">
                3.5/wk
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectScenario("medium")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedScenario === "medium"
                  ? "bg-blue-500 text-white shadow-md font-black"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>Medium (Baseline)</span>
              <span className="text-[9px] bg-black/25 px-1 rounded text-white/90">
                8.5/wk
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectScenario("high")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedScenario === "high"
                  ? "bg-rose-500 text-white shadow-md font-black animate-pulse"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-white" />
              <span>High (Stress Test)</span>
              <span className="text-[9px] bg-black/25 px-1 rounded text-white/90">
                18/wk
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI METRICS RIBBON */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Intake Burst
          </span>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900">
              {assumptions.incomingPerWeek}{" "}
              <span className="text-xs font-medium text-gray-500">UC/wk</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              ~{Math.round(flowCalculations.totalInflowPerMonth)} UC / month
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-blue-600" /> Net MVP Build
          </span>
          <div className="mt-2">
            <div className="text-2xl font-black text-blue-900">
              {flowCalculations.netThroughputToBuildPerWeek.toFixed(1)}{" "}
              <span className="text-xs font-medium text-gray-500">UC/wk</span>
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
              Pass Rate at G4: {assumptions.g4PassRate}%
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Avg Framing Time
          </span>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900">
              {flowCalculations.weightedAvgLeadDays}{" "}
              <span className="text-xs font-medium text-gray-500">Days</span>
            </div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">
              T1: {flowCalculations.t1LeadDays}d · T2: {flowCalculations.t2LeadDays}
              d · T3: {flowCalculations.t3LeadDays}d
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5 text-indigo-600" /> Post-MVP Promotion
          </span>
          <div className="mt-2">
            <div className="text-2xl font-black text-indigo-900">
              {flowCalculations.totalPromotedToT2PerWeek.toFixed(1)}{" "}
              <span className="text-xs font-medium text-gray-500">UC/wk</span>
            </div>
            <div className="text-[11px] text-indigo-700 font-medium mt-0.5">
              {assumptions.postMvpPromotionRate}% promoted to T2 Scale
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> Returning Flow
          </span>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-900">
              {flowCalculations.returningFromRunPerWeek.toFixed(1)}{" "}
              <span className="text-xs font-medium text-gray-500">UC/wk</span>
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">
              {assumptions.returnFromRunRate}% of {assumptions.activeInRunCount}{" "}
              Run cases
            </div>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
            flowCalculations.bottleneckCount > 0
              ? "bg-rose-50 border-rose-300 ring-2 ring-rose-500/20"
              : "bg-emerald-50 border-emerald-300"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-gray-700">
            <ShieldAlert
              className={`w-3.5 h-3.5 ${
                flowCalculations.bottleneckCount > 0
                  ? "text-rose-600 animate-bounce"
                  : "text-emerald-600"
              }`}
            />
            Bottlenecks
          </span>
          <div className="mt-2">
            <div
              className={`text-2xl font-black ${
                flowCalculations.bottleneckCount > 0
                  ? "text-rose-700"
                  : "text-emerald-800"
              }`}
            >
              {flowCalculations.bottleneckCount}{" "}
              <span className="text-xs font-semibold">
                {flowCalculations.bottleneckCount === 1
                  ? "Forum Delayed"
                  : "Forums Delayed"}
              </span>
            </div>
            <div
              className={`text-[11px] font-bold mt-0.5 ${
                flowCalculations.bottleneckCount > 0
                  ? "text-rose-800"
                  : "text-emerald-700"
              }`}
            >
              {flowCalculations.bottleneckCount > 0
                ? ">1 Meeting Cycle Queue"
                : "Zero Queues"}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: TOP PANEL — EDITABLE ASSUMPTIONS (T1-T4 100% SUM CONSTRAINED)
      ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" />
              1. Top Panel — Live Editable Assumptions
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              All 4 tiers (T1–T4) are explicitly shown and always sum to exactly
              100%. Moving one slider automatically balances the remaining tiers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectScenario("medium")}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Baseline
            </button>
            <button
              type="button"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5"
            >
              {showAdvancedSettings ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              {showAdvancedSettings
                ? "Hide Gate Lead Times"
                : "Edit Gate Lead Times (Days)"}
            </button>
          </div>
        </div>

        {/* 6 PRIMARY ASSUMPTION CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Incoming Use Cases */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">
                Incoming Use Cases (Intake Burst)
              </label>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-mono">
                {assumptions.incomingPerWeek} UC / week
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={assumptions.incomingPerWeek}
              onChange={(e) =>
                updateAssumption("incomingPerWeek", Number(e.target.value))
              }
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>1 UC/wk (Slow)</span>
              <span>15 UC/wk</span>
              <span>30 UC/wk (Surge)</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-snug">
              Every 10 seconds (1 week), exactly{" "}
              <strong>{Math.round(assumptions.incomingPerWeek)} balls</strong>{" "}
              enter the pipeline at SOURCE.
            </p>
          </div>

          {/* 2. Acceptance Rate at G1 */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">
                Gate G1 Acceptance Rate
              </label>
              <span className="text-xs font-black text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md font-mono">
                {assumptions.acceptanceRateG1}% Pass
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={assumptions.acceptanceRateG1}
              onChange={(e) =>
                updateAssumption("acceptanceRateG1", Number(e.target.value))
              }
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>50% (Strict)</span>
              <span>85% (Playbook avg)</span>
              <span>100% (Pass-all)</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-snug">
              % of incoming use cases validated by OpellaGPT Charter Agent to
              pass into framing gates.
            </p>
          </div>

          {/* 3. Gate G4 Approval Pass Rate */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-emerald-300 ring-1 ring-emerald-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Gate G4 Approval Pass Rate
              </label>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-mono">
                {assumptions.g4PassRate}% to Build
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="5"
              value={assumptions.g4PassRate}
              onChange={(e) =>
                updateAssumption("g4PassRate", Number(e.target.value))
              }
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>40% (Selective)</span>
              <span>80% (Typical)</span>
              <span>100% (Pass-all)</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Not all use cases pass G4:{" "}
              <strong>{100 - assumptions.g4PassRate}%</strong> are shelved,
              dropped, or returned for re-framing.
            </p>
          </div>

          {/* 4. Post-MVP Promotion Rate (At Gate G5 after MVP Build) */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-indigo-300 ring-1 ring-indigo-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                Post-MVP Promotion Rate (G5)
              </label>
              <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-md font-mono">
                {assumptions.postMvpPromotionRate}% to T2 Scale
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={assumptions.postMvpPromotionRate}
              onChange={(e) =>
                updateAssumption("postMvpPromotionRate", Number(e.target.value))
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>0% (None)</span>
              <span>20% (Promoted)</span>
              <span>50% (High scaling)</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Decided <strong>AFTER MVP build at Gate G5</strong>: T3 Fast Lane
              and T4 Self-Service that prove enterprise value get upgraded to T2
              Scale!
            </p>
          </div>

          {/* 5. TIER ROUTING SPLIT (T1, T2, T3, T4 ALWAYS EQUAL TO 100%) */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">
                Tier Routing Split (T1–T4)
              </label>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
                ✓ Sum:{" "}
                {assumptions.t1Split +
                  assumptions.t2Split +
                  assumptions.t3Split +
                  assumptions.selfServeSplit}
                %
              </span>
            </div>
            <div className="space-y-2 text-xs">
              {/* T1 */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-emerald-800">
                    T1 · Transform ({assumptions.t1Split}%)
                  </span>
                  <span className="text-gray-500 font-mono text-[10px]">
                    &gt;€1M · Big Bets
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="85"
                  step="5"
                  value={assumptions.t1Split}
                  onChange={(e) =>
                    handleTierSplitChange("t1", Number(e.target.value))
                  }
                  className="w-full accent-emerald-700 h-1.5 cursor-pointer"
                />
              </div>

              {/* T2 */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-blue-800">
                    T2 · Scale ({assumptions.t2Split}%)
                  </span>
                  <span className="text-gray-500 font-mono text-[10px]">
                    €200k–€1M · Shared Squad
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="85"
                  step="5"
                  value={assumptions.t2Split}
                  onChange={(e) =>
                    handleTierSplitChange("t2", Number(e.target.value))
                  }
                  className="w-full accent-blue-600 h-1.5 cursor-pointer"
                />
              </div>

              {/* T3 */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-amber-800">
                    T3 · Fast Lane ({assumptions.t3Split}%)
                  </span>
                  <span className="text-gray-500 font-mono text-[10px]">
                    &lt;€200k · 6–8wk MVP
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="85"
                  step="5"
                  value={assumptions.t3Split}
                  onChange={(e) =>
                    handleTierSplitChange("t3", Number(e.target.value))
                  }
                  className="w-full accent-amber-600 h-1.5 cursor-pointer"
                />
              </div>

              {/* T4 */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-purple-800">
                    T4 · Self-Service ({assumptions.selfServeSplit}%)
                  </span>
                  <span className="text-gray-500 font-mono text-[10px]">
                    &lt;€50k · Register &amp; Go
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="85"
                  step="5"
                  value={assumptions.selfServeSplit}
                  onChange={(e) =>
                    handleTierSplitChange("t4", Number(e.target.value))
                  }
                  className="w-full accent-purple-600 h-1.5 cursor-pointer"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-500 leading-tight pt-1">
              Guaranteed 100% balance: moving any slider automatically
              proportionally adjusts the other three.
            </p>
          </div>

          {/* 6. Return from Run Rate (Major Modification) */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">
                Run Modification Return Rate
              </label>
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-mono">
                {assumptions.returnFromRunRate}% / year
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="2"
              value={assumptions.returnFromRunRate}
              onChange={(e) =>
                updateAssumption("returnFromRunRate", Number(e.target.value))
              }
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>0% (None)</span>
              <span>12% (Typical)</span>
              <span>30% (High rework)</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-snug">
              Live use cases in Run re-entering Gate G2/G3 for major upgrades or
              scope expansion.
            </p>
          </div>
        </div>

        {/* ADVANCED COLLAPSIBLE: GATE LEAD TIME OVERRIDES */}
        {showAdvancedSettings && (
          <div className="p-5 rounded-2xl bg-gray-50/80 border border-emerald-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                Gate Evaluation Durations (Days to assemble deliverables &amp;
                receive sign-off)
              </div>
              <span className="text-[11px] text-gray-500">
                Excludes committee queue waiting delay
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-2">
                <div className="font-bold text-emerald-900">
                  T1 · Transform Gating
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      G2 Feasibility (ADR + Finance):
                    </span>
                    <span className="font-mono font-bold text-gray-900">
                      {assumptions.g2T1LeadDays} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">G3 Priority &amp; VCP:</span>
                    <span className="font-mono font-bold text-gray-900">
                      {assumptions.g3T1LeadDays} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      G4 SteerCo Tranche Release:
                    </span>
                    <span className="font-mono font-bold text-gray-900">
                      {assumptions.g4T1LeadDays} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-2">
                <div className="font-bold text-blue-900">T2 · Scale Gating</div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      G2 Feasibility (Platform fit):
                    </span>
                    <span className="font-mono font-bold text-gray-900">
                      {assumptions.g2T2LeadDays} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      G3 Priority (Portfolio Board):
                    </span>
                    <span className="font-mono font-bold text-gray-900">
                      {assumptions.g3T2LeadDays} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">G4 Sponsors Sign-off:</span>
                    <span className="font-mono font-bold text-gray-900">
                      {assumptions.g4T2LeadDays} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-2">
                <div className="font-bold text-amber-900">
                  T3 · Fast Lane Gating
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">G1 Intake &amp; Canvas:</span>
                    <span className="font-mono font-bold text-gray-900">
                      1 day
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skips G2 &amp; G3:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      0 days (Direct to G4)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">G4 Decision SLA (Board):</span>
                    <span className="font-mono font-bold text-gray-900">
                      10 working days
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-2">
                <div className="font-bold text-purple-900">
                  T4 &amp; Post-MVP Scaling
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Self-Serve Registry:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      1 day (Direct G4)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">MVP Build Duration:</span>
                    <span className="font-mono font-bold text-gray-900">
                      {assumptions.mvpBuildWeeks} weeks
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">G5 Promotion Decision:</span>
                    <span className="font-mono font-bold text-indigo-700">
                      {assumptions.postMvpPromotionRate}% promoted
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 2: MAIN VIEW — DECLUTTERED FLUID BURST SIMULATION
          (1 Week = 10s Burst · Visible Queue Stacks · Post-MVP Promotion at G5)
      ========================================================================= */}
      <div className="bg-[#080d1a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-800 text-white space-y-6 relative overflow-hidden">
        {/* Glow backdrop decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Controls & Simulation State */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                1 Week = 10s Discrete Simulation
              </span>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                2. Main View — Live Project Flow &amp; Comitology Bottleneck Map
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Every 10 seconds, a weekly burst of{" "}
              <strong className="text-emerald-400">
                {Math.round(assumptions.incomingPerWeek)} use cases
              </strong>{" "}
              travels through the pipeline. Excess volume stacks up in front of
              the bottlenecked committee nodes.
            </p>
          </div>

          {/* SIMULATION CLOCK & CONTROLS */}
          <div className="flex items-center gap-3 bg-black/60 border border-white/10 px-3.5 py-2 rounded-2xl shrink-0">
            {/* Week counter */}
            <div className="text-left pr-2 border-r border-white/10">
              <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                Simulated Time
              </div>
              <div className="text-sm font-black text-emerald-400 font-mono flex items-center gap-1.5">
                <span>Week {simulatedWeek}</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  ({secondsUntilNextBurst.toFixed(1)}s to next burst)
                </span>
              </div>
            </div>

            {/* Play/Pause */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-xl text-white transition-all ${
                isPlaying
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-amber-600 hover:bg-amber-500"
              }`}
              title={isPlaying ? "Pause simulation" : "Play simulation"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Speed Multiplier */}
            <button
              type="button"
              onClick={() => setSimSpeed(simSpeed === 1 ? 2 : 1)}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white font-mono flex items-center gap-1"
              title="Toggle speed (1x = 10s/wk, 2x = 5s/wk)"
            >
              <FastForward className="w-3.5 h-3.5 text-blue-400" />
              <span>{simSpeed}x</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={resetSimulation}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
              title="Reset simulation and burst counter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* INTERACTIVE PIPELINE SVG CANVAS (Spacious 1200x620 ViewBox) */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1040px] aspect-[1200/620] relative rounded-2xl bg-[#060a14] border border-gray-800 shadow-inner">
            {/* SVG INFRASTRUCTURE: CONDUITS, GATES & LABELS */}
            <svg
              viewBox="0 0 1200 620"
              className="w-full h-full select-none absolute inset-0 pointer-events-none"
              style={{ overflow: "visible" }}
            >
              {/* --- BACKGROUND SWIMLANE GUIDES --- */}
              <rect
                x="40"
                y="55"
                width="720"
                height="70"
                rx="14"
                fill="#10b981"
                fillOpacity="0.03"
                stroke="#10b981"
                strokeOpacity="0.1"
              />
              <rect
                x="40"
                y="175"
                width="720"
                height="70"
                rx="14"
                fill="#38bdf8"
                fillOpacity="0.03"
                stroke="#38bdf8"
                strokeOpacity="0.1"
              />
              <rect
                x="40"
                y="315"
                width="720"
                height="70"
                rx="14"
                fill="#f59e0b"
                fillOpacity="0.03"
                stroke="#f59e0b"
                strokeOpacity="0.1"
              />
              <rect
                x="40"
                y="435"
                width="720"
                height="70"
                rx="14"
                fill="#c084fc"
                fillOpacity="0.03"
                stroke="#c084fc"
                strokeOpacity="0.1"
              />

              {/* Lane Tags */}
              <text x="50" y="75" fill="#34d399" fontSize="10" fontWeight="900" letterSpacing="0.05em">
                T1 · TRANSFORM LANE (&gt;€1M · SteerCo Gating)
              </text>
              <text x="50" y="195" fill="#38bdf8" fontSize="10" fontWeight="900" letterSpacing="0.05em">
                T2 · SCALE LANE (€200k–€1M · Portfolio Board Gating)
              </text>
              <text x="50" y="335" fill="#fbbf24" fontSize="10" fontWeight="900" letterSpacing="0.05em">
                T3 · FAST LANE (&lt;€200k · Agile MVP · Skips G2 &amp; G3)
              </text>
              <text x="50" y="455" fill="#c084fc" fontSize="10" fontWeight="900" letterSpacing="0.05em">
                T4 · SELF-SERVICE AI (&lt;€50k · Catalog · Skips G2 &amp; G3)
              </text>

              {/* --- EXACT CONDUIT PIPES --- */}
              {/* Pipe 0: Source to Gate G1 */}
              <path
                d="M 80 290 L 220 290"
                fill="none"
                stroke="#10b981"
                strokeWidth="14"
                strokeOpacity="0.2"
                strokeLinecap="round"
              />

              {/* Pipe G1 Rejected Exit */}
              <path
                d="M 220 290 L 220 370"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
              />

              {/* Pipe 1: T1 Transform Conduit (y = 90) */}
              <path
                d="M 220 290 C 290 90, 320 90, 400 90 L 750 90"
                fill="none"
                stroke={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
                strokeWidth={flowCalculations.steerCo.isBottleneck ? "14" : "10"}
                strokeOpacity={flowCalculations.steerCo.isBottleneck ? "0.35" : "0.2"}
                strokeLinecap="round"
              />

              {/* Pipe 2: T2 Scale Conduit (y = 210) */}
              <path
                d="M 220 290 C 290 210, 320 210, 400 210 L 750 210"
                fill="none"
                stroke={flowCalculations.portfolioBoard.isBottleneck ? "#f59e0b" : "#38bdf8"}
                strokeWidth="10"
                strokeOpacity="0.2"
                strokeLinecap="round"
              />

              {/* Pipe 3: T3 Fast Lane Conduit (y = 350) - Skips G2 & G3! */}
              <path
                d="M 220 290 C 290 350, 340 350, 400 350 L 750 350"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="9"
                strokeOpacity="0.2"
                strokeLinecap="round"
              />

              {/* Pipe 4: T4 Self-Service Conduit (y = 470) - Skips G2 & G3! */}
              <path
                d="M 220 290 C 290 470, 340 470, 400 470 L 750 470"
                fill="none"
                stroke="#c084fc"
                strokeWidth="8"
                strokeOpacity="0.2"
                strokeLinecap="round"
              />

              {/* G4 to Shelved/Dropped Filter Bin */}
              <path
                d="M 750 290 C 780 450, 800 570, 830 570"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
              />

              {/* Converging from G4 (x=750) to MVP BUILD (900, 290) */}
              <path
                d="M 750 90 C 820 90, 850 290, 900 290"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeOpacity="0.2"
              />
              <path
                d="M 750 210 C 820 210, 850 290, 900 290"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="8"
                strokeOpacity="0.2"
              />
              <path
                d="M 750 350 C 820 350, 850 290, 900 290"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="8"
                strokeOpacity="0.2"
              />
              <path
                d="M 750 470 C 820 470, 850 290, 900 290"
                fill="none"
                stroke="#c084fc"
                strokeWidth="8"
                strokeOpacity="0.2"
              />

              {/* MVP Build to Gate G5 (Pre-Scale Eval) */}
              <path
                d="M 900 290 L 1030 290"
                fill="none"
                stroke="#10b981"
                strokeWidth="12"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />

              {/* POST-MVP PROMOTION CURVE (At G5, curves UP into Scale runway!) */}
              <path
                d="M 1030 290 C 1060 210, 1100 210, 1140 210"
                fill="none"
                stroke="#818cf8"
                strokeWidth="4"
                strokeDasharray="4 4"
                strokeOpacity="0.9"
              />

              {/* Standard Path to RUN */}
              <path
                d="M 1030 290 L 1140 290"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="10"
                strokeOpacity="0.25"
              />

              {/* Run Modification Return Loop */}
              <path
                d="M 1140 270 C 950 25, 600 25, 400 70"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                strokeOpacity="0.8"
              />

              {/* --- GATING NODES & LABELS --- */}

              {/* 1. NODE: SOURCE */}
              <g transform="translate(80, 290)">
                <circle r="34" fill="#0b1329" stroke="#10b981" strokeWidth="2.5" />
                <text x="0" y="-7" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                  SOURCE
                </text>
                <text x="0" y="9" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
                  {assumptions.incomingPerWeek}
                </text>
                <text x="0" y="21" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">
                  UC / burst
                </text>
              </g>

              {/* 2. NODE: GATE G1 (AI CHARTER TRIAGE) */}
              <g transform="translate(220, 290)">
                <circle r="30" fill="#0b1329" stroke="#34d399" strokeWidth="2.5" />
                <text x="0" y="-6" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="900">
                  GATE G1
                </text>
                <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  AI Triage
                </text>
                <text x="0" y="18" textAnchor="middle" fill="#94a3b8" fontSize="8">
                  {assumptions.acceptanceRateG1}% Pass
                </text>
              </g>

              {/* G1 Dropped Tag */}
              <g transform="translate(220, 395)">
                <rect x="-45" y="-9" width="90" height="18" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#fca5a5" fontSize="7.5" fontWeight="bold">
                  ✕ Rejected ({100 - assumptions.acceptanceRateG1}%)
                </text>
              </g>

              {/* --- T1 NODES (CRITICAL TRANSFORM PATH) --- */}
              {/* T1 - Gate G2 Feasibility */}
              <g transform="translate(400, 90)">
                <rect x="-42" y="-22" width="84" height="44" rx="9" fill="#0b1329" stroke="#10b981" strokeWidth="2" />
                <text x="0" y="-6" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">
                  G2 · Feasibility
                </text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  ADR &amp; Finance
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#94a3b8" fontSize="7">
                  DDA (Weekly)
                </text>
              </g>

              {/* T1 - Gate G3 Priority (SteerCo Monthly) */}
              <g transform="translate(580, 90)">
                <rect
                  x="-46"
                  y="-24"
                  width="92"
                  height="48"
                  rx="10"
                  fill="#0b1329"
                  stroke={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
                  strokeWidth={flowCalculations.steerCo.isBottleneck ? "3" : "2"}
                />
                {flowCalculations.steerCo.isBottleneck && (
                  <g transform="translate(0, -32)">
                    <rect x="-60" y="-9" width="120" height="18" rx="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                    <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
                      🚨 STEERCO BOTTLENECK
                    </text>
                  </g>
                )}
                <text x="0" y="-7" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="bold">
                  G3 · Priority
                </text>
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                  60% Hub Pool
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#fbbf24" fontSize="7.5" fontWeight="bold">
                  SteerCo (Monthly)
                </text>
              </g>

              {/* T1 - Gate G4 GO BUILD */}
              <g transform="translate(750, 90)">
                <rect x="-42" y="-22" width="84" height="44" rx="9" fill="#0b1329" stroke="#10b981" strokeWidth="2" />
                <text x="0" y="-6" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">
                  G4 · GO BUILD
                </text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  Mode 1 · Hub
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#94a3b8" fontSize="7">
                  SteerCo Unlock
                </text>
              </g>

              {/* --- T2 NODES (SCALE PATH) --- */}
              {/* T2 - Gate G2 Feasibility */}
              <g transform="translate(400, 210)">
                <rect x="-42" y="-22" width="84" height="44" rx="9" fill="#0b1329" stroke="#38bdf8" strokeWidth="2" />
                <text x="0" y="-6" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                  G2 · Feasibility
                </text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  Platform Fit
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#94a3b8" fontSize="7">
                  DDA (Weekly)
                </text>
              </g>

              {/* T2 - Gate G3 Priority (Portfolio Board) */}
              <g transform="translate(580, 210)">
                <rect
                  x="-46"
                  y="-24"
                  width="92"
                  height="48"
                  rx="10"
                  fill="#0b1329"
                  stroke={flowCalculations.portfolioBoard.isBottleneck ? "#f59e0b" : "#38bdf8"}
                  strokeWidth="2"
                />
                {flowCalculations.portfolioBoard.isBottleneck && (
                  <g transform="translate(0, -32)">
                    <rect x="-55" y="-9" width="110" height="18" rx="5" fill="#f59e0b" stroke="#000000" strokeWidth="1" />
                    <text x="0" y="3.5" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="900">
                      ⚠️ BOARD QUEUE
                    </text>
                  </g>
                )}
                <text x="0" y="-7" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                  G3 · Priority
                </text>
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                  Shared Squad
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#94a3b8" fontSize="7">
                  Portfolio Board
                </text>
              </g>

              {/* T2 - Gate G4 GO BUILD */}
              <g transform="translate(750, 210)">
                <rect x="-42" y="-22" width="84" height="44" rx="9" fill="#0b1329" stroke="#38bdf8" strokeWidth="2" />
                <text x="0" y="-6" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                  G4 · GO BUILD
                </text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  Mode 2 · Tranche
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#94a3b8" fontSize="7">
                  CDO/CFO Unlock
                </text>
              </g>

              {/* --- T3 FAST LANE (SKIPS G2 & G3, DIRECT TO G4) --- */}
              <g transform="translate(750, 350)">
                <rect x="-50" y="-22" width="100" height="44" rx="9" fill="#0b1329" stroke="#fbbf24" strokeWidth="2" />
                <text x="0" y="-6" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
                  G4 · 1-Page Canvas
                </text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  Mode 3 · Enable me
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#34d399" fontSize="7.5" fontWeight="bold">
                  10-Day SLA (Skips G2/3)
                </text>
              </g>

              {/* --- T4 SELF-SERVICE AI (SKIPS G2 & G3, DIRECT TO G4) --- */}
              <g transform="translate(750, 470)">
                <rect x="-50" y="-22" width="100" height="44" rx="9" fill="#0b1329" stroke="#c084fc" strokeWidth="2" />
                <text x="0" y="-6" textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="bold">
                  G4 · Registry Line
                </text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  Self-Service AI
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#94a3b8" fontSize="7">
                  Instant (Skips G2/3)
                </text>
              </g>

              {/* G4 FILTER BADGE */}
              <g transform="translate(795, 255)">
                <rect x="-42" y="-10" width="84" height="20" rx="5" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold">
                  G4 Pass: {assumptions.g4PassRate}%
                </text>
              </g>

              {/* SHELVED / DROPPED AT G4 BADGE */}
              <g transform="translate(830, 585)">
                <rect x="-55" y="-10" width="110" height="20" rx="5" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
                  ✕ Shelved: {100 - assumptions.g4PassRate}% ({flowCalculations.droppedAtG4PerWeek.toFixed(1)}/wk)
                </text>
              </g>

              {/* NODE: MVP BUILD CONVERGENCE */}
              <g transform="translate(900, 290)">
                <circle r="34" fill="#0b1329" stroke="#10b981" strokeWidth="2.5" />
                <text x="0" y="-7" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">
                  MVP BUILD
                </text>
                <text x="0" y="8" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
                  {flowCalculations.netThroughputToBuildPerWeek.toFixed(1)}
                </text>
                <text x="0" y="20" textAnchor="middle" fill="#94a3b8" fontSize="8">
                  UC / wk built
                </text>
              </g>

              {/* NODE: GATE G5 (PRE-SCALE / POST-MVP DECISION) */}
              <g transform="translate(1030, 290)">
                <circle r="32" fill="#0b1329" stroke="#818cf8" strokeWidth="2.5" />
                <text x="0" y="-7" textAnchor="middle" fill="#a5b4fc" fontSize="9.5" fontWeight="bold">
                  GATE G5
                </text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                  Pre-Scale
                </text>
                <text x="0" y="17" textAnchor="middle" fill="#818cf8" fontSize="7.5" fontWeight="bold">
                  Eval &amp; Scaling
                </text>
              </g>

              {/* POST-MVP PROMOTION BADGE (Curving into T2 Scale!) */}
              <g transform="translate(1100, 185)">
                <rect x="-65" y="-11" width="130" height="22" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                <text x="0" y="3.5" textAnchor="middle" fill="#c7d2fe" fontSize="8.5" fontWeight="bold">
                  ★ Promoted to T2 ({assumptions.postMvpPromotionRate}%)
                </text>
              </g>

              {/* NODE: RUN (G6) */}
              <g transform="translate(1140, 290)">
                <circle r="34" fill="#0b1329" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="0" y="-7" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                  RUN (G6)
                </text>
                <text x="0" y="8" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">
                  {assumptions.activeInRunCount}
                </text>
                <text x="0" y="20" textAnchor="middle" fill="#94a3b8" fontSize="8">
                  Live Operations
                </text>
              </g>

              {/* FLOATING PILL FOR MAJOR MODIFICATION RETURN */}
              <g transform="translate(780, 24)">
                <rect x="-130" y="-12" width="260" height="24" rx="8" fill="#0b1329" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fill="#f59e0b" fontSize="9.5" fontWeight="bold">
                  ↺ Major Modification Return ({assumptions.returnFromRunRate}% · {Math.round(flowCalculations.returningFromRunPerWeek * 4.33 * 10) / 10} UC/mo)
                </text>
              </g>
            </svg>

            {/* OVERLAY HTML5 CANVAS FOR 60FPS DISCRETE PARTICLE BURSTS */}
            <canvas
              ref={canvasRef}
              width={1200}
              height={620}
              className="w-full h-full absolute inset-0 pointer-events-none"
            />
          </div>
        </div>

        {/* BOTTOM METRICS RIBBON UNDER FLOW */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-gray-800 text-gray-300">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-white block">T1 · Transform Lane</span>
              <span className="text-[11px] text-gray-400">
                G1 $\rightarrow$ G2 $\rightarrow$ G3 $\rightarrow$ G4 · SteerCo Reviews
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-sky-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">T2 · Scale Lane</span>
              <span className="text-[11px] text-gray-400">
                G1 $\rightarrow$ G2 $\rightarrow$ G3 $\rightarrow$ G4 + Promoted T3/T4
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">T3 · Fast Lane</span>
              <span className="text-[11px] text-gray-400">
                Direct G4 $\rightarrow$ MVP $\rightarrow$ G5 Promotion
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-purple-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">T4 · Self-Service AI</span>
              <span className="text-[11px] text-gray-400">
                Direct G4 $\rightarrow$ Catalog Tool $\rightarrow$ G5 Promotion
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: REAL-TIME COMITOLOGY SPOTLIGHT & BOTTLENECK ANALYSIS
          (Updates in real time to show which meeting is the problem & backlog)
      ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider font-mono">
              Live Comitology Diagnosis
            </span>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              3. Comitology Review &amp; Real-Time Problem Meeting Spotlight
            </h2>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Updates in real-time as you move assumptions to pinpoint{" "}
            <strong>exactly which meeting is the bottleneck</strong> and what
            the queue backlog looks like.
          </p>
        </div>

        {/* REAL-TIME PROBLEM MEETING SPOTLIGHT BANNER */}
        {flowCalculations.primaryProblemMeeting.severity !== "NONE" ? (
          <div
            className={`p-6 rounded-2xl border-2 space-y-3 shadow-md ${
              flowCalculations.primaryProblemMeeting.severity === "SEVERE"
                ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20"
                : "bg-amber-50 border-amber-400 ring-2 ring-amber-500/20"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-3 h-3 rounded-full ${
                    flowCalculations.primaryProblemMeeting.severity === "SEVERE"
                      ? "bg-rose-600 animate-ping"
                      : "bg-amber-500"
                  }`}
                />
                <span className="text-xs font-black uppercase tracking-wider text-rose-950 font-mono">
                  {flowCalculations.primaryProblemMeeting.severity === "SEVERE"
                    ? "🚨 CRITICAL BOTTLENECK FORUM IDENTIFIED"
                    : "⚠️ BOTTLENECK FORUM DETECTED"}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white text-gray-900 border border-black/10">
                  {flowCalculations.primaryProblemMeeting.name}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-gray-700">
                Cadence: {flowCalculations.primaryProblemMeeting.interval}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-white border border-black/10">
                <span className="text-gray-500 block font-medium">
                  Demand per Meeting Cycle
                </span>
                <span className="text-lg font-black text-gray-900">
                  {flowCalculations.primaryProblemMeeting.arrivingPerCycle}{" "}
                  <span className="text-xs font-semibold text-gray-500">
                    UCs / meeting
                  </span>
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  Arrives during{" "}
                  {flowCalculations.primaryProblemMeeting.intervalWeeks}-week
                  cycle
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-black/10">
                <span className="text-gray-500 block font-medium">
                  Meeting Slot Capacity
                </span>
                <span className="text-lg font-black text-gray-900">
                  {flowCalculations.primaryProblemMeeting.slotCapacity}{" "}
                  <span className="text-xs font-semibold text-gray-500">
                    UCs reviewed
                  </span>
                </span>
                <span className="text-[10px] text-rose-700 font-bold block mt-0.5">
                  Deficit: -
                  {(
                    flowCalculations.primaryProblemMeeting.arrivingPerCycle -
                    flowCalculations.primaryProblemMeeting.slotCapacity
                  ).toFixed(1)}{" "}
                  UCs/meeting
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-black/10">
                <span className="text-gray-500 block font-medium">
                  Current Queue Backlog
                </span>
                <span className="text-lg font-black text-rose-700">
                  {flowCalculations.primaryProblemMeeting.queue}{" "}
                  <span className="text-xs font-semibold">UCs waiting</span>
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  Stacked in front of node
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-black/10">
                <span className="text-gray-500 block font-medium">Total Delay</span>
                <span className="text-lg font-black text-rose-700">
                  {flowCalculations.primaryProblemMeeting.waitWeeks}{" "}
                  <span className="text-xs font-semibold">weeks wait</span>
                </span>
                <span className="text-[10px] font-bold text-rose-800 block mt-0.5">
                  {flowCalculations.primaryProblemMeeting.cyclesDelay} meeting
                  cycles behind!
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-800 leading-relaxed pt-1">
              <strong>Why this is a problem:</strong> Initiatives are blocked at{" "}
              <strong>{flowCalculations.primaryProblemMeeting.name}</strong>{" "}
              waiting for agenda time rather than engineering capacity. Each
              initiative waits across{" "}
              <strong>
                {flowCalculations.primaryProblemMeeting.cyclesDelay} full
                meeting cycles
              </strong>{" "}
              before receiving a decision.
            </p>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-sm block">
                  Zero Comitology Bottlenecks Detected
                </span>
                <span className="text-gray-600">
                  All governing forums (SteerCo, Portfolio Board, DDA) have
                  sufficient slot capacity to review incoming initiatives within
                  1 meeting cycle.
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs">
              Healthy Flow
            </span>
          </div>
        )}

        {/* ALL FORUMS COMPARATIVE TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Governing Forum</th>
                <th className="py-3 px-3">Cadence</th>
                <th className="py-3 px-3">Slot Capacity</th>
                <th className="py-3 px-3">Arriving Demand</th>
                <th className="py-3 px-3">Queue Backlog</th>
                <th className="py-3 px-3">Est. Wait Time</th>
                <th className="py-3 px-3">Meeting Delays</th>
                <th className="py-3 px-4">Bottleneck Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {/* 1. Transformation SteerCo */}
              <tr
                className={`${
                  flowCalculations.steerCo.isSevere
                    ? "bg-rose-50/70"
                    : flowCalculations.steerCo.isBottleneck
                    ? "bg-amber-50/60"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 shrink-0" />
                    <div>
                      <div>Transformation SteerCo</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Chaired by TO Lead &amp; ExCo Stream Sponsors · T1 Gating &amp; Funding
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-mono font-bold text-[10px]">
                    Monthly (4 wks)
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {assumptions.steerCoCapacity} UC / meeting
                </td>
                <td className="py-3.5 px-3 font-mono">
                  {flowCalculations.steerCo.demandPerWeek.toFixed(2)} UC / wk
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                  {flowCalculations.steerCo.queue} UCs in line
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.steerCo.waitWeeks} weeks
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.steerCo.cyclesDelay} cycles
                </td>
                <td className="py-3.5 px-4">
                  {flowCalculations.steerCo.isSevere ? (
                    <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 w-fit shadow-sm">
                      <AlertTriangle className="w-3 h-3 text-white" /> 🚨 Severe Bottleneck (&gt;2 meetings)
                    </span>
                  ) : flowCalculations.steerCo.isBottleneck ? (
                    <span className="px-2.5 py-1 rounded-md bg-amber-500 text-amber-950 font-bold text-[10px] flex items-center gap-1 w-fit shadow-sm">
                      <AlertTriangle className="w-3 h-3" /> ⚠️ Bottleneck (&gt;1 meeting)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Healthy Flow (≤1 meeting)
                    </span>
                  )}
                </td>
              </tr>

              {/* 2. AI Portfolio Board */}
              <tr
                className={`${
                  flowCalculations.portfolioBoard.isSevere
                    ? "bg-rose-50/70"
                    : flowCalculations.portfolioBoard.isBottleneck
                    ? "bg-amber-50/60"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                    <div>
                      <div>AI Portfolio Board</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Stream Leadership &amp; Hub Delegates · T2 Gating &amp; T3 SLA
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-mono font-bold text-[10px]">
                    Fortnightly (2 wks)
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {assumptions.portfolioBoardCapacity} UC / meeting
                </td>
                <td className="py-3.5 px-3 font-mono">
                  {flowCalculations.portfolioBoard.demandPerWeek.toFixed(2)} UC / wk
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                  {flowCalculations.portfolioBoard.queue} UCs in line
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.portfolioBoard.waitWeeks} weeks
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.portfolioBoard.cyclesDelay} cycles
                </td>
                <td className="py-3.5 px-4">
                  {flowCalculations.portfolioBoard.isSevere ? (
                    <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 w-fit shadow-sm">
                      <AlertTriangle className="w-3 h-3 text-white" /> 🚨 Severe Bottleneck (&gt;2 meetings)
                    </span>
                  ) : flowCalculations.portfolioBoard.isBottleneck ? (
                    <span className="px-2.5 py-1 rounded-md bg-amber-500 text-amber-950 font-bold text-[10px] flex items-center gap-1 w-fit shadow-sm">
                      <AlertTriangle className="w-3 h-3" /> ⚠️ Bottleneck (&gt;1 meeting)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Healthy Flow (≤1 meeting)
                    </span>
                  )}
                </td>
              </tr>

              {/* 3. Digital Design Authority (DDA) */}
              <tr
                className={`${
                  flowCalculations.dda.isSevere
                    ? "bg-rose-50/70"
                    : flowCalculations.dda.isBottleneck
                    ? "bg-amber-50/60"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                    <div>
                      <div>Digital Design Authority (DDA)</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Architecture, Cyber &amp; ORAI · Gate G2 ADRs for T1 &amp; T2
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-mono font-bold text-[10px]">
                    Weekly (1 wk)
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {assumptions.ddaCapacity} ADRs / meeting
                </td>
                <td className="py-3.5 px-3 font-mono">
                  {flowCalculations.dda.demandPerWeek.toFixed(2)} ADRs / wk
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                  {flowCalculations.dda.queue} ADRs in line
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.dda.waitWeeks} weeks
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.dda.cyclesDelay} cycles
                </td>
                <td className="py-3.5 px-4">
                  {flowCalculations.dda.isSevere ? (
                    <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 w-fit shadow-sm">
                      <AlertTriangle className="w-3 h-3 text-white" /> 🚨 Severe Bottleneck (&gt;2 meetings)
                    </span>
                  ) : flowCalculations.dda.isBottleneck ? (
                    <span className="px-2.5 py-1 rounded-md bg-amber-500 text-amber-950 font-bold text-[10px] flex items-center gap-1 w-fit shadow-sm">
                      <AlertTriangle className="w-3 h-3" /> ⚠️ Bottleneck (&gt;1 meeting)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Healthy Flow (≤1 meeting)
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* MITIGATION & PLAYBOOK ACTIONS */}
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Recommended Operating Model Mitigations for Current Scenario:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
              <span className="font-bold text-gray-900 block">
                1. SteerCo Extraordinary Sessions
              </span>
              <p className="text-gray-600 leading-snug">
                If SteerCo waiting time exceeds 4 weeks, shift from Monthly to
                Fortnightly cadences or expand slot capacity from 3 to 5 use
                cases per meeting.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
              <span className="font-bold text-gray-900 block">
                2. Gate G2 Delegation to Stream Leads
              </span>
              <p className="text-gray-600 leading-snug">
                Delegate Gate G2 business problem endorsement fully to Stream
                Leads, reserving SteerCo agenda exclusively for G3 Priority &amp;
                G4 Budget Tranches.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
              <span className="font-bold text-gray-900 block">
                3. Leverage T3 Fast Lane &amp; Post-MVP Scaling
              </span>
              <p className="text-gray-600 leading-snug">
                Encourage business teams to test MVPs under T3 (skipping G2/G3),
                then promote proven winners into T2 Scale at Gate G5 after MVP
                evaluation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
