# Gentiane's questions, verbatim, with where the site answers them.
# status: a = answered, p = partly, o = open. href: artboard of the answer (the real site: tab + section anchor)
T1, T2, T3, T4 = "Tab1.dc.html", "Tab2.dc.html", "Tab3.dc.html", "Tab4.dc.html"
CATS = [
 ("Intake: what comes into AmplifAI, and what happens to the rest", [
  ("How do we govern incoming AI initiatives?", "a", "One charter, an agent triage at G1, then the 6 gates.", "Tab 2 · the 4 steps", T2),
  ("Do we have one entry point for the business, so people don't have to work out whether to go to AmplifAI, OR.AI or their function?", "p",
   "One charter carries the value case and the OR.AI risk self-assessment. Open: how it merges with the Digital (SIMPLE) intake and Butterfly, so there is one intake for all projects.", "Tab 2 · step 1", T2),
  ("What sends an initiative to AmplifAI governance (size, impact, maturity, cross-functional or global reach, number of users)? We need a simple decision tree that people can apply themselves.", "a",
   "The three tier questions: big bet or more than €1m; approved tools under €50k; pilot proven with reach.", "Tab 3 · the tier questions", T3),
  ("What happens to initiatives that don't meet the threshold? Who owns them (the function, the TO, Digital)? How do they stay visible so we can still track their value? What do we agree stays in the function's own tracking?", "p",
   "Self-serve: the function owns it, one registry line, a quarterly value pulse. Open: what stays only in the function's own tracking.", "Tab 3 · self-serve one-pager", T3),
  ("How do we handle edge cases like AI modules added to SaaS tools we already have (for example Workday), Copilot agents, and the flow of ideas and pilots from the MS.AI factory?", "o",
   "No rule yet for SaaS AI modules, Copilot agents or the MS.AI factory flow.", "", ""),
 ]),
 ("Prioritisation of initiatives outside the big bets, and delivery capacity", [
  ("The big bets set the enterprise-level priorities. For AI initiatives outside the big bets, how do we decide which ones get enterprise priority and support, and which stay with the functions?", "a",
   "G3 prioritisation formula: 30% value, 20% strategic fit, 20% reach and reuse, risk scored inversely. Self-serve stays with the functions.", "Tab 3 · TO one-pager (G3)", T3),
  ("Digital support needs to follow these priorities, and teams already have more requests than they can support well. How do we match the demand we create with delivery capacity, so the intake doesn't turn into a bottleneck?", "p",
   "Quarterly capacity split (60% big bets, 25% fast lane, 15% enablement) and capacity arbitration at the AI Portfolio Board. Open: actual capacity figures.", "Tab 3 · TO one-pager (G3)", T3),
 ]),
 ("Governance of use cases validated within AmplifAI", [
  ("Once a use case is validated, who owns it: the business sponsor, the use case owner, the delivery lead (Digital, Artefact, a partner)? How does this connect to the bet sponsor and owner model we are working on?", "p",
   "One accountable business owner; the run owner is named at G5. Open: the link to the bet sponsor and owner model.", "Tab 3 · TO one-pager (G5)", T3),
  ("Which forums steer delivery, and how often (stream steercos, AmplifAI steerco)? What does each one decide, and what gets escalated?", "a",
   "The Where column of each role one-pager gives the forum at each gate and tier: stream meetings, Portfolio board, SteerCo, Design Authority. Escalation goes from stream to Portfolio board to SteerCo.", "Tab 3 · TO one-pager (Where column)", T3),
  ("What are the gates after validation (design, pilot, scale, run)? What are the criteria to go ahead, pause or stop a use case?", "a",
   "G4 (mode and budget), G5 (scale) and G6 (run), each with value, complexity, risk and adoption criteria. Pause is not defined as a separate outcome.", "Tab 3 · TO one-pager (G4 to G6)", T3),
  ("How are validated use cases funded and staffed? Who decides when they compete for the same Digital or data capacity?", "p",
   "Funding follows the lane at G4; Data & AI composes the squad; the AI Portfolio Board arbitrates capacity. Open: who funds the run.", "Tab 3 · Data & AI one-pager (G4)", T3),
  ("What happens when the data or tech foundations are not ready yet? Do we set a cut-off, or start with a version that works without them?", "o",
   "Foundation gaps are flagged at G2, but there is no cut-off rule.", "", ""),
  ("How do we track value against the business case once the use case is live (baseline, KPIs, link to the value creation plan)? Who signs off that the value was delivered?", "p",
   "The Value officer keeps the baseline and the value ledger; Finance referees; reviews at 6 and 12 months. Open: link to the value creation plan.", "Tab 3 · Value officer", T3),
  ("Who runs the solution after go-live (support, monitoring, running costs)?", "a",
   "Data & AI runs and maintains; the run owner is named at G5; G6 tracks run cost against value.", "Tab 3 · Data & AI", T3),
 ]),
 ("Experimentation: the sandbox", [
  ("Is the sandbox live for experimentation? What is already available, for whom, and under what guardrails?", "o",
   "Not covered. Needs the Data & AI team's documentation.", "", ""),
  ("How do we communicate and train people on it?", "o",
   "Not covered. The Adoption lead and the AI Academy are candidates.", "", ""),
 ]),
 ("From sandbox to scale", [
  ("How do we govern what moves from the sandbox to scale? What are the gates, and who decides at each one?", "a",
   "G5 is the scale gate; who decides depends on the tier.", "Tab 3 · TO one-pager (G5)", T3),
  ("How do we govern the requests that come up once people experiment with ODP?", "o",
   "Not covered. The term ODP is not defined in our sources.", "", ""),
  ("At what point does an experiment need a business case and go into the AmplifAI process?", "a",
   "Above self-serve (approved tools, under €50k): T3 needs a one-page canvas; a proven pilot with reach goes to T2.", "Tab 3 · the tier questions", T3),
 ]),
 ("Not only big bets: quick value from smaller initiatives", [
  ("How do we make sure we don't focus only on big bets, and leave room for smaller initiatives that bring value quickly?", "a",
   "T3 fast lane and self-serve, with 25% of hub capacity kept for the fast lane.", "Tab 1 · what it is", T1),
  ("Can we have a light, fast lane for small and medium initiatives that still tracks value, without the full big bet process?", "a",
   "T3: one-page canvas, 6 to 8 week MVP, the AI Portfolio Board as the only forum, value checked at G5.", "Tab 3 · T3 one-pagers", T3),
 ]),
 ("Sharing and reuse", [
  ("How do we share what has been built in the sandbox so others can use it?", "o",
   "Not covered.", "", ""),
  ("How do we set up and maintain a registry of approved AI solutions and use cases, so we don't assess or build the same thing twice?", "p",
   "Self-serve creates a registry line and reuse weighs 20% at G3. Open: who keeps the registry and who can search it.", "Tab 3 · TO one-pager (G3)", T3),
 ]),
 ("Link with OR.AI", [
  ("Which comes first, the AmplifAI value and priority review or the OR.AI responsible AI assessment? Can we combine them into one intake form, with a short self-assessment that flags only the few high-risk cases for a full review?", "a",
   "Both at once: one charter with the value case and the risk self-assessment. Low risk: standard guardrails; medium: light review in 5 days; high: full review.", "Tab 2 · step 1", T2),
  ("How do we keep monitoring risk and compliance after go-live, not only at the first gate?", "a",
   "LEX (ORAI) reviews again at G5 and monitors after go-live at G6.", "Tab 3 · LEX (ORAI)", T3),
 ]),
]

def export():
    return [{"title": t, "qs": [{"text": q[0], "s": q[1], "answer": q[2], "where": q[3], "href": q[4]} for q in qs]} for t, qs in CATS]

if __name__ == "__main__":
    from collections import Counter
    c = Counter(q[1] for _, qs in CATS for q in qs)
    print(sum(c.values()), dict(c))
    for _, qs in CATS:
        for q in qs:
            assert (q[1] == "o") == (q[4] == ""), q[0]
