import json, re
from model import export
import questions

T = {
 "Tab 3 · TO one-pager (G3)": {"tab": "support", "screen": "sheet", "role": "TO", "tier": "T2"},
 "Tab 3 · TO one-pager (G5)": {"tab": "support", "screen": "sheet", "role": "TO", "tier": "T1"},
 "Tab 3 · TO one-pager (Where column)": {"tab": "support", "screen": "sheet", "role": "TO", "tier": "T1"},
 "Tab 3 · TO one-pager (G4 to G6)": {"tab": "support", "screen": "sheet", "role": "TO", "tier": "T1"},
 "Tab 3 · Data & AI one-pager (G4)": {"tab": "support", "screen": "sheet", "role": "DA", "tier": "T1"},
 "Tab 2 · the 4 steps": {"tab": "user"}, "Tab 2 · step 1": {"tab": "user"},
 "Tab 3 · the tier questions": {"tab": "support", "screen": "tier", "role": "TO"},
 "Tab 3 · self-serve one-pager": {"tab": "support", "screen": "sheet", "role": "TO", "tier": "SS"},
 "Tab 3 · Value officer": {"tab": "support", "screen": "sheet", "role": "VO", "tier": "T1"},
 "Tab 3 · Data & AI": {"tab": "support", "screen": "sheet", "role": "DA", "tier": "T1"},
 "Tab 3 · LEX (ORAI)": {"tab": "support", "screen": "sheet", "role": "LEX", "tier": "T1"},
 "Tab 3 · T3 one-pagers": {"tab": "support", "screen": "sheet", "role": "TO", "tier": "T3"},
 "Tab 1 · what it is": {"tab": "overview", "anchor": "what"},
 "Tab 4 · committee matrix": {"tab": "cockpit", "anchor": "committees"},
 "Tab 4 · gate G3": {"tab": "cockpit", "gate": "G3"}, "Tab 4 · gate G4": {"tab": "cockpit", "gate": "G4"},
 "Tab 4 · gate G5": {"tab": "cockpit", "gate": "G5"}, "Tab 4 · gates G4 to G6": {"tab": "cockpit", "gate": "G4"},
}
cats = questions.export()
for c in cats:
    for q in c["qs"]:
        q["target"] = T[q["where"]] if q["where"] else None
        del q["href"]

src = open("/mnt/user-data/outputs/artifacts/d848803f/project/Tab4.dc.html").read()
gates = re.search(r"const GATES = (\[.*?\n    \]);", src, re.S).group(1)

out = f"""// Generated from the operating model source (role pages, committee matrix, Gentiane's questions).
// Same content as the validated canvas mockup of 25 Nov 2026. Edit the source model, then regenerate.

export type TierId = "T1" | "T2" | "T3";
export type AnyTier = TierId | "SS";
export type RoleId = "TO" | "VO" | "PC" | "DA" | "LEX" | "AL";
export type StageId = "G1" | "G2" | "G3" | "G4" | "Build" | "G5" | "Scale" | "G6";
export type Kind = "v" | "w" | "c" | "i" | "n";
export type MeetingCode = "D" | "P" | "A" | "W" | "I";
export type TabId = "overview" | "user" | "support" | "cockpit" | "tocockpit";

export interface SupportRole {{
  id: RoleId; name: string; full: string; blurb: string; mission: string;
  stages: Record<StageId, Record<TierId, [Kind, string, string]>>;
  decide: string[]; produce: string[]; modes: [string, string, string]; ss: [Kind, string];
}}
export interface Meeting {{
  id: string; name: string; cadence: string; status: string; tiers: string; note: string; others: string;
  cells: Partial<Record<string, Partial<Record<TierId, Partial<Record<RoleId, [MeetingCode, string]>>>>>>;
}}
export interface NavTarget {{ tab: TabId; anchor?: string; gate?: string; screen?: "role" | "tier" | "sheet"; role?: RoleId; tier?: AnyTier }}
export interface GentianeQuestion {{ text: string; s: "a" | "p" | "o"; answer: string; where: string; target: NavTarget | null }}
export interface QuestionCategory {{ title: string; qs: GentianeQuestion[] }}
export interface GateDef {{
  id: string; name: string; phase: string; type: string; human: boolean; decision: string;
  approver: string; forum: string; sla: string; criteria: [string, string][]; who: [string, string][];
}}

const MODEL = {json.dumps(export(), ensure_ascii=False, indent=1)} as unknown as {{ roles: SupportRole[]; meetings: Meeting[]; forum: Record<StageId, Record<TierId, string>> }};

export const SUPPORT_ROLES = MODEL.roles;
export const MEETINGS = MODEL.meetings;
export const FORUM = MODEL.forum;

export const GENTIANE_QUESTIONS: QuestionCategory[] = {json.dumps(cats, ensure_ascii=False, indent=1)};

export const COCKPIT_GATES: GateDef[] = {gates};
"""
open("/home/claude/opella/src/lib/supportModel.ts", "w").write(out)
print("ok", len(out))
