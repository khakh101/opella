"use client";

import React, { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { OverviewView } from "@/components/overview/OverviewView";
import { IntakeWizard } from "@/components/IntakeWizard";
import { SupportView, SupportPreset } from "@/components/support/SupportView";
import { CockpitView } from "@/components/cockpit/CockpitView";
import { LifecycleView } from "@/components/LifecycleView";
import { UseCase, Tier } from "@/types";
import { fetchUseCases } from "@/lib/storage";
import { INITIAL_USE_CASES } from "@/lib/mockData";
import type { NavTarget, TabId } from "@/lib/supportModel";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [useCases, setUseCases] = useState<UseCase[]>(INITIAL_USE_CASES);
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string>(INITIAL_USE_CASES[0]?.id || "");
  const [rescopingUseCase, setRescopingUseCase] = useState<UseCase | null>(null);
  const [rescopingTier, setRescopingTier] = useState<Tier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Deep links between tabs (Gentiane's questions, Tab 1 shortcut)
  const [supportPreset, setSupportPreset] = useState<SupportPreset | undefined>(undefined);
  const [cockpitTarget, setCockpitTarget] = useState<{ gate?: string; anchor?: string; simulator?: boolean }>({});
  const [navKey, setNavKey] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUseCases();
        if (data && data.length > 0) {
          setUseCases(data);
          if (!selectedUseCaseId && data[0]) setSelectedUseCaseId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load use cases:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const goTab = (tab: TabId) => {
    setSupportPreset(undefined);
    setCockpitTarget({});
    setNavKey((k) => k + 1);
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  };

  const navigate = (t: NavTarget) => {
    setNavKey((k) => k + 1);
    setSupportPreset(t.tab === "support" ? { screen: t.screen, role: t.role, tier: t.tier } : undefined);
    setCockpitTarget(t.tab === "cockpit" ? { gate: t.gate, anchor: t.anchor } : {});
    setActiveTab(t.tab);
    if (t.anchor && t.tab !== "cockpit") {
      setTimeout(() => document.getElementById(t.anchor!)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } else if (t.tab !== "cockpit") {
      window.scrollTo({ top: 0 });
    }
  };

  // The wizard and the simulator still hand off to the detailed simulator, now inside Tab 4
  const openSimulator = (id?: string) => {
    if (id) setSelectedUseCaseId(id);
    setNavKey((k) => k + 1);
    setCockpitTarget({ anchor: "simulator", simulator: true });
    setActiveTab("cockpit");
  };

  const simulator = (
    <LifecycleView
      useCases={useCases}
      selectedUseCaseId={selectedUseCaseId}
      onSelectUseCase={setSelectedUseCaseId}
      onUseCaseUpdated={(u) => setUseCases((prev) => prev.map((x) => (x.id === u.id ? u : x)))}
      onNavigateToRescope={(u, tier) => { setRescopingUseCase(u); setRescopingTier(tier); goTab("user"); }}
      onNavigateToNewIntake={() => { setRescopingUseCase(null); setRescopingTier(null); goTab("user"); }}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F3EE]">
      <SiteHeader activeTab={activeTab} setActiveTab={goTab} />
      <main className="flex-1">
        {isLoading ? (
          <div className="mx-auto max-w-7xl px-4 py-20 text-center">
            <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-opella-forest border-t-transparent" />
            <div className="text-sm font-semibold text-gray-600">Loading Opella AmplifAI Operating Model...</div>
          </div>
        ) : (
          <>
            {activeTab === "overview" && <OverviewView onGoToSupport={() => goTab("support")} />}
            {activeTab === "user" && (
              <div className="bg-[#f7f5ef]">
                <IntakeWizard
                  onUseCaseCreated={(c) => { setUseCases((prev) => [c, ...prev]); setSelectedUseCaseId(c.id); }}
                  onNavigateToLifecycle={(id) => openSimulator(id)}
                  rescopingUseCase={rescopingUseCase}
                  rescopingTier={rescopingTier}
                  onClearRescoping={() => { setRescopingUseCase(null); setRescopingTier(null); }}
                />
              </div>
            )}
            {activeTab === "support" && <SupportView key={`support-${navKey}`} preset={supportPreset} />}
            {activeTab === "cockpit" && (
              <CockpitView
                key={`cockpit-${navKey}`}
                initialGate={cockpitTarget.gate}
                initialAnchor={cockpitTarget.anchor}
                simulatorOpen={cockpitTarget.simulator}
                onNavigate={navigate}
                simulator={simulator}
              />
            )}
          </>
        )}
      </main>
      <footer className="border-t border-opella-border bg-white py-5 text-xs text-gray-500">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <span><span className="font-semibold text-gray-700">Opella AmplifAI Playbook</span> · Transformation Office and Data &amp; AI Hub</span>
          <a href="/legacy" className="font-semibold text-opella-forest underline">Previous version of the site</a>
        </div>
      </footer>
    </div>
  );
}
