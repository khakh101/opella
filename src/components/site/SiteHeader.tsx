"use client";

import React from "react";
import type { TabId } from "@/lib/supportModel";

export const SITE_TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "1. What we aim to achieve" },
  { id: "user", label: "2. BO experience" },
  { id: "support", label: "3. Support employee experience" },
  { id: "cockpit", label: "4. Q&A" },
  { id: "tocockpit", label: "5. TO cockpit" },
];

interface SiteHeaderProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTab, setActiveTab }) => (
  <header className="sticky top-0 z-50 border-b border-opella-deep bg-opella-forest text-white shadow-md">
    <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3 py-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-lg font-bold">Op.</div>
        <div className="text-base font-bold tracking-tight">
          Opella AmplifAI <span className="font-medium text-white/70">Operating model</span>
        </div>
      </div>
      <nav aria-label="Tabs" className="flex flex-wrap gap-1 overflow-x-auto">
        {SITE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            aria-current={activeTab === t.id ? "page" : undefined}
            className={`min-h-[44px] whitespace-nowrap rounded-lg px-3.5 text-sm transition-all ${
              activeTab === t.id ? "bg-white font-bold text-opella-forest shadow-sm" : "font-medium text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  </header>
);
