import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StargateModule } from '../stargate/stargate.module';
import { budgetWorkflow } from '../workflows/application/flows/budget.workflow';
import { featureEstimateWorkflow } from '../workflows/application/flows/feature-estimate.workflow';
import { zohoTasksWorkflow } from '../workflows/application/flows/zoho-tasks.workflow';
import { BudgetService } from './application/budget.service';
import { BudgetSnapshotEntity } from './infrastructure/budget-snapshot.entity';
import { FeatureEstimateEntity } from './infrastructure/feature-estimate.entity';
import { ZohoTaskEntity } from './infrastructure/zoho-task.entity';
import { BudgetController } from './presentation/http/budget.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BudgetSnapshotEntity,
      FeatureEstimateEntity,
      ZohoTaskEntity,
    ]),
    StargateModule.register({
      workflows: [budgetWorkflow, zohoTasksWorkflow, featureEstimateWorkflow],
    }),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
