import { ApiProperty } from '@nestjs/swagger';
import { BudgetWorkflowOutput } from '../../../application/budget-workflow.types';

export class BudgetResponseDto implements BudgetWorkflowOutput {
  @ApiProperty()
  readonly snapshotId!: string;

  @ApiProperty()
  readonly capturedAt!: string;

  @ApiProperty({ type: Object })
  readonly source!: BudgetWorkflowOutput['source'];

  @ApiProperty({ type: [Object] })
  readonly alerts!: BudgetWorkflowOutput['alerts'];

  @ApiProperty({ type: [Object] })
  readonly accounts!: BudgetWorkflowOutput['accounts'];
}
