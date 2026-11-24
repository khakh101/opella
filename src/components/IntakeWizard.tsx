"use client";

import React, { useState, useEffect } from "react";
import { Details } from "@/components/ui/Details";
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
  ShieldCheck,
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
  FileCheck,
  Plus,
  Trash2,
  Calendar,
  X,
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
  CustomTeamMember,
} from "@/types";
import {
  BIG_BETS,
  TIER_CONFIG,
  DELIVERY_MODES_INFO,
  INITIAL_GATES,
  MODE_DEEP_DIVES,
  TIER_DEEP_DIVES,
  PREDETERMINED_PROFILES,
  DURATION_OPTIONS,
  PredeterminedProfile,
} from "@/lib/constants";
import { evaluateIntake } from "@/lib/decisionEngine";
import { saveUseCase } from "@/lib/storage";

interface IntakeWizardProps {
  onUseCaseCreated: (newCase: UseCase) => void;
  onNavigateToLifecycle: (useCaseId: string) => void;
  rescopingUseCase?: UseCase | null;
  rescopingTier?: Tier | null;
  onClearRescoping?: () => void;
}

export const IntakeWizard: React.FC<IntakeWizardProps> = ({
  onUseCaseCreated,
  onNavigateToLifecycle,
  rescopingUseCase,
  rescopingTier,
  onClearRescoping,
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

  // Dynamic Squad Resourcing (starts empty per user requirement)
  const [customTeamMembers, setCustomTeamMembers] = useState<CustomTeamMember[]>([]);
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [profilePillar, setProfilePillar] = useState<"dataAndAi" | "transformationOffice" | "businessFunction">("dataAndAi");
  const [selectedRoleName, setSelectedRoleName] = useState<string>("Forward Deployed Engineer (FDE)");
  const [customRoleName, setCustomRoleName] = useState<string>("");
  const [profileFte, setProfileFte] = useState<number>(1.0);
  const [profileDuration, setProfileDuration] = useState<string>("8 weeks (MVP Build)");
  const [customDuration, setCustomDuration] = useState<string>("");
  const [profileResponsibility, setProfileResponsibility] = useState<string>(
    "Architects and builds agent pipelines, LangChain chains, API connectors, and model prompting."
  );

  const openAddProfileModal = (pillar?: "dataAndAi" | "transformationOffice" | "businessFunction") => {
    const targetPillar = pillar || "dataAndAi";
    setProfilePillar(targetPillar);
    const available = PREDETERMINED_PROFILES.filter((p) => p.pillar === targetPillar);
    const firstRole = available[0] || PREDETERMINED_PROFILES[0];
    setSelectedRoleName(firstRole.role);
    setCustomRoleName("");
    setProfileFte(firstRole.defaultFte);
    setProfileDuration(firstRole.defaultDuration);
    setCustomDuration("");
    setProfileResponsibility(firstRole.defaultResponsibility);
    setIsAddProfileModalOpen(true);
  };

  const handlePillarChange = (newPillar: "dataAndAi" | "transformationOffice" | "businessFunction") => {
    setProfilePillar(newPillar);
    const available = PREDETERMINED_PROFILES.filter((p) => p.pillar === newPillar);
    const firstRole = available[0] || PREDETERMINED_PROFILES[0];
    setSelectedRoleName(firstRole.role);
    setCustomRoleName("");
    setProfileFte(firstRole.defaultFte);
    setProfileDuration(firstRole.defaultDuration);
    setCustomDuration("");
    setProfileResponsibility(firstRole.defaultResponsibility);
  };

  const handleRoleChange = (roleName: string) => {
    setSelectedRoleName(roleName);
    if (roleName === "CUSTOM") {
      setCustomRoleName("");
      setProfileResponsibility("Dedicated responsibility for this custom role.");
    } else {
      const match = PREDETERMINED_PROFILES.find((p) => p.role === roleName);
      if (match) {
        setProfileFte(match.defaultFte);
        setProfileDuration(match.defaultDuration);
        setProfileResponsibility(match.defaultResponsibility);
      }
    }
  };

  const handleAddProfileSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalRole = selectedRoleName === "CUSTOM" ? customRoleName.trim() : selectedRoleName;
    if (!finalRole) return;
    const finalDuration =
      profileDuration === "Custom duration..." ? customDuration.trim() || "Duration TBD" : profileDuration;
    const matchedProfile = PREDETERMINED_PROFILES.find((p) => p.role === finalRole);

    const newMember: CustomTeamMember = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      pillar: profilePillar,
      role: finalRole,
      fte: profileFte,
      duration: finalDuration,
      responsibility: profileResponsibility,
      profileType:
        matchedProfile?.profileType ||
        (profilePillar === "dataAndAi"
          ? "Tech"
          : profilePillar === "transformationOffice"
          ? "Governance"
          : "Business"),
    };

    setCustomTeamMembers((prev) => [...prev, newMember]);
    setIsAddProfileModalOpen(false);
  };

  const handleRemoveProfile = (id: string) => {
    setCustomTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleLoadModeBaseline = () => {
    const deepDive = MODE_DEEP_DIVES[chosenMode]?.teamDisposition;
    if (!deepDive) return;
    const loaded: CustomTeamMember[] = [];
    deepDive.dataAndAiTeam.forEach((mem, idx) => {
      const fteMatch = mem.allocation.match(/([\d.]+)\s*FTE/i);
      const fteVal = fteMatch ? parseFloat(fteMatch[1]) : 0.5;
      loaded.push({
        id: `mem-base-dai-${idx}-${Date.now()}`,
        pillar: "dataAndAi",
        role: mem.role,
        fte: fteVal,
        duration: "8 weeks (MVP Build)",
        responsibility: mem.responsibility,
        profileType: mem.profileType || "Tech",
      });
    });
    deepDive.transformationOffice.forEach((mem, idx) => {
      const fteMatch = mem.allocation.match(/([\d.]+)\s*FTE/i);
      const fteVal = fteMatch ? parseFloat(fteMatch[1]) : 0.4;
      loaded.push({
        id: `mem-base-to-${idx}-${Date.now()}`,
        pillar: "transformationOffice",
        role: mem.role,
        fte: fteVal,
        duration: "6 months (Half-Year / Scale)",
        responsibility: mem.responsibility,
        profileType: mem.profileType || "Governance",
      });
    });
    deepDive.businessFunction.forEach((mem, idx) => {
      const fteMatch = mem.allocation.match(/([\d.]+)\s*FTE/i);
      const fteVal = fteMatch ? parseFloat(fteMatch[1]) : 0.8;
      loaded.push({
        id: `mem-base-fn-${idx}-${Date.now()}`,
        pillar: "businessFunction",
        role: mem.role,
        fte: fteVal,
        duration: "6 months (Half-Year / Scale)",
        responsibility: mem.responsibility,
        profileType: mem.profileType || "Business",
      });
    });
    setCustomTeamMembers(loaded);
  };

  const handleClearSquad = () => {
    setCustomTeamMembers([]);
  };

  // Real-time evaluation calculation
  const decision = evaluateIntake(answers);
  const tierConfig = TIER_CONFIG[decision.tier];

  // Automatically sync chosenMode with decision.mode when tier is evaluated
  useEffect(() => {
    if (decision.tier === "T1") {
      setChosenMode("Mode 1");
    } else if (decision.tier === "Self-Serve") {
      setChosenMode("Self-Service AI");
    } else {
      setChosenMode(decision.mode);
    }
  }, [decision.tier, decision.mode]);

  // Handle incoming Re-scoping from Lifecycle View
  useEffect(() => {
    if (rescopingUseCase) {
      setStep(3); // Send straight to Business Case Formulation

      const targetTier = rescopingTier || rescopingUseCase.tier;
      setAnswers((prev) => ({
        ...prev,
        initiativeTitle: rescopingUseCase.title,
        description: rescopingUseCase.description,
        businessOwnerName: rescopingUseCase.owner,
        estimatedCost: rescopingUseCase.budget || prev.estimatedCost,
        targetUserCount: rescopingUseCase.intakeAnswers?.targetUserCount || prev.targetUserCount,
        functionName: rescopingUseCase.functionName || prev.functionName,
        region: rescopingUseCase.region || prev.region,
        estimatedValueDescription: rescopingUseCase.roiEstimate || prev.estimatedValueDescription,
        // Match the 4-question flags to the rescoped tier
        q1_bigBetOrOver1m: targetTier === "T1",
        q2_approvedToolsUnder50k: targetTier === "Self-Serve",
        q3_provenPilotOrReach: targetTier === "T2",
        q4_newHypothesis: targetTier === "T3",
      }));

      if (rescopingUseCase.mode) {
        setChosenMode(rescopingUseCase.mode);
      }
      if (rescopingUseCase.customTeam && rescopingUseCase.customTeam.length > 0) {
        setCustomTeamMembers(rescopingUseCase.customTeam);
      }
    }
  }, [rescopingUseCase, rescopingTier]);

  // AUTO-SYNC: Any information filled in the preliminary intake form (Step 1)
  // is automatically mapped into subsequent business case forms (T1, T2, T3, Self-Serve)
  useEffect(() => {
    // Sync T3 One-Page Canvas (Fast Lane)
    setT3Canvas((prev) => ({
      ...prev,
      summaryAndHypothesis: answers.description?.trim()
        ? `Hypothesis: ${answers.description}`
        : prev.summaryAndHypothesis,
      kpi1: answers.estimatedValueDescription?.trim()
        ? `Target Impact: ${answers.estimatedValueDescription}`
        : prev.kpi1,
      baselineMetrics: answers.description?.trim()
        ? `Current manual baseline: ${answers.description.slice(0, 100)}`
        : prev.baselineMetrics,
      assignedBuilderOrCatalyst: answers.businessOwnerName?.trim()
        ? `${answers.businessOwnerName} (Catalyst)`
        : prev.assignedBuilderOrCatalyst,
      budgetEnvelope: answers.estimatedCost || prev.budgetEnvelope,
    }));

    // Sync T2 Lite Business Case (Scale Lane)
    setT2BC((prev) => ({
      ...prev,
      problemStatement: answers.description?.trim() || prev.problemStatement,
      directionalValue: answers.estimatedValueDescription?.trim() || prev.directionalValue,
      governance: {
        ...prev.governance,
        namedBusinessOwner: answers.businessOwnerName?.trim() || prev.governance.namedBusinessOwner,
        targetUserCount: answers.targetUserCount || prev.governance.targetUserCount,
      },
      existingDataFit: {
        ...prev.existingDataFit,
        dataSourcesDetails: answers.technologyProposed?.trim() || prev.existingDataFit.dataSourcesDetails,
      },
    }));

    // Sync T1 Full Business Case (Transform Lane)
    setT1BC((prev) => ({
      ...prev,
      recurringItems: {
        ...prev.recurringItems,
        topLineImpact: answers.estimatedValueDescription?.trim() || prev.recurringItems.topLineImpact,
        opexImpact: answers.description?.trim()
          ? `Automates manual friction described in: ${answers.initiativeTitle || answers.description.slice(0, 50)}`
          : prev.recurringItems.opexImpact,
        fteImpact: answers.targetUserCount
          ? `${Math.max(1, Math.round(answers.targetUserCount * 0.05))} FTE capacity unlocked`
          : prev.recurringItems.fteImpact,
      },
      resourcePeopleCosts: {
        ...prev.resourcePeopleCosts,
        namedInternalRoles: answers.businessOwnerName?.trim()
          ? `${answers.businessOwnerName} (Accountable Business Owner)`
          : prev.resourcePeopleCosts.namedInternalRoles,
      },
      siNonStaff: {
        ...prev.siNonStaff,
        systemEnablers: answers.technologyProposed?.trim() || prev.siNonStaff.systemEnablers,
      },
    }));

    // Sync Self-Service AI Registry
    setSelfServeRegistry((prev) => ({
      ...prev,
      agentOrToolName: answers.initiativeTitle?.trim() || prev.agentOrToolName,
      purposeSummary: answers.description?.trim() || prev.purposeSummary,
      targetUserGroup: answers.targetUserGroupDescription?.trim() || answers.functionName || prev.targetUserGroup,
      userCount: answers.targetUserCount || prev.userCount,
    }));
  }, [
    answers.initiativeTitle,
    answers.description,
    answers.businessOwnerName,
    answers.targetUserGroupDescription,
    answers.targetUserCount,
    answers.estimatedCost,
    answers.estimatedValueDescription,
    answers.technologyProposed,
    answers.functionName,
  ]);

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
  const handleLoadPreset = (preset: "GIDE" | "IBP" | "WONKA" | "COPILOT") => {
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
        mappedBigBet: "BET_6",
        q1_bigBetOrOver1m: true,
        q2_approvedToolsUnder50k: false,
        q3_provenPilotOrReach: false,
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
        mappedBigBet: undefined,
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
        mappedBigBet: undefined,
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
    } else if (preset === "COPILOT") {
      setAnswers({
        ...answers,
        initiativeTitle: "Meeting Action Item Extractor (Copilot)",
        description:
          "Automated Copilot Studio workflow that extracts meeting action items and distributes them to team members using approved Microsoft 365 connectors.",
        targetUserGroupDescription:
          "25 Regional Marketing and Sales team members across EULA.",
        estimatedValueDescription:
          "Saves 3 hours/week per manager on meeting administration and task dispatching.",
        technologyProposed:
          "Microsoft Copilot Studio, Power Automate, Outlook 365, Teams.",
        functionName: "M&S",
        region: "EULA",
        businessOwnerName: "Sophie Laurent (Marketing Ops Lead)",
        businessOwnerEmail: "sophie.laurent@opella.com",
        estimatedCost: 15000,
        targetUserCount: 25,
        mappedBigBet: undefined,
        q1_bigBetOrOver1m: false,
        q2_approvedToolsUnder50k: true,
        q3_provenPilotOrReach: false,
        q4_newHypothesis: false,
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
      mappedBigBet: undefined,
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

    // Sync preliminary answers to all business case structures
    if (answers.description) {
      setT2BC((prev) => ({ ...prev, problemStatement: answers.description }));
      setT3Canvas((prev) => ({ ...prev, summaryAndHypothesis: answers.description }));
    }
    if (answers.estimatedValueDescription) {
      setT2BC((prev) => ({ ...prev, directionalValue: answers.estimatedValueDescription || "" }));
      setT1BC((prev) => ({
        ...prev,
        recurringItems: {
          ...prev.recurringItems,
          fy25_30BenefitsSummary: answers.estimatedValueDescription || "",
          topLineImpact: answers.estimatedValueDescription || "",
        },
        dashboardSignOffs: {
          ...prev.dashboardSignOffs,
          ebitdaEffect: answers.estimatedValueDescription || "",
        },
      }));
    }
    if (answers.businessOwnerName) {
      setT2BC((prev) => ({
        ...prev,
        governance: { ...prev.governance, namedBusinessOwner: answers.businessOwnerName || "" },
      }));
      setT1BC((prev) => ({
        ...prev,
        resourcePeopleCosts: {
          ...prev.resourcePeopleCosts,
          namedInternalRoles: `${answers.businessOwnerName} (BO/PO, 50%), Lead Architect`,
        },
      }));
    }
    if (answers.aiCatalystName) {
      setT2BC((prev) => ({
        ...prev,
        governance: { ...prev.governance, namedAiCatalyst: answers.aiCatalystName || "" },
      }));
      setT3Canvas((prev) => ({
        ...prev,
        assignedBuilderOrCatalyst: answers.aiCatalystName || "",
      }));
    }
    if (answers.targetUserCount) {
      setT2BC((prev) => ({
        ...prev,
        governance: { ...prev.governance, targetUserCount: answers.targetUserCount },
      }));
    }
    if (answers.estimatedCost) {
      setT1BC((prev) => ({
        ...prev,
        resourcePeopleCosts: {
          ...prev.resourcePeopleCosts,
          fullyLoadedCostEstimate: `€${answers.estimatedCost.toLocaleString()} budget envelope`,
        },
      }));
      setT3Canvas((prev) => ({
        ...prev,
        budgetEnvelope: answers.estimatedCost,
      }));
    }

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
      customTeam: customTeamMembers,
      gates,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If this is a re-scoped initiative, update existing use case and return to simulator
    if (rescopingUseCase) {
      const updatedCase: UseCase = {
        ...rescopingUseCase,
        ...newCase,
        id: rescopingUseCase.id, // Keep the same ID
        tier: decision.tier,
        mode: chosenMode,
        businessCase: businessCasePayload,
        customTeam: customTeamMembers.length > 0 ? customTeamMembers : rescopingUseCase.customTeam,
        updatedAt: new Date().toISOString(),
      };
      await saveUseCase(updatedCase);
      onUseCaseCreated(updatedCase);
      if (onClearRescoping) onClearRescoping();
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
      onNavigateToLifecycle(updatedCase.id);
      return;
    }

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
    <div className="w-full max-w-[1600px] 2xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
      {/* Wizard Progress Stepper */}
      <nav
        aria-label="Intake steps"
        className="mb-8 bg-white rounded-xl p-4 shadow-sm border border-opella-border"
      >
        <div className="text-xs font-semibold text-gray-500 mb-3">STEP {step} OF 4</div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {([
            [1, "1. The 4 Questions Assessment & Initiative Framing"],
            [2, "2. Autonomous Agent Triage (Tier & Speed)"],
            [3, `3. Fill Relevant Business Case (${decision.tier})`],
            [4, "4. Mode Selection (Do it for me / With me / Enable me)"],
          ] as [1 | 2 | 3 | 4, string][]).map(([s, label]) => {
            const isCurrent = s === step;
            const isDone = s < step;
            const base =
              "w-full h-full min-h-[56px] flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors";
            const look = isCurrent
              ? "bg-opella-forest border-opella-forest text-white font-bold"
              : isDone
              ? "bg-opella-sageLight border-opella-mint text-opella-forest font-semibold hover:bg-opella-mint"
              : "bg-white border-opella-border text-gray-500";
            const marker = (
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isCurrent
                    ? "bg-white text-opella-forest"
                    : isDone
                    ? "bg-opella-forest text-white"
                    : "border-2 border-gray-300 text-gray-500"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : s}
              </span>
            );
            return (
              <li key={s}>
                {isDone ? (
                  <button type="button" onClick={() => setStep(s)} className={`${base} ${look}`}>
                    {marker}
                    <span>{label}</span>
                  </button>
                ) : (
                  <div aria-current={isCurrent ? "step" : undefined} className={`${base} ${look}`}>
                    {marker}
                    <span>{label}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

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
                    Front Door Intake & 4-Questions Assessment
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
                  <button
                    type="button"
                    onClick={() => handleLoadPreset("COPILOT")}
                    className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-bold text-[11px] transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>COPILOT</span>
                    <span className="text-[9px] bg-black/30 px-1 rounded text-purple-200">Self-Serve</span>
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
                      <span className="text-[10px] text-white/60">Slide 35 Triage</span>
                    </div>
                    <h4 className="font-bold text-white text-base">
                      4. Opella 4-Questions Assessment *
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
                            setAnswers({
                              ...answers,
                              q1_bigBetOrOver1m: true,
                              q2_approvedToolsUnder50k: false,
                              q3_provenPilotOrReach: false,
                              q4_newHypothesis: false,
                            });
                            setQQuestionsConfirmed(true);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${answers.q1_bigBetOrOver1m ? "bg-emerald-500 text-emerald-950 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"}`}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers({
                              ...answers,
                              q1_bigBetOrOver1m: false,
                              mappedBigBet: undefined,
                            });
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
                            setAnswers({
                              ...answers,
                              q1_bigBetOrOver1m: false,
                              q2_approvedToolsUnder50k: true,
                              q3_provenPilotOrReach: false,
                              q4_newHypothesis: false,
                              mappedBigBet: undefined,
                              estimatedCost: Math.min(answers.estimatedCost, 45000),
                              targetUserCount: Math.min(answers.targetUserCount, 40),
                            });
                            setQQuestionsConfirmed(true);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${answers.q2_approvedToolsUnder50k ? "bg-purple-400 text-purple-950 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"}`}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers({
                              ...answers,
                              q2_approvedToolsUnder50k: false,
                            });
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
                            setAnswers({
                              ...answers,
                              q1_bigBetOrOver1m: false,
                              q2_approvedToolsUnder50k: false,
                              q3_provenPilotOrReach: true,
                              q4_newHypothesis: false,
                              mappedBigBet: undefined,
                            });
                            setQQuestionsConfirmed(true);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${answers.q3_provenPilotOrReach ? "bg-blue-400 text-blue-950 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"}`}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers({
                              ...answers,
                              q3_provenPilotOrReach: false,
                            });
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
                  <div
                    onClick={() => {
                      setAnswers({
                        ...answers,
                        q1_bigBetOrOver1m: false,
                        q2_approvedToolsUnder50k: false,
                        q3_provenPilotOrReach: false,
                        q4_newHypothesis: true,
                        mappedBigBet: undefined,
                      });
                      setQQuestionsConfirmed(true);
                    }}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${!answers.q1_bigBetOrOver1m && !answers.q2_approvedToolsUnder50k && !answers.q3_provenPilotOrReach ? "bg-amber-950/60 border-amber-400 text-white ring-1 ring-amber-400/40" : "bg-black/25 border-white/10 text-white/80 hover:bg-black/40"}`}
                  >
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

            {/* USER JOURNEY STATION: STAGE 1 (INTAKE SUBMISSION & TRIAGE) */}
            <div className="bg-gradient-to-br from-[#0c2a1a] via-[#093c1f] to-[#044c23] rounded-2xl p-6 text-white border-2 border-emerald-500 shadow-xl space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-4">
                <div className="flex items-start gap-3">
                  <span className="px-3 py-1 rounded-lg bg-amber-400 text-gray-950 font-black text-xs flex items-center gap-1.5 shadow-md shrink-0 mt-0.5">
                    <span>🧭</span>
                    <span>YOUR USER JOURNEY</span>
                  </span>
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                      Stage 1: Intake Triaged · Automated Gate G1
                    </div>
                    <h3 className="text-xl font-black text-white mt-0.5">
                      The Opella Charter Agent triaged your initiative into {decision.tier} ({tierConfig.name})
                    </h3>
                  </div>
                </div>
                <span
                  className={`text-xs font-black px-3 py-1.5 rounded-lg border shrink-0 ${
                    decision.tier === "T1"
                      ? "bg-emerald-500 text-white border-emerald-300"
                      : decision.tier === "T2"
                      ? "bg-sky-500 text-white border-sky-300"
                      : decision.tier === "T3"
                      ? "bg-amber-400 text-gray-950 border-amber-300"
                      : "bg-purple-500 text-white border-purple-300"
                  }`}
                >
                  {decision.tier} Lane Assigned
                </span>
              </div>

              <Details tone="dark" title={"Opella AmplifAI Gate Decision Authority Governance Spine"}>
              {/* Opella AmplifAI Gate Decision Authority Governance Spine */}
              <div className="bg-white/10 rounded-xl p-4 border border-white/15 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-2.5">
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    Opella AmplifAI Gate Decision Authority Governance Spine
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono font-bold bg-black/40 px-2 py-0.5 rounded border border-amber-400/30 self-start sm:self-auto">
                    Official Gating Matrix (Gates G1 to G6)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/30 border border-emerald-400/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">Gate G1</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-mono font-semibold">Triage</span>
                    </div>
                    <div className="text-[10px] text-white/70">Need Validation</div>
                    <div className="text-[11px] font-bold text-emerald-300 pt-0.5 border-t border-white/10">
                      Automatic
                    </div>
                    <div className="text-[9px] text-white/60">Charter Agent (OpellaGPT)</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/30 border border-purple-400/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">Gate G2</span>
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded font-mono font-semibold">Feasibility</span>
                    </div>
                    <div className="text-[10px] text-white/70">Pre-Approval</div>
                    <div className="text-[11px] font-bold text-purple-300 pt-0.5 border-t border-white/10">
                      Transformation Office
                    </div>
                    <div className="text-[9px] text-white/60">Stream Approvers & DDA</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/30 border border-purple-400/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">Gate G3</span>
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded font-mono font-semibold">Priority</span>
                    </div>
                    <div className="text-[10px] text-white/70">Capacity Match</div>
                    <div className="text-[11px] font-bold text-purple-300 pt-0.5 border-t border-white/10">
                      Transformation Office
                    </div>
                    <div className="text-[9px] text-white/60">TO Lead & SteerCo / Board</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/30 border border-blue-400/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">Gate G4</span>
                      <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 py-0.2 rounded font-mono font-semibold">GO BUILD</span>
                    </div>
                    <div className="text-[10px] text-white/70">Mode & Tech Unlock</div>
                    <div className="text-[11px] font-bold text-blue-300 pt-0.5 border-t border-white/10">
                      Data & AI
                    </div>
                    <div className="text-[9px] text-white/60">DDA & Tech Architecture</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/30 border border-purple-400/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">Gate G5</span>
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded font-mono font-semibold">Pre-Scale</span>
                    </div>
                    <div className="text-[10px] text-white/70">MVP Scale Gate</div>
                    <div className="text-[11px] font-bold text-purple-300 pt-0.5 border-t border-white/10">
                      Transformation Office
                    </div>
                    <div className="text-[9px] text-white/60">SteerCo / Portfolio Board</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/30 border border-purple-400/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">Gate G6</span>
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded font-mono font-semibold">Run & Value</span>
                    </div>
                    <div className="text-[10px] text-white/70">Live Value Ledger</div>
                    <div className="text-[11px] font-bold text-purple-300 pt-0.5 border-t border-white/10">
                      Transformation Office
                    </div>
                    <div className="text-[9px] text-white/60">Value Officer & BO/PO</div>
                  </div>
                </div>
              </div>
              </Details>

              <Details tone="dark" title={"You will have the following meetings for review"}>
              {/* Part 2: Review Meetings & Comitology Forums You Will Have */}
              <div className="bg-white/10 rounded-xl p-4 border border-white/15 space-y-2.5">
                <div className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-300" />
                  You will have the following meetings for review:
                </div>
                <p className="text-[11px] text-white/70">
                  Per the Opella comitology rules in Tab 1, your initiative will convene with the following governance bodies:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                  {decision.tier === "T1" ? (
                    <>
                      <div className="p-3 rounded-lg bg-black/30 border border-emerald-400/30 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>1. Stream Portfolio Board</span>
                          <span className="text-[9px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.2 rounded font-mono">
                            Fortnightly
                          </span>
                        </div>
                        <div className="text-emerald-300 text-[11px] font-semibold">Dedicated Stream Approvers</div>
                        <p className="text-white/70 text-[11px] leading-snug">
                          Validates the business problem statement, endorses T1 classification, and allocates initial functional squad resources.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-purple-400/30 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>2. TO SteerCo (Monthly)</span>
                          <span className="text-[9px] bg-purple-900/80 text-purple-200 px-1.5 py-0.2 rounded font-mono">
                            Monthly
                          </span>
                        </div>
                        <div className="text-purple-300 text-[11px] font-semibold">Chaired by TO Lead & ExCo Sponsors</div>
                        <p className="text-white/70 text-[11px] leading-snug">
                          Approves corporate portfolio entry, signs off on multi-year budget envelope, and monitors enterprise P&L impact.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-blue-400/30 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>3. Digital Design Authority</span>
                          <span className="text-[9px] bg-blue-900/80 text-blue-200 px-1.5 py-0.2 rounded font-mono">
                            5-Day SLA
                          </span>
                        </div>
                        <div className="text-blue-300 text-[11px] font-semibold">Architecture, Data & Cyber Leads</div>
                        <p className="text-white/70 text-[11px] leading-snug">
                          Reviews Architecture Decision Record (ADR), SAP S/4HANA OData connectors, private AI tenant endpoints, and data isolation.
                        </p>
                      </div>
                    </>
                  ) : decision.tier === "T2" ? (
                    <>
                      <div className="p-3 rounded-lg bg-black/30 border border-sky-400/30 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>1. AI Portfolio Board</span>
                          <span className="text-[9px] bg-sky-900/80 text-sky-200 px-1.5 py-0.2 rounded font-mono">
                            Fortnightly
                          </span>
                        </div>
                        <div className="text-sky-300 text-[11px] font-semibold">Stream Leadership & CDO Proxy</div>
                        <p className="text-white/70 text-[11px] leading-snug">
                          Validates pilot performance metrics and confirms reach across multiple business units.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-emerald-400/30 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>2. Program Sponsors (CDO + CFO)</span>
                          <span className="text-[9px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.2 rounded font-mono">
                            Bi-weekly
                          </span>
                        </div>
                        <div className="text-emerald-300 text-[11px] font-semibold">Executive Sponsoring Body</div>
                        <p className="text-white/70 text-[11px] leading-snug">
                          Releases co-funded budget in tranches and signs off on builder day allocations.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-purple-400/30 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>3. Digital Design Authority</span>
                          <span className="text-[9px] bg-purple-900/80 text-purple-200 px-1.5 py-0.2 rounded font-mono">
                            Weekly
                          </span>
                        </div>
                        <div className="text-purple-300 text-[11px] font-semibold">Architecture & ORAI Review</div>
                        <p className="text-white/70 text-[11px] leading-snug">
                          Validates platform fit and data privacy controls before scaling.
                        </p>
                      </div>
                    </>
                  ) : decision.tier === "T3" ? (
                    <div className="p-3 rounded-lg bg-black/30 border border-amber-400/30 space-y-1 md:col-span-3">
                      <div className="font-bold text-white text-xs flex items-center justify-between">
                        <span>1. AI Portfolio Board (The ONLY Forum Seen)</span>
                        <span className="text-[9px] bg-amber-900/80 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                          10-Day SLA
                        </span>
                      </div>
                      <div className="text-amber-300 text-[11px] font-semibold">Streamlined Fast-Lane Comitology</div>
                      <p className="text-white/70 text-[11px] leading-snug">
                        A single agile review forum with a guaranteed 10-day decision SLA. No committee escalation or multi-layer steerco required. Evaluates the one-page canvas and unlocks the 6–8 week sprint budget.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-black/30 border border-purple-400/30 space-y-1 md:col-span-3">
                      <div className="font-bold text-white text-xs flex items-center justify-between">
                        <span>No Committee Meetings Required</span>
                        <span className="text-[9px] bg-purple-900/80 text-purple-200 px-1.5 py-0.2 rounded font-mono">
                          Instant
                        </span>
                      </div>
                      <p className="text-white/70 text-[11px] leading-snug">
                        Your initiative bypasses all committee meetings. Automated security and license sentinel bots ensure adherence to enterprise guardrails.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              </Details>

              <Details tone="dark" title={"Gate G2 Prerequisite Checklist"}>
              {/* Part 3: Information You Need to Collect Before Gate G2 */}
              <div className="bg-white/10 rounded-xl p-4 border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-amber-300" />
                    You will need to collect the following information to proceed to the next gate (Gate G2):
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-400/30">
                    Gate G2 Prerequisite Checklist
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {decision.tier === "T1" ? (
                    <>
                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>1. Finance Baseline Sign-off</span>
                          <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded">Finance BP</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Bottom-up verification of current manual cost/baseline (€/PO, €/hour, or baseline FTE hours) signed off by your Finance Business Partner.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>2. Architecture Decision Record (ADR)</span>
                          <span className="text-[9px] bg-blue-400/20 text-blue-300 px-1.5 py-0.5 rounded">Data & AI DDA</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Solution architecture, SAP S/4HANA OData APIs, Azure GenAI private endpoints, and data integration clearance from DDA.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>3. Process Redesign Check: YES</span>
                          <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">Transformation Office</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Concrete mapping proving the process is fundamentally reshaped (removes manual handoffs and multi-tier approval hops, not automating bad workflows).
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>4. Data Boundary & OR.AI Clearance</span>
                          <span className="text-[9px] bg-purple-400/20 text-purple-300 px-1.5 py-0.5 rounded">OR.AI & CISO</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Responsible AI screening, CISO RBAC tokenization, and strict confirmation of zero external LLM model training on enterprise data.
                        </p>
                      </div>
                    </>
                  ) : decision.tier === "T2" ? (
                    <>
                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>1. Target Reach & User Scale (500+)</span>
                          <span className="text-[9px] bg-sky-400/20 text-sky-300 px-1.5 py-0.5 rounded">Stream Lead</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Validation that the use case spans 500+ users or cross-functional deployment across 2+ business units / regions.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>2. Light Business Case (1–2 Pages)</span>
                          <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded">Business PO</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Documented problem statement, directional savings/speed metrics, and tranche release milestone unlocks.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>3. Shared Squad Capacity Agreement</span>
                          <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">Hub & BU</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Co-funding allocation and builder days commitment (Hub data engineer + BU business analyst).
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>4. Design Authority Platform Fit</span>
                          <span className="text-[9px] bg-purple-400/20 text-purple-300 px-1.5 py-0.5 rounded">DDA Lead</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Confirmation that data sources reside on approved Snowflake data marts or approved Azure enterprise services.
                        </p>
                      </div>
                    </>
                  ) : decision.tier === "T3" ? (
                    <>
                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>1. One-Page Canvas & Hypothesis</span>
                          <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">Process Owner</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Explicit hypothesis of value to test within a single functional domain and under €200k envelope.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>2. Three Success KPIs & Baseline</span>
                          <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded">AI Catalyst</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Measurable targets for speed/quality, accuracy, and adoption with documented pre-sprint baselines.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>3. 6–8 Week Sprint Commitment</span>
                          <span className="text-[9px] bg-sky-400/20 text-sky-300 px-1.5 py-0.5 rounded">Certified Builder</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Clear backlog for rapid MVP development and testing by internal builders or SaaS provider.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>4. Hard Kill / Scale Milestone Date</span>
                          <span className="text-[9px] bg-purple-400/20 text-purple-300 px-1.5 py-0.5 rounded">Portfolio Board</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Scheduled formal checkpoint at end of sprint to decide graduation to T2 or fail-fast termination.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>1. Approved Tool Catalog Selection</span>
                          <span className="text-[9px] bg-purple-400/20 text-purple-300 px-1.5 py-0.5 rounded">Automated</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Configured using enterprise Copilot Studio, Opella GPT, or Power Automate without new software procurement.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>2. Data Boundary Attestation</span>
                          <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded">User Sign-off</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Formal confirmation of zero personal/patient data and no direct write-back connections to production ERPs.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>3. Cost Cap & Token Budget (&lt;€50k)</span>
                          <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">Function Head</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Confirmed within existing department license budget and accepted automated token usage controls.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-1">
                        <div className="font-bold text-white text-xs flex items-center justify-between">
                          <span>4. Opella AI Registry Line</span>
                          <span className="text-[9px] bg-sky-400/20 text-sky-300 px-1.5 py-0.5 rounded">AI Registry</span>
                        </div>
                        <p className="text-white/70 text-[11px]">
                          Published entry in central AI Registry to prevent duplicative tooling and track adoption.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              </Details>
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
              onClick={() => {
                // Synchronize data entered in Step 1 to subsequent business case forms
                if (answers.description) {
                  setT2BC((prev) => ({ ...prev, problemStatement: answers.description }));
                  setT3Canvas((prev) => ({ ...prev, summaryAndHypothesis: answers.description }));
                }
                if (answers.estimatedValueDescription) {
                  setT2BC((prev) => ({ ...prev, directionalValue: answers.estimatedValueDescription || "" }));
                  setT1BC((prev) => ({
                    ...prev,
                    recurringItems: {
                      ...prev.recurringItems,
                      fy25_30BenefitsSummary: answers.estimatedValueDescription || "",
                      topLineImpact: answers.estimatedValueDescription || "",
                    },
                    dashboardSignOffs: {
                      ...prev.dashboardSignOffs,
                      ebitdaEffect: answers.estimatedValueDescription || "",
                    },
                  }));
                }
                if (answers.businessOwnerName) {
                  setT2BC((prev) => ({
                    ...prev,
                    governance: { ...prev.governance, namedBusinessOwner: answers.businessOwnerName || "" },
                  }));
                  setT1BC((prev) => ({
                    ...prev,
                    resourcePeopleCosts: {
                      ...prev.resourcePeopleCosts,
                      namedInternalRoles: `${answers.businessOwnerName} (BO/PO, 50%), Lead Architect`,
                    },
                  }));
                }
                if (answers.aiCatalystName) {
                  setT2BC((prev) => ({
                    ...prev,
                    governance: { ...prev.governance, namedAiCatalyst: answers.aiCatalystName || "" },
                  }));
                  setT3Canvas((prev) => ({
                    ...prev,
                    assignedBuilderOrCatalyst: answers.aiCatalystName || "",
                  }));
                }
                if (answers.targetUserCount) {
                  setT2BC((prev) => ({
                    ...prev,
                    governance: { ...prev.governance, targetUserCount: answers.targetUserCount },
                  }));
                }
                if (answers.estimatedCost) {
                  setT1BC((prev) => ({
                    ...prev,
                    resourcePeopleCosts: {
                      ...prev.resourcePeopleCosts,
                      fullyLoadedCostEstimate: `€${answers.estimatedCost.toLocaleString()} budget envelope`,
                    },
                  }));
                  setT3Canvas((prev) => ({
                    ...prev,
                    budgetEnvelope: answers.estimatedCost,
                  }));
                }
                setStep(3);
              }}
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
          {/* RE-SCOPING ACTIVE NOTICE BANNER */}
          {rescopingUseCase && (
            <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex items-start justify-between gap-3 shadow-xs animate-in fade-in">
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-2">
                    <span>Re-scoping Active: {rescopingUseCase.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono">
                      {rescopingUseCase.tier} ➔ {decision.tier}
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/90 leading-snug">
                    This initiative was formally re-scoped from <strong>{rescopingUseCase.tier}</strong> to <strong>{decision.tier}</strong> by the Transformation Office.
                    Please complete the required <strong>{decision.tier} Business Case</strong> below to establish its updated governance baseline.
                  </p>
                </div>
              </div>
              {onClearRescoping && (
                <button
                  type="button"
                  onClick={onClearRescoping}
                  className="text-amber-700 hover:text-amber-900 text-xs font-semibold px-2 py-1 rounded hover:bg-amber-100 transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}

          {/* USER JOURNEY STATION: STAGE 2 (GATE G1 APPROVED -> G2 BUSINESS CASE BRIEFING) */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0c2a1a] via-[#093c1f] to-[#044c23] text-white border-2 border-emerald-400 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-4">
              <div className="flex items-start gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-400 text-gray-950 font-black text-xs flex items-center gap-1.5 shadow-md shrink-0 mt-0.5">
                  <span>🎉</span>
                  <span>GATE G1 APPROVED</span>
                </span>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                    User Journey Stage 2 · Need Validated & Triage Approved
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Great! You were approved at Gate G1. Here is what this means:
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-200 border border-emerald-400/40">
                Gate G1 Passed · G2 In-Flight
              </span>
            </div>

            <Details tone="dark" title={"What it means"}>
            {/* What it means (1, 2, 3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white/10 border border-emerald-400/30 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-gray-950 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="font-bold text-white text-xs">
                    Formally Registered in Pipeline
                  </span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  Your initiative is formally cataloged in the Opella AI Registry and linked to the Butterfly transformation portfolio with an active tracking ID.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-emerald-400/30 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-400 text-gray-950 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="font-bold text-white text-xs">
                    Co-Building Squad Mobilized
                  </span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  Dedicated delivery partners are mobilized—including your AI Catalyst, Business Architect, and Lead Data Engineer to support your Business Owner.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-emerald-400/30 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-400 text-gray-950 font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="font-bold text-white text-xs">
                    Locked Comitology Schedule
                  </span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  Your Gate G2 Feasibility slot is officially locked on the agenda of the Stream Portfolio Board and SteerCo with dedicated review time.
                </p>
              </div>
            </div>
            </Details>

            <Details tone="dark" title={`Information to collect for your business case (${decision.tier})`}>
            {/* Information you will need to collect for the business case */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/15 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-300" />
                Because you are in {decision.tier} ({tierConfig.name}), you will need to collect all the following information for your business case:
              </div>
              {decision.tier === "T1" ? (
                <p className="text-xs text-white/80 leading-relaxed">
                  Per Slide 37 and Tab 1, a Tier 1 initiative requires the <strong>Full Business Case (Butterfly Depth)</strong> structured into 6 mandatory sections: Recurring items, SI non-staff, Resource people costs, BI non-staff, Project plan & KPIs, and Executive dashboard sign-offs. Complete and verify each section below:
                </p>
              ) : decision.tier === "T2" ? (
                <p className="text-xs text-white/80 leading-relaxed">
                  Per Slide 38 and Tab 1, a Tier 2 initiative requires the <strong>Light Business Case (1–2 Pages)</strong> covering problem statement, directional value, build mode, builder sizing, token consumption, and existing data fit.
                </p>
              ) : decision.tier === "T3" ? (
                <p className="text-xs text-white/80 leading-relaxed">
                  Per Slide 39 and Tab 1, a Tier 3 initiative requires the <strong>One-Page Canvas (Fast Lane)</strong> with a value hypothesis, 3 measurable KPIs + baseline, 6–8 week sprint commitment, and a clear kill/scale date.
                </p>
              ) : (
                <p className="text-xs text-white/80 leading-relaxed">
                  Per Slide 40 and Tab 1, Self-Service AI requires an <strong>AI Registry Line & Guardrail Certification</strong> confirming approved tools, cost caps, and data safety.
                </p>
              )}
            </div>
            </Details>
          </div>

          <div className="border-b border-opella-border pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${tierConfig.colorClass.badge}`}>
                  {decision.tier}
                </span>
                <h2 className="text-xl font-bold text-opella-forest">
                  {decision.tier === "T1" && "Full Business Case & Butterfly Dossier (6 Mandatory Sections)"}
                  {decision.tier === "T2" && "Light Business Case — 1 to 2 Pages (Slide 38)"}
                  {decision.tier === "T3" && "One-Page Canvas — Fast Lane (Slide 39)"}
                  {decision.tier === "Self-Serve" && "AI Registry Line & Guardrail Certification (Slide 40)"}
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Complete and verify the required information before validating your sourcing mode.
              </p>
            </div>
            <FileText className="w-8 h-8 text-gray-300 hidden sm:block" />
          </div>

          <Details tone="light" title={"Working Group Accompanying Your Business Case Formulation"}>
          {/* USER JOURNEY COMPANIONS: OFFICIAL WORKING GROUP PROFILES ACCOMPANYING FORMULATION */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                Working Group Accompanying Your Business Case Formulation:
              </span>
              <span className="text-[11px] font-semibold text-gray-500">
                Official Opella Operating Model Roles
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Value Officer</span>
                  <span className="text-[9px] bg-pink-100 text-pink-800 px-1.5 py-0.2 rounded font-semibold">TO / Finance</span>
                </div>
                <div className="text-[10px] text-gray-500 leading-snug">
                  Accountable for UC business case, VCP scorecard, baseline validation & funding rules.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">BO / PO</span>
                  <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-semibold">Function</span>
                </div>
                <div className="text-[10px] text-gray-500 leading-snug">
                  Business Owner / Product Owner: frames need, builds UC business case & defines acceptance criteria.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Digital PO</span>
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">Digital</span>
                </div>
                <div className="text-[10px] text-gray-500 leading-snug">
                  Translates business needs into technical product architecture and orchestrates engineering backlog.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Data Eng / Architect</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">Data & AI</span>
                </div>
                <div className="text-[10px] text-gray-500 leading-snug">
                  Sizes tech complexity, estimates enabler costs, checks data readiness & model token consumption.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">ORAI team (LEX)</span>
                  <span className="text-[9px] bg-pink-100 text-pink-800 px-1.5 py-0.2 rounded font-semibold">Legal & Cyber</span>
                </div>
                <div className="text-[10px] text-gray-500 leading-snug">
                  Assesses legal feasibility, EU AI Act compliance, and establishes pre-build risk tier conditions.
                </div>
              </div>
            </div>
          </div>
          </Details>

          {/* DYNAMIC FORMS BASED ON TIER */}

          {/* 1. T1 FULL BUSINESS CASE (6 FULL SECTIONS FROM SLIDE 37) */}
          {decision.tier === "T1" && (
            <div className="space-y-6 text-sm">
              {/* Section 1: Recurring Items */}
              <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-mono">1</span>
                    1. Recurring Items (FY25–30 Bottom-Up Benefits & Run Costs)
                  </h4>
                  <span className="text-[11px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded">
                    Mandatory Section
                  </span>
                </div>
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
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
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
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
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
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Working Capital Reduction</label>
                    <input
                      type="text"
                      value={t1BC.recurringItems.workingCapitalImpact}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          recurringItems: { ...t1BC.recurringItems, workingCapitalImpact: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
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
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Target P&L Line</label>
                    <input
                      type="text"
                      value={t1BC.recurringItems.targetPnLLine}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          recurringItems: { ...t1BC.recurringItems, targetPnLLine: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">FY25–30 Multi-Year Benefits Summary</label>
                    <input
                      type="text"
                      value={t1BC.recurringItems.fy25_30BenefitsSummary}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          recurringItems: { ...t1BC.recurringItems, fy25_30BenefitsSummary: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: SI Non-Staff Enablers */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-mono">2</span>
                    2. SI Non-Staff Enablers (System, Infra, Cyber, Data Enablers)
                  </h4>
                  <span className="text-[11px] text-gray-500 font-mono">No Double Counting</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">System Enablers (ERP / Core APIs)</label>
                    <input
                      type="text"
                      value={t1BC.siNonStaff.systemEnablers}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          siNonStaff: { ...t1BC.siNonStaff, systemEnablers: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Infrastructure Enablers (Azure GenAI Tenant)</label>
                    <input
                      type="text"
                      value={t1BC.siNonStaff.infrastructureEnablers}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          siNonStaff: { ...t1BC.siNonStaff, infrastructureEnablers: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Cyber Enablers (CISO Token Boundary)</label>
                    <input
                      type="text"
                      value={t1BC.siNonStaff.cyberEnablers}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          siNonStaff: { ...t1BC.siNonStaff, cyberEnablers: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
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
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Linked Enterprise Initiative IDs</label>
                    <input
                      type="text"
                      value={t1BC.siNonStaff.linkedInitiativeIds}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          siNonStaff: { ...t1BC.siNonStaff, linkedInitiativeIds: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Resource People Costs */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-mono">3</span>
                    3. Resource People Costs (Named Internal Roles & Skill Gaps)
                  </h4>
                  <span className="text-[11px] text-gray-500">Internal Priority</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Named Internal Roles & Allocations</label>
                    <input
                      type="text"
                      value={t1BC.resourcePeopleCosts.namedInternalRoles}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          resourcePeopleCosts: { ...t1BC.resourcePeopleCosts, namedInternalRoles: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">External Contractor Roles</label>
                    <input
                      type="text"
                      value={t1BC.resourcePeopleCosts.externalRoles}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          resourcePeopleCosts: { ...t1BC.resourcePeopleCosts, externalRoles: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Overall Dedication Percentage (%)</label>
                    <input
                      type="number"
                      value={t1BC.resourcePeopleCosts.dedicationPercentage}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          resourcePeopleCosts: { ...t1BC.resourcePeopleCosts, dedicationPercentage: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Fully Loaded Cost Estimate</label>
                    <input
                      type="text"
                      value={t1BC.resourcePeopleCosts.fullyLoadedCostEstimate}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          resourcePeopleCosts: { ...t1BC.resourcePeopleCosts, fullyLoadedCostEstimate: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Skill Gap Justification (Why External Resources Needed)</label>
                    <input
                      type="text"
                      value={t1BC.resourcePeopleCosts.skillGapJustification}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          resourcePeopleCosts: { ...t1BC.resourcePeopleCosts, skillGapJustification: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: BI Non-Staff (Vendors / RFP) */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-mono">4</span>
                    4. BI Non-Staff (Supplier Spend, Scope & RFP Status)
                  </h4>
                  <span className="text-[11px] text-gray-500">No PO Before Approval</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Supplier Spend Estimate</label>
                    <input
                      type="text"
                      value={t1BC.biNonStaff.supplierSpendEstimate}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          biNonStaff: { ...t1BC.biNonStaff, supplierSpendEstimate: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Supplier Scope Description</label>
                    <input
                      type="text"
                      value={t1BC.biNonStaff.supplierScope}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          biNonStaff: { ...t1BC.biNonStaff, supplierScope: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">RFP Procurement Status</label>
                    <select
                      value={t1BC.biNonStaff.rfpStatus}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          biNonStaff: { ...t1BC.biNonStaff, rfpStatus: e.target.value as any },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Drafted">Drafted</option>
                      <option value="RFP Issued">RFP Issued</option>
                      <option value="Supplier Selected">Supplier Selected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 5: Project Plan, Risks & KPIs */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-mono">5</span>
                    5. Project Plan, Risks & KPIs (Milestones & Stage Gates)
                  </h4>
                  <span className="text-[11px] text-gray-500">Every 4–6 Weeks</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Critical Path Milestones</label>
                    <input
                      type="text"
                      value={t1BC.projectPlanMilestones.criticalPathMilestones}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          projectPlanMilestones: { ...t1BC.projectPlanMilestones, criticalPathMilestones: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Stage Gates Cadence (Weeks)</label>
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
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Key Operational Risks & Mitigations</label>
                    <input
                      type="text"
                      value={t1BC.projectPlanMilestones.keyRisks}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          projectPlanMilestones: { ...t1BC.projectPlanMilestones, keyRisks: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Enterprise Interdependencies</label>
                    <input
                      type="text"
                      value={t1BC.projectPlanMilestones.interdependencies}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          projectPlanMilestones: { ...t1BC.projectPlanMilestones, interdependencies: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Target Value KPIs & Baseline</label>
                    <input
                      type="text"
                      value={t1BC.projectPlanMilestones.kpisTarget}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          projectPlanMilestones: { ...t1BC.projectPlanMilestones, kpisTarget: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Executive Dashboard & 4-Way Sign-offs */}
              <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-300 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-mono">6</span>
                    6. Executive Dashboard & 4-Way Sign-Offs (Slide 37)
                  </h4>
                  <span className="text-[11px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded">
                    Gate G2 Sign-off
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Run-Rate EBITDA Effect</label>
                    <input
                      type="text"
                      value={t1BC.dashboardSignOffs.ebitdaEffect}
                      onChange={(e) =>
                        setT1BC({
                          ...t1BC,
                          dashboardSignOffs: { ...t1BC.dashboardSignOffs, ebitdaEffect: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Payback Period (Months)</label>
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
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200/60 space-y-2">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                    The 4 Mandatory Comitology Sign-Offs:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={t1BC.dashboardSignOffs.streamLeadSignOff}
                        onChange={(e) =>
                          setT1BC({
                            ...t1BC,
                            dashboardSignOffs: { ...t1BC.dashboardSignOffs, streamLeadSignOff: e.target.checked },
                          })
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-gray-900">Stream Lead</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={t1BC.dashboardSignOffs.financeSignOff}
                        onChange={(e) =>
                          setT1BC({
                            ...t1BC,
                            dashboardSignOffs: { ...t1BC.dashboardSignOffs, financeSignOff: e.target.checked },
                          })
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-gray-900">Finance BP</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={t1BC.dashboardSignOffs.digitalSignOff}
                        onChange={(e) =>
                          setT1BC({
                            ...t1BC,
                            dashboardSignOffs: { ...t1BC.dashboardSignOffs, digitalSignOff: e.target.checked },
                          })
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-gray-900">Digital Lead</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={t1BC.dashboardSignOffs.controlTowerSignOff}
                        onChange={(e) =>
                          setT1BC({
                            ...t1BC,
                            dashboardSignOffs: { ...t1BC.dashboardSignOffs, controlTowerSignOff: e.target.checked },
                          })
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-gray-900">Control Tower</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. T2 LIGHT BUSINESS CASE (5 MODULES FROM SLIDE 40) */}
          {decision.tier === "T2" && (
            <div className="space-y-6 text-sm">
              {/* Module 1: Problem Statement & Directional Value */}
              <div className="bg-sky-50/60 p-5 rounded-xl border border-sky-200 space-y-4">
                <div className="flex items-center justify-between border-b border-sky-200/80 pb-2">
                  <h4 className="font-bold text-sky-950 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-sky-800 text-white text-xs flex items-center justify-center font-mono">1</span>
                    1. Problem Statement & Directional Value
                  </h4>
                  <span className="text-[11px] bg-sky-200/80 text-sky-900 font-bold px-2 py-0.5 rounded">
                    Slide 40 · Mandatory
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Problem Statement (2–3 sentence description of manual bottleneck)
                  </label>
                  <textarea
                    rows={2}
                    value={t2BC.problemStatement}
                    onChange={(e) => setT2BC({ ...t2BC, problemStatement: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="Describe the operational friction and manual tasks..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Target User Group & Functional Reach
                    </label>
                    <input
                      type="text"
                      value={answers.targetUserGroupDescription || "Cross-functional users across 2+ regions"}
                      onChange={(e) => setAnswers({ ...answers, targetUserGroupDescription: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                      placeholder="e.g., 500+ Spenders across EU & NA"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Directional Benefit Estimate (Hours saved/wk or turnaround speed)
                    </label>
                    <input
                      type="text"
                      value={t2BC.directionalValue}
                      onChange={(e) => setT2BC({ ...t2BC, directionalValue: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                      placeholder="e.g., Saves 25 hrs/analyst weekly, 60% faster cycle"
                    />
                  </div>
                </div>
              </div>

              {/* Module 2: Build Mode & Rough Effort / Token Sizing */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-mono">2</span>
                    2. Build Mode & Rough Effort / Token Sizing
                  </h4>
                  <span className="text-[11px] text-gray-500 font-mono">Budget Envelope Fit</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Build Mode
                    </label>
                    <select
                      value={t2BC.buildMode}
                      onChange={(e) => setT2BC({ ...t2BC, buildMode: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white font-medium"
                    >
                      <option value="Do it with me">Mode 2: Do it with me (Shared Squad)</option>
                      <option value="Enable me">Mode 3: Enable me (Function Autonomous)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Estimated AI Builder Days
                    </label>
                    <input
                      type="number"
                      value={t2BC.estimatedBuilderDays}
                      onChange={(e) => setT2BC({ ...t2BC, estimatedBuilderDays: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Rough License / Token Consumption
                    </label>
                    <input
                      type="text"
                      value={t2BC.roughTokenConsumption}
                      onChange={(e) => setT2BC({ ...t2BC, roughTokenConsumption: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                      placeholder="e.g., Approx. €1,200/mo Azure GenAI tokens"
                    />
                  </div>
                </div>
              </div>

              {/* Module 3: Existing Data & Platform Fit */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-mono">3</span>
                    3. Existing Data & Platform Fit
                  </h4>
                  <span className="text-[11px] text-gray-500 font-mono">Approved Sources</span>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={t2BC.existingDataFit.approvedSourcesConfirmed}
                      onChange={(e) =>
                        setT2BC({
                          ...t2BC,
                          existingDataFit: { ...t2BC.existingDataFit, approvedSourcesConfirmed: e.target.checked },
                        })
                      }
                      className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    <div>
                      <span className="font-semibold text-gray-900 text-xs block">
                        Confirmation that data is already available in approved enterprise sources
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Data resides in certified Opella lakes/read replicas with no unapproved web-scraping or rogue databases.
                      </span>
                    </div>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Data Sources & Connector Details
                      </label>
                      <input
                        type="text"
                        value={t2BC.existingDataFit.dataSourcesDetails}
                        onChange={(e) =>
                          setT2BC({
                            ...t2BC,
                            existingDataFit: { ...t2BC.existingDataFit, dataSourcesDetails: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                        placeholder="e.g., Snowflake Data Mart & SharePoint Hub"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Platform Architecture Fit
                      </label>
                      <select
                        value={t2BC.existingDataFit.platformType}
                        onChange={(e) =>
                          setT2BC({
                            ...t2BC,
                            existingDataFit: { ...t2BC.existingDataFit, platformType: e.target.value as any },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs bg-white font-medium"
                      >
                        <option value="Existing Hub Platform">Existing Hub Platform (Azure AI / Databricks)</option>
                        <option value="Low-Code/No-Code">Standard Low-Code / No-Code (Copilot Studio)</option>
                        <option value="SaaS Integration">Enterprise SaaS Integration</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module 4: Named Owner & Single-Step Triage */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-mono">4</span>
                    4. Named Owner & Single-Step Triage
                  </h4>
                  <span className="text-[11px] text-gray-500 font-mono">Fortnightly AI Portfolio Board</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Named Business Owner (BO/PO)</label>
                    <input
                      type="text"
                      value={t2BC.governance.namedBusinessOwner}
                      onChange={(e) =>
                        setT2BC({
                          ...t2BC,
                          governance: { ...t2BC.governance, namedBusinessOwner: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white font-medium"
                      placeholder="e.g., Sarah Chen"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Named AI Catalyst</label>
                    <input
                      type="text"
                      value={t2BC.governance.namedAiCatalyst}
                      onChange={(e) =>
                        setT2BC({
                          ...t2BC,
                          governance: { ...t2BC.governance, namedAiCatalyst: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                      placeholder="e.g., Guillaume Roux"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Target User Count</label>
                    <input
                      type="number"
                      value={t2BC.governance.targetUserCount}
                      onChange={(e) =>
                        setT2BC({
                          ...t2BC,
                          governance: { ...t2BC.governance, targetUserCount: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                      placeholder="500"
                    />
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-950 text-xs flex items-center justify-between">
                  <span>✓ Validated in a single pass at the fortnightly AI Portfolio Board with CDO + CFO sponsors</span>
                  <span className="font-mono font-bold text-sky-700 text-[11px]">Fortnightly Session</span>
                </div>
              </div>

              {/* Module 5: ORAI Risk Tier Screening */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-mono">5</span>
                    5. ORAI Risk Tier Screening
                  </h4>
                  <span className="text-[11px] text-gray-500 font-mono">ORAI Clearance</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Initial ORAI Risk Tier Score
                    </label>
                    <select
                      value={t2BC.oraiScreeningConfirmation.riskTierConfirmed}
                      onChange={(e) =>
                        setT2BC({
                          ...t2BC,
                          oraiScreeningConfirmation: {
                            ...t2BC.oraiScreeningConfirmation,
                            riskTierConfirmed: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white font-bold"
                    >
                      <option value="Low">Low Risk Tier (Standard low-code / internal use)</option>
                      <option value="Medium">Medium Risk Tier (Confidential business workflows)</option>
                      <option value="High">High Risk Tier (Flags route out of Fast Lane)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mitigations & Guardrails Summary
                    </label>
                    <input
                      type="text"
                      value={t2BC.oraiScreeningConfirmation.mitigationsSummary}
                      onChange={(e) =>
                        setT2BC({
                          ...t2BC,
                          oraiScreeningConfirmation: {
                            ...t2BC.oraiScreeningConfirmation,
                            mitigationsSummary: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                      placeholder="e.g., Human-in-the-loop review, zero training on external LLMs"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  ⚠️ Note: Any initiative triggered with high-risk flags (patient health data or unsupervised autonomous execution) automatically routes out of the fast lane to the Digital Design Authority and Full Comitology.
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-700 text-white">
                  Gate G4 Decision
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                  Decision Authority: Data & AI
                </span>
                <h2 className="text-xl font-bold text-opella-forest">
                  Sourcing & Delivery Mode Selection (Slides 10 & 46)
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Select who builds and runs the solution: Hub-led (Mode 1), Shared Squad (Mode 2), or Function-led (Mode 3). Note: any tier (T1, T2, T3) can select any delivery mode.
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
                  {chosenMode === "Mode 1" ? (
                    <span className="text-[10px] bg-emerald-800 text-white font-bold px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  ) : decision.mode === "Mode 1" ? (
                    <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  ) : null}
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

              <Details tone="light" title={"WHY This Mode Was Selected for this Use Case"}>
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
              </Details>

              <Details tone="light" title={"Dedicated Team Put at the Disposition of the Use Case"}>
              {/* THE TEAM PUT AT THE DISPOSITION OF THE USE CASE */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-700" />
                      Dedicated Team Put at the Disposition of the Use Case
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      No two use cases are the same. Tailor your squad by adding specific profiles, FTE allocation, and duration.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {customTeamMembers.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearSquad}
                        className="text-[11px] text-gray-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition-colors"
                      >
                        Clear Squad
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleLoadModeBaseline}
                      className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                      title="Load recommended default profiles for this mode as baseline"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      Load Recommended Baseline
                    </button>
                    <button
                      type="button"
                      onClick={() => openAddProfileModal()}
                      className="text-xs font-bold text-white bg-opella-forest hover:bg-opella-emerald px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.01]"
                    >
                      <Plus className="w-4 h-4" />
                      Add Profile
                    </button>
                  </div>
                </div>

                {/* 3-WAY RESOURCING COLUMNS */}
                {(() => {
                  const dataAiMembers = customTeamMembers.filter((m) => m.pillar === "dataAndAi");
                  const toMembers = customTeamMembers.filter((m) => m.pillar === "transformationOffice");
                  const functionMembers = customTeamMembers.filter((m) => m.pillar === "businessFunction");
                  const totalFte = customTeamMembers.reduce((acc, m) => acc + (Number(m.fte) || 0), 0);
                  const dataAiFte = dataAiMembers.reduce((acc, m) => acc + (Number(m.fte) || 0), 0);
                  const toFte = toMembers.reduce((acc, m) => acc + (Number(m.fte) || 0), 0);
                  const functionFte = functionMembers.reduce((acc, m) => acc + (Number(m.fte) || 0), 0);

                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 1. DATA & AI TEAM */}
                        <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-2xs space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                              <div className="font-bold text-xs text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5 text-blue-700" />
                                From Data & AI Hub
                              </div>
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                Engineering
                              </span>
                            </div>

                            {dataAiMembers.length === 0 ? (
                              <div className="py-8 px-4 rounded-xl border border-dashed border-blue-200 bg-blue-50/30 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                                  <Cpu className="w-4 h-4" />
                                </div>
                                <div className="text-xs font-bold text-blue-950">No Data & AI Profiles Added</div>
                                <p className="text-[11px] text-blue-800/70 max-w-[210px] leading-snug">
                                  Select technical builders (FDE, Data Architect, MLOps, Prompt Engineer) specifically needed.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => openAddProfileModal("dataAndAi")}
                                  className="mt-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 shadow-2xs flex items-center gap-1.5 transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Profile
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2 text-xs">
                                {dataAiMembers.map((mem) => (
                                  <div
                                    key={mem.id}
                                    className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 space-y-1.5 relative group"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="font-bold text-gray-900 leading-snug">{mem.role}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveProfile(mem.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-0.5"
                                        title="Remove profile"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-[10px] font-mono font-bold text-blue-900 bg-white px-1.5 py-0.5 rounded border border-blue-200">
                                        {mem.fte} FTE
                                      </span>
                                      <span className="text-[10px] font-medium text-blue-800 bg-blue-100/70 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {mem.duration}
                                      </span>
                                    </div>
                                    {mem.responsibility && (
                                      <p className="text-[11px] text-gray-600 leading-snug">
                                        {mem.responsibility}
                                      </p>
                                    )}
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => openAddProfileModal("dataAndAi")}
                                  className="w-full py-1.5 px-3 rounded-lg border border-dashed border-blue-300 text-blue-700 hover:bg-blue-50 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Another Data & AI Profile
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 2. TRANSFORMATION OFFICE (TO) */}
                        <div className="p-4 rounded-xl bg-white border border-purple-200 shadow-2xs space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                              <div className="font-bold text-xs text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Building className="w-3.5 h-3.5 text-purple-700" />
                                From Transformation Office
                              </div>
                              <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                Change & Value
                              </span>
                            </div>

                            {toMembers.length === 0 ? (
                              <div className="py-8 px-4 rounded-xl border border-dashed border-purple-200 bg-purple-50/30 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                                  <Building className="w-4 h-4" />
                                </div>
                                <div className="text-xs font-bold text-purple-950">No TO Profiles Added</div>
                                <p className="text-[11px] text-purple-800/70 max-w-[210px] leading-snug">
                                  Select change & value leaders (AI Catalyst, Change Specialist, Value Officer, ORAI LEX).
                                </p>
                                <button
                                  type="button"
                                  onClick={() => openAddProfileModal("transformationOffice")}
                                  className="mt-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-purple-700 border border-purple-300 hover:bg-purple-50 shadow-2xs flex items-center gap-1.5 transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Profile
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2 text-xs">
                                {toMembers.map((mem) => (
                                  <div
                                    key={mem.id}
                                    className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-200 space-y-1.5 relative group"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="font-bold text-gray-900 leading-snug">{mem.role}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveProfile(mem.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-0.5"
                                        title="Remove profile"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-[10px] font-mono font-bold text-purple-900 bg-white px-1.5 py-0.5 rounded border border-purple-200">
                                        {mem.fte} FTE
                                      </span>
                                      <span className="text-[10px] font-medium text-purple-800 bg-purple-100/70 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {mem.duration}
                                      </span>
                                    </div>
                                    {mem.responsibility && (
                                      <p className="text-[11px] text-gray-600 leading-snug">
                                        {mem.responsibility}
                                      </p>
                                    )}
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => openAddProfileModal("transformationOffice")}
                                  className="w-full py-1.5 px-3 rounded-lg border border-dashed border-purple-300 text-purple-700 hover:bg-purple-50 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Another TO Profile
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 3. BUSINESS FUNCTION */}
                        <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                              <div className="font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                                From Business Function
                              </div>
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                Business PO
                              </span>
                            </div>

                            {functionMembers.length === 0 ? (
                              <div className="py-8 px-4 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/30 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                  <UserCheck className="w-4 h-4" />
                                </div>
                                <div className="text-xs font-bold text-emerald-950">No Function Profiles Added</div>
                                <p className="text-[11px] text-emerald-800/70 max-w-[210px] leading-snug">
                                  Select business stakeholders (BO/PO, Digital PO, SMEs, SteerCo Sponsor, P&C).
                                </p>
                                <button
                                  type="button"
                                  onClick={() => openAddProfileModal("businessFunction")}
                                  className="mt-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50 shadow-2xs flex items-center gap-1.5 transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Profile
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2 text-xs">
                                {functionMembers.map((mem) => (
                                  <div
                                    key={mem.id}
                                    className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1.5 relative group"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="font-bold text-gray-900 leading-snug">{mem.role}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveProfile(mem.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-0.5"
                                        title="Remove profile"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-[10px] font-mono font-bold text-emerald-900 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                                        {mem.fte} FTE
                                      </span>
                                      <span className="text-[10px] font-medium text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {mem.duration}
                                      </span>
                                    </div>
                                    {mem.responsibility && (
                                      <p className="text-[11px] text-gray-600 leading-snug">
                                        {mem.responsibility}
                                      </p>
                                    )}
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => openAddProfileModal("businessFunction")}
                                  className="w-full py-1.5 px-3 rounded-lg border border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Another Function Profile
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* LIVE RESOURCING METRICS STRIP */}
                      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-emerald-700" />
                            <span>Total Squad: <strong className="font-mono text-emerald-800">{customTeamMembers.length} Profiles</strong></span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <div className="text-gray-700">
                            Total Allocation: <strong className="font-mono text-gray-900">{totalFte.toFixed(1)} FTE</strong>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                            Data & AI: <strong className="font-mono">{dataAiFte.toFixed(1)} FTE</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-medium">
                            TO: <strong className="font-mono">{toFte.toFixed(1)} FTE</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                            Function: <strong className="font-mono">{functionFte.toFixed(1)} FTE</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              </Details>
            </div>
          )}

          {/* ADD PROFILE MODAL DIALOG */}
          {isAddProfileModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-700" />
                      Add Profile to Squad
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Select profile role, FTE commitment, and resource time required.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddProfileModalOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAddProfileSubmit} className="space-y-4">
                  {/* 1. Pillar Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                      1. Organizational Pillar:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handlePillarChange("dataAndAi")}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          profilePillar === "dataAndAi"
                            ? "bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Cpu className="w-4 h-4 text-blue-600" />
                        <span className="text-[11px]">Data & AI Hub</span>
                        <span className="text-[9px] font-normal text-blue-700">Engineering</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePillarChange("transformationOffice")}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          profilePillar === "transformationOffice"
                            ? "bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Building className="w-4 h-4 text-purple-600" />
                        <span className="text-[11px]">Transf. Office</span>
                        <span className="text-[9px] font-normal text-purple-700">Change & Value</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePillarChange("businessFunction")}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          profilePillar === "businessFunction"
                            ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-[11px]">Business Fn</span>
                        <span className="text-[9px] font-normal text-emerald-700">Business PO</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Predetermined Profile Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                      2. Profile Role (from Opella Catalog):
                    </label>
                    <select
                      value={selectedRoleName}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {PREDETERMINED_PROFILES.filter((p) => p.pillar === profilePillar).map((p) => (
                        <option key={p.role} value={p.role}>
                          {p.role} ({p.badge})
                        </option>
                      ))}
                      <option value="CUSTOM">+ Other / Custom Role...</option>
                    </select>

                    {selectedRoleName === "CUSTOM" && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Enter custom role title..."
                          value={customRoleName}
                          onChange={(e) => setCustomRoleName(e.target.value)}
                          className="w-full text-xs border border-amber-300 rounded-lg p-2.5 bg-amber-50/40 text-gray-900 focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* 3. FTE Number & 4. Duration Needed Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* FTE */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                        3. FTE Allocation Number:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="10.0"
                          value={profileFte}
                          onChange={(e) => setProfileFte(parseFloat(e.target.value) || 0.1)}
                          className="w-24 text-sm font-mono font-bold border border-gray-300 rounded-lg p-2 text-center text-gray-900 focus:ring-2 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-gray-500">FTE</span>
                      </div>
                      {/* Quick FTE Buttons */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {[0.2, 0.4, 0.5, 0.8, 1.0].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setProfileFte(val)}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                              profileFte === val
                                ? "bg-emerald-700 text-white border-emerald-700"
                                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                        4. Resource Time Needed:
                      </label>
                      <select
                        value={profileDuration}
                        onChange={(e) => setProfileDuration(e.target.value)}
                        className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500"
                      >
                        {DURATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      {profileDuration === "Custom duration..." && (
                        <input
                          type="text"
                          placeholder="e.g. 10 weeks, End of Q3..."
                          value={customDuration}
                          onChange={(e) => setCustomDuration(e.target.value)}
                          className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 mt-1"
                          required
                        />
                      )}
                    </div>
                  </div>

                  {/* 5. Key Responsibility */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                      5. Key Deliverables & Responsibilities:
                    </label>
                    <textarea
                      rows={2}
                      value={profileResponsibility}
                      onChange={(e) => setProfileResponsibility(e.target.value)}
                      placeholder="Responsibilities for this initiative..."
                      className="w-full text-xs border border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Modal Actions */}
                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsAddProfileModalOpen(false)}
                      className="px-3.5 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-opella-forest hover:bg-opella-emerald text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Profile to Squad
                    </button>
                  </div>
                </form>
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
