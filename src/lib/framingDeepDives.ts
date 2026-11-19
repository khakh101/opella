import {
  T1BusinessCase,
  T2BusinessCase,
  T3Canvas,
  RiskTier,
  Tier,
  DeliveryMode,
} from "@/types";

export interface ProcessReshapeStep {
  stepNumber: number;
  name: string;
  actor: string;
  duration: string;
  nature: "Manual Bottleneck" | "Automated Agentic" | "Human Oversight";
  description: string;
}

export interface ProcessReshapeData {
  useCaseId: string;
  useCaseTitle: string;
  decisionAtG2: "YES - Process Reshape Required" | "NO - Standard Automation";
  decidedBy: string;
  fourStages: {
    spotIt: string;
    decideAtG2: string;
    designIt: string;
    confirmAndEmbed: string;
  };
  asIsProcess: {
    leadTime: string;
    hopsCount: number;
    touchlessRate: string;
    costPerTransaction: string;
    keyBottlenecks: string[];
    steps: ProcessReshapeStep[];
  };
  toBeProcess: {
    leadTime: string;
    hopsCount: number;
    touchlessRate: string;
    costPerTransaction: string;
    keyInnovations: string[];
    steps: ProcessReshapeStep[];
  };
  fivePillarWorkforceScan: {
    businessActivities: {
      title: string;
      volumeAndAutomation: string;
      operationalCriticality: string;
      performanceGains: string;
      useCaseExample: string;
    };
    governanceAndRoles: {
      title: string;
      scopeAndAutonomy: string;
      newRolesNeeded: string;
      managementLine: string;
      useCaseExample: string;
    };
    skillsAndUpskilling: {
      title: string;
      targetSkills: string;
      gapTrainingPlan: string;
      knowledgePreservation: string;
      useCaseExample: string;
    };
    qualityOfWorkLife: {
      title: string;
      workloadAndStrain: string;
      purposeAndHumanValue: string;
      trustAndErgonomics: string;
      useCaseExample: string;
    };
    socialDialogueAndEthics: {
      title: string;
      employeeBodiesDialogue: string;
      transparencyAndAudit: string;
      csrAndEthicsAlignment: string;
      useCaseExample: string;
    };
  };
}

export interface PrioritizationScoring {
  useCaseId: string;
  useCaseTitle: string;
  tier: Tier;
  vcpScores: {
    valueScore: number; // Max 30
    valueNotes: string;
    strategicFitScore: number; // Max 20
    strategicFitNotes: string;
    reachAndReuseScore: number; // Max 20
    reachAndReuseNotes: string;
    feasibilityScore: number; // Max 20
    feasibilityNotes: string;
    riskAndEffortScore: number; // Max 10 (inverted: low risk = high score)
    riskAndEffortNotes: string;
    totalScore: number; // Out of 100
  };
  modeAllocation: {
    complexityScore: "High" | "Medium" | "Low";
    budgetAndOwnership: string;
    functionCapacity: "High" | "Medium" | "Low";
    recommendedMode: DeliveryMode;
    rationale: string;
  };
  capacityAllocation: {
    bucket: "60% Big Bets (T1/T2)" | "25% Fast Lane & T2 Outside Bets" | "15% Enablement & Self-Serve";
    queuePosition: number;
    totalInQueue: number;
    status: "APPROVED_IN_QUOTA" | "WAITLIST_NEXT_SLOT" | "AUTONOMOUS_DELIVERY";
    slotReleaseDate: string;
  };
}

// -------------------------------------------------------------
// 3 DETAILED ARCHETYPES
// -------------------------------------------------------------

export interface FramingExampleCase {
  id: string;
  title: string;
  tier: Tier;
  mode: DeliveryMode;
  functionName: string;
  region: string;
  budget: number;
  roiEstimate: string;
  leadSponsor: string;
  businessOwner: string;
  aiCatalyst: string;
  headlineSummary: string;

  // Charter Data
  charter: {
    descriptionMandatory: string;
    usersMandatory: string;
    estimatedValueOptional: string;
    technologyOptional: string;
    q1_bigBetOrOver1m: boolean;
    q1_explanation: string;
    q2_approvedToolsUnder50k: boolean;
    q2_explanation: string;
    q3_provenPilotOrReach: boolean;
    q3_explanation: string;
    q4_newHypothesis: boolean;
    q4_explanation: string;
    oraiChecks: {
      personalHealthData: boolean;
      autonomousDecisions: boolean;
      coreProdWriteBack: boolean;
      externalOutputNoReview: boolean;
      unapprovedSaaS: boolean;
    };
    registryReuseFound: boolean;
    registryNotes: string;
  };

  // G1 Autonomous Agent Review
  agentTriage: {
    modelUsed: string;
    evaluationTimeMs: number;
    screeningChecksPassed: string[];
    tierAssigned: Tier;
    tierRationale: string;
    comitologyAssignment: string;
    approvalForum: string;
    slaHours: string;
  };

  // Business Case
  businessCaseT1?: T1BusinessCase;
  businessCaseT2?: T2BusinessCase;
  businessCaseT3?: T3Canvas;

  // Process Reshape
  processReshape?: ProcessReshapeData;

  // Prioritization
  prioritization: PrioritizationScoring;

  // Gate G4 Mode & Squad
  g4ModeAndSquad: {
    modeSelected: DeliveryMode;
    motto: string;
    whySelected: string;
    functionSquad: { role: string; name: string; dedication: string }[];
    transformationOfficeSquad: { role: string; name: string; dedication: string }[];
    hubDataAndAiSquad: { role: string; name: string; dedication: string }[];
    goBuildVerdict: string;
    trancheReleased: string;
  };
}

export const FRAMING_USE_CASES: Record<string, FramingExampleCase> = {
  "UC-GIDE": {
    id: "UC-GIDE",
    title: "GIDE / BOWIE Procurement Agent",
    tier: "T1",
    mode: "Mode 2",
    functionName: "Procurement & GBS",
    region: "Global (14 key markets)",
    budget: 1450000,
    roiEstimate: "€3.8M net run-rate savings / 42,000 hours freed",
    leadSponsor: "Marc Lefebvre (CPO / ExCo)",
    businessOwner: "Sarah Chen (Global Head of S2P)",
    aiCatalyst: "Guillaume Roux (Procurement AI Catalyst)",
    headlineSummary:
      "Enterprise Source-to-Pay (S2P) AI Agent that autonomously reads quotes, cross-checks commercial frame agreements, validates compliance, and creates SAP Purchase Orders within 48h.",

    charter: {
      descriptionMandatory:
        "Agentic Source-to-Pay (S2P) execution. BOWIE agent automatically handles sourcing tasks, evaluates supplier quotes against commercial contracts, checks internal compliance rules, and generates SAP Purchase Orders within 48 hours instead of 7-10 business days.",
      usersMandatory:
        "1,800 Procurement buyers, category directors, and functional spenders across EULA, NA, and AMEA regions.",
      estimatedValueOptional:
        "€3.8M net run-rate EBITDA savings; 42,000 manual buyer hours repurposed into strategic supplier renegotiations; 75% touchless PO rate.",
      technologyOptional:
        "Azure GenAI (GPT-4o), LangChain Agent Orchestrator, SAP S/4HANA OData APIs, Opella IQ Procurement Semantic Taxonomy.",
      q1_bigBetOrOver1m: true,
      q1_explanation:
        "YES: Part of AmplifAI Big Bet 6 (Business Partner Process Reshapes), modifies core SAP S/4HANA P2P flows, and total multi-year investment exceeds €1m (€1.45m).",
      q2_approvedToolsUnder50k: false,
      q2_explanation: "NO: Requires complex multi-system enterprise agent orchestration.",
      q3_provenPilotOrReach: true,
      q3_explanation: "YES: Reaches 1,800 users across 3 regions and requires dedicated Hub engineering.",
      q4_newHypothesis: false,
      q4_explanation: "NO: Core strategic bet directly anchored in Butterfly Transformation roadmap.",
      oraiChecks: {
        personalHealthData: false,
        autonomousDecisions: true,
        coreProdWriteBack: true,
        externalOutputNoReview: false,
        unapprovedSaaS: false,
      },
      registryReuseFound: false,
      registryNotes:
        "Searched 217 Opella initiatives. Found legacy manual Excel macro in Iberia; no autonomous agent exists.",
    },

    agentTriage: {
      modelUsed: "OpellaGPT Charter Agent v2.4 (Gemini 1.5 Pro / GPT-4o Enterprise)",
      evaluationTimeMs: 1420,
      screeningChecksPassed: [
        "Need completeness: 100% (Mandatory description & users present)",
        "Zero duplicate collision with 217 registry entries",
        "Value-to-Cost ratio: 2.6x (>1.5x minimum threshold)",
        "Butterfly Big Bet 6 alignment verified",
        "ORAI Risk screening: Tier 2 (Medium Risk - write-back to SAP)",
      ],
      tierAssigned: "T1",
      tierRationale:
        "Classified as T1 · Transform because budget exceeds €1m (€1.45m), it reshapes core Butterfly SAP S2P workflows, and impacts >1,000 users globally.",
      comitologyAssignment:
        "Transformation SteerCo (Monthly) with CD&R Board visibility + Digital Design Authority (ADR review).",
      approvalForum: "Transformation SteerCo (Slide 37/41)",
      slaHours: "5 working days (Achieved in 1 day)",
    },

    businessCaseT1: {
      type: "T1_FULL",
      recurringItems: {
        topLineImpact: "Neutral (Internal efficiency & cost avoidance)",
        grossMarginImpact: "+€1.2M annual COGS reduction via automated tier pricing compliance",
        opexImpact: "+€2.6M recurring OpEx savings from touchless PO processing & reduced agency fees",
        workingCapitalImpact: "+€4.5M DPO optimization via automated payment terms enforcement",
        fteImpact: "42,000 hours freed (~24 FTE capacity redirected from PO entry to category negotiations)",
        fy25_30BenefitsSummary: "Cumulative €19.8M net EBITDA benefit over 5-year Butterfly horizon",
        targetPnLLine: "Procurement OpEx (Cost Center 4100) & Supply Chain COGS",
      },
      siNonStaff: {
        systemEnablers: "SAP S/4HANA OData v4 PurchaseOrder API + Coupa/Ariba contract repository connector",
        infrastructureEnablers: "Azure GenAI Platform (Kong Gateway + AI Foundry Private VNet)",
        cyberEnablers: "SOC2 Type II, ISO 27001 certified API tokens, Cyber Security Review #CY-2026-88",
        dataEnablers: "Opella IQ Semantic Layer: Material master, Vendor master, Contract master taxonomy",
        linkedInitiativeIds: "BF-S2P-04, DIG-SAP-2026, OPELLA-IQ-CORE",
      },
      resourcePeopleCosts: {
        namedInternalRoles:
          "Sarah Chen (BO, 80%), Guillaume Roux (Catalyst, 50%), Thomas Rouckout (TO Lead, 20%), Ana Vinaru (Change, 30%)",
        externalRoles: "1 Forward Deployed Engineer (FDE) + 1 Senior Data Architect via SI partner",
        dedicationPercentage: 85,
        fullyLoadedCostEstimate: "€820,000 total internal & external people build cost over 9 months",
        skillGapJustification:
          "Internal Data & AI team lacks deep agentic SAP S/4HANA write-back tooling; FDE fills the gap while reskilling internal builders.",
      },
      biNonStaff: {
        supplierSpendEstimate: "€280,000 for specialized AI Integrator sprint delivery & model token envelope",
        supplierScope: "Agentic tool calling harnesses, unit test harness, prompt caching infra",
        rfpStatus: "Supplier Selected",
      },
      projectPlanMilestones: {
        criticalPathMilestones:
          "M1: Architecture ADR & Pilot in France/Spain (W6) -> M2: G5 Scale Gate with 75% touchless POs (W12) -> M3: EULA Rollout (W20) -> M4: Global Run (W32)",
        stageGatesCadenceWeeks: 6,
        keyRisks:
          "Supplier contract OCR variance; SAP API throttle during batch runs; buyer change resistance",
        interdependencies: "SAP S/4HANA migration train; Opella IQ Procurement Taxonomy release",
        kpisTarget: "75% touchless PO rate, PO turnaround <48h (baseline 8 days), zero compliant order leakage",
      },
      dashboardSignOffs: {
        ebitdaEffect: "€3.8M recurring run-rate",
        paybackMonths: 11,
        financeSignOff: true,
        digitalSignOff: true,
        streamLeadSignOff: true,
        controlTowerSignOff: true,
      },
    },

    processReshape: {
      useCaseId: "UC-GIDE",
      useCaseTitle: "GIDE / BOWIE Procurement Agent",
      decisionAtG2: "YES - Process Reshape Required",
      decidedBy: "Thomas Rouckout (Transformation Office Lead) & Digital Design Authority",
      fourStages: {
        spotIt: "Stage 1 (Charter & Framing): Identified that manual quote ingestion and 7-tier approvals block scalability.",
        decideAtG2: "Stage 2 (Gate G2): Explicit YES in feasibility review. Does the use case change how work is done? YES - eliminates manual buyer clerical tasks.",
        designIt: "Stage 3 (Build): Business architect maps To-Be workflow with procurement team before HR impact scan.",
        confirmAndEmbed: "Stage 4 (Gate G5 & Run): Confirmed at scale gate with formal adoption plan and workforce transition plan.",
      },
      asIsProcess: {
        leadTime: "14 Business Days (Mean)",
        hopsCount: 7,
        touchlessRate: "12% (Strict catalog items only)",
        costPerTransaction: "€142 per PO",
        keyBottlenecks: [
          "Manual email PDF extraction from suppliers",
          "Paper/email cross-referencing against Master Service Agreements",
          "4 redundant sequential managerial approval clicks for standard catalog buys",
          "Manual copy-pasting of line items into SAP S/4HANA GUI",
        ],
        steps: [
          {
            stepNumber: 1,
            name: "Purchase Requisition Creation",
            actor: "Business Spender",
            duration: "Day 1",
            nature: "Manual Bottleneck",
            description: "Spender creates unstructured free-text requisition in portal.",
          },
          {
            stepNumber: 2,
            name: "Supplier Quote Request & Collection",
            actor: "Procurement Buyer",
            duration: "Days 2–5",
            nature: "Manual Bottleneck",
            description: "Buyer emails 3 suppliers, waits for PDF replies, compiles Excel comparison.",
          },
          {
            stepNumber: 3,
            name: "Contract & Rate Validation",
            actor: "Procurement Buyer",
            duration: "Days 6–7",
            nature: "Manual Bottleneck",
            description: "Buyer manually searches legal drive for master discount tiers.",
          },
          {
            stepNumber: 4,
            name: "Managerial Approval Chain",
            actor: "3 Department Heads",
            duration: "Days 8–11",
            nature: "Manual Bottleneck",
            description: "Sequential sign-off queue; often stalls in manager inboxes.",
          },
          {
            stepNumber: 5,
            name: "PO Keying in SAP S/4HANA",
            actor: "GBS Data Entry Clerk",
            duration: "Days 12–13",
            nature: "Manual Bottleneck",
            description: "Clerk re-types quote items, tax codes, and cost centers into SAP.",
          },
          {
            stepNumber: 6,
            name: "Supplier Dispatch & Confirmation",
            actor: "Buyer & Supplier",
            duration: "Day 14",
            nature: "Human Oversight",
            description: "PO PDF emailed to vendor; acknowledgment manually logged.",
          },
        ],
      },
      toBeProcess: {
        leadTime: "48 Hours (Max)",
        hopsCount: 3,
        touchlessRate: "75% of all operational purchase orders",
        costPerTransaction: "€28 per PO (80% cost reduction)",
        keyInnovations: [
          "BOWIE Agent automatically extracts and matches supplier quotes via multi-modal LLM",
          "Autonomous compliance check against Opella IQ contract repository",
          "Automated SAP PO creation via direct S/4HANA API write-back",
          "Single human-in-the-loop exception approval only if price delta >5% or value >€50k",
        ],
        steps: [
          {
            stepNumber: 1,
            name: "Guided Need Intake (OSE Front-End)",
            actor: "Business Spender + OSE Agent",
            duration: "Hour 0–2",
            nature: "Automated Agentic",
            description: "Guided conversational intake auto-classifies taxonomy and finds approved vendors.",
          },
          {
            stepNumber: 2,
            name: "BOWIE Quote Evaluation & Compliance Match",
            actor: "BOWIE Agent",
            duration: "Hour 2–6",
            nature: "Automated Agentic",
            description: "Agent parses quotes, validates discount tiers in Opella IQ, and confirms budget.",
          },
          {
            stepNumber: 3,
            name: "Exception-Based Human Review (If >€50k)",
            actor: "Category Lead (PO)",
            duration: "Hour 6–24",
            nature: "Human Oversight",
            description: "Orders <€50k auto-approved; large orders get 1-click summary card review.",
          },
          {
            stepNumber: 4,
            name: "Direct SAP PO Generation & Dispatch",
            actor: "BOWIE Agent + SAP API",
            duration: "Hour 24–48",
            nature: "Automated Agentic",
            description: "BOWIE creates official PO in SAP S/4HANA and dispatches confirmation to vendor.",
          },
        ],
      },
      fivePillarWorkforceScan: {
        businessActivities: {
          title: "1. Business Activities & Operational Criticality",
          volumeAndAutomation: "68% of manual administrative sourcing tasks substituted by agent.",
          operationalCriticality: "Refocuses procurement buyers from clerical entry to strategic category negotiations and vendor SRM.",
          performanceGains: "PO cycle time slashed from 14 days to 48 hours; cost per PO dropped from €142 to €28.",
          useCaseExample: "BOWIE agent automatically handles sourcing tasks generating SAP POs within 48 hours.",
        },
        governanceAndRoles: {
          title: "2. Governance & Organisational Roles",
          scopeAndAutonomy: "Decision rights partitioned: Full autonomy for orders <€50k meeting policy; human sign-off for outliers.",
          newRolesNeeded: "Mandates 1 dedicated Product Owner (Sarah Chen, 80%) + 1 Forward Deployed Engineer (FDE).",
          managementLine: "Management shifts to exception dashboard monitoring rather than sequential approval queues.",
          useCaseExample: "Operating model is split: OSE handles business-facing guided spend; BOWIE orchestrates buyer-facing rules.",
        },
        skillsAndUpskilling: {
          title: "3. Skills & Upskilling (Human Capital)",
          targetSkills: "Prompt engineering, agent supervision, exception triage, supplier performance analytics.",
          gapTrainingPlan: "ProcurLab 'AI Prompting' track: 4 modules + interactive playground for 300+ buyers.",
          knowledgePreservation: "Sourcing policies codified into Opella IQ knowledge graphs so expertise survives staff turnover.",
          useCaseExample: "Adoption supported by ProcurLab's 'AI Prompting' training track, upskilling teams to master AI fluency.",
        },
        qualityOfWorkLife: {
          title: "4. Quality of Work Life & Psychosocial Impact",
          workloadAndStrain: "Elimination of repetitive data transcription and chasing manager signatures.",
          purposeAndHumanValue: "Buyers regain professional pride through supplier relationship development and ESG audits.",
          trustAndErgonomics: "Explainable agent reasoning cards build trust; no 'black box' rejections.",
          useCaseExample: "Agents remove administrative strain and manual 'policy hunting', allowing users to delegate with 'no lost time'.",
        },
        socialDialogueAndEthics: {
          title: "5. Social Dialogue & Ethics (Regulatory & Culture)",
          employeeBodiesDialogue: "Early presentation to French & Spanish Works Councils (CSE); zero headcount reduction mandate.",
          transparencyAndAudit: "Complete immutable audit log of agent suggestions, human approvals, and PO revisions.",
          csrAndEthicsAlignment: "Suppliers automatically scored against Opella ESG and Decarbonization charters before PO generation.",
          useCaseExample: "GIDE embeds compliance by design, ensuring agents strictly follow governance frameworks before execution.",
        },
      },
    },

    prioritization: {
      useCaseId: "UC-GIDE",
      useCaseTitle: "GIDE / BOWIE Procurement Agent",
      tier: "T1",
      vcpScores: {
        valueScore: 28, // /30
        valueNotes: "€3.8M net run-rate EBITDA savings + €4.5M working capital improvement.",
        strategicFitScore: 20, // /20
        strategicFitNotes: "Direct anchor initiative of Big Bet 6 (Business Partner Process Reshapes).",
        reachAndReuseScore: 18, // /20
        reachAndReuseNotes: "1,800 users across 14 markets; reusable SAP agent harness.",
        feasibilityScore: 17, // /20
        feasibilityNotes: "SAP S/4HANA APIs available; data clean in Databricks gold tier.",
        riskAndEffortScore: 8, // /10
        riskAndEffortNotes: "Controlled Medium risk with Human-in-the-Loop thresholds.",
        totalScore: 91,
      },
      modeAllocation: {
        complexityScore: "High",
        budgetAndOwnership: "Central Hub envelope funded (€1.45M) with Procurement CPO sponsorship",
        functionCapacity: "Medium",
        recommendedMode: "Mode 2",
        rationale:
          "Needs deep procurement domain knowledge from Sarah's team combined with advanced Hub AI engineering and SAP integration.",
      },
      capacityAllocation: {
        bucket: "60% Big Bets (T1/T2)",
        queuePosition: 1,
        totalInQueue: 18,
        status: "APPROVED_IN_QUOTA",
        slotReleaseDate: "Immediate (Q3 Slot Confirmed)",
      },
    },

    g4ModeAndSquad: {
      modeSelected: "Mode 2",
      motto: "We ride together",
      whySelected:
        "High technical complexity (SAP write-back + LangChain) combined with high business specificity (category rules). Function leads business logic while Hub provides dedicated engineering capacity.",
      functionSquad: [
        { role: "Product Owner (BO/PO)", name: "Sarah Chen", dedication: "80% Dedicated" },
        { role: "AI Catalyst", name: "Guillaume Roux", dedication: "50% Dedicated" },
        { role: "Business Testers (x3)", name: "Iberia & France Category Leads", dedication: "20% During Sprints" },
      ],
      transformationOfficeSquad: [
        { role: "TO Program Lead", name: "Thomas Rouckout", dedication: "20% Steering" },
        { role: "Business Architect", name: "Marc Dupond (New Hire)", dedication: "50% Dedicated" },
        { role: "Change & Adoption Lead", name: "Ana Vinaru (Butterfly)", dedication: "30% Dedicated" },
      ],
      hubDataAndAiSquad: [
        { role: "Digital PO", name: "David Kim", dedication: "50% Dedicated" },
        { role: "Forward Deployed Engineer (FDE)", name: "Lucas Vance", dedication: "100% Dedicated" },
        { role: "Data / Semantic Architect", name: "Elena Rostova", dedication: "40% Dedicated" },
        { role: "AI / MLOps Engineer", name: "Karim Benali", dedication: "50% Dedicated" },
      ],
      goBuildVerdict: "APPROVED (GO BUILD)",
      trancheReleased: "Tranche 1: €450,000 released for 8-week MVP Sprint in France & Spain",
    },
  },

  "UC-IBP": {
    id: "UC-IBP",
    title: "Regional Demand Sensing & IBP Harmonizer",
    tier: "T2",
    mode: "Mode 2",
    functionName: "Supply Chain & IBP",
    region: "Europe & North America",
    budget: 650000,
    roiEstimate: "€1.8M inventory holding reduction / 35% forecast accuracy boost",
    leadSponsor: "Patrick Moreau (Chief Operations Officer)",
    businessOwner: "Mathieu Laurent (Supply Planning Lead)",
    aiCatalyst: "Claire Valette (Supply Chain AI Catalyst)",
    headlineSummary:
      "Enterprise scaling of machine learning demand sensing that harmonizes point-of-sale telemetry, warehouse orders, and promo signals into SAP IBP.",

    charter: {
      descriptionMandatory:
        "Machine learning demand forecasting linking point-of-sale signals and macro indicators into Opella IQ semantic layer to reduce inventory working capital and prevent out-of-stock events across Europe and NA.",
      usersMandatory:
        "400 Demand planners, replenishment managers, and regional supply chain directors.",
      estimatedValueOptional:
        "€1.8M inventory holding cost reduction; 35% boost in 30-day forecast accuracy; 12,000 planning hours freed.",
      technologyOptional: "Azure Databricks ML, Python Time-Series, SAP IBP APIs.",
      q1_bigBetOrOver1m: false,
      q1_explanation:
        "NO: Build cost is €650k (<€1m), does not change Butterfly core scope, though connects to Big Bet 4 as an enterprise scaling use case.",
      q2_approvedToolsUnder50k: false,
      q2_explanation: "NO: Requires custom ML time-series pipeline on Databricks.",
      q3_provenPilotOrReach: true,
      q3_explanation:
        "YES: Value proven in Spanish pilot (18% stockout reduction). Now scaling to 400 planners across 2 major regions with Hub co-funding.",
      q4_newHypothesis: false,
      q4_explanation: "NO: Core demand hypothesis already validated in MVP pilot.",
      oraiChecks: {
        personalHealthData: false,
        autonomousDecisions: false,
        coreProdWriteBack: true,
        externalOutputNoReview: false,
        unapprovedSaaS: false,
      },
      registryReuseFound: true,
      registryNotes:
        "Reuses existing Databricks ML feature store from commercial trade promotion analytics (Big Bet 3).",
    },

    agentTriage: {
      modelUsed: "OpellaGPT Charter Agent v2.4 (Gemini 1.5 Pro / GPT-4o Enterprise)",
      evaluationTimeMs: 1180,
      screeningChecksPassed: [
        "Need completeness: 100%",
        "Validated pilot evidence in Spain and France",
        "Cost envelope: €650k (Fits €200k–€1M T2 bracket)",
        "Reach: 2 regions (Europe + NA), 400 users",
        "ORAI Risk: Low-to-Medium (Operational inventory data)",
      ],
      tierAssigned: "T2",
      tierRationale:
        "Classified as T2 · Scale because value was demonstrated in a pilot, requires cross-regional scale (Europe + NA), and investment sits in the €200k–€1m range.",
      comitologyAssignment:
        "AI Portfolio Board (Fortnightly) with Program Sponsors (CDO + CFO) approval; Transformation SteerCo informed only.",
      approvalForum: "AI Portfolio Board (Slide 36/41)",
      slaHours: "5 working days (Achieved in 2 days)",
    },

    businessCaseT2: {
      type: "T2_LITE",
      problemStatement:
        "Demand planning currently relies on manual 30-day lag ERP sales orders, causing high safety stock buffers (€18M tied up) and frequent promo bullwhip spikes across European distribution centers.",
      directionalValue:
        "€1.8M annual working capital reduction, 35% higher forecast fidelity, saving ~15 hours/week per demand planner.",
      buildMode: "Do it with me",
      estimatedBuilderDays: 60,
      roughTokenConsumption:
        "Medium Databricks compute cluster + 2M tokens/month for automated anomaly narrative generation.",
      existingDataFit: {
        approvedSourcesConfirmed: true,
        dataSourcesDetails: "Kinaxis RapidResponse, SAP IBP, and Nielsen POS syndicated retail data.",
        platformType: "Existing Hub Platform",
      },
      governance: {
        namedBusinessOwner: "Mathieu Laurent (Supply Planning Lead)",
        namedAiCatalyst: "Claire Valette (Supply Chain Catalyst)",
        targetUserCount: 400,
        portfolioBoardDate: "2026-08-25 (Approved)",
      },
      oraiScreeningConfirmation: {
        riskTierConfirmed: "Low",
        mitigationsSummary:
          "Internal commercial and operational metrics only; no PII, no consumer health attributes. Human planners review all model adjustments before ERP commit.",
      },
    },

    prioritization: {
      useCaseId: "UC-IBP",
      useCaseTitle: "Regional Demand Sensing & IBP Harmonizer",
      tier: "T2",
      vcpScores: {
        valueScore: 23, // /30
        valueNotes: "€1.8M inventory reduction + €400k stockout penalty avoidance.",
        strategicFitScore: 17, // /20
        strategicFitNotes: "Strong synergy with Big Bet 4 (Forecast to Planning).",
        reachAndReuseScore: 16, // /20
        reachAndReuseNotes: "400 planners across 2 continents; reusable time-series feature store.",
        feasibilityScore: 15, // /20
        feasibilityNotes: "Pilot already completed; Databricks pipelines operational.",
        riskAndEffortScore: 7, // /10
        riskAndEffortNotes: "Medium implementation effort across 5 SAP instances.",
        totalScore: 78,
      },
      modeAllocation: {
        complexityScore: "Medium",
        budgetAndOwnership: "Co-funded: 50% Supply Chain Function Budget + 50% Hub Capacity",
        functionCapacity: "Medium",
        recommendedMode: "Mode 2",
        rationale:
          "Supply Chain planners understand seasonal inventory rules, while Data & AI Hub provides Databricks ML engineers.",
      },
      capacityAllocation: {
        bucket: "25% Fast Lane & T2 Outside Bets",
        queuePosition: 3,
        totalInQueue: 12,
        status: "APPROVED_IN_QUOTA",
        slotReleaseDate: "Confirmed Q4 Sprint Allocation",
      },
    },

    g4ModeAndSquad: {
      modeSelected: "Mode 2",
      motto: "We ride together",
      whySelected:
        "Co-delivery ensures business ownership of demand forecasts while leveraging central Databricks platform engineers.",
      functionSquad: [
        { role: "Business Owner", name: "Mathieu Laurent", dedication: "50% Dedicated" },
        { role: "AI Catalyst", name: "Claire Valette", dedication: "40% Dedicated" },
        { role: "Regional Planners (x4)", name: "EULA & NA Leads", dedication: "15% Sprint Review" },
      ],
      transformationOfficeSquad: [
        { role: "Value Office Lead", name: "Gentiane Barret", dedication: "10% Audit" },
        { role: "Change Specialist", name: "Blandine Clanet", dedication: "25% Dedicated" },
      ],
      hubDataAndAiSquad: [
        { role: "Lead Data Scientist", name: "Dr. Sandrine Leroy", dedication: "50% Dedicated" },
        { role: "Data Engineer", name: "Julien Benoit", dedication: "50% Dedicated" },
      ],
      goBuildVerdict: "APPROVED (GO BUILD)",
      trancheReleased: "Tranche 1: €220,000 released for 10-week European rollout sprint",
    },
  },

  "UC-WONKA": {
    id: "UC-WONKA",
    title: "Wonka Regulatory Claims & Packaging Compliance Validator",
    tier: "T3",
    mode: "Mode 3",
    functionName: "Science & Regulatory",
    region: "Global (R&D Hubs)",
    budget: 85000,
    roiEstimate: "60% cycle time reduction / 10-day decision SLA / €240k agency saving",
    leadSponsor: "Elena Rostova (VP Quality & Regulatory)",
    businessOwner: "Dr. Aris Thorne (Regulatory Affairs Lead)",
    aiCatalyst: "Sophie Martin (Science AI Catalyst)",
    headlineSummary:
      "Fast-lane LLM compliance validator that screens marketing packaging claims against EMA, FDA, and local country drug monographs in minutes.",

    charter: {
      descriptionMandatory:
        "Fast-lane agent that scans packaging artwork and consumer claims against regional health authority regulations (EMA, FDA, TGA) to detect non-compliant phrasing before legal submission.",
      usersMandatory:
        "85 Regulatory affairs associates, medical reviewers, and packaging graphic designers.",
      estimatedValueOptional:
        "60% reduction in label validation cycle time (from 14 days to 4 days); eliminates €240k/yr external legal agency audit spend.",
      technologyOptional: "Approved SaaS LLM tool (Wonka Engine) + Azure OpenAI GPT-4o Vision API.",
      q1_bigBetOrOver1m: false,
      q1_explanation: "NO: Spend is €85k (<€200k cap) and does not alter Butterfly core.",
      q2_approvedToolsUnder50k: false,
      q2_explanation: "NO: Slightly exceeds €50k self-serve ceiling (€85k build & pilot).",
      q3_provenPilotOrReach: false,
      q3_explanation: "NO: Early hypothesis exploration within a single regulatory function.",
      q4_newHypothesis: true,
      q4_explanation:
        "YES: New agile hypothesis to test if multimodal LLM can accurately spot medical claim phrasing discrepancies.",
      oraiChecks: {
        personalHealthData: false,
        autonomousDecisions: false,
        coreProdWriteBack: false,
        externalOutputNoReview: false,
        unapprovedSaaS: false,
      },
      registryReuseFound: false,
      registryNotes: "First application of multimodal vision LLM for packaging claim verification.",
    },

    agentTriage: {
      modelUsed: "OpellaGPT Charter Agent v2.4 (Gemini 1.5 Pro / GPT-4o Enterprise)",
      evaluationTimeMs: 890,
      screeningChecksPassed: [
        "Need completeness: 100%",
        "Budget €85k is well below the €200k Fast Lane ceiling",
        "Single function scope (Science & Regulatory)",
        "Zero connection to core production write-back systems",
        "Standard ORAI Low Risk classification",
      ],
      tierAssigned: "T3",
      tierRationale:
        "Classified as T3 · Fast Lane because budget is under €200k (€85k), touches one single function, and explores a rapid fail-fast value hypothesis with a 10-day SLA.",
      comitologyAssignment:
        "AI Portfolio Board (Bi-weekly) is the ONLY forum seen (Slide 39/41). Zero SteerCo involvement.",
      approvalForum: "AI Portfolio Board (Slide 39)",
      slaHours: "10-day SLA from canvas submission to GO BUILD decision",
    },

    businessCaseT3: {
      type: "T3_CANVAS",
      summaryAndHypothesis:
        "Hypothesis: Providing regulatory associates with a multimodal LLM assistant will cut packaging compliance review turnaround from 14 days to 4 days while maintaining >99% regulatory accuracy.",
      kpi1: "Review Turnaround Time: Slashed from 14 business days to <4 business days",
      kpi2: "Compliance First-Time-Right Rate: >98% accuracy on local country monographs",
      kpi3: "Annual External Legal Review Cost: €240,000 saved by filtering obvious claims internally",
      baselineMetrics:
        "Current baseline: 14 days per pack artwork review; €1,200 external legal review fee per SKU.",
      sprintDurationWeeks: 6,
      killOrScaleDate: "2026-10-15 (6-Week Fail-Fast Sprint Gate)",
      budgetEnvelope: 85000,
      deliveryMode: "Enable me",
      assignedBuilderOrCatalyst: "Sophie Martin (Science AI Catalyst & Citizen Builder)",
      registryReuseCheckCompleted: true,
      reusableComponentsIdentified: "Azure OpenAI GPT-4o Vision API from central tenant.",
    },

    prioritization: {
      useCaseId: "UC-WONKA",
      useCaseTitle: "Wonka Regulatory Claims & Packaging Compliance Validator",
      tier: "T3",
      vcpScores: {
        valueScore: 24, // /30
        valueNotes: "€240k immediate agency cost avoidance + dramatic agility speedup.",
        strategicFitScore: 16, // /20
        strategicFitNotes: "Supports R&D digital transformation and compliance speed.",
        reachAndReuseScore: 14, // /20
        reachAndReuseNotes: "85 regulatory associates globally; reusable vision prompt templates.",
        feasibilityScore: 19, // /20
        feasibilityNotes: "Ready-to-use SaaS / Azure vision model; zero core IT dependencies.",
        riskAndEffortScore: 9, // /10
        riskAndEffortNotes: "Extremely low technical risk; all outputs reviewed by certified humans.",
        totalScore: 82,
      },
      modeAllocation: {
        complexityScore: "Low",
        budgetAndOwnership: "Funded from ring-fenced AmplifAI envelope (€85k)",
        functionCapacity: "High",
        recommendedMode: "Mode 3",
        rationale:
          "Function is autonomous: citizen AI builders build the prompts and workflows, while Data & AI Hub provides platform guardrails.",
      },
      capacityAllocation: {
        bucket: "25% Fast Lane & T2 Outside Bets",
        queuePosition: 2,
        totalInQueue: 14,
        status: "APPROVED_IN_QUOTA",
        slotReleaseDate: "Immediate 6-Week Sprint Slot",
      },
    },

    g4ModeAndSquad: {
      modeSelected: "Mode 3",
      motto: "We give you the right bike and the map",
      whySelected:
        "Enable Me mode: Science & Regulatory team builds autonomously using approved low-code/prompt tools. Hub sets security fences, token caps, and audits without consuming central developer sprints.",
      functionSquad: [
        { role: "Business Owner", name: "Dr. Aris Thorne", dedication: "30% Dedicated" },
        { role: "AI Builder / Catalyst", name: "Sophie Martin", dedication: "60% Dedicated" },
        { role: "Regulatory Reviewer", name: "Jean-Paul Sartre (Medical Affairs)", dedication: "15% Testing" },
      ],
      transformationOfficeSquad: [
        { role: "Fast Lane Coach", name: "Blandine Clanet", dedication: "10% Support" },
      ],
      hubDataAndAiSquad: [
        { role: "Platform Security & Guardrail Lead", name: "Alexandre Dumas", dedication: "Auditing & Sandbox Provisioning" },
      ],
      goBuildVerdict: "APPROVED (GO BUILD)",
      trancheReleased: "Sprint Envelope: €85,000 released from AmplifAI Fast Lane Fund",
    },
  },
};
