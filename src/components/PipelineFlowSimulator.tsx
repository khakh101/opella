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
  Calendar,
  Plus,
  Trash2,
  Users,
  Check,
} from "lucide-react";

// --- Types & Interfaces ---
export type ScenarioId = "low" | "medium" | "high" | "custom";

export interface CustomMeeting {
  id: string;
  name: string;
  chair: string;
  targetTier: "T1" | "T2" | "T3" | "T4" | "ALL";
  cadence: "weekly" | "fortnightly" | "monthly";
  cadenceWeeks: number;
  slotCapacity: number; // UC treated per meeting
  active: boolean;
  notes?: string;
}

export interface SimulationAssumptions {
  incomingPerWeek: number; // Exact integer count per burst
  acceptanceRateG1: number; // % passing G1 (AI Charter intake)
  g4PassRate: number; // % passing G4 to GO BUILD
  t3G4PassRate: number; // % passing G4 1-Page Canvas
  t3PromoteToT2Rate: number; // % of passing T3 promoted to T2 Scale at G4
  t3PromoteToT1Rate: number; // % of passing T3 promoted to T1 Transform at G4
  postMvpPromotionRate: number; // % of T3 & T4 promoted to T2 Scale AFTER MVP build at Gate G5
  t1Split: number; // % Transform
  t2Split: number; // % Scale
  t3Split: number; // % Fast Lane
  selfServeSplit: number; // % T4 Self-Service (Always sums to 100%!)
  returnFromRunRate: number; // % of run use cases returning for major modification
  activeInRunCount: number;

  // Committee Capacities & Review Cadences (tweakable live)
  steerCoCapacity: number; // review slots per meeting
  steerCoCadenceWeeks: number; // 4 = Monthly, 2 = Fortnightly, 1 = Weekly
  portfolioBoardCapacity: number; // review slots per meeting
  portfolioBoardCadenceWeeks: number; // 2 = Fortnightly, 4 = Monthly, 1 = Weekly
  ddaCapacity: number; // ADR review slots per meeting
  ddaCadenceWeeks: number; // 1 = Weekly, 2 = Fortnightly

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

// Preset Scenarios (Exact integer burst numbers, splits sum to 100%)
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
    description: "Conservative intake (4 UC/week). All governance forums review initiatives within 1 meeting cycle with zero comitology delay.",
    badge: "Low · Balanced Flow",
    assumptions: {
      incomingPerWeek: 4,
      acceptanceRateG1: 80,
      g4PassRate: 85,
      t3G4PassRate: 85,
      t3PromoteToT2Rate: 15,
      t3PromoteToT1Rate: 5,
      postMvpPromotionRate: 15,
      t1Split: 15,
      t2Split: 35,
      t3Split: 35,
      selfServeSplit: 15,
      returnFromRunRate: 8,
      activeInRunCount: 16,
      steerCoCapacity: 3,
      steerCoCadenceWeeks: 4, // Monthly
      portfolioBoardCapacity: 6,
      portfolioBoardCadenceWeeks: 2, // Fortnightly
      ddaCapacity: 6,
      ddaCadenceWeeks: 1, // Weekly
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
    description: "Expected steady-state intake (8 UC/week). Transformation SteerCo experiences agenda pressure, creating a backlog exceeding 1 monthly meeting cycle.",
    badge: "Medium · Baseline",
    assumptions: {
      incomingPerWeek: 8,
      acceptanceRateG1: 85,
      g4PassRate: 80,
      t3G4PassRate: 80,
      t3PromoteToT2Rate: 15,
      t3PromoteToT1Rate: 5,
      postMvpPromotionRate: 20,
      t1Split: 20,
      t2Split: 35,
      t3Split: 30,
      selfServeSplit: 15,
      returnFromRunRate: 12,
      activeInRunCount: 24,
      steerCoCapacity: 3,
      steerCoCadenceWeeks: 4, // Monthly
      portfolioBoardCapacity: 6,
      portfolioBoardCadenceWeeks: 2, // Fortnightly
      ddaCapacity: 6,
      ddaCadenceWeeks: 1, // Weekly
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
    description: "Surge intake (18 UC/week). SteerCo and Portfolio Board agendas are overwhelmed; wait times stretch across 2+ consecutive meeting cycles (severe bottleneck).",
    badge: "High · Severe Bottleneck",
    assumptions: {
      incomingPerWeek: 18,
      acceptanceRateG1: 88,
      g4PassRate: 75,
      t3G4PassRate: 75,
      t3PromoteToT2Rate: 20,
      t3PromoteToT1Rate: 10,
      postMvpPromotionRate: 25,
      t1Split: 25,
      t2Split: 35,
      t3Split: 25,
      selfServeSplit: 15,
      returnFromRunRate: 15,
      activeInRunCount: 32,
      steerCoCapacity: 3,
      steerCoCadenceWeeks: 4, // Monthly
      portfolioBoardCapacity: 7,
      portfolioBoardCadenceWeeks: 2, // Fortnightly
      ddaCapacity: 7,
      ddaCadenceWeeks: 1, // Weekly
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
  distance: number;
  lateralOffset: number;
  longitudinalOffset: number;
  speed: number;
  passG1: boolean;
  passG4: boolean;
  t3Outcome?: "MVP" | "T2" | "T1" | "KILLED";
  isPromoted: boolean;
  state: "MOVING" | "QUEUED_STEERCO" | "QUEUED_BOARD" | "COMPLETED";
  queueIndex?: number;
}

export const PipelineFlowSimulator: React.FC = () => {
  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("medium");
  const [assumptions, setAssumptions] = useState<SimulationAssumptions>(
    PRESET_SCENARIOS.medium.assumptions
  );

  // UI accordion toggles
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Custom Extra Meetings State
  const [customMeetings, setCustomMeetings] = useState<CustomMeeting[]>([]);
  const [showAddMeetingForm, setShowAddMeetingForm] = useState(false);
  const [newMeetingName, setNewMeetingName] = useState("");
  const [newMeetingChair, setNewMeetingChair] = useState("");
  const [newMeetingTier, setNewMeetingTier] = useState<"T1" | "T2" | "T3" | "T4" | "ALL">("T1");
  const [newMeetingCadence, setNewMeetingCadence] = useState<"weekly" | "fortnightly" | "monthly">("fortnightly");
  const [newMeetingCapacity, setNewMeetingCapacity] = useState(3);

  // Simulation controls state
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2>(1); // 1 = 10s per week, 2 = 5s per week
  const [simulatedWeek, setSimulatedWeek] = useState(1);
  const [secondsUntilNextBurst, setSecondsUntilNextBurst] = useState(10.0);

  // Live Queue counts (Starts at 0 = 100% GREEN, increases as queue forms)
  const [steerCoLiveCount, setSteerCoLiveCount] = useState(0);
  const [boardLiveCount, setBoardLiveCount] = useState(0);

  // Canvas and animation refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const burstTimerRef = useRef<number>(0);

  // Meeting cycle timers
  const steerCoTimerRef = useRef<number>(0);
  const boardTimerRef = useRef<number>(0);

  // DOM SVG Path refs for mathematically exact path querying
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});

  // Direct SVG path refs for real-time color and width updates (Dual-layer for resilient glow)
  const t1BottleneckPathRef = useRef<SVGPathElement | null>(null);
  const t1BottleneckGlowRef = useRef<SVGPathElement | null>(null);
  const t2BottleneckPathRef = useRef<SVGPathElement | null>(null);
  const t2BottleneckGlowRef = useRef<SVGPathElement | null>(null);

  // Reset simulation completely (Everything starts green!)
  const resetSimulation = useCallback(() => {
    ballsRef.current = [];
    burstTimerRef.current = 0;
    steerCoTimerRef.current = 0;
    boardTimerRef.current = 0;
    setSimulatedWeek(1);
    setSecondsUntilNextBurst(10.0);
    setSteerCoLiveCount(0);
    setBoardLiveCount(0);
    if (t1BottleneckPathRef.current) {
      t1BottleneckPathRef.current.setAttribute("stroke", "#10b981");
      t1BottleneckPathRef.current.setAttribute("stroke-width", "8");
      t1BottleneckPathRef.current.setAttribute("stroke-opacity", "0.6");
    }
    if (t1BottleneckGlowRef.current) {
      t1BottleneckGlowRef.current.setAttribute("stroke", "#10b981");
      t1BottleneckGlowRef.current.setAttribute("stroke-width", "14");
      t1BottleneckGlowRef.current.setAttribute("stroke-opacity", "0.2");
    }
    if (t2BottleneckPathRef.current) {
      t2BottleneckPathRef.current.setAttribute("stroke", "#38bdf8");
      t2BottleneckPathRef.current.setAttribute("stroke-width", "8");
      t2BottleneckPathRef.current.setAttribute("stroke-opacity", "0.6");
    }
    if (t2BottleneckGlowRef.current) {
      t2BottleneckGlowRef.current.setAttribute("stroke", "#38bdf8");
      t2BottleneckGlowRef.current.setAttribute("stroke-width", "14");
      t2BottleneckGlowRef.current.setAttribute("stroke-opacity", "0.2");
    }
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

  // Add a new custom meeting
  const handleAddCustomMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingName.trim()) return;

    let cadenceWeeks = 4;
    if (newMeetingCadence === "weekly") cadenceWeeks = 1;
    if (newMeetingCadence === "fortnightly") cadenceWeeks = 2;

    const newM: CustomMeeting = {
      id: `custom-meeting-${Date.now()}`,
      name: newMeetingName.trim(),
      chair: newMeetingChair.trim() || "Stream Lead & Sponsor",
      targetTier: newMeetingTier,
      cadence: newMeetingCadence,
      cadenceWeeks,
      slotCapacity: Number(newMeetingCapacity) || 3,
      active: true,
    };

    setCustomMeetings((prev) => [...prev, newM]);
    setNewMeetingName("");
    setNewMeetingChair("");
    setShowAddMeetingForm(false);
    resetSimulation();
  };

  const handleToggleMeeting = (id: string) => {
    setCustomMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
    resetSimulation();
  };

  const handleDeleteMeeting = (id: string) => {
    setCustomMeetings((prev) => prev.filter((m) => m.id !== id));
    resetSimulation();
  };

  // Auto-Balancing 4-Tier Slider Handler (Always equals 100%)
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
      steerCoCadenceWeeks,
      portfolioBoardCapacity,
      portfolioBoardCadenceWeeks,
      ddaCapacity,
      ddaCadenceWeeks,
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

    // Calculate extra throughput from active custom meetings
    let extraT1WeeklyCapacity = 0;
    let extraT2WeeklyCapacity = 0;

    customMeetings.filter((m) => m.active).forEach((m) => {
      const weeklyContrib = m.slotCapacity / m.cadenceWeeks;
      if (m.targetTier === "T1" || m.targetTier === "ALL") {
        extraT1WeeklyCapacity += weeklyContrib;
      }
      if (m.targetTier === "T2" || m.targetTier === "ALL") {
        extraT2WeeklyCapacity += weeklyContrib;
      }
    });

    // 1. Transformation SteerCo (T1)
    const steerCoIntervalWeeks = steerCoCadenceWeeks || 4;
    const steerCoBaseWeeklyCap = steerCoCapacity / steerCoIntervalWeeks;
    const steerCoTotalWeeklyCap = steerCoBaseWeeklyCap + extraT1WeeklyCapacity;
    const steerCoNetDeficit = Math.max(0, t1WeeklyInitial - steerCoTotalWeeklyCap);

    const steerCoQueue = Math.round(steerCoNetDeficit * steerCoIntervalWeeks * 1.5 * 10) / 10;
    const steerCoWaitWeeks =
      steerCoQueue > 0
        ? Math.round((steerCoIntervalWeeks / 2 + (steerCoQueue / (steerCoCapacity + extraT1WeeklyCapacity * steerCoIntervalWeeks)) * steerCoIntervalWeeks) * 10) / 10
        : Math.round((steerCoIntervalWeeks / 2) * 10) / 10;
    const steerCoCyclesDelay = Math.round((steerCoWaitWeeks / steerCoIntervalWeeks) * 10) / 10;
    const steerCoIsBottleneck = steerCoCyclesDelay > 1.0;
    const steerCoIsSevere = steerCoCyclesDelay > 2.0;

    // 2. AI Portfolio Board (T2 + T3)
    const portfolioBoardIntervalWeeks = portfolioBoardCadenceWeeks || 2;
    const portfolioBoardDemandPerWeek = t2WeeklyInitial + t3WeeklyInitial;
    const portfolioBoardBaseWeeklyCap = portfolioBoardCapacity / portfolioBoardIntervalWeeks;
    const portfolioBoardTotalWeeklyCap = portfolioBoardBaseWeeklyCap + extraT2WeeklyCapacity;
    const portfolioBoardNetDeficit = Math.max(0, portfolioBoardDemandPerWeek - portfolioBoardTotalWeeklyCap);

    const portfolioBoardQueue = Math.round(portfolioBoardNetDeficit * portfolioBoardIntervalWeeks * 1.5 * 10) / 10;
    const portfolioBoardWaitWeeks =
      portfolioBoardQueue > 0
        ? Math.round(
            (portfolioBoardIntervalWeeks / 2 +
              (portfolioBoardQueue / (portfolioBoardCapacity + extraT2WeeklyCapacity * portfolioBoardIntervalWeeks)) *
                portfolioBoardIntervalWeeks) *
              10
          ) / 10
        : Math.round((portfolioBoardIntervalWeeks / 2) * 10) / 10;
    const portfolioBoardCyclesDelay = Math.round((portfolioBoardWaitWeeks / portfolioBoardIntervalWeeks) * 10) / 10;
    const portfolioBoardIsBottleneck = portfolioBoardCyclesDelay > 1.0;
    const portfolioBoardIsSevere = portfolioBoardCyclesDelay > 2.0;

    // 3. Digital Design Authority (DDA, Weekly)
    const ddaIntervalWeeks = ddaCadenceWeeks || 1;
    const ddaDemandPerWeek = t1WeeklyInitial + t2WeeklyInitial * 0.7;
    const ddaWeeklyCap = ddaCapacity / ddaIntervalWeeks;
    const ddaNetDeficit = Math.max(0, ddaDemandPerWeek - ddaWeeklyCap);
    const ddaQueue = Math.round(ddaNetDeficit * 10) / 10;
    const ddaWaitWeeks = ddaQueue > 0 ? Math.round((ddaIntervalWeeks / 2 + (ddaQueue / ddaCapacity) * ddaIntervalWeeks) * 10) / 10 : 0.5;
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
        interval: steerCoIntervalWeeks === 1 ? "Weekly (1 wk)" : steerCoIntervalWeeks === 2 ? "Fortnightly (2 wks)" : "Monthly (4 wks)",
        intervalWeeks: steerCoIntervalWeeks,
        slotCapacity: steerCoCapacity,
        arrivingPerCycle: Math.round(t1WeeklyInitial * steerCoIntervalWeeks * 10) / 10,
        queue: steerCoQueue,
        waitWeeks: steerCoWaitWeeks,
        cyclesDelay: steerCoCyclesDelay,
        severity: steerCoIsSevere ? "SEVERE" : "BOTTLENECK",
      };
    } else if (portfolioBoardCyclesDelay > 1.0) {
      primaryProblemMeeting = {
        name: "AI Portfolio Board",
        interval: portfolioBoardIntervalWeeks === 1 ? "Weekly (1 wk)" : portfolioBoardIntervalWeeks === 2 ? "Fortnightly (2 wks)" : "Monthly (4 wks)",
        intervalWeeks: portfolioBoardIntervalWeeks,
        slotCapacity: portfolioBoardCapacity,
        arrivingPerCycle: Math.round(portfolioBoardDemandPerWeek * portfolioBoardIntervalWeeks * 10) / 10,
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
        arrivingPerCycle: Math.round(ddaDemandPerWeek * ddaIntervalWeeks * 10) / 10,
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
      extraT1WeeklyCapacity,
      extraT2WeeklyCapacity,

      steerCo: {
        demandPerWeek: t1WeeklyInitial,
        capacityPerMeeting: steerCoCapacity,
        intervalWeeks: steerCoIntervalWeeks,
        weeklyCap: steerCoTotalWeeklyCap,
        arrivingPerCycle: t1WeeklyInitial * steerCoIntervalWeeks,
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
        weeklyCap: portfolioBoardTotalWeeklyCap,
        arrivingPerCycle: portfolioBoardDemandPerWeek * portfolioBoardIntervalWeeks,
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
        weeklyCap: ddaWeeklyCap,
        arrivingPerCycle: ddaDemandPerWeek * ddaIntervalWeeks,
        queue: ddaQueue,
        waitWeeks: ddaWaitWeeks,
        cyclesDelay: ddaCyclesDelay,
        isBottleneck: ddaIsBottleneck,
        isSevere: ddaIsSevere,
      },
    };
  }, [assumptions, customMeetings]);

  // SPAWNS THE EXACT SELECTED NUMBER OF BALLS ALL IN ONE BURST
  const spawnWeeklyBurst = useCallback(() => {
    const exactTotalCount = Math.max(1, Math.round(assumptions.incomingPerWeek));
    const newBalls: Ball[] = [];

    const rawCounts = [
      { tier: "T1" as const, count: (exactTotalCount * assumptions.t1Split) / 100 },
      { tier: "T2" as const, count: (exactTotalCount * assumptions.t2Split) / 100 },
      { tier: "T3" as const, count: (exactTotalCount * assumptions.t3Split) / 100 },
      { tier: "T4" as const, count: (exactTotalCount * assumptions.selfServeSplit) / 100 },
    ];
    const floored = rawCounts.map((c) => ({
      tier: c.tier,
      count: Math.floor(c.count),
      rem: c.count - Math.floor(c.count),
    }));
    const sumFloored = floored.reduce((acc, c) => acc + c.count, 0);
    const sorted = [...floored].sort((a, b) => b.rem - a.rem);
    const diff = exactTotalCount - sumFloored;
    for (let i = 0; i < diff; i++) {
      const target = sorted[i % sorted.length];
      const match = floored.find((c) => c.tier === target.tier);
      if (match) match.count++;
    }

    const tierSequence: Array<"T1" | "T2" | "T3" | "T4"> = [];
    floored.forEach((f) => {
      for (let i = 0; i < f.count; i++) tierSequence.push(f.tier);
    });

    tierSequence.forEach((tier, idx) => {
      const passG1 = Math.random() * 100 < assumptions.acceptanceRateG1;
      let passG4 = Math.random() * 100 < assumptions.g4PassRate;
      let isPromoted =
        (tier === "T3" || tier === "T4") &&
        Math.random() * 100 < assumptions.postMvpPromotionRate;
      let t3Outcome: "MVP" | "T2" | "T1" | "KILLED" | undefined = undefined;

      let color = "#10b981"; // T1 Emerald
      let glowColor = "rgba(16, 185, 129, 0.8)";
      let pathKey = "t1-main";

      if (tier === "T2") {
        color = "#38bdf8"; // Sky Blue
        glowColor = "rgba(56, 189, 248, 0.8)";
        pathKey = "t2-main";
      } else if (tier === "T3") {
        color = "#f59e0b"; // Amber
        glowColor = "rgba(245, 158, 11, 0.8)";
        // T3 G4 Decision: Killed, Promoted to T2, Promoted to T1, or Proceed to MVP
        const passesT3G4 = Math.random() * 100 < assumptions.t3G4PassRate;
        if (!passesT3G4) {
          t3Outcome = "KILLED";
          passG4 = false;
          pathKey = "t3-main";
        } else {
          passG4 = true;
          const roll = Math.random() * 100;
          if (roll < assumptions.t3PromoteToT1Rate) {
            t3Outcome = "T1";
            pathKey = "t3-to-t1";
            isPromoted = true;
          } else if (roll < assumptions.t3PromoteToT1Rate + assumptions.t3PromoteToT2Rate) {
            t3Outcome = "T2";
            pathKey = "t3-to-t2";
            isPromoted = true;
          } else {
            t3Outcome = "MVP";
            pathKey = "t3-main";
            isPromoted = false;
          }
        }
      } else if (tier === "T4") {
        color = "#c084fc"; // Purple
        glowColor = "rgba(192, 132, 252, 0.8)";
        pathKey = isPromoted ? "t4-promoted" : "t4-main";
      }

      const lateralOffset = ((idx % 3) - 1) * 4.5 + (Math.random() - 0.5) * 2;
      const longitudinalOffset = Math.floor(idx / 3) * -8 + (Math.random() - 0.5) * 2;

      newBalls.push({
        id: `ball-${Date.now()}-${idx}-${Math.random()}`,
        tier,
        color,
        glowColor,
        x: 80,
        y: 290,
        radius: 3.2,
        pathKey,
        distance: 0,
        lateralOffset,
        longitudinalOffset,
        speed: 105,
        passG1,
        passG4,
        t3Outcome,
        isPromoted,
        state: "MOVING",
      });
    });

    ballsRef.current = [...ballsRef.current, ...newBalls];
  }, [assumptions]);

  // MAIN 60FPS SIMULATION ANIMATION LOOP
  useEffect(() => {
    let animationFrameId: number;
    const WEEK_MS = 10000 / simSpeed;
    const STEERCO_CYCLE_MS = (assumptions.steerCoCadenceWeeks * 10000) / simSpeed;
    const BOARD_CYCLE_MS = (assumptions.portfolioBoardCadenceWeeks * 10000) / simSpeed;

    if (ballsRef.current.length === 0) {
      spawnWeeklyBurst();
    }

    const render = (time: number) => {
      const dt = Math.min(100, time - lastTimeRef.current);
      lastTimeRef.current = time;

      if (isPlaying) {
        burstTimerRef.current += dt;
        const remaining = Math.max(0, (WEEK_MS - burstTimerRef.current) / 1000);
        setSecondsUntilNextBurst(Math.round(remaining * 10) / 10);

        if (burstTimerRef.current >= WEEK_MS) {
          burstTimerRef.current = 0;
          setSimulatedWeek((w) => w + 1);
          spawnWeeklyBurst();
        }

        steerCoTimerRef.current += dt;
        if (steerCoTimerRef.current >= STEERCO_CYCLE_MS) {
          steerCoTimerRef.current = 0;
          let released = 0;
          const allowedRelease = assumptions.steerCoCapacity + Math.round(flowCalculations.extraT1WeeklyCapacity * assumptions.steerCoCadenceWeeks);
          for (const b of ballsRef.current) {
            if (b.state === "QUEUED_STEERCO" && released < allowedRelease) {
              b.state = "MOVING";
              b.distance = 585;
              released++;
            }
          }
        }

        boardTimerRef.current += dt;
        if (boardTimerRef.current >= BOARD_CYCLE_MS) {
          boardTimerRef.current = 0;
          let released = 0;
          const allowedRelease = assumptions.portfolioBoardCapacity + Math.round(flowCalculations.extraT2WeeklyCapacity * assumptions.portfolioBoardCadenceWeeks);
          for (const b of ballsRef.current) {
            if (b.state === "QUEUED_BOARD" && released < allowedRelease) {
              b.state = "MOVING";
              b.distance = 585;
              released++;
            }
          }
        }
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, 1200, 620);

          let steerCoWaitingCount = 0;
          let boardWaitingCount = 0;
          const activeBalls: Ball[] = [];

          for (const b of ballsRef.current) {
            if (isPlaying && b.state === "MOVING") {
              b.distance += (b.speed * dt * simSpeed) / 1000;
            }

            // G1 REJECTION: DELETE BALL IMMEDIATELY
            if (b.distance >= 140 && !b.passG1) {
              b.state = "COMPLETED";
              continue;
            }

            // G4 REJECTION: DELETE BALL IMMEDIATELY
            if (b.distance >= 720 && !b.passG4) {
              b.state = "COMPLETED";
              continue;
            }

            // T3 G4 KILLED DECISION: DELETE BALL IMMEDIATELY AT G4
            if (b.tier === "T3" && b.t3Outcome === "KILLED" && b.distance >= 720) {
              b.state = "COMPLETED";
              continue;
            }

            // T3 POST-G4 PROMOTION COLOR SHIFT (Turn Blue for T2, Green for T1)
            if (b.tier === "T3" && b.distance >= 720) {
              if (b.t3Outcome === "T1") {
                b.color = "#34d399";
                b.glowColor = "rgba(52, 211, 153, 0.8)";
              } else if (b.t3Outcome === "T2") {
                b.color = "#38bdf8";
                b.glowColor = "rgba(56, 189, 248, 0.8)";
              }
            }

            // BOTTLENECK QUEUE CHECKS
            if (b.tier === "T1" && b.state === "MOVING" && b.distance >= 510 && b.distance < 570) {
              if (flowCalculations.steerCo.isBottleneck) {
                b.state = "QUEUED_STEERCO";
              }
            }

            if (b.tier === "T2" && b.state === "MOVING" && b.distance >= 510 && b.distance < 570) {
              if (flowCalculations.portfolioBoard.isBottleneck) {
                b.state = "QUEUED_BOARD";
              }
            }

            const pathEl = pathRefs.current[b.pathKey];
            if (pathEl && b.state !== "COMPLETED") {
              const totalLen = pathEl.getTotalLength();

              if (b.state === "QUEUED_STEERCO") {
                // Stack 2 on top of each other
                b.queueIndex = steerCoWaitingCount++;
                const col = Math.floor(b.queueIndex / 2);
                const row = b.queueIndex % 2;
                b.x = 545 - col * 9;
                b.y = row === 0 ? 85.5 : 94.5;
              } else if (b.state === "QUEUED_BOARD") {
                b.queueIndex = boardWaitingCount++;
                const col = Math.floor(b.queueIndex / 2);
                const row = b.queueIndex % 2;
                b.x = 545 - col * 9;
                b.y = row === 0 ? 205.5 : 214.5;
              } else {
                const effectiveDist = Math.min(
                  totalLen,
                  Math.max(0, b.distance + b.longitudinalOffset)
                );
                const pt = pathEl.getPointAtLength(effectiveDist);

                const ptNext = pathEl.getPointAtLength(
                  Math.min(totalLen, effectiveDist + 2)
                );
                const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x);
                const normalX = -Math.sin(angle) * b.lateralOffset;
                const normalY = Math.cos(angle) * b.lateralOffset;

                b.x = pt.x + normalX;
                b.y = pt.y + normalY;

                if (effectiveDist >= totalLen) {
                  b.state = "COMPLETED";
                }
              }

              if (b.state !== "COMPLETED") {
                ctx.save();

                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = b.glowColor;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = b.color;
                ctx.fill();

                if (b.isPromoted && b.distance > 800) {
                  ctx.beginPath();
                  ctx.arc(b.x, b.y, b.radius + 2.5, 0, Math.PI * 2);
                  ctx.strokeStyle = "#ffffff";
                  ctx.lineWidth = 1.2;
                  ctx.stroke();
                }

                ctx.restore();
                activeBalls.push(b);
              }
            }
          }

          ballsRef.current = activeBalls;

          // DYNAMIC CONDUIT UPDATE (G2 to G3) - DUAL LAYER RESILIENT GLOW (NEVER DISAPPEARS)
          if (t1BottleneckPathRef.current && t1BottleneckGlowRef.current) {
            if (steerCoWaitingCount === 0) {
              t1BottleneckPathRef.current.setAttribute("stroke", "#10b981");
              t1BottleneckPathRef.current.setAttribute("stroke-width", "8");
              t1BottleneckPathRef.current.setAttribute("stroke-opacity", "0.6");
              t1BottleneckGlowRef.current.setAttribute("stroke", "#10b981");
              t1BottleneckGlowRef.current.setAttribute("stroke-width", "14");
              t1BottleneckGlowRef.current.setAttribute("stroke-opacity", "0.2");
            } else if (steerCoWaitingCount <= 2) {
              t1BottleneckPathRef.current.setAttribute("stroke", "#f59e0b");
              t1BottleneckPathRef.current.setAttribute("stroke-width", "11");
              t1BottleneckPathRef.current.setAttribute("stroke-opacity", "0.9");
              t1BottleneckGlowRef.current.setAttribute("stroke", "#f59e0b");
              t1BottleneckGlowRef.current.setAttribute("stroke-width", "18");
              t1BottleneckGlowRef.current.setAttribute("stroke-opacity", "0.35");
            } else {
              const coreW = Math.min(20, 11 + steerCoWaitingCount * 1.1);
              const glowW = Math.min(36, 18 + steerCoWaitingCount * 1.8);
              t1BottleneckPathRef.current.setAttribute("stroke", "#ef4444");
              t1BottleneckPathRef.current.setAttribute("stroke-width", String(coreW));
              t1BottleneckPathRef.current.setAttribute("stroke-opacity", "1");
              t1BottleneckGlowRef.current.setAttribute("stroke", "#ef4444");
              t1BottleneckGlowRef.current.setAttribute("stroke-width", String(glowW));
              t1BottleneckGlowRef.current.setAttribute("stroke-opacity", "0.45");
            }
          }

          if (t2BottleneckPathRef.current && t2BottleneckGlowRef.current) {
            if (boardWaitingCount === 0) {
              t2BottleneckPathRef.current.setAttribute("stroke", "#38bdf8");
              t2BottleneckPathRef.current.setAttribute("stroke-width", "8");
              t2BottleneckPathRef.current.setAttribute("stroke-opacity", "0.6");
              t2BottleneckGlowRef.current.setAttribute("stroke", "#38bdf8");
              t2BottleneckGlowRef.current.setAttribute("stroke-width", "14");
              t2BottleneckGlowRef.current.setAttribute("stroke-opacity", "0.2");
            } else if (boardWaitingCount <= 2) {
              t2BottleneckPathRef.current.setAttribute("stroke", "#f59e0b");
              t2BottleneckPathRef.current.setAttribute("stroke-width", "11");
              t2BottleneckPathRef.current.setAttribute("stroke-opacity", "0.9");
              t2BottleneckGlowRef.current.setAttribute("stroke", "#f59e0b");
              t2BottleneckGlowRef.current.setAttribute("stroke-width", "18");
              t2BottleneckGlowRef.current.setAttribute("stroke-opacity", "0.35");
            } else {
              const coreW = Math.min(20, 11 + boardWaitingCount * 1.1);
              const glowW = Math.min(34, 18 + boardWaitingCount * 1.8);
              t2BottleneckPathRef.current.setAttribute("stroke", "#ef4444");
              t2BottleneckPathRef.current.setAttribute("stroke-width", String(coreW));
              t2BottleneckPathRef.current.setAttribute("stroke-opacity", "1");
              t2BottleneckGlowRef.current.setAttribute("stroke", "#ef4444");
              t2BottleneckGlowRef.current.setAttribute("stroke-width", String(glowW));
              t2BottleneckGlowRef.current.setAttribute("stroke-opacity", "0.45");
            }
          }

          if (steerCoWaitingCount !== steerCoLiveCount) {
            setSteerCoLiveCount(steerCoWaitingCount);
          }
          if (boardWaitingCount !== boardLiveCount) {
            setBoardLiveCount(boardWaitingCount);
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
  }, [
    isPlaying,
    simSpeed,
    spawnWeeklyBurst,
    flowCalculations,
    assumptions,
    steerCoLiveCount,
    boardLiveCount,
  ]);

  return (
    <div className="w-full max-w-[1600px] 2xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 text-gray-900">
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
            Every 10 seconds, exactly{" "}
            <strong className="text-emerald-400">
              {Math.round(assumptions.incomingPerWeek)} use cases
            </strong>{" "}
            enter the pipeline in one burst. Tweak meeting cadences, capacities,
            and add extra governance sessions below to resolve bottlenecks.
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
                4/burst
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
                8/burst
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
                18/burst
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI METRICS RIBBON */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Selected Burst
          </span>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900">
              {Math.round(assumptions.incomingPerWeek)}{" "}
              <span className="text-xs font-medium text-gray-500">UC/burst</span>
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
            steerCoLiveCount > 0 || boardLiveCount > 0
              ? "bg-rose-50 border-rose-300 ring-2 ring-rose-500/20"
              : "bg-emerald-50 border-emerald-300"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-gray-700">
            <ShieldAlert
              className={`w-3.5 h-3.5 ${
                steerCoLiveCount > 0 || boardLiveCount > 0
                  ? "text-rose-600 animate-bounce"
                  : "text-emerald-600"
              }`}
            />
            Live Backlog
          </span>
          <div className="mt-2">
            <div
              className={`text-2xl font-black ${
                steerCoLiveCount > 0 || boardLiveCount > 0
                  ? "text-rose-700"
                  : "text-emerald-800"
              }`}
            >
              {steerCoLiveCount + boardLiveCount}{" "}
              <span className="text-xs font-semibold">UCs Queued</span>
            </div>
            <div
              className={`text-[11px] font-bold mt-0.5 ${
                steerCoLiveCount > 0 || boardLiveCount > 0
                  ? "text-rose-800"
                  : "text-emerald-700"
              }`}
            >
              {steerCoLiveCount > 0
                ? `SteerCo: ${steerCoLiveCount} in line`
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
              The exact number of balls selected enters the pipeline in each burst.
              All 4 tiers (T1–T4) always sum to exactly 100%.
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
          {/* 1. Exact Number of Balls in Burst */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">
                Burst Volume (Exact Balls Count)
              </label>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-mono">
                {Math.round(assumptions.incomingPerWeek)} balls / burst
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={assumptions.incomingPerWeek}
              onChange={(e) =>
                updateAssumption("incomingPerWeek", Math.round(Number(e.target.value)))
              }
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>1 ball (Slow)</span>
              <span>15 balls</span>
              <span>30 balls (Surge)</span>
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
              Rejected use cases are <strong>deleted immediately</strong> on
              arrival at Gate G1.
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
              Use cases failing G4 are <strong>deleted immediately</strong>.
            </p>
          </div>

          {/* 4. Post-MVP Promotion Rate */}
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
              Decided <strong>after building MVP at Gate G5</strong>: T3 and T4
              solutions get upgraded to T2 Scale.
            </p>
          </div>

          {/* 5. TIER ROUTING SPLIT (100% SUM) */}
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

          {/* 6. Return from Run Rate */}
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

          {/* 7. T3 Gate G4 Decisions (1-Page Canvas Outcome) */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300 ring-1 ring-amber-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                T3 Gate G4 Decisions (Canvas Outcome)
              </label>
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-mono">
                {assumptions.t3G4PassRate}% Pass · {100 - assumptions.t3G4PassRate}% Killed
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-gray-700 font-semibold">G4 Approval Pass Rate:</span>
                  <span className="font-mono font-bold text-gray-900">{assumptions.t3G4PassRate}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={assumptions.t3G4PassRate}
                  onChange={(e) => updateAssumption("t3G4PassRate", Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-blue-700 font-semibold">Promote to T2 Scale:</span>
                  <span className="font-mono font-bold text-blue-900">{assumptions.t3PromoteToT2Rate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={assumptions.t3PromoteToT2Rate}
                  onChange={(e) => updateAssumption("t3PromoteToT2Rate", Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-emerald-700 font-semibold">Promote to T1 Transform:</span>
                  <span className="font-mono font-bold text-emerald-900">{assumptions.t3PromoteToT1Rate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="5"
                  value={assumptions.t3PromoteToT1Rate}
                  onChange={(e) => updateAssumption("t3PromoteToT1Rate", Number(e.target.value))}
                  className="w-full accent-emerald-600 h-1.5 cursor-pointer"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-500 leading-snug">
              Decided at G4: passing T3 can branch to <strong>T2 Scale</strong>, <strong>T1 Transform</strong>, or <strong>Agile MVP</strong>. Fails are killed immediately.
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
          (Exact balls count in burst · Exact SVG Path Tracking · Swells Red in queue)
      ========================================================================= */}
      <div className="bg-[#080d1a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-800 text-white space-y-6 relative overflow-hidden">
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
              Every 10 seconds, exactly{" "}
              <strong className="text-emerald-400">
                {Math.round(assumptions.incomingPerWeek)} balls
              </strong>{" "}
              travel together down the pipeline. Lines start green, and swell red
              between G2 and G3 as queues build up.
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
              {/* T3 Promoted to T2 at G4 */}
              <path
                id="t3-to-t2"
                ref={(el) => {
                  pathRefs.current["t3-to-t2"] = el;
                }}
                d="M 80 290 L 220 290 C 290 350, 340 350, 400 350 L 750 350 C 790 350, 810 210, 850 210 L 900 290 L 1030 290 L 1140 290"
                fill="none"
                stroke="transparent"
              />
              {/* T3 Promoted to T1 at G4 */}
              <path
                id="t3-to-t1"
                ref={(el) => {
                  pathRefs.current["t3-to-t1"] = el;
                }}
                d="M 80 290 L 220 290 C 290 350, 340 350, 400 350 L 750 350 C 790 350, 810 90, 850 90 L 900 290 L 1030 290 L 1140 290"
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

              {/* --- VISUAL CONDUIT PIPES (NO DOTTED LINES) --- */}
              <path d="M 80 290 L 220 290" fill="none" stroke="#10b981" strokeWidth="10" strokeOpacity="0.25" strokeLinecap="round" />

              {/* T1 CONDUIT SEGMENTS */}
              <path d="M 220 290 C 290 90, 320 90, 400 90" fill="none" stroke="#10b981" strokeWidth="8" strokeOpacity="0.25" strokeLinecap="round" />
              {/* T1 BOTTLENECK CONDUIT (G2 to G3) - DUAL LAYER RESILIENT GLOW */}
              <path
                id="conduit-g2-g3-t1-glow"
                ref={t1BottleneckGlowRef}
                d="M 400 90 L 580 90"
                fill="none"
                stroke="#10b981"
                strokeWidth="14"
                strokeOpacity="0.2"
                strokeLinecap="round"
              />
              <path
                id="conduit-g2-g3-t1"
                ref={t1BottleneckPathRef}
                d="M 400 90 L 580 90"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeOpacity="0.6"
                strokeLinecap="round"
              />
              <path d="M 580 90 L 750 90" fill="none" stroke="#10b981" strokeWidth="8" strokeOpacity="0.25" strokeLinecap="round" />
              <path d="M 750 90 C 820 90, 850 290, 900 290" fill="none" stroke="#10b981" strokeWidth="7" strokeOpacity="0.2" />

              {/* T2 CONDUIT SEGMENTS */}
              <path d="M 220 290 C 290 210, 320 210, 400 210" fill="none" stroke="#38bdf8" strokeWidth="8" strokeOpacity="0.25" strokeLinecap="round" />
              {/* T2 BOTTLENECK CONDUIT (G2 to G3) - DUAL LAYER RESILIENT GLOW */}
              <path
                id="conduit-g2-g3-t2-glow"
                ref={t2BottleneckGlowRef}
                d="M 400 210 L 580 210"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="14"
                strokeOpacity="0.2"
                strokeLinecap="round"
              />
              <path
                id="conduit-g2-g3-t2"
                ref={t2BottleneckPathRef}
                d="M 400 210 L 580 210"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="8"
                strokeOpacity="0.6"
                strokeLinecap="round"
              />
              <path d="M 580 210 L 750 210" fill="none" stroke="#38bdf8" strokeWidth="8" strokeOpacity="0.25" strokeLinecap="round" />
              <path d="M 750 210 C 820 210, 850 290, 900 290" fill="none" stroke="#38bdf8" strokeWidth="7" strokeOpacity="0.2" />

              {/* T3 CONDUIT (Skips G2 & G3 to G4 1-Page Canvas) */}
              <path d="M 220 290 C 290 350, 340 350, 400 350 L 750 350" fill="none" stroke="#f59e0b" strokeWidth="8" strokeOpacity="0.2" strokeLinecap="round" />

              {/* T3 POST-G4 OUTCOME ROUTING CONDUITS */}
              {/* 1. T3 to T2 Scale Promotion Curve */}
              <path
                d="M 750 350 C 790 350, 810 210, 850 210"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="5"
                strokeOpacity="0.45"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              {/* 2. T3 to T1 Transform Promotion Curve */}
              <path
                d="M 750 350 C 790 350, 810 90, 850 90"
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                strokeOpacity="0.4"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              {/* 3. T3 Killed / Shelved at G4 Drop */}
              <path
                d="M 750 350 C 765 390, 780 430, 800 455"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeOpacity="0.4"
                strokeDasharray="3 3"
                strokeLinecap="round"
              />
              {/* 4. T3 Proceed to MVP Build (Mode 3 Sprint) */}
              <path d="M 750 350 C 820 350, 850 290, 900 290" fill="none" stroke="#f59e0b" strokeWidth="7" strokeOpacity="0.3" />

              {/* T3 Post-G4 Badges */}
              <g transform="translate(805, 170)">
                <rect x="-48" y="-9" width="96" height="18" rx="5" fill="#0b1329" stroke="#38bdf8" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="900">
                  ↑ To T2 ({assumptions.t3PromoteToT2Rate}%)
                </text>
              </g>

              <g transform="translate(805, 80)">
                <rect x="-48" y="-9" width="96" height="18" rx="5" fill="#0b1329" stroke="#10b981" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#34d399" fontSize="7.5" fontWeight="900">
                  ↑ To T1 ({assumptions.t3PromoteToT1Rate}%)
                </text>
              </g>

              <g transform="translate(800, 465)">
                <rect x="-56" y="-9" width="112" height="18" rx="5" fill="#0b1329" stroke="#ef4444" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#f87171" fontSize="7.5" fontWeight="900">
                  ✕ Shelved ({100 - assumptions.t3G4PassRate}%)
                </text>
              </g>

              {/* T4 CONDUIT (Skips G2 & G3) */}
              <path d="M 220 290 C 290 470, 340 470, 400 470 L 750 470" fill="none" stroke="#c084fc" strokeWidth="7" strokeOpacity="0.2" strokeLinecap="round" />
              <path d="M 750 470 C 820 470, 850 290, 900 290" fill="none" stroke="#c084fc" strokeWidth="7" strokeOpacity="0.2" />

              {/* MVP Build to Gate G5 */}
              <path d="M 900 290 L 1030 290" fill="none" stroke="#10b981" strokeWidth="10" strokeOpacity="0.25" strokeLinecap="round" />

              {/* Clean solid curve for promoted solutions */}
              <path d="M 1030 290 C 1060 210, 1100 210, 1140 210" fill="none" stroke="#818cf8" strokeWidth="3" strokeOpacity="0.35" />

              {/* Path to RUN */}
              <path d="M 1030 290 L 1140 290" fill="none" stroke="#38bdf8" strokeWidth="10" strokeOpacity="0.25" />

              {/* --- GATING NODES & LABELS --- */}
              {/* SOURCE */}
              <g transform="translate(80, 290)">
                <circle r="34" fill="#0b1329" stroke="#10b981" strokeWidth="2.5" />
                <text x="0" y="-7" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                  SOURCE
                </text>
                <text x="0" y="9" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">
                  {Math.round(assumptions.incomingPerWeek)}
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
                  DDA ({assumptions.ddaCadenceWeeks === 1 ? "Weekly" : "Fortnightly"})
                </text>
              </g>

              {/* T1 - Gate G3 Priority (SteerCo) */}
              <g transform="translate(580, 90)">
                <rect
                  x="-46"
                  y="-24"
                  width="92"
                  height="48"
                  rx="10"
                  fill="#0b1329"
                  stroke={steerCoLiveCount > 0 ? "#ef4444" : "#10b981"}
                  strokeWidth={steerCoLiveCount > 0 ? "3" : "2"}
                />
                {steerCoLiveCount > 0 && (
                  <g transform="translate(0, -32)">
                    <rect x="-65" y="-9" width="130" height="18" rx="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                    <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
                      🚨 STEERCO QUEUE: {steerCoLiveCount} in line
                    </text>
                  </g>
                )}
                <text x="0" y="-7" textAnchor="middle" fill={steerCoLiveCount > 0 ? "#f87171" : "#10b981"} fontSize="9" fontWeight="bold">
                  G3 · Priority
                </text>
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                  60% Hub Pool
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#fbbf24" fontSize="7.5" fontWeight="bold">
                  SteerCo ({assumptions.steerCoCadenceWeeks === 1 ? "Weekly" : assumptions.steerCoCadenceWeeks === 2 ? "Fortnightly" : "Monthly"})
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
                  DDA ({assumptions.ddaCadenceWeeks === 1 ? "Weekly" : "Fortnightly"})
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
                  stroke={boardLiveCount > 0 ? "#f59e0b" : "#38bdf8"}
                  strokeWidth="2"
                />
                {boardLiveCount > 0 && (
                  <g transform="translate(0, -32)">
                    <rect x="-60" y="-9" width="120" height="18" rx="5" fill="#f59e0b" stroke="#000000" strokeWidth="1" />
                    <text x="0" y="3.5" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="900">
                      ⚠️ BOARD QUEUE: {boardLiveCount} in line
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
                  Board ({assumptions.portfolioBoardCadenceWeeks === 1 ? "Weekly" : assumptions.portfolioBoardCadenceWeeks === 2 ? "Fortnightly" : "Monthly"})
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
            </svg>

            {/* OVERLAY HTML5 CANVAS FOR 60FPS BURST OF BALLS & STACKED QUEUES */}
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
                G1 → G2 → G3 → G4 · SteerCo Reviews
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-sky-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">T2 · Scale Lane</span>
              <span className="text-[11px] text-gray-400">
                G1 → G2 → G3 → G4 + Promoted T3/T4
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">T3 · Fast Lane</span>
              <span className="text-[11px] text-gray-400">
                Direct G4 → MVP → G5 Promotion
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-purple-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">T4 · Self-Service AI</span>
              <span className="text-[11px] text-gray-400">
                Direct G4 → Catalog Tool → G5 Promotion
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
                  {steerCoLiveCount > 0 ? steerCoLiveCount : flowCalculations.primaryProblemMeeting.queue}{" "}
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
              waiting for agenda time rather than engineering capacity. Tweak
              its cadence or capacity in Section 4 below to resolve the
              bottleneck.
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
                  All governing forums have sufficient slot capacity to review
                  incoming initiatives within 1 meeting cycle.
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs">
              Healthy Flow
            </span>
          </div>
        )}

        {/* COMPREHENSIVE ALL-MEETINGS REVIEW TABLE (SHOWING ALL GOVERNING FORUMS) */}
        <div className="overflow-x-auto pt-3 border-t border-gray-200">
          <div className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-700" />
              All Opella Comitology Bodies &amp; Review Metrics ({3 + customMeetings.length} forums)
            </span>
            <span className="text-[11px] font-normal text-gray-500">
              Evaluated against review cycle capacity vs arriving demand
            </span>
          </div>

          <table className="w-full text-left text-xs text-gray-700 border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-100/90 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
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
            <tbody className="divide-y divide-gray-100 font-medium bg-white">
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
                    {assumptions.steerCoCadenceWeeks === 1
                      ? "Weekly (1 wk)"
                      : assumptions.steerCoCadenceWeeks === 2
                      ? "Fortnightly (2 wks)"
                      : "Monthly (4 wks)"}
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                  {assumptions.steerCoCapacity} UCs / meeting
                  <span className="text-[10px] text-gray-500 block font-normal">
                    {flowCalculations.steerCo.weeklyCap.toFixed(2)} UC/wk
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                  {flowCalculations.steerCo.demandPerWeek.toFixed(2)} UC / wk
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  <span
                    className={
                      flowCalculations.steerCo.isBottleneck
                        ? "text-rose-700"
                        : "text-gray-900"
                    }
                  >
                    {steerCoLiveCount > 0 ? steerCoLiveCount : flowCalculations.steerCo.queue.toFixed(1)} in line
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  <span
                    className={
                      flowCalculations.steerCo.isBottleneck
                        ? "text-rose-700"
                        : "text-gray-900"
                    }
                  >
                    {flowCalculations.steerCo.waitWeeks.toFixed(1)} wks
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  <span
                    className={
                      flowCalculations.steerCo.cyclesDelay > 1
                        ? "text-rose-700"
                        : "text-emerald-700"
                    }
                  >
                    {flowCalculations.steerCo.cyclesDelay.toFixed(1)} cycles
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  {flowCalculations.steerCo.isSevere ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                      🚨 Severe Bottleneck (&gt;2 meetings)
                    </span>
                  ) : flowCalculations.steerCo.isBottleneck ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                      ⚠️ Bottleneck (&gt;1 meeting)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Balanced Flow ✓
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
                        Chaired by Stream Leadership &amp; Hub Delegates · T2 Scaling &amp; T3 SLA
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-mono font-bold text-[10px]">
                    {assumptions.portfolioBoardCadenceWeeks === 1
                      ? "Weekly (1 wk)"
                      : assumptions.portfolioBoardCadenceWeeks === 2
                      ? "Fortnightly (2 wks)"
                      : "Monthly (4 wks)"}
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                  {assumptions.portfolioBoardCapacity} UCs / meeting
                  <span className="text-[10px] text-gray-500 block font-normal">
                    {flowCalculations.portfolioBoard.weeklyCap.toFixed(2)} UC/wk
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                  {flowCalculations.portfolioBoard.demandPerWeek.toFixed(2)} UC / wk
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  <span
                    className={
                      flowCalculations.portfolioBoard.isBottleneck
                        ? "text-rose-700"
                        : "text-gray-900"
                    }
                  >
                    {boardLiveCount > 0 ? boardLiveCount : flowCalculations.portfolioBoard.queue.toFixed(1)} in line
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  <span
                    className={
                      flowCalculations.portfolioBoard.isBottleneck
                        ? "text-rose-700"
                        : "text-gray-900"
                    }
                  >
                    {flowCalculations.portfolioBoard.waitWeeks.toFixed(1)} wks
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  <span
                    className={
                      flowCalculations.portfolioBoard.cyclesDelay > 1
                        ? "text-rose-700"
                        : "text-emerald-700"
                    }
                  >
                    {flowCalculations.portfolioBoard.cyclesDelay.toFixed(1)} cycles
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  {flowCalculations.portfolioBoard.isSevere ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                      🚨 Severe Bottleneck (&gt;2 meetings)
                    </span>
                  ) : flowCalculations.portfolioBoard.isBottleneck ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                      ⚠️ Bottleneck (&gt;1 meeting)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Balanced Flow ✓
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
                        Enterprise Architecture, Cyber &amp; ORAI · Architecture Decision Records (ADRs)
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-mono font-bold text-[10px]">
                    {assumptions.ddaCadenceWeeks === 1 ? "Weekly (1 wk)" : "Fortnightly (2 wks)"}
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                  {assumptions.ddaCapacity} ADRs / meeting
                  <span className="text-[10px] text-gray-500 block font-normal">
                    {flowCalculations.dda.weeklyCap.toFixed(2)} ADR/wk
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                  {flowCalculations.dda.demandPerWeek.toFixed(2)} ADR / wk
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  <span
                    className={
                      flowCalculations.dda.isBottleneck
                        ? "text-rose-700"
                        : "text-gray-900"
                    }
                  >
                    {flowCalculations.dda.queue.toFixed(1)} ADRs in line
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  <span
                    className={
                      flowCalculations.dda.isBottleneck
                        ? "text-rose-700"
                        : "text-gray-900"
                    }
                  >
                    {flowCalculations.dda.waitWeeks.toFixed(1)} wks
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  <span
                    className={
                      flowCalculations.dda.cyclesDelay > 1
                        ? "text-rose-700"
                        : "text-emerald-700"
                    }
                  >
                    {flowCalculations.dda.cyclesDelay.toFixed(1)} cycles
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  {flowCalculations.dda.isSevere ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                      🚨 Severe Bottleneck (&gt;2 meetings)
                    </span>
                  ) : flowCalculations.dda.isBottleneck ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                      ⚠️ Bottleneck (&gt;1 meeting)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Surplus Capacity ✓
                    </span>
                  )}
                </td>
              </tr>

              {/* 4. Custom Extra Meetings (if any active) */}
              {customMeetings.map((m) => {
                const weeklyCap = m.slotCapacity / m.cadenceWeeks;
                return (
                  <tr key={m.id} className="hover:bg-amber-50/40">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <div>
                          <div>{m.name}</div>
                          <div className="text-[10px] text-gray-500 font-normal">
                            {m.chair} · Scope: {m.targetTier === "ALL" ? "All Tiers" : `${m.targetTier} Only`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-mono font-bold text-[10px]">
                        {m.cadence === "weekly" ? "Weekly (1 wk)" : m.cadence === "fortnightly" ? "Fortnightly (2 wks)" : "Monthly (4 wks)"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                      {m.slotCapacity} UCs / meeting
                      <span className="text-[10px] text-emerald-700 block font-bold">
                        +{weeklyCap.toFixed(2)} UC/wk relief
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-gray-500">
                      Absorption
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                      0 in line
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                      Immediate
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                      0 cycles
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.active
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {m.active ? "Active Extra Session ✓" : "Paused"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: GOVERNANCE MEETING MANAGER & ASSUMPTIONS TWEAKER
          (Tweak Cadences, Slot Capacities, and Add Extra / Extraordinary Meetings)
      ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider font-mono">
                Meeting Cadence &amp; Capacity Control
              </span>
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                4. Governance Meeting Manager &amp; Capacity Assumptions
              </h2>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Directly adjust review cadences (Weekly, Fortnightly, Monthly) and
              slot capacities for each committee, or add extra extraordinary
              sessions to test how schedule adjustments dissolve queues.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddMeetingForm(!showAddMeetingForm)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Extra Governance Meeting</span>
          </button>
        </div>

        {/* INLINE FORM TO ADD EXTRA MEETING */}
        {showAddMeetingForm && (
          <form
            onSubmit={handleAddCustomMeeting}
            className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-4 text-xs animate-in fade-in duration-200"
          >
            <div className="font-bold text-gray-900 flex items-center justify-between border-b border-emerald-200 pb-2">
              <span className="flex items-center gap-2 text-emerald-950 font-black">
                <Users className="w-4 h-4 text-emerald-700" />
                Configure New Governance Meeting
              </span>
              <span className="text-[11px] text-gray-500">
                Adds review capacity directly into the simulation pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Meeting Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SteerCo Extraordinary Session"
                  value={newMeetingName}
                  onChange={(e) => setNewMeetingName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Chaired By
                </label>
                <input
                  type="text"
                  placeholder="e.g. TO Lead &amp; Stream Sponsor"
                  value={newMeetingChair}
                  onChange={(e) => setNewMeetingChair(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Target Tier Scope
                </label>
                <select
                  value={newMeetingTier}
                  onChange={(e) =>
                    setNewMeetingTier(
                      e.target.value as "T1" | "T2" | "T3" | "T4" | "ALL"
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="T1">T1 · Transform Only</option>
                  <option value="T2">T2 · Scale Only</option>
                  <option value="T3">T3 · Fast Lane Only</option>
                  <option value="T4">T4 · Self-Service Only</option>
                  <option value="ALL">All Tiers (General Review)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Meeting Cadence
                </label>
                <select
                  value={newMeetingCadence}
                  onChange={(e) =>
                    setNewMeetingCadence(
                      e.target.value as "weekly" | "fortnightly" | "monthly"
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="weekly">Weekly (Every 1 week)</option>
                  <option value="fortnightly">Fortnightly (Every 2 weeks)</option>
                  <option value="monthly">Monthly (Every 4 weeks)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  UCs Reviewed / Meeting
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={newMeetingCapacity}
                  onChange={(e) => setNewMeetingCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMeetingForm(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-600 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save &amp; Activate Meeting</span>
              </button>
            </div>
          </form>
        )}

        {/* CORE GOVERNANCE MEETINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. TRANSFORMATION STEERCO */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                  Transformation SteerCo
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                  T1 Transform (&gt;€1M)
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Chaired by TO Lead &amp; ExCo Stream Sponsors. G2 Endorsement,
                G3 Priority &amp; G4 Funding Release.
              </p>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              {/* Cadence Selector */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                  Meeting Cadence:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateAssumption("steerCoCadenceWeeks", 1)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                      assumptions.steerCoCadenceWeeks === 1
                        ? "bg-emerald-700 text-white border-emerald-800 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Weekly (1w)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAssumption("steerCoCadenceWeeks", 2)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                      assumptions.steerCoCadenceWeeks === 2
                        ? "bg-emerald-700 text-white border-emerald-800 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Fortnightly (2w)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAssumption("steerCoCadenceWeeks", 4)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                      assumptions.steerCoCadenceWeeks === 4
                        ? "bg-emerald-700 text-white border-emerald-800 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Monthly (4w)
                  </button>
                </div>
              </div>

              {/* Slot Capacity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-gray-700">
                    Slot Capacity / Meeting:
                  </span>
                  <span className="font-mono font-black text-emerald-800">
                    {assumptions.steerCoCapacity} UCs / meeting
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={assumptions.steerCoCapacity}
                  onChange={(e) =>
                    updateAssumption("steerCoCapacity", Number(e.target.value))
                  }
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              {/* Live Throughput Metrics */}
              <div className="p-3 rounded-xl bg-white border border-gray-200 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Effective Throughput:</span>
                  <span className="font-mono font-bold text-gray-900">
                    {flowCalculations.steerCo.weeklyCap.toFixed(2)} UC / week
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Arriving T1 Demand:</span>
                  <span className="font-mono font-bold text-gray-900">
                    {flowCalculations.steerCo.demandPerWeek.toFixed(2)} UC / week
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-100">
                  <span className="text-gray-500">Agenda Status:</span>
                  <span
                    className={`font-bold ${
                      flowCalculations.steerCo.isBottleneck
                        ? "text-rose-600"
                        : "text-emerald-700"
                    }`}
                  >
                    {flowCalculations.steerCo.isBottleneck
                      ? `Deficit (-${(flowCalculations.steerCo.demandPerWeek - flowCalculations.steerCo.weeklyCap).toFixed(2)}/wk)`
                      : "Surplus Capacity ✓"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. AI PORTFOLIO BOARD */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  AI Portfolio Board
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold font-mono">
                  T2 Scale &amp; T3 SLA
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Stream Leadership &amp; Hub Delegates. G2 Platform fit, G3 Shared
                Squad &amp; T3 10-Day SLA sign-off.
              </p>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              {/* Cadence Selector */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                  Meeting Cadence:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      updateAssumption("portfolioBoardCadenceWeeks", 1)
                    }
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                      assumptions.portfolioBoardCadenceWeeks === 1
                        ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Weekly (1w)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateAssumption("portfolioBoardCadenceWeeks", 2)
                    }
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                      assumptions.portfolioBoardCadenceWeeks === 2
                        ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Fortnightly (2w)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateAssumption("portfolioBoardCadenceWeeks", 4)
                    }
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                      assumptions.portfolioBoardCadenceWeeks === 4
                        ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Monthly (4w)
                  </button>
                </div>
              </div>

              {/* Slot Capacity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-gray-700">
                    Slot Capacity / Meeting:
                  </span>
                  <span className="font-mono font-black text-blue-800">
                    {assumptions.portfolioBoardCapacity} UCs / meeting
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={assumptions.portfolioBoardCapacity}
                  onChange={(e) =>
                    updateAssumption(
                      "portfolioBoardCapacity",
                      Number(e.target.value)
                    )
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Live Throughput Metrics */}
              <div className="p-3 rounded-xl bg-white border border-gray-200 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Effective Throughput:</span>
                  <span className="font-mono font-bold text-gray-900">
                    {flowCalculations.portfolioBoard.weeklyCap.toFixed(2)} UC / week
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Arriving T2+T3 Demand:</span>
                  <span className="font-mono font-bold text-gray-900">
                    {flowCalculations.portfolioBoard.demandPerWeek.toFixed(2)} UC / week
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-100">
                  <span className="text-gray-500">Agenda Status:</span>
                  <span
                    className={`font-bold ${
                      flowCalculations.portfolioBoard.isBottleneck
                        ? "text-amber-600"
                        : "text-emerald-700"
                    }`}
                  >
                    {flowCalculations.portfolioBoard.isBottleneck
                      ? `Deficit (-${(flowCalculations.portfolioBoard.demandPerWeek - flowCalculations.portfolioBoard.weeklyCap).toFixed(2)}/wk)`
                      : "Surplus Capacity ✓"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. DIGITAL DESIGN AUTHORITY (DDA) */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  Digital Design Authority (DDA)
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold font-mono">
                  G2 Architecture &amp; Cyber
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Enterprise Architecture, Cyber &amp; ORAI. Reviews Architecture
                Decision Records (ADRs) at Gate G2.
              </p>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              {/* Cadence Selector */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                  Meeting Cadence:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateAssumption("ddaCadenceWeeks", 1)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                      assumptions.ddaCadenceWeeks === 1
                        ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Weekly (1w)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAssumption("ddaCadenceWeeks", 2)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                      assumptions.ddaCadenceWeeks === 2
                        ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Fortnightly (2w)
                  </button>
                </div>
              </div>

              {/* Slot Capacity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-gray-700">
                    ADR Slots / Meeting:
                  </span>
                  <span className="font-mono font-black text-purple-800">
                    {assumptions.ddaCapacity} ADRs / meeting
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={assumptions.ddaCapacity}
                  onChange={(e) =>
                    updateAssumption("ddaCapacity", Number(e.target.value))
                  }
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Live Throughput Metrics */}
              <div className="p-3 rounded-xl bg-white border border-gray-200 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Effective Capacity:</span>
                  <span className="font-mono font-bold text-gray-900">
                    {flowCalculations.dda.weeklyCap.toFixed(2)} ADR / week
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Arriving ADR Demand:</span>
                  <span className="font-mono font-bold text-gray-900">
                    {flowCalculations.dda.demandPerWeek.toFixed(2)} ADR / week
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-100">
                  <span className="text-gray-500">Agenda Status:</span>
                  <span
                    className={`font-bold ${
                      flowCalculations.dda.isBottleneck
                        ? "text-rose-600"
                        : "text-emerald-700"
                    }`}
                  >
                    {flowCalculations.dda.isBottleneck
                      ? `Deficit (-${(flowCalculations.dda.demandPerWeek - flowCalculations.dda.weeklyCap).toFixed(2)}/wk)`
                      : "Surplus Capacity ✓"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOM EXTRA MEETINGS (IF ANY ADDED) */}
        {customMeetings.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Active Extra Governance Sessions ({customMeetings.length})
              </span>
              <span className="text-[11px] text-gray-500">
                Extra throughput automatically credited to pipeline review capacity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customMeetings.map((m) => {
                const weeklyContribution = m.slotCapacity / m.cadenceWeeks;
                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      m.active
                        ? "bg-amber-50/50 border-amber-300 ring-1 ring-amber-500/20"
                        : "bg-gray-100 border-gray-300 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-gray-900 text-xs">
                          {m.name}
                        </div>
                        <div className="text-[10px] text-gray-500">{m.chair}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleMeeting(m.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.active
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-300 text-gray-700"
                          }`}
                        >
                          {m.active ? "Active" : "Paused"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMeeting(m.id)}
                          className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete meeting"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] bg-white p-2.5 rounded-xl border border-black/5">
                      <div>
                        <span className="text-gray-400 block font-medium">Scope</span>
                        <span className="font-bold text-gray-800">
                          {m.targetTier === "ALL" ? "All Tiers" : `${m.targetTier} Only`}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-medium">Cadence</span>
                        <span className="font-bold text-gray-800">
                          {m.cadence === "weekly"
                            ? "Weekly (1w)"
                            : m.cadence === "fortnightly"
                            ? "Fortnightly (2w)"
                            : "Monthly (4w)"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-medium">Relief</span>
                        <span className="font-bold text-emerald-700">
                          +{weeklyContribution.toFixed(2)} UC/wk
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
