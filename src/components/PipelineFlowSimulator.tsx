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

// Simulation Ball Interface
interface Ball {
  id: string;
  tier: "T1" | "T2" | "T3" | "T4";
  color: string;
  glowColor: string;
  x: number;
  y: number;
  radius: number;
  pathKey: string;
  distance: number; // distance along SVG path in px
  lateralOffset: number; // perpendicular offset so balls in same burst don't overlap
  longitudinalOffset: number; // slight longitudinal spread within the burst pack
  speed: number;
  passG1: boolean;
  passG4: boolean;
  isPromoted: boolean; // For T3/T4 after MVP build at G5
  state:
    | "MOVING"
    | "QUEUED_STEERCO"
    | "QUEUED_BOARD"
    | "DROPPING_G1"
    | "DROPPING_G4"
    | "COMPLETED";
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

  // Live Queue state for SVG rendering (Starts at 0 = 100% GREEN, grows as bottleneck appears)
  const [liveQueues, setLiveQueues] = useState({
    steerCo: 0,
    board: 0,
  });

  // Canvas and animation refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const burstTimerRef = useRef<number>(0);

  // Meeting cycle timers (in milliseconds)
  const steerCoTimerRef = useRef<number>(0);
  const boardTimerRef = useRef<number>(0);
  const steerCoCapacityUsedRef = useRef<number>(0);
  const boardCapacityUsedRef = useRef<number>(0);

  // SVG Path DOM refs for mathematically exact path querying via getPointAtLength
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});

  // Reset simulation completely (Everything starts green!)
  const resetSimulation = useCallback(() => {
    ballsRef.current = [];
    burstTimerRef.current = 0;
    steerCoTimerRef.current = 0;
    boardTimerRef.current = 0;
    steerCoCapacityUsedRef.current = 0;
    boardCapacityUsedRef.current = 0;
    setSimulatedWeek(1);
    setSecondsUntilNextBurst(10.0);
    setLiveQueues({ steerCo: 0, board: 0 });
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

  // Auto-Balancing 4-Tier Slider Handler (Guarantees exact 100% sum)
  const handleTierSplitChange = (
    changedTier: "t1" | "t2" | "t3" | "t4",
    rawNewValue: number
  ) => {
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

  // --- MATHEMATICAL FLOW CALCULATIONS ---
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

    const totalSplit = t1Split + t2Split + t3Split + selfServeSplit || 100;
    const normT1 = t1Split / totalSplit;
    const normT2 = t2Split / totalSplit;
    const normT3 = t3Split / totalSplit;
    const normSS = selfServeSplit / totalSplit;

    const acceptedAtG1PerWeek = incomingPerWeek * (acceptanceRateG1 / 100);
    const rejectedAtG1PerWeek = incomingPerWeek * (1 - acceptanceRateG1 / 100);

    const returningFromRunPerWeek =
      (activeInRunCount * (returnFromRunRate / 100)) / 12;

    const t1WeeklyInitial =
      acceptedAtG1PerWeek * normT1 + returningFromRunPerWeek * 0.5;
    const t2WeeklyInitial =
      acceptedAtG1PerWeek * normT2 + returningFromRunPerWeek * 0.35;
    const t3WeeklyInitial =
      acceptedAtG1PerWeek * normT3 + returningFromRunPerWeek * 0.15;
    const ssWeeklyTotal = acceptedAtG1PerWeek * normSS;

    const totalReachingG4PerWeek =
      t1WeeklyInitial + t2WeeklyInitial + t3WeeklyInitial + ssWeeklyTotal;

    const netThroughputToBuildPerWeek =
      totalReachingG4PerWeek * (g4PassRate / 100);
    const droppedAtG4PerWeek =
      totalReachingG4PerWeek * (1 - g4PassRate / 100);

    const t3BuildWeekly = t3WeeklyInitial * (g4PassRate / 100);
    const ssBuildWeekly = ssWeeklyTotal * (g4PassRate / 100);
    const totalPromotedToT2PerWeek =
      (t3BuildWeekly + ssBuildWeekly) * (postMvpPromotionRate / 100);

    const steerCoIntervalWeeks = 4; // Monthly
    const portfolioBoardIntervalWeeks = 2; // Fortnightly
    const ddaIntervalWeeks = 1; // Weekly

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

    const totalInflowPerMonth = incomingPerWeek * 4.33;
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
      assumptions.g1LeadDays + assumptions.g4T3LeadDays + 10;

    const ssLeadDays = 1;

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
      totalPromotedToT2PerWeek,
      weightedAvgLeadDays,
      bottleneckCount,
      t1LeadDays,
      t2LeadDays,
      t3LeadDays,
      ssLeadDays,
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

  // SPAWNS ALL BALLS IN ONE SINGLE BURST (Exactly matching incomingPerWeek)
  const spawnWeeklyBurst = useCallback(() => {
    const totalBurstCount = Math.max(1, Math.round(assumptions.incomingPerWeek));
    const newBalls: Ball[] = [];

    // Exact count distribution across tiers
    const t1Count = Math.round((totalBurstCount * assumptions.t1Split) / 100);
    const t2Count = Math.round((totalBurstCount * assumptions.t2Split) / 100);
    const t3Count = Math.round((totalBurstCount * assumptions.t3Split) / 100);
    const t4Count = Math.max(0, totalBurstCount - t1Count - t2Count - t3Count);

    const tierSequence: Array<"T1" | "T2" | "T3" | "T4"> = [];
    for (let i = 0; i < t1Count; i++) tierSequence.push("T1");
    for (let i = 0; i < t2Count; i++) tierSequence.push("T2");
    for (let i = 0; i < t3Count; i++) tierSequence.push("T3");
    for (let i = 0; i < t4Count; i++) tierSequence.push("T4");

    tierSequence.forEach((tier, idx) => {
      const passG1 = Math.random() * 100 < assumptions.acceptanceRateG1;
      const passG4 = Math.random() * 100 < assumptions.g4PassRate;
      const isPromoted =
        (tier === "T3" || tier === "T4") &&
        Math.random() * 100 < assumptions.postMvpPromotionRate;

      let color = "#10b981"; // T1 Emerald
      let glowColor = "rgba(16, 185, 129, 0.7)";
      let pathKey = "t1-main";

      if (tier === "T2") {
        color = "#38bdf8"; // Sky Blue
        glowColor = "rgba(56, 189, 248, 0.7)";
        pathKey = "t2-main";
      } else if (tier === "T3") {
        color = "#f59e0b"; // Amber
        glowColor = "rgba(245, 158, 11, 0.7)";
        pathKey = isPromoted ? "t3-promoted" : "t3-main";
      } else if (tier === "T4") {
        color = "#c084fc"; // Purple
        glowColor = "rgba(192, 132, 252, 0.7)";
        pathKey = isPromoted ? "t4-promoted" : "t4-main";
      }

      // Lateral spread perpendicular to pipe so all balls in the burst travel side-by-side
      const lateralOffset = ((idx % 3) - 1) * 7 + (Math.random() - 0.5) * 3;
      // Tight longitudinal pack so they move together as a single convoy/burst
      const longitudinalOffset = Math.floor(idx / 3) * -12 + (Math.random() - 0.5) * 4;

      newBalls.push({
        id: `ball-${Date.now()}-${idx}-${Math.random()}`,
        tier,
        color,
        glowColor,
        x: 80,
        y: 290,
        radius: 5,
        pathKey,
        distance: 0, // ALL BALLS START TOGETHER AT 0 DISTANCE!
        lateralOffset,
        longitudinalOffset,
        speed: 105 + (Math.random() - 0.5) * 6, // Base speed ~105 px/s
        passG1,
        passG4,
        isPromoted,
        state: "MOVING",
        alpha: 1,
      });
    });

    ballsRef.current = [...ballsRef.current, ...newBalls];
  }, [assumptions]);

  // MAIN 60FPS ANIMATION LOOP
  useEffect(() => {
    let animationFrameId: number;
    const WEEK_MS = 10000 / simSpeed;
    const STEERCO_CYCLE_MS = 40000 / simSpeed; // Monthly meeting (4 weeks)
    const BOARD_CYCLE_MS = 20000 / simSpeed; // Fortnightly meeting (2 weeks)

    // Trigger initial burst
    if (ballsRef.current.length === 0) {
      spawnWeeklyBurst();
    }

    const render = (time: number) => {
      const dt = Math.min(100, time - lastTimeRef.current);
      lastTimeRef.current = time;

      if (isPlaying) {
        // --- 1. WEEKLY BURST CLOCK (10 SECONDS = 1 WEEK) ---
        burstTimerRef.current += dt;
        const remaining = Math.max(0, (WEEK_MS - burstTimerRef.current) / 1000);
        setSecondsUntilNextBurst(Math.round(remaining * 10) / 10);

        if (burstTimerRef.current >= WEEK_MS) {
          burstTimerRef.current = 0;
          setSimulatedWeek((w) => w + 1);
          spawnWeeklyBurst(); // Fire next burst of balls!
        }

        // --- 2. COMITOLOGY MEETING CYCLES (RELEASES QUEUED BALLS) ---
        steerCoTimerRef.current += dt;
        if (steerCoTimerRef.current >= STEERCO_CYCLE_MS) {
          steerCoTimerRef.current = 0;
          // SteerCo Meeting session held: release up to steerCoCapacity balls from front of queue!
          let released = 0;
          for (const b of ballsRef.current) {
            if (b.state === "QUEUED_STEERCO" && released < assumptions.steerCoCapacity) {
              b.state = "MOVING";
              b.distance = 585; // Move past SteerCo node!
              released++;
            }
          }
        }

        boardTimerRef.current += dt;
        if (boardTimerRef.current >= BOARD_CYCLE_MS) {
          boardTimerRef.current = 0;
          // AI Portfolio Board meeting held: release up to portfolioBoardCapacity balls!
          let released = 0;
          for (const b of ballsRef.current) {
            if (b.state === "QUEUED_BOARD" && released < assumptions.portfolioBoardCapacity) {
              b.state = "MOVING";
              b.distance = 585;
              released++;
            }
          }
        }
      }

      // --- 3. CANVAS DRAWING & PRECISE SVG PATH QUERYING ---
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, 1200, 620);

          let steerCoWaitingCount = 0;
          let boardWaitingCount = 0;
          const activeBalls: Ball[] = [];

          for (const b of ballsRef.current) {
            if (isPlaying) {
              if (b.state === "MOVING") {
                b.distance += (b.speed * dt * simSpeed) / 1000;
              }
            }

            // G1 FILTER CHECK (Gate G1 is at x=220, approx distance=140px)
            if (b.distance >= 140 && !b.passG1 && b.state === "MOVING") {
              b.state = "DROPPING_G1";
              b.pathKey = "drop-g1";
              b.distance = 0;
            }

            // G4 FILTER CHECK (Gate G4 is at x=750, approx distance=720px)
            if (b.distance >= 720 && !b.passG4 && b.state === "MOVING") {
              b.state = "DROPPING_G4";
              if (b.tier === "T1") b.pathKey = "drop-g4-t1";
              else if (b.tier === "T2") b.pathKey = "drop-g4-t2";
              else if (b.tier === "T3") b.pathKey = "drop-g4-t3";
              else b.pathKey = "drop-g4-t4";
              b.distance = 0;
            }

            // BOTTLENECK QUEUE CHECKS AT G3 (x=580, approx distance=510px)
            if (b.tier === "T1" && b.state === "MOVING" && b.distance >= 510 && b.distance < 570) {
              // Check if SteerCo has already processed capacity for this meeting cycle
              if (flowCalculations.steerCo.isBottleneck) {
                b.state = "QUEUED_STEERCO";
              }
            }

            if (b.tier === "T2" && b.state === "MOVING" && b.distance >= 510 && b.distance < 570) {
              if (flowCalculations.portfolioBoard.isBottleneck) {
                b.state = "QUEUED_BOARD";
              }
            }

            // POSITION COMPUTATION VIA DOM SVG PATH
            const pathEl = pathRefs.current[b.pathKey];
            if (pathEl) {
              const totalLen = pathEl.getTotalLength();

              if (b.state === "QUEUED_STEERCO") {
                b.queueIndex = steerCoWaitingCount++;
                // Neatly stacked in queue in front of SteerCo node (x=540, y=90)
                b.x = 540 - b.queueIndex * 15;
                b.y = 90 + Math.sin(time / 200 + b.queueIndex) * 1.5;
              } else if (b.state === "QUEUED_BOARD") {
                b.queueIndex = boardWaitingCount++;
                // Stacked in front of Portfolio Board (x=540, y=210)
                b.x = 540 - b.queueIndex * 15;
                b.y = 210 + Math.sin(time / 200 + b.queueIndex) * 1.5;
              } else if (b.state === "DROPPING_G1") {
                const effectiveDist = Math.min(totalLen, b.distance);
                const pt = pathEl.getPointAtLength(effectiveDist);
                b.x = pt.x;
                b.y = pt.y;
                b.alpha = Math.max(0, 1 - b.distance / totalLen);
                if (b.distance >= totalLen) b.state = "COMPLETED";
              } else if (b.state === "DROPPING_G4") {
                const effectiveDist = Math.min(totalLen, b.distance);
                const pt = pathEl.getPointAtLength(effectiveDist);
                b.x = pt.x;
                b.y = pt.y;
                b.alpha = Math.max(0, 1 - b.distance / totalLen);
                if (b.distance >= totalLen) b.state = "COMPLETED";
              } else {
                // NORMAL MOVEMENT: Exact point along the SVG path
                const effectiveDist = Math.min(
                  totalLen,
                  Math.max(0, b.distance + b.longitudinalOffset)
                );
                const pt = pathEl.getPointAtLength(effectiveDist);

                // Compute tangent angle for lateral offset perpendicular to curve
                const ptNext = pathEl.getPointAtLength(
                  Math.min(totalLen, effectiveDist + 2)
                );
                const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x);
                const normalX = -Math.sin(angle) * b.lateralOffset;
                const normalY = Math.cos(angle) * b.lateralOffset;

                b.x = pt.x + normalX;
                b.y = pt.y + normalY;

                // Fades out into RUN
                if (effectiveDist >= totalLen - 20) {
                  b.alpha = Math.max(0, (totalLen - effectiveDist) / 20);
                }
                if (effectiveDist >= totalLen) {
                  b.state = "COMPLETED";
                }
              }

              // DRAW BALL ON CANVAS
              if (b.alpha > 0.05 && b.state !== "COMPLETED") {
                ctx.save();
                ctx.globalAlpha = b.alpha;

                // Glowing outer halo
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius * 2.2, 0, Math.PI * 2);
                ctx.fillStyle = b.glowColor;
                ctx.fill();

                // Core solid ball
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = b.color;
                ctx.shadowColor = b.color;
                ctx.shadowBlur = 8;
                ctx.fill();

                // Promoted star/ring after MVP build
                if (b.isPromoted && b.distance > 800) {
                  ctx.beginPath();
                  ctx.arc(b.x, b.y, b.radius + 3, 0, Math.PI * 2);
                  ctx.strokeStyle = "#ffffff";
                  ctx.lineWidth = 1.5;
                  ctx.stroke();
                }

                ctx.restore();
                activeBalls.push(b);
              }
            }
          }

          ballsRef.current = activeBalls;

          // Sync live queue counts for dynamic SVG line swelling & color shift
          if (
            steerCoWaitingCount !== liveQueues.steerCo ||
            boardWaitingCount !== liveQueues.board
          ) {
            setLiveQueues({
              steerCo: steerCoWaitingCount,
              board: boardWaitingCount,
            });
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    animFrameIdRef.current = animationFrameId;

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, simSpeed, spawnWeeklyBurst, flowCalculations, assumptions]);

  // DYNAMIC CONDUIT COLOR & SWELLING CALCULATOR
  // Starts 100% green at queue = 0, swells wider and turns fiery red as queue grows!
  const getBottleneckLineProps = (queueCount: number, baseColor = "#10b981") => {
    if (queueCount === 0) {
      return {
        stroke: baseColor,
        strokeWidth: 9,
        strokeOpacity: 0.35,
        filter: "none",
        isAlert: false,
      };
    }
    if (queueCount <= 2) {
      return {
        stroke: "#f59e0b", // Amber warning
        strokeWidth: 14 + queueCount * 2,
        strokeOpacity: 0.7,
        filter: "url(#glow-amber)",
        isAlert: true,
      };
    }
    // Severe Red Bottleneck Swelling!
    return {
      stroke: "#ef4444", // Bright Crimson Red
      strokeWidth: Math.min(26, 16 + queueCount * 2.5),
      strokeOpacity: 0.9,
      filter: "url(#glow-red)",
      isAlert: true,
    };
  };

  const steerCoLineProps = getBottleneckLineProps(liveQueues.steerCo, "#10b981");
  const boardLineProps = getBottleneckLineProps(liveQueues.board, "#38bdf8");

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
            Every 10 seconds, a burst containing all weekly use cases enters the
            pipeline together. All lines start green. As meeting capacities are
            exceeded over time, lines swell and turn red where queues form.
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
            liveQueues.steerCo > 0 || liveQueues.board > 0
              ? "bg-rose-50 border-rose-300 ring-2 ring-rose-500/20"
              : "bg-emerald-50 border-emerald-300"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-gray-700">
            <ShieldAlert
              className={`w-3.5 h-3.5 ${
                liveQueues.steerCo > 0 || liveQueues.board > 0
                  ? "text-rose-600 animate-bounce"
                  : "text-emerald-600"
              }`}
            />
            Live Backlog
          </span>
          <div className="mt-2">
            <div
              className={`text-2xl font-black ${
                liveQueues.steerCo > 0 || liveQueues.board > 0
                  ? "text-rose-700"
                  : "text-emerald-800"
              }`}
            >
              {liveQueues.steerCo + liveQueues.board}{" "}
              <span className="text-xs font-semibold">UCs Queued</span>
            </div>
            <div
              className={`text-[11px] font-bold mt-0.5 ${
                liveQueues.steerCo > 0 || liveQueues.board > 0
                  ? "text-rose-800"
                  : "text-emerald-700"
              }`}
            >
              {liveQueues.steerCo > 0
                ? `SteerCo: ${liveQueues.steerCo} in line`
                : "Queues Clear"}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: TOP PANEL — EDITABLE ASSUMPTIONS (100% SUM CONSTRAINED)
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
                {assumptions.incomingPerWeek} UC / burst
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
              enter SOURCE simultaneously in a single burst.
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
              <strong>{100 - assumptions.g4PassRate}%</strong> drop out into the
              shelved bin.
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
              Decided <strong>AFTER MVP build at Gate G5</strong>: T3 and T4
              solutions that proved value get promoted to T2 Scale.
            </p>
          </div>

          {/* 5. TIER ROUTING SPLIT (ALWAYS EQUAL TO 100%) */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">
                Tier Routing Split (T1–T4)
              </label>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
                ✓ Sum: 100%
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
                    &lt;€50k · Catalog
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
          SECTION 2: MAIN VIEW — BURST SIMULATION & DYNAMIC SWELLING BOTTLENECK
          (All balls in 1 burst · Exact SVG Path Tracking · Swells Red as Queue grows)
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
                1 Week = 10s Discrete Burst Engine
              </span>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                2. Main View — Live Project Flow &amp; Dynamic Bottleneck Swelling
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Every 10 seconds, a burst of{" "}
              <strong className="text-emerald-400">
                {Math.round(assumptions.incomingPerWeek)} use cases
              </strong>{" "}
              travels together down the pipeline. Lines start green and swell
              red as queue backlogs build up.
            </p>
          </div>

          {/* SIMULATION CLOCK & CONTROLS */}
          <div className="flex items-center gap-3 bg-black/60 border border-white/10 px-3.5 py-2 rounded-2xl shrink-0">
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
              title="Reset simulation and clear queues"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* INTERACTIVE PIPELINE SVG CANVAS (1200x620 ViewBox) */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1040px] aspect-[1200/620] relative rounded-2xl bg-[#060a14] border border-gray-800 shadow-inner">
            <svg
              viewBox="0 0 1200 620"
              className="w-full h-full select-none absolute inset-0 pointer-events-none"
              style={{ overflow: "visible" }}
            >
              <defs>
                <filter id="glow-red" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* --- HIDDEN MASTER PATHS USED FOR ACCURATE BALL TRAJECTORY QUERYING --- */}
              <path
                id="t1-main"
                ref={(el) => {
                  pathRefs.current["t1-main"] = el;
                }}
                d="M 80 290 L 220 290 C 290 90, 320 90, 400 90 L 580 90 L 750 90 C 820 90, 850 290, 900 290 L 1030 290 L 1140 290"
                fill="none"
                stroke="transparent"
              />
              <path
                id="t2-main"
                ref={(el) => {
                  pathRefs.current["t2-main"] = el;
                }}
                d="M 80 290 L 220 290 C 290 210, 320 210, 400 210 L 580 210 L 750 210 C 820 210, 850 290, 900 290 L 1030 290 L 1140 290"
                fill="none"
                stroke="transparent"
              />
              <path
                id="t3-main"
                ref={(el) => {
                  pathRefs.current["t3-main"] = el;
                }}
                d="M 80 290 L 220 290 C 290 350, 340 350, 400 350 L 750 350 C 820 350, 850 290, 900 290 L 1030 290 L 1140 290"
                fill="none"
                stroke="transparent"
              />
              <path
                id="t3-promoted"
                ref={(el) => {
                  pathRefs.current["t3-promoted"] = el;
                }}
                d="M 80 290 L 220 290 C 290 350, 340 350, 400 350 L 750 350 C 820 350, 850 290, 900 290 L 1030 290 C 1060 210, 1100 210, 1140 210"
                fill="none"
                stroke="transparent"
              />
              <path
                id="t4-main"
                ref={(el) => {
                  pathRefs.current["t4-main"] = el;
                }}
                d="M 80 290 L 220 290 C 290 470, 340 470, 400 470 L 750 470 C 820 470, 850 290, 900 290 L 1030 290 L 1140 290"
                fill="none"
                stroke="transparent"
              />
              <path
                id="t4-promoted"
                ref={(el) => {
                  pathRefs.current["t4-promoted"] = el;
                }}
                d="M 80 290 L 220 290 C 290 470, 340 470, 400 470 L 750 470 C 820 470, 850 290, 900 290 L 1030 290 C 1060 210, 1100 210, 1140 210"
                fill="none"
                stroke="transparent"
              />
              <path
                id="drop-g1"
                ref={(el) => {
                  pathRefs.current["drop-g1"] = el;
                }}
                d="M 220 290 L 220 380"
                fill="none"
                stroke="transparent"
              />
              <path
                id="drop-g4-t1"
                ref={(el) => {
                  pathRefs.current["drop-g4-t1"] = el;
                }}
                d="M 750 90 C 780 250, 800 570, 830 570"
                fill="none"
                stroke="transparent"
              />
              <path
                id="drop-g4-t2"
                ref={(el) => {
                  pathRefs.current["drop-g4-t2"] = el;
                }}
                d="M 750 210 C 780 350, 800 570, 830 570"
                fill="none"
                stroke="transparent"
              />
              <path
                id="drop-g4-t3"
                ref={(el) => {
                  pathRefs.current["drop-g4-t3"] = el;
                }}
                d="M 750 350 C 780 430, 800 570, 830 570"
                fill="none"
                stroke="transparent"
              />
              <path
                id="drop-g4-t4"
                ref={(el) => {
                  pathRefs.current["drop-g4-t4"] = el;
                }}
                d="M 750 470 C 780 500, 800 570, 830 570"
                fill="none"
                stroke="transparent"
              />

              {/* --- BACKGROUND SWIMLANE GUIDES --- */}
              <rect x="40" y="55" width="720" height="70" rx="14" fill="#10b981" fillOpacity="0.03" stroke="#10b981" strokeOpacity="0.1" />
              <rect x="40" y="175" width="720" height="70" rx="14" fill="#38bdf8" fillOpacity="0.03" stroke="#38bdf8" strokeOpacity="0.1" />
              <rect x="40" y="315" width="720" height="70" rx="14" fill="#f59e0b" fillOpacity="0.03" stroke="#f59e0b" strokeOpacity="0.1" />
              <rect x="40" y="435" width="720" height="70" rx="14" fill="#c084fc" fillOpacity="0.03" stroke="#c084fc" strokeOpacity="0.1" />

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

              {/* --- VISUAL CONDUIT PIPES --- */}
              {/* Pipe: Source to G1 */}
              <path d="M 80 290 L 220 290" fill="none" stroke="#10b981" strokeWidth="12" strokeOpacity="0.25" strokeLinecap="round" />
              {/* Pipe: G1 Drop */}
              <path d="M 220 290 L 220 380" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 4" strokeOpacity="0.5" />

              {/* T1 CONDUIT SEGMENTS */}
              {/* Segment 1: G1 to G2 */}
              <path d="M 220 290 C 290 90, 320 90, 400 90" fill="none" stroke="#10b981" strokeWidth="10" strokeOpacity="0.25" strokeLinecap="round" />
              {/* Segment 2: G2 to G3 BOTTLENECK CONDUIT (STARTS GREEN, SWELLS WIDE & TURNS RED!) */}
              <path
                d="M 400 90 L 580 90"
                fill="none"
                stroke={steerCoLineProps.stroke}
                strokeWidth={steerCoLineProps.strokeWidth}
                strokeOpacity={steerCoLineProps.strokeOpacity}
                filter={steerCoLineProps.filter}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              {/* Segment 3: G3 to G4 */}
              <path d="M 580 90 L 750 90" fill="none" stroke="#10b981" strokeWidth="10" strokeOpacity="0.25" strokeLinecap="round" />
              {/* Segment 4: G4 to MVP Build */}
              <path d="M 750 90 C 820 90, 850 290, 900 290" fill="none" stroke="#10b981" strokeWidth="8" strokeOpacity="0.2" />

              {/* T2 CONDUIT SEGMENTS */}
              <path d="M 220 290 C 290 210, 320 210, 400 210" fill="none" stroke="#38bdf8" strokeWidth="10" strokeOpacity="0.25" strokeLinecap="round" />
              {/* G2 to G3 BOTTLENECK CONDUIT (SWELLS & TURNS RED AS QUEUE GROWS) */}
              <path
                d="M 400 210 L 580 210"
                fill="none"
                stroke={boardLineProps.stroke}
                strokeWidth={boardLineProps.strokeWidth}
                strokeOpacity={boardLineProps.strokeOpacity}
                filter={boardLineProps.filter}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <path d="M 580 210 L 750 210" fill="none" stroke="#38bdf8" strokeWidth="10" strokeOpacity="0.25" strokeLinecap="round" />
              <path d="M 750 210 C 820 210, 850 290, 900 290" fill="none" stroke="#38bdf8" strokeWidth="8" strokeOpacity="0.2" />

              {/* T3 CONDUIT (Skips G2 & G3) */}
              <path d="M 220 290 C 290 350, 340 350, 400 350 L 750 350" fill="none" stroke="#f59e0b" strokeWidth="9" strokeOpacity="0.2" strokeLinecap="round" />
              <path d="M 750 350 C 820 350, 850 290, 900 290" fill="none" stroke="#f59e0b" strokeWidth="8" strokeOpacity="0.2" />

              {/* T4 CONDUIT (Skips G2 & G3) */}
              <path d="M 220 290 C 290 470, 340 470, 400 470 L 750 470" fill="none" stroke="#c084fc" strokeWidth="8" strokeOpacity="0.2" strokeLinecap="round" />
              <path d="M 750 470 C 820 470, 850 290, 900 290" fill="none" stroke="#c084fc" strokeWidth="8" strokeOpacity="0.2" />

              {/* G4 Shelved Exit */}
              <path d="M 750 290 C 780 450, 800 570, 830 570" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 4" strokeOpacity="0.5" />

              {/* MVP Build to Gate G5 */}
              <path d="M 900 290 L 1030 290" fill="none" stroke="#10b981" strokeWidth="12" strokeOpacity="0.25" strokeLinecap="round" />

              {/* Post-MVP Promotion Curve at G5 */}
              <path d="M 1030 290 C 1060 210, 1100 210, 1140 210" fill="none" stroke="#818cf8" strokeWidth="4" strokeDasharray="4 4" strokeOpacity="0.9" />

              {/* Path to RUN */}
              <path d="M 1030 290 L 1140 290" fill="none" stroke="#38bdf8" strokeWidth="10" strokeOpacity="0.25" />

              {/* Return Loop */}
              <path d="M 1140 270 C 950 25, 600 25, 400 70" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 6" strokeOpacity="0.8" />

              {/* --- GATING NODES & LABELS --- */}
              {/* SOURCE */}
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

              {/* GATE G1 */}
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
                  stroke={liveQueues.steerCo > 0 ? "#ef4444" : "#10b981"}
                  strokeWidth={liveQueues.steerCo > 0 ? "3" : "2"}
                />
                {liveQueues.steerCo > 0 && (
                  <g transform="translate(0, -32)">
                    <rect x="-65" y="-9" width="130" height="18" rx="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                    <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
                      🚨 STEERCO QUEUE: {liveQueues.steerCo} in line
                    </text>
                  </g>
                )}
                <text x="0" y="-7" textAnchor="middle" fill={liveQueues.steerCo > 0 ? "#f87171" : "#10b981"} fontSize="9" fontWeight="bold">
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
                  stroke={liveQueues.board > 0 ? "#f59e0b" : "#38bdf8"}
                  strokeWidth="2"
                />
                {liveQueues.board > 0 && (
                  <g transform="translate(0, -32)">
                    <rect x="-60" y="-9" width="120" height="18" rx="5" fill="#f59e0b" stroke="#000000" strokeWidth="1" />
                    <text x="0" y="3.5" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="900">
                      ⚠️ BOARD QUEUE: {liveQueues.board} in line
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

              {/* T3 - Gate G4 1-Page Canvas */}
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

              {/* T4 - Gate G4 Registry Line */}
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

              {/* MVP BUILD CONVERGENCE */}
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

              {/* GATE G5 (PRE-SCALE / POST-MVP DECISION) */}
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

              {/* POST-MVP PROMOTION BADGE */}
              <g transform="translate(1100, 185)">
                <rect x="-65" y="-11" width="130" height="22" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                <text x="0" y="3.5" textAnchor="middle" fill="#c7d2fe" fontSize="8.5" fontWeight="bold">
                  ★ Promoted to T2 ({assumptions.postMvpPromotionRate}%)
                </text>
              </g>

              {/* RUN (G6) */}
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

              {/* MAJOR MODIFICATION RETURN PILL */}
              <g transform="translate(780, 24)">
                <rect x="-130" y="-12" width="260" height="24" rx="8" fill="#0b1329" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fill="#f59e0b" fontSize="9.5" fontWeight="bold">
                  ↺ Major Modification Return ({assumptions.returnFromRunRate}% · {Math.round(flowCalculations.returningFromRunPerWeek * 4.33 * 10) / 10} UC/mo)
                </text>
              </g>
            </svg>

            {/* OVERLAY HTML5 CANVAS FOR 60FPS BURST OF BALLS */}
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
                  {liveQueues.steerCo > 0 ? liveQueues.steerCo : flowCalculations.primaryProblemMeeting.queue}{" "}
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
                  liveQueues.steerCo > 2
                    ? "bg-rose-50/70"
                    : liveQueues.steerCo > 0
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
                  {liveQueues.steerCo > 0 ? liveQueues.steerCo : flowCalculations.steerCo.queue} UCs in line
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.steerCo.waitWeeks} weeks
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.steerCo.cyclesDelay} cycles
                </td>
                <td className="py-3.5 px-4">
                  {liveQueues.steerCo > 2 ? (
                    <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 w-fit shadow-sm">
                      <AlertTriangle className="w-3 h-3 text-white" /> 🚨 Severe Bottleneck (&gt;2 meetings)
                    </span>
                  ) : liveQueues.steerCo > 0 ? (
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
                  liveQueues.board > 2
                    ? "bg-rose-50/70"
                    : liveQueues.board > 0
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
                  {liveQueues.board > 0 ? liveQueues.board : flowCalculations.portfolioBoard.queue} UCs in line
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.portfolioBoard.waitWeeks} weeks
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.portfolioBoard.cyclesDelay} cycles
                </td>
                <td className="py-3.5 px-4">
                  {liveQueues.board > 2 ? (
                    <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 w-fit shadow-sm">
                      <AlertTriangle className="w-3 h-3 text-white" /> 🚨 Severe Bottleneck (&gt;2 meetings)
                    </span>
                  ) : liveQueues.board > 0 ? (
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
