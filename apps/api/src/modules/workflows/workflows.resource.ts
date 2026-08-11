import { defineModuleResource } from '@concepta/rockets';
import { WorkflowsModule } from './workflows.module';

export const workflowsResource = defineModuleResource({
  imports: [WorkflowsModule],
});
