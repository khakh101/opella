// Generated from the operating model source (role pages, committee matrix, Gentiane's questions).
// Same content as the validated canvas mockup of 25 Nov 2026. Edit the source model, then regenerate.

export type TierId = "T1" | "T2" | "T3";
export type AnyTier = TierId | "SS";
export type RoleId = "TO" | "VO" | "PC" | "DA" | "LEX" | "AL";
export type StageId = "G1" | "G2" | "G3" | "G4" | "Build" | "G5" | "Scale" | "G6";
export type Kind = "v" | "w" | "c" | "i" | "n";
export type MeetingCode = "D" | "P" | "A" | "W" | "I";
export type TabId = "overview" | "user" | "support" | "cockpit";

export interface SupportRole {
  id: RoleId; name: string; full: string; blurb: string; mission: string;
  stages: Record<StageId, Record<TierId, [Kind, string, string]>>;
  decide: string[]; produce: string[]; modes: [string, string, string]; ss: [Kind, string];
}
export interface Meeting {
  id: string; name: string; cadence: string; status: string; tiers: string; note: string; others: string;
  cells: Partial<Record<string, Partial<Record<TierId, Partial<Record<RoleId, [MeetingCode, string]>>>>>>;
}
export interface NavTarget { tab: TabId; anchor?: string; gate?: string; screen?: "role" | "tier" | "sheet"; role?: RoleId; tier?: AnyTier }
export interface GentianeQuestion { text: string; s: "a" | "p" | "o"; answer: string; where: string; target: NavTarget | null }
export interface QuestionCategory { title: string; qs: GentianeQuestion[] }
export interface GateDef {
  id: string; name: string; phase: string; type: string; human: boolean; decision: string;
  approver: string; forum: string; sla: string; criteria: [string, string][]; who: [string, string][];
}

const MODEL = {
 "roles": [
  {
   "id": "TO",
   "name": "TO",
   "full": "Transformation Office",
   "blurb": "Runs the front door, the forums and the portfolio.",
   "mission": "You run the front door and the forums, and you take the go or no-go at most gates.",
   "stages": {
    "G1": {
     "T1": [
      "v",
      "Confirm the agent's first triage and the routing. You are the only human check here; the real triage comes after G2.",
      "Agent triage"
     ],
     "T2": [
      "v",
      "Confirm the agent's first triage and the routing. You are the only human check here; the real triage comes after G2.",
      "Agent triage"
     ],
     "T3": [
      "v",
      "Confirm the agent's first triage and the routing. You are the only human check here; the real triage comes after G2.",
      "Agent triage"
     ]
    },
    "G2": {
     "T1": [
      "v",
      "Validate feasibility: full business case, technical feasibility, tier confirmed. The stream meeting pre-approves before SteerCo.",
      "Stream lead, Value officer, Data & AI, LEX (ORAI)"
     ],
     "T2": [
      "v",
      "Validate feasibility and confirm T2 rather than T3 at the AI Portfolio Board.",
      "Value officer, Data & AI, LEX (ORAI)"
     ],
     "T3": [
      "v",
      "Validate the one-page canvas within 10 days and confirm the fast lane.",
      "Value officer, Data & AI, LEX (ORAI)"
     ]
    },
    "G3": {
     "T1": [
      "v",
      "Present the bet at SteerCo, which approves its entry and funding.",
      "SteerCo members, business owner, Data & AI"
     ],
     "T2": [
      "v",
      "Place the initiative in the enterprise backlog against value, fit and hub capacity.",
      "AI Portfolio Board, Data & AI"
     ],
     "T3": [
      "v",
      "First pass of the fast lane at the board: yes or no.",
      "AI Portfolio Board, Data & AI"
     ]
    },
    "G4": {
     "T1": [
      "i",
      "Informed of the mode, make-or-buy and the budget release. Data & AI decides at the Design Authority.",
      "Data & AI"
     ],
     "T2": [
      "i",
      "Informed of the mode, make-or-buy and the budget release. Data & AI decides at the Design Authority.",
      "Data & AI"
     ],
     "T3": [
      "i",
      "Informed of the mode, make-or-buy and the budget release. Data & AI decides at the Design Authority.",
      "Data & AI"
     ]
    },
    "Build": {
     "T1": [
      "w",
      "Follow progress in the monthly stream RAG and handle escalations at the weekly Portfolio board.",
      "Stream lead, Data & AI, Adoption lead"
     ],
     "T2": [
      "c",
      "Follow progress; step in on escalations only.",
      "Data & AI"
     ],
     "T3": [
      "w",
      "Run the 6 to 8 week MVP follow-up at the board.",
      "Data & AI, requester"
     ]
    },
    "G5": {
     "T1": [
      "v",
      "Pre-approve at the stream meeting, then take the scale decision to SteerCo.",
      "SteerCo, Value officer, P&C, LEX (ORAI), Adoption lead"
     ],
     "T2": [
      "v",
      "Prepare the recommendation at the AI Portfolio Board; Program Sponsors (CDO and CFO) approve.",
      "Program Sponsors, Value officer, P&C, LEX (ORAI), Adoption lead"
     ],
     "T3": [
      "v",
      "Scale or stop at the AI Portfolio Board, after the T2 assessment back in Framing.",
      "Value officer, P&C, LEX (ORAI), Adoption lead"
     ]
    },
    "Scale": {
     "T1": [
      "c",
      "Track the roll-out and adoption with the function.",
      "Adoption lead, function"
     ],
     "T2": [
      "c",
      "Track the roll-out and adoption with the function.",
      "Adoption lead, function"
     ],
     "T3": [
      "c",
      "Track the roll-out and adoption with the function.",
      "Adoption lead, function"
     ]
    },
    "G6": {
     "T1": [
      "v",
      "Decide: continue, scale, re-scope or stop.",
      "Value officer, Data & AI, Adoption lead"
     ],
     "T2": [
      "v",
      "Decide: continue, scale, re-scope or stop.",
      "Value officer, Data & AI, Adoption lead"
     ],
     "T3": [
      "v",
      "Decide: continue, scale, re-scope or stop.",
      "Value officer, Data & AI, Adoption lead"
     ]
    }
   },
   "decide": [
    "The routing after the agent triage (G1)",
    "Feasibility and priority (G2, G3)",
    "The scale decision and continue or stop (G5, G6)"
   ],
   "produce": [
    "Forum agendas and decisions",
    "The enterprise backlog and portfolio view",
    "Escalations to SteerCo"
   ],
   "modes": [
    "The mode changes little for your role.",
    "The mode changes little for your role.",
    "The mode changes little for your role."
   ],
   "ss": [
    "v",
    "Confirm the self-serve routing at G1. Then you only see the registry line and the quarterly value pulse."
   ]
  },
  {
   "id": "VO",
   "name": "Value officer",
   "full": "Value officer",
   "blurb": "Keeps the baseline, tracks value, calls retirement.",
   "mission": "You keep the value honest, from the first baseline to the value ledger. Finance referees.",
   "stages": {
    "G1": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G2": {
     "T1": [
      "w",
      "Build the value baseline of the full business case and how value will be measured. Finance validates.",
      "Finance BP, requester"
     ],
     "T2": [
      "w",
      "Build the value range of the business case. Finance validates.",
      "Finance BP, requester"
     ],
     "T3": [
      "c",
      "Check the value hypothesis on the one-page canvas.",
      "Requester"
     ]
    },
    "G3": {
     "T1": [
      "c",
      "Provide the value score used in the prioritisation formula (30% value).",
      "TO, AI Portfolio Board"
     ],
     "T2": [
      "c",
      "Provide the value score used in the prioritisation formula (30% value).",
      "TO, AI Portfolio Board"
     ],
     "T3": [
      "c",
      "Provide the value score used in the prioritisation formula (30% value).",
      "TO, AI Portfolio Board"
     ]
    },
    "G4": {
     "T1": [
      "c",
      "Check that funding follows the lane: full business case, tranches or sprint envelope.",
      "Data & AI, TO"
     ],
     "T2": [
      "c",
      "Check that funding follows the lane: full business case, tranches or sprint envelope.",
      "Data & AI, TO"
     ],
     "T3": [
      "c",
      "Check that funding follows the lane: full business case, tranches or sprint envelope.",
      "Data & AI, TO"
     ]
    },
    "Build": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G5": {
     "T1": [
      "v",
      "Confirm the pilot KPIs against the baseline and the revised value range.",
      "Finance BP, TO, business owner"
     ],
     "T2": [
      "v",
      "Write the light business case and confirm the pilot KPIs against the baseline.",
      "Finance BP, TO, business owner"
     ],
     "T3": [
      "v",
      "Confirm the MVP KPIs against the value hypothesis.",
      "TO, business owner"
     ]
    },
    "Scale": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G6": {
     "T1": [
      "v",
      "Confirm realised value against the baseline in the value ledger, at 6 and 12 months. Call retirement when value fades.",
      "Finance BP, TO"
     ],
     "T2": [
      "v",
      "Confirm realised value against the baseline in the value ledger, at 6 and 12 months. Call retirement when value fades.",
      "Finance BP, TO"
     ],
     "T3": [
      "v",
      "Confirm realised value against the baseline in the value ledger, at 6 and 12 months. Call retirement when value fades.",
      "Finance BP, TO"
     ]
    }
   },
   "decide": [
    "Whether the baseline is credible, with Finance (G2)",
    "Pilot KPIs against the baseline (G5)",
    "Realised value and retirement (G6)"
   ],
   "produce": [
    "Value baseline and measurement method",
    "Value score for prioritisation",
    "Value ledger and reviews at 6 and 12 months"
   ],
   "modes": [
    "The mode changes little for your role.",
    "The mode changes little for your role.",
    "The mode changes little for your role."
   ],
   "ss": [
    "c",
    "You read the quarterly value pulse from the registry."
   ]
  },
  {
   "id": "PC",
   "name": "P&C counterpart",
   "full": "P&C counterpart",
   "blurb": "Assesses the people impact: jobs, skills, workforce.",
   "mission": "You assess what the use case changes for jobs, skills and the workforce, and prepare the people side.",
   "stages": {
    "G1": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G2": {
     "T1": [
      "w",
      "Run the full Change Impact Assessment: affected jobs, user count, skills, process redesign yes or no.",
      "Requester, Adoption lead"
     ],
     "T2": [
      "w",
      "Run the full Change Impact Assessment: affected jobs, user count, skills, process redesign yes or no.",
      "Requester, Adoption lead"
     ],
     "T3": [
      "w",
      "Run a light impact scan: affected jobs and user count.",
      "Requester"
     ]
    },
    "G3": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G4": {
     "T1": [
      "i",
      "Informed: your assessment from G2 shapes the squad and the plan.",
      "Data & AI"
     ],
     "T2": [
      "i",
      "Informed: your assessment from G2 shapes the squad and the plan.",
      "Data & AI"
     ],
     "T3": [
      "i",
      "Informed: your assessment from G2 shapes the squad and the plan.",
      "Data & AI"
     ]
    },
    "Build": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G5": {
     "T1": [
      "v",
      "Validate the revised assessment and the HR workforce impact before scaling.",
      "TO, Adoption lead"
     ],
     "T2": [
      "v",
      "Validate the revised assessment and the HR workforce impact before scaling.",
      "TO, Adoption lead"
     ],
     "T3": [
      "v",
      "Validate the revised assessment and the HR workforce impact before scaling.",
      "TO, Adoption lead"
     ]
    },
    "Scale": {
     "T1": [
      "w",
      "Support upskilling, role changes and social dialogue.",
      "Adoption lead, function"
     ],
     "T2": [
      "w",
      "Support upskilling, role changes and social dialogue.",
      "Adoption lead, function"
     ],
     "T3": [
      "w",
      "Support upskilling, role changes and social dialogue.",
      "Adoption lead, function"
     ]
    },
    "G6": {
     "T1": [
      "c",
      "Consulted on the people side when adoption lags.",
      "TO, Adoption lead"
     ],
     "T2": [
      "c",
      "Consulted on the people side when adoption lags.",
      "TO, Adoption lead"
     ],
     "T3": [
      "c",
      "Consulted on the people side when adoption lags.",
      "TO, Adoption lead"
     ]
    }
   },
   "decide": [
    "Whether the workforce impact is acceptable to scale (G5)"
   ],
   "produce": [
    "Change Impact Assessment (G2)",
    "HR workforce impact assessment (G5)",
    "Upskilling and social dialogue inputs (Scale)"
   ],
   "modes": [
    "The mode changes little for your role.",
    "The mode changes little for your role.",
    "The mode changes little for your role."
   ],
   "ss": [
    "n",
    "Not involved in the self-serve path."
   ]
  },
  {
   "id": "DA",
   "name": "Data & AI",
   "full": "Data & AI",
   "blurb": "Platform, standards and builders: readiness, build, run.",
   "mission": "You check readiness, lock the mode and the architecture, then build, scale and run.",
   "stages": {
    "G1": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G2": {
     "T1": [
      "v",
      "Assess tech and data readiness and flag foundation gaps at the Design Authority.",
      "Design Authority, requester"
     ],
     "T2": [
      "v",
      "Assess tech and data readiness and flag foundation gaps at the Design Authority.",
      "Design Authority, requester"
     ],
     "T3": [
      "v",
      "Assess tech and data readiness and flag foundation gaps at the Design Authority.",
      "Design Authority, requester"
     ]
    },
    "G3": {
     "T1": [
      "c",
      "Confirm hub capacity in the quarterly plan.",
      "TO, AI Portfolio Board"
     ],
     "T2": [
      "c",
      "Confirm hub capacity in the quarterly plan.",
      "TO, AI Portfolio Board"
     ],
     "T3": [
      "c",
      "Confirm hub capacity in the quarterly plan.",
      "TO, AI Portfolio Board"
     ]
    },
    "G4": {
     "T1": [
      "v",
      "Lock the mode, make-or-buy, architecture and squad, then release the build budget.",
      "Design Authority, tier approver"
     ],
     "T2": [
      "v",
      "Lock the mode, make-or-buy, architecture and squad, then release the build budget.",
      "Design Authority, tier approver"
     ],
     "T3": [
      "v",
      "Lock the mode, make-or-buy, architecture and squad, then release the build budget.",
      "Design Authority, tier approver"
     ]
    },
    "Build": {
     "T1": [
      "w",
      "Build the MVP with pooled engineers and data scientists. Your effort depends on the mode.",
      "Requester, AI builders"
     ],
     "T2": [
      "w",
      "Build the MVP with pooled engineers and data scientists. Your effort depends on the mode.",
      "Requester, AI builders"
     ],
     "T3": [
      "w",
      "Build the MVP with pooled engineers and data scientists. Your effort depends on the mode.",
      "Requester, AI builders"
     ]
    },
    "G5": {
     "T1": [
      "w",
      "Bring the actual build cost and the scale architecture for sign-off. Name the run owner.",
      "TO, Design Authority"
     ],
     "T2": [
      "w",
      "Bring the actual build cost and the scale architecture for sign-off. Name the run owner.",
      "TO, Design Authority"
     ],
     "T3": [
      "w",
      "Bring the actual build cost and the scale architecture for sign-off. Name the run owner.",
      "TO, Design Authority"
     ]
    },
    "Scale": {
     "T1": [
      "w",
      "Deploy and document; train the users with the Adoption lead.",
      "Adoption lead, function"
     ],
     "T2": [
      "w",
      "Deploy and document; train the users with the Adoption lead.",
      "Adoption lead, function"
     ],
     "T3": [
      "w",
      "Deploy and document; train the users with the Adoption lead.",
      "Adoption lead, function"
     ]
    },
    "G6": {
     "T1": [
      "w",
      "Run and maintain: token cost, infrastructure, model drift and bugs.",
      "Run owner, Value officer"
     ],
     "T2": [
      "w",
      "Run and maintain: token cost, infrastructure, model drift and bugs.",
      "Run owner, Value officer"
     ],
     "T3": [
      "w",
      "Run and maintain: token cost, infrastructure, model drift and bugs.",
      "Run owner, Value officer"
     ]
    }
   },
   "decide": [
    "Tech and data readiness (G2)",
    "Mode, make-or-buy, architecture and budget release (G4)"
   ],
   "produce": [
    "Architecture decision record",
    "Squad and tech sizing",
    "The MVP, the deployment and the run set-up"
   ],
   "modes": [
    "You build and run it. The function frames the need and tests the result.",
    "You build it with the function's AI builder; the work is shared.",
    "You enable: platform, standards and coaching. The function builds."
   ],
   "ss": [
    "c",
    "The Design Authority checks the fit of a new tool, only when one is evaluated."
   ]
  },
  {
   "id": "LEX",
   "name": "LEX (ORAI)",
   "full": "LEX, responsible-AI review (OR.AI)",
   "blurb": "Legal and responsible-AI review, based on risk.",
   "mission": "You review legal and responsible-AI risk. The depth of your review follows the OR.AI risk tier.",
   "stages": {
    "G1": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G2": {
     "T1": [
      "v",
      "Risk triage: confirm the OR.AI tier and set the pre-build conditions. Low: standard guardrails. Medium: light review in 5 days. High: full review before real data.",
      "Legal counsel or DPO, Data & AI"
     ],
     "T2": [
      "v",
      "Risk triage: confirm the OR.AI tier and set the pre-build conditions. Low: standard guardrails. Medium: light review in 5 days. High: full review before real data.",
      "Legal counsel or DPO, Data & AI"
     ],
     "T3": [
      "v",
      "Risk triage: confirm the OR.AI tier and set the pre-build conditions. Low: standard guardrails. Medium: light review in 5 days. High: full review before real data.",
      "Legal counsel or DPO, Data & AI"
     ]
    },
    "G3": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G4": {
     "T1": [
      "c",
      "Your guardrails are locked into the build plan at the Design Authority.",
      "Data & AI"
     ],
     "T2": [
      "c",
      "Your guardrails are locked into the build plan at the Design Authority.",
      "Data & AI"
     ],
     "T3": [
      "c",
      "Your guardrails are locked into the build plan at the Design Authority.",
      "Data & AI"
     ]
    },
    "Build": {
     "T1": [
      "c",
      "Answer guardrail questions. High risk: full review before any real data.",
      "Data & AI, requester"
     ],
     "T2": [
      "c",
      "Answer guardrail questions. High risk: full review before any real data.",
      "Data & AI, requester"
     ],
     "T3": [
      "c",
      "Answer guardrail questions. High risk: full review before any real data.",
      "Data & AI, requester"
     ]
    },
    "G5": {
     "T1": [
      "v",
      "Secondary review: clear, with conditions, or blocked.",
      "TO, Data & AI"
     ],
     "T2": [
      "v",
      "Secondary review: clear, with conditions, or blocked.",
      "TO, Data & AI"
     ],
     "T3": [
      "v",
      "Secondary review: clear, with conditions, or blocked.",
      "TO, Data & AI"
     ]
    },
    "Scale": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G6": {
     "T1": [
      "w",
      "Monitor risk and compliance after go-live; check for a tier change.",
      "Run owner, TO"
     ],
     "T2": [
      "w",
      "Monitor risk and compliance after go-live; check for a tier change.",
      "Run owner, TO"
     ],
     "T3": [
      "w",
      "Monitor risk and compliance after go-live; check for a tier change.",
      "Run owner, TO"
     ]
    }
   },
   "decide": [
    "OR.AI tier and pre-build conditions (G2)",
    "Clear, with conditions, or blocked before scale (G5)"
   ],
   "produce": [
    "Risk triage outcome",
    "Secondary review decision",
    "Post-live compliance checks"
   ],
   "modes": [
    "The mode changes little for your role.",
    "The mode changes little for your role.",
    "The mode changes little for your role."
   ],
   "ss": [
    "c",
    "Standard guardrails apply; agents screen and monitor each request."
   ]
  },
  {
   "id": "AL",
   "name": "Adoption lead",
   "full": "Change and adoption lead",
   "blurb": "Change and adoption plans: nothing goes live without one.",
   "mission": "You make sure people use what is built: no use case goes live without an adoption plan.",
   "stages": {
    "G1": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G2": {
     "T1": [
      "c",
      "Add the adoption angle to the impact assessment: users, sites, adoption risk.",
      "P&C counterpart, requester"
     ],
     "T2": [
      "c",
      "Add the adoption angle to the impact assessment: users, sites, adoption risk.",
      "P&C counterpart, requester"
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G3": {
     "T1": [
      "n",
      "",
      ""
     ],
     "T2": [
      "n",
      "",
      ""
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "G4": {
     "T1": [
      "c",
      "Agree how adoption will be measured; start the adoption plan.",
      "Data & AI, TO"
     ],
     "T2": [
      "c",
      "Agree how adoption will be measured; start the adoption plan.",
      "Data & AI, TO"
     ],
     "T3": [
      "n",
      "",
      ""
     ]
    },
    "Build": {
     "T1": [
      "w",
      "Build the adoption plan; join the user tests.",
      "Product owner, Data & AI"
     ],
     "T2": [
      "w",
      "Build the adoption plan; join the user tests.",
      "Product owner, Data & AI"
     ],
     "T3": [
      "c",
      "Join the user test of the MVP.",
      "Requester, Data & AI"
     ]
    },
    "G5": {
     "T1": [
      "w",
      "Bring the formal adoption plan; scale is not approved without it.",
      "TO, P&C counterpart"
     ],
     "T2": [
      "w",
      "Bring the formal adoption plan; scale is not approved without it.",
      "TO, P&C counterpart"
     ],
     "T3": [
      "w",
      "Bring the formal adoption plan; scale is not approved without it.",
      "TO, P&C counterpart"
     ]
    },
    "Scale": {
     "T1": [
      "w",
      "Train the users and run the adoption plan.",
      "Data & AI, function"
     ],
     "T2": [
      "w",
      "Train the users and run the adoption plan.",
      "Data & AI, function"
     ],
     "T3": [
      "w",
      "Train the users and run the adoption plan.",
      "Data & AI, function"
     ]
    },
    "G6": {
     "T1": [
      "w",
      "Track active use against target; if it lags, run one relaunch sprint.",
      "TO, Value officer"
     ],
     "T2": [
      "w",
      "Track active use against target; if it lags, run one relaunch sprint.",
      "TO, Value officer"
     ],
     "T3": [
      "w",
      "Track active use against target; if it lags, run one relaunch sprint.",
      "TO, Value officer"
     ]
    }
   },
   "decide": [
    "Whether the adoption plan is ready to scale (you bring it; the TO decides)"
   ],
   "produce": [
    "Adoption measures (G4)",
    "Adoption plan (G5)",
    "Training and adoption tracking (Scale, G6)"
   ],
   "modes": [
    "The hub-led build comes with your adoption plan for the function.",
    "You build the adoption plan together with the function.",
    "The function owns adoption; you coach and provide the playbook."
   ],
   "ss": [
    "n",
    "Not involved: the function owns adoption."
   ]
  }
 ],
 "meetings": [
  {
   "id": "stream",
   "name": "Stream meetings",
   "cadence": "Monthly, one per stream (14)",
   "status": "Exists",
   "tiers": "T1",
   "note": "T2 and T3: no meeting.",
   "others": "Stream lead, business owners and product owners, AI catalysts, Finance BP",
   "cells": {
    "G2": {
     "T1": {
      "TO": [
       "D",
       "Pre-approves the business case before SteerCo"
      ],
      "VO": [
       "P",
       "Presents the baseline"
      ]
     }
    },
    "G5": {
     "T1": {
      "TO": [
       "D",
       "Pre-approves the scale case before SteerCo"
      ],
      "VO": [
       "P",
       "Presents pilot KPIs"
      ]
     }
    },
    "G6": {
     "T1": {
      "TO": [
       "A",
       "Quarterly value review"
      ],
      "VO": [
       "P",
       "Presents realised value"
      ]
     }
    }
   }
  },
  {
   "id": "board",
   "name": "Portfolio board / AI Portfolio Board",
   "cadence": "Weekly for T1, biweekly for T2 and T3",
   "status": "Exists",
   "tiers": "T1 T2 T3",
   "note": "T1: weekly review of escalations from streams, at any gate.",
   "others": "Stream lead, business owners and product owners, AI catalysts, Finance BP. T2: advice to Program Sponsors (CDO and CFO)",
   "cells": {
    "G2": {
     "T2": {
      "TO": [
       "D",
       "Feasibility; T2 or T3"
      ],
      "VO": [
       "P",
       "Value range"
      ]
     },
     "T3": {
      "TO": [
       "D",
       "Validates the canvas in 10 days"
      ],
      "VO": [
       "P",
       "Value hypothesis"
      ]
     }
    },
    "G3": {
     "T2": {
      "TO": [
       "D",
       "Priority and backlog"
      ],
      "VO": [
       "P",
       "Value score"
      ],
      "DA": [
       "A",
       "Hub capacity"
      ]
     },
     "T3": {
      "TO": [
       "D",
       "Yes or no"
      ],
      "VO": [
       "P",
       "Value score"
      ],
      "DA": [
       "A",
       "Hub capacity"
      ]
     }
    },
    "G5": {
     "T2": {
      "TO": [
       "P",
       "Recommends; Sponsors approve"
      ],
      "VO": [
       "P",
       "Pilot KPIs"
      ],
      "PC": [
       "P",
       "Workforce impact"
      ],
      "LEX": [
       "P",
       "Secondary review"
      ],
      "AL": [
       "P",
       "Adoption plan"
      ]
     },
     "T3": {
      "TO": [
       "D",
       "Scale or stop"
      ],
      "VO": [
       "P",
       "MVP KPIs"
      ],
      "PC": [
       "P",
       "Workforce impact"
      ],
      "LEX": [
       "P",
       "Secondary review"
      ],
      "AL": [
       "P",
       "Adoption plan"
      ]
     }
    },
    "G6": {
     "T2": {
      "TO": [
       "D",
       "Continue or stop"
      ],
      "VO": [
       "P",
       "Realised value"
      ],
      "AL": [
       "P",
       "Active use"
      ]
     },
     "T3": {
      "TO": [
       "D",
       "Continue or stop"
      ],
      "VO": [
       "P",
       "Realised value"
      ],
      "AL": [
       "P",
       "Active use"
      ]
     }
    }
   }
  },
  {
   "id": "steerco",
   "name": "SteerCo",
   "cadence": "Monthly",
   "status": "Exists",
   "tiers": "T1 T2",
   "note": "T2: informed only (pipeline and value summary). T3: no meeting.",
   "others": "Leads of the streams concerned, TO lead, business owners of the bets, Data & AI",
   "cells": {
    "G3": {
     "T1": {
      "TO": [
       "P",
       "Presents the bet; SteerCo approves entry and funding"
      ],
      "DA": [
       "A",
       "Capacity and foundations"
      ]
     },
     "T2": {
      "TO": [
       "P",
       "Pipeline summary, informed only"
      ]
     }
    },
    "G5": {
     "T1": {
      "TO": [
       "P",
       "Presents the scale case; SteerCo decides"
      ],
      "VO": [
       "P",
       "Value vs baseline"
      ],
      "PC": [
       "P",
       "Workforce impact"
      ],
      "LEX": [
       "P",
       "Risk review"
      ],
      "AL": [
       "P",
       "Adoption plan"
      ],
      "DA": [
       "A",
       "Scale architecture"
      ]
     }
    },
    "G6": {
     "T1": {
      "TO": [
       "P",
       "Value vs baseline, risks"
      ],
      "DA": [
       "A",
       "Run status"
      ]
     },
     "T2": {
      "TO": [
       "P",
       "Value summary, informed only"
      ]
     }
    }
   }
  },
  {
   "id": "cross",
   "name": "AmplifAI cross stream meeting",
   "cadence": "Monthly (proposal, new)",
   "status": "New",
   "tiers": "T1",
   "note": "Only for bets spanning several streams. T2 and T3: no meeting.",
   "others": "Program Sponsors (CDO and CFO), C-level bet sponsors, Head of Transformation Program",
   "cells": {
    "G3": {
     "T1": {
      "TO": [
       "P",
       "One decision for a multi-stream bet"
      ]
     }
    }
   }
  },
  {
   "id": "da",
   "name": "Design Authority",
   "cadence": "Weekly",
   "status": "Exists",
   "tiers": "T1 T2 T3",
   "note": "Self-serve: only checks a new tool.",
   "others": "Architects, lead tech (participants to confirm)",
   "cells": {
    "G2": {
     "T1": {
      "DA": [
       "D",
       "Tech and data readiness"
      ]
     },
     "T2": {
      "DA": [
       "D",
       "Tech and data readiness"
      ]
     },
     "T3": {
      "DA": [
       "D",
       "Tech and data readiness"
      ]
     }
    },
    "G4": {
     "T1": {
      "DA": [
       "D",
       "Mode, make-or-buy, architecture, budget"
      ],
      "TO": [
       "I",
       "Informed"
      ],
      "LEX": [
       "A",
       "Guardrails locked"
      ],
      "VO": [
       "A",
       "Funding lane"
      ],
      "AL": [
       "A",
       "Adoption measures"
      ]
     },
     "T2": {
      "DA": [
       "D",
       "Mode, make-or-buy, architecture, budget"
      ],
      "TO": [
       "I",
       "Informed"
      ],
      "LEX": [
       "A",
       "Guardrails locked"
      ],
      "VO": [
       "A",
       "Funding lane"
      ],
      "AL": [
       "A",
       "Adoption measures"
      ]
     },
     "T3": {
      "DA": [
       "D",
       "Mode, make-or-buy, architecture, budget"
      ],
      "TO": [
       "I",
       "Informed"
      ],
      "LEX": [
       "A",
       "Guardrails locked"
      ],
      "VO": [
       "A",
       "Funding lane"
      ]
     }
    },
    "G5": {
     "T1": {
      "DA": [
       "D",
       "Scale architecture sign-off"
      ]
     },
     "T2": {
      "DA": [
       "D",
       "Scale architecture sign-off"
      ]
     },
     "T3": {
      "DA": [
       "D",
       "Scale architecture sign-off"
      ]
     }
    }
   }
  },
  {
   "id": "offline",
   "name": "Outside meetings",
   "cadence": "Reviews and deliverables done between meetings",
   "status": "No meeting",
   "tiers": "T1 T2 T3",
   "note": "Work that feeds the meetings above.",
   "others": "Agent, requester, Finance BP, Legal counsel or DPO",
   "cells": {
    "G1": {
     "T1": {
      "TO": [
       "D",
       "Confirms the agent's routing"
      ]
     },
     "T2": {
      "TO": [
       "D",
       "Confirms the agent's routing"
      ]
     },
     "T3": {
      "TO": [
       "D",
       "Confirms the agent's routing"
      ]
     }
    },
    "G3": {
     "T1": {
      "VO": [
       "W",
       "Value score for SteerCo"
      ]
     }
    },
    "G4": {
     "T1": {
      "PC": [
       "I",
       "Impact assessment shapes the squad"
      ]
     },
     "T2": {
      "PC": [
       "I",
       "Impact assessment shapes the squad"
      ]
     },
     "T3": {
      "PC": [
       "I",
       "Impact assessment shapes the squad"
      ]
     }
    },
    "G2": {
     "T1": {
      "VO": [
       "W",
       "Baseline"
      ],
      "PC": [
       "W",
       "Change Impact Assessment"
      ],
      "LEX": [
       "D",
       "Risk triage, conditions"
      ],
      "AL": [
       "W",
       "Adoption angle"
      ]
     },
     "T2": {
      "VO": [
       "W",
       "Baseline"
      ],
      "PC": [
       "W",
       "Change Impact Assessment"
      ],
      "LEX": [
       "D",
       "Risk triage, conditions"
      ],
      "AL": [
       "W",
       "Adoption angle"
      ]
     },
     "T3": {
      "VO": [
       "W",
       "Value hypothesis check"
      ],
      "PC": [
       "W",
       "Light impact scan"
      ],
      "LEX": [
       "D",
       "Risk triage, conditions"
      ]
     }
    },
    "G5": {
     "T1": {
      "PC": [
       "D",
       "Workforce impact"
      ],
      "LEX": [
       "D",
       "Secondary review"
      ],
      "AL": [
       "W",
       "Adoption plan"
      ],
      "DA": [
       "W",
       "Build cost, run owner"
      ],
      "VO": [
       "D",
       "Pilot KPIs"
      ]
     },
     "T2": {
      "PC": [
       "D",
       "Workforce impact"
      ],
      "LEX": [
       "D",
       "Secondary review"
      ],
      "AL": [
       "W",
       "Adoption plan"
      ],
      "DA": [
       "W",
       "Build cost, run owner"
      ],
      "VO": [
       "D",
       "Pilot KPIs"
      ]
     },
     "T3": {
      "PC": [
       "D",
       "Workforce impact"
      ],
      "LEX": [
       "D",
       "Secondary review"
      ],
      "AL": [
       "W",
       "Adoption plan"
      ],
      "DA": [
       "W",
       "Build cost, run owner"
      ],
      "VO": [
       "D",
       "Pilot KPIs"
      ]
     }
    },
    "G6": {
     "T1": {
      "VO": [
       "D",
       "Realised value, retirement"
      ],
      "LEX": [
       "W",
       "Compliance monitoring"
      ],
      "AL": [
       "W",
       "Adoption tracking"
      ],
      "DA": [
       "W",
       "Run and maintain"
      ],
      "PC": [
       "A",
       "People side if adoption lags"
      ]
     },
     "T2": {
      "VO": [
       "D",
       "Realised value, retirement"
      ],
      "LEX": [
       "W",
       "Compliance monitoring"
      ],
      "AL": [
       "W",
       "Adoption tracking"
      ],
      "DA": [
       "W",
       "Run and maintain"
      ],
      "PC": [
       "A",
       "People side if adoption lags"
      ]
     },
     "T3": {
      "VO": [
       "D",
       "Realised value, retirement"
      ],
      "LEX": [
       "W",
       "Compliance monitoring"
      ],
      "AL": [
       "W",
       "Adoption tracking"
      ],
      "DA": [
       "W",
       "Run and maintain"
      ],
      "PC": [
       "A",
       "People side if adoption lags"
      ]
     }
    }
   }
  }
 ],
 "forum": {
  "G1": {
   "T1": "No meeting (agent)",
   "T2": "No meeting (agent)",
   "T3": "No meeting (agent)"
  },
  "G2": {
   "T1": "Stream meeting (monthly), Design Authority",
   "T2": "AI Portfolio Board (biweekly), Design Authority",
   "T3": "AI Portfolio Board (biweekly, within 10 days)"
  },
  "G3": {
   "T1": "SteerCo (monthly)",
   "T2": "AI Portfolio Board (biweekly)",
   "T3": "AI Portfolio Board (biweekly)"
  },
  "G4": {
   "T1": "Design Authority (weekly, 5 days)",
   "T2": "Design Authority (weekly, 5 days)",
   "T3": "Design Authority (weekly, 5 days)"
  },
  "Build": {
   "T1": "Stream meeting (monthly RAG), Portfolio board (weekly)",
   "T2": "No meeting",
   "T3": "AI Portfolio Board (MVP follow-up)"
  },
  "G5": {
   "T1": "Stream meeting, then SteerCo",
   "T2": "AI Portfolio Board, Program Sponsors approve",
   "T3": "AI Portfolio Board (scale or stop)"
  },
  "Scale": {
   "T1": "Stream meeting (monthly RAG)",
   "T2": "No meeting",
   "T3": "No meeting"
  },
  "G6": {
   "T1": "Stream meeting (quarterly value), SteerCo",
   "T2": "AI Portfolio Board",
   "T3": "AI Portfolio Board"
  }
 }
} as unknown as { roles: SupportRole[]; meetings: Meeting[]; forum: Record<StageId, Record<TierId, string>> };

export const SUPPORT_ROLES = MODEL.roles;
export const MEETINGS = MODEL.meetings;
export const FORUM = MODEL.forum;

export const GENTIANE_QUESTIONS: QuestionCategory[] = [
 {
  "title": "Intake: what comes into AmplifAI, and what happens to the rest",
  "qs": [
   {
    "text": "How do we govern incoming AI initiatives?",
    "s": "a",
    "answer": "One charter, an agent triage at G1, then the 6 gates.",
    "where": "Tab 2 · the 4 steps",
    "target": {
     "tab": "user"
    }
   },
   {
    "text": "Do we have one entry point for the business, so people don't have to work out whether to go to AmplifAI, OR.AI or their function?",
    "s": "p",
    "answer": "One charter carries the value case and the OR.AI risk self-assessment. Open: how it merges with the Digital (SIMPLE) intake and Butterfly, so there is one intake for all projects.",
    "where": "Tab 2 · step 1",
    "target": {
     "tab": "user"
    }
   },
   {
    "text": "What sends an initiative to AmplifAI governance (size, impact, maturity, cross-functional or global reach, number of users)? We need a simple decision tree that people can apply themselves.",
    "s": "a",
    "answer": "The three tier questions: big bet or more than €1m; approved tools under €50k; pilot proven with reach.",
    "where": "Tab 3 · the tier questions",
    "target": {
     "tab": "support",
     "screen": "tier",
     "role": "TO"
    }
   },
   {
    "text": "What happens to initiatives that don't meet the threshold? Who owns them (the function, the TO, Digital)? How do they stay visible so we can still track their value? What do we agree stays in the function's own tracking?",
    "s": "p",
    "answer": "Self-serve: the function owns it, one registry line, a quarterly value pulse. Open: what stays only in the function's own tracking.",
    "where": "Tab 3 · self-serve one-pager",
    "target": {
     "tab": "support",
     "screen": "sheet",
     "role": "TO",
     "tier": "SS"
    }
   },
   {
    "text": "How do we handle edge cases like AI modules added to SaaS tools we already have (for example Workday), Copilot agents, and the flow of ideas and pilots from the MS.AI factory?",
    "s": "o",
    "answer": "No rule yet for SaaS AI modules, Copilot agents or the MS.AI factory flow.",
    "where": "",
    "target": null
   }
  ]
 },
 {
  "title": "Prioritisation of initiatives outside the big bets, and delivery capacity",
  "qs": [
   {
    "text": "The big bets set the enterprise-level priorities. For AI initiatives outside the big bets, how do we decide which ones get enterprise priority and support, and which stay with the functions?",
    "s": "a",
    "answer": "G3 prioritisation formula: 30% value, 20% strategic fit, 20% reach and reuse, risk scored inversely. Self-serve stays with the functions.",
    "where": "Tab 4 · gate G3",
    "target": {
     "tab": "cockpit",
     "gate": "G3"
    }
   },
   {
    "text": "Digital support needs to follow these priorities, and teams already have more requests than they can support well. How do we match the demand we create with delivery capacity, so the intake doesn't turn into a bottleneck?",
    "s": "p",
    "answer": "Quarterly capacity split (60% big bets, 25% fast lane, 15% enablement) and capacity arbitration at the AI Portfolio Board. Open: actual capacity figures.",
    "where": "Tab 4 · gate G3",
    "target": {
     "tab": "cockpit",
     "gate": "G3"
    }
   }
  ]
 },
 {
  "title": "Governance of use cases validated within AmplifAI",
  "qs": [
   {
    "text": "Once a use case is validated, who owns it: the business sponsor, the use case owner, the delivery lead (Digital, Artefact, a partner)? How does this connect to the bet sponsor and owner model we are working on?",
    "s": "p",
    "answer": "One accountable business owner; the run owner is named at G5. Open: the link to the bet sponsor and owner model.",
    "where": "Tab 4 · gate G5",
    "target": {
     "tab": "cockpit",
     "gate": "G5"
    }
   },
   {
    "text": "Which forums steer delivery, and how often (stream steercos, AmplifAI steerco)? What does each one decide, and what gets escalated?",
    "s": "a",
    "answer": "Committee matrix: stream meetings, Portfolio board, SteerCo and the cross stream meeting, by gate and tier. Escalation goes from stream to Portfolio board to SteerCo.",
    "where": "Tab 4 · committee matrix",
    "target": {
     "tab": "cockpit",
     "anchor": "committees"
    }
   },
   {
    "text": "What are the gates after validation (design, pilot, scale, run)? What are the criteria to go ahead, pause or stop a use case?",
    "s": "a",
    "answer": "G4 (mode and budget), G5 (scale) and G6 (run), each with value, complexity, risk and adoption criteria. Pause is not defined as a separate outcome.",
    "where": "Tab 4 · gates G4 to G6",
    "target": {
     "tab": "cockpit",
     "gate": "G4"
    }
   },
   {
    "text": "How are validated use cases funded and staffed? Who decides when they compete for the same Digital or data capacity?",
    "s": "p",
    "answer": "Funding follows the lane at G4; Data & AI composes the squad; the AI Portfolio Board arbitrates capacity. Open: who funds the run.",
    "where": "Tab 4 · gate G4",
    "target": {
     "tab": "cockpit",
     "gate": "G4"
    }
   },
   {
    "text": "What happens when the data or tech foundations are not ready yet? Do we set a cut-off, or start with a version that works without them?",
    "s": "o",
    "answer": "Foundation gaps are flagged at G2, but there is no cut-off rule.",
    "where": "",
    "target": null
   },
   {
    "text": "How do we track value against the business case once the use case is live (baseline, KPIs, link to the value creation plan)? Who signs off that the value was delivered?",
    "s": "p",
    "answer": "The Value officer keeps the baseline and the value ledger; Finance referees; reviews at 6 and 12 months. Open: link to the value creation plan.",
    "where": "Tab 3 · Value officer",
    "target": {
     "tab": "support",
     "screen": "sheet",
     "role": "VO",
     "tier": "T1"
    }
   },
   {
    "text": "Who runs the solution after go-live (support, monitoring, running costs)?",
    "s": "a",
    "answer": "Data & AI runs and maintains; the run owner is named at G5; G6 tracks run cost against value.",
    "where": "Tab 3 · Data & AI",
    "target": {
     "tab": "support",
     "screen": "sheet",
     "role": "DA",
     "tier": "T1"
    }
   }
  ]
 },
 {
  "title": "Experimentation: the sandbox",
  "qs": [
   {
    "text": "Is the sandbox live for experimentation? What is already available, for whom, and under what guardrails?",
    "s": "o",
    "answer": "Not covered. Needs the Data & AI team's documentation.",
    "where": "",
    "target": null
   },
   {
    "text": "How do we communicate and train people on it?",
    "s": "o",
    "answer": "Not covered. The Adoption lead and the AI Academy are candidates.",
    "where": "",
    "target": null
   }
  ]
 },
 {
  "title": "From sandbox to scale",
  "qs": [
   {
    "text": "How do we govern what moves from the sandbox to scale? What are the gates, and who decides at each one?",
    "s": "a",
    "answer": "G5 is the scale gate; who decides depends on the tier.",
    "where": "Tab 4 · gate G5",
    "target": {
     "tab": "cockpit",
     "gate": "G5"
    }
   },
   {
    "text": "How do we govern the requests that come up once people experiment with ODP?",
    "s": "o",
    "answer": "Not covered. The term ODP is not defined in our sources.",
    "where": "",
    "target": null
   },
   {
    "text": "At what point does an experiment need a business case and go into the AmplifAI process?",
    "s": "a",
    "answer": "Above self-serve (approved tools, under €50k): T3 needs a one-page canvas; a proven pilot with reach goes to T2.",
    "where": "Tab 3 · the tier questions",
    "target": {
     "tab": "support",
     "screen": "tier",
     "role": "TO"
    }
   }
  ]
 },
 {
  "title": "Not only big bets: quick value from smaller initiatives",
  "qs": [
   {
    "text": "How do we make sure we don't focus only on big bets, and leave room for smaller initiatives that bring value quickly?",
    "s": "a",
    "answer": "T3 fast lane and self-serve, with 25% of hub capacity kept for the fast lane.",
    "where": "Tab 1 · what it is",
    "target": {
     "tab": "overview",
     "anchor": "what"
    }
   },
   {
    "text": "Can we have a light, fast lane for small and medium initiatives that still tracks value, without the full big bet process?",
    "s": "a",
    "answer": "T3: one-page canvas, 6 to 8 week MVP, the AI Portfolio Board as the only forum, value checked at G5.",
    "where": "Tab 3 · T3 one-pagers",
    "target": {
     "tab": "support",
     "screen": "sheet",
     "role": "TO",
     "tier": "T3"
    }
   }
  ]
 },
 {
  "title": "Sharing and reuse",
  "qs": [
   {
    "text": "How do we share what has been built in the sandbox so others can use it?",
    "s": "o",
    "answer": "Not covered.",
    "where": "",
    "target": null
   },
   {
    "text": "How do we set up and maintain a registry of approved AI solutions and use cases, so we don't assess or build the same thing twice?",
    "s": "p",
    "answer": "Self-serve creates a registry line and reuse weighs 20% at G3. Open: who keeps the registry and who can search it.",
    "where": "Tab 4 · gate G3",
    "target": {
     "tab": "cockpit",
     "gate": "G3"
    }
   }
  ]
 },
 {
  "title": "Link with OR.AI",
  "qs": [
   {
    "text": "Which comes first, the AmplifAI value and priority review or the OR.AI responsible AI assessment? Can we combine them into one intake form, with a short self-assessment that flags only the few high-risk cases for a full review?",
    "s": "a",
    "answer": "Both at once: one charter with the value case and the risk self-assessment. Low risk: standard guardrails; medium: light review in 5 days; high: full review.",
    "where": "Tab 2 · step 1",
    "target": {
     "tab": "user"
    }
   },
   {
    "text": "How do we keep monitoring risk and compliance after go-live, not only at the first gate?",
    "s": "a",
    "answer": "LEX (ORAI) reviews again at G5 and monitors after go-live at G6.",
    "where": "Tab 3 · LEX (ORAI)",
    "target": {
     "tab": "support",
     "screen": "sheet",
     "role": "LEX",
     "tier": "T1"
    }
   }
  ]
 }
];

export const COCKPIT_GATES: GateDef[] = [
      { id: "G1", name: "Need validated", phase: "Framing", type: "Agent", human: false,
        decision: "First triage of the need, made by an agent. Nobody validates except the TO. The real triage comes after G2.",
        approver: "Agent. The TO confirms the routing.", forum: "None", sla: "Instant",
        criteria: [["Value", "Value case from the charter"], ["Risk", "Risk self-assessment sets the OR.AI tier: low, medium or high"], ["Charter", "One form, answered in 5 working days"]],
        who: [["TO", "Confirms the routing"], ["Requester", "Fills the charter"], ["Others", "Not involved"]] },
      { id: "G2", name: "Feasibility", phase: "Framing", type: "Human", human: true,
        decision: "Business case and technical feasibility validated. The tier is confirmed.",
        approver: "Transformation Office, with stream leads, Finance BP, Design Authority and ORAI", forum: "T1: stream meeting. T2 and T3: AI Portfolio Board. Design Authority for tech readiness", sla: "T3: 10 days. T1 and T2: monthly or biweekly cycle",
        criteria: [["Value", "Baseline validated by Finance; benefits broken down by driver"], ["Complexity", "Data and tech readiness, architecture dependencies"], ["Risk", "ORAI triage: tier confirmed, pre-build conditions"], ["Adoption", "Impact scan: affected jobs, users, skills; process redesign yes or no"]],
        who: [["TO", "Validates"], ["Value officer", "Builds the baseline"], ["P&C counterpart", "Runs the impact assessment"], ["Data & AI", "Validates readiness"], ["LEX (ORAI)", "Validates risk and conditions"]] },
      { id: "G3", name: "Priority", phase: "Framing", type: "Human", human: true,
        decision: "Is it a priority across functions? Place it in the enterprise backlog.",
        approver: "Transformation Office, with the TO lead and business sponsors", forum: "AI Portfolio Board. T1: SteerCo", sla: "Fortnightly",
        criteria: [["Value", "Value pool check: 30% value, 20% strategic fit, 20% reach and reuse"], ["Complexity", "Hub capacity in the quarterly plan: 60% big bets, 25% fast lane, 15% enablement"], ["Risk", "Scored inversely, 10% weight"], ["Adoption", "Capacity commitment from the function's business owner"]],
        who: [["TO", "Validates"], ["Value officer", "Consulted on the value score"], ["Data & AI", "Consulted on capacity"]] },
      { id: "G4", name: "Mode and budget: GO BUILD", phase: "Framing", type: "Human", human: true,
        decision: "Mode selected (1, 2 or 3), make-or-buy decided, budget released to start the MVP.",
        approver: "Data & AI: architecture, tech sizing, delivery squad and sourcing", forum: "Design Authority, weekly, plus the tier approver", sla: "Design Authority: 5 days",
        criteria: [["Value", "Funding follows the lane: full business case, tranches or sprint envelope"], ["Complexity", "Mode locked; squad composed"], ["Risk", "Platform fit, security and privacy guardrails locked"], ["Adoption", "Change impact mapped"]],
        who: [["Data & AI", "Validates"], ["TO", "Informed"], ["Value officer", "Consulted on funding"], ["LEX (ORAI)", "Consulted on guardrails"]] },
      { id: "G5", name: "Scale validation", phase: "Pre-scale", type: "Human", human: true,
        decision: "Go or no-go on the MVP results: roll out to broader markets and 500+ users.",
        approver: "Transformation Office. T1: SteerCo. T2: Program Sponsors (CDO and CFO)", forum: "T1: stream meeting, then SteerCo. T2: AI Portfolio Board, Program Sponsors approve. T3: AI Portfolio Board", sla: "End of the MVP; monthly for T1, biweekly for T2 and T3",
        criteria: [["Value", "Pilot KPIs against the baseline; revised value range"], ["Complexity", "Build costs reconciled, scale architecture signed off, run owner named"], ["Risk", "Secondary ORAI review: clear, with conditions, or blocked"], ["Adoption", "Revised impact assessment, adoption plan, HR workforce impact"]],
        who: [["TO", "Validates"], ["Value officer", "Validates pilot KPIs"], ["P&C counterpart", "Validates workforce impact"], ["Data & AI", "Provides cost and architecture"], ["LEX (ORAI)", "Validates risk"]] },
      { id: "G6", name: "Maintain and run", phase: "Run", type: "Human", human: true,
        decision: "Continue, scale, re-scope or stop (retirement or pivot).",
        approver: "Transformation Office, with the Value officer and the business owner", forum: "T1: stream meeting (quarterly value) and SteerCo. T2 and T3: AI Portfolio Board", sla: "Quarterly value review; 6 and 12 months",
        criteria: [["Value", "Realised value against the baseline in the value ledger"], ["Complexity", "Token and infrastructure cost, model drift, bugs"], ["Risk", "Post-live compliance monitoring, tier-change checks"], ["Adoption", "Active use against target; if it lags: one relaunch sprint, then retire"]],
        who: [["TO", "Validates"], ["Value officer", "Validates realised value"], ["Data & AI", "Runs and maintains"], ["LEX (ORAI)", "Monitors compliance"], ["P&C counterpart", "Consulted on the people side"]] }
    ];
