export interface BudgetWorkflowInput {
  readonly accessToken?: string;
  readonly budgetId?: string;
  readonly requestId?: string;
}

export interface BudgetWorkflowOutput {
  readonly snapshotId: string;
  readonly capturedAt: string;
  readonly source: BudgetSource;
  readonly alerts: readonly BudgetAlert[];
  readonly accounts: readonly BudgetAccount[];
}

export interface BudgetSource {
  readonly app: string;
  readonly report: string;
  readonly owner: string;
}

export interface BudgetAccount {
  readonly projectId: string;
  readonly sprintId: string;
  readonly name: string;
  readonly cycle: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly durationWeeks: number;
  readonly totalBudgetHours: number;
  readonly loggedHours: number;
  readonly remainingHours: number;
  readonly utilizationPct: number;
  readonly unclassifiedHours: number;
  readonly unclassifiedPct: number;
  readonly health: BudgetHealth;
  readonly buckets: readonly BudgetBucket[];
}

export interface BudgetBucket {
  readonly key: string;
  readonly label: string;
  readonly budgetHours: number;
  readonly loggedHours: number;
  readonly remainingHours: number;
  readonly utilizationPct: number;
  readonly health: BudgetHealth;
}

export type BudgetHealth = 'green' | 'amber' | 'red' | 'pending';

export interface BudgetAlert {
  readonly id: string;
  readonly accountName: string;
  readonly bucketKey?: string;
  readonly severity: 'info' | 'warning' | 'critical';
  readonly message: string;
}

export interface FeatureEstimateWorkflowInput {
  readonly featureTitle: string;
  readonly featureDescription: string;
  readonly budgetAvailableHours: number;
  readonly accounts: readonly BudgetAccount[];
}

export interface FeatureEstimateWorkflowOutput {
  readonly featureTitle: string;
  readonly estimatedHours: number;
  readonly confidence: 'low' | 'medium' | 'high';
  readonly canFitBudget: boolean;
  readonly budgetAvailableHours: number;
  readonly codeAnalysis: {
    readonly touchedAreas: readonly string[];
    readonly riskLevel: 'low' | 'medium' | 'high';
    readonly notes: readonly string[];
  };
  readonly recommendation: string;
}
