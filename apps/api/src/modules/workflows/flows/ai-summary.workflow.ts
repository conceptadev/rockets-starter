import { BadGatewayException } from '@nestjs/common';
import { SummarizeResponseDto } from '../summarize-response.dto';
import { SummarizeWorkflowDto } from '../summarize-workflow.dto';
import { WorkflowDefinition } from '../workflow-definition.interface';

export const aiSummaryWorkflow: WorkflowDefinition<
  SummarizeWorkflowDto,
  SummarizeResponseDto
> = {
  flow: process.env.STARGATE_AI_SUMMARY_FLOW ?? 'ai-summary',

  toInputs: ({ text }) => ({ text }),

  toOutput: (results) => {
    const summary = results.format?.summary;

    if (typeof summary !== 'string') {
      throw new BadGatewayException(
        'Stargate workflow did not include results.format.summary',
      );
    }

    return { summary };
  },
};
