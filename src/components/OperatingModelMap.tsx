"use client";

import React, { useState } from "react";
import {
  Network,
  Layers,
  Sparkles,
  Bot,
  PlayCircle,
  Users,
  Building,
  Shield,
  Clock,
  Euro,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Bike,
  Workflow,
  Zap,
  Check,
  ChevronRight,
  FileText,
  TrendingUp,
  Award,
  HelpCircle,
  Cpu,
  UserCheck,
} from "lucide-react";
import { Tier, DeliveryMode, GateId } from "@/types";
import {
  TIER_CONFIG,
  DELIVERY_MODES_INFO,
  INITIAL_GATES,
  MODE_DEEP_DIVES,
  TIER_DEEP_DIVES,
} from "@/lib/constants";

interface OperatingModelMapProps {
  onNavigateToWizard?: () => void;
  onNavigateToLifecycle?: (gateId?: GateId) => void;
}

export const OperatingModelMap: React.FC<OperatingModelMapProps> = ({
  onNavigateToWizard,
  onNavigateToLifecycle,
}) => {
  // Interactive Filters / Active Focus
  const [selectedTier, setSelectedTier] = useState<Tier>("T1");
  const [selectedMode, setSelectedMode] = useState<DeliveryMode>("Mode 2");
  const [selectedGate, setSelectedGate] = useState<GateId>("G4");
  const [activeViewMode, setActiveViewMode] = useState<"interactiveMap" | "matrix" | "scenarioSimulator">("interactiveMap");

  const tierDeepDive = TIER_DEEP_DIVES[selectedTier];
  const modeDeepDive = MODE_DEEP_DIVES[selectedMode];
  const gateDetail = INITIAL_GATES[selectedGate];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-opella-forest">
              <Network className="w-5 h-5 text-opella-forest" />
            </span>
            <h2 className="text-xl font-bold text-opella-forest">
              Interactive Operating Model Architecture Map
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Tiers · Gates · Modes Spine
            </span>
          </div>
          <p className="text-xs text-gray-600 max-w-3xl">
            Explore how the 4 Governance Tiers (T1, T2, T3, Self-Serve), the 6 Lifecycle Gates (G1–G6), and the 4 Sourcing Delivery Modes (Mode 1, 2, 3, Self-Serve) interact across comitology committees, delivery squads, and the Butterfly transformation spine.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200 self-start md:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveViewMode("interactiveMap")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeViewMode === "interactiveMap"
                ? "bg-white text-opella-forest shadow-sm font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Interactive Flow Map
          </button>
          <button
            onClick={() => setActiveViewMode("scenarioSimulator")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeViewMode === "scenarioSimulator"
                ? "bg-white text-opella-forest shadow-sm font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Scenario & Squad Simulator
          </button>
          <button
            onClick={() => setActiveViewMode("matrix")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeViewMode === "matrix"
                ? "bg-white text-opella-forest shadow-sm font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Operating Model Matrix
          </button>
        </div>
      </div>

      {/* ================= VIEW 1: INTERACTIVE FLOW MAP ================= */}
      {activeViewMode === "interactiveMap" && (
        <div className="space-y-6">
          {/* Visual Interactive Map of the 4 Tiers & Their Paths Through Gates */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-opella-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-opella-forest uppercase tracking-wider flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-emerald-700" />
                  Butterfly Lifecycle Spine: Tiers & Speed Lanes Through Gates (G1–G6)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Click on any Tier lane or Gate node to inspect its specific decision rights, committees, and delivery squads.
                </p>
              </div>
              <span className="text-xs text-gray-400 font-mono">Slide 35 & 46 Interlock</span>
            </div>

            {/* The 4 Tier Flow Lanes */}
            <div className="space-y-4">
              {/* LANE 1: T1 TRANSFORM */}
              <div
                onClick={() => setSelectedTier("T1")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedTier === "T1"
                    ? "border-emerald-700 bg-emerald-50/70 shadow-md ring-2 ring-emerald-700/20"
                    : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-800 text-white shadow-sm">
                      T1 · Transform
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Enterprise Big Bets & Core Reshapes (&gt; €1M / Butterfly Scope)
                      </h4>
                      <p className="text-[11px] text-gray-600">
                        Oversight: <strong>Transformation SteerCo (Monthly)</strong> & <strong>Digital Design Authority</strong> · Dedicated Full Squad
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-white border border-emerald-300 text-emerald-900 font-semibold">
                      Modes: Mode 1 & Mode 2
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                      Tracking: Planisware
                    </span>
                  </div>
                </div>

                {/* Gates Sequence visualization */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-emerald-700 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G1</div>
                    <div className="truncate">Need Validation</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-700 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G2</div>
                    <div className="truncate">Feasibility & Finance</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-700 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G3</div>
                    <div className="truncate">SteerCo Prioritise</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-700 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G4</div>
                    <div className="truncate">GO BUILD (Mode Lock)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-800 text-white font-bold ring-2 ring-amber-400">
                    <div className="text-[10px] opacity-80 uppercase">Gate G5</div>
                    <div className="truncate">Scale Gate (SteerCo)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-700 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G6</div>
                    <div className="truncate">Run & Value Audit</div>
                  </div>
                </div>
              </div>

              {/* LANE 2: T2 SCALE */}
              <div
                onClick={() => setSelectedTier("T2")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedTier === "T2"
                    ? "border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-600/20"
                    : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black px-2.5 py-1 rounded-md bg-blue-600 text-white shadow-sm">
                      T2 · Scale
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Proven Pilots & Cross-Functional Scaling (€200k–€1M / 2+ Functions)
                      </h4>
                      <p className="text-[11px] text-gray-600">
                        Oversight: <strong>AI Portfolio Board (Fortnightly)</strong> & Stream Approvers · Shared Co-Delivery Squad
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-white border border-blue-300 text-blue-900 font-semibold">
                      Modes: Mode 2 & Mode 3
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                      Co-Funded Tranches
                    </span>
                  </div>
                </div>

                {/* Gates Sequence */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-blue-600 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G1</div>
                    <div className="truncate">Need Validation</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-600 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G2</div>
                    <div className="truncate">Light Feasibility</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-600 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G3</div>
                    <div className="truncate">Portfolio Slotting</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-600 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G4</div>
                    <div className="truncate">Tranche 1 Unlock</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-600 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G5</div>
                    <div className="truncate">Tranche 2 Scale</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-600 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G6</div>
                    <div className="truncate">Run Audit (+6M)</div>
                  </div>
                </div>
              </div>

              {/* LANE 3: T3 FAST LANE */}
              <div
                onClick={() => setSelectedTier("T3")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedTier === "T3"
                    ? "border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-600/20"
                    : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-600 text-white shadow-sm">
                      T3 · Fast Lane
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Agile Quick Wins & Value Hypothesis Sprints (&lt; €200k / Single Function)
                      </h4>
                      <p className="text-[11px] text-gray-600">
                        Oversight: <strong>AI Portfolio Board ONLY</strong> · 10-day decision SLA · 6–8 week fail-fast sprint
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-white border border-amber-300 text-amber-900 font-semibold">
                      Modes: Mode 3 & Mode 2
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                      1-Page Canvas
                    </span>
                  </div>
                </div>

                {/* Gates Sequence */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-amber-600 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G1</div>
                    <div className="truncate">Need Validation</div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-200 text-gray-400 font-medium line-through">
                    <div className="text-[10px] uppercase">Gate G2</div>
                    <div className="truncate">Light Fast-Track</div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-200 text-gray-400 font-medium line-through">
                    <div className="text-[10px] uppercase">Gate G3</div>
                    <div className="truncate">Auto Slotting</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-600 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G4 (10d SLA)</div>
                    <div className="truncate">GO SPRINT (Envelope)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-600 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G5 (End 8w)</div>
                    <div className="truncate">Scale or Kill</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-600 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G6</div>
                    <div className="truncate">Run Monitoring</div>
                  </div>
                </div>
              </div>

              {/* LANE 4: SELF-SERVE */}
              <div
                onClick={() => setSelectedTier("Self-Serve")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedTier === "Self-Serve"
                    ? "border-purple-600 bg-purple-50/70 shadow-md ring-2 ring-purple-600/20"
                    : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black px-2.5 py-1 rounded-md bg-purple-700 text-white shadow-sm">
                      Self-Serve · Register & Go
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Personal & Team Productivity Apps (&lt; €50k / Approved Tools / No Core Write-back)
                      </h4>
                      <p className="text-[11px] text-gray-600">
                        Oversight: <strong>Automated Screening Agent</strong> & Function Head Notification · 100% Citizen Builder
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-white border border-purple-300 text-purple-900 font-semibold">
                      Mode: Self-Service AI
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                      AI Registry Entry
                    </span>
                  </div>
                </div>

                {/* Gates Sequence */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-purple-700 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Gate G1</div>
                    <div className="truncate">Auto-Screening</div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-200 text-gray-400 font-medium line-through">
                    <div className="text-[10px] uppercase">Gate G2</div>
                    <div className="truncate">Skipped</div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-200 text-gray-400 font-medium line-through">
                    <div className="text-[10px] uppercase">Gate G3</div>
                    <div className="truncate">Skipped</div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-200 text-gray-400 font-medium line-through">
                    <div className="text-[10px] uppercase">Gate G4</div>
                    <div className="truncate">Skipped</div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-200 text-gray-400 font-medium line-through">
                    <div className="text-[10px] uppercase">Gate G5</div>
                    <div className="truncate">Skipped</div>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-700 text-white font-bold">
                    <div className="text-[10px] opacity-80 uppercase">Continuous</div>
                    <div className="truncate">Token Sentinel Caps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Dive Explorer on the Selected Tier (e.g. T1 Deep Dive) */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-opella-border space-y-6">
            <div className="border-b border-opella-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
                  Governance Deep Dive
                </span>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mt-0.5">
                  What It Means to be {tierDeepDive.name} ({tierDeepDive.subtitle})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {(["T1", "T2", "T3", "Self-Serve"] as Tier[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTier(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedTier === t
                        ? "bg-opella-forest text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Definition & Decision Callout */}
            <div className="bg-emerald-50/80 rounded-xl p-5 border border-emerald-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Strategic Mandate & Use Case Qualification
              </div>
              <p className="text-xs font-medium text-gray-800 leading-relaxed">
                {tierDeepDive.whatItMeans}
              </p>
              <div className="pt-2 border-t border-emerald-200/60 text-xs text-emerald-950">
                <strong>Decision for the Use Case:</strong> {tierDeepDive.decisionForUseCase}
              </div>
            </div>

            {/* The 3 Pillars of Tier Governance: Comitology, Resourcing, and Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Pillar 1: Committees & Comitology */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
                  <Building className="w-4 h-4 text-emerald-700" />
                  1. Committees & Comitology
                </div>
                <div className="text-xs text-gray-700 space-y-1.5">
                  <div className="font-semibold text-gray-900">
                    Primary Forum: <span className="text-emerald-800">{tierDeepDive.committeesAndComitology.primaryForum}</span>
                  </div>
                  <div className="text-gray-600">
                    Cadence: <strong>{tierDeepDive.committeesAndComitology.cadence}</strong>
                  </div>
                  <div className="text-gray-600">
                    Decision Rights: <em>{tierDeepDive.committeesAndComitology.decisionRights}</em>
                  </div>
                  <div className="pt-2 text-[11px] text-gray-500 space-y-1">
                    <strong>Governing Bodies Involved:</strong>
                    {tierDeepDive.committeesAndComitology.governingBodies.map((gb, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{gb}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pillar 2: Teams & Resourcing Disposition */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
                  <Users className="w-4 h-4 text-blue-700" />
                  2. Teams & Staffing Model
                </div>
                <div className="text-xs text-gray-700 space-y-2">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">Squad Model</span>
                    <span className="font-semibold text-gray-900">{tierDeepDive.teamsAndResourcing.squadModel}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">Data & AI Hub Allocation</span>
                    <span className="text-gray-800">{tierDeepDive.teamsAndResourcing.dataAndAiAllocation}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">Transformation Office</span>
                    <span className="text-gray-800">{tierDeepDive.teamsAndResourcing.toAllocation}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">Business Function Commitment</span>
                    <span className="text-gray-800 font-semibold">{tierDeepDive.teamsAndResourcing.businessFunctionCommitment}</span>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Delivery Cadence & Tracking */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
                  <TrendingUp className="w-4 h-4 text-purple-700" />
                  3. Delivery & Tracking Rigor
                </div>
                <div className="text-xs text-gray-700 space-y-2">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">Business Case Dossier</span>
                    <span className="text-gray-900 font-medium">{tierDeepDive.deliveryAndTracking.businessCaseDossier}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">Enterprise PMO Tracking</span>
                    <span className="font-semibold text-gray-900">{tierDeepDive.deliveryAndTracking.trackingTool}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">Funding Mechanism</span>
                    <span className="text-emerald-800">{tierDeepDive.deliveryAndTracking.fundingMechanism}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">Value Realization Audit</span>
                    <span className="text-gray-800">{tierDeepDive.deliveryAndTracking.valueRealizationAudit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: SCENARIO & SQUAD SIMULATOR ================= */}
      {activeViewMode === "scenarioSimulator" && (
        <div className="space-y-6">
          {/* Sourcing Mode Deep Dive: WHY Selected & 3-Way Team Disposition */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-opella-border space-y-6">
            <div className="border-b border-opella-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
                  Mode Zoom & Sourcing Architecture (Gate G4)
                </span>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mt-0.5">
                  {modeDeepDive.title} · <span className="italic font-serif text-emerald-800 text-lg font-normal">{modeDeepDive.motto}</span>
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {modeDeepDive.ownershipSplit}
                </p>
              </div>

              {/* Mode Selector Buttons */}
              <div className="flex items-center gap-2">
                {(["Mode 1", "Mode 2", "Mode 3", "Self-Service AI"] as DeliveryMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMode(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedMode === m
                        ? "bg-opella-forest text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {m === "Self-Service AI" ? "Self-Serve" : m}
                  </button>
                ))}
              </div>
            </div>

            {/* WHY This Mode Was Selected (Strategic Rationale) */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  WHY Was This Delivery Mode Selected? (Sourcing Decision Logic)
                </span>
                <span className="text-[11px] font-semibold text-gray-500">
                  Slide 10 & 46 Architecture Rule
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Technical Complexity</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">
                    {modeDeepDive.whySelected.technicalComplexityProfile}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Function Tech Capability</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">
                    {modeDeepDive.whySelected.functionTechCapabilityRequired}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Platform Fit</span>
                  <span className="font-semibold text-emerald-800 mt-0.5 block">
                    {modeDeepDive.whySelected.platformFit}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-xs text-gray-700">
                <div className="font-bold text-gray-900">Core Decision Drivers:</div>
                {modeDeepDive.whySelected.primaryDrivers.map((driver, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* THE TEAM AT THE DISPOSITION OF THE USE CASE (3-WAY STAKEHOLDER SPLIT) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-opella-border pb-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    Dedicated Squad at the Disposition of the Use Case
                  </h4>
                  <p className="text-xs text-gray-500">
                    Tri-partite team model: Staffing commitment across Data & AI Hub, Transformation Office, and Business Function.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                  {selectedMode} Delivery Roster
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. DATA & AI TEAM */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-blue-950 uppercase tracking-wider">
                      <Cpu className="w-4 h-4 text-blue-700" />
                      Data & AI Hub Team
                    </div>
                    <span className="text-[10px] bg-blue-700 text-white font-bold px-2 py-0.5 rounded-full">
                      Engineering
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {modeDeepDive.teamDisposition.dataAndAiTeam.map((member, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white border border-blue-100 text-xs shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{member.role}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                            {member.allocation}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-snug">
                          {member.responsibility}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. TRANSFORMATION OFFICE (TO) */}
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-purple-950 uppercase tracking-wider">
                      <Building className="w-4 h-4 text-purple-700" />
                      Transformation Office (TO)
                    </div>
                    <span className="text-[10px] bg-purple-700 text-white font-bold px-2 py-0.5 rounded-full">
                      Governance & Change
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {modeDeepDive.teamDisposition.transformationOffice.map((member, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white border border-purple-100 text-xs shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{member.role}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                            {member.allocation}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-snug">
                          {member.responsibility}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. BUSINESS FUNCTION */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950 uppercase tracking-wider">
                      <UserCheck className="w-4 h-4 text-emerald-700" />
                      Business Function Team
                    </div>
                    <span className="text-[10px] bg-emerald-800 text-white font-bold px-2 py-0.5 rounded-full">
                      Domain Ownership
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {modeDeepDive.teamDisposition.businessFunction.map((member, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white border border-emerald-100 text-xs shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{member.role}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {member.allocation}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-snug">
                          {member.responsibility}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: OPERATING MODEL MATRIX ================= */}
      {activeViewMode === "matrix" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border space-y-4">
          <div className="border-b border-opella-border pb-3">
            <h3 className="text-sm font-bold text-opella-forest uppercase tracking-wider">
              Comprehensive Cross-Reference Matrix: Tiers x Gates x Delivery Modes
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Comparison across scope thresholds, gate paths, resourcing, comitology, and tracking tools.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider font-bold text-[11px]">
                <tr>
                  <th className="p-3 border-b border-gray-200">Governance Tier</th>
                  <th className="p-3 border-b border-gray-200">Threshold & Scope</th>
                  <th className="p-3 border-b border-gray-200">Primary Delivery Modes</th>
                  <th className="p-3 border-b border-gray-200">Gate Sequence</th>
                  <th className="p-3 border-b border-gray-200">Governing Body</th>
                  <th className="p-3 border-b border-gray-200">Squad Resourcing</th>
                  <th className="p-3 border-b border-gray-200">Tracking Tool</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                <tr className="hover:bg-emerald-50/40">
                  <td className="p-3 font-bold text-emerald-900">
                    <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] mr-1.5">T1</span>
                    Transform
                  </td>
                  <td className="p-3">AmplifAI Big Bet, alters Butterfly core, &gt; €1M</td>
                  <td className="p-3 font-semibold text-emerald-800">Mode 1 & Mode 2</td>
                  <td className="p-3 font-mono text-[11px]">G1 → G2 → G3 → G4 → MVP → G5 → G6</td>
                  <td className="p-3 font-semibold">Transformation SteerCo (Monthly)</td>
                  <td className="p-3">Dedicated Squad (1.0 FDE + 0.5 Arch + 1.0 BO)</td>
                  <td className="p-3 font-mono">Planisware</td>
                </tr>
                <tr className="hover:bg-blue-50/40">
                  <td className="p-3 font-bold text-blue-900">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] mr-1.5">T2</span>
                    Scale
                  </td>
                  <td className="p-3">Proven pilot, €200k–€1M, 2+ functions, 500+ users</td>
                  <td className="p-3 font-semibold text-blue-800">Mode 2 & Mode 3</td>
                  <td className="p-3 font-mono text-[11px]">G1 → G2 → G3 → G4 → MVP → G5 → G6</td>
                  <td className="p-3 font-semibold">AI Portfolio Board (Fortnightly)</td>
                  <td className="p-3">Shared Squad (0.5 FDE + 0.5 BO + AI Builder)</td>
                  <td className="p-3 font-mono">Stream Tracker</td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="p-3 font-bold text-amber-900">
                    <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] mr-1.5">T3</span>
                    Fast Lane
                  </td>
                  <td className="p-3">New value hypothesis, &lt; €200k, 1 single function</td>
                  <td className="p-3 font-semibold text-amber-800">Mode 3 & Mode 2</td>
                  <td className="p-3 font-mono text-[11px]">G1 → G4 (10d) → 8w MVP → G5</td>
                  <td className="p-3 font-semibold">AI Portfolio Board (10-day SLA)</td>
                  <td className="p-3">Rapid Squad (Hub Coach + Certified Builder)</td>
                  <td className="p-3 font-mono">1-Page Canvas</td>
                </tr>
                <tr className="hover:bg-purple-50/40">
                  <td className="p-3 font-bold text-purple-900">
                    <span className="px-2 py-0.5 rounded bg-purple-700 text-white text-[10px] mr-1.5">Self-Serve</span>
                    Register & Go
                  </td>
                  <td className="p-3">Configured approved tools (Copilot, Opella GPT), &lt; €50k</td>
                  <td className="p-3 font-semibold text-purple-800">Self-Service AI</td>
                  <td className="p-3 font-mono text-[11px]">G1 (Auto) → Skips G2-G5 → Run</td>
                  <td className="p-3 font-semibold">Charter Agent (Instant)</td>
                  <td className="p-3">Citizen User / Builder alone</td>
                  <td className="p-3 font-mono">AI Registry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
