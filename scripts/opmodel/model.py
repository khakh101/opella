"""Single source of truth for Tab 3 (role one-pagers) and Tab 4 (committee matrix).
kind codes on role pages: v = validate, w = do the work, c = consulted, i = informed, n = not involved
kind codes in meetings:   D = decides, P = presents / brings input, A = attends, I = informed, W = works outside meetings
"""
import json

TIERS = ["T1", "T2", "T3"]
STAGES = ["G1", "G2", "G3", "G4", "Build", "G5", "Scale", "G6"]
GATES = ["G1", "G2", "G3", "G4", "G5", "G6"]
ROLE_IDS = ["TO", "VO", "PC", "DA", "LEX", "AL"]

# Forum per stage and tier (shown in the one-pager "Where" column)
FORUM = {
    "G1": {"T1": "No meeting (agent, then TO)", "T2": "No meeting (agent, then TO)", "T3": "No meeting (agent, then TO)"},
    "G2": {"T1": "No meeting: each support function validates its part", "T2": "No meeting: each support function validates its part", "T3": "No meeting: each support function validates its part"},
    "G3": {"T1": "Portfolio board (weekly), then SteerCo (monthly); cross stream meeting if several streams (optional)", "T2": "Portfolio board (biweekly)", "T3": "Portfolio board (biweekly)"},
    "G4": {"T1": "Portfolio board (weekly)", "T2": "Portfolio board (biweekly)", "T3": "Portfolio board (biweekly)"},
    "Build": {"T1": "Stream meeting (monthly RAG), Portfolio board (weekly)", "T2": "No meeting", "T3": "AI Portfolio Board (MVP follow-up)"},
    "G5": {"T1": "Stream meeting, then SteerCo", "T2": "AI Portfolio Board, Program Sponsors approve", "T3": "AI Portfolio Board (scale or stop)"},
    "Scale": {"T1": "Stream meeting (monthly RAG)", "T2": "No meeting", "T3": "No meeting"},
    "G6": {"T1": "Stream meeting (quarterly value), SteerCo", "T2": "AI Portfolio Board", "T3": "AI Portfolio Board"},
}

def same(kind, what, with_):
    return {t: (kind, what, with_) for t in TIERS}

N = same("n", "", "")

ROLES = {
  "TO": {
    "name": "TO", "full": "Transformation Office",
    "blurb": "Runs the front door, the forums and the portfolio.",
    "mission": "You run the front door and the forums, and you take the go or no-go at most gates.",
    "stages": {
      "G1": same("v", "Confirm the agent's first triage and the routing. You are the only human check here; the real triage comes after G2.", "Agent triage"),
      "G2": {t: ("w", "No meeting: check that each support function has validated its part of the business case, then put it on the Portfolio board agenda.", "Value officer, P&C, Adoption lead, LEX (ORAI), Data & AI" if t != "T3" else "Value officer, P&C, LEX (ORAI), Data & AI") for t in TIERS},
      "G3": {"T1": ("v", "Prioritise the bet at the Portfolio board, then present it at SteerCo, which validates it. If it spans several streams, it can also go to the AmplifAI cross stream meeting (optional).", "Portfolio board, SteerCo members, Value officer, Data & AI"),
             "T2": ("v", "Prioritise at the Portfolio board: place the initiative in the enterprise backlog against value, fit and hub capacity.", "Portfolio board, Value officer, Data & AI"),
             "T3": ("v", "Prioritise the fast lane at the Portfolio board: yes or no.", "Portfolio board, Value officer, Data & AI")},
      "G4": {t: ("v", "Validate the mode with Data & AI at the Portfolio board, with the other functions in support.", "Data & AI, Value officer, LEX (ORAI), Adoption lead" if t != "T3" else "Data & AI, Value officer, LEX (ORAI)") for t in TIERS},
      "Build": {"T1": ("w", "Follow progress in the monthly stream RAG and handle escalations at the weekly Portfolio board.", "Stream lead, Data & AI, Adoption lead"),
                "T2": ("c", "Follow progress; step in on escalations only.", "Data & AI"),
                "T3": ("w", "Run the 6 to 8 week MVP follow-up at the board.", "Data & AI, requester")},
      "G5": {"T1": ("v", "Pre-approve at the stream meeting, then take the scale decision to SteerCo.", "SteerCo, Value officer, P&C, LEX (ORAI), Adoption lead"),
             "T2": ("v", "Prepare the recommendation at the AI Portfolio Board; Program Sponsors (CDO and CFO) approve.", "Program Sponsors, Value officer, P&C, LEX (ORAI), Adoption lead"),
             "T3": ("v", "Scale or stop at the AI Portfolio Board, after the T2 assessment back in Framing.", "Value officer, P&C, LEX (ORAI), Adoption lead")},
      "Scale": same("c", "Track the roll-out and adoption with the function.", "Adoption lead, function"),
      "G6": same("v", "Decide: continue, scale, re-scope or stop.", "Value officer, Data & AI, Adoption lead"),
    },
    "decide": ["The routing after the agent triage (G1)", "Priority at the Portfolio board (G3)", "The mode, with Data & AI (G4)", "The scale decision and continue or stop (G5, G6)"],
    "produce": ["Forum agendas and decisions", "The enterprise backlog and portfolio view", "Escalations to SteerCo"],
    "modes": ["The mode changes little for your role.", "The mode changes little for your role.", "The mode changes little for your role."],
    "ss": ("v", "Confirm the self-serve routing at G1. Then you only see the registry line and the quarterly value pulse."),
  },
  "VO": {
    "name": "Value officer", "full": "Value officer",
    "blurb": "Keeps the baseline, tracks value, calls retirement.",
    "mission": "You keep the value honest, from the first baseline to the value ledger. Finance referees.",
    "stages": {
      "G1": ("n", "", ""),
      "G2": {"T1": ("v", "No meeting: build and validate the value baseline of the full business case and how value will be measured. Finance validates the figures.", "Finance BP, requester"),
             "T2": ("v", "No meeting: build and validate the value range of the business case. Finance validates the figures.", "Finance BP, requester"),
             "T3": ("v", "No meeting: validate the value hypothesis on the one-page canvas.", "Requester")},
      "G3": same("c", "Provide the value score used at the Portfolio board (30% value).", "TO, Portfolio board"),
      "G4": same("c", "At the Portfolio board, check that funding follows the lane: full business case, tranches or sprint envelope.", "Data & AI, TO"),
      "Build": ("n", "", ""),
      "G5": {"T1": ("v", "Confirm the pilot KPIs against the baseline and the revised value range.", "Finance BP, TO, business owner"),
             "T2": ("v", "Write the light business case and confirm the pilot KPIs against the baseline.", "Finance BP, TO, business owner"),
             "T3": ("v", "Confirm the MVP KPIs against the value hypothesis.", "TO, business owner")},
      "Scale": ("n", "", ""),
      "G6": same("v", "Confirm realised value against the baseline in the value ledger, at 6 and 12 months. Call retirement when value fades.", "Finance BP, TO"),
    },
    "decide": ["Whether the value case holds, with Finance (G2)", "Pilot KPIs against the baseline (G5)", "Realised value and retirement (G6)"],
    "produce": ["Value baseline and measurement method", "Value score for prioritisation", "Value ledger and reviews at 6 and 12 months"],
    "modes": ["The mode changes little for your role.", "The mode changes little for your role.", "The mode changes little for your role."],
    "ss": ("c", "You read the quarterly value pulse from the registry."),
  },
  "PC": {
    "name": "P&C counterpart", "full": "P&C counterpart",
    "blurb": "Assesses the people impact: jobs, skills, workforce.",
    "mission": "You assess what the use case changes for jobs, skills and the workforce, and prepare the people side.",
    "stages": {
      "G1": ("n", "", ""),
      "G2": {"T1": ("v", "No meeting: run and validate the full Change Impact Assessment, on the Butterfly template adjusted for AI: affected jobs, user count, skills, process redesign yes or no.", "Requester, Adoption lead"),
             "T2": ("v", "No meeting: run and validate the full Change Impact Assessment, on the Butterfly template adjusted for AI: affected jobs, user count, skills, process redesign yes or no.", "Requester, Adoption lead"),
             "T3": ("v", "No meeting: run and validate a light impact scan: affected jobs and user count.", "Requester")},
      "G3": ("n", "", ""),
      "G4": same("i", "Informed: your assessment from G2 shapes the squad and the plan.", "Data & AI"),
      "Build": ("n", "", ""),
      "G5": same("v", "Validate the revised assessment and the HR workforce impact before scaling.", "TO, Adoption lead"),
      "Scale": same("w", "Support upskilling, role changes and social dialogue.", "Adoption lead, function"),
      "G6": same("c", "Consulted on the people side when adoption lags.", "TO, Adoption lead"),
    },
    "decide": ["Whether the people impact of the business case is acceptable (G2)", "Whether the workforce impact is acceptable to scale (G5)"],
    "produce": ["Change Impact Assessment (G2), on the Butterfly template adjusted for AI", "HR workforce impact assessment (G5)", "Upskilling and social dialogue inputs (Scale)"],
    "modes": ["The mode changes little for your role.", "The mode changes little for your role.", "The mode changes little for your role."],
    "ss": ("n", "Not involved in the self-serve path."),
  },
  "DA": {
    "name": "Data & AI", "full": "Data & AI",
    "blurb": "Platform, standards and builders: readiness, build, run.",
    "mission": "You check readiness, lock the mode and the architecture, then build, scale and run.",
    "stages": {
      "G1": ("n", "", ""),
      "G2": same("v", "No meeting: assess and validate tech and data readiness; flag foundation gaps.", "Requester, architects"),
      "G3": same("c", "Confirm hub capacity at the Portfolio board.", "TO, Portfolio board"),
      "G4": same("v", "Decide the mode with the TO at the Portfolio board; lock make-or-buy, architecture and squad, then release the build budget.", "TO, Portfolio board"),
      "Build": same("w", "Build the MVP with pooled engineers and data scientists. Your effort depends on the mode.", "Requester, AI builders"),
      "G5": same("w", "Bring the actual build cost and the scale architecture for sign-off. Name the run owner.", "TO, Design Authority"),
      "Scale": same("w", "Deploy and document; train the users with the Adoption lead.", "Adoption lead, function"),
      "G6": same("w", "Run and maintain: token cost, infrastructure, model drift and bugs.", "Run owner, Value officer"),
    },
    "decide": ["Tech and data readiness (G2)", "The mode with the TO, make-or-buy, architecture and budget release (G4)"],
    "produce": ["Architecture decision record", "Squad and tech sizing", "The MVP, the deployment and the run set-up"],
    "modes": ["You build and run it. The function frames the need and tests the result.", "You build it with the function's AI builder; the work is shared.", "You enable: platform, standards and coaching. The function builds."],
    "ss": ("c", "The Design Authority checks the fit of a new tool, only when one is evaluated."),
  },
  "LEX": {
    "name": "LEX (ORAI)", "full": "LEX, responsible-AI review (OR.AI)",
    "blurb": "Legal and responsible-AI review, based on risk.",
    "mission": "You review legal and responsible-AI risk. The depth of your review follows the OR.AI risk tier.",
    "stages": {
      "G1": ("n", "", ""),
      "G2": same("v", "No meeting: risk triage: confirm the OR.AI tier and set the pre-build conditions. Low: standard guardrails. Medium: light review in 5 days. High: full review before real data.", "Legal counsel or DPO, Data & AI"),
      "G3": ("n", "", ""),
      "G4": same("c", "Your guardrails are locked into the build plan at the Portfolio board.", "Data & AI, TO"),
      "Build": same("c", "Answer guardrail questions. High risk: full review before any real data.", "Data & AI, requester"),
      "G5": same("v", "Secondary review: clear, with conditions, or blocked.", "TO, Data & AI"),
      "Scale": ("n", "", ""),
      "G6": same("w", "Monitor risk and compliance after go-live; check for a tier change.", "Run owner, TO"),
    },
    "decide": ["OR.AI tier and pre-build conditions (G2)", "Clear, with conditions, or blocked before scale (G5)"],
    "produce": ["Risk triage outcome", "Secondary review decision", "Post-live compliance checks"],
    "modes": ["The mode changes little for your role.", "The mode changes little for your role.", "The mode changes little for your role."],
    "ss": ("c", "Standard guardrails apply; agents screen and monitor each request."),
  },
  "AL": {
    "name": "Adoption lead", "full": "Change and adoption lead",
    "blurb": "Change and adoption plans: nothing goes live without one.",
    "mission": "You make sure people use what is built: no use case goes live without an adoption plan.",
    "stages": {
      "G1": ("n", "", ""),
      "G2": {"T1": ("v", "No meeting: validate the adoption angle of the business case: users, sites, adoption risk.", "P&C counterpart, requester"),
             "T2": ("v", "No meeting: validate the adoption angle of the business case: users, sites, adoption risk.", "P&C counterpart, requester"),
             "T3": ("n", "", "")},
      "G3": ("n", "", ""),
      "G4": {"T1": ("c", "At the Portfolio board, agree how adoption will be measured; start the adoption plan.", "Data & AI, TO"),
             "T2": ("c", "At the Portfolio board, agree how adoption will be measured; start the adoption plan.", "Data & AI, TO"),
             "T3": ("n", "", "")},
      "Build": {"T1": ("w", "Build the adoption plan; join the user tests.", "Product owner, Data & AI"),
                "T2": ("w", "Build the adoption plan; join the user tests.", "Product owner, Data & AI"),
                "T3": ("c", "Join the user test of the MVP.", "Requester, Data & AI")},
      "G5": same("w", "Bring the formal adoption plan; scale is not approved without it.", "TO, P&C counterpart"),
      "Scale": same("w", "Train the users and run the adoption plan.", "Data & AI, function"),
      "G6": same("w", "Track active use against target; if it lags, run one relaunch sprint.", "TO, Value officer"),
    },
    "decide": ["The adoption angle of the business case (G2)", "Whether the adoption plan is ready to scale (you bring it; the TO decides)"],
    "produce": ["Adoption measures (G4)", "Adoption plan (G5)", "Training and adoption tracking (Scale, G6)"],
    "modes": ["The hub-led build comes with your adoption plan for the function.", "You build the adoption plan together with the function.", "The function owns adoption; you coach and provide the playbook."],
    "ss": ("n", "Not involved: the function owns adoption."),
  },
}

def norm(role):
    out = {}
    for s in STAGES:
        v = role["stages"][s]
        out[s] = v if isinstance(v, dict) else {t: v for t in TIERS}
    return out

for r in ROLES.values():
    r["stages"] = norm(r)

# Meetings: per gate, tiers where it acts, and per-role code + text
# header "decides" lists decision-makers who are not one of the six personas
MEETINGS = [
  {"id": "stream", "name": "Stream meetings", "cadence": "Monthly, one per stream (14)", "status": "Exists",
   "tiers": "T1", "note": "T2 and T3: no meeting.",
   "others": "Stream lead, business owners and product owners, AI catalysts, Finance BP",
   "cells": {
     "G5": {"T1": {"TO": ("D", "Pre-approves the scale case before SteerCo"), "VO": ("P", "Presents pilot KPIs")}},
     "G6": {"T1": {"TO": ("A", "Quarterly value review"), "VO": ("P", "Presents realised value")}},
   }},
  {"id": "board", "name": "Portfolio board / AI Portfolio Board", "cadence": "Weekly for T1, biweekly for T2 and T3", "status": "Exists",
   "tiers": "T1 T2 T3", "note": "Decides G3 (priority) and G4 (mode) for every tier. T1: weekly, also reviews escalations from streams.",
   "others": "Stream lead, business owners and product owners, AI catalysts, Finance BP. T2: advice to Program Sponsors (CDO and CFO)",
   "cells": {
     "G3": {t: {"TO": ("D", {"T1": "Prioritises the bet; SteerCo then validates", "T2": "Priority and backlog", "T3": "Yes or no"}[t]), "VO": ("P", "Value score"), "DA": ("A", "Hub capacity")} for t in TIERS},
     "G4": {t: {"TO": ("D", "Mode, with Data & AI"), "DA": ("D", "Mode, make-or-buy, architecture, budget"), "VO": ("A", "Funding lane"), "LEX": ("A", "Guardrails locked"), "AL": ("A", "Adoption measures") if t != "T3" else None} for t in TIERS},
     "G5": {"T2": {"TO": ("P", "Recommends; Sponsors approve"), "VO": ("P", "Pilot KPIs"), "PC": ("P", "Workforce impact"), "LEX": ("P", "Secondary review"), "AL": ("P", "Adoption plan")},
            "T3": {"TO": ("D", "Scale or stop"), "VO": ("P", "MVP KPIs"), "PC": ("P", "Workforce impact"), "LEX": ("P", "Secondary review"), "AL": ("P", "Adoption plan")}},
     "G6": {t: {"TO": ("D", "Continue or stop"), "VO": ("P", "Realised value"), "AL": ("P", "Active use")} for t in ["T2", "T3"]},
   }},
  {"id": "steerco", "name": "SteerCo", "cadence": "Monthly", "status": "Exists",
   "tiers": "T1 T2", "note": "T2: informed only (pipeline and value summary). T3: no meeting.",
   "others": "Leads of the streams concerned, TO lead, business owners of the bets, Data & AI",
   "cells": {
     "G3": {"T1": {"TO": ("P", "Presents the bet; SteerCo validates it (entry and funding)"), "DA": ("A", "Capacity and foundations")},
            "T2": {"TO": ("P", "Pipeline summary, informed only")}},
     "G5": {"T1": {"TO": ("P", "Presents the scale case; SteerCo decides"), "VO": ("P", "Value vs baseline"), "PC": ("P", "Workforce impact"), "LEX": ("P", "Risk review"), "AL": ("P", "Adoption plan"), "DA": ("A", "Scale architecture")}},
     "G6": {"T1": {"TO": ("P", "Value vs baseline, risks"), "DA": ("A", "Run status")},
            "T2": {"TO": ("P", "Value summary, informed only")}},
   }},
  {"id": "cross", "name": "AmplifAI cross stream meeting", "cadence": "Monthly (proposal, new)", "status": "New",
   "tiers": "T1", "note": "Optional: only for bets spanning several streams. T2 and T3: no meeting.",
   "others": "Program Sponsors (CDO and CFO), C-level bet sponsors, Head of Transformation Program",
   "cells": {
     "G3": {"T1": {"TO": ("P", "Optional: one decision for a multi-stream bet")}},
   }},
  {"id": "da", "name": "Design Authority", "cadence": "Weekly", "status": "Exists",
   "tiers": "T1 T2 T3", "note": "Scale architecture sign-off (G5). Self-serve: only checks a new tool.",
   "others": "Architects, lead tech (participants to confirm)",
   "cells": {
     "G5": {t: {"DA": ("D", "Scale architecture sign-off")} for t in TIERS},
   }},
  {"id": "offline", "name": "Outside meetings", "cadence": "Reviews and deliverables done between meetings", "status": "No meeting",
   "tiers": "T1 T2 T3", "note": "Work that feeds the meetings above.",
   "others": "Agent, requester, Finance BP, Legal counsel or DPO",
   "cells": {
     "G1": {t: {"TO": ("D", "Confirms the agent's routing")} for t in TIERS},
     "G4": {t: {"PC": ("I", "Impact assessment shapes the squad")} for t in TIERS},
     "G2": {t: {"VO": ("D", "Validates the baseline" if t != "T3" else "Validates the value hypothesis"), "PC": ("D", "Validates the Change Impact Assessment (Butterfly template)" if t != "T3" else "Validates the light impact scan"), "LEX": ("D", "Risk triage, conditions"), "DA": ("D", "Tech and data readiness"), "AL": ("D", "Validates the adoption angle") if t != "T3" else None, "TO": ("W", "Checks the case is complete")} for t in TIERS},
     "G5": {t: {"PC": ("D", "Workforce impact"), "LEX": ("D", "Secondary review"), "AL": ("W", "Adoption plan"), "DA": ("W", "Build cost, run owner"), "VO": ("D", "Pilot KPIs")} for t in TIERS},
     "G6": {t: {"VO": ("D", "Realised value, retirement"), "LEX": ("W", "Compliance monitoring"), "AL": ("W", "Adoption tracking"), "DA": ("W", "Run and maintain"), "PC": ("A", "People side if adoption lags")} for t in TIERS},
   }},
]

# drop None entries
for m in MEETINGS:
    for g, byt in m["cells"].items():
        for t, roles in byt.items():
            for k in [k for k, v in roles.items() if v is None]:
                del roles[k]

def export():
    roles = []
    for rid in ROLE_IDS:
        r = ROLES[rid]
        roles.append({"id": rid, "name": r["name"], "full": r["full"], "blurb": r["blurb"], "mission": r["mission"],
                      "stages": {s: {t: list(r["stages"][s][t]) for t in TIERS} for s in STAGES},
                      "decide": r["decide"], "produce": r["produce"], "modes": r["modes"], "ss": list(r["ss"])})
    meetings = []
    for m in MEETINGS:
        meetings.append({k: m[k] for k in ["id", "name", "cadence", "status", "tiers", "note", "others"]} |
                        {"cells": {g: {t: {rid: list(v) for rid, v in roles_.items()} for t, roles_ in byt.items()} for g, byt in m["cells"].items()}})
    return {"roles": roles, "meetings": meetings, "forum": FORUM}

if __name__ == "__main__":
    print(json.dumps(export())[:200])
