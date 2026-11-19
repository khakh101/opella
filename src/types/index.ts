export type Tier = "T1" | "T2" | "T3" | "Self-Serve";

export type DeliveryMode = "Mode 1" | "Mode 2" | "Mode 3" | "Self-Service AI";

export type RiskTier = "Low" | "Medium" | "High";

export type GateId = "G1" | "G2" | "G3" | "G4" | "G5" | "G6";

export type GateStatus = "PENDING" | "PASSED" | "FAILED" | "SKIPPED" | "IN_REVIEW";

export interface GateSubmissionData {
  summary: string;
  submittedBy: string;
  submittedAt: string;
  keyInputsFilled: Record<string, string>;
  metricsOrCosts?: string;
  artifactsAttached?: string[];
}

export interface GateDecisionRecord {
  verdict: "APPROVED" | "CONDITIONALLY_APPROVED" | "RE_SCOPE" | "STOP" | "IN_REVIEW" | "APPROVED (GO BUILD)";
  decisionTitle: string;
  decidedBy: string;
  decidedAt: string;
  forum: string;
  subsequentAction: string;
  conditionsOrFeedback: string[];
}

export interface SquadRole {
  role: string;
  allocation: string; // e.g. "1.0 FTE Dedicated", "0.5 FTE"
  responsibility: string;
  profileType?: "Tech" | "Business" | "Governance" | "Change";
}

export interface ThreeWayTeamDisposition {
  dataAndAiTeam: SquadRole[];
  transformationOffice: SquadRole[];
  businessFunction: SquadRole[];
}

export interface ModeDeepDive {
  mode: DeliveryMode;
  title: string;
  motto: string;
  ownershipSplit: string;
  whySelected: {
    primaryDrivers: string[];
    technicalComplexityProfile: string;
    functionTechCapabilityRequired: string;
    platformFit: string;
    bestFitScenarios: string;
  };
  teamDisposition: ThreeWayTeamDisposition;
}

export interface TierDeepDive {
  tier: Tier;
  name: string;
  subtitle: string;
  threshold: string;
  whatItMeans: string;
  decisionForUseCase: string;
  committeesAndComitology: {
    governingBodies: string[];
    cadence: string;
    decisionRights: string;
    primaryForum: string;
  };
  teamsAndResourcing: {
    squadModel: string;
    dataAndAiAllocation: string;
    toAllocation: string;
    businessFunctionCommitment: string;
  };
  deliveryAndTracking: {
    businessCaseDossier: string;
    trackingTool: string;
    fundingMechanism: string;
    valueRealizationAudit: string;
    sprintDuration: string;
  };
}

export interface GateDetail {
  id: GateId;
  name: string;
  phase: "Framing" | "Build MVP" | "Pre-scale" | "Scale" | "Run";
  decision: string;
  type: "AUTOMATIC" | "MANUAL";
  approver: string;
  forum: string;
  sla: string;
  status: GateStatus;
  updatedAt?: string;
  feedback?: string;
  multiDimensionalReview: {
    value: string;
    complexity: string;
    risk: string;
    adoption: string;
  };
  submissionData?: GateSubmissionData;
  decisionRecord?: GateDecisionRecord;
}

export type BigBetId =
  | "BET_1"
  | "BET_2"
  | "BET_3"
  | "BET_4"
  | "BET_5"
  | "BET_6";

export interface BigBetInfo {
  id: BigBetId;
  name: string;
  leadStream: string;
  confidence: string;
  description: string;
}

export interface IntakeAnswers {
  // 4 Intake Questions (Slide 35)
  q1_bigBetOrOver1m: boolean;
  q2_approvedToolsUnder50k: boolean;
  q3_provenPilotOrReach: boolean;
  q4_newHypothesis: boolean;

  // Additional context for routing
  initiativeTitle: string;
  description: string; // MANDATORY: Description of the use case
  targetUserGroupDescription: string; // MANDATORY: Who are the users
  estimatedValueDescription?: string; // NOT MANDATORY: Estimated value
  technologyProposed?: string; // NOT MANDATORY: Which technology to use

  functionName: string; // M&S, Science, Finance, GBS, Procurement, etc.
  region: string; // Global, NA, EULA, AMEA
  businessOwnerName: string;
  businessOwnerEmail: string;
  aiCatalystName?: string;
  estimatedCost: number; // in Euros
  targetUserCount: number;
  mappedBigBet?: BigBetId;

  // 5 ORAI Risk screening questions
  risk_personalHealthData: boolean;
  risk_autonomousDecisions: boolean;
  risk_coreProdWriteBack: boolean;
  risk_externalOutputNoReview: boolean;
  risk_unapprovedSaaSOrCustomModel: boolean;

  // Mode Selection Preferences
  techComplexity: "Low" | "Medium" | "High";
  functionTechCapacity: "None" | "Medium" | "High";
  fundingSource: "Central Hub" | "Co-funded" | "Function Budget";
}

export interface T1BusinessCase {
  type: "T1_FULL";
  recurringItems: {
    topLineImpact: string;
    grossMarginImpact: string;
    opexImpact: string;
    workingCapitalImpact: string;
    fteImpact: string;
    fy25_30BenefitsSummary: string;
    targetPnLLine: string;
  };
  siNonStaff: {
    systemEnablers: string;
    infrastructureEnablers: string;
    cyberEnablers: string;
    dataEnablers: string;
    linkedInitiativeIds: string;
  };
  resourcePeopleCosts: {
    namedInternalRoles: string;
    externalRoles: string;
    dedicationPercentage: number;
    fullyLoadedCostEstimate: string;
    skillGapJustification: string;
  };
  biNonStaff: {
    supplierSpendEstimate: string;
    supplierScope: string;
    rfpStatus: "Not Started" | "Drafted" | "RFP Issued" | "Supplier Selected";
  };
  projectPlanMilestones: {
    criticalPathMilestones: string;
    stageGatesCadenceWeeks: number;
    keyRisks: string;
    interdependencies: string;
    kpisTarget: string;
  };
  dashboardSignOffs: {
    ebitdaEffect: string;
    paybackMonths: number;
    financeSignOff: boolean;
    digitalSignOff: boolean;
    streamLeadSignOff: boolean;
    controlTowerSignOff: boolean;
  };
}

export interface T2BusinessCase {
  type: "T2_LITE";
  problemStatement: string;
  directionalValue: string; // hours saved/week or speed increase
  buildMode: "Enable me" | "Do it with me";
  estimatedBuilderDays: number;
  roughTokenConsumption: string;
  existingDataFit: {
    approvedSourcesConfirmed: boolean;
    dataSourcesDetails: string;
    platformType: "Low-Code/No-Code" | "Existing Hub Platform" | "SaaS Integration";
  };
  governance: {
    namedBusinessOwner: string;
    namedAiCatalyst: string;
    targetUserCount: number;
    portfolioBoardDate: string;
  };
  oraiScreeningConfirmation: {
    riskTierConfirmed: RiskTier;
    mitigationsSummary: string;
  };
}

export interface T3Canvas {
  type: "T3_CANVAS";
  summaryAndHypothesis: string;
  kpi1: string;
  kpi2: string;
  kpi3: string;
  baselineMetrics: string;
  sprintDurationWeeks: 6 | 8;
  killOrScaleDate: string;
  budgetEnvelope: number; // <= 200,000 EUR
  deliveryMode: "Do it with me" | "Enable me";
  assignedBuilderOrCatalyst: string;
  registryReuseCheckCompleted: boolean;
  reusableComponentsIdentified: string;
}

export interface SelfServeRegistryEntry {
  type: "SELF_SERVE";
  agentOrToolName: string;
  purposeSummary: string;
  approvedToolUsed: "Copilot Studio" | "Opella GPT" | "Power Automate" | "Approved SaaS AI" | "Other Approved";
  targetUserGroup: string;
  userCount: number; // usually < 50
  annualTokenCostEstimate: number; // < 50,000 EUR
  guardrailsConfirmed: {
    noPersonalOrHealthData: boolean;
    noProdSystemConnection: boolean;
    noExternalSharingWithoutReview: boolean;
    autoExpiryAndCostCapsAccepted: boolean;
    listedInRegistry: boolean;
  };
  functionHeadApprovalReceived: boolean;
}

export type BusinessCaseData =
  | T1BusinessCase
  | T2BusinessCase
  | T3Canvas
  | SelfServeRegistryEntry;

export interface UseCase {
  id: string;
  title: string;
  description: string;
  functionName: string;
  region: string;
  owner: string;
  sponsor: string;
  tier: Tier;
  mode: DeliveryMode;
  riskTier: RiskTier;
  intakeAnswers: IntakeAnswers;
  businessCase?: BusinessCaseData;
  gates: Record<GateId, GateDetail>;
  currentGate: GateId;
  status: "DRAFT" | "FRAMING" | "BUILD_MVP" | "PRE_SCALE" | "SCALED" | "RUN" | "RETIRED" | "PAUSED";
  budget: number;
  roiEstimate: string;
  createdAt: string;
  updatedAt: string;
}
