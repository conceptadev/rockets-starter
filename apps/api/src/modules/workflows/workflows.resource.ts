import { defineModuleResource } from '@bitwild/rockets';
import { StargateModule } from '../stargate/stargate.module';

export const workflowsResource = defineModuleResource({
  imports: [StargateModule.register({ workflows: [] })],
  controllers: [],
});
