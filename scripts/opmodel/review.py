from model import ROLES, MEETINGS, ROLE_IDS, TIERS, STAGES, GATES, FORUM

issues = []
def flag(sev, msg):
    issues.append((sev, msg))

# 1. Every gate G2..G6 has at least one validating role per tier (G1: TO only, by design)
for g in GATES:
    for t in TIERS:
        v = [rid for rid in ROLE_IDS if ROLES[rid]["stages"][g][t][0] == "v"]
        if not v:
            flag("ERROR", f"{g} {t}: no role validates")
        if g == "G1" and v != ["TO"]:
            flag("ERROR", f"G1 {t}: validators are {v}, expected TO only")
        if g == "G1":
            others = [rid for rid in ROLE_IDS if rid != "TO" and ROLES[rid]["stages"]["G1"][t][0] != "n"]
            if others:
                flag("ERROR", f"G1 {t}: {others} involved, should be TO only")

# 2. Role validates at g/t  =>  it decides somewhere (a meeting or outside meetings) at g/t
def meeting_codes(rid, g, t):
    out = []
    for m in MEETINGS:
        c = m["cells"].get(g, {}).get(t, {}).get(rid)
        if c:
            out.append((m["name"], c[0]))
    return out

for rid in ROLE_IDS:
    for g in GATES:
        for t in TIERS:
            kind = ROLES[rid]["stages"][g][t][0]
            codes = meeting_codes(rid, g, t)
            if kind == "v" and not any(c in ("D", "P") for _, c in codes):
                flag("ERROR", f"{rid} validates at {g} {t} but neither decides nor presents in any meeting: {codes}")
            if kind == "n" and codes:
                flag("ERROR", f"{rid} not involved at {g} {t} on its page, but appears in meetings: {codes}")
            if kind in ("w", "c", "i") and not codes:
                flag("WARN", f"{rid} is '{kind}' at {g} {t} but appears in no meeting or offline row")
            if kind == "i" and any(c in ("D", "P") for _, c in codes):
                flag("ERROR", f"{rid} only informed at {g} {t} but decides/presents in {codes}")

# 3. Meetings only act in tiers they cover
for m in MEETINGS:
    for g, byt in m["cells"].items():
        for t in byt:
            if t not in m["tiers"].split():
                flag("ERROR", f"{m['name']} acts at {g} {t} but its tiers are {m['tiers']}")

# 4. Every role interacts at least once per tier; the badge is meaningful
for rid in ROLE_IDS:
    for t in TIERS:
        kinds = [ROLES[rid]["stages"][s][t][0] for s in STAGES]
        if all(k == "n" for k in kinds):
            flag("ERROR", f"{rid} never interacts in {t}")

# 5. Non-empty text where involved; empty where not
for rid in ROLE_IDS:
    for s in STAGES:
        for t in TIERS:
            k, what, with_ = ROLES[rid]["stages"][s][t]
            if k != "n" and (not what or not with_):
                flag("ERROR", f"{rid} {s} {t}: involved but missing text or counterpart")

# 6. Forum defined for every stage and tier
for s in STAGES:
    for t in TIERS:
        if not FORUM.get(s, {}).get(t):
            flag("ERROR", f"No forum for {s} {t}")

# 7. Business rules from the sources
for t in TIERS:
    if ROLES["PC"]["stages"]["G2"][t][0] == "n":
        flag("ERROR", f"P&C impact assessment missing at G2 {t} (user: CIA happens at G2)")
    if ROLES["AL"]["stages"]["G5"][t][0] == "n":
        flag("ERROR", f"No adoption plan at G5 {t} (deck: nothing goes live without an adoption plan)")
    if ROLES["VO"]["stages"]["G6"][t][0] != "v":
        flag("ERROR", f"Value officer does not confirm realised value at G6 {t}")
    if ROLES["DA"]["stages"]["G4"][t][0] != "v":
        flag("ERROR", f"Data & AI does not decide at G4 {t}")

# 8. Counterparts named on a role page exist as roles or as known others
for rid in ROLE_IDS:
    for s in STAGES:
        for t in TIERS:
            _, _, with_ = ROLES[rid]["stages"][s][t]
            if "Adoption lead" in with_ and ROLES["AL"]["stages"][s][t][0] == "n":
                flag("WARN", f"{rid} works with the Adoption lead at {s} {t}, but the Adoption lead is not involved there")
            if "P&C" in with_ and ROLES["PC"]["stages"][s][t][0] == "n":
                flag("WARN", f"{rid} works with P&C at {s} {t}, but P&C is not involved there")
            if "LEX" in with_ and ROLES["LEX"]["stages"][s][t][0] == "n":
                flag("WARN", f"{rid} works with LEX at {s} {t}, but LEX is not involved there")
            if "Value officer" in with_ and ROLES["VO"]["stages"][s][t][0] == "n":
                flag("WARN", f"{rid} works with the Value officer at {s} {t}, but the Value officer is not involved there")
            if "Data & AI" in with_ and ROLES["DA"]["stages"][s][t][0] == "n":
                flag("WARN", f"{rid} works with Data & AI at {s} {t}, but Data & AI is not involved there")

for sev, msg in issues:
    print(sev, "-", msg)
print(f"\n{sum(1 for s,_ in issues if s=='ERROR')} errors, {sum(1 for s,_ in issues if s=='WARN')} warnings")
