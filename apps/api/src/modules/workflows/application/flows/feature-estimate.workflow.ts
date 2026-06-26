import { StargateWorkflow } from '../../../stargate/domain/stargate-workflow.interface';
import { WorkflowOutputError } from '../../../stargate/domain/stargate-errors';
import {
  FeatureEstimateWorkflowInput,
  FeatureEstimateWorkflowOutput,
} from '../budget-workflow.types';

interface FeatureEstimateWorkflowResults {
  readonly format: {
    readonly output: FeatureEstimateWorkflowOutput;
  };
}

export const featureEstimateWorkflow: StargateWorkflow<
  FeatureEstimateWorkflowInput,
  FeatureEstimateWorkflowResults,
  FeatureEstimateWorkflowOutput
> = {
  key: 'feature-estimate',
  flow: process.env.STARGATE_FEATURE_ESTIMATE_FLOW ?? 'feature-estimate',
  description: 'Simulates code analysis and feature effort estimation.',

  toInputs: ({
    featureTitle,
    featureDescription,
    budgetAvailableHours,
    accounts,
  }) => ({
    featureTitle,
    featureDescription,
    budgetAvailableHours,
    accounts,
  }),

  parseResults: (results) => {
    const output = normalizeFeatureEstimateOutput(results.format?.output);

    if (!output) {
      throw new WorkflowOutputError(
        'Stargate workflow did not include results.format.output',
      );
    }

    return { format: { output } };
  },

  toOutput: ({ format }) => format.output,
};

function normalizeFeatureEstimateOutput(
  value: unknown,
): FeatureEstimateWorkflowOutput | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const output = value as Partial<FeatureEstimateWorkflowOutput>;
  const estimatedHours = toNumber(output.estimatedHours);
  const budgetAvailableHours = toNumber(output.budgetAvailableHours);

  if (
    typeof output.featureTitle !== 'string' ||
    estimatedHours === null ||
    budgetAvailableHours === null ||
    typeof output.recommendation !== 'string' ||
    !output.codeAnalysis
  ) {
    return null;
  }

  return {
    featureTitle: output.featureTitle,
    estimatedHours,
    confidence: output.confidence ?? 'medium',
    canFitBudget: toBoolean(output.canFitBudget),
    budgetAvailableHours,
    codeAnalysis: output.codeAnalysis,
    recommendation: output.recommendation,
  };
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

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  return value === 'true';
}
