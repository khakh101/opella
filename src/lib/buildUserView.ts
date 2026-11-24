// =====================================================================
// Build deep dive, seen from the user (the function).
// What the build asks of the user in each mode, step by step.
// Derived from the per-mode build content in miroBuild.ts.
// =====================================================================

import { ModeId } from "./miroLifecycle";

export interface UserBuildView {
  effort: 0 | 1 | 2 | 3; // 0 = nothing to build, 3 = the user's side does most of the work
  effortLabel: string;
  summary: string;
  you: Record<1 | 2 | 3 | 4, string>;
  others: Record<1 | 2 | 3 | 4, string>;
  othersLabel: string;
}

export const USER_BUILD_VIEW: Record<ModeId, UserBuildView> = {
  "for-me": {
    effort: 0,
    effortLabel: "Nothing to build",
    summary:
      "You bring the need and validate the result. Data & AI builds end to end: the function does not need to staff the build.",
    you: {
      1: "Stay the owner of the need. Name a PO only if the use case needs one.",
      2: "Check that the backlog reflects your need and agree the acceptance criteria.",
      3: "Nothing: the Data & AI squad builds the MVP.",
      4: "Your target users test the MVP; the business owner validates each user story.",
    },
    othersLabel: "Data & AI does",
    others: {
      1: "A digital PO leads the squad side.",
      2: "Writes the backlog and the user stories from the approved business case.",
      3: "Builds the MVP end to end on governed data, with a business architect in the squad.",
      4: "Runs the technical and performance tests.",
    },
  },
  "with-me": {
    effort: 2,
    effortLabel: "Some work: a shared build",
    summary:
      "You lead and build what your function can handle. Data & AI builds the complex scope and the data, in one shared squad.",
    you: {
      1: "Name the PO in your function and staff the shared squad with your engineers.",
      2: "Bring the business rules; your PO sets the acceptance criteria and the definition of done.",
      3: "Your engineers build the part the function can handle.",
      4: "Your business testers test the MVP; your PO validates each user story.",
    },
    othersLabel: "Data & AI does",
    others: {
      1: "A digital PO joins; Data & AI engineers join the squad, plus an external consultant if a skill is missing.",
      2: "Brings the technical specs.",
      3: "Builds the complex scope and the data, on governed data products.",
      4: "Runs the technical and performance tests.",
    },
  },
  "enable-me": {
    effort: 3,
    effortLabel: "Most of the work: the function builds",
    summary:
      "Your function builds, or buys a product. Data & AI supervises and audits; it does not do the deep work.",
    you: {
      1: "Name your PO; the AI catalyst hands the framed need over.",
      2: "Your PO and AI builder write and prioritise the backlog and the user stories.",
      3: "Your AI builder and engineers build the MVP on governed low-code or agent platforms, or configure a provider's product.",
      4: "Your business testers test the MVP; your PO validates each user story.",
    },
    othersLabel: "Data & AI does",
    others: {
      1: "A digital PO joins, per use case.",
      2: "Is consulted only on specific questions.",
      3: "Supervises, audits and solves specific problems; needs beyond low-code are escalated to the hub.",
      4: "Audits the build before it leaves this step: quality, data and platform fit.",
    },
  },
  "self-service": {
    effort: 3,
    effortLabel: "You build it alone",
    summary:
      "You build it yourself with an approved tool. Two agents watch the build: audit and monitoring, and token control.",
    you: {
      1: "Own the assistant end to end.",
      2: "List what the assistant should do as a few user stories, with what good looks like.",
      3: "Configure an approved tool in the builder sandbox: low or no code, approved or synthetic data.",
      4: "Test it against your user stories, then register it: one line in the AI registry.",
    },
    othersLabel: "The agents do",
    others: {
      1: "Nothing yet: the use case was approved at framing.",
      2: "Nothing.",
      3: "The token control agent tracks usage and cost; the audit agent checks data access, prompts and guardrails.",
      4: "The audit and monitoring agent runs its automated checks.",
    },
  },
};
