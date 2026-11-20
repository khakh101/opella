"use client";

import React, { useState, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sliders,
  TrendingUp,
  Zap,
  Info,
  Calendar,
  Layers,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Flame,
  Check,
} from "lucide-react";

// --- Types & Interfaces ---
export type ScenarioId = "low" | "medium" | "high" | "custom";

export interface SimulationAssumptions {
  incomingPerWeek: number;
  acceptanceRateG1: number; // %
  t1Split: number; // %
  t2Split: number; // %
  t3Split: number; // %
  selfServeSplit: number; // %
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
  g2T3LeadDays: number;
  g3T1LeadDays: number;
  g3T2LeadDays: number;
  g3T3LeadDays: number;
  g4T1LeadDays: number;
  g4T2LeadDays: number;
  g4T3LeadDays: number;
  mvpBuildWeeks: number;
  g5LeadWeeks: number;
}

// Preset Scenarios
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
      t1Split: 10,
      t2Split: 30,
      t3Split: 45,
      selfServeSplit: 15,
      returnFromRunRate: 8,
      activeInRunCount: 16,
      steerCoCapacity: 3,
      portfolioBoardCapacity: 6,
      ddaCapacity: 6,
      g1LeadDays: 1,
      g2T1LeadDays: 14,
      g2T2LeadDays: 10,
      g2T3LeadDays: 5,
      g3T1LeadDays: 18,
      g3T2LeadDays: 10,
      g3T3LeadDays: 7,
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
      t1Split: 15,
      t2Split: 35,
      t3Split: 40,
      selfServeSplit: 10,
      returnFromRunRate: 12,
      activeInRunCount: 24,
      steerCoCapacity: 3,
      portfolioBoardCapacity: 6,
      ddaCapacity: 6,
      g1LeadDays: 1,
      g2T1LeadDays: 21,
      g2T2LeadDays: 14,
      g2T3LeadDays: 7,
      g3T1LeadDays: 28,
      g3T2LeadDays: 14,
      g3T3LeadDays: 10,
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
      t1Split: 25,
      t2Split: 38,
      t3Split: 27,
      selfServeSplit: 10,
      returnFromRunRate: 15,
      activeInRunCount: 32,
      steerCoCapacity: 3,
      portfolioBoardCapacity: 7,
      ddaCapacity: 7,
      g1LeadDays: 2,
      g2T1LeadDays: 35,
      g2T2LeadDays: 21,
      g2T3LeadDays: 10,
      g3T1LeadDays: 42,
      g3T2LeadDays: 21,
      g3T3LeadDays: 14,
      g4T1LeadDays: 35,
      g4T2LeadDays: 21,
      g4T3LeadDays: 10,
      mvpBuildWeeks: 12,
      g5LeadWeeks: 6,
    },
  },
};

export const PipelineFlowSimulator: React.FC = () => {
  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("medium");
  const [assumptions, setAssumptions] = useState<SimulationAssumptions>(
    PRESET_SCENARIOS.medium.assumptions
  );

  // UI accordion toggles
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [activeInspectNode, setActiveInspectNode] = useState<string>("G3_T1");

  // Handle switching scenario preset
  const handleSelectScenario = (sc: ScenarioId) => {
    setSelectedScenario(sc);
    if (sc !== "custom") {
      setAssumptions(PRESET_SCENARIOS[sc].assumptions);
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
  };

  // --- MATHEMATICAL FLOW & BOTTLENECK ENGINE ---
  const flowCalculations = useMemo(() => {
    const {
      incomingPerWeek,
      acceptanceRateG1,
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
    // Active run cases returning per year converted to weekly flow:
    const returningFromRunPerWeek =
      (activeInRunCount * (returnFromRunRate / 100)) / 12;

    // Weekly flow per tier entering Framing (G2)
    const t1WeeklyNew = acceptedAtG1PerWeek * normT1;
    const t1WeeklyTotal = t1WeeklyNew + returningFromRunPerWeek * 0.5; // 50% of returns are T1

    const t2WeeklyNew = acceptedAtG1PerWeek * normT2;
    const t2WeeklyTotal = t2WeeklyNew + returningFromRunPerWeek * 0.35; // 35% of returns are T2

    const t3WeeklyNew = acceptedAtG1PerWeek * normT3;
    const t3WeeklyTotal = t3WeeklyNew + returningFromRunPerWeek * 0.15; // 15% of returns are T3

    const ssWeeklyTotal = acceptedAtG1PerWeek * normSS; // Self-serve bypasses G2-G4

    // --- Committee Review Cadences (Weeks per meeting cycle) ---
    // Rule: Monthly = 4 weeks, Fortnightly = 2 weeks, Weekly = 1 week
    const steerCoIntervalWeeks = 4; // Monthly
    const portfolioBoardIntervalWeeks = 2; // Fortnightly
    const ddaIntervalWeeks = 1; // Weekly

    // 1. Transformation SteerCo (Monthly, 4 weeks)
    // Reviews T1 at G2 endorsement, G3 Priority & G4 Funding
    const steerCoArrivingPerCycle = t1WeeklyTotal * steerCoIntervalWeeks;
    const steerCoExcessPerCycle = Math.max(0, steerCoArrivingPerCycle - steerCoCapacity);
    const steerCoQueue = Math.round(steerCoExcessPerCycle * 1.5 * 10) / 10;
    // Waiting time: baseline interval/2 + queue wait
    const steerCoWaitWeeks =
      steerCoQueue > 0
        ? Math.round((steerCoIntervalWeeks / 2 + (steerCoQueue / steerCoCapacity) * steerCoIntervalWeeks) * 10) / 10
        : Math.round((steerCoIntervalWeeks / 2) * 10) / 10;
    const steerCoCyclesDelay = Math.round((steerCoWaitWeeks / steerCoIntervalWeeks) * 10) / 10;
    const steerCoIsBottleneck = steerCoCyclesDelay > 1.0;
    const steerCoIsSevere = steerCoCyclesDelay > 2.0;

    // 2. AI Portfolio Board (Fortnightly, 2 weeks)
    // Reviews T2 & T3 at G2, G3, G4
    const portfolioBoardDemandPerWeek = t2WeeklyTotal + t3WeeklyTotal;
    const portfolioBoardArrivingPerCycle = portfolioBoardDemandPerWeek * portfolioBoardIntervalWeeks;
    const portfolioBoardExcessPerCycle = Math.max(
      0,
      portfolioBoardArrivingPerCycle - portfolioBoardCapacity
    );
    const portfolioBoardQueue = Math.round(portfolioBoardExcessPerCycle * 1.5 * 10) / 10;
    const portfolioBoardWaitWeeks =
      portfolioBoardQueue > 0
        ? Math.round(
            (portfolioBoardIntervalWeeks / 2 +
              (portfolioBoardQueue / portfolioBoardCapacity) * portfolioBoardIntervalWeeks) *
              10
          ) / 10
        : Math.round((portfolioBoardIntervalWeeks / 2) * 10) / 10;
    const portfolioBoardCyclesDelay =
      Math.round((portfolioBoardWaitWeeks / portfolioBoardIntervalWeeks) * 10) / 10;
    const portfolioBoardIsBottleneck = portfolioBoardCyclesDelay > 1.0;
    const portfolioBoardIsSevere = portfolioBoardCyclesDelay > 2.0;

    // 3. Digital Design Authority (DDA, Weekly, 1 week)
    // Reviews ADRs for T1 & T2
    const ddaDemandPerWeek = t1WeeklyTotal + t2WeeklyTotal * 0.6;
    const ddaArrivingPerCycle = ddaDemandPerWeek * ddaIntervalWeeks;
    const ddaExcessPerCycle = Math.max(0, ddaArrivingPerCycle - ddaCapacity);
    const ddaQueue = Math.round(ddaExcessPerCycle * 10) / 10;
    const ddaWaitWeeks =
      ddaQueue > 0
        ? Math.round((ddaIntervalWeeks / 2 + (ddaQueue / ddaCapacity) * ddaIntervalWeeks) * 10) / 10
        : 0.5;
    const ddaCyclesDelay = Math.round((ddaWaitWeeks / ddaIntervalWeeks) * 10) / 10;
    const ddaIsBottleneck = ddaCyclesDelay > 1.0;
    const ddaIsSevere = ddaCyclesDelay > 2.0;

    // --- Total Pipeline Metrics ---
    const totalInflowPerMonth = incomingPerWeek * 4.33;
    const netThroughputToBuildPerWeek =
      t1WeeklyTotal + t2WeeklyTotal + t3WeeklyTotal + ssWeeklyTotal;
    const netThroughputToBuildPerMonth = netThroughputToBuildPerWeek * 4.33;

    // Average Framing Lead Time (Days from Intake to GO BUILD Gate G4)
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
      assumptions.g1LeadDays +
      assumptions.g2T3LeadDays +
      assumptions.g3T3LeadDays +
      assumptions.g4T3LeadDays;

    const ssLeadDays = 1; // Instant bypass

    const weightedAvgLeadDays = Math.round(
      t1LeadDays * normT1 +
        t2LeadDays * normT2 +
        t3LeadDays * normT3 +
        ssLeadDays * normSS
    );

    // Active WIP in Framing Gates
    const totalFramingWip = Math.round(
      t1WeeklyTotal * (t1LeadDays / 7) +
        t2WeeklyTotal * (t2LeadDays / 7) +
        t3WeeklyTotal * (t3LeadDays / 7) +
        ssWeeklyTotal * (ssLeadDays / 7)
    );

    // Count of identified bottlenecks
    let bottleneckCount = 0;
    if (steerCoIsBottleneck) bottleneckCount++;
    if (portfolioBoardIsBottleneck) bottleneckCount++;
    if (ddaIsBottleneck) bottleneckCount++;

    return {
      totalInflowPerMonth,
      acceptedAtG1PerWeek,
      rejectedAtG1PerWeek,
      returningFromRunPerWeek,
      t1WeeklyTotal,
      t2WeeklyTotal,
      t3WeeklyTotal,
      ssWeeklyTotal,
      netThroughputToBuildPerWeek,
      netThroughputToBuildPerMonth,
      weightedAvgLeadDays,
      totalFramingWip,
      bottleneckCount,
      t1LeadDays,
      t2LeadDays,
      t3LeadDays,
      ssLeadDays,

      // Committees analysis
      steerCo: {
        demandPerWeek: t1WeeklyTotal,
        capacityPerMeeting: steerCoCapacity,
        intervalWeeks: steerCoIntervalWeeks,
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
        queue: ddaQueue,
        waitWeeks: ddaWaitWeeks,
        cyclesDelay: ddaCyclesDelay,
        isBottleneck: ddaIsBottleneck,
        isSevere: ddaIsSevere,
      },
    };
  }, [assumptions]);

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
              Live Governance Fluid Simulation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Use Case Flow &amp; Governance Bottleneck Simulator
          </h1>
          <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
            Simulate incoming project volumes, gate lead times, meeting review cadences, and
            returning run modifications to detect comitology bottlenecks before they stall enterprise scale.
          </p>
        </div>

        {/* SCENARIO SWITCHER BUTTONS */}
        <div className="bg-black/40 border border-white/20 p-2.5 rounded-2xl shrink-0 flex flex-col gap-2">
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider px-2 flex items-center justify-between">
            <span>Scenario Switcher:</span>
            <span className="text-[10px] text-white/60 font-mono">
              {PRESET_SCENARIOS[selectedScenario === "custom" ? "medium" : selectedScenario]?.badge}
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
              <span className="text-[9px] bg-black/25 px-1 rounded text-white/90">3.5/wk</span>
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
              <span className="text-[9px] bg-black/25 px-1 rounded text-white/90">8.5/wk</span>
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
              <span className="text-[9px] bg-black/25 px-1 rounded text-white/90">18/wk</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI METRICS RIBBON */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Total Inflow
          </span>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900">
              {assumptions.incomingPerWeek} <span className="text-xs font-medium text-gray-500">UC/wk</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              ~{Math.round(flowCalculations.totalInflowPerMonth)} UC / month
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-blue-600" /> Net Throughput
          </span>
          <div className="mt-2">
            <div className="text-2xl font-black text-blue-900">
              {flowCalculations.netThroughputToBuildPerWeek.toFixed(1)}{" "}
              <span className="text-xs font-medium text-gray-500">UC/wk</span>
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
              ~{Math.round(flowCalculations.netThroughputToBuildPerMonth)} reaching Build/mo
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Avg Framing Time
          </span>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900">
              {flowCalculations.weightedAvgLeadDays} <span className="text-xs font-medium text-gray-500">Days</span>
            </div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">
              T1: {flowCalculations.t1LeadDays}d · T2: {flowCalculations.t2LeadDays}d · T3: {flowCalculations.t3LeadDays}d
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-purple-600" /> Active Gating WIP
          </span>
          <div className="mt-2">
            <div className="text-2xl font-black text-purple-900">
              {flowCalculations.totalFramingWip} <span className="text-xs font-medium text-gray-500">UCs</span>
            </div>
            <div className="text-[11px] text-purple-700 font-medium mt-0.5">
              In-flight across G1–G4
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
              {assumptions.returnFromRunRate}% of {assumptions.activeInRunCount} Run cases
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
                flowCalculations.bottleneckCount > 0 ? "text-rose-600 animate-bounce" : "text-emerald-600"
              }`}
            />
            Bottlenecks
          </span>
          <div className="mt-2">
            <div
              className={`text-2xl font-black ${
                flowCalculations.bottleneckCount > 0 ? "text-rose-700" : "text-emerald-800"
              }`}
            >
              {flowCalculations.bottleneckCount}{" "}
              <span className="text-xs font-semibold">
                {flowCalculations.bottleneckCount === 1 ? "Forum Delayed" : "Forums Delayed"}
              </span>
            </div>
            <div
              className={`text-[11px] font-bold mt-0.5 ${
                flowCalculations.bottleneckCount > 0 ? "text-rose-800" : "text-emerald-700"
              }`}
            >
              {flowCalculations.bottleneckCount > 0 ? ">1 Meeting Cycle Queue" : "Zero Queues"}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: TOP PANEL — EDITABLE ASSUMPTIONS (WHITEBOARD PARAMÈTRES)
      ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" />
              1. Top Panel — Live Editable Assumptions
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Modify incoming use cases, acceptance rate, tier distribution, and meeting review capacities.
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
              {showAdvancedSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showAdvancedSettings ? "Hide Gate Lead Times" : "Edit Gate Lead Times (Days)"}
            </button>
          </div>
        </div>

        {/* 4 PRIMARY ASSUMPTION CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Incoming Use Cases */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">
                Incoming Use Cases
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
              onChange={(e) => updateAssumption("incomingPerWeek", Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>1 UC/wk (Slow)</span>
              <span>15 UC/wk</span>
              <span>30 UC/wk (Surge)</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-snug">
              Total volume of new ideas and problem charters submitted into Front Door intake.
            </p>
          </div>

          {/* 2. Acceptance Rate at G1 */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">
                Acceptance Rate (Gate G1)
              </label>
              <span className="text-xs font-black text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md font-mono">
                {assumptions.acceptanceRateG1}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={assumptions.acceptanceRateG1}
              onChange={(e) => updateAssumption("acceptanceRateG1", Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>50% (Strict)</span>
              <span>85% (Playbook avg)</span>
              <span>100% (Pass-all)</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-snug">
              % of incoming use cases validated by OpellaGPT Charter Agent to pass into framing.
            </p>
          </div>

          {/* 3. Tier Distribution Sliders */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">
                Tier Routing Split
              </label>
              <span className="text-[10px] text-gray-600 font-mono font-bold">
                T1: {assumptions.t1Split}% · T2: {assumptions.t2Split}% · T3: {assumptions.t3Split}%
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-14 text-[10px] font-bold text-emerald-800">T1 ({assumptions.t1Split}%)</span>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="5"
                  value={assumptions.t1Split}
                  onChange={(e) => updateAssumption("t1Split", Number(e.target.value))}
                  className="w-full accent-emerald-700 h-1.5 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-14 text-[10px] font-bold text-blue-800">T2 ({assumptions.t2Split}%)</span>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={assumptions.t2Split}
                  onChange={(e) => updateAssumption("t2Split", Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-14 text-[10px] font-bold text-amber-800">T3 ({assumptions.t3Split}%)</span>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={assumptions.t3Split}
                  onChange={(e) => updateAssumption("t3Split", Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 cursor-pointer"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-500 leading-tight">
              Distribution among T1 Transform (&gt;€1M/Big Bets), T2 Scale, and T3 Fast Lane.
            </p>
          </div>

          {/* 4. Return from Run Rate (Major Modification) */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">
                Run Modification Rate
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
              onChange={(e) => updateAssumption("returnFromRunRate", Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>0% (None)</span>
              <span>12% (Typical)</span>
              <span>30% (High rework)</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-snug">
              Live use cases in Run re-entering Gate G2/G3 for major upgrades or scope expansion.
            </p>
          </div>
        </div>

        {/* ADVANCED COLLAPSIBLE: GATE LEAD TIME OVERRIDES */}
        {showAdvancedSettings && (
          <div className="p-5 rounded-2xl bg-gray-50/80 border border-emerald-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                Gate Evaluation Durations (Days to assemble deliverables &amp; receive sign-off)
              </div>
              <span className="text-[11px] text-gray-500">Excludes committee queue waiting delay</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-2">
                <div className="font-bold text-emerald-900">T1 · Transform Gating</div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">G2 Feasibility (ADR + Finance):</span>
                    <span className="font-mono font-bold text-gray-900">{assumptions.g2T1LeadDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">G3 Priority &amp; VCP:</span>
                    <span className="font-mono font-bold text-gray-900">{assumptions.g3T1LeadDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">G4 SteerCo Tranche Release:</span>
                    <span className="font-mono font-bold text-gray-900">{assumptions.g4T1LeadDays} days</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-2">
                <div className="font-bold text-blue-900">T2 · Scale Gating</div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">G2 Feasibility (Platform fit):</span>
                    <span className="font-mono font-bold text-gray-900">{assumptions.g2T2LeadDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">G3 Priority (Portfolio Board):</span>
                    <span className="font-mono font-bold text-gray-900">{assumptions.g3T2LeadDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">G4 Sponsors Sign-off:</span>
                    <span className="font-mono font-bold text-gray-900">{assumptions.g4T2LeadDays} days</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-2">
                <div className="font-bold text-amber-900">T3 · Fast Lane Gating</div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">G2 1-Page Canvas Draft:</span>
                    <span className="font-mono font-bold text-gray-900">{assumptions.g2T3LeadDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">G3 10-Day SLA Portfolio Board:</span>
                    <span className="font-mono font-bold text-gray-900">{assumptions.g3T3LeadDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">G4 Sprint Sizing (Enable me):</span>
                    <span className="font-mono font-bold text-gray-900">{assumptions.g4T3LeadDays} days</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-2">
                <div className="font-bold text-purple-900">Delivery &amp; Scaling</div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">MVP Build Duration:</span>
                    <span className="font-mono font-bold text-gray-900">{assumptions.mvpBuildWeeks} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">G5 Scale Validation:</span>
                    <span className="font-mono font-bold text-gray-900">{assumptions.g5LeadWeeks} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Self-Serve Fast Path:</span>
                    <span className="font-mono font-bold text-emerald-700">1 day (Bypass G2-G4)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 2: MAIN VIEW — CRISP FLUID FLOW VISUALIZER
          (Pipes, Nodes & Animated SVG Particles in 100% Exact Alignment)
      ========================================================================= */}
      <div className="bg-[#0b1329] rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-800 text-white space-y-6 relative overflow-hidden">
        {/* Glow backdrop decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Title & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                SVG Flow Conduits
              </span>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                2. Main View — Live Project Flow &amp; Gating Nodes
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Particles follow exact conduit trajectories. Bottlenecks turn conduits red and display waiting queues.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Healthy Flow
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> Bottleneck Alert (&gt;1 mo)
              </span>
            </div>
          </div>
        </div>

        {/* PURE SVG FLUID PIPELINE WITH NATIVE ANIMATEMOTION PARTICLES */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[980px] aspect-[16/7] relative rounded-2xl bg-[#060b18] border border-gray-800 p-2 shadow-inner">
            <svg
              viewBox="0 0 1100 480"
              className="w-full h-full select-none"
              style={{ overflow: "visible" }}
            >
              <defs>
                {/* Glowing drop shadow filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* --- EXACT SVG CONDUIT PATHS --- */}
              {/* Path 0: Source to Gate G1 */}
              <path
                id="path-source-g1"
                d="M 80 240 L 220 240"
                fill="none"
                stroke="#10b981"
                strokeWidth="14"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />
              <path
                d="M 80 240 L 220 240"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Path 1: T1 Transform Conduit (y = 90) */}
              <path
                id="path-t1"
                d="M 220 240 C 310 90, 340 90, 420 90 L 700 90 C 780 90, 810 240, 870 240"
                fill="none"
                stroke={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
                strokeWidth={flowCalculations.steerCo.isBottleneck ? "16" : "12"}
                strokeOpacity={flowCalculations.steerCo.isBottleneck ? "0.4" : "0.22"}
                strokeLinecap="round"
              />

              {/* Path 2: T2 Scale Conduit (y = 180) */}
              <path
                id="path-t2"
                d="M 220 240 C 310 180, 360 180, 440 180 L 680 180 C 760 180, 800 240, 870 240"
                fill="none"
                stroke={flowCalculations.portfolioBoard.isBottleneck ? "#f59e0b" : "#38bdf8"}
                strokeWidth="10"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />

              {/* Path 3: T3 Fast Lane Conduit (y = 300) */}
              <path
                id="path-t3"
                d="M 220 240 C 310 300, 360 300, 440 300 L 680 300 C 760 300, 800 240, 870 240"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="10"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />

              {/* Path 4: Self-Service AI Conduit (y = 390) */}
              <path
                id="path-ss"
                d="M 220 240 C 310 390, 380 390, 520 390 L 640 390 C 760 390, 800 240, 870 240"
                fill="none"
                stroke="#c084fc"
                strokeWidth="8"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />

              {/* Path 5: MVP Build to RUN */}
              <path
                id="path-build-run"
                d="M 870 240 L 960 240 L 1040 240"
                fill="none"
                stroke="#10b981"
                strokeWidth="12"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />

              {/* Path 6: Major Modification Return Loop (Run back to G2/G3) */}
              <path
                id="path-return"
                d="M 1040 220 C 850 15, 550 15, 420 80"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeDasharray="6 6"
                strokeOpacity="0.8"
              />

              {/* --- PARTICLES FOLLOWING EXACT SVG PATHS --- */}
              {/* Source -> G1 particles */}
              <circle r="3.5" fill="#34d399" filter="url(#glow)">
                <animateMotion dur="1.2s" repeatCount="indefinite">
                  <mpath href="#path-source-g1" />
                </animateMotion>
              </circle>
              <circle r="3" fill="#34d399">
                <animateMotion dur="1.2s" begin="0.6s" repeatCount="indefinite">
                  <mpath href="#path-source-g1" />
                </animateMotion>
              </circle>

              {/* T1 particles */}
              <circle
                r="4"
                fill={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
                filter="url(#glow)"
              >
                <animateMotion dur="3.5s" repeatCount="indefinite">
                  <mpath href="#path-t1" />
                </animateMotion>
              </circle>
              <circle
                r="3.5"
                fill={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
              >
                <animateMotion dur="3.5s" begin="1.2s" repeatCount="indefinite">
                  <mpath href="#path-t1" />
                </animateMotion>
              </circle>
              <circle
                r="3.5"
                fill={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
              >
                <animateMotion dur="3.5s" begin="2.4s" repeatCount="indefinite">
                  <mpath href="#path-t1" />
                </animateMotion>
              </circle>

              {/* T2 particles */}
              <circle r="3.5" fill="#38bdf8" filter="url(#glow)">
                <animateMotion dur="3.2s" repeatCount="indefinite">
                  <mpath href="#path-t2" />
                </animateMotion>
              </circle>
              <circle r="3" fill="#38bdf8">
                <animateMotion dur="3.2s" begin="1.6s" repeatCount="indefinite">
                  <mpath href="#path-t2" />
                </animateMotion>
              </circle>

              {/* T3 particles */}
              <circle r="3.5" fill="#fbbf24" filter="url(#glow)">
                <animateMotion dur="2.8s" repeatCount="indefinite">
                  <mpath href="#path-t3" />
                </animateMotion>
              </circle>
              <circle r="3" fill="#fbbf24">
                <animateMotion dur="2.8s" begin="1.4s" repeatCount="indefinite">
                  <mpath href="#path-t3" />
                </animateMotion>
              </circle>

              {/* Self-Serve particles */}
              <circle r="3" fill="#c084fc">
                <animateMotion dur="2.5s" repeatCount="indefinite">
                  <mpath href="#path-ss" />
                </animateMotion>
              </circle>

              {/* Build to Run particles */}
              <circle r="3.5" fill="#10b981">
                <animateMotion dur="2.0s" repeatCount="indefinite">
                  <mpath href="#path-build-run" />
                </animateMotion>
              </circle>

              {/* Return loop particles */}
              <circle r="3.5" fill="#f59e0b" filter="url(#glow)">
                <animateMotion dur="4.0s" repeatCount="indefinite">
                  <mpath href="#path-return" />
                </animateMotion>
              </circle>
              <circle r="3" fill="#f59e0b">
                <animateMotion dur="4.0s" begin="2.0s" repeatCount="indefinite">
                  <mpath href="#path-return" />
                </animateMotion>
              </circle>

              {/* --- GATING NODES & LABELS --- */}

              {/* 1. NODE: SOURCE */}
              <g transform="translate(80, 240)">
                <circle r="32" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                <text x="0" y="-7" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                  SOURCE
                </text>
                <text x="0" y="9" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
                  {assumptions.incomingPerWeek}
                </text>
                <text x="0" y="20" textAnchor="middle" fill="#34d399" fontSize="8.5" fontWeight="bold">
                  UC / wk
                </text>
              </g>

              {/* 2. NODE: GATE G1 (AI CHARTER AGENT) */}
              <g transform="translate(220, 240)">
                <circle r="28" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
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

              {/* --- T1 NODES (CRITICAL TRANSFORM PATH) --- */}
              {/* T1 - Gate G2 Feasibility */}
              <g
                transform="translate(420, 90)"
                className="cursor-pointer"
                onClick={() => setActiveInspectNode("G2_T1")}
              >
                <rect
                  x="-42"
                  y="-22"
                  width="84"
                  height="44"
                  rx="10"
                  fill="#0f172a"
                  stroke={flowCalculations.dda.isBottleneck ? "#ef4444" : "#10b981"}
                  strokeWidth="2"
                />
                <text x="0" y="-6" textAnchor="middle" fill="#10b981" fontSize="9.5" fontWeight="bold">
                  G2 · Feasibility
                </text>
                <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  ADR &amp; Finance
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#94a3b8" fontSize="7.5">
                  DDA (Weekly)
                </text>
              </g>

              {/* T1 - Gate G3 Priority (60% Hub Pool) with BOTTLENECK ALERT BADGE */}
              <g
                transform="translate(560, 90)"
                className="cursor-pointer"
                onClick={() => setActiveInspectNode("G3_T1")}
              >
                <rect
                  x="-46"
                  y="-24"
                  width="92"
                  height="48"
                  rx="10"
                  fill="#0f172a"
                  stroke={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
                  strokeWidth={flowCalculations.steerCo.isBottleneck ? "3" : "2"}
                />
                {/* Exclamation badge above node if bottleneck */}
                {flowCalculations.steerCo.isBottleneck && (
                  <g transform="translate(0, -32)">
                    <rect
                      x="-55"
                      y="-10"
                      width="110"
                      height="18"
                      rx="6"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="900">
                      ! STEERCO BACKLOG
                    </text>
                  </g>
                )}
                <text x="0" y="-8" textAnchor="middle" fill="#f87171" fontSize="9.5" fontWeight="bold">
                  G3 · Priority
                </text>
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  60% Hub Pool
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">
                  SteerCo (Monthly)
                </text>
              </g>

              {/* T1 - Gate G4 (Mode 1 Do it for me) */}
              <g
                transform="translate(700, 90)"
                className="cursor-pointer"
                onClick={() => setActiveInspectNode("G4_T1")}
              >
                <rect
                  x="-42"
                  y="-22"
                  width="84"
                  height="44"
                  rx="10"
                  fill="#0f172a"
                  stroke={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
                  strokeWidth="2"
                />
                <text x="0" y="-6" textAnchor="middle" fill="#10b981" fontSize="9.5" fontWeight="bold">
                  G4 · GO BUILD
                </text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                  Mode 1 · Hub
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#94a3b8" fontSize="7.5">
                  SteerCo Unlock
                </text>
              </g>

              {/* --- T2 SCALE NODE (y = 180) --- */}
              <g
                transform="translate(560, 180)"
                className="cursor-pointer"
                onClick={() => setActiveInspectNode("G2_T2")}
              >
                <rect
                  x="-55"
                  y="-22"
                  width="110"
                  height="44"
                  rx="10"
                  fill="#0f172a"
                  stroke={flowCalculations.portfolioBoard.isBottleneck ? "#f59e0b" : "#38bdf8"}
                  strokeWidth="2"
                />
                {flowCalculations.portfolioBoard.isBottleneck && (
                  <g transform="translate(0, -30)">
                    <rect
                      x="-50"
                      y="-9"
                      width="100"
                      height="17"
                      rx="5"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <text x="0" y="3" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="900">
                      ⚠️ BOARD QUEUE
                    </text>
                  </g>
                )}
                <text x="0" y="-6" textAnchor="middle" fill="#38bdf8" fontSize="9.5" fontWeight="bold">
                  T2 · Scale (G2–G4)
                </text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                  Mode 2 · Shared Squad
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#94a3b8" fontSize="7.5">
                  AI Portfolio Board (Fortnightly)
                </text>
              </g>

              {/* --- T3 FAST LANE NODE (y = 300) --- */}
              <g
                transform="translate(560, 300)"
                className="cursor-pointer"
                onClick={() => setActiveInspectNode("G3_T3")}
              >
                <rect
                  x="-55"
                  y="-22"
                  width="110"
                  height="44"
                  rx="10"
                  fill="#0f172a"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
                <text x="0" y="-6" textAnchor="middle" fill="#fbbf24" fontSize="9.5" fontWeight="bold">
                  T3 · Fast Lane (G2–G4)
                </text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                  1-Page Canvas · Enable me
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">
                  10-Day SLA · Agile Sprint
                </text>
              </g>

              {/* --- SELF-SERVICE AI NODE (y = 390) --- */}
              <g
                transform="translate(580, 390)"
                className="cursor-pointer"
                onClick={() => setActiveInspectNode("SS")}
              >
                <rect
                  x="-55"
                  y="-20"
                  width="110"
                  height="40"
                  rx="10"
                  fill="#0f172a"
                  stroke="#c084fc"
                  strokeWidth="2"
                />
                <text x="0" y="-5" textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="bold">
                  Self-Service AI
                </text>
                <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="8">
                  Registry Line &amp; Guardrails
                </text>
                <text x="0" y="16" textAnchor="middle" fill="#94a3b8" fontSize="7">
                  Instant (Bypass G2–G4)
                </text>
              </g>

              {/* NODE: MVP BUILD CONVERGENCE */}
              <g transform="translate(870, 240)">
                <circle r="30" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                <text x="0" y="-6" textAnchor="middle" fill="#10b981" fontSize="9.5" fontWeight="bold">
                  MVP BUILD
                </text>
                <text x="0" y="8" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">
                  {flowCalculations.netThroughputToBuildPerWeek.toFixed(1)}
                </text>
                <text x="0" y="19" textAnchor="middle" fill="#94a3b8" fontSize="8">
                  UC / wk in Build
                </text>
              </g>

              {/* NODE: RUN (G6) */}
              <g transform="translate(1040, 240)">
                <circle r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="0" y="-7" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                  RUN (G6)
                </text>
                <text x="0" y="9" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">
                  {assumptions.activeInRunCount}
                </text>
                <text x="0" y="21" textAnchor="middle" fill="#94a3b8" fontSize="8">
                  Live Operations
                </text>
              </g>

              {/* FLOATING PILL FOR RETURNING FLOW */}
              <g transform="translate(730, 28)">
                <rect
                  x="-120"
                  y="-12"
                  width="240"
                  height="24"
                  rx="8"
                  fill="#0f172a"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <text x="0" y="4" textAnchor="middle" fill="#f59e0b" fontSize="9.5" fontWeight="bold">
                  ↺ Run Modification Return ({assumptions.returnFromRunRate}% · {Math.round(flowCalculations.returningFromRunPerWeek * 4.33 * 10) / 10} UC/mo)
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* BOTTOM METRICS RIBBON UNDER FLOW */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-gray-800 text-gray-300">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-white block">T1 · Transform Lane</span>
              <span className="text-[11px] text-gray-400">
                {flowCalculations.t1WeeklyTotal.toFixed(1)} UC/wk · Monthly SteerCo Reviews
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-sky-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">T2 · Scale Lane</span>
              <span className="text-[11px] text-gray-400">
                {flowCalculations.t2WeeklyTotal.toFixed(1)} UC/wk · AI Portfolio Board
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">T3 · Fast Lane</span>
              <span className="text-[11px] text-gray-400">
                {flowCalculations.t3WeeklyTotal.toFixed(1)} UC/wk · 10-Day SLA Approval
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-purple-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Self-Service AI</span>
              <span className="text-[11px] text-gray-400">
                {flowCalculations.ssWeeklyTotal.toFixed(1)} UC/wk · Registry Line (0 Delay)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: COMITOLOGY REVIEW FORUMS & BOTTLENECK ANALYSIS
          (User Rule: "if a use case is waiting for more than 1 meeting we should say bottleneck")
      ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider font-mono">
              Comitology Risk Engine
            </span>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              3. Comitology Review Forums &amp; Bottleneck Analysis
            </h2>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Per Opella Operating Model rules: each meeting body has an established review cadence and agenda slot capacity.
            If arriving volume forces an initiative to wait for <strong>more than 1 meeting cycle</strong>, a{" "}
            <span className="text-rose-700 font-bold">Bottleneck Signal</span> is formally flagged.
          </p>
        </div>

        {/* GOVERNANCE FORUMS TABLE */}
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
                        Stream Leadership &amp; Hub Delegates · T2 Scaling &amp; T3 Fast Lane (10-Day SLA)
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
                        Architecture, Cyber &amp; ORAI · Architecture Decision Records (ADR)
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
              <span className="font-bold text-gray-900 block">1. SteerCo Extraordinary Sessions</span>
              <p className="text-gray-600 leading-snug">
                If SteerCo waiting time exceeds 4 weeks, shift from Monthly to Fortnightly cadences or expand slot capacity from 3 to 5 use cases per meeting.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
              <span className="font-bold text-gray-900 block">2. Gate G2 Delegation to Stream Leads</span>
              <p className="text-gray-600 leading-snug">
                Delegate Gate G2 business problem endorsement fully to Stream Leads, reserving SteerCo agenda exclusively for G3 Priority &amp; G4 Budget Tranches.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
              <span className="font-bold text-gray-900 block">3. Steer Initiatives to T3 Fast Lane</span>
              <p className="text-gray-600 leading-snug">
                Encourage single-function use cases to test a 6–8 week MVP under T3 (10-day SLA) rather than waiting in the T1 Transformation queue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
