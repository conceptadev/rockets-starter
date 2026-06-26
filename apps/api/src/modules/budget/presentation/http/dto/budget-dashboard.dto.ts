import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BudgetDashboard,
  BudgetSnapshot,
  FeatureEstimate,
} from '../../../application/budget.types';

export class BudgetDashboardDto implements BudgetDashboard {
  @ApiPropertyOptional({ type: Object })
  readonly snapshot!: BudgetSnapshot | null;

  @ApiProperty({ type: [Object] })
  readonly tasks!: readonly BudgetDashboard['tasks'][number][];

  @ApiProperty({ type: [Object] })
  readonly estimates!: readonly FeatureEstimate[];
}
