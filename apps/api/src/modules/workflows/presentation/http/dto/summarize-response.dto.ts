import { ApiProperty } from '@nestjs/swagger';
import { SummarizeWorkflowOutput } from '../../../application/summarize-workflow.types';

export class SummarizeResponseDto implements SummarizeWorkflowOutput {
  @ApiProperty({
    description: 'Model-generated summary of the submitted text.',
    example: 'A concise summary of the original content.',
  })
  readonly summary: string;
}
