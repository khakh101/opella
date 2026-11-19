"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
  ChevronRight,
  TrendingUp,
  Building,
  UserCheck,
  Check,
  X,
  FileCheck,
  Bot,
  Zap,
  Cpu,
  Users,
} from "lucide-react";
import confetti from "canvas-confetti";
import { UseCase, GateId, GateStatus, GateDetail } from "@/types";
import { TIER_CONFIG, DELIVERY_MODES_INFO } from "@/lib/constants";
import { updateGateStatus } from "@/lib/storage";

interface LifecycleViewProps {
  useCases: UseCase[];
  selectedUseCaseId: string;
  onSelectUseCase: (id: string) => void;
  onUseCaseUpdated: (updated: UseCase) => void;
}

const GATE_ORDER: GateId[] = ["G1", "G2", "G3", "G4", "G5", "G6"];

export const LifecycleView: React.FC<LifecycleViewProps> = ({
  useCases,
  selectedUseCaseId,
  onSelectUseCase,
  onUseCaseUpdated,
}) => {
  const currentCase =
    useCases.find((u) => u.id === selectedUseCaseId) || useCases[0];

  const [activeGateTab, setActiveGateTab] = useState<GateId>(
    currentCase ? currentCase.currentGate : "G1"
  );
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isSimulatingAgent, setIsSimulatingAgent] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string | null>(null);

  if (!currentCase) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        No use cases found. Start by triaging an initiative using the Intake Wizard!
      </div>
    );
  }

  const tierCfg = TIER_CONFIG[currentCase.tier];
  const modeCfg = DELIVERY_MODES_INFO[currentCase.mode];
  const activeGate = currentCase.gates[activeGateTab] || currentCase.gates.G1;

  const handleUpdateStatus = async (newStatus: GateStatus) => {
    const updated = await updateGateStatus(
      currentCase.id,
      activeGateTab,
      newStatus,
      feedbackInput || undefined
    );
    if (updated) {
      onUseCaseUpdated(updated);
      setFeedbackInput("");

      if (newStatus === "PASSED") {
        if (activeGateTab === "G4" || activeGateTab === "G5") {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}
        }
        // Advance view to next gate
        const idx = GATE_ORDER.indexOf(activeGateTab);
        if (idx < GATE_ORDER.length - 1) {
          setActiveGateTab(GATE_ORDER[idx + 1]);
        }
      }
    }
  };

  const handleSimulateAgent = () => {
    setIsSimulatingAgent(true);
    setSimulationLog("Initiating OpellaGPT Charter Agent screening...");

    setTimeout(() => {
      setSimulationLog(
        "Agent Verification: Checking AI Registry for duplication... Clean. Validating VCP value drivers... Positive."
      );
    }, 700);

    setTimeout(() => {
      setSimulationLog(
        "ORAI Risk Screening: Evaluating EU AI Act compliance boundaries... Risk score calculated. Gate G1 criteria fulfilled."
      );
    }, 1400);

    setTimeout(async () => {
      setIsSimulatingAgent(false);
      setSimulationLog(null);
      await handleUpdateStatus("PASSED");
    }, 2200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Selector & Use Case Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-opella-border">
          {/* Initiative Picker */}
          <div className="flex-1">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-400 block mb-1">
              Active Initiative Under Review
            </span>
            <div className="flex items-center gap-3">
              <select
                value={currentCase.id}
                onChange={(e) => {
                  onSelectUseCase(e.target.value);
                  const target = useCases.find((u) => u.id === e.target.value);
                  if (target) setActiveGateTab(target.currentGate);
                }}
                className="text-base sm:text-lg font-bold text-opella-forest bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-opella-forest focus:outline-none max-w-md w-full"
              >
                {useCases.map((uc) => (
                  <option key={uc.id} value={uc.id}>
                    [{uc.tier}] {uc.title} ({uc.functionName})
                  </option>
                ))}
              </select>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${tierCfg.colorClass.badge}`}>
                {tierCfg.name}
              </span>
            </div>
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              {currentCase.mode}
            </span>
            <span
              className={`px-3 py-1.5 rounded-lg font-semibold border flex items-center gap-1.5 ${
                currentCase.riskTier === "High"
                  ? "bg-rose-50 text-rose-800 border-rose-300"
                  : currentCase.riskTier === "Medium"
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-emerald-50 text-emerald-800 border-emerald-300"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              {currentCase.riskTier} ORAI Risk
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 font-semibold border border-gray-200">
              Owner: {currentCase.owner}
            </span>
          </div>
        </div>

        {/* Overview Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-gray-400 block">Current Status</span>
            <span className="font-bold text-gray-900 text-sm">{currentCase.status}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Sponsor & Governance</span>
            <span className="font-bold text-gray-900 text-sm">{currentCase.sponsor}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Envelope / Budget</span>
            <span className="font-bold text-gray-900 text-sm">€{currentCase.budget.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Target Value / ROI</span>
            <span className="font-bold text-emerald-700 text-sm">{currentCase.roiEstimate}</span>
          </div>
        </div>
      </div>

      {/* Real-Time Chevron Stage Gates Pipeline (Slides 32 & 46) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-opella-forest flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" />
              Real-Time Use Case Stage Gates (G1 to G6)
            </h3>
            <p className="text-xs text-gray-500">
              Interactive governance spine with multi-dimensional review at every gate (Value, Complexity, Risk, Adoption).
            </p>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Passed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In Review
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300" /> Pending
            </span>
          </div>
        </div>

        {/* The 6 Gates Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {GATE_ORDER.map((gid) => {
            const gate = currentCase.gates[gid];
            const isSelected = activeGateTab === gid;
            const isPassed = gate.status === "PASSED";
            const isInReview = gate.status === "IN_REVIEW";
            const isSkipped = gate.status === "SKIPPED";
            const isFailed = gate.status === "FAILED";

            return (
              <button
                key={gid}
                onClick={() => setActiveGateTab(gid)}
                className={`relative p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-opella-forest bg-opella-forest text-white shadow-md ring-2 ring-opella-forest/20"
                    : isPassed
                    ? "border-emerald-300 bg-emerald-50/60 text-emerald-950 hover:bg-emerald-100/60"
                    : isInReview
                    ? "border-amber-400 bg-amber-50/60 text-amber-950 hover:bg-amber-100/60"
                    : isSkipped
                    ? "border-gray-200 bg-gray-50 text-gray-400 opacity-60"
                    : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-black px-1.5 py-0.5 rounded ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : isPassed
                        ? "bg-emerald-200 text-emerald-900"
                        : isInReview
                        ? "bg-amber-200 text-amber-900"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {gid}
                  </span>
                  {isPassed && <CheckCircle2 className={`w-4 h-4 ${isSelected ? "text-white" : "text-emerald-600"}`} />}
                  {isInReview && <Clock className={`w-4 h-4 ${isSelected ? "text-amber-300" : "text-amber-600"}`} />}
                  {isSkipped && <span className="text-[10px] uppercase font-bold">Skip</span>}
                  {isFailed && <X className="w-4 h-4 text-rose-500" />}
                </div>

                <div className="text-xs font-bold truncate">{gate.name.split("(")[0]}</div>
                <div className={`text-[10px] truncate ${isSelected ? "text-white/70" : "text-gray-500"}`}>
                  {gate.phase}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Gate Inspector & Action Center */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border space-y-6">
        {/* Gate Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-opella-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-opella-forest text-white">
                {activeGate.id}
              </span>
              <h3 className="text-xl font-bold text-opella-forest">{activeGate.name}</h3>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activeGate.status === "PASSED"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : activeGate.status === "IN_REVIEW"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : activeGate.status === "SKIPPED"
                    ? "bg-gray-100 text-gray-500"
                    : activeGate.status === "FAILED"
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {activeGate.status}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <strong>Core Gate Question:</strong> {activeGate.decision}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div>
              <span className="text-gray-400 block font-semibold">Forum / Approver</span>
              <span className="font-bold text-gray-800">{activeGate.forum}</span>
            </div>
            <div className="border-l border-gray-200 pl-3">
              <span className="text-gray-400 block font-semibold">Decision SLA</span>
              <span className="font-bold text-emerald-700">{activeGate.sla}</span>
            </div>
          </div>
        </div>

        {/* Multi-Dimensional Review Grid (Slide 45 & 79) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Multi-Dimensional Gate Review Criteria (Slide 79)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Value Driver */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Value (Finance BP)
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                {activeGate.multiDimensionalReview.value}
              </p>
            </div>

            {/* Complexity & Tech */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Cpu className="w-4 h-4 text-blue-600" />
                Complexity (Data & AI)
              </div>
              <p className="text-xs text-blue-950 leading-relaxed">
                {activeGate.multiDimensionalReview.complexity}
              </p>
            </div>

            {/* Risk (ORAI) */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Shield className="w-4 h-4 text-amber-600" />
                Risk (ORAI / LEX)
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {activeGate.multiDimensionalReview.risk}
              </p>
            </div>

            {/* Adoption */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                <Users className="w-4 h-4 text-purple-600" />
                Adoption (P&C / Change)
              </div>
              <p className="text-xs text-purple-950 leading-relaxed">
                {activeGate.multiDimensionalReview.adoption}
              </p>
            </div>
          </div>
        </div>

        {/* Simulation / Feedback Box */}
        {activeGate.feedback && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-700">
            <strong>Committee Reviewer Feedback:</strong> {activeGate.feedback}
          </div>
        )}

        {isSimulatingAgent && simulationLog && (
          <div className="p-4 bg-emerald-900 text-emerald-100 rounded-xl text-xs font-mono space-y-1 flex items-start gap-3">
            <Bot className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="font-bold text-white mb-1">Autonomous Charter Agent Processing...</div>
              <div>{simulationLog}</div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-opella-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex-1 max-w-md">
            <input
              type="text"
              placeholder="Add gate review notes or approval conditions..."
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opella-forest"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeGate.id === "G1" && activeGate.type === "AUTOMATIC" && (
              <button
                type="button"
                onClick={handleSimulateAgent}
                disabled={isSimulatingAgent}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg text-xs font-bold hover:bg-purple-800 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Bot className="w-4 h-4" />
                Simulate Charter Agent Pass
              </button>
            )}

            <button
              type="button"
              onClick={() => handleUpdateStatus("FAILED")}
              className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Re-scope / Block
            </button>

            <button
              type="button"
              onClick={() => handleUpdateStatus("PASSED")}
              className="px-5 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" /> Approve & Advance Gate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
