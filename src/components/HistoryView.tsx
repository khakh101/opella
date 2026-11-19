"use client";

import React, { useState } from "react";
import {
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  Building,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Paperclip,
  Check,
  ChevronRight,
  Bot,
  ExternalLink,
  Users,
  Briefcase,
  Zap,
  Calendar,
  Rocket,
  Scale,
  FolderOpen,
} from "lucide-react";
import { UseCase, GateId, GateDetail, GateSubmissionData, GateDecisionRecord } from "@/types";
import { GATES_CONFIG } from "@/lib/constants";

interface HistoryViewProps {
  useCases: UseCase[];
  selectedUseCaseId?: string;
  onSelectUseCase?: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  useCases,
  selectedUseCaseId,
  onSelectUseCase,
}) => {
  // Default to GIDE if available, else first usecase
  const defaultId =
    useCases.find((u) => u.id === "UC-GIDE")?.id ||
    selectedUseCaseId ||
    useCases[0]?.id ||
    "";

  const [currentId, setCurrentId] = useState<string>(defaultId);
  const [activeGateId, setActiveGateId] = useState<GateId>("G5");

  const currentUseCase = useCases.find((u) => u.id === currentId) || useCases[0];

  const handleSelectUseCase = (id: string) => {
    setCurrentId(id);
    if (onSelectUseCase) onSelectUseCase(id);
  };

  if (!currentUseCase) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-500">
        No use cases available. Please create or import one first.
      </div>
    );
  }

  // Gate list
  const gateIds: GateId[] = ["G1", "G2", "G3", "G4", "G5", "G6"];
  const currentGateDetail: GateDetail = currentUseCase.gates[activeGateId] || {
    id: activeGateId,
    name: GATES_CONFIG[activeGateId]?.name || activeGateId,
    phase: GATES_CONFIG[activeGateId]?.phase || "Framing",
    decision: GATES_CONFIG[activeGateId]?.decision || "",
    type: GATES_CONFIG[activeGateId]?.type || "MANUAL",
    approver: GATES_CONFIG[activeGateId]?.approver || "Governance Board",
    forum: GATES_CONFIG[activeGateId]?.forum || "AI Portfolio Board",
    sla: GATES_CONFIG[activeGateId]?.sla || "10 days",
    status: "PENDING",
    multiDimensionalReview: {
      value: "Value review in progress against enterprise business case.",
      complexity: "Technical feasibility and enterprise architecture review.",
      risk: "ORAI risk screening and compliance verification.",
      adoption: "Workforce adoption plan and change management readiness.",
    },
  };

  // Helper to retrieve or synthesize submission dossier if not explicitly stored
  const getSubmissionDossier = (gateId: GateId): GateSubmissionData => {
    if (currentGateDetail.submissionData) {
      return currentGateDetail.submissionData;
    }

    // Dynamic contextual fallback for cases without explicit data
    const title = currentUseCase.title;
    const owner = currentUseCase.owner;
    const functionName = currentUseCase.functionName;
    const tier = currentUseCase.tier;

    switch (gateId) {
      case "G1":
        return {
          summary: `Initial Charter Intake Dossier for ${title}`,
          submittedBy: `${owner} (Business Owner) & AI Catalyst`,
          submittedAt: currentUseCase.createdAt || "2026-06-15T09:30:00Z",
          keyInputsFilled: {
            "Initiative Title": title,
            "Business Function": functionName,
            "Problem Statement": currentUseCase.description,
            "Target User Personas":
              currentUseCase.intakeAnswers?.targetUserGroupDescription ||
              `${currentUseCase.intakeAnswers?.targetUserCount || 250} active staff in ${functionName}`,
            "Proposed Technology":
              currentUseCase.intakeAnswers?.technologyProposed ||
              "Azure GenAI & Opella AI Platform",
            "Estimated ROI / Value":
              currentUseCase.roiEstimate || "Directional opex savings",
            "Proposed Budget Envelope": `€${(currentUseCase.budget || 200000).toLocaleString()}`,
          },
          metricsOrCosts: `Budget envelope: €${(currentUseCase.budget || 200000).toLocaleString()}`,
          artifactsAttached: [`${currentUseCase.id}_Project_Charter.pdf`],
        };
      case "G2":
        return {
          summary: `G2 Feasibility Dossier & Architectural Validation for ${title}`,
          submittedBy: `${owner} & Data & AI Hub Squad`,
          submittedAt: "2026-07-01T10:00:00Z",
          keyInputsFilled: {
            "Finance Baseline Sign-off": "Verified by Finance Business Partner against current operational costs.",
            "Technical Feasibility": "API connectivity verified with source enterprise databases.",
            "Process Redesign (Yes/No)": "YES - Process rewritten to remove manual handoffs.",
            "ORAI Security Controls": "Private Azure tenant, RBAC, zero public training.",
          },
          metricsOrCosts: `Cost benchmark: €${(currentUseCase.budget || 200000).toLocaleString()}`,
          artifactsAttached: ["Architecture_Decision_Record_ADR.pdf", "Finance_Baseline_Signoff.pdf"],
        };
      case "G3":
        return {
          summary: `G3 Prioritisation & Capacity Slot Request for ${title}`,
          submittedBy: "Transformation Office Stream Lead",
          submittedAt: "2026-07-15T11:00:00Z",
          keyInputsFilled: {
            "Strategic Alignment": `Directly supports ${functionName} digital transformation priorities.`,
            "Requested Hub Capacity": "1 Forward Deployed Engineer (0.5 FTE) + 1 Data Engineer.",
            "Business Resource Dedicated": `Named Business PO: ${owner} (minimum 50% allocation).`,
          },
          metricsOrCosts: "Capacity slot confirmed in AI Portfolio Backlog",
          artifactsAttached: ["Prioritisation_Scoring_Matrix.xlsx"],
        };
      case "G4":
        return {
          summary: `G4 Sourcing Mode & MVP Launch Dossier for ${title}`,
          submittedBy: `${owner} & Lead AI Catalyst`,
          submittedAt: "2026-08-01T14:00:00Z",
          keyInputsFilled: {
            "Selected Delivery Mode": `${currentUseCase.mode} (${
              currentUseCase.mode === "Mode 1"
                ? "Do it for me / Central Hub"
                : currentUseCase.mode === "Mode 2"
                ? "Do it with me / Joint Squad"
                : "Enable me / Business Lead"
            })`,
            "Tranche 1 MVP Budget": `€${Math.round((currentUseCase.budget || 200000) * 0.3).toLocaleString()} released for MVP build`,
            "MVP Sprint Duration": "6–8 weeks",
            "Change Management Plan": "User clinic and prompt coaching sessions scheduled",
          },
          metricsOrCosts: `Tranche 1: €${Math.round((currentUseCase.budget || 200000) * 0.3).toLocaleString()} unlocked`,
          artifactsAttached: ["MVP_Sprint_Plan.pdf", "Change_Management_Outline.pdf"],
        };
      case "G5":
        return {
          summary: `G5 Pre-Scale Gate Submission: MVP Results for ${title}`,
          submittedBy: `${owner} & MVP Delivery Squad`,
          submittedAt: "2026-10-20T16:00:00Z",
          keyInputsFilled: {
            "Pilot Scope & Reach": `Piloted with pilot users in ${currentUseCase.region}.`,
            "Measured Turnaround Speed": "Turnaround time improved by >60% compared to baseline.",
            "Accuracy / Quality Rate": "92.5% user satisfaction and output accuracy.",
            "5-Pillar Workforce Scan": "Assessed across Activities, Roles, Skills, QWL, and Ethics.",
            "Tranche 2 Funding Request": `€${Math.round((currentUseCase.budget || 200000) * 0.7).toLocaleString()} for enterprise scale`,
          },
          metricsOrCosts: `Tranche 2: €${Math.round((currentUseCase.budget || 200000) * 0.7).toLocaleString()}`,
          artifactsAttached: ["MVP_Pilot_Results_Report.pdf", "Workforce_Impact_Scan.pdf"],
        };
      case "G6":
      default:
        return {
          summary: `G6 Maintain & Run Realized Value Dossier for ${title}`,
          submittedBy: `${owner} (Run Owner) & Finance Lead`,
          submittedAt: "2027-02-15T09:00:00Z",
          keyInputsFilled: {
            "Realized Value Target": currentUseCase.roiEstimate || "€1.2M EBITDA run-rate benefit",
            "Run Token & Opex Cost": "€1,800/month average infrastructure cost",
            "Continuous ORAI Checks": "Passed quarterly fairness and drift checks",
            "Sustained User Adoption": "78% weekly active user rate maintained",
          },
          metricsOrCosts: "Run cost: ~€22k/yr vs confirmed net ROI",
          artifactsAttached: ["Annual_Value_Realization_Audit.pdf", "ORAI_Drift_Audit.pdf"],
        };
    }
  };

  // Helper to retrieve or synthesize decision record if not explicitly stored
  const getDecisionRecord = (gateId: GateId): GateDecisionRecord => {
    if (currentGateDetail.decisionRecord) {
      return currentGateDetail.decisionRecord;
    }

    const title = currentUseCase.title;
    const isPassed =
      currentGateDetail.status === "PASSED" ||
      (currentUseCase.status === "RUN" && gateId !== "G6");

    switch (gateId) {
      case "G1":
        return {
          verdict: "APPROVED",
          decisionTitle: "G1 Front Door Qualification Passed",
          decidedBy: "Charter Agent (OpellaGPT) & AI Catalyst",
          decidedAt: "2026-06-20T11:00:00Z",
          forum: "Front Door Charter Triage",
          subsequentAction: `Assigned to ${currentUseCase.tier} speed lane. Unlocked Gate G2 Feasibility dossier.`,
          conditionsOrFeedback: [
            "Ensure business problem statement focuses on measurable operational outcomes.",
            "Schedule preliminary alignment with Data & AI Catalyst.",
          ],
        };
      case "G2":
        return {
          verdict: "APPROVED",
          decisionTitle: "G2 Feasibility & Business Case Confirmed",
          decidedBy: "Data & AI Hub Lead & Finance BP",
          decidedAt: "2026-07-08T15:30:00Z",
          forum: "Digital Design Authority (DDA)",
          subsequentAction: "Promoted to Enterprise Prioritisation (Gate G3) for quarterly Hub capacity slot.",
          conditionsOrFeedback: [
            "Finance BP verified baseline operational benchmark.",
            "ORAI data boundary confirmed; no sensitive customer personal health data involved.",
          ],
        };
      case "G3":
        return {
          verdict: "APPROVED",
          decisionTitle: "G3 Enterprise Prioritisation & Capacity Allocated",
          decidedBy: "Transformation SteerCo / AI Portfolio Board",
          decidedAt: "2026-07-22T16:00:00Z",
          forum: "AI Portfolio Board (Fortnightly)",
          subsequentAction: "Proceeded to Gate G4 to finalize Delivery Mode and release initial MVP budget.",
          conditionsOrFeedback: [
            "Hub capacity allocated from quarterly transformation envelope.",
            "Quarterly value reporting required in unified value ledger.",
          ],
        };
      case "G4":
        return {
          verdict: "APPROVED (GO BUILD)",
          decisionTitle: `GO BUILD APPROVED: ${currentUseCase.mode} Squad Launched`,
          decidedBy: "Design Authority & Tier Approver",
          decidedAt: "2026-08-05T17:00:00Z",
          forum: "Design Authority (Weekly)",
          subsequentAction: "Phase II Build MVP initiated. Sprints tracked bi-weekly in Planisware.",
          conditionsOrFeedback: [
            `Delivery mode locked to ${currentUseCase.mode}.`,
            "Tranche 1 funding released. 6–8 week fail-fast sprint gate set for Gate G5.",
          ],
        };
      case "G5":
        return {
          verdict: currentGateDetail.status === "IN_REVIEW" ? "IN_REVIEW" : "APPROVED",
          decisionTitle:
            currentGateDetail.status === "IN_REVIEW"
              ? "Scale Gate Under Final Review by SteerCo"
              : "G5 Scale Gate Approved for Enterprise Rollout",
          decidedBy: "Transformation SteerCo Scale Committee",
          decidedAt: currentGateDetail.updatedAt || "2026-11-18T14:30:00Z",
          forum: "Scale & Big Bet Review (Quarterly)",
          subsequentAction:
            currentGateDetail.status === "IN_REVIEW"
              ? "Awaiting final CPO & CFO sign-off to release Tranche 2 funding."
              : "Tranche 2 enterprise scaling budget unlocked. Broad rollout launched across regions.",
          conditionsOrFeedback: [
            "Pilot demonstrated target turnaround speed and user satisfaction threshold.",
            "Workforce impact scan verified: task augmentation model with comprehensive user upskilling.",
          ],
        };
      case "G6":
      default:
        return {
          verdict: currentGateDetail.status === "PASSED" ? "APPROVED" : "IN_REVIEW",
          decisionTitle:
            currentGateDetail.status === "PASSED"
              ? "G6 Value Realization Validated: Permanent BAU Run Confirmed"
              : "G6 Maintain & Run Review Pending Post-Implementation",
          decidedBy: "Product Owner (Run Owner) + Finance BP",
          decidedAt: currentGateDetail.updatedAt || "2027-04-22T14:00:00Z",
          forum: "Scale & Adoption Committee (Quarterly)",
          subsequentAction:
            currentGateDetail.status === "PASSED"
              ? "Confirmed into permanent production BAU Run mode. Transitioned to operational maintenance SLA."
              : "Scheduled for +6 month post-launch value realization audit.",
          conditionsOrFeedback: [
            "Annual re-certification of ORAI compliance mandatory.",
            "Unified value ledger audit required each fiscal half-year.",
          ],
        };
    }
  };

  const getChronologicalNarrative = (gateId: GateId) => {
    const isGide = currentUseCase.id === "UC-GIDE";
    const title = currentUseCase.title;
    const owner = currentUseCase.owner;
    const tier = currentUseCase.tier;
    const mode = currentUseCase.mode;

    switch (gateId) {
      case "G1":
        return {
          headline: `Gate G1 Action Narrative: From Problem Intake to T1 Speed Lane Qualification`,
          step1_upload: {
            date: "15 Jun 2026 · 09:30 CET",
            actor: `${owner} & AI Catalyst`,
            action: "Uploaded Initial Charter & Problem Dossier",
            docs: isGide
              ? ["GIDE_Project_Charter_v1.pdf", "Procurement_S2P_AsIs_Process.vsdx", "ORAI_Intake_Screening.pdf"]
              : [`${currentUseCase.id}_Project_Charter.pdf`, "ORAI_Initial_Screening.pdf"],
            summary: isGide
              ? "Documented manual S2P friction (7-10 days per PO, €142 processing cost) and proposed BOWIE autonomous agent."
              : `Submitted intake charter outlining operational friction and proposed AI solution for ${currentUseCase.functionName}.`,
            consequence: "Triggered Front Door Charter intake workflow and scheduled review on committee agenda.",
          },
          step2_meeting: {
            date: "18 Jun 2026 · 14:00 CET",
            meetingName: "Front Door Charter Triage Session #24",
            forum: "Front Door Intake (Triage to T1/T2/T3/Self-serve)",
            attendees: [
              "Charter Agent (OpellaGPT)",
              "Lead AI Catalyst (Data & AI Hub)",
              "Procurement Finance BP",
              "ORAI Compliance Officer",
            ],
            keyChecks: [
              "Verified manual processing baseline benchmark against operational spend.",
              `Confirmed target user reach (${currentUseCase.intakeAnswers?.targetUserCount || 1800} users across key market clusters).`,
              "Screened Responsible AI boundaries under EU AI Act rules (Medium risk, no patient data).",
            ],
            consequence: "Drafted favorable triage recommendation and routed dossier to deciding authority.",
          },
          step3_decision: {
            date: "20 Jun 2026 · 11:00 CET",
            verdict: "APPROVED",
            decidedBy: "OpellaGPT Charter Agent & AI Catalyst Lead",
            forum: "Front Door Charter Triage",
            reasons: [
              "Reason X: Strategic Mandate — Problem aligns directly with Butterfly Big Bet 6 (Touchless S2P Process Reshapes).",
              `Reason Y: Value Sizing — Expected return (${currentUseCase.roiEstimate || "€3.8M savings"}) clears the >€1M T1 threshold with 11-month payback.`,
              "Reason Z: Risk Controls — ORAI boundary secured within private Azure GenAI boundary with mandatory human review for orders >€50k.",
            ],
          },
          step4_consequence: {
            date: "20 Jun 2026 · 11:05 CET",
            actor: "Transformation Office PMO",
            actionTitle: "Downstream Actions Triggered ('Which Made This Happen')",
            actionsUnlocked: [
              `🚀 Classified initiative into ${tier} Speed Lane with monthly SteerCo governance oversight.`,
              "🚀 Automatically unlocked Gate G2 Feasibility dossier in the Opella AmplifAI portal.",
              "🚀 Assigned dedicated Hub Forward Deployed Engineer (1.0 FTE) and Data Architect (0.5 FTE).",
              `🚀 Initialized tracking code BUTTERFLY-${currentUseCase.id} in Planisware corporate ledger.`,
            ],
          },
        };

      case "G2":
        return {
          headline: `Gate G2 Action Narrative: Feasibility Validation & Financial Baseline Sign-off`,
          step1_upload: {
            date: "28 Jun 2026 · 14:00 CET",
            actor: `${owner} & Data Architecture Squad`,
            action: "Uploaded Feasibility Dossier & Architectural Decision Record",
            docs: isGide
              ? ["GIDE_Architecture_ADR_v2.docx", "Finance_Baseline_Signoff_Signed.pdf", "Data_Cleanliness_Audit.xlsx"]
              : ["Architecture_Decision_Record_ADR.pdf", "Finance_Baseline_Signoff.pdf"],
            summary: "Grounded the financial baseline cost (€142/PO) and verified SAP S/4HANA OData API bi-directional connectivity.",
            consequence: "Convened Digital Design Authority technical panel and Finance Business Partner validation.",
          },
          step2_meeting: {
            date: "04 Jul 2026 · 10:30 CET",
            meetingName: "Digital Design Authority (DDA) Technical Review #14",
            forum: "Digital Design Authority & Stream Approvers",
            attendees: [
              "Thomas Rouckout (TO Lead)",
              "Enterprise AI Architect (Data & AI Hub)",
              "Senior Finance BP",
              "CISO Cyber Security Specialist",
            ],
            keyChecks: [
              "Validated 2-year historical purchase order dataset cleaned in Databricks gold layer.",
              "Explicit Process Redesign verified: YES (removes 4 manual approval hops).",
              "Confirmed zero public LLM training; private tenant endpoint verified.",
            ],
            consequence: "Issued formal technical endorsement and signed off financial baseline model.",
          },
          step3_decision: {
            date: "08 Jul 2026 · 15:30 CET",
            verdict: "APPROVED",
            decidedBy: "Digital Design Authority & Finance BP",
            forum: "Digital Design Authority (DDA)",
            reasons: [
              "Reason X: Architectural Integrity — Azure GenAI Private Link and SAP OData APIs proven with synthetic payload.",
              "Reason Y: Financial Grounding — Finance BP certified €142 baseline cost per manual PO across 240,000 annual transactions.",
              "Reason Z: Process Transformation — Confirmed buyer role shift from manual transactional entry to high-value supplier negotiation.",
            ],
          },
          step4_consequence: {
            date: "08 Jul 2026 · 15:35 CET",
            actor: "Transformation SteerCo Secretariat",
            actionTitle: "Downstream Actions Triggered ('Which Made This Happen')",
            actionsUnlocked: [
              "🚀 Unlocked Gate G3 Enterprise Prioritisation slot on the upcoming SteerCo executive agenda.",
              "🚀 Mandated Spain and France pilot wave before broader European rollout.",
              "🚀 Reserved dedicated semantic layer architect in Data & AI Hub for taxonomy mapping.",
            ],
          },
        };

      case "G3":
        return {
          headline: `Gate G3 Action Narrative: Enterprise Prioritisation & Hub Capacity Allocation`,
          step1_upload: {
            date: "15 Jul 2026 · 10:00 CET",
            actor: "Transformation Office Stream Lead",
            action: "Uploaded Prioritisation Dossier & Capacity Request",
            docs: ["BigBet6_Prioritisation_Matrix.xlsx", "Hub_Resource_Allocation_Request.pdf"],
            summary: "Submitted VCP alignment scoring (92/100) and requested 1.0 FDE + 0.5 Data Architect capacity for Q3/Q4.",
            consequence: "Placed initiative at top of agenda for Transformation SteerCo monthly prioritization.",
          },
          step2_meeting: {
            date: "20 Jul 2026 · 16:00 CET",
            meetingName: "Transformation SteerCo Executive Session",
            forum: "Transformation SteerCo (Monthly) / AI Portfolio Board",
            attendees: [
              "Gentiane Barret (CDO / SteerCo Lead)",
              "Marc Lefebvre (CPO / ExCo Bet Sponsor)",
              "Chief Financial Officer Representative",
              "Head of Transformation Office",
            ],
            keyChecks: [
              "Reviewed capacity envelope split (60% Big Bets allocation confirmed).",
              "Verified business resource commitment (Sarah Chen named at 80% time).",
              "Evaluated interdependencies with Opella IQ product taxonomy release.",
            ],
            consequence: "Confirmed priority slotting and authorized Hub staffing commitment.",
          },
          step3_decision: {
            date: "22 Jul 2026 · 16:00 CET",
            verdict: "APPROVED",
            decidedBy: "Transformation SteerCo (CDO & ExCo Sponsors)",
            forum: "Transformation SteerCo (Monthly)",
            reasons: [
              "Reason X: Strategic Ranking — Ranked #1 in Big Bet 6 pipeline with 92/100 VCP aggregate score.",
              "Reason Y: Executive Commitment — CPO committed dedicated business leadership and full regional sponsorship.",
              "Reason Z: Hub Capacity Fit — Delivery slots allocated from the 60% strategic Big Bet quarterly pool.",
            ],
          },
          step4_consequence: {
            date: "22 Jul 2026 · 16:10 CET",
            actor: "Data & AI Hub Resource Manager",
            actionTitle: "Downstream Actions Triggered ('Which Made This Happen')",
            actionsUnlocked: [
              "🚀 Formally booked 1 Forward Deployed Engineer (1.0 FTE) and 1 Data Architect (0.5 FTE) in Hub sprint schedule.",
              "🚀 Advanced initiative to Gate G4 to finalize Delivery Mode and release Tranche 1 budget.",
              "🚀 Initialized corporate PMO milestone tracking in Planisware.",
            ],
          },
        };

      case "G4":
        return {
          headline: `Gate G4 Action Narrative: Mode Lock & Tranche 1 Budget Unlock (GO BUILD)`,
          step1_upload: {
            date: "29 Jul 2026 · 11:00 CET",
            actor: `${owner} & Lead AI Catalyst`,
            action: "Uploaded Sourcing Mode Dossier & MVP Sprint Plan",
            docs: ["GIDE_Sprint_Backlog_Jira.pdf", "ProcurLab_Training_Plan.pdf", "Make_vs_Buy_Assessment.docx"],
            summary: `Proposed ${mode} joint squad delivery model, 8-week agile sprint backlog, and requested Tranche 1 MVP budget.`,
            consequence: "Convened Design Authority mode lock panel and triggered budget release approval.",
          },
          step2_meeting: {
            date: "03 Aug 2026 · 14:00 CET",
            meetingName: "Design Authority & Mode Lock Committee",
            forum: "Design Authority (Weekly) + Tier Approver",
            attendees: [
              "Design Authority Chair",
              "Marc Lefebvre (CPO)",
              "Data & AI Hub Delivery Lead",
              "Transformation Office Change Lead",
            ],
            keyChecks: [
              "Evaluated Make vs Buy: custom agent orchestration on Azure GenAI preferred over rigid SaaS for core ERP write-back.",
              "Audited squad composition: tri-partite staffing verified across Hub, TO, and Business Function.",
              "Reviewed change enablement: ProcurLab prompt coaching clinics scheduled for pilot buyers.",
            ],
            consequence: "Locked delivery mode and issued official GO BUILD authorization.",
          },
          step3_decision: {
            date: "05 Aug 2026 · 17:00 CET",
            verdict: "APPROVED (GO BUILD)",
            decidedBy: "Design Authority & CPO / CDO on Portfolio Board",
            forum: "AI Portfolio Board / Design Authority",
            reasons: [
              "Reason X: Sourcing Fit — Mode 2 ('Do it with me') ratified as optimal joint model: Hub engineers build with Function buyers.",
              "Reason Y: Budget Governance — Tranche 1 MVP budget (€380k) approved with strict 8-week sprint expenditure envelope.",
              "Reason Z: Adoption Pathway — ProcurLab training curriculum validated to ensure immediate buyer engagement from Day 1.",
            ],
          },
          step4_consequence: {
            date: "05 Aug 2026 · 17:05 CET",
            actor: "Corporate Finance & Hub Agile PMO",
            actionTitle: "Downstream Actions Triggered ('Which Made This Happen')",
            actionsUnlocked: [
              "🚀 Issued official GO BUILD verdict: launched 8-week MVP sprint with target go-live October 2026.",
              "🚀 Unlocked Tranche 1 capital funding (€380,000) into dedicated agile sprint cost center.",
              "🚀 Mobilized full tri-partite squad (Hub FDE, TO Change Lead, Business PO & Certified Builders).",
            ],
          },
        };

      case "G5":
        return {
          headline: `Gate G5 Action Narrative: Pre-Scale Validation (MVP Results & Scale Unlock)`,
          step1_upload: {
            date: "10 Nov 2026 · 16:00 CET",
            actor: `${owner} (PO) & MVP Delivery Squad`,
            action: "Uploaded Pilot MVP Results & 5-Pillar HR Workforce Scan",
            docs: [
              "GIDE_MVP_Pilot_Results_Report.pdf",
              "5_Pillar_Workforce_Impact_Scan.pdf",
              "Global_Rollout_Architecture.pdf",
            ],
            summary: "Documented 28h turnaround (vs 7.2d baseline) across 420 live POs in France & Spain and requested Tranche 2 scaling budget.",
            consequence: "Convened Transformation SteerCo Scale Review Committee for formal Go/No-Go decision.",
          },
          step2_meeting: {
            date: "16 Nov 2026 · 15:00 CET",
            meetingName: "Transformation SteerCo Scale Review Committee",
            forum: "Transformation SteerCo Scale Committee",
            attendees: [
              "Transformation SteerCo Members",
              "Marc Lefebvre (CPO)",
              "HR / P&C Workforce Transformation Counterpart",
              "Hub Lead MLOps Engineer",
            ],
            keyChecks: [
              "Audited pilot KPIs: 94.2% buyer acceptance rate, 28h turnaround time, €280k actual spend vs €380k budget.",
              "Scanned 5-pillar HR workforce impact: 62% task substitution, 45 buyers trained, zero staff redundancy.",
              "Inspected enterprise scaling architecture for multi-region rollout (EULA, NA, AMEA).",
            ],
            consequence: "SteerCo formulated favorable pre-scale recommendation with phased market release.",
          },
          step3_decision: {
            date: "18 Nov 2026 · 14:30 CET",
            verdict: isGide ? "IN_REVIEW" : "APPROVED",
            decidedBy: "Transformation SteerCo Scale Committee",
            forum: "Transformation SteerCo Scale Committee",
            reasons: [
              "Reason X: Performance Proven — 420 live POs executed in Spain and France with 94.2% accuracy and 28h turnaround.",
              "Reason Y: Capital Efficiency — MVP delivered for €280k (€100k under Tranche 1 ceiling), proving technical viability.",
              "Reason Z: Responsible Workforce Impact — 5-pillar workforce scan validated with constructive upskilling across buyer teams.",
            ],
          },
          step4_consequence: {
            date: "18 Nov 2026 · 14:35 CET",
            actor: "Global Rollout PMO",
            actionTitle: "Downstream Actions Triggered ('Which Made This Happen')",
            actionsUnlocked: [
              "🚀 Authorized immediate enterprise scale deployment in Spain and France markets.",
              "🚀 Scheduled release of Tranche 2 scaling capital (€850,000) for global cluster rollout (1,800 users).",
              "🚀 Formulated Workday integration synchronization milestone for NA launch wave in Q1 2027.",
            ],
          },
        };

      case "G6":
      default:
        return {
          headline: `Gate G6 Action Narrative: Maintain & Run Annual Value Realization Audit`,
          step1_upload: {
            date: "15 Feb 2027 · 09:00 CET",
            actor: `${owner} (Run Owner) & Finance Business Partner`,
            action: "Uploaded Annual Value Realization Audit Dossier",
            docs: ["Annual_Value_Realization_Audit.pdf", "Cloud_FinOps_Token_Report.pdf", "ORAI_Drift_Audit.pdf"],
            summary: "Submitted audited P&L savings (€3.8M net EBITDA benefit) and ongoing token consumption monitoring under €4,500/mo cap.",
            consequence: "Convened Scale & Adoption Committee for permanent BAU Run certification.",
          },
          step2_meeting: {
            date: "20 Apr 2027 · 11:00 CET",
            meetingName: "Scale & Adoption Committee Annual Review",
            forum: "Scale & Adoption Committee (Quarterly)",
            attendees: [
              "Corporate Finance Audit Lead",
              "Sarah Chen (Run Owner)",
              "Cloud FinOps Architect",
              "Enterprise Risk & ORAI Lead",
            ],
            keyChecks: [
              "Audited realized EBITDA savings against corporate value ledger: €3.8M confirmed.",
              "Monitored live token opex: actual €3,900/month vs €4,500 monthly cap.",
              "Checked model drift and bias metrics over 12 months with zero compliance violations.",
            ],
            consequence: "Certified initiative for permanent BAU Run operations.",
          },
          step3_decision: {
            date: "22 Apr 2027 · 14:00 CET",
            verdict: "APPROVED",
            decidedBy: "Finance Audit Committee & Run Sponsor",
            forum: "Scale & Adoption Committee",
            reasons: [
              "Reason X: Value Verified — Audited net EBITDA savings of €3.8M confirmed in official P&L ledger.",
              "Reason Y: Operational Stability — 76.4% touchless PO rate sustained across 1,800 active buyer user accounts.",
              "Reason Z: FinOps & Compliance — Token opex remains strictly within budgetary cap with zero model drift.",
            ],
          },
          step4_consequence: {
            date: "22 Apr 2027 · 14:05 CET",
            actor: "Global AI Platform Operations",
            actionTitle: "Downstream Actions Triggered ('Which Made This Happen')",
            actionsUnlocked: [
              "🚀 Completed formal handover from transformation project to permanent BAU Run operations.",
              "🚀 Signed off ongoing run SLA and established bi-annual value realization audit cadence.",
              "🚀 Published BOWIE procurement agent architecture as reusable Opella enterprise template.",
            ],
          },
        };
    }
  };

  const narrative = getChronologicalNarrative(activeGateId);
  const submission = getSubmissionDossier(activeGateId);
  const decision = getDecisionRecord(activeGateId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Header & Use Case Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-opella-forest">
              <History className="w-5 h-5 text-opella-forest" />
            </span>
            <h2 className="text-xl font-bold text-opella-forest">
              Gate Audit & Decision History
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Full Governance Audit
            </span>
          </div>
          <p className="text-xs text-gray-600 max-w-2xl">
            Inspect pre-filled dossiers and subsequent decisions taken across each gate. Review exact submission data, approver verdicts, conditions mandated, and subsequent operational actions unlocked.
          </p>
        </div>

        {/* Use Case Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-xs font-bold text-gray-700 whitespace-nowrap">
            Select Use Case:
          </label>
          <select
            value={currentId}
            onChange={(e) => handleSelectUseCase(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-opella-forest text-opella-forest shadow-sm"
          >
            {useCases.map((uc) => (
              <option key={uc.id} value={uc.id}>
                {uc.id}: {uc.title} ({uc.tier} · {uc.functionName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Use Case Context Card */}
      <div className="bg-gradient-to-r from-opella-forest to-emerald-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/5 pointer-events-none transform skew-x-12" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white font-mono text-xs font-bold">
                {currentUseCase.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-gray-900 font-bold text-xs">
                {currentUseCase.tier} Speed Lane
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
                {currentUseCase.mode}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white/90 text-xs">
                {currentUseCase.functionName} · {currentUseCase.region}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-400/20 text-purple-200 border border-purple-400/30 text-xs">
                {currentUseCase.riskTier} Risk Tier
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">{currentUseCase.title}</h1>
            <p className="text-xs text-white/80 max-w-3xl leading-relaxed">
              {currentUseCase.description}
            </p>
          </div>

          <div className="flex flex-row lg:flex-col gap-4 border-t lg:border-t-0 lg:border-l border-white/20 pt-4 lg:pt-0 lg:pl-6 text-xs min-w-[200px]">
            <div>
              <div className="text-white/60 text-[11px] uppercase tracking-wider">Business Owner</div>
              <div className="font-bold text-white text-sm">{currentUseCase.owner}</div>
            </div>
            <div>
              <div className="text-white/60 text-[11px] uppercase tracking-wider">Target Value / ROI</div>
              <div className="font-bold text-emerald-300 text-sm">{currentUseCase.roiEstimate}</div>
            </div>
            <div>
              <div className="text-white/60 text-[11px] uppercase tracking-wider">Total Envelope</div>
              <div className="font-bold text-white text-sm">€{currentUseCase.budget.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Executive Reminder: The Opella AI Lifecycle & Gates (Framing, Build, Pre-scale, Scale, Run) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-opella-border space-y-4">
        <div className="flex items-center justify-between border-b border-opella-border pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-opella-forest" />
            <h3 className="text-sm font-bold text-opella-forest uppercase tracking-wider">
              Opella Butterfly Spine: Lifecycle & Gate Reminder
            </h3>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">
            From Opportunity to Scaled BAU Run
          </span>
        </div>

        {/* The 5 Phases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Phase 1: Framing */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Phase 1</span>
                <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-bold">G1–G4</span>
              </div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Framing & Qualification</h4>
              <p className="text-[11px] text-gray-600 leading-snug">
                Charter triage, Finance baseline sign-off (€142/PO), Big Bet portfolio slotting, and Mode selection (GO BUILD).
              </p>
            </div>
            <div className="text-[10px] font-semibold text-emerald-800 mt-2 pt-2 border-t border-emerald-200/60">
              Output: MVP Charter & Funding
            </div>
          </div>

          {/* Phase 2: Build MVP */}
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Phase 2</span>
                <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded font-bold">MVP Sprint</span>
              </div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Build MVP & Validation</h4>
              <p className="text-[11px] text-gray-600 leading-snug">
                6–8 week agile sprint. Dedicated squad develops working agent with synthetic data, tests with pilot users.
              </p>
            </div>
            <div className="text-[10px] font-semibold text-amber-800 mt-2 pt-2 border-t border-amber-200/60">
              Output: Validated Pilot Agent
            </div>
          </div>

          {/* Phase 3: Pre-scale */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">Phase 3</span>
                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">Gate G5</span>
              </div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Pre-Scale (Scale Gate)</h4>
              <p className="text-[11px] text-gray-600 leading-snug">
                Formal Go/No-Go on pilot results. 5-Pillar Workforce Impact Scan. Unlocks Tranche 2 scaling budget.
              </p>
            </div>
            <div className="text-[10px] font-semibold text-blue-800 mt-2 pt-2 border-t border-blue-200/60">
              Output: Tranche 2 Scale Release
            </div>
          </div>

          {/* Phase 4: Scale */}
          <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-purple-800 tracking-wider">Phase 4</span>
                <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-bold">Rollout</span>
              </div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Enterprise Scaling</h4>
              <p className="text-[11px] text-gray-600 leading-snug">
                Multi-region rollout (EU, NA, AMEA). ProcurLab user enablement, prompt engineering clinics, change adoption.
              </p>
            </div>
            <div className="text-[10px] font-semibold text-purple-800 mt-2 pt-2 border-t border-purple-200/60">
              Output: 1,800+ Active Users
            </div>
          </div>

          {/* Phase 5: Run */}
          <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider">Phase 5</span>
                <span className="text-[10px] bg-teal-600 text-white px-1.5 py-0.5 rounded font-bold">Gate G6</span>
              </div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Maintain & Run</h4>
              <p className="text-[11px] text-gray-600 leading-snug">
                Formal value realization audit (+6 / +12 months). Token opex caps monitored. P&L savings confirmed.
              </p>
            </div>
            <div className="text-[10px] font-semibold text-teal-800 mt-2 pt-2 border-t border-teal-200/60">
              Output: Confirmed EBITDA Savings
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Gate Stepper & Selector (G1 to G6) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-700" />
            Click on Any Gate to View Submitted Information & Decision History:
          </h3>
          <span className="text-xs font-bold text-opella-forest">
            Currently Viewing: Gate {activeGateId}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {gateIds.map((gid) => {
            const gate = currentUseCase.gates[gid];
            const isSelected = activeGateId === gid;
            const isPassed = gate?.status === "PASSED";
            const isInReview = gate?.status === "IN_REVIEW";
            const isPending = gate?.status === "PENDING";

            return (
              <button
                key={gid}
                onClick={() => setActiveGateId(gid)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? "border-opella-forest bg-white shadow-md ring-2 ring-opella-forest/20"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded ${
                      isSelected
                        ? "bg-opella-forest text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {gid}
                  </span>
                  {isPassed && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Check className="w-3 h-3 text-emerald-600" /> Passed
                    </span>
                  )}
                  {isInReview && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-amber-600" /> In Review
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                      Pending
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-gray-900 truncate">
                  {GATES_CONFIG[gid]?.name || gid}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  Phase: {GATES_CONFIG[gid]?.phase || "Framing"}
                </div>

                {isSelected && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-opella-forest rotate-45 rounded-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Gate Detail View: Information Filled vs Decision Taken */}
      <div className="bg-white rounded-2xl shadow-sm border border-opella-border overflow-hidden">
        {/* Gate Banner Header */}
        <div className="bg-gray-50 border-b border-opella-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-opella-forest text-white">
                {activeGateId}
              </span>
              <h3 className="text-lg font-black text-gray-900">
                {currentGateDetail.name}
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                ({currentGateDetail.phase} Phase)
              </span>
            </div>
            <p className="text-xs text-gray-600">
              <strong>Core Governance Decision:</strong> {currentGateDetail.decision}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="text-gray-400 text-[10px] block">Governing Forum</span>
              <span className="font-bold text-gray-800">{currentGateDetail.forum}</span>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="text-gray-400 text-[10px] block">Lead Approver</span>
              <span className="font-bold text-gray-800">{currentGateDetail.approver}</span>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="text-gray-400 text-[10px] block">Decision SLA</span>
              <span className="font-bold text-emerald-700">{currentGateDetail.sla}</span>
            </div>
          </div>
        </div>

        {/* ================= CHRONOLOGICAL AUDIT TRAIL & ACTION NARRATIVE ================= */}
        <div className="p-6 bg-gradient-to-b from-emerald-50/50 via-white to-gray-50/40 border-b border-opella-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Chronological Narrative Audit Trail
              </span>
              <h4 className="text-base font-black text-opella-forest mt-1 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-700" />
                {narrative.headline}
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Exact sequential audit trail: "This action was taken on date → which made this happen"
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-gray-500 bg-white px-2.5 py-1 rounded-lg border border-gray-200 self-start sm:self-auto">
              Gate {activeGateId} Event Stream
            </span>
          </div>

          {/* 4 Interactive Sequential Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* MILESTONE 1: UPLOAD */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3 relative flex flex-col justify-between shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                    Step 1 · Upload
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-blue-900">
                    {narrative.step1_upload.date}
                  </span>
                </div>
                <div className="font-bold text-xs text-gray-900">
                  {narrative.step1_upload.action}
                </div>
                <div className="text-[11px] text-gray-600">
                  By: <strong>{narrative.step1_upload.actor}</strong>
                </div>
                <p className="text-[11px] text-gray-700 leading-snug">
                  {narrative.step1_upload.summary}
                </p>

                {/* Uploaded Docs Badges */}
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Uploaded These Docs:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {narrative.step1_upload.docs.map((doc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] font-medium bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-900 truncate max-w-full"
                        title={doc}
                      >
                        <FileText className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{doc}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-medium text-blue-900 pt-2 border-t border-blue-200/60">
                <strong>Triggered:</strong> {narrative.step1_upload.consequence}
              </div>
            </div>

            {/* MILESTONE 2: MEETING REVIEW */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-3 relative flex flex-col justify-between shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-700 text-white">
                    Step 2 · Meeting Review
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-purple-900">
                    {narrative.step2_meeting.date}
                  </span>
                </div>
                <div className="font-bold text-xs text-gray-900">
                  Reviewed in This Meeting:
                </div>
                <div className="text-xs font-bold text-purple-950">
                  {narrative.step2_meeting.meetingName}
                </div>
                <div className="text-[11px] text-gray-500">
                  Forum: <em>{narrative.step2_meeting.forum}</em>
                </div>

                {/* Attendees */}
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Reviewers Present:
                  </div>
                  <div className="text-[10px] text-gray-700 space-y-0.5">
                    {narrative.step2_meeting.attendees.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-purple-600 shrink-0" />
                        <span className="truncate">{att}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Checks */}
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    What Was Scrutinized:
                  </div>
                  <ul className="text-[10px] text-gray-600 space-y-1 list-disc pl-3">
                    {narrative.step2_meeting.keyChecks.map((kc, idx) => (
                      <li key={idx} className="leading-tight">{kc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-[10px] font-medium text-purple-900 pt-2 border-t border-purple-200/60">
                <strong>Result:</strong> {narrative.step2_meeting.consequence}
              </div>
            </div>

            {/* MILESTONE 3: DECISION (DECIDED TO APPROVE BECAUSE X Y) */}
            <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/70 space-y-3 relative flex flex-col justify-between shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-700 text-white">
                    Step 3 · Decision
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-emerald-900">
                    {narrative.step3_decision.date}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-black text-sm text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verdict: {narrative.step3_decision.verdict}
                </div>
                <div className="text-[11px] text-gray-600">
                  By: <strong>{narrative.step3_decision.decidedBy}</strong> via <em>{narrative.step3_decision.forum}</em>
                </div>

                {/* DECIDED TO APPROVE BECAUSE X Y */}
                <div className="space-y-1.5 pt-1.5">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Decided to Approve Because:
                  </div>
                  <div className="space-y-1">
                    {narrative.step3_decision.reasons.map((reason, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded bg-white/90 border border-emerald-200 text-[10.5px] text-emerald-950 font-medium leading-tight"
                      >
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-bold text-emerald-800 pt-2 border-t border-emerald-200/60 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Officially Approved & Signed Off
              </div>
            </div>

            {/* MILESTONE 4: CONSEQUENCE (WHICH MADE THIS HAPPEN) */}
            <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50/60 space-y-3 relative flex flex-col justify-between shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                    Step 4 · Consequence
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-amber-900">
                    {narrative.step4_consequence.date}
                  </span>
                </div>
                <div className="font-bold text-xs text-amber-950 uppercase tracking-wider flex items-center gap-1">
                  <Rocket className="w-3.5 h-3.5 text-amber-600" />
                  Which Made This Happen:
                </div>
                <div className="text-[11px] text-gray-600">
                  Executed by: <strong>{narrative.step4_consequence.actor}</strong>
                </div>

                {/* Downstream Actions Unlocked */}
                <div className="space-y-1.5 pt-1">
                  {narrative.step4_consequence.actionsUnlocked.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-white border border-amber-200 text-[11px] text-gray-900 font-semibold shadow-2xs leading-snug"
                    >
                      {act}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] font-bold text-amber-800 pt-2 border-t border-amber-200/60">
                Actionable Pipeline Progression
              </div>
            </div>
          </div>
        </div>

        {/* The 2 Core Pillars: Submitted Information vs Decision Taken */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-opella-border">
          {/* COLUMN 1: INFORMATION FILLED & SUBMITTED AT THIS GATE */}
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-opella-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  1. Information Filled & Submitted
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Dossier Submission
              </span>
            </div>

            {/* Submission Metadata */}
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 space-y-2">
              <div className="font-bold text-sm text-blue-950">
                {submission.summary}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="text-gray-400">Submitted by:</span>{" "}
                  <strong className="text-gray-800">{submission.submittedBy}</strong>
                </div>
                <div>
                  <span className="text-gray-400">Timestamp:</span>{" "}
                  <strong className="text-gray-800 font-mono">
                    {new Date(submission.submittedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                </div>
              </div>
              {submission.metricsOrCosts && (
                <div className="text-xs text-blue-800 font-semibold pt-1 border-t border-blue-200/60">
                  Envelope Requested: {submission.metricsOrCosts}
                </div>
              )}
            </div>

            {/* Pre-filled Form Fields Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Pre-Filled Key Input Fields at Gate {activeGateId}
              </div>
              <div className="space-y-2.5">
                {Object.entries(submission.keyInputsFilled).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3 rounded-lg border border-gray-200 bg-gray-50/70 text-xs"
                  >
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      {key}
                    </div>
                    <div className="text-xs font-medium text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attached Artifacts & Evidence Dossiers */}
            {submission.artifactsAttached && submission.artifactsAttached.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-opella-border">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                  Attached Dossiers & Verified Artifacts
                </div>
                <div className="flex flex-wrap gap-2">
                  {submission.artifactsAttached.map((artifact, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-opella-forest" />
                      {artifact}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMN 2: DECISION TAKEN AS A SUBSEQUENT */}
          <div className="p-6 space-y-5 bg-gray-50/30">
            <div className="flex items-center justify-between border-b border-opella-border pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  2. Decision Taken as a Subsequent
                </h4>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  decision.verdict === "APPROVED" || decision.verdict === "APPROVED (GO BUILD)"
                    ? "bg-emerald-100 text-emerald-800"
                    : decision.verdict === "IN_REVIEW"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {decision.verdict}
              </span>
            </div>

            {/* Decision Verdict Header Card */}
            <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Governance Verdict
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-900">
                  {new Date(decision.decidedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="text-base font-black text-emerald-950">
                {decision.decisionTitle}
              </div>
              <div className="text-xs text-emerald-900">
                Decided By: <strong>{decision.decidedBy}</strong> via{" "}
                <strong>{decision.forum}</strong>
              </div>
            </div>

            {/* KEY HIGHLIGHT: Subsequent Action Unlocked */}
            <div className="bg-white rounded-xl p-4 border-2 border-emerald-500/30 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <ArrowRight className="w-4 h-4 text-emerald-600" />
                Subsequent Operational Action Unlocked
              </div>
              <p className="text-xs font-semibold text-gray-900 leading-relaxed pl-6">
                {decision.subsequentAction}
              </p>
            </div>

            {/* Conditions, Mandates & Board Guidance */}
            {decision.conditionsOrFeedback && decision.conditionsOrFeedback.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Governance Conditions & Mandated Controls:
                </div>
                <div className="space-y-2">
                  {decision.conditionsOrFeedback.map((condition, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-gray-200 text-xs text-gray-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Multi-Dimensional Review Evaluation (Value, Complexity, Risk, Adoption) */}
            <div className="space-y-2 pt-2 border-t border-opella-border">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-600">
                4-Dimensional Review Scorecard:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase">Value & ROI</div>
                  <div className="text-gray-700 text-[11px] mt-0.5">
                    {currentGateDetail.multiDimensionalReview.value}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                  <div className="text-[10px] font-bold text-blue-700 uppercase">Complexity & Tech</div>
                  <div className="text-gray-700 text-[11px] mt-0.5">
                    {currentGateDetail.multiDimensionalReview.complexity}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                  <div className="text-[10px] font-bold text-purple-700 uppercase">ORAI & Risk</div>
                  <div className="text-gray-700 text-[11px] mt-0.5">
                    {currentGateDetail.multiDimensionalReview.risk}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                  <div className="text-[10px] font-bold text-amber-700 uppercase">Adoption & People</div>
                  <div className="text-gray-700 text-[11px] mt-0.5">
                    {currentGateDetail.multiDimensionalReview.adoption}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
