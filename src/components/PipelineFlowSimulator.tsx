"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sliders,
  TrendingUp,
  Users,
  Building,
  Zap,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  GitPullRequest,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// --- Types & Interfaces ---
export type ScenarioId = "low" | "medium" | "high" | "custom";

export interface CommitteeConfig {
  id: string;
  name: string;
  shortName: string;
  intervalWeeks: number; // e.g. 4 for monthly, 2 for fortnightly, 1 for weekly
  intervalLabel: string;
  capacityPerMeeting: number; // number of use cases that can be reviewed per session
  appliesTo: string;
}

export interface GateFlowMetrics {
  gateId: string;
  name: string;
  committee: string;
  intervalWeeks: number;
  inflowPerWeek: number;
  inflowPerMonth: number;
  estimatedLeadTimeWeeks: number;
  queueBacklog: number;
  waitingTimeWeeks: number;
  isBottleneck: boolean;
  isSevereBottleneck: boolean;
  meetingCycleDelay: number;
}

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
  sponsorsCapacity: number; // bi-weekly (every 2 weeks)

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
    description: "Illustrative conservative intake (3–4 UC/week). Governance forums operate well within capacity with minimal queue delays.",
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
      sponsorsCapacity: 4,
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
    name: "Medium Volume (Opella FY25 Baseline)",
    description: "Expected steady-state intake (~8–9 UC/week). Transformation SteerCo experiences mild agenda pressure, creating a slight queue bottleneck at Gate G2/G3.",
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
      sponsorsCapacity: 4,
      g1LeadDays: 1,
      g2T1LeadDays: 24,
      g2T2LeadDays: 14,
      g2T3LeadDays: 7,
      g3T1LeadDays: 28,
      g3T2LeadDays: 14,
      g3T3LeadDays: 10,
      g4T1LeadDays: 28,
      g4T2LeadDays: 14,
      g4T3LeadDays: 7,
      mvpBuildWeeks: 10,
      g5LeadWeeks: 4,
    },
  },
  high: {
    name: "High Volume (Intense Pipeline / Stress Test)",
    description: "Surge intake (18–22 UC/week). Monthly SteerCo is overwhelmed with >2 meeting cycles of backlog. Portfolio Board reaches full capacity. Severe bottlenecks triggered.",
    badge: "High · Severe Bottleneck",
    assumptions: {
      incomingPerWeek: 19.0,
      acceptanceRateG1: 88,
      t1Split: 25,
      t2Split: 38,
      t3Split: 27,
      selfServeSplit: 10,
      returnFromRunRate: 18,
      activeInRunCount: 36,
      steerCoCapacity: 3,
      portfolioBoardCapacity: 7,
      ddaCapacity: 7,
      sponsorsCapacity: 4,
      g1LeadDays: 2,
      g2T1LeadDays: 45,
      g2T2LeadDays: 25,
      g2T3LeadDays: 14,
      g3T1LeadDays: 50,
      g3T2LeadDays: 28,
      g3T3LeadDays: 14,
      g4T1LeadDays: 45,
      g4T2LeadDays: 24,
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
  const [selectedGateDetail, setSelectedGateDetail] = useState<string | null>("G3_T1");

  // Canvas animation ref for flowing particles
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      sponsorsCapacity,
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
    // Formula: activeInRunCount * (returnFromRunRate / 100) / 12 weeks
    const returningFromRunPerWeek =
      (activeInRunCount * (returnFromRunRate / 100)) / 12;

    // Weekly flow per tier entering Framing (G2)
    const t1WeeklyNew = acceptedAtG1PerWeek * normT1;
    const t1WeeklyTotal = t1WeeklyNew + returningFromRunPerWeek * 0.45; // 45% of returns are T1

    const t2WeeklyNew = acceptedAtG1PerWeek * normT2;
    const t2WeeklyTotal = t2WeeklyNew + returningFromRunPerWeek * 0.4; // 40% of returns are T2

    const t3WeeklyNew = acceptedAtG1PerWeek * normT3;
    const t3WeeklyTotal = t3WeeklyNew + returningFromRunPerWeek * 0.15; // 15% of returns are T3

    const ssWeeklyTotal = acceptedAtG1PerWeek * normSS; // Self-serve bypasses G2-G4

    // --- Committee Review Capacities & Cadences (Weeks between meetings) ---
    // Rule: Monthly = 4 weeks, Fortnightly = 2 weeks, Weekly = 1 week
    const steerCoIntervalWeeks = 4; // Monthly
    const portfolioBoardIntervalWeeks = 2; // Fortnightly
    const ddaIntervalWeeks = 1; // Weekly
    const sponsorsIntervalWeeks = 2; // Bi-weekly

    // Effective throughput per week
    const steerCoThroughputPerWeek = steerCoCapacity / steerCoIntervalWeeks;
    const portfolioBoardThroughputPerWeek =
      portfolioBoardCapacity / portfolioBoardIntervalWeeks;
    const ddaThroughputPerWeek = ddaCapacity / ddaIntervalWeeks;
    const sponsorsThroughputPerWeek = sponsorsCapacity / sponsorsIntervalWeeks;

    // --- Evaluate Gate G2/G3/G4 for each Tier ---
    // 1. Transformation SteerCo (Reviews T1 at G2 Feasibility endorsement, G3 Priority & G4 Funding)
    // Arriving weekly demand to SteerCo for T1:
    const steerCoDemandPerWeek = t1WeeklyTotal;
    const steerCoQueue = Math.max(0, (steerCoDemandPerWeek - steerCoThroughputPerWeek) * 8); // approximate steady-state queue
    // Average waiting time in weeks to get on SteerCo agenda:
    const steerCoWaitingWeeks =
      steerCoDemandPerWeek > 0
        ? (steerCoQueue / steerCoThroughputPerWeek + 1) * (steerCoIntervalWeeks / 2)
        : 0;
    const steerCoMeetingDelays = steerCoWaitingWeeks / steerCoIntervalWeeks;
    const steerCoIsBottleneck = steerCoMeetingDelays > 1.0;
    const steerCoIsSevere = steerCoMeetingDelays > 2.0;

    // 2. AI Portfolio Board (Reviews T2 & T3 at G2, G3, G4)
    const portfolioBoardDemandPerWeek = t2WeeklyTotal + t3WeeklyTotal;
    const portfolioBoardQueue = Math.max(
      0,
      (portfolioBoardDemandPerWeek - portfolioBoardThroughputPerWeek) * 6
    );
    const portfolioBoardWaitingWeeks =
      portfolioBoardDemandPerWeek > 0
        ? (portfolioBoardQueue / portfolioBoardThroughputPerWeek + 1) *
          (portfolioBoardIntervalWeeks / 2)
        : 0;
    const portfolioBoardMeetingDelays =
      portfolioBoardWaitingWeeks / portfolioBoardIntervalWeeks;
    const portfolioBoardIsBottleneck = portfolioBoardMeetingDelays > 1.0;
    const portfolioBoardIsSevere = portfolioBoardMeetingDelays > 2.0;

    // 3. Digital Design Authority (DDA - Weekly review of ADRs for T1 & T2)
    const ddaDemandPerWeek = t1WeeklyTotal + t2WeeklyTotal * 0.7;
    const ddaQueue = Math.max(0, (ddaDemandPerWeek - ddaThroughputPerWeek) * 4);
    const ddaWaitingWeeks =
      ddaDemandPerWeek > 0
        ? (ddaQueue / ddaThroughputPerWeek + 1) * (ddaIntervalWeeks / 2)
        : 0;
    const ddaMeetingDelays = ddaWaitingWeeks / ddaIntervalWeeks;
    const ddaIsBottleneck = ddaMeetingDelays > 1.0;
    const ddaIsSevere = ddaMeetingDelays > 2.0;

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
      Math.round(steerCoWaitingWeeks * 7);

    const t2LeadDays =
      assumptions.g1LeadDays +
      assumptions.g2T2LeadDays +
      assumptions.g3T2LeadDays +
      assumptions.g4T2LeadDays +
      Math.round(portfolioBoardWaitingWeeks * 4);

    const t3LeadDays =
      assumptions.g1LeadDays +
      assumptions.g2T3LeadDays +
      assumptions.g3T3LeadDays +
      assumptions.g4T3LeadDays;

    const ssLeadDays = 1; // Self-serve instant bypass

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
        demandPerWeek: steerCoDemandPerWeek,
        capacityWeekly: steerCoThroughputPerWeek,
        queue: Math.round(steerCoQueue * 10) / 10,
        waitingWeeks: Math.round(steerCoWaitingWeeks * 10) / 10,
        meetingDelays: Math.round(steerCoMeetingDelays * 10) / 10,
        isBottleneck: steerCoIsBottleneck,
        isSevere: steerCoIsSevere,
      },
      portfolioBoard: {
        demandPerWeek: portfolioBoardDemandPerWeek,
        capacityWeekly: portfolioBoardThroughputPerWeek,
        queue: Math.round(portfolioBoardQueue * 10) / 10,
        waitingWeeks: Math.round(portfolioBoardWaitingWeeks * 10) / 10,
        meetingDelays: Math.round(portfolioBoardMeetingDelays * 10) / 10,
        isBottleneck: portfolioBoardIsBottleneck,
        isSevere: portfolioBoardIsSevere,
      },
      dda: {
        demandPerWeek: ddaDemandPerWeek,
        capacityWeekly: ddaThroughputPerWeek,
        queue: Math.round(ddaQueue * 10) / 10,
        waitingWeeks: Math.round(ddaWaitingWeeks * 10) / 10,
        meetingDelays: Math.round(ddaMeetingDelays * 10) / 10,
        isBottleneck: ddaIsBottleneck,
        isSevere: ddaIsSevere,
      },
    };
  }, [assumptions]);

  // --- PARTICLE FLOW ANIMATION ON CANVAS ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    // Define particle streams
    interface Particle {
      x: number;
      y: number;
      progress: number;
      speed: number;
      tier: "T1" | "T2" | "T3" | "SS" | "RETURN";
      size: number;
    }

    const particles: Particle[] = [];
    const count = Math.min(80, Math.max(25, Math.round(assumptions.incomingPerWeek * 3.5)));

    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      let tier: Particle["tier"] = "T3";
      if (rand < 0.2) tier = "T1";
      else if (rand < 0.55) tier = "T2";
      else if (rand < 0.85) tier = "T3";
      else tier = "SS";

      particles.push({
        x: 0,
        y: 0,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.003,
        tier,
        size: 2.2 + Math.random() * 1.8,
      });
    }

    // Add 8 return particles
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: 0,
        y: 0,
        progress: Math.random(),
        speed: 0.0025 + Math.random() * 0.002,
        tier: "RETURN",
        size: 2.5,
      });
    }

    const render = () => {
      t += 1;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Coordinates mapping to canvas width/height
      const sourceX = width * 0.06;
      const sourceY = height * 0.52;
      const g1X = width * 0.18;
      const g1Y = height * 0.52;

      // Pipe paths by Tier
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        let px = 0;
        let py = 0;
        let color = "#ffffff";

        if (p.tier === "RETURN") {
          // Arching backwards from Run (right) to G2/G3 (center-left)
          const rx1 = width * 0.94;
          const ry1 = height * 0.48;
          const rx2 = width * 0.35;
          const ry2 = height * 0.22;
          const controlY = height * 0.04;

          const prog = p.progress;
          // Quadratic Bezier
          px = (1 - prog) * (1 - prog) * rx1 + 2 * (1 - prog) * prog * (width * 0.65) + prog * prog * rx2;
          py = (1 - prog) * (1 - prog) * ry1 + 2 * (1 - prog) * prog * controlY + prog * prog * ry2;
          color = "#f59e0b"; // amber return particles
        } else if (p.progress < 0.2) {
          // Intake to G1
          const progNorm = p.progress / 0.2;
          px = sourceX + (g1X - sourceX) * progNorm;
          py = sourceY;
          color = "#34d399";
        } else {
          // G1 onwards split by tier
          const progNorm = (p.progress - 0.2) / 0.8;
          const destX = width * 0.94;
          const destY = height * 0.52;

          let targetBranchY = height * 0.52;
          if (p.tier === "T1") {
            targetBranchY = height * 0.2;
            color = flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981";
          } else if (p.tier === "T2") {
            targetBranchY = height * 0.38;
            color = flowCalculations.portfolioBoard.isBottleneck ? "#f59e0b" : "#38bdf8";
          } else if (p.tier === "T3") {
            targetBranchY = height * 0.66;
            color = "#fbbf24";
          } else {
            // Self-Serve
            targetBranchY = height * 0.84;
            color = "#c084fc";
          }

          // Cubic bezier curve path
          const cp1x = width * 0.32;
          const cp1y = targetBranchY;
          const cp2x = width * 0.72;
          const cp2y = targetBranchY;

          // Compute cubic Bezier
          const u = 1 - progNorm;
          const tt = progNorm * progNorm;
          const uu = u * u;
          const uuu = uu * u;
          const ttt = tt * progNorm;

          px = uuu * g1X + 3 * uu * progNorm * cp1x + 3 * u * tt * cp2x + ttt * destX;
          py = uuu * g1Y + 3 * uu * progNorm * cp1y + 3 * u * tt * cp2y + ttt * destY;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [assumptions, flowCalculations]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-gray-900">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#072417] via-[#093c1f] to-[#044c23] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-400 text-gray-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Activity className="w-3.5 h-3.5" />
              Tab 7 · Pipeline Flow & Bottleneck Simulator
            </span>
            <span className="text-xs bg-white/10 px-2.5 py-1 rounded-md text-emerald-300 font-mono border border-white/15">
              Live Comitology Flow Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Use Case Flow & Governance Bottleneck Simulator
          </h1>
          <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
            Simulate incoming project volumes, gate lead times, meeting review cadences, and
            returning run modifications to detect comitology bottlenecks before they stall enterprise scale.
          </p>
        </div>

        {/* SCENARIO SWITCHER BUTTONS */}
        <div className="bg-black/40 border border-white/20 p-2 rounded-2xl shrink-0 flex flex-col gap-2">
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider px-2 flex items-center justify-between">
            <span>Scenario Switcher:</span>
            <span className="text-[10px] text-white/60 font-mono">
              {PRESET_SCENARIOS[selectedScenario === "custom" ? "medium" : selectedScenario]?.badge}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl">
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
              <span className="text-[9px] bg-black/25 px-1 rounded text-white/90">19/wk</span>
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
              {Math.round(flowCalculations.netThroughputToBuildPerWeek * 10) / 10}{" "}
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
              {Math.round(flowCalculations.returningFromRunPerWeek * 10) / 10}{" "}
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
          SECTION 1: TOP PANEL — EDITABLE ASSUMPTIONS (WHITEBOARD SPECIFICATION)
      ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" />
              1. Top Panel — Live Editable Assumptions
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Adjust incoming use cases, acceptance filter, tier distribution, and committee review capacities in real-time.
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
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <span>Incoming Use Cases</span>
              </label>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-mono">
                {assumptions.incomingPerWeek} UC / week
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="0.5"
              value={assumptions.incomingPerWeek}
              onChange={(e) => updateAssumption("incomingPerWeek", Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>1 UC/wk (Slow)</span>
              <span>15 UC/wk</span>
              <span>35 UC/wk (Surge)</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-snug">
              Total volume of new ideas and problem charters submitted into Front Door intake.
            </p>
          </div>

          {/* 2. Acceptance Rate at G1 */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <span>Acceptance Rate (Gate G1)</span>
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
                <span>Tier Routing Split</span>
              </label>
              <span className="text-[10px] text-gray-500 font-mono">
                T1: {assumptions.t1Split}% · T2: {assumptions.t2Split}% · T3: {assumptions.t3Split}%
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-14 text-[10px] font-bold text-emerald-800">T1 ({assumptions.t1Split}%)</span>
                <input
                  type="range"
                  min="5"
                  max="50"
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
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <span>Run Modification Rate</span>
              </label>
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-mono">
                {assumptions.returnFromRunRate}% / year
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="2"
              value={assumptions.returnFromRunRate}
              onChange={(e) => updateAssumption("returnFromRunRate", Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>0% (None)</span>
              <span>12% (Typical)</span>
              <span>35% (High rework)</span>
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
                Gate Evaluation Durations (Days to assemble deliverables & receive sign-off)
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
                    <span className="text-gray-600">G3 Priority & VCP:</span>
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
                <div className="font-bold text-purple-900">Delivery & Scaling</div>
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
          SECTION 2: MAIN VIEW — THE FLOW SIMULATION (DARK FUTURISTIC FLUID VIEW)
          Inspired by media_1795187429447_71692d45.jpg and media_1795189797396_8ad84011.jpg
      ========================================================================= */}
      <div className="bg-[#080e1a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-800 text-white space-y-6 relative overflow-hidden">
        {/* Glow backdrop decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                Interactive Fluid Pipeline
              </span>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                2. Main View — Live Project Flow & Gating Nodes
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Particles represent live use cases moving through each gate node. Red pipes and warning badges indicate
              where review queues exceed 1 meeting cycle.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" /> Healthy Flow
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Bottleneck Alert
              </span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE FLOW CANVAS & SVG DIAGRAM */}
        <div className="relative w-full aspect-[16/7] min-h-[460px] rounded-2xl bg-[#050914] border border-gray-800/80 overflow-hidden shadow-inner flex items-center justify-center">
          {/* Animated Flow Particles Canvas */}
          <canvas
            ref={canvasRef}
            width={1200}
            height={520}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          />

          {/* SVG Pipe Backbone & Gating Nodes */}
          <svg
            viewBox="0 0 1200 520"
            className="w-full h-full absolute inset-0 select-none z-20"
          >
            <defs>
              {/* Gradients for pipes */}
              <linearGradient id="pipeT1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop
                  offset="50%"
                  stopColor={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
                />
                <stop
                  offset="100%"
                  stopColor={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
                />
              </linearGradient>

              <linearGradient id="pipeT2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop
                  offset="50%"
                  stopColor={flowCalculations.portfolioBoard.isBottleneck ? "#f59e0b" : "#38bdf8"}
                />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              <linearGradient id="pipeT3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>

              <linearGradient id="pipeSS" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>

              <linearGradient id="pipeReturn" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* --- PIPES / CONDUITS --- */}
            {/* 1. Source to G1 */}
            <path
              d="M 80 270 L 220 270"
              stroke="#10b981"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M 80 270 L 220 270"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="4 4"
            />

            {/* 2. G1 to T1 Branch (Upper Arch to SteerCo) */}
            <path
              d="M 220 270 C 340 100, 720 100, 940 270"
              stroke="url(#pipeT1)"
              strokeWidth={flowCalculations.steerCo.isBottleneck ? "16" : "12"}
              fill="none"
              opacity={flowCalculations.steerCo.isBottleneck ? "0.45" : "0.25"}
            />

            {/* 3. G1 to T2 Branch (Mid-Upper Arch) */}
            <path
              d="M 220 270 C 360 200, 700 200, 940 270"
              stroke="url(#pipeT2)"
              strokeWidth="10"
              fill="none"
              opacity="0.25"
            />

            {/* 4. G1 to T3 Branch (Mid-Lower Arch) */}
            <path
              d="M 220 270 C 360 340, 700 340, 940 270"
              stroke="url(#pipeT3)"
              strokeWidth="10"
              fill="none"
              opacity="0.25"
            />

            {/* 5. G1 to Self-Serve Branch (Lower Arch) */}
            <path
              d="M 220 270 C 340 440, 720 440, 940 270"
              stroke="url(#pipeSS)"
              strokeWidth="8"
              fill="none"
              opacity="0.2"
            />

            {/* 6. Return Pipe from Run to G2/G3 (Top Arc with dashed line) */}
            <path
              d="M 1120 250 C 780 20, 440 20, 390 110"
              stroke="url(#pipeReturn)"
              strokeWidth="3"
              strokeDasharray="6 6"
              fill="none"
            />

            {/* --- NODES & GATES --- */}

            {/* NODE 1: SOURCE (INCOMING USE CASES) */}
            <g transform="translate(70, 270)" className="cursor-pointer">
              <circle r="36" fill="#0f172a" stroke="#10b981" strokeWidth="3" />
              <circle r="42" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
              <text x="0" y="-8" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                SOURCE
              </text>
              <text x="0" y="10" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">
                {assumptions.incomingPerWeek}
              </text>
              <text x="0" y="22" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">
                UC / wk
              </text>
            </g>

            {/* NODE 2: GATE G1 (AI CHARTER AGENT INTAKE) */}
            <g transform="translate(220, 270)" className="cursor-pointer">
              <circle r="32" fill="#0f172a" stroke="#34d399" strokeWidth="3" />
              <text x="0" y="-6" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="900">
                GATE G1
              </text>
              <text x="0" y="8" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                Need Filter
              </text>
              <text x="0" y="20" textAnchor="middle" fill="#94a3b8" fontSize="8">
                {assumptions.acceptanceRateG1}% Pass
              </text>
            </g>

            {/* --- T1 NODES (CRITICAL TRANSFORM PATH) --- */}
            {/* T1 - Gate G2 (Feasibility & ADR) */}
            <g
              transform="translate(390, 110)"
              className="cursor-pointer"
              onClick={() => setSelectedGateDetail("G2_T1")}
            >
              <rect
                x="-42"
                y="-26"
                width="84"
                height="52"
                rx="12"
                fill="#0f172a"
                stroke={flowCalculations.dda.isBottleneck ? "#ef4444" : "#10b981"}
                strokeWidth="2.5"
              />
              <text x="0" y="-9" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">
                G2 · Feasibility
              </text>
              <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                ADR + Finance
              </text>
              <text x="0" y="17" textAnchor="middle" fill="#94a3b8" fontSize="8">
                DDA (Weekly)
              </text>
            </g>

            {/* T1 - Gate G3 (Priority & Hub 60% Capacity Pool) */}
            <g
              transform="translate(540, 100)"
              className="cursor-pointer"
              onClick={() => setSelectedGateDetail("G3_T1")}
            >
              <rect
                x="-46"
                y="-28"
                width="92"
                height="56"
                rx="12"
                fill="#0f172a"
                stroke={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
                strokeWidth={flowCalculations.steerCo.isBottleneck ? "3.5" : "2.5"}
              />
              {flowCalculations.steerCo.isBottleneck && (
                <circle cx="38" cy="-22" r="10" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              )}
              {flowCalculations.steerCo.isBottleneck && (
                <text x="38" y="-18" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="black">
                  !
                </text>
              )}
              <text x="0" y="-10" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">
                G3 · Priority
              </text>
              <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                60% Hub Pool
              </text>
              <text x="0" y="18" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">
                SteerCo (Monthly)
              </text>
            </g>

            {/* T1 - Gate G4 (Mode 1 & SteerCo Budget Approval) */}
            <g
              transform="translate(710, 115)"
              className="cursor-pointer"
              onClick={() => setSelectedGateDetail("G4_T1")}
            >
              <rect
                x="-44"
                y="-26"
                width="88"
                height="52"
                rx="12"
                fill="#0f172a"
                stroke={flowCalculations.steerCo.isBottleneck ? "#ef4444" : "#10b981"}
                strokeWidth="2.5"
              />
              <text x="0" y="-9" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">
                G4 · GO BUILD
              </text>
              <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                Mode 1 · Hub Build
              </text>
              <text x="0" y="17" textAnchor="middle" fill="#94a3b8" fontSize="8">
                SteerCo Unlock
              </text>
            </g>

            {/* --- T2 NODES (SCALE PATH) --- */}
            <g
              transform="translate(540, 200)"
              className="cursor-pointer"
              onClick={() => setSelectedGateDetail("G2_T2")}
            >
              <rect
                x="-44"
                y="-24"
                width="88"
                height="48"
                rx="12"
                fill="#0f172a"
                stroke={flowCalculations.portfolioBoard.isBottleneck ? "#f59e0b" : "#38bdf8"}
                strokeWidth="2"
              />
              <text x="0" y="-7" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                T2 · Scale (G2–G4)
              </text>
              <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                Mode 2 · Shared Squad
              </text>
              <text x="0" y="18" textAnchor="middle" fill="#94a3b8" fontSize="8">
                AI Portfolio Board (Fortnightly)
              </text>
            </g>

            {/* --- T3 NODES (FAST LANE PATH) --- */}
            <g
              transform="translate(540, 340)"
              className="cursor-pointer"
              onClick={() => setSelectedGateDetail("G3_T3")}
            >
              <rect
                x="-44"
                y="-24"
                width="88"
                height="48"
                rx="12"
                fill="#0f172a"
                stroke="#fbbf24"
                strokeWidth="2"
              />
              <text x="0" y="-7" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">
                T3 · Fast Lane
              </text>
              <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                1-Page Canvas
              </text>
              <text x="0" y="18" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">
                10-Day SLA · Agile Sprint
              </text>
            </g>

            {/* --- SELF-SERVE NODE (BYPASS) --- */}
            <g
              transform="translate(540, 440)"
              className="cursor-pointer"
              onClick={() => setSelectedGateDetail("SS")}
            >
              <rect
                x="-46"
                y="-22"
                width="92"
                height="44"
                rx="12"
                fill="#0f172a"
                stroke="#c084fc"
                strokeWidth="2"
              />
              <text x="0" y="-6" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="bold">
                Self-Service AI
              </text>
              <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="8.5">
                AI Registry Line &amp; Go
              </text>
              <text x="0" y="17" textAnchor="middle" fill="#94a3b8" fontSize="7.5">
                Instant (Skips G2–G4)
              </text>
            </g>

            {/* CONVERGENCE NODE: MVP BUILD */}
            <g transform="translate(940, 270)" className="cursor-pointer">
              <circle r="34" fill="#0f172a" stroke="#10b981" strokeWidth="3" />
              <text x="0" y="-7" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">
                MVP BUILD
              </text>
              <text x="0" y="8" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
                {Math.round(flowCalculations.netThroughputToBuildPerWeek * 10) / 10}
              </text>
              <text x="0" y="20" textAnchor="middle" fill="#94a3b8" fontSize="8">
                UC / wk in Build
              </text>
            </g>

            {/* NODE: RUN & ACTIVE POOL */}
            <g transform="translate(1110, 270)" className="cursor-pointer">
              <circle r="36" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
              <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                RUN (G6)
              </text>
              <text x="0" y="9" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">
                {assumptions.activeInRunCount}
              </text>
              <text x="0" y="22" textAnchor="middle" fill="#94a3b8" fontSize="8">
                Active in Run
              </text>
            </g>

            {/* LOOPBACK LABEL FOR RETURNING USE CASES */}
            <rect
              x="620"
              y="22"
              width="230"
              height="24"
              rx="6"
              fill="#0f172a"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <text x="735" y="38" textAnchor="middle" fill="#f59e0b" fontSize="9.5" fontWeight="bold">
              ↺ Major Modification Return ({assumptions.returnFromRunRate}% / {Math.round(flowCalculations.returningFromRunPerWeek * 4.33 * 10) / 10} UC/mo)
            </text>
          </svg>
        </div>

        {/* BOTTOM FLOW LEGEND */}
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
          SECTION 3: RISK SIGNALS & GOVERNANCE BOTTLENECK ANALYSIS
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
                  {flowCalculations.steerCo.waitingWeeks} weeks
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.steerCo.meetingDelays} cycles
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
                  {flowCalculations.portfolioBoard.waitingWeeks} weeks
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.portfolioBoard.meetingDelays} cycles
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
                  {flowCalculations.dda.waitingWeeks} weeks
                </td>
                <td className="py-3.5 px-3 font-mono font-bold">
                  {flowCalculations.dda.meetingDelays} cycles
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
