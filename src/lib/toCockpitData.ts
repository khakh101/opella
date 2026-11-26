// TO cockpit data, copied from the validated canvas (26 Nov 2026).
// PIPELINE: example data (statuses are illustrative). BACKLOG: 25 most-mentioned initiatives of the 217 inventory,
// fields copied as-is from Cleaned_Opella_Initiative_List_Dependency_Redundancy.

export type Health = "g" | "a" | "r";
export interface PipelineUseCase { id: string; title: string; fn: string; owner: string; tier: string; mode: string; step: string; gate: string | null; h: Health; entered: string; days: number; waiting: string; done: string[]; next: string[]; blocker: string }
export interface BacklogItem { id: string; title: string; fn: string; sub: string; status: string; owner: string; benefits: string; cost: string; horizon: string; butterfly: string; notes: string; mentions: number }

export const COCKPIT_WEEK_START = "2026-11-23";
export const COCKPIT_STEPS: { id: string; numeral: string; name: string; gates: [string, string][] }[] = [
 {
  "id": "framing",
  "numeral": "I",
  "name": "Framing",
  "gates": [
   [
    "G1",
    "Need"
   ],
   [
    "G2",
    "Feasible"
   ],
   [
    "G3",
    "Priority"
   ],
   [
    "G4",
    "Mode"
   ]
  ]
 },
 {
  "id": "build",
  "numeral": "II",
  "name": "Build (MVP)",
  "gates": []
 },
 {
  "id": "prescale",
  "numeral": "III",
  "name": "Pre-scale",
  "gates": [
   [
    "G5",
    "Scale"
   ]
  ]
 },
 {
  "id": "scale",
  "numeral": "IV",
  "name": "Scale",
  "gates": []
 },
 {
  "id": "run",
  "numeral": "V",
  "name": "Run",
  "gates": [
   [
    "G6",
    "Maintain"
   ]
  ]
 }
];
export const PIPELINE: PipelineUseCase[] = [
 {
  "id": "UC-CLAIM",
  "title": "Fast Market Claim Dossier Checker",
  "fn": "Science",
  "owner": "Dr. Sofia Morales",
  "tier": "T3",
  "mode": "Enable me",
  "step": "framing",
  "gate": "G2",
  "h": "a",
  "entered": "2026-11-01",
  "days": 25,
  "waiting": "AI Portfolio Board, 2 Dec (10-day SLA)",
  "done": [
   "Charter submitted",
   "Agent triage: T3, OR.AI low risk",
   "One-page canvas"
  ],
  "next": [
   "Value hypothesis check by the Value officer",
   "Feasibility decision at the AI Portfolio Board"
  ],
  "blocker": "Over the 10-day SLA: waiting for a board slot."
 },
 {
  "id": "UC-207",
  "title": "Invoice exception triage agent",
  "fn": "GBS",
  "owner": "Camille Roux",
  "tier": "T2",
  "mode": "Do it with me",
  "step": "framing",
  "gate": "G2",
  "h": "g",
  "entered": "2026-11-24",
  "days": 2,
  "waiting": "AI Portfolio Board, 3 Dec",
  "done": [
   "Charter submitted",
   "Agent triage: T2"
  ],
  "next": [
   "Change Impact Assessment (P&C)",
   "Value range with Finance BP",
   "Tech readiness at the Design Authority"
  ],
  "blocker": "None."
 },
 {
  "id": "UC-198",
  "title": "Contract clause review assistant",
  "fn": "Legal",
  "owner": "Hugo Martin",
  "tier": "T3",
  "mode": "Do it for me",
  "step": "framing",
  "gate": "G2",
  "h": "r",
  "entered": "2026-11-12",
  "days": 14,
  "waiting": "OR.AI full review",
  "done": [
   "Charter submitted",
   "Agent triage: T3, OR.AI high risk"
  ],
  "next": [
   "Full OR.AI review before any real data",
   "Feasibility decision"
  ],
  "blocker": "OR.AI high risk: no reviewer slot before mid-December."
 },
 {
  "id": "UC-205",
  "title": "HR policy assistant",
  "fn": "P&C",
  "owner": "Léa Bernard",
  "tier": "T3",
  "mode": "Enable me",
  "step": "framing",
  "gate": "G2",
  "h": "g",
  "entered": "2026-11-23",
  "days": 3,
  "waiting": "AI Portfolio Board, 3 Dec",
  "done": [
   "Charter submitted",
   "Agent triage: T3"
  ],
  "next": [
   "One-page canvas",
   "Light impact scan (P&C)"
  ],
  "blocker": "None."
 },
 {
  "id": "UC-WONKA",
  "title": "Wonka Vendor Intelligence SaaS",
  "fn": "Procurement",
  "owner": "Julien Mercier",
  "tier": "T2",
  "mode": "Enable me",
  "step": "framing",
  "gate": "G3",
  "h": "a",
  "entered": "2026-09-02",
  "days": 21,
  "waiting": "AI Portfolio Board, 3 Dec",
  "done": [
   "Charter",
   "Feasibility validated (G2)",
   "Value range validated by Finance BP"
  ],
  "next": [
   "Priority decision and capacity slot"
  ],
  "blocker": "Hub capacity: the fast-lane quota for Q1 is nearly full."
 },
 {
  "id": "UC-190",
  "title": "Cash forecast copilot",
  "fn": "Finance",
  "owner": "Nadia Haddad",
  "tier": "T2",
  "mode": "Do it with me",
  "step": "framing",
  "gate": "G3",
  "h": "g",
  "entered": "2026-10-28",
  "days": 6,
  "waiting": "AI Portfolio Board, 3 Dec",
  "done": [
   "Charter",
   "Feasibility validated (G2)"
  ],
  "next": [
   "Priority decision"
  ],
  "blocker": "None."
 },
 {
  "id": "UC-182",
  "title": "Trade promotion leakage detector",
  "fn": "Commercial",
  "owner": "Marc Olivier",
  "tier": "T1",
  "mode": "Do it for me",
  "step": "framing",
  "gate": "G3",
  "h": "a",
  "entered": "2026-10-15",
  "days": 18,
  "waiting": "SteerCo, 10 Dec",
  "done": [
   "Charter",
   "Full business case, pre-approved at the stream meeting"
  ],
  "next": [
   "SteerCo approval of entry and funding"
  ],
  "blocker": "SteerCo pre-read due 3 Dec."
 },
 {
  "id": "UC-IBP",
  "title": "IBP Demand Sensing & Replenishment Agent",
  "fn": "Supply Chain",
  "owner": "Mathieu Laurent",
  "tier": "T1",
  "mode": "Do it with me",
  "step": "framing",
  "gate": "G4",
  "h": "r",
  "entered": "2026-08-20",
  "days": 34,
  "waiting": "Design Authority",
  "done": [
   "Charter",
   "Feasibility (G2)",
   "Priority and funding approved by SteerCo (G3)"
  ],
  "next": [
   "Mode, architecture and squad at the Design Authority"
  ],
  "blocker": "Data foundations not ready: depends on the data platform migration."
 },
 {
  "id": "UC-176",
  "title": "Supplier onboarding assistant",
  "fn": "Procurement",
  "owner": "Inès Fabre",
  "tier": "T2",
  "mode": "Do it for me",
  "step": "framing",
  "gate": "G4",
  "h": "g",
  "entered": "2026-10-06",
  "days": 4,
  "waiting": "Design Authority, 2 Dec",
  "done": [
   "Charter",
   "Feasibility (G2)",
   "Priority (G3)"
  ],
  "next": [
   "Make-or-buy and squad",
   "Budget release"
  ],
  "blocker": "None."
 },
 {
  "id": "UC-161",
  "title": "Month-end close commentary agent",
  "fn": "Finance",
  "owner": "Thomas Leroy",
  "tier": "T2",
  "mode": "Do it with me",
  "step": "build",
  "gate": null,
  "h": "g",
  "entered": "2026-09-10",
  "days": 28,
  "waiting": "MVP, week 4 of 8",
  "done": [
   "G1 to G4 passed",
   "Backlog and user stories",
   "First MVP release"
  ],
  "next": [
   "User test with 3 controllers",
   "Adoption plan"
  ],
  "blocker": "None."
 },
 {
  "id": "UC-155",
  "title": "Regulatory dossier rewriter",
  "fn": "Science",
  "owner": "Claire Dubois",
  "tier": "T1",
  "mode": "Do it for me",
  "step": "build",
  "gate": null,
  "h": "a",
  "entered": "2026-08-28",
  "days": 41,
  "waiting": "User test",
  "done": [
   "G1 to G4 passed",
   "MVP built"
  ],
  "next": [
   "User test with regulatory writers",
   "Adoption plan"
  ],
  "blocker": "No user-test slots before 8 Dec."
 },
 {
  "id": "UC-170",
  "title": "Customer email triage",
  "fn": "E-commerce",
  "owner": "Yanis Petit",
  "tier": "T3",
  "mode": "Enable me",
  "step": "build",
  "gate": null,
  "h": "g",
  "entered": "2026-10-02",
  "days": 19,
  "waiting": "MVP, week 3 of 6",
  "done": [
   "G1 to G4 passed",
   "Low-code prototype"
  ],
  "next": [
   "User test",
   "MVP KPIs"
  ],
  "blocker": "None."
 },
 {
  "id": "UC-166",
  "title": "Packaging artwork checker",
  "fn": "M&S",
  "owner": "Not named",
  "tier": "T3",
  "mode": "Do it with me",
  "step": "build",
  "gate": null,
  "h": "r",
  "entered": "2026-09-22",
  "days": 30,
  "waiting": "Product owner",
  "done": [
   "G1 to G4 passed"
  ],
  "next": [
   "Name a product owner",
   "Backlog and user stories"
  ],
  "blocker": "No product owner named: the build has not started."
 },
 {
  "id": "UC-GIDE",
  "title": "GIDE / BOWIE Procurement Agent",
  "fn": "Procurement",
  "owner": "Sarah Chen",
  "tier": "T1",
  "mode": "Do it with me",
  "step": "prescale",
  "gate": "G5",
  "h": "a",
  "entered": "2026-06-15",
  "days": 8,
  "waiting": "Stream meeting, then SteerCo",
  "done": [
   "MVP live for indirect spend under 100k EUR",
   "Weekly hypercare tracking"
  ],
  "next": [
   "Pilot KPIs against the baseline, signed by Finance",
   "Adoption plan",
   "OR.AI secondary review"
  ],
  "blocker": "Value not yet signed by Finance."
 },
 {
  "id": "UC-149",
  "title": "Freight invoice control",
  "fn": "Supply Chain",
  "owner": "Paul Garnier",
  "tier": "T2",
  "mode": "Do it with me",
  "step": "prescale",
  "gate": "G5",
  "h": "g",
  "entered": "2026-07-01",
  "days": 5,
  "waiting": "AI Portfolio Board, 3 Dec",
  "done": [
   "MVP validated",
   "Light business case",
   "Adoption plan"
  ],
  "next": [
   "Program Sponsors approval"
  ],
  "blocker": "None."
 },
 {
  "id": "UC-131",
  "title": "Sales visit planner",
  "fn": "Commercial",
  "owner": "Julie Moreau",
  "tier": "T2",
  "mode": "Do it for me",
  "step": "scale",
  "gate": null,
  "h": "g",
  "entered": "2026-05-12",
  "days": 22,
  "waiting": "Roll-out, 3 of 5 countries",
  "done": [
   "Scale approved (G5)",
   "Live in France, Spain, Italy"
  ],
  "next": [
   "Roll out to Germany and Poland",
   "Train users"
  ],
  "blocker": "None."
 },
 {
  "id": "UC-LUMEN",
  "title": "Lumen Commercial Content Engine",
  "fn": "M&S",
  "owner": "Antoine Dupont",
  "tier": "T1",
  "mode": "Do it for me",
  "step": "run",
  "gate": "G6",
  "h": "g",
  "entered": "2026-03-10",
  "days": 60,
  "waiting": "Quarterly review, Jan 2027",
  "done": [
   "Live in production",
   "6-month value review"
  ],
  "next": [
   "12-month value review"
  ],
  "blocker": "None."
 },
 {
  "id": "UC-118",
  "title": "Legal knowledge search",
  "fn": "Legal",
  "owner": "Hugo Martin",
  "tier": "T2",
  "mode": "Enable me",
  "step": "run",
  "gate": "G6",
  "h": "r",
  "entered": "2026-04-02",
  "days": 45,
  "waiting": "AI Portfolio Board, 3 Dec",
  "done": [
   "Live in production"
  ],
  "next": [
   "Relaunch sprint",
   "Decide: continue or stop"
  ],
  "blocker": "Adoption: 35% active use against a 60% target."
 }
];
export const BACKLOG: BacklogItem[] = [
 {
  "id": "UC-129",
  "title": "Win in LLM/GEO search",
  "fn": "Growth Hub",
  "sub": "AI Transformation",
  "status": "Under study",
  "owner": "Roohani Nayyar",
  "benefits": "To be defined",
  "cost": "To be defined",
  "horizon": "More than 12 months",
  "butterfly": "",
  "notes": "[AmplifAI questions] under the GEO umbrella",
  "mentions": 78
 },
 {
  "id": "UC-211",
  "title": "OpellaIQ",
  "fn": "Digital",
  "sub": "D&AI",
  "status": "In Progress",
  "owner": "Mathew Paruthickal",
  "benefits": "",
  "cost": "",
  "horizon": "",
  "butterfly": "",
  "notes": "",
  "mentions": 27
 },
 {
  "id": "UC-161",
  "title": "APEX",
  "fn": "Finance",
  "sub": "S2V",
  "status": "Under study",
  "owner": "Gustavo Benedetti (D) / Radouane Irhly / Cedric Elmaleh (B)",
  "benefits": "100k - 500k",
  "cost": "To be defined",
  "horizon": "More than 12 months",
  "butterfly": "",
  "notes": "[AmplifAI Deep Dive Questions] objective have the invoice that reconciles. To combine with GIDE P001 | [AmplifAI Big Bet] BB8",
  "mentions": 16
 },
 {
  "id": "UC-163",
  "title": "AI features embedded in ORO",
  "fn": "Finance",
  "sub": "S2V",
  "status": "Live",
  "owner": "Tolga Aybars",
  "benefits": "To be defined",
  "cost": "",
  "horizon": "Less than 6 months",
  "butterfly": "",
  "notes": "[AmplifAI Deep Dive Questions] ask maria florencia cazanova (PMO S2V, report Stan) - check that this is productivity only",
  "mentions": 16
 },
 {
  "id": "UC-210",
  "title": "AI Launchpad/ ODP",
  "fn": "Digital",
  "sub": "D&AI",
  "status": "Live",
  "owner": "Naveen Pochiraju",
  "benefits": "",
  "cost": "",
  "horizon": "",
  "butterfly": "",
  "notes": "",
  "mentions": 15
 },
 {
  "id": "UC-036",
  "title": "Automated PQR (Product Quality Review)",
  "fn": "M&S",
  "sub": "Quality",
  "status": "Live",
  "owner": "Rajesh / Claire W.",
  "benefits": "€200 000",
  "cost": "To be defined",
  "horizon": "",
  "butterfly": "",
  "notes": "[AmplifAI questions] top prio pour la fonction",
  "mentions": 15
 },
 {
  "id": "UC-164",
  "title": "AI features embedded in LEO",
  "fn": "Finance",
  "sub": "S2V",
  "status": "Live",
  "owner": "Tolga Aybars",
  "benefits": "To be defined",
  "cost": "",
  "horizon": "Less than 6 months",
  "butterfly": "",
  "notes": "[AmplifAI Deep Dive Questions] ask maria florencia cazanova (PMO S2V, report Stan) - check that this is productivity only\n creation of video , same ask from science. To be leverage by wonka?",
  "mentions": 13
 },
 {
  "id": "UC-206",
  "title": "Jarvis",
  "fn": "Commercial",
  "sub": "Sales",
  "status": "In progress",
  "owner": "Antonios Faros / Jordan Steinhort",
  "benefits": "",
  "cost": "",
  "horizon": "",
  "butterfly": "",
  "notes": "[Answers] execution, provide recommendations to the field team, it is being worked on with salesforce",
  "mentions": 12
 },
 {
  "id": "UC-052",
  "title": "Detailed Scheduling: Pegging and Rescheduling Process (Veres)",
  "fn": "M&S",
  "sub": "Supply Chain",
  "status": "Parked",
  "owner": "Sonia P",
  "benefits": "To be defined",
  "cost": "To be defined",
  "horizon": "",
  "butterfly": "",
  "notes": "",
  "mentions": 11
 },
 {
  "id": "UC-160",
  "title": "Opella HelpDesk App",
  "fn": "Finance",
  "sub": "S2V",
  "status": "In progress",
  "owner": "Salil Patel (D) / Adam Tamasi (B)",
  "benefits": "0 - 100k",
  "cost": "To be defined",
  "horizon": "Less than 6 months",
  "butterfly": "",
  "notes": "",
  "mentions": 8
 },
 {
  "id": "UC-152",
  "title": "GIDE (PRO003/PRO005)",
  "fn": "Finance",
  "sub": "Procurement",
  "status": "In progress",
  "owner": "Cedric Elmaleh (Procurement) / Gustavo Benedetti (Digital)",
  "benefits": "1M - 5M",
  "cost": "100 - 500k",
  "horizon": "More than 12 months",
  "butterfly": "yes",
  "notes": "[AmplifAI Deep Dive Questions] yes P1 for procurement | [AmplifAI Big Bet] BB8",
  "mentions": 7
 },
 {
  "id": "UC-095",
  "title": "Wonka",
  "fn": "Growth Hub",
  "sub": "CXA",
  "status": "Live",
  "owner": "Julien Leterrier",
  "benefits": "4.7 in 2026 in agency saving.\n 10 M at scale in 2028.",
  "cost": "300k",
  "horizon": "2028 - full scale",
  "butterfly": "very Partially",
  "notes": "[AmplifAI questions] out of amplifAI, good as a stand alone",
  "mentions": 7
 },
 {
  "id": "UC-155",
  "title": "Contract Lifecycle Management (PRO-001)",
  "fn": "Finance",
  "sub": "Procurement & Legal",
  "status": "In progress",
  "owner": "Marie-Annick Luro / Gustavo Benedetti",
  "benefits": "To be defined",
  "cost": "To be defined",
  "horizon": "More than 12 months",
  "butterfly": "yes",
  "notes": "[AmplifAI Deep Dive Questions] yes P1 for procurement | [AmplifAI Big Bet] BB8",
  "mentions": 6
 },
 {
  "id": "UC-008",
  "title": "MarketMind",
  "fn": "Digital",
  "sub": "Data & AI",
  "status": "In progress",
  "owner": "Naveen Pochiraju",
  "benefits": "To be defined",
  "cost": "To be defined",
  "horizon": "",
  "butterfly": "",
  "notes": "",
  "mentions": 4
 },
 {
  "id": "UC-101",
  "title": "Go Big On Social",
  "fn": "Growth Hub",
  "sub": "CXA",
  "status": "In progress",
  "owner": "Eugénie Cornuet",
  "benefits": "Pilot in progress to determine benefits at scale",
  "cost": "",
  "horizon": "",
  "butterfly": "yes",
  "notes": "[AmplifAI questions] specific scope and activation, no need for amplifAI | [Answers] Buttefrly partially funded a pilot in 4 regions",
  "mentions": 4
 },
 {
  "id": "UC-034",
  "title": "Regulatory Dossier Writing",
  "fn": "M&S",
  "sub": "EM/Regulatory",
  "status": "Live",
  "owner": "Fatma Jarraya",
  "benefits": "To be defined",
  "cost": "To be defined",
  "horizon": "",
  "butterfly": "",
  "notes": "[AmplifAI questions] top prio pour la fonction",
  "mentions": 4
 },
 {
  "id": "UC-191",
  "title": "GMID process redesign to accelerate and simplify",
  "fn": "Finance",
  "sub": "MDM",
  "status": "In progress",
  "owner": "Benoit Saguet",
  "benefits": "To be defined",
  "cost": "",
  "horizon": "6 - 12 months",
  "butterfly": "",
  "notes": "[AmplifAI Deep Dive Questions] POC already supported by amplifAI",
  "mentions": 2
 },
 {
  "id": "UC-001",
  "title": "Harvey AI",
  "fn": "LEX",
  "sub": "Legal, Ethics & Security",
  "status": "Live",
  "owner": "Lucie Radreault",
  "benefits": "TBD",
  "cost": "",
  "horizon": "",
  "butterfly": "",
  "notes": "",
  "mentions": 2
 },
 {
  "id": "UC-162",
  "title": "AI based tool embedded in Concur.",
  "fn": "Finance",
  "sub": "S2V",
  "status": "Live",
  "owner": "Tolga Aybars",
  "benefits": "To be defined",
  "cost": "",
  "horizon": "Less than 6 months",
  "butterfly": "",
  "notes": "[AmplifAI Deep Dive Questions] ask maria florencia cazanova (PMO S2V, report Stan) - check that this is productivity only\n value likage can be the theme in common to combine with initiative PRO 004",
  "mentions": 1
 },
 {
  "id": "UC-088",
  "title": "Claims workflow orchestrator",
  "fn": "Science",
  "sub": "Medical",
  "status": "In progress",
  "owner": "Namratha Vadlamudi",
  "benefits": "To be defined",
  "cost": "100 - 500k",
  "horizon": "6 - 12 months",
  "butterfly": "",
  "notes": "[discussed / prio] P1 | [AmplifAI questions] synergies with claim evidence matrix project > YES- process very much fragmented - different tools at each steps > could be solved with workflow redesign / governance and AI. Claims workshop (christina Bito, Anne Lise from GH, Martin rodriguez)",
  "mentions": 1
 },
 {
  "id": "UC-075",
  "title": "Dossier Writing AI",
  "fn": "Science",
  "sub": "Regulatory",
  "status": "In progress",
  "owner": "Luciana Walther/Nathalie Anthoine",
  "benefits": "1M - 5M",
  "cost": "100 - 500k",
  "horizon": "6 - 12 months",
  "butterfly": "no",
  "notes": "[discussed / prio] P1 | [AmplifAI questions] update on status, POC with one vendor (vibe coding, not production) - why MSFT budget frozen? eliminated because not selected in the project lists - \n Benefits for dossier writing: Impact on FTE, time to market / cost likely to be higher (up to 1M), potential to scale also beyong regulatory- already met with vendors ( amplifAI could support prioritize it",
  "mentions": 1
 },
 {
  "id": "UC-067",
  "title": "Claim Evidence Matrix",
  "fn": "Science",
  "sub": "Medical",
  "status": "In progress",
  "owner": "So Young Ryu",
  "benefits": "0 - 100k",
  "cost": "",
  "horizon": "Less than 6 months",
  "butterfly": "",
  "notes": "[discussed / prio] P1 | [AmplifAI questions] Claims strategic + cross functional topic with Growth hub. To deep dive /// unclear governance / org on claims - from global ideation to localization -relavance in the markets. To move forard: time / alignment",
  "mentions": 1
 },
 {
  "id": "UC-107",
  "title": "Zero Touch Forecasting",
  "fn": "Growth Hub",
  "sub": "CXA",
  "status": "In progress",
  "owner": "Alvaro Aguado",
  "benefits": "",
  "cost": "",
  "horizon": "",
  "butterfly": "yes",
  "notes": "[AmplifAI questions] yes to check with M&S",
  "mentions": 1
 },
 {
  "id": "UC-105",
  "title": "Sell Out Intelligence (DaaS, Synergy)",
  "fn": "Growth Hub",
  "sub": "CXA",
  "status": "In progress",
  "owner": "Patrick Huber",
  "benefits": "",
  "cost": "",
  "horizon": "",
  "butterfly": "yes",
  "notes": "[AmplifAI questions] projet pour données sales out (iqvia directement dans snowflake)",
  "mentions": 1
 },
 {
  "id": "UC-058",
  "title": "Formulation recommender",
  "fn": "Science",
  "sub": "R&D",
  "status": "In progress",
  "owner": "Philippe Longuemard",
  "benefits": "100k - 500k",
  "cost": "",
  "horizon": "6 - 12 months",
  "butterfly": "",
  "notes": "[AmplifAI questions] learnings from MVP? Challenge size of price?",
  "mentions": 1
 }
];
