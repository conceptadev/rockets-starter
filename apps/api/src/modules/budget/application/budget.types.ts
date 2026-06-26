import {
  BudgetAccount,
  BudgetAlert,
  BudgetSource,
  FeatureEstimateWorkflowOutput,
} from '../../workflows/application/budget-workflow.types';
import { ZohoTask } from '../../workflows/application/zoho-tasks-workflow.types';

export interface BudgetAccountCapacity extends BudgetAccount {
  readonly allocatedHours: number;
  readonly availableHours: number;
}

export interface BudgetSnapshot {
  readonly id: string;
  readonly snapshotId: string;
  readonly capturedAt: string;
  readonly source: BudgetSource;
  readonly syncAgeHours: number;
  readonly stale: boolean;
  readonly alerts: readonly BudgetAlert[];
  readonly totalBudgetHours: number;
  readonly accounts: readonly BudgetAccountCapacity[];
}

export interface FeatureEstimate {
  readonly id: string;
  readonly projectId: string;
  readonly featureTitle: string;
  readonly featureDescription: string;
  readonly estimatedHours: number;
  readonly confidence: FeatureEstimateWorkflowOutput['confidence'];
  readonly canFitBudget: boolean;
  readonly budgetAvailableHours: number;
  readonly codeAnalysis: FeatureEstimateWorkflowOutput['codeAnalysis'];
  readonly recommendation: string;
  readonly dateCreated: string;
}

export interface BudgetDashboard {
  readonly snapshot: BudgetSnapshot | null;
  readonly tasks: readonly ZohoTask[];
  readonly estimates: readonly FeatureEstimate[];
}
