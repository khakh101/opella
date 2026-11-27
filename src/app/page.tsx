"use client";

import React, { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { OverviewView } from "@/components/overview/OverviewView";
import { IntakeWizard } from "@/components/IntakeWizard";
import { SupportView, SupportPreset } from "@/components/support/SupportView";
import { QAView } from "@/components/qa/QAView";
import { TOCockpitView } from "@/components/cockpit/TOCockpitView";
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
  const [navKey, setNavKey] = useState(0);
  const [miroFocus, setMiroFocus] = useState<string | undefined>(undefined);

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
    setMiroFocus(undefined);
    setNavKey((k) => k + 1);
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  };

  const navigate = (t: NavTarget) => {
    setNavKey((k) => k + 1);
    setSupportPreset(t.tab === "support" ? { screen: t.screen, role: t.role, tier: t.tier } : undefined);
    setMiroFocus(t.miro);
    setActiveTab(t.tab);
    if (t.anchor) {
      setTimeout(() => document.getElementById(t.anchor!)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } else {
      window.scrollTo({ top: 0 });
    }
  };

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
            {activeTab === "overview" && <OverviewView key={`overview-${navKey}`} miroFocus={miroFocus} onGoToSupport={() => goTab("support")} />}
            {activeTab === "user" && (
              <div className="bg-[#f7f5ef]">
                <IntakeWizard
                  onUseCaseCreated={(c) => { setUseCases((prev) => [c, ...prev]); setSelectedUseCaseId(c.id); }}
                  onNavigateToLifecycle={(id) => setSelectedUseCaseId(id)}
                  rescopingUseCase={rescopingUseCase}
                  rescopingTier={rescopingTier}
                  onClearRescoping={() => { setRescopingUseCase(null); setRescopingTier(null); }}
                />
              </div>
            )}
            {activeTab === "support" && <SupportView key={`support-${navKey}`} preset={supportPreset} />}
            {activeTab === "cockpit" && <QAView key={`qa-${navKey}`} onNavigate={navigate} />}
            {activeTab === "tocockpit" && <TOCockpitView key={`to-${navKey}`} />}
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
