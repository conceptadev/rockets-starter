import { Module } from '@nestjs/common';
import { StargateModule } from '../stargate/stargate.module';
import { ArtifactWorkspaceService } from './application/artifact-workspace.service';
import { ArtifactMcpController } from './presentation/http/artifact-mcp.controller';
import { FlowsController } from './presentation/http/flows.controller';

@Module({
  imports: [StargateModule.register({ workflows: [] })],
  controllers: [FlowsController, ArtifactMcpController],
  providers: [ArtifactWorkspaceService],
})
export class WorkflowsModule {}
