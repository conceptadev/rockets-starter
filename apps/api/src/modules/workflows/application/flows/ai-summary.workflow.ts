import { StargateWorkflow } from '../../../stargate/domain/stargate-workflow.interface';
import { WorkflowOutputError } from '../../../stargate/domain/stargate-errors';
import {
  SummarizeWorkflowInput,
  SummarizeWorkflowOutput,
} from '../summarize-workflow.types';

interface AiSummaryWorkflowResults {
  readonly format: {
    readonly summary: string;
  };
}

export const aiSummaryWorkflow: StargateWorkflow<
  SummarizeWorkflowInput,
  AiSummaryWorkflowResults,
  SummarizeWorkflowOutput
> = {
  key: 'ai-summary',
  flow: process.env.STARGATE_AI_SUMMARY_FLOW ?? 'ai-summary',
  description:
    'Summarizes text through the installed Stargate AI summary flow.',

  toInputs: ({ text }) => ({ text }),

  parseResults: (results) => {
    const summary = results.format?.summary;

    if (typeof summary !== 'string') {
      throw new WorkflowOutputError(
        'Stargate workflow did not include results.format.summary',
      );
    }

    return { format: { summary } };
  },

  toOutput: ({ format }) => ({ summary: format.summary }),
};
