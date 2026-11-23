import {
  BigBetInfo,
  GateDetail,
  GateId,
  Tier,
  DeliveryMode,
  ModeDeepDive,
  TierDeepDive,
} from "@/types";

export const BIG_BETS: BigBetInfo[] = [
  {
    id: "BET_1",
    name: "Win the Consumer Journey",
    leadStream: "CxA + E-com (65% confidence)",
    confidence: "65%",
    description: "6 use cases mapped covering consumer experience, feeds, measurement, personalized landing pages, and engagement.",
  },
  {
    id: "BET_2",
    name: "Win the Innovation",
    leadStream: "Science (R&D & Regulatory)",
    confidence: "55%",
    description: "Claims generation, drug formulation, regulatory dossiers, and clinical literature mining.",
  },
  {
    id: "BET_3",
    name: "Win the Trade",
    leadStream: "CEX + RGM (55% confidence)",
    confidence: "55%",
    description: "5 use cases mapped including field sales rep tools, dynamic feeds, and Trade Promotion Management (TPM) agents.",
  },
  {
    id: "BET_4",
    name: "Forecast to Planning",
    leadStream: "IBP (Integrated Business Planning - 85% confidence)",
    confidence: "85%",
    description: "12 use cases mapped spanning demand sensing, automated baseline forecasting, supply chain orchestration, and CxA links.",
  },
  {
    id: "BET_5",
    name: "Augmented Plants",
    leadStream: "M&Q (Manufacturing & Quality - 85% confidence)",
    confidence: "85%",
    description: "7 use cases mapped across smart predictive maintenance, batch release quality bots, and shopfloor digital assistants.",
  },
  {
    id: "BET_6",
    name: "Business Partner Function Process Reshapes",
    leadStream: "Procurement + Finance + Data & AI (50% confidence)",
    confidence: "50%",
    description: "9 use cases mapped including S2P GIDE/BOWIE procurement agents, R2R automated reconciliation, and GBS shared service agents.",
  },
];

export const TIER_CONFIG: Record<
  Tier,
  {
    name: string;
    subtitle: string;
    threshold: string;
    speedCadence: string;
    approvalForum: string;
    fundingMechanism: string;
    trackingRequired: string;
    hubRole: string;
    sponsorLevel: string;
    typicalModes: DeliveryMode[];
    colorClass: {
      bg: string;
      border: string;
      text: string;
      badge: string;
    };
  }
> = {
  T1: {
    name: "T1 · Transform",
    subtitle: "Big Bets & Butterfly Core",
    threshold: "Build > €1m, or core platform change, or Big Bet scope",
    speedCadence: "Strategic Governance · Monthly SteerCo reviews + Weekly Portfolio escalations",
    approvalForum: "Transformation SteerCo (with CD&R board visibility)",
    fundingMechanism: "Individual business case in corporate budget & strategic plan (released in tranches)",
    trackingRequired: "Butterfly governance status, Planisware updates, Monthly RAG status",
    hubRole: "Track & validate ROI, lead or co-build core architecture",
    sponsorLevel: "C-Level Executive (Bet Sponsor)",
    typicalModes: ["Mode 1", "Mode 2"],
    colorClass: {
      bg: "bg-emerald-50",
      border: "border-emerald-600",
      text: "text-emerald-900",
      badge: "bg-emerald-700 text-white",
    },
  },
  T2: {
    name: "T2 · Scale",
    subtitle: "Enterprise Use Cases",
    threshold: "€200k – €1m, or >1 function/region, or 500+ users, or hub build capacity",
    speedCadence: "Accelerated Scaling · Biweekly AI Portfolio Board + Tranche milestone unlocks",
    approvalForum: "Program Sponsors (CDO + CFO) on AI Portfolio Board advice (SteerCo informed only)",
    fundingMechanism: "Light business case (1–2 pages), budget released in tranches",
    trackingRequired: "Value KPIs, Design Authority decisions, Planisware rollout status",
    hubRole: "Track & validate ROI, shared squad support",
    sponsorLevel: "Business Unit Owner / VP",
    typicalModes: ["Mode 2", "Mode 3"],
    colorClass: {
      bg: "bg-blue-50",
      border: "border-blue-600",
      text: "text-blue-900",
      badge: "bg-blue-600 text-white",
    },
  },
  T3: {
    name: "T3 · Fast Lane",
    subtitle: "Explore & Quick Wins",
    threshold: "Up to €200k, 1 single function, value hypothesis to test",
    speedCadence: "Agile Sprint Pace · 10 days to decision, 6–8 week MVP sprint, fail-fast",
    approvalForum: "AI Portfolio Board (delegated by Program Leadership) · Only forum seen",
    fundingMechanism: "Ring-fenced AmplifAI envelope (25% hub capacity), released per sprint",
    trackingRequired: "One-page canvas, 6–8 week sprint progress, light tracker (no Planisware)",
    hubRole: "Ability to create MVP fast & validate ROI",
    sponsorLevel: "Business Function Process Owner",
    typicalModes: ["Mode 3", "Mode 2"],
    colorClass: {
      bg: "bg-amber-50",
      border: "border-amber-600",
      text: "text-amber-900",
      badge: "bg-amber-600 text-white",
    },
  },
  "Self-Serve": {
    name: "Self-Serve · Register & Go",
    subtitle: "Personal & Team Productivity",
    threshold: "Under €50k, approved tools & data, configured rather than built",
    speedCadence: "Instant / Real-time · Immediate access, automated screening, no committee",
    approvalForum: "Function Head; Design Authority fit check only if new tool evaluated",
    fundingMechanism: "Function operational budget & existing software licenses",
    trackingRequired: "AI Registry entry, guardrail compliance checks, quarterly value pulse",
    hubRole: "Visibility, avoid duplicate tooling, license usage management",
    sponsorLevel: "Department / Team Lead",
    typicalModes: ["Self-Service AI", "Mode 3"],
    colorClass: {
      bg: "bg-purple-50",
      border: "border-purple-600",
      text: "text-purple-900",
      badge: "bg-purple-700 text-white",
    },
  },
};

export const DELIVERY_MODES_INFO: Record<
  DeliveryMode,
  {
    title: string;
    motto: string;
    description: string;
    bestFor: string;
    ownershipSplit: string;
    iconName: string;
  }
> = {
  "Mode 1": {
    title: "Mode 1: Do it for me",
    motto: "“We ride for you”",
    description: "The hub leads delivery and run; the function defines the need, validates the outcome and owns the value.",
    bestFor: "Complex, cross-functional builds or solutions built on the shared platform (Snowflake / Databricks / Azure GenAI) where function has no tech capacity.",
    ownershipSplit: "Function owns the need; Hub builds and runs.",
    iconName: "Bike",
  },
  "Mode 2": {
    title: "Mode 2: Do it with me",
    motto: "“We ride together”",
    description: "The function leads, the hub builds with it with dedicated hub capacity and shared squads.",
    bestFor: "Medium complexity: needs deep business process knowledge and hub specialized engineering together (e.g., Supply chain forecasting).",
    ownershipSplit: "Function and hub build together, co-funded with dedicated hub capacity.",
    iconName: "Users",
  },
  "Mode 3": {
    title: "Mode 3: Enable me",
    motto: "“We give you the right bike and the map”",
    description: "The function frames and builds a solution it sources (external SaaS or AI Builders), the hub provides guidance and guardrails.",
    bestFor: "External SaaS (e.g. LEO in Procurement, Wonka) or MVPs developed autonomously by certified AI builders in the business.",
    ownershipSplit: "Function builds it; Hub sets the guardrails and the run can be handled by the function.",
    iconName: "Compass",
  },
  "Self-Service AI": {
    title: "Self-Service AI (Builder & User)",
    motto: "“Build with instant guardrails”",
    description: "Individuals and citizen builders leverage approved tools (Copilot, Opella GPT, low-code sandbox) with automated checks.",
    bestFor: "Personal assistants, simple automations, document summaries under €50k with no production writes.",
    ownershipSplit: "100% user-owned with automated token caps and audit agents.",
    iconName: "Zap",
  },
};

export const MODE_DEEP_DIVES: Record<DeliveryMode, ModeDeepDive> = {
  "Mode 1": {
    mode: "Mode 1",
    title: "Mode 1: Do it for me",
    motto: "“We ride for you”",
    ownershipSplit:
      "Function owns the business problem & outcome; Data & AI Hub leads build, deployment, and ongoing run.",
    whySelected: {
      primaryDrivers: [
        "High technical complexity requiring custom LLM/agent engineering on central foundations (Databricks, Snowflake, Azure GenAI)",
        "Business function has zero or minimal internal technical engineering capacity",
        "Strategic multi-market or enterprise-wide scope requiring strict latency, security, and unified data ontology",
      ],
      technicalComplexityProfile:
        "High (Custom agent orchestration, vector retrieval, ERP/SAP write-back)",
      functionTechCapabilityRequired:
        "Low / None (Function focuses purely on business rules & UAT)",
      platformFit:
        "Central Foundation Platforms (Databricks Delta Lake, Azure OpenAI Private Endpoints, Opella IQ)",
      bestFitScenarios:
        "Lumen Commercial Content Engine, Enterprise Brand Matrix compliance, Cross-functional GenAI agents",
    },
    teamDisposition: {
      dataAndAiTeam: [
        {
          role: "Forward Deployed Engineer (FDE)",
          allocation: "1.0 FTE (Full-time)",
          responsibility:
            "Architects and builds agent pipelines, LangChain chains, API connectors, and model prompting.",
          profileType: "Tech",
        },
        {
          role: "Data & Semantic Architect",
          allocation: "0.5 FTE",
          responsibility:
            "Connects ERP/SAP data sources, builds Databricks delta lake ingestion, maps Opella IQ ontology.",
          profileType: "Tech",
        },
        {
          role: "AI / MLOps Engineer",
          allocation: "0.5 FTE",
          responsibility:
            "Manages Azure GenAI tenant security boundaries, token consumption caps, latency, and automated drift tests.",
          profileType: "Tech",
        },
      ],
      transformationOffice: [
        {
          role: "AI Catalyst / Stream Lead",
          allocation: "0.4 FTE",
          responsibility:
            "Orchestrates gate comitology (G1–G6), aligns with Butterfly core releases, and tracks milestone progress.",
          profileType: "Governance",
        },
        {
          role: "Change & Adoption Specialist",
          allocation: "0.5 FTE",
          responsibility:
            "Executes 5-Pillar Workforce Impact Scan, designs role evolution, and delivers user training clinics.",
          profileType: "Change",
        },
        {
          role: "Value & Portfolio Lead",
          allocation: "0.2 FTE",
          responsibility:
            "Validates financial baseline with Finance BP, reconciles P&L impact in Unified Value Ledger.",
          profileType: "Governance",
        },
      ],
      businessFunction: [
        {
          role: "Accountable Business Owner (BO/PO)",
          allocation: "0.8 - 1.0 FTE (Dedicated)",
          responsibility:
            "Full ownership of user stories, backlog priorities, acceptance criteria, and P&L value realization.",
          profileType: "Business",
        },
        {
          role: "Subject Matter Experts (SMEs)",
          allocation: "2 x 0.3 FTE",
          responsibility:
            "Provide operational ground truth, review edge cases, validate generated outputs against business rules.",
          profileType: "Business",
        },
        {
          role: "Business Unit Sponsor / SteerCo Lead",
          allocation: "Executive Sponsor",
          responsibility:
            "ExCo / BU Vice President providing executive sponsorship and unblocking regional adoption.",
          profileType: "Business",
        },
      ],
    },
  },
  "Mode 2": {
    mode: "Mode 2",
    title: "Mode 2: Do it with me",
    motto: "“We ride together”",
    ownershipSplit:
      "Function leads the initiative; Data & AI Hub builds with it via dedicated Hub capacity and shared squads.",
    whySelected: {
      primaryDrivers: [
        "Medium-to-high technical complexity requiring intimate operational business logic combined with specialized AI engineering",
        "Business function has capable business analysts or aspiring builders who need Hub engineering backing",
        "Co-funded investment model between central transformation capacity and business function budget",
      ],
      technicalComplexityProfile:
        "Medium to High (Domain logic + Agentic automation + System integration)",
      functionTechCapabilityRequired:
        "Medium (Business has strong process analysts and technical champions)",
      platformFit:
        "Hybrid (Central platform components customized for specific functional workflows)",
      bestFitScenarios:
        "GIDE / BOWIE S2P Procurement Agent, IBP Demand Sensing & Replenishment, M&Q Plant Assistant",
    },
    teamDisposition: {
      dataAndAiTeam: [
        {
          role: "Forward Deployed Engineer (FDE)",
          allocation: "0.8 FTE (Embedded in squad)",
          responsibility:
            "Embedded in the function squad to co-engineer the core agent workflow and API connectors.",
          profileType: "Tech",
        },
        {
          role: "Data Engineer",
          allocation: "0.5 FTE",
          responsibility:
            "Prepares domain datasets, validates data freshness in Snowflake/Databricks, and sets up data pipelines.",
          profileType: "Tech",
        },
        {
          role: "MLOps & Security Reviewer",
          allocation: "0.2 FTE",
          responsibility:
            "Conducts design authority reviews, anti-hallucination guardrails, and role-based access controls.",
          profileType: "Tech",
        },
      ],
      transformationOffice: [
        {
          role: "AI Catalyst (Procurement / Function Stream)",
          allocation: "0.5 FTE",
          responsibility:
            "Facilitates agile sprints, unblocks governance gates, and bridges function with Data & AI Hub.",
          profileType: "Governance",
        },
        {
          role: "Workforce Change & Adoption Lead",
          allocation: "0.5 FTE",
          responsibility:
            "Drives ProcurLab AI Prompting curriculum, monitors weekly active user rate, assesses QWL and task substitution.",
          profileType: "Change",
        },
        {
          role: "Finance BP Partner",
          allocation: "0.2 FTE",
          responsibility:
            "Audits €142/PO manual processing baseline and verifies €3.8M run-rate EBITDA savings.",
          profileType: "Governance",
        },
      ],
      businessFunction: [
        {
          role: "Accountable Product Owner (BO/PO)",
          allocation: "0.8 - 1.0 FTE (Dedicated Lead)",
          responsibility:
            "Drives squad day-to-day, manages Jira backlog, signs off on sprint demos, owns business KPIs.",
          profileType: "Business",
        },
        {
          role: "Functional AI Builder (Citizen/No-Code)",
          allocation: "0.5 FTE",
          responsibility:
            "Configures user prompt templates, agent policies, and user interface workflows in Copilot Studio / custom app.",
          profileType: "Business",
        },
        {
          role: "Lead Pilot Champions & Buyers",
          allocation: "3 x 0.25 FTE",
          responsibility:
            "Front-line category buyers in pilot markets (Spain, France) testing live POs and reporting edge cases.",
          profileType: "Business",
        },
      ],
    },
  },
  "Mode 3": {
    mode: "Mode 3",
    title: "Mode 3: Enable me",
    motto: "“We give you the right bike and the map”",
    ownershipSplit:
      "Function frames, builds, or sources the solution; Data & AI Hub provides architectural guardrails and platform access.",
    whySelected: {
      primaryDrivers: [
        "Solution utilizes external SaaS tools or can be assembled autonomously by certified AI builders in the business",
        "Business function has autonomous delivery capacity or external niche vendor partners",
        "Accelerates time-to-value by bypassing central Hub engineering backlog while adhering to ORAI guardrails",
      ],
      technicalComplexityProfile:
        "Low to Medium (Configuration of approved SaaS or low-code tools)",
      functionTechCapabilityRequired:
        "High (Autonomous functional delivery with certified citizen builders)",
      platformFit:
        "SaaS & Approved Ecosystem (Opella low-code sandbox, certified 3rd party SaaS)",
      bestFitScenarios:
        "Wonka Vendor Intelligence SaaS, LEO Procurement contract intelligence, local automated report generators",
    },
    teamDisposition: {
      dataAndAiTeam: [
        {
          role: "Design Authority & Platform Advisor",
          allocation: "0.2 FTE (Gating check)",
          responsibility:
            "Conducts Architecture Decision Record (ADR) review, approves security boundary and data export.",
          profileType: "Tech",
        },
        {
          role: "ORAI Compliance Officer",
          allocation: "0.1 FTE",
          responsibility:
            "Verifies zero public model training, data residency, and EU AI Act classification.",
          profileType: "Governance",
        },
      ],
      transformationOffice: [
        {
          role: "AI Catalyst Relay",
          allocation: "0.2 FTE",
          responsibility:
            "Supports front-door registration, guides 10-day fast-track gating SLA, and enrolls builders in community of practice.",
          profileType: "Governance",
        },
      ],
      businessFunction: [
        {
          role: "Accountable Business Owner (BO/PO)",
          allocation: "0.5 FTE",
          responsibility:
            "Owns business requirement, vendor contract/SLA (if SaaS), and end-user rollout.",
          profileType: "Business",
        },
        {
          role: "Certified AI Builder (Business Unit)",
          allocation: "0.8 FTE (Builder)",
          responsibility:
            "Develops, tests, and maintains the configured solution within approved enterprise guardrails.",
          profileType: "Business",
        },
        {
          role: "Department Head / Sponsor",
          allocation: "0.1 FTE",
          responsibility:
            "Funds the build from operational budget and ensures team adoption.",
          profileType: "Business",
        },
      ],
    },
  },
  "Self-Service AI": {
    mode: "Self-Service AI",
    title: "Self-Service AI (Builder & User)",
    motto: "“Build with instant guardrails”",
    ownershipSplit:
      "100% user-owned with automated token caps, security screening, and catalog registration.",
    whySelected: {
      primaryDrivers: [
        "Budget under €50k and uses only approved enterprise tools (Copilot, Opella GPT, Power Automate)",
        "Zero core production write-back or sensitive employee health/patient data",
        "Immediate speed desired without any committee or comitology delays",
      ],
      technicalComplexityProfile:
        "Low (Prompt engineering, workflow chaining, document search)",
      functionTechCapabilityRequired:
        "Basic digital literacy (Supported by Prompting Academy)",
      platformFit:
        "Sanctioned Enterprise AI Tools (Copilot Studio, Opella GPT)",
      bestFitScenarios:
        "Meeting summarizers, email draft bots, slide deck assistants, document comparison helpers",
    },
    teamDisposition: {
      dataAndAiTeam: [
        {
          role: "Automated Governance & Token Sentinel Bots",
          allocation: "Automated (0 FTE)",
          responsibility:
            "Enforces auto-expiry, monthly token cost caps (<€50k/yr), and automated data boundary scans.",
          profileType: "Tech",
        },
      ],
      transformationOffice: [
        {
          role: "AI for All Self-Serve Portal",
          allocation: "Digital Hub",
          responsibility:
            "Provides prompt templates, best practices, and automated registry listing.",
          profileType: "Governance",
        },
      ],
      businessFunction: [
        {
          role: "Citizen Builder / End User",
          allocation: "Self-Serve",
          responsibility:
            "Creates, tests, and uses the tool responsibly under approved AI usage guardrails.",
          profileType: "Business",
        },
      ],
    },
  },
};

export const TIER_DEEP_DIVES: Record<Tier, TierDeepDive> = {
  T1: {
    tier: "T1",
    name: "T1 · Transform",
    subtitle: "Enterprise Big Bets & Core Reshapes",
    threshold:
      "Part of AmplifAI Big Bet, alters Butterfly core platforms/scope, > €1M, or multi-market multi-functional reach",
    whatItMeans:
      "A Tier 1 (T1) initiative is an enterprise-defining strategic bet. It alters core Butterfly enterprise workflows (SAP, IBP, Databricks), impacts multi-million Euro P&L lines, and commands dedicated cross-functional squads funded from the 60% Hub transformation envelope.",
    decisionForUseCase:
      "Routes directly to Full Business Case (T1 Dossier) & Butterfly Comitology. Requires full 6-gate butterfly progression (G1 -> G2 -> G3 -> G4 -> MVP Build -> G5 -> Scale -> G6) with formal SteerCo approval.",
    committeesAndComitology: {
      governingBodies: [
        "Transformation SteerCo (Monthly) chaired by Gentiane Barret (TO Lead) & ExCo Stream Sponsors",
        "Digital Design Authority (DDA - Weekly) for architecture ADR & Mode 1/2/3 selection at G4",
        "Butterfly Comitology for synchronization with enterprise SAP release trains",
        "AI Portfolio Board (Fortnightly) for ongoing milestone and risk tracking",
      ],
      cadence: "Monthly SteerCo Review & Fortnightly Portfolio Board",
      decisionRights:
        "SteerCo holds ultimate funding and kill/scale decision rights; Design Authority holds architecture veto.",
      primaryForum:
        "Transformation SteerCo (Monthly) · Chaired by ExCo Stream Sponsors",
    },
    teamsAndResourcing: {
      squadModel:
        "Dedicated Co-Located / Dedicated Cross-Functional Squad (Full-Stack)",
      dataAndAiAllocation:
        "1.0 FDE (Dedicated) + 0.5 Data Architect + 0.5 MLOps Engineer (Funded by Central Hub 60% envelope)",
      toAllocation:
        "Dedicated AI Catalyst (0.5 FTE) + Change & Adoption Lead (0.5 FTE) + Value Lead (0.2 FTE)",
      businessFunctionCommitment:
        "Dedicated Accountable Business Owner (BO/PO, 80% to 100% full-time commitment mandatory)",
    },
    deliveryAndTracking: {
      businessCaseDossier:
        "Full 5-Page T1 Business Case: Recurring P&L drivers, SI/BI non-staff, 5-year NPV, Control Tower sign-off.",
      trackingTool:
        "Planisware (Enterprise transformation PMO system) with formal milestone tracking and bi-weekly sprint reviews.",
      fundingMechanism:
        "Tranche releases: Tranche 1 (€300k–€500k) at G4 for 6–8 week MVP; Tranche 2 at G5 for enterprise scaling.",
      valueRealizationAudit:
        "Mandatory Unified Value Ledger audit at +6 and +12 months by Finance Business Partner to prove realized EBITDA.",
      sprintDuration:
        "6–8 week MVP sprint, followed by multi-wave regional rollout.",
    },
  },
  T2: {
    tier: "T2",
    name: "T2 · Scale",
    subtitle: "Proven Pilot & Cross-Functional Scaling",
    threshold:
      "Value proven in a pilot; needs reach (2+ functions/regions, 500+ users), Hub capacity, or €200k–€1M build cost",
    whatItMeans:
      "A Tier 2 (T2) initiative scales a concept that has already demonstrated pilot feasibility. It expands reach across functions or regions and is delivered via shared squads co-funded between central capacity and business budgets.",
    decisionForUseCase:
      "Routes to Light Business Case (T2 Dossier) & AI Portfolio Board Tranche Releases. Streamlined comitology focused on scaling mechanics and adoption.",
    committeesAndComitology: {
      governingBodies: [
        "AI Portfolio Board (Fortnightly) as primary approval body",
        "Dedicated Stream Approvers (Function VP & Finance BP) for co-funding sign-off",
        "Design Authority for platform fit check",
      ],
      cadence: "Fortnightly AI Portfolio Board review",
      decisionRights: "AI Portfolio Board unlocks milestone funding tranches.",
      primaryForum: "AI Portfolio Board (Fortnightly)",
    },
    teamsAndResourcing: {
      squadModel: "Shared Co-Delivery Squad (Joint Function & Hub)",
      dataAndAiAllocation: "Shared Hub capacity: 0.5 FDE + 0.5 Data Engineer",
      toAllocation: "AI Catalyst (0.4 FTE) + Adoption Specialist (0.3 FTE)",
      businessFunctionCommitment:
        "Business PO (0.5 - 0.8 FTE) + Functional AI Builder (0.5 FTE)",
    },
    deliveryAndTracking: {
      businessCaseDossier:
        "Light Business Case (Problem statement, directional value, approved data sources, ORAI confirmation).",
      trackingTool: "AI Portfolio Board Tracker & Stream Dashboards.",
      fundingMechanism: "Co-funded tranches unlocked per milestone.",
      valueRealizationAudit:
        "+6 month value realization pulse in unified value ledger.",
      sprintDuration: "8–10 week scaling sprints.",
    },
  },
  T3: {
    tier: "T3",
    name: "T3 · Fast Lane",
    subtitle: "Quick Wins & Agile Exploration",
    threshold:
      "Budget up to €200k, 1 single function, new hypothesis to test, agile pace",
    whatItMeans:
      "A Tier 3 (T3) Fast Lane initiative is designed for speed and agility. It tests a specific business value hypothesis within 6–8 weeks with a strict 10-day decision SLA. AI Portfolio Board is the ONLY forum seen.",
    decisionForUseCase:
      "Routes to 1-Page T3 Canvas. Skips heavy PMO and comitology. Funded from ring-fenced 25% Fast Lane envelope. 10 days to decision.",
    committeesAndComitology: {
      governingBodies: [
        "AI Portfolio Board (Delegated by Program Leadership) · Only forum seen",
        "Function Process Owner approval",
      ],
      cadence: "10-day decision SLA · 6–8 week sprint check-in",
      decisionRights:
        "AI Portfolio Board chair holds single-point decision authority.",
      primaryForum: "AI Portfolio Board (Delegated 10-Day SLA)",
    },
    teamsAndResourcing: {
      squadModel: "Agile Rapid Squad (Function-led with Hub Coaching)",
      dataAndAiAllocation:
        "Platform templates & coaching from 25% Fast Lane Hub pool",
      toAllocation: "AI Catalyst coaching & front-door gating (0.2 FTE)",
      businessFunctionCommitment:
        "Functional Process Owner + Certified AI Builder (0.8 FTE)",
    },
    deliveryAndTracking: {
      businessCaseDossier:
        "1-Page T3 Canvas (Hypothesis, baseline metrics, 3 core KPIs, kill/scale date, budget envelope).",
      trackingTool: "Lightweight agile sprint backlog (No Planisware).",
      fundingMechanism:
        "Ring-fenced sprint envelope released upfront for 6–8 week pilot.",
      valueRealizationAudit:
        "Gate G5 (Scale Gate) at end of sprint: Pass to scale, or Kill immediately.",
      sprintDuration: "6–8 week fail-fast sprint.",
    },
  },
  "Self-Serve": {
    tier: "Self-Serve",
    name: "Self-Serve · Register & Go",
    subtitle: "Personal & Team Productivity",
    threshold:
      "Under €50k, approved tools & data, configured rather than built, no core write-back",
    whatItMeans:
      "Self-Serve allows individuals and citizen builders to leverage sanctioned enterprise AI tools (Copilot, Opella GPT) instantly with automated guardrails, avoiding all comitology queues.",
    decisionForUseCase:
      "Instant automated registration. Skips Gates G2, G3, G4 directly to build. Automated screening agent verifies data boundaries.",
    committeesAndComitology: {
      governingBodies: [
        "Automated Charter Agent (OpellaGPT) & Function Head Notification",
        "No governance committee required",
      ],
      cadence: "Instant / Real-time",
      decisionRights: "Automated qualification based on guardrail checklist.",
      primaryForum: "Automated Self-Service AI Registry",
    },
    teamsAndResourcing: {
      squadModel: "Individual Citizen Builder / End User",
      dataAndAiAllocation:
        "Automated Sentinel Bots & Token Cap Monitors (0 manual FTE)",
      toAllocation: "Self-service prompt library & knowledge base",
      businessFunctionCommitment:
        "End user / Citizen builder (100% self-directed)",
    },
    deliveryAndTracking: {
      businessCaseDossier:
        "AI Registry Entry with guardrails confirmation checklist.",
      trackingTool:
        "Listed in Opella AI Registry with auto-expiry and token caps.",
      fundingMechanism:
        "Function software license & existing SaaS allocation.",
      valueRealizationAudit: "Automated quarterly token and usage monitoring.",
      sprintDuration: "Days to configure and deploy.",
    },
  },
};


export const INITIAL_GATES: Record<GateId, GateDetail> = {
  G1: {
    id: "G1",
    name: "Need Validation (Front Door)",
    phase: "Framing",
    decision: "Need validated? Tiers identification? (Self-service or full path)",
    decisionAuthority: "Automatic",
    type: "AUTOMATIC",
    approver: "Charter Agent (OpellaGPT) & AI Catalyst confirms",
    forum: "Front Door Intake (Triage to T1/T2/T3/Self-serve)",
    sla: "5 working days",
    status: "PENDING",
    multiDimensionalReview: {
      value: "Expected value fits the money invested & business problem is clear",
      complexity: "Foundation gap classified by Design Authority",
      risk: "Risk tier generated from screening agent (Low / Med / High)",
      adoption: "Target users & scope identified; light self-scan",
    },
  },
  G2: {
    id: "G2",
    name: "Feasibility Assessment",
    phase: "Framing",
    decision: "Business case & technical feasibility validated; tier confirmed",
    decisionAuthority: "Transformation Office",
    type: "MANUAL",
    approver: "Transformation Office (Stream Leads, Finance BP, DDA & ORAI)",
    forum: "T3: AI Portfolio Board · T1/T2: Dedicated stream approvers",
    sla: "T3: 10 days · T1/T2: Defined per stream",
    status: "PENDING",
    multiDimensionalReview: {
      value: "Baseline validated by Finance; benefits broken down by driver",
      complexity: "Data and tech readiness, architecture dependencies assessed",
      risk: "ORAI triage: tier confirmed & pre-build conditions established",
      adoption: "Impact scan: affected jobs, user count, skills; process redesign yes/no",
    },
  },
  G3: {
    id: "G3",
    name: "Prioritisation & Capacity Match",
    phase: "Framing",
    decision: "Is it a priority across functions? Place in enterprise backlog",
    decisionAuthority: "Transformation Office",
    type: "MANUAL",
    approver: "Transformation Office (TO Lead & Business Sponsors)",
    forum: "AI Portfolio Board (Fortnightly) · T1: TO SteerCo",
    sla: "Fortnightly",
    status: "PENDING",
    multiDimensionalReview: {
      value: "Value pool (VCP) check: 30% Value, 20% Strategic fit, 20% Reach/reuse",
      complexity: "Hub capacity available in quarterly plan (60% Big Bets, 25% Fast Lane, 15% Enablement)",
      risk: "Scored inversely (10% weight in prioritization formula)",
      adoption: "Capacity commitment from function business owner",
    },
  },
  G4: {
    id: "G4",
    name: "Mode & Budget Validation -> GO BUILD",
    phase: "Framing",
    decision: "Mode selected (Mode 1 / 2 / 3), Make-or-Buy decided, budget released to start MVP",
    decisionAuthority: "Data & AI",
    type: "MANUAL",
    approver: "Data & AI (Architecture, Tech Sizing, Delivery Squad & Sourcing Unlock)",
    forum: "Design Authority (Weekly) + Tier Approver",
    sla: "Design Authority: 5 days",
    status: "PENDING",
    multiDimensionalReview: {
      value: "Funding follows the lane: full business case, tranches, or sprint envelope",
      complexity: "Delivery mode locked; squad composed (DE, DS, AI Eng, BO/PO, FDE)",
      risk: "Design authority platform fit, security and privacy guardrails locked",
      adoption: "Full Change Impact Assessment (CIA) mapped out",
    },
  },
  G5: {
    id: "G5",
    name: "Pre-Scale Validation (Scale Gate)",
    phase: "Pre-scale",
    decision: "Go / No-Go decision on MVP results: roll out to broader markets / 500+ users",
    decisionAuthority: "Transformation Office",
    type: "MANUAL",
    approver: "Transformation Office (SteerCo & AI Portfolio Board)",
    forum: "Scale & Big Bet Review (Quarterly) / AI Portfolio Board",
    sla: "Quarterly / End of 6–8 week MVP sprint",
    status: "PENDING",
    multiDimensionalReview: {
      value: "Pilot KPIs vs baseline confirmed; revised financial value range",
      complexity: "Actual build costs reconciled, scale architecture signed off, run owner named",
      risk: "Secondary ORAI review: clear, with conditions, or blocked",
      adoption: "Revised CIA, formal adoption plan, and HR 5-pillar workforce impact assessment",
    },
  },
  G6: {
    id: "G6",
    name: "Maintain & Run Validation",
    phase: "Run",
    decision: "Continue, scale, re-scope, or stop (trigger retirement or pivot)",
    decisionAuthority: "Transformation Office",
    type: "MANUAL",
    approver: "Transformation Office (Value Officer & Business Function BO/PO)",
    forum: "Scale & Adoption Committee (Quarterly)",
    sla: "Quarterly review",
    status: "PENDING",
    multiDimensionalReview: {
      value: "Realized financial ROI vs validated baseline in unified value ledger",
      complexity: "Ongoing token consumption, infrastructure cost, model drift & bug monitoring",
      risk: "Post-live compliance monitoring & tier-change checks",
      adoption: "Active usage vs target by role; if adoption lags: 1 relaunch sprint, then retire",
    },
  },
};

export const GATES_CONFIG = INITIAL_GATES;

export const OPELLA_ROLES = [
  // 7 URGENT TO CREATE
  {
    name: "Product Owner (BO/PO)",
    category: "URGENT_CREATE",
    sitsIn: "Business Function",
    mission: "Carry the business need from idea to run: backlog, acceptance, budget, and ROI.",
    gapToday: "No named owner on ~25% of 217 initiatives -> Target: 1 per use case.",
    status: "Missing (0 today)",
  },
  {
    name: "AI Builder (Low-Code/No-Code)",
    category: "URGENT_CREATE",
    sitsIn: "Business Function / Shared",
    mission: "Deliver and run governed apps & agents on approved low-code platforms close to the business.",
    gapToday: "50–60 working informally without guardrails -> Formalize into governed roles.",
    status: "Informal today",
  },
  {
    name: "Business Architect",
    category: "URGENT_CREATE",
    sitsIn: "Transformation Office (Hub)",
    mission: "Redesign end-to-end workflows with AI at the core; size workforce impact and dependencies.",
    gapToday: "0.5 FTE external consultant -> Hire base of 2 FTEs.",
    status: "External today",
  },
  {
    name: "Regional Adoption Relays",
    category: "URGENT_CREATE",
    sitsIn: "Transformation Office",
    mission: "Land the AI adoption plan in regional clusters (NA, EULA, AMEA) and support local AI Catalysts.",
    gapToday: "0 in regions today -> Target: 1–2 per big region.",
    status: "Missing (0 today)",
  },
  {
    name: "Forward Deployed Engineer (FDE)",
    category: "URGENT_CREATE",
    sitsIn: "Data & AI Hub",
    mission: "Embedded in a big bet: prototypes fast, industrializes on platform standards, cuts handoffs.",
    gapToday: "Not named yet -> Pilot 1 FDE per process reshape.",
    status: "Missing (0 today)",
  },
  {
    name: "Semantic Layer Architect",
    category: "URGENT_CREATE",
    sitsIn: "Data & AI Hub",
    mission: "Build AI-ready semantic layer (Opella IQ); define each metric and ontology once.",
    gapToday: "Rests on 1 person + 1 colleague -> Dedicated role in hub.",
    status: "Missing (0 today)",
  },
  {
    name: "P&C Counterpart",
    category: "URGENT_CREATE",
    sitsIn: "People & Culture (HR)",
    mission: "Plan evolution of the organization, assess 5-pillar workforce impact, and redeploy talent.",
    gapToday: "No dedicated role -> 1 counterpart per big bet.",
    status: "Missing (0 today)",
  },

  // 5 TO STRENGTHEN
  {
    name: "AI Catalyst",
    category: "TO_STRENGTHEN",
    sitsIn: "Business Function",
    mission: "AI for All relay helping peers adopt AI, identify pain points, and point to front-door intake.",
    gapToday: "~40 part-time volunteers without formal mandate -> Target 300 mandated catalysts.",
    status: "Exists, needs mandate",
  },
  {
    name: "Data Steward",
    category: "TO_STRENGTHEN",
    sitsIn: "Business Function",
    mission: "Data quality & definitions owner per business domain; decides what good data looks like.",
    gapToday: "4–5 titles flagged, not business-led -> 1 per data domain.",
    status: "Exists, not business-led",
  },
  {
    name: "AI Engineer",
    category: "TO_STRENGTHEN",
    sitsIn: "Data & AI Hub",
    mission: "Takes GenAI apps and agents from prototype to production at scale on Azure GenAI & Databricks.",
    gapToday: "Already deploying Lumen & Opella GPT -> Keep scaling in the hub.",
    status: "Scaling in progress",
  },
  {
    name: "Data Product Lead",
    category: "TO_STRENGTHEN",
    sitsIn: "Data & AI Hub",
    mission: "Owns reusable data products & cross-domain flows; acts as Digital PO.",
    gapToday: "1 per global foundation, 0 regional -> Scale to 1 per 10 data products.",
    status: "Fragmented today",
  },
  {
    name: "Digital Product Owner",
    category: "TO_STRENGTHEN",
    sitsIn: "Data & AI / Business Solutions",
    mission: "Turns business needs into technical data requirements; pairs with function BO/PO.",
    gapToday: "A few in Business Solutions -> Name 1 per priority use case.",
    status: "Too few today",
  },
];
