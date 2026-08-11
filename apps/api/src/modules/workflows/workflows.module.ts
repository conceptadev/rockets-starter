import { Module } from '@nestjs/common';
import { StargateModule } from '../stargate/stargate.module';
import { ArtifactWorkspaceService } from './application/artifact-workspace.service';
import { aiSummaryWorkflow } from './application/flows/ai-summary.workflow';
import { ArtifactMcpController } from './presentation/http/artifact-mcp.controller';
import { FlowsController } from './presentation/http/flows.controller';
import { WorkflowsController } from './presentation/http/workflows.controller';

@Module({
  imports: [
    StargateModule.register({
      workflows: [aiSummaryWorkflow],
    }),
  ],
  controllers: [WorkflowsController, FlowsController, ArtifactMcpController],
  providers: [ArtifactWorkspaceService],
})
export class WorkflowsModule {}
