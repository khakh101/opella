"use client";

import React, { useState } from "react";
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
  HelpCircle,
  FileText,
  Send,
  Building,
  Cpu,
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
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

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

    // 4 Questions (Slide 35)
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
  const modeInfo = DELIVERY_MODES_INFO[decision.mode];

  const handleNext = () => {
    if (step < 5) setStep((prev) => (prev + 1) as any);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as any);
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
      mode: decision.mode,
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

    // Save
    await saveUseCase(newCase);
    onUseCaseCreated(newCase);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    // Navigate to lifecycle view
    onNavigateToLifecycle(newCase.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Wizard Progress Stepper */}
      <div className="mb-8 bg-white rounded-xl p-5 shadow-sm border border-opella-border">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
          <span>STEP {step} OF 5</span>
          <span className="text-opella-forest font-bold">
            {step === 1 && "1. Initiative Context"}
            {step === 2 && "2. The 4 Questions Triage Router"}
            {step === 3 && "3. ORAI Risk Self-Assessment"}
            {step === 4 && "4. Assigned Speed & Delivery Mode"}
            {step === 5 && `5. Fill Relevant Business Case (${decision.tier})`}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all duration-300 ${
                s <= step ? "bg-opella-forest" : "bg-transparent"
              } ${s < step ? "border-r border-white/50" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* ================= STEP 1: CONTEXT ================= */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-opella-border space-y-6">
          <div className="border-b border-opella-border pb-4">
            <h2 className="text-xl font-bold text-opella-forest flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-700" />
              Initiative Framing & Organizational Ownership
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Every AI initiative at Opella begins with a single intake to determine ownership, scope, and strategic alignment with the Butterfly transformation program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Initiative Title / Name *
              </label>
              <input
                type="text"
                placeholder="e.g. AI Content Localization Engine, S2P PO Validator, Demand Forecast Bot"
                value={answers.initiativeTitle}
                onChange={(e) =>
                  setAnswers({ ...answers, initiativeTitle: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opella-forest focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Business Function
              </label>
              <select
                value={answers.functionName}
                onChange={(e) =>
                  setAnswers({ ...answers, functionName: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opella-forest text-sm bg-white"
              >
                <option value="M&S">Marketing & Sales (M&S)</option>
                <option value="Procurement">Procurement</option>
                <option value="Supply Chain">Supply Chain & IBP</option>
                <option value="Science">Science (R&D & Regulatory)</option>
                <option value="Manufacturing">Manufacturing & Quality (M&Q)</option>
                <option value="Finance">Finance & GBS</option>
                <option value="P&C">People & Culture (P&C / HR)</option>
                <option value="Legal">Legal & Ethics (LEX)</option>
                <option value="Cross-Functional">Cross-Functional / Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Geographic Scope / Region
              </label>
              <select
                value={answers.region}
                onChange={(e) =>
                  setAnswers({ ...answers, region: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opella-forest text-sm bg-white"
              >
                <option value="Global">Global</option>
                <option value="NA">North America (NA)</option>
                <option value="EULA">Europe & Latin America (EULA)</option>
                <option value="AMEA">Asia, Middle East & Africa (AMEA)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Accountable Business Owner (BO/PO) *
              </label>
              <input
                type="text"
                placeholder="Name of Business Owner"
                value={answers.businessOwnerName}
                onChange={(e) =>
                  setAnswers({ ...answers, businessOwnerName: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opella-forest text-sm"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Rule: No named PO means automatic rejection at Framing.
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Local AI Catalyst (Relay)
              </label>
              <input
                type="text"
                placeholder="Name of function AI Catalyst"
                value={answers.aiCatalystName}
                onChange={(e) =>
                  setAnswers({ ...answers, aiCatalystName: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opella-forest text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Rough Estimated Spend / Build Envelope (€)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="10000"
                  value={answers.estimatedCost}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      estimatedCost: Number(e.target.value),
                    })
                  }
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opella-forest text-sm"
                />
                <Euro className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                &lt;€50k: Self-serve · €50k-€200k: Fast Lane · €200k-€1M: Scale · &gt;€1M: Big Bet
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Target User Count
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={answers.targetUserCount}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      targetUserCount: Number(e.target.value),
                    })
                  }
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opella-forest text-sm"
                />
                <Users className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                500+ users indicates enterprise reach (T2 Scale).
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Does this align with one of the 6 AmplifAI Big Bets? (Optional)
              </label>
              <select
                value={answers.mappedBigBet || ""}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    mappedBigBet: (e.target.value || undefined) as any,
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opella-forest text-sm bg-white"
              >
                <option value="">No / Standalone functional initiative</option>
                {BIG_BETS.map((bet) => (
                  <option key={bet.id} value={bet.id}>
                    {bet.name} — {bet.leadStream}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-opella-border">
            <button
              onClick={handleNext}
              disabled={!answers.initiativeTitle}
              className="px-6 py-2.5 bg-opella-forest text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-opella-emerald transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Next: The 4 Questions Triage Router <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: THE 4 QUESTIONS (SLIDE 35) ================= */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-opella-border space-y-6">
          <div className="border-b border-opella-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-opella-forest flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  The 4 Questions Triage Router (Slide 35)
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Answer the four cascading questions from the Opella playbook to determine your initiative’s designated speed lane and governance tier.
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block">Current Triage</span>
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${tierConfig.colorClass.badge}`}>
                  {tierConfig.name}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Question 1 */}
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
                    <h3 className="text-sm font-bold text-gray-900">
                      Is it part of an AmplifAI big bet, does it change Butterfly core platforms or scope, or cost more than €1m?
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 ml-7">
                    If YES: Routes immediately to <strong>T1 · Transform</strong> (Full Business Case, Butterfly comitology, Transformation SteerCo).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, q1_bigBetOrOver1m: true })
                    }
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      answers.q1_bigBetOrOver1m
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, q1_bigBetOrOver1m: false })
                    }
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !answers.q1_bigBetOrOver1m
                        ? "bg-gray-800 text-white shadow-sm"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
            </div>

            {/* Question 2 */}
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
                    <h3 className="text-sm font-bold text-gray-900">
                      Does it only use approved tools and data, configured rather than built, for under €50k?
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 ml-7">
                    If YES (and not T1): Routes directly to <strong>Self-Serve · Register & Go</strong> (Skips G2–G4, immediate speed, zero committee delays).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, q2_approvedToolsUnder50k: true })
                    }
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      answers.q2_approvedToolsUnder50k
                        ? "bg-purple-700 text-white shadow-sm"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, q2_approvedToolsUnder50k: false })
                    }
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !answers.q2_approvedToolsUnder50k
                        ? "bg-gray-800 text-white shadow-sm"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
            </div>

            {/* Question 3 */}
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
                    <h3 className="text-sm font-bold text-gray-900">
                      Is value proven in a pilot, and does it need reach (2+ functions/regions, 500+ users), hub capacity or €200k–€1m?
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 ml-7">
                    If YES: Routes to <strong>T2 · Scale</strong> (Light business case 1–2 pages, biweekly AI Portfolio Board, tranche releases).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, q3_provenPilotOrReach: true })
                    }
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      answers.q3_provenPilotOrReach
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, q3_provenPilotOrReach: false })
                    }
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !answers.q3_provenPilotOrReach
                        ? "bg-gray-800 text-white shadow-sm"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
            </div>

            {/* Question 4 / Default */}
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
                    <h3 className="text-sm font-bold text-gray-900">
                      Otherwise: A new idea or build with a value hypothesis to test?
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 ml-7">
                    Routes to <strong>T3 · Fast Lane</strong> (One-page canvas, 10-day decision SLA, 6–8 week fail-fast MVP sprint, ring-fenced AmplifAI envelope).
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Fast Lane Fallback
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Mode Parameters */}
          <div className="pt-4 border-t border-opella-border">
            <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-3">
              Delivery Capacity & Sourcing Parameters (Slides 10 & 11)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Technical Build Complexity
                </label>
                <select
                  value={answers.techComplexity}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      techComplexity: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white"
                >
                  <option value="Low">Low (Configured / Prompts / Low-code)</option>
                  <option value="Medium">Medium (Business + Hub skills)</option>
                  <option value="High">High (Shared Data Platform / Custom Models)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Function Tech Capacity
                </label>
                <select
                  value={answers.functionTechCapacity}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      functionTechCapacity: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white"
                >
                  <option value="None">None (Relies 100% on Hub)</option>
                  <option value="Medium">Medium (Dedicated function team + Hub slots)</option>
                  <option value="High">High (Certified AI Builders / External Integrator)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Funding Source
                </label>
                <select
                  value={answers.fundingSource}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      fundingSource: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white"
                >
                  <option value="Central Hub">Central Hub (Big Bet / Envelope)</option>
                  <option value="Co-funded">Co-funded (Hub + Function)</option>
                  <option value="Function Budget">Function Operational Budget</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-opella-border">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-opella-forest text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-opella-emerald shadow-sm"
            >
              Next: ORAI Risk Self-Assessment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: ORAI RISK SCREENING ================= */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-opella-border space-y-6">
          <div className="border-b border-opella-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-opella-forest flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-600" />
                  ORAI Risk Self-Assessment (Slides 35, 69, 70)
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  In parallel with the 4 intake questions, every initiative undergoes an automated risk screening based on the EU AI Act & Opella Responsible AI framework.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block">Assessed Risk Tier</span>
                <span
                  className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                    decision.riskTier === "High"
                      ? "bg-rose-100 text-rose-800 border border-rose-300"
                      : decision.riskTier === "Medium"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  }`}
                >
                  {decision.riskTier} Risk
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "risk_personalHealthData",
                title: "1. Personal, Health, Patient, or Highly Confidential Data",
                desc: "Does the solution process employee personal data, health/patient records, clinical trial secrets, or GDPR-sensitive data?",
                isHighRisk: true,
              },
              {
                id: "risk_autonomousDecisions",
                title: "2. Autonomous or High-Stakes Decisions (EU AI Act)",
                desc: "Does the AI act autonomously in determining hiring, employee performance, credit, patient safety, or statutory financial reports?",
                isHighRisk: true,
              },
              {
                id: "risk_coreProdWriteBack",
                title: "3. Direct Production System Write-Backs",
                desc: "Does the agent execute direct write or update transactions into core ERP (SAP), CRM, or clinical database backends without manual gatekeeper?",
                isHighRisk: false,
              },
              {
                id: "risk_externalOutputNoReview",
                title: "4. External Customer / Healthcare Professional Communications",
                desc: "Are AI generated outputs sent directly to consumers, patients, HCPs, or regulatory authorities without human-in-the-loop validation?",
                isHighRisk: false,
              },
              {
                id: "risk_unapprovedSaaSOrCustomModel",
                title: "5. Unapproved SaaS or External 3rd Party Model",
                desc: "Does the use case plan to connect to an external SaaS vendor or run foundation models outside Opella's Azure/Databricks tenant?",
                isHighRisk: false,
              },
            ].map((q) => {
              const checked = (answers as any)[q.id];
              return (
                <div
                  key={q.id}
                  onClick={() =>
                    setAnswers({ ...answers, [q.id]: !checked })
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    checked
                      ? q.isHighRisk
                        ? "border-rose-400 bg-rose-50/70"
                        : "border-amber-400 bg-amber-50/70"
                      : "border-gray-200 bg-gray-50/40 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}} // handled by div
                    className="mt-1 h-4 w-4 rounded text-opella-forest focus:ring-opella-forest"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {q.title}
                      </span>
                      {q.isHighRisk && (
                        <span className="text-[10px] bg-rose-200 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                          High Risk Flag
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{q.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk Guidance Box */}
          <div
            className={`p-4 rounded-xl border text-xs ${
              decision.riskTier === "High"
                ? "bg-rose-50 border-rose-300 text-rose-900"
                : decision.riskTier === "Medium"
                ? "bg-amber-50 border-amber-300 text-amber-900"
                : "bg-emerald-50 border-emerald-300 text-emerald-900"
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="w-4 h-4" />
              ORAI Governance Routing Notice
            </div>
            {decision.riskTier === "High" && (
              <p>
                <strong>High Risk Detected:</strong> Full in-depth review by LEX (Legal), CISO, and Data & AI is mandatory before any data access or build. <em>Notice: High-risk flags automatically route out of Fast Lane into T1 Transform governance.</em>
              </p>
            )}
            {decision.riskTier === "Medium" && (
              <p>
                <strong>Medium Risk:</strong> Requires a 5-day light review by the AI Governance lead and Design Authority prior to production deployment.
              </p>
            )}
            {decision.riskTier === "Low" && (
              <p>
                <strong>Low Risk:</strong> Standard platform guardrails apply (auto-expiry, license cap, registry logging). No bespoke legal committee needed.
              </p>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-opella-border">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-opella-forest text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-opella-emerald shadow-sm"
            >
              View Speed & Mode Results <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: SPEED & DELIVERY MODE EVALUATION RESULT ================= */}
      {step === 4 && (
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-opella-border space-y-6">
          <div className="border-b border-opella-border pb-4">
            <h2 className="text-xl font-bold text-opella-forest flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              Assigned Speed & Delivery Mode Recommendation
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Based on the 4 intake questions, risk screening, and organizational parameters, the Opella Operating Model has assigned the following governance track:
            </p>
          </div>

          {/* Cards for Assigned Tier & Speed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tier & Speed Card */}
            <div className={`p-5 rounded-2xl border-2 ${tierConfig.colorClass.border} ${tierConfig.colorClass.bg} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
                  Assigned Speed Lane
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${tierConfig.colorClass.badge}`}>
                  {tierConfig.name}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {tierConfig.subtitle}
              </h3>
              <div className="space-y-2 text-xs text-gray-700 pt-1">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Speed & Cadence:</strong> {decision.speedSummary.cadence}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Send className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Decision SLA:</strong> {decision.speedSummary.decisionSLA}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Approval Forum:</strong> {tierConfig.approvalForum}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Euro className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Funding Mechanism:</strong> {tierConfig.fundingMechanism}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Sponsor Level:</strong> {tierConfig.sponsorLevel}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Mode Card */}
            <div className="p-5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
                  Delivery Mode (Slide 10)
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-800 text-white">
                  {modeInfo.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-emerald-950">
                  {modeInfo.motto}
                </h3>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                {modeInfo.description}
              </p>
              <div className="text-xs bg-white/80 p-3 rounded-lg border border-emerald-200 text-emerald-900 space-y-1">
                <div><strong>Fit:</strong> {modeInfo.bestFor}</div>
                <div><strong>Split:</strong> {modeInfo.ownershipSplit}</div>
              </div>
            </div>
          </div>

          {/* Rationale explanation list */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Routing Logic Breakdown
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-700">
              {decision.reasoning.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
              {decision.riskReasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between pt-4 border-t border-opella-border">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-opella-forest text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-opella-emerald shadow-sm"
            >
              Fill Relevant Business Case ({decision.tier}) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 5: DYNAMIC BUSINESS CASE FORM ================= */}
      {step === 5 && (
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-opella-border space-y-6">
          <div className="border-b border-opella-border pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${tierConfig.colorClass.badge}`}>
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
                {decision.tier === "T1" && "Detailed financial breakdown, multi-year recurring benefits, staffing, and SteerCo sign-offs."}
                {decision.tier === "T2" && "Directional value, rough token sizing, existing data fit, and named owner triage."}
                {decision.tier === "T3" && "Agile 1-page canvas: 3 KPIs, baseline, 6–8 week MVP sprint scope, and fail-fast kill date."}
                {decision.tier === "Self-Serve" && "Light registry entry: approved tool check, <€50k cost cap, and platform guardrails confirmation."}
              </p>
            </div>
            <FileText className="w-8 h-8 text-gray-300 hidden sm:block" />
          </div>

          {/* DYNAMIC FORM RENDER */}

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
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">FY25–30 Cumulative Summary & Target P&L Line</label>
                    <input
                      type="text"
                      value={t1BC.recurringItems.fy25_30BenefitsSummary}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          recurringItems: { ...t1BC.recurringItems, fy25_30BenefitsSummary: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SI Non-Staff */}
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
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Linked Butterfly Initiative IDs (Avoid double counting)</label>
                    <input
                      type="text"
                      value={t1BC.siNonStaff.linkedInitiativeIds}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          siNonStaff: { ...t1BC.siNonStaff, linkedInitiativeIds: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Project Plan & Sign-Offs */}
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
                  <div className="sm:col-span-2 pt-2">
                    <span className="block text-xs font-semibold text-gray-700 mb-2">Required Sign-Offs:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { key: "financeSignOff", label: "Finance BP" },
                        { key: "digitalSignOff", label: "Data & AI Hub" },
                        { key: "streamLeadSignOff", label: "Stream Lead" },
                        { key: "controlTowerSignOff", label: "Control Tower" },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                          <input
                            type="checkbox"
                            checked={(t1BC.dashboardSignOffs as any)[item.key]}
                            onChange={(e) =>
                              setT1BC({
                                ...t1BC,
                                dashboardSignOffs: {
                                  ...t1BC.dashboardSignOffs,
                                  [item.key]: e.target.checked,
                                },
                              })
                            }
                            className="rounded text-opella-forest"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
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
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    4. Estimated AI Builder / Eng Days
                  </label>
                  <input
                    type="number"
                    value={t2BC.estimatedBuilderDays}
                    onChange={(e) => setT2BC({ ...t2BC, estimatedBuilderDays: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    5. Existing Data & Platform Fit
                  </label>
                  <select
                    value={t2BC.existingDataFit.platformType}
                    onChange={(e) =>
                      setT2BC({
                        ...t2BC,
                        existingDataFit: {
                          ...t2BC.existingDataFit,
                          platformType: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 border rounded-lg text-xs bg-white"
                  >
                    <option value="Existing Hub Platform">Existing Hub Platform (Databricks / Azure)</option>
                    <option value="Low-Code/No-Code">Governed Low-Code / PowerPlatform</option>
                    <option value="SaaS Integration">Enterprise Approved SaaS Integration</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                <div>
                  <strong>AI Portfolio Board Single-Step Triage:</strong> T2 dossiers are reviewed biweekly by CDO + CFO.
                </div>
                <span className="font-semibold">{t2BC.governance.targetUserCount} Target Users</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Fail-Fast Kill or Scale Date (End of Sprint)
                  </label>
                  <input
                    type="text"
                    value={t3Canvas.killOrScaleDate}
                    onChange={(e) => setT3Canvas({ ...t3Canvas, killOrScaleDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Assigned AI Builder / Catalyst
                  </label>
                  <input
                    type="text"
                    value={t3Canvas.assignedBuilderOrCatalyst}
                    onChange={(e) => setT3Canvas({ ...t3Canvas, assignedBuilderOrCatalyst: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
                  <input
                    type="checkbox"
                    checked={t3Canvas.registryReuseCheckCompleted}
                    onChange={(e) => setT3Canvas({ ...t3Canvas, registryReuseCheckCompleted: e.target.checked })}
                    className="rounded text-opella-forest"
                  />
                  <span>Registry Reuse Check Completed: Checked against existing solutions to avoid duplicate work.</span>
                </label>
              </div>
            </div>
          )}

          {/* 4. SELF-SERVE REGISTRY ENTRY */}
          {decision.tier === "Self-Serve" && (
            <div className="space-y-5 text-sm">
              <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
                    Self-Service AI Registry Line (Slide 40)
                  </span>
                  <span className="text-xs bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded">
                    Skips G2–G4 (Direct Access)
                  </span>
                </div>
                <p className="text-xs text-purple-800">
                  You are registering an individual/team productivity tool using approved software. No committee approval is needed; automated audit and token monitors protect platform integrity.
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
                    <option value="Approved SaaS AI">Approved SaaS Native AI Feature</option>
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

              <div>
                <span className="block text-xs font-bold text-gray-800 mb-2">
                  Self-Serve Guardrail Checklist (Must accept all to proceed):
                </span>
                <div className="space-y-2 text-xs">
                  {[
                    { key: "noPersonalOrHealthData", label: "No personal, health, or patient data without OR.AI clearance" },
                    { key: "noProdSystemConnection", label: "No connection or write-back to production databases / systems" },
                    { key: "noExternalSharingWithoutReview", label: "No external sharing of raw outputs without human validation" },
                    { key: "autoExpiryAndCostCapsAccepted", label: "Auto-expiry and annual cost cap (<€50k) accepted" },
                    { key: "listedInRegistry", label: "Listed publicly in the Opella AI Registry for visibility" },
                  ].map((g) => (
                    <label key={g.key} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(selfServeRegistry.guardrailsConfirmed as any)[g.key]}
                        onChange={(e) =>
                          setSelfServeRegistry({
                            ...selfServeRegistry,
                            guardrailsConfirmed: {
                              ...selfServeRegistry.guardrailsConfirmed,
                              [g.key]: e.target.checked,
                            },
                          })
                        }
                        className="rounded text-opella-forest"
                      />
                      <span className="text-gray-700">{g.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-5 border-t border-opella-border">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Speed & Mode
            </button>
            <button
              onClick={handleCreateUseCase}
              className="px-7 py-3 bg-opella-forest text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-opella-emerald shadow-md transition-all hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" />
              Register & Launch into Lifecycle (Gate G1)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
