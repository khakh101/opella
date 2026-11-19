"use client";

import React, { useState } from "react";
import {
  Network,
  Users,
  Building,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Check,
  FileText,
  Cpu,
  UserCheck,
  Compass,
  Bike,
  Workflow,
  Sparkles,
  Sliders,
  ChevronRight,
  Info,
  Layers,
  Scale,
  Award,
  Clock,
  Euro,
  X,
  ExternalLink,
} from "lucide-react";
import { DeliveryMode, GateId } from "@/types";

interface OperatingModelMapProps {
  onNavigateToWizard?: () => void;
  onNavigateToLifecycle?: (gateId?: GateId) => void;
}

// ---------------------------------------------------------------------------
// DATA DEFINITIONS BASED ON SLIDES 9, 10, 11, 14 & 15
// ---------------------------------------------------------------------------

interface SquadMember {
  role: string;
  nameExample: string;
  allocation: string;
  percent: number;
  profileType: "Business" | "Governance" | "Change" | "Tech";
  responsibility: string;
  tomStatus: "URGENT_CREATE" | "TO_STRENGTHEN" | "IN_PLACE";
  tomNote: string;
}

interface DeliveryModeData {
  mode: DeliveryMode;
  number: string;
  title: string;
  motto: string;
  themeColor: {
    border: string;
    bg: string;
    badge: string;
    text: string;
    accent: string;
  };
  ownershipSplit: string;
  whoDelivers: string;
  whoRuns: string;
  bestFitSummary: string;
  exampleUseCases: string[];
  selectionCriteria: {
    technicalComplexity: string;
    functionCapacityRequired: string;
    platformFit: string;
    fundingMechanism: string;
  };
  squad: {
    businessFunction: SquadMember[];
    transformationOffice: SquadMember[];
    dataAndAiHub: SquadMember[];
  };
}

const DELIVERY_MODES: DeliveryModeData[] = [
  {
    mode: "Mode 1",
    number: "01",
    title: "Mode 1: Do it for me",
    motto: "“We ride for you”",
    themeColor: {
      border: "border-emerald-300",
      bg: "bg-emerald-50/60",
      badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
      text: "text-emerald-950",
      accent: "bg-emerald-700",
    },
    ownershipSplit:
      "Function owns the business problem & value; Data & AI Hub leads build, deployment, and ongoing run.",
    whoDelivers: "Central Data & AI Hub (Engineering Squad)",
    whoRuns: "Central Hub MLOps & Run Team (with Business PO acceptance)",
    bestFitSummary:
      "High technical complexity requiring custom LLM/agent engineering on central foundations (Databricks, Snowflake, Azure GenAI) where the business function has zero or minimal internal tech capacity.",
    exampleUseCases: [
      "Lumen Commercial Content Engine",
      "Enterprise Brand Matrix Compliance",
      "Enterprise LLM Knowledge Assistant",
    ],
    selectionCriteria: {
      technicalComplexity: "High (Custom agent orchestration, vector retrieval, SAP write-back)",
      functionCapacityRequired: "Low / None (Function focuses purely on business rules & UAT)",
      platformFit: "Central Foundation Platforms (Databricks Delta Lake, Azure OpenAI, Opella IQ)",
      fundingMechanism: "Funded from Central 60% Transformation Envelope",
    },
    squad: {
      businessFunction: [
        {
          role: "Accountable Business Owner (BO/PO)",
          nameExample: "Named Functional Business Director",
          allocation: "0.8 – 1.0 FTE (Dedicated)",
          percent: 90,
          profileType: "Business",
          responsibility:
            "Defines business rules, prioritizes user stories, signs off on UAT demos, and holds accountability for bottom-line P&L value realization.",
          tomStatus: "URGENT_CREATE",
          tomNote: "1 named dedicated owner required per use case (missing on ~25% today).",
        },
        {
          role: "Subject Matter Experts (SMEs)",
          nameExample: "2 Regional Process Specialists",
          allocation: "2 x 0.3 FTE",
          percent: 60,
          profileType: "Business",
          responsibility:
            "Provide operational ground truth, edge-case validation, manual baseline data, and review AI-generated recommendations.",
          tomStatus: "IN_PLACE",
          tomNote: "Domain experts in place in functional departments.",
        },
        {
          role: "Business Unit VP Sponsor",
          nameExample: "Function ExCo / VP Sponsor",
          allocation: "Executive Sponsor",
          percent: 15,
          profileType: "Business",
          responsibility:
            "Executive sponsor providing strategic backing, unblocking organizational barriers, and championing regional rollout.",
          tomStatus: "IN_PLACE",
          tomNote: "ExCo stream sponsorship active.",
        },
      ],
      transformationOffice: [
        {
          role: "AI Catalyst / Stream Lead",
          nameExample: "Assigned Stream Catalyst",
          allocation: "0.4 FTE",
          percent: 40,
          profileType: "Governance",
          responsibility:
            "Orchestrates gate comitology (G1–G6), aligns with Butterfly core releases, and tracks milestone delivery cadence.",
          tomStatus: "TO_STRENGTHEN",
          tomNote: "Target: 300 mandated catalysts across enterprise.",
        },
        {
          role: "Change & Adoption Specialist",
          nameExample: "Transformation Change Manager",
          allocation: "0.5 FTE",
          percent: 50,
          profileType: "Change",
          responsibility:
            "Executes 5-Pillar Workforce Impact Scan, designs new job profiles, and conducts user onboarding clinics.",
          tomStatus: "URGENT_CREATE",
          tomNote: "New dedicated role needed per major process reshape.",
        },
        {
          role: "Value & Portfolio Lead",
          nameExample: "Value Office Lead",
          allocation: "0.2 FTE",
          percent: 20,
          profileType: "Governance",
          responsibility:
            "Validates financial baseline with Finance BP, reconciles P&L impact in Unified Value Ledger, and prepares SteerCo audits.",
          tomStatus: "IN_PLACE",
          tomNote: "Corporate PMO & Value Office active.",
        },
      ],
      dataAndAiHub: [
        {
          role: "Forward Deployed Engineer (FDE)",
          nameExample: "Lead Full-Stack AI Engineer",
          allocation: "1.0 FTE (Full-time Lead)",
          percent: 100,
          profileType: "Tech",
          responsibility:
            "Architects and builds agent pipelines, LangChain chains, API connectors, model prompt engineering, and core business logic.",
          tomStatus: "URGENT_CREATE",
          tomNote: "Pilot 1 dedicated FDE per process reshape (cuts handoffs).",
        },
        {
          role: "Data & Semantic Architect",
          nameExample: "Opella IQ Semantic Architect",
          allocation: "0.5 FTE",
          percent: 50,
          profileType: "Tech",
          responsibility:
            "Connects ERP/SAP data sources, builds Databricks delta lake ingestion, and maps domain entities into Opella IQ ontology.",
          tomStatus: "URGENT_CREATE",
          tomNote: "Build AI-ready semantic layer; define each metric once.",
        },
        {
          role: "AI / MLOps Engineer",
          nameExample: "Platform Infrastructure Engineer",
          allocation: "0.5 FTE",
          percent: 50,
          profileType: "Tech",
          responsibility:
            "Manages Azure GenAI tenant security boundaries, token consumption caps, API latency, and automated drift testing.",
          tomStatus: "TO_STRENGTHEN",
          tomNote: "Keep scaling central engineering capacity in the Hub.",
        },
      ],
    },
  },
  {
    mode: "Mode 2",
    number: "02",
    title: "Mode 2: Do it with me",
    motto: "“We ride together”",
    themeColor: {
      border: "border-blue-300",
      bg: "bg-blue-50/60",
      badge: "bg-blue-100 text-blue-900 border-blue-300",
      text: "text-blue-950",
      accent: "bg-blue-700",
    },
    ownershipSplit:
      "Function leads the initiative; Data & AI Hub builds with it via dedicated Hub capacity and shared squads.",
    whoDelivers: "Joint Functional & Central Hub Squad (Co-Delivery)",
    whoRuns: "Shared Run: Function Product Owner + Hub Platform Operations",
    bestFitSummary:
      "Medium-to-high technical complexity requiring intimate operational business logic combined with specialized AI engineering. Function has strong business analysts or citizen builders who need Hub engineering backing.",
    exampleUseCases: [
      "GIDE / BOWIE S2P Procurement Agent",
      "IBP Demand Sensing & Replenishment",
      "M&Q Manufacturing Line AI Assistant",
    ],
    selectionCriteria: {
      technicalComplexity: "Medium to High (Domain logic + Agentic automation + System integration)",
      functionCapacityRequired: "Medium (Business has strong process analysts and technical champions)",
      platformFit: "Hybrid (Central platform components customized for specific functional workflows)",
      fundingMechanism: "Co-funded between Central Hub envelope and Functional budget",
    },
    squad: {
      businessFunction: [
        {
          role: "Accountable Product Owner (BO/PO)",
          nameExample: "Sarah Chen (Head of S2P)",
          allocation: "0.8 – 1.0 FTE (Dedicated Lead)",
          percent: 90,
          profileType: "Business",
          responsibility:
            "Drives squad day-to-day, manages Jira backlog, signs off on sprint demos, owns business KPIs and P&L savings.",
          tomStatus: "URGENT_CREATE",
          tomNote: "Dedicated business leadership mandatory for agile co-building.",
        },
        {
          role: "Functional AI Builder (Citizen/No-Code)",
          nameExample: "Domain Citizen Builder",
          allocation: "0.5 FTE",
          percent: 50,
          profileType: "Business",
          responsibility:
            "Configures user prompt templates, agent policies, and user interface workflows in Copilot Studio / custom frontend.",
          tomStatus: "URGENT_CREATE",
          tomNote: "Formalize 50–60 informal builders into governed roles.",
        },
        {
          role: "Lead Pilot Champions & Buyers",
          nameExample: "3 Regional Pilot Buyers",
          allocation: "3 x 0.25 FTE",
          percent: 75,
          profileType: "Business",
          responsibility:
            "Front-line users in pilot markets (e.g. Spain, France) executing live transactions, testing UX, and logging edge cases.",
          tomStatus: "IN_PLACE",
          tomNote: "Regional operational champions active.",
        },
      ],
      transformationOffice: [
        {
          role: "AI Catalyst (Procurement Stream)",
          nameExample: "Dedicated Function Catalyst",
          allocation: "0.5 FTE",
          percent: 50,
          profileType: "Governance",
          responsibility:
            "Facilitates agile sprints, unblocks governance gates, and bridges function with Data & AI Hub engineers.",
          tomStatus: "TO_STRENGTHEN",
          tomNote: "Empower catalysts with formal comitology mandate.",
        },
        {
          role: "Workforce Change & Adoption Lead",
          nameExample: "ProcurLab Enablement Lead",
          allocation: "0.5 FTE",
          percent: 50,
          profileType: "Change",
          responsibility:
            "Drives ProcurLab AI Prompting curriculum, monitors weekly active user rates, assesses QWL and task substitution.",
          tomStatus: "URGENT_CREATE",
          tomNote: "Co-building IS the training: hands-on user enablement.",
        },
        {
          role: "Finance BP Partner",
          nameExample: "Finance Business Partner",
          allocation: "0.2 FTE",
          percent: 20,
          profileType: "Governance",
          responsibility:
            "Audits €142/PO manual processing baseline and verifies realized EBITDA savings in Unified Value Ledger.",
          tomStatus: "IN_PLACE",
          tomNote: "Embedded finance controllers for value audit.",
        },
      ],
      dataAndAiHub: [
        {
          role: "Forward Deployed Engineer (FDE)",
          nameExample: "Embedded FDE Lead",
          allocation: "0.8 FTE (Embedded in Squad)",
          percent: 80,
          profileType: "Tech",
          responsibility:
            "Embedded in the function squad to co-engineer the core agent workflow, API connectors, and model integration.",
          tomStatus: "URGENT_CREATE",
          tomNote: "Cross-functional co-location cuts communication lag.",
        },
        {
          role: "Data Engineer",
          nameExample: "Domain Data Pipeline Engineer",
          allocation: "0.5 FTE",
          percent: 50,
          profileType: "Tech",
          responsibility:
            "Prepares domain datasets, validates data freshness in Snowflake/Databricks, and sets up automated delta pipelines.",
          tomStatus: "TO_STRENGTHEN",
          tomNote: "Connect data products to business workflows.",
        },
        {
          role: "MLOps & Security Reviewer",
          nameExample: "Design Authority Reviewer",
          allocation: "0.2 FTE",
          percent: 20,
          profileType: "Tech",
          responsibility:
            "Conducts design authority reviews, anti-hallucination guardrails, and role-based access controls (RBAC).",
          tomStatus: "IN_PLACE",
          tomNote: "5-day architectural review SLA.",
        },
      ],
    },
  },
  {
    mode: "Mode 3",
    number: "03",
    title: "Mode 3: Enable me",
    motto: "“We give you the right bike and map”",
    themeColor: {
      border: "border-purple-300",
      bg: "bg-purple-50/60",
      badge: "bg-purple-100 text-purple-900 border-purple-300",
      text: "text-purple-950",
      accent: "bg-purple-700",
    },
    ownershipSplit:
      "Function frames, builds, or sources the solution; Data & AI Hub provides architectural guardrails, platform access, and security clearance.",
    whoDelivers: "Business Function (Citizen Builders or External SaaS Partner)",
    whoRuns: "Business Function (Supported by Hub Sentinel Bots & Token Caps)",
    bestFitSummary:
      "Solution utilizes external SaaS tools or can be assembled autonomously by certified AI builders in the business. Function has autonomous delivery capacity or external vendor partners while adhering to central ORAI guardrails.",
    exampleUseCases: [
      "Wonka Regulatory Claim Substantiation SaaS",
      "LEO Procurement Contract Intelligence",
      "Autonomous Meeting Synthesis & Task Extractor",
    ],
    selectionCriteria: {
      technicalComplexity: "Low to Medium (Configuration of approved SaaS or low-code tools)",
      functionCapacityRequired: "High (Autonomous functional delivery with certified citizen builders)",
      platformFit: "SaaS & Approved Ecosystem (Opella low-code sandbox, certified 3rd party SaaS)",
      fundingMechanism: "Funded directly from Business Function Budget / Software SaaS envelope",
    },
    squad: {
      businessFunction: [
        {
          role: "Functional Process Owner",
          nameExample: "Domain Operations Lead",
          allocation: "0.4 FTE",
          percent: 40,
          profileType: "Business",
          responsibility:
            "Selects approved SaaS or low-code template, sets prompt guidelines, and validates team productivity outcomes.",
          tomStatus: "IN_PLACE",
          tomNote: "Local business leads manage their own tools.",
        },
        {
          role: "Certified AI Builder (Citizen Developer)",
          nameExample: "Trained Low-Code Champion",
          allocation: "0.8 FTE",
          percent: 80,
          profileType: "Business",
          responsibility:
            "Builds and maintains the workflow in Copilot Studio / sanctioned platforms following Design Authority security guidelines.",
          tomStatus: "URGENT_CREATE",
          tomNote: "Empowered citizen developers certified through AI Academy.",
        },
        {
          role: "External SaaS Integrator / Vendor",
          nameExample: "Certified SaaS Partner",
          allocation: "External Vendor Support",
          percent: 30,
          profileType: "Tech",
          responsibility:
            "External software provider ensuring SLA uptime, vendor API upgrades, and specialized domain models.",
          tomStatus: "IN_PLACE",
          tomNote: "Procurement-negotiated enterprise vendor agreements.",
        },
      ],
      transformationOffice: [
        {
          role: "Front-Door Gatekeeper & Intake Lead",
          nameExample: "Portfolio Intake Coordinator",
          allocation: "0.1 FTE",
          percent: 10,
          profileType: "Governance",
          responsibility:
            "Verifies solution is registered in Opella AI Registry, checks non-duplication, and ensures cost caps are enforced.",
          tomStatus: "IN_PLACE",
          tomNote: "Automated registration and cataloging.",
        },
        {
          role: "Community Change Lead",
          nameExample: "AI for All Relay Lead",
          allocation: "0.2 FTE",
          percent: 20,
          profileType: "Change",
          responsibility:
            "Showcases successful agent in Cafés IA, shares prompt patterns, and monitors inactive tool retirement.",
          tomStatus: "TO_STRENGTHEN",
          tomNote: "Community sharing accelerates grassroots adoption.",
        },
      ],
      dataAndAiHub: [
        {
          role: "Design Authority & Platform Advisor",
          nameExample: "Central Architecture Gatekeeper",
          allocation: "0.2 FTE (Gating Check)",
          percent: 20,
          profileType: "Tech",
          responsibility:
            "Conducts Architecture Decision Record (ADR) review, approves security boundary, and ensures no unapproved data export.",
          tomStatus: "IN_PLACE",
          tomNote: "5-day review SLA prevents shadow IT.",
        },
        {
          role: "ORAI Compliance Officer",
          nameExample: "Responsible AI Specialist",
          allocation: "0.1 FTE",
          percent: 10,
          profileType: "Governance",
          responsibility:
            "Verifies zero public model training, data residency in EU/US tenant, and EU AI Act classification.",
          tomStatus: "IN_PLACE",
          tomNote: "Automated guardrail checks on API gateways.",
        },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// 6 ENTERPRISE TRANSVERSAL FUNCTIONS (SLIDES 9 & 14)
// ---------------------------------------------------------------------------

interface TransversalFunction {
  id: string;
  name: string;
  shortName: string;
  sitsIn: string;
  badge: string;
  icon: string;
  primaryMission: string;
  keyDeliverables: string[];
  governanceGates: string[];
  squadInteraction: string;
  keyProfiles: string[];
}

const TRANSVERSAL_FUNCTIONS: TransversalFunction[] = [
  {
    id: "dda",
    name: "1. Digital Design Authority (DDA)",
    shortName: "Design Authority",
    sitsIn: "Data & AI Hub + Enterprise Architecture",
    badge: "Architecture & Standards",
    icon: "Cpu",
    primaryMission:
      "Ensures technical coherence, evaluates Make-or-Buy decisions, validates security perimeters, and issues Architecture Decision Records (ADR).",
    keyDeliverables: [
      "Architecture Decision Record (ADR) sign-off (5-day SLA)",
      "Standard LLM model selection & private endpoint routing",
      "API connectivity & SAP/ERP read/write access certification",
      "Prevention of duplicate technology silos across business units",
    ],
    governanceGates: ["Gate G2 (Feasibility)", "Gate G4 (Mode Lock)", "Gate G5 (Scale Gate)"],
    squadInteraction:
      "Reviews architecture in Mode 1 & 2 before build; validates SaaS tenant isolation in Mode 3.",
    keyProfiles: ["Chief Enterprise AI Architect", "Data Platform Lead", "Security Architect"],
  },
  {
    id: "orai",
    name: "2. OR.AI & Responsible AI Office (LEX)",
    shortName: "Responsible AI (OR.AI)",
    sitsIn: "Legal & Ethics (LEX) + AI Governance",
    badge: "EU AI Act & Ethics",
    icon: "Shield",
    primaryMission:
      "Guarantees that every AI deployment complies with the EU AI Act, protects patient/health data, prevents autonomous decision risk, and eliminates IP leakage.",
    keyDeliverables: [
      "EU AI Act classification (Low / Medium / High Risk)",
      "Confidential & patient health data boundary clearance",
      "Zero public model training certification (contractual guarantee)",
      "Mandatory human-in-the-loop review policy for customer-facing outputs",
    ],
    governanceGates: ["Gate G1 (Intake Screening)", "Gate G2 (Risk Confirmation)", "Gate G5 (Scale Gate)"],
    squadInteraction:
      "Screens every charter at intake; establishes pre-build constraints for high-risk use cases.",
    keyProfiles: ["OR.AI Lead Officer", "Digital Legal Counsel", "AI Ethics & Data Privacy Lead"],
  },
  {
    id: "value",
    name: "3. Value Realization Office & Finance",
    shortName: "Value Office & Finance",
    sitsIn: "Transformation Office + Corporate Finance",
    badge: "Financial Baseline & ROI",
    icon: "Euro",
    primaryMission:
      "Establishes a bulletproof unit-cost baseline with Finance Business Partners, tracks P&L benefits, and verifies realized EBITDA in the Unified Value Ledger.",
    keyDeliverables: [
      "Grounded unit-cost baseline validation (€/PO, €/hour saved)",
      "5-Year Net Present Value (NPV) & Payback calculation",
      "Unified Value Ledger reconciliation (+6m & +12m post-launch)",
      "Control Tower P&L line sign-off (COGS vs Commercial Opex)",
    ],
    governanceGates: ["Gate G2 (Baseline Sign-Off)", "Gate G3 (VCP Prioritization)", "Gate G6 (Realized ROI Audit)"],
    squadInteraction:
      "Co-authors business case in Mode 1 & 2; audits token consumption vs efficiency in Mode 3.",
    keyProfiles: ["Transformation Value Officer", "Embedded Finance Business Partner (FBP)", "Control Tower Lead"],
  },
  {
    id: "pc",
    name: "4. People & Culture (P&C / HR Workforce Evolution)",
    shortName: "P&C (HR Evolution)",
    sitsIn: "People & Culture (HR)",
    badge: "5-Pillar Workforce Impact",
    icon: "Users",
    primaryMission:
      "Guides the human transformation: assesses the 5 pillars of workforce impact, redesigns job roles, leads Works Council social dialogue, and ensures task repurposing.",
    keyDeliverables: [
      "5-Pillar Workforce Impact Scan (Activities, Roles, Skills, QWL, Dialogue)",
      "Role Evolution Blueprint (transitioning repetitive tasks to high-value analysis)",
      "ProcurLab & AI Academy prompt engineering curriculum",
      "Proactive Works Council & social partner transparency reports",
    ],
    governanceGates: ["Gate G2 (Initial Impact Scan)", "Gate G5 (Scale Workforce Audit)", "Gate G6 (Adoption Health)"],
    squadInteraction:
      "Deploys dedicated Change Specialist in Mode 1 & 2 squads; drives community upskilling for Mode 3.",
    keyProfiles: ["P&C Transformation Counterpart", "Strategic Workforce Planner", "AI Academy Director"],
  },
  {
    id: "cyber",
    name: "5. Cybersecurity & CISO Data Perimeter",
    shortName: "Cybersecurity & CISO",
    sitsIn: "CISO Office & InfoSec",
    badge: "Data Isolation & RBAC",
    icon: "Scale",
    primaryMission:
      "Maintains the enterprise cryptographic security boundary, enforces Role-Based Access Control (RBAC), manages API keys, and blocks unauthorized data exfiltration.",
    keyDeliverables: [
      "Azure GenAI dedicated private tenant boundary enforcement",
      "User-level RBAC tokenization for ERP/SAP data feeds",
      "Automated vulnerability and secret-scanning on code repositories",
      "Third-party SaaS cyber risk assessment and SOC2 audit verification",
    ],
    governanceGates: ["Gate G2 (Security Clearance)", "Gate G4 (MVP Go-Live Check)", "Gate G6 (Continuous Audit)"],
    squadInteraction:
      "Configures tenant isolation for Mode 1 & 2; validates encryption and tenant keys for Mode 3.",
    keyProfiles: ["CISO AI Security Lead", "Cloud Security Engineer", "Data Perimeter Specialist"],
  },
  {
    id: "platform",
    name: "6. Enterprise Platform & Opella IQ Semantic Layer",
    shortName: "Platform & Opella IQ",
    sitsIn: "Data & AI Hub (Core Foundations)",
    badge: "Reusable Data Products",
    icon: "Workflow",
    primaryMission:
      "Provides the enterprise shared foundation platforms (Databricks, Snowflake, Azure GenAI) and the unified Opella IQ semantic layer so metrics are defined once.",
    keyDeliverables: [
      "Opella IQ unified product and customer business ontology",
      "Databricks Delta Lake ingestion pipelines for SAP S/4HANA",
      "Reusable Prompt & Agent template repository (cuts build time by 60%)",
      "Enterprise AI Gateway with automated token caching and rate limiting",
    ],
    governanceGates: ["Gate G2 (Data Readiness)", "Gate G4 (Platform Provisioning)", "Gate G5 (Scale Architecture)"],
    squadInteraction:
      "Provides core platform components to Mode 1 & 2 squads; supplies API tokens and sandbox to Mode 3.",
    keyProfiles: ["Semantic Layer Architect", "Data Product Lead", "Azure GenAI Platform Lead"],
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export const OperatingModelMap: React.FC<OperatingModelMapProps> = ({
  onNavigateToWizard,
  onNavigateToLifecycle,
}) => {
  // Mode selection state: "Mode 1" | "Mode 2" | "Mode 3" | "ALL"
  const [activeMode, setActiveMode] = useState<DeliveryMode | "ALL">("Mode 2");
  
  // Inspector modal states
  const [inspectedRole, setInspectedRole] = useState<{
    member: SquadMember;
    pillarName: string;
    modeTitle: string;
  } | null>(null);

  const [inspectedTransversal, setInspectedTransversal] = useState<TransversalFunction | null>(null);

  // Interactive Sourcing Simulator State (Slide 10 & 46)
  const [simComplexity, setSimComplexity] = useState<"Low" | "Medium" | "High">("Medium");
  const [simCapacity, setSimCapacity] = useState<"None" | "Medium" | "High">("Medium");
  const [simPlatform, setSimPlatform] = useState<"Central Hub" | "Hybrid" | "External SaaS">("Hybrid");

  // Calculate recommended mode based on Slide 10 logic
  const calculateRecommendedMode = (): DeliveryMode => {
    if (simComplexity === "High" && simCapacity === "None") return "Mode 1";
    if (simPlatform === "External SaaS" || (simCapacity === "High" && simComplexity === "Low")) return "Mode 3";
    if (simComplexity === "High" && simPlatform === "Central Hub") return "Mode 1";
    return "Mode 2"; // Default collaborative sweet spot
  };

  const recommendedMode = calculateRecommendedMode();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* =================================================================== */}
      {/* 1. HERO HEADER: THE FEDERATED DELIVERY OPERATING MODEL               */}
      {/* =================================================================== */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-opella-border space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-opella-border">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                Playbook Slides 10, 11 & 14 Master Architecture
              </span>
              <span className="text-xs font-semibold text-gray-500">
                Pillar 1: Organisation & Sourcing
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-opella-forest tracking-tight">
              The 3 Delivery Modes & Transversal Operating Model
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-3xl leading-relaxed">
              <strong>“Who Delivers?”</strong> — Opella replaces siloed AI factories with a federated operating model. Every use case is mapped to one of three delivery modes based on technical complexity and functional capacity, powered by shared enterprise transversal functions.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
            {onNavigateToWizard && (
              <button
                onClick={onNavigateToWizard}
                className="px-4 py-2 bg-opella-forest hover:bg-opella-emerald text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Select Mode in Intake
              </button>
            )}
            {onNavigateToLifecycle && (
              <button
                onClick={() => onNavigateToLifecycle("G4")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all border border-gray-300 flex items-center gap-1.5"
              >
                <Workflow className="w-3.5 h-3.5 text-emerald-700" />
                Gate G4 Mode Ratification
              </button>
            )}
          </div>
        </div>

        {/* Core Architecture Principles Banner (Slide 10 & 76) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <span className="font-bold text-amber-950 uppercase tracking-wider block text-[10px] mb-0.5">
              Rule 1 · Sourcing Independence (Slide 10)
            </span>
            <p className="text-gray-700 leading-snug">
              A use case gets <strong>one tier</strong> (governance) and <strong>one mode</strong> (delivery). The mode answers <em>“Who delivers?”</em> without altering comitology rights.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
            <span className="font-bold text-emerald-950 uppercase tracking-wider block text-[10px] mb-0.5">
              Rule 2 · The Tri-Partite Squad (Slide 14)
            </span>
            <p className="text-gray-700 leading-snug">
              Every delivery squad combines <strong>Business Function</strong>, <strong>Transformation Office</strong>, and <strong>Data & AI Hub</strong> profiles in co-located synergy.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80">
            <span className="font-bold text-purple-950 uppercase tracking-wider block text-[10px] mb-0.5">
              Rule 3 · Transversal Foundations (Slide 9)
            </span>
            <p className="text-gray-700 leading-snug">
              Six enterprise functions (Architecture, OR.AI, Value, HR, Cyber, Opella IQ) protect and support all squads equally to prevent fragmented shadow IT.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. INTERACTIVE SOURCING SIMULATOR (SLIDE 10 & 46 CRITERIA)          */}
      {/* =================================================================== */}
      <div className="bg-gradient-to-r from-emerald-950 via-opella-forest to-emerald-900 rounded-2xl p-6 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400 text-gray-950 font-black text-xs flex items-center gap-1 shadow-sm">
              <Sliders className="w-3.5 h-3.5 text-gray-950" />
              <span>INTERACTIVE</span>
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                Delivery Mode Sourcing Engine (Slide 10 & 46)
              </h3>
              <p className="text-xs text-white/70">
                Adjust the 3 strategic parameters below to calculate the recommended delivery mode:
              </p>
            </div>
          </div>

          {/* Sourcing Recommendation Result */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-black/30 px-3 py-1.5 rounded-xl border border-white/20">
            <span className="text-[11px] text-white/70">Recommended Mode:</span>
            <span className="text-xs font-black text-amber-300 px-2 py-0.5 rounded bg-white/10 border border-amber-300/30">
              {recommendedMode} · {DELIVERY_MODES.find((m) => m.mode === recommendedMode)?.title.split(": ")[1]}
            </span>
            <button
              onClick={() => setActiveMode(recommendedMode)}
              className="text-[10px] font-bold text-emerald-200 hover:text-white underline ml-1 cursor-pointer"
            >
              Inspect Squad →
            </button>
          </div>
        </div>

        {/* 3 Interactive Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Parameter 1: Complexity */}
          <div className="bg-white/10 p-3 rounded-xl border border-white/15 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
              1. Technical Complexity Profile
            </span>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(["Low", "Medium", "High"] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => setSimComplexity(val)}
                  className={`py-1 rounded text-center font-bold text-[11px] transition-all ${
                    simComplexity === val
                      ? "bg-amber-400 text-gray-950 shadow-sm"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/60 pt-0.5">
              {simComplexity === "High" && "Custom agents, SAP write-back, complex vector RAG"}
              {simComplexity === "Medium" && "Domain logic + pre-built API connectors"}
              {simComplexity === "Low" && "Prompt templates, low-code automations, summaries"}
            </p>
          </div>

          {/* Parameter 2: Functional Capacity */}
          <div className="bg-white/10 p-3 rounded-xl border border-white/15 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
              2. Function Tech Capacity
            </span>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(["None", "Medium", "High"] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => setSimCapacity(val)}
                  className={`py-1 rounded text-center font-bold text-[11px] transition-all ${
                    simCapacity === val
                      ? "bg-amber-400 text-gray-950 shadow-sm"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/60 pt-0.5">
              {simCapacity === "None" && "Zero technical profiles; pure business domain experts"}
              {simCapacity === "Medium" && "Business analysts and aspiring AI champions"}
              {simCapacity === "High" && "Certified AI Builders & autonomous local squads"}
            </p>
          </div>

          {/* Parameter 3: Platform Fit */}
          <div className="bg-white/10 p-3 rounded-xl border border-white/15 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
              3. Platform Fit
            </span>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(["Central Hub", "Hybrid", "External SaaS"] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => setSimPlatform(val)}
                  className={`py-1 rounded text-center font-bold text-[10px] truncate transition-all ${
                    simPlatform === val
                      ? "bg-amber-400 text-gray-950 shadow-sm"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                  title={val}
                >
                  {val}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/60 pt-0.5">
              {simPlatform === "Central Hub" && "Databricks Delta Lake & Azure GenAI core tenant"}
              {simPlatform === "Hybrid" && "Shared hub components customized for domain logic"}
              {simPlatform === "External SaaS" && "Niche external vendor or low-code Copilot Studio"}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. THE 3 DELIVERY MODES (SLIDES 10 & 11 OVERVIEW CARDS)             */}
      {/* =================================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-opella-forest flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-700" />
              The 3 Delivery Modes Overview (Slide 10 & 11)
            </h3>
            <p className="text-xs text-gray-600">
              Select a mode to inspect its dedicated squad profiles and resourcing model
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 text-xs shadow-2xs">
            <button
              onClick={() => setActiveMode("Mode 1")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeMode === "Mode 1"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Mode 1 (Do it for me)
            </button>
            <button
              onClick={() => setActiveMode("Mode 2")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeMode === "Mode 2"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Mode 2 (Do it with me)
            </button>
            <button
              onClick={() => setActiveMode("Mode 3")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeMode === "Mode 3"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Mode 3 (Enable me)
            </button>
            <button
              onClick={() => setActiveMode("ALL")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeMode === "ALL"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Compare All 3
            </button>
          </div>
        </div>

        {/* 3 Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DELIVERY_MODES.map((item) => {
            const isSelected = activeMode === item.mode || activeMode === "ALL";

            return (
              <div
                key={item.mode}
                onClick={() => setActiveMode(item.mode)}
                className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between ${
                  activeMode === item.mode
                    ? `${item.themeColor.border} ring-2 ring-opella-forest/15 shadow-md`
                    : "border-gray-200 hover:border-gray-300 opacity-90"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${item.themeColor.badge}`}>
                      {item.mode}
                    </span>
                    <span className="text-xs font-serif italic text-gray-500 font-semibold">
                      {item.motto}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {item.ownershipSplit}
                    </p>
                  </div>

                  {/* Sourcing Summary Box */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Who Delivers:</span>
                      <span className="font-bold text-gray-900">{item.whoDelivers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Who Runs:</span>
                      <span className="font-semibold text-gray-800">{item.whoRuns}</span>
                    </div>
                  </div>

                  {/* Key Criteria Specs */}
                  <div className="text-[11px] space-y-1 pt-1">
                    <div>
                      <span className="text-gray-400 block text-[10px] font-bold uppercase">Complexity Profile</span>
                      <span className="font-semibold text-gray-800">{item.selectionCriteria.technicalComplexity}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] font-bold uppercase">Function Tech Capacity</span>
                      <span className="font-semibold text-gray-800">{item.selectionCriteria.functionCapacityRequired}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-400">
                    Squad: <strong>{item.squad.businessFunction.length + item.squad.transformationOffice.length + item.squad.dataAndAiHub.length} Key Roles</strong>
                  </span>
                  <span className="font-bold text-opella-forest flex items-center gap-1 text-[11px]">
                    Inspect Squad <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. SQUAD ROLES IN EACH MODE (SLIDE 14 TRI-PARTITE SQUAD ALLOCATION)  */}
      {/* =================================================================== */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-opella-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-opella-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-opella-forest text-white text-xs font-bold px-2 py-0.5">
                Slide 14 Blueprint
              </span>
              <h3 className="text-xl font-bold text-opella-forest">
                {activeMode === "ALL"
                  ? "Tri-Partite Squad Roles across All 3 Delivery Modes"
                  : `Dedicated Squad Roles in ${DELIVERY_MODES.find((m) => m.mode === activeMode)?.title}`}
              </h3>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Click on any role card to view detailed responsibilities, allocation, and TOM mapping.
            </p>
          </div>

          <div className="text-xs font-semibold text-gray-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Business Function
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Transformation Office
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Data & AI Hub
            </span>
          </div>
        </div>

        {/* Display Squads */}
        {(activeMode === "ALL" ? DELIVERY_MODES : DELIVERY_MODES.filter((m) => m.mode === activeMode)).map(
          (modeData) => (
            <div key={modeData.mode} className="space-y-4 pt-2">
              {activeMode === "ALL" && (
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${modeData.themeColor.badge}`}>
                    {modeData.title}
                  </span>
                  <span className="text-xs text-gray-500 italic">{modeData.motto}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* 1. BUSINESS FUNCTION COLUMN */}
                <div className="bg-purple-50/40 rounded-2xl p-5 border-2 border-purple-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-200/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-600" />
                      <h4 className="font-bold text-xs text-purple-950 uppercase tracking-wider">
                        1. Business Function
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      Value & Backlog
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {modeData.squad.businessFunction.map((member, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          setInspectedRole({
                            member,
                            pillarName: "Business Function",
                            modeTitle: modeData.title,
                          })
                        }
                        className="bg-white p-3.5 rounded-xl border border-purple-200/70 hover:border-purple-400 hover:shadow-sm transition-all cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-gray-900 text-xs">{member.role}</span>
                          <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded shrink-0">
                            {member.allocation}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">
                          {member.responsibility}
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[10px]">
                          <span
                            className={`font-bold px-1.5 py-0.2 rounded ${
                              member.tomStatus === "URGENT_CREATE"
                                ? "bg-rose-100 text-rose-800"
                                : member.tomStatus === "TO_STRENGTHEN"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {member.tomStatus === "URGENT_CREATE"
                              ? "Urgent to Create"
                              : member.tomStatus === "TO_STRENGTHEN"
                              ? "To Strengthen"
                              : "In Place"}
                          </span>
                          <span className="text-purple-700 font-semibold">Inspect →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. TRANSFORMATION OFFICE (TO) COLUMN */}
                <div className="bg-orange-50/40 rounded-2xl p-5 border-2 border-orange-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-orange-200/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-orange-500" />
                      <h4 className="font-bold text-xs text-orange-950 uppercase tracking-wider">
                        2. Transformation Office
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                      Change & Value
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {modeData.squad.transformationOffice.map((member, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          setInspectedRole({
                            member,
                            pillarName: "Transformation Office",
                            modeTitle: modeData.title,
                          })
                        }
                        className="bg-white p-3.5 rounded-xl border border-orange-200/70 hover:border-orange-400 hover:shadow-sm transition-all cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-gray-900 text-xs">{member.role}</span>
                          <span className="text-[10px] font-mono font-bold bg-orange-100 text-orange-900 px-1.5 py-0.5 rounded shrink-0">
                            {member.allocation}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">
                          {member.responsibility}
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[10px]">
                          <span
                            className={`font-bold px-1.5 py-0.2 rounded ${
                              member.tomStatus === "URGENT_CREATE"
                                ? "bg-rose-100 text-rose-800"
                                : member.tomStatus === "TO_STRENGTHEN"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {member.tomStatus === "URGENT_CREATE"
                              ? "Urgent to Create"
                              : member.tomStatus === "TO_STRENGTHEN"
                              ? "To Strengthen"
                              : "In Place"}
                          </span>
                          <span className="text-orange-700 font-semibold">Inspect →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. DATA & AI HUB COLUMN */}
                <div className="bg-emerald-50/40 rounded-2xl p-5 border-2 border-emerald-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-600" />
                      <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider">
                        3. Data & AI Hub
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Platform & Engineering
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {modeData.squad.dataAndAiHub.map((member, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          setInspectedRole({
                            member,
                            pillarName: "Data & AI Hub",
                            modeTitle: modeData.title,
                          })
                        }
                        className="bg-white p-3.5 rounded-xl border border-emerald-200/70 hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-gray-900 text-xs">{member.role}</span>
                          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded shrink-0">
                            {member.allocation}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">
                          {member.responsibility}
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[10px]">
                          <span
                            className={`font-bold px-1.5 py-0.2 rounded ${
                              member.tomStatus === "URGENT_CREATE"
                                ? "bg-rose-100 text-rose-800"
                                : member.tomStatus === "TO_STRENGTHEN"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {member.tomStatus === "URGENT_CREATE"
                              ? "Urgent to Create"
                              : member.tomStatus === "TO_STRENGTHEN"
                              ? "To Strengthen"
                              : "In Place"}
                          </span>
                          <span className="text-emerald-700 font-semibold">Inspect →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* =================================================================== */}
      {/* 5. ENTERPRISE TRANSVERSAL FUNCTIONS UNDER (SLIDES 9 & 14)           */}
      {/* =================================================================== */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-opella-border space-y-6">
        <div className="border-b border-opella-border pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500 text-gray-950 text-xs font-bold px-2 py-0.5">
              Transversal Spine
            </span>
            <h3 className="text-xl font-bold text-opella-forest">
              Enterprise Transversal Functions (Underneath All Modes)
            </h3>
          </div>
          <p className="text-xs text-gray-600 mt-1 max-w-3xl leading-relaxed">
            These 6 enterprise functions sit across all 3 delivery modes. They provide architectural governance, regulatory AI compliance, financial baseline validation, workforce impact scans, and secure data platform foundations to ensure enterprise coherence.
          </p>
        </div>

        {/* 6 Transversal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRANSVERSAL_FUNCTIONS.map((tf) => (
            <div
              key={tf.id}
              onClick={() => setInspectedTransversal(tf)}
              className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200 hover:border-opella-forest/50 hover:bg-emerald-50/20 transition-all cursor-pointer flex flex-col justify-between shadow-2xs space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border text-gray-700">
                    {tf.badge}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold">{tf.sitsIn.split("+")[0]}</span>
                </div>

                <h4 className="font-bold text-gray-900 text-sm">{tf.name}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {tf.primaryMission}
                </p>

                {/* Key Deliverables Bulleted List */}
                <div className="pt-2 border-t border-gray-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    Core Gate Deliverables
                  </span>
                  {tf.keyDeliverables.slice(0, 2).map((deliv, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="truncate">{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="text-[10px] text-emerald-800 font-semibold">
                  Gates: {tf.governanceGates.join(" · ")}
                </span>
                <span className="font-bold text-opella-forest text-[11px] flex items-center gap-1">
                  Details <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 6. MODAL: INSPECT SQUAD ROLE DETAIL                                 */}
      {/* =================================================================== */}
      {inspectedRole && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-scale-in">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {inspectedRole.pillarName} · {inspectedRole.modeTitle}
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-1">
                  {inspectedRole.member.role}
                </h3>
              </div>
              <button
                onClick={() => setInspectedRole(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-400 block font-semibold text-[10px]">Squad Dedication</span>
                  <span className="font-bold text-gray-900 text-sm">{inspectedRole.member.allocation}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold text-[10px]">TOM 29 Roles Status</span>
                  <span
                    className={`font-bold inline-block px-2 py-0.5 rounded text-[11px] mt-0.5 ${
                      inspectedRole.member.tomStatus === "URGENT_CREATE"
                        ? "bg-rose-100 text-rose-800"
                        : inspectedRole.member.tomStatus === "TO_STRENGTHEN"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {inspectedRole.member.tomStatus === "URGENT_CREATE"
                      ? "1 of 7 Urgent to Create"
                      : inspectedRole.member.tomStatus === "TO_STRENGTHEN"
                      ? "1 of 5 to Strengthen"
                      : "1 of 17 In Place"}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-900 block mb-1">Core Responsibilities in This Squad:</span>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
                  {inspectedRole.member.responsibility}
                </p>
              </div>

              <div>
                <span className="font-bold text-gray-900 block mb-1">Opella Operating Model Context:</span>
                <p className="text-gray-600 leading-relaxed">
                  {inspectedRole.member.tomNote}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setInspectedRole(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 7. MODAL: INSPECT TRANSVERSAL FUNCTION DETAIL                       */}
      {/* =================================================================== */}
      {inspectedTransversal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-scale-in">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  Transversal Enterprise Pillar
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-1">
                  {inspectedTransversal.name}
                </h3>
                <span className="text-xs text-gray-500 font-semibold">{inspectedTransversal.sitsIn}</span>
              </div>
              <button
                onClick={() => setInspectedTransversal(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="font-bold text-gray-900 block mb-1">Strategic Mandate:</span>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
                  {inspectedTransversal.primaryMission}
                </p>
              </div>

              <div>
                <span className="font-bold text-gray-900 block mb-1.5">Key Gate Deliverables & Approvals:</span>
                <div className="space-y-1.5">
                  {inspectedTransversal.keyDeliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-emerald-50/40 p-2 rounded-lg border border-emerald-100 text-gray-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Governance Gates</span>
                  <span className="font-bold text-emerald-800 text-xs mt-0.5 block">
                    {inspectedTransversal.governanceGates.join(" · ")}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Lead Profiles</span>
                  <span className="font-semibold text-gray-800 text-[11px] mt-0.5 block">
                    {inspectedTransversal.keyProfiles.join(", ")}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-gray-800">
                <span className="font-bold text-amber-950 block text-[11px] mb-0.5">Interaction with the 3 Modes:</span>
                <p className="leading-snug">{inspectedTransversal.squadInteraction}</p>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setInspectedTransversal(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
