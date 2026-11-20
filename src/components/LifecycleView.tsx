"use client";

import React, { useState, useEffect } from "react";
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
  FastForward,
  Activity,
  Workflow,
  FileText,
  Paperclip,
  UploadCloud,
  Edit3,
  ExternalLink,
  HelpCircle,
  FolderCheck,
  ArrowRight,
  Sparkle,
  Lock,
  Unlock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { UseCase, GateId, GateStatus } from "@/types";
import {
  TIER_CONFIG,
  DELIVERY_MODES_INFO,
  MODE_DEEP_DIVES,
} from "@/lib/constants";
import { updateGateStatus } from "@/lib/storage";

interface LifecycleViewProps {
  useCases: UseCase[];
  selectedUseCaseId: string;
  onSelectUseCase: (id: string) => void;
  onUseCaseUpdated: (updated: UseCase) => void;
}

const GATE_ORDER: GateId[] = ["G1", "G2", "G3", "G4", "G5", "G6"];

export interface PrerequisiteItem {
  id: string;
  title: string;
  responsibleRole: string;
  roleCategory: "Finance" | "Data & AI" | "Business" | "Governance" | "Change / P&C";
  description: string;
  defaultEvidence: string;
  artifactName: string;
  collected: boolean;
  collectedAt?: string;
  collectedBy?: string;
  evidenceNotes?: string;
}

// Master configuration of the 4 mandatory prerequisites for each gate (G1 to G6)
const GATE_PREREQUISITES_CONFIG: Record<GateId, Omit<PrerequisiteItem, "collected" | "collectedAt" | "collectedBy" | "evidenceNotes">[]> = {
  G1: [
    {
      id: "g1_1",
      title: "1. Problem Statement & Friction Baseline",
      responsibleRole: "Business Owner & AI Catalyst",
      roleCategory: "Business",
      description: "Define the operational bottleneck, manual cycle time, and touchpoints causing current friction.",
      defaultEvidence: "Manual Source-to-Pay quote handling and 7-tier approvals create 7–10 day turnaround bottleneck.",
      artifactName: "Intake_Problem_Statement_v1.pdf",
    },
    {
      id: "g1_2",
      title: "2. Target User Community & Persona Scope",
      responsibleRole: "AI Catalyst (Relay in Function)",
      roleCategory: "Change / P&C",
      description: "Identify user community, estimated seat count, and geographic/market footprint.",
      defaultEvidence: "1,800 Procurement buyers and functional spenders across 14 markets in EULA, NA, and AMEA.",
      artifactName: "Target_User_Persona_Matrix.xlsx",
    },
    {
      id: "g1_3",
      title: "3. Playbook 4-Questions Assessment",
      responsibleRole: "OpellaGPT Triage Agent",
      roleCategory: "Governance",
      description: "Automated qualification against Slide 35 criteria (Big Bet, tools under €50k, pilot reach, or new hypothesis).",
      defaultEvidence: "Qualified as T1 · Transform: Big Bet 6 anchor, SAP core write-back, multi-year spend >€1M.",
      artifactName: "OpellaGPT_Triage_Certificate.json",
    },
    {
      id: "g1_4",
      title: "4. ORAI Responsible AI Screening",
      responsibleRole: "Legal & Ethics (ORAI Team)",
      roleCategory: "Governance",
      description: "5-question preliminary risk check for patient data, autonomous write-back, and model boundary.",
      defaultEvidence: "Assessed Medium Risk Tier: autonomous PO generation under human-in-the-loop threshold.",
      artifactName: "ORAI_Preliminary_Screening.pdf",
    },
  ],
  G2: [
    {
      id: "g2_1",
      title: "1. Finance Baseline Sign-off",
      responsibleRole: "Finance Business Partner (FP&A)",
      roleCategory: "Finance",
      description: "Formal Finance sign-off validating the unit economics baseline before any budget request.",
      defaultEvidence: "Manual S2P processing cost benchmarked and locked at €142 per PO across 240,000 orders/year.",
      artifactName: "Finance_Baseline_Signoff_Signed.pdf",
    },
    {
      id: "g2_2",
      title: "2. Architecture Decision Record (ADR)",
      responsibleRole: "Digital Design Authority (DDA)",
      roleCategory: "Data & AI",
      description: "Architectural clearance for API integrations, tenant private link, and Opella IQ taxonomy.",
      defaultEvidence: "ADR #2026-88 approved: SAP S/4HANA OData v4 + Azure GenAI Private Link with zero public ingress.",
      artifactName: "Architecture_ADR_v2.docx",
    },
    {
      id: "g2_3",
      title: "3. Process Redesign Check: YES",
      responsibleRole: "Transformation Office Business Architect",
      roleCategory: "Business",
      description: "Slide 47 mandate: 'Does the use case change how work is done?' (Eliminates manual approval hops).",
      defaultEvidence: "YES: Eliminates 4 manual approval hops; shifts buyers from clerical transcription to category negotiations.",
      artifactName: "AsIs_vs_ToBe_Process_Reshape.vsdx",
    },
    {
      id: "g2_4",
      title: "4. Data Boundary & Security Controls",
      responsibleRole: "CISO & Data Governance Lead",
      roleCategory: "Governance",
      description: "Access controls, tokenization, RBAC, and confirmation of zero public LLM model training.",
      defaultEvidence: "Azure Tenant isolation confirmed; SAP user-level RBAC tokenization; GDPR & EU AI Act compliant.",
      artifactName: "CISO_Security_Clearance.pdf",
    },
  ],
  G3: [
    {
      id: "g3_1",
      title: "1. VCP Prioritisation Matrix Scorecard",
      responsibleRole: "Transformation Office Lead",
      roleCategory: "Governance",
      description: "Slide 48 composite scoring: Value (30%), Strategic Fit (20%), Reach (20%), Feasibility (20%), Risk (10%).",
      defaultEvidence: "VCP Score: 92/100 (Value: 28/30, Fit: 20/20, Reach: 18/20, Feasibility: 17/20, Risk: 9/10). Ranked #1 in Big Bet 6.",
      artifactName: "BigBet6_VCP_Scorecard.xlsx",
    },
    {
      id: "g3_2",
      title: "2. Hub Delivery Capacity Allocation",
      responsibleRole: "Data & AI Hub Lead",
      roleCategory: "Data & AI",
      description: "Booking of dedicated engineering slots from the 60% Big Bet quarterly capacity pool.",
      defaultEvidence: "Committed from 60% Big Bet envelope: 1.0 Forward Deployed Engineer (FDE) + 0.5 Data Architect (6 months).",
      artifactName: "Q3_Q4_Hub_Capacity_Booking.pdf",
    },
    {
      id: "g3_3",
      title: "3. Business Owner Dedication Agreement",
      responsibleRole: "Function Head / CPO",
      roleCategory: "Business",
      description: "Formal commitment releasing business time for the designated Product Owner and testers.",
      defaultEvidence: "Sarah Chen released at 80% dedicated PO allocation; 3 regional category leads for sprint UAT.",
      artifactName: "PO_Time_Allocation_Charter.pdf",
    },
    {
      id: "g3_4",
      title: "4. Planisware Tracking Code & Stream Link",
      responsibleRole: "Control Tower & PMO",
      roleCategory: "Finance",
      description: "Project setup in corporate Planisware system for monthly RAG and quarterly value audit tracking.",
      defaultEvidence: "Planisware Initiative Code #TO-AI-2026-06 activated; linked to Corporate EBITDA Value Pool.",
      artifactName: "Planisware_Project_Sheet.pdf",
    },
  ],
  G4: [
    {
      id: "g4_1",
      title: "1. Sourcing Mode Lock (Mode 1 / 2 / 3)",
      responsibleRole: "Digital Design Authority",
      roleCategory: "Data & AI",
      description: "Slide 10–11: Mode chosen from Complexity, Budget & Capacity (Do it for me / with me / Enable me).",
      defaultEvidence: "Mode 2 ('Do it with me') ratified: Function owns category rules; Hub provides dedicated FDE & platform.",
      artifactName: "Mode_Selection_Ratification.pdf",
    },
    {
      id: "g4_2",
      title: "2. Tranche 1 Budget Unlock",
      responsibleRole: "Transformation SteerCo & Finance",
      roleCategory: "Finance",
      description: "Initial envelope release specifically for the 6–8 week MVP build and pilot market integration.",
      defaultEvidence: "Tranche 1 budget of €380,000 released for 8-week MVP Sprint in France and Spain.",
      artifactName: "Tranche1_Budget_Release_Order.pdf",
    },
    {
      id: "g4_3",
      title: "3. Tri-Partite Squad Mobilization",
      responsibleRole: "Transformation Office & Data & AI Hub",
      roleCategory: "Governance",
      description: "Slide 14: Named profiles co-assigned across Business, TO, and Data & AI Hub.",
      defaultEvidence: "Squad mobilized: BO (Sarah Chen 80%), FDE (Lucas Vance 100%), Arch (Elena 40%), Change (Ana 30%).",
      artifactName: "Tripartite_Squad_Roster.xlsx",
    },
    {
      id: "g4_4",
      title: "4. MVP Sprint Backlog & Training Plan",
      responsibleRole: "Product Owner & AI Catalyst",
      roleCategory: "Change / P&C",
      description: "Prioritized user stories for Sprint 1 + ProcurLab prompt engineering enablement clinic dates.",
      defaultEvidence: "Sprint 1 backlog groomed (14 user stories); ProcurLab AI Prompting clinics scheduled for 60 pilot buyers.",
      artifactName: "MVP_Sprint_Backlog_Signed.docx",
    },
  ],
  G5: [
    {
      id: "g5_1",
      title: "1. MVP Pilot Results & KPI Report",
      responsibleRole: "Product Owner & Lead Data Scientist",
      roleCategory: "Data & AI",
      description: "Actual pilot performance benchmarked against initial Gate G2 baseline.",
      defaultEvidence: "Pilot in France/Spain delivered 28h PO turnaround (vs 7.2d baseline) with 94.2% quote match accuracy.",
      artifactName: "Pilot_MVP_Results_Report.pdf",
    },
    {
      id: "g5_2",
      title: "2. 5-Pillar HR Workforce Impact Scan",
      responsibleRole: "P&C Counterpart & Change Lead",
      roleCategory: "Change / P&C",
      description: "Slide 64: Formal assessment of Activities, Roles, Skills, Quality of Work Life, and Works Council dialogue.",
      defaultEvidence: "5 Pillars reviewed: 42k hours freed, zero involuntary headcount cuts, ProcurLab prompt certification active.",
      artifactName: "P&C_Workforce_Impact_Scan.pdf",
    },
    {
      id: "g5_3",
      title: "3. Tranche 2 Scaling Funding Request",
      responsibleRole: "Finance BP & Transformation SteerCo",
      roleCategory: "Finance",
      description: "Budget release for enterprise expansion across all 14 markets (1,800 users).",
      defaultEvidence: "Tranche 2 (€850,000) requested and confirmed for multi-market scaling and localized SAP integrations.",
      artifactName: "Tranche2_Scale_Release_Approval.pdf",
    },
    {
      id: "g5_4",
      title: "4. Production Security Hardening Audit",
      responsibleRole: "CISO & Cyber Audit Lead",
      roleCategory: "Governance",
      description: "Penetration testing, token spend throttles, and automated prompt injection red-teaming.",
      defaultEvidence: "Zero policy violations across 420 pilot orders; rate-limiting and budget kill-switches active.",
      artifactName: "Production_Cyber_Audit_Passed.pdf",
    },
  ],
  G6: [
    {
      id: "g6_1",
      title: "1. Annual Realized Value Audit",
      responsibleRole: "Finance BP & Value Office",
      roleCategory: "Finance",
      description: "Formal audit confirming verified EBITDA and working capital improvements in the General Ledger.",
      defaultEvidence: "Confirmed €3.8M net run-rate EBITDA savings realized in P&L Cost Center 4100.",
      artifactName: "Unified_Value_Ledger_Audit.xlsx",
    },
    {
      id: "g6_2",
      title: "2. Live Cloud & Token OpEx Sentinel",
      responsibleRole: "Infra & Cyber Team",
      roleCategory: "Data & AI",
      description: "Automated telemetry tracking monthly token usage, compute drift, and cloud infrastructure costs.",
      defaultEvidence: "Live token consumption monitored under €4,500/month cap with automated anomaly alerts.",
      artifactName: "Cloud_Token_Opex_Sentinel.json",
    },
    {
      id: "g6_3",
      title: "3. Sustained User Adoption Rate",
      responsibleRole: "Change & Adoption Lead",
      roleCategory: "Change / P&C",
      description: "Weekly active users, repeat prompt engagement, and feature adoption across the buyer pool.",
      defaultEvidence: "82% weekly active buyers across 1,800 user seats; CSAT score 4.7/5 on automated PO generation.",
      artifactName: "Quarterly_Adoption_Scorecard.pdf",
    },
    {
      id: "g6_4",
      title: "4. BAU Operations Handover SLA",
      responsibleRole: "GBS Service Delivery Lead",
      roleCategory: "Business",
      description: "Formal SLA sign-off transferring first-line maintenance to GBS with tier-3 Hub support.",
      defaultEvidence: "Run SLAs formalized: 99.8% uptime target, 4h P1 incident response, model re-tuning scheduled bi-annually.",
      artifactName: "BAU_Operations_Handover_SLA.pdf",
    },
  ],
};

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

  // Per-use-case and per-gate interactive collection items state
  // Keyed by `${caseId}_${gateId}`
  const [collectionState, setCollectionState] = useState<Record<string, PrerequisiteItem[]>>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>("");

  // Initialize prerequisites for the current view
  const currentKey = currentCase ? `${currentCase.id}_${activeGateTab}` : "";

  useEffect(() => {
    if (!currentCase) return;

    const key = `${currentCase.id}_${activeGateTab}`;
    if (!collectionState[key]) {
      const gateDetail = currentCase.gates[activeGateTab];
      const isPassed = gateDetail?.status === "PASSED";
      const isCurrent = currentCase.currentGate === activeGateTab;

      // Base items template
      const itemsConfig = GATE_PREREQUISITES_CONFIG[activeGateTab] || [];
      const initializedItems: PrerequisiteItem[] = itemsConfig.map((item, idx) => {
        // If gate already passed: all are collected
        if (isPassed) {
          return {
            ...item,
            collected: true,
            collectedAt: "Verified at Gate Approval",
            collectedBy: item.responsibleRole,
            evidenceNotes: item.defaultEvidence,
          };
        }
        // If current gate (e.g. G2 for UC-GIDE): make 2 collected and 2 missing to create a real collection task!
        if (isCurrent && gateDetail?.status === "IN_REVIEW") {
          const isInitiallyCollected = idx < 2; // items 1 & 2 collected, items 3 & 4 missing
          return {
            ...item,
            collected: isInitiallyCollected,
            collectedAt: isInitiallyCollected ? "Collected Yesterday" : undefined,
            collectedBy: isInitiallyCollected ? item.responsibleRole : undefined,
            evidenceNotes: isInitiallyCollected ? item.defaultEvidence : "",
          };
        }
        // Future / Pending gate: start uncollected (0 of 4)
        return {
          ...item,
          collected: false,
          evidenceNotes: "",
        };
      });

      setCollectionState((prev) => ({
        ...prev,
        [key]: initializedItems,
      }));
    }
  }, [currentCase, activeGateTab]);

  if (!currentCase) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        No use cases found. Start by triaging an initiative using the Intake Wizard!
      </div>
    );
  }

  const tierCfg = TIER_CONFIG[currentCase.tier];
  const activeGate = currentCase.gates[activeGateTab] || currentCase.gates.G1;
  const isYouAreHere = currentCase.currentGate === activeGateTab;

  // Current collection items
  const currentPrerequisites: PrerequisiteItem[] =
    collectionState[currentKey] ||
    GATE_PREREQUISITES_CONFIG[activeGateTab].map((item, idx) => ({
      ...item,
      collected: activeGate.status === "PASSED" || (isYouAreHere && idx < 2),
      evidenceNotes: item.defaultEvidence,
    }));

  const collectedCount = currentPrerequisites.filter((p) => p.collected).length;
  const totalCount = currentPrerequisites.length || 4;
  const isAllCollected = collectedCount === totalCount;
  const collectionPercent = Math.round((collectedCount / totalCount) * 100);

  // Interactive Collection Handlers
  const handleToggleCollect = (itemId: string) => {
    setCollectionState((prev) => {
      const items = prev[currentKey] || currentPrerequisites;
      const updated = items.map((it) => {
        if (it.id === itemId) {
          const nextCollected = !it.collected;
          return {
            ...it,
            collected: nextCollected,
            collectedAt: nextCollected ? "Collected Just Now" : undefined,
            collectedBy: nextCollected ? it.responsibleRole : undefined,
            evidenceNotes: nextCollected
              ? it.evidenceNotes || it.defaultEvidence
              : "",
          };
        }
        return it;
      });
      return { ...prev, [currentKey]: updated };
    });
  };

  const handleSaveEvidence = (itemId: string, customText: string) => {
    setCollectionState((prev) => {
      const items = prev[currentKey] || currentPrerequisites;
      const updated = items.map((it) => {
        if (it.id === itemId) {
          return {
            ...it,
            collected: true,
            collectedAt: "Verified & Uploaded",
            collectedBy: it.responsibleRole,
            evidenceNotes: customText || it.defaultEvidence,
          };
        }
        return it;
      });
      return { ...prev, [currentKey]: updated };
    });
    setEditingItemId(null);
  };

  const handleAutoFillAll = () => {
    setCollectionState((prev) => {
      const items = prev[currentKey] || currentPrerequisites;
      const updated = items.map((it) => ({
        ...it,
        collected: true,
        collectedAt: "Auto-Verified via Comitology Connector",
        collectedBy: it.responsibleRole,
        evidenceNotes: it.defaultEvidence,
      }));
      return { ...prev, [currentKey]: updated };
    });
  };

  const handleResetCollection = () => {
    setCollectionState((prev) => {
      const items = prev[currentKey] || currentPrerequisites;
      const updated = items.map((it) => ({
        ...it,
        collected: false,
        collectedAt: undefined,
        collectedBy: undefined,
        evidenceNotes: "",
      }));
      return { ...prev, [currentKey]: updated };
    });
  };

  const handleUpdateStatus = async (newStatus: GateStatus, customFeedback?: string) => {
    const updated = await updateGateStatus(
      currentCase.id,
      activeGateTab,
      newStatus,
      customFeedback || feedbackInput || undefined
    );
    if (updated) {
      onUseCaseUpdated(updated);
      setFeedbackInput("");

      if (newStatus === "PASSED") {
        if (activeGateTab === "G4" || activeGateTab === "G5") {
          try {
            confetti({
              particleCount: 120,
              spread: 80,
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

  const handleSimulateStep = () => {
    setIsSimulatingAgent(true);

    if (activeGateTab === "G1") {
      setSimulationLog("Charter Agent screening: Checking AI Registry & validating value case...");
      setTimeout(() => {
        setSimulationLog("Charter Agent: ORAI risk parameters confirmed. Front-door qualification passed!");
      }, 1000);
      setTimeout(async () => {
        setIsSimulatingAgent(false);
        setSimulationLog(null);
        await handleUpdateStatus("PASSED", "OpellaGPT Charter Agent validated need and completed registry registration.");
      }, 2000);
    } else if (activeGateTab === "G2") {
      setSimulationLog("Finance & Data/AI Team: Validating financial baseline and platform architecture...");
      setTimeout(() => {
        setSimulationLog("ORAI Legal Team: Confirmed low/medium risk conditions. Feasibility confirmed.");
      }, 1000);
      setTimeout(async () => {
        setIsSimulatingAgent(false);
        setSimulationLog(null);
        await handleUpdateStatus("PASSED", "Feasibility review approved: Financial baseline grounded with Finance BP.");
      }, 2000);
    } else if (activeGateTab === "G3") {
      setSimulationLog("Transformation Office: Checking VCP value pool and quarterly hub capacity plan (60/25/15)...");
      setTimeout(() => {
        setSimulationLog("Portfolio Board: Capacity slot allocated. Priority approved!");
      }, 1000);
      setTimeout(async () => {
        setIsSimulatingAgent(false);
        setSimulationLog(null);
        await handleUpdateStatus("PASSED", "Prioritized into active backlog with allocated delivery capacity.");
      }, 2000);
    } else if (activeGateTab === "G4") {
      setSimulationLog("Design Authority: Reviewing platform fit and confirming Mode & Budget...");
      setTimeout(() => {
        setSimulationLog("Design Authority: Squad composed. GO BUILD approved for MVP!");
      }, 1000);
      setTimeout(async () => {
        setIsSimulatingAgent(false);
        setSimulationLog(null);
        await handleUpdateStatus("PASSED", "GO BUILD APPROVED: Delivery squad launched into 6-8 week MVP build.");
      }, 2000);
    } else if (activeGateTab === "G5") {
      setSimulationLog("Scale Committee: Evaluating pilot MVP KPIs against baseline & 5-pillar HR workforce scan...");
      setTimeout(() => {
        setSimulationLog("Scale Committee: Success targets met. Tranche funding unlocked for multi-market rollout!");
      }, 1000);
      setTimeout(async () => {
        setIsSimulatingAgent(false);
        setSimulationLog(null);
        await handleUpdateStatus("PASSED", "Pre-Scale Gate passed: Adoption plan validated and tranche funding released.");
      }, 2000);
    } else if (activeGateTab === "G6") {
      setSimulationLog("Value Office & Finance: Auditing realized EBITDA and live token consumption...");
      setTimeout(() => {
        setSimulationLog("Finance Sign-off: Realized value verified in unified ledger. Active maintenance confirmed.");
      }, 1000);
      setTimeout(async () => {
        setIsSimulatingAgent(false);
        setSimulationLog(null);
        await handleUpdateStatus("PASSED", "Maintain & Run validated: ROI verified against baseline; monitoring active.");
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-[1600px] 2xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 animate-fade-in">
      {/* ------------------------------------------------------------- */}
      {/* TOP INITIATIVE BANNER */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-opella-border">
          {/* Initiative Picker */}
          <div className="flex-1">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-400 block mb-1">
              Active Initiative in Real-Time Lifecycle
            </span>
            <div className="flex items-center gap-3">
              <select
                value={currentCase.id}
                onChange={(e) => {
                  onSelectUseCase(e.target.value);
                  const target = useCases.find((u) => u.id === e.target.value);
                  if (target) setActiveGateTab(target.currentGate);
                }}
                className="text-base sm:text-lg font-bold text-opella-forest bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-opella-forest focus:outline-none max-w-md w-full shadow-sm"
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

          {/* Quick Status Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-1.5">
              <Workflow className="w-3.5 h-3.5 text-emerald-600" />
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

        {/* Overview KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-gray-400 block font-medium">Lifecycle Status</span>
            <span className="font-bold text-gray-900 text-sm">{currentCase.status}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Sponsor & Governance</span>
            <span className="font-bold text-gray-900 text-sm">{currentCase.sponsor}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Envelope / Budget</span>
            <span className="font-bold text-gray-900 text-sm">€{currentCase.budget.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Target Value / ROI</span>
            <span className="font-bold text-emerald-700 text-sm">{currentCase.roiEstimate}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6 GATES CHEVRON BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-opella-forest flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" />
              Governance Pipeline: Gates G1 to G6
            </h3>
            <p className="text-xs text-gray-500">
              Click on any gate to inspect required evidence, comitology forums, and pass criteria
            </p>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Passed
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Active Station
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300" /> Pending
            </span>
          </div>
        </div>

        {/* 6 Gate Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {GATE_ORDER.map((gid) => {
            const gate = currentCase.gates[gid];
            const isSelected = activeGateTab === gid;
            const isPassed = gate.status === "PASSED";
            const isStation = currentCase.currentGate === gid;
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
                    : isStation
                    ? "border-amber-400 bg-amber-50/70 text-amber-950 hover:bg-amber-100/60 ring-2 ring-amber-400/40"
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
                        : isStation
                        ? "bg-amber-200 text-amber-950 font-bold"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {gid}
                  </span>
                  {isPassed && <CheckCircle2 className={`w-4 h-4 ${isSelected ? "text-white" : "text-emerald-600"}`} />}
                  {isStation && !isPassed && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  )}
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

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE GATE CARD & INTERACTIVE INFORMATION COLLECTION */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border space-y-6">
        {/* Gate Top Meta Bar */}
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

        {/* ============================================================= */}
        {/* "YOU ARE HERE" INTERACTIVE INFORMATION COLLECTION WORKSPACE  */}
        {/* ============================================================= */}
        <div className="bg-gradient-to-br from-[#0d2818] via-[#0b3d1c] to-[#04471c] rounded-2xl p-6 text-white shadow-lg space-y-5 border border-emerald-700/50">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 rounded-lg bg-amber-400 text-gray-950 font-black text-xs flex items-center gap-1.5 shadow-md shrink-0 mt-0.5">
                <span>📍</span>
                <span>YOU ARE HERE</span>
              </span>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-2">
                  <span>Current Station: Gate {activeGate.id} ({activeGate.phase} Phase)</span>
                  {isYouAreHere && (
                    <span className="bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded text-[10px] font-sans">
                      Active In-Flight Gate
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Information Collection & Prerequisite Verification
                </h4>
                <p className="text-xs text-white/70 mt-0.5">
                  Mandatory governance artifacts that must be actively collected and verified before the comitology body can deliberate.
                </p>
              </div>
            </div>

            {/* Quick Demo Helpers */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleAutoFillAll}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                title="Instantly mark all 4 items as collected with certified evidence for presentation"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Quick-Fill Demo Data
              </button>

              <button
                type="button"
                onClick={handleResetCollection}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-xs font-medium flex items-center gap-1 transition-colors"
                title="Reset prerequisites to uncollected state to demonstrate step-by-step collection"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* DYNAMIC USER JOURNEY GUIDANCE STATION (PER ACTIVE GATE) */}
          {/* ======================================================== */}
          {activeGateTab === "G1" && (
            <div className="bg-black/35 rounded-xl p-4 border border-emerald-400/30 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-gray-950 font-black text-[10px] uppercase tracking-wider">
                    User Journey · Stage 1
                  </span>
                  <h5 className="font-bold text-white text-sm">
                    Intake Triaged by Opella Charter Agent into {currentCase.tier} ({tierCfg.name})
                  </h5>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-400/30">
                  Automated Front-Door SLA: 5 Days
                </span>
              </div>

              {/* What this means */}
              <div className="space-y-1.5 text-xs text-white/90">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-300" />
                  This means the following for your initiative:
                </div>
                {currentCase.tier === "T1" ? (
                  <div className="space-y-1.5 leading-relaxed text-[11px]">
                    <p>
                      Classified as an <strong>Enterprise Big Bet / Transformative Strategic Initiative</strong> (part of an AmplifAI Big Bet, alters core Butterfly SAP/IBP platforms, or budget &gt; €1M).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[10px]">
                      <div className="p-2 rounded bg-black/40 border border-white/10">
                        <span className="text-emerald-300 font-bold block mb-0.5">Delivery Mode:</span>
                        <span>
                          <strong>Mode 1 ("Do it for me")</strong>: Central Data & AI Hub builds & operates; Business Function frames the need & owns business value.
                        </span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/10">
                        <span className="text-emerald-300 font-bold block mb-0.5">Capacity Allocation:</span>
                        <span>
                          Secured allocation from the <strong>60% Hub delivery capacity pool</strong> reserved for Big Bets.
                        </span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/10">
                        <span className="text-emerald-300 font-bold block mb-0.5">Process Reshape:</span>
                        <span>
                          Mandatory end-to-end <strong>process redesign</strong> to eliminate manual approval hops before MVP build.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : currentCase.tier === "T2" ? (
                  <div className="space-y-1.5 leading-relaxed text-[11px]">
                    <p>
                      Classified as <strong>T2 (Scale)</strong>: proven pilot value scaling across 500+ users or 2+ regions (€200k–€1M).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[10px]">
                      <div className="p-2 rounded bg-black/40 border border-white/10">
                        <span className="text-sky-300 font-bold block mb-0.5">Delivery Mode:</span>
                        <span>
                          <strong>Mode 2 ("Do it with me")</strong> default with shared co-funded delivery squad.
                        </span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/10">
                        <span className="text-sky-300 font-bold block mb-0.5">Capacity Pool:</span>
                        <span>
                          Evaluated in the <strong>60% capacity pool</strong> for enterprise scaling initiatives.
                        </span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/10">
                        <span className="text-sky-300 font-bold block mb-0.5">Business Case:</span>
                        <span>
                          Light Business Case (1–2 pages) with tranche release funding.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : currentCase.tier === "T3" ? (
                  <div className="space-y-1.5 leading-relaxed text-[11px]">
                    <p>
                      Classified as <strong>T3 (Fast Lane)</strong>: testing a rapid value hypothesis within a single function (€50k–€1M).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[10px]">
                      <div className="p-2 rounded bg-black/40 border border-white/10">
                        <span className="text-amber-300 font-bold block mb-0.5">Delivery Mode:</span>
                        <span>
                          <strong>Mode 3 ("Enable me")</strong> default: built autonomously by certified AI builders or SaaS.
                        </span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/10">
                        <span className="text-amber-300 font-bold block mb-0.5">Fast SLA:</span>
                        <span>
                          Strict <strong>10-day decision SLA</strong> with AI Portfolio Board.
                        </span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/10">
                        <span className="text-amber-300 font-bold block mb-0.5">Sprint Target:</span>
                        <span>
                          Focused <strong>6–8 week MVP sprint</strong> with defined kill/scale date.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] leading-relaxed">
                    Classified as <strong>Self-Service AI</strong>: personal or team productivity under €50k bypassing committee delays with automated guardrails.
                  </p>
                )}
              </div>

              {/* Review Meetings You Will Have */}
              <div className="space-y-1.5 text-xs text-white/90">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-300" />
                  Review Meetings & Comitology Forums you will have:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5 text-[10px]">
                  {currentCase.tier === "T1" ? (
                    <>
                      <div className="p-2 rounded bg-black/40 border border-emerald-400/30">
                        <div className="font-bold text-white flex justify-between">
                          <span>Stream Portfolio Board</span>
                          <span className="text-emerald-300 font-mono">Fortnightly</span>
                        </div>
                        <div className="text-white/70 mt-0.5">Validates strategic fit and assigns initial squad resources.</div>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-purple-400/30">
                        <div className="font-bold text-white flex justify-between">
                          <span>TO SteerCo (Monthly)</span>
                          <span className="text-purple-300 font-mono">Monthly</span>
                        </div>
                        <div className="text-white/70 mt-0.5">Approves enterprise portfolio entry and multi-year budget envelope.</div>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-blue-400/30">
                        <div className="font-bold text-white flex justify-between">
                          <span>Digital Design Authority</span>
                          <span className="text-blue-300 font-mono">5-Day SLA</span>
                        </div>
                        <div className="text-white/70 mt-0.5">Architectural clearance, SAP S/4HANA OData, and GenAI private endpoints.</div>
                      </div>
                    </>
                  ) : currentCase.tier === "T2" ? (
                    <>
                      <div className="p-2 rounded bg-black/40 border border-sky-400/30">
                        <div className="font-bold text-white flex justify-between">
                          <span>AI Portfolio Board</span>
                          <span className="text-sky-300 font-mono">Fortnightly</span>
                        </div>
                        <div className="text-white/70 mt-0.5">Reviews pilot metrics and multi-region scaling reach.</div>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-emerald-400/30">
                        <div className="font-bold text-white flex justify-between">
                          <span>Program Sponsors (CDO+CFO)</span>
                          <span className="text-emerald-300 font-mono">Bi-weekly</span>
                        </div>
                        <div className="text-white/70 mt-0.5">Releases tranche funding and confirms builder allocations.</div>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-purple-400/30">
                        <div className="font-bold text-white flex justify-between">
                          <span>Design Authority</span>
                          <span className="text-purple-300 font-mono">Weekly</span>
                        </div>
                        <div className="text-white/70 mt-0.5">Reviews platform fit and ORAI privacy controls.</div>
                      </div>
                    </>
                  ) : (
                    <div className="p-2 rounded bg-black/40 border border-amber-400/30 sm:col-span-3">
                      <div className="font-bold text-white flex justify-between">
                        <span>AI Portfolio Board (Only Forum Seen)</span>
                        <span className="text-amber-300 font-mono">10-Day SLA</span>
                      </div>
                      <div className="text-white/70 mt-0.5">
                        A single streamlined comitology body reviews the one-page canvas and unlocks 6–8 week sprint budget.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeGateTab === "G2" && (
            <div className="bg-black/35 rounded-xl p-4 border border-emerald-400/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-400 text-gray-950 font-black text-[10px] uppercase tracking-wider">
                    User Journey · Stage 2
                  </span>
                  <h5 className="font-bold text-white text-sm">
                    🎉 Great! You were approved at Gate G1. Here is what this means:
                  </h5>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-400/30">
                  Gate G1 Passed · G2 In-Flight
                </span>
              </div>

              {/* What it means (x, y, z) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-black/40 border border-emerald-400/30 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-gray-950 font-black text-xs flex items-center justify-center shrink-0">
                      x
                    </span>
                    <span className="font-bold text-white text-xs">
                      Formally Registered in Enterprise Pipeline
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    Officially registered in the Butterfly AI Registry and mapped to enterprise value pools with a permanent initiative ID.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-emerald-400/30 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-400 text-gray-950 font-black text-xs flex items-center justify-center shrink-0">
                      y
                    </span>
                    <span className="font-bold text-white text-xs">
                      Resource Mobilization & Co-Building Squad
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    Named delivery partners are mobilized—including dedicated AI Catalyst, Business Architect, and Lead Data Engineer.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-emerald-400/30 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-400 text-gray-950 font-black text-xs flex items-center justify-center shrink-0">
                      z
                    </span>
                    <span className="font-bold text-white text-xs">
                      Locked Comitology Schedule
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    Gate G2 Feasibility review slot locked on the agenda of the Stream Portfolio Board and SteerCo with allocated review time.
                  </p>
                </div>
              </div>

              {/* Full Business Case Section Briefing (Slide 37) */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                    Because you are in {currentCase.tier} ({tierCfg.name}), you will need to collect all the following information for your business case:
                  </span>
                  <span className="text-[10px] text-white/60 font-mono">
                    {currentCase.tier === "T1" ? "6 Mandatory Sections · Slide 37" : "Slide 38–40 Format"}
                  </span>
                </div>

                {currentCase.tier === "T1" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center">1</span>
                        Recurring Items (FY25–30)
                      </div>
                      <p className="text-white/70 text-[10px] leading-snug">
                        Bottom-up benefits, run costs, FTE hours repurposed, target P&L lines (COGS vs Commercial OpEx).
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center">2</span>
                        SI Non-Staff Enablers
                      </div>
                      <p className="text-white/70 text-[10px] leading-snug">
                        System, Infrastructure, Cyber, Data enablers with linked IDs (no double counting).
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center">3</span>
                        Resource People Costs
                      </div>
                      <p className="text-white/70 text-[10px] leading-snug">
                        Named internal roles, external contractor roles, dedication %, loaded costs, skill gap justification.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center">4</span>
                        BI Non-Staff (Vendors/SaaS)
                      </div>
                      <p className="text-white/70 text-[10px] leading-snug">
                        Supplier spend estimate, scope, RFP status (no purchase order before approval).
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center">5</span>
                        Project Plan, Risks & KPIs
                      </div>
                      <p className="text-white/70 text-[10px] leading-snug">
                        Critical path milestones, stage gates cadence every 4–6 weeks, operational risks, value KPIs.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center">6</span>
                        Executive Dashboard & Sign-Offs
                      </div>
                      <p className="text-white/70 text-[10px] leading-snug">
                        EBITDA net effect, payback months, 4-way sign-offs: Stream Lead, Finance BP, Digital Lead, Control Tower.
                      </p>
                    </div>
                  </div>
                ) : currentCase.tier === "T2" ? (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-white/80 leading-relaxed">
                    <strong>Light Business Case (1–2 Pages):</strong> Problem statement, directional value (hours saved/speed increase), build mode, builder day sizing, token consumption, and existing data fit.
                  </div>
                ) : currentCase.tier === "T3" ? (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-white/80 leading-relaxed">
                    <strong>One-Page Canvas:</strong> Value hypothesis to test, 3 measurable KPIs + baseline, 6–8 week sprint commitment, and defined kill/scale date.
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-white/80 leading-relaxed">
                    <strong>AI Registry Line:</strong> Approved tool confirmation, target user group, annual token cost cap &lt;€50k, and guardrails certification.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeGateTab === "G3" && (
            <div className="bg-black/35 rounded-xl p-4 border border-emerald-400/30 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500 text-white text-[10px] font-black">
                    User Journey · Stage 3
                  </span>
                  Prioritisation & Capacity Allocation (VCP Scorecard)
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">Forum: Transformation SteerCo & Portfolio Board</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Your initiative is evaluated against enterprise value pools using the 100-point composite formula: Value (30%), Strategic Fit (20%), Reach & Reuse (20%), Feasibility (20%), and Risk (10%). Delivery capacity is locked from the 60% Hub transformation pool.
              </p>
            </div>
          )}

          {activeGateTab === "G4" && (
            <div className="bg-black/35 rounded-xl p-4 border border-emerald-400/30 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-black">
                    User Journey · Stage 4
                  </span>
                  Mode & Budget Validation -&gt; GO BUILD
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">Forum: Digital Design Authority (5-Day SLA)</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Design Authority locks delivery mode ({currentCase.mode}), approves Tranche 1 budget release for the 6–8 week MVP build, and mobilizes the cross-functional squad across Data & AI, TO, and Business Function.
              </p>
            </div>
          )}

          {activeGateTab === "G5" && (
            <div className="bg-black/35 rounded-xl p-4 border border-emerald-400/30 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500 text-white text-[10px] font-black">
                    User Journey · Stage 5
                  </span>
                  Pre-Scale Validation (Scale Gate)
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">Forum: Scale Committee / TO SteerCo</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Pilot MVP results are benchmarked against the Gate G2 baseline. The 5-Pillar HR Workforce Impact Scan is completed, and Tranche 2 scaling funding is unlocked for multi-market expansion.
              </p>
            </div>
          )}

          {activeGateTab === "G6" && (
            <div className="bg-black/35 rounded-xl p-4 border border-emerald-400/30 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-gray-950 text-[10px] font-black">
                    User Journey · Stage 6
                  </span>
                  Maintain & Run Validation (Unified Value Ledger)
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">Forum: Scale Committee & Finance Sign-Off (+6/+12 mo)</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Finance conducts formal value audit in the Unified Value Ledger. Automated cloud and token sentinels continuously monitor compute drift and run-rate costs against verified EBITDA savings.
              </p>
            </div>
          )}

          {/* Interactive Progress Meter */}
          <div className="bg-black/25 rounded-xl p-3.5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-200 flex items-center gap-2">
                <span>Collection Progress:</span>
                <span className="font-mono text-white text-sm">
                  {collectedCount} of {totalCount} Items Collected ({collectionPercent}%)
                </span>
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  isAllCollected
                    ? "bg-emerald-400 text-emerald-950"
                    : "bg-amber-400/30 text-amber-200 border border-amber-400/40"
                }`}
              >
                {isAllCollected
                  ? "✓ Ready for Gate Review"
                  : `⚠️ ${totalCount - collectedCount} Items Required`}
              </span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isAllCollected ? "bg-emerald-400" : "bg-gradient-to-r from-amber-400 to-emerald-400"
                }`}
                style={{ width: `${collectionPercent}%` }}
              />
            </div>
          </div>

          {/* 4 Interactive Prerequisite Collection Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-white/80">
              <span className="font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                Mandatory Prerequisites to Collect Before Convening Gate {activeGate.id}:
              </span>
              <span className="text-[11px] text-white/60">
                Click on any card to confirm collection or edit evidence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {currentPrerequisites.map((prereq) => {
                const isEditing = editingItemId === prereq.id;

                return (
                  <div
                    key={prereq.id}
                    className={`rounded-xl p-4 transition-all border ${
                      prereq.collected
                        ? "bg-white/10 border-emerald-400/40 shadow-sm"
                        : "bg-black/30 border-amber-400/50 shadow-md ring-1 ring-amber-400/20"
                    }`}
                  >
                    {/* Item Top Bar */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/15 text-emerald-200 border border-white/10">
                            {prereq.responsibleRole}
                          </span>
                          <span className="text-[10px] text-white/60">
                            {prereq.roleCategory}
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-sm">
                          {prereq.title}
                        </h5>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                          prereq.collected
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-amber-400 text-gray-950 animate-pulse font-bold"
                        }`}
                      >
                        {prereq.collected ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" /> Collected
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" /> Missing
                          </>
                        )}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-[11px] leading-relaxed mb-3">
                      {prereq.description}
                    </p>

                    {/* Collected View */}
                    {prereq.collected && !isEditing && (
                      <div className="bg-emerald-950/60 border border-emerald-400/30 rounded-lg p-2.5 space-y-2">
                        <div className="text-[11px] text-emerald-100 font-medium leading-relaxed">
                          "{prereq.evidenceNotes || prereq.defaultEvidence}"
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-emerald-300/80 pt-1 border-t border-emerald-800/40">
                          <span className="flex items-center gap-1 font-mono">
                            <Paperclip className="w-3 h-3 text-amber-300" />
                            {prereq.artifactName}
                          </span>
                          <div className="flex items-center gap-2">
                            <span>{prereq.collectedAt || "Verified"}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItemId(prereq.id);
                                setTempNotes(prereq.evidenceNotes || prereq.defaultEvidence);
                              }}
                              className="text-amber-300 hover:text-white underline font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleCollect(prereq.id)}
                              className="text-white/60 hover:text-rose-300 underline"
                            >
                              Undo
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Missing State / Inline Collection Input */}
                    {(!prereq.collected || isEditing) && (
                      <div className="bg-black/40 border border-amber-300/40 rounded-lg p-3 space-y-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                            <span>Input Verified Evidence / Reference:</span>
                            <span className="text-white/50 text-[9px] font-normal">
                              Default template ready to confirm
                            </span>
                          </label>
                          <textarea
                            rows={2}
                            value={isEditing ? tempNotes : (prereq.evidenceNotes || prereq.defaultEvidence)}
                            onChange={(e) => {
                              if (isEditing) {
                                setTempNotes(e.target.value);
                              } else {
                                const val = e.target.value;
                                setCollectionState((prev) => {
                                  const items = prev[currentKey] || currentPrerequisites;
                                  return {
                                    ...prev,
                                    [currentKey]: items.map((it) =>
                                      it.id === prereq.id ? { ...it, evidenceNotes: val } : it
                                    ),
                                  };
                                });
                              }
                            }}
                            className="w-full bg-white/10 border border-white/20 rounded-md p-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans leading-relaxed"
                            placeholder="Describe collected sign-off, metrics, or decision..."
                          />
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                            <Paperclip className="w-3 h-3 text-amber-300" />
                            <span className="font-mono truncate max-w-[150px]">
                              {prereq.artifactName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => setEditingItemId(null)}
                                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs"
                              >
                                Cancel
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                if (isEditing) {
                                  handleSaveEvidence(prereq.id, tempNotes);
                                } else {
                                  handleToggleCollect(prereq.id);
                                }
                              }}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              {isEditing ? "Save & Verify" : "Confirm & Mark Collected"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comitology Decision Readiness Callout */}
          <div className="pt-2 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isAllCollected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <span className="font-medium text-white/90">
                {isAllCollected ? (
                  <strong className="text-emerald-300 font-bold">
                    All 4 prerequisites collected & verified. The dossier is complete for Gate {activeGate.id} decision.
                  </strong>
                ) : (
                  <span className="text-amber-200">
                    <strong>{totalCount - collectedCount} item(s) pending collection.</strong> Please confirm the required evidence above to proceed.
                  </span>
                )}
              </span>
            </div>

            {/* Quick Auto-Advance if all collected */}
            {isAllCollected && (
              <span className="text-[11px] text-emerald-200 font-bold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                Ready for Comitology Sign-off
              </span>
            )}
          </div>
        </div>

        {/* ============================================================= */}
        {/* MULTI-DIMENSIONAL REVIEW CRITERIA (SLIDE 45 & 79) */}
        {/* ============================================================= */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
            <span>Multi-Dimensional Gate Review Criteria (Slide 79)</span>
            <span className="text-[11px] text-gray-500 font-normal">
              Evaluated across 4 streams
            </span>
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

        {/* Committee / Agent Feedback Note */}
        {activeGate.feedback && (
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-opella-forest shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">Official Committee Verdict Note:</strong>{" "}
              <span>{activeGate.feedback}</span>
            </div>
          </div>
        )}

        {/* Gate G4 Deep Dive: Mode Zoom, WHY Selected & 3-Way Team Disposition */}
        {activeGateTab === "G4" && MODE_DEEP_DIVES[currentCase.mode] && (
          <div className="p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-600/30 space-y-4">
            <div className="border-b border-emerald-200/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                  Gate G4 Mode Selection Zoom
                </span>
                <h4 className="text-base font-black text-opella-forest mt-1">
                  Selected Mode: {MODE_DEEP_DIVES[currentCase.mode].title} ·{" "}
                  <span className="italic font-serif text-emerald-800 text-sm font-normal">
                    {MODE_DEEP_DIVES[currentCase.mode].motto}
                  </span>
                </h4>
                <p className="text-xs text-gray-700 mt-0.5">
                  {MODE_DEEP_DIVES[currentCase.mode].ownershipSplit}
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded bg-white text-emerald-900 border border-emerald-300 self-start sm:self-auto">
                Design Authority Locked
              </span>
            </div>

            {/* WHY this Mode was selected */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <div className="font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                WHY Was {currentCase.mode} Selected for this Use Case?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] pt-1">
                <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                  <span className="text-gray-400 font-bold block uppercase text-[10px]">Complexity</span>
                  <span className="font-semibold text-gray-900">
                    {MODE_DEEP_DIVES[currentCase.mode].whySelected.technicalComplexityProfile}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                  <span className="text-gray-400 font-bold block uppercase text-[10px]">Function Capability</span>
                  <span className="font-semibold text-gray-900">
                    {MODE_DEEP_DIVES[currentCase.mode].whySelected.functionTechCapabilityRequired}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                  <span className="text-gray-400 font-bold block uppercase text-[10px]">Platform Fit</span>
                  <span className="font-semibold text-emerald-800">
                    {MODE_DEEP_DIVES[currentCase.mode].whySelected.platformFit}
                  </span>
                </div>
              </div>
              <div className="space-y-1 pt-1 text-gray-700 text-xs">
                {MODE_DEEP_DIVES[currentCase.mode].whySelected.primaryDrivers.map((driver, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dedicated Team at Disposition */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                Team Put at the Disposition of this Use Case:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Data & AI */}
                <div className="p-3.5 rounded-xl bg-white border border-blue-200 space-y-2">
                  <div className="font-bold text-blue-900 uppercase text-[11px] border-b border-blue-100 pb-1 flex items-center justify-between">
                    <span>Data & AI Hub Team</span>
                    <span className="text-[10px] bg-blue-100 px-1.5 py-0.2 rounded">Engineering</span>
                  </div>
                  <div className="space-y-2">
                    {MODE_DEEP_DIVES[currentCase.mode].teamDisposition.dataAndAiTeam.map((mem, i) => (
                      <div key={i} className="text-[11px] leading-tight">
                        <div className="font-bold text-gray-900 flex justify-between">
                          <span>{mem.role}</span>
                          <span className="text-blue-800 font-mono text-[10px]">{mem.allocation}</span>
                        </div>
                        <div className="text-gray-500 mt-0.5">{mem.responsibility}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TO */}
                <div className="p-3.5 rounded-xl bg-white border border-purple-200 space-y-2">
                  <div className="font-bold text-purple-900 uppercase text-[11px] border-b border-purple-100 pb-1 flex items-center justify-between">
                    <span>Transformation Office</span>
                    <span className="text-[10px] bg-purple-100 px-1.5 py-0.2 rounded">Governance</span>
                  </div>
                  <div className="space-y-2">
                    {MODE_DEEP_DIVES[currentCase.mode].teamDisposition.transformationOffice.map((mem, i) => (
                      <div key={i} className="text-[11px] leading-tight">
                        <div className="font-bold text-gray-900 flex justify-between">
                          <span>{mem.role}</span>
                          <span className="text-purple-800 font-mono text-[10px]">{mem.allocation}</span>
                        </div>
                        <div className="text-gray-500 mt-0.5">{mem.responsibility}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Function */}
                <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2">
                  <div className="font-bold text-emerald-900 uppercase text-[11px] border-b border-emerald-100 pb-1 flex items-center justify-between">
                    <span>Business Function</span>
                    <span className="text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded">Domain PO</span>
                  </div>
                  <div className="space-y-2">
                    {MODE_DEEP_DIVES[currentCase.mode].teamDisposition.businessFunction.map((mem, i) => (
                      <div key={i} className="text-[11px] leading-tight">
                        <div className="font-bold text-gray-900 flex justify-between">
                          <span>{mem.role}</span>
                          <span className="text-emerald-800 font-mono text-[10px]">{mem.allocation}</span>
                        </div>
                        <div className="text-gray-500 mt-0.5">{mem.responsibility}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Simulation Banner */}
        {isSimulatingAgent && simulationLog && (
          <div className="p-4 bg-emerald-900 text-emerald-100 rounded-xl text-xs font-mono space-y-1 flex items-start gap-3 border border-emerald-600">
            <Bot className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="font-bold text-white mb-1">Simulating Committee & Agent Gate Review...</div>
              <div>{simulationLog}</div>
            </div>
          </div>
        )}

        {/* Action Controls & Interactive Simulation */}
        <div className="pt-4 border-t border-opella-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex-1 max-w-md">
            <input
              type="text"
              placeholder="Add optional committee review notes or approval conditions..."
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opella-forest"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Simulate Step Button */}
            <button
              type="button"
              onClick={handleSimulateStep}
              disabled={isSimulatingAgent}
              className="px-4 py-2 bg-purple-700 text-white rounded-lg text-xs font-bold hover:bg-purple-800 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              title="Run automated simulation of committee/agent decision"
            >
              <Bot className="w-4 h-4 text-purple-200" />
              Simulate Gate Review
            </button>

            <button
              type="button"
              onClick={() => handleUpdateStatus("FAILED")}
              className="px-3.5 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Re-scope / Block
            </button>

            {/* Approve Button with Collection Check */}
            <button
              type="button"
              onClick={() => handleUpdateStatus("PASSED")}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                isAllCollected
                  ? "bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95"
                  : "bg-emerald-800 text-emerald-100 hover:bg-emerald-900 border border-emerald-600"
              }`}
              title={
                isAllCollected
                  ? "Approve and advance use case to next lifecycle gate"
                  : "Prerequisites partially collected. You can still approve or click Quick-Fill above."
              }
            >
              <Check className="w-4 h-4" />
              {isAllCollected ? "Approve & Advance Gate" : `Advance Gate (${collectedCount}/4 Collected)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
