"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  Bot,
  Users,
  CheckCircle2,
  FileText,
  Workflow,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  Building2,
  Sliders,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Clock,
  Briefcase,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Check,
  X,
  Shuffle,
  Info,
  Scale,
} from "lucide-react";
import {
  FRAMING_USE_CASES,
  FramingExampleCase,
  ProcessReshapeData,
  PrioritizationScoring,
} from "@/lib/framingDeepDives";
import { Tier, DeliveryMode } from "@/types";

interface MiroBoardViewProps {
  onNavigateToWizard?: () => void;
  onNavigateToLifecycle?: () => void;
}

type DeepDiveTab =
  | "charter"
  | "agent_triage"
  | "business_case"
  | "process_reshape"
  | "prioritization"
  | "mode_squad";

export const MiroBoardView: React.FC<MiroBoardViewProps> = ({
  onNavigateToWizard,
  onNavigateToLifecycle,
}) => {
  // Active use case selection (3 archetypes)
  const [selectedCaseId, setSelectedCaseId] = useState<string>("UC-GIDE");
  const activeCase: FramingExampleCase =
    FRAMING_USE_CASES[selectedCaseId] || FRAMING_USE_CASES["UC-GIDE"];

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isGridVisible, setIsGridVisible] = useState<boolean>(true);

  // Inspector modal state
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [activeModalTab, setActiveModalTab] = useState<DeepDiveTab>("charter");

  const openInspector = (tab: DeepDiveTab) => {
    setActiveModalTab(tab);
    setIsInspectorOpen(true);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.65));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2eb] select-none">
      {/* ------------------------------------------------------------- */}
      {/* TOP BAR / MIRO CONTROL STRIP */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-[57px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Board Title & Stage Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#fff176] text-amber-950 flex items-center justify-center font-black text-sm shadow-inner border border-amber-300">
              Miro
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  Use Case Framing Board
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Phase I: Idea → GO BUILD
                  </span>
                </h2>
              </div>
              <p className="text-xs text-gray-500">
                Interactive whiteboard model · Double-click any sticky or card to inspect concrete deliverables
              </p>
            </div>
          </div>

          {/* 3 Archetype Switcher */}
          <div className="flex items-center gap-2 bg-[#f0eee6] p-1 rounded-xl border border-gray-300 overflow-x-auto">
            <span className="text-[11px] font-bold text-gray-500 px-2 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
              <Shuffle className="w-3 h-3 text-opella-forest" /> Example:
            </span>
            {[
              {
                id: "UC-GIDE",
                label: "UC-GIDE",
                tier: "T1 (Big Bet 6)",
                badge: "bg-emerald-600 text-white",
              },
              {
                id: "UC-IBP",
                label: "UC-IBP",
                tier: "T2 (Enterprise Scale)",
                badge: "bg-blue-600 text-white",
              },
              {
                id: "UC-WONKA",
                label: "UC-WONKA",
                tier: "T3 (Fast Lane)",
                badge: "bg-amber-600 text-white",
              },
            ].map((uc) => (
              <button
                key={uc.id}
                onClick={() => setSelectedCaseId(uc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  selectedCaseId === uc.id
                    ? "bg-white text-gray-900 shadow-sm border border-gray-300 ring-2 ring-opella-forest/20 font-bold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <span>{uc.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${uc.badge}`}>
                  {uc.tier}
                </span>
              </button>
            ))}
          </div>

          {/* Zoom and Canvas Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white rounded-lg border border-gray-300 p-0.5 shadow-sm">
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono font-medium text-gray-700 min-w-[44px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                title="Reset to 100%"
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 border-l border-gray-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setIsGridVisible(!isGridVisible)}
              title="Toggle Dot Grid"
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
                isGridVisible
                  ? "bg-white text-gray-800 border-gray-300 shadow-sm"
                  : "bg-gray-100 text-gray-500 border-gray-200"
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE USE CASE QUICK BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#e9e6dc] border-b border-gray-300 px-4 py-2 text-xs text-gray-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Selected Case:
            </span>
            <span className="font-semibold text-opella-forest">{activeCase.title}</span>
            <span className="text-gray-400">|</span>
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-gray-300">
              {activeCase.id}
            </span>
            <span className="text-gray-400">|</span>
            <span>{activeCase.functionName}</span>
            <span>({activeCase.region})</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-gray-500">Tier: </span>
              <span className="font-bold text-gray-900">{activeCase.tier}</span>
            </div>
            <div>
              <span className="text-gray-500">Mode: </span>
              <span className="font-bold text-gray-900">{activeCase.mode}</span>
            </div>
            <div>
              <span className="text-gray-500">Budget: </span>
              <span className="font-bold text-gray-900">€{activeCase.budget.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">ROI: </span>
              <span className="font-bold text-emerald-800">{activeCase.roiEstimate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* WHITEBOARD CANVAS CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <div
        className="flex-1 overflow-x-auto overflow-y-auto p-8 relative"
        style={{
          backgroundImage: isGridVisible
            ? "radial-gradient(#d5d1c4 1.5px, transparent 1.5px)"
            : "none",
          backgroundSize: "28px 28px",
          minHeight: "850px",
        }}
      >
        <div
          className="transition-transform duration-200 origin-top-left mx-auto pb-20"
          style={{
            transform: `scale(${zoomLevel})`,
            width: "1680px",
          }}
        >
          {/* Canvas Board Outer Miro Frame */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300 p-8 shadow-xl">
            {/* Miro Frame Header */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-opella-forest text-white text-xs font-bold rounded uppercase tracking-wider">
                  Frame 1
                </span>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  PHASE I: FRAMING & QUALIFICATION (G0 IDEA → G4 GO BUILD)
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  Automatic Agent Gate (G1)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                  Manual Human Gates (G2, G3, G4)
                </span>
                <span className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md border border-amber-200">
                  ⚡ Double-Click on any card to zoom
                </span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* HORIZONTAL WORKFLOW STATIONS WITH CONNECTORS */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-6 gap-6 relative">
              {/* ========================================================= */}
              {/* STATION 0: IDEA & BUSINESS NEED (V0) */}
              {/* ========================================================= */}
              <div className="col-span-1 flex flex-col gap-4">
                <div className="text-xs font-black uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px]">
                    0
                  </span>
                  Ideation (V0)
                </div>

                {/* Miro Sticky Note: Idea */}
                <div className="bg-[#fef9c3] border border-amber-300 rounded-xl p-4 shadow-md rotate-[-1deg] transition-transform hover:rotate-0 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-2 border-b border-amber-200/60 pb-1">
                    <span>💡 Business Idea</span>
                    <span className="text-[10px] bg-amber-200/70 px-1.5 py-0.5 rounded">
                      Initiator
                    </span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed italic">
                    "{activeCase.headlineSummary}"
                  </p>
                  <div className="mt-3 text-[10px] text-amber-800/80 font-bold flex items-center justify-between">
                    <span>By: {activeCase.businessOwner}</span>
                    <span>{activeCase.functionName}</span>
                  </div>
                </div>

                {/* Qualification Guidance Sticky */}
                <div className="bg-[#e0f2fe] border border-sky-300 rounded-xl p-4 shadow-sm text-sky-950 text-xs leading-relaxed">
                  <div className="font-bold text-[11px] text-sky-900 mb-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-sky-600" />
                    Enters Process If (Slide 34):
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-sky-800">
                    <li>Touches &gt; 1 person</li>
                    <li>Connects data or systems</li>
                    <li>Build cost or token spend</li>
                    <li>Has workforce implication</li>
                  </ul>
                </div>
              </div>

              {/* ========================================================= */}
              {/* STATION 1: PRELIMINARY PROJECT CHARTER */}
              {/* ========================================================= */}
              <div className="col-span-1 flex flex-col gap-4 relative">
                <div className="text-xs font-black uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Project Charter
                </div>

                {/* Charter Card */}
                <div
                  onDoubleClick={() => openInspector("charter")}
                  onClick={() => openInspector("charter")}
                  className="bg-white border-2 border-indigo-200 hover:border-indigo-500 rounded-2xl p-4 shadow-md transition-all hover:shadow-xl cursor-pointer group relative flex flex-col justify-between"
                  style={{ minHeight: "260px" }}
                >
                  <div className="absolute -top-2.5 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    DOUBLE-CLICK TO ZOOM
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-gray-900">
                        Preliminary Charter Form
                      </h4>
                    </div>

                    <div className="space-y-2 mt-3 text-[11px]">
                      <div className="bg-gray-50 p-2 rounded border border-gray-200">
                        <span className="font-bold text-gray-700 block text-[10px] uppercase">
                          Mandatory: Use Case Description
                        </span>
                        <p className="text-gray-600 line-clamp-2">
                          {activeCase.charter.descriptionMandatory}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-2 rounded border border-gray-200">
                        <span className="font-bold text-gray-700 block text-[10px] uppercase">
                          Mandatory: Users & Reach
                        </span>
                        <p className="text-gray-600 line-clamp-1">
                          {activeCase.charter.usersMandatory}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                        <span>4 Triage Questions:</span>
                        <span className="font-bold text-emerald-700">Answered ✓</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span>ORAI Risk Checks:</span>
                        <span className="font-bold text-emerald-700">5/5 Completed ✓</span>
                      </div>
                    </div>
                  </div>

                  <button className="mt-3 w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                    <Maximize2 className="w-3 h-3" /> Inspect Full Charter
                  </button>
                </div>

                {/* Subtext Tag */}
                <div className="text-[10px] text-center text-gray-500 italic">
                  Submitted by Business Owner + AI Catalyst
                </div>
              </div>

              {/* ========================================================= */}
              {/* STATION 2: GATE G1 NEED VALIDATION (AGENT) */}
              {/* ========================================================= */}
              <div className="col-span-1 flex flex-col gap-4 relative">
                <div className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  Gate G1: Need Validation
                </div>

                {/* Diamond / Agent Gate Node */}
                <div
                  onDoubleClick={() => openInspector("agent_triage")}
                  onClick={() => openInspector("agent_triage")}
                  className="bg-purple-50 border-2 border-purple-400 hover:border-purple-600 rounded-2xl p-4 shadow-md transition-all hover:shadow-xl cursor-pointer group relative flex flex-col justify-between"
                  style={{ minHeight: "260px" }}
                >
                  <div className="absolute -top-2.5 right-3 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Bot className="w-2.5 h-2.5" /> AGENT GATE
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                        G1
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-purple-950">
                          OpellaGPT Triage Agent
                        </h4>
                        <span className="text-[10px] text-purple-700">
                          SLA: 5 working days
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-purple-200 mt-2 text-[11px] space-y-1.5">
                      <div className="font-bold text-purple-900 flex items-center justify-between">
                        <span>Autonomous Verdict:</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
                          {activeCase.agentTriage.tierAssigned} Assigned
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600 leading-tight">
                        {activeCase.agentTriage.tierRationale}
                      </p>
                    </div>

                    <div className="mt-3 space-y-1 text-[10px]">
                      <div className="text-gray-500">4 Triage Branches:</div>
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            activeCase.tier === "T1"
                              ? "bg-emerald-600 text-white ring-1 ring-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          T1: Big Bets
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            activeCase.tier === "T2"
                              ? "bg-blue-600 text-white ring-1 ring-blue-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          T2: Scale
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            activeCase.tier === "T3"
                              ? "bg-amber-600 text-white ring-1 ring-amber-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          T3: Fast Lane
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="mt-3 w-full py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                    <Maximize2 className="w-3 h-3" /> Inspect Agent Log
                  </button>
                </div>

                <div className="text-[10px] text-center text-purple-800 font-medium">
                  Self-Service shortcut skips G2–G4 directly to Sandbox
                </div>
              </div>

              {/* ========================================================= */}
              {/* STATION 3: TIERED BUSINESS CASE (T1 vs T2 vs T3) */}
              {/* ========================================================= */}
              <div className="col-span-1 flex flex-col gap-4 relative">
                <div className="text-xs font-black uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px]">
                    3
                  </span>
                  Tiered Business Case
                </div>

                {/* Tiered Business Case Card */}
                <div
                  onDoubleClick={() => openInspector("business_case")}
                  onClick={() => openInspector("business_case")}
                  className={`border-2 rounded-2xl p-4 shadow-md transition-all hover:shadow-xl cursor-pointer group relative flex flex-col justify-between ${
                    activeCase.tier === "T1"
                      ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20"
                      : activeCase.tier === "T2"
                      ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20"
                      : "bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20"
                  }`}
                  style={{ minHeight: "260px" }}
                >
                  <div
                    className={`absolute -top-2.5 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                      activeCase.tier === "T1"
                        ? "bg-emerald-700"
                        : activeCase.tier === "T2"
                        ? "bg-blue-700"
                        : "bg-amber-700"
                    }`}
                  >
                    {activeCase.tier === "T1"
                      ? "FULL BC (6 SECTIONS)"
                      : activeCase.tier === "T2"
                      ? "LITE BC (5 SECTIONS)"
                      : "1-PAGE CANVAS"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3
                        className={`w-4 h-4 ${
                          activeCase.tier === "T1"
                            ? "text-emerald-700"
                            : activeCase.tier === "T2"
                            ? "text-blue-700"
                            : "text-amber-700"
                        }`}
                      />
                      <h4 className="text-xs font-bold text-gray-900">
                        {activeCase.tier === "T1"
                          ? "Strong Business Case"
                          : activeCase.tier === "T2"
                          ? "Light Business Case"
                          : "Agile 1-Page Canvas"}
                      </h4>
                    </div>

                    <div className="space-y-1.5 mt-2 text-[11px]">
                      {activeCase.tier === "T1" && (
                        <div className="space-y-1 text-emerald-950">
                          <div className="bg-white p-2 rounded border border-emerald-200">
                            <span className="font-bold text-[10px] block text-emerald-800 uppercase">
                              1. Recurring FY25–30 Items
                            </span>
                            <span className="text-[10px] text-gray-700">
                              €3.8M EBITDA · 42k hrs freed
                            </span>
                          </div>
                          <div className="bg-white p-1.5 rounded border border-emerald-200 text-[10px] text-gray-600 flex justify-between">
                            <span>SI / BI Non-Staff:</span>
                            <span className="font-bold text-emerald-800">Attached</span>
                          </div>
                          <div className="bg-white p-1.5 rounded border border-emerald-200 text-[10px] text-gray-600 flex justify-between">
                            <span>Comitology:</span>
                            <span className="font-bold text-emerald-800">
                              SteerCo Approval
                            </span>
                          </div>
                        </div>
                      )}

                      {activeCase.tier === "T2" && (
                        <div className="space-y-1 text-blue-950">
                          <div className="bg-white p-2 rounded border border-blue-200">
                            <span className="font-bold text-[10px] block text-blue-800 uppercase">
                              Directional Value Estimate
                            </span>
                            <span className="text-[10px] text-gray-700">
                              €1.8M inventory reduction
                            </span>
                          </div>
                          <div className="bg-white p-1.5 rounded border border-blue-200 text-[10px] text-gray-600 flex justify-between">
                            <span>Build Mode:</span>
                            <span className="font-bold text-blue-800">
                              Do it with me (60 days)
                            </span>
                          </div>
                          <div className="bg-white p-1.5 rounded border border-blue-200 text-[10px] text-gray-600 flex justify-between">
                            <span>Approval Body:</span>
                            <span className="font-bold text-blue-800">
                              AI Portfolio Board
                            </span>
                          </div>
                        </div>
                      )}

                      {activeCase.tier === "T3" && (
                        <div className="space-y-1 text-amber-950">
                          <div className="bg-white p-2 rounded border border-amber-200">
                            <span className="font-bold text-[10px] block text-amber-800 uppercase">
                              Fast Lane Hypothesis
                            </span>
                            <span className="text-[10px] text-gray-700">
                              60% cycle time reduction (&lt;4 days)
                            </span>
                          </div>
                          <div className="bg-white p-1.5 rounded border border-amber-200 text-[10px] text-gray-600 flex justify-between">
                            <span>Sprint Duration:</span>
                            <span className="font-bold text-amber-800">6–8 Weeks Fail-Fast</span>
                          </div>
                          <div className="bg-white p-1.5 rounded border border-amber-200 text-[10px] text-gray-600 flex justify-between">
                            <span>SLA Decision:</span>
                            <span className="font-bold text-amber-800">Strict 10 Days</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className={`mt-3 w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                      activeCase.tier === "T1"
                        ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-900"
                        : activeCase.tier === "T2"
                        ? "bg-blue-100 hover:bg-blue-200 text-blue-900"
                        : "bg-amber-100 hover:bg-amber-200 text-amber-900"
                    }`}
                  >
                    <Maximize2 className="w-3 h-3" /> Inspect Business Case
                  </button>
                </div>

                <div className="text-[10px] text-center text-gray-500">
                  {activeCase.tier === "T1"
                    ? "Butterfly Governance Spine (Slide 37)"
                    : activeCase.tier === "T2"
                    ? "Light Dossier at Scale Gate"
                    : "Agile Envelope Funding (<€200k)"}
                </div>
              </div>

              {/* ========================================================= */}
              {/* STATION 4: GATE G2 & PROCESS RESHAPE ZOOM */}
              {/* ========================================================= */}
              <div className="col-span-1 flex flex-col gap-4 relative">
                <div className="text-xs font-black uppercase tracking-wider text-pink-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-900 flex items-center justify-center text-[10px]">
                    4
                  </span>
                  Gate G2: Feasibility
                </div>

                {/* Gate G2 Card with Process Reshape */}
                <div
                  onDoubleClick={() => openInspector("process_reshape")}
                  onClick={() => openInspector("process_reshape")}
                  className="bg-pink-50 border-2 border-pink-400 hover:border-pink-600 rounded-2xl p-4 shadow-md transition-all hover:shadow-xl cursor-pointer group relative flex flex-col justify-between"
                  style={{ minHeight: "260px" }}
                >
                  <div className="absolute -top-2.5 right-3 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" /> HUMAN GATE
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center font-bold text-xs">
                        G2
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-pink-950">
                          Feasibility & Reshape
                        </h4>
                        <span className="text-[10px] text-pink-700">
                          Data & AI, Finance, OR.AI
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-pink-200 mt-2 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-500">Finance Baseline:</span>
                        <span className="font-bold text-emerald-700">Validated ✓</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-500">Data Readiness:</span>
                        <span className="font-bold text-emerald-700">ADR Approved ✓</span>
                      </div>

                      {/* Process Reshape Highlight */}
                      <div className="bg-amber-50 border border-amber-300 rounded p-1.5 text-[10px] mt-1">
                        <span className="font-bold text-amber-900 block flex items-center gap-1">
                          <Workflow className="w-3 h-3 text-amber-700" />
                          Process Reshape (Slide 47):
                        </span>
                        <span className="text-amber-800 font-semibold">
                          {activeCase.processReshape?.decisionAtG2 ||
                            "Standard Automation (No Reshape)"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-gray-500">
                      5-Pillar Workforce Scan:{" "}
                      <span className="font-bold text-gray-800">
                        {activeCase.tier === "T1" ? "Active (Slide 64)" : "Light Scan"}
                      </span>
                    </div>
                  </div>

                  <button className="mt-3 w-full py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                    <Maximize2 className="w-3 h-3" /> Zoom Process Reshape
                  </button>
                </div>

                <div className="text-[10px] text-center text-pink-800 font-medium">
                  Decided at G2, designed in build, confirmed at G5
                </div>
              </div>

              {/* ========================================================= */}
              {/* STATION 5: GATE G3 PRIORITIZATION & G4 MODE -> GO BUILD */}
              {/* ========================================================= */}
              <div className="col-span-1 flex flex-col gap-4 relative">
                <div className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center text-[10px]">
                    5
                  </span>
                  G3 Prio & G4 Mode
                </div>

                {/* Prioritization & G4 Combined Node */}
                <div
                  onDoubleClick={() => openInspector("prioritization")}
                  onClick={() => openInspector("prioritization")}
                  className="bg-emerald-50 border-2 border-emerald-400 hover:border-emerald-600 rounded-2xl p-4 shadow-md transition-all hover:shadow-xl cursor-pointer group relative flex flex-col justify-between"
                  style={{ minHeight: "260px" }}
                >
                  <div className="absolute -top-2.5 right-3 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <TrendingUp className="w-2.5 h-2.5" /> G3 & G4 GATES
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                        G3/4
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950">
                          Priority & Mode Lock
                        </h4>
                        <span className="text-[10px] text-emerald-700">
                          TO Lead & AI Portfolio Board
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200 mt-2 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-500">VCP Score (Slide 48):</span>
                        <span className="font-black text-emerald-800 text-xs">
                          {activeCase.prioritization.vcpScores.totalScore} / 100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{
                            width: `${activeCase.prioritization.vcpScores.totalScore}%`,
                          }}
                        ></div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        <span className="text-gray-500">Mode Selected:</span>
                        <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">
                          {activeCase.mode}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-500">Capacity Envelope:</span>
                        <span className="font-semibold text-emerald-900">
                          {activeCase.prioritization.capacityAllocation.bucket.split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    {/* GO BUILD Milestone Callout */}
                    <div className="mt-2 bg-emerald-600 text-white p-1.5 rounded-lg text-center font-bold text-[11px] shadow-sm flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" /> GO BUILD
                      VALIDATED
                    </div>
                  </div>

                  <button className="mt-3 w-full py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                    <Maximize2 className="w-3 h-3" /> Zoom Prioritization & Squad
                  </button>
                </div>

                <div className="text-[10px] text-center text-emerald-900 font-medium">
                  {activeCase.g4ModeAndSquad.trancheReleased.split(":")[0]}: Funds Released
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SVG CONNECTOR LINES & FLOW LABELS */}
            {/* ------------------------------------------------------------- */}
            <div className="mt-8 pt-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-opella-forest"></span>
                  <span>End-to-End Decision Chain:</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                  <span>V0 Idea</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span>Preliminary Charter</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-purple-700 font-bold">G1 Agent Triage</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-blue-700 font-bold">Tier Business Case</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-pink-700 font-bold">G2 Feasibility & Reshape</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-emerald-700 font-bold">G3 Prioritization & VCP</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-emerald-800 font-bold">G4 Mode Lock</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-black">
                    GO BUILD 🚀
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DOUBLE-CLICK DEEP DIVE MODAL / INSPECTOR DRAWER */}
      {/* ------------------------------------------------------------- */}
      {isInspectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-opella-forest text-white px-6 py-4 flex items-center justify-between border-b border-emerald-950">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-sm border border-white/20">
                  🔍
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Concrete Framing Deliverable Inspector
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      {activeCase.id} · {activeCase.tier}
                    </span>
                  </div>
                  <p className="text-xs text-white/70">
                    {activeCase.title} ({activeCase.functionName})
                  </p>
                </div>
              </div>

              {/* Case Switcher inside Modal */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white/10 rounded-lg p-1 border border-white/10 text-xs">
                  {Object.keys(FRAMING_USE_CASES).map((id) => (
                    <button
                      key={id}
                      onClick={() => setSelectedCaseId(id)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                        selectedCaseId === id
                          ? "bg-white text-opella-forest shadow font-bold"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {id}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsInspectorOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-gray-100 border-b border-gray-200 px-6 py-2 flex items-center gap-2 overflow-x-auto">
              {[
                {
                  id: "charter" as DeepDiveTab,
                  label: "1. Preliminary Charter",
                  icon: FileText,
                },
                {
                  id: "agent_triage" as DeepDiveTab,
                  label: "2. G1 Agent Triage",
                  icon: Bot,
                },
                {
                  id: "business_case" as DeepDiveTab,
                  label: `3. Business Case (${activeCase.tier})`,
                  icon: BarChart3,
                },
                {
                  id: "process_reshape" as DeepDiveTab,
                  label: "4. T1 Process Reshape (Slide 47 & 64)",
                  icon: Workflow,
                },
                {
                  id: "prioritization" as DeepDiveTab,
                  label: "5. Prioritization & Capacity (Slide 48)",
                  icon: TrendingUp,
                },
                {
                  id: "mode_squad" as DeepDiveTab,
                  label: "6. G4 Mode & Squad Disposition",
                  icon: Users,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeModalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveModalTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-white text-gray-900 shadow-sm border border-gray-300 font-bold text-opella-forest"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-opella-forest" : "text-gray-500"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
              {/* ========================================================= */}
              {/* TAB 1: PRELIMINARY PROJECT CHARTER */}
              {/* ========================================================= */}
              {activeModalTab === "charter" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Preliminary Project Charter Form (Slide 34–35)
                      </h4>
                      <p className="text-xs text-gray-500">
                        Front-door declaration capturing mandatory use case context and preliminary risk self-scan
                      </p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                      Validated by Charter Agent
                    </span>
                  </div>

                  {/* Header Meta Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
                    <div>
                      <span className="text-gray-500 block text-[11px]">Initiative Title</span>
                      <span className="font-bold text-gray-900">{activeCase.title}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[11px]">Business Function</span>
                      <span className="font-bold text-gray-900">{activeCase.functionName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[11px]">Business Owner (BO/PO)</span>
                      <span className="font-bold text-gray-900">{activeCase.businessOwner}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[11px]">AI Catalyst Relay</span>
                      <span className="font-bold text-gray-900">{activeCase.aiCatalyst}</span>
                    </div>
                  </div>

                  {/* Mandatory Fields */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Mandatory Intake Declarations
                    </h5>

                    <div className="bg-white border-2 border-indigo-100 rounded-xl p-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-gray-900">
                            Description of the Use Case
                          </label>
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            MANDATORY
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed font-sans">
                          {activeCase.charter.descriptionMandatory}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-gray-900">
                            Who are the Users & Scope
                          </label>
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            MANDATORY
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed">
                          {activeCase.charter.usersMandatory}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Optional Fields */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      Optional Context Declarations
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <label className="text-xs font-bold text-gray-900 block mb-1">
                          Estimated Value
                        </label>
                        <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed">
                          {activeCase.charter.estimatedValueOptional || "To be estimated in business case."}
                        </p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <label className="text-xs font-bold text-gray-900 block mb-1">
                          Proposed Technology Stack
                        </label>
                        <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed font-mono text-[11px]">
                          {activeCase.charter.technologyOptional || "Standard hub platform."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4 Triage Questions (Slide 35) */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-black uppercase tracking-wider text-gray-700">
                      The 4 Triage Questions (Slide 35)
                    </h5>

                    <div className="space-y-2 text-xs">
                      {[
                        {
                          q: "Q1 · Is it part of an AmplifAI big bet, does it change Butterfly core platforms or scope, or cost more than €1m?",
                          ans: activeCase.charter.q1_bigBetOrOver1m,
                          reason: activeCase.charter.q1_explanation,
                          route: "Routes to T1 · Transform",
                        },
                        {
                          q: "Q2 · Does it only use approved tools and data, configured rather than built, for under €50k?",
                          ans: activeCase.charter.q2_approvedToolsUnder50k,
                          reason: activeCase.charter.q2_explanation,
                          route: "Routes to Self-Serve AI",
                        },
                        {
                          q: "Q3 · Is value proven in a pilot, and does it need reach (2+ functions/regions, 500+ users), hub capacity or €200k–1m?",
                          ans: activeCase.charter.q3_provenPilotOrReach,
                          reason: activeCase.charter.q3_explanation,
                          route: "Routes to T2 · Scale",
                        },
                        {
                          q: "Q4 · Otherwise: a new idea or build with a value hypothesis to test?",
                          ans: activeCase.charter.q4_newHypothesis,
                          reason: activeCase.charter.q4_explanation,
                          route: "Routes to T3 · Fast Lane",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                            item.ans
                              ? "bg-emerald-50/80 border-emerald-300"
                              : "bg-gray-50 border-gray-200 opacity-80"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-gray-900">{item.q}</div>
                            <div className="text-[11px] text-gray-600 mt-1">{item.reason}</div>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-black shrink-0 ${
                              item.ans
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {item.ans ? "YES" : "NO"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5 ORAI Screening Checks */}
                  <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-purple-700" />
                        Preliminary ORAI (Responsible AI) Self-Scan
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                        EU AI Act Screening
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-100">
                        <span>Personal health or patient data?</span>
                        <span className="font-bold text-emerald-700">NO (Passed)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-100">
                        <span>Autonomous financial/business decisions?</span>
                        <span className="font-bold text-amber-700">
                          {activeCase.charter.oraiChecks.autonomousDecisions ? "YES (Guardrailed)" : "NO"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-100">
                        <span>Direct write-back to core ERP / SAP?</span>
                        <span className="font-bold text-amber-700">
                          {activeCase.charter.oraiChecks.coreProdWriteBack ? "YES (ADR Required)" : "NO"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-100">
                        <span>Outputs sent externally without human review?</span>
                        <span className="font-bold text-emerald-700">NO (Passed)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: GATE G1 AUTONOMOUS AGENT TRIAGE */}
              {/* ========================================================= */}
              {activeModalTab === "agent_triage" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Bot className="w-5 h-5 text-purple-600" />
                        Gate G1: OpellaGPT Autonomous Screening Log
                      </h4>
                      <p className="text-xs text-gray-500">
                        Agentic evaluation performed at intake before committing any human committee time
                      </p>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full border border-purple-300">
                      SLA: {activeCase.agentTriage.slaHours}
                    </span>
                  </div>

                  {/* Agent Execution Card */}
                  <div className="bg-gray-900 text-white p-4 rounded-2xl font-mono text-xs space-y-2 border border-gray-800 shadow-inner">
                    <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-2">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        AGENT_RUN_SUCCESSFUL
                      </span>
                      <span>Execution time: {activeCase.agentTriage.evaluationTimeMs}ms</span>
                    </div>
                    <div className="text-gray-300">
                      <span className="text-purple-400">Agent: </span>
                      {activeCase.agentTriage.modelUsed}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-purple-400">Target Use Case: </span>
                      {activeCase.id} - "{activeCase.title}"
                    </div>
                  </div>

                  {/* Automated Checks */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase tracking-wider text-gray-700">
                      Automated Pre-Gate Checks
                    </h5>
                    <div className="space-y-2 text-xs">
                      {activeCase.agentTriage.screeningChecksPassed.map((check, idx) => (
                        <div
                          key={idx}
                          className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2.5 text-emerald-950 font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{check}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Triage Decision Box */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                        Autonomous Triage Recommendation
                      </span>
                      <span className="px-3 py-1 bg-purple-700 text-white rounded-lg text-xs font-black">
                        Tier Assigned: {activeCase.agentTriage.tierAssigned}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {activeCase.agentTriage.tierRationale}
                    </p>

                    <div className="pt-2 border-t border-purple-200 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500 block text-[11px]">Assigned Approval Forum</span>
                        <span className="font-bold text-purple-950">
                          {activeCase.agentTriage.approvalForum}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[11px]">Comitology Pathway</span>
                        <span className="font-bold text-purple-950">
                          {activeCase.agentTriage.comitologyAssignment}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 3: TIERED BUSINESS CASE (T1 vs T2 vs T3) */}
              {/* ========================================================= */}
              {activeModalTab === "business_case" && (
                <div className="space-y-6">
                  {/* T1 FULL BUSINESS CASE (6 SECTIONS - SLIDE 38) */}
                  {activeCase.tier === "T1" && activeCase.businessCaseT1 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div>
                          <h4 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-emerald-700" />
                            Full Business Case · Tier 1 (Slide 37–38)
                          </h4>
                          <p className="text-xs text-gray-500">
                            Enterprise transformation dossier for Big Bets and Butterfly core scope
                          </p>
                        </div>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                          SteerCo Review Required
                        </span>
                      </div>

                      {/* 6 Formal Sections */}
                      <div className="space-y-4">
                        {/* Section 1: Recurring Items */}
                        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black uppercase text-emerald-900 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">
                                1
                              </span>
                              Recurring Items (FY25–30 Benefits & Run Costs)
                            </span>
                            <span className="text-[11px] font-bold text-emerald-800">
                              {activeCase.businessCaseT1.recurringItems.targetPnLLine}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                            <div>
                              <span className="text-gray-500 block text-[10px]">COGS / Gross Margin</span>
                              <span className="font-bold text-emerald-900">
                                {activeCase.businessCaseT1.recurringItems.grossMarginImpact}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">OpEx Impact</span>
                              <span className="font-bold text-emerald-900">
                                {activeCase.businessCaseT1.recurringItems.opexImpact}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">Working Capital</span>
                              <span className="font-bold text-emerald-900">
                                {activeCase.businessCaseT1.recurringItems.workingCapitalImpact}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">FTE Capacity Freed</span>
                              <span className="font-bold text-emerald-900">
                                {activeCase.businessCaseT1.recurringItems.fteImpact}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500 block text-[10px]">5-Year Summary</span>
                              <span className="font-bold text-emerald-950">
                                {activeCase.businessCaseT1.recurringItems.fy25_30BenefitsSummary}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: SI Non-Staff */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                          <span className="text-xs font-black uppercase text-gray-800 flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 rounded-full bg-gray-700 text-white flex items-center justify-center text-[10px]">
                              2
                            </span>
                            SI Non-Staff (Digital Enablers Across 4 Pillars)
                          </span>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                              <span className="font-bold text-gray-700 block text-[10px]">System</span>
                              <span className="text-gray-600 text-[11px]">
                                {activeCase.businessCaseT1.siNonStaff.systemEnablers}
                              </span>
                            </div>
                            <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                              <span className="font-bold text-gray-700 block text-[10px]">Infrastructure</span>
                              <span className="text-gray-600 text-[11px]">
                                {activeCase.businessCaseT1.siNonStaff.infrastructureEnablers}
                              </span>
                            </div>
                            <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                              <span className="font-bold text-gray-700 block text-[10px]">Cyber</span>
                              <span className="text-gray-600 text-[11px]">
                                {activeCase.businessCaseT1.siNonStaff.cyberEnablers}
                              </span>
                            </div>
                            <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                              <span className="font-bold text-gray-700 block text-[10px]">Data</span>
                              <span className="text-gray-600 text-[11px]">
                                {activeCase.businessCaseT1.siNonStaff.dataEnablers}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Section 3: Resource & People Costs */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                          <span className="text-xs font-black uppercase text-gray-800 flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 rounded-full bg-gray-700 text-white flex items-center justify-center text-[10px]">
                              3
                            </span>
                            Resource & People Costs (Named Internal & External)
                          </span>
                          <div className="space-y-2 text-xs">
                            <p className="text-gray-700">
                              <span className="font-bold">Named Internal Roles: </span>
                              {activeCase.businessCaseT1.resourcePeopleCosts.namedInternalRoles}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-bold">External Roles / Partners: </span>
                              {activeCase.businessCaseT1.resourcePeopleCosts.externalRoles}
                            </p>
                            <div className="flex items-center justify-between text-[11px] bg-gray-50 p-2 rounded border border-gray-200">
                              <span>Build Cost Estimate:</span>
                              <span className="font-bold text-gray-900">
                                {activeCase.businessCaseT1.resourcePeopleCosts.fullyLoadedCostEstimate}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Section 4: BI Non-Staff */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                          <span className="text-xs font-black uppercase text-gray-800 flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 rounded-full bg-gray-700 text-white flex items-center justify-center text-[10px]">
                              4
                            </span>
                            BI Non-Staff (Supplier Spend & Tokens)
                          </span>
                          <div className="flex items-center justify-between text-xs bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <div>
                              <span className="font-bold text-gray-900 block">
                                {activeCase.businessCaseT1.biNonStaff.supplierScope}
                              </span>
                              <span className="text-gray-500 text-[11px]">
                                RFP Status: {activeCase.businessCaseT1.biNonStaff.rfpStatus}
                              </span>
                            </div>
                            <span className="font-bold text-gray-900 text-sm">
                              {activeCase.businessCaseT1.biNonStaff.supplierSpendEstimate}
                            </span>
                          </div>
                        </div>

                        {/* Section 5: Project Plan, Risks & KPIs */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                          <span className="text-xs font-black uppercase text-gray-800 flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 rounded-full bg-gray-700 text-white flex items-center justify-center text-[10px]">
                              5
                            </span>
                            Project Plan, Risks & KPIs (Cadence every 4–6 weeks)
                          </span>
                          <div className="space-y-2 text-xs">
                            <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                              <span className="font-bold text-gray-700 block text-[10px]">Critical Milestones</span>
                              <span className="text-gray-600">
                                {activeCase.businessCaseT1.projectPlanMilestones.criticalPathMilestones}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                <span className="font-bold text-gray-700 block text-[10px]">Target KPIs</span>
                                <span className="text-emerald-800 font-semibold text-[11px]">
                                  {activeCase.businessCaseT1.projectPlanMilestones.kpisTarget}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                <span className="font-bold text-gray-700 block text-[10px]">Key Risk Mitigation</span>
                                <span className="text-gray-600 text-[11px]">
                                  {activeCase.businessCaseT1.projectPlanMilestones.keyRisks}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 6: BC Dashboard & Sign-Offs */}
                        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-sm">
                          <span className="text-xs font-black uppercase text-emerald-950 flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">
                              6
                            </span>
                            BC Dashboard & Executive Sign-Offs
                          </span>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
                            <div className="bg-white p-2 rounded border border-emerald-200">
                              <span className="text-gray-500 block text-[10px]">Finance Sign-Off</span>
                              <span className="font-bold text-emerald-700">✓ Signed</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-emerald-200">
                              <span className="text-gray-500 block text-[10px]">Digital Design Authority</span>
                              <span className="font-bold text-emerald-700">✓ Approved</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-emerald-200">
                              <span className="text-gray-500 block text-[10px]">Stream Lead</span>
                              <span className="font-bold text-emerald-700">✓ Approved</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-emerald-200">
                              <span className="text-gray-500 block text-[10px]">Control Tower</span>
                              <span className="font-bold text-emerald-700">✓ Passed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* T2 LITE BUSINESS CASE (5 SECTIONS - SLIDE 38) */}
                  {activeCase.tier === "T2" && activeCase.businessCaseT2 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div>
                          <h4 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-700" />
                            Light Business Case · Tier 2 (Slide 38)
                          </h4>
                          <p className="text-xs text-gray-500">
                            Streamlined 1–2 page dossier for enterprise scaling use cases
                          </p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full border border-blue-300">
                          AI Portfolio Board Advice
                        </span>
                      </div>

                      <div className="space-y-4 text-xs">
                        {/* 1. Problem Statement */}
                        <div className="bg-white border border-blue-200 rounded-2xl p-4">
                          <span className="font-bold text-blue-900 block mb-1">
                            1. Problem Statement & Directional Value
                          </span>
                          <p className="text-gray-700 bg-blue-50/50 p-3 rounded-lg border border-blue-100 leading-relaxed">
                            {activeCase.businessCaseT2.problemStatement}
                          </p>
                          <div className="mt-2 text-emerald-800 font-bold">
                            Directional Benefit: {activeCase.businessCaseT2.directionalValue}
                          </div>
                        </div>

                        {/* 2. Build Mode & Effort */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4">
                          <span className="font-bold text-gray-900 block mb-1">
                            2. Build Mode & Rough Effort / Token Sizing
                          </span>
                          <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <div>
                              <span className="text-gray-500 block text-[10px]">Delivery Mode</span>
                              <span className="font-bold text-gray-900">
                                {activeCase.businessCaseT2.buildMode}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">Estimated Builder Days</span>
                              <span className="font-bold text-gray-900">
                                {activeCase.businessCaseT2.estimatedBuilderDays} days
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">Token Envelope</span>
                              <span className="font-bold text-gray-900">
                                {activeCase.businessCaseT2.roughTokenConsumption}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Existing Data Fit */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4">
                          <span className="font-bold text-gray-900 block mb-1">
                            3. Existing Data & Platform Fit
                          </span>
                          <p className="text-gray-700">
                            {activeCase.businessCaseT2.existingDataFit.dataSourcesDetails}
                          </p>
                          <span className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                            Platform: {activeCase.businessCaseT2.existingDataFit.platformType}
                          </span>
                        </div>

                        {/* 4. Named Owner */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4">
                          <span className="font-bold text-gray-900 block mb-1">
                            4. Named Owner & Single-Step Triage
                          </span>
                          <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded border border-gray-200">
                            <div>
                              <span className="text-gray-500 block text-[10px]">Named Business Owner</span>
                              <span className="font-bold text-gray-900">
                                {activeCase.businessCaseT2.governance.namedBusinessOwner}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">Named AI Catalyst</span>
                              <span className="font-bold text-gray-900">
                                {activeCase.businessCaseT2.governance.namedAiCatalyst}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">Target Reach</span>
                              <span className="font-bold text-gray-900">
                                {activeCase.businessCaseT2.governance.targetUserCount} users
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 5. ORAI Screening */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4">
                          <span className="font-bold text-gray-900 block mb-1">
                            5. ORAI Risk Tier Screening
                          </span>
                          <p className="text-gray-700">
                            {activeCase.businessCaseT2.oraiScreeningConfirmation.mitigationsSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* T3 1-PAGE CANVAS (SLIDE 39) */}
                  {activeCase.tier === "T3" && activeCase.businessCaseT3 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div>
                          <h4 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-amber-700" />
                            1-Page Fast Lane Canvas · Tier 3 (Slide 39)
                          </h4>
                          <p className="text-xs text-gray-500">
                            Rapid fail-fast exploration with a 10-day decision SLA and 6–8 week sprints
                          </p>
                        </div>
                        <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full border border-amber-300">
                          10-Day SLA · &lt;€200k Envelope
                        </span>
                      </div>

                      {/* 1-Page Canvas Box */}
                      <div className="bg-amber-50/50 border-2 border-amber-300 rounded-3xl p-6 space-y-4 text-xs">
                        <div className="bg-white p-4 rounded-2xl border border-amber-200">
                          <span className="font-black text-amber-900 uppercase text-[10px] block mb-1">
                            Value Hypothesis
                          </span>
                          <p className="text-gray-800 leading-relaxed font-medium">
                            {activeCase.businessCaseT3.summaryAndHypothesis}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-white p-3 rounded-xl border border-amber-200">
                            <span className="font-bold text-gray-500 text-[10px] block">KPI 1</span>
                            <span className="font-bold text-amber-950 block mt-1">
                              {activeCase.businessCaseT3.kpi1}
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-amber-200">
                            <span className="font-bold text-gray-500 text-[10px] block">KPI 2</span>
                            <span className="font-bold text-amber-950 block mt-1">
                              {activeCase.businessCaseT3.kpi2}
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-amber-200">
                            <span className="font-bold text-gray-500 text-[10px] block">KPI 3</span>
                            <span className="font-bold text-amber-950 block mt-1">
                              {activeCase.businessCaseT3.kpi3}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-amber-200">
                          <div>
                            <span className="text-gray-500 block text-[10px]">Sprint Timeframe</span>
                            <span className="font-bold text-gray-900">
                              {activeCase.businessCaseT3.sprintDurationWeeks} Weeks
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[10px]">Kill / Scale Date</span>
                            <span className="font-bold text-red-700">
                              {activeCase.businessCaseT3.killOrScaleDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[10px]">Budget Envelope</span>
                            <span className="font-bold text-gray-900">
                              €{activeCase.businessCaseT3.budgetEnvelope.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[10px]">Delivery Mode</span>
                            <span className="font-bold text-gray-900">
                              {activeCase.businessCaseT3.deliveryMode}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950">
                          <span className="flex items-center gap-1.5 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Registry Reuse Check: Passed
                          </span>
                          <span className="text-emerald-800">
                            {activeCase.businessCaseT3.reusableComponentsIdentified}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 4: T1 PROCESS RESHAPE ZOOM (SLIDE 47 & 64) */}
              {/* ========================================================= */}
              {activeModalTab === "process_reshape" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Workflow className="w-5 h-5 text-amber-600" />
                        T1 Process Reshape & 5-Pillar HR Workforce Scan
                      </h4>
                      <p className="text-xs text-gray-500">
                        Reference: Operating Model Deck Slides 47 & 64 · Decided at G2, confirmed before HR impact
                      </p>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full border border-amber-300">
                      G2 Decision: {activeCase.processReshape?.decisionAtG2 || "Assessed at G2"}
                    </span>
                  </div>

                  {activeCase.processReshape ? (
                    <div className="space-y-6">
                      {/* The 4 Stages of Process Redesign (Slide 47) */}
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        <h5 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-3">
                          The 4 Stages of Process Redesign (Slide 47)
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                          <div className="bg-white p-3 rounded-xl border border-gray-200">
                            <span className="font-bold text-gray-900 block text-[11px] mb-1">
                              1 · Spot It
                            </span>
                            <p className="text-gray-600 text-[11px]">
                              {activeCase.processReshape.fourStages.spotIt}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-xl border-2 border-amber-300 bg-amber-50/30">
                            <span className="font-bold text-amber-900 block text-[11px] mb-1">
                              2 · Decide at G2
                            </span>
                            <p className="text-gray-600 text-[11px]">
                              {activeCase.processReshape.fourStages.decideAtG2}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-gray-200">
                            <span className="font-bold text-gray-900 block text-[11px] mb-1">
                              3 · Design It
                            </span>
                            <p className="text-gray-600 text-[11px]">
                              {activeCase.processReshape.fourStages.designIt}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-gray-200">
                            <span className="font-bold text-gray-900 block text-[11px] mb-1">
                              4 · Confirm & Embed
                            </span>
                            <p className="text-gray-600 text-[11px]">
                              {activeCase.processReshape.fourStages.confirmAndEmbed}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* As-Is vs To-Be Process Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* As-Is Flow */}
                        <div className="border border-red-200 bg-red-50/30 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-red-200 pb-2">
                            <span className="text-xs font-black uppercase text-red-900">
                              As-Is Manual Process
                            </span>
                            <span className="text-[11px] font-bold text-red-700">
                              {activeCase.processReshape.asIsProcess.hopsCount} Approval Hops
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-white p-2 rounded border border-red-200">
                              <span className="text-gray-500 block text-[10px]">Lead Time</span>
                              <span className="font-bold text-red-800">
                                {activeCase.processReshape.asIsProcess.leadTime}
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded border border-red-200">
                              <span className="text-gray-500 block text-[10px]">Touchless Rate</span>
                              <span className="font-bold text-red-800">
                                {activeCase.processReshape.asIsProcess.touchlessRate}
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded border border-red-200">
                              <span className="text-gray-500 block text-[10px]">Cost / PO</span>
                              <span className="font-bold text-red-800">
                                {activeCase.processReshape.asIsProcess.costPerTransaction}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-2">
                            <span className="text-[10px] font-bold text-red-900 uppercase block">
                              Sequential Hops:
                            </span>
                            {activeCase.processReshape.asIsProcess.steps.map((st) => (
                              <div
                                key={st.stepNumber}
                                className="bg-white p-2 rounded-lg border border-red-100 text-[11px] flex items-center justify-between"
                              >
                                <div>
                                  <span className="font-bold text-gray-900 mr-2">
                                    {st.stepNumber}. {st.name}
                                  </span>
                                  <span className="text-gray-500 text-[10px]">
                                    ({st.actor})
                                  </span>
                                </div>
                                <span className="text-[10px] text-red-700 font-mono font-semibold">
                                  {st.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* To-Be Agentic Flow */}
                        <div className="border border-emerald-300 bg-emerald-50/40 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                            <span className="text-xs font-black uppercase text-emerald-950">
                              To-Be Agentic Process
                            </span>
                            <span className="text-[11px] font-bold text-emerald-800">
                              {activeCase.processReshape.toBeProcess.hopsCount} Hops (4 Hops Cut!)
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-white p-2 rounded border border-emerald-200">
                              <span className="text-gray-500 block text-[10px]">Lead Time</span>
                              <span className="font-bold text-emerald-800">
                                {activeCase.processReshape.toBeProcess.leadTime}
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded border border-emerald-200">
                              <span className="text-gray-500 block text-[10px]">Touchless Rate</span>
                              <span className="font-bold text-emerald-800">
                                {activeCase.processReshape.toBeProcess.touchlessRate}
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded border border-emerald-200">
                              <span className="text-gray-500 block text-[10px]">Cost / PO</span>
                              <span className="font-bold text-emerald-800">
                                {activeCase.processReshape.toBeProcess.costPerTransaction}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-2">
                            <span className="text-[10px] font-bold text-emerald-950 uppercase block">
                              Automated Agentic Steps:
                            </span>
                            {activeCase.processReshape.toBeProcess.steps.map((st) => (
                              <div
                                key={st.stepNumber}
                                className="bg-white p-2 rounded-lg border border-emerald-200 text-[11px] flex items-center justify-between"
                              >
                                <div>
                                  <span className="font-bold text-gray-900 mr-2">
                                    {st.stepNumber}. {st.name}
                                  </span>
                                  <span className="text-emerald-800 text-[10px]">
                                    ({st.actor})
                                  </span>
                                </div>
                                <span className="text-[10px] text-emerald-800 font-mono font-semibold">
                                  {st.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 5-Pillar HR Workforce Impact Scan (Slide 64) */}
                      <div className="space-y-3 pt-2">
                        <h5 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          5 Pillars of Impact Assessed on Every Use Case (Slide 64)
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                          {Object.values(activeCase.processReshape.fivePillarWorkforceScan).map(
                            (pillar, idx) => (
                              <div
                                key={idx}
                                className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between"
                              >
                                <div>
                                  <span className="font-bold text-gray-900 block text-[11px] mb-2 border-b border-gray-100 pb-1">
                                    {pillar.title}
                                  </span>
                                  <div className="space-y-2 text-[10px] text-gray-600">
                                    <div>
                                      <span className="font-bold text-gray-800 block">Core Impact:</span>
                                      <span>
                                        {"volumeAndAutomation" in pillar
                                          ? pillar.volumeAndAutomation
                                          : "scopeAndAutonomy" in pillar
                                          ? pillar.scopeAndAutonomy
                                          : "targetSkills" in pillar
                                          ? pillar.targetSkills
                                          : "workloadAndStrain" in pillar
                                          ? pillar.workloadAndStrain
                                          : pillar.employeeBodiesDialogue}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 pt-2 border-t border-gray-100 bg-emerald-50/60 p-2 rounded text-[10px] text-emerald-950 font-medium">
                                  <span className="font-bold block text-emerald-800">
                                    {activeCase.id} Concrete:
                                  </span>
                                  {pillar.useCaseExample}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
                      <p className="text-xs text-gray-600">
                        Process reshape is primarily triggered for Tier 1 enterprise initiatives altering
                        Butterfly core operations. Switch to <span className="font-bold text-opella-forest">UC-GIDE</span> to see full process reshape analysis.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 5: PRIORITIZATION WORK & CAPACITY PLAN (SLIDE 48) */}
              {/* ========================================================= */}
              {activeModalTab === "prioritization" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-700" />
                        Prioritization & Capacity Allocation (Slide 48 & 37)
                      </h4>
                      <p className="text-xs text-gray-500">
                        First draft scoring framework: Value Pool (VCP) composite score against quarterly Hub capacity
                      </p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                      VCP Score: {activeCase.prioritization.vcpScores.totalScore} / 100
                    </span>
                  </div>

                  {/* 1. Value Pool (VCP) Breakdown (Slide 48) */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <h5 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center justify-between">
                      <span>1 · Prioritise by Value Pool (VCP) Scoring</span>
                      <span className="text-[11px] text-gray-500 font-normal">
                        Big Bets first, then one composite score
                      </span>
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                      {/* Value: 30% */}
                      <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-emerald-950">Value (30%)</span>
                          <span className="font-black text-emerald-800">
                            {activeCase.prioritization.vcpScores.valueScore}/30
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mb-2">
                          EBITDA, cash, hours freed
                        </span>
                        <p className="text-[11px] text-gray-700">
                          {activeCase.prioritization.vcpScores.valueNotes}
                        </p>
                      </div>

                      {/* Strategic Fit: 20% */}
                      <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-blue-950">Strategic Fit (20%)</span>
                          <span className="font-black text-blue-800">
                            {activeCase.prioritization.vcpScores.strategicFitScore}/20
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mb-2">
                          Big bet or VCP link
                        </span>
                        <p className="text-[11px] text-gray-700">
                          {activeCase.prioritization.vcpScores.strategicFitNotes}
                        </p>
                      </div>

                      {/* Reach & Reuse: 20% */}
                      <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-purple-950">Reach & Reuse (20%)</span>
                          <span className="font-black text-purple-800">
                            {activeCase.prioritization.vcpScores.reachAndReuseScore}/20
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mb-2">
                          Users, regions, parts
                        </span>
                        <p className="text-[11px] text-gray-700">
                          {activeCase.prioritization.vcpScores.reachAndReuseNotes}
                        </p>
                      </div>

                      {/* Feasibility: 20% */}
                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-amber-950">Feasibility (20%)</span>
                          <span className="font-black text-amber-800">
                            {activeCase.prioritization.vcpScores.feasibilityScore}/20
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mb-2">
                          Data, tech, named owner
                        </span>
                        <p className="text-[11px] text-gray-700">
                          {activeCase.prioritization.vcpScores.feasibilityNotes}
                        </p>
                      </div>

                      {/* Risk & Effort: 10% */}
                      <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-rose-950">Risk & Effort (10%)</span>
                          <span className="font-black text-rose-800">
                            {activeCase.prioritization.vcpScores.riskAndEffortScore}/10
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mb-2">
                          Scored inversely
                        </span>
                        <p className="text-[11px] text-gray-700">
                          {activeCase.prioritization.vcpScores.riskAndEffortNotes}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-[11px] text-gray-600 flex items-center justify-between">
                      <span>
                        Rule: Above cut-off & needs hub support = <strong className="text-gray-900">Enterprise Priority</strong>. Below cut-off = Stays with function (Enable me).
                      </span>
                      <span className="font-bold text-emerald-800">
                        Status: Cut-off Exceeded ✓
                      </span>
                    </div>
                  </div>

                  {/* 2. Match to Capacity (Quarterly Plan) */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <h5 className="text-xs font-black uppercase tracking-wider text-gray-800">
                      2 · Match to Capacity (Slide 48)
                    </h5>

                    {/* Capacity Envelope Bars */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Quarterly Hub Engineering Split:</span>
                        <span className="text-gray-500 font-normal">Illustrative allocation</span>
                      </div>
                      <div className="w-full flex h-6 rounded-xl overflow-hidden text-[10px] font-bold text-white shadow-inner">
                        <div
                          className="bg-emerald-700 flex items-center justify-center"
                          style={{ width: "60%" }}
                        >
                          60% Big Bets (T1/T2)
                        </div>
                        <div
                          className="bg-amber-600 flex items-center justify-center"
                          style={{ width: "25%" }}
                        >
                          25% Fast Lane / Outside Bets
                        </div>
                        <div
                          className="bg-sky-600 flex items-center justify-center"
                          style={{ width: "15%" }}
                        >
                          15% Self-Serve
                        </div>
                      </div>
                    </div>

                    {/* Ranked Queue Position */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                      <div>
                        <span className="text-gray-500 block text-[10px]">Capacity Bucket</span>
                        <span className="font-bold text-gray-900">
                          {activeCase.prioritization.capacityAllocation.bucket}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">Backlog Rank</span>
                        <span className="font-black text-emerald-800">
                          Rank #{activeCase.prioritization.capacityAllocation.queuePosition} of{" "}
                          {activeCase.prioritization.capacityAllocation.totalInQueue}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">Slot Allocation</span>
                        <span className="font-bold text-emerald-700">
                          {activeCase.prioritization.capacityAllocation.slotReleaseDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 6: G4 MODE & TRI-PARTITE SQUAD DISPOSITION */}
              {/* ========================================================= */}
              {activeModalTab === "mode_squad" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        Gate G4: Delivery Mode Lock & Tri-Partite Squad
                      </h4>
                      <p className="text-xs text-gray-500">
                        Reference: Slides 10, 11, 14 & 46 · The mode is chosen use case by use case from complexity, budget & capacity
                      </p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                      Mode Lock: {activeCase.mode}
                    </span>
                  </div>

                  {/* Mode Card */}
                  <div className="bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black uppercase text-indigo-900">
                          Delivery Mode
                        </span>
                        <h5 className="text-base font-bold text-indigo-950">
                          {activeCase.mode}: "{activeCase.g4ModeAndSquad.motto}"
                        </h5>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-indigo-700 text-white text-xs font-bold">
                        {activeCase.g4ModeAndSquad.goBuildVerdict}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-indigo-100">
                      <strong>Why Selected: </strong>
                      {activeCase.g4ModeAndSquad.whySelected}
                    </p>

                    <div className="text-xs text-indigo-900 font-bold pt-1">
                      {activeCase.g4ModeAndSquad.trancheReleased}
                    </div>
                  </div>

                  {/* Tri-Partite Squad Allocation (Slide 14) */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-black uppercase tracking-wider text-gray-700">
                      Tri-Partite Squad Allocation (Slide 14)
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* 1. Business Function */}
                      <div className="bg-white border-2 border-purple-200 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
                          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                          <span className="font-bold text-purple-900">
                            1. Business Function
                          </span>
                        </div>
                        <div className="space-y-2">
                          {activeCase.g4ModeAndSquad.functionSquad.map((member, idx) => (
                            <div
                              key={idx}
                              className="bg-purple-50/50 p-2 rounded-lg border border-purple-100"
                            >
                              <div className="font-bold text-gray-900">{member.role}</div>
                              <div className="text-[11px] text-purple-900 flex justify-between">
                                <span>{member.name}</span>
                                <span className="font-semibold text-[10px]">
                                  {member.dedication}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. Transformation Office */}
                      <div className="bg-white border-2 border-orange-200 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 border-b border-orange-100 pb-2">
                          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                          <span className="font-bold text-orange-900">
                            2. Transformation Office
                          </span>
                        </div>
                        <div className="space-y-2">
                          {activeCase.g4ModeAndSquad.transformationOfficeSquad.map(
                            (member, idx) => (
                              <div
                                key={idx}
                                className="bg-orange-50/50 p-2 rounded-lg border border-orange-100"
                              >
                                <div className="font-bold text-gray-900">{member.role}</div>
                                <div className="text-[11px] text-orange-900 flex justify-between">
                                  <span>{member.name}</span>
                                  <span className="font-semibold text-[10px]">
                                    {member.dedication}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* 3. Data & AI Hub */}
                      <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                          <span className="font-bold text-emerald-950">
                            3. Data & AI Hub
                          </span>
                        </div>
                        <div className="space-y-2">
                          {activeCase.g4ModeAndSquad.hubDataAndAiSquad.map((member, idx) => (
                            <div
                              key={idx}
                              className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100"
                            >
                              <div className="font-bold text-gray-900">{member.role}</div>
                              <div className="text-[11px] text-emerald-950 flex justify-between">
                                <span>{member.name}</span>
                                <span className="font-semibold text-[10px]">
                                  {member.dedication}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-100 px-6 py-3.5 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span>
                Tip: You can navigate between the 6 framing stations using the tabs above.
              </span>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
