"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Euro,
  Users,
  Shield,
  Zap,
  Check,
  Building,
  Bot,
  Send,
  Compass,
  Bike,
  Workflow,
  HelpCircle,
  FileText,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  IntakeAnswers,
  Tier,
  DeliveryMode,
  RiskTier,
  UseCase,
  T1BusinessCase,
  T2BusinessCase,
  T3Canvas,
  SelfServeRegistryEntry,
  GateDetail,
  GateId,
} from "@/types";
import { BIG_BETS, TIER_CONFIG, DELIVERY_MODES_INFO, INITIAL_GATES } from "@/lib/constants";
import { evaluateIntake } from "@/lib/decisionEngine";
import { saveUseCase } from "@/lib/storage";

interface IntakeWizardProps {
  onUseCaseCreated: (newCase: UseCase) => void;
  onNavigateToLifecycle: (useCaseId: string) => void;
}

export const IntakeWizard: React.FC<IntakeWizardProps> = ({
  onUseCaseCreated,
  onNavigateToLifecycle,
}) => {
  // Exact Sequencing:
  // Step 1: 4 Questions Assessment & Initiative Framing
  // Step 2: Autonomous Agent Triage (T1, T2, T3 Fast Lane, Self-Serve)
  // Step 3: Fill Out Relevant Business Case Form
  // Step 4: Sourcing & Delivery Mode Selection (Mode 1, 2, 3)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [answers, setAnswers] = useState<IntakeAnswers>({
    initiativeTitle: "",
    functionName: "M&S",
    region: "Global",
    businessOwnerName: "",
    businessOwnerEmail: "",
    aiCatalystName: "",
    estimatedCost: 150000,
    targetUserCount: 120,
    mappedBigBet: undefined,

    // The 4 Questions (Slide 35)
    q1_bigBetOrOver1m: false,
    q2_approvedToolsUnder50k: false,
    q3_provenPilotOrReach: false,
    q4_newHypothesis: true,

    // ORAI Risk Screening (5 questions)
    risk_personalHealthData: false,
    risk_autonomousDecisions: false,
    risk_coreProdWriteBack: false,
    risk_externalOutputNoReview: false,
    risk_unapprovedSaaSOrCustomModel: false,

    // Delivery mode preferences
    techComplexity: "Medium",
    functionTechCapacity: "Medium",
    fundingSource: "Co-funded",
  });

  // Selected Mode State (User chooses at Step 4)
  const [chosenMode, setChosenMode] = useState<DeliveryMode>("Mode 2");

  // Agent Triage Simulation Animation States
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [agentLogIndex, setAgentLogIndex] = useState(0);

  // Dynamic Business Case Form States
  // T1
  const [t1BC, setT1BC] = useState<T1BusinessCase>({
    type: "T1_FULL",
    recurringItems: {
      topLineImpact: "€1.2M incremental revenue",
      grossMarginImpact: "+0.8% margin improvement",
      opexImpact: "-€450k automated routine tasks",
      workingCapitalImpact: "-€1.5M inventory reduction",
      fteImpact: "14 FTE equivalent repurposed",
      fy25_30BenefitsSummary: "Cumulative Net Present Value €6.8M across 5 markets",
      targetPnLLine: "Commercial Opex / COGS",
    },
    siNonStaff: {
      systemEnablers: "SAP S/4 Hana API connectors & Databricks delta lake",
      infrastructureEnablers: "Azure GenAI tenant (dedicated private endpoint)",
      cyberEnablers: "CISO token authentication & data boundary tokenization",
      dataEnablers: "Opella IQ semantic layer & master product hierarchy",
      linkedInitiativeIds: "INIT-402, BUTTERFLY-IBP-12",
    },
    resourcePeopleCosts: {
      namedInternalRoles: "Product Owner (0.8 FTE), AI Catalyst (0.3 FTE)",
      externalRoles: "Hub Forward Deployed Engineer (1 FTE), Data Architect (0.5 FTE)",
      dedicationPercentage: 80,
      fullyLoadedCostEstimate: "€320k internal + €180k external contractor",
      skillGapJustification: "Specialized LLM agent orchestration and graph retrieval skill required",
    },
    biNonStaff: {
      supplierSpendEstimate: "€150,000",
      supplierScope: "External integration partner for pilot sprint tuning",
      rfpStatus: "Drafted",
    },
    projectPlanMilestones: {
      criticalPathMilestones: "Sprint 1-2: Data ingestion; Sprint 3-4: Agent logic; Sprint 5-6: UAT & G5 scale gate",
      stageGatesCadenceWeeks: 4,
      keyRisks: "Data readiness latency in regional ERP; mitigated with synthetic dataset",
      interdependencies: "Requires Opella IQ product master taxonomy release",
      kpisTarget: "95% prediction accuracy, <48h turnaround time, 85% weekly active usage",
    },
    dashboardSignOffs: {
      ebitdaEffect: "+€2.1M run-rate EBITDA",
      paybackMonths: 11,
      financeSignOff: true,
      digitalSignOff: true,
      streamLeadSignOff: true,
      controlTowerSignOff: false,
    },
  });

  // T2
  const [t2BC, setT2BC] = useState<T2BusinessCase>({
    type: "T2_LITE",
    problemStatement:
      "Manual data gathering across multiple disparate regional spreadsheets causes 12 business hours delay per reporting cycle with 15% reconciliation errors.",
    directionalValue: "Saves 25 hours per analyst weekly and reduces cycle turnaround time by 60%.",
    buildMode: "Do it with me",
    estimatedBuilderDays: 45,
    roughTokenConsumption: "Approx. €1,200/month in Azure GenAI tokens (fits within allocation)",
    existingDataFit: {
      approvedSourcesConfirmed: true,
      dataSourcesDetails: "Data resides in approved Snowflake data mart and Sharepoint hub",
      platformType: "Existing Hub Platform",
    },
    governance: {
      namedBusinessOwner: "Sarah Jenkins (Senior Director)",
      namedAiCatalyst: "Marc Delon (Procurement Catalyst)",
      targetUserCount: 320,
      portfolioBoardDate: "2026-12-04",
    },
    oraiScreeningConfirmation: {
      riskTierConfirmed: "Medium",
      mitigationsSummary: "No patient or sensitive HR data. Human-in-the-loop review required before final export.",
    },
  });

  // T3
  const [t3Canvas, setT3Canvas] = useState<T3Canvas>({
    type: "T3_CANVAS",
    summaryAndHypothesis:
      "Hypothesis: An automated claim matching agent can accelerate marketing regulatory compliance checks from 7 days to 24 hours without lowering accuracy.",
    kpi1: "Turnaround time < 24 hours (Baseline: 7 days)",
    kpi2: "Regulatory compliance audit agreement > 92% (Baseline: 88%)",
    kpi3: "Active pilot user weekly adoption > 75%",
    baselineMetrics: "Currently takes 7 days with 4 manual touchpoints",
    sprintDurationWeeks: 8,
    killOrScaleDate: "2027-01-25 (End of 8-week MVP sprint)",
    budgetEnvelope: 110000,
    deliveryMode: "Enable me",
    assignedBuilderOrCatalyst: "Thomas Brun (Certified AI Builder)",
    registryReuseCheckCompleted: true,
    reusableComponentsIdentified: "Reusing Opella GPT prompt template and Azure Document Intelligence parsing pipeline",
  });

  // Self-Serve
  const [selfServeRegistry, setSelfServeRegistry] = useState<SelfServeRegistryEntry>({
    type: "SELF_SERVE",
    agentOrToolName: "Meeting Synthesis & Task Extractor Agent",
    purposeSummary:
      "Summarizes weekly steering team meeting transcripts and automatically formats action items for team distribution.",
    approvedToolUsed: "Copilot Studio",
    targetUserGroup: "M&S Regional Leadership Team",
    userCount: 18,
    annualTokenCostEstimate: 4500,
    guardrailsConfirmed: {
      noPersonalOrHealthData: true,
      noProdSystemConnection: true,
      noExternalSharingWithoutReview: true,
      autoExpiryAndCostCapsAccepted: true,
      listedInRegistry: true,
    },
    functionHeadApprovalReceived: true,
  });

  // Real-time evaluation calculation
  const decision = evaluateIntake(answers);
  const tierConfig = TIER_CONFIG[decision.tier];

  // Keep chosen mode in sync with suggested default
  useEffect(() => {
    setChosenMode(decision.mode);
  }, [decision.mode]);

  // Handle Triggering Agent Triage Transition from Step 1 to Step 2
  const handleStartAgentTriage = () => {
    setIsAgentThinking(true);
    setAgentLogIndex(0);
    setStep(2);

    const timer1 = setTimeout(() => setAgentLogIndex(1), 600);
    const timer2 = setTimeout(() => setAgentLogIndex(2), 1200);
    const timer3 = setTimeout(() => setAgentLogIndex(3), 1800);
    const timer4 = setTimeout(() => {
      setIsAgentThinking(false);
      setAgentLogIndex(4);
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const handleCreateUseCase = async () => {
    // Determine business case payload
    let businessCasePayload: any;
    if (decision.tier === "T1") businessCasePayload = t1BC;
    else if (decision.tier === "T2") businessCasePayload = t2BC;
    else if (decision.tier === "T3") businessCasePayload = t3Canvas;
    else businessCasePayload = selfServeRegistry;

    // Create gate objects
    const gates = JSON.parse(JSON.stringify(INITIAL_GATES)) as Record<GateId, GateDetail>;

    let currentGate: GateId = "G1";
    let status: UseCase["status"] = "FRAMING";

    if (decision.tier === "Self-Serve") {
      // Skips G2 to G4 directly to build
      gates.G1.status = "PASSED";
      gates.G1.updatedAt = new Date().toISOString();
      gates.G2.status = "SKIPPED";
      gates.G3.status = "SKIPPED";
      gates.G4.status = "SKIPPED";
      gates.G5.status = "SKIPPED";
      gates.G6.status = "SKIPPED";
      currentGate = "G1";
      status = "BUILD_MVP";
    } else {
      gates.G1.status = "IN_REVIEW";
      gates.G1.updatedAt = new Date().toISOString();
      currentGate = "G1";
      status = "FRAMING";
    }

    const newCase: UseCase = {
      id: `UC-${Math.floor(100 + Math.random() * 900)}`,
      title: answers.initiativeTitle || "Untitled Opella AI Initiative",
      description:
        decision.tier === "T1"
          ? t1BC.recurringItems.fy25_30BenefitsSummary
          : decision.tier === "T2"
          ? t2BC.problemStatement
          : decision.tier === "T3"
          ? t3Canvas.summaryAndHypothesis
          : selfServeRegistry.purposeSummary,
      functionName: answers.functionName,
      region: answers.region,
      owner: answers.businessOwnerName || "Named Business PO",
      sponsor:
        decision.tier === "T1"
          ? "ExCo Bet Sponsor"
          : `${answers.functionName} Business Unit VP`,
      tier: decision.tier,
      mode: chosenMode,
      riskTier: decision.riskTier,
      budget: answers.estimatedCost,
      roiEstimate:
        decision.tier === "T1"
          ? t1BC.dashboardSignOffs.ebitdaEffect
          : decision.tier === "T2"
          ? t2BC.directionalValue
          : decision.tier === "T3"
          ? t3Canvas.kpi1
          : `${selfServeRegistry.userCount} users assisted`,
      currentGate,
      status,
      intakeAnswers: answers,
      businessCase: businessCasePayload,
      gates,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Supabase and LocalStorage
    await saveUseCase(newCase);
    onUseCaseCreated(newCase);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    // Navigate to lifecycle simulator
    onNavigateToLifecycle(newCase.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Wizard Progress Stepper */}
      <div className="mb-8 bg-white rounded-xl p-5 shadow-sm border border-opella-border">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
          <span>STEP {step} OF 4</span>
          <span className="text-opella-forest font-bold">
            {step === 1 && "1. The 4 Questions Assessment & Initiative Framing"}
            {step === 2 && "2. Autonomous Agent Triage (Tier & Speed)"}
            {step === 3 && `3. Fill Relevant Business Case (${decision.tier})`}
            {step === 4 && "4. Mode Selection (Do it for me / With me / Enable me)"}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all duration-300 ${
                s <= step ? "bg-opella-forest" : "bg-transparent"
              } ${s < step ? "border-r border-white/50" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* ================= STEP 1: THE 4 QUESTIONS ASSESSMENT ================= */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-opella-border space-y-7">
          <div className="border-b border-opella-border pb-4">
            <h2 className="text-xl font-bold text-opella-forest flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Use Case Intake & The 4 Questions Assessment (Slide 35)
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Answer the four triage questions from the Opella playbook. An autonomous Charter Agent will evaluate your responses and route your initiative into the appropriate speed lane.
            </p>
          </div>

          {/* Basic Initiative Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                Initiative Title / Name *
              </label>
              <input
                type="text"
                placeholder="e.g. AI Content Localization Engine, S2P PO Validator, Demand Forecast Bot"
                value={answers.initiativeTitle}
                onChange={(e) => setAnswers({ ...answers, initiativeTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opella-forest text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Business Function
              </label>
              <select
                value={answers.functionName}
                onChange={(e) => setAnswers({ ...answers, functionName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-opella-forest"
              >
                <option value="M&S">Marketing & Sales (M&S)</option>
                <option value="Procurement">Procurement</option>
                <option value="Supply Chain">Supply Chain & IBP</option>
                <option value="Science">Science (R&D & Regulatory)</option>
                <option value="Manufacturing">Manufacturing & Quality (M&Q)</option>
                <option value="Finance">Finance & GBS</option>
                <option value="P&C">People & Culture (P&C / HR)</option>
                <option value="Cross-Functional">Cross-Functional / Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Accountable Business Owner (BO/PO) *
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins (Category Lead)"
                value={answers.businessOwnerName}
                onChange={(e) => setAnswers({ ...answers, businessOwnerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-opella-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Estimated Build & License Budget (€)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="10000"
                  value={answers.estimatedCost}
                  onChange={(e) => setAnswers({ ...answers, estimatedCost: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-opella-forest"
                />
                <Euro className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Target User Count
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={answers.targetUserCount}
                  onChange={(e) => setAnswers({ ...answers, targetUserCount: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-opella-forest"
                />
                <Users className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>
          </div>

          {/* The 4 Questions Cards */}
          <div className="space-y-3 pt-2 border-t border-opella-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              The 4 Questions Triage Matrix
            </h3>

            {/* Q1 */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                answers.q1_bigBetOrOver1m
                  ? "border-emerald-600 bg-emerald-50/70"
                  : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-700 text-white">Q1</span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Is it part of an AmplifAI big bet, does it change Butterfly core platforms or scope, or cost more than €1m?
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 ml-7">
                    If YES: Routes immediately to <strong>T1 · Transform</strong> (Full Business Case, Butterfly comitology, Transformation SteerCo).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, q1_bigBetOrOver1m: true })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      answers.q1_bigBetOrOver1m ? "bg-emerald-700 text-white shadow-sm" : "bg-white border text-gray-700"
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, q1_bigBetOrOver1m: false })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !answers.q1_bigBetOrOver1m ? "bg-gray-800 text-white shadow-sm" : "bg-white border text-gray-700"
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
            </div>

            {/* Q2 */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                answers.q2_approvedToolsUnder50k
                  ? "border-purple-600 bg-purple-50/70"
                  : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-700 text-white">Q2</span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Does it only use approved tools and data, configured rather than built, for under €50k?
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 ml-7">
                    If YES: Routes to <strong>Self-Serve · Register & Go</strong> (Immediate speed, skips G2–G4).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, q2_approvedToolsUnder50k: true })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      answers.q2_approvedToolsUnder50k ? "bg-purple-700 text-white shadow-sm" : "bg-white border text-gray-700"
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, q2_approvedToolsUnder50k: false })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !answers.q2_approvedToolsUnder50k ? "bg-gray-800 text-white shadow-sm" : "bg-white border text-gray-700"
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
            </div>

            {/* Q3 */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                answers.q3_provenPilotOrReach
                  ? "border-blue-600 bg-blue-50/70"
                  : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-600 text-white">Q3</span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Is value proven in a pilot, and does it need reach (2+ functions/regions, 500+ users), hub capacity or €200k–€1m?
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 ml-7">
                    If YES: Routes to <strong>T2 · Scale</strong> (Light business case, AI Portfolio Board, tranche unlocks).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, q3_provenPilotOrReach: true })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      answers.q3_provenPilotOrReach ? "bg-blue-600 text-white shadow-sm" : "bg-white border text-gray-700"
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, q3_provenPilotOrReach: false })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !answers.q3_provenPilotOrReach ? "bg-gray-800 text-white shadow-sm" : "bg-white border text-gray-700"
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
            </div>

            {/* Q4 / Default */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                !answers.q1_bigBetOrOver1m &&
                !answers.q2_approvedToolsUnder50k &&
                !answers.q3_provenPilotOrReach
                  ? "border-amber-600 bg-amber-50/70"
                  : "border-gray-200 bg-gray-50/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-600 text-white">Q4</span>
                    <h4 className="text-sm font-bold text-gray-900">
                      Otherwise: A new idea or build with a value hypothesis to test?
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 ml-7">
                    Routes to <strong>T3 · Fast Lane</strong> (1-page canvas, 10-day decision SLA, 6–8 week fail-fast MVP sprint).
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Fast Lane Fallback
                </span>
              </div>
            </div>
          </div>

          {/* ORAI Risk Checklist (Slides 35 & 69) */}
          <div className="pt-2 border-t border-opella-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-rose-600" />
              ORAI Responsible AI Screening Flags (EU AI Act)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-start gap-2 p-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={answers.risk_personalHealthData}
                  onChange={(e) => setAnswers({ ...answers, risk_personalHealthData: e.target.checked })}
                  className="mt-0.5 rounded text-opella-forest"
                />
                <span>Processes employee personal, health, patient or confidential data</span>
              </label>

              <label className="flex items-start gap-2 p-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={answers.risk_autonomousDecisions}
                  onChange={(e) => setAnswers({ ...answers, risk_autonomousDecisions: e.target.checked })}
                  className="mt-0.5 rounded text-opella-forest"
                />
                <span>Makes autonomous decisions impacting hiring, credit or regulatory safety</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-opella-border">
            <button
              onClick={handleStartAgentTriage}
              disabled={!answers.initiativeTitle}
              className="px-7 py-3 bg-opella-forest text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-opella-emerald shadow-md transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Bot className="w-4 h-4 text-emerald-300" />
              Run Autonomous Agent Triage <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: AUTONOMOUS AGENT TRIAGE ================= */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-opella-border space-y-6">
          <div className="border-b border-opella-border pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-opella-forest flex items-center gap-2">
                <Bot className="w-6 h-6 text-emerald-700 animate-pulse" />
                OpellaGPT Charter Agent Automated Triage
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                The AI Charter Agent is analyzing your intake against Butterfly governance rules, the 4 questions, and EU AI Act constraints.
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
              Automated Gate G1
            </span>
          </div>

          {/* Simulated Agent Execution Log */}
          <div className="p-4 rounded-xl bg-gray-950 text-emerald-400 font-mono text-xs space-y-2 border border-gray-800">
            <div className="flex items-center gap-2 text-white font-bold pb-1 border-b border-gray-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Opella Charter Agent Triage Engine
            </div>
            {agentLogIndex >= 0 && (
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>[1/4] Scanning Opella AI Registry for duplicate solutions... Clean.</span>
              </div>
            )}
            {agentLogIndex >= 1 && (
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>[2/4] Parsing budget (€{answers.estimatedCost.toLocaleString()}) and scope against Big Bet boundaries...</span>
              </div>
            )}
            {agentLogIndex >= 2 && (
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>[3/4] Evaluating ORAI risk parameters... Result: {decision.riskTier} Risk Tier.</span>
              </div>
            )}
            {agentLogIndex >= 3 && (
              <div className="flex items-center gap-2 text-white font-semibold pt-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>[4/4] Triage decision formulated: Assigned to <strong>{tierConfig.name}</strong>.</span>
              </div>
            )}
          </div>

          {/* Result Card */}
          <div className={`p-6 rounded-2xl border-2 ${tierConfig.colorClass.border} ${tierConfig.colorClass.bg} space-y-4`}>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
                Assigned Speed Lane & Governance Tier
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-md ${tierConfig.colorClass.badge}`}>
                {tierConfig.name}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900">{tierConfig.subtitle}</h3>
              <p className="text-xs text-gray-700 mt-1">{tierConfig.threshold}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white/80 p-3 rounded-xl border border-gray-200">
                <span className="text-gray-500 block font-semibold">Speed & Cadence</span>
                <span className="font-bold text-gray-900">{decision.speedSummary.cadence}</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-gray-200">
                <span className="text-gray-500 block font-semibold">Decision SLA</span>
                <span className="font-bold text-emerald-800">{decision.speedSummary.decisionSLA}</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-gray-200">
                <span className="text-gray-500 block font-semibold">Approval Forum</span>
                <span className="font-bold text-gray-900">{tierConfig.approvalForum}</span>
              </div>
            </div>

            {/* Rationale */}
            <div className="bg-white/90 p-3.5 rounded-xl border border-gray-200 text-xs text-gray-800 space-y-1">
              <div className="font-bold text-gray-900">Triage Decision Rationale:</div>
              {decision.reasoning.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5 text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-opella-border">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Questions
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-opella-forest text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-opella-emerald shadow-sm"
            >
              Fill Relevant Business Case ({decision.tier}) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: FILL RELEVANT BUSINESS CASE ================= */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-opella-border space-y-6">
          <div className="border-b border-opella-border pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${tierConfig.colorClass.badge}`}>
                  {decision.tier}
                </span>
                <h2 className="text-xl font-bold text-opella-forest">
                  {decision.tier === "T1" && "Full Business Case & Butterfly Dossier (Slide 38 & 74)"}
                  {decision.tier === "T2" && "Light Business Case — 1 to 2 Pages (Slide 38)"}
                  {decision.tier === "T3" && "One-Page Canvas — Fast Lane (Slide 39)"}
                  {decision.tier === "Self-Serve" && "AI Registry Line & Guardrail Certification (Slide 40)"}
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Complete the specific business case required for your {decision.tier} tier before selecting the delivery mode.
              </p>
            </div>
            <FileText className="w-8 h-8 text-gray-300 hidden sm:block" />
          </div>

          {/* DYNAMIC FORMS BASED ON TIER */}

          {/* 1. T1 FULL BUSINESS CASE */}
          {decision.tier === "T1" && (
            <div className="space-y-6 text-sm">
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <h4 className="font-bold text-emerald-950 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center">1</span>
                  1. Recurring Items (FY25–30 Bottom-Up Benefits & Run Costs)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Top Line Revenue Impact</label>
                    <input
                      type="text"
                      value={t1BC.recurringItems.topLineImpact}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          recurringItems: { ...t1BC.recurringItems, topLineImpact: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Gross Margin Impact</label>
                    <input
                      type="text"
                      value={t1BC.recurringItems.grossMarginImpact}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          recurringItems: { ...t1BC.recurringItems, grossMarginImpact: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Opex / Efficiency Savings</label>
                    <input
                      type="text"
                      value={t1BC.recurringItems.opexImpact}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          recurringItems: { ...t1BC.recurringItems, opexImpact: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">FTE Hours Freed / Repurposed</label>
                    <input
                      type="text"
                      value={t1BC.recurringItems.fteImpact}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          recurringItems: { ...t1BC.recurringItems, fteImpact: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center">2</span>
                  2. SI Non-Staff (Four Pillars: System, Infra, Cyber, Data Enablers)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">System & Infra Enablers</label>
                    <input
                      type="text"
                      value={t1BC.siNonStaff.systemEnablers}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          siNonStaff: { ...t1BC.siNonStaff, systemEnablers: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Data & Semantic Layer (Opella IQ)</label>
                    <input
                      type="text"
                      value={t1BC.siNonStaff.dataEnablers}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          siNonStaff: { ...t1BC.siNonStaff, dataEnablers: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center">3</span>
                  3. Stage Gates Cadence & Sign-Off Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Stage Gates Cadence</label>
                    <select
                      value={t1BC.projectPlanMilestones.stageGatesCadenceWeeks}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          projectPlanMilestones: {
                            ...t1BC.projectPlanMilestones,
                            stageGatesCadenceWeeks: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    >
                      <option value="4">Every 4 weeks</option>
                      <option value="6">Every 6 weeks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Expected Payback (Months)</label>
                    <input
                      type="number"
                      value={t1BC.dashboardSignOffs.paybackMonths}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          dashboardSignOffs: {
                            ...t1BC.dashboardSignOffs,
                            paybackMonths: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. T2 LIGHT BUSINESS CASE */}
          {decision.tier === "T2" && (
            <div className="space-y-5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  1. Problem Statement & Manual Bottleneck (2–3 sentences)
                </label>
                <textarea
                  rows={3}
                  value={t2BC.problemStatement}
                  onChange={(e) => setT2BC({ ...t2BC, problemStatement: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    2. Directional Value (Hours saved / speed increase)
                  </label>
                  <input
                    type="text"
                    value={t2BC.directionalValue}
                    onChange={(e) => setT2BC({ ...t2BC, directionalValue: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    3. Rough Token / Infrastructure Sizing
                  </label>
                  <input
                    type="text"
                    value={t2BC.roughTokenConsumption}
                    onChange={(e) => setT2BC({ ...t2BC, roughTokenConsumption: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. T3 ONE-PAGE CANVAS */}
          {decision.tier === "T3" && (
            <div className="space-y-5 text-sm">
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Fast-Lane 1-Page Canvas (10-Day Decision SLA)
                  </span>
                  <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                    {t3Canvas.sprintDurationWeeks}-Week MVP Sprint
                  </span>
                </div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Value Hypothesis to Test:
                </label>
                <textarea
                  rows={2}
                  value={t3Canvas.summaryAndHypothesis}
                  onChange={(e) => setT3Canvas({ ...t3Canvas, summaryAndHypothesis: e.target.value })}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg text-xs bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  The Three Success KPIs & Baseline (Slide 39)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] text-gray-500 block mb-1">KPI 1 (Speed / Quality)</span>
                    <input
                      type="text"
                      value={t3Canvas.kpi1}
                      onChange={(e) => setT3Canvas({ ...t3Canvas, kpi1: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block mb-1">KPI 2 (Accuracy / Value)</span>
                    <input
                      type="text"
                      value={t3Canvas.kpi2}
                      onChange={(e) => setT3Canvas({ ...t3Canvas, kpi2: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block mb-1">KPI 3 (Adoption Rate)</span>
                    <input
                      type="text"
                      value={t3Canvas.kpi3}
                      onChange={(e) => setT3Canvas({ ...t3Canvas, kpi3: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. SELF-SERVE REGISTRY ENTRY */}
          {decision.tier === "Self-Serve" && (
            <div className="space-y-5 text-sm">
              <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900 block mb-1">
                  Self-Service AI Registry Line (Slide 40)
                </span>
                <p className="text-xs text-purple-800">
                  Individual productivity assistant using approved software with automated guardrails.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Approved Platform / Software
                  </label>
                  <select
                    value={selfServeRegistry.approvedToolUsed}
                    onChange={(e) =>
                      setSelfServeRegistry({
                        ...selfServeRegistry,
                        approvedToolUsed: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  >
                    <option value="Copilot Studio">Microsoft Copilot Studio</option>
                    <option value="Opella GPT">Opella GPT Enterprise Tenant</option>
                    <option value="Power Automate">Power Automate AI Builder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Estimated User Count (&lt; 50 users)
                  </label>
                  <input
                    type="number"
                    value={selfServeRegistry.userCount}
                    onChange={(e) =>
                      setSelfServeRegistry({
                        ...selfServeRegistry,
                        userCount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-opella-border">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Triage
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-opella-forest text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-opella-emerald shadow-sm"
            >
              Proceed to Mode Selection <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: MODE SELECTION (G4 DECISION) ================= */}
      {step === 4 && (
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-opella-border space-y-6">
          <div className="border-b border-opella-border pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-700 text-white">
                  Gate G4 Decision
                </span>
                <h2 className="text-xl font-bold text-opella-forest">
                  Sourcing & Delivery Mode Selection (Slides 10 & 46)
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Now that your business case is established, select who builds and runs the solution: Hub-led, Shared Squad, or Function-led.
              </p>
            </div>
            <Workflow className="w-8 h-8 text-gray-300 hidden sm:block" />
          </div>

          {/* Sourcing Metaphor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Mode 1 */}
            <div
              onClick={() => setChosenMode("Mode 1")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                chosenMode === "Mode 1"
                  ? "border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/20"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    Mode 1
                  </span>
                  {decision.mode === "Mode 1" && (
                    <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-gray-900">Do it for me</h3>
                <div className="text-xs font-bold text-emerald-800 italic mt-0.5 mb-2">
                  “We ride for you”
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The hub leads delivery and run; the function defines the need, validates the outcome and owns the value.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                <strong>Best fit:</strong> Complex, cross-functional builds on the shared platform where the function has no tech capacity.
              </div>
            </div>

            {/* Mode 2 */}
            <div
              onClick={() => setChosenMode("Mode 2")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                chosenMode === "Mode 2"
                  ? "border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/20"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                    Mode 2
                  </span>
                  {decision.mode === "Mode 2" && (
                    <span className="text-[10px] bg-blue-700 text-white font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-gray-900">Do it with me</h3>
                <div className="text-xs font-bold text-blue-800 italic mt-0.5 mb-2">
                  “We ride together”
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The function leads, the hub builds with it with dedicated hub capacity and shared squads.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                <strong>Best fit:</strong> Medium complexity: requires deep business process knowledge and hub specialized engineering together.
              </div>
            </div>

            {/* Mode 3 */}
            <div
              onClick={() => setChosenMode(decision.tier === "Self-Serve" ? "Self-Service AI" : "Mode 3")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                chosenMode === "Mode 3" || chosenMode === "Self-Service AI"
                  ? "border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/20"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                    Mode 3
                  </span>
                  {(decision.mode === "Mode 3" || decision.mode === "Self-Service AI") && (
                    <span className="text-[10px] bg-purple-700 text-white font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-gray-900">
                  {decision.tier === "Self-Serve" ? "Self-Service AI" : "Enable me"}
                </h3>
                <div className="text-xs font-bold text-purple-800 italic mt-0.5 mb-2">
                  “We give you the right bike & map”
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The function frames and builds a solution it sources (external SaaS or AI Builders), the hub provides guidance & guardrails.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                <strong>Best fit:</strong> External SaaS (e.g. LEO in Procurement, Wonka) or MVPs developed autonomously by certified AI builders.
              </div>
            </div>
          </div>

          {/* Sourcing Summary Box */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1">
            <div>
              <strong>Operating Model Rule (Slide 10 & 76):</strong> A use case gets one tier and one delivery mode. The mode answers <em>“Who delivers?”</em> without changing the governance tier.
            </div>
            <div className="text-gray-500">
              *The delivery mode is confirmed at Gate G4 and reassessed before scaling at Gate G5.
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-opella-border">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Business Case
            </button>
            <button
              onClick={handleCreateUseCase}
              className="px-7 py-3 bg-opella-forest text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-opella-emerald shadow-md transition-all hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" />
              Launch into Real-Time Lifecycle Simulator
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
