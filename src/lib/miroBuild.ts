// =====================================================================
// Miro board · Build step content
// 4 big steps, shared by every mode; who delivers them depends on the mode.
// Roles and colours follow the "Pillar 2 : Roles" slide of the operating
// model deck (squad modes 1 to 3 and the transversal teams).
// =====================================================================

import { ModeId } from "./miroLifecycle";

export type BuildMode = ModeId; // "enable-me" | "with-me" | "for-me" | "self-service"

export const BUILD_MODE_ORDER: BuildMode[] = ["enable-me", "with-me", "for-me", "self-service"];

// ---------------------------------------------------------------------
// Where a role sits (legend of the Roles slide)
// ---------------------------------------------------------------------

export type Origin = "function" | "to" | "dai" | "bs" | "other" | "external" | "agent" | "user";

export const ORIGIN: Record<Origin, { label: string; color: string; soft: string }> = {
  function: { label: "Function", color: "#6d4fc9", soft: "#ede8fb" },
  to: { label: "Transformation Office and other supporting functions", color: "#e0763a", soft: "#fdebdd" },
  dai: { label: "Data & AI", color: "#0f9d8a", soft: "#dcf4ef" },
  bs: { label: "Business Solutions", color: "#c99a06", soft: "#fbf0cc" },
  other: { label: "Other supporting functions", color: "#d0558f", soft: "#fde8f2" },
  external: { label: "External", color: "#64748b", soft: "#eef1f5" },
  agent: { label: "Agent", color: "#4f46e5", soft: "#e6e5fb" },
  user: { label: "The user", color: "#6d4fc9", soft: "#ede8fb" },
};

export interface Chip {
  label: string;
  origin: Origin;
}

// ---------------------------------------------------------------------
// The 4 big steps
// ---------------------------------------------------------------------

export interface BuildStep {
  n: 1 | 2 | 3 | 4;
  name: string;
  oneLiner: string;
}

export const BUILD_STEPS: BuildStep[] = [
  { n: 1, name: "PO identification", oneLiner: "Name who owns the use case" },
  { n: 2, name: "Backlog and user stories", oneLiner: "Turn the business case into stories" },
  { n: 3, name: "Build the MVP", oneLiner: "Build the first working version" },
  { n: 4, name: "User test and validation", oneLiner: "Users test, the owner validates each story" },
];

// ---------------------------------------------------------------------
// Per mode and per step: card text + double-click detail
// ---------------------------------------------------------------------

export interface StepCell {
  short: string;
  who: Chip[];
  happens: string[];
  output: string;
  note?: string;
}

export interface ModeBuild {
  id: BuildMode;
  label: string;
  tagline: string;
  whoBuilds: string;
  builders: Chip[]; // lane header: core team
  support: Chip[]; // lane header: support team
  color: string;
  steps: Record<1 | 2 | 3 | 4, StepCell>;
}

const C = (label: string, origin: Origin): Chip => ({ label, origin });

export const BUILD_MODES: Record<BuildMode, ModeBuild> = {
  // ----------------------------------------------------------- ENABLE ME
  "enable-me": {
    id: "enable-me",
    label: "Enable me",
    tagline: "The function builds",
    whoBuilds:
      "The build is mainly done by the technical resources of the function, with Data & AI in supervision and audit.",
    builders: [
      C("The user (AI builder)", "function"),
      C("Engineers in the function", "function"),
      C("External provider (BUY)", "external"),
    ],
    support: [C("Data & AI: support and audit", "dai"), C("Transversal teams", "to")],
    color: "#6d4fc9",
    steps: {
      1: {
        short: "The function names its PO",
        who: [C("BO / PO", "function"), C("AI catalyst", "function"), C("Digital PO", "dai")],
        happens: [
          "The PO is nominated at the start of the build, when the team is chosen",
          "The AI catalyst hands the framed need over to the PO",
          "A digital PO joins from Data & AI or Business Solutions, per use case",
        ],
        output: "A named PO who owns backlog, acceptance, budget and ROI",
      },
      2: {
        short: "PO and AI builder write the backlog",
        who: [C("BO / PO", "function"), C("AI builder", "function"), C("Business analytics", "function")],
        happens: [
          "The PO writes and prioritises the backlog and the user stories",
          "The AI builder turns the stories into a build plan",
          "The PO sets the acceptance criteria and the definition of done",
          "Data & AI is consulted only on specific questions",
        ],
        output: "A prioritised backlog with acceptance criteria",
      },
      3: {
        short: "The function builds, or buys a product",
        who: [
          C("AI builder", "function"),
          C("Function engineers", "function"),
          C("External provider", "external"),
          C("Data & AI support", "dai"),
        ],
        happens: [
          "The AI builder and the function's engineers build the MVP on governed low-code or agent platforms",
          "Or buy: an external provider's product that answers the need is configured, after a fit check on the new tool",
          "Data & AI supervises, audits and solves specific problems; it does not do the deep work",
          "Needs that go beyond low-code are escalated to the hub",
        ],
        output: "A working MVP, built or bought",
      },
      4: {
        short: "Business testers validate each story",
        who: [C("Business testers", "function"), C("BO / PO", "function"), C("Data & AI audit", "dai")],
        happens: [
          "Business testers and target users test the MVP against the acceptance criteria",
          "The PO validates each user story, or sends it back",
          "Data & AI audits the build before it leaves this step: quality, data and platform fit",
        ],
        output: "A validated MVP: go to Pre-scale, iterate, or stop",
      },
    },
  },

  // ----------------------------------------------------------- WITH ME
  "with-me": {
    id: "with-me",
    label: "Do it with me",
    tagline: "The function and Data & AI build together",
    whoBuilds:
      "The build combines the technical resources of the Data & AI team and of the function, with an external consultant when needed.",
    builders: [
      C("External consultant", "external"),
      C("Engineers in the function", "function"),
      C("Engineers in Data & AI", "dai"),
    ],
    support: [C("Transversal teams", "to")],
    color: "#0369a1",
    steps: {
      1: {
        short: "A function PO and a digital PO",
        who: [C("BO / PO", "function"), C("Digital PO", "dai"), C("AI catalyst", "function")],
        happens: [
          "The PO is nominated in the function at the start of the build, when the team is chosen",
          "A digital PO joins from Data & AI or Business Solutions, per use case",
          "The shared squad is composed: engineers from the function, engineers from Data & AI, and an external consultant if capacity or a skill is missing",
        ],
        output: "A named PO and a composed shared squad",
      },
      2: {
        short: "The PO and the hub write the backlog together",
        who: [C("BO / PO", "function"), C("Business analytics", "function"), C("FDE", "dai"), C("Digital PO", "dai")],
        happens: [
          "The PO and the Data & AI side turn the business case into a backlog and user stories",
          "The function brings the business rules; Data & AI brings the technical specs",
          "The PO sets the acceptance criteria and the definition of done",
        ],
        output: "A shared backlog with business and technical stories",
      },
      3: {
        short: "One squad: the function leads, the hub builds the complex part",
        who: [
          C("Function engineers", "function"),
          C("Data & AI engineers", "dai"),
          C("External consultant", "external"),
        ],
        happens: [
          "The function leads and builds what it can handle",
          "Data & AI engineers (data scientist, AI engineer, data engineer or architect), some deployed in the function, build the complex scope and the data",
          "An external consultant adds capacity or a missing skill",
          "Built on governed data products, not on a one-off data set",
        ],
        output: "A working MVP built by a shared squad",
      },
      4: {
        short: "Function users test, the hub tests the tech",
        who: [C("Business testers", "function"), C("BO / PO", "function"), C("Data & AI engineers", "dai")],
        happens: [
          "Business testers and target users test the MVP against the acceptance criteria",
          "Data & AI engineers run the technical and performance tests",
          "The PO validates each user story, or sends it back",
        ],
        output: "A validated MVP: go to Pre-scale, iterate, or stop",
      },
    },
  },

  // ----------------------------------------------------------- FOR ME
  "for-me": {
    id: "for-me",
    label: "Do it for me",
    tagline: "Data & AI builds",
    whoBuilds:
      "The build is mainly done by the technical resources of the Data & AI team. The function only brings the business owner, the AI catalyst and a PO if needed.",
    builders: [
      C("Data & AI engineers", "dai"),
      C("Function: business owner, AI catalyst, potential PO", "function"),
    ],
    support: [C("Transversal teams", "to")],
    color: "#0d3824",
    steps: {
      1: {
        short: "The business owner, plus a PO if needed",
        who: [C("Business owner", "function"), C("Potential PO", "function"), C("AI catalyst", "function"), C("Digital PO", "dai")],
        happens: [
          "The business owner stays the owner of the need; a PO from the function is nominated now, only if the use case needs one",
          "The AI catalyst hands the framed need over",
          "A digital PO from Data & AI or Business Solutions leads the squad side",
        ],
        output: "A named business owner and a digital PO for the squad",
      },
      2: {
        short: "Data & AI writes the backlog",
        who: [C("Digital PO", "dai"), C("FDE", "dai"), C("Business owner", "function")],
        happens: [
          "Data & AI writes the backlog and the user stories from the approved business case",
          "The business owner checks that they reflect the need",
          "The acceptance criteria and the definition of done are agreed with the business owner",
        ],
        output: "A backlog validated by the business owner",
      },
      3: {
        short: "The Data & AI squad builds end to end",
        who: [
          C("Data scientist", "dai"),
          C("AI engineer", "dai"),
          C("Data eng. / architect", "dai"),
          C("Business architect", "to"),
        ],
        happens: [
          "The Data & AI squad builds the MVP end to end on governed data",
          "The function does not need to staff the build",
          "A business architect from the Transformation Office side is part of the squad",
        ],
        output: "A working MVP built by Data & AI",
      },
      4: {
        short: "Target users test, the owner accepts",
        who: [C("Target users", "function"), C("Business owner", "function"), C("Data & AI engineers", "dai")],
        happens: [
          "Target users test the MVP against the acceptance criteria",
          "Data & AI engineers run the technical and performance tests",
          "The business owner validates each user story, or sends it back",
        ],
        output: "A validated MVP: go to Pre-scale, iterate, or stop",
      },
    },
  },

  // ----------------------------------------------------------- SELF-SERVICE
  "self-service": {
    id: "self-service",
    label: "Self-service AI",
    tagline: "The user builds, agents watch",
    whoBuilds:
      "The user builds it alone with an approved tool. Two agents watch the whole build: audit and monitoring, and token control. At any time the user can leave this mode.",
    builders: [C("The user", "user")],
    support: [C("Audit & monitoring agent", "agent"), C("Token control agent", "agent")],
    color: "#7c3aed",
    steps: {
      1: {
        short: "The user owns it",
        who: [C("The user", "user"), C("Business owner", "function")],
        happens: [
          "The user owns the assistant end to end",
          "The business owner has approved the use case at framing",
        ],
        output: "An approved idea, owned by the user",
      },
      2: {
        short: "The user writes a short backlog",
        who: [C("The user", "user")],
        happens: [
          "The user lists what the assistant should do as a few user stories",
          "The user sets the acceptance criteria: what good looks like",
        ],
        output: "A short list of user stories",
      },
      3: {
        short: "The user builds in the sandbox",
        who: [C("The user", "user"), C("Token control", "agent"), C("Audit & monitoring", "agent")],
        happens: [
          "The user configures an approved tool (for example a personal Copilot agent) in the builder sandbox: low or no code, approved or synthetic data",
          "The token control agent tracks token usage and cost against the cap",
          "The audit and monitoring agent checks data access, prompts and guardrails",
        ],
        output: "A working assistant, inside the sandbox",
      },
      4: {
        short: "The user tests and registers it",
        who: [C("The user", "user"), C("Audit & monitoring", "agent")],
        happens: [
          "The user tests the assistant against the user stories",
          "The audit and monitoring agent runs its automated checks",
          "The user validates it and registers it: one line in the AI registry",
        ],
        output: "A registered assistant",
      },
    },
  },
};

// ---------------------------------------------------------------------
// Self-service: leaving the mode at any time
// ---------------------------------------------------------------------

export const SELF_SERVICE_EXITS: { title: string; text: string }[] = [
  { title: "Can't build it alone", text: "The user needs help beyond the approved tools" },
  { title: "Costs more than expected", text: "Build or token cost goes above what was planned" },
  { title: "Worth more than expected", text: "The value is larger than the first estimate" },
];

export const SELF_SERVICE_EXIT_RESULT = "New tier and mode assessment: back to Framing";

// ---------------------------------------------------------------------
// Team deep dive (one per mode)
// ---------------------------------------------------------------------

export interface TeamRole {
  role: string;
  origin: Origin;
  isNew?: boolean; // "NEW" tag of the Roles slide
  deployed?: boolean; // Data & AI profile deployed in the function (ring)
  external?: boolean; // external team or business-side resource (asterisk)
  split?: boolean; // Digital PO: Data & AI or Business Solutions (two-colour avatar)
  note?: string;
}

export interface TeamView {
  mode: BuildMode;
  title: string;
  subtitle: string;
  squadName: string; // "Squad mode 1"
  roles: TeamRole[];
  inSupport?: TeamRole[];
  extras?: TeamRole[]; // from the brief, not on the Roles slide
  leverage: { who: "Function" | "Data & AI" | "Transformation Office"; role: string; detail: string }[];
}

const TO_LEVERAGE = {
  who: "Transformation Office" as const,
  role: "Prioritises, tracks value, runs adoption",
  detail: "Same in every mode: portfolio and prioritisation, value tracking, change and adoption.",
};

export const TEAM_VIEWS: Partial<Record<BuildMode, TeamView>> = {
  "enable-me": {
    mode: "enable-me",
    title: "Enable me · the team",
    subtitle: "Squad mode 3: the function builds, Data & AI supports",
    squadName: "Squad mode 3",
    roles: [
      { role: "BO / PO", origin: "function", isNew: true },
      { role: "Business analytics", origin: "function" },
      { role: "Business architect", origin: "to", isNew: true },
      { role: "AI builder", origin: "function", isNew: true, note: "Often the user who raised the use case" },
      { role: "Digital PO", origin: "dai", split: true, note: "From Data & AI or Business Solutions, per use case" },
      { role: "Data scientist", origin: "function", external: true },
      { role: "AI engineer", origin: "function", external: true },
      { role: "Data eng. / architect", origin: "function", external: true },
    ],
    inSupport: [
      { role: "Data scientist", origin: "dai" },
      { role: "AI engineer", origin: "dai" },
      { role: "Data eng. / architect", origin: "dai" },
    ],
    extras: [{ role: "External provider (BUY)", origin: "external", note: "A market product that answers the need" }],
    leverage: [
      {
        who: "Function",
        role: "Builds",
        detail: "AI builder and engineers inside the function (for example M&S), or a bought product. Teams starred on the slide are external or business-side resources with Data & AI guidance.",
      },
      {
        who: "Data & AI",
        role: "Supervises and audits",
        detail: "Support, audit and specific problem solving; not deep build work.",
      },
      TO_LEVERAGE,
    ],
  },
  "with-me": {
    mode: "with-me",
    title: "Do it with me · the team",
    subtitle: "Squad mode 2: one squad across the function and Data & AI",
    squadName: "Squad mode 2",
    roles: [
      { role: "BO / PO", origin: "function", isNew: true },
      { role: "Business analytics", origin: "function" },
      { role: "Business architect", origin: "to", isNew: true },
      { role: "AI builder", origin: "function", isNew: true },
      { role: "FDE", origin: "dai", isNew: true },
      { role: "Digital PO", origin: "dai", split: true, note: "From Data & AI or Business Solutions, per use case" },
      { role: "Data scientist", origin: "dai", deployed: true },
      { role: "AI engineer", origin: "dai", deployed: true },
      { role: "Data eng. / architect", origin: "dai", deployed: true },
    ],
    extras: [{ role: "External consultant", origin: "external", note: "Adds capacity or a missing skill" }],
    leverage: [
      {
        who: "Function",
        role: "Co-builds and leads",
        detail: "PO, business analytics and AI builder; engineers inside the function.",
      },
      {
        who: "Data & AI",
        role: "Co-builds the complex part",
        detail: "Data scientist, AI engineer and data engineer or architect, some deployed on the function side.",
      },
      TO_LEVERAGE,
    ],
  },
  "for-me": {
    mode: "for-me",
    title: "Do it for me · the team",
    subtitle: "Squad mode 1: Data & AI builds",
    squadName: "Squad mode 1",
    roles: [
      { role: "BO / PO", origin: "function", isNew: true },
      { role: "Business architect", origin: "to", isNew: true },
      { role: "FDE", origin: "dai", isNew: true },
      { role: "Digital PO", origin: "dai", split: true, note: "From Data & AI or Business Solutions, per use case" },
      { role: "Data scientist", origin: "dai" },
      { role: "AI engineer", origin: "dai" },
      { role: "Data eng. / architect", origin: "dai" },
    ],
    extras: [{ role: "AI catalyst", origin: "function", note: "Frames the need and hands it over" }],
    leverage: [
      {
        who: "Function",
        role: "Frames and validates",
        detail: "Only the business owner, the AI catalyst and a PO if needed. No function engineers.",
      },
      {
        who: "Data & AI",
        role: "Builds",
        detail: "The squad builds end to end: data scientist, AI engineer, data engineer or architect, FDE.",
      },
      TO_LEVERAGE,
    ],
  },
};

// Transversal teams, present whatever the mode (bottom of the Roles slide)
export const TRANSVERSAL_TEAMS: { name: string; origin: Origin; members: string[] }[] = [
  { name: "Functions and regions", origin: "function", members: ["Data stewards", "AI catalyst", "Business testers", "Business sponsor"] },
  {
    name: "Transformation Office",
    origin: "to",
    members: ["TO lead", "Change and adoption lead (AmplifAI)", "Change management lead (Butterfly)", "Regional adoption relays"],
  },
  {
    name: "Data & AI (Digital)",
    origin: "dai",
    members: ["Semantic layer architect", "Master data (MDM)", "Data governance", "AI governance", "Data product lead"],
  },
  { name: "Digital transversal teams", origin: "bs", members: ["Business Solutions team", "Enterprise architecture", "Infra and cyber"] },
  {
    name: "Other supporting functions",
    origin: "other",
    members: ["Value officer (Finance)", "OR.AI team (Legal)", "Internal communication", "P&C counterpart (case by case)"],
  },
];

// ---------------------------------------------------------------------
// Self-service: the two agents that watch the build
// ---------------------------------------------------------------------

export interface AgentDef {
  id: "audit" | "token";
  name: string;
  does: string;
}

export const SELF_SERVICE_AGENTS: AgentDef[] = [
  {
    id: "audit",
    name: "Audit & monitoring agent",
    does: "Runs automated checks: data access, prompts, guardrails",
  },
  {
    id: "token",
    name: "Token control agent",
    does: "Tracks token usage and cost against the cap; alerts, throttles or blocks over budget",
  },
];

// Zoom of the audit & monitoring agent
export const SELF_SERVICE_GUARDRAILS: string[] = [
  "No personal, health or confidential data without OR.AI clearance",
  "No connection to production systems",
  "No external sharing of outputs or data",
  "Auto-expiry and cost caps on every workspace",
  "Everything listed in the AI registry",
];
