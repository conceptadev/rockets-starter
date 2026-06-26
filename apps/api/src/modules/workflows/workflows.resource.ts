import { defineModuleResource } from '@bitwild/rockets';
import { StargateModule } from '../stargate/stargate.module';
import { aiSummaryWorkflow } from './application/flows/ai-summary.workflow';
import { budgetWorkflow } from './application/flows/budget.workflow';
import { WorkflowsController } from './presentation/http/workflows.controller';

export const workflowsResource = defineModuleResource({
  imports: [
    StargateModule.register({
      workflows: [aiSummaryWorkflow, budgetWorkflow],
    }),
  ],
  controllers: [WorkflowsController],
});
