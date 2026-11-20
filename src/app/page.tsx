"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MiroBoardView } from "@/components/MiroBoardView";
import { IntakeWizard } from "@/components/IntakeWizard";
import { LifecycleView } from "@/components/LifecycleView";
import { PortfolioView } from "@/components/PortfolioView";
import { HistoryView } from "@/components/HistoryView";
import { OperatingModelMap } from "@/components/OperatingModelMap";
import { PipelineFlowSimulator } from "@/components/PipelineFlowSimulator";
import { UseCase } from "@/types";
import { fetchUseCases, deleteUseCase } from "@/lib/storage";
import { INITIAL_USE_CASES } from "@/lib/mockData";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "board" | "wizard" | "lifecycle" | "portfolio" | "history" | "map" | "flow"
  >("board");

  const [useCases, setUseCases] = useState<UseCase[]>(INITIAL_USE_CASES);
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string>(
    INITIAL_USE_CASES[0]?.id || ""
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load use cases on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchUseCases();
        if (data && data.length > 0) {
          setUseCases(data);
          if (!selectedUseCaseId && data[0]) {
            setSelectedUseCaseId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load use cases:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUseCaseCreated = (newCase: UseCase) => {
    setUseCases((prev) => [newCase, ...prev]);
    setSelectedUseCaseId(newCase.id);
  };

  const handleUseCaseUpdated = (updatedCase: UseCase) => {
    setUseCases((prev) =>
      prev.map((uc) => (uc.id === updatedCase.id ? updatedCase : uc))
    );
  };

  const handleUseCaseDeleted = async (id: string) => {
    await deleteUseCase(id);
    setUseCases((prev) => {
      const remaining = prev.filter((uc) => uc.id !== id);
      if (selectedUseCaseId === id) {
        setSelectedUseCaseId(remaining[0]?.id || "");
      }
      return remaining;
    });
  };

  const handleSelectUseCaseAndGoToLifecycle = (id: string) => {
    setSelectedUseCaseId(id);
    setActiveTab("lifecycle");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5ef]">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        useCases={useCases}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-opella-forest border-t-transparent rounded-full animate-spin mb-3"></div>
            <div className="text-sm font-semibold text-gray-600">
              Loading Opella AmplifAI Operating Model...
            </div>
          </div>
        ) : (
          <>
            {activeTab === "board" && (
              <MiroBoardView
                onNavigateToWizard={() => setActiveTab("wizard")}
                onNavigateToLifecycle={() => setActiveTab("lifecycle")}
              />
            )}

            {activeTab === "wizard" && (
              <IntakeWizard
                onUseCaseCreated={handleUseCaseCreated}
                onNavigateToLifecycle={handleSelectUseCaseAndGoToLifecycle}
              />
            )}

            {activeTab === "lifecycle" && (
              <LifecycleView
                useCases={useCases}
                selectedUseCaseId={selectedUseCaseId}
                onSelectUseCase={setSelectedUseCaseId}
                onUseCaseUpdated={handleUseCaseUpdated}
              />
            )}

            {activeTab === "portfolio" && (
              <PortfolioView
                useCases={useCases}
                onSelectUseCase={handleSelectUseCaseAndGoToLifecycle}
                onDeleteUseCase={handleUseCaseDeleted}
                onNavigateToWizard={() => setActiveTab("wizard")}
              />
            )}

            {activeTab === "history" && (
              <HistoryView
                useCases={useCases}
                selectedUseCaseId={selectedUseCaseId}
                onSelectUseCase={setSelectedUseCaseId}
              />
            )}

            {activeTab === "map" && (
              <OperatingModelMap
                onNavigateToWizard={() => setActiveTab("wizard")}
                onNavigateToLifecycle={() => setActiveTab("lifecycle")}
              />
            )}

            {activeTab === "flow" && <PipelineFlowSimulator />}
          </>
        )}
      </main>

      {/* Opella Playbook Footer */}
      <footer className="bg-white border-t border-opella-border py-6 mt-12 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-opella-forest text-white flex items-center justify-center font-bold text-[10px]">
              Op.
            </div>
            <span className="font-semibold text-gray-700">
              Opella AmplifAI Playbook
            </span>
            <span>·</span>
            <span>Transformation Office (Butterfly Spine) & Data & AI Hub</span>
          </div>

          <div className="flex items-center gap-4 text-gray-500 text-[11px]">
            <span>G1–G6 Decision Rights</span>
            <span>•</span>
            <span>Two Speeds Governance</span>
            <span>•</span>
            <span>Responsible AI (ORAI)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
