import { StargateWorkflow } from '../../../stargate/domain/stargate-workflow.interface';
import { WorkflowOutputError } from '../../../stargate/domain/stargate-errors';
import {
  BudgetWorkflowInput,
  BudgetWorkflowOutput,
} from '../budget-workflow.types';

interface BudgetWorkflowResults {
  readonly format: {
    readonly output: BudgetWorkflowOutput;
  };
}

export const budgetWorkflow: StargateWorkflow<
  BudgetWorkflowInput,
  BudgetWorkflowResults,
  BudgetWorkflowOutput
> = {
  key: 'budget',
  flow: process.env.STARGATE_BUDGET_FLOW ?? 'budget',
  description: 'Runs the installed Stargate budget flow.',

  toInputs: ({ accessToken, budgetId, requestId }) => ({
    accessToken,
    budgetId,
    requestId,
  }),

  parseResults: (results) => {
    const output = normalizeBudgetOutput(results.format?.output);

    if (!output) {
      throw new WorkflowOutputError(
        'Stargate workflow did not include results.format.output',
      );
    }

    return { format: { output } };
  },

  toOutput: ({ format }) => format.output,
};

function normalizeBudgetOutput(value: unknown): BudgetWorkflowOutput | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const output = value as Partial<BudgetWorkflowOutput>;

  if (
    typeof output.snapshotId !== 'string' ||
    typeof output.capturedAt !== 'string' ||
    !isSource(output.source) ||
    !Array.isArray(output.accounts)
  ) {
    return null;
  }

  return {
    snapshotId: output.snapshotId,
    capturedAt: output.capturedAt,
    source: output.source,
    alerts: Array.isArray(output.alerts) ? output.alerts : [],
    accounts: output.accounts.map((account) => ({
      ...account,
      durationWeeks: toNumber(account.durationWeeks) ?? 0,
      totalBudgetHours: toNumber(account.totalBudgetHours) ?? 0,
      loggedHours: toNumber(account.loggedHours) ?? 0,
      remainingHours: toNumber(account.remainingHours) ?? 0,
      utilizationPct: toNumber(account.utilizationPct) ?? 0,
      unclassifiedHours: toNumber(account.unclassifiedHours) ?? 0,
      unclassifiedPct: toNumber(account.unclassifiedPct) ?? 0,
      buckets: account.buckets.map((bucket) => ({
        ...bucket,
        budgetHours: toNumber(bucket.budgetHours) ?? 0,
        loggedHours: toNumber(bucket.loggedHours) ?? 0,
        remainingHours: toNumber(bucket.remainingHours) ?? 0,
        utilizationPct: toNumber(bucket.utilizationPct) ?? 0,
        health: bucket.health ?? 'pending',
      })),
      health: account.health ?? 'pending',
    })),
  };
}

function isSource(value: unknown): value is BudgetWorkflowOutput['source'] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const source = value as Partial<BudgetWorkflowOutput['source']>;

  return (
    typeof source.app === 'string' &&
    typeof source.report === 'string' &&
    typeof source.owner === 'string'
  );
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}
