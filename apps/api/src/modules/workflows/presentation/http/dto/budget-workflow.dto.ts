import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BudgetWorkflowDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly budgetId?: string;
}
