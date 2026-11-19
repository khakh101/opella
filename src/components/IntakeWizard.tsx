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
  Cpu,
  UserCheck,
  RotateCcw,
  Globe,
  Sliders,
  ChevronDown,
  Layers,
  Info,
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
import {
  BIG_BETS,
  TIER_CONFIG,
  DELIVERY_MODES_INFO,
  INITIAL_GATES,
  MODE_DEEP_DIVES,
  TIER_DEEP_DIVES,
} from "@/lib/constants";
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
    description: "",
    targetUserGroupDescription: "",
    estimatedValueDescription: "",
    technologyProposed: "",
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

  // Step 1 Active Collection Confirmation States
  const [qQuestionsConfirmed, setQQuestionsConfirmed] = useState<boolean>(false);
  const [oraiConfirmed, setOraiConfirmed] = useState<boolean>(false);

  // Live item collection checks (5 mandatory items)
  const item1Collected = Boolean(answers.initiativeTitle?.trim());
  const item2Collected = Boolean(answers.description?.trim());
  const item3Collected = Boolean(answers.targetUserGroupDescription?.trim());
  const item4Collected = qQuestionsConfirmed;
  const item5Collected = oraiConfirmed;

  const collectedCount = [
    item1Collected,
    item2Collected,
    item3Collected,
    item4Collected,
    item5Collected,
  ].filter(Boolean).length;
  const totalCount = 5;
  const collectionPercent = Math.round((collectedCount / totalCount) * 100);
  const isStep1Valid = collectedCount === totalCount;

  // Presets & Reset Handlers for live demo collection
  const handleLoadPreset = (preset: "GIDE" | "IBP" | "WONKA") => {
    if (preset === "GIDE") {
      setAnswers({
        ...answers,
        initiativeTitle: "GIDE / BOWIE Procurement Agent",
        description:
          "Shifts Opella procurement from manual S2P steps to agentic execution. BOWIE agent automatically evaluates supplier quotes against commercial contracts, checks internal compliance rules, and creates SAP Purchase Orders within 48 hours.",
        targetUserGroupDescription:
          "1,800 Procurement buyers, category directors, and functional spenders across EULA, NA, and AMEA regions.",
        estimatedValueDescription:
          "€3.8M net run-rate EBITDA savings; 42,000 manual buyer hours repurposed; 75% touchless PO rate.",
        technologyProposed:
          "Azure GenAI (GPT-4o), LangChain Agent Orchestrator, SAP S/4HANA OData APIs, Databricks.",
        functionName: "Procurement",
        region: "Global",
        businessOwnerName: "Sarah Chen (Global Head of S2P)",
        businessOwnerEmail: "sarah.chen@opella.com",
        estimatedCost: 1450000,
        targetUserCount: 1800,
        q1_bigBetOrOver1m: true,
        q2_approvedToolsUnder50k: false,
        q3_provenPilotOrReach: true,
        q4_newHypothesis: false,
        risk_personalHealthData: false,
        risk_autonomousDecisions: false,
        risk_coreProdWriteBack: true,
        risk_externalOutputNoReview: false,
        risk_unapprovedSaaSOrCustomModel: false,
        techComplexity: "High",
        functionTechCapacity: "Medium",
        fundingSource: "Central Hub",
      });
      setQQuestionsConfirmed(true);
      setOraiConfirmed(true);
    } else if (preset === "IBP") {
      setAnswers({
        ...answers,
        initiativeTitle: "IBP Demand Sensing & Replenishment Agent",
        description:
          "Consolidates weekly demand signals across 28 regional warehouse spreadsheets, ERP demand tables, and promotional calendars to predict stockout risks 14 days in advance.",
        targetUserGroupDescription:
          "450 Supply Chain planners, regional demand managers, and plant logistics directors across Europe and NA.",
        estimatedValueDescription:
          "-€1.5M working capital reduction; 25 hours saved per analyst weekly; 60% turnaround time improvement.",
        technologyProposed:
          "Azure GenAI, Snowflake Data Mart, PowerBI Embedded, SAP IBP OData.",
        functionName: "Supply Chain",
        region: "Global",
        businessOwnerName: "Marc Delon (Supply Chain VP)",
        businessOwnerEmail: "marc.delon@opella.com",
        estimatedCost: 420000,
        targetUserCount: 450,
        q1_bigBetOrOver1m: false,
        q2_approvedToolsUnder50k: false,
        q3_provenPilotOrReach: true,
        q4_newHypothesis: false,
        risk_personalHealthData: false,
        risk_autonomousDecisions: false,
        risk_coreProdWriteBack: false,
        risk_externalOutputNoReview: false,
        risk_unapprovedSaaSOrCustomModel: false,
        techComplexity: "Medium",
        functionTechCapacity: "Medium",
        fundingSource: "Co-funded",
      });
      setQQuestionsConfirmed(true);
      setOraiConfirmed(true);
    } else if (preset === "WONKA") {
      setAnswers({
        ...answers,
        initiativeTitle: "WONKA Regulatory Claim Substantiation Pilot",
        description:
          "Autonomous document intelligence agent to cross-reference cosmetic and OTC marketing claims against local health authority regulatory guidance and clinical trial dossiers.",
        targetUserGroupDescription:
          "65 Regulatory affairs specialists, legal counsels, and brand compliance managers.",
        estimatedValueDescription:
          "Accelerates claim review from 7 days to <24h with 94% first-time accuracy.",
        technologyProposed:
          "Copilot Studio + Azure Document Intelligence, Opella GPT prompt layer.",
        functionName: "Science",
        region: "EULA",
        businessOwnerName: "Thomas Brun (Regulatory Director)",
        businessOwnerEmail: "thomas.brun@opella.com",
        estimatedCost: 95000,
        targetUserCount: 65,
        q1_bigBetOrOver1m: false,
        q2_approvedToolsUnder50k: false,
        q3_provenPilotOrReach: false,
        q4_newHypothesis: true,
        risk_personalHealthData: false,
        risk_autonomousDecisions: false,
        risk_coreProdWriteBack: false,
        risk_externalOutputNoReview: false,
        risk_unapprovedSaaSOrCustomModel: false,
        techComplexity: "Low",
        functionTechCapacity: "High",
        fundingSource: "Function Budget",
      });
      setQQuestionsConfirmed(true);
      setOraiConfirmed(true);
    }
  };

  const handleResetIntake = () => {
    setAnswers({
      ...answers,
      initiativeTitle: "",
      description: "",
      targetUserGroupDescription: "",
      estimatedValueDescription: "",
      technologyProposed: "",
      businessOwnerName: "",
      businessOwnerEmail: "",
      estimatedCost: 150000,
      targetUserCount: 100,
      q1_bigBetOrOver1m: false,
      q2_approvedToolsUnder50k: false,
      q3_provenPilotOrReach: false,
      q4_newHypothesis: true,
      risk_personalHealthData: false,
      risk_autonomousDecisions: false,
      risk_coreProdWriteBack: false,
      risk_externalOutputNoReview: false,
      risk_unapprovedSaaSOrCustomModel: false,
    });
    setQQuestionsConfirmed(false);
    setOraiConfirmed(false);
  };

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
        answers.description ||
        (decision.tier === "T1"
          ? t1BC.recurringItems.fy25_30BenefitsSummary
          : decision.tier === "T2"
          ? t2BC.problemStatement
          : decision.tier === "T3"
          ? t3Canvas.summaryAndHypothesis
          : selfServeRegistry.purposeSummary),
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
        answers.estimatedValueDescription ||
        (decision.tier === "T1"
          ? t1BC.dashboardSignOffs.ebitdaEffect
          : decision.tier === "T2"
          ? t2BC.directionalValue
          : decision.tier === "T3"
          ? t3Canvas.kpi1
          : `${selfServeRegistry.userCount} users assisted`),
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

      {/* ================= STEP 1: THE 4 QUESTIONS ASSESSMENT & ACTIVE INTAKE COLLECTION ================= */}
      {step === 1 && (
        <div className="space-y-6">
          {/* 📍 YOU ARE HERE & INTERACTIVE COLLECTION STATION */}
          <div className="bg-gradient-to-br from-[#0d2818] via-[#0b3d1c] to-[#04471c] rounded-2xl p-6 text-white shadow-lg space-y-6 border border-emerald-700/50">
            {/* Station Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/20 pb-4">
              <div className="flex items-start gap-3">
                <span className="px-3 py-1 rounded-lg bg-amber-400 text-gray-950 font-black text-xs flex items-center gap-1.5 shadow-md shrink-0 mt-0.5">
                  <span>📍</span>
                  <span>YOU ARE HERE</span>
                </span>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                    Phase 1: Framing · Gate G1 Candidate Station
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Front Door Intake & 4-Question Playbook Assessment
                  </h3>
                  <p className="text-xs text-white/70 mt-0.5 max-w-2xl">
                    Actively collect and verify the 5 mandatory governance items below before the autonomous AI Charter Agent can formulate the comitology triage.
                  </p>
                </div>
              </div>

              {/* Demo Quick-Fill Presets & Reset */}
              <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                <div className="flex items-center gap-1.5 bg-black/30 border border-emerald-400/30 rounded-xl p-1 text-xs">
                  <span className="text-[11px] font-bold text-amber-300 px-2 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-300" /> Quick-Fill Demo:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset("GIDE")}
                    className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>GIDE</span>
                    <span className="text-[9px] bg-black/30 px-1 rounded text-emerald-200">T1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset("IBP")}
                    className="px-2.5 py-1 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-[11px] transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>IBP</span>
                    <span className="text-[9px] bg-black/30 px-1 rounded text-blue-200">T2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset("WONKA")}
                    className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-bold text-[11px] transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>WONKA</span>
                    <span className="text-[9px] bg-black/30 px-1 rounded text-amber-200">T3</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleResetIntake}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/10 shadow-sm"
                  title="Reset to 0/5 collected to demonstrate step-by-step collection"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset (0/5)
                </button>
              </div>
            </div>

            {/* Live Progress Meter */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-200 flex items-center gap-2">
                  <span>Intake Collection Progress:</span>
                  <span className="font-mono text-white text-sm font-black">
                    {collectedCount} of {totalCount} Items Collected ({collectionPercent}%)
                  </span>
                </span>
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                    isStep1Valid
                      ? "bg-emerald-400 text-emerald-950 shadow-sm"
                      : "bg-amber-400/25 text-amber-200 border border-amber-400/40"
                  }`}
                >
                  {isStep1Valid ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-950 stroke-[3]" />
                      <span>Ready for Autonomous Agent Triage</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      <span>{totalCount - collectedCount} Mandatory Items Required</span>
                    </>
                  )}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isStep1Valid ? "bg-emerald-400" : "bg-gradient-to-r from-amber-400 to-emerald-400"
                  }`}
                  style={{ width: `${collectionPercent}%` }}
                />
              </div>

              {/* Quick Status Pill Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[11px]">
                <div className={`px-2 py-1 rounded-lg border text-center font-semibold truncate ${item1Collected ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/30" : "bg-white/5 text-white/50 border-white/10"}`}>
                  1. Title {item1Collected ? "✓" : "●"}
                </div>
                <div className={`px-2 py-1 rounded-lg border text-center font-semibold truncate ${item2Collected ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/30" : "bg-white/5 text-white/50 border-white/10"}`}>
                  2. Description {item2Collected ? "✓" : "●"}
                </div>
                <div className={`px-2 py-1 rounded-lg border text-center font-semibold truncate ${item3Collected ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/30" : "bg-white/5 text-white/50 border-white/10"}`}>
                  3. Users {item3Collected ? "✓" : "●"}
                </div>
                <div className={`px-2 py-1 rounded-lg border text-center font-semibold truncate ${item4Collected ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/30" : "bg-white/5 text-white/50 border-white/10"}`}>
                  4. 4 Questions {item4Collected ? "✓" : "●"}
                </div>
                <div className={`px-2 py-1 rounded-lg border text-center font-semibold truncate ${item5Collected ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/30" : "bg-white/5 text-white/50 border-white/10"}`}>
                  5. ORAI Screening {item5Collected ? "✓" : "●"}
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* PREREQUISITE COLLECTION WORKSPACE: 5 MANDATORY ITEMS + OPTIONAL */}
            {/* ----------------------------------------------------------------- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-white/80 border-b border-white/15 pb-2">
                <span className="font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Mandatory Prerequisites to Collect (Gate G1 Comitology Readiness):
                </span>
                <span className="text-[11px] text-white/60">
                  Fill fields below to verify and complete each item
                </span>
              </div>

              {/* CARD 1: INITIATIVE TITLE & SCOPE */}
              <div
                className={`rounded-xl p-5 transition-all border ${
                  item1Collected
                    ? "bg-white/10 border-emerald-400/40 shadow-sm"
                    : "bg-black/30 border-amber-400/50 shadow-md ring-1 ring-amber-400/20"
                } space-y-3.5`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/15 text-emerald-200 border border-white/10">
                        Business Owner / AI Catalyst
                      </span>
                      <span className="text-[10px] text-white/60">Front Door Identity</span>
                    </div>
                    <h4 className="font-bold text-white text-base">
                      1. Initiative Title & Organizational Scope *
                    </h4>
                  </div>
                  {item1Collected ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1 shadow-sm shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Collected & Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 font-bold text-xs flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" /> Action Required (Mandatory)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-emerald-200 uppercase tracking-wider mb-1">
                      Initiative Title / Name * <span className="text-amber-300">(Mandatory)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GIDE / BOWIE Procurement Agent, Content Localization Engine, Demand Forecast Bot"
                      value={answers.initiativeTitle}
                      onChange={(e) => setAnswers({ ...answers, initiativeTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-200 uppercase tracking-wider mb-1">
                      Business Function
                    </label>
                    <select
                      value={answers.functionName}
                      onChange={(e) => setAnswers({ ...answers, functionName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    >
                      <option value="Procurement">Procurement</option>
                      <option value="M&S">Marketing & Sales (M&S)</option>
                      <option value="Supply Chain">Supply Chain & IBP</option>
                      <option value="Science">Science (R&D & Regulatory)</option>
                      <option value="Manufacturing">Manufacturing & Quality (M&Q)</option>
                      <option value="Finance">Finance & GBS</option>
                      <option value="P&C">People & Culture (P&C / HR)</option>
                      <option value="Cross-Functional">Cross-Functional / Enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-200 uppercase tracking-wider mb-1">
                      Geographic Region
                    </label>
                    <select
                      value={answers.region}
                      onChange={(e) => setAnswers({ ...answers, region: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    >
                      <option value="Global">Global Enterprise</option>
                      <option value="EULA">Europe (EULA)</option>
                      <option value="NA">North America</option>
                      <option value="AMEA">AMEA</option>
                      <option value="LatAm">Latin America</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-emerald-200 uppercase tracking-wider mb-1">
                      Accountable Business Owner (BO / PO)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Chen (Global Head of S2P) or Named Functional Lead"
                      value={answers.businessOwnerName}
                      onChange={(e) => setAnswers({ ...answers, businessOwnerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: OPERATIONAL PROBLEM & DESCRIPTION */}
              <div
                className={`rounded-xl p-5 transition-all border ${
                  item2Collected
                    ? "bg-white/10 border-emerald-400/40 shadow-sm"
                    : "bg-black/30 border-amber-400/50 shadow-md ring-1 ring-amber-400/20"
                } space-y-3.5`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/15 text-emerald-200 border border-white/10">
                        Function Domain Lead
                      </span>
                      <span className="text-[10px] text-white/60">Business Friction Context</span>
                    </div>
                    <h4 className="font-bold text-white text-base">
                      2. Operational Problem & Intended Solution (Description) *
                    </h4>
                  </div>
                  {item2Collected ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1 shadow-sm shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Collected & Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 font-bold text-xs flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" /> Action Required (Mandatory)
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                      Detailed Use Case Description * <span className="text-amber-300">(Mandatory)</span>
                    </label>
                    <span className="text-[11px] text-white/60">
                      Current manual friction, baseline latency, and intended AI mechanism
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="e.g. Shifts Opella procurement from manual S2P steps to agentic execution. BOWIE agent automatically evaluates supplier quotes against commercial contracts, checks internal compliance rules, and creates SAP Purchase Orders within 48 hours."
                    value={answers.description || ""}
                    onChange={(e) => setAnswers({ ...answers, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs font-normal leading-relaxed focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* CARD 3: TARGET USERS & REACH SCOPE */}
              <div
                className={`rounded-xl p-5 transition-all border ${
                  item3Collected
                    ? "bg-white/10 border-emerald-400/40 shadow-sm"
                    : "bg-black/30 border-amber-400/50 shadow-md ring-1 ring-amber-400/20"
                } space-y-3.5`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/15 text-emerald-200 border border-white/10">
                        Business Function & Change Lead
                      </span>
                      <span className="text-[10px] text-white/60">User Community & Adoption</span>
                    </div>
                    <h4 className="font-bold text-white text-base">
                      3. Target User Personas & Enterprise Reach (Who are the users?) *
                    </h4>
                  </div>
                  {item3Collected ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1 shadow-sm shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Collected & Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 font-bold text-xs flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" /> Action Required (Mandatory)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-emerald-200 uppercase tracking-wider mb-1">
                      Who Are The Users? * <span className="text-amber-300">(Mandatory)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1,800 Procurement buyers, category directors, and functional spenders across EULA, NA, and AMEA regions"
                      value={answers.targetUserGroupDescription || ""}
                      onChange={(e) => setAnswers({ ...answers, targetUserGroupDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-200 uppercase tracking-wider mb-1">
                      Estimated User Headcount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={answers.targetUserCount}
                        onChange={(e) => setAnswers({ ...answers, targetUserCount: Number(e.target.value) })}
                        className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      />
                      <Users className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 4: PLAYBOOK 4 QUESTIONS ASSESSMENT */}
              <div
                className={`rounded-xl p-5 transition-all border ${
                  item4Collected
                    ? "bg-white/10 border-emerald-400/40 shadow-sm"
                    : "bg-black/30 border-amber-400/50 shadow-md ring-1 ring-amber-400/20"
                } space-y-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/15 text-emerald-200 border border-white/10">
                        Transformation Office Lead
                      </span>
                      <span className="text-[10px] text-white/60">Slide 35 Playbook Triage</span>
                    </div>
                    <h4 className="font-bold text-white text-base">
                      4. Opella Playbook 4-Questions Assessment *
                    </h4>
                  </div>
                  {item4Collected ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1 shadow-sm shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Evaluated · Routes to {decision.tier}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 font-bold text-xs flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" /> Pending Evaluation
                    </span>
                  )}
                </div>

                {/* The 4 Question Blocks */}
                <div className="space-y-2.5 text-xs">
                  {/* Q1 */}
                  <div className={`p-3 rounded-lg border transition-all ${answers.q1_bigBetOrOver1m ? "bg-emerald-950/60 border-emerald-400 text-white" : "bg-black/25 border-white/10 text-white/80"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono">Q1</span>
                          <span className="font-bold text-white">AmplifAI big bet, Butterfly platform change, or &gt;€1M?</span>
                        </div>
                        <p className="text-[11px] text-white/70 ml-6">
                          If YES: Routes immediately to <strong>T1 · Transform</strong> (Full Business Case, Transformation SteerCo).
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers({ ...answers, q1_bigBetOrOver1m: true });
                            setQQuestionsConfirmed(true);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${answers.q1_bigBetOrOver1m ? "bg-emerald-500 text-emerald-950 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"}`}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers({ ...answers, q1_bigBetOrOver1m: false });
                            setQQuestionsConfirmed(true);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!answers.q1_bigBetOrOver1m ? "bg-gray-700 text-white shadow-sm" : "bg-white/10 text-white hover:bg-white/20"}`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className={`p-3 rounded-lg border transition-all ${answers.q2_approvedToolsUnder50k ? "bg-purple-950/60 border-purple-400 text-white" : "bg-black/25 border-white/10 text-white/80"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-600 text-white font-mono">Q2</span>
                          <span className="font-bold text-white">Approved tools only, configured rather than built, &lt;€50k?</span>
                        </div>
                        <p className="text-[11px] text-white/70 ml-6">
                          If YES: Routes to <strong>Self-Serve · Register & Go</strong> (Immediate speed, skips G2–G4).
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers({ ...answers, q2_approvedToolsUnder50k: true });
                            setQQuestionsConfirmed(true);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${answers.q2_approvedToolsUnder50k ? "bg-purple-400 text-purple-950 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"}`}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers({ ...answers, q2_approvedToolsUnder50k: false });
                            setQQuestionsConfirmed(true);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!answers.q2_approvedToolsUnder50k ? "bg-gray-700 text-white shadow-sm" : "bg-white/10 text-white hover:bg-white/20"}`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Q3 */}
                  <div className={`p-3 rounded-lg border transition-all ${answers.q3_provenPilotOrReach ? "bg-blue-950/60 border-blue-400 text-white" : "bg-black/25 border-white/10 text-white/80"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono">Q3</span>
                          <span className="font-bold text-white">Proven pilot, enterprise reach (500+ users), or €200k–€1m?</span>
                        </div>
                        <p className="text-[11px] text-white/70 ml-6">
                          If YES: Routes to <strong>T2 · Scale</strong> (Light business case, AI Portfolio Board).
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers({ ...answers, q3_provenPilotOrReach: true });
                            setQQuestionsConfirmed(true);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${answers.q3_provenPilotOrReach ? "bg-blue-400 text-blue-950 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"}`}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers({ ...answers, q3_provenPilotOrReach: false });
                            setQQuestionsConfirmed(true);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!answers.q3_provenPilotOrReach ? "bg-gray-700 text-white shadow-sm" : "bg-white/10 text-white hover:bg-white/20"}`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Q4 / Fallback */}
                  <div className={`p-3 rounded-lg border transition-all ${!answers.q1_bigBetOrOver1m && !answers.q2_approvedToolsUnder50k && !answers.q3_provenPilotOrReach ? "bg-amber-950/60 border-amber-400 text-white" : "bg-black/25 border-white/10 text-white/80"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-600 text-white font-mono">Q4</span>
                          <span className="font-bold text-white">Otherwise: New idea or build with a value hypothesis to test?</span>
                        </div>
                        <p className="text-[11px] text-white/70 ml-6">
                          Routes to <strong>T3 · Fast Lane</strong> (1-page canvas, 10-day decision SLA, 6–8 week MVP sprint).
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-200 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                        Default Fallback
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Speed Lane Routing Banner */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">Calculated Speed Lane:</span>
                    <span className="font-bold text-white px-2 py-0.5 rounded bg-white/15 border border-white/20">
                      {tierConfig.name} · {tierConfig.subtitle}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-300">
                    SLA: <strong>{decision.speedSummary.decisionSLA}</strong> · Forum: <strong>{tierConfig.approvalForum}</strong>
                  </div>
                </div>

                {/* Explicit confirmation toggle */}
                <label className="flex items-center gap-2 text-xs font-semibold text-emerald-200 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={qQuestionsConfirmed}
                    onChange={(e) => setQQuestionsConfirmed(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-400 h-4 w-4 bg-white/20 border-white/30"
                  />
                  <span>Confirm: The 4-Questions Assessment has been actively evaluated for this intake</span>
                </label>
              </div>

              {/* CARD 5: ORAI RESPONSIBLE AI SCREENING */}
              <div
                className={`rounded-xl p-5 transition-all border ${
                  item5Collected
                    ? "bg-white/10 border-emerald-400/40 shadow-sm"
                    : "bg-black/30 border-amber-400/50 shadow-md ring-1 ring-amber-400/20"
                } space-y-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/15 text-emerald-200 border border-white/10">
                        CISO & AI Governance Lead
                      </span>
                      <span className="text-[10px] text-white/60">EU AI Act & Compliance Screening</span>
                    </div>
                    <h4 className="font-bold text-white text-base">
                      5. ORAI Responsible AI Self-Screening *
                    </h4>
                  </div>
                  {item5Collected ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1 shadow-sm shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Certified · {decision.riskTier} Risk
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 font-bold text-xs flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" /> Review Required
                    </span>
                  )}
                </div>

                {/* 5 Risk Flags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/25 border border-white/10 hover:bg-black/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={answers.risk_personalHealthData}
                      onChange={(e) => {
                        setAnswers({ ...answers, risk_personalHealthData: e.target.checked });
                        setOraiConfirmed(true);
                      }}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-400 h-4 w-4 bg-white/20 border-white/30"
                    />
                    <span className="text-white/90">
                      Processes employee personal, health, patient or confidential data (EU AI Act High Risk)
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/25 border border-white/10 hover:bg-black/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={answers.risk_autonomousDecisions}
                      onChange={(e) => {
                        setAnswers({ ...answers, risk_autonomousDecisions: e.target.checked });
                        setOraiConfirmed(true);
                      }}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-400 h-4 w-4 bg-white/20 border-white/30"
                    />
                    <span className="text-white/90">
                      Makes autonomous decisions impacting hiring, credit, clinical or regulatory safety
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/25 border border-white/10 hover:bg-black/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={answers.risk_coreProdWriteBack}
                      onChange={(e) => {
                        setAnswers({ ...answers, risk_coreProdWriteBack: e.target.checked });
                        setOraiConfirmed(true);
                      }}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-400 h-4 w-4 bg-white/20 border-white/30"
                    />
                    <span className="text-white/90">
                      Direct automated write-back to core ERP / SAP production databases
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/25 border border-white/10 hover:bg-black/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={answers.risk_externalOutputNoReview}
                      onChange={(e) => {
                        setAnswers({ ...answers, risk_externalOutputNoReview: e.target.checked });
                        setOraiConfirmed(true);
                      }}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-400 h-4 w-4 bg-white/20 border-white/30"
                    />
                    <span className="text-white/90">
                      Generates external customer-facing content without human-in-the-loop review
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/25 border border-white/10 hover:bg-black/40 cursor-pointer sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={answers.risk_unapprovedSaaSOrCustomModel}
                      onChange={(e) => {
                        setAnswers({ ...answers, risk_unapprovedSaaSOrCustomModel: e.target.checked });
                        setOraiConfirmed(true);
                      }}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-400 h-4 w-4 bg-white/20 border-white/30"
                    />
                    <span className="text-white/90">
                      Uses unapproved external SaaS, custom third-party foundation models, or non-standard cloud tenants
                    </span>
                  </label>
                </div>

                {/* Risk Evaluation Summary */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/15 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-white/70">Calculated ORAI Risk Classification:</span>
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                        decision.riskTier === "High"
                          ? "bg-rose-500/20 text-rose-200 border border-rose-400/40"
                          : decision.riskTier === "Medium"
                          ? "bg-amber-500/20 text-amber-200 border border-amber-400/40"
                          : "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40"
                      }`}
                    >
                      {decision.riskTier} Risk Tier
                    </span>
                  </div>
                  <span className="text-[11px] text-white/60 hidden sm:inline">
                    {decision.riskReasons[0] || "Compliant with standard AI sandbox guardrails"}
                  </span>
                </div>

                {/* Confirmation Checkbox */}
                <label className="flex items-center gap-2 text-xs font-semibold text-emerald-200 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={oraiConfirmed}
                    onChange={(e) => setOraiConfirmed(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-400 h-4 w-4 bg-white/20 border-white/30"
                  />
                  <span>Confirm: I certify that this initial ORAI Responsible AI screening has been reviewed</span>
                </label>
              </div>

              {/* CARD 6: OPTIONAL VALUE & TECHNOLOGY CONTEXT */}
              <div className="rounded-xl p-5 bg-white/5 border border-white/10 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                      Context Enablers
                    </span>
                    <h4 className="font-bold text-white/90 text-sm">
                      6. Estimated Value & Proposed Technology (Optional)
                    </h4>
                  </div>
                  <span className="text-[10px] text-white/50">Recommended for Business Case</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/80 mb-1">
                      Estimated Value / ROI
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. €3.8M net run-rate EBITDA savings; 42k hours repurposed"
                      value={answers.estimatedValueDescription || ""}
                      onChange={(e) => setAnswers({ ...answers, estimatedValueDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-white/80 mb-1">
                      Proposed Technology
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Azure GenAI, LangChain, SAP OData APIs, Databricks"
                      value={answers.technologyProposed || ""}
                      onChange={(e) => setAnswers({ ...answers, technologyProposed: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-white/80 mb-1">
                      Estimated Budget Envelope (€)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="10000"
                        value={answers.estimatedCost}
                        onChange={(e) => setAnswers({ ...answers, estimatedCost: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none font-semibold"
                      />
                      <Euro className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TEAMS ACCOMPANYING YOU IN THIS INTAKE PHASE */}
            <div className="pt-3 border-t border-white/15 space-y-2.5">
              <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Dedicated Teams & Profiles Accompanying You in This Intake Phase:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-black/25 border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/30 text-blue-300 font-bold flex items-center justify-center shrink-0 border border-blue-400/30 text-xs">
                    Hub
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px]">Front Door AI Catalyst</div>
                    <div className="text-[10px] text-white/70">
                      Data & AI Hub (0.2 FTE) · Intake guidance & registry check
                    </div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/25 border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-500/30 text-purple-300 font-bold flex items-center justify-center shrink-0 border border-purple-400/30 text-xs">
                    TO
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px]">Portfolio Intake Lead</div>
                    <div className="text-[10px] text-white/70">
                      Transformation Office (0.1 FTE) · Speed lane routing & SLA
                    </div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/25 border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center shrink-0 border border-emerald-400/30 text-xs">
                    Fn
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px]">Function Domain Lead</div>
                    <div className="text-[10px] text-white/70">
                      Business Function (0.3 FTE) · Friction context & user reach
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GATE G1 COMITOLOGY ADVANCE BAR */}
            <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              {!isStep1Valid ? (
                <div className="flex items-center gap-2 text-xs bg-amber-400/20 text-amber-200 border border-amber-400/40 px-3.5 py-2 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>
                    <strong>Mandatory Intake Dossier Incomplete:</strong> Please complete all 5 required items above before running autonomous agent triage.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 px-3.5 py-2 rounded-xl">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3] shrink-0" />
                  <span>
                    <strong>All 5 Mandatory Items Collected & Verified!</strong> The intake dossier is complete and ready for Gate G1 triage.
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleStartAgentTriage}
                disabled={!isStep1Valid}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-md hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap self-end sm:self-auto"
              >
                <Bot className="w-4 h-4 text-gray-950" />
                <span>Launch Autonomous Agent Triage (Gate G1)</span>
                <ArrowRight className="w-4 h-4 text-gray-950" />
              </button>
            </div>
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

            {/* WHAT IT MEANS TO BE THIS TIER (EXECUTIVE GOVERNANCE DEEP DIVE) */}
            {TIER_DEEP_DIVES[decision.tier] && (
              <div className="bg-white rounded-xl p-5 border border-gray-200 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <span className="font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                    <Building className="w-4 h-4 text-emerald-700" />
                    What It Means to be {TIER_DEEP_DIVES[decision.tier].name} ({TIER_DEEP_DIVES[decision.tier].subtitle})
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Playbook Mandate
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/70 text-gray-800 space-y-1">
                  <div className="font-bold text-emerald-950">Strategic Mandate:</div>
                  <p className="leading-relaxed">{TIER_DEEP_DIVES[decision.tier].whatItMeans}</p>
                  <div className="pt-1.5 border-t border-emerald-200/60 text-emerald-900">
                    <strong>Decision for this Use Case:</strong> {TIER_DEEP_DIVES[decision.tier].decisionForUseCase}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Comitology & Committees */}
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                      1. Governing Committees
                    </span>
                    <div className="font-bold text-gray-900 text-[11px]">
                      {TIER_DEEP_DIVES[decision.tier].committeesAndComitology.primaryForum}
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Cadence: <strong>{TIER_DEEP_DIVES[decision.tier].committeesAndComitology.cadence}</strong>
                    </div>
                    <div className="text-[11px] text-gray-500 italic">
                      {TIER_DEEP_DIVES[decision.tier].committeesAndComitology.decisionRights}
                    </div>
                  </div>

                  {/* Teams & Resourcing */}
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                      2. Teams & Resourcing
                    </span>
                    <div className="font-bold text-gray-900 text-[11px]">
                      {TIER_DEEP_DIVES[decision.tier].teamsAndResourcing.squadModel}
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Hub: {TIER_DEEP_DIVES[decision.tier].teamsAndResourcing.dataAndAiAllocation}
                    </div>
                    <div className="text-[11px] text-emerald-800 font-semibold">
                      Function: {TIER_DEEP_DIVES[decision.tier].teamsAndResourcing.businessFunctionCommitment}
                    </div>
                  </div>

                  {/* Delivery & PMO Tracking */}
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                      3. Delivery & Tracking
                    </span>
                    <div className="font-bold text-gray-900 text-[11px]">
                      {TIER_DEEP_DIVES[decision.tier].deliveryAndTracking.trackingTool}
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Funding: {TIER_DEEP_DIVES[decision.tier].deliveryAndTracking.fundingMechanism}
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Audit: {TIER_DEEP_DIVES[decision.tier].deliveryAndTracking.valueRealizationAudit}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* USER JOURNEY COMPANIONS: TEAMS WITH YOU AT TRIAGE */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                Your Triage & Sizing Governance Squad (Gate G1 Evaluation):
              </span>
              <span className="text-[11px] font-semibold text-gray-500">
                Playbook Comitology Relay
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-gray-900">OpellaGPT Charter Agent</div>
                <div className="text-[10px] text-gray-500">AI Front Door · Rule triage</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-gray-900">Portfolio Secretariat</div>
                <div className="text-[10px] text-gray-500">Transformation Office · SLA & Backlog</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-gray-900">Enterprise AI Architect</div>
                <div className="text-[10px] text-gray-500">Data & AI Hub · Tech sizing</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-gray-900">Function Business Sponsor</div>
                <div className="text-[10px] text-gray-500">Business Unit · Value priority</div>
              </div>
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

          {/* USER JOURNEY COMPANIONS: TEAMS WITH YOU IN BUSINESS CASE FORMULATION */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                Working Group Accompanying Your Business Case Formulation:
              </span>
              <span className="text-[11px] font-semibold text-gray-500">
                Four-in-a-Box Working Group
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-gray-900">Finance Business Partner</div>
                <div className="text-[10px] text-gray-500">Finance · Baseline validation (€/unit)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-gray-900">Value Realization Lead</div>
                <div className="text-[10px] text-gray-500">Transformation Office · VCP scorecard</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-gray-900">Data & AI Architect</div>
                <div className="text-[10px] text-gray-500">Data & AI Hub · Enabler costs & tokens</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-gray-900">Business Product Owner</div>
                <div className="text-[10px] text-gray-500">Business Function · Process owner</div>
              </div>
            </div>
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

          {/* MODE ZOOM: WHY THIS MODE WAS SELECTED & 3-WAY SQUAD DISPOSITION */}
          {MODE_DEEP_DIVES[chosenMode] && (
            <div className="bg-emerald-50/50 rounded-2xl p-6 border-2 border-emerald-600/30 space-y-6">
              {/* Header: Selected Mode & WHY */}
              <div className="border-b border-emerald-200/80 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-emerald-700 text-white text-xs font-bold px-2 py-0.5">
                      Mode Zoom
                    </span>
                    <h3 className="text-lg font-black text-opella-forest">
                      {MODE_DEEP_DIVES[chosenMode].title} ·{" "}
                      <span className="italic font-serif text-emerald-800 text-base font-normal">
                        {MODE_DEEP_DIVES[chosenMode].motto}
                      </span>
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white border border-emerald-300 text-emerald-900">
                    Gate G4 Decision Focus
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-1 font-medium">
                  {MODE_DEEP_DIVES[chosenMode].ownershipSplit}
                </p>
              </div>

              {/* WHY Was This Mode Selected? */}
              <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    WHY This Mode Was Selected for this Use Case:
                  </span>
                  <span className="text-[11px] text-gray-500 font-semibold">
                    Operating Model Sourcing Criteria
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      Technical Complexity Profile
                    </span>
                    <span className="font-semibold text-gray-900 block mt-0.5">
                      {MODE_DEEP_DIVES[chosenMode].whySelected.technicalComplexityProfile}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      Function Capability Required
                    </span>
                    <span className="font-semibold text-gray-900 block mt-0.5">
                      {MODE_DEEP_DIVES[chosenMode].whySelected.functionTechCapabilityRequired}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      Enterprise Platform Fit
                    </span>
                    <span className="font-semibold text-emerald-800 block mt-0.5">
                      {MODE_DEEP_DIVES[chosenMode].whySelected.platformFit}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="font-bold text-gray-900">Decision Rationale Drivers:</div>
                  {MODE_DEEP_DIVES[chosenMode].whySelected.primaryDrivers.map((driver, i) => (
                    <div key={i} className="flex items-start gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{driver}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* THE TEAM PUT AT THE DISPOSITION OF THE USE CASE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    Dedicated Team Put at the Disposition of the Use Case
                  </h4>
                  <span className="text-[11px] text-gray-500">
                    3-Way Resourcing: Data & AI + TO + Function
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. DATA & AI TEAM */}
                  <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                      <div className="font-bold text-xs text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-blue-700" />
                        From Data & AI Hub
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                        Engineering
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {MODE_DEEP_DIVES[chosenMode].teamDisposition.dataAndAiTeam.map((mem, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{mem.role}</span>
                            <span className="text-[10px] font-mono font-bold text-blue-800 bg-white px-1.5 py-0.5 rounded border border-blue-200">
                              {mem.allocation}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 leading-snug">
                            {mem.responsibility}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. TRANSFORMATION OFFICE (TO) */}
                  <div className="p-4 rounded-xl bg-white border border-purple-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                      <div className="font-bold text-xs text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-purple-700" />
                        From Transformation Office
                      </div>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                        Change & Value
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {MODE_DEEP_DIVES[chosenMode].teamDisposition.transformationOffice.map((mem, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-100 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{mem.role}</span>
                            <span className="text-[10px] font-mono font-bold text-purple-800 bg-white px-1.5 py-0.5 rounded border border-purple-200">
                              {mem.allocation}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 leading-snug">
                            {mem.responsibility}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. BUSINESS FUNCTION */}
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                      <div className="font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        From Business Function
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        Business PO
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {MODE_DEEP_DIVES[chosenMode].teamDisposition.businessFunction.map((mem, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{mem.role}</span>
                            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                              {mem.allocation}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 leading-snug">
                            {mem.responsibility}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
