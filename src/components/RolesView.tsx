"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  BookOpen,
  Compass,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { OPELLA_ROLES } from "@/lib/constants";

export const RolesView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"roles" | "tom" | "adoption">("roles");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "URGENT_CREATE" | "TO_STRENGTHEN">("ALL");

  const filteredRoles = OPELLA_ROLES.filter((r) => {
    if (roleFilter === "ALL") return true;
    return r.category === roleFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-opella-forest flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-700" />
          Opella AI Target Operating Model (TOM) & Roles Playbook
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          The 4 pillars of Opella's target operating model: Organisation, Roles, Use Case Lifecycle, and AI for All.
        </p>
      </div>

      {/* Sub-Navigation */}
      <div className="flex items-center gap-2 border-b border-opella-border pb-3">
        <button
          onClick={() => setActiveSubTab("roles")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "roles"
              ? "bg-opella-forest text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          29 Roles & Capabilities Matrix
        </button>
        <button
          onClick={() => setActiveSubTab("tom")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "tom"
              ? "bg-opella-forest text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          The Hub & Delivery Modes (Pillar 1)
        </button>
        <button
          onClick={() => setActiveSubTab("adoption")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "adoption"
              ? "bg-opella-forest text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          AI for All & 5-Pillar Workforce Impact (Pillar 4)
        </button>
      </div>

      {/* ================= 1. ROLES MATRIX ================= */}
      {activeSubTab === "roles" && (
        <div className="space-y-6">
          {/* Summary Badges (Slide 15) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-rose-50 border-2 border-rose-300 p-5 rounded-2xl">
              <div className="text-2xl font-black text-rose-800">7 / 29</div>
              <div className="font-bold text-rose-950 text-sm mt-1">To Create Urgently</div>
              <p className="text-xs text-rose-800 mt-1">
                Do not exist yet: Product Owner (BO/PO), AI Builder, Business Architect, FDE, Semantic Layer Architect, Regional Adoption Relays, P&C Counterpart.
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-2xl">
              <div className="text-2xl font-black text-amber-800">5 / 29</div>
              <div className="font-bold text-amber-950 text-sm mt-1">To Strengthen</div>
              <p className="text-xs text-amber-800 mt-1">
                Exist but too thin: AI Catalyst (target 300), Data Steward (1/domain), AI Engineer (Azure hub), Data Product Lead, Digital PO.
              </p>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl">
              <div className="text-2xl font-black text-emerald-800">17 / 29</div>
              <div className="font-bold text-emerald-950 text-sm mt-1">Largely In Place</div>
              <p className="text-xs text-emerald-800 mt-1">
                Staffed and operating: Data scientists, Enterprise Architecture, Cyber, Business Solutions, Value Officer, LEX ORAI team.
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-semibold">Filter:</span>
            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-3 py-1 rounded-full font-medium ${
                roleFilter === "ALL" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              All Key Roles ({OPELLA_ROLES.length})
            </button>
            <button
              onClick={() => setRoleFilter("URGENT_CREATE")}
              className={`px-3 py-1 rounded-full font-medium ${
                roleFilter === "URGENT_CREATE" ? "bg-rose-600 text-white" : "bg-rose-100 text-rose-800"
              }`}
            >
              7 Urgent to Create
            </button>
            <button
              onClick={() => setRoleFilter("TO_STRENGTHEN")}
              className={`px-3 py-1 rounded-full font-medium ${
                roleFilter === "TO_STRENGTHEN" ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-800"
              }`}
            >
              5 To Strengthen
            </button>
          </div>

          {/* Roles Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role) => (
              <div
                key={role.name}
                className="bg-white p-5 rounded-2xl border border-opella-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        role.category === "URGENT_CREATE"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {role.category === "URGENT_CREATE" ? "NEW ROLE" : "STRENGTHEN"}
                    </span>
                    <span className="text-[11px] text-gray-500 font-semibold">{role.sitsIn}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{role.name}</h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">{role.mission}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
                  <div className="text-gray-400 font-medium">Current Status at Opella:</div>
                  <div className="font-semibold text-gray-800 mt-0.5">{role.gapToday}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 2. THE HUB & MODES ================= */}
      {activeSubTab === "tom" && (
        <div className="space-y-6">
          {/* The Hub Pairing Card (Slide 9) */}
          <div className="bg-white rounded-2xl p-6 border border-opella-border shadow-sm">
            <h3 className="text-lg font-bold text-opella-forest mb-2">
              The Hub = Transformation Office (What & Why) + Data & AI (What & How)
            </h3>
            <p className="text-xs text-gray-600 mb-6">
              Transitioning from siloed parallel factories to a scalable federated operating model under one umbrella.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transformation Office */}
              <div className="p-5 rounded-xl border border-amber-300 bg-amber-50/50 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Transformation Office (WHAT & WHY)
                </span>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>One Front Door:</strong> Single intake & arbitration forum for all functional AI demand.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>One Value Office:</strong> Grounded baseline with Finance, ROI tracking, FTE effect.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Process Redesign & Adoption:</strong> Leads end-to-end process changes and change impact scans.</span>
                  </li>
                </ul>
              </div>

              {/* Data & AI */}
              <div className="p-5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Digital – Data & AI (WHAT & HOW)
                </span>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Platform & Standards:</strong> Shared data platform (Snowflake / Databricks) + Azure GenAI tenant.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Opella IQ Semantic Layer:</strong> Unified metrics, cross-functional data products & data catalog.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Design Authority:</strong> 5-day architectural review and ORAI risk clearance.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* The 3 Delivery Modes (Slide 10 & 11) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-opella-border shadow-sm space-y-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                Mode 1: Do it for me
              </span>
              <h4 className="font-bold text-gray-900 text-sm">“We ride for you”</h4>
              <p className="text-xs text-gray-600">
                Hub leads delivery and run; function defines the need, validates outcome and owns value. Best for complex builds with no function tech capacity.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-opella-border shadow-sm space-y-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                Mode 2: Do it with me
              </span>
              <h4 className="font-bold text-gray-900 text-sm">“We ride together”</h4>
              <p className="text-xs text-gray-600">
                Function leads, hub builds with it with dedicated hub capacity. Best for medium complexity where deep business process and AI engineering meet.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-opella-border shadow-sm space-y-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                Mode 3: Enable me
              </span>
              <h4 className="font-bold text-gray-900 text-sm">“We give you the bike & map”</h4>
              <p className="text-xs text-gray-600">
                Function frames and builds solutions it sources (SaaS or low-code AI builders). Hub sets guardrails, audits architecture, and monitors tokens.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. ADOPTION & 5 PILLARS ================= */}
      {activeSubTab === "adoption" && (
        <div className="space-y-6">
          {/* 4 Conditions for Change (Slide 59) */}
          <div className="bg-white rounded-2xl p-6 border border-opella-border shadow-sm">
            <h3 className="text-lg font-bold text-opella-forest mb-4">
              AI for All: The 4 Conditions for Change (Slide 59)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-black text-emerald-800 text-sm block mb-1">01 UNDERSTAND</span>
                <p className="text-gray-700">“I see why AI matters for my job and what to ask AI builders for.”</p>
                <div className="mt-3 text-[11px] text-gray-500">Pain-point workshops & cascading leadership stories.</div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-black text-emerald-800 text-sm block mb-1">02 ABILITY</span>
                <p className="text-gray-700">“I have the skills and support to use and build agents in my daily work.”</p>
                <div className="mt-3 text-[11px] text-gray-500">Co-building is the training + Citizen Builders track.</div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-black text-emerald-800 text-sm block mb-1">03 MOTIVATION</span>
                <p className="text-gray-700">“I see leaders and peers succeed, and know it pays off for me too.”</p>
                <div className="mt-3 text-[11px] text-gray-500">Cafés IA, demo days, and celebrating builder wins.</div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-black text-emerald-800 text-sm block mb-1">04 REINFORCEMENT</span>
                <p className="text-gray-700">“I see that agents last, feedback is acted on, and my role evolves.”</p>
                <div className="mt-3 text-[11px] text-gray-500">3-level dashboard, usage tracking, and retiring unused tools.</div>
              </div>
            </div>
          </div>

          {/* The 5 Pillars of Workforce Impact (Slide 64) */}
          <div className="bg-white rounded-2xl p-6 border border-opella-border shadow-sm">
            <h3 className="text-lg font-bold text-opella-forest mb-2">
              The 5 Pillars of Workforce Impact (Assessed at Pilot Approval & Revised at Scale Gate)
            </h3>
            <p className="text-xs text-gray-600 mb-5">
              Every initiative passing G5 must have its HR / P&C impact scanned across these five dimensions:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50">
                <span className="font-bold text-gray-900 block mb-1">1. Business Activities</span>
                <p className="text-gray-600 text-[11px]">Volume and automation: rate of task substitution, lead time reduction, cost efficiency.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50">
                <span className="font-bold text-gray-900 block mb-1">2. Governance & Roles</span>
                <p className="text-gray-600 text-[11px]">Decision levels (human vs AI), new steering roles, obsolete manual checkpoints.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50">
                <span className="font-bold text-gray-900 block mb-1">3. Skills & Upskilling</span>
                <p className="text-gray-600 text-[11px]">Prompt fluency, new domain competencies, knowledge preservation during handovers.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50">
                <span className="font-bold text-gray-900 block mb-1">4. Quality of Work Life</span>
                <p className="text-gray-600 text-[11px]">Cognitive load reduction, removing mundane administrative strain, ergonomics.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50">
                <span className="font-bold text-gray-900 block mb-1">5. Social Dialogue & Ethics</span>
                <p className="text-gray-600 text-[11px]">Employee consultation bodies, transparency, explainability, CSR alignment.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
