"use client";

import React, { useState } from "react";
import {
  Layers,
  Search,
  Filter,
  ArrowUpRight,
  Shield,
  Zap,
  TrendingUp,
  PieChart,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Trash2,
} from "lucide-react";
import { UseCase, Tier, DeliveryMode, GateId } from "@/types";
import { TIER_CONFIG } from "@/lib/constants";

interface PortfolioViewProps {
  useCases: UseCase[];
  onSelectUseCase: (id: string) => void;
  onDeleteUseCase?: (id: string) => void;
  onNavigateToWizard: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  useCases,
  onSelectUseCase,
  onDeleteUseCase,
  onNavigateToWizard,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [selectedMode, setSelectedMode] = useState<string>("ALL");
  const [selectedGate, setSelectedGate] = useState<string>("ALL");

  // Filtering
  const filteredCases = useCases.filter((uc) => {
    const matchesSearch =
      uc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uc.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uc.functionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uc.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = selectedTier === "ALL" || uc.tier === selectedTier;
    const matchesMode = selectedMode === "ALL" || uc.mode === selectedMode;
    const matchesGate = selectedGate === "ALL" || uc.currentGate === selectedGate;

    return matchesSearch && matchesTier && matchesMode && matchesGate;
  });

  // Calculate Capacity Allocation Split (Slide 48)
  const bigBetsAndT1 = useCases.filter((u) => u.tier === "T1").length;
  const fastLaneAndT2 = useCases.filter((u) => u.tier === "T2" || u.tier === "T3").length;
  const selfServe = useCases.filter((u) => u.tier === "Self-Serve").length;
  const total = useCases.length || 1;

  const bigBetPct = Math.round((bigBetsAndT1 / total) * 100);
  const fastLanePct = Math.round((fastLaneAndT2 / total) * 100);
  const selfServePct = Math.round((selfServe / total) * 100);

  return (
    <div className="w-full max-w-[1600px] 2xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-opella-forest flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-700" />
            Opella AI Portfolio & Registry
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Unified registry tracking all AmplifAI initiatives across the four tiers and two speeds (Butterfly Spine).
          </p>
        </div>
        <button
          onClick={onNavigateToWizard}
          className="px-5 py-2.5 bg-opella-forest text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-opella-emerald shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> New Use Case Intake
        </button>
      </div>

      {/* Capacity & Portfolio Analytics (Slide 48) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Capacity Plan */}
        <div className="bg-white p-5 rounded-2xl border border-opella-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
              Capacity Allocation Target (Slide 48)
            </span>
            <PieChart className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-900 font-semibold">T1 Big Bets (Target: 60%)</span>
              <span className="font-bold">{bigBetPct}% ({bigBetsAndT1})</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-emerald-700 h-2 rounded-full"
                style={{ width: `${bigBetPct}%` }}
              />
            </div>

            <div className="flex justify-between text-xs pt-1">
              <span className="text-blue-900 font-semibold">Fast Lane & T2 (Target: 25%)</span>
              <span className="font-bold">{fastLanePct}% ({fastLaneAndT2})</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${fastLanePct}%` }}
              />
            </div>

            <div className="flex justify-between text-xs pt-1">
              <span className="text-purple-900 font-semibold">Enablement & Self-Serve (Target: 15%)</span>
              <span className="font-bold">{selfServePct}% ({selfServe})</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${selfServePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Speed Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-opella-border shadow-sm space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-gray-500 block">
            Speed & Delivery Modes
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="font-bold text-gray-900 text-lg">
                {useCases.filter((u) => u.mode === "Mode 1").length}
              </div>
              <div className="text-[11px] text-gray-500">Mode 1: For me</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="font-bold text-gray-900 text-lg">
                {useCases.filter((u) => u.mode === "Mode 2").length}
              </div>
              <div className="text-[11px] text-gray-500">Mode 2: With me</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="font-bold text-gray-900 text-lg">
                {useCases.filter((u) => u.mode === "Mode 3" || u.mode === "Self-Service AI").length}
              </div>
              <div className="text-[11px] text-gray-500">Mode 3: Enable</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 italic">
            *Mode is reassessed twice: at framing (G4) and pre-scaling (G5).
          </p>
        </div>

        {/* ORAI Risk Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-opella-border shadow-sm space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-gray-500 block">
            Responsible AI (ORAI) Compliance Tiers
          </span>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> Low Risk (Standard Guardrails)
              </span>
              <span className="font-bold">{useCases.filter((u) => u.riskTier === "Low").length}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <Shield className="w-3.5 h-3.5 text-amber-600" /> Medium Risk (5-Day Light Review)
              </span>
              <span className="font-bold">{useCases.filter((u) => u.riskTier === "Medium").length}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 text-rose-900 border border-rose-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <Shield className="w-3.5 h-3.5 text-rose-600" /> High Risk (LEX & CISO Review)
              </span>
              <span className="font-bold">{useCases.filter((u) => u.riskTier === "High").length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-opella-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search title, owner, function..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opella-forest"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Tier filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white font-medium"
          >
            <option value="ALL">All Tiers</option>
            <option value="T1">T1 · Transform</option>
            <option value="T2">T2 · Scale</option>
            <option value="T3">T3 · Fast Lane</option>
            <option value="Self-Serve">Self-Serve</option>
          </select>

          {/* Mode filter */}
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white font-medium"
          >
            <option value="ALL">All Modes</option>
            <option value="Mode 1">Mode 1: Do it for me</option>
            <option value="Mode 2">Mode 2: Do it with me</option>
            <option value="Mode 3">Mode 3: Enable me</option>
            <option value="Self-Service AI">Self-Service AI</option>
          </select>

          {/* Gate filter */}
          <select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white font-medium"
          >
            <option value="ALL">All Gates</option>
            <option value="G1">G1: Need</option>
            <option value="G2">G2: Feasibility</option>
            <option value="G3">G3: Priority</option>
            <option value="G4">G4: Mode & Budget</option>
            <option value="G5">G5: Pre-Scale</option>
            <option value="G6">G6: Maintain & Run</option>
          </select>
        </div>
      </div>

      {/* Initiatives Table */}
      <div className="bg-white rounded-2xl border border-opella-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-opella-border text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Initiative & Function</th>
                <th className="px-4 py-3.5">Tier & Speed</th>
                <th className="px-4 py-3.5">Delivery Mode</th>
                <th className="px-4 py-3.5">Current Gate</th>
                <th className="px-4 py-3.5">ORAI Risk</th>
                <th className="px-4 py-3.5">Budget / ROI</th>
                <th className="px-5 py-3.5 text-right">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.map((uc) => {
                const tierCfg = TIER_CONFIG[uc.tier];
                return (
                  <tr
                    key={uc.id}
                    className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectUseCase(uc.id)}
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 group-hover:text-opella-forest text-sm">
                        {uc.title}
                      </div>
                      <div className="text-gray-500 mt-0.5 flex items-center gap-2">
                        <span className="font-medium text-gray-700">{uc.functionName}</span>
                        <span>•</span>
                        <span>{uc.region}</span>
                        <span>•</span>
                        <span>Owner: {uc.owner}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md font-bold ${tierCfg.colorClass.badge}`}>
                        {tierCfg.name}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200">
                        {uc.mode}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold px-2 py-0.5 rounded bg-gray-800 text-white text-[11px]">
                          {uc.currentGate}
                        </span>
                        <span className="font-medium text-gray-700">
                          {uc.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold ${
                          uc.riskTier === "High"
                            ? "bg-rose-100 text-rose-800"
                            : uc.riskTier === "Medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {uc.riskTier}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">
                        €{uc.budget.toLocaleString()}
                      </div>
                      <div className="text-emerald-700 font-medium truncate max-w-[140px]">
                        {uc.roiEstimate}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onSelectUseCase(uc.id)}
                          className="p-1.5 rounded-lg text-opella-forest hover:bg-opella-forest hover:text-white transition-colors"
                          title="Open in Lifecycle Manager"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        {onDeleteUseCase && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete "${uc.title}" from the registry?\n\nThis will remove the use case, its gate history, and dossiers.`
                                )
                              ) {
                                onDeleteUseCase(uc.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete use case from registry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCases.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-xs">
            No initiatives match the selected search or filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
