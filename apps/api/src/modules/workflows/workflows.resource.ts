import { defineModuleResource } from '@bitwild/rockets';
import { StargateModule } from '../stargate/stargate.module';
import { ArtifactRecordsService } from './application/artifact-records.service';
import { ArtifactSyncService } from './application/artifact-sync.service';
import { ArtifactWorkspaceService } from './application/artifact-workspace.service';
import { ArtifactRecordEntity } from './infrastructure/artifact-record.entity';
import { ArtifactMcpController } from './presentation/http/artifact-mcp.controller';
import { FlowsController } from './presentation/http/flows.controller';
import { RecordsController } from './presentation/http/records.controller';
import { ARTIFACT_RECORD_ENTITY_KEY } from './workflows.resource-key';

export const workflowsResource = defineModuleResource({
  entities: [{ key: ARTIFACT_RECORD_ENTITY_KEY, entity: ArtifactRecordEntity }],
  imports: [StargateModule.register({ workflows: [] })],
  controllers: [FlowsController, ArtifactMcpController, RecordsController],
  providers: [
    ArtifactWorkspaceService,
    ArtifactRecordsService,
    ArtifactSyncService,
  ],
});
