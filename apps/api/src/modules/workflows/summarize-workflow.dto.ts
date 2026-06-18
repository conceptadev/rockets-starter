import { IsString, MaxLength, MinLength } from 'class-validator';

export class SummarizeWorkflowDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  text: string;
}
