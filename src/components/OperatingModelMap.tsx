"use client";

import React, { useState } from "react";
import {
  Users,
  Sparkles,
  Info,
  X,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Workflow,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import { DeliveryMode, GateId } from "@/types";

interface OperatingModelMapProps {
  onNavigateToWizard?: () => void;
  onNavigateToLifecycle?: (gateId?: GateId) => void;
}

// ---------------------------------------------------------------------------
// TYPES & DATA DEFINITIONS DIRECTLY EXTRACTED FROM SLIDE "Pillar 2 : Roles"
// ---------------------------------------------------------------------------

type RoleCategory = "functions" | "to" | "data_ai" | "business_solutions" | "supporting";

interface SlideRole {
  id: string;
  name: string;
  category: RoleCategory;
  isNew?: boolean;
  isDeployed?: boolean; // Purple circle border: Deployed profiles in function side
  isExternalOrBusinessSide?: boolean; // Asterisk (*) in Mode 3
  sitsIn: string;
  mission: string;
  modesInvolved: ("Mode 1" | "Mode 2" | "Mode 3" | "Transversal")[];
}

const ALL_SLIDE_ROLES: Record<string, SlideRole> = {
  // --- Squad Roles ---
  "bopo": {
    id: "bopo",
    name: "BO/PO",
    category: "to", // in mode 1 orange hair/shirt, in mode 2/3 purple ring
    isNew: true,
    sitsIn: "Business Function (Deployed in Mode 2 & 3)",
    mission: "Accountable Business Owner / Product Owner who carries the business need from idea to run: owns backlog priorities, user stories, acceptance criteria, budget, and bottom-line P&L value realization.",
    modesInvolved: ["Mode 1", "Mode 2", "Mode 3"],
  },
  "business_architect": {
    id: "business_architect",
    name: "Business architect",
    category: "to",
    isNew: true,
    sitsIn: "Transformation Office (TO)",
    mission: "Redesigns end-to-end workflows with AI at the core; identifies process bottlenecks, sizes workforce impact, and maps core Butterfly system dependencies.",
    modesInvolved: ["Mode 1", "Mode 2", "Mode 3"],
  },
  "business_analytics": {
    id: "business_analytics",
    name: "Business analytics",
    category: "functions",
    sitsIn: "Business Function",
    mission: "Domain data analyst who analyzes functional operational metrics, validates business rules, and assists in shaping training datasets.",
    modesInvolved: ["Mode 2", "Mode 3"],
  },
  "ai_builder": {
    id: "ai_builder",
    name: "AI builder",
    category: "functions",
    isNew: true,
    isDeployed: true,
    sitsIn: "Business Function (Deployed Profile)",
    mission: "Citizen or low-code developer who configures, tests, and maintains governed AI agents in Copilot Studio or approved platforms close to the business.",
    modesInvolved: ["Mode 2", "Mode 3"],
  },
  "fde": {
    id: "fde",
    name: "FDE",
    category: "data_ai",
    isNew: true,
    sitsIn: "Data & AI Hub",
    mission: "Forward Deployed Engineer embedded in the use case: prototypes rapidly, industrializes on central platform standards, connects APIs, and eliminates delivery handoffs.",
    modesInvolved: ["Mode 1", "Mode 2"],
  },
  "digital_po": {
    id: "digital_po",
    name: "Digital PO",
    category: "business_solutions",
    sitsIn: "Data & AI or Business Solutions (per use case)",
    mission: "Technical product owner who translates business needs into technical data architecture, orchestrates backlog with engineering, and pairs with the function BO/PO.",
    modesInvolved: ["Mode 1", "Mode 2", "Mode 3"],
  },
  "data_scientist": {
    id: "data_scientist",
    name: "Data scientist",
    category: "data_ai",
    sitsIn: "Data & AI Hub (External/Business-side in Mode 3)",
    mission: "Designs statistical, machine learning, and LLM reasoning models; validates prediction accuracy, token efficiency, and prompt safety.",
    modesInvolved: ["Mode 1", "Mode 2", "Mode 3"],
  },
  "ai_engineer": {
    id: "ai_engineer",
    name: "AI engineer",
    category: "data_ai",
    sitsIn: "Data & AI Hub (External/Business-side in Mode 3)",
    mission: "Full-stack engineer taking GenAI apps and autonomous agents from prototype to production at scale on Azure GenAI and Databricks.",
    modesInvolved: ["Mode 1", "Mode 2", "Mode 3"],
  },
  "data_eng_architect": {
    id: "data_eng_architect",
    name: "Data eng. / architect",
    category: "data_ai",
    sitsIn: "Data & AI Hub (External/Business-side in Mode 3)",
    mission: "Constructs automated data ingestion pipelines, sets up Databricks delta lake tables, and manages secure API integrations with core SAP/ERP databases.",
    modesInvolved: ["Mode 1", "Mode 2", "Mode 3"],
  },

  // --- Transversal: Functions / Regions ---
  "data_stewards": {
    id: "data_stewards",
    name: "Data stewards",
    category: "functions",
    sitsIn: "Functions / Regions",
    mission: "Domain data quality and definition owners; ensure local data cleanliness and validate operational business rules for AI consumption.",
    modesInvolved: ["Transversal"],
  },
  "ai_catalyst": {
    id: "ai_catalyst",
    name: "AI catalyst",
    category: "functions",
    sitsIn: "Functions / Regions",
    mission: "Community relay helping colleagues discover AI use cases, run ideation workshops, and route qualified ideas into the Front Door intake.",
    modesInvolved: ["Transversal"],
  },
  "business_testers": {
    id: "business_testers",
    name: "Business testers",
    category: "functions",
    sitsIn: "Functions / Regions",
    mission: "Operational champions and power users in pilot markets testing live agents during sprints and reporting edge cases.",
    modesInvolved: ["Transversal"],
  },
  "business_sponsor": {
    id: "business_sponsor",
    name: "Business sponsor",
    category: "functions",
    sitsIn: "Functions / Regions",
    mission: "Functional VP or Business Unit Director providing executive sponsorship, budget backing, and unblocking regional adoption.",
    modesInvolved: ["Transversal"],
  },

  // --- Transversal: Transformation office (TO) ---
  "to_lead": {
    id: "to_lead",
    name: "TO lead",
    category: "to",
    sitsIn: "Transformation Office (The Hub)",
    mission: "Transformation Office leader responsible for portfolio comitology, SteerCo cadence, gate approval governance, and AmplifAI program orchestration.",
    modesInvolved: ["Transversal"],
  },
  "change_adoption_lead_amplifai": {
    id: "change_adoption_lead_amplifai",
    name: "Change & adoption lead (AmplifAI)",
    category: "to",
    sitsIn: "Transformation Office (The Hub)",
    mission: "Leads AI for All adoption programs, Cafés IA, prompt engineering clinics, and enterprise cultural change measurement.",
    modesInvolved: ["Transversal"],
  },
  "change_management_lead_butterfly": {
    id: "change_management_lead_butterfly",
    name: "Change management lead (Butterfly)",
    category: "to",
    sitsIn: "Transformation Office (The Hub)",
    mission: "Aligns AI initiatives with core Butterfly enterprise ERP transformation release waves and change roadmaps.",
    modesInvolved: ["Transversal"],
  },
  "regional_adoption_relays": {
    id: "regional_adoption_relays",
    name: "Regional adoption relays",
    category: "to",
    isNew: true,
    sitsIn: "Transformation Office (The Hub)",
    mission: "Deploys regional change networks across NA, EULA, and AMEA to coach local AI catalysts and support multi-market rollouts.",
    modesInvolved: ["Transversal"],
  },

  // --- Transversal: Data & AI (Digital) ---
  "semantic_layer_arch": {
    id: "semantic_layer_arch",
    name: "Semantic layer arch.",
    category: "data_ai",
    isNew: true,
    sitsIn: "Data & AI (The Hub)",
    mission: "Builds the unified Opella IQ semantic layer so product, customer, and finance metrics are defined once across all AI agents.",
    modesInvolved: ["Transversal"],
  },
  "data_governance": {
    id: "data_governance",
    name: "Data governance",
    category: "data_ai",
    sitsIn: "Data & AI (The Hub)",
    mission: "Maintains enterprise data cataloging, access permission matrices, data privacy rules, and data classification.",
    modesInvolved: ["Transversal"],
  },
  "data_product_lead": {
    id: "data_product_lead",
    name: "Data product lead",
    category: "data_ai",
    sitsIn: "Data & AI (The Hub)",
    mission: "Owns reusable data products, cross-domain pipelines, and acts as the technical custodian of foundational datasets.",
    modesInvolved: ["Transversal"],
  },
  "master_data_mdm": {
    id: "master_data_mdm",
    name: "Master data (MDM)",
    category: "data_ai",
    sitsIn: "Data & AI (The Hub)",
    mission: "Guarantees golden-record master data integrity across SAP ERP, supply chain, and commercial databases.",
    modesInvolved: ["Transversal"],
  },
  "ai_governance": {
    id: "ai_governance",
    name: "AI governance",
    category: "data_ai",
    sitsIn: "Data & AI (The Hub)",
    mission: "Oversees model registry, token consumption rate limits, model drift testing, and algorithmic safety guardrails.",
    modesInvolved: ["Transversal"],
  },

  // --- Transversal: Digital transversal teams ---
  "business_solutions_team": {
    id: "business_solutions_team",
    name: "Business Solutions team",
    category: "business_solutions",
    sitsIn: "Digital transversal teams",
    mission: "Enterprise IT solutions teams managing core application platforms, ERP modules, CRM, and S2P system integrations.",
    modesInvolved: ["Transversal"],
  },
  "enterprise_architecture": {
    id: "enterprise_architecture",
    name: "Enterprise architecture",
    category: "business_solutions",
    sitsIn: "Digital transversal teams",
    mission: "Sets enterprise IT guidelines, cloud hosting standards, and leads the Digital Design Authority (DDA) review.",
    modesInvolved: ["Transversal"],
  },
  "infra_cyber": {
    id: "infra_cyber",
    name: "Infra & cyber",
    category: "business_solutions",
    sitsIn: "Digital transversal teams",
    mission: "Manages dedicated Azure GenAI tenants, private virtual networks, CISO security policies, encryption, and RBAC tokenization.",
    modesInvolved: ["Transversal"],
  },

  // --- Transversal: Other supporting functions ---
  "value_officer": {
    id: "value_officer",
    name: "Value officer (Finance)",
    category: "supporting",
    sitsIn: "Other supporting functions (Finance)",
    mission: "Validates unit cost baselines with Finance BPs, reconciles the Unified Value Ledger, and audits realized EBITDA (+6m/+12m).",
    modesInvolved: ["Transversal"],
  },
  "orai_team": {
    id: "orai_team",
    name: "ORAI team (LEX)",
    category: "supporting",
    sitsIn: "Other supporting functions (Legal / LEX)",
    mission: "Ensures EU AI Act compliance, ethics clearance, zero public model training certification, and legal liability protections.",
    modesInvolved: ["Transversal"],
  },
  "internal_comm_officer": {
    id: "internal_comm_officer",
    name: "Internal comm. officer (Comm.)",
    category: "supporting",
    sitsIn: "Other supporting functions (Communications)",
    mission: "Champions success stories across Opella, designs transformation broadcasts, and coordinates Cafés IA events.",
    modesInvolved: ["Transversal"],
  },
  "pc_counterpart": {
    id: "pc_counterpart",
    name: "P&C counterpart",
    category: "supporting",
    isNew: true,
    sitsIn: "Other supporting functions (People & Culture / HR)",
    mission: "Assesses the 5-pillar workforce impact on activities, roles, skills, QWL, and coordinates Works Council social dialogue.",
    modesInvolved: ["Transversal"],
  },
};

// Category visual colors matching the slide legend
const CATEGORY_STYLES: Record<
  RoleCategory,
  {
    label: string;
    avatarBg: string;
    avatarBorder: string;
    text: string;
    badgeBg: string;
    dotColor: string;
  }
> = {
  functions: {
    label: "Functions",
    avatarBg: "bg-purple-100",
    avatarBorder: "border-purple-400",
    text: "text-purple-900",
    badgeBg: "bg-purple-100 text-purple-800 border-purple-200",
    dotColor: "bg-purple-600",
  },
  to: {
    label: "TO & other supporting functions",
    avatarBg: "bg-orange-100",
    avatarBorder: "border-orange-400",
    text: "text-orange-950",
    badgeBg: "bg-orange-100 text-orange-800 border-orange-200",
    dotColor: "bg-orange-500",
  },
  data_ai: {
    label: "Data & AI",
    avatarBg: "bg-teal-100",
    avatarBorder: "border-teal-400",
    text: "text-teal-950",
    badgeBg: "bg-teal-100 text-teal-800 border-teal-200",
    dotColor: "bg-teal-600",
  },
  business_solutions: {
    label: "Business Solutions",
    avatarBg: "bg-amber-100",
    avatarBorder: "border-amber-400",
    text: "text-amber-950",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
    dotColor: "bg-amber-500",
  },
  supporting: {
    label: "Other supporting functions",
    avatarBg: "bg-pink-100",
    avatarBorder: "border-pink-400",
    text: "text-pink-950",
    badgeBg: "bg-pink-100 text-pink-800 border-pink-200",
    dotColor: "bg-pink-500",
  },
};

// ---------------------------------------------------------------------------
// AVATAR COMPONENT (MIRRORS SLIDE VISUALS)
// ---------------------------------------------------------------------------

interface AvatarRoleProps {
  roleId: string;
  overrideCategory?: RoleCategory;
  isDeployedOverride?: boolean;
  isExternalOverride?: boolean;
  subtitle?: string;
  onClick: (role: SlideRole) => void;
  size?: "sm" | "md";
}

const AvatarRole: React.FC<AvatarRoleProps> = ({
  roleId,
  overrideCategory,
  isDeployedOverride,
  isExternalOverride,
  subtitle,
  onClick,
  size = "md",
}) => {
  const role = ALL_SLIDE_ROLES[roleId];
  if (!role) return null;

  const category = overrideCategory || role.category;
  const isDeployed = isDeployedOverride !== undefined ? isDeployedOverride : Boolean(role.isDeployed);
  const isExternal = isExternalOverride !== undefined ? isExternalOverride : Boolean(role.isExternalOrBusinessSide);
  const isNew = Boolean(role.isNew);
  const style = CATEGORY_STYLES[category];

  return (
    <div
      onClick={() => onClick(role)}
      className="flex flex-col items-center text-center cursor-pointer group transition-transform hover:scale-105"
      title={`${role.name} (${role.sitsIn}) - Click to inspect`}
    >
      {/* Avatar Container with Circle & Badges */}
      <div className="relative mb-1">
        {/* Pink NEW Badge */}
        {isNew && (
          <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white font-black text-[9px] px-1 py-0.2 rounded-full uppercase tracking-wider shadow-xs z-10">
            NEW
          </span>
        )}

        {/* Avatar Circle */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
            style.avatarBg
          } ${style.avatarBorder} border ${
            isDeployed
              ? "ring-2 ring-purple-600 ring-offset-1 shadow-xs"
              : "shadow-2xs"
          } group-hover:shadow-md`}
        >
          {/* Stylized Person Icon colored by category */}
          <svg
            viewBox="0 0 24 24"
            className={`w-5 h-5 sm:w-6 sm:h-6 ${style.text}`}
            fill="currentColor"
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
          </svg>
        </div>
      </div>

      {/* Role Title Text */}
      <span
        className={`font-bold leading-tight transition-colors group-hover:text-opella-forest ${
          size === "sm" ? "text-[10px]" : "text-[11px]"
        } text-gray-900 max-w-[85px]`}
      >
        {role.name}
        {isExternal && <span className="text-purple-700 font-black">*</span>}
      </span>

      {subtitle && (
        <span className="text-[9px] text-gray-500 font-medium leading-none mt-0.5">
          {subtitle}
        </span>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// MAIN OPERATING MODEL MAP VIEW (PILLAR 2: ROLES)
// ---------------------------------------------------------------------------

export const OperatingModelMap: React.FC<OperatingModelMapProps> = ({
  onNavigateToWizard,
  onNavigateToLifecycle,
}) => {
  const [selectedRole, setSelectedRole] = useState<SlideRole | null>(null);
  const [highlightedMode, setHighlightedMode] = useState<DeliveryMode | "ALL">("ALL");

  return (
    <div className="w-full max-w-[1600px] 2xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6 animate-fade-in bg-[#fbfaf6]">
      {/* ----------------------------------------------------------------- */}
      {/* 1. SLIDE HEADER BANNER                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-opella-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500 font-bold flex items-center gap-2">
              <span>2 | Roles</span>
              <span>·</span>
              <span className="text-opella-forest font-bold">Pillar 2 : Roles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight mt-0.5">
              Which roles do we need, and where do they sit?
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Three delivery modes, colored by where the role sits. Click on any role to inspect where it sits, its mission, and its TOM status.
            </p>
          </div>

          {/* Interactive Mode Focus Selector */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-xl border border-gray-200 text-xs shrink-0 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-gray-500 px-2 hidden sm:inline">
              View Focus:
            </span>
            <button
              onClick={() => setHighlightedMode("ALL")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                highlightedMode === "ALL"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              All 3 Modes (Slide View)
            </button>
            <button
              onClick={() => setHighlightedMode("Mode 1")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                highlightedMode === "Mode 1"
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Do it for me
            </button>
            <button
              onClick={() => setHighlightedMode("Mode 2")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                highlightedMode === "Mode 2"
                  ? "bg-blue-800 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Do it with me
            </button>
            <button
              onClick={() => setHighlightedMode("Mode 3")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                highlightedMode === "Mode 3"
                  ? "bg-purple-800 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Enable me
            </button>
          </div>
        </div>

        {/* Quick Nav Row */}
        <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-1 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Operating Model Spine:</span>
            <span>Build use cases leveraging transversal resources based on the selected mode.</span>
          </div>
          <div className="flex items-center gap-3">
            {onNavigateToWizard && (
              <button
                onClick={onNavigateToWizard}
                className="text-opella-forest font-bold hover:underline flex items-center gap-1"
              >
                Intake Mode Selection (Step 4) →
              </button>
            )}
            {onNavigateToLifecycle && (
              <button
                onClick={() => onNavigateToLifecycle("G4")}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                Gate G4 Mode Lock →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 2. TOP SECTION: USE CASE SQUAD TEAMS (3 SQUAD MODES)              */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Title Label matching Slide */}
          <div className="lg:w-48 shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:pr-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                Use case squad teams
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Build use case leveraging the transversal resources based on the mode
              </p>
            </div>

            <div className="text-[11px] text-gray-400 italic pt-4 hidden lg:block">
              Interactive Slide Layout · Click any role icon for detailed remit
            </div>
          </div>

          {/* 3 Squad Mode Columns */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ============================================================= */}
            {/* MODE 1: DO IT FOR ME                                          */}
            {/* ============================================================= */}
            <div
              className={`rounded-2xl border-2 transition-all flex flex-col justify-between ${
                highlightedMode === "Mode 1" || highlightedMode === "ALL"
                  ? "border-[#134e2a] bg-white shadow-sm"
                  : "border-gray-200 bg-gray-50/50 opacity-50"
              }`}
            >
              {/* Header Box */}
              <div className="bg-[#134e2a] text-white py-2 px-4 rounded-t-xl text-center font-black text-sm tracking-wide shadow-xs">
                Do it for me
              </div>

              {/* Squad Loop Container */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative min-h-[320px]">
                {/* Center Title Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border border-dashed border-gray-300 rounded-full w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                    <span className="font-black text-xs sm:text-sm text-gray-700 tracking-wider uppercase bg-white/90 px-3 py-1 rounded-md shadow-2xs">
                      Squad mode 1
                    </span>
                  </div>
                </div>

                {/* Top Row: BO/PO (NEW) & Business Architect (NEW) */}
                <div className="flex justify-around items-start z-10 pt-1">
                  <AvatarRole
                    roleId="bopo"
                    overrideCategory="to" // Orange avatar as per slide
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="business_architect"
                    overrideCategory="to" // Orange avatar
                    onClick={setSelectedRole}
                  />
                </div>

                {/* Middle Left: FDE (NEW) */}
                <div className="flex justify-between items-center z-10 px-2 my-auto">
                  <AvatarRole
                    roleId="fde"
                    overrideCategory="data_ai" // Teal avatar
                    onClick={setSelectedRole}
                  />
                  <div className="w-1" /> {/* Spacer */}
                </div>

                {/* Bottom Loop: Digital PO -> Data scientist -> AI engineer -> Data eng./architect */}
                <div className="grid grid-cols-4 gap-1 items-end z-10 pt-4">
                  <AvatarRole
                    roleId="digital_po"
                    overrideCategory="business_solutions" // Yellow avatar
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="data_scientist"
                    overrideCategory="data_ai" // Teal avatar
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="ai_engineer"
                    overrideCategory="data_ai" // Teal avatar
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="data_eng_architect"
                    overrideCategory="data_ai" // Teal avatar
                    size="sm"
                    onClick={setSelectedRole}
                  />
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* MODE 2: DO IT WITH ME                                         */}
            {/* ============================================================= */}
            <div
              className={`rounded-2xl border-2 transition-all flex flex-col justify-between ${
                highlightedMode === "Mode 2" || highlightedMode === "ALL"
                  ? "border-[#134e2a] bg-white shadow-sm"
                  : "border-gray-200 bg-gray-50/50 opacity-50"
              }`}
            >
              {/* Header Box */}
              <div className="bg-[#134e2a] text-white py-2 px-4 rounded-t-xl text-center font-black text-sm tracking-wide shadow-xs">
                Do it with me
              </div>

              {/* Squad Loop Container */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative min-h-[320px]">
                {/* Center Title Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border border-dashed border-gray-300 rounded-full w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                    <span className="font-black text-xs sm:text-sm text-gray-700 tracking-wider uppercase bg-white/90 px-3 py-1 rounded-md shadow-2xs">
                      Squad mode 2
                    </span>
                  </div>
                </div>

                {/* Top Row: BO/PO (NEW, Deployed) -> Business Analytics -> Business Architect (NEW) */}
                <div className="flex justify-between items-start z-10 pt-1">
                  <AvatarRole
                    roleId="bopo"
                    overrideCategory="to"
                    isDeployedOverride={true} // Purple circle outline
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="business_analytics"
                    overrideCategory="functions" // Purple avatar
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="business_architect"
                    overrideCategory="to" // Orange avatar
                    size="sm"
                    onClick={setSelectedRole}
                  />
                </div>

                {/* Middle Row: FDE (Left) and AI Builder (Right, Deployed) */}
                <div className="flex justify-between items-center z-10 px-1 my-auto">
                  <AvatarRole
                    roleId="fde"
                    overrideCategory="data_ai"
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="ai_builder"
                    overrideCategory="functions"
                    isDeployedOverride={true} // Purple circle outline
                    size="sm"
                    onClick={setSelectedRole}
                  />
                </div>

                {/* Bottom Row: Digital PO -> Data Scientist (Deployed) -> AI Engineer (Deployed) -> Data Eng (Deployed) */}
                <div className="grid grid-cols-4 gap-1 items-end z-10 pt-4">
                  <AvatarRole
                    roleId="digital_po"
                    overrideCategory="business_solutions"
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="data_scientist"
                    overrideCategory="data_ai"
                    isDeployedOverride={true} // Purple circle outline
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="ai_engineer"
                    overrideCategory="data_ai"
                    isDeployedOverride={true} // Purple circle outline
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="data_eng_architect"
                    overrideCategory="data_ai"
                    isDeployedOverride={true} // Purple circle outline
                    size="sm"
                    onClick={setSelectedRole}
                  />
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* MODE 3: ENABLE ME                                             */}
            {/* ============================================================= */}
            <div
              className={`rounded-2xl border-2 transition-all flex flex-col justify-between ${
                highlightedMode === "Mode 3" || highlightedMode === "ALL"
                  ? "border-[#134e2a] bg-white shadow-sm"
                  : "border-gray-200 bg-gray-50/50 opacity-50"
              }`}
            >
              {/* Header Box */}
              <div className="bg-[#134e2a] text-white py-2 px-4 rounded-t-xl text-center font-black text-sm tracking-wide shadow-xs">
                Enable me
              </div>

              {/* Squad Loop Container */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative min-h-[320px]">
                {/* Center Title Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border border-dashed border-gray-300 rounded-full w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                    <span className="font-black text-xs sm:text-sm text-gray-700 tracking-wider uppercase bg-white/90 px-3 py-1 rounded-md shadow-2xs">
                      Squad mode 3
                    </span>
                  </div>
                </div>

                {/* Top Row: BO/PO (NEW, Deployed) -> Business Analytics -> Business Architect (NEW) */}
                <div className="flex justify-between items-start z-10 pt-1">
                  <AvatarRole
                    roleId="bopo"
                    overrideCategory="to"
                    isDeployedOverride={true} // Purple circle outline
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="business_analytics"
                    overrideCategory="functions" // Purple avatar
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="business_architect"
                    overrideCategory="to" // Orange avatar
                    size="sm"
                    onClick={setSelectedRole}
                  />
                </div>

                {/* Middle Right: AI Builder (NEW, Deployed) */}
                <div className="flex justify-end items-center z-10 px-1 my-auto">
                  <AvatarRole
                    roleId="ai_builder"
                    overrideCategory="functions"
                    isDeployedOverride={true} // Purple circle outline
                    size="sm"
                    onClick={setSelectedRole}
                  />
                </div>

                {/* Bottom Row: Digital PO -> Data Scientist* -> AI Engineer* -> Data Eng* (All Purple/External) */}
                <div className="grid grid-cols-4 gap-1 items-end z-10 pt-3">
                  <AvatarRole
                    roleId="digital_po"
                    overrideCategory="business_solutions" // Yellow avatar
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="data_scientist"
                    overrideCategory="functions" // Purple avatar with asterisk
                    isExternalOverride={true}
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="ai_engineer"
                    overrideCategory="functions" // Purple avatar with asterisk
                    isExternalOverride={true}
                    size="sm"
                    onClick={setSelectedRole}
                  />
                  <AvatarRole
                    roleId="data_eng_architect"
                    overrideCategory="functions" // Purple avatar with asterisk
                    isExternalOverride={true}
                    size="sm"
                    onClick={setSelectedRole}
                  />
                </div>

                {/* In Support Box at Bottom (Teal Avatars) */}
                <div className="mt-4 pt-2 border-t border-gray-200 z-10 bg-gray-50/80 rounded-xl p-2 border border-dashed border-gray-300">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase mb-1">
                    <span className="text-teal-900 font-black">In support</span>
                    <span className="text-gray-400">Data & AI Central Guidance</span>
                  </div>
                  <div className="flex items-center justify-around">
                    <AvatarRole
                      roleId="data_scientist"
                      overrideCategory="data_ai"
                      subtitle="DS Support"
                      size="sm"
                      onClick={setSelectedRole}
                    />
                    <AvatarRole
                      roleId="ai_engineer"
                      overrideCategory="data_ai"
                      subtitle="AI Eng Support"
                      size="sm"
                      onClick={setSelectedRole}
                    />
                    <AvatarRole
                      roleId="data_eng_architect"
                      overrideCategory="data_ai"
                      subtitle="Data Arch Support"
                      size="sm"
                      onClick={setSelectedRole}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. BOTTOM SECTION: TRANSVERSAL TEAMS (THE HUB & SURROUNDINGS)     */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Title Label matching Slide */}
          <div className="lg:w-48 shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:pr-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                Transversal teams
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Present whatever the mode.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 hidden lg:block">
              <strong>Core TOM Rule:</strong> Transversal teams provide architecture, comitology, ethics, and platform guardrails across all squads.
            </div>
          </div>

          {/* 5 Transversal Boxes Grid */}
          <div className="flex-1 space-y-3">
            {/* "The hub" Overarching Pill spanning TO and Data & AI */}
            <div className="flex justify-center">
              <span className="bg-[#134e2a] text-white px-8 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
                The hub
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* 1. Functions/ Regions (Purple dashed border) */}
              <div className="rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/30 p-3 flex flex-col justify-between space-y-3">
                <div className="border-b border-purple-200 pb-1.5">
                  <h4 className="font-black text-xs text-purple-950 uppercase tracking-wider">
                    Functions/ Regions
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2 my-auto">
                  <AvatarRole roleId="data_stewards" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="ai_catalyst" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="business_testers" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="business_sponsor" size="sm" onClick={setSelectedRole} />
                </div>
                <div className="text-[10px] text-purple-800 font-semibold text-center pt-1 border-t border-purple-100">
                  Domain Context
                </div>
              </div>

              {/* 2. Transformation office (TO) (Orange dashed border - inside The Hub) */}
              <div className="rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/30 p-3 flex flex-col justify-between space-y-3 ring-1 ring-[#134e2a]/20">
                <div className="border-b border-orange-200 pb-1.5">
                  <h4 className="font-black text-xs text-orange-950 uppercase tracking-wider">
                    Transformation office (TO)
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2 my-auto">
                  <AvatarRole roleId="to_lead" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="change_adoption_lead_amplifai" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="change_management_lead_butterfly" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="regional_adoption_relays" size="sm" onClick={setSelectedRole} />
                </div>
                <div className="text-[10px] text-orange-800 font-semibold text-center pt-1 border-t border-orange-100">
                  Comitology & Adoption
                </div>
              </div>

              {/* 3. Data & AI (Digital) (Teal dashed border - inside The Hub) */}
              <div className="rounded-xl border-2 border-dashed border-teal-300 bg-teal-50/30 p-3 flex flex-col justify-between space-y-3 ring-1 ring-[#134e2a]/20">
                <div className="border-b border-teal-200 pb-1.5">
                  <h4 className="font-black text-xs text-teal-950 uppercase tracking-wider">
                    Data & AI (Digital)
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2 my-auto">
                  <AvatarRole roleId="semantic_layer_arch" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="master_data_mdm" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="data_governance" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="ai_governance" size="sm" onClick={setSelectedRole} />
                  <div className="col-span-2 flex justify-center">
                    <AvatarRole roleId="data_product_lead" size="sm" onClick={setSelectedRole} />
                  </div>
                </div>
                <div className="text-[10px] text-teal-800 font-semibold text-center pt-1 border-t border-teal-100">
                  Platform & Standards
                </div>
              </div>

              {/* 4. Digital transversal teams (Yellow dashed border) */}
              <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/30 p-3 flex flex-col justify-between space-y-3">
                <div className="border-b border-amber-200 pb-1.5">
                  <h4 className="font-black text-xs text-amber-950 uppercase tracking-wider">
                    Digital transversal teams
                  </h4>
                </div>
                <div className="space-y-2 my-auto">
                  <AvatarRole roleId="business_solutions_team" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="enterprise_architecture" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="infra_cyber" size="sm" onClick={setSelectedRole} />
                </div>
                <div className="text-[10px] text-amber-800 font-semibold text-center pt-1 border-t border-amber-100">
                  IT Foundations
                </div>
              </div>

              {/* 5. Other supporting functions (Pink dashed border) */}
              <div className="rounded-xl border-2 border-dashed border-pink-300 bg-pink-50/30 p-3 flex flex-col justify-between space-y-3">
                <div className="border-b border-pink-200 pb-1.5">
                  <h4 className="font-black text-xs text-pink-950 uppercase tracking-wider">
                    Other supporting functions
                  </h4>
                </div>
                <div className="space-y-2 my-auto">
                  <AvatarRole roleId="value_officer" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="orai_team" size="sm" onClick={setSelectedRole} />
                  <AvatarRole roleId="internal_comm_officer" size="sm" onClick={setSelectedRole} />
                  <AvatarRole
                    roleId="pc_counterpart"
                    subtitle="(case by case)"
                    size="sm"
                    onClick={setSelectedRole}
                  />
                </div>
                <div className="text-[10px] text-pink-800 font-semibold text-center pt-1 border-t border-pink-100">
                  Governance & People
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4b. OFFICIAL ACTIVITIES & RACI BY DELIVERY MODE (SLIDES 4-9)     */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-opella-border space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-2">
              <span>Opella Playbook RACI · Slides 4 to 9</span>
              <span>·</span>
              <span className="text-gray-500 font-semibold">47 Core Activities</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight mt-0.5">
              Activities & Role Interventions by Delivery Mode
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Exact mapping of profiles, accountable teams, and delivery mode splits across Demand, Build, Run, and Transversal Governance.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-900 font-bold border border-purple-200">
              Function
            </span>
            <span className="px-2.5 py-1 rounded-md bg-orange-100 text-orange-900 font-bold border border-orange-200">
              Transf. Office
            </span>
            <span className="px-2.5 py-1 rounded-md bg-teal-100 text-teal-900 font-bold border border-teal-200">
              Data &amp; AI
            </span>
            <span className="px-2.5 py-1 rounded-md bg-pink-100 text-pink-900 font-bold border border-pink-200">
              Value Officer / ORAI
            </span>
          </div>
        </div>

        {/* Scrollable RACI Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-950 text-white text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-3.5 border-r border-emerald-900 w-36">Macro-Activity</th>
                <th className="py-3 px-3.5 border-r border-emerald-900 min-w-[220px]">Activities</th>
                <th className="py-3 px-3.5 border-r border-emerald-900 min-w-[180px]">Profile</th>
                <th className="py-3 px-3.5 border-r border-emerald-900 w-48 text-center bg-emerald-900/90">
                  Mode 1: Do it for me
                  <span className="block text-[9px] font-normal text-emerald-200">Hub leads</span>
                </th>
                <th className="py-3 px-3.5 border-r border-emerald-900 w-52 text-center bg-blue-950/90">
                  Mode 2: Do it with me
                  <span className="block text-[9px] font-normal text-sky-200">Function leads, hub supports</span>
                </th>
                <th className="py-3 px-3.5 w-48 text-center bg-purple-950/90">
                  Mode 3: Enable me
                  <span className="block text-[9px] font-normal text-purple-200">Function autonomous</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-gray-800 text-[11px]">
              {/* DEMAND MANAGEMENT / FRAMING */}
              <tr className="bg-emerald-50/40">
                <td rowSpan={11} className="py-3 px-3.5 font-bold text-emerald-950 align-top border-r border-gray-200">
                  Demand Management / Framing Phase
                </td>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Collect &amp; qualify business needs</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">AI catalyst - BO/PO</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Specify business needs into technical product (use case)</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">PO/BO - Digital PO - FDE</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Build UC business case &amp; assess post implementation measurement of success</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">PO/BO</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200 text-pink-950 font-bold">Ensure the UC business case &amp; measure of success is carried out (accountable)</td>
                <td className="py-2.5 px-3.5 text-pink-900 font-mono text-[10px] font-bold border-r border-gray-200">Value officer</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">Value Officer</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">Value Officer</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">Value Officer</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Assess use cases tech complexity</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Eng / Architect</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Assess use cases legal feasibility</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">ORAI team</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">ORAI team (LEX)</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">ORAI team (LEX)</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">ORAI team (LEX)</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Assess data readiness &amp; data gov. prerequisites</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Eng / Architect - Data Governance</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Prioritize use cases</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">TO lead / Data Eng / Architect / Business Sponsors</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold mr-1">Transf. Office</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold mr-1">Transf. Office</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold mr-1">Transf. Office</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Define use cases roadmap</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">TO lead / Data Eng / Architect</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold mr-1">Transf. Office</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold mr-1">Transf. Office</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold mr-1">Transf. Office</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Define acceptance criteria &amp; definitions of done</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">BO/PO</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Estimate cost &amp; resources needed and select model</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Eng / Architect</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
              </tr>

              {/* DELIVERY (BUILD) */}
              <tr className="bg-blue-50/40">
                <td rowSpan={3} className="py-3 px-3.5 font-bold text-blue-950 align-top border-r border-gray-200">
                  Delivery (build)
                </td>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Develop the use case (algorithms, AI dashboard, agents...)</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">AI engineer - Data Scientist - AI builder - FDE - Business Analytics</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Quality, functional &amp; performance tests based on DoD and acceptance criteria</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">AI engineer - Data Scientist - AI builder</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Validate that use cases meet business expectations (UAT)</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">PO/BO - Digital PO - Business testers - FDE</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>

              {/* RUN AND SCALE (RUN) */}
              <tr className="bg-amber-50/40">
                <td rowSpan={3} className="py-3 px-3.5 font-bold text-amber-950 align-top border-r border-gray-200">
                  Run and scale (run)
                </td>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Own the run and the run cost (tokens included) in the function P&amp;L</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">PO/BO - Digital PO</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Adapt the use case according to new business requirements or technical bugs</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">AI engineer - Data Eng. - Architect - AI builders - Business Analytics</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Monitor Adoption and costs</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Adoption Lead / Regional adoption relays / Value Officer</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold mr-1">Transf. Office</span><span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-900 font-semibold">Value Officer</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold mr-1">Transf. Office</span><span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-900 font-semibold">Value Officer</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold mr-1">Transf. Office</span><span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-900 font-semibold">Value Officer</span></td>
              </tr>

              {/* DATA MODELING & INTEGRATION */}
              <tr className="bg-teal-50/40">
                <td rowSpan={9} className="py-3 px-3.5 font-bold text-teal-950 align-top border-r border-gray-200">
                  Data Modeling &amp; Source Integration
                </td>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Discover &amp; profile data sources</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Engineer / Architect / AI builder</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Frame logical data models according to business needs</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data steward - Data Eng. Architect</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold">Function</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold">Function</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Design logical data models</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Architect - AI builder</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold">Function</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Clean, organise &amp; build re-usable data products (raw to bronze, silver and gold)</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Engineer - AI builder</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold">Function</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Document data into data catalog (data domain taxonomy, data sources, KPIs definitions)</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Eng. / Architect / Data steward</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold">Function</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Define data business objects</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">PO/BO</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Define and implement quality tests in the pipeline</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Eng./Architect</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Build flows between source system &amp; data platforms</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Engineer</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Collect historical data from systems and ingest raw data into the platform</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Engineer</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold">Function</span></td>
              </tr>

              {/* TRANSVERSAL GOVERNANCE & ARCHITECTURE */}
              <tr className="bg-orange-50/40">
                <td rowSpan={10} className="py-3 px-3.5 font-bold text-orange-950 align-top border-r border-gray-200">
                  Transversal Governance &amp; Platform
                </td>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Define the operating model, RACI and gates</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Transformation Office lead</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Define architecture, standards and ADRs (Digital Design Authority)</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Eng / Architect - Enterprise architect</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">Digital transversal</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">Digital transversal</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold mr-1">Data &amp; AI</span><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">Digital transversal</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Run the shared platform and the Opella IQ semantic layer</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Semantic layer architect</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Build the function's AI roadmap</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">PO/BO - TO Lead</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">Transf. Office</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Prioritize across functions; one backlog, quarterly capacity plan</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">TO Lead - Business Sponsor</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">Transf. Office</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Keep the registry of approved solutions and sandbox builds</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">AI governance</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200 text-pink-950 font-bold">Set funding rules: big bets central, the rest and run cost in functions</td>
                <td className="py-2.5 px-3.5 text-pink-900 font-mono text-[10px] font-bold border-r border-gray-200">Value officer - TO Lead</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-900 font-semibold mr-1">Value Officer</span><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-900 font-semibold mr-1">Value Officer</span><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-900 font-semibold mr-1">Value Officer</span><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">Transf. Office</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Provide data quality monitoring tools</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data Eng/ Architect - Data governance</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Define data quality remediation process</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Data governance - Data steward</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Maintain the use case after go-live: features, fixes, model drift</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">PO/BO - Digital PO - Data Scientist / Data Eng.</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">Data &amp; AI</span></td>
              </tr>

              {/* INFRASTRUCTURE, LEGAL & ADOPTION */}
              <tr className="bg-pink-50/30">
                <td rowSpan={11} className="py-3 px-3.5 font-bold text-pink-950 align-top border-r border-gray-200">
                  Infra, Legal &amp; Adoption
                </td>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Manage network, security and access control</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Infra &amp; Cyber</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">Digital transversal</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">Digital transversal</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">Digital transversal</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Monitor platform performance, cost and tokens</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Infra &amp; Cyber</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">Digital transversal</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">Digital transversal</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">Digital transversal</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Set the responsible-AI framework and the three risk tiers</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">ORAI team</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">ORAI team</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">ORAI team</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">ORAI team</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Triage and review each initiative: low, medium or high risk</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">ORAI team - Cyber</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">ORAI team</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">ORAI team</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">ORAI team</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Check privacy, security and contracts of bought tools and SaaS</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">ORAI team - Cyber</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-900 font-semibold mr-1">ORAI team</span><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">Digital transversal</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-900 font-semibold mr-1">ORAI team</span><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">Digital transversal</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-900 font-semibold mr-1">ORAI team</span><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">Digital transversal</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Set communication &amp; capability building guidelines</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">TO lead - Change &amp; adoption lead</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Define playbook of guidelines (adoption, acculturation)</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">TO lead - Change &amp; adoption lead</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Create and manage adoption plan</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">PO/BO - Regional adoption relays</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">Transf. Office</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Acculturate &amp; train users on Data &amp; AI</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">PO/BO - AI Catalyst - Regional adoption relays</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold mr-1">Function</span><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">Function</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Build &amp; animate Data &amp; AI communities</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">Regional adoption relays</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">Transf. Office</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-medium border-r border-gray-200">Plan workforce and social dialogue</td>
                <td className="py-2.5 px-3.5 text-gray-600 font-mono text-[10px] border-r border-gray-200">P&amp;C counterparts</td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">P&amp;C counterparts</span></td>
                <td className="py-2.5 px-3 text-center border-r border-gray-200"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">P&amp;C counterparts</span></td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-bold">P&amp;C counterparts</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4. LEGEND & FOOTNOTES (MATCHING SLIDE FOOTER EXACTLY)             */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded bg-[#134e2a] text-white font-bold flex items-center justify-center text-xs">
            Op.
          </div>
          <span className="font-black text-gray-900 tracking-tight text-sm">Opella.</span>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-gray-700">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600" /> Functions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500" /> TO & other supporting functions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-600" /> Data & AI
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" /> Business Solutions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-purple-600 bg-white" /> Deployed profiles in function side
          </span>
        </div>

        {/* Footnotes */}
        <div className="text-[10px] text-gray-500 text-center md:text-right space-y-0.5">
          <div>Digital PO comes from Data & AI or Business Solutions, per use case</div>
          <div>* External team or business-side resource, with Data & AI guidance (ex: M&S)</div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 5. MODAL: ROLE DETAILS INSPECTOR                                 */}
      {/* ----------------------------------------------------------------- */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-scale-in">
            <div className="flex items-start justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    CATEGORY_STYLES[selectedRole.category].avatarBg
                  } ${CATEGORY_STYLES[selectedRole.category].avatarBorder} border-2 ${
                    selectedRole.isDeployed ? "ring-2 ring-purple-600 ring-offset-1" : ""
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-7 h-7 ${CATEGORY_STYLES[selectedRole.category].text}`}
                    fill="currentColor"
                  >
                    <circle cx="12" cy="7" r="4" />
                    <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        CATEGORY_STYLES[selectedRole.category].badgeBg
                      }`}
                    >
                      {CATEGORY_STYLES[selectedRole.category].label}
                    </span>
                    {selectedRole.isNew && (
                      <span className="bg-pink-500 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                        NEW ROLE
                      </span>
                    )}
                    {selectedRole.isDeployed && (
                      <span className="border border-purple-500 text-purple-700 font-bold text-[9px] px-1.5 py-0.2 rounded-full bg-purple-50">
                        Deployed in Function
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mt-0.5">
                    {selectedRole.name}
                  </h3>
                  <div className="text-xs text-gray-500 font-semibold">{selectedRole.sitsIn}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedRole(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="font-bold text-gray-900 block mb-1">Mission & Operating Remit:</span>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  {selectedRole.mission}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Where It Sits</span>
                  <span className="font-bold text-gray-900 text-xs mt-0.5 block">{selectedRole.sitsIn}</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Modes Involved</span>
                  <span className="font-bold text-opella-forest text-xs mt-0.5 block">
                    {selectedRole.modesInvolved.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedRole(null)}
                className="px-5 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm"
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
