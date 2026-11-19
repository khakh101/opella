# Opella AmplifAI — AI Operating Model & Real-Time Lifecycle Webapp

An interactive, executive-grade web application built for **Opella** implementing the **AmplifAI Operating Model & Use Case Lifecycle** (grounded in the Butterfly transformation governance).

---

## 🌟 Key Capabilities

### 1. The 4 Questions Triage Router (Slide 35)
Every AI initiative at Opella enters through a single front door and is automatically routed based on four questions:
- **Q1 · Transform (`T1`)**: Is it part of an AmplifAI Big Bet, does it change Butterfly core platforms or scope, or cost more than €1M?
  - *Outcome:* Enters through Big Bet, Full Business Case, Transformation SteerCo approval.
- **Q2 · Self-Serve (`Self-Serve`)**: Does it only use approved tools and data, configured rather than built, for under €50k?
  - *Outcome:* Direct build access, skips G2 to G4, single registry line, automated guardrails.
- **Q3 · Scale (`T2`)**: Is value proven in a pilot, and does it need reach (2+ functions/regions, 500+ users), hub capacity or €200k–€1M?
  - *Outcome:* Light Business Case (1–2 pages), AI Portfolio Board review, CDO + CFO approval.
- **Q4 · Fast Lane (`T3`)**: Otherwise: A new idea or build with a value hypothesis to test?
  - *Outcome:* One-Page Canvas, 10-day decision SLA, 6–8 week fail-fast MVP sprint, ring-fenced AmplifAI envelope.

### 2. ORAI Responsible AI Risk Self-Assessment (Slides 35, 69, 70)
Parallel screening classifying initiatives under EU AI Act logic:
- **Low Risk:** Standard platform guardrails, auto-expiry, license caps.
- **Medium Risk:** 5-day light review by AI Governance & Design Authority.
- **High Risk:** Full review by LEX (Legal) and CISO before real data access. *High risk automatically routes out of Fast Lane.*

### 3. Assigned Speed & Delivery Modes (Slides 10, 11, 46)
- **Mode 1: "Do it for me" ("We ride for you"):** Hub leads delivery and run; function defines need and owns value.
- **Mode 2: "Do it with me" ("We ride together"):** Function leads, hub builds with it; shared capacity squads.
- **Mode 3: "Enable me" ("We give you the right bike and the map"):** Function builds or buys (SaaS / AI builders); hub provides guardrails & architecture audit.
- **Self-Service AI:** 100% user-owned with automated token caps and audit agents.

### 4. Dynamic Business Case Forms
Depending on the assigned tier, users fill out the exact required dossier:
- **T1 Full Business Case:** Multi-year recurring benefits (FY25–30), SI non-staff (4 pillars: System, Infra, Cyber, Data), people costs, supplier spend, and SteerCo sign-offs.
- **T2 Light Business Case:** 1–2 page template with manual bottleneck description, directional value, token sizing, and data platform fit.
- **T3 One-Page Canvas:** Agile hypothesis, 3 success KPIs with baseline, 6–8 week sprint duration, and kill/scale date.
- **Self-Serve Registry Line:** Approved software selection, <€50k cost cap confirmation, and 5 mandatory platform guardrails.

### 5. Real-Time Stage Gates Simulator (G1 to G6)
Interactive governance pipeline enforcing multi-dimensional reviews:
- **G1:** Need Validation (OpellaGPT Charter Agent screening)
- **G2:** Feasibility Assessment (Finance baseline, tech readiness, ORAI triage)
- **G3:** Prioritisation & Capacity Match (Value pool VCP scoring, 60/25/15 capacity plan)
- **G4:** Mode & Budget Validation -> **GO BUILD** (Squad allocation & MVP start)
- **G5:** Pre-Scale Validation (Scale gate: MVP metrics vs baseline, 5-pillar HR workforce scan)
- **G6:** Maintain & Run Validation (Realized ROI in value ledger, model drift, stop triggers)

### 6. Target Operating Model (TOM) & 29 Roles Matrix (Slides 14–22)
- Visual catalog of the **29 Opella roles** (7 urgent to create, 5 to strengthen, 17 in place).
- Hub architecture pairing Transformation Office (What & Why) with Data & AI (What & How).
- AI for All 4 Conditions for Change & 5 Pillars of Workforce Impact.

---

## 🚀 Getting Started

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Supabase Cloud Setup (Optional)

The application includes built-in reactive `localStorage` fallback so it works immediately out of the box with zero external configuration.

To connect Supabase for team cloud synchronization:
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase and execute the script in `supabase/schema.sql`.
3. Add your Supabase credentials to `.env.local` or your Vercel Project Settings:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
   ```

---

## 📦 Deploying to Vercel & GitHub

### Step 1: Push to GitHub
```bash
# Initialize git and commit
git init
git add .
git commit -m "feat: Initial commit for Opella AmplifAI Lifecycle Webapp"

# Link to your GitHub repository
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New Project"** and select your GitHub repository.
3. If using Supabase, expand **Environment Variables** and enter:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will automatically build and publish your application.
