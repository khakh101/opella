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
  MapPin,
  Calendar,
  CheckSquare,
  Briefcase,
  Rocket,
  Milestone,
  Scale,
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
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);
  const [activeViewMode, setActiveViewMode] = useState<
    "userJourney" | "interactiveMap" | "matrix" | "scenarioSimulator"
  >("userJourney");

  const tierDeepDive = TIER_DEEP_DIVES[selectedTier];
  const modeDeepDive = MODE_DEEP_DIVES[selectedMode];
  const gateDetail = INITIAL_GATES[selectedGate];

  // 7 End-to-End User Journey Stations
  const JOURNEY_STATIONS = [
    {
      id: 1,
      number: "01",
      name: "Front Door Intake",
      phase: "Framing Phase",
      gate: "Gate G1 Candidate",
      tagline: "Transforming raw operational friction into a qualified AI charter.",
      youAreHere: "You are the Applicant / Business Champion submitting your use case need and answering the 4 triage questions.",
      deliverables: [
        "Use Case Description: business context, current operational friction, and intended AI solution.",
        "Target User Personas: identify who will use it, user roles, community size, and geographic clusters.",
        "The 4 Triage Assessment Questions: Big Bet scope, approved tools under €50k, pilot reach, or new hypothesis.",
        "ORAI Risk Screening: patient health data, autonomous decisions, and core ERP write-backs.",
      ],
      forum: "Front Door Charter Triage",
      approver: "OpellaGPT Charter Agent & AI Catalyst",
      sla: "5 working days",
      consequence: "Initiative registered in Opella AI Registry; routes into automated agent triage.",
      teams: {
        hub: [
          {
            initials: "CAT",
            name: "Front Door AI Catalyst",
            role: "Intake Advisor & Solution Screener",
            fte: "0.2 FTE",
            percent: 20,
            tasks: "Assists the business owner in articulating the problem statement, checks the AI Registry for existing solutions, and verifies initial data readiness.",
          },
        ],
        to: [
          {
            initials: "INT",
            name: "Portfolio Intake Coordinator",
            role: "Intake Ticket Manager",
            fte: "0.1 FTE",
            percent: 10,
            tasks: "Logs the charter into the centralized pipeline, tracks the 5-day triage SLA, and ensures functional sponsor endorsement.",
          },
        ],
        function: [
          {
            initials: "AMB",
            name: "Function Digital Ambassador",
            role: "Local Domain Champion",
            fte: "0.3 FTE",
            percent: 30,
            tasks: "Identifies local operational pain points, gathers initial user count estimates, and secures functional department alignment.",
          },
        ],
      },
    },
    {
      id: 2,
      number: "02",
      name: "Autonomous Agent Triage",
      phase: "Framing Phase",
      gate: "Gate G1 Decision",
      tagline: "Evaluating the 4 playbook questions to assign the optimal tier and speed lane.",
      youAreHere: "Your intake answers are being evaluated by the autonomous Charter Agent to determine governance rigor and funding path.",
      deliverables: [
        "Playbook 4 Questions Evaluation: Big Bet threshold (>€1M), approved tools (<€50k), pilot scale (€200k–€1M), or fast lane.",
        "ORAI Risk Classification: Low (auto-clear), Medium (5-day light review), or High (CISO/LEX review).",
        "Assigned Speed Lane: T1 Transform, T2 Scale, T3 Fast Lane, or Self-Serve Register & Go.",
        "Mapped Big Bet Alignment: verified against Opella's 6 strategic transformation bets.",
      ],
      forum: "Front Door Charter Triage / AI Portfolio Board",
      approver: "Charter Agent (OpellaGPT) & AI Catalyst confirms",
      sla: "5 working days",
      consequence: "Speed lane confirmed; unlocks Gate G2 Feasibility dossier and sets committee cadence.",
      teams: {
        hub: [
          {
            initials: "ARC",
            name: "Lead Enterprise AI Architect",
            role: "Technical Sizing & Platform Evaluator",
            fte: "0.2 FTE",
            percent: 20,
            tasks: "Evaluates whether solution requires shared platform engineering (Mode 1/2) or low-code tools (Mode 3).",
          },
        ],
        to: [
          {
            initials: "SEC",
            name: "AI Portfolio Board Secretariat",
            role: "Governance & Comitology Officer",
            fte: "0.2 FTE",
            percent: 20,
            tasks: "Assigns governing committee (Transformation SteerCo for T1, AI Portfolio Board for T2/T3) and sets PMO tracking.",
          },
        ],
        function: [
          {
            initials: "SPO",
            name: "Function Executive Sponsor",
            role: "Business Unit VP / Director",
            fte: "0.2 FTE",
            percent: 20,
            tasks: "Confirms strategic business relevance, endorses initiative priority, and commits future business PO time.",
          },
        ],
      },
    },
    {
      id: 3,
      number: "03",
      name: "Feasibility & Business Case",
      phase: "Framing Phase",
      gate: "Gate G2 & Gate G3",
      tagline: "Grounding the financial baseline and proving technical connectivity before capital commit.",
      youAreHere: "You are partnering with Finance and Hub architects to prove value, technical feasibility, and secure Hub capacity slots.",
      deliverables: [
        "Finance Baseline Sign-off: unit processing costs grounded by Finance BP (e.g. €142/PO baseline).",
        "Architecture Decision Record (ADR): API connectivity verified on Azure GenAI private link.",
        "Process Redesign Explicit Check: confirmation that business process is rewritten to cut handoffs.",
        "VCP Prioritisation Scorecard: strategic alignment, ROI payback, and reach scored out of 100.",
      ],
      forum: "Digital Design Authority (DDA) & Transformation SteerCo",
      approver: "Data & AI Hub Lead, Finance BP, and SteerCo",
      sla: "10 working days",
      consequence: "Hub delivery capacity slots formally allocated in the quarterly transformation envelope.",
      teams: {
        hub: [
          {
            initials: "FDA",
            name: "Forward Deployed Architect",
            role: "Solution & Enabler Lead",
            fte: "0.5 FTE",
            percent: 50,
            tasks: "Designs API interfaces (SAP OData, Databricks), verifies data readiness, and models cloud/token opex consumption.",
          },
        ],
        to: [
          {
            initials: "VAL",
            name: "Value Realization Lead",
            role: "VCP Scorecard Lead",
            fte: "0.3 FTE",
            percent: 30,
            tasks: "Models net Present Value (NPV), establishes Corporate Value Pool tracking, and prepares SteerCo prioritization dossier.",
          },
        ],
        function: [
          {
            initials: "FBP",
            name: "Finance Business Partner",
            role: "Financial Baseline Authority",
            fte: "0.4 FTE",
            percent: 40,
            tasks: "Verifies current operational baseline costs in official ledger and signs off expected P&L return trajectory.",
          },
          {
            initials: "PO",
            name: "Business Product Owner",
            role: "Domain Lead & Process Owner",
            fte: "0.5 FTE",
            percent: 50,
            tasks: "Authors target process redesign, specifies business validation rules, and defines pilot user cohorts.",
          },
        ],
      },
    },
    {
      id: 4,
      number: "04",
      name: "Sourcing Mode & Squad Lock",
      phase: "Framing -> GO BUILD",
      gate: "Gate G4 (GO BUILD)",
      tagline: "Locking Make vs Buy, committing the tri-partite squad, and unlocking Tranche 1 MVP budget.",
      youAreHere: "You are formalizing delivery mode (Mode 1, 2, or 3), composing the squad roster, and unlocking the sprint budget.",
      deliverables: [
        "Delivery Mode Ratification: Mode 1 (Central Hub), Mode 2 (Joint Squad), or Mode 3 (Enable Me).",
        "Tranche 1 Budget Unlock: capital released for 8-week MVP sprint (e.g. €380k allocated).",
        "Committed Squad Roster: named internal and external roles across Hub, TO, and Business Function.",
        "MVP Sprint Backlog: 6–8 week agile sprint milestones and user adoption training plan.",
      ],
      forum: "Design Authority (Weekly) + Tier Approver",
      approver: "Design Authority & Program Sponsors (CPO / CDO / CFO)",
      sla: "5 working days",
      consequence: "Official GO BUILD issued; triggers sprint kickoff and funding release into project cost center.",
      teams: {
        hub: [
          {
            initials: "FDE",
            name: "Forward Deployed Engineer (FDE)",
            role: "Dedicated Lead AI Developer",
            fte: "1.0 FTE Dedicated",
            percent: 100,
            tasks: "Embedded full-time in the squad: prototypes rapidly, builds production GenAI pipelines, and ensures platform standards.",
          },
          {
            initials: "DE",
            name: "Data Platform Engineer",
            role: "Integration Specialist",
            fte: "0.5 FTE",
            percent: 50,
            tasks: "Configures delta lake tables, manages private API gateways, and handles synthetic test data ingestion.",
          },
        ],
        to: [
          {
            initials: "CHG",
            name: "Change Management Specialist",
            role: "Adoption & Capability Lead",
            fte: "0.4 FTE",
            percent: 40,
            tasks: "Designs ProcurLab prompting curriculum, organizes buyer coaching clinics, and establishes user feedback channels.",
          },
        ],
        function: [
          {
            initials: "PO",
            name: "Dedicated Business PO",
            role: "Single Accountable Product Owner",
            fte: "0.8 FTE",
            percent: 80,
            tasks: "Prioritizes user stories in sprint backlog, validates agent suggestions daily, and owns business outcomes.",
          },
          {
            initials: "SME",
            name: "Subject Matter Expert / Key User",
            role: "Operational Test Champion",
            fte: "0.5 FTE",
            percent: 50,
            tasks: "Provides real quote scenarios, validates edge cases, and acts as champion among peer users.",
          },
        ],
      },
    },
    {
      id: 5,
      number: "05",
      name: "Agile MVP Sprint Build",
      phase: "Phase II: Build MVP",
      gate: "MVP Sprint (Weeks 1 to 8)",
      tagline: "Iterative sprint execution building the working AI agent and testing with pilot users.",
      youAreHere: "Your joint squad is in weekly agile sprints, testing agent accuracy with pilot business users.",
      deliverables: [
        "Working AI Agent Pipeline: functional agent connected to test data and enterprise APIs.",
        "Weekly Sprint Demos: working software demonstrated to stakeholders every Friday.",
        "Pilot User Validation: testing in initial pilot markets (e.g. Spain & France direct procurement).",
        "KPI Measurement: turn-around speed, quote match accuracy, and user satisfaction tracked.",
      ],
      forum: "Weekly Sprint Reviews & Standups",
      approver: "Product Owner (Sarah Chen) & Hub FDE",
      sla: "6–8 week agile sprint",
      consequence: "Validated pilot agent ready for formal Gate G5 Pre-Scale SteerCo evaluation.",
      teams: {
        hub: [
          {
            initials: "FDE",
            name: "FDE Engineering Squad",
            role: "Full-Time Sprint Developers",
            fte: "1.0 FTE Dedicated",
            percent: 100,
            tasks: "Implements agentic reasoning, optimizes prompts, fine-tunes LangChain/Databricks models, and cuts handoffs.",
          },
        ],
        to: [
          {
            initials: "COA",
            name: "Agile Delivery Coach",
            role: "Scrum Master & PMO",
            fte: "0.3 FTE",
            percent: 30,
            tasks: "Runs daily standups, unblocks sprint dependencies, and tracks burn-down against Tranche 1 ceiling.",
          },
        ],
        function: [
          {
            initials: "PIL",
            name: "Pilot User Cohort",
            role: "Active Pilot Buyers (45+ staff)",
            fte: "0.3 FTE per user",
            percent: 30,
            tasks: "Tests agent in day-to-day workflow, rates output accuracy, and flags operational discrepancies.",
          },
        ],
      },
    },
    {
      id: 6,
      number: "06",
      name: "Pre-Scale Validation",
      phase: "Phase III: Pre-Scale",
      gate: "Gate G5 (Scale Gate)",
      tagline: "Proving pilot KPIs, scanning 5-pillar HR workforce impact, and unlocking Tranche 2 scaling capital.",
      youAreHere: "You are presenting verified pilot results to the Scale Committee to unlock enterprise rollout across global regions.",
      deliverables: [
        "MVP Pilot Results Dossier: turnaround reduced from 7.2d to 28h; 94.2% buyer acceptance across 420 POs.",
        "5-Pillar Workforce Impact Scan: Activities, Roles, Skills, QWL, and Ethics assessed by HR/P&C.",
        "Tranche 2 Funding Request: capital request for multi-region rollout (e.g. €850k for 1,800 users).",
        "Production Security Hardening: CISO zero-drift audit and enterprise HA deployment plan.",
      ],
      forum: "Transformation SteerCo Scale Review Committee",
      approver: "Scale Committee (SteerCo Members, CPO, CDO, HR Lead)",
      sla: "Quarterly review",
      consequence: "Tranche 2 funding released; initiative launches into multi-region enterprise rollout.",
      teams: {
        hub: [
          {
            initials: "MLO",
            name: "Lead MLOps Engineer",
            role: "Platform Hardening Specialist",
            fte: "0.5 FTE",
            percent: 50,
            tasks: "Sets up automated model drift monitoring, production rate limiting, and 99.9% uptime infrastructure.",
          },
        ],
        to: [
          {
            initials: "HR",
            name: "P&C Workforce Transformation Lead",
            role: "5-Pillar Impact Counterpart",
            fte: "0.5 FTE",
            percent: 50,
            tasks: "Leads organizational evolution plan, reallocates saved buyer hours (42,000h) into strategic sourcing.",
          },
        ],
        function: [
          {
            initials: "REG",
            name: "Regional Rollout Champions",
            role: "Market Cluster Leads (NA, EULA, AMEA)",
            fte: "1.0 FTE Shared",
            percent: 100,
            tasks: "Leads regional localization, ensures local ERP compliance, and conducts training waves across 1,800 users.",
          },
        ],
      },
    },
    {
      id: 7,
      number: "07",
      name: "BAU Maintain & Value Audit",
      phase: "Phase V: Maintain & Run",
      gate: "Gate G6 (Run Gate)",
      tagline: "Auditing realized EBITDA savings, monitoring token opex caps, and sustaining permanent user adoption.",
      youAreHere: "Your initiative is in permanent Business-As-Usual (BAU) operations with semi-annual value auditing.",
      deliverables: [
        "Annual Value Realization Audit: net EBITDA savings verified in corporate ledger (+6 / +12 months).",
        "Token Opex & Cloud FinOps Report: token costs monitored under monthly budget cap (<€4,500/mo).",
        "Sustained User Adoption Metric: role-based adoption KPI (>75% weekly active users maintained).",
        "Continuous ORAI Compliance: quarterly model drift and ethical fairness re-certification.",
      ],
      forum: "Scale & Adoption Committee (Quarterly)",
      approver: "Run Owner (Sarah Chen) & Corporate Finance Auditor",
      sla: "Bi-annual value audit",
      consequence: "Permanent BAU certification; certified agent architecture published as reusable archetype.",
      teams: {
        hub: [
          {
            initials: "OPS",
            name: "AI Platform Operations & FinOps",
            role: "Continuous Run Engineer",
            fte: "0.1 FTE",
            percent: 10,
            tasks: "Monitors token consumption, maintains API uptime, and handles quarterly LLM version upgrades.",
          },
        ],
        to: [
          {
            initials: "AUD",
            name: "Enterprise Value Auditor",
            role: "Corporate Finance Value Lead",
            fte: "0.1 FTE",
            percent: 10,
            tasks: "Verifies realized EBITDA in unified ledger and reports savings to ExCo and Transformation SteerCo.",
          },
        ],
        function: [
          {
            initials: "RUN",
            name: "Run Owner & Process Champion",
            role: "Permanent BAU Process Owner",
            fte: "0.2 FTE",
            percent: 20,
            tasks: "Maintains high user engagement (>80% WAU), drives continuous prompt refinement, and runs monthly user clinics.",
          },
        ],
      },
    },
  ];

  const currentStation = JOURNEY_STATIONS[selectedStationIndex] || JOURNEY_STATIONS[0];

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
            onClick={() => setActiveViewMode("userJourney")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeViewMode === "userJourney"
                ? "bg-white text-opella-forest shadow-sm font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Milestone className="w-3.5 h-3.5 text-emerald-600" />
            User Journey & Teams
          </button>
          <button
            onClick={() => setActiveViewMode("interactiveMap")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeViewMode === "interactiveMap"
                ? "bg-white text-opella-forest shadow-sm font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Flow Map (Tiers & Gates)
          </button>
          <button
            onClick={() => setActiveViewMode("scenarioSimulator")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeViewMode === "scenarioSimulator"
                ? "bg-white text-opella-forest shadow-sm font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sourcing Modes & Squad Zoom
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

      {/* ================= VIEW 0: VISUAL END-TO-END USER JOURNEY & TEAMS ================= */}
      {activeViewMode === "userJourney" && (
        <div className="space-y-6">
          {/* Visual Interactive Pipeline Stepper */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-opella-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-opella-forest uppercase tracking-wider flex items-center gap-2">
                  <Milestone className="w-4 h-4 text-emerald-700" />
                  Visual End-to-End User Journey Pipeline & Squad Allocation
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Walk through the 7 stations from intake to run. Inspect the dedicated profiles accompanying you across Data & AI Hub, Transformation Office, and Business Function.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStationIndex((prev) => Math.max(0, prev - 1))}
                  disabled={selectedStationIndex === 0}
                  className="px-3 py-1 rounded-lg text-xs font-bold border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ← Prev Station
                </button>
                <span className="text-xs font-mono font-bold text-opella-forest px-2">
                  {selectedStationIndex + 1} / {JOURNEY_STATIONS.length}
                </span>
                <button
                  onClick={() =>
                    setSelectedStationIndex((prev) =>
                      Math.min(JOURNEY_STATIONS.length - 1, prev + 1)
                    )
                  }
                  disabled={selectedStationIndex === JOURNEY_STATIONS.length - 1}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-opella-forest text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-opella-emerald"
                >
                  Next Station →
                </button>
              </div>
            </div>

            {/* Visual Station Track / Subway Pipeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {JOURNEY_STATIONS.map((st, idx) => {
                const isSelected = selectedStationIndex === idx;
                const isPassed = selectedStationIndex > idx;

                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStationIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "border-opella-forest bg-emerald-50/70 shadow-md ring-2 ring-opella-forest/20"
                        : isPassed
                        ? "border-emerald-200 bg-white hover:border-emerald-300"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            isSelected
                              ? "bg-opella-forest text-white"
                              : isPassed
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {st.number}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-gray-400">
                          {st.gate.split(" ")[0]}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 leading-tight">
                        {st.name}
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                      <span>{st.phase.split(":")[0]}</span>
                      {isPassed && <Check className="w-3 h-3 text-emerald-600" />}
                    </div>

                    {isSelected && (
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-opella-forest rotate-45 rounded-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE STATION DEEP DIVE: YOU ARE HERE BANNER */}
          <div className="bg-gradient-to-r from-emerald-950 via-opella-forest to-emerald-900 rounded-2xl p-6 text-white shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-amber-400 text-gray-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm">
                  <span>📍</span>
                  <span>YOU ARE HERE</span>
                </span>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                    Station {currentStation.number} · {currentStation.phase} ({currentStation.gate})
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {currentStation.name}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-emerald-200 border border-emerald-400/30 self-start sm:self-auto">
                {currentStation.tagline}
              </span>
            </div>

            {/* You Are Here Guidance Note */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Your Role & Position in This Station:
              </span>
              <p className="text-xs font-medium text-white/95 leading-relaxed">
                {currentStation.youAreHere}
              </p>
            </div>
          </div>

          {/* THE TEAMS AT YOUR DISPOSITION IN THIS STATION (3-WAY STAKEHOLDER PROFILES) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-opella-border pb-3">
              <div>
                <h4 className="text-sm font-bold text-opella-forest uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                  Teams & Profiles Accompanying You at Station {currentStation.number}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tri-partite staffing model: committed profiles and FTE dedication from Data & AI Hub, Transformation Office, and Business Function.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                Active Squad Roster
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 1. DATA & AI HUB TEAM */}
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

                <div className="space-y-3">
                  {currentStation.teams.hub.map((member, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white border border-blue-100 text-xs shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                          {member.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 truncate">
                            {member.name}
                          </div>
                          <div className="text-[11px] text-blue-800 font-medium">
                            {member.role}
                          </div>
                        </div>
                      </div>

                      {/* FTE Allocation Bar */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1">
                          <span>FTE Dedication</span>
                          <span className="text-blue-900">{member.fte}</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, member.percent)}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-600 leading-snug pt-1 border-t border-gray-100">
                        {member.tasks}
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
                    Governance
                  </span>
                </div>

                <div className="space-y-3">
                  {currentStation.teams.to.map((member, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white border border-purple-100 text-xs shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-purple-700 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                          {member.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 truncate">
                            {member.name}
                          </div>
                          <div className="text-[11px] text-purple-800 font-medium">
                            {member.role}
                          </div>
                        </div>
                      </div>

                      {/* FTE Allocation Bar */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1">
                          <span>FTE Dedication</span>
                          <span className="text-purple-900">{member.fte}</span>
                        </div>
                        <div className="w-full bg-purple-100 rounded-full h-1.5">
                          <div
                            className="bg-purple-700 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, member.percent)}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-600 leading-snug pt-1 border-t border-gray-100">
                        {member.tasks}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. BUSINESS FUNCTION TEAM */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950 uppercase tracking-wider">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    Business Function Team
                  </div>
                  <span className="text-[10px] bg-emerald-800 text-white font-bold px-2 py-0.5 rounded-full">
                    Domain PO
                  </span>
                </div>

                <div className="space-y-3">
                  {currentStation.teams.function.map((member, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white border border-emerald-100 text-xs shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                          {member.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 truncate">
                            {member.name}
                          </div>
                          <div className="text-[11px] text-emerald-800 font-medium">
                            {member.role}
                          </div>
                        </div>
                      </div>

                      {/* FTE Allocation Bar */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1">
                          <span>FTE Dedication</span>
                          <span className="text-emerald-900">{member.fte}</span>
                        </div>
                        <div className="w-full bg-emerald-100 rounded-full h-1.5">
                          <div
                            className="bg-emerald-800 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, member.percent)}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-600 leading-snug pt-1 border-t border-gray-100">
                        {member.tasks}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DELIVERABLES TO COLLECT & GOVERNING COMITOLOGY (2 COLUMNS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLUMN 1: INFORMATION YOU MUST COLLECT BEFORE CONTINUING */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border space-y-4">
              <div className="flex items-center justify-between border-b border-opella-border pb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-700" />
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Information You Must Collect Before Continuing
                  </h4>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  Mandatory Prerequisite
                </span>
              </div>

              <div className="space-y-2.5">
                {currentStation.deliverables.map((deliv, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-gray-200 bg-gray-50/70 text-xs flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-gray-800 font-medium leading-relaxed">{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: GOVERNING FORUM & DECISION RIGHTS */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border space-y-4">
              <div className="flex items-center justify-between border-b border-opella-border pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-700" />
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Governing Body & Downstream Action Unlocked
                  </h4>
                </div>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                  Decision SLA: {currentStation.sla}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">
                    Governing Forum
                  </span>
                  <span className="font-bold text-gray-900 text-sm mt-0.5 block">
                    {currentStation.forum}
                  </span>
                  <span className="text-gray-600 text-[11px] mt-0.5 block">
                    Lead Approver: <strong>{currentStation.approver}</strong>
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block flex items-center gap-1">
                    <Rocket className="w-3.5 h-3.5 text-emerald-600" />
                    Subsequent Action Triggered ('Which Makes This Happen')
                  </span>
                  <p className="text-xs font-semibold text-emerald-950 leading-relaxed">
                    {currentStation.consequence}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
