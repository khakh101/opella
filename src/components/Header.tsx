"use client";

import React from "react";
import { Sparkles, Layers, PlayCircle, Database, History } from "lucide-react";
import { UseCase } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

interface HeaderProps {
  activeTab: "wizard" | "lifecycle" | "portfolio" | "history";
  setActiveTab: (tab: "wizard" | "lifecycle" | "portfolio" | "history") => void;
  useCases: UseCase[];
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, useCases }) => {
  // Aggregate KPIs
  const totalCases = useCases.length;
  const bigBetsCount = useCases.filter((u) => u.tier === "T1").length;
  const inBuildCount = useCases.filter((u) => u.status === "BUILD_MVP").length;
  const inScaleOrRunCount = useCases.filter((u) => u.status === "SCALED" || u.status === "RUN").length;

  return (
    <header className="bg-opella-forest text-white border-b border-opella-deep shadow-md sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xl tracking-tight border border-white/20 text-white">
              Op.
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Opella AmplifAI
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Operating Model
                  </span>
                </h1>
                {isSupabaseConfigured && (
                  <span className="inline-flex items-center text-[11px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded border border-green-500/30 gap-1">
                    <Database className="w-3 h-3" /> Live Cloud Sync
                  </span>
                )}
              </div>
              <p className="text-xs text-white/70">
                Real-Time AI Use Case Lifecycle Simulator (Butterfly Transformation Spine)
              </p>
            </div>
          </div>

          {/* Quick Real-Time Metrics */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-center min-w-[70px]">
              <div className="text-xs text-white/60">Portfolio</div>
              <div className="text-sm font-bold text-white">{totalCases}</div>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-center min-w-[70px]">
              <div className="text-xs text-emerald-300">T1 Big Bets</div>
              <div className="text-sm font-bold text-emerald-200">{bigBetsCount}</div>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-center min-w-[70px]">
              <div className="text-xs text-amber-300">In MVP Build</div>
              <div className="text-sm font-bold text-amber-200">{inBuildCount}</div>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-center min-w-[70px]">
              <div className="text-xs text-blue-300">Scale & Run</div>
              <div className="text-sm font-bold text-blue-200">{inScaleOrRunCount}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-4 pt-2 border-t border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab("wizard")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "wizard"
                ? "bg-white text-opella-forest shadow-sm font-bold"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            1. Intake & Agent Triage
          </button>

          <button
            onClick={() => setActiveTab("lifecycle")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "lifecycle"
                ? "bg-white text-opella-forest shadow-sm font-bold"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <PlayCircle className="w-4 h-4 text-emerald-300" />
            2. Real-Time Lifecycle Simulator (Gates G1–G6)
          </button>

          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "portfolio"
                ? "bg-white text-opella-forest shadow-sm font-bold"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Layers className="w-4 h-4 text-blue-300" />
            3. Portfolio & AI Registry
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "history"
                ? "bg-white text-opella-forest shadow-sm font-bold"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <History className="w-4 h-4 text-purple-300" />
            4. Gate Audit & History (GIDE)
          </button>
        </div>
      </div>
    </header>
  );
};
