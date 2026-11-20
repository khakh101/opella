// =====================================================================
// Miro lifecycle board — content
// Single source for the 5-step overview, the Framing paths, the gate
// double-click details, the charter / business case templates and the
// example switcher. Sources: Operating model & adoption deck (V16/11),
// slides 34, 35, 37, 39, 40, 41, 45, 46, 47, 49, 51, 52.
// =====================================================================

export type PathId = "T1" | "T2" | "T3" | "SS";

export type StepId = "framing" | "build" | "prescale" | "scale" | "run";

export type ModeId = "for-me" | "with-me" | "enable-me" | "self-service";

export type ExampleNoteKey =
  | "ppc"
  | "g1"
  | "bc"
  | "g2"
  | "g3"
  | "g4"
  | "build"
  | "g5"
  | "g6";

// ---------------------------------------------------------------------
// Paths (tiers) leaving G1
// ---------------------------------------------------------------------

export interface PathDef {
  id: PathId;
  label: string;
  name: string;
  entryRule: string;
  routeLabel: string; // label on the line leaving G1
  businessCaseName: string;
  forum: string;
  g4Label: string;
  buildLabel: string;
  color: string; // hex, used for lines and accents
  soft: string; // tailwind bg class
  text: string; // tailwind text class
  border: string; // tailwind border class
}

export const PATHS: Record<PathId, PathDef> = {
  T1: {
    id: "T1",
    label: "T1",
    name: "Transform",
    entryRule: "Big bet, Butterfly core platforms or scope, or > €1m",
    routeLabel: "Q1 · yes",
    businessCaseName: "Full business case",
    forum: "Portfolio board · per stream",
    g4Label: "Do it for me",
    buildLabel: "Build · Do it for me",
    color: "#0d3824",
    soft: "bg-emerald-50",
    text: "text-emerald-900",
    border: "border-emerald-700",
  },
  T2: {
    id: "T2",
    label: "T2",
    name: "Scale",
    entryRule: "Pilot proven + reach, hub capacity or €200k–1m",
    routeLabel: "Q3 · yes",
    businessCaseName: "Light business case",
    forum: "AI Portfolio Board · per stream",
    g4Label: "Mode selection",
    buildLabel: "Build · selected mode",
    color: "#0369a1",
    soft: "bg-sky-50",
    text: "text-sky-900",
    border: "border-sky-600",
  },
  T3: {
    id: "T3",
    label: "T3",
    name: "Fast lane",
    entryRule: "No proven pilot, value hypothesis to test, €50k–1m",
    routeLabel: "Otherwise",
    businessCaseName: "One-page canvas",
    forum: "AI Portfolio Board · per stream",
    g4Label: "Mode selection",
    buildLabel: "Build · selected mode",
    color: "#b45309",
    soft: "bg-amber-50",
    text: "text-amber-900",
    border: "border-amber-600",
  },
  SS: {
    id: "SS",
    label: "Self-service",
    name: "Register and go",
    entryRule: "Agent confirms value < €50k, approved tools and data",
    routeLabel: "Q2 · yes",
    businessCaseName: "Registry line",
    forum: "No forum",
    g4Label: "—",
    buildLabel: "Self-service AI",
    color: "#7c3aed",
    soft: "bg-violet-50",
    text: "text-violet-900",
    border: "border-violet-600",
  },
};

export const PATH_ORDER: PathId[] = ["T1", "T2", "T3", "SS"];

// ---------------------------------------------------------------------
// Delivery modes (slide 47)
// ---------------------------------------------------------------------

export interface ModeDef {
  id: ModeId;
  label: string;
  motto: string;
  whoBuilds: string;
  hubRole: string;
}

export const MODES: Record<ModeId, ModeDef> = {
  "for-me": {
    id: "for-me",
    label: "Do it for me",
    motto: "Mode 1",
    whoBuilds: "The Data & AI hub builds",
    hubRole: "The function frames the need and validates",
  },
  "with-me": {
    id: "with-me",
    label: "Do it with me",
    motto: "Mode 2",
    whoBuilds: "The function leads, the hub builds the complex scope",
    hubRole: "Shared squad, hub slots in the Data & AI backlog",
  },
  "enable-me": {
    id: "enable-me",
    label: "Enable me",
    motto: "Mode 3",
    whoBuilds: "The function's AI builders build, or buy from a provider",
    hubRole: "The hub reviews and audits",
  },
  "self-service": {
    id: "self-service",
    label: "Self-service AI",
    motto: "Shortcut after G1",
    whoBuilds: "The user configures an approved tool",
    hubRole: "Guardrails, cost caps and an audit agent",
  },
};

export const MODE_ORDER: ModeId[] = ["for-me", "with-me", "enable-me", "self-service"];

// ---------------------------------------------------------------------
// Overview: the 5 steps (slides 45 and 51)
// ---------------------------------------------------------------------

export interface StepGate {
  id: string;
  label: string;
  type: "agent" | "human";
}

export interface StepDef {
  id: StepId;
  numeral: string;
  name: string;
  oneLiner: string;
  bullets: string[];
  gates: StepGate[];
  zone: "agility" | "discipline";
}

export const STEPS: StepDef[] = [
  {
    id: "framing",
    numeral: "I",
    name: "Framing",
    oneLiner: "From an idea to a GO BUILD decision",
    bullets: [
      "Charter gathered by an agent",
      "Routed to T1, T2, T3 or self-service",
      "Business case, priority and mode",
    ],
    gates: [
      { id: "G1", label: "Need validated", type: "agent" },
      { id: "G2", label: "Feasible", type: "human" },
      { id: "G3", label: "Priority", type: "human" },
      { id: "G4", label: "Mode", type: "human" },
    ],
    zone: "agility",
  },
  {
    id: "build",
    numeral: "II",
    name: "Build (MVP)",
    oneLiner: "Build and test the MVP in the selected mode",
    bullets: [
      "4 steps: PO, backlog, MVP, user test",
      "4 modes: Enable me, with me, for me, self-service",
      "Validated MVP goes to Pre-scale",
    ],
    gates: [],
    zone: "agility",
  },
  {
    id: "prescale",
    numeral: "III",
    name: "Pre-scale",
    oneLiner: "Prove value and readiness before scaling",
    bullets: [
      "Value: MVP results vs baseline",
      "Tech, data and OR.AI review",
      "Adoption plan and HR impact",
    ],
    gates: [{ id: "G5", label: "Scale validation", type: "human" }],
    zone: "discipline",
  },
  {
    id: "scale",
    numeral: "IV",
    name: "Scale",
    oneLiner: "Roll out to the target users and scope",
    bullets: [
      "Roll-out by market or scope",
      "Adoption plan with role-based targets",
      "Handover to the function if Enable me",
    ],
    gates: [],
    zone: "discipline",
  },
  {
    id: "run",
    numeral: "V",
    name: "Run",
    oneLiner: "Track value and keep it worth running",
    bullets: [
      "Realised value and ROI vs baseline",
      "Usage, model tuning, upgrades",
      "Stop triggers if value is not there",
    ],
    gates: [{ id: "G6", label: "Maintain validation", type: "human" }],
    zone: "discipline",
  },
];

// ---------------------------------------------------------------------
// Double-click details
// ---------------------------------------------------------------------

export interface DetailSection {
  label: string;
  items: string[];
}

export interface DetailMeta {
  label: string;
  value: string;
}

export interface DetailItem {
  id: string;
  kind: "gate" | "doc" | "activity";
  badge: string; // e.g. "G2", "PPC"
  title: string;
  subtitle: string;
  gateType?: "agent" | "human";
  path?: PathId; // undefined = common to every path
  intro?: string;
  sections: DetailSection[];
  meta?: DetailMeta[];
  note?: string; // open point or calibration note
  businessCaseOf?: PathId; // G2: show the business case tab
  exampleKey?: ExampleNoteKey;
  source: string;
}

const prioritisationSections = (capacity: string): DetailSection[] => [
  {
    label: "How the business case is compared with the backlog",
    items: [
      "Big bets first, then one score out of 100",
      "Value 30 · EBITDA, cash, hours freed",
      "Strategic fit 20 · big bet or value pool (VCP) link",
      "Reach and reuse 20 · users, regions, reusable parts",
      "Feasibility 20 · data, tech, owner in place",
      "Risk and effort 10 · scored inversely",
    ],
  },
  {
    label: "Capacity",
    items: [
      capacity,
      "One ranked queue, visible to all; a pilot starts when a delivery slot frees up",
      "Contention settled weekly in Program Leadership",
    ],
  },
];

export const DETAILS: Record<string, DetailItem> = {
  // ------------------------------------------------------------- common
  ppc: {
    id: "ppc",
    kind: "doc",
    badge: "PPC",
    title: "Preliminary project charter",
    subtitle: "One form to declare the use case · pre-filled by the charter agent",
    intro:
      "Anything that goes beyond personal use is declared here: shared with colleagues, connected to data or systems, with a cost or a workforce impact.",
    sections: [
      {
        label: "Mandatory",
        items: [
          "The need: what is manual or slow today",
          "Users and reach: who uses it, how many, which functions or regions",
        ],
      },
      {
        label: "Optional, helps the agent",
        items: ["Estimated value (hours, € or speed)", "Tools and data it would use"],
      },
      {
        label: "Routing questions (answered once, used at G1)",
        items: [
          "Q1 · Part of a big bet, changes Butterfly core platforms or scope, or more than €1m?",
          "Q2 · Approved tools and data only, configured not built, under €50k?",
          "Q3 · Value proven in a pilot, and needs reach, hub capacity or €200k–1m?",
        ],
      },
      {
        label: "Risk self-assessment (sets the OR.AI level)",
        items: [
          "Personal, health or confidential data",
          "Autonomous decisions or write-back to production systems",
          "Outputs shared externally without review",
        ],
      },
    ],
    meta: [
      { label: "Filled by", value: "Business owner with the AI catalyst" },
      { label: "Helped by", value: "Charter agent (OpellaGPT): gathers and pre-fills" },
      { label: "Answer", value: "Within 5 working days" },
    ],
    exampleKey: "ppc",
    source: "Slides 34, 35, 52",
  },

  g1: {
    id: "g1",
    kind: "gate",
    badge: "G1",
    title: "Need validation",
    subtitle: "Automatic gate · run by agents, checked by the AI catalyst",
    gateType: "agent",
    intro:
      "Agents read the charter and do the first review, so people only look at needs that are complete and new.",
    sections: [
      {
        label: "Charter agent checks",
        items: [
          "The need is complete and not a duplicate (registry search)",
          "The expected value fits the money to invest",
          "Gathers the missing key information from the requester",
        ],
      },
      {
        label: "OR.AI screening agent",
        items: ["Sets the risk level: low, medium or high", "High risk never goes to the fast lane"],
      },
      {
        label: "Routes to one of 4 paths",
        items: [
          "Q1 yes: T1 · Transform",
          "Q2 yes: Self-service (skips G2 to G4)",
          "Q3 yes: T2 · Scale",
          "Otherwise: T3 · Fast lane",
        ],
      },
    ],
    meta: [
      { label: "Owner", value: "AI catalyst, charter agent" },
      { label: "Forum", value: "Charter agent; the AI Portfolio Board confirms T2 vs T3" },
      { label: "SLA", value: "5 working days" },
      { label: "If no-go", value: "Stop or park" },
      { label: "Escalation", value: "AI Portfolio Board" },
    ],
    exampleKey: "g1",
    source: "Slides 35, 46, 52",
  },

  // ------------------------------------------------------------- T1
  "bc-T1": {
    id: "bc-T1",
    kind: "doc",
    badge: "BC",
    title: "Full business case · T1",
    subtitle: "Butterfly depth · built through iterations with the Portfolio board",
    path: "T1",
    sections: [
      {
        label: "Content",
        items: [
          "1 · Recurring items: bottom-up FY25–30 benefits and run costs, FTE impact, markets and P&L lines",
          "2 · SI non-staff: enablers across System, Infrastructure, Cyber, Data (linked IDs, no double counting)",
          "3 · People costs: named roles, dedication %, fully loaded cost; external only for a skill gap",
          "4 · BI non-staff: supplier spend, scope, RFP status; no supplier before approval",
          "5 · Plan, risks and KPIs: milestones, gates every 4–6 weeks, KPIs actual vs target",
          "6 · Dashboard and sign-offs: EBITDA effect, ROI, payback; Stream, Finance, Digital, Control Tower",
        ],
      },
    ],
    meta: [
      { label: "Prepared by", value: "AI catalyst or the requester, then the resources given by the board" },
      { label: "Funding", value: "Individual business case in the budget and strat plan" },
    ],
    exampleKey: "bc",
    source: "Slides 37, 39",
  },
  "g2-T1": {
    id: "g2-T1",
    kind: "gate",
    badge: "G2",
    title: "Approval · T1",
    subtitle: "Confirm it is a T1, then approve the full business case",
    gateType: "human",
    path: "T1",
    intro:
      "It works through iterations. Up to here, the AI catalyst or the requester gathers the information. The first Portfolio boards validate that the use case is a T1 and give the right resources to build the business case properly.",
    sections: [
      {
        label: "Confirm the T1 criteria",
        items: [
          "Part of an AmplifAI big bet?",
          "Changes Butterfly core platforms or scope?",
          "Costs more than €1m?",
        ],
      },
      {
        label: "Approve the business case",
        items: [
          "Value: baseline validated by Finance",
          "Complexity: data and tech readiness",
          "Risk: OR.AI level and conditions",
          "Adoption: light scan; the process redesign sits in the big bet's own case",
        ],
      },
    ],
    meta: [
      { label: "Reviewers", value: "Data & AI, Finance, OR.AI" },
      { label: "Forum", value: "Portfolio board (per stream); TO SteerCo approves entry and funding" },
      { label: "SLA", value: "To define" },
      { label: "If no-go", value: "Re-scope or stop" },
    ],
    businessCaseOf: "T1",
    exampleKey: "g2",
    source: "Slides 35, 37, 46, 48",
  },
  "g3-T1": {
    id: "g3-T1",
    kind: "gate",
    badge: "G3",
    title: "Prioritisation · T1",
    subtitle: "Compare the business case with the others in the backlog",
    gateType: "human",
    path: "T1",
    sections: prioritisationSections("60% of hub capacity goes to big bets and their T1 / T2 use cases"),
    meta: [
      { label: "Owner", value: "Transformation Office" },
      { label: "Forum", value: "Portfolio board; TO SteerCo for T1" },
      { label: "Cadence", value: "Fortnightly" },
      { label: "If no-go", value: "Stays in the backlog" },
    ],
    exampleKey: "g3",
    source: "Slides 46, 49",
  },
  "g4-T1": {
    id: "g4-T1",
    kind: "gate",
    badge: "G4",
    title: "Mode and budget · T1",
    subtitle: "Always Do it for me",
    gateType: "human",
    path: "T1",
    intro: "A T1 is always built by the Data & AI hub: the function frames the need and validates.",
    sections: [
      {
        label: "Decided here",
        items: [
          "Mode: Do it for me",
          "Make or buy",
          "Cost and resources, in the budget and strat plan",
        ],
      },
    ],
    meta: [
      { label: "Owner", value: "Data & AI with the function" },
      { label: "Forum", value: "Design Authority + TO SteerCo" },
      { label: "SLA", value: "Design Authority: 5 days" },
      { label: "If no-go", value: "Re-scope or stop" },
    ],
    exampleKey: "g4",
    source: "Slides 46, 47",
  },

  // ------------------------------------------------------------- T2
  "bc-T2": {
    id: "bc-T2",
    kind: "doc",
    badge: "BC",
    title: "Light business case · T2",
    subtitle: "1–2 pages · released in tranches",
    path: "T2",
    sections: [
      {
        label: "Content",
        items: [
          "1 · Problem and directional value: the bottleneck, target users, hours or speed gained",
          "2 · Build mode and rough effort: builder days, licence and token sizing",
          "3 · Data and platform fit: data already in approved sources, standard platforms",
          "4 · Named owner: business owner, AI catalyst, target user count",
          "5 · OR.AI screening: confirmed risk level and mitigations",
          "+ Pilot results that prove the value",
        ],
      },
    ],
    meta: [
      { label: "Prepared by", value: "AI catalyst with the business owner" },
      { label: "Funding", value: "Released in tranches" },
    ],
    exampleKey: "bc",
    source: "Slides 37, 39",
  },
  "g2-T2": {
    id: "g2-T2",
    kind: "gate",
    badge: "G2",
    title: "Approval · T2",
    subtitle: "Confirm it is a T2, then approve the light business case",
    gateType: "human",
    path: "T2",
    sections: [
      {
        label: "Confirm the T2 criteria",
        items: [
          "Value already proven in a pilot",
          "And needs reach (2+ functions or regions, 500+ users), hub capacity or €200k–1m",
        ],
      },
      {
        label: "Approve the light business case",
        items: [
          "Value: baseline validated by Finance",
          "Complexity: data and tech readiness",
          "Risk and adoption: OR.AI level, light scan, redesign yes / no",
        ],
      },
    ],
    meta: [
      { label: "Forum", value: "AI Portfolio Board advises" },
      { label: "Approver", value: "Program Sponsors (CDO + CFO)" },
      { label: "SLA", value: "To define" },
      { label: "If no-go", value: "Re-scope or stop" },
    ],
    businessCaseOf: "T2",
    exampleKey: "g2",
    source: "Slides 35, 37, 46",
  },
  "g3-T2": {
    id: "g3-T2",
    kind: "gate",
    badge: "G3",
    title: "Prioritisation · T2",
    subtitle: "Compare the business case with the others in the backlog",
    gateType: "human",
    path: "T2",
    sections: prioritisationSections(
      "Inside a big bet: 60% bucket. Outside: 25% bucket shared with the fast lane"
    ),
    meta: [
      { label: "Owner", value: "Transformation Office" },
      { label: "Forum", value: "AI Portfolio Board" },
      { label: "Cadence", value: "Fortnightly" },
      { label: "If no-go", value: "Stays in the backlog" },
    ],
    exampleKey: "g3",
    source: "Slides 46, 49",
  },
  "g4-T2": {
    id: "g4-T2",
    kind: "gate",
    badge: "G4",
    title: "Mode and budget · T2",
    subtitle: "Usually Do it with me",
    gateType: "human",
    path: "T2",
    sections: [
      {
        label: "Decided here",
        items: [
          "Mode, by function maturity and use case complexity (usually Do it with me)",
          "Make or buy",
          "Cost, resources and the first tranche",
        ],
      },
    ],
    meta: [
      { label: "Owner", value: "Data & AI with the function" },
      { label: "Forum", value: "Design Authority + Program Sponsors" },
      { label: "SLA", value: "Design Authority: 5 days" },
      { label: "If no-go", value: "Re-scope, change mode or stop" },
    ],
    exampleKey: "g4",
    source: "Slides 37, 46",
  },

  // ------------------------------------------------------------- T3
  "bc-T3": {
    id: "bc-T3",
    kind: "doc",
    badge: "BC",
    title: "One-page canvas · T3",
    subtitle: "1 page instead of a full business case",
    path: "T3",
    sections: [
      {
        label: "Content",
        items: [
          "1 · The value hypothesis to test and the target users",
          "2 · Three KPIs, each with a baseline",
          "3 · Sprint plan: 6–8 weeks, with a kill or scale date",
          "4 · Build mode and rough effort or token sizing, within the envelope",
          "5 · Named business owner and AI catalyst",
          "6 · OR.AI level: low or medium (high leaves the fast lane)",
        ],
      },
    ],
    meta: [
      { label: "Prepared by", value: "AI catalyst or the requester" },
      { label: "Funding", value: "Ring-fenced AmplifAI envelope, per sprint" },
    ],
    exampleKey: "bc",
    source: "Slides 39, 40",
  },
  "g2-T3": {
    id: "g2-T3",
    kind: "gate",
    badge: "G2",
    title: "Approval · T3",
    subtitle: "Confirm it is a T3, then approve the one-page canvas",
    gateType: "human",
    path: "T3",
    intro: "At this stage, the AI catalyst or the requester gathers the information.",
    sections: [
      {
        label: "Confirm the T3 criteria",
        items: [
          "No pilot proven yet: a value hypothesis to test",
          "Cost above €50k (otherwise self-service) and below €1m",
          "Risk low or medium",
        ],
      },
      {
        label: "Approve the canvas",
        items: ["The one pager is complete", "KPIs and baseline are measurable", "A kill or scale date is set"],
      },
    ],
    meta: [
      { label: "Forum", value: "AI Portfolio Board (per stream)" },
      { label: "SLA", value: "10 days from a complete canvas" },
      { label: "If no-go", value: "Re-scope or stop" },
    ],
    note: "Threshold to calibrate with Finance: slides 37 and 46 cap T3 at €200k, the routing on slide 35 sends any unproven idea under €1m to T3.",
    businessCaseOf: "T3",
    exampleKey: "g2",
    source: "Slides 35, 40, 46",
  },
  "g3-T3": {
    id: "g3-T3",
    kind: "gate",
    badge: "G3",
    title: "Prioritisation · T3",
    subtitle: "Compare the canvas with the others in the backlog",
    gateType: "human",
    path: "T3",
    sections: prioritisationSections("25% of hub capacity: fast lane and T2 outside big bets"),
    meta: [
      { label: "Owner", value: "Transformation Office" },
      { label: "Forum", value: "AI Portfolio Board" },
      { label: "Cadence", value: "Fortnightly" },
      { label: "If no-go", value: "Stays in the backlog" },
    ],
    exampleKey: "g3",
    source: "Slides 46, 49",
  },
  "g4-T3": {
    id: "g4-T3",
    kind: "gate",
    badge: "G4",
    title: "Mode selection · T3",
    subtitle: "Based on the function's maturity and the use case complexity",
    gateType: "human",
    path: "T3",
    sections: [
      {
        label: "How the mode is chosen",
        items: [
          "Do it for me · complex build and no tech capacity in the function",
          "Do it with me · the function leads, the hub builds the complex part",
          "Enable me · the function has AI builders and budget; the hub audits",
        ],
      },
      { label: "Also decided", items: ["Make or buy", "Sprint funding from the AmplifAI envelope"] },
    ],
    meta: [
      { label: "Owner", value: "Data & AI with the function" },
      { label: "Forum", value: "Design Authority + AI Portfolio Board" },
      { label: "SLA", value: "Design Authority: 5 days" },
      { label: "If no-go", value: "Re-scope, change mode or stop" },
    ],
    exampleKey: "g4",
    source: "Slides 46, 47, 49",
  },

  // ------------------------------------------------------------- Self-service
  "ss-check": {
    id: "ss-check",
    kind: "gate",
    badge: "G1",
    title: "Self-service check",
    subtitle: "The agent validates the shortcut · skips G2 to G4",
    gateType: "agent",
    path: "SS",
    sections: [
      {
        label: "The agent confirms",
        items: [
          "Value and cost below €50k",
          "Approved tools and data only, configured not built",
          "Low risk (individual or small-team assistant)",
        ],
      },
      {
        label: "Enters the full process instead if",
        items: [
          "Production data or a system integration",
          "Users beyond the team (50+)",
          "Needs Digital or Data & AI support",
          "Personal, health or sensitive data",
        ],
      },
    ],
    meta: [{ label: "Owner", value: "Charter agent, OR.AI screening agent" }],
    exampleKey: "g1",
    source: "Slides 35, 41, 47",
  },
  "ss-register": {
    id: "ss-register",
    kind: "doc",
    badge: "SS",
    title: "Register and go",
    subtitle: "One registry line · no committee",
    path: "SS",
    sections: [
      {
        label: "What remains",
        items: [
          "One line in the AI registry",
          "Function head approves; Design Authority only checks a new tool",
          "Funded by the function budget and existing licences",
        ],
      },
      {
        label: "Guardrails",
        items: [
          "No personal, health or confidential data without OR.AI clearance",
          "No connection to production systems, no external sharing",
          "Auto-expiry and cost caps; the audit agent monitors usage",
        ],
      },
    ],
    exampleKey: "g4",
    source: "Slides 37, 41, 42, 52",
  },

  // ------------------------------------------------------------- Later gates
  g5: {
    id: "g5",
    kind: "gate",
    badge: "G5",
    title: "Scale validation",
    subtitle: "From MVP agility to enterprise discipline",
    gateType: "human",
    sections: [
      {
        label: "Reviewed",
        items: [
          "Value: pilot KPIs vs baseline, updated business case",
          "Complexity: actual cost, run owner named, scalability sign-off",
          "Risk: secondary OR.AI and ethical review",
          "Adoption: full change impact assessment, HR impact",
        ],
      },
      {
        label: "Decides",
        items: [
          "Roll-out to another market or geography, new features",
          "A T3 that proves value is promoted to T2 here",
        ],
      },
    ],
    meta: [
      { label: "Owner", value: "Product owner" },
      { label: "Forum", value: "Scale committee; T1: TO SteerCo; T3: AI Portfolio Board" },
      { label: "Agents", value: "Token control, performance monitoring" },
      { label: "If no-go", value: "Fix and retest, or stop" },
      { label: "Escalation", value: "Transformation SteerCo" },
    ],
    exampleKey: "g5",
    source: "Slides 40, 46, 51, 52",
  },
  g6: {
    id: "g6",
    kind: "gate",
    badge: "G6",
    title: "Maintain validation",
    subtitle: "Is it still worth running?",
    gateType: "human",
    sections: [
      {
        label: "Reviewed",
        items: [
          "Value: realised value vs baseline",
          "Complexity: run cost, support, model drift",
          "Risk: post-live monitoring",
          "Adoption: usage vs target by role",
        ],
      },
      { label: "Decides", items: ["Continue, scale, re-scope or stop"] },
    ],
    meta: [
      { label: "Owner", value: "Product owner (run owner)" },
      { label: "Forum", value: "Scale committee; Finance sign-off at +6 / +12 months" },
      { label: "Cadence", value: "Quarterly" },
      { label: "If no-go", value: "Terminate or pivot" },
      { label: "Escalation", value: "Sponsor, then TO SteerCo" },
    ],
    exampleKey: "g6",
    source: "Slides 46, 51, 52",
  },
};

export const businessCaseIdFor = (path: PathId): string =>
  path === "SS" ? "ss-register" : `bc-${path}`;

// ---------------------------------------------------------------------
// Example switcher (tier × mode)
// ---------------------------------------------------------------------

export interface ExampleCase {
  id: string;
  short: string;
  title: string;
  functionName: string;
  path: PathId;
  mode: ModeId;
  cost: string;
  value: string;
  whyMode: string;
  notes: Partial<Record<ExampleNoteKey, string>>;
}

export const EXAMPLES: ExampleCase[] = [
  {
    id: "gide",
    short: "GIDE procurement agent",
    title: "GIDE / BOWIE procurement agent",
    functionName: "Procurement & GBS",
    path: "T1",
    mode: "for-me",
    cost: "€1.45m",
    value: "€3.8m run-rate EBITDA",
    whyMode: "T1: always built by the hub",
    notes: {
      ppc: "Quotes to SAP purchase orders in 48h instead of 7–10 days · 1,800 buyers in 3 regions.",
      g1: "Q1 = yes (big bet 6, SAP P2P core, €1.45m): T1. OR.AI: medium (write-back to SAP).",
      bc: "€3.8m recurring EBITDA, 11-month payback, ~24 FTE of capacity redirected to negotiations.",
      g2: "The first board confirms the big bet and staffs Finance to baseline P2P costs; case approved after 2 iterations.",
      g3: "Score 91 / 100 · first in the Procurement backlog · 60% big-bet capacity.",
      g4: "Do it for me: the hub builds the agent, Procurement frames the rules and validates.",
      build: "Hub squad builds the MVP in France and Spain; target 75% touchless orders.",
      g5: "TO SteerCo checks the touchless rate vs baseline before the Europe roll-out.",
      g6: "Finance signs off realised savings at +6 and +12 months.",
    },
  },
  {
    id: "ibp",
    short: "IBP demand sensing",
    title: "Demand sensing for IBP",
    functionName: "Supply Chain",
    path: "T2",
    mode: "with-me",
    cost: "€650k",
    value: "€1.8m working capital",
    whyMode: "Planners own the logic, the hub owns the pipelines",
    notes: {
      ppc: "Merge point-of-sale, orders and promo signals into SAP IBP · 400 planners.",
      g1: "Pilot already proven, 2 regions, €650k: T2. The board confirms T2 rather than T3.",
      bc: "2 pages: €1.8m working capital, 15 h / week saved per planner, runs on the existing data platform.",
      g2: "Program Sponsors (CDO + CFO) approve on the AI Portfolio Board's advice.",
      g3: "Score 78 / 100 · linked to big bet 4 (Forecast to planning).",
      g4: "Do it with me: planning experts tune the models, the hub builds the data pipelines.",
      build: "Shared squad extends the pilot to 2 more markets.",
      g5: "Scale committee checks forecast accuracy +35% vs baseline.",
      g6: "Quarterly: accuracy, inventory and platform run cost.",
    },
  },
  {
    id: "lex",
    short: "Contract review assistant",
    title: "Supplier contract review assistant",
    functionName: "Legal",
    path: "T3",
    mode: "for-me",
    cost: "€160k",
    value: "Review time halved",
    whyMode: "No builders in Legal and a complex contract-system link",
    notes: {
      ppc: "Flag risky clauses in supplier contracts before signature · 40 lawyers and buyers.",
      g1: "No pilot, one function, €160k: T3. OR.AI: medium (confidential contracts).",
      bc: "Canvas: review time −50%, 3 KPIs, 8-week MVP on 200 past contracts.",
      g2: "Approved at the AI Portfolio Board in 10 days, with OR.AI conditions on contract data.",
      g3: "Score 70 / 100 · in the 25% fast-lane queue, slot next quarter.",
      g4: "Do it for me: Legal has no tech capacity and the integration is complex.",
      build: "The hub builds the MVP; lawyers validate outputs on real contracts.",
      g5: "If value is proven, promoted to T2 to cover all regions.",
      g6: "Quarterly value pulse: review time and clauses caught.",
    },
  },
  {
    id: "fpa",
    short: "FP&A commentary agent",
    title: "FP&A variance commentary agent",
    functionName: "Finance",
    path: "T3",
    mode: "with-me",
    cost: "€120k",
    value: "Commentary in 1 day, not 4",
    whyMode: "Finance power users build, the hub plugs the data",
    notes: {
      ppc: "Draft the monthly variance commentary from controlling reports · 60 controllers.",
      g1: "No pilot, one function, €120k: T3. OR.AI: low.",
      bc: "Canvas: 1 day instead of 4, 3 KPIs, 6-week sprint.",
      g2: "AI Portfolio Board says go within 10 days.",
      g3: "Score 74 / 100 · 25% fast-lane capacity.",
      g4: "Do it with me: Finance builds prompts and templates, the hub connects the reporting data.",
      build: "Shared squad: Finance builds the agent, the hub plugs the data.",
      g5: "Promoted to T2 if adopted beyond the pilot entities.",
      g6: "Quarterly: hours saved and usage by controllers.",
    },
  },
  {
    id: "wonka",
    short: "Claims validator",
    title: "Regulatory claims validator",
    functionName: "Science & Regulatory",
    path: "T3",
    mode: "enable-me",
    cost: "€85k",
    value: "Review from 14 to 4 days",
    whyMode: "Science has AI builders and its own budget",
    notes: {
      ppc: "Screen packaging claims against health authority rules before legal review · 85 users.",
      g1: "No pilot, one function, €85k: T3. OR.AI: medium (light review in 5 days).",
      bc: "Canvas: review from 14 to 4 days, >98% first-time right, €240k agency saving; 8-week sprint.",
      g2: "AI Portfolio Board says go within 10 days.",
      g3: "Score 82 / 100 · 25% fast-lane capacity.",
      g4: "Enable me: Science builds; the hub reviews and audits.",
      build: "Function builders build on the approved LLM platform, in the builder sandbox.",
      g5: "Value proven, promoted to T2 to roll out to all regions.",
      g6: "Quarterly value pulse in the single ledger.",
    },
  },
  {
    id: "copilot",
    short: "HR policy Copilot agent",
    title: "HR policy Q&A Copilot agent",
    functionName: "HR",
    path: "SS",
    mode: "self-service",
    cost: "€12k / year",
    value: "HR partners answer faster",
    whyMode: "Approved tool, configured not built",
    notes: {
      ppc: "Declared via the charter: answers HR partners' policy questions · 30 users.",
      g1: "Copilot Studio, policies already on SharePoint, €12k, low risk: self-service.",
      g4: "One registry line; the HR head approves; cost cap and guardrails apply.",
      build: "An HR partner configures it in Copilot Studio in 2 days.",
      g6: "Quarterly value pulse; the audit agent watches usage and data access.",
    },
  },
];

export const exampleById = (id: string): ExampleCase =>
  EXAMPLES.find((e) => e.id === id) ?? EXAMPLES[0];
