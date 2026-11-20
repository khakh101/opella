// =====================================================================
// Miro board · Run step content
// 4 steps shared by every mode; who delivers them depends on the build mode.
// Sources: operating model lifecycle PDF (degrees 1 to 4, the four meetings,
// role sheets) and the Build step of this board. Mode differences marked
// "to confirm" are proposals.
// =====================================================================

import { BuildMode, Chip, Origin } from "./miroBuild";

export interface RunStep {
  n: 1 | 2 | 3 | 4;
  name: string;
  oneLiner: string;
}

export const RUN_STEPS: RunStep[] = [
  { n: 1, name: "Run & maintain", oneLiner: "Keep it running, within budget" },
  { n: 2, name: "Fix a broken pipeline", oneLiner: "Find the failure and repair it" },
  { n: 3, name: "Add a new feature", oneLiner: "Validate, prioritise, deliver" },
  { n: 4, name: "Ensure the adoption", oneLiner: "Make sure people use it" },
];

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
          "The PO raises the request; the use case request review validates the business case and prioritises it in the roadmap",
          "The function builds the feature, or buys it",
          "Data & AI audits it before it goes live",
        ],
        output: "A prioritised feature, delivered by the function",
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
          "The PO raises the request; the use case request review validates the business case and prioritises it in the roadmap",
          "The shared squad builds it, the hub's part in the Data & AI backlog",
        ],
        output: "A prioritised feature, delivered by the squad",
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
          "The business owner raises the request; the use case request review validates the business case and prioritises it in the roadmap",
          "The hub builds it in the Data & AI backlog; the function tests and validates",
        ],
        output: "A prioritised feature, delivered by the hub",
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

// G6 by mode: what changes at the quarterly validation
export const G6_BY_MODE: Record<BuildMode, string> = {
  "enable-me": "The function's PO presents run cost, ROI and usage; the hub audits.",
  "with-me": "The PO presents with the hub, which reports on the complex part and the data.",
  "for-me": "The business owner presents value and usage; the hub reports run cost and incidents.",
  "self-service": "The value pulse comes with the agents' reports; the hub looks only at what is flagged.",
};

export const G6_REVIEWED = ["Value vs baseline", "Run cost and support", "Risk, post-live", "Adoption by role"];
