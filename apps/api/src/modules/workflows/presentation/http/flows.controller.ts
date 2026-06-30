import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AccessControlGrant } from '@concepta/nestjs-access-control';
import { ActionEnum } from '@concepta/nestjs-core';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StargateExecutionService } from '../../../stargate/application/stargate-execution.service';
import { ArtifactWorkspaceService, McpServerEntry } from '../../application/artifact-workspace.service';
import { ArtifactSummary } from '../../application/artifact-workspace.types';
import { PublishArtifactDto } from './dto/publish-artifact.dto';
import {
  FLOWS_ARTIFACT_RESOURCE,
  FLOWS_MCP_SERVER_RESOURCE,
} from '../../workflows.resource-key';

interface RunFlowDto {
  readonly inputs?: Record<string, unknown>;
}

/**
 * Generic drop-in runner + catalog. Any flow placed in
 * `.stargate/flows/<name>.json` with a `.stargate/ui/<name>.json` becomes:
 *   - listed at `GET /flows`
 *   - runnable at `POST /flows/<name>/run`
 *   - rendered at `GET /flows/<name>/ui`
 * No per-flow code — this is what lets Cowork ship an artifact as plain JSON.
 */
@ApiBearerAuth()
@ApiTags('flows')
@Controller('flows')
export class FlowsController {
  constructor(
    private readonly stargate: StargateExecutionService,
    private readonly artifacts: ArtifactWorkspaceService,
  ) {}

  /** Lists installed artifacts (flows that have a ui-schema), newest first. */
  @Get()
  @AccessControlGrant({ resource: FLOWS_ARTIFACT_RESOURCE, action: ActionEnum.READ })
  @ApiOkResponse({ description: 'Installed artifacts.' })
  list(): ArtifactSummary[] {
    return this.artifacts.list();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AccessControlGrant({ resource: FLOWS_ARTIFACT_RESOURCE, action: ActionEnum.CREATE })
  @ApiCreatedResponse({ description: 'Published artifact summary.' })
  publish(@Body() body: PublishArtifactDto): ArtifactSummary {
    return this.artifacts.publish(body);
  }

  @Post(':name/run')
  @HttpCode(HttpStatus.OK)
  @AccessControlGrant({ resource: FLOWS_ARTIFACT_RESOURCE, action: ActionEnum.READ })
  @ApiOkResponse({ description: 'Raw workflow execution state.' })
  async run(@Param('name') name: string, @Body() body: RunFlowDto) {
    const state = await this.stargate.runRaw(name, body?.inputs ?? {});
    if (state.status !== 'completed') {
      throw new BadGatewayException(
        `Flow "${name}" ${state.status}: ${state.errors[0]?.message ?? 'no detail'}`,
      );
    }
    return state;
  }

  @Get(':name/ui')
  @AccessControlGrant({ resource: FLOWS_ARTIFACT_RESOURCE, action: ActionEnum.READ })
  @ApiOkResponse({ description: 'UI schema for the flow.' })
  ui(@Param('name') name: string) {
    return this.artifacts.readUi(name);
  }

  @Get('mcp-servers')
  @AccessControlGrant({ resource: FLOWS_MCP_SERVER_RESOURCE, action: ActionEnum.READ })
  @ApiOkResponse({ description: 'Registered MCP servers in .stargate/mcp.json.' })
  listMcpServers() {
    return this.artifacts.listMcpServers();
  }

  @Post('mcp-servers')
  @HttpCode(HttpStatus.OK)
  @AccessControlGrant({ resource: FLOWS_MCP_SERVER_RESOURCE, action: ActionEnum.CREATE })
  @ApiOkResponse({ description: 'Register an MCP server in .stargate/mcp.json.' })
  registerMcpServer(@Body() body: McpServerEntry) {
    if (!body?.name || !body?.url) {
      throw new BadRequestException('name and url are required');
    }
    this.artifacts.registerMcpServer(body);
    return { ok: true, name: body.name };
  }
}
