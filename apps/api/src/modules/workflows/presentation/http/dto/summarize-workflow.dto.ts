import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { SummarizeWorkflowInput } from '../../../application/summarize-workflow.types';

export class SummarizeWorkflowDto implements SummarizeWorkflowInput {
  @ApiProperty({
    description: 'Text to summarize.',
    example: 'Long source text to summarize.',
    maxLength: 20000,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  text: string;
}
