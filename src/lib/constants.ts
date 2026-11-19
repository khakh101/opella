import { BigBetInfo, GateDetail, GateId, Tier, DeliveryMode } from "@/types";

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

export const INITIAL_GATES: Record<GateId, GateDetail> = {
  G1: {
    id: "G1",
    name: "Need Validation (Front Door)",
    phase: "Framing",
    decision: "Need validated? Tiers identification? (Self-service or full path)",
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
    type: "MANUAL",
    approver: "Data & AI, Finance, OR.AI",
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
    type: "MANUAL",
    approver: "Design Authority + Tier Approver (T1 SteerCo, T2 Sponsors, T3 Board)",
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
    type: "MANUAL",
    approver: "Scale Committee (T1: TO SteerCo · T3: AI Portfolio Board)",
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
    type: "MANUAL",
    approver: "Product Owner (Run Owner) + Finance sign-off (+6 / +12 months)",
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
