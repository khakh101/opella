// =====================================================================
// Miro board · Run step content
// One flow for every mode: step 1 running well, step 2 a problem arises (two
// questions, two assessments, G6), step 3 ensure a good adoption. Who delivers
// each part depends on the build mode.
// Sources: operating model lifecycle PDF (degrees 1 to 4, the four meetings,
// role sheets) and the Build step of this board. Mode differences marked
// "to confirm" are proposals.
// =====================================================================

import { BuildMode, Chip, Origin } from "./miroBuild";

export type RunItemId = "run" | "pipeline" | "feature" | "adoption";

// The four double-click items of the Run flow. `cell` points to the per-mode content below.
export interface RunItem {
  id: RunItemId;
  cell: 1 | 2 | 3 | 4;
  badge: string;
  tab: string;
  name: string;
  oneLiner: string;
}

export const RUN_ITEMS: RunItem[] = [
  { id: "run", cell: 1, badge: "STEP 1", tab: "Step 1", name: "Running well", oneLiner: "The app runs and everything goes well" },
  { id: "pipeline", cell: 2, badge: "STEP 2 · ASSESSMENT 2.1", tab: "2.1", name: "Broken pipeline", oneLiner: "Quick fix, or value × complexity" },
  { id: "feature", cell: 3, badge: "STEP 2 · ASSESSMENT 2.2", tab: "2.2", name: "New feature", oneLiner: "Quick feature, or back to T2 framing" },
  { id: "adoption", cell: 4, badge: "STEP 3", tab: "Step 3", name: "Ensure a good adoption", oneLiner: "People keep using it" },
];

export type RouteTone = "quick" | "deep" | "back";

export interface RunRoute {
  tone: RouteTone;
  title: string;
  text: string;
  bullets?: string[];
}

export interface RunQuestion {
  question: string;
  routes: RunRoute[];
  solve: string;
  remove: string;
}

// Step 2: two questions, each followed by an assessment, then G6
export const RUN_QUESTIONS: Record<"pipeline" | "feature", RunQuestion> = {
  pipeline: {
    question: "Is it a broken pipeline?",
    routes: [
      { tone: "quick", title: "Quick fix", text: "Little effort: the failure is found and repaired straight away." },
      {
        tone: "deep",
        title: "Many resources required",
        text: "A value × complexity assessment is made before any resource is spent.",
        bullets: [
          "Value: what the use case still brings (EBITDA, cost)",
          "Complexity: data readiness and infrastructure needed to fix it",
        ],
      },
    ],
    solve: "Can be solved: fix it",
    remove: "Cannot be solved: remove the use case",
  },
  feature: {
    question: "Is it a new feature?",
    routes: [
      { tone: "quick", title: "Quick feature", text: "Small scope: prioritised in the backlog, then developed." },
      { tone: "back", title: "Larger scope", text: "Too big for a quick feature: back to the T2 framing." },
    ],
    solve: "Can be delivered: prioritise and develop it",
    remove: "Cannot be delivered: remove the use case",
  },
};

// Step 3: how the adoption is ensured
export const ADOPTION_FLOW: { title: string; text: string }[] = [
  { title: "Plan", text: "The adoption plan comes from the business case. One Change & adoption lead per core team or big bet." },
  { title: "Train", text: "Users are trained by profile (AI Academy tiers), before and after go-live." },
  { title: "Lead by example", text: "Sponsors and leaders use it first; successful use cases are shared peer to peer." },
  { title: "Measure", text: "Usage against role-based targets, and whether people act on the output, not only logins." },
  { title: "Correct", text: "If adoption lags: retrain, adjust the use case, or raise it at G6 (stop trigger)." },
];

export const ADOPTION_SOURCE_NOTE =
  "To validate with P&C: built from the adoption framework (operating model deck, slides 24 to 29), the Change & adoption lead role sheet and the exec deck (adoption measured on logins, not use).";

export interface RunCell {
  short: string;
  who: Chip[];
  happens: string[];
  output: string;
  note?: string;
}

export interface RunMode {
  core: Chip[];
  support: Chip[];
  rule: string; // one sentence: who runs it
  steps: Record<1 | 2 | 3 | 4, RunCell>;
}

const C = (label: string, origin: Origin): Chip => ({ label, origin });

export const RUN_MODES: Record<BuildMode, RunMode> = {
  "enable-me": {
    core: [C("PO and AI builder in the function", "function"), C("Engineers in the function", "function")],
    support: [C("Data & AI: review and audit", "dai"), C("Transformation Office", "to")],
    rule: "The function runs it, with its own budget. Data & AI reviews and audits.",
    steps: {
      1: {
        short: "The function runs and maintains it",
        who: [C("PO", "function"), C("AI builder", "function"), C("Data & AI audit", "dai")],
        happens: [
          "The AI builder maintains the app or agent within the platform guardrails",
          "The PO owns the run cost (tokens included) and the ROI against the baseline",
          "Data & AI reviews and audits; it does not run it",
          "A bought solution: the provider delivers and the hub maintains (marked tbd in the deck)",
        ],
        output: "A use case running within its budget",
      },
      2: {
        short: "The function fixes, the hub takes what it can't",
        who: [C("AI builder", "function"), C("Function engineers", "function"), C("Data & AI support", "dai")],
        happens: [
          "The function's engineers investigate the failure and fix it",
          "Needs that go beyond low-code are escalated to the hub",
          "Data & AI helps on specific problems, not on the deep work",
        ],
        output: "Pipeline fixed, or escalated to the hub",
      },
      3: {
        short: "The PO raises it, the function builds it",
        who: [C("PO", "function"), C("AI builder", "function"), C("Data & AI audit", "dai")],
        happens: [
          "The PO raises the need; assessment 2.2 decides: a quick feature is prioritised in the backlog, a larger one goes back to T2 framing",
          "The function builds the feature, or buys it",
          "Data & AI audits it before it goes live",
        ],
        output: "A feature delivered by the function, or back to T2 framing",
      },
      4: {
        short: "The function drives usage",
        who: [C("PO", "function"), C("AI catalyst", "function"), C("Change & adoption lead", "to")],
        happens: [
          "The PO manages adoption and change so the tool is used",
          "The AI catalyst relays the adoption activities in the function",
          "The Change & adoption lead provides the adoption plan and playbooks",
        ],
        output: "Active usage against the role-based targets",
      },
    },
  },

  "with-me": {
    core: [C("PO and AI builder in the function", "function"), C("Engineers in Data & AI", "dai")],
    support: [C("Digital PO", "dai"), C("Transformation Office", "to")],
    rule: "The function leads, the hub supports with engineers and its backlog.",
    steps: {
      1: {
        short: "The shared squad runs it",
        who: [C("PO", "function"), C("AI builder", "function"), C("Data & AI engineers", "dai")],
        happens: [
          "The function leads the day-to-day and owns the run cost and the ROI",
          "Data & AI engineers maintain the complex part and the data",
          "The hub's work is slotted in the Data & AI backlog",
        ],
        output: "A use case running, with the run shared by the squad",
      },
      2: {
        short: "The hub fixes it, the function checks the impact",
        who: [C("Data & AI engineers", "dai"), C("AI builder", "function"), C("PO", "function")],
        happens: [
          "Data engineers investigate the failure and repair the pipeline",
          "The function's AI builder checks the business impact and retests",
          "The PO is told when the fix is live",
        ],
        output: "Pipeline fixed, confirmed by the function",
      },
      3: {
        short: "The PO raises it, the squad builds it",
        who: [C("PO", "function"), C("Digital PO", "dai"), C("Data & AI engineers", "dai")],
        happens: [
          "The PO raises the need; assessment 2.2 decides: a quick feature is prioritised in the backlog, a larger one goes back to T2 framing",
          "The shared squad builds it, the hub's part in the Data & AI backlog",
        ],
        output: "A feature delivered by the squad, or back to T2 framing",
      },
      4: {
        short: "The function drives usage",
        who: [C("PO", "function"), C("AI catalyst", "function"), C("Change & adoption lead", "to")],
        happens: [
          "The PO manages adoption and change in the function",
          "The AI catalyst relays the adoption activities",
          "The Change & adoption lead provides the adoption plan and playbooks",
        ],
        output: "Active usage against the role-based targets",
      },
    },
  },

  "for-me": {
    core: [C("Data & AI engineers", "dai"), C("Business owner in the function", "function")],
    support: [C("Digital PO", "dai"), C("Transformation Office", "to")],
    rule: "The hub runs it for the function; the function uses it and validates.",
    steps: {
      1: {
        short: "The hub runs it, the function validates",
        who: [C("Data & AI engineers", "dai"), C("Digital PO", "dai"), C("Business owner", "function")],
        happens: [
          "The hub runs and maintains the use case end to end",
          "The business owner uses it and confirms it still answers the need",
          "No function engineers to staff",
        ],
        output: "A use case run by the hub",
      },
      2: {
        short: "The hub fixes it end to end",
        who: [C("Data & AI engineers", "dai"), C("Digital PO", "dai"), C("Business owner", "function")],
        happens: [
          "Data engineers investigate the failure and repair the pipeline",
          "The business owner is informed of the impact and validates the fix",
        ],
        output: "Pipeline fixed by the hub",
      },
      3: {
        short: "The business owner asks, the hub builds",
        who: [C("Business owner", "function"), C("Digital PO", "dai"), C("Data & AI engineers", "dai")],
        happens: [
          "The business owner raises the need; assessment 2.2 decides: a quick feature is prioritised in the backlog, a larger one goes back to T2 framing",
          "The hub builds it in the Data & AI backlog; the function tests and validates",
        ],
        output: "A feature delivered by the hub, or back to T2 framing",
      },
      4: {
        short: "The function adopts, the TO supports",
        who: [C("Business owner", "function"), C("AI catalyst", "function"), C("Change & adoption lead", "to")],
        happens: [
          "The business owner and the AI catalyst drive the usage in the function",
          "The Change & adoption lead provides the adoption plan and playbooks",
        ],
        output: "Active usage against the role-based targets",
        note: "To confirm: the hub does not own adoption in this mode; the PDF gives no mode-specific split.",
      },
    },
  },

  "self-service": {
    core: [C("The user", "user")],
    support: [C("Audit & monitoring agent", "agent"), C("Token control agent", "agent")],
    rule: "The user runs it; two agents monitor and the hub reviews only what is flagged.",
    steps: {
      1: {
        short: "The user runs it, agents monitor",
        who: [C("The user", "user"), C("Audit & monitoring", "agent"), C("Token control", "agent")],
        happens: [
          "The user keeps using and maintaining the assistant",
          "The audit and monitoring agent runs automated checks: data access, prompts, guardrails",
          "The token control agent tracks token usage and cost against the cap",
          "The hub reviews only what is flagged",
        ],
        output: "A monitored assistant, within its cap",
      },
      2: {
        short: "No production pipeline to repair",
        who: [C("The user", "user"), C("Audit & monitoring", "agent")],
        happens: [
          "Self-service has no connection to production systems: the user fixes the configuration",
          "If it needs a real pipeline, the user cannot stay in self-service",
          "The user leaves the mode: new tier and mode assessment, back to Framing",
        ],
        output: "Fixed by the user, or back to Framing",
        note: "To confirm: derived from the sandbox guardrails and the leave-at-any-time rule, not stated in the PDF.",
      },
      3: {
        short: "Small changes alone, a bigger scope goes back",
        who: [C("The user", "user"), C("Audit & monitoring", "agent")],
        happens: [
          "The user adds a feature with the approved tool, inside the guardrails",
          "The audit agent re-checks it",
          "If it costs more or is worth more than expected, new tier and mode assessment: back to Framing",
        ],
        output: "A new feature, or back to Framing",
      },
      4: {
        short: "The user's team adopts it",
        who: [C("The user", "user"), C("AI catalyst", "function")],
        happens: [
          "The user shares it with colleagues inside the guardrails",
          "Usage is read at the quarterly value pulse",
        ],
        output: "Usage visible at the value pulse",
        note: "To confirm: who supports adoption for a self-service assistant.",
      },
    },
  },
};

// G6 by mode: who brings what to the portfolio board
export const G6_BY_MODE: Record<BuildMode, string> = {
  "enable-me": "The function's PO presents the problem and its assessment; the hub audits.",
  "with-me": "The PO presents with the hub, which reports on the complex part and the data.",
  "for-me": "The business owner presents the impact; the hub reports the assessment and the run cost.",
  "self-service": "The agents' reports come with the problem; the hub looks only at what is flagged.",
};
